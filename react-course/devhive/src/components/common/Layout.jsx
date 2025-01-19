import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import NotificationsPanel from '../notifications/NotificationsPanel';
import PreferencesPanel from '../preferences/PreferencesPanel';
import { useState } from 'react';
import { Drawer } from '@mui/material';

export default function Layout({ children }) {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DevHive
          </Typography>
          <NotificationsPanel />
          <IconButton color="inherit" onClick={() => setShowPreferences(true)}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>

      <Drawer
        anchor="right"
        open={showPreferences}
        onClose={() => setShowPreferences(false)}
      >
        <Box sx={{ width: 320 }}>
          <PreferencesPanel />
        </Box>
      </Drawer>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}; 