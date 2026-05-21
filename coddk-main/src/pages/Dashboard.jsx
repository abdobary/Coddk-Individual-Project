import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add student form
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [formMsg, setFormMsg] = useState("");
  const [formErr, setFormErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Verification modal (admins/employees only)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyModalError, setVerifyModalError] = useState("");
  const [verifyModalLoading, setVerifyModalLoading] = useState(false);

  // Timer for verification modal
  const [verifyTimer, setVerifyTimer] = useState(300);
  const verifyTimerRef = useRef(null);

  const startVerifyTimer = () => {
    setVerifyTimer(300);
    if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
    verifyTimerRef.current = setInterval(() => {
      setVerifyTimer(prev => {
        if (prev <= 1) {
          clearInterval(verifyTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopVerifyTimer = () => {
    if (verifyTimerRef.current) {
      clearInterval(verifyTimerRef.current);
      verifyTimerRef.current = null;
    }
  };

  // Auto-close modal when timer reaches 0
  useEffect(() => {
    if (verifyTimer === 0 && verifyModalOpen) {
      setVerifyModalOpen(false);
      setFormErr("انتهت صلاحية رمز التحقق. الرجاء إعادة الإرسال.");
      stopVerifyTimer();
    }
  }, [verifyTimer, verifyModalOpen]);

  useEffect(() => {
    return () => stopVerifyTimer();
  }, []);

  // Edit / Delete state
  const [editOpen, setEditOpen] = useState(false);
  const [editSub, setEditSub] = useState(null);
  const [editFields, setEditFields] = useState({ name: "", phone: "", email: "" });
  const [editErr, setEditErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/submissions");
      setSubmissions(res.data);
    } catch {
      setError("تعذّر تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add student: superadmin / directAdd = direct
  const handleAdd = async (e) => {
  e.preventDefault();
  if (!form.name || !form.phone || !form.email) {
    setFormErr("يرجى ملء جميع الحقول.");
    return;
  }

  // ✅ Refresh permissions before deciding direct / verification
  let currentUser = user;
  try {
    const res = await API.get("/auth/me");
    currentUser = res.data.user;
    updateUser(currentUser);   // update context so button text changes too
  } catch {
    // If refresh fails, keep old data and continue
  }

  const canDirectAdd =
    currentUser?.role === "superadmin" || currentUser?.directAdd === true;

  if (canDirectAdd) {
    // ---- Direct add (existing code) ----
    setSubmitting(true);
    setFormErr("");
    setFormMsg("");
    try {
      await API.post("/submissions/employee/direct-submit", {
        name: form.name,
        phone: form.phone,
        email: form.email,
      });
      setFormMsg("✅ تمت إضافة الطالب بنجاح.");
      setForm({ name: "", phone: "", email: "" });
      fetchSubmissions();
    } catch (err) {
      setFormErr(err.response?.data?.msg || "حدث خطأ أثناء الإضافة.");
    } finally {
      setSubmitting(false);
    }
  } else {
    // ---- Verification flow (existing code) ----
    setSubmitting(true);
    setFormErr("");
    setFormMsg("");
    try {
      await API.post("/submissions/employee/send-code", {
        email: form.email,
        name: form.name,
        phone: form.phone,
      });
      setFormMsg(`✅ تم إرسال رمز التحقق إلى ${form.email}`);
      setVerifyCode("");
      setVerifyModalError("");
      setVerifyModalOpen(true);
      startVerifyTimer();
    } catch (err) {
      setFormErr(err.response?.data?.msg || "تعذّر إرسال الرمز.");
    } finally {
      setSubmitting(false);
    }
  }
};

  // Verify code (admins/employees only)
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!verifyCode.trim()) {
      setVerifyModalError("يرجى إدخال رمز التحقق.");
      return;
    }
    setVerifyModalLoading(true);
    setVerifyModalError("");
    try {
      await API.post("/submissions/employee/verify-and-submit", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        code: verifyCode.trim(),
      });
      stopVerifyTimer();
      setVerifyModalOpen(false);
      setForm({ name: "", phone: "", email: "" });
      setFormMsg("✅ تمت إضافة الطالب بنجاح.");
      fetchSubmissions();
    } catch (err) {
      setVerifyModalError(err.response?.data?.msg || "فشل التحقق.");
    } finally {
      setVerifyModalLoading(false);
    }
  };

  // Edit helpers
  const openEdit = (sub) => {
    setEditSub(sub);
    setEditFields({ name: sub.name, phone: sub.phone, email: sub.email });
    setEditErr("");
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditErr("");
    try {
      await API.put(`/submissions/${editSub._id}`, editFields);
      setEditOpen(false);
      fetchSubmissions();
    } catch (err) {
      setEditErr(err.response?.data?.msg || "فشل التعديل.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/submissions/${id}`);
      setDeleteConfirm(null);
      fetchSubmissions();
    } catch {
      setError("تعذّر حذف السجل.");
    }
  };

  const filtered = submissions.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const canModify = (sub) => {
    if (user?.role === "admin" || user?.role === "superadmin") return true;
    if (user?.role === "employee" && sub.createdBy?._id === user?._id) return true;
    return false;
  };

  // Format timer display
  const timerDisplay = `${String(Math.floor(verifyTimer / 60)).padStart(2, "0")}:${String(verifyTimer % 60).padStart(2, "0")}`;

  return (
    <div style={{ direction: "rtl", minHeight: "calc(100vh - 64px)", background: "var(--dark)" }}>
      {/* Top tabs */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", maxWidth: "100%", flexWrap: "wrap" }}>
          <Link to="/dashboard" style={{ padding: "14px 16px", color: "var(--primary)", fontWeight: 700, textDecoration: "none", borderBottom: "2px solid var(--primary)", fontSize: "0.9rem", whiteSpace: "nowrap" }}>📊 لوحة التحكم</Link>
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Link to="/employees" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>👥 الطاقم</Link>
          )}
          {user?.role === "superadmin" && (
            <>
              <Link to="/admins" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>🛡️ المدراء</Link>
              <Link to="/pending" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>⏳ قيد التحقق</Link>
              <Link to="/settings" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>⚙️ الإعدادات</Link>
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

      {/* Main content */}
      <div className="container" style={{ padding: "24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ color: "#fff", fontWeight: 800, margin: 0, fontSize: "1.4rem" }}>الطلاب المسجّلون</h2>
            <p style={{ color: "var(--text-muted)", margin: "4px 0 0", fontSize: "0.8rem" }}>الإجمالي: {submissions.length} طالب</p>
          </div>
          <input type="text" className="form-control" placeholder="🔍 بحث بالاسم أو الهاتف..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 240, fontSize: "0.875rem" }} />
        </div>

        {/* Add student form */}
        {(user?.role === "admin" || user?.role === "superadmin" || user?.role === "employee") && (
          <div className="glass-card" style={{ marginBottom: 20, padding: "20px" }}>
            <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: "1rem" }}>إضافة طالب جديد</h5>
            {formMsg && <div className="alert alert-success" style={{ fontSize: "0.875rem" }}>{formMsg}</div>}
            {formErr && <div className="alert alert-danger" style={{ fontSize: "0.875rem" }}>{formErr}</div>}
            <form onSubmit={handleAdd}>
              <div className="row g-2">
                <div className="col-12 col-sm-4">
                  <input type="text" className="form-control" name="name" placeholder="الاسم الكامل" value={form.name} onChange={handleChange} />
                </div>
                <div className="col-12 col-sm-4">
                  <input type="tel" className="form-control" name="phone" placeholder="رقم الهاتف" value={form.phone} onChange={handleChange} style={{ direction: "ltr", textAlign: "left" }} />
                </div>
                <div className="col-12 col-sm-4">
                  <input type="email" className="form-control" name="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} style={{ direction: "ltr", textAlign: "left" }} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={submitting} style={{ fontSize: "0.9rem" }}>
                {submitting ? "جارٍ الإضافة..." : "إضافة الطالب"}
              </button>
            </form>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Table */}
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px" }}><div className="spinner-border" /><p style={{ color: "var(--text-muted)", marginTop: 12 }}>جارٍ التحميل...</p></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}><div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div><p>{search ? "لا توجد نتائج." : "لا توجد سجلات بعد."}</p></div>
          ) : (
            <div className="table-scroll-wrapper">
              <table className="table table-hover table-striped mb-0" style={{ minWidth: 480 }}>
                <thead>
                  <tr>
                    <th style={{ paddingRight: 16, paddingLeft: 16 }}>#</th>
                    <th>الاسم</th>
                    <th>الهاتف</th>
                    <th>البريد</th>
                    {(user?.role === "admin" || user?.role === "superadmin") && <th>أضافه</th>}
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub, idx) => (
                    <tr key={sub._id}>
                      <td style={{ color: "var(--text-muted)", paddingRight: 16, paddingLeft: 16 }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{sub.name}</td>
                      <td style={{ direction: "ltr", fontFamily: "monospace", fontSize: "0.85rem", whiteSpace: "nowrap" }}>{sub.phone}</td>
                      <td style={{ direction: "ltr", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{sub.email}</td>
                      {(user?.role === "admin" || user?.role === "superadmin") && (
                        <td><span style={{ background: "rgba(14,165,233,0.1)", color: "var(--primary)", borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{sub.createdBy?.name || "النموذج العام"}</span></td>
                      )}
                      <td>
                        {canModify(sub) && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                            <button className="btn btn-outline-warning btn-sm" onClick={() => openEdit(sub)} style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>✏️</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteConfirm(sub._id)} style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal with timer */}
      <Modal
        open={verifyModalOpen}
        onClose={() => { stopVerifyTimer(); setVerifyModalOpen(false); }}
        title="تأكيد البريد الإلكتروني"
        closeOnOverlayClick={false}   // ← new prop
        footer={
          <button className="btn btn-outline-primary" onClick={() => { stopVerifyTimer(); setVerifyModalOpen(false); }}>إلغاء</button>
        }
      >
        <form onSubmit={handleVerify}>
          <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>
            تم إرسال رمز تحقق مكون من 6 أرقام إلى <strong>{form.email}</strong>. يرجى إدخاله أدناه:
          </p>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ color: verifyTimer < 60 ? "var(--danger)" : "var(--primary)", fontWeight: 600, fontSize: "1rem" }}>
              ⏱️ {timerDisplay}
            </span>
          </div>
          {verifyModalError && <div className="alert alert-danger">{verifyModalError}</div>}
          <input
            type="text"
            className="form-control"
            placeholder="123456"
            maxLength={6}
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            style={{ direction: "ltr", textAlign: "left" }}
          />
          <button type="submit" className="btn btn-success w-100 mt-3" disabled={verifyModalLoading}>
            {verifyModalLoading ? "جارٍ التأكيد..." : "تأكيد"}
          </button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="⚠️ تأكيد الحذف"
        footer={
          <>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>حذف نهائيًا</button>
            <button className="btn btn-outline-primary" onClick={() => setDeleteConfirm(null)}>إلغاء</button>
          </>
        }
      >
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editOpen && !!editSub}
        onClose={() => setEditOpen(false)}
        title="✏️ تعديل بيانات الطالب"
        footer={
          <>
            <button className="btn btn-success" onClick={handleEditSave} disabled={editLoading}>
              {editLoading ? <><span className="spinner-border spinner-border-sm" style={{ marginLeft: 6 }} />جارٍ الحفظ...</> : "حفظ التعديلات"}
            </button>
            <button className="btn btn-outline-primary" onClick={() => setEditOpen(false)}>إلغاء</button>
          </>
        }
      >
        {editErr && <div className="alert alert-danger">{editErr}</div>}
        <div className="mb-3">
          <label className="form-label">الاسم الكامل</label>
          <input type="text" className="form-control" value={editFields.name} onChange={e => setEditFields({ ...editFields, name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">رقم الهاتف</label>
          <input type="tel" className="form-control" value={editFields.phone} onChange={e => setEditFields({ ...editFields, phone: e.target.value })} style={{ direction: "ltr", textAlign: "left" }} />
        </div>
        <div className="mb-3">
          <label className="form-label">البريد الإلكتروني</label>
          <input type="email" className="form-control" value={editFields.email} onChange={e => setEditFields({ ...editFields, email: e.target.value })} style={{ direction: "ltr", textAlign: "left" }} />
        </div>
      </Modal>
    </div>
  );
}
