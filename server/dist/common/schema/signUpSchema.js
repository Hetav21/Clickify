"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.passwordValidation = exports.emailValidation = void 0;
const zod_1 = require("zod");
const regex_1 = require("../regex");
exports.emailValidation = zod_1.z
    .string()
    .email({ message: "Invalid email address" })
    .regex(regex_1.emailRegex, "Invalid email address");
exports.passwordValidation = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(regex_1.passwordRegex, "Password must contain at least one digit, one lowercase letter, one uppercase letter");
exports.signUpSchema = zod_1.z.object({
    email: exports.emailValidation,
    password: exports.passwordValidation,
});
//# sourceMappingURL=signUpSchema.js.map