import { useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { useProjects } from '../../context/ProjectsContext';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProjectFeed({ onProjectSelect }) {
  const { projects, filters, loading } = useProjects();

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (filters.status !== 'all' && project.status !== filters.status) {
        return false;
      }
      if (filters.search && !project.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.tags.length > 0 && !filters.tags.some(tag => project.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }, [projects, filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ProjectFilters />
      <Grid container spacing={3}>
        {filteredProjects.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" textAlign="center">
              No projects found
            </Typography>
          </Grid>
        ) : (
          filteredProjects.map(project => (
            <Grid item xs={12} sm={6} key={project.id}>
              <ProjectCard 
                project={project}
                onClick={() => onProjectSelect(project.id)}
              />
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
} 