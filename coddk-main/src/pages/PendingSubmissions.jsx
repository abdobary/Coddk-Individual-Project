import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Modal from "../components/Modal";
import { AuthContext } from "../context/AuthContext";

export default function PendingSubmissions() {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
    const [error, setError] = useState("");

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await API.get("/submissions?status=pending");
            setSubmissions(res.data);
        } catch {
            setError("تعذّر تحميل البيانات.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

    const handleDelete = async (id) => {
        try {
            await API.delete(`/submissions/${id}`);
            setDeleteConfirm(null);
            fetchPending();
        } catch {
            setError("تعذّر حذف الطالب.");
        }
    };

    const handleDeleteAll = async () => {
        try {
            await API.delete("/submissions/pending/all");
            setDeleteAllConfirm(false);
            fetchPending();
        } catch {
            setError("تعذّر حذف جميع الطلبات المعلقة.");
        }
    };

    return (
        <div style={{ direction: "rtl", minHeight: "calc(100vh - 64px)", background: "var(--dark)" }}>
            {/* ── Top navigation tabs (same as other pages) ── */}
            <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 16px" }}>
                <div className="container" style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", maxWidth: "100%", flexWrap: "wrap" }}>
                    <Link to="/dashboard" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>📊 لوحة التحكم</Link>
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <Link to="/employees" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>👥 الطاقم</Link>
                    )}
                    {user?.role === "superadmin" && (
                        <>
                            <Link to="/admins" style={{ padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, textDecoration: "none", borderBottom: "2px solid transparent", fontSize: "0.9rem", whiteSpace: "nowrap" }}>🛡️ المدراء</Link>
                            <Link to="/pending" style={{ padding: "14px 16px", color: "var(--primary)", fontWeight: 700, textDecoration: "none", borderBottom: "2px solid var(--primary)", fontSize: "0.9rem", whiteSpace: "nowrap" }}>⏳ قيد التحقق</Link>
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

            {/* ── Page content ── */}
            <div className="container" style={{ padding: "24px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                        <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 6, fontSize: "1.4rem" }}>الطلاب بانتظار التأكيد</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>الطلاب الذين لم يؤكدوا بريدهم الإلكتروني بعد.</p>
                    </div>
                    {submissions.length > 0 && (
                        <button className="btn btn-danger" onClick={() => setDeleteAllConfirm(true)}>🗑️ حذف الكل</button>
                    )}
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "48px" }}><div className="spinner-border" /><p style={{ color: "var(--text-muted)", marginTop: 12 }}>جارٍ التحميل...</p></div>
                ) : submissions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}><div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✅</div><p>لا يوجد طلاب معلقين حالياً.</p></div>
                ) : (
                    <div className="glass-card" style={{ overflow: "hidden" }}>
                        <div className="table-scroll-wrapper">
                            <table className="table table-hover mb-0" style={{ minWidth: 480 }}>
                                <thead>
                                    <tr>
                                        <th style={{ paddingRight: 16 }}>#</th>
                                        <th>الاسم</th>
                                        <th>الهاتف</th>
                                        <th>البريد</th>
                                        <th>إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub, idx) => (
                                        <tr key={sub._id}>
                                            <td style={{ paddingRight: 16 }}>{idx + 1}</td>
                                            <td style={{ fontWeight: 600 }}>{sub.name}</td>
                                            <td style={{ direction: "ltr", fontFamily: "monospace", fontSize: "0.85rem" }}>{sub.phone}</td>
                                            <td style={{ direction: "ltr", fontSize: "0.8rem" }}>{sub.email}</td>
                                            <td>
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => setDeleteConfirm(sub._id)} style={{ fontSize: "0.75rem" }}>🗑️ حذف</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Individual delete modal */}
            <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="⚠️ تأكيد الحذف"
                footer={<><button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>حذف</button><button className="btn btn-outline-primary" onClick={() => setDeleteConfirm(null)}>إلغاء</button></>}>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>هل أنت متأكد من حذف هذا الطالب؟</p>
            </Modal>

            {/* Delete all modal */}
            <Modal open={deleteAllConfirm} onClose={() => setDeleteAllConfirm(false)} title="⚠️ حذف جميع المعلّقة"
                footer={<><button className="btn btn-danger" onClick={handleDeleteAll}>حذف الجميع</button><button className="btn btn-outline-primary" onClick={() => setDeleteAllConfirm(false)}>إلغاء</button></>}>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>سيتم حذف جميع الطلاب الذين لم يؤكدوا بريدهم الإلكتروني. لا يمكن التراجع.</p>
            </Modal>
        </div>
    );
}
