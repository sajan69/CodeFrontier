import { Container, Paper, Typography, Box, Avatar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import Breadcrumbs from '../components/navigation/Breadcrumbs';

export default function Profile() {
  const { user } = useAuth();

  return (
    <Container>
      <Breadcrumbs />
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Box>
            <Typography variant="h4">{user?.name}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 