import Bowser from "bowser";
import express from "express";
import { redirectSchema } from "../../common/schema/redirectSchema";
import { response } from "../../helpers/response";
import { prisma } from "../../lib/dbConnect";
import { JwtPayload } from "../../common/types/JwtPayload";

const router = express.Router();

async function getChartData(id: string) {
  const clicks = await prisma.click.findMany({
    where: {
      link: {
        user: {
          id,
        },
      },
    },
    select: {
      timestamp: true,
      device: true,
    },
  });

  const grouped: Record<
    string,
    { desktop: number; mobile: number; other: number }
  > = {};

  for (const click of clicks) {
    const date = click.timestamp.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
    const device = click.device?.toLowerCase();

    if (!grouped[date]) {
      grouped[date] = { desktop: 0, mobile: 0, other: 0 };
    }

    if (device === "desktop") {
      grouped[date].desktop += 1;
    } else if (device === "mobile" || device === "tablet") {
      grouped[date].mobile += 1;
    } else {
      grouped[date].other += 1;
    }
  }

  // Convert to desired chart data format
  const chartData = Object.entries(grouped)
    .map(([date, counts]) => ({
      date,
      desktop: counts.desktop,
      mobile: counts.mobile,
      other: counts.other,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return chartData;
}

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
        message: "Clicks data extracted successfully",
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
