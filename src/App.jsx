import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthApp from "./pages/Signup";
import FashionWebApp from "./pages/Home";
import PortalView from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FashionWebApp />} />
        <Route path="/login" element={<AuthApp />} />
        <Route path="/home" element={<FashionWebApp />} />
        <Route path="/signup" element={<AuthApp />} />
        <Route path="/portal/:portalUrl" element={<PortalView />} />
      </Routes>
    </BrowserRouter>
  );
}