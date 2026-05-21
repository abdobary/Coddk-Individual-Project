import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import AuthProvider from "../context/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>
        <Navbar />
        <main style={{ flex: 1, overflowX: "hidden" }}>
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </AuthProvider>
  );
}
