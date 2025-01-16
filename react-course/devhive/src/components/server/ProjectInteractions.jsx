// Client Component
'use client';
import { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Favorite, Share, BookmarkAdd } from '@mui/icons-material';

export default function ProjectInteractions({ projectId }) {
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', my: 2 }}>
      <IconButton 
        color={likes > 0 ? 'primary' : 'default'}
        onClick={() => setLikes(l => l + 1)}
      >
        <Favorite />
      </IconButton>
      <Typography variant="body2">
        {likes} likes
      </Typography>

      <IconButton onClick={() => setSaved(!saved)}>
        <BookmarkAdd color={saved ? 'primary' : 'default'} />
      </IconButton>

      <IconButton>
        <Share />
      </IconButton>
    </Box>
  );
} 