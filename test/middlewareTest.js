const middleware = require("../src/middleware");
const crypto = require("crypto");
const expect = require("chai").expect;
const sinon = require("sinon");

describe("middleware", function () {
    describe("verifyHmac", function () {
        const hubSecret = "secret";
        const generateReq = (headerHash) => {
            return {
                header: (key) => key === "X-Hub-Signature" ? headerHash : null
            }
        };

        const generateRes = (expectedStatus) => {
            return {
                sendStatus: sinon.spy((statusCode) => {
                    expect(statusCode).to.be.eql(expectedStatus);
                })
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
            const req = generateReq(crypto.createHmac("sha1", hubSecret).update(body).digest("hex"));
            const res = generateRes();
            middleware.verifyHmac(hubSecret)(req, res, Buffer.from(body));
            sinon.assert.notCalled(res.sendStatus);
        });

        it("Returns 400 if sha doesn't match", function () {
            const body = JSON.stringify({
                data: {
                    item: {
                        email: "test@test.com"
                    }
                }
            });
            const req = generateReq(crypto.createHmac("sha1", "wrongSecret").update(body).digest("hex"));
            let res = generateRes(400);
            middleware.verifyHmac(hubSecret)(req, res, Buffer.from(body));
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 400);
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
            let res = generateRes(400);
            middleware.verifyHmac(hubSecret)(req, res, Buffer.from(body));
            sinon.assert.calledOnce(res.sendStatus);
            sinon.assert.calledWith(res.sendStatus, 400);
        });
    });
});
