import { useEffect } from "react";

export default function WhatsAppButton() {
  // Inject button directly into body to fully escape any stacking context
  useEffect(() => {
    const existing = document.getElementById("wa-float-btn");
    if (existing) return;

    const btn = document.createElement("a");
    btn.id = "wa-float-btn";
    btn.href = "https://wa.me/962781912236";
    btn.target = "_blank";
    btn.rel = "noreferrer";
    btn.title = "تواصل معنا على واتساب";
    btn.innerHTML = `<svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.347.636 4.545 1.745 6.44L2.667 29.333l7.12-1.717A13.267 13.267 0 0 0 16.003 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.003 2.667zm0 2.4c5.96 0 10.93 4.863 10.93 10.933 0 6.067-4.97 10.933-10.93 10.933a10.9 10.9 0 0 1-5.587-1.533l-.4-.24-4.147 1 1.04-3.973-.267-.413A10.88 10.88 0 0 1 5.07 16c0-6.07 4.97-10.933 10.933-10.933zm-3.2 5.6c-.267 0-.693.1-.907.533-.24.467-.907 2.16-.907 2.16s-.24.547-.093.88c.24.533.76 1.387 1.6 2.213 1.013.987 2.387 1.84 3.827 2.267.56.173 1 .12 1.373-.08.48-.253 1.08-1.08 1.28-1.573.107-.267.053-.493-.08-.68-.213-.32-1.947-1.04-2.267-1.12-.32-.08-.507.04-.68.24-.24.267-.507.6-.72.8-.16.147-.36.173-.6.067-.32-.147-1.293-.573-2.2-1.573-.707-.787-1.147-1.76-1.267-2.067-.093-.227.013-.4.147-.547.2-.2.44-.52.627-.76.12-.16.187-.32.28-.507.107-.213.04-.467-.053-.68-.08-.173-.773-1.853-.92-2.16-.133-.293-.32-.307-.533-.307z"/></svg>`;

    Object.assign(btn.style, {
      position: "fixed",
      bottom: "24px",
      left: "24px",
      width: "54px",
      height: "54px",
      borderRadius: "50%",
      background: "linear-gradient(135deg,#25D366,#128C7E)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
      textDecoration: "none",
      zIndex: "2147483647", // max z-index
      transition: "transform 0.2s",
      cursor: "pointer",
    });

    btn.addEventListener("mouseenter", () => { btn.style.transform = "scale(1.1)"; });
    btn.addEventListener("mouseleave", () => { btn.style.transform = "scale(1)"; });

    document.body.appendChild(btn);
    return () => { btn.remove(); };
  }, []);

  return null; // renders nothing in the React tree
}
