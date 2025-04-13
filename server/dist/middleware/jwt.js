"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const response_1 = require("../helpers/response");
const handleJwt_1 = require("../helpers/handleJwt");
const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];
    if (!token) {
        (0, response_1.response)({ success: false, message: "Token Error" }, 401, res);
        return;
    }
    try {
        const payload = (0, handleJwt_1.verifyJwtToken)(token);
        if (!req.body) {
            req.body = {};
        }
        // Attach the payload to the request body for later use
        req.body.jwtPayload = payload;
        next();
    }
    catch (err) {
        console.error(err);
        (0, response_1.response)({ success: false, message: "Server Error" }, 500, res);
        return;
    }
};
exports.jwtMiddleware = jwtMiddleware;
//# sourceMappingURL=jwt.js.map