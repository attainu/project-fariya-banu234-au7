const Request = require('../models/request');
const User = require("../models/user");
const Group = require("../models/group");
const Chat = require("../models/chat");
const Single = require("../models/single");

module.exports = {
    async userLogout(req, res) {
        // this is for logout the user.
        try {
            // there we clear all data in cookie.
            res.cookie('token', { expires: Date.now() });
            return res.json({ message: "logged out" })
        } catch (error) {
            console.log(error)
            res.status(400).send(error)

        }
    }
}