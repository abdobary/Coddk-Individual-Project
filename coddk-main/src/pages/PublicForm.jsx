import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";

export default function PublicForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form fields
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Global verification toggle fetched from backend
  const [verificationEnabled, setVerificationEnabled] = useState(true);

  // Verification modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Timer
  const [timer, setTimer] = useState(300);
  const timerRef = useRef(null);

  // ---------- Timer helpers ----------
  const startTimer = () => {
    setTimer(300);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Auto-close modal when timer runs out
  useEffect(() => {
    if (timer === 0 && modalOpen) {
      setModalOpen(false);
      setError("انتهت صلاحية رمز التحقق. الرجاء إعادة الإرسال.");
      stopTimer();
    }
  }, [timer, modalOpen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // ---------- Fetch global setting ----------
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await API.get("/settings/public");
        setVerificationEnabled(res.data.publicVerification);
      } catch {
        // If settings endpoint fails, keep default (verification enabled)
        setVerificationEnabled(true);
      }
    };
    fetchSetting();
  }, []);

  // ---------- Redirect logged‑in users ----------
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  if (user) return null;

  // ---------- Handlers ----------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    stopTimer();
    setModalOpen(false);
  };

  // Main submit – branches based on global setting
  const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
    setError("يرجى ملء جميع الحقول.");
    return;
  }

  // 🔄 Refresh the global setting before deciding flow (like dashboard does for permissions)
  let currentVerification = verificationEnabled; // fallback to last known
  try {
    const res = await API.get("/settings/public");
    currentVerification = res.data.publicVerification;
    setVerificationEnabled(currentVerification);
  } catch {
    // keep last known value on error
  }

  if (!currentVerification) {
    // ---- Direct submit (no email verification) ----
    setLoading(true);
    setError("");
    try {
      await API.post("/submissions/direct-submit", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      });
      setSuccess(true);
      setForm({ name: "", phone: "", email: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "حدث خطأ أثناء الإرسال.");
    } finally {
      setLoading(false);
    }
    return;
  }

  // ---- Verification flow ----
  setLoading(true);
  setError("");
  try {
    await API.post("/submissions/send-code", {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    });
    setModalOpen(true);
    setCode("");
    setModalError("");
    startTimer();
  } catch (err) {
    setError(err.response?.data?.msg || "فشل في إرسال الرمز. حاول مرة أخرى.");
  } finally {
    setLoading(false);
  }
};

  // Verify code from modal
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setModalError("يرجى إدخال رمز التحقق.");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      await API.post("/submissions/verify-and-submit", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        code: code.trim(),
      });
      stopTimer();
      setModalOpen(false);
      setSuccess(true);
      setForm({ name: "", phone: "", email: "" });
    } catch (err) {
      setModalError(err.response?.data?.msg || "رمز التحقق غير صحيح أو منتهي الصلاحية.");
    } finally {
      setModalLoading(false);
    }
  };

  // Timer display
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // ---------- Render ----------
  return (
    <div className="page-bg d-flex align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 2 }}>
        <div className="glass-card" style={{ padding: "36px 32px" }}>
          {success ? (
            /* Success message */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
              <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: 12 }}>تم التسجيل بنجاح!</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 28 }}>
                شكرًا لك! تم استلام طلبك وسيتواصل معك فريقنا قريبًا.
              </p>
              <Link to="/" className="btn btn-outline-primary">العودة للرئيسية</Link>
            </div>
          ) : (
            /* Form */
            <>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", margin: "0 auto 14px",
                  boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
                }}>🎓</div>
                <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: 6, fontSize: "1.4rem" }}>تسجيل الطالب</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
                  سجّل بياناتك وسيتواصل معك فريقنا بعد التحقق
                </p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" style={{ marginBottom: 20 }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">الاسم الكامل</label>
                  <input type="text" className="form-control" name="name" placeholder="الاسم الكامل" value={form.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">رقم الهاتف</label>
                  <input type="tel" className="form-control" name="phone" placeholder="رقم الهاتف" value={form.phone} onChange={handleChange} style={{ direction: "ltr", textAlign: "left" }} />
                </div>
                <div className="mb-3">
                  <label className="form-label">البريد الإلكتروني</label>
                  <input type="email" className="form-control" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} style={{ direction: "ltr", textAlign: "left" }} />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ padding: "12px", fontSize: "1rem" }}>
                  {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                هل أنت موظف؟{" "}
                <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                  دخول الطاقم
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Verification Modal with timer – only rendered when verification is enabled */}
      {verificationEnabled && (
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          title="تأكيد البريد الإلكتروني"
          closeOnOverlayClick={false}
          footer={
            <button className="btn btn-outline-primary" onClick={handleCloseModal}>إلغاء</button>
          }
        >
          <form onSubmit={handleVerify}>
            <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>
              تم إرسال رمز تحقق مكون من 6 أرقام إلى <strong>{form.email}</strong>. يرجى إدخاله أدناه:
            </p>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ color: timer < 60 ? "var(--danger)" : "var(--primary)", fontWeight: 600, fontSize: "1rem" }}>
                ⏱️ {timerDisplay}
              </span>
            </div>
            {modalError && <div className="alert alert-danger">{modalError}</div>}
            <input
              type="text"
              className="form-control"
              placeholder="123456"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ direction: "ltr", textAlign: "left" }}
            />
            <button type="submit" className="btn btn-success w-100 mt-3" disabled={modalLoading}>
              {modalLoading ? "جارٍ التأكيد..." : "تأكيد"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
