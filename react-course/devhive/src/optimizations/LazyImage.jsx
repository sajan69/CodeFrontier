import { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';

export default function LazyImage({ src, alt, width, height, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (error) {
    return <Box sx={{ width, height, bgcolor: 'grey.300' }} {...props} />;
  }

  return isLoaded ? (
    <img src={src} alt={alt} style={{ width, height, ...props.sx }} />
  ) : (
    <Skeleton variant="rectangular" width={width} height={height} {...props} />
  );
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}; 