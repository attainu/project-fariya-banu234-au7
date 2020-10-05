var express = require('express');
var { validateToken } = require('../middleware/authenticate');
var {userLogout} = require('../controllers/deleteControllers')
var router = express.Router();

router.delete("/logout",validateToken, userLogout);

module.exports = router;