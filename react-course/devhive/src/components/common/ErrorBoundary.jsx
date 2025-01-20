import { useRouteError } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error.statusText || error.message || 'An unexpected error occurred'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 