const crypto = require("crypto");
const middleware = module.exports = {};

middleware.verifyHmac = (hubSecret) => (req, res, buf, encoding) => {
    if (hubSecret) {
        const hashHeader = req.header("X-Hub-Signature");
        if (!hashHeader) {
            return res.sendStatus(400);
        }

        const hash = hashHeader.substring(hashHeader.indexOf("sha1=") + 1);
        const hmac = crypto.createHmac("sha1", hubSecret);
        hmac.update(buf, encoding);
        if (hash !== hmac.digest("hex")) {
            return res.sendStatus(400);
        }
    }
};
