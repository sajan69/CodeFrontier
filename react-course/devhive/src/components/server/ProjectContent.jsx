// Simulating Server Component behavior
import { Box, Typography, Chip } from '@mui/material';

export default function ProjectContent({ content }) {
  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {content}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label="React" color="primary" />
        <Chip label="TypeScript" color="secondary" />
        <Chip label="Material-UI" variant="outlined" />
      </Box>
    </Box>
  );
} 