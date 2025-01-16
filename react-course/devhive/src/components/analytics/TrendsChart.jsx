import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function TrendsChart({ data }) {
  if (!data) return null;

  // Simple bar chart representation for now
  // In a real app, you'd use a charting library like recharts or chart.js
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Project Trends
      </Typography>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '8px' }}>
        {data.map((item) => (
          <div key={item.date} style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                height: `${(item.newProjects / 10) * 100}%`,
                backgroundColor: '#646cff',
                margin: '0 auto',
                width: '20px',
                borderRadius: '4px',
                transition: 'height 0.3s ease',
              }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </Typography>
            <Typography variant="caption" color="primary">
              {item.newProjects}
            </Typography>
          </div>
        ))}
      </div>
    </Paper>
  );
}

TrendsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      newProjects: PropTypes.number.isRequired,
      activeCollaborators: PropTypes.number.isRequired,
    })
  ),
}; 