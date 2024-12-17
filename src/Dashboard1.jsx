import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import { amber } from "@mui/material/colors";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import DataTable from "./DisplayTables/Partnertable";
import CountryCategoryTable from "./DisplayTables/CountryTable";
import OpcosTariffs from "./DisplayTables/OpcosTariffsTable";
import TariffsTable from "./DisplayTables/TariffsTable";

export default function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [activeTable, setActiveTable] = useState('partners');
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();

  // New state variable for user data
  const [user, setUser] = useState(null);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user data, redirect to login
      navigate('/signin');
    }
  }, [navigate]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // Updated logout function to remove user data
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user"); // Remove user data
    navigate("/signin");
  };

  const handleTableChange = (table) => {
    setActiveTable(table);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Typography variant="subtitle1">
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <main>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ffcb05', }}>
          <Toolbar sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src="/mtnOrigLogo.png"
              alt="MTN Logo"
              sx={{ height: "80px", mr: 2 }}
            />
            <Typography
              variant="h6"
              whiteSpace="nowrap"
              component="div"
              sx={{ color: "black", mr: 2 }}
            >
              ROAMING PARTNERS
            </Typography>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {['Opcos', 'partners', 'Partner Tariffs', 'Opco Tariffs'].map((table) => (
                <Button
                  key={table}
                  variant="outlined"
                  color="inherit"
                  onClick={() => handleTableChange(table)}
                  sx={{
                    mr: 1,
                    borderColor: activeTable === table ? 'black' : 'transparent',
                    color: 'black',
                    textTransform: 'none',
                    backgroundColor: activeTable === table ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {table}
                </Button>
              ))}
            </Box>

            {/* Display User Name */}
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: "black", mr: 1 }}>
                {user ? `${user.firstName} ${user.lastName}` : ''}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle sx={{ color: "black" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>

      {/* Display the active table based on the state */}
      {activeTable === 'partners' && <DataTable />}
      {activeTable === 'Opcos' && <CountryCategoryTable />}
      {activeTable === 'Partner Tariffs' && <TariffsTable />}
      {activeTable === 'Opco Tariffs' && <OpcosTariffs />}
    </main>
  );
}
