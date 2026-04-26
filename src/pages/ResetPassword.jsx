import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthPageLayout from "../components/AuthPageLayout";

/** @typedef {'loading' | 'valid' | 'already_used' | 'invalid'} TokenStatus */

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  /** @type {[TokenStatus | null, function]} */
  const [tokenStatus, setTokenStatus] = useState(() => (token ? null : "invalid"));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }

    let cancelled = false;
    setTokenStatus("loading");

    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/verify-reset-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setTokenStatus("invalid");
          return;
        }
        const status = data.status;
        if (status === "valid" || status === "already_used" || status === "invalid") {
          setTokenStatus(status);
        } else {
          setTokenStatus("invalid");
        }
      } catch {
        if (!cancelled) setTokenStatus("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === "already_used") {
          setTokenStatus("already_used");
          return;
        }
        setError(data.error || "Could not reset password.");
        return;
      }
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch {
      setError("Unable to connect. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  const missingTokenInitially = !token;

  const showForm = tokenStatus === "valid" && !done;
  const checking = tokenStatus === "loading" || (tokenStatus === null && !!token);

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

          {checking && (
            <>
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
                Checking your link
              </h1>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.5 }}>Please wait…</p>
            </>
          )}

          {tokenStatus === "already_used" && (
            <>
              <h1
                className="login-title"
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "#15803d",
                  marginBottom: "8px",
                  letterSpacing: "-0.5px",
                }}
              >
                Password reset complete
              </h1>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, marginBottom: "8px" }}>
                This link has already been used and your password was updated successfully. You do not need to
                reset it again.
              </p>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                Sign in with your new password. If you did not make this change, contact support right away.
              </p>
            </>
          )}

          {tokenStatus === "invalid" && (
            <>
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
                Link not usable
              </h1>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, marginBottom: "16px" }}>
                {missingTokenInitially
                  ? "This page needs a valid reset link from your email. Open the link from your message, or request a new reset."
                  : "This reset link is invalid or has expired. Request a new password reset from the sign-in page."}
              </p>
              <Link
                to="/forgot-password"
                style={{
                  color: "#6022A6",
                  fontWeight: "600",
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                Request a new reset link
              </Link>
            </>
          )}

          {(showForm || done) && tokenStatus === "valid" && (
            <>
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
                {done ? "Password reset successfully" : "Reset password"}
              </h1>
              {!done && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#475569",
                    marginBottom: "28px",
                    lineHeight: 1.5,
                  }}
                >
                  Choose a new password for your account.
                </p>
              )}
            </>
          )}

          {done && (
            <p style={{ fontSize: "15px", color: "#15803d", marginBottom: "16px" }}>
              Your password has been updated. Redirecting to sign in…
            </p>
          )}

          {showForm && (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="reset-password"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "8px",
                }}
              >
                New password
              </label>
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                  minLength={6}
                  autoComplete="new-password"
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

              <label
                htmlFor="reset-password-confirm"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222222",
                  marginBottom: "8px",
                }}
              >
                Confirm password
              </label>
              <input
                id="reset-password-confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="login-input"
                required
                minLength={6}
                autoComplete="new-password"
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
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Saving…" : "Update password"}
              </button>
            </form>
          )}

          {!checking && (
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
          )}
        </div>
      </div>
    </AuthPageLayout>
  );
};

export default ResetPassword;
