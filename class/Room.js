const Validator = require("../utils/Validator");




class Room {
    constructor(roomId, socket1) {
        this.room = roomId
        this.socket1 = socket1
        this.socket2 = null
    }
    //create the index for the room map of the inputed language
    //create one if doesn't exist, return false if does


}
module.exports = Room