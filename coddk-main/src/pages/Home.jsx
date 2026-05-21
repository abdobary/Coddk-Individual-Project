import { Link } from "react-router-dom";

const WaIcon = ({ size = 20, color = "#4ade80" }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.347.636 4.545 1.745 6.44L2.667 29.333l7.12-1.717A13.267 13.267 0 0 0 16.003 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.003 2.667zm0 2.4c5.96 0 10.93 4.863 10.93 10.933 0 6.067-4.97 10.933-10.93 10.933a10.9 10.9 0 0 1-5.587-1.533l-.4-.24-4.147 1 1.04-3.973-.267-.413A10.88 10.88 0 0 1 5.07 16c0-6.07 4.97-10.933 10.933-10.933zm-3.2 5.6c-.267 0-.693.1-.907.533-.24.467-.907 2.16-.907 2.16s-.24.547-.093.88c.24.533.76 1.387 1.6 2.213 1.013.987 2.387 1.84 3.827 2.267.56.173 1 .12 1.373-.08.48-.253 1.08-1.08 1.28-1.573.107-.267.053-.493-.08-.68-.213-.32-1.947-1.04-2.267-1.12-.32-.08-.507.04-.68.24-.24.267-.507.6-.72.8-.16.147-.36.173-.6.067-.32-.147-1.293-.573-2.2-1.573-.707-.787-1.147-1.76-1.267-2.067-.093-.227.013-.4.147-.547.2-.2.44-.52.627-.76.12-.16.187-.32.28-.507.107-.213.04-.467-.053-.68-.08-.173-.773-1.853-.92-2.16-.133-.293-.32-.307-.533-.307z" />
  </svg>
);

const features = [
  { icon: "🗺️", title: "مسارات تعليمية مخصصة", desc: "اختر المسار الذي يناسب أهدافك واحتياجاتك في سوق العمل." },
  { icon: "🛠️", title: "تعلّم بالتطبيق العملي", desc: "ابنِ مشاريع حقيقية تضيفها إلى ملفك المهني منذ أول يوم." },
  { icon: "📈", title: "من الصفر للاحتراف", desc: "خطوة بخطوة، نرافقك حتى تصل إلى مستوى يرضي أصحاب العمل." },
  { icon: "💬", title: "دعم فوري عبر واتساب", desc: "فريق الإرشاد متاح للإجابة على كل تساؤلاتك بدون تأخير." },
  { icon: "🏆", title: "مهارات سوق العمل", desc: "نركّز على ما يطلبه أصحاب العمل فعليًا، لا على النظريات وحدها." },
  { icon: "💼", title: "ملف مشاريع احترافي", desc: "اخرج بمحفظة مشاريع قوية تفتح أمامك أبواب التوظيف." },
];

const technologies = [
  { label: "HTML", color: "#e34f26" }, { label: "CSS", color: "#1572b6" },
  { label: "JavaScript", color: "#f7df1e" }, { label: "Python", color: "#3776ab" },
  { label: "React", color: "#61dafb" }, { label: "Node.js", color: "#339933" },
  { label: "Git & GitHub", color: "#f05032" }, { label: "SQL", color: "#4479a1" },
];

const fullStackBenefits = [
  { icon: "📊", text: "طلب متزايد وفرص وظيفية مستمرة" },
  { icon: "💰", text: "رواتب تنافسية تعكس قيمة مهاراتك" },
  { icon: "🏠", text: "إمكانية العمل عن بُعد من المنزل" },
  { icon: "🚀", text: "الانخراط في مشاريع مبتكرة وشركات ناشئة" },
];

const WA = "https://wa.me/962781912236";

