import express from "express";
import { z } from "zod";
import { signInSchema } from "../../common/schema/signInSchema";
import { signUpSchema } from "../../common/schema/signUpSchema";
import { SIGN_IN as limit } from "../../config/rateLimits";
import { generateJwtToken } from "../../helpers/handleJwt";
import { comparePasswords } from "../../helpers/handlePasswords";
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
      `${email}_sign-in`,
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
    const validatedUser = signInSchema.safeParse({
      email,
      password,
    });

    // return error if validation fails
    if (!validatedUser.success) {
      // Constructing an error message
      const errorMessage = validatedUser.error.errors
        .map((error) => error.message)
        .join(", ");

      response({ success: false, message: `${errorMessage}` }, 411, res, {
        limit,
        usageLeft,
      });
      return;
    }

    // Checking in db for the email
    const dbUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });

    if (!dbUser) {
      // If email does not exist in db
      // then return an error response

      response({ success: false, message: "Email does not exist" }, 404, res, {
        limit,
        usageLeft,
      });
      return;
    }

    const isPasswordCorrect = comparePasswords(password, dbUser.password);

    if (!isPasswordCorrect) {
      // If password is incorrect
      // then return an error response

      response(
        { success: false, message: "Username and password do not match" },
        401,
        res,
        {
          limit,
          usageLeft,
        },
      );
      return;
    }

    // Generating the JWT token
    const token = generateJwtToken({
      id: dbUser.id,
      email: dbUser.email,
    });

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "User signed in successfully",
        info: {
          id: dbUser.id,
          email: dbUser.email,
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

export const signInRouter = router;
