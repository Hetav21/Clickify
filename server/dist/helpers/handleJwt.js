"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = generateJwtToken;
exports.verifyJwtToken = verifyJwtToken;
const jsonwebtoken_1 = require("jsonwebtoken");
function generateJwtToken(user) {
    return ("Bearer " +
        (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, process.env.JWT_SECRET || "0000"));
}
function verifyJwtToken(token) {
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        return payload;
    }
    catch (err) {
        console.error(err);
        throw new Error("Invalid token");
    }
}
//# sourceMappingURL=handleJwt.js.map