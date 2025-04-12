import { tableDataType } from "../common/types/ApiResponse";
import { prisma } from "../lib/dbConnect";

export async function getTableData(id: string): Promise<tableDataType[]> {
  const links = await prisma.link.findMany({
    where: {
      user: {
        id,
      },
    },
    select: {
      id: true,
      longUrl: true,
      shortUrl: true,
      totalClick: true,
      createdAt: true,
      expiresAt: true,
    },
  });

  const tableData: tableDataType[] = links.map((link) => ({
    id: link.id,
    longUrl: link.longUrl,
    shortUrl: link.shortUrl,
    totalClicks: link.totalClick,
    createdAt: link.createdAt.toISOString().split("T")[0],
    isExpired: link.expiresAt && link.expiresAt < new Date() ? true : false,
  }));

  return tableData;
}

export async function getChartData(id: string) {
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
