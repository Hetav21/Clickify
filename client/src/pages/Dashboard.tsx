import {
  ApiResponse,
  linksDataType,
  tableDataType,
} from "@/common/types/ApiResponse";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { mainColumns } from "@/components/Columns";
import { DataTable } from "@/components/DataTable";
import { linksColumns } from "@/components/LinksColumns";
import { SectionCards } from "@/components/section-cards";
import MobileAndDesktopPieChart from "@/components/views-and-piechart";
import { ChartProvider } from "@/context/ChartContext";
import { useUpdateContext } from "@/hooks/useUpdateContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function Dashboard({ mode = "main" }: { mode: "main" | "links" }) {
  const [data, setData] = useState<tableDataType[] | linksDataType[]>([]);
  const { shouldUpdate } = useUpdateContext();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;

        if (mode === "links") {
          res = await axios.get<ApiResponse>(
            `${import.meta.env.VITE_BACKEND_URL}/api/analytics/links-data/${id}`,
            {
              headers: {
                Authorization: Cookies.get("token"),
              },
            },
          );
        } else {
          res = await axios.get<ApiResponse>(
            `${import.meta.env.VITE_BACKEND_URL}/api/analytics/table-data`,
            {
              headers: {
                Authorization: Cookies.get("token"),
              },
            },
          );
        }

        const data = res.data;

        if (data.success) {
          if (mode === "links") {
            setData(data.info!.links! || []);
          } else {
            setData(data.info!.tableData! || []);
          }
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
  }, [shouldUpdate, id, mode]);

  return (
    <ChartProvider mode={mode}>
      <div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-8 md:gap-6 md:py-12">
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-6">
                  <div className="flex flex-col gap-4 w-full lg:w-3/4">
                    <SectionCards mode={mode} />
                    <ChartAreaInteractive />
                  </div>

                  <div className="w-full lg:w-1/4">
                    <MobileAndDesktopPieChart />
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <div className=" w-full px-4 md:px-6">
                  <DataTable
                    // @ts-expect-error-ignore
                    data={data}
                    // @ts-expect-error-ignore
                    columns={mode === "links" ? linksColumns : mainColumns}
                    mode={mode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartProvider>
  );
}
