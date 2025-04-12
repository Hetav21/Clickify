import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import MobileAndDesktopPieChart from "@/components/views-and-piechart";
import data from "./data.json";
import { ChartProvider } from "@/context/ChartContext";

export function Dashboard() {
  return (
    <ChartProvider>
      <div className="pt-6">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-6">
                  <div className="flex flex-col gap-4 w-full lg:w-3/4">
                    <SectionCards />
                    <ChartAreaInteractive />
                  </div>

                  <div className="w-full lg:w-1/4">
                    <MobileAndDesktopPieChart />
                  </div>
                </div>
              </div>

              <DataTable data={data} />
            </div>
          </div>
        </div>
      </div>
    </ChartProvider>
  );
}
