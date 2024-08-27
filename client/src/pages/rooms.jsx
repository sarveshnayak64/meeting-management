import React, { useEffect, useState } from "react";

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Auth from "../components/Auth";
import { Alert, TextField } from "@mui/material";
import axios from "axios";

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


const Rooms = () => {
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false);
  const [deletedRoom, setDeletedRoom] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchRooms = () =>{
    axios.get('http://localhost:5000/rooms').then(data => {
      console.log(data)
      setRows(data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const deleteRoom = (id) =>{
    axios.delete('http://localhost:5000/rooms/'+id).then(data =>{
      fetchRooms();
      setDeletedRoom(true)
      setTimeout(()=>{
        setDeletedRoom(false)
      }, 1000)
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const createRoom = (e) =>{
    e.preventDefault();

    axios.post('http://localhost:5000/rooms', {
      name: name
    })
    .then(data => {
      console.log(data.data)
      if(data?.data?.status){
        setOpen(false)
        fetchRooms();
      }else{
        setError(data?.data?.message)
      }
    })
    .catch(err => {
      setError('Failed to create user')
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchRooms()
  }, [])
  return <>
  <Auth>
  <div style={{display: "flex", width: '100%',justifyContent: 'space-between', paddingBlock: 20}}>
    <Typography variant="h4">Rooms</Typography> 
    <Button onClick={handleOpen}>Create Room</Button></div>
    {deletedRoom &&<Alert variant="filled" severity="error">
        Room Deleted Successfully.
      </Alert>}
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell> Room Id</StyledTableCell>
            <StyledTableCell align="right">Room Number</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right"><Button type="button" color="error" onClick={()=>deleteRoom(row.id)}>Delete</Button></StyledTableCell>
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
        <Typography variant="h5">Create Room</Typography>
        <form onSubmit={createRoom}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(val) => setName(val.target.value)}
      />
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

export default Rooms;
