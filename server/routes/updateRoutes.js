var express = require('express');

const upload = require("../utils/cloudinary");
var { validateToken } = require('../middleware/authenticate');
var {updateRequest , updateUser} = require("../controllers/updateControllers")

var router = express.Router();

//Routes
router.put('/update', validateToken, updateRequest)
router.put('/:id', validateToken,upload.single("photoURL"), updateUser);

module.exports = router;
