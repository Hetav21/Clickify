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
exports.generateShortUrl = generateShortUrl;
const nanoid_1 = require("nanoid");
const app_1 = require("../config/app");
const dbConnect_1 = require("./dbConnect");
function generateShortUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        let shortUrl;
        let exists = true;
        do {
            shortUrl = (0, nanoid_1.nanoid)(app_1.SIZEOF_NANO_ID);
            const linkExists = yield dbConnect_1.prisma.link.findUnique({ where: { shortUrl } });
            if (!linkExists)
                exists = false;
        } while (exists);
        return shortUrl;
    });
}
//# sourceMappingURL=generateShortUrl.js.map