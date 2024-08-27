import React, { useEffect, useState } from "react";

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Auth from "../components/Auth";
import axios from "axios";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const Bookings = () => {
  const [rows, setRows] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [fromTime, setFromTime] = useState('')
  const [toDate, setToDate] = useState('')
  const [toTime, setToTime] = useState('')
  const [open, setOpen] = useState(false);
  const [deletedBooking, setDeletedBooking] = useState(false)
  const [googleAuth, setGoogleAuth] = useState(false);
  const [error, setError] = useState('')
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const fetchBookings = () => {
    let userId = ''
    let apiUrl = 'http://localhost:5000/bookings/'
    let userType = localStorage.getItem('type');
    if(userType != 'admin'){
      userId = localStorage.getItem('userId')
      apiUrl += userId
    }
    axios.get(apiUrl)
    .then(data => {
      setRows(data.data)
      console.log(data)
    })
    .catch(err => console.log(err));
  }

  const fetchRooms = () => {
    let apiUrl = 'http://localhost:5000/rooms/'
    axios.get(apiUrl)
    .then(data => {
      setRooms(data.data)
      console.log(data)
    })
    .catch(err => console.log(err));
  }

  const createBooking= (e) => {
    e.preventDefault()
    let userId = localStorage.getItem('userId')

    axios.post('http://localhost:5000/bookings', {
      roomId: selectedRoom,
      fromDate: fromDate,
      fromTime: fromTime,
      toDate: toDate,
      toTime: toTime,
      userId: userId
    }).then(data => {
      if(data.data.status){
        fetchBookings()
        setOpen(false);
      }else{
        setError(data?.data?.message)
      }
      console.log(data)
    }).catch(err => {
      console.log(err);
    })

  }

  const deleteBooking = async (id, event_id = null) =>{
    if(event_id != null){
      await deleteEventFromGoogleCalender(event_id ,id );
    }
    axios.delete('http://localhost:5000/bookings/'+id).then(data =>{
      fetchBookings();
      setDeletedBooking(true)
      setTimeout(()=>{
        setDeletedBooking(false)
      }, 1000)
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const addEventToGoogleCalender = (id, room, from, to) => {
    let token = localStorage.getItem('google_token')
    axios.post("http://localhost:5000/google/create-event", {token, id, room, from, to})
    .then(data => {
      console.log('Event Created:', data.data);
      fetchBookings()
    })
    .catch(err => console.error('Error creating event:', err))
  }
  const deleteEventFromGoogleCalender = async (eventId, id) => {
    try {
      const token = localStorage.getItem('google_token');
      const response = await axios.post('http://localhost:5000/google/delete-event', { token , eventId, id });
      console.log('Event Created:', response.data);
      fetchBookings()
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(()=>{
    let userType = localStorage.getItem('type');
    if(userType == 'admin'){
      setIsAdmin(true);
    }else{
      setIsAdmin(false);
    }

    let googleToken = localStorage.getItem('google_token');
    if(googleToken){
      setGoogleAuth(true);
    }else{
      setGoogleAuth(false)
    }
    fetchBookings()
    fetchRooms()

  },[])


  return <>
  <Auth>
  <div style={{display: "flex", width: '100%',justifyContent: 'space-between', paddingBlock: 20}}>
    <Typography variant="h4">Bookings</Typography>
    {!isAdmin && <Button onClick={handleOpen}>Create Booking</Button>}</div>
    {deletedBooking &&<Alert variant="filled" severity="error">
        Booking Deleted Successfully.
      </Alert>}
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell> Booking Id</StyledTableCell>
            <StyledTableCell align="right">Room Name</StyledTableCell>
            <StyledTableCell align="right">From</StyledTableCell>
            <StyledTableCell align="right">To</StyledTableCell>
            {isAdmin && <StyledTableCell align="right">User Name</StyledTableCell>}
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.room_name}</StyledTableCell>
              <StyledTableCell align="right">{row.start_datetime}</StyledTableCell>
              <StyledTableCell align="right">{row.end_datetime}</StyledTableCell>
              {isAdmin && <StyledTableCell align="right">{row.user_name}</StyledTableCell>}
              <StyledTableCell align="right">
              <Button type="button" color="error" onClick={()=> deleteBooking(row.id, row.event_id || null)}>Delete</Button>
              {googleAuth && (row.event_id == null ? <Button type="button" color="success" onClick={()=> addEventToGoogleCalender(row.id, row.room_name, row.start_datetime, row.end_datetime)}>Add Event to Google Calender</Button> 
              : <Button type="button" color="error" onClick={()=> deleteEventFromGoogleCalender(row?.event_id, row?.id)}>Remove Event from Google Calender</Button>)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography variant="h5">Create Room</Typography><br/>
        {error != '' && <Typography variant="body1" color="error">{error}</Typography>}
        <br/> 
        <form onSubmit={createBooking}>
      <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Room</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={selectedRoom}
    label="Room"
    onChange={(val) => setSelectedRoom(val.target.value)}
  >
    {rooms.map(data => <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>)}
  </Select>
</FormControl>
<Typography fullWidth>From date and time:</Typography>
<TextField type="date" value={fromDate} onChange={(e)=> setFromDate(e.target.value)} />
<TextField type="time" value={fromTime} onChange={(e)=> setFromTime(e.target.value)} />
<Typography fullWidth>To date and time:</Typography>
<TextField type="date" value={toDate} onChange={(e)=> setToDate(e.target.value)}/>
<TextField type="time" value={toTime} onChange={(e)=> setToTime(e.target.value)} />
<br/><br/>
      <Button
        variant="contained"
        color="primary"
        type="submit"
      >
        Create
      </Button>
    </form>
        </Box>
      </Modal>

    </Auth>
  </>;
};

export default Bookings;
