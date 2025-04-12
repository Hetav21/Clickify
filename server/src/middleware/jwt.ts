import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../common/types/ApiResponse";
import { response } from "../helpers/response";
import { verifyJwtToken } from "../helpers/handleJwt";

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    response({ success: false, message: "Token Error" }, 401, res);
    return;
  }

  try {
    const payload = verifyJwtToken(token);

    if (!req.body) {
      req.body = {};
    }

    // Attach the payload to the request body for later use
    req.body.jwtPayload = payload;
    next();
  } catch (err) {
    console.error(err);
    response({ success: false, message: "Server Error" }, 500, res);
    return;
  }
};
