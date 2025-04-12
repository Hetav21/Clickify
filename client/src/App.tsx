import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { NavBar } from "./components/NavBar";
import { Dashboard } from "./pages/Dashboard";

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
      </Routes>
    </>
  );
}

export default App;
