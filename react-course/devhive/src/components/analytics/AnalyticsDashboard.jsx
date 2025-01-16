import { useState, useCallback, useMemo } from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import { analyticsService } from '../../services/analyticsService';
import MetricsDisplay from './MetricsDisplay';
import TrendsChart from './TrendsChart';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  // Memoized fetch function
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsData, trendsData] = await Promise.all([
        analyticsService.getMetrics(timeRange),
        analyticsService.getProjectTrends()
      ]);
      setMetrics(metricsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Memoized metrics calculations
  const processedMetrics = useMemo(() => {
    if (!metrics) return null;
    return {
      ...metrics,
      projectSuccessRate: ((metrics.completedProjects / (metrics.activeProjects + metrics.completedProjects)) * 100).toFixed(1),
      averageCollaboratorsPerProject: (metrics.totalCollaborators / (metrics.activeProjects + metrics.completedProjects)).toFixed(1)
    };
  }, [metrics]);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <Button
          variant="contained"
          onClick={fetchAnalytics}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MetricsDisplay metrics={processedMetrics} />
          </Grid>
          <Grid item xs={12}>
            <TrendsChart data={trends} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 