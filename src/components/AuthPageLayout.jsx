import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContactUsModal from "./ContactUsModal";
import { AuthPageContactContext } from "../context/AuthPageContactContext";
import "../App.css";

/**
 * Shared shell for login / forgot-password / reset-password (header, mobile nav, contact).
 */
export default function AuthPageLayout({ children }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const contactValue = useMemo(
    () => ({ openContact: () => setIsContactModalOpen(true) }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthPageContactContext.Provider value={contactValue}>
      <style>{`
        @media (max-width: 767px) {
          .header-nav { display: none !important; }
          .mobile-menu { display: flex !important; }
          .login-card { padding: 28px 20px !important; width: 100%; max-width: 100%; }
          .login-title { font-size: 24px !important; }
        }
        .mobile-menu-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5); z-index: 99;
          opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;
        }
        .mobile-menu-overlay.open { opacity: 1; visibility: visible; }
        .mobile-menu-panel {
          position: fixed; top: 58px; right: -100%; width: 280px; height: 100vh;
          background: #ffffff; z-index: 101; transition: right 0.3s;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1); padding: 24px; overflow-y: auto;
        }
        .mobile-menu-panel.open { right: 0; }
        .mobile-menu-button {
          display: none; background: none; border: none; cursor: pointer;
          padding: 8px; flex-direction: column; gap: 6px;
        }
        .mobile-menu-button span {
          width: 24px; height: 2px; background: #6022A6; transition: all 0.3s;
        }
        @media (max-width: 767px) { .mobile-menu-button { display: flex !important; } }
        .login-input:focus {
          outline: none;
          border-color: #6022A6;
          box-shadow: 0 0 0 3px rgba(96, 34, 166, 0.15);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: isMobile ? "12px 16px" : "16px 24px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 10px 30px #1629410d",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: isMobile ? "8px" : "10px",
              }}
              onClick={() => navigate("/")}
            >
              <img
                src="/logo_GE.png"
                alt="GE HealthCare Logo"
                style={{
                  height: isMobile ? "32px" : "40px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            <div className="nav-menu">
              <ul>
                <li>
                  <a
                    href="#"
                    className="btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsContactModalOpen(true);
                    }}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span style={{ transform: isMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ opacity: isMenuOpen ? 0 : 1 }} />
              <span style={{ transform: isMenuOpen ? "rotate(-45deg) translate(7px, -6px)" : "none" }} />
            </button>
            <nav className="header-nav" style={{ display: "flex", gap: "32px", alignItems: "center" }} />
          </div>
        </header>

        <div className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`mobile-menu-panel ${isMenuOpen ? "open" : ""}`}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                setIsMenuOpen(false);
              }}
              style={{ color: "#6022A6", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsContactModalOpen(true);
                setIsMenuOpen(false);
              }}
              style={{ color: "#222222", textDecoration: "none", fontSize: "18px", fontWeight: "400" }}
            >
              Contact Us
            </a>
          </nav>
        </div>

        {children}
      </div>

      <ContactUsModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </AuthPageContactContext.Provider>
  );
}
