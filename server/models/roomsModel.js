const connection = require('../config/connection')
const {promisify} = require('util')

const promise_connection = promisify(connection.query).bind(connection)

exports.getRooms = async ()=>{

    let query = "SELECT * FROM rooms"
    return await promise_connection(query);
}

exports.createRoom = async (roomName) => {
    try{
        const checkQuery = 'SELECT * FROM rooms WHERE name = ?';
        const [existingRoom] = await promise_connection(checkQuery, [roomName]);
        
        if (existingRoom || existingRoom?.length > 0) {
            return {
                status: false,
                message: "Room already exists"
            };
        }

       const insertQuery = `
            INSERT INTO rooms (name)
            VALUES (?)
        `;

        const result = await promise_connection(insertQuery, [roomName]);

        return {
            status: true,
            message: "Room Created Successfully",
            id: result.insertId
        }; 
    }catch(err){
        return {
            status: false,
            message: "failed to add room",
        }; 
    }
    
}
exports.deleteRoom = async (id) => {
    try {
        const checkQuery = 'DELETE FROM rooms WHERE id = ?';
        const existingRoom = await promise_connection(checkQuery, [id]);

        if (existingRoom) {
            return {
                status: true,
                message: "Deleted room successfully"
            };
        }else{
            return {
                status: false,
                message: "Failed to delete room"
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