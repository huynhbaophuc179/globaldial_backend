var express = require('express');
var router = express.Router();
const TopicController = require("../controller/topicController")

router.get('/', TopicController.getTopic)
router.get('/:id', TopicController.getTopicId)


module.exports = router;
