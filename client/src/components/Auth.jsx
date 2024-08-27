import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";

const Auth = ({children}) => {
  const navigate = useNavigate()

  const checkLogin= () =>{
    let userEmail = localStorage.getItem('userEmail')
    if(!userEmail){
      console.log('d')
      navigate('/')
    }
  }

  useEffect(()=>{
    checkLogin()
  }, [])

  return <>
    <Navbar/>
    {children}
  </>;
};

export default Auth;
