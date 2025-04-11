import express from "express";
import { signUpRouter } from "./routes/auth/signUp";
import { port } from "./config/app";

const app = express();

app.get("/health-check", (req, res) => {
  res.send("Server is healthy!");
});

app.use(express.json());

app.use("/api/sign-up", signUpRouter);

app.listen(port, () => {
  console.log(`Router listening on port ${port}`);
});
