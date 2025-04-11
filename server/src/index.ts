import express from "express";
import { port } from "./config/app";
import { signInRouter } from "./routes/auth/signIn";
import { signUpRouter } from "./routes/auth/signUp";

const app = express();

app.get("/health-check", (req, res) => {
  res.send("Server is healthy!");
});

app.use(express.json());

app.use("/api/sign-up", signUpRouter);
app.use("/api/sign-in", signInRouter);

app.listen(port, () => {
  console.log(`Router listening on port ${port}`);
});