export default function Home() {
  return (
    <div style={{ direction: "rtl" }}>
      {/* ── Hero ── */}
      <section className="hero-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0 100px" }}>
        <div className="grid-pattern" />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="section-tag fade-in fade-in-1">🚀 ابدأ رحلتك في البرمجة</div>
              <h1 className="fade-in fade-in-2" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1.2, color: "#fff", marginBottom: 20 }}>
                تعلّم البرمجة{" "}
                <span style={{ background: "linear-gradient(135deg,#0ea5e9,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  بطريقة عملية
                </span>{" "}
                واحتلّ مكانك في سوق العمل
              </h1>
              <p className="fade-in fade-in-3" style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: 580, marginBottom: 36 }}>
                نساعدك على اكتساب الخبرة العملية التي تحتاجها للدخول إلى سوق العمل بثقة.
                ابدأ من الصفر وطور مهاراتك خطوة بخطوة حتى تصل إلى مستوى الاحتراف.
              </p>
              <div className="fade-in fade-in-4 d-flex flex-wrap gap-3">
                <Link to="/form" className="btn btn-primary pulse" style={{ fontSize: "1rem", padding: "14px 32px", borderRadius: 12, fontWeight: 700 }}>
                  سجّل مجانًا الآن ←
                </Link>
                <a href={WA} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                  color: "#4ade80", borderRadius: 12, padding: "14px 24px",
                  textDecoration: "none", fontSize: "0.95rem", fontWeight: 600,
                }}>
                  <WaIcon size={20} color="#4ade80" /> احصل على استشارة مجانية
                </a>
              </div>
            </div>
            {/* Code editor */}
            <div className="col-lg-5 d-none d-lg-block fade-in fade-in-3">
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                <div style={{ background: "var(--dark2)", padding: "12px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                  {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginRight: "auto", fontFamily: "monospace" }}>index.html</span>
                </div>
                <div style={{ padding: "20px", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.8 }}>
                  {[
                    { color: "#94a3b8", text: "<!-- أهلاً بك في كود دك! -->" },
                    { color: "#0ea5e9", text: '<html lang="ar">' },
                    { color: "#0ea5e9", text: "  <body>" },
                    { color: "#94a3b8", text: "    <h1>" },
                    { color: "#4ade80", text: "      ابدأ رحلتك اليوم 🚀" },
                    { color: "#94a3b8", text: "    </h1>" },
                    { color: "#0ea5e9", text: "  </body>" },
                    { color: "#0ea5e9", text: "</html>" },
                  ].map((l, i) => <div key={i} style={{ color: l.color }}>{l.text}</div>)}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <div style={{ width: 2, height: 16, background: "var(--primary)", borderRadius: 1 }} />
                    <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>جاهز للكتابة...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Stack Section (replaces stats bar) ── */}
      <section style={{ padding: "70px 0", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="section-tag">⚡ Full Stack Developer</div>
              <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "#fff", margin: "12px 0 16px" }}>
                مطوّر ويب متكامل
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.95rem", marginBottom: 24 }}>
                كمطوّر Full Stack، أنت لا تتعلم مهارة واحدة فقط, بل تكتسب القدرة على بناء منتجات رقمية متكاملة من الفكرة إلى التنفيذ. هذا التخصص يُعد من أكثر المجالات طلبًا في سوق العمل، ويفتح لك أبواب العمل مع شركات محلية وعالمية.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                مع هذه المهارات، تصبح عنصرًا لا غنى عنه في أي فريق تقني وتسهم في تطوير حلول رقمية حقيقية تُستخدم يوميًا.
              </p>
            </div>
            <div className="col-lg-6">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {fullStackBenefits.map((b, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "var(--dark2)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "14px 18px",
                    transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    <span style={{
                      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                      background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                    }}>{b.icon}</span>
                    <span style={{ color: "var(--text-main)", fontWeight: 600, fontSize: "0.9rem" }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "80px 0", background: "var(--dark)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-tag">✨ لماذا كود دك؟</div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>كل ما تحتاجه لتبدأ مسيرتك التقنية</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 500, margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
              لا تحتاج خلفية مسبقة، فقط الرغبة في التعلم وأنت في المكان الصحيح.
            </p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="feature-card h-100">
                  <div className="feature-icon">{f.icon}</div>
                  <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: 10 }}>{f.title}</h5>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technologies ── */}
      <section style={{ padding: "70px 0", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="text-center mb-4">
            <div className="section-tag">🔧 التقنيات</div>
            <h2 style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 800, color: "#fff" }}>التقنيات التي ستتقنها</h2>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            {technologies.map((t, i) => (
              <div key={i} className="tech-badge" style={{ borderColor: `${t.color}40`, color: t.color }}>{t.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0", background: "var(--dark)" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(14,165,233,0.05))",
            border: "1px solid rgba(14,165,233,0.2)", borderRadius: 20,
            padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div className="section-tag">🎓 ابدأ الآن</div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
              جاهز لتبدأ مسيرتك في البرمجة؟
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 32px" }}>
              سجّل الآن واحصل على استشارة مجانية — سنتواصل معك خلال 24 ساعة لنضع خارطة طريقك التقنية.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/form" className="btn btn-primary pulse" style={{ fontSize: "1rem", padding: "14px 36px", borderRadius: 12, fontWeight: 700 }}>
                سجّل الآن مجانًا 🚀
              </Link>
              <a href={WA} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)",
                color: "#4ade80", borderRadius: 12, padding: "14px 24px",
                textDecoration: "none", fontSize: "0.95rem", fontWeight: 600,
              }}>
                <WaIcon size={20} color="#4ade80" /> اضغط هنا للتواصل
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
