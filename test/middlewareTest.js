const middleware = require("../src/middleware");
const crypto = require("crypto");
const expect = require("chai").expect;

describe("middleware", function () {
    describe("signedNotification", function () {
        const hubSecret = "secret";
        const generateReq = (headerHash, body) => {
            return {
                header: (key) => key === "X-Hub-Signature" ? headerHash : null,
                body
            }
        };

        const generateRes = (expectedStatus, done) => {
            return {
                sendStatus: (statusCode) => {
                    expect(statusCode).to.be.eql(expectedStatus);
                    done();
                }
            }
        };

        it("Accepts matching hashes", function (done) {
            const body = {
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            };
            const req = generateReq(crypto.createHmac("sha1", hubSecret).update(JSON.stringify(body)).digest("hex"), body);
            middleware.signedNotification(hubSecret)(req, generateRes(), (err) => {
                expect(err).to.not.be.ok;
                done();
            });
        });

        it("Returns 400 if sha doesn't match", function (done) {
            const body = {
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            };
            const req = generateReq(crypto.createHmac("sha1", "wrongSecret").update(JSON.stringify(body)).digest("hex"), body);
            middleware.signedNotification(hubSecret)(req, generateRes(400, done), () => {
                throw new Error("Should have been redirected with 400");
            });
        });

        it("Returns 400 if there is no header", function (done) {
            const body = {
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            };
            const req = generateReq(null, body);
            middleware.signedNotification(hubSecret)(req, generateRes(400, done), () => {
                throw new Error("Should have been redirected with 400");
            });
        });
    });
});
