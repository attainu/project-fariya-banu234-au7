const Request = require('../models/request');
const User = require("../models/user");
const Group = require("../models/group");
const Chat = require("../models/chat");
const Single = require("../models/single")

module.exports={
    async userRegister(req, res) {
        
        try {
            
            if (req.file && req.file.path) {
                req.body.photoURL = req.file.path;
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            await User.create({ ...req.body });
            return res.json({ success: true, message: 'user register successfully' })
        } catch (error) {
            console.log(error);
            if (error.code === 11000) {
                return res.status(400).json({ error: "Email Id is already exisits" });
            }
            res.status(400).send(error);
        }
    },
    async userLogin(req, res) {
        
        try {
            
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "User does not exists" })
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(404).json({ error: "Invalid Password" });
            }
            var token = await createToken(user);
            // storing token in cookie
            res.cookie('token', token);
            return res.json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id,
                photoURL: user.photoURL,
                token: token
            });
        } catch (error) {
            console.log(error)
            if (error.name === "MongoError") {
                return res.status(400).send(`Validation Error: ${error.message}`)
            }
            res.status(400).send(error);

        }
    },
    async Changepassword(req, res) {
        // this is for change password.
        try {
            const resetToken = req.body.resetToken;
            const email = req.body.email;
            const newPassword = req.body.password
            console.log(req.body);

            console.log(resetToken)
            const user = await User.findOne({ email });
            console.log(user.resetToken)
            console.log(user)
            if (resetToken !== user.resetToken) {
                return res.status(404).json({ error: "INVALID OTP, check your email again" });
            }
            const passwordnew = await bcrypt.hash(newPassword, 10)
            console.log(passwordnew)
            await User.updateOne({ _id: user._id }, { password: passwordnew });
            return res.status(200).json({ message: "You have successfully changed your password" })
        } catch (error) {
            console.log(error)

        }
    },
    async searchUser(req, res) {
        // this is for search a user by id.
        try {
            console.log(req.body)
            var result = await User.find({ $or: [{ firstName: { "$regex": req.body.searchQuery, "$options": "i" } }, { lastName: { "$regex": req.body.searchQuery, "$options": "i" } }] }, { firstName: 1, lastName: 1 });
            return res.json(result);
        } catch (error) {
            // console.log(error)
            return res.status(400).json(error);
        }
    },
    async forgotPassword(req, res) {
        // this is for forgot password.
        try {
            var email = req.body.email;
            // there we create token for send on email.
            var token = Math.floor((Math.random() * 1000000) + 1);
            // there we find email.
            var user = await User.findOne({ email })
            if (user) {
                // there we send token on email.
                await sendMail({
                    to: email,
                    subject: 'Forgot Password',
                    body: `<h4>Hi ${user.firstName}</h4>
                            <p>You have requested for forgot password, your otp is ${token} to reset password <p>
                            <br /> <br />
                            <p>regards <br /> Chat App Team</p>`
                });
                await User.updateOne({ _id: user._id }, { resetToken: token });

                res.json({ "message": "otp is sent successfully" });

            } else {
                res.status(400).json({ "error": "email not found" })
            }
        } catch (error) {

            console.log(error)
        }
    },
    async sendRequest(req, res) {
        // this is for send request for single and group both.
        try {
            let query = { receiver: req.body.receiver };
            // there we check request for single chat or group chat.
            if (req.body.groupId) {
                query.groupId = req.body.groupId;
            }
            else {
                query.sender = req.body.sender
            }
            const data = await Request.findOne(query);

            if (data !== null) {
                return res.status(400).json({ error: "request already sent" })
            }

            await Request.create({ ...req.body });
            return res.json({ message: 'request sent successfully' });

        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'failed to send request' })
        }
    },
    async createGroup(req, res) {
        //  create group and  add owner id .
        try {
            const result = await Group.create({ ...req.body, owner: req.user.id })
            console.log(result)
            return res.json({ success: true, message: 'Group created successfully' })
        } catch (error) {
            console.log(error);
            if (error.name === "MongoError") {
                return res.status(400).send(`Validation Error: ${error.message}`)
            }
            res.status(400).send(error);
        }

    }
}