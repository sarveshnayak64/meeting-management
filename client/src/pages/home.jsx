import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {Link} from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import Auth from "../components/Auth";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Home = () => {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    let userType = localStorage.getItem('type');
    if(userType == 'admin'){
      setIsAdmin(true);
    }else{
      setIsAdmin(false);
    }
  },[])

  return <>
  <Auth>
  <div style={{display: "flex", width: '100%',justifyContent: 'space-between', paddingBlock: 20}}>
    <Typography variant="h4">Home</Typography>
    </div>
  <div style={{ display: "flex", flexDirection: "row", gap: 10}}>
    {isAdmin && <>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        {bull} Users {bull}
        </Typography>
        {/* <Typography variant="body2">
          20
        </Typography> */}
      </CardContent>
      <CardActions  style={{display: "flex", justifyContent: 'center'}}>
        <Button size="small"><Link to="/users">View Users</Link></Button>
      </CardActions>
    </Card>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        {bull} Rooms {bull}
        </Typography>
        {/* <Typography variant="body2">
          4
        </Typography> */}
      </CardContent>
      <CardActions style={{display: "flex", justifyContent: 'center'}}>
        <Button size="small"><Link to="/rooms">View Rooms</Link></Button>
      </CardActions>
    </Card>
    </>}
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        {bull} Bookings {bull}
        </Typography>
        {/* <Typography variant="body2">
          42
        </Typography> */}
      </CardContent>
      <CardActions style={{display: "flex", justifyContent: 'center'}}>
        <Button size="small"><Link to="/bookings">View Bookings</Link></Button>
      </CardActions>
    </Card>
  </div>
    </Auth>
  </>;
};

export default Home;
