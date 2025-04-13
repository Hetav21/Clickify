"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectSchema = void 0;
const zod_1 = require("zod");
const createLinkSchema_1 = require("./createLinkSchema");
exports.redirectSchema = zod_1.z.object({
    shortUrl: createLinkSchema_1.customAliasSchema,
});
//# sourceMappingURL=redirectSchema.js.map