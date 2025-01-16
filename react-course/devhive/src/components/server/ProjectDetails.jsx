// Simulating Server Component behavior
import { Suspense } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import ProjectInteractions from './ProjectInteractions';
import ProjectContent from './ProjectContent';
import { useProjects } from '../../context/ProjectsContext';

// In a real RSC setup, this would be a server component
export default function ProjectDetails({ id }) {
  const { projects, loading } = useProjects();
  const project = projects.find(p => p.id === id);

  if (loading) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  if (!project) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography color="error">Project not found</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        {project.title}
      </Typography>
      
      <ProjectInteractions projectId={id} />

      <Suspense fallback={<Skeleton height={200} />}>
        <ProjectContent content={project.description} />
      </Suspense>
    </Paper>
  );
}

ProjectDetails.propTypes = {
  id: PropTypes.string.isRequired,
}; 