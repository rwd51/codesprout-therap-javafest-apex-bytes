import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { NavLink } from "react-router-dom";

import { Modal, Box, Button, Typography } from "@mui/material";

//values
import { TITLE_THICK, TITLE, CONTENT } from "../../values/Fonts";

function Sidebar({
  menuItem,
  sideBarColor = "white",
  sideBarItemColor = "black",
  sideBarItemColorOnHover = "white",
  sideBarItemBackgroundColorOnHover = "black",
  sideBarIconColor = "black",
  sideBarIconBackGroundColor = "none",
  sideBarIconColorOnHover = "white",
  sideBarIconBackGroundColorOnhover = "black",
}) {
  const [isOpen, setIsOpen] = useState(false); //or React.useState()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  //////Logout
  ///////////

  const LogoutModal = ({ open, onClose }) => {
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "rgba(247, 244, 217)",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="logout-modal-title" variant="h2" component="h2">
            Logout Confirmation
          </Typography>
          <Typography
            variant="h6"
            style={{
              fontFamily: "Tahoma, Arial, sans-serif",
              marginTop: "45px",
            }}
          >
            Are you sure you want to log out?
          </Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                mr: 1,
                color: "#304f2c",
                borderColor: "#304f2c",
                backgroundColor: "#d6ded5",
                "&:hover": {
                  backgroundColor: "#85b080",
                  color: "#fff",
                  borderColor: "#85b080",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogoutClick}
              sx={{
                backgroundColor: "#9dc799", // Button background color
                "&:hover": {
                  backgroundColor: "#85b080", // Button hover background color
                },
              }}
            >
              <div style={{ color: "black", fontWeight: "bold" }}>Logout</div>
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  const handleLogoutModalClick = () => {
    setIsOpen(false); // Close the sidebar
    setIsModalOpen(true); // Open the modal
  };

  const handleLogoutClick = () => {
    try {
      localStorage.removeItem("token");
      //setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <IconButton
        color="black"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer(true)}
        sx={{
          margin: 1,
          padding: "15px",
          color: sideBarIconColor,
          backgroundColor: sideBarIconBackGroundColor,
          "&:hover": {
            backgroundColor: sideBarIconBackGroundColorOnhover, // Change background on hover
            color: sideBarIconColorOnHover,
          },
          "& .MuiListItemIcon-root, & .MuiListItemText-root": {
            fontSize: "1.2rem",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "270px",
            backgroundColor: sideBarColor,
            height: "100vh",
            overflowY: "hidden",
          },
        }}
      >
        {/* Non-clickable icon at the top */}
        <div onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <ListItem sx={{ justifyContent: "center", pointerEvents: "none" }}>
            <MenuIcon sx={{ fontSize: "2.5rem" }} />
          </ListItem>
        </div>

        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{
            maxHeight: "calc(100vh - 150px)", // 100vh minus any top bar height, adjust 64px as needed
            overflowY: "auto", // Enables vertical scrolling within the list container
          }}
        >
          <List>
            {/* Menu Items */}
            {menuItem.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  if (item.action === "logout") {
                    handleLogoutModalClick();
                  } else {
                    setIsOpen(false);
                  }
                }}
                component={item.path ? NavLink : "div"}
                to={item.path || ""}
                sx={{
                  color: sideBarItemColor,
                  padding: "10px",
                  "&:hover": {
                    color: sideBarItemColorOnHover,
                    backgroundColor: sideBarItemBackgroundColorOnHover, // Change background on hover
                  },
                  "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                    fontSize: "1.2rem",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    fontSize: "1.4rem",
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      marginRight: 2,
                      fontSize: "1.5em",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "medium",
                      fontSize: "inherit",
                      fontFamily: CONTENT,
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <LogoutModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default Sidebar;
