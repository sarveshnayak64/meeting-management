const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController");

router.get('/', bookingController.get);
router.get('/:id',bookingController.getById);
router.post('/',bookingController.createBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router