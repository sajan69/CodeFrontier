import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Layout from './components/common/Layout';
import ErrorFallback from './components/common/ErrorFallback';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProjectsProvider from './context/ProjectsContext';
import { ThemeProvider as AppThemeProvider } from './state/contexts/ThemeContext';
import { NotificationProvider } from './state/contexts/NotificationContext';
import { UserPreferencesProvider } from './state/contexts/UserPreferencesContext';
import ProjectContainer from './components/projects/ProjectContainer';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppThemeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserPreferencesProvider>
            <NotificationProvider>
              <ProjectsProvider>
                <Layout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProjectContainer />
                  </Suspense>
                </Layout>
              </ProjectsProvider>
            </NotificationProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
