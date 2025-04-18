import { LinkEditorButton } from "@/pages/LinkHandler";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

// Defining a nav bar component
export function NavBar() {
  // Setting the user authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    if (Cookies.get("token")) setIsLoggedIn(true);
  }, []);

  // Extracting current path of the app
  const { pathname } = useLocation();

  // State to manage navbar background on scroll
  const [_scrolled, setScrolled] = useState(false);

  // To navigate
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="h-12"></div>
      <nav className="fixed top-0 left-0 z-50 bg-transparent w-full flex justify-center">
        <div className="border-2 border-black backdrop-blur-sm rounded-lg w-full mx-6 mt-3 px-6 py-2">
          <div className="flex flex-col mx-4 sm:flex-row justify-between items-center">
            <a href={isLoggedIn ? "/dashboard" : "/"}>
              <Label className="text-2xl font-bold md:mb-0">Clickify</Label>
            </a>
            {
              // Session based rendering of Login or Logout
              isLoggedIn ? (
                <div className="flex items-center gap-2 mt-2 sm:mt-0 md:gap-4">
                  <LinkEditorButton></LinkEditorButton>
                  <Button
                    className=""
                    onClick={(e: React.SyntheticEvent) => {
                      e.preventDefault();
                      Cookies.remove("token");
                      Cookies.remove("id");
                      Cookies.remove("email");

                      toast.success("Logged out successfully");
                      navigate("/sign-in");
                    }}
                  >
                    <Label>Logout</Label>
                  </Button>
                </div>
              ) : (
                <div className="gap-3 w-full md:w-fit md:flex-row justify-between items-center">
                  <a href="/sign-up">
                    <Button> Sign Up</Button>
                  </a>
                  {pathname === "/" && (
                    <a href="/sign-in">
                      <Button> Sign In</Button>
                    </a>
                  )}
                </div>
              )
            }
          </div>
        </div>
      </nav>
    </>
  );
}
