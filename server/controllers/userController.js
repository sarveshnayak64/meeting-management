const { createUser, deleteUser, googleLogin } = require("../models/userModel");
const { login } = require("../models/userModel");
const { getUser} = require("../models/userModel")

module.exports = {
    get: async (req,res) => {
        const user = await getUser()
        res.json(user)
    },
    create: async (req, res) => {
        const {email, password, name} = req.body;
        const createdUser = await createUser(name, email, password);
        res.json(createdUser)
    },
    login: async (req, res) => {
        const {email, password} = req.body;
        const loggedIn = await login(email, password);
        res.json(loggedIn)
    },
    googleLogin: async (req, res) => {
        const {email, name, token} = req.body;
        const loggedIn = await googleLogin(email, name, token);
        res.json(loggedIn)
    },
    delete: async (req, res) => {
        const {id} = req.params;
        const deletedUser = await deleteUser(id);
        res.json(deletedUser)
    }
}