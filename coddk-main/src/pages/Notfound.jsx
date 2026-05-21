import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div style={{
      minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center",
      justifyContent: "center", direction: "rtl", background: "var(--dark)",
    }}>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{
          fontSize: "6rem", fontWeight: 900, lineHeight: 1,
          background: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          marginBottom: 16,
        }}>404</div>
        <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 12 }}>الصفحة غير موجودة</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
          يبدو أن هذه الصفحة لا وجود لها. ربما تم نقلها أو حذفها.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: "12px 32px", fontSize: "1rem" }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
