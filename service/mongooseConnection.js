var mongoose = require("mongoose");

const connection = () => {
    console.log("__________________________________");

    console.log(process.env.MONGO_URL);
    console.log("__________________________________");
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("connected"))
        .catch((e) => {
            console.log(e);
            console.log(process.env.MONGO_URL);
        });
};
module.exports = connection; 