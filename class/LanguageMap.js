const Validator = require("../utils/Validator");
const TopicMap = require("./TopicMap");

class languageMap extends Map {
    constructor() {
        super();
        this.set("default", new TopicMap());
    }
    //create the index for the room map of the inputed language
    //create one if doesn't exist, return false if does
    createLanguage(language) {
        if (Validator.isValidString(language) && !this.has(language)) {
            this.set(language, new TopicMap())
            return true
        }
        else return false

    }

}
module.exports = languageMap