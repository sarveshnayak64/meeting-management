const db = require('../config/connection')
const moment = require('moment');
const {promisify} = require('util')

const promise_connection = promisify(db.query).bind(db)

exports.getBookings = async (id = null) => {
    try {
        
        let query = `
            SELECT 
                bookings.*, 
                rooms.name AS room_name, 
                users.name AS user_name
            FROM 
                bookings
            JOIN 
                rooms ON bookings.room_id = rooms.id
            JOIN 
                users ON bookings.user_id = users.id 
        `;
        if(id != null){
            query += ` AND users.id = ${id}`;
        }

        const rows = await promise_connection(query);

        const processedBookings = rows.map(booking => ({
            ...booking,
            
            start_datetime: moment(booking.start_datetime).format('DD-MM-YYYY h:mm A'),
            end_datetime: moment(booking.end_datetime).format('DD-MM-YYYY h:mm A'),
        }));

        return processedBookings;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw new Error('Could not fetch bookings');
    }
};

exports.createBooking = async (roomId, fromDate, fromTime, toDate, toTime, userId) => {
    try {
        const booking = new Booking(roomId, fromDate, fromTime, toDate, toTime);

        const overlapQuery = `
            SELECT * FROM bookings
            WHERE room_id = ?
            AND (
                (start_datetime <= ? AND end_datetime >= ?) OR
                (start_datetime <= ? AND end_datetime >= ?)
            );
        `;

        const overlappingBookings = await promise_connection(overlapQuery, [
            booking.room_id,
            booking.start_datetime, booking.start_datetime,
            booking.end_datetime, booking.end_datetime
        ]);

        if (overlappingBookings.length > 0) {
            return {
                status: false,
                message: "Room is already booked for the specified time period."
            };
        }

        const insertQuery = `
            INSERT INTO bookings (room_id, start_datetime, end_datetime, user_id)
            VALUES (?, ?, ?, ?);
        `;

        const result = await promise_connection(insertQuery, [
            booking.room_id,
            booking.start_datetime,
            booking.end_datetime,
            userId
        ]);

        return {
            status: true,
            message: "Booking Created Successfully",
            bookingId: result.insertId
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        return {
            status: false,
            message: "Failed to create booking"
        }
    }
};

class Booking {
    constructor(roomId, fromDate, fromTime, toDate, toTime) {
        this.room_id = roomId;
        this.start_datetime = this.combineDateTimeToISO(fromDate, fromTime);
        this.end_datetime = this.combineDateTimeToISO(toDate, toTime);
    }

    combineDateTimeToISO(date, time) {
        return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toISOString();
    }
}

exports.deleteBooking = async (id) => {
    try {
        const checkQuery = 'DELETE FROM bookings WHERE id = ?';
        const existingBooking = await promise_connection(checkQuery, [id]);

        if (existingBooking) {
            return {
                status: true,
                message: "Deleted booking successfully"
            };
        }else{
            return {
                status: false,
                message: "Failed to delete booking"
            };
        }

    } catch (error) {
        console.error('Error creating room:', error);
        return {
            status: false,
            message: "Failed to delete room"
        };
    }
};

