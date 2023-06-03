



var express = require('express');
var router = express.Router();
var User = require("../schema/user");
const jwt = require('jsonwebtoken');
/* GET users listing. */

router.post('/', async function refreshToken(req, res) {
    try {
        // Extract the refresh token from the request body
        const { refreshToken } = req.body;

        // Verify the refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const existingToken = await refreshToken.findOne({ token: refreshToken });
        if (existingToken) {
            const accessToken = jwt.sign(
                { _id: existingToken.userId },
                process.env.JWT_SECRET_AT,
                { expiresIn: 60 * 60 * 2 }
            );
            return res
                .status(200)
                .json({ status: 200, message: "OK", data: [{ accessToken }] });
        } else {
            return res
                .status(401)
                .json({ status: 401, message: "Refresh Token expired", data: [] });
        }
    } catch (error) {
        // If the refresh token is invalid, return a 401 Unauthorized response with an error message
        res
            .status(401)
            .json({ status: 401, message: "Invalid refresh token", data: [] });
    }
}

);

module.exports = router;