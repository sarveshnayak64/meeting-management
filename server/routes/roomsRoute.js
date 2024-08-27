const express = require("express")
const router = express.Router()
const roomsController = require("../controllers/roomsController");

router.get('/', roomsController.get);
router.post('/', roomsController.post);
router.delete('/:id', roomsController.delete);

module.exports = router