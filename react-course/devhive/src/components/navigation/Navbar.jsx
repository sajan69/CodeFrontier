import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={NavLink}
            to="/"
            color="inherit"
            end
          >
            Home
          </Button>
          <Button
            component={NavLink}
            to="/projects"
            color="inherit"
          >
            Projects
          </Button>
          {user && (
            <Button
              component={NavLink}
              to="/profile"
              color="inherit"
            >
              Profile
            </Button>
          )}
        </Box>
        {user && (
          <Button 
            color="inherit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
} 