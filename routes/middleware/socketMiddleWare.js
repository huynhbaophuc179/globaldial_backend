

const jwt = require('jsonwebtoken');

class socketMiddleWare {
    validateAccessToken = (socket, next) => {
        // Get the authorization header from the request
        const authHeader = socket.handshake.auth.token;
        // const authHeader = req.headers.authorization;
        // nếu không có tokena
        console.log(authHeader);
        if (authHeader) {
            // Split the authorization header into the token type and token value
            // const [bearer, token] = authHeader.split(" ");
            // console.log(token);

            try {
                // Verify the access token using the secret key
                const decoded = jwt.verify(authHeader, process.env.JWT_SECRET_AT);

                // Attach the decoded token to the request object for use by route handlers
                socket.userId = decoded.userId;
                socket.plan = decoded.plan;
                socket.role = decoded.role;
                // Call the next middleware function
                next();
            } catch (error) {
                console.log(error);
                console.log("InvalidToken");
                // If the token is invalid, return a 401 Unauthorized response
                next(new Error("InvalidToken"));
            }


        }
        else {
            console.log("MissingToken");
            // If the authorization header is missing, return a 401 Unauthorized response
            next(new Error("MissingToken"));
        }
    };
    // getUserId = (req, res, next) => {
    //     // Get the authorization header from the request
    //     const authHeader = req.headers.authorization;
    //     // nếu không có token
    //     console.log(authHeader);
    //     if (authHeader) {
    //         // Split the authorization header into the token type and token value
    //         const [bearer, token] = authHeader.split(" ");
    //         console.log(token);
    //         if (bearer === "Bearer" && token) {
    //             try {
    //                 // Verify the access token using the secret key
    //                 const decoded = jwt.verify(token, process.env.JWT_SECRET_AT);

    //                 // Attach the decoded token to the request object for use by route handlers
    //                 req.userId = decoded.userId;

    //                 // Call the next middleware function
    //                 next();
    //             } catch (error) {
    //                 // If the token is invalid, return a 401 Unauthorized response
    //                 res
    //                     .status(401)
    //                     .json({ status: 401, message: "Invalid access token", data: [] });
    //             }
    //         } else {
    //             // If the authorization header format is invalid, return a 400 Bad Request response
    //             res.status(400).json({
    //                 status: 400,
    //                 message: "Malformed authorization header",
    //                 data: [],
    //             });
    //         }
    //     } else {
    //         // If the authorization header is missing, return a 401 Unauthorized response
    //         next();
    //     }
    // }
}

const middleWare = new socketMiddleWare();
module.exports = middleWare;
