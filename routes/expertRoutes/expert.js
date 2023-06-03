var express = require('express');
const Expert = require('../../schema/expert');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('nothing here, request with an id query');
});
router.get('/:id', async function (req, res, next) {
    const { id } = res.params;
    const data = await Expert.findOne({ userId: id });
    if (data) {
        res.json({ status: 200, message: "Very Ok", data: data })
    }
});

module.exports = router;
