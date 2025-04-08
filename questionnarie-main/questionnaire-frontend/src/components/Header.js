import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../asset/insa.png"; // Adjust the path based on your project structure

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
      <Toolbar>
        <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {user?.role === "admin" && (
            <Button color="inherit" component={Link} to="/">
              INSA
            </Button>
          )}
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              
              {user ? (
                <>
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
           
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
