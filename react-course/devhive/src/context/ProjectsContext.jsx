import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import projectsReducer, { ACTIONS } from '../reducers/projectsReducer';
import { projectsService } from '../services/projectsService';

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

export default function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(projectsReducer, initialState);

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

  const value = useMemo(() => ({
    ...state,
    dispatch,
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