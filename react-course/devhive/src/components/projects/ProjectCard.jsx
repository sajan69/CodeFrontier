import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import PropTypes from 'prop-types';

export default function ProjectCard({ project, onClick }) {
  const { title, description, status, tags, collaborators } = project;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={status}
            color={status === 'active' ? 'success' : 'default'}
            size="small"
            sx={{ mr: 1 }}
          />
          {collaborators && (
            <Chip
              label={`${collaborators.length} collaborators`}
              size="small"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          View Details
        </Button>
        <Button size="small" color="primary">
          Join Project
        </Button>
      </CardActions>
    </Card>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    collaborators: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}; 