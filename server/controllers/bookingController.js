const { getBookings, createBooking, deleteBooking } = require("../models/bookingModel")

module.exports = {
    get: async (req,res) => {
        const booking = await getBookings()
        res.json(booking)
    },
    getById: async (req,res) => {
        const { id } = req.params;
        const booking = await getBookings(id)
        res.json(booking)
    },
    createBooking: async (req,res) => {
        const { roomId, fromDate, fromTime, toDate, toTime, userId } = req.body;
        const booking = await createBooking(roomId, fromDate, fromTime, toDate, toTime, userId)
        res.json(booking);
    },
    deleteBooking: async (req,res) => {
        const { id } = req.params

        const booking = await deleteBooking(id);
        res.json(booking)
    }
}