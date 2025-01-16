import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate auth check
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 1000);
    }, []);

    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this content.</div>;
    }

    return <WrappedComponent {...props} />;
  };
} 