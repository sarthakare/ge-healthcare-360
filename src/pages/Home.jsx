import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Image9100NXT from "../assets/9100nxt/images/9100nxt.png";
import ImageCS750 from "../assets/cs750/images/cs750.png";
import ImageSLE6000 from "../assets/sle6000/images/sle6000.png";
import ImageMAC5 from "../assets/mac-5/images/mac-5.png";
import ImageWarmer from "../assets/lubby-warmer/images/warmer.png";
import ImageGiraffeOmnibedCarestation from "../assets/giraffe-omnibed-carestation/images/giraffe-omnibed-carestation.png";
import ImageLEDPhototherapy from "../assets/led-phototherapy/images/led-phototherapy.png";
import ImageECGHolter from "../assets/ecg-holter/images/ecg-holter.png";
import ImageMonitorB1xM from "../assets/monitors-b1xm/images/A.png";
import ContactUsModal from "../components/ContactUsModal";

const Home = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("DiagnosticCardiology");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      setIsMobileSettingsOpen(false);
    }
  }, [isMenuOpen]);

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    setIsSettingsOpen(false);
    setIsMobileSettingsOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    setIsMenuOpen(false);
  };

  const userJson = localStorage.getItem("user");
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch {
    user = null;
  }
  const isAdmin = user?.role === "admin";

  const categories = [
    {
      name: "Diagnostic Cardiology",
      products: [
        {
          name: "MAC 5 – Resting ECG System",
          path: "/mac-5",
          image: ImageMAC5,
          intro: "Experience MAC 5 in 3D and discover how its streamlined workflow, touchscreen interface and clinical algorithms enable fast, accurate ECG acquisition.",
        },
        {
          name: "CardioSoft Diagnostic System – Stress + Holter + ECG platform",
          path: "/ecg-holter",
          image: ImageECGHolter,
          intro: "Explore the CardioSoft ecosystem and see how its multi-modality design unifies stress, Holter and ECG diagnostics in one connected workflow.",
        },
      ],
    },
    {
      name: "Maternal & Infant Care",
      products: [
        {
          name: "SLE6000 Ventilator – Neonatal/Pediatric ventilator",
          path: "/sle6000",
          image: ImageSLE6000,
          intro: "View the SLE6000 in 3D to understand its modular ventilation modes, gentle neonatal mechanics and intuitive Lunar™ interface.",
        },
        {
          name: "Lullaby Warmer – Infant warming system",
          path: "/lullaby-warmer",
          image: ImageWarmer,
          intro: "As you explore the Lullaby Warmer, you'll notice how every design choice is focused on delivering fast, gentle, and controlled thermal care — while keeping safety and workflow at the center.",
        },
        {
          name: "Giraffe OmniBed Carestation – Incubator + warmer integrated neonatal carestation",
          path: "/giraffe-omnibed-carestation",
          image: ImageGiraffeOmnibedCarestation,
          intro: "Step inside the 3D model to explore the controlled micro-environment, access doors, and caregiver-friendly design that support fragile neonates.",
        },
        {
          name: "LED Phototherapy - Neonatal jaundice treatment system",
          path: "/led-phototherapy",
          image: ImageLEDPhototherapy,
          intro: "LED Phototherapy is designed to deliver effective and gentle treatment for neonatal jaundice. Using clinically optimized LED light technology, it supports safe bilirubin reduction while ensuring comfort and stability for newborns.",
        },
      ],
    },
    {
      name: "Anesthesia",
      products: [
        {
          name: "9100c NXT – Anaesthesia delivery workstation",
          path: "/9100c-nxt",
          image: Image9100NXT,
          intro: "Go inside the 3D demonstration of the 9100c NXT and explore its dependable anesthesia delivery system, ergonomic layout and core ventilation features.",
        },
        {
          name: "Carestation 750 – Advanced anesthesia workstation with lung-protective ventilation",
          path: "/carestation-750",
          image: ImageCS750,
          intro: "Interact with the Carestation 750 to see its advanced anesthesia tools, lung-protective ventilation modes and precision control interface.",
        },
      ],
    },
    {
      name: "Monitoring",
      products: [
        {
          name: "B1x5M Patient Monitors – Modular, scalable vital signs and advanced parameter monitoring",
          path: "/b1x5m-patient-monitors",
          image: ImageMonitorB1xM,
          intro: "Rotate and inspect the B1x5M platform to understand its modular monitoring capabilities and scalable parameters for multiple care areas.",
        },
      ],
    },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .header-nav {
            display: none !important;
          }
          .mobile-menu {
            display: flex !important;
          }
          .header-title {
            display: none !important;
          }
          .main-heading {
            font-size: 32px !important;
            line-height: 1.2 !important;
          }
          .main-content {
            padding: 0px 16px 40px !important;
          }
          .cards-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .card-padding {
            padding: 24px 16px !important;
          }
          .card-image-size {
            width: 180px !important;
            height: 180px !important;
          }
          .card-image-size-small {
            width: 120px !important;
            height: 120px !important;
          }

          {
          grid-template-columns: repeat(1, 1fr);
          }

        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .main-heading {
            font-size: 42px !important;
          }
        }
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .mobile-menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        .mobile-menu-panel {
          position: fixed;
          top: 58px;
          right: -100%;
          width: 280px;
          height: 100vh;
          background: #ffffff;
          z-index: 101;
          transition: right 0.3s;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
          padding: 24px;
          overflow-y: auto;
        }
        .mobile-menu-panel.open {
          right: 0;
        }
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          flex-direction: column;
          gap: 6px;
        }
        .mobile-menu-button span {
          width: 24px;
          height: 2px;
          background: #6022A6;
          transition: all 0.3s;
        }
        @media (max-width: 767px) {
          .mobile-menu-button {
            display: flex !important;
          }
        }
        .accordion-container {
          maxWidth: 1000px;
          margin: 0 auto 60px;
          border: 1px solid #e5e7eb;
          borderRadius: 8px;
          overflow: hidden;
        }
        .accordion-item {
          borderBottom: 1px solid #e5e7eb;
        }
        .accordion-item:last-child {
          borderBottom: none;
        }
        .accordion-header {
          background: #f9fafb;
          padding: 20px 24px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }
        .accordion-header:hover {
          background: #f3f4f6;
        }
        .accordion-title {
          font-size: 20px;
          font-weight: 600;
          color: #6022A6;
          margin: 0;
        }
        .accordion-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s;
          color: #6022A6;
        }
        .accordion-icon.open {
          transform: rotate(180deg);
        }
        .accordion-body {
          maxHeight: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, padding 0.3s ease-out;
          padding: 0 24px;
          background: #ffffff;
        }
        .accordion-body.open {
          maxHeight: 1000px;
          padding: 24px;
        }
        .accordion-content {
          color: #475569;
          lineHeight: 1.6;
        }
        .accordion-title.collapsed:before {
          float: right !important;
          content:"\f067";
        }
        .card-header a{
          color: #6022A6;
          font-weight: 600;
          font-style: normal;
          font-display: swap;
          font-size: 27px;
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
        {/* Header */}
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
                gap: isMobile ? "8px" : "12px",
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
            </div>

            {!isMobile && (
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
                      style={{
                        height: "38px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 16px",
                      }}
                    >
                      Contact Us
                    </a>
                  </li>
                  <li ref={settingsRef} style={{ position: "relative" }}>
                    <button
                      type="button"
                      aria-label="Settings"
                      onClick={() => setIsSettingsOpen((prev) => !prev)}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#6022A6",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.2V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-.4-1.2 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.2-.4H2.72a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.2-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.2V2.72a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 .4 1.2 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .38.22.74.6 1 .34.24.75.38 1.2.4h.08a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.2.4 1.7 1.7 0 0 0-.6 1z" />
                      </svg>
                    </button>

                    {isSettingsOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          right: 0,
                          minWidth: "240px",
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
                          zIndex: 120,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 12px",
                            borderBottom: "1px solid #e5e7eb",
                            fontSize: "13px",
                            color: "#475569",
                            backgroundColor: "#f8fafc",
                            width: "100%",
                            overflowWrap: "anywhere",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {user?.photoURL || user?.avatar ? (
                            <img
                              src={user?.photoURL || user?.avatar}
                              alt="Profile"
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid #d1d5db",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: "#e2e8f0",
                                color: "#334155",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "600",
                                flexShrink: 0,
                              }}
                            >
                              {(user?.email?.[0] || "U").toUpperCase()}
                            </div>
                          )}
                          <span>{user?.email || "No email"}</span>
                        </div>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/admin/users");
                              setIsSettingsOpen(false);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "10px 12px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: "#222",
                              fontSize: "14px",
                              fontFamily: "inherit",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="8.5" cy="7" r="4" />
                              <path d="M20 8v6" />
                              <path d="M23 11h-6" />
                            </svg>
                            <span>Manager User</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "red",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}

            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  transform: isMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }}
              />
              <span
                style={{
                  opacity: isMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  transform: isMenuOpen ? "rotate(-45deg) translate(7px, -6px)" : "none",
                }}
              />
            </button>
            <nav
              className="header-nav"
              style={{
                display: "flex",
                gap: "32px",
                alignItems: "center",
              }}
            >
              {/* <a
                href="#"
                style={{
                  color: "#6022A6",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#222222")}
                onMouseLeave={(e) => (e.target.style.color = "#6022A6")}
              >
                Products
              </a>
              <a
                href="#"
                style={{
                  color: "#222222",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "400",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#6022A6")}
                onMouseLeave={(e) => (e.target.style.color = "#222222")}
              >
                About
              </a>
              <a
                href="#"
                style={{
                  color: "#222222",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "400",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#6022A6")}
                onMouseLeave={(e) => (e.target.style.color = "#222222")}
              >
                Contact
              </a> */}
            </nav>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div
          className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div className={`mobile-menu-panel ${isMenuOpen ? "open" : ""}`}>
          <div style={{ marginBottom: "32px" }}>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "32px",
                paddingBottom: "24px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <img
                src="/logo.png"
                alt="GE HealthCare Logo"
                style={{
                  height: "36px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <h2
                style={{
                  color: "#6022A6",
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                GE HealthCare
              </h2>
            </div> */}
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                style={{
                  color: "#6022A6",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                Home
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsMenuOpen(false);
                }}
                style={{
                  marginTop: "4px",
                  padding: "0",
                  backgroundColor: "transparent",
                  color: "#6022A6",
                  border: "none",
                  fontSize: "18px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  width: "fit-content",
                  textAlign: "left",
                }}
              >
                Contact Us
              </button>
              <button
                type="button"
                onClick={() => setIsMobileSettingsOpen((prev) => !prev)}
                style={{
                  marginTop: "8px",
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  color: "#6022A6",
                  border: "1px solid #6022A6",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Settings
                <span style={{ fontSize: "14px" }}>
                  {isMobileSettingsOpen ? "▲" : "▼"}
                </span>
              </button>
              {isMobileSettingsOpen && (
                <div
                  style={{
                    marginTop: "-12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/admin/users");
                        setIsMenuOpen(false);
                        setIsMobileSettingsOpen(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 14px",
                        background: "#fff",
                        border: "none",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#222",
                        fontSize: "15px",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6" />
                        <path d="M23 11h-6" />
                      </svg>
                      <span>Manager User</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      background: "#fff",
                      border: "none",
                      color: "red",
                      fontSize: "15px",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="main-content"
          style={{ 
            position: "relative",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
          }}
        >
          <div
            style={{
               backgroundImage: "url('./img-hero1.png'), url('./img-hero2.png')",
              backgroundRepeat: "no-repeat, no-repeat",
              backgroundPosition: "bottom left, top right",
              backgroundSize: "auto, auto",
              backgroundColor: "#6022A6",
              marginBottom: isMobile ? "30px" : "40px",
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
              padding: isMobile ? "45px 15px" : "63px 27px",
              position: "relative",
            }}
          >
            {/* Decorative accent line */}
            {/* <div
              style={{
                width: "60px",
                height: "4px",
                background: "linear-gradient(90deg, #6022A6 0%, #8B5CF6 100%)",
                margin: "0 auto 32px",
                borderRadius: "2px",
              }}
            /> */}
            
            <h1
              className="main-heading"
              style={{
                fontSize: isMobile ? "32px" : "52px",
                // background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #6022A6 100%)",
                // WebkitBackgroundClip: "text",
                // WebkitTextFillColor: "transparent",
                // backgroundClip: "text",
                color:"#fff",
                marginBottom: "28px",
                fontWeight: "600",
                fontStyle: "normal",
                fontDisplay: "swap",
                letterSpacing: "-1.5px",
                lineHeight: "1.15",
                padding: isMobile ? "0 8px" : "0",
                maxWidth: "700px", 
              }}
            >
              Step into GE HealthCare's interactive 3D Experience Centre
            </h1>
            
            <p
              style={{
                fontSize: isMobile ? "17px" : "20px",
                color: "#fff",
                lineHeight: "1.75",
                margin: 0, 
                fontWeight: "400",
                maxWidth: "700px", 
              }}
            >
              {/* <span
                style={{
                  fontSize: isMobile ? "24px" : "28px",
                  color: "#6022A6",
                  fontWeight: "600",
                  marginRight: "8px",
                  lineHeight: "1",
                  verticalAlign: "middle",
                }}
              >
                —
              </span> */}
              A digital space where you can explore our clinical technologies as if they were right in front of you. Navigate through <strong style={{ color: "#fff", fontWeight: "600" }}>Diagnostic Cardiology</strong>, <strong style={{ color: "#fff", fontWeight: "600" }}>Maternal & Infant Care</strong>, <strong style={{ color: "#fff", fontWeight: "600" }}>Anesthesia</strong> and <strong style={{ color: "#fff", fontWeight: "600" }}>Patient Monitoring</strong>, and dive into detailed 3D models, feature callouts, and guided walkthroughs. Each product has been brought to life to help clinicians, biomedical teams and decision-makers understand its capabilities, workflow advantages and real-world clinical impact.
            </p>
          </div>

          <div className="accordion-container" style={{ maxWidth: "1300px", margin: "0 auto", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            <div className="accordion-item" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div
                className="accordion-header"
                style={{
                  background: openAccordion === "DiagnosticCardiology" ? "#f3f4f6" : "#f9fafb",
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
                onClick={() => setOpenAccordion(openAccordion === "DiagnosticCardiology" ? "" : "DiagnosticCardiology")}
                onMouseEnter={(e) => {
                  if (openAccordion !== "DiagnosticCardiology") {
                    e.currentTarget.style.background = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (openAccordion !== "DiagnosticCardiology") {
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
              >
                <h3 className="accordion-title" style={{ fontSize: "20px", fontWeight: "600", color: "#6022A6", margin: 0 }}>
                  Diagnostic Cardiology
                </h3>
                {openAccordion === "DiagnosticCardiology" ? (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div
                className={`accordion-body ${openAccordion === "DiagnosticCardiology" ? "open" : ""}`}
                style={{
                  maxHeight: openAccordion === "DiagnosticCardiology" ? "2000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
                  padding: openAccordion === "DiagnosticCardiology" ? "24px" : "0 24px",
                  background: "#ffffff",
                }}
              >
                <div className="accordion-content" style={{ color: "#475569", lineHeight: "1.6" }}>
                  <div
                    className="cards-grid"
                    style={{
                      display: "grid", 
                      gap: isMobile ? "20px" : "20px",
                      maxWidth: "1400px",
                      margin: "0 auto",
                    }}
                    >
                    {categories[0].products.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        onClick={() => handleCardClick(product.path)}
                        style={{
                          width: "100%",
                          minHeight: isMobile ? "auto" : "auto",
                          backgroundColor: "#fff",
                          borderRadius: "12px",
                          boxShadow: product.path
                            ? "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                          border: product.path ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between", 
                          cursor: product.path ? "pointer" : "not-allowed",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          opacity: product.path ? 1 : 0.4,
                          padding: isMobile ? "15px 20px" : "15px 20px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 1;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 0;
                          }
                        }}
                      >
                        {product.path && (
                          <div
                            className="card-hover-gradient"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(135deg, rgba(30, 64, 175, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              pointerEvents: "none",
                              borderRadius: "12px",
                            }}
                          />
                        )}
                        <div
                          style={{ 
                            display: "grid",
                            gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(4, 1fr)",
                            gap:"20px",
                            width: "100%",
                            height: "100%",
                            zIndex: 1,
                            position: "relative",
                            alignItems: "center",
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "100%" : "100%", 
                                height: isMobile ? "90px" : "90px", 
                                background:"#000",  
                                transition: "transform 0.3s ease",
                              }} 
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  filter: product.path
                                    ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                                    : "none",
                                }}
                              />
                            </div>
                          )}
                          <h3
                            style={{
                              fontSize: isMobile ? "18px" : "20px",
                              color: "#000",
                              textAlign: "left", 
                              fontWeight: "600",
                              letterSpacing: "-0.2px",
                              lineHeight: "1.3",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              fontSize: isMobile ? "14px" : "15px",
                              color: "#000",
                              textAlign: "left", 
                              lineHeight: "1.5",
                              fontWeight: "400",
                              flex: 1,
                            }}
                          >
                            {product.intro}
                          </p>
                          {product.path && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(product.path);
                              }}
                              style={{ 
                                padding: "8px 0px",
                                backgroundColor: "#F37F63",
                                color: "#000",
                                border: "none", 
                                fontSize: isMobile ? "13px" : "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                textTransform: "none", 
                                width:"108px",
                                margin: isMobile ? "0 0" : "0 auto",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(96, 34, 166, 0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              Explore 3D
                            </button>
                          )}
                          {!product.path && (
                            <div
                              style={{
                                marginTop: "16px",
                                padding: "6px 16px",
                                backgroundColor: "#f1f5f9",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "#222222",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div
                className="accordion-header"
                style={{
                  background: openAccordion === "MaternalInfantCare" ? "#f3f4f6" : "#f9fafb",
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
                onClick={() => setOpenAccordion(openAccordion === "MaternalInfantCare" ? "" : "MaternalInfantCare")}
                onMouseEnter={(e) => {
                  if (openAccordion !== "MaternalInfantCare") {
                    e.currentTarget.style.background = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (openAccordion !== "MaternalInfantCare") {
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
              >
                <h3 className="accordion-title" style={{ fontSize: "20px", fontWeight: "600", color: "#6022A6", margin: 0 }}>
                  Maternal & Infant Care
                </h3>
                {openAccordion === "MaternalInfantCare" ? (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div
                className={`accordion-body ${openAccordion === "MaternalInfantCare" ? "open" : ""}`}
                style={{
                  maxHeight: openAccordion === "MaternalInfantCare" ? "2000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
                  padding: openAccordion === "MaternalInfantCare" ? "24px" : "0 24px",
                  background: "#ffffff",
                }}
              >
                <div className="accordion-content" style={{ color: "#475569", lineHeight: "1.6" }}>
                  <div
                    className="cards-grid"
                    style={{
                      display: "grid", 
                      gap: isMobile ? "20px" : "20px",
                      maxWidth: "1400px",
                      margin: "0 auto",
                    }}
                  >
                    {categories[1].products.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        onClick={() => handleCardClick(product.path)}
                        style={{
                          width: "100%",
                          minHeight: isMobile ? "auto" : "auto",
                          backgroundColor: "#fff",
                          borderRadius: "12px",
                          boxShadow: product.path
                            ? "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                          border: product.path ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: product.path ? "pointer" : "not-allowed",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          opacity: product.path ? 1 : 0.4,
                          padding: isMobile ? "15px 20px" : "15px 20px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 1;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 0;
                          }
                        }}
                      >
                        {product.path && (
                          <div
                            className="card-hover-gradient"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(135deg, rgba(30, 64, 175, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              pointerEvents: "none",
                              borderRadius: "12px",
                            }}
                          />
                        )}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(4, 1fr)",
                            gap:"20px",
                            width: "100%",
                            height: "100%",
                            zIndex: 1,
                            position: "relative",
                            alignItems: "center",
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "100%" : "100%", 
                                height: isMobile ? "90px" : "90px", 
                                background:"#000", 
                                transition: "transform 0.3s ease",
                              }} 
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  filter: product.path
                                    ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                                    : "none",
                                }}
                              />
                            </div>
                          )}
                          <h3
                            style={{
                              fontSize: isMobile ? "18px" : "20px",
                              color: "#000",
                              textAlign: "left", 
                              fontWeight: "600",
                              letterSpacing: "-0.2px",
                              lineHeight: "1.3",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              fontSize: isMobile ? "14px" : "15px",
                              color: "#000",
                              textAlign: "left", 
                              lineHeight: "1.5",
                              fontWeight: "400",
                              flex: 1,
                            }}
                          >
                            {product.intro}
                          </p>
                          {product.path && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(product.path);
                              }}
                              style={{
                                padding: "8px 0px",
                                backgroundColor: "#F37F63",
                                color: "#000",
                                border: "none", 
                                fontSize: isMobile ? "13px" : "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                textTransform: "none",  
                                width:"108px",
                                margin: isMobile ? "0 0" : "0 auto",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(96, 34, 166, 0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              Explore 3D
                            </button>
                          )}
                          {!product.path && (
                            <div
                              style={{
                                marginTop: "16px",
                                padding: "6px 16px",
                                backgroundColor: "#f1f5f9",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "#222222",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item" style={{ borderBottom: "1px solid #e5e7eb" }}>
              <div
                className="accordion-header"
                style={{
                  background: openAccordion === "Anesthesia" ? "#f3f4f6" : "#f9fafb",
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
                onClick={() => setOpenAccordion(openAccordion === "Anesthesia" ? "" : "Anesthesia")}
                onMouseEnter={(e) => {
                  if (openAccordion !== "Anesthesia") {
                    e.currentTarget.style.background = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (openAccordion !== "Anesthesia") {
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
              >
                <h3 className="accordion-title" style={{ fontSize: "20px", fontWeight: "600", color: "#6022A6", margin: 0 }}>
                  Anesthesia
                </h3>
                {openAccordion === "Anesthesia" ? (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div
                className={`accordion-body ${openAccordion === "Anesthesia" ? "open" : ""}`}
                style={{
                  maxHeight: openAccordion === "Anesthesia" ? "2000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
                  padding: openAccordion === "Anesthesia" ? "24px" : "0 24px",
                  background: "#ffffff",
                }}
              >
                <div className="accordion-content" style={{ color: "#475569", lineHeight: "1.6" }}>
                  <div
                    className="cards-grid"
                   style={{
                      display: "grid", 
                      gap: isMobile ? "20px" : "20px",
                      maxWidth: "1400px",
                      margin: "0 auto",
                    }}
                  >
                    {categories[2].products.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        onClick={() => handleCardClick(product.path)}
                        style={{
                          width: "100%",
                          minHeight: isMobile ? "auto" : "aauto",
                          backgroundColor: "#fff",
                          borderRadius: "12px",
                          boxShadow: product.path
                            ? "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                          border: product.path ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: product.path ? "pointer" : "not-allowed",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          opacity: product.path ? 1 : 0.4,
                          padding: isMobile ? "15px 20px" : "15px 20px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 1;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 0;
                          }
                        }}
                      >
                        {product.path && (
                          <div
                            className="card-hover-gradient"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(135deg, rgba(30, 64, 175, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              pointerEvents: "none",
                              borderRadius: "12px",
                            }}
                          />
                        )}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(4, 1fr)",
                            gap:"20px",
                            width: "100%",
                            height: "100%",
                            zIndex: 1,
                            position: "relative",
                            alignItems: "center",
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "100%" : "100%", 
                                height: isMobile ? "90px" : "90px", 
                                background:"#000", 
                                transition: "transform 0.3s ease",
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  filter: product.path
                                    ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                                    : "none",
                                }}
                              />
                            </div>
                          )}
                          <h3
                            style={{
                              fontSize: isMobile ? "18px" : "20px",
                              color: "#000",
                              textAlign: "left", 
                              fontWeight: "600",
                              letterSpacing: "-0.2px",
                              lineHeight: "1.3",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              fontSize: isMobile ? "14px" : "15px",
                              color: "#000",
                              textAlign: "left", 
                              lineHeight: "1.5",
                              fontWeight: "400",
                              flex: 1,
                            }}
                          >
                            {product.intro}
                          </p>
                          {product.path && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(product.path);
                              }}
                              style={{
                                padding: "8px 0px",
                                backgroundColor: "#F37F63",
                                color: "#000",
                                border: "none", 
                                fontSize: isMobile ? "13px" : "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                textTransform: "none", 
                                width:"108px",
                                margin: isMobile ? "0 0" : "0 auto",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(96, 34, 166, 0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              Explore 3D
                            </button>
                          )}
                          {!product.path && (
                            <div
                              style={{
                                marginTop: "16px",
                                padding: "6px 16px",
                                backgroundColor: "#f1f5f9",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "#222222",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item" style={{ borderBottom: "none" }}>
              <div
                className="accordion-header"
                style={{
                  background: openAccordion === "Monitoring" ? "#f3f4f6" : "#f9fafb",
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
                onClick={() => setOpenAccordion(openAccordion === "Monitoring" ? "" : "Monitoring")}
                onMouseEnter={(e) => {
                  if (openAccordion !== "Monitoring") {
                    e.currentTarget.style.background = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (openAccordion !== "Monitoring") {
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
              >
                <h3 className="accordion-title" style={{ fontSize: "20px", fontWeight: "600", color: "#6022A6", margin: 0 }}>
                  Monitoring
                </h3>
                {openAccordion === "Monitoring" ? (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    className="accordion-icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      transition: "opacity 0.3s",
                    }}
                    fill="none"
                    stroke="#6022A6"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div
                className={`accordion-body ${openAccordion === "Monitoring" ? "open" : ""}`}
                style={{
                  maxHeight: openAccordion === "Monitoring" ? "2000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
                  padding: openAccordion === "Monitoring" ? "24px" : "0 24px",
                  background: "#ffffff",
                }}
              >
                <div className="accordion-content" style={{ color: "#475569", lineHeight: "1.6" }}>
                  <div
                    className="cards-grid"
                    style={{
                      display: "grid", 
                      gap: isMobile ? "20px" : "20px",
                      maxWidth: "1400px",
                      margin: "0 auto",
                    }}
                  >
                    {categories[3].products.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        onClick={() => handleCardClick(product.path)}
                        style={{
                          width: "100%",
                          minHeight: isMobile ? "auto" : "auto",
                          backgroundColor: "#fff",
                          borderRadius: "12px",
                          boxShadow: product.path
                            ? "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)"
                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                          border: product.path ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: product.path ? "pointer" : "not-allowed",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          opacity: product.path ? 1 : 0.4,
                          padding: isMobile ? "15px 20px" : "15px 20px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 1;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            const gradientEl = e.currentTarget.querySelector(
                              ".card-hover-gradient"
                            );
                            if (gradientEl) gradientEl.style.opacity = 0;
                          }
                        }}
                      >
                        {product.path && (
                          <div
                            className="card-hover-gradient"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(135deg, rgba(30, 64, 175, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              pointerEvents: "none",
                              borderRadius: "12px",
                            }}
                          />
                        )}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(4, 1fr)",
                            gap:"20px",
                            width: "100%",
                            height: "100%",
                            zIndex: 1,
                            position: "relative",
                            alignItems: "center",
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "100%" : "100%", 
                                height: isMobile ? "90px" : "90px", 
                                background:"#000",
                                transition: "transform 0.3s ease",
                              }} 
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  filter: product.path
                                    ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                                    : "none",
                                }}
                              />
                            </div>
                          )}
                          <h3
                            style={{
                              fontSize: isMobile ? "18px" : "20px",
                              color: "#000",
                              textAlign: "left", 
                              fontWeight: "600",
                              letterSpacing: "-0.2px",
                              lineHeight: "1.3",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              fontSize: isMobile ? "14px" : "15px",
                              color: "#000",
                              textAlign: "left", 
                              lineHeight: "1.5",
                              fontWeight: "400",
                              flex: 1,
                            }}
                          >
                            {product.intro}
                          </p>
                          {product.path && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(product.path);
                              }}
                              style={{
                                padding: "8px 0px",
                                backgroundColor: "#F37F63",
                                color: "#000",
                                border: "none", 
                                fontSize: isMobile ? "13px" : "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                textTransform: "none", 
                                width:"108px",
                                margin: isMobile ? "0 0" : "0 auto",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(96, 34, 166, 0.3)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#F37F63";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              Explore 3D
                            </button>
                          )}
                          {!product.path && (
                            <div
                              style={{
                                marginTop: "16px",
                                padding: "6px 16px",
                                backgroundColor: "#f1f5f9",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "#222222",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Us Modal */}
      <ContactUsModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Home;
