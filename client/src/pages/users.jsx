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

import axios from 'axios'
import { Alert, TextField } from "@mui/material";

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


const Users = () => {
  
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [deletedUser, setDeletedUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchUsers = () =>{
    axios.get('https://meeting-management.onrender.com/user').then(data =>{
      setRows(data?.data)
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const deleteUser = (id) =>{
    axios.delete('https://meeting-management.onrender.com/user/'+id).then(data =>{
      fetchUsers();
      setDeletedUser(true)
      setTimeout(()=>{
        setDeletedUser(false)
      }, 1000)
      console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const createUser = (e) =>{
    e.preventDefault();
    setIsLoading(true)

    axios.post('https://meeting-management.onrender.com/user/create', {
      email: email,
      password: password,
      name: name
    })
    .then(data => {
      setIsLoading(false)
      console.log(data.data)
      if(data?.data?.status){
        setOpen(false)
        fetchUsers();
      }else{
        setError(data?.data?.message)
      }
    })
    .catch(err => {
      setIsLoading(false)
      setError('Failed to create user')
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchUsers()
  }, [])

  return <>
  <Auth>
    <div style={{display: "flex", width: '100%',justifyContent: 'space-between', paddingBlock: 20}}>
    <Typography variant="h4">Users</Typography> 
    <Button onClick={handleOpen}>Create User</Button></div>
    {deletedUser &&<Alert variant="filled" severity="error">
        User Deleted Successfully.
      </Alert>}
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell> User Id</StyledTableCell>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">Email Id</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right">{row.email_id}</StyledTableCell>
              <StyledTableCell align="right"><Button type="button" color="error" onClick={()=>deleteUser(row.id)}>Delete</Button></StyledTableCell>
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
        <Typography variant="h5">Create User</Typography>
        {error != '' && <Typography variant="body1" color="error">{error}</Typography>}
          <form onSubmit={createUser}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        onChange={(val) => setName(val.target.value)}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        type="email"
        required
        onChange={(val) => setEmail(val.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        required
        onChange={(val) => setPassword(val.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isLoading}
      >
        Create
      </Button>
          </form>
        </Box>
      </Modal>

      </Auth>
  </>;
};

export default Users;
