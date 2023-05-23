const Validator = require("../utils/Validator")
const connectionQueue = require("./ConnectionQueue")

class roomMap extends Map {
    constructor() {
        super();
        this.set("default", new connectionQueue())

    }
    //create the index for the queue of the inputed room
    //create one if doesn't exist, return false if does
    createRoom(room) {
        if (Validator.isValidString(room) && !this.has(room)) {
            this.set(room, new connectionQueue())
            return true
        }
        else return false
    }
}
module.exports = roomMap