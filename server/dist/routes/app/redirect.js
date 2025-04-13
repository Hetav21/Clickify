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
exports.redirectRouter = void 0;
const bowser_1 = __importDefault(require("bowser"));
const express_1 = __importDefault(require("express"));
const redirectSchema_1 = require("../../common/schema/redirectSchema");
const response_1 = require("../../helpers/response");
const dbConnect_1 = require("../../lib/dbConnect");
const router = express_1.default.Router();
router.post("/:shortUrl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const shortUrl = req.params.shortUrl;
        // Validate input
        const validation = redirectSchema_1.redirectSchema.safeParse({ shortUrl });
        if (!validation.success) {
            const errorMessage = validation.error.errors
                .map((e) => e.message)
                .join(", ");
            (0, response_1.response)({ success: false, message: `${errorMessage}` }, 411, res);
            return;
        }
        const findUrl = yield dbConnect_1.prisma.link.findUnique({
            where: { shortUrl },
            select: { id: true, longUrl: true, expiresAt: true },
        });
        if (!findUrl) {
            (0, response_1.response)({ success: false, message: "Link not found" }, 404, res);
            return;
        }
        if (findUrl.expiresAt && new Date() > new Date(findUrl.expiresAt)) {
            (0, response_1.response)({ success: false, message: "Link expired" }, 410, res);
            return;
        }
        const ip = ((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString().split(",")[0]) || req.ip || "";
        const userAgent = req.headers["user-agent"] || "";
        const bow = bowser_1.default.getParser(userAgent);
        const browser = bow.getBrowser();
        const os = bow.getOS();
        const platform = bow.getPlatformType();
        const deviceType = platform === "mobile" || platform === "tablet" ? "mobile" : "desktop";
        // Update click counts based on device type
        const updateData = {
            totalClick: { increment: 1 },
        };
        if (deviceType === "mobile") {
            updateData.mobileClicks = { increment: 1 };
        }
        else {
            updateData.desktopClicks = { increment: 1 };
        }
        const url = yield dbConnect_1.prisma.link.update({
            where: { shortUrl },
            data: updateData,
            select: { id: true, longUrl: true },
        });
        const geo = yield fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = yield geo.json();
        const country = geoData.country_name || "Unknown";
        const { locale, referrer } = req.body;
        yield dbConnect_1.prisma.click.create({
            data: {
                linkId: url.id,
                ip,
                os: os.name,
                browser: browser.name,
                device: platform,
                locale,
                country,
                referrer,
            },
        });
        // Success response
        (0, response_1.response)({
            success: true,
            message: "URL extracted successfully",
            info: {
                longUrl: url.longUrl,
            },
        }, 200, res);
    }
    catch (err) {
        console.log(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
    }
}));
exports.redirectRouter = router;
//# sourceMappingURL=redirect.js.map