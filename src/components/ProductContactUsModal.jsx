import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

const INITIAL_FORM = {
  fullName: "",
  organizationName: "",
  email: "",
  contactNumber: "",
  designation: "",
  cityOrLocation: "",
  demoGivenBy: "sales_representative",
  representativeName: "",
  regionOrTeam: "",
  intent: "",
};

const INTENT_OPTIONS = [
  { id: "request_detailed_demo", label: "Request a Detailed Demo" },
  { id: "speak_product_expert", label: "Speak to a Product Expert" },
  { id: "get_quotation", label: "Get a Quotation" },
  { id: "just_exploring", label: "Just Exploring" },
];

function ProductContactUsModal({
  isOpen,
  onClose,
  productCategory = "",
  productName = "",
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");

  const normalizedProductCategory = useMemo(
    () => productCategory || "General",
    [productCategory]
  );
  const normalizedProductName = useMemo(
    () => productName || "GE HealthCare Product",
    [productName]
  );

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;

    const fetchCurrentUserDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/me/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        const user = data?.user;
        if (!user || cancelled) return;

        setCurrentUserRole(user.role || "");

        if (user.role === "customer") {
          setForm((prev) => ({
            ...prev,
            fullName: user.name || prev.fullName || "",
            organizationName:
              user.hospitalOrOrganizationName || prev.organizationName || "",
            email: user.email || prev.email || "",
            contactNumber: user.contactNumber || prev.contactNumber || "",
            designation: user.designation || prev.designation || "",
            cityOrLocation: user.cityOrLocation || prev.cityOrLocation || "",
            representativeName: "",
            regionOrTeam: "",
          }));
          return;
        }

        if (user.role === "sales_representative_application_specialist") {
          setForm((prev) => ({
            ...prev,
            fullName: "",
            organizationName: "",
            email: "",
            contactNumber: "",
            designation: "",
            cityOrLocation: "",
            representativeName: user.name || prev.representativeName || "",
            regionOrTeam: user.regionOrTeam || prev.regionOrTeam || "",
            demoGivenBy: "sales_representative",
          }));
        }
      } catch {
        // Keep popup usable even if profile prefill fails.
      }
    };

    fetchCurrentUserDetails();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const closeAndReset = () => {
    setForm(INITIAL_FORM);
    setError("");
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.fullName.trim() ||
      !form.organizationName.trim() ||
      !form.email.trim() ||
      !form.contactNumber.trim() ||
      !form.intent
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitted(true);
  };

  const sectionTitleStyle = {
    margin: 0,
    color: "#6022A6",
    fontSize: "16px",
    fontWeight: "700",
  };

  const isCustomerUser = currentUserRole === "customer";
  const isSalesOrAppSpecialist =
    currentUserRole === "sales_representative_application_specialist";

  const sectionStyle = {
    padding: "0",
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
      onClick={closeAndReset}
    >
      <div
        style={{
          width: "min(960px, 96vw)",
          maxHeight: "92vh",
          overflowY: "auto",
          backgroundColor: "#f8fafc",
          borderRadius: "16px",
          boxShadow: "0 24px 60px rgba(2, 6, 23, 0.35)",
          border: "1px solid #e2e8f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(248, 250, 252, 0.96)",
            backdropFilter: "blur(2px)",
            borderBottom: "1px solid #e2e8f0",
            padding: "14px 18px",
          }}
        >
          <img
            src="/logo_GE.png"
            alt="GE HealthCare Logo"
            style={{ height: "34px", width: "auto", objectFit: "contain" }}
          />
          <button
            type="button"
            onClick={closeAndReset}
            style={{
              border: "1px solid #cbd5e1",
              backgroundColor: "#fff",
              color: "#334155",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: "18px" }}>
          {submitted ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <h2 style={{ margin: "0 0 10px", color: "#111827" }}>Thank You</h2>
              <p style={{ margin: "0 0 20px", color: "#475569" }}>
                Our team will connect with you shortly.
              </p>
              <button
                type="button"
                onClick={closeAndReset}
                style={{
                  border: "none",
                  backgroundColor: "#6022A6",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Continue Exploring Products
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={sectionStyle}>
                <h2 style={{ margin: "0 0 8px", color: "#0f172a" }}>
                  Continue Your Product Experience
                </h2>
                <p style={{ margin: 0, color: "#475569", fontSize: "14px" }}>
                  Thank you for exploring our 3D Digital Demo. Share a few details
                  so our team can assist you further.
                </p>
              </div>

              {error && (
                <p style={{ color: "#dc2626", margin: "0 0 12px", fontWeight: "600" }}>
                  {error}
                </p>
              )}

              <div style={sectionStyle}>
                <h3 style={{ ...sectionTitleStyle, marginBottom: "14px" }}>
                  {isSalesOrAppSpecialist ? "Customer Details" : "Your Details"}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Full Name <span style={{ color: "#dc2626" }}>*</span></label>
                    <input style={inputStyle} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Hospital / Organization Name <span style={{ color: "#dc2626" }}>*</span></label>
                    <input style={inputStyle} value={form.organizationName} onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address <span style={{ color: "#dc2626" }}>*</span></label>
                    <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Number <span style={{ color: "#dc2626" }}>*</span></label>
                    <input style={inputStyle} value={form.contactNumber} onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Designation (Optional)</label>
                    <input style={inputStyle} value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>City / Location (Optional)</label>
                    <input style={inputStyle} value={form.cityOrLocation} onChange={(e) => setForm((f) => ({ ...f, cityOrLocation: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ ...sectionTitleStyle, marginBottom: "14px" }}>
                  Product You Explored
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Product Category</label>
                    <input disabled style={{ ...inputStyle, backgroundColor: "#f1f5f9", color: "#475569" }} value={normalizedProductCategory} />
                  </div>
                  <div>
                    <label style={labelStyle}>Product Name</label>
                    <input disabled style={{ ...inputStyle, backgroundColor: "#f1f5f9", color: "#475569" }} value={normalizedProductName} />
                  </div>
                </div>
              </div>

              {!isCustomerUser && (
                <div style={sectionStyle}>
                  <h3 style={{ ...sectionTitleStyle, marginBottom: "14px" }}>Demo Information</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Demo Given By</label>
                      <select
                        style={inputStyle}
                        value={form.demoGivenBy}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, demoGivenBy: e.target.value }))
                        }
                      >
                        <option value="sales_representative">Sales Representative</option>
                        <option value="application_specialist">Application Specialist</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Representative Name (Optional)</label>
                      <input style={inputStyle} value={form.representativeName} onChange={(e) => setForm((f) => ({ ...f, representativeName: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Region / Team (Optional)</label>
                      <input style={inputStyle} value={form.regionOrTeam} onChange={(e) => setForm((f) => ({ ...f, regionOrTeam: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              <div style={sectionStyle}>
                <h3 style={{ ...sectionTitleStyle, marginBottom: "14px" }}>
                  What would you like to do next?
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  {INTENT_OPTIONS.map((opt) => {
                    const selected = form.intent === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, intent: opt.id }))}
                        style={{
                          border: selected ? "2px solid #6022A6" : "1px solid #cbd5e1",
                          backgroundColor: selected ? "#f3e8ff" : "#fff",
                          color: "#1e293b",
                          borderRadius: "10px",
                          padding: "12px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight: "600",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "6px 2px 2px" }}>
                <button
                  type="submit"
                  style={{
                    border: "none",
                    backgroundColor: "#6022A6",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "12px 22px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  Submit & Connect
                </button>
                <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#64748b" }}>
                  Our team will get in touch with you shortly.
                </p>
              </div>

              <p
                style={{
                  margin: "16px 0 0",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Your information will only be used to assist you with relevant
                product communication.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductContactUsModal;
