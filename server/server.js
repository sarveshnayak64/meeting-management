const express = require('express')
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const bookingRoute = require('./routes/bookingRoute');
const roomsRoute = require('./routes/roomsRoute');
const googleRoute = require('./routes/googleRoute');

const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);
app.use('/bookings', bookingRoute)
app.use('/rooms', roomsRoute)
app.use('/google', googleRoute)

const port = process.env?.PORT || 3000;
app.listen(port, () => {
    console.log('Listening at port :',port)
})