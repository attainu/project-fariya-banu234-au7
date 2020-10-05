var express = require('express');
var router = express.Router();
var { validateToken } = require('../middleware/authenticate');
var {getChats,
    getAllRequest,
    findFriends,
    findMessage,
    findSingleChat,
    getoneUser,
    getallUser,
    findGroup} = require("../controllers/getControllers");



router.get("/:groupId", validateToken, findMessage);
router.get("/single/:friendId", validateToken, findSingleChat);
router.get("/find", validateToken, findGroup);
router.get("/friend", validateToken, findFriends);
router.get("/all", validateToken, getAllRequest);
router.get("/", validateToken, getChats);
router.get('/alluser', validateToken, getallUser);
router.get("/friend", validateToken, findFriends);
router.get('/:id', validateToken, getoneUser);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

module.exports = router;