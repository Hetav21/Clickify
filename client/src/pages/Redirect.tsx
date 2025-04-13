import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ApiResponse } from "@/common/types/ApiResponse";
import ErrorPage from "@/components/ErrorPage";
import { toast } from "sonner";

export default function Redirect() {
  const { shortUrl } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const collectAndSend = async () => {
      try {
        const payload = {
          locale: navigator.language,
          referrer: document.referrer,
        };

        const { data } = await axios.post<ApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/redirect/${shortUrl}`,
          payload,
        );

        if (!isMounted) return;

        const longUrl = data.info?.longUrl;
        if (longUrl) {
          window.location.href = longUrl;
        } else {
          setErrorMessage(data.message);
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          toast.warning("An error occurred", {
            description: e.response?.data?.message || e.message,
          });
          if (isMounted) {
            const message =
              e.response?.data?.message || "Unexpected error occurred.";
            console.log("Click tracking failed:", e);
            setErrorMessage(message);
          }
        } else if (e instanceof Error) {
          toast.warning("An error occurred", { description: e.message });
        } else {
          toast.warning("An unknown error occurred");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (shortUrl) {
      collectAndSend();
    }

    return () => {
      isMounted = false;
    };
  }, [shortUrl]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-gray-600">Please wait...</span>
      </div>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return null;
}
