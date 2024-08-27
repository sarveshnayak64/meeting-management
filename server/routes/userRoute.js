const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController");

router.get('/', userController.get)
router.post('/login', userController.login)
router.post('/create', userController.create)
router.post('/googleLogin', userController.googleLogin) 
router.delete('/:id', userController.delete) 


module.exports = router