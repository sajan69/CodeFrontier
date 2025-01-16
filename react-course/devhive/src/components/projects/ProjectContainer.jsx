import { useState } from 'react';
import { Box, Grid, Typography, Tab, Tabs, Alert, Snackbar } from '@mui/material';
import withAuth from '../patterns/withAuth';
import withLogging from '../patterns/withLogging';
import Select from '../compound/Select';
import Form from '../compound/Form';
import ProjectDetails from '../server/ProjectDetails';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import ProjectFeed from './ProjectFeed';
import PatternsShowcase from '../patterns/PatternsShowcase';
import { useProjects } from '../../context/ProjectsContext';

function ProjectContainer() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('feed');
  const [error, setError] = useState(null);
  const { createProject } = useProjects();

  const handleProjectSubmit = async (values) => {
    try {
      const newProject = await createProject({
        ...values,
        status: 'active',
        tags: values.tags.split(',').map(tag => tag.trim()),
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
          <Tab label="Project Feed" value="feed" />
          <Tab label="Create Project" value="create" />
          <Tab label="Analytics" value="analytics" />
          <Tab label="Patterns Demo" value="patterns" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {view === 'feed' && (
            <ProjectFeed onProjectSelect={setSelectedProject} />
          )}

          {view === 'create' && (
            <Box>
              <Typography variant="h5" gutterBottom>Create New Project</Typography>
              <Form onSubmit={handleProjectSubmit}>
                <Form.Field name="title">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Input name="title" />
                </Form.Field>
                <Form.Field name="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Input name="description" multiline rows={4} />
                </Form.Field>
                <Form.Field name="tags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Input name="tags" placeholder="React, TypeScript, etc." />
                </Form.Field>
                <Form.Submit>Create Project</Form.Submit>
              </Form>
            </Box>
          )}

          {view === 'analytics' && <AnalyticsDashboard />}
          
          {view === 'patterns' && <PatternsShowcase />}
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedProject && (
            <>
              <Typography variant="h6" gutterBottom>Project Details</Typography>
              <ProjectDetails id={selectedProject} />
            </>
          )}
        </Grid>
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