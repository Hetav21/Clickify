import { analyticsType, ApiResponse } from "@/common/types/ApiResponse";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateContext } from "@/hooks/useUpdateContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";

export function SectionCards() {
  const [clicksData, setClicksData] = useState<analyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [linksData, setLinksData] = useState<
    analyticsType["activeLinksCount"] | null
  >(null);
  const { shouldUpdate } = useUpdateContext();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading2(true);
      try {
        const res = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/analytics/static`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          },
        );
        const data = res.data;
        console.log(data);

        if (data.success) {
          setClicksData(data.info?.analytics || null); // totalClicks, etc.
        } else {
          toast.error("Fetching data failed", {
            description: data.message,
          });
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
      } finally {
        setIsLoading2(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/analytics/links-active`,
          {
            headers: {
              Authorization: Cookies.get("token"),
            },
          },
        );
        const data = res.data;
        console.log(data);

        if (data.success) {
          setLinksData(data.info?.analytics?.activeLinksCount || null);
        } else {
          toast.error("Fetching data failed", {
            description: data.message,
          });
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shouldUpdate]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Clicks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading2 ? (
              <Loader2 className="animate-spin"></Loader2>
            ) : (
              <Label className="font-bold text-2xl">
                {clicksData?.totalClicks}
              </Label>
            )}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Label>Across {linksData ?? 0} links</Label>
            )}
          </div>
          <div className="text-muted-foreground">Total number of visitors</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Mobile Clicks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading2 ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Label className="font-bold text-2xl">
                {clicksData?.totalMobileClicks ?? 0}
              </Label>
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Estimated mobile users
          </div>
          <div className="text-muted-foreground">
            Devices categorized as portable
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Desktop Clicks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading2 ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Label className="font-bold text-2xl">
                {clicksData?.totalDesktopClicks ?? 0}
              </Label>
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Estimated desktop users
          </div>
          <div className="text-muted-foreground">
            Includes all non-mobile platforms
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
