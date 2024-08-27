import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from "react-router-dom";
// import MenuIcon from '@mui/icons-material/Menu';

export const Navbar = () => {
    const navigate = useNavigate();
    const userType = localStorage.getItem('type');
    const logout = () =>{
        localStorage.removeItem('userEmail')
        localStorage.removeItem('type')
        localStorage.removeItem('userId')
        localStorage.removeItem('google_token')
        navigate('/');
    }
if(userType == 'admin'){
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <Typography variant="h6" align="left" component="div" sx={{ flexGrow: 1 }}>
                Meeting Room Management System
            </Typography>
            
            
            <Button color="inherit"><Link to="/home">Home</Link></Button>
            <Button color="inherit"><Link to="/users">Users</Link></Button>
            <Button color="inherit"><Link to="/bookings">Bookings</Link></Button>
            <Button color="inherit"><Link to="/rooms">Rooms</Link></Button>
            <Button color="inherit" onClick={() => logout()}>SignOut</Button>
            </Toolbar>
        </AppBar>
        </Box>
    );
}else{
    return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" align="left" component="div" sx={{ flexGrow: 1 }}>
            Meeting Room Management System
          </Typography>
          
          
          <Button color="inherit"><Link to="/home">Home</Link></Button>
          <Button color="inherit"><Link to="/bookings">Bookings</Link></Button>
          <Button color="inherit" onClick={() => logout()}>SignOut</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
  
  
};
