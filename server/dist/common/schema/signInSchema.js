"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = void 0;
const zod_1 = require("zod");
const signUpSchema_1 = require("./signUpSchema");
exports.signInSchema = zod_1.z.object({
    email: signUpSchema_1.emailValidation,
    password: signUpSchema_1.passwordValidation,
});
//# sourceMappingURL=signInSchema.js.map