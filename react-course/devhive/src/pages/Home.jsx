import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to DevHive
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect, collaborate, and create amazing projects with developers worldwide
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/projects')}
          sx={{ mt: 4 }}
        >
          Explore Projects
        </Button>
      </Box>
    </Container>
  );
} 