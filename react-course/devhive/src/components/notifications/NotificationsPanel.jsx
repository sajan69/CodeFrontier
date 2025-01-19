import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Badge,
  Drawer,
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../state/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();

  return (
    <>
      <IconButton color="inherit" onClick={() => setIsOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                secondaryAction={
                  !notification.read && (
                    <IconButton 
                      edge="end" 
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )
                }
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
} 