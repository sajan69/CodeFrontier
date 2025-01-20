import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/navigation/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ p: 3 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
}

export default App;
