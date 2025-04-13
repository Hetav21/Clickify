import express from "express";
import { port } from "./config/app";
import { jwtMiddleware } from "./middleware/jwt";
import { analyticsRouter } from "./routes/app/analytics";
import { redirectRouter } from "./routes/app/redirect";
import { urlRouter } from "./routes/app/url";
import { signInRouter } from "./routes/auth/signIn";
import { signUpRouter } from "./routes/auth/signUp";
import { checkCustomAliasRouter } from "./routes/app/checkCustomAlias";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    optionsSuccessStatus: 200,
  }),
);

app.get("/health-check", (req, res) => {
  res.send("Server is healthy!");
});

app.use(express.json());

app.use("/api/check-custom-alias", checkCustomAliasRouter);
app.use("/api/sign-up", signUpRouter);
app.use("/api/sign-in", signInRouter);
app.use("/api/redirect", redirectRouter);

app.use("/", jwtMiddleware);
app.use("/api/url", urlRouter);
app.use("/api/analytics", analyticsRouter);

export default app;
