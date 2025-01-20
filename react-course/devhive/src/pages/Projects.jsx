import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Outlet, useLoaderData } from 'react-router-dom';
import ProjectFeed from '../components/projects/ProjectFeed';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

export default function Projects() {
  const { projects } = useLoaderData();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <Container>
      <Breadcrumbs />
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <ProjectFeed 
            projects={projects}
            onProjectSelect={setSelectedProject}
          />
        </Box>
        {selectedProject && (
          <Box sx={{ width: 320 }}>
            <Outlet />
          </Box>
        )}
      </Box>
    </Container>
  );
} 