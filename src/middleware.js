const crypto = require("crypto");
const HmacValidationError = require("./hmacValidationError");
const middleware = module.exports = {};

middleware.verifyHmac = (hubSecret) => (req, res, buf, encoding) => {
    if (hubSecret) {
        const hashHeader = req.header("X-Hub-Signature");
        if (!hashHeader) {
            throw new HmacValidationError("No hub signature found in header");
        }

        const hash = hashHeader.substring(hashHeader.indexOf("sha1=") + 1);
        const hmac = crypto.createHmac("sha1", hubSecret);
        hmac.update(buf, encoding);
        if (hash !== hmac.digest("hex")) {
            throw new HmacValidationError("Signature did not match evaluated hmac");
        }
    }
};
