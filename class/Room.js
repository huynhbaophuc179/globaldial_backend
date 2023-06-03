const Validator = require("../utils/Validator");




class Room {
    constructor(roomId, socket1) {
        this.room = roomId
        this.socket1 = socket1
        this.socket2 = null
    }
    //create the index for the room map of the inputed language
    //create one if doesn't exist, return false if does
    size() {
        let size = 0

        if (this.socket1) { size++ }

        if (this.socket2) { size++ }
        return size

    }
    isAvailable() {
        if (this.size === 0 || this.size === 2) {
            return false

        }
        else if (this.socket1 === true) {
            return true

        }
        return false

    }

}
module.exports = Room