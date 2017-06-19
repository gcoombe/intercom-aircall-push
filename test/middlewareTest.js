const middleware = require("../src/middleware");
const crypto = require("crypto");
const expect = require("chai").expect;
const HmacValidationError = require("../src/hmacValidationError");

describe("middleware", function () {
    describe("verifyHmac", function () {
        const hubSecret = "secret";
        const generateReq = (headerHash) => {
            return {
                header: (key) => key === "X-Hub-Signature" ? headerHash : null
            }
        };


        it("Accepts matching hashes", function () {
            const body = JSON.stringify({
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            });
            const req = generateReq("sha1=" + crypto.createHmac("sha1", hubSecret).update(body).digest("hex"));
            expect(middleware.verifyHmac(hubSecret).bind(null, req, {}, Buffer.from(body))).to.not.throw();
        });

        it("Returns 400 if sha doesn't match", function () {
            const body = JSON.stringify({
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            });
            const req = generateReq("sha1=" + crypto.createHmac("sha1", "wrongSecret").update("sha1=" + body).digest("hex"));
            expect(middleware.verifyHmac(hubSecret).bind(null, req, {}, Buffer.from(body))).to.throw(HmacValidationError);
        });

        it("Returns 400 if there is no header", function () {
            const body = JSON.stringify({
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            });
            const req = generateReq();
            expect(middleware.verifyHmac(hubSecret).bind(null, req, {}, Buffer.from(body))).to.throw(HmacValidationError);

        });
    });
});
