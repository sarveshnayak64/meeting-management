const { createEvent, deleteEvent } = require("../models/googleModel")

module.exports = {
    createEvent: async (req,res) => {
        const {token, id, room, from, to} = req.body
        const response = await createEvent(token, id, room, from, to)
        res.json(response)
    },
    deleteEvent: async (req,res) => {
        const {token, eventId, id} = req.body
        const response = await deleteEvent(token, eventId, id)
        res.json(response)
    },
}