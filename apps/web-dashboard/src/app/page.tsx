'use client';

import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Dashboard as DashboardIcon, Campaign, Analytics, TrendingUp } from '@mui/icons-material';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function HomePage() {
  const stats = [
    {
      title: 'Активные кампании',
      value: '24',
      icon: <Campaign />,
      color: '#1976d2'
    },
    {
      title: 'Общий бюджет',
      value: '₽125,000',
      icon: <TrendingUp />,
      color: '#2e7d32'
    },
    {
      title: 'CTR',
      value: '2.34%',
      icon: <Analytics />,
      color: '#ed6c02'
    },
    {
      title: 'Конверсии',
      value: '156',
      icon: <DashboardIcon />,
      color: '#9c27b0'
    }
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Панель управления YAAI
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Управление эффективностью рекламных кампаний Яндекс.Директ
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Быстрые действия
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Оптимизация
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Автоматическая оптимизация ставок и бюджетов на основе машинного обучения
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Аналитика в реальном времени
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Мониторинг эффективности кампаний и прогнозирование результатов
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </DashboardLayout>
  );
}