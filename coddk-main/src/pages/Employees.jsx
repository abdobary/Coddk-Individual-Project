import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Modal from "../components/Modal";
import { AuthContext } from "../context/AuthContext";

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Employees() {
  const { user } = useContext(AuthContext);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: "", username: "", password: "", directAdd: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [editFields, setEditFields] = useState({ name: "", username: "", password: "", directAdd: false });
  const [editShowPass, setEditShowPass] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchStaff = async () => {
    try { const res = await API.get("/employees?role=employee"); setStaff(res.data); } catch { /* silent */ }
  };
  useEffect(() => { fetchStaff(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) { setError("يرجى ملء جميع الحقول."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      await API.post("/employees", { ...form, directAdd: form.directAdd || false });
      setForm({ name: "", username: "", password: "" });
      setMessage("✅ تم إضافة عضو الطاقم بنجاح.");
      fetchStaff();
    } catch (err) { setError(err.response?.data?.message || "تعذّر الإضافة."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(`/employees/${id}`); setDeleteConfirm(null); fetchStaff(); }
    catch { setError("تعذّر حذف العضو."); }
  };

  const openEdit = (emp) => {
    setEditMember(emp);
    setEditFields({ name: emp.name, username: emp.username, password: "", directAdd: emp.directAdd || false });
    setEditErr("");
    setEditOpen(true);
  };

  const getCommission = (role) => {
    if (role === "superadmin") return "35%";
    if (role === "admin") return "50%";
    return "0%";
  };

  const handleEditSave = async () => {
    setEditLoading(true); setEditErr("");
    try {
      const payload = { name: editFields.name, username: editFields.username };
      if (editFields.password) payload.password = editFields.password;
      if (typeof editFields.directAdd === "boolean") payload.directAdd = editFields.directAdd;
      await API.put(`/employees/${editMember._id}`, payload);
      // If we edited our own account, update the context
      if (user?._id === editMember._id) {
        const updatedUser = { ...user, ...payload };
        if (editFields.password) {
          // password change doesn't need to be reflected in context
        }
        updateUser({ directAdd: payload.directAdd ?? user.directAdd });
      }
      setEditOpen(false);
      fetchStaff();
    } catch (err) { setEditErr(err.response?.data?.message || "فشل التعديل."); }
    finally { setEditLoading(false); }
  };

  const inputStyle = { background: "var(--dark2)", border: "1px solid var(--border)", color: "var(--text-main)", borderRadius: 10, padding: "10px 14px", fontFamily: "'Cairo',sans-serif", width: "100%", fontSize: "0.9rem" };

  return (
    <div style={{ direction: "rtl", minHeight: "calc(100vh - 64px)", background: "var(--dark)" }}>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, overflowX: "auto", maxWidth: "100%" }}>
          <Link to="/dashboard" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>📊 لوحة التحكم</Link>
          <Link to="/employees" style={{ padding: "14px 16px", color: "var(--primary)", fontWeight: 700, textDecoration: "none", borderBottom: "2px solid var(--primary)", fontSize: "0.9rem", whiteSpace: "nowrap" }}>👥 الطاقم</Link>
          {user?.role === "superadmin" && (
            <>
              <Link to="/admins" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>🛡️ المدراء</Link>
              <Link to="/pending" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>⏳ قيد التحقق</Link>
            </>
          )}
          {user?.role === "superadmin" && (
            <Link to="/settings" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
              ⚙️ الإعدادات
            </Link>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: "24px 16px" }}>
        <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 6, fontSize: "1.4rem" }}>إدارة الطاقم</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: "0.875rem" }}>إضافة وإدارة أعضاء الطاقم الذين يمكنهم تسجيل الطلاب.</p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="glass-card" style={{ padding: "20px" }}>
              <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: 18, fontSize: "1rem" }}>إضافة عضو جديد</h5>
              <form onSubmit={handleAdd}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>الاسم الكامل</label>
                  <input style={inputStyle} type="text" placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>اسم المستخدم</label>
                  <input style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} type="text" placeholder="اسم المستخدم" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>كلمة المرور</label>
                  <div style={{ position: "relative" }}>
                    <input style={{ ...inputStyle, direction: "ltr", textAlign: "left", paddingLeft: 42 }}
                      type={showPass ? "text" : "password"} placeholder="••••••••"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{
                      position: "absolute", left: 12, top: getCommission(user?.role), transform: "translateY(-50%)",
                      background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
                      display: "flex", alignItems: "center", padding: 0,
                    }}>{showPass ? <EyeOff /> : <EyeOpen />}</button>
                    {user?.role === "superadmin" && (
                      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                        <input
                          type="checkbox"
                          id="directAddNewEmp"
                          checked={form.directAdd || false}
                          onChange={(e) => setForm({ ...form, directAdd: e.target.checked })}
                          style={{ width: 18, height: 18 }}
                        />
                        <label htmlFor="directAddNewEmp" style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
                          السماح بإضافة الطلاب مباشرة (بدون تحقق)
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm" style={{ marginLeft: 6 }} />جارٍ الإضافة...</> : "إضافة عضو الطاقم"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="glass-card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <h5 style={{ color: "#fff", fontWeight: 700, margin: 0, fontSize: "1rem" }}>أعضاء الطاقم ({staff.length})</h5>
              </div>
              {staff.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>👥</div>
                  <p>لا يوجد أعضاء حتى الآن.</p>
                </div>
              ) : (
                <div className="table-scroll-wrapper">
                  <table className="table table-hover mb-0" style={{ minWidth: 320 }}>
                    <thead>
                      <tr>
                        <th style={{ paddingRight: 16 }}>#</th>
                        <th>الاسم</th>
                        <th>اسم المستخدم</th>
                        <th>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((emp, idx) => (
                        <tr key={emp._id}>
                          <td style={{ color: "var(--text-muted)", paddingRight: 16 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600 }}>{emp.name}</td>
                          <td style={{ direction: "ltr", fontFamily: "monospace", color: "var(--text-muted)", fontSize: "0.85rem" }}>{emp.username}</td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="btn btn-outline-warning btn-sm" onClick={() => openEdit(emp)} style={{ fontSize: "0.75rem" }}>✏️</button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteConfirm(emp._id)} style={{ fontSize: "0.75rem" }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="⚠️ تأكيد الحذف"
        footer={<><button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>حذف العضو</button><button className="btn btn-outline-primary" onClick={() => setDeleteConfirm(null)}>إلغاء</button></>}>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>هل أنت متأكد من إزالة هذا العضو من الطاقم؟</p>
      </Modal>

      <Modal open={editOpen && !!editMember} onClose={() => setEditOpen(false)} title="✏️ تعديل بيانات العضو"
        footer={<>
          <button className="btn btn-success" onClick={handleEditSave} disabled={editLoading}>
            {editLoading ? <><span className="spinner-border spinner-border-sm" style={{ marginLeft: 6 }} />جارٍ الحفظ...</> : "حفظ التعديلات"}
          </button>
          <button className="btn btn-outline-primary" onClick={() => setEditOpen(false)}>إلغاء</button>
        </>}>
        {editErr && <div className="alert alert-danger">{editErr}</div>}
        <div className="mb-3">
          <label style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>الاسم الكامل</label>
          <input style={inputStyle} type="text" value={editFields.name} onChange={e => setEditFields({ ...editFields, name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>اسم المستخدم</label>
          <input style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} type="text" value={editFields.username} onChange={e => setEditFields({ ...editFields, username: e.target.value })} />
        </div>
        <div className="mb-3">
          <label style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: 6 }}>كلمة المرور الجديدة <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>(اتركها فارغة للإبقاء على القديمة)</span></label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inputStyle, direction: "ltr", textAlign: "left", paddingLeft: 42 }}
              type={editShowPass ? "text" : "password"} placeholder="••••••••"
              value={editFields.password} onChange={e => setEditFields({ ...editFields, password: e.target.value })} />
            <button type="button" onClick={() => setEditShowPass(!editShowPass)} style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
              display: "flex", alignItems: "center", padding: 0,
            }}>{editShowPass ? <EyeOff /> : <EyeOpen />}</button>
          </div>
        </div>
        {/* Superadmin only: toggle direct add */}
        {user?.role === "superadmin" && (
          <div className="mb-3" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              id="directAddEmp"
              checked={editFields.directAdd || false}
              onChange={(e) => setEditFields({ ...editFields, directAdd: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="directAddEmp" style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
              السماح بإضافة الطلاب مباشرة (بدون تحقق)
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
}
