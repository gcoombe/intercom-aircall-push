
module.exports = class HmacValicationError extends Error {
    constructor(message) {
        super(message);
        this.name = "HmacValicationError";
    }
};
