import { ChartEntry, PieDataItem } from "@/hooks/useChartContext";

export function getPieData(chartData: ChartEntry[]): PieDataItem[] {
  let mobileTotal = 0;
  let desktopTotal = 0;

  chartData.forEach((entry) => {
    mobileTotal += entry.mobile;
    desktopTotal += entry.desktop;
  });

  return [
    { name: "Desktop", value: desktopTotal, key: "desktop" },
    { name: "Mobile", value: mobileTotal, key: "mobile" },
  ];
}
