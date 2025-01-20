import { useState } from 'react';
import { Box, Grid, Typography, Tab, Tabs, Alert, Snackbar } from '@mui/material';
import withAuth from '../patterns/withAuth';
import withLogging from '../patterns/withLogging';
import ProjectFeed from './ProjectFeed';
import ProjectDetails from '../server/ProjectDetails';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import PatternsShowcase from '../patterns/PatternsShowcase';
import ProjectForm from '../forms/ProjectForm';
import { useProjects } from '../../context/ProjectsContext';

function ProjectContainer() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('feed');
  const [error, setError] = useState(null);
  const { createProject } = useProjects();

  const handleProjectSubmit = async (formData) => {
    try {
      console.log('formData', formData);
      const newProject = await createProject({
        ...formData,
        status: 'active',
        tags: formData.tags 
          ? String(formData.tags)
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag !== '')
          : [],
        collaborators: []
      });
      setView('feed');
      setSelectedProject(newProject.id);
    } catch (error) {
      setError(error.message || 'Failed to create project');
    }
  };

  return (
    <Box>
      {/* Navigation */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={view} onChange={(_, newValue) => setView(newValue)}>
          <Tab label="Projects" value="feed" />
          <Tab label="New Project" value="new" />
          <Tab label="Analytics" value="analytics" />
          <Tab label="Patterns" value="patterns" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedProject ? 8 : 12}>
          {view === 'feed' && (
            <ProjectFeed onProjectSelect={setSelectedProject} />
          )}

          {view === 'new' && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Create New Project
              </Typography>
              <ProjectForm onSubmit={handleProjectSubmit} />
            </Box>
          )}

          {view === 'analytics' && <AnalyticsDashboard />}
          
          {view === 'patterns' && <PatternsShowcase />}
        </Grid>

        {selectedProject && (
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Project Details</Typography>
            <ProjectDetails id={selectedProject} />
          </Grid>
        )}
      </Grid>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Applying HOCs
export default withAuth(withLogging(ProjectContainer)); 