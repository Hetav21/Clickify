import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/sign-up");
    }
  }, [navigate]);

  return null;
}

export default AuthRedirect;
