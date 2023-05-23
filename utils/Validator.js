class Validator {
    constructor() { }
    isValidString(variable) {
        return typeof variable === 'string' && variable.trim() !== '';
    }
    trim(variable) {
        if (this.isValidString(variable)) {
            return this.trim(variable);
        }
        return variable
    }

}

module.exports = new Validator()