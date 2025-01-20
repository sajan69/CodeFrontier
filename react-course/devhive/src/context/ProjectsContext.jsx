import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import projectsReducer, { ACTIONS } from '../reducers/projectsReducer';
import { projectsService } from '../services/projectsService';
import { useNotifications } from '../state/contexts/NotificationContext';

const ProjectsContext = createContext();

const initialState = {
  projects: [],
  filters: {
    status: 'all',
    search: '',
    tags: [],
  },
  loading: false,
  error: null,
};

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(projectsReducer, initialState);

  const { addNotification } = useNotifications();

  useEffect(() => {
    async function loadProjects() {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const projects = await projectsService.getProjects();
        dispatch({ type: ACTIONS.SET_PROJECTS, payload: projects });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    }
    loadProjects();
  }, []);

  const createProject = async (projectData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const newProject = await projectsService.createProject(projectData);
      dispatch({ type: ACTIONS.ADD_PROJECT, payload: newProject });
      
      addNotification({
        message: `Project "${newProject.title}" created successfully!`,
        type: 'success',
      });
      
      return newProject;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      
      addNotification({
        message: `Failed to create project: ${error.message}`,
        type: 'error',
      });
      
      throw error;
    }
  };

  const value = useMemo(() => ({
    ...state,
    dispatch,
    createProject,
  }), [state]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

ProjectsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
} 