var express = require('express');
var router = express.Router();
var User = require("../schema/user");
const jwt = require('jsonwebtoken');
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
            const accessToken = jwt.sign(
                { userId: userMongoData._id },
                process.env.JWT_SECRET_AT,
                {
                    expiresIn: 60 * 2 * 60,
                }
            );
            console.log("Token");
            console.log(accessToken);
            return res.json({
                status: 200,
                message: "Success",
                data: { userData: userMongoData, accessToken: accessToken }

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
            if (save) {
                const accessToken = jwt.sign(
                    { userId: save._id },
                    process.env.JWT_SECRET_AT,
                    {
                        expiresIn: 60 * 2 * 60,
                    }
                );
                console.log("Token");
                console.log(accessToken);
                return res.json({
                    status: 200,
                    message: "Success",
                    data: { userRecord: UserRecord, accessToken: accessToken }

                })
            }
            else {
                return res.status(500).json({
                    status: 500,
                    message: "Login Failed, Server Error",
                    data: {}

                })

            }
        }
    }
    catch (error) {
        console.log('Error fetching user data:', error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: []
        })
    };
});

module.exports = router;