import { Box, Paper, Typography, Switch, Select, MenuItem, Slider, FormControlLabel } from '@mui/material';
import { useUserPreferences } from '../../state/contexts/UserPreferencesContext';

export default function PreferencesPanel() {
  const { 
    language, 
    dateFormat, 
    emailNotifications,
    collaborationPreferences,
    accessibility,
    updatePreference,
  } = useUserPreferences();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>User Preferences</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">General</Typography>
        <Select
          fullWidth
          size="small"
          value={language}
          onChange={(e) => updatePreference('language', e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
        </Select>

        <Select
          fullWidth
          size="small"
          value={dateFormat}
          onChange={(e) => updatePreference('dateFormat', e.target.value)}
        >
          <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
          <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
          <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
        </Select>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Notifications</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={emailNotifications}
              onChange={(e) => updatePreference('emailNotifications', e.target.checked)}
            />
          }
          label="Email Notifications"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Accessibility</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={accessibility.highContrast}
              onChange={(e) => updatePreference('accessibility', {
                ...accessibility,
                highContrast: e.target.checked,
              })}
            />
          }
          label="High Contrast"
        />
        <Typography gutterBottom>Font Size</Typography>
        <Slider
          value={['small', 'medium', 'large'].indexOf(accessibility.fontSize)}
          min={0}
          max={2}
          step={1}
          marks
          onChange={(_, value) => updatePreference('accessibility', {
            ...accessibility,
            fontSize: ['small', 'medium', 'large'][value],
          })}
        />
      </Box>
    </Paper>
  );
} 