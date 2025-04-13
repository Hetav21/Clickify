import { ChartConfig } from "@/components/ui/chart";
import { createContext, useContext } from "react";

export type ChartEntry = {
  date: string;
  mobile: number;
  desktop: number;
};

export type PieDataItem = {
  name: string;
  value: number;
  key: "mobile" | "desktop";
};

interface ChartContextType {
  mode: "links" | "main";
  id: string | undefined;
  isMobile: boolean;
  timeRange: string;
  chartConfig: ChartConfig;
  setTimeRange: React.Dispatch<React.SetStateAction<string>>;
  filteredData: ChartEntry[];
  view: "visitors" | "mobile" | "desktop";
  setView: React.Dispatch<
    React.SetStateAction<"visitors" | "mobile" | "desktop">
  >;
  pieData: PieDataItem[];
}

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined,
);

export const useChartContext = (mode: "main" | "links"): ChartContextType => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider");
  }
  return context;
};
