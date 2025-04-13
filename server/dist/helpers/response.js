"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = response;
// Standard response helper function
function response(data, code, res, rateLimitInfo, headers) {
    const { limit, usageLeft } = rateLimitInfo || {};
    return res
        .set(Object.assign(Object.assign(Object.assign({}, (limit !== undefined && { "X-RateLimit-Limit": limit.toString() })), (usageLeft !== undefined && {
        "X-RateLimit-Remaining": usageLeft.toString(),
    })), headers))
        .status(code)
        .json(data);
}
//# sourceMappingURL=response.js.map