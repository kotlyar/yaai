import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { validateRequest } from '../middleware/validation';
import { campaignSchemas } from '../schemas/campaign';

const router = Router();
const campaignController = new CampaignController();

/**
 * @route GET /api/campaigns
 * @desc Get all campaigns for user
 * @access Private
 */
router.get('/', campaignController.getCampaigns);

/**
 * @route GET /api/campaigns/:id
 * @desc Get campaign by ID
 * @access Private
 */
router.get('/:id', campaignController.getCampaignById);

/**
 * @route POST /api/campaigns/sync
 * @desc Sync campaigns from Yandex Direct
 * @access Private
 */
router.post('/sync', campaignController.syncCampaigns);

/**
 * @route GET /api/campaigns/:id/stats
 * @desc Get campaign statistics
 * @access Private
 */
router.get('/:id/stats', 
  validateRequest(campaignSchemas.getStats), 
  campaignController.getCampaignStats
);

/**
 * @route GET /api/campaigns/:id/keywords
 * @desc Get campaign keywords with stats
 * @access Private
 */
router.get('/:id/keywords', campaignController.getCampaignKeywords);

/**
 * @route GET /api/campaigns/:id/adgroups
 * @desc Get campaign ad groups
 * @access Private
 */
router.get('/:id/adgroups', campaignController.getCampaignAdGroups);

/**
 * @route PUT /api/campaigns/:id/budget
 * @desc Update campaign budget
 * @access Private
 */
router.put('/:id/budget', 
  validateRequest(campaignSchemas.updateBudget), 
  campaignController.updateBudget
);

/**
 * @route PUT /api/campaigns/:id/status
 * @desc Update campaign status
 * @access Private
 */
router.put('/:id/status', 
  validateRequest(campaignSchemas.updateStatus), 
  campaignController.updateStatus
);

/**
 * @route GET /api/campaigns/:id/insights
 * @desc Get AI-powered insights for campaign
 * @access Private
 */
router.get('/:id/insights', campaignController.getCampaignInsights);

export default router;