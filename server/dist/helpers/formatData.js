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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableData = getTableData;
exports.getChartData = getChartData;
exports.getChartDataLinks = getChartDataLinks;
const dbConnect_1 = require("../lib/dbConnect");
function getTableData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const links = yield dbConnect_1.prisma.link.findMany({
            where: {
                user: {
                    id,
                },
            },
            select: {
                id: true,
                longUrl: true,
                shortUrl: true,
                totalClick: true,
                createdAt: true,
                expiresAt: true,
            },
        });
        const tableData = links.map((link) => ({
            id: link.id,
            longUrl: link.longUrl,
            shortUrl: link.shortUrl,
            totalClicks: link.totalClick,
            // createdAt: link.createdAt.toISOString().split("T")[0],
            createdAt: link.createdAt,
            expiresAt: link.expiresAt || null,
            isExpired: link.expiresAt && link.expiresAt < new Date() ? true : false,
        }));
        return tableData;
    });
}
function getChartData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const clicks = yield dbConnect_1.prisma.click.findMany({
            where: {
                link: {
                    user: {
                        id,
                    },
                },
            },
            select: {
                timestamp: true,
                device: true,
            },
        });
        const grouped = {};
        for (const click of clicks) {
            const date = click.timestamp.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
            const device = (_a = click.device) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!grouped[date]) {
                grouped[date] = { desktop: 0, mobile: 0, other: 0 };
            }
            if (device === "desktop") {
                grouped[date].desktop += 1;
            }
            else if (device === "mobile" || device === "tablet") {
                grouped[date].mobile += 1;
            }
            else {
                grouped[date].other += 1;
            }
        }
        // Convert to desired chart data format
        const chartData = Object.entries(grouped)
            .map(([date, counts]) => ({
            date,
            desktop: counts.desktop,
            mobile: counts.mobile,
            other: counts.other,
        }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return chartData;
    });
}
function getChartDataLinks(id, linkId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const clicks = yield dbConnect_1.prisma.click.findMany({
            where: {
                link: {
                    user: {
                        id,
                    },
                    id: linkId,
                },
            },
            select: {
                timestamp: true,
                device: true,
            },
        });
        const grouped = {};
        for (const click of clicks) {
            const date = click.timestamp.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
            const device = (_a = click.device) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!grouped[date]) {
                grouped[date] = { desktop: 0, mobile: 0, other: 0 };
            }
            if (device === "desktop") {
                grouped[date].desktop += 1;
            }
            else if (device === "mobile" || device === "tablet") {
                grouped[date].mobile += 1;
            }
            else {
                grouped[date].other += 1;
            }
        }
        // Convert to desired chart data format
        const chartData = Object.entries(grouped)
            .map(([date, counts]) => ({
            date,
            desktop: counts.desktop,
            mobile: counts.mobile,
            other: counts.other,
        }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return chartData;
    });
}
//# sourceMappingURL=formatData.js.map