import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CssBaseline /> {/* Normalize styles across browsers */}

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar open={open} setOpen={setOpen} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            p: 3,
            pt: 10, // Push content below fixed navbar
            flexGrow: 1,
            overflowX: 'hidden',
          }}
        >
          {/* Spacer for fixed AppBar height */}
          <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
