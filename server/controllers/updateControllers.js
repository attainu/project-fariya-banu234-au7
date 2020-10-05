const Request = require('../models/request');
const User = require("../models/user");
const Group = require("../models/group");
const Chat = require("../models/chat");
const Single = require("../models/single");

module.exports = {
    async updateRequest(req, res) {
        
        console.log(req.body)
        try {
            await Request.updateOne({ _id: req.body.id }, { ...req.body })
            
    // when user accept the request update user data and when reject the request update request data.
            if (req.body.isAccepted === true) {
                console.log(req.body);
                let query = [];
                if (req.body.friend) {
                    query = [
                        User.updateOne({ _id: req.user.id }, { $addToSet: { friends: req.body.friend } }),
                        User.updateOne({ _id: req.body.friend }, { $addToSet: { friends: req.user.id } }),
                    ]
                } else {
                    query = [
                        User.updateOne({ _id: req.user.id }, { $addToSet: { group: req.body.groupId } }),
                        Group.updateOne({ _id: req.body.groupId }, { $addToSet: { member: req.user.id } }),
                    ]
                }
                const data = await Promise.all(query);
            }
            return res.json({ message: "update success" })
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: "failed to updated request" })
        }
    },
    async updateUser(req, res) {
        try {
            if (req.file && req.file.path) {
                req.body.photoURL = req.file.path;
            }
            else {
                if (req.body.photoURL === "null") {
                    req.body.photoURL = null;
                }
            }
            await User.updateOne({ _id: req.params.id }, req.body);
            return res.json(req.body)
        } catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    }
}