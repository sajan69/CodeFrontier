import { memo } from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import PropTypes from 'prop-types';
import LazyImage from '../../optimizations/LazyImage';
import { trackMetric } from '../../utils/performance';

const OptimizedProjectCard = memo(function ProjectCard({ project, onClick }) {
  const { title, description, status, tags, image } = project;

  // Track component render
  trackMetric(`project-card-render-${project.id}`);

  return (
    <Card 
      onClick={() => onClick(project.id)}
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      {image && (
        <LazyImage
          src={image}
          alt={title}
          width="100%"
          height={200}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={status}
            color={status === 'active' ? 'primary' : 'default'}
          />
          {tags.map(tag => (
            <Chip
              key={tag}
              size="small"
              label={tag}
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.project.updatedAt === nextProps.project.updatedAt
  );
});

OptimizedProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OptimizedProjectCard; 