import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/" color="inherit">
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography key={name} color="text.primary">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>
        ) : (
          <Link
            key={name}
            component={RouterLink}
            to={routeTo}
            color="inherit"
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
} 