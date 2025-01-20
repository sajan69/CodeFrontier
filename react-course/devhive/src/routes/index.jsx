import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import App from '../App';
import ErrorBoundary from '../components/common/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes,
    errorElement: <ErrorBoundary />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
} 