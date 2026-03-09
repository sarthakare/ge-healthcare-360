import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ContactUsModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [showPhoneNumbers, setShowPhoneNumbers] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Price Quote");
  const [message, setMessage] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryDropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    country: "India",
    zipCode: "",
    keepUpdated: false,
  });

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setShowPhoneNumbers(false);
      // Reset form data
      setFormData({
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        country: "India",
        zipCode: "",
        keepUpdated: false,
      });
    }, 200);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", { ...formData, message, selectedOption });
    // You can add API call here
    // handleClose(); // Close modal after submission if needed
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setMessage(`I'd like a ${selectedOption} on null`);
    }
  }, [isOpen, selectedOption]);

  useEffect(() => {
    setMessage(`I'd like a ${selectedOption} on null`);
  }, [selectedOption]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const options = [
    "Price Quote",
    "Product Demo",
    "Product Info",
    "Training/Education",
  ];

  const countries = [
    "India",
    "United States",
    "Canada",
    "United Kingdom",
    "US Virgin Islands",
    "US Military Overseas",
    "China",
    "France",
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: isMobileView ? "flex-start" : "center",
        justifyContent: "center",
        zIndex: 2000,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
        padding: isMobileView ? "12px" : "0",
        boxSizing: "border-box",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: isMobileView ? "20px 16px" : "60px",
          maxWidth: "900px",
          width: isMobileView ? "100%" : "90%",
          maxHeight: isMobileView ? "calc(100vh - 24px)" : "90vh",
          overflowY: "auto",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "32px",
            height: "32px",
            border: "none",
            backgroundColor: "transparent",
            color: "#666",
            fontSize: "28px",
            fontWeight: "300",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#666";
          }}
        >
          ×
        </button>

        {/* Title */}
        <p
          style={{
            fontSize: isMobileView ? "26px" : "32px",
            color: "#333",
            lineHeight: "1.5",
            margin: "0 0 20px 0",
            fontFamily: "'Source Sans Pro', sans-serif",
          }}
        >
          Contact Us
        </p>

        {/* Main Message */}
        <p
          style={{
            fontSize: isMobileView ? "24px" : "32px",
            color: "#333",
            margin: "0 0 24px 0",
            lineHeight: "1.5",
            fontFamily: "'Source Sans Pro', sans-serif",
          }}
        >
          We're ready to support you in your moments that matter. For service
          assistance, call us.
        </p>

        {/* Phone Option */}
        <div style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontSize: "16px",
              color: "#333",
              margin: "0 0 8px 0",
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
          >
            Would you prefer to speak to us on the phone?
          </p>
          {showPhoneNumbers && (
            <div
              style={{
                marginTop: "12px",
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                For information on GE Healthcare products, call: 1800 102 2977
              </p>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                You can also email us at{" "}
                <a href="mailto:TeamGEHealthcare@gehealthcare.com">
                  TeamGEHealthcare@gehealthcare.com
                </a>
              </p>
              <p
                style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#333" }}
              >
                For service-related calls or to log a new service request, call
                the GE Healthcare Maintenance and Service solutions:
              </p>
              <p
                style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#333" }}
              >
                1800-102-7750, 1800-419-7750, 1800-425-7255 or 1800-425-8025
              </p>
              <p
                style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555" }}
              >
                (Monday – Saturday 9 am to 6 pm IST)
              </p>
              <p style={{ margin: 0, fontSize: "16px", color: "#333" }}>
                Email:{" "}
                <a href="mailto:gehealthcareservices@gehealthcare.com">
                  gehealthcareservices@gehealthcare.com
                </a>
              </p>
            </div>
          )}
          <button
            onClick={() => setShowPhoneNumbers(!showPhoneNumbers)}
            style={{
              background: "none",
              border: "none",
              color: "#6022A6",
              fontSize: "16px",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Source Sans Pro', sans-serif",
              fontWeight: "600",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4a1a85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6022A6";
            }}
          >
            {showPhoneNumbers ? "Hide phone numbers" : "Show phone numbers"}
            <span
              style={{
                fontSize: "20px",
                display: "inline-block",
              }}
            >
              {showPhoneNumbers ? "−" : "+"}
            </span>
          </button>
        </div>

        {/* What can we help you with */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "16px",
              color: "#333",
              margin: "0 0 16px 0",
              fontWeight: "600",
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
          >
            What can we help you with?
          </p>
          <div
            style={{
              border: "1px solid #d6d6d6",
              padding: "8px",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: isMobileView ? "wrap" : "nowrap",
                border: "1px solid #d6d6d6",
                borderRadius: "6px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    flex: isMobileView ? "1 1 100%" : "1",
                    padding: "14px 16px",
                    backgroundColor:
                      selectedOption === option ? "#6022A6" : "#fff",
                    color: selectedOption === option ? "#fff" : "#555",
                    border: "none",
                    borderRight:
                      option !== options[options.length - 1]
                        ? "1px solid #e5e7eb"
                        : "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    transition: "all 0.2s",
                    whiteSpace: isMobileView ? "normal" : "nowrap",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedOption !== option) {
                      e.currentTarget.style.backgroundColor = "#f5f3ff";
                      e.currentTarget.style.color = "#6022A6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOption !== option) {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.color = "#555";
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Text Area */}
        <div style={{ marginBottom: "32px" }}>
          <style>
            {`
              .contact-modal-textarea::placeholder {
                color: #999;
              }
            `}
          </style>
          <label
            style={{
              display: "block",
              fontSize: "16px",
              color: "#333",
              marginBottom: "8px",
              fontWeight: "500",
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
          >
            Message
          </label>
          <textarea
            className="contact-modal-textarea"
            value={message}
            onChange={handleMessageChange}
            placeholder={`I'd like a ${selectedOption} on null`}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              fontSize: "16px",
              fontFamily: "'Source Sans Pro', sans-serif",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
              boxSizing: "border-box",
              backgroundColor: "#f5f0ff",
            }}
          />
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit}>
          {/* Who should we contact? */}
          <div style={{ marginBottom: "32px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 8px 0",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              Who should we contact?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: "0 0 20px 0",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              Your privacy matters, learn about our{" "}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "#6022A6",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                privacy policy.
              </a>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobileView ? "1fr" : "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                  }}
                >
                  Name<span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    backgroundColor: "#f5f0ff",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                  }}
                >
                  Surname<span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    backgroundColor: "#f5f0ff",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobileView ? "1fr" : "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                  }}
                >
                  E-mail<span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    backgroundColor: "#f5f0ff",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    backgroundColor: "#f5f0ff",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Where do you work? */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 8px 0",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              Where do you work?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: "0 0 20px 0",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              This helps direct you to the right specialist.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobileView ? "1fr" : "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                  }}
                >
                  Country<span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <div style={{ position: "relative" }} ref={countryDropdownRef}>
                  <input type="hidden" name="country" value={formData.country} />
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isCountryOpen}
                    style={{
                      width: "100%",
                      padding: "12px 40px 12px 12px",
                      fontSize: "16px",
                      fontFamily: "'Source Sans Pro', sans-serif",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxSizing: "border-box",
                      backgroundColor: "#f5f0ff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      color: "#333",
                    }}
                  >
                    <span>{formData.country}</span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6022A6",
                      }}
                      aria-hidden="true"
                    >
                      {isCountryOpen ? (
                        <ChevronUp size={18} color="#6022A6" />
                      ) : (
                        <ChevronDown size={18} color="#6022A6" />
                      )}
                    </span>
                  </button>
                  {isCountryOpen && (
                    <div
                      role="listbox"
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        top: "calc(100% + 4px)",
                        left: 0,
                        width: "100%",
                        maxHeight: "220px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        backgroundColor: "#f5f0ff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {countries.map((country) => (
                        <div
                          key={country}
                          role="option"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              country,
                            }));
                            setIsCountryOpen(false);
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            backgroundColor:
                              formData.country === country ? "#f5f0ff" : "#fff",
                            color: "#333",
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                  }}
                >
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    backgroundColor: "#f5f0ff",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              <input
                type="checkbox"
                name="keepUpdated"
                checked={formData.keepUpdated}
                onChange={handleInputChange}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#6022A6",
                }}
              />
              <span style={{ fontSize: "14px", color: "#333" }}>
                Please keep me updated on the latest product and services
                information.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px 24px",
              backgroundColor: "#6022A6",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "'Source Sans Pro', sans-serif",
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4a1a85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#6022A6";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsModal;
