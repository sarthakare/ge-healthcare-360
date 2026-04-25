import { useState, useRef, useEffect } from "react";

const defaultDetails = {
  title: "",
  intro: "",
  subheading: "",
  bullets: [],
};

const WhyButton = ({
  details = defaultDetails,
  label = "",
  inline = false,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef(null);

  const isStringDetails = typeof details === "string";
  const d = isStringDetails ? null : { ...defaultDetails, ...details };

  useEffect(() => {
    if (!showPopup) return;
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  return (
    <>
      <style>{`
        .why-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(15, 10, 25, 0.95);
          color: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: clamp(11px, 2.2vw, 13px);
          font-weight: 500;
          letter-spacing: 0.3px;
          transition: background 0.2s, transform 0.2s;
        }
        .why-btn:hover {
          background: rgba(25, 18, 40, 0.95);
        }
        .why-btn svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .why-btn { padding: 6px 12px; gap: 6px; }
          .why-btn svg { width: 14px; height: 14px; }
        }
        .why-popup-bullets {
          margin: 0;
          padding-left: 1.1em;
          list-style: disc;
        }
        .why-popup-bullets li {
          margin: 0.35em 0;
        }
        .why-popup-bullets li::marker {
          color: rgba(255, 255, 255, 0.45);
        }
      `}</style>
      <div
        ref={ref}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        style={{
          position: inline ? "relative" : "absolute",
          bottom: inline ? "auto" : "clamp(12px, 2.5vw, 20px)",
          zIndex: 15,
        }}
      >
        <button
          className="why-btn"
          type="button"
          onClick={() => setShowPopup((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {label}
        </button>
        {showPopup && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              marginBottom: "10px",
              width: "min(520px, calc(100vw - 40px))",
              maxHeight: "min(380px, 50vh)",
              overflowY: "auto",
              padding: "clamp(12px, 3vw, 18px)",
              backgroundColor: "rgba(15, 10, 25, 0.92)",
              borderRadius: "12px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
            role="dialog"
            aria-label={label}
          >
            {isStringDetails ? (
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(10px, 1.8vw, 12px)",
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.9)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {details}
              </p>
            ) : (
              <>
                {d.title ? (
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "clamp(12px, 2vw, 14px)",
                      fontWeight: 600,
                      lineHeight: "1.35",
                      color: "rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    {d.title}
                  </p>
                ) : null}
                {d.intro ? (
                  <p
                    style={{
                      margin: d.title ? "0 0 12px 0" : 0,
                      fontSize: "clamp(10px, 1.8vw, 12px)",
                      lineHeight: "1.6",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {d.intro}
                  </p>
                ) : null}
                {d.subheading ? (
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "clamp(10px, 1.8vw, 12px)",
                      fontWeight: 600,
                      lineHeight: "1.5",
                      color: "rgba(255, 255, 255, 0.92)",
                    }}
                  >
                    {d.subheading}
                  </p>
                ) : null}
                {d.bullets?.length > 0 ? (
                  <ul
                    className="why-popup-bullets"
                    style={{
                      fontSize: "clamp(10px, 1.8vw, 12px)",
                      lineHeight: "1.6",
                      color: "rgba(255, 255, 255, 0.88)",
                    }}
                  >
                    {d.bullets.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default WhyButton;
