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

  const cards = [
    { name: "9100c NXT", path: "/9100nxt", image: Image9100NXT, isBig: true },
    { name: "CS750", path: "/cs750", image: ImageCS750, isBig: true },
    { name: "SLE6000", path: "/sle6000", image: ImageSLE6000, isBig: true },
    { name: "MAC 5", path: "/mac-5", image: ImageMAC5, isBig: true },
    { name: "Lullaby Warmer", path: "/warmer", image: ImageWarmer, isBig: true },
    { name: "Giraffe Omnibed Carestation", path: "/giraffe-omnibed-carestation", image: ImageGiraffeOmnibedCarestation, isBig: true },
    { name: "LED Phototherapy", path: "/led-phototherapy", image: ImageLEDPhototherapy, isBig: true },
    { name: "ECG Holter", path: "/ecg-holter", image: ImageECGHolter, isBig: true },
    { name: "B1xM Monitors", path: "/monitors-b1xm", image: ImageMonitorB1xM, isBig: true },
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
          top: 0;
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
          gap: 4px;
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
            backgroundColor: "#ffffff",
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
                src="/logo.png"
                alt="GE HealthCare Logo"
                style={{
                  height: isMobile ? "32px" : "40px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <h2
                className="header-title"
                style={{
                  color: "#6022A6",
                  padding: "0 0px",
                  fontSize: isMobile ? "16px" : "20px",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                GE HealthCare
              </h2>
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
            <div
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
            </div>
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
                Products
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
                About
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
                Contact
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
              marginBottom: isMobile ? "40px" : "60px",
            }}
          >
            <h1
              className="main-heading"
              style={{
                fontSize: isMobile ? "27px" : "45px",
                color: "#1e293b",
                marginBottom: "16px",
                fontWeight: "700",
                letterSpacing: "-1px",
                lineHeight: "1.1",
                padding: isMobile ? "0 8px" : "0",
              }}
            >
              Explore our innovative healthcare solutions
            </h1>
          </div>

          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: isMobile ? "20px" : "30px",
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(card.path)}
              style={{
                width: "100%",
                minHeight: card.isBig
                  ? isMobile
                    ? "270px"
                    : "270px"
                  : isMobile
                  ? "270px"
                  : "270px",
                backgroundColor: "#000",
                borderRadius: "12px",
                boxShadow: card.path
                  ? "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)"
                  : "0 2px 4px rgba(0, 0, 0, 0.05)",
                border: card.path ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                display: "flex",
                flexDirection: "column",
                justifyContent: card.image ? "space-between" : "center",
                alignItems: "center",
                cursor: card.path ? "pointer" : "not-allowed",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: card.path ? 1 : 0.4,
                padding: isMobile ? "15px 15px" : "20px 20px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (card.path) {
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
                if (card.path) {
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
              {/* Hover gradient effect */}
              {card.path && (
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
                {card.image && (
                  <div
                    className={
                      card.isBig ? "card-image-size" : "card-image-size-small"
                    }
                    style={{
                      width: card.isBig
                        ? isMobile
                          ? "180px"
                          : "220px"
                        : isMobile
                        ? "120px"
                        : "150px",
                      height: card.isBig
                        ? isMobile
                          ? "180px"
                          : "220px"
                        : isMobile
                        ? "120px"
                        : "150px",
                      marginBottom: isMobile ? "15px" : "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (card.path && !isMobile) {
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
                      src={card.image}
                      alt={card.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: card.path
                          ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
                          : "none",
                      }}
                    />
                  </div>
                )}

                <h2
                  style={{
                    fontSize: card.isBig
                      ? isMobile
                        ? "20px"
                        : "24px"
                      : isMobile
                      ? "18px"
                      : "20px",
                    color: "#fff",
                    textAlign: "center",
                    margin: 0,
                    fontWeight: "600",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {card.name}
                </h2>

                {!card.path && (
                  <div
                    style={{
                      marginTop: "12px",
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
    </>
  );
};

export default Home;
