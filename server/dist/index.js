"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("./config/app");
const jwt_1 = require("./middleware/jwt");
const analytics_1 = require("./routes/app/analytics");
const redirect_1 = require("./routes/app/redirect");
const url_1 = require("./routes/app/url");
const signIn_1 = require("./routes/auth/signIn");
const signUp_1 = require("./routes/auth/signUp");
const checkCustomAlias_1 = require("./routes/app/checkCustomAlias");
const app = (0, express_1.default)();
app.get("/health-check", (req, res) => {
    res.send("Server is healthy!");
});
app.use(express_1.default.json());
app.use("/api/check-custom-alias", checkCustomAlias_1.checkCustomAliasRouter);
app.use("/api/sign-up", signUp_1.signUpRouter);
app.use("/api/sign-in", signIn_1.signInRouter);
app.use("/api/redirect", redirect_1.redirectRouter);
app.use("/", jwt_1.jwtMiddleware);
app.use("/api/url", url_1.urlRouter);
app.use("/api/analytics", analytics_1.analyticsRouter);
app.listen(app_1.port, () => {
    console.log(`Router listening on port ${app_1.port}`);
});
//# sourceMappingURL=index.js.map