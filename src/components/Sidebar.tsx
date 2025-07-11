import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = ({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) => {
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
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          px: 1,
        }}
      >
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <List>
        <Tooltip title="Dashboard" placement="right" disableHoverListener={open}>
          <ListItemButton onClick={() => navigate('/dashboard')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </Tooltip>

        <Tooltip title="Inquiries" placement="right" disableHoverListener={open}>
          <ListItemButton onClick={() => navigate('/inquiries')}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Inquiries" />}
          </ListItemButton>
        </Tooltip>

        {role !== 'User' && (
          <Tooltip title="Users" placement="right" disableHoverListener={open}>
            <ListItemButton onClick={() => navigate('/users')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Users" />}
            </ListItemButton>
          </Tooltip>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
