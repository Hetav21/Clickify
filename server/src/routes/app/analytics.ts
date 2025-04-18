import express from "express";
import { JwtPayload } from "../../common/types/JwtPayload";
import {
  getChartData,
  getChartDataLinks,
  getTableData,
} from "../../helpers/formatData";
import { response } from "../../helpers/response";
import { prisma } from "../../lib/dbConnect";

const router = express.Router();

router.get("/static", async (req, res) => {
  try {
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;

    const userId = jwtPayload.id;

    // Fetch all links of the user
    const userLinks = await prisma.link.findMany({
      where: {
        userId,
      },
      select: {
        totalClick: true,
        mobileClicks: true,
        desktopClicks: true,
      },
    });

    // Aggregate totals
    const totalClicks = userLinks.reduce(
      (acc, link) => acc + link.totalClick,
      0,
    );
    const totalMobileClicks = userLinks.reduce(
      (acc, link) => acc + link.mobileClicks,
      0,
    );
    const totalDesktopClicks = userLinks.reduce(
      (acc, link) => acc + link.desktopClicks,
      0,
    );

    response(
      {
        success: true,
        message: "User click analytics fetched successfully",
        info: {
          analytics: {
            totalClicks,
            totalMobileClicks,
            totalDesktopClicks,
          },
        },
      },
      200,
      res,
    );
  } catch (err) {
    console.error(err);
    response({ success: false, message: "Internal server error" }, 500, res);
  }
});

router.get("/links-active", async (req, res) => {
  try {
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;

    const userId = jwtPayload.id;

    // Find active links
    // TODO: this shouldnt be the case
    //       but prisma seems to exclude the query without expiryAt
    //       fix in future
    // const activeLinksCount = await prisma.link.count({
    //   where: {
    //     userId,
    //     OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    //   },
    // });

    // Find actice links (temporary)
    const allLinks = await prisma.link.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        expiresAt: true,
      },
    });

    const now = new Date();

    const activeLinksCount = allLinks.filter((link) => {
      return link.expiresAt === null || link.expiresAt > now;
    }).length;

    response(
      {
        success: true,
        message: "Active links count fetched successfully",
        info: {
          analytics: {
            activeLinksCount,
          },
        },
      },
      200,
      res,
    );
  } catch (err) {
    console.error(err);
    response({ success: false, message: "Internal server error" }, 500, res);
  }
});

router.get("/chart-data", async (req, res) => {
  try {
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const id = jwtPayload.id;

    const chartData = await getChartData(id);

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Chart data extracted successfully",
        info: {
          chartData,
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

router.get("/table-data", async (req, res) => {
  try {
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const id = jwtPayload.id;

    const tableData = await getTableData(id);

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Table data extracted successfully",
        info: {
          tableData,
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

router.get("/links-data/:id", async (req, res) => {
  try {
    const linkId = req.params.id;
    const body = req.body;
    const jwtPayload: JwtPayload = body.jwtPayload;
    const userId = jwtPayload.id;

    // Verify that the link belongs to the user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
    });

    if (!link) {
      response({ success: false, message: "Link not found" }, 404, res);
      return;
    }

    // Fetch click analytics for the link
    const clickData = await prisma.click.findMany({
      where: {
        linkId,
      },
      select: {
        id: true,
        os: true,
        device: true,
        browser: true,
        timestamp: true,
        ip: true,
        locale: true,
        country: true,
        referrer: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    response(
      {
        success: true,
        message: "Click data fetched successfully",
        info: {
          links: clickData,
        },
      },
      200,
      res,
    );
    return;
  } catch (err) {
    console.error(err);
    response({ success: false, message: "Internal server error" }, 500, res);
  }
});

router.get("/links-static/:id", async (req, res) => {
  try {
    const linkId = req.params.id;
    const body = req.body;
    const jwtPayload: JwtPayload = body.jwtPayload;
    const userId = jwtPayload.id;

    // Verify that the link belongs to the user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
    });

    if (!link) {
      response({ success: false, message: "Link not found" }, 404, res);
      return;
    }

    // Fetch the total click data for the link
    const clickData = await prisma.link.findUnique({
      where: {
        id: linkId,
      },
      select: {
        shortUrl: true,
        totalClick: true,
        mobileClicks: true,
        desktopClicks: true,
      },
    });

    if (!clickData) {
      response({ success: false, message: "Click data not found" }, 404, res);
      return;
    }

    response(
      {
        success: true,
        message: "Click data fetched successfully",
        info: {
          shortUrl: clickData.shortUrl,
          analytics: {
            totalClicks: clickData.totalClick,
            totalMobileClicks: clickData.mobileClicks,
            totalDesktopClicks: clickData.desktopClicks,
          },
        },
      },
      200,
      res,
    );
    return;
  } catch (err) {
    console.error(err);
    response({ success: false, message: "Internal server error" }, 500, res);
  }
});

router.get("/links-chart-data/:id", async (req, res) => {
  try {
    const linkId = req.params.id;
    const body = req.body;

    const jwtPayload: JwtPayload = body.jwtPayload;
    const id = jwtPayload.id;

    const chartData = await getChartDataLinks(id, linkId);

    // Returning the response
    // on success
    response(
      {
        success: true,
        message: "Chart data extracted successfully",
        info: {
          chartData,
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

export const analyticsRouter = router;
