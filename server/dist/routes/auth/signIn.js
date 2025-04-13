"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInRouter = void 0;
const express_1 = __importDefault(require("express"));
const signInSchema_1 = require("../../common/schema/signInSchema");
const rateLimits_1 = require("../../config/rateLimits");
const handleJwt_1 = require("../../helpers/handleJwt");
const handlePasswords_1 = require("../../helpers/handlePasswords");
const response_1 = require("../../helpers/response");
const dbConnect_1 = require("../../lib/dbConnect");
const rateLimiter_1 = __importDefault(require("../../lib/rateLimiter"));
const router = express_1.default.Router();
const limiter = (0, rateLimiter_1.default)({
    interval: parseInt(process.env.RL_TIME_INTERVAL) || 60 * 1000,
    uniqueTokenPerInterval: parseInt(process.env.RL_MAX_REQUESTS) || 500,
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield req.body;
        const email = body.email;
        const password = body.password;
        // Rate limiting based on email provided
        const { isRateLimited, usageLeft } = yield limiter.check(`${email}_sign-in`, rateLimits_1.SIGN_IN);
        if (isRateLimited) {
            (0, response_1.response)({
                success: false,
                message: "Rate limit exceeded, please try again later",
            }, 429, res, {
                limit: rateLimits_1.SIGN_IN,
                usageLeft,
            });
            return;
        }
        // performing input validation
        // to check for correct email and password format
        const validatedUser = signInSchema_1.signInSchema.safeParse({
            email,
            password,
        });
        // return error if validation fails
        if (!validatedUser.success) {
            // Constructing an error message
            const errorMessage = validatedUser.error.errors
                .map((error) => error.message)
                .join(", ");
            (0, response_1.response)({ success: false, message: `${errorMessage}` }, 411, res, {
                limit: rateLimits_1.SIGN_IN,
                usageLeft,
            });
            return;
        }
        // Checking in db for the email
        const dbUser = yield dbConnect_1.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                email: true,
                password: true,
                id: true,
            },
        });
        if (!dbUser) {
            // If email does not exist in db
            // then return an error response
            (0, response_1.response)({ success: false, message: "Email does not exist" }, 404, res, {
                limit: rateLimits_1.SIGN_IN,
                usageLeft,
            });
            return;
        }
        const isPasswordCorrect = (0, handlePasswords_1.comparePasswords)(password, dbUser.password);
        if (!isPasswordCorrect) {
            // If password is incorrect
            // then return an error response
            (0, response_1.response)({ success: false, message: "Username and password do not match" }, 401, res, {
                limit: rateLimits_1.SIGN_IN,
                usageLeft,
            });
            return;
        }
        // Generating the JWT token
        const token = (0, handleJwt_1.generateJwtToken)({
            id: dbUser.id,
            email: dbUser.email,
        });
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "User signed in successfully",
            info: {
                id: dbUser.id,
                email: dbUser.email,
                token,
            },
        }, 200, res, {
            limit: rateLimits_1.SIGN_IN,
            usageLeft,
        });
        return;
    }
    catch (err) {
        // Catching the error in above process
        console.log(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
        return;
    }
}));
exports.signInRouter = router;
//# sourceMappingURL=signIn.js.map