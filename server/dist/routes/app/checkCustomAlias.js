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
exports.checkCustomAliasRouter = void 0;
const express_1 = __importDefault(require("express"));
const createLinkSchema_1 = require("../../common/schema/createLinkSchema");
const response_1 = require("../../helpers/response");
const dbConnect_1 = require("../../lib/dbConnect");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield req.body;
        const linkId = body.id;
        const customAlias = body.customAlias;
        // performing input validation
        const validation = createLinkSchema_1.customAliasSchema.safeParse(customAlias);
        // return error if validation fails
        if (!validation.success) {
            // Constructing an error message
            const errorMessage = validation.error.errors
                .map((error) => error.message)
                .join(", ");
            (0, response_1.response)({ success: false, message: `${errorMessage}` }, 411, res);
            return;
        }
        const existingUrl = yield dbConnect_1.prisma.link.findUnique({
            where: {
                shortUrl: customAlias,
            },
            select: {
                id: true,
            },
        });
        if (existingUrl && linkId && linkId !== existingUrl.id) {
            (0, response_1.response)({
                success: false,
                message: "Custom alias already taken",
            }, 409, res);
            return;
        }
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Custom alias is available",
        }, 200, res);
        return;
    }
    catch (err) {
        // Catching the error in above process
        console.log(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
        return;
    }
}));
exports.checkCustomAliasRouter = router;
//# sourceMappingURL=checkCustomAlias.js.map