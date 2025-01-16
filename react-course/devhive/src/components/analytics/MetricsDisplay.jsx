import { Grid, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// Define MetricCard component outside of the main component
const MetricCard = ({ title, value, subtitle }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" color="primary">
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
};

export default function MetricsDisplay({ metrics }) {
  if (!metrics) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          subtitle="Currently in progress"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Success Rate"
          value={`${metrics.projectSuccessRate}%`}
          subtitle="Projects completed successfully"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Collaborators"
          value={metrics.totalCollaborators}
          subtitle={`${metrics.averageCollaboratorsPerProject} per project`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg. Completion Time"
          value={`${metrics.averageCompletionTime} days`}
          subtitle="From start to finish"
        />
      </Grid>
    </Grid>
  );
}

MetricsDisplay.propTypes = {
  metrics: PropTypes.shape({
    activeProjects: PropTypes.number.isRequired,
    projectSuccessRate: PropTypes.string.isRequired,
    totalCollaborators: PropTypes.number.isRequired,
    averageCollaboratorsPerProject: PropTypes.string.isRequired,
    averageCompletionTime: PropTypes.number.isRequired,
  }),
}; 