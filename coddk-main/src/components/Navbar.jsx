import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { logout(); navigate("/"); setShowDropdown(false); };

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <nav style={{
      background: "rgba(15,23,42,0.97)", borderBottom: "1px solid rgba(148,163,184,0.1)",
      boxShadow: "0 2px 20px rgba(0,0,0,0.3)", direction: "rtl",
      position: "sticky", top: 0, zIndex: 1030,
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: "8px 12px", padding: "10px 16px",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <img src="/coddkLogo.svg" alt="كود دك" style={{ width: 38, height: 38, flexShrink: 0 }} />
          <div style={{ lineHeight: 1.1 }}>
            <div className="logo-text-ar">كود دك</div>
            <div className="logo-text-en">Coddk.com</div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
          {!user && (
            <Link className="nav-link px-3" style={{ color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }} to="/">الرئيسية</Link>
          )}
        </div>

        {user ? (
          <div style={{ position: "relative", flexShrink: 0 }} ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
              borderRadius: 50, padding: "5px 12px", color: "var(--text-main)",
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'Cairo',sans-serif",
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: "bold", color: "#fff", flexShrink: 0,
              }}>{user.name.charAt(0).toUpperCase()}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                {user.name.split(" ")[0]}
              </span>
            </button>
            {showDropdown && (
              <div style={{
                position: "absolute", background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, minWidth: 200, zIndex: 1000, padding: "8px",
                right: 0, top: "calc(100% + 8px)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              }}>
                <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{user.name}</div>
                  <div style={{
                    display: "inline-block", marginTop: 4,
                    background: user.role === "admin" ? "rgba(14,165,233,0.15)" : "rgba(245,158,11,0.15)",
                    color: user.role === "admin" ? "var(--primary)" : "var(--accent)",
                    borderRadius: 6, padding: "1px 8px", fontSize: "0.72rem", fontWeight: 700,
                  }}>{user.role === "admin" ? "مدير" : "موظف"}</div>
                </div>
                <button onClick={handleLogout} style={{
                  width: "100%", textAlign: "right", background: "transparent", border: "none",
                  padding: "10px 14px", borderRadius: 8, fontFamily: "'Cairo',sans-serif",
                  fontWeight: 600, color: "var(--danger)", cursor: "pointer", fontSize: "0.9rem",
                }}>⏻ تسجيل الخروج</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/form" className="btn btn-primary" style={{ fontSize: "0.875rem", padding: "8px 20px", flexShrink: 0 }}>سجّل الآن</Link>
        )}
      </div>
    </nav>
  );
}