const Request = require('../models/request');
const User = require("../models/user");
const Group = require("../models/group");
const Chat = require("../models/chat");
const Single = require("../models/single");

module.exports = {
    async getChats(req, res) {
        console.log(req.body)
        try {
            const data = await Single.find({ _id: req.params.id })
            return res.json(data)

        } catch (error) {
            console.log(error)

        }
    },
    async getAllRequest(req, res) {
        // this is for find all request for particular user.
        try {
            var result = await request.find({ receiver: req.user.id, isAccepted: false, isReject: false }, { sender: 1, groupId: 1 }).populate('sender', ['firstName', 'lastName', 'photoURL']).populate('groupId', ['photoURL', 'groupName']).exec();
            res.json(result)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    },
    async findFriends(req, res) {
        // this is for find friend.
        try {
            if (req.user.id) {
                var result = await User.findOne({ _id: req.user.id }, { friends: 1, _id: 0 }).populate("friends").exec();
                return res.json(result)
            } else {
                res.status(400).json({ error: "Not a valid token" })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: "Not able to find friend" })

        }
    },
    async findMessage(req, res) {
        try {
            const data = await Chat.find({ groupId: req.params.groupId })
            return res.json(data)

        } catch (error) {
            console.log(error)

        }
    },
    async findSingleChat(req, res) {
        // this is for find all mesage in single chat by user id and friend id.
        let chatId = "";
        if (req.user.id > req.params.friendId) {
            chatId = req.user.id + '-' + req.params.friendId;
        } else {
            chatId = req.params.friendId + '-' + req.user.id;
        }

        console.log(chatId)
        try {
            const data = await Chat.find({ chatId });
            return res.json(data)
        } catch (error) {
            console.log(error)

        }

    },
    async getoneUser(req, res) {
        // this is for get one user data by id.
        try {
            var result = await User.findOne({ _id: req.params.id }).populate('friends').populate('group').exec()
            res.json(result);
        } catch (error) {
            console.log(error)
            res.status(400).send(error)

        }
    },
    async getallUser(req, res) {
        // this is for get all user data.
        try {
            var result = await User.find();
            const user = result.find(u => u._id == req.user.id);
            // there we fillter all friend for particular user.
            let filteredUser = result;
            if (user.friends && user.friends.length > 0) {
                user.friends.push(user._id);
                filteredUser = result.filter((r) => !user.friends.includes(r._id))
            }
            res.json(filteredUser)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)

        }
    },
    async findGroup(req, res) {
        // this is for find all group for particular user.
        try {
            var result = await Group.find({ $or: [{ owner: req.user.id }, { member: req.user.id }] });
            return res.json(result)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: "Not able to find friends" })
        }
    }
}