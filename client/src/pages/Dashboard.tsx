import { ApiResponse, tableDataType } from "@/common/types/ApiResponse";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { columns } from "@/components/Columns";
import { DataTable } from "@/components/DataTable";
import { SectionCards } from "@/components/section-cards";
import MobileAndDesktopPieChart from "@/components/views-and-piechart";
import { ChartProvider } from "@/context/ChartContext";
import { useUpdateContext } from "@/hooks/useUpdateContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Dashboard() {
  const [tableData, setTableData] = useState<tableDataType[]>([]);
  const { shouldUpdate } = useUpdateContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/analytics/table-data`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          },
        );

        const data = res.data;

        if (data.success) {
          setTableData(data.info!.tableData! || []);
        } else {
          console.log("Failed to fetch table data:", data.message);
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
  }, [shouldUpdate]);

  return (
    <ChartProvider>
      <div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-8 md:gap-6 md:py-12">
              <div className="flex flex-col gap-4 md:gap-6">
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
              <div className="flex w-full">
                <div className=" w-full px-4 md:px-6">
                  <DataTable data={tableData} columns={columns} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartProvider>
  );
}
