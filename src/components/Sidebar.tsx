import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = ({ open, setOpen }: { open: boolean, setOpen: (val: boolean) => void }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 60,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
        }
      }}
    >
      <Toolbar />
      <List>
        <ListItemButton onClick={() => navigate('/dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/inquiries')}>
          <ListItemIcon><ListIcon /></ListItemIcon>
          {open && <ListItemText primary="Inquiries" />}
        </ListItemButton>

        {/* Conditionally render Users menu if role is not "user" */}
        {role !== 'User' && (
          <ListItemButton onClick={() => navigate('/users')}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            {open && <ListItemText primary="Users" />}
          </ListItemButton>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
