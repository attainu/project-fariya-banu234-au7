var express = require('express');

const upload = require("../utils/cloudinary");
var { validateToken } = require('../middleware/authenticate');
var {userRegister,
    userLogin, 
    Changepassword,
    searchUser,
    forgotPassword,
    sendRequest,
    createGroup} = require("../controllers/postControllers")

var router = express.Router();

router.post("/register", upload.single("photoURL"), userRegister);
router.post('/login', userLogin);
router.post('/Changepassword', Changepassword);
router.post("/search",searchUser)
router.post("/forgotpassword", forgotPassword);
router.post('/', validateToken, sendRequest);
router.post("/", validateToken, createGroup)

module.exports = router;
