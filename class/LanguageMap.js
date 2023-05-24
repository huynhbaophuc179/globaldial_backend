const Validator = require("../utils/Validator");
const RoomMap = require("./TopicMap");

class languageMap extends Map {
    constructor() {
        super();
        this.set("default", new RoomMap());
    }
    //create the index for the room map of the inputed language
    //create one if doesn't exist, return false if does
    createLanguage(language) {
        if (Validator.isValidString(language) && !this.has(language)) {
            this.set(language, new RoomMap())
            return true
        }
        else return false

    }

}
module.exports = languageMap