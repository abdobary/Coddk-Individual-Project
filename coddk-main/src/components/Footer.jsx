import { Link } from "react-router-dom";

const WaIcon = () => (
  <svg viewBox="0 0 32 32" width="18" height="18" fill="#4ade80" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.347.636 4.545 1.745 6.44L2.667 29.333l7.12-1.717A13.267 13.267 0 0 0 16.003 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.003 2.667zm0 2.4c5.96 0 10.93 4.863 10.93 10.933 0 6.067-4.97 10.933-10.93 10.933a10.9 10.9 0 0 1-5.587-1.533l-.4-.24-4.147 1 1.04-3.973-.267-.413A10.88 10.88 0 0 1 5.07 16c0-6.07 4.97-10.933 10.933-10.933zm-3.2 5.6c-.267 0-.693.1-.907.533-.24.467-.907 2.16-.907 2.16s-.24.547-.093.88c.24.533.76 1.387 1.6 2.213 1.013.987 2.387 1.84 3.827 2.267.56.173 1 .12 1.373-.08.48-.253 1.08-1.08 1.28-1.573.107-.267.053-.493-.08-.68-.213-.32-1.947-1.04-2.267-1.12-.32-.08-.507.04-.68.24-.24.267-.507.6-.72.8-.16.147-.36.173-.6.067-.32-.147-1.293-.573-2.2-1.573-.707-.787-1.147-1.76-1.267-2.067-.093-.227.013-.4.147-.547.2-.2.44-.52.627-.76.12-.16.187-.32.28-.507.107-.213.04-.467-.053-.68-.08-.173-.773-1.853-.92-2.16-.133-.293-.32-.307-.533-.307z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "48px 0 0", direction: "rtl" }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/coddkLogo.svg" alt="كود دك" style={{ width: 36, height: 36, flexShrink: 0 }} />
              <div>
                <div className="logo-text-ar" style={{ fontSize: "1.2rem" }}>كود دك</div>
                <div className="logo-text-en">Coddk.com</div>
              </div>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.8 }}>
              منصة تعليمية متخصصة في تعليم البرمجة وبناء المواقع الإلكترونية بطريقة عملية ومبسطة.
            </p>
          </div>
          <div className="col-md-4">
            <h6 style={{ color: "var(--text-main)", fontWeight: 700, marginBottom: 16 }}>روابط سريعة</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[{ label: "الرئيسية", to: "/" }, { label: "سجّل الآن", to: "/form" }].map((item, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <Link to={item.to} style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "var(--primary)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                  >{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <h6 style={{ color: "var(--text-main)", fontWeight: 700, marginBottom: 16 }}>تواصل معنا</h6>
            <a href="https://wa.me/962781912236" target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
              color: "#4ade80", borderRadius: 10, padding: "10px 16px",
              textDecoration: "none", fontSize: "0.875rem", fontWeight: 600,
            }}>
              <WaIcon /> واتساب — اضغط للتواصل
            </a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
            © {new Date().getFullYear()} كود دك Coddk — جميع الحقوق محفوظة
          </p>
          <Link to="/login" style={{ color: "var(--text-muted)", fontSize: "0.75rem", textDecoration: "none", opacity: 0.5, transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
          >🔐 دخول الطاقم</Link>
        </div>
      </div>
    </footer>
  );
}