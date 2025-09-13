"""
ROI Prediction Model for Yandex Direct Campaigns
Predicts campaign ROI based on historical data and current trends
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import logging

logger = logging.getLogger(__name__)

class ROIPredictor:
    """
    Machine Learning model for predicting campaign ROI
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = []
        self.is_trained = False
        
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Prepare features for training/prediction
        """
        features = df.copy()
        
        # Time-based features
        features['hour'] = pd.to_datetime(features['date']).dt.hour
        features['day_of_week'] = pd.to_datetime(features['date']).dt.dayofweek
        features['month'] = pd.to_datetime(features['date']).dt.month
        features['is_weekend'] = features['day_of_week'].isin([5, 6]).astype(int)
        
        # Campaign performance features
        features['ctr'] = features['clicks'] / features['impressions'].replace(0, 1)
        features['cpc'] = features['cost'] / features['clicks'].replace(0, 1)
        features['conversion_rate'] = features['conversions'] / features['clicks'].replace(0, 1)
        
        # Historical averages (rolling windows)
        for window in [7, 14, 30]:
            features[f'avg_cost_{window}d'] = features.groupby('campaign_id')['cost'].rolling(window).mean().values
            features[f'avg_clicks_{window}d'] = features.groupby('campaign_id')['clicks'].rolling(window).mean().values
            features[f'avg_ctr_{window}d'] = features.groupby('campaign_id')['ctr'].rolling(window).mean().values
            
        # Categorical encoding
        categorical_columns = ['campaign_type', 'campaign_status', 'day_of_week']
        for col in categorical_columns:
            if col in features.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    features[f'{col}_encoded'] = self.label_encoders[col].fit_transform(features[col].astype(str))
                else:
                    features[f'{col}_encoded'] = self.label_encoders[col].transform(features[col].astype(str))
        
        # Remove original categorical columns
        features = features.select_dtypes(include=[np.number])
        
        # Handle missing values
        features = features.fillna(features.median())
        
        return features
    
    def train(self, training_data: pd.DataFrame, target_column: str = 'roi') -> Dict:
        """
        Train the ROI prediction model
        """
        logger.info("Starting ROI model training...")
        
        # Prepare features
        features = self.prepare_features(training_data)
        
        # Separate features and target
        X = features.drop(columns=[target_column] if target_column in features.columns else [])
        y = training_data[target_column]
        
        # Store feature columns for later use
        self.feature_columns = X.columns.tolist()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=None
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train ensemble model
        models = {
            'random_forest': RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                random_state=42
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            )
        }
        
        best_score = -np.inf
        best_model = None
        
        for name, model in models.items():
            # Cross-validation
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
            avg_score = cv_scores.mean()
            
            logger.info(f"{name} CV R² Score: {avg_score:.4f} (+/- {cv_scores.std() * 2:.4f})")
            
            if avg_score > best_score:
                best_score = avg_score
                best_model = model
        
        # Train best model
        self.model = best_model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate on test set
        y_pred = self.model.predict(X_test_scaled)
        
        metrics = {
            'r2_score': r2_score(y_test, y_pred),
            'mae': mean_absolute_error(y_test, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
            'cv_score': best_score,
            'training_samples': len(X_train),
            'test_samples': len(X_test)
        }
        
        self.is_trained = True
        
        logger.info(f"Model training completed. R² Score: {metrics['r2_score']:.4f}")
        
        return metrics
    
    def predict(self, data: pd.DataFrame) -> np.ndarray:
        """
        Predict ROI for given campaigns
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare features
        features = self.prepare_features(data)
        
        # Ensure same feature columns as training
        missing_cols = set(self.feature_columns) - set(features.columns)
        for col in missing_cols:
            features[col] = 0
            
        features = features[self.feature_columns]
        
        # Scale features
        features_scaled = self.scaler.transform(features)
        
        # Make predictions
        predictions = self.model.predict(features_scaled)
        
        return predictions
    
    def get_feature_importance(self) -> pd.DataFrame:
        """
        Get feature importance for interpretation
        """
        if not self.is_trained:
            raise ValueError("Model must be trained first")
        
        importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return importance
    
    def save_model(self, filepath: str) -> None:
        """
        Save trained model to disk
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str) -> None:
        """
        Load trained model from disk
        """
        model_data = joblib.load(filepath)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_columns = model_data['feature_columns']
        self.is_trained = model_data['is_trained']
        
        logger.info(f"Model loaded from {filepath}")

class CampaignOptimizer:
    """
    AI-powered campaign optimization recommendations
    """
    
    def __init__(self, roi_predictor: ROIPredictor):
        self.roi_predictor = roi_predictor
        
    def optimize_bids(self, 
                     campaign_data: pd.DataFrame,
                     target_roi: float,
                     max_bid_change: float = 0.2) -> List[Dict]:
        """
        Generate bid optimization recommendations
        """
        recommendations = []
        
        # Current predictions
        current_roi = self.roi_predictor.predict(campaign_data)
        
        # Test different bid scenarios
        for idx, row in campaign_data.iterrows():
            current_bid = row.get('current_bid', 0)
            
            # Test bid increases and decreases
            bid_changes = np.arange(-max_bid_change, max_bid_change + 0.05, 0.05)
            
            best_bid = current_bid
            best_roi = current_roi[idx]
            
            for change in bid_changes:
                new_bid = current_bid * (1 + change)
                
                # Create modified data for prediction
                modified_data = campaign_data.copy()
                modified_data.loc[idx, 'current_bid'] = new_bid
                
                predicted_roi = self.roi_predictor.predict(modified_data.iloc[[idx]])[0]
                
                if predicted_roi > best_roi and predicted_roi >= target_roi:
                    best_roi = predicted_roi
                    best_bid = new_bid
            
            if best_bid != current_bid:
                recommendations.append({
                    'campaign_id': row['campaign_id'],
                    'keyword_id': row.get('keyword_id'),
                    'current_bid': current_bid,
                    'recommended_bid': best_bid,
                    'bid_change': (best_bid - current_bid) / current_bid,
                    'current_roi': current_roi[idx],
                    'predicted_roi': best_roi,
                    'roi_improvement': best_roi - current_roi[idx],
                    'confidence': 0.8  # This could be calculated based on model uncertainty
                })
        
        return sorted(recommendations, key=lambda x: x['roi_improvement'], reverse=True)
    
    def identify_underperforming_keywords(self, 
                                        keyword_data: pd.DataFrame,
                                        roi_threshold: float = 1.0) -> List[Dict]:
        """
        Identify keywords that are underperforming
        """
        underperforming = []
        
        predictions = self.roi_predictor.predict(keyword_data)
        
        for idx, (_, row) in enumerate(keyword_data.iterrows()):
            predicted_roi = predictions[idx]
            
            if predicted_roi < roi_threshold:
                underperforming.append({
                    'keyword_id': row['keyword_id'],
                    'keyword_text': row['keyword_text'],
                    'campaign_id': row['campaign_id'],
                    'current_roi': predicted_roi,
                    'cost': row['cost'],
                    'clicks': row['clicks'],
                    'conversions': row['conversions'],
                    'recommendation': 'pause' if predicted_roi < 0.5 else 'reduce_bid'
                })
        
        return sorted(underperforming, key=lambda x: x['cost'], reverse=True)