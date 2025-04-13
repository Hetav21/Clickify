import express from "express";
import { createLinkSchema } from "../../common/schema/createLinkSchema";
import { JwtPayload } from "../../common/types/JwtPayload";
import { URL as limit } from "../../config/rateLimits";
import { response } from "../../helpers/response";
import rateLimit from "../../lib/rateLimiter";
import { generateShortUrl } from "../../lib/generateShortUrl";
import { prisma } from "../../lib/dbConnect";

const router = express.Router();

const limiter = rateLimit({
  interval: parseInt(process.env.RL_TIME_INTERVAL!) || 60 * 1000,
  uniqueTokenPerInterval: parseInt(process.env.RL_MAX_REQUESTS!) || 500,
});

router.post("/create", async (req, res) => {
  try {
    const body = await req.body;

    const longUrl = body.longUrl;
    const expiresAt = body.expiresAt;
    const customAlias = body.customAlias;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const userId = jwtPayload.id;

    // Rate limiting
    const { isRateLimited, usageLeft } = await limiter.check(
      `${userId}_create-link`,
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
    const validation = createLinkSchema.safeParse({
      longUrl,
      expiresAt,
      customAlias,
    });

    // return error if validation fails
    if (!validation.success) {
      // Constructing an error message
      const errorMessage = validation.error.errors
        .map((error) => error.message)
        .join(", ");

      response({ success: false, message: `${errorMessage}` }, 411, res, {
        limit,
        usageLeft,
      });
      return;
    }

    let shortUrl;

    if (customAlias) {
      const existingUrl = await prisma.link.findUnique({
        where: {
          shortUrl: customAlias,
        },
      });

      if (existingUrl) {
        response(
          {
            success: false,
            message: "Custom alias already taken",
          },
          409,
          res,
          {
            limit,
            usageLeft,
          },
        );
        return;
      }

      shortUrl = customAlias;
    } else {
      shortUrl = await generateShortUrl();
    }

    const url = await prisma.link.create({
      data: {
        longUrl,
        expiresAt,
        customAlias,
        userId,
        shortUrl,
      },
      select: {
        shortUrl: true,
      },
    });

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Url created successfully",
        info: {
          shortUrl: url.shortUrl,
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

router.post("/update", async (req, res) => {
  try {
    const body = await req.body;

    const id = body.id;
    const longUrl = body.longUrl;
    const expiresAt = body.expiresAt;
    const customAlias = body.customAlias;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const userId = jwtPayload.id;

    // Rate limiting
    const { isRateLimited, usageLeft } = await limiter.check(
      `${userId}_update-link`,
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
    const validation = createLinkSchema.safeParse({
      longUrl,
      expiresAt,
      customAlias,
    });

    // return error if validation fails
    if (!validation.success) {
      // Constructing an error message
      const errorMessage = validation.error.errors
        .map((error) => error.message)
        .join(", ");

      response({ success: false, message: `${errorMessage}` }, 411, res, {
        limit,
        usageLeft,
      });
      return;
    }

    const checkIfLinkBelongsToUser = await prisma.link.findUnique({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!checkIfLinkBelongsToUser) {
      response(
        {
          success: false,
          message: "Link not found",
        },
        404,
        res,
        {
          limit,
          usageLeft,
        },
      );
      return;
    }

    let shortUrl;

    if (customAlias) {
      const existingUrl = await prisma.link.findUnique({
        where: {
          shortUrl: customAlias,
        },
        select: {
          id: true,
        },
      });

      if (existingUrl && existingUrl.id !== id) {
        response(
          {
            success: false,
            message: "Custom alias already taken",
          },
          409,
          res,
          {
            limit,
            usageLeft,
          },
        );
        return;
      }

      shortUrl = customAlias;
    } else {
      shortUrl = await generateShortUrl();
    }

    const url = await prisma.link.update({
      where: {
        id: id,
      },
      data: {
        longUrl,
        expiresAt,
        customAlias,
        userId,
        shortUrl,
      },
      select: {
        shortUrl: true,
      },
    });

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Url updated successfully",
        info: {
          shortUrl: url.shortUrl,
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

router.post("/delete", async (req, res) => {
  try {
    const body = await req.body;

    const id = body.id;
    const jwtPayload: JwtPayload = body.jwtPayload;
    const userId = jwtPayload.id;

    // Rate limiting
    const { isRateLimited, usageLeft } = await limiter.check(
      `${userId}_delete-link`,
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

    const checkIfLinkBelongsToUser = await prisma.link.findUnique({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!checkIfLinkBelongsToUser) {
      response(
        {
          success: false,
          message: "Link not found",
        },
        404,
        res,
        {
          limit,
          usageLeft,
        },
      );
      return;
    }

    const url = await prisma.link.delete({
      where: {
        id: id,
      },
    });

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Url deleted successfully",
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

export const urlRouter = router;
