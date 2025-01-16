import { useState } from 'react';
import { Paper, TextField, Box, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useProjects } from '../../context/ProjectsContext';
import { ACTIONS } from '../../reducers/projectsReducer';

export default function ProjectFilters() {
  const { filters, dispatch } = useProjects();
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    dispatch({
      type: ACTIONS.SET_FILTERS,
      payload: { search: event.target.value }
    });
  };

  const handleStatusChange = (event) => {
    dispatch({
      type: ACTIONS.SET_FILTERS,
      payload: { status: event.target.value }
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search projects"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {filters.tags.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => {
                dispatch({
                  type: ACTIONS.SET_FILTERS,
                  payload: {
                    tags: filters.tags.filter(t => t !== tag)
                  }
                });
              }}
              size="small"
            />
          ))}
        </Box>
      )}
    </Paper>
  );
} 