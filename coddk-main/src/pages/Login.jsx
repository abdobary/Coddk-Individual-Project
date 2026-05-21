import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  if (user) return null;

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", credentials);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "بيانات الدخول غير صحيحة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg d-flex align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>

        {/* Back button */}
        <Link
          to="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem",
            marginBottom: 24, fontWeight: 600, transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          ← العودة للرئيسية
        </Link>

        <div className="glass-card" style={{ padding: "36px 32px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
            }}>🔐</div>
            <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: 6, fontSize: "1.4rem" }}>
              دخول الطاقم
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
              Staff Login — هذه الصفحة مخصصة للموظفين والإدارة فقط
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2" style={{ marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label className="form-label">اسم المستخدم</label>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="أدخل اسم المستخدم"
                value={credentials.username}
                onChange={handleChange}
                autoComplete="username"
                style={{ direction: "ltr", textAlign: "left" }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="form-label">كلمة المرور</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  name="password"
                  placeholder="أدخل كلمة المرور"
                  value={credentials.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ direction: "ltr", textAlign: "left", paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    zIndex: 2,
                  }}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
              style={{ padding: "12px", fontSize: "1rem" }}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" />
                  جارٍ الدخول...
                </span>
              ) : "دخول →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: "0.8rem" }}>
            هل أنت طالب؟{" "}
            <Link to="/form" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              سجّل هنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
