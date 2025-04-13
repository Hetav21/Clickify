"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCodeRegex = exports.passwordRegex = exports.emailRegex = void 0;
// Regex for email validation
exports.emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
// Regex for password validation
// min 8 character long
// At least one digit, one lowercase letter, one uppercase letter
// Can contain special characters
exports.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
// Regex for verify code validation
// Only numbers, length 6
exports.verifyCodeRegex = /^[0-9]{6}$/;
//# sourceMappingURL=regex.js.map