import Bowser from "bowser";
import express from "express";
import { redirectSchema } from "../../common/schema/redirectSchema";
import { response } from "../../helpers/response";
import { prisma } from "../../lib/dbConnect";

const router = express.Router();

router.post("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;

    // Validate input
    const validation = redirectSchema.safeParse({ shortUrl });
    if (!validation.success) {
      const errorMessage = validation.error.errors
        .map((e) => e.message)
        .join(", ");
      response({ success: false, message: `${errorMessage}` }, 411, res);
      return;
    }

    const findUrl = await prisma.link.findUnique({
      where: { shortUrl },
      select: { id: true, longUrl: true, expiresAt: true },
    });

    if (!findUrl) {
      response({ success: false, message: "Link not found" }, 404, res);
      return;
    }

    if (findUrl.expiresAt && new Date() > new Date(findUrl.expiresAt)) {
      response({ success: false, message: "Link expired" }, 410, res);
      return;
    }

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || "";
    const userAgent = req.headers["user-agent"] || "";
    const bow = Bowser.getParser(userAgent);

    const browser = bow.getBrowser();
    const os = bow.getOS();
    const platform = bow.getPlatformType();

    const deviceType =
      platform === "mobile" || platform === "tablet" ? "mobile" : "desktop";

    // Update click counts based on device type
    const updateData: any = {
      totalClick: { increment: 1 },
    };

    if (deviceType === "mobile") {
      updateData.mobileClicks = { increment: 1 };
    } else {
      updateData.desktopClicks = { increment: 1 };
    }

    const url = await prisma.link.update({
      where: { shortUrl },
      data: updateData,
      select: { id: true, longUrl: true },
    });

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
        device: platform,
        locale,
        country,
        referrer,
      },
    });

    // Success response
    response(
      {
        success: true,
        message: "URL extracted successfully",
        info: {
          longUrl: url.longUrl,
        },
      },
      200,
      res,
    );
  } catch (err) {
    console.log(err);
    response({ success: false, message: "Internal server error" }, 500, res);
  }
});

export const redirectRouter = router;
