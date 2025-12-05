import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Image9100NXT from "../assets/9100nxt/images/9100nxt.png";
import ImageCS750 from "../assets/cs750/images/cs750.png";
import ImageSLE6000 from "../assets/sle6000/images/sle6000.png";
import ImageMAC5 from "../assets/mac-5/images/mac-5.png";
import ImageWarmer from "../assets/lubby-warmer/images/warmer.png";
import ImageGiraffeOmnibedCarestation from "../assets/giraffe-omnibed-carestation/images/giraffe-omnibed-carestation.png";
import ImageLEDPhototherapy from "../assets/led-phototherapy/images/led-phototherapy.png";
import ImageECGHolter from "../assets/ecg-holter/images/ecg-holter.png";
import ImageMonitorB1xM from "../assets/monitors-b1xm/images/A.png";

const Home = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("DiagnosticCardiology");

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

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

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
          path: "/warmer",
          image: ImageWarmer,
          intro: "Interact with the Lullaby Warmer and see how its simple controls and stable thermal environment support safer newborn care.",
        },
        {
          name: "Giraffe OmniBed Carestation – Incubator + warmer integrated neonatal carestation",
          path: "/giraffe-omnibed-carestation",
          image: ImageGiraffeOmnibedCarestation,
          intro: "Step inside the 3D model to explore the controlled micro-environment, access doors, and caregiver-friendly design that support fragile neonates.",
        },
      ],
    },
    {
      name: "Anesthesia",
      products: [
        {
          name: "9100c NXT – Anaesthesia delivery workstation",
          path: "/9100nxt",
          image: Image9100NXT,
          intro: "Go inside the 3D demonstration of the 9100c NXT and explore its dependable anesthesia delivery system, ergonomic layout and core ventilation features.",
        },
        {
          name: "Carestation 750 – Advanced anesthesia workstation with lung-protective ventilation",
          path: "/cs750",
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
          path: "/monitors-b1xm",
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
            padding: 40px 16px 40px !important;
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
          background: #fff;
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
            backgroundColor: "#6022A6",
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
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                }}
                style={{
                  color: "#222222",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                Diagnostic Cardiology
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                }}
                style={{
                  color: "#222222",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                Maternal & Infant Care
              </a>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                }}
                style={{
                  color: "#222222",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                Anesthesia
              </a>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                }}
                style={{
                  color: "#222222",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                Monitoring
              </a>
 
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="main-content"
          style={{
            padding: isMobile ? "40px 16px 40px" : "60px 20px",
            position: "relative",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "50px" : "80px",
              maxWidth: "1000px",
              marginLeft: "auto",
              marginRight: "auto",
              padding: isMobile ? "0 16px" : "0 24px",
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
                color:"#6022A6",
                marginBottom: "28px",
                fontWeight: "600",
                fontStyle: "normal",
                fontDisplay: "swap",
                letterSpacing: "-1.5px",
                lineHeight: "1.15",
                padding: isMobile ? "0 8px" : "0",
                textShadow: "0 2px 20px rgba(96, 34, 166, 0.1)",
              }}
            >
              Step into GE HealthCare's interactive 3D Experience Centre
            </h1>
            
            <p
              style={{
                fontSize: isMobile ? "17px" : "20px",
                color: "#475569",
                lineHeight: "1.75",
                margin: 0,
                padding: isMobile ? "0 8px" : "0 20px",
                fontWeight: "400",
                maxWidth: "880px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <span
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
              </span>
              A digital space where you can explore our clinical technologies as if they were right in front of you. Navigate through <strong style={{ color: "#1e293b", fontWeight: "600" }}>Diagnostic Cardiology</strong>, <strong style={{ color: "#1e293b", fontWeight: "600" }}>Maternal & Infant Care</strong>, <strong style={{ color: "#1e293b", fontWeight: "600" }}>Anesthesia</strong> and <strong style={{ color: "#1e293b", fontWeight: "600" }}>Patient Monitoring</strong>, and dive into detailed 3D models, feature callouts, and guided walkthroughs. Each product has been brought to life to help clinicians, biomedical teams and decision-makers understand its capabilities, workflow advantages and real-world clinical impact.
            </p>
          </div>

          <div className="accordion-container" style={{ maxWidth: "1000px", margin: "0 auto 60px", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
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
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: isMobile ? "24px" : "30px",
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
                          minHeight: isMobile ? "auto" : "420px",
                          backgroundColor: "#000",
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
                          padding: isMobile ? "20px 16px" : "24px 24px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#6022A6";
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
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            zIndex: 1,
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "180px" : "200px",
                                height: isMobile ? "180px" : "200px",
                                marginBottom: isMobile ? "16px" : "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (product.path && !isMobile) {
                                  e.currentTarget.style.transform = "scale(1.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.transform = "scale(1)";
                                }
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
                              color: "#fff",
                              textAlign: "center",
                              margin: "0 0 12px 0",
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
                              color: "#cbd5e1",
                              textAlign: "center",
                              margin: 0,
                              lineHeight: "1.5",
                              fontWeight: "400",
                            }}
                          >
                            {product.intro}
                          </p>
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
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: isMobile ? "24px" : "30px",
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
                          minHeight: isMobile ? "auto" : "420px",
                          backgroundColor: "#000",
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
                          padding: isMobile ? "20px 16px" : "24px 24px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#6022A6";
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
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            zIndex: 1,
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "180px" : "200px",
                                height: isMobile ? "180px" : "200px",
                                marginBottom: isMobile ? "16px" : "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (product.path && !isMobile) {
                                  e.currentTarget.style.transform = "scale(1.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.transform = "scale(1)";
                                }
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
                              color: "#fff",
                              textAlign: "center",
                              margin: "0 0 12px 0",
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
                              color: "#cbd5e1",
                              textAlign: "center",
                              margin: 0,
                              lineHeight: "1.5",
                              fontWeight: "400",
                            }}
                          >
                            {product.intro}
                          </p>
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
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: isMobile ? "24px" : "30px",
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
                          minHeight: isMobile ? "auto" : "420px",
                          backgroundColor: "#000",
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
                          padding: isMobile ? "20px 16px" : "24px 24px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#6022A6";
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
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            zIndex: 1,
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "180px" : "200px",
                                height: isMobile ? "180px" : "200px",
                                marginBottom: isMobile ? "16px" : "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (product.path && !isMobile) {
                                  e.currentTarget.style.transform = "scale(1.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.transform = "scale(1)";
                                }
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
                              color: "#fff",
                              textAlign: "center",
                              margin: "0 0 12px 0",
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
                              color: "#cbd5e1",
                              textAlign: "center",
                              margin: 0,
                              lineHeight: "1.5",
                              fontWeight: "400",
                            }}
                          >
                            {product.intro}
                          </p>
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
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: isMobile ? "24px" : "30px",
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
                          minHeight: isMobile ? "auto" : "420px",
                          backgroundColor: "#000",
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
                          padding: isMobile ? "20px 16px" : "24px 24px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (product.path) {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 12px 24px rgba(30, 64, 175, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)";
                            e.currentTarget.style.borderColor = "#6022A6";
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
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            zIndex: 1,
                          }}
                        >
                          {product.image && (
                            <div
                              style={{
                                width: isMobile ? "180px" : "200px",
                                height: isMobile ? "180px" : "200px",
                                marginBottom: isMobile ? "16px" : "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (product.path && !isMobile) {
                                  e.currentTarget.style.transform = "scale(1.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.transform = "scale(1)";
                                }
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
                              color: "#fff",
                              textAlign: "center",
                              margin: "0 0 12px 0",
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
                              color: "#cbd5e1",
                              textAlign: "center",
                              margin: 0,
                              lineHeight: "1.5",
                              fontWeight: "400",
                            }}
                          >
                            {product.intro}
                          </p>
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
    </>
  );
};

export default Home;
