import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Layout from './components/common/Layout';
import ErrorFallback from './components/common/ErrorFallback';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProjectsProvider from './context/ProjectsContext';
import ProjectContainer from './components/projects/ProjectContainer';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProjectsProvider>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectContainer />
            </Suspense>
          </Layout>
        </ProjectsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
