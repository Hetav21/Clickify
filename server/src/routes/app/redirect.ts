import Bowser from "bowser";
import express from "express";
import { redirectSchema } from "../../common/schema/redirectSchema";
import { response } from "../../helpers/response";
import { prisma } from "../../lib/dbConnect";

const router = express.Router();

router.post("/:shortUrl", async (req, res) => {
  try {
    const body = await req.body;

    const shortUrl = req.params.shortUrl;

    // performing input validation
    const validation = redirectSchema.safeParse({
      shortUrl,
    });

    // return error if validation fails
    if (!validation.success) {
      // Constructing an error message
      const errorMessage = validation.error.errors
        .map((error) => error.message)
        .join(", ");

      response({ success: false, message: `${errorMessage}` }, 411, res);
      return;
    }

    const url = await prisma.link.update({
      where: {
        shortUrl,
      },
      data: {
        totalClick: {
          increment: 1,
        },
      },
      select: {
        id: true,
        longUrl: true,
      },
    });

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || "";
    const userAgent = req.headers["user-agent"] || "";

    const bow = Bowser.getParser(userAgent);

    const browser = bow.getBrowser();
    const os = bow.getOS();
    const device = bow.getPlatformType();

    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geo.json();
    const country = geoData.country_name || "Unknown";

    const { locale, referrer } = req.body;

    await prisma.click.create({
      data: {
        linkId: url.id,
        ip,
        os: os.name,
        browser: browser.name,
        device,
        locale,
        country,
        referrer,
      },
    });

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Url extracted successfully",
        info: {
          longUrl: url.longUrl,
        },
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

export const redirectRouter = router;
