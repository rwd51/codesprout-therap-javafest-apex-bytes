import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Card from '@mui/material/Card';


function NotificationButton({notificationsIconColor="black", notificationsBackgroundColor="none", notificationsIconColorOnHover="white", notificationsBackgroundColorOnHover="black"}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New friend request.New friend request.New friend request.New friend request.New friend request",
      avatar: "/path/to/avatar1.jpg",
      read: false,
    },
    {
      id: 2,
      text: "You have 3 new messages",
      avatar: "/path/to/avatar2.jpg",
      read: false,
    },
    {
      id: 3,
      text: "Meeting reminder",
      avatar: "/path/to/avatar3.jpg",
      read: true,
    },
  ]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    handleClose();
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <React.Fragment>
      <IconButton
        size="large"
        aria-label="show notifications"
        onClick={handleClick}
        sx={{
          color: notificationsIconColor,
          backgroundColor: notificationsBackgroundColor,
          "&:hover": {
            color: notificationsIconColorOnHover,
            backgroundColor: notificationsBackgroundColorOnHover,
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        sx={{
          width: 400, // You can adjust this value as needed
        }}
      >

{notifications.map((notification) => (
  <MenuItem
    key={notification.id}
    onClick={() => handleMenuItemClick(notification.id)}
    sx={{
      display: 'flex', // Makes the MenuItem a flex container
      justifyContent: 'space-between', // Spaces out the child components
      alignItems: 'center', // Aligns items vertically in the center
      backgroundColor: !notification.read ? "#E3F2FD" : "inherit",
      "&:hover": {
        backgroundColor: notification.read ? "#E0E0E0" : "#B3DAF1", // Gray for read, blue for unread
      },
      width: 400, // Setting width for the MenuItem
      overflow: 'hidden',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ListItemIcon sx={{ marginRight: 2 }}> 
        <Avatar src={notification.avatar} />
      </ListItemIcon>
      <Typography
        variant="inherit"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          flexGrow: 1, // Allows the text to take up the remaining space
        }}
      >
        {notification.text}
      </Typography>
    </div>
    {!notification.read && (
      <ListItemIcon>
        <FiberManualRecordIcon sx={{ color: "blue", fontSize: "0.7rem" }} />
      </ListItemIcon>
    )}
  </MenuItem>
))}

      </Menu>
    </React.Fragment>
  );
}

export default NotificationButton;
