"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const generated_1 = require("../../prisma/generated");
exports.prisma = new generated_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
}).$extends((0, extension_accelerate_1.withAccelerate)());
//# sourceMappingURL=dbConnect.js.map