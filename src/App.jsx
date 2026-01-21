import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthApp from "./pages/Signup";
import FashionWebApp from "./pages/Home";
import PortalView from "./pages/Signup";
import InventoryDashboard from "./pages/InventoryDashboard"; 
// Import the new Admin Dashboard component
import AdminDashboard from "./pages/AdminDashboard"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FashionWebApp />} />
        <Route path="/login" element={<AuthApp />} />
        <Route path="/home" element={<FashionWebApp />} />
        <Route path="/signup" element={<AuthApp />} />
        <Route path="/portal/:portalUrl" element={<PortalView />} />
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/dashboard/inventory" element={<InventoryDashboard />} />
        
        {/* --- Admin Dashboard Routes --- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}