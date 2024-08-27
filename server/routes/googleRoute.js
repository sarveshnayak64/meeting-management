const express = require("express")
const router = express.Router()
const googleController = require("../controllers/googleController");

router.post('/create-event',googleController.createEvent);
router.post('/delete-event', googleController.deleteEvent);

module.exports = router