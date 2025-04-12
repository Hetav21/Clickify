import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPieData } from "@/lib/chartUtils";
import { ChartContext } from "@/hooks/useChartContext";
import { ApiResponse } from "@/common/types/ApiResponse";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

type chartData = {
  date: string;
  mobile: number;
  desktop: number;
  other: number;
}[];

export const ChartProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");
  const [view, setView] = useState<"visitors" | "mobile" | "desktop">(
    "visitors",
  );
  const [chartData, setChartData] = useState<chartData>([]);

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/analytics/chart-data`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          },
        );

        const data = res.data;

        if (data.success) {
          setChartData(data.info!.chartData! || []);
        } else {
          console.error("Failed to fetch chart data:", data.message);
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          toast.warning("An error occurred", {
            description: e.response?.data?.message || e.message,
          });
        } else if (e instanceof Error) {
          toast.warning("An error occurred", { description: e.message });
        } else {
          toast.warning("An unknown error occurred");
        }
      }
    };

    fetchData();
  }, []);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
      color: "#8884d8",
    },
    mobile: {
      label: "Mobile",
      color: "#82ca9d",
    },
  };

  const pieData = getPieData(filteredData);

  return (
    <ChartContext.Provider
      value={{
        isMobile,
        chartConfig,
        timeRange,
        setTimeRange,
        filteredData,
        view,
        setView,
        pieData,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};
