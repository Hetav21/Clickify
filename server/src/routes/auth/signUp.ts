import express from "express";
import { z } from "zod";
import { signUpSchema } from "../../common/schema/signUpSchema";
import { SIGN_UP as limit } from "../../config/rateLimits";
import { generateJwtToken } from "../../helpers/handleJwt";
import { hashPassword } from "../../helpers/handlePasswords";
import { response } from "../../helpers/response";
import { prisma } from "../../lib/dbConnect";
import rateLimit from "../../lib/rateLimiter";

const router = express.Router();

const limiter = rateLimit({
  interval: parseInt(process.env.RL_TIME_INTERVAL!) || 60 * 1000,
  uniqueTokenPerInterval: parseInt(process.env.RL_MAX_REQUESTS!) || 500,
});

router.post("/", async (req, res) => {
  try {
    const body: z.infer<typeof signUpSchema> = await req.body;

    const email = body.email;
    const password = body.password;

    // Rate limiting based on email provided
    const { isRateLimited, usageLeft } = await limiter.check(
      `${email}_sign-up`,
      limit,
    );

    if (isRateLimited) {
      response(
        {
          success: false,
          message: "Rate limit exceeded, please try again later",
        },
        429,
        res,
        {
          limit,
          usageLeft,
        },
      );
      return;
    }

    // performing input validation
    // to check for correct email and password format
    const validatedUser = signUpSchema.safeParse({
      email,
      password,
    });

    // return error if validation fails
    if (!validatedUser.success) {
      const errorMessage = validatedUser.error.errors
        .map((error) => error.message)
        .join(", ");

      response({ success: false, message: `${errorMessage}` }, 411, res, {
        limit,
        usageLeft,
      });
      return;
    }

    // Checking if email is already registered
    const emailAlreadyInUse = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });

    const hashedPassword = await hashPassword(password);

    if (emailAlreadyInUse) {
      // If email is already in use
      // then return an error response

      response({ success: false, message: "Email already in use" }, 409, res, {
        limit,
        usageLeft,
      });
      return;
    }

    // If email is not in use, create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // generate a jwt token
    const token = generateJwtToken({
      id: user.id,
      email: user.email,
    });

    response(
      {
        success: true,
        message: "User signed up successfully",
        info: {
          id: user.id,
          email: user.email,
          token,
        },
      },
      200,
      res,
      {
        limit,
        usageLeft,
      },
    );
    return;
  } catch (err) {
    // Catching the error in above process
    console.log(err);

    response({ success: false, message: "Internal server error" }, 500, res);
    return;
  }
});

export const signUpRouter = router;
