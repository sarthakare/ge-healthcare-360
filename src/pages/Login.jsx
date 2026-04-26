import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";
import { useAuthPageContact } from "../context/AuthPageContactContext";
import "../App.css";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openContact } = useAuthPageContact() || {};
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
              <Link
                to="/forgot-password"
                style={{
                  color: "#6022A6",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
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
                openContact?.();
              }}
              style={{
                color: "#6022A6",
                fontWeight: "600",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
  );
}

const Login = () => (
  <AuthPageLayout>
    <LoginForm />
  </AuthPageLayout>
);

export default Login;
