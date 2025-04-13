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
exports.analyticsRouter = void 0;
const express_1 = __importDefault(require("express"));
const formatData_1 = require("../../helpers/formatData");
const response_1 = require("../../helpers/response");
const dbConnect_1 = require("../../lib/dbConnect");
const router = express_1.default.Router();
router.get("/static", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Fetch all links of the user
        const userLinks = yield dbConnect_1.prisma.link.findMany({
            where: {
                userId,
            },
            select: {
                totalClick: true,
                mobileClicks: true,
                desktopClicks: true,
            },
        });
        // Aggregate totals
        const totalClicks = userLinks.reduce((acc, link) => acc + link.totalClick, 0);
        const totalMobileClicks = userLinks.reduce((acc, link) => acc + link.mobileClicks, 0);
        const totalDesktopClicks = userLinks.reduce((acc, link) => acc + link.desktopClicks, 0);
        (0, response_1.response)({
            success: true,
            message: "User click analytics fetched successfully",
            info: {
                analytics: {
                    totalClicks,
                    totalMobileClicks,
                    totalDesktopClicks,
                },
            },
        }, 200, res);
    }
    catch (err) {
        console.error(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
    }
}));
router.get("/links-active", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Find active links
        // TODO: this shouldnt be the case
        //       but prisma seems to exclude the query without expiryAt
        //       fix in future
        // const activeLinksCount = await prisma.link.count({
        //   where: {
        //     userId,
        //     OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        //   },
        // });
        // Find actice links (temporary)
        const allLinks = yield dbConnect_1.prisma.link.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                expiresAt: true,
            },
        });
        const now = new Date();
        const activeLinksCount = allLinks.filter((link) => {
            return link.expiresAt === null || link.expiresAt > now;
        }).length;
        (0, response_1.response)({
            success: true,
            message: "Active links count fetched successfully",
            info: {
                analytics: {
                    activeLinksCount,
                },
            },
        }, 200, res);
    }
    catch (err) {
        console.error(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
    }
}));
router.get("/chart-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const id = jwtPayload.id;
        const chartData = yield (0, formatData_1.getChartData)(id);
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Chart data extracted successfully",
            info: {
                chartData,
            },
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
router.get("/table-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const id = jwtPayload.id;
        const tableData = yield (0, formatData_1.getTableData)(id);
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Table data extracted successfully",
            info: {
                tableData,
            },
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
router.get("/links-data/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkId = req.params.id;
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Verify that the link belongs to the user
        const link = yield dbConnect_1.prisma.link.findFirst({
            where: {
                id: linkId,
                userId,
            },
        });
        if (!link) {
            (0, response_1.response)({ success: false, message: "Link not found" }, 404, res);
            return;
        }
        // Fetch click analytics for the link
        const clickData = yield dbConnect_1.prisma.click.findMany({
            where: {
                linkId,
            },
            select: {
                id: true,
                os: true,
                device: true,
                browser: true,
                timestamp: true,
                ip: true,
                locale: true,
                country: true,
                referrer: true,
            },
            orderBy: {
                timestamp: "desc",
            },
        });
        (0, response_1.response)({
            success: true,
            message: "Click data fetched successfully",
            info: {
                links: clickData,
            },
        }, 200, res);
        return;
    }
    catch (err) {
        console.error(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
    }
}));
router.get("/links-static/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkId = req.params.id;
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const userId = jwtPayload.id;
        // Verify that the link belongs to the user
        const link = yield dbConnect_1.prisma.link.findFirst({
            where: {
                id: linkId,
                userId,
            },
        });
        if (!link) {
            (0, response_1.response)({ success: false, message: "Link not found" }, 404, res);
            return;
        }
        // Fetch the total click data for the link
        const clickData = yield dbConnect_1.prisma.link.findUnique({
            where: {
                id: linkId,
            },
            select: {
                shortUrl: true,
                totalClick: true,
                mobileClicks: true,
                desktopClicks: true,
            },
        });
        if (!clickData) {
            (0, response_1.response)({ success: false, message: "Click data not found" }, 404, res);
            return;
        }
        (0, response_1.response)({
            success: true,
            message: "Click data fetched successfully",
            info: {
                shortUrl: clickData.shortUrl,
                analytics: {
                    totalClicks: clickData.totalClick,
                    totalMobileClicks: clickData.mobileClicks,
                    totalDesktopClicks: clickData.desktopClicks,
                },
            },
        }, 200, res);
        return;
    }
    catch (err) {
        console.error(err);
        (0, response_1.response)({ success: false, message: "Internal server error" }, 500, res);
    }
}));
router.get("/links-chart-data/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const linkId = req.params.id;
        const body = req.body;
        const jwtPayload = body.jwtPayload;
        const id = jwtPayload.id;
        const chartData = yield (0, formatData_1.getChartDataLinks)(id, linkId);
        // Returning the response
        // on success
        (0, response_1.response)({
            success: true,
            message: "Chart data extracted successfully",
            info: {
                chartData,
            },
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
exports.analyticsRouter = router;
//# sourceMappingURL=analytics.js.map