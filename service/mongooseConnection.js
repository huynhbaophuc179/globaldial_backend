var mongoose = require("mongoose");

const connection = () => {

    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("connected"))
        .catch((e) => {
            console.log(e);
            console.log(process.env.MONGO_URL);
        });
};
module.exports = connection; 