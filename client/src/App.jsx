import './App.css'
import Home from './pages/home'

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Bookings from './pages/bookings'
import Login from './pages/login'
import Users from './pages/users'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Rooms from './pages/rooms'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/rooms" element={<Rooms/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/bookings" element={<Bookings/>} />
        <Route path="/users" element={<Users/>} />
      </Routes>
     </BrowserRouter>
     </ThemeProvider>
  )
}

export default App
