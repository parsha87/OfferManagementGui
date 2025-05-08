import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, setOpen }: { open: boolean, setOpen: (val: boolean) => void }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? 240 : 60, // Adjust width based on collapse state
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 60,
          boxSizing: 'border-box',
          transition: 'width 0.3s', // Smooth transition when collapsing
        }
      }}
    >
      <Toolbar />
      <List>
        <ListItemButton onClick={() => navigate('/dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          {open && <ListItemText primary="Dashboard" />} {/* Only show text when open */}
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/inquiries')}>
          <ListItemIcon><ListIcon /></ListItemIcon>
          {open && <ListItemText primary="Inquiries" />} {/* Only show text when open */}
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/users')}>
          <ListItemIcon><ListIcon /></ListItemIcon>
          {open && <ListItemText primary="users" />} {/* Only show text when open */}
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
