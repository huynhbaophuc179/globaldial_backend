var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/:uid', function (req, res, next) {
  const { uid } = req.params
  console.log(uid);
  req.auth
    .getUser(uid)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      res.json(userRecord)
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      res.end("error")
    });
});

module.exports = router;
