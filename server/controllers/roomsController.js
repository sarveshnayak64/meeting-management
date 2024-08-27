const { getRooms, createRoom, deleteRoom } = require("../models/roomsModel")

module.exports = {
    get: async (req,res) => {
        const rooms = await getRooms()
        res.json(rooms)
    },
    post: async (req,res) => {
        const {name} = req.body
        const room = await createRoom(name)
        res.json(room)
    },
    delete: async (req, res) => {
        const {id} = req.params;
        const deletedRoom = await deleteRoom(id);
        res.json(deletedRoom)
    } 
}