import { lazy } from 'react';
import { projectLoader } from '../loaders/projectLoader';
import ProtectedRoute from './ProtectedRoute';

// Lazy load components
const Home = lazy(() => import('../pages/Home'));
const Projects = lazy(() => import('../pages/Projects'));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'));
const Profile = lazy(() => import('../pages/Profile'));

export const routes = [
  {
    path: '/',
    element: <Home />,
    index: true,
  },
  {
    path: 'projects',
    element: <Projects />,
    loader: projectLoader,
    children: [
      {
        path: ':id',
        element: <ProjectDetails />,
        loader: ({ params }) => projectLoader(params.id),
      },
    ],
  },
  {
    path: 'profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]; 