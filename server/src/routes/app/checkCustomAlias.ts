import express from "express";
import { customAliasSchema } from "../../common/schema/createLinkSchema";
import { response } from "../../helpers/response";
import { prisma } from "../../lib/dbConnect";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const body = await req.body;

    const linkId = body.id;
    const customAlias = body.customAlias;

    // performing input validation
    const validation = customAliasSchema.safeParse(customAlias);

    // return error if validation fails
    if (!validation.success) {
      // Constructing an error message
      const errorMessage = validation.error.errors
        .map((error) => error.message)
        .join(", ");

      response({ success: false, message: `${errorMessage}` }, 411, res);
      return;
    }

    const existingUrl = await prisma.link.findUnique({
      where: {
        shortUrl: customAlias,
      },
      select: {
        id: true,
      },
    });

    if (existingUrl && linkId && linkId !== existingUrl.id) {
      response(
        {
          success: false,
          message: "Custom alias already taken",
        },
        409,
        res,
      );
      return;
    }

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Custom alias is available",
      },
      200,
      res,
    );
    return;
  } catch (err) {
    // Catching the error in above process
    console.log(err);

    response({ success: false, message: "Internal server error" }, 500, res);
    return;
  }
});

export const checkCustomAliasRouter = router;
