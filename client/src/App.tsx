import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Dashboard } from "./pages/Dashboard";
import Redirect from "./pages/Redirect";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { UpdateProvider } from "./context/UpdationContext";
import { AuthRedirect } from "@/pages/AuthRedirect";

function App() {
  // Defining routes of the application
  return (
    <BrowserRouter>
      <RoutesWithNavbar />
    </BrowserRouter>
  );
}

function RoutesWithNavbar() {
  const location = useLocation();

  // Conditionally render the Navbar
  const showNavbar = !["/sign-in", "/sign-up"].includes(location.pathname);

  return (
    <>
      <UpdateProvider>
        {showNavbar && <NavBar />}
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard mode="main" />} />
          <Route
            path="/dashboard/:id"
            element={<Dashboard mode="links"></Dashboard>}
          />

          <Route path="/:shortUrl" element={<Redirect />} />
        </Routes>
      </UpdateProvider>
    </>
  );
}

export default App;
