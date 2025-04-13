"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkSchema = exports.customAliasSchema = void 0;
const zod_1 = require("zod");
exports.customAliasSchema = zod_1.z
    .string()
    .min(3, "Alias must be at least 3 characters long")
    .max(10, "Alias must be at most 10 characters long");
exports.createLinkSchema = zod_1.z.object({
    longUrl: zod_1.z
        .string()
        .url("Invalid URL")
        .min(5, "URL must be at least 5 characters long"),
    expiresAt: zod_1.z.coerce
        .date()
        .min(new Date(), "Link must expire in the future")
        .optional(),
    customAlias: exports.customAliasSchema.optional(),
});
//# sourceMappingURL=createLinkSchema.js.map