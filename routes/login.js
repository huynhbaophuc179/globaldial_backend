var express = require('express');
var router = express.Router();
var User = require("../schema/user");
/* GET users listing. */

router.post('/', async function (req, res, next) {
    try {
        const { uidFirebase } = req.body
        console.log(uidFirebase);
        const UserRecord = await req.auth.getUser(uidFirebase)
        console.log("Logged in");
        const userMongoData = await User.findOne({ uidFirebase: UserRecord.uid })
        console.log(userMongoData);
        if (userMongoData) {
            console.log("old user detected");
            return res.json({
                status: 200,
                message: "Success",
                data: userMongoData[0]

            })
        } else {
            console.log("create new user");
            const newUser = new User({
                username: UserRecord.email.split("@")[0],
                displayName: UserRecord.displayName,
                email: UserRecord.email,
                uidFirebase: UserRecord.uid,
                photoUrl: UserRecord.photoUrl,
                phoneNumber: UserRecord.phoneNumber
            })
            const save = await newUser.save()
            console.log(save);
            return res.json({
                status: 200,
                message: "Success",
                data: UserRecord

            })
        }
    }
    catch (error) {
        console.log('Error fetching user data:', error);
        res.json({
            status: 500,
            message: "Internal Server Error",
            data: []
        })
    };
});

module.exports = router;
