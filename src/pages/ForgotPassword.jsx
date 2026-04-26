import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";

const ForgotPassword = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSent(true);
    } catch {
      setError("Unable to connect. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
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
            Forgot password
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#475569",
              marginBottom: "28px",
              lineHeight: 1.5,
            }}
          >
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {sent ? (
            <div style={{ fontSize: "15px", color: "#1e293b", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 16px", fontWeight: "600", color: "#15803d" }}>
                Email sent
              </p>
              <p style={{ margin: "0 0 12px" }}>
                We&apos;ve sent a password reset link to your inbox. Please:
              </p>
              <ul style={{ margin: "0 0 16px", paddingLeft: "20px" }}>
                <li>Open the email from us (check spam or promotions if you don&apos;t see it).</li>
                <li>Click the reset link. It is valid for one hour.</li>
                <li>Choose a new password on the next page, then sign in with it.</li>
              </ul>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                If the link expires, request a new one from the sign-in page.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="forgot-email"
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
                id="forgot-email"
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
                  marginBottom: "24px",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />

              {error && (
                <p style={{ marginBottom: "16px", fontSize: "14px", color: "#dc2626" }}>{error}</p>
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
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p
            style={{
              marginTop: "24px",
              fontSize: "14px",
              color: "#475569",
              textAlign: "center",
            }}
          >
            <Link to="/login" style={{ color: "#6022A6", fontWeight: "600", textDecoration: "none" }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default ForgotPassword;
