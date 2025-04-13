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
exports.urlRouter = void 0;
const express_1 = __importDefault(require("express"));
const createLinkSchema_1 = require("../../common/schema/createLinkSchema");
const rateLimits_1 = require("../../config/rateLimits");
const response_1 = require("../../helpers/response");
const rateLimiter_1 = __importDefault(require("../../lib/rateLimiter"));
const generateShortUrl_1 = require("../../lib/generateShortUrl");
const dbConnect_1 = require("../../lib/dbConnect");
const router = express_1.default.Router();
const limiter = (0, rateLimiter_1.default)({
    interval: parseInt(process.env.RL_TIME_INTERVAL) || 60 * 1000,
    uniqueTokenPerInterval: parseInt(process.env.RL_MAX_REQUESTS) || 500,
});
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield req.body;
        const longUrl = body.longUrl;
        const expiresAt = body.expiresAt;
        const customAlias = body.customAlias;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Rate limiting
        const { isRateLimited, usageLeft } = yield limiter.check(`${userId}_create-link`, rateLimits_1.URL);
        if (isRateLimited) {
            (0, response_1.response)({
                success: false,
                message: "Rate limit exceeded, please try again later",
            }, 429, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        // performing input validation
        const validation = createLinkSchema_1.createLinkSchema.safeParse({
            longUrl,
            expiresAt,
            customAlias,
        });
        // return error if validation fails
        if (!validation.success) {
            // Constructing an error message
            const errorMessage = validation.error.errors
                .map((error) => error.message)
                .join(", ");
            (0, response_1.response)({ success: false, message: `${errorMessage}` }, 411, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        let shortUrl;
        if (customAlias) {
            const existingUrl = yield dbConnect_1.prisma.link.findUnique({
                where: {
                    shortUrl: customAlias,
                },
            });
            if (existingUrl) {
                (0, response_1.response)({
                    success: false,
                    message: "Custom alias already taken",
                }, 409, res, {
                    limit: rateLimits_1.URL,
                    usageLeft,
                });
                return;
            }
            shortUrl = customAlias;
        }
        else {
            shortUrl = yield (0, generateShortUrl_1.generateShortUrl)();
        }
        const url = yield dbConnect_1.prisma.link.create({
            data: {
                longUrl,
                expiresAt,
                customAlias,
                userId,
                shortUrl,
            },
            select: {
                shortUrl: true,
            },
        });
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Url created successfully",
            info: {
                shortUrl: url.shortUrl,
            },
        }, 200, res, {
            limit: rateLimits_1.URL,
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
router.post("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield req.body;
        const id = body.id;
        const longUrl = body.longUrl;
        const expiresAt = body.expiresAt;
        const customAlias = body.customAlias;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Rate limiting
        const { isRateLimited, usageLeft } = yield limiter.check(`${userId}_update-link`, rateLimits_1.URL);
        if (isRateLimited) {
            (0, response_1.response)({
                success: false,
                message: "Rate limit exceeded, please try again later",
            }, 429, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        // performing input validation
        const validation = createLinkSchema_1.createLinkSchema.safeParse({
            longUrl,
            expiresAt,
            customAlias,
        });
        // return error if validation fails
        if (!validation.success) {
            // Constructing an error message
            const errorMessage = validation.error.errors
                .map((error) => error.message)
                .join(", ");
            (0, response_1.response)({ success: false, message: `${errorMessage}` }, 411, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        const checkIfLinkBelongsToUser = yield dbConnect_1.prisma.link.findUnique({
            where: {
                id,
                user: {
                    id: userId,
                },
            },
        });
        if (!checkIfLinkBelongsToUser) {
            (0, response_1.response)({
                success: false,
                message: "Link not found",
            }, 404, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        let shortUrl;
        if (customAlias) {
            const existingUrl = yield dbConnect_1.prisma.link.findUnique({
                where: {
                    shortUrl: customAlias,
                },
                select: {
                    id: true,
                },
            });
            if (existingUrl && existingUrl.id !== id) {
                (0, response_1.response)({
                    success: false,
                    message: "Custom alias already taken",
                }, 409, res, {
                    limit: rateLimits_1.URL,
                    usageLeft,
                });
                return;
            }
            shortUrl = customAlias;
        }
        else {
            shortUrl = yield (0, generateShortUrl_1.generateShortUrl)();
        }
        const url = yield dbConnect_1.prisma.link.update({
            where: {
                id: id,
            },
            data: {
                longUrl,
                expiresAt,
                customAlias,
                userId,
                shortUrl,
            },
            select: {
                shortUrl: true,
            },
        });
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Url updated successfully",
            info: {
                shortUrl: url.shortUrl,
            },
        }, 200, res, {
            limit: rateLimits_1.URL,
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
router.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield req.body;
        const id = body.id;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Rate limiting
        const { isRateLimited, usageLeft } = yield limiter.check(`${userId}_delete-link`, rateLimits_1.URL);
        if (isRateLimited) {
            (0, response_1.response)({
                success: false,
                message: "Rate limit exceeded, please try again later",
            }, 429, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        const checkIfLinkBelongsToUser = yield dbConnect_1.prisma.link.findUnique({
            where: {
                id,
                user: {
                    id: userId,
                },
            },
        });
        if (!checkIfLinkBelongsToUser) {
            (0, response_1.response)({
                success: false,
                message: "Link not found",
            }, 404, res, {
                limit: rateLimits_1.URL,
                usageLeft,
            });
            return;
        }
        yield dbConnect_1.prisma.$transaction([
            dbConnect_1.prisma.click.deleteMany({
                where: { linkId: id },
            }),
            dbConnect_1.prisma.link.delete({
                where: { id },
            }),
        ]);
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Url deleted successfully",
        }, 200, res, {
            limit: rateLimits_1.URL,
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
exports.urlRouter = router;
//# sourceMappingURL=url.js.map