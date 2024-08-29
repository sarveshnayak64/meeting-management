import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkLogin= () =>{
    let userEmail = localStorage.getItem('userEmail')
    console.log('ttt', userEmail)
    if(userEmail){
      console.log('d')
      navigate('/home')
    }
  }

  const login = (e) => {
    e.preventDefault()
    setIsLoading(true);
    setError('')
    axios.post('https://meeting-management.onrender.com/user/login', {
      email: email,
      password: password
    })
    .then(data=> {
      setIsLoading(false)
      if(data?.data?.status){
        // setError('Success')
        localStorage.setItem('userEmail', email);
        localStorage.setItem('type', data?.data?.userType);
        localStorage.setItem('userId', data?.data?.userId);
        checkLogin();
      }else{
        setError('Failed to Login')
      }
      console.log(data)
    })
    .catch(err => {
      setIsLoading(false)
      console.log(err)
    })
    // navigate('/home')
  }

  useEffect(()=>{
    setTimeout(()=>{
      checkLogin();

    }, 200)
  }, [])


  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse, 'tttt')
      localStorage.setItem('google_token', tokenResponse.access_token);

      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });

      axios.post('https://meeting-management.onrender.com/user/googleLogin',{
        "email": userInfoResponse.data?.email,
        "name": userInfoResponse.data?.name,
        "token": tokenResponse.access_token
      }).then(data => {
        console.log('datat', data)
        localStorage.setItem('userEmail', userInfoResponse.data?.email);
        localStorage.setItem('type', data?.data?.userType);
        localStorage.setItem('userId', data?.data?.userId);
        checkLogin();
      })
      console.log(userInfoResponse.data);

    },
    onError: error => {
      console.log('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });








  return  <Box sx={style}>
<Typography variant="h6" >Meeting Room Management System</Typography><br/>
  <Typography variant="h4" >Login</Typography>
  {error != '' && <Typography color="error" variant="body1" >{error}</Typography>}
  <form onSubmit={(e) => login(e)}>
<TextField
  label="Email"
  variant="outlined"
  fullWidth
  required
  type="email"
  margin="normal"
  onChange={(val) => setEmail(val.target.value)}
/>
<TextField
  label="Password"
  variant="outlined"
  fullWidth
  required
  type="password"
  margin="normal"
  onChange={(val) => setPassword(val.target.value)}
/>
<div style={{display: "flex", gap: 20}}>
<Button
  variant="contained"
  color="primary"
  type="submit"
  disabled={isLoading}
>
  Login
</Button>
<Button type="button"
  variant="contained"
  color="success" onClick={() => googleLogin()}
  disabled={isLoading}
  >Login with Google</Button>
  </div>
</form>
  </Box>;
};

export default Login;
