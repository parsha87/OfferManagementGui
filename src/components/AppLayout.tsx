import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import React from 'react';

//const drawerWidth = 240;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen} />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar open={open} setOpen={setOpen} />
        <Box component="main" sx={{ p: 3, pt: 10 }}> {/* 👈 Add pt (padding-top) to push below navbar */}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
