import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { CreateLink } from "./pages/CreateLink";
import { Dashboard } from "./pages/Dashboard";
import Redirect from "./pages/Redirect";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";

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
      {showNavbar && <NavBar />}
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-link" element={<CreateLink />} />

        <Route path="/:shortUrl" element={<Redirect />} />
      </Routes>
    </>
  );
}

export default App;
