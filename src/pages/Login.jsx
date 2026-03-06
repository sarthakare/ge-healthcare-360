import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ContactUsModal from "../components/ContactUsModal";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate(location.state?.from?.pathname || "/", { replace: true });
    }
  }, [navigate, location.state?.from?.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError("Unable to connect. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        {/* Header - same as rest of app */}
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
              onClick={(e) => { e.preventDefault(); navigate("/"); setIsMenuOpen(false); }}
              style={{ color: "#6022A6", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setIsContactModalOpen(true); setIsMenuOpen(false); }}
              style={{ color: "#222222", textDecoration: "none", fontSize: "18px", fontWeight: "400" }}
            >
              Contact Us
            </a>
          </nav>
        </div>

        {/* Login content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 73px)",
            padding: isMobile ? "24px 16px" : "48px 24px",
            background: "linear-gradient(180deg, rgba(96, 34, 166, 0.04) 0%, #ffffff 30%)",
          }}
        >
          <div
            className="login-card"
            style={{
              maxWidth: "420px",
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
              padding: "40px 32px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "4px",
                background: "linear-gradient(90deg, #6022A6 0%, #8B5CF6 100%)",
                borderRadius: "2px",
                marginBottom: "24px",
              }}
            />
            <h1
              className="login-title"
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#6022A6",
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#475569",
                marginBottom: "28px",
                lineHeight: 1.5,
              }}
            >
              Enter your credentials to access the 3D Experience Centre.
            </p>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />

              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative", marginBottom: "24px" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    paddingRight: "44px",
                    fontSize: "15px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#475569",
                    fontSize: "13px",
                    padding: "4px",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div style={{ marginBottom: "24px", textAlign: "right" }}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: "#6022A6",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#4a1d85")}
                  onMouseLeave={(e) => (e.target.style.color = "#6022A6")}
                >
                  Forgot password?
                </a>
              </div>

              {error && (
                <p
                  style={{
                    marginBottom: "16px",
                    fontSize: "14px",
                    color: "#dc2626",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "#6022A6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a1d85";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(96, 34, 166, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#6022A6";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p
              style={{
                marginTop: "24px",
                fontSize: "14px",
                color: "#475569",
                textAlign: "center",
              }}
            >
              Don&apos;t have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactModalOpen(true);
                }}
                style={{
                  color: "#6022A6",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>

      <ContactUsModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
};

export default Login;
