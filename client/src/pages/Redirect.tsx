import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiResponse } from "@/common/types/ApiResponse";

export default function Redirect() {
  const { shortUrl } = useParams();
  const navigate = useNavigate();
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
          navigate("/create-link");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Click tracking failed:", error);
          navigate("/create-link");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (shortUrl) {
      collectAndSend();
    }

    return () => {
      isMounted = false;
    };
  }, [shortUrl, navigate]);

  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      <span className="ml-4 text-lg text-gray-600">Please wait...</span>
    </div>
  ) : null;
}
