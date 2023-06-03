const Validator = require("../utils/Validator")
const connectionQueue = require("./ConnectionQueue")
const Topic = require('../schema/topic');
const PLANS = require("../constants/plans");


class topicMap extends Map {
    constructor() {
        super();
        this.set("default", new connectionQueue())
        Topic.find({}).then(
            (topicData) => {
                topicData.forEach(element => {
                    console.log(element.name);
                    this.set(element._id.toString(), new connectionQueue())
                });
            }

        )

    }


    //create the index for the queue of the inputed room
    //create one if doesn't exist, return false if does
    //deprecated
    createTopic(room) {
        if (Validator.isValidString(room) && !this.has(room)) {
            this.set(room, new connectionQueue())
            return true
        }
        else return false
    }
}
module.exports = topicMap