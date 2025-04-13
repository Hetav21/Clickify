import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

interface ErrorPageProps {
  message?: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
  const isLoggedIn = !!Cookies.get("token");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50 dark:bg-gray-900">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Link Not Found or Expired
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mt-2">
        {message ||
          "The short URL you're trying to access is invalid or has expired."}
      </p>
      <Link to={isLoggedIn ? "/dashboard" : "/sign-up"}>
        <Button className="mt-6">
          {isLoggedIn ? "Create a new link" : "Sign up to get started"}
        </Button>
      </Link>
    </div>
  );
}
