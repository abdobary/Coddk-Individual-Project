import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSetting = async () => {
    try {
      const res = await API.get("/settings/public");
      setEnabled(res.data.publicVerification);
    } catch {}
  };

  useEffect(() => { fetchSetting(); }, []);

  const handleToggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await API.put("/settings/public-verification", { enabled: !enabled });
      setEnabled(res.data.publicVerification);
      setMessage(`✅ تم ${res.data.publicVerification ? "تفعيل" : "تعطيل"} التحقق من البريد الإلكتروني`);
    } catch {
      setMessage("❌ فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ direction: "rtl", minHeight: "calc(100vh - 64px)", background: "var(--dark)" }}>
      {/* ── Top tabs (same as other pages) ── */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", maxWidth: "100%", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>📊 لوحة التحكم</Link>
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Link to="/employees" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>👥 الطاقم</Link>
          )}
          {user?.role === "superadmin" && (
            <>
              <Link to="/admins" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>🛡️ المدراء</Link>
              <Link to="/pending" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>⏳ قيد التحقق</Link>
              <Link to="/settings" style={{ padding: "14px 16px", color: "var(--primary)", fontWeight: 700, textDecoration: "none", borderBottom: "2px solid var(--primary)", fontSize: "0.9rem", whiteSpace: "nowrap" }}>⚙️ الإعدادات</Link>
            </>
          )}
          <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: 8, paddingRight: 8 }}>
            <span style={{
              background: user?.role === "superadmin" ? "rgba(239,68,68,0.15)" : user?.role === "admin" ? "rgba(14,165,233,0.15)" : "rgba(245,158,11,0.15)",
              color: user?.role === "superadmin" ? "#f87171" : user?.role === "admin" ? "var(--primary)" : "var(--accent)",
              borderRadius: 6, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap",
            }}>{user?.role === "superadmin" ? "مدير عام" : user?.role === "admin" ? "مدير" : "موظف"} — {user?.name?.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div className="glass-card" style={{ padding: "30px" }}>
          <h2 style={{ color: "#fff", marginBottom: 20 }}>⚙️ إعدادات النظام</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <span style={{ color: "var(--text-main)", fontWeight: 600 }}>
              التحقق من البريد الإلكتروني (النموذج العام)
            </span>
            {/* Toggle switch */}
            <label style={{ position: "relative", display: "inline-block", width: 50, height: 26 }}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={handleToggle}
                disabled={loading}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  inset: 0,
                  backgroundColor: enabled ? "var(--primary)" : "#555",
                  borderRadius: 34,
                  transition: "0.3s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: 20,
                    width: 20,
                    left: enabled ? 26 : 4,
                    bottom: 3,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    transition: "0.3s",
                  }}
                />
              </span>
            </label>
          </div>
          {message && <div className="alert alert-success">{message}</div>}
        </div>
      </div>
    </div>
  );
}
