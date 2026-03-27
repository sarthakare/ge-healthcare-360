import { useState, useRef, useEffect } from "react";

const DisclaimerButton = ({ disclaimerText = "", left = "clamp(12px, 2.5vw, 20px)" }) => {
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef(null);

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
        .disclaimer-btn {
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
        .disclaimer-btn:hover {
          background: rgba(25, 18, 40, 0.95);
        }
        .disclaimer-btn svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .disclaimer-btn { padding: 6px 12px; gap: 6px; }
          .disclaimer-btn svg { width: 14px; height: 14px; }
        }
      `}</style>
      <div
        ref={ref}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        style={{
          position: "absolute",
          bottom: "clamp(12px, 2.5vw, 20px)",
          left,
          zIndex: 15,
        }}
      >
        <button
          className="disclaimer-btn"
          onClick={() => setShowPopup((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Disclaimer
        </button>
        {showPopup && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              marginBottom: "10px",
              width: "min(520px, calc(100vw - 40px))",
              maxHeight: "min(320px, 50vh)",
              overflowY: "auto",
              padding: "clamp(12px, 3vw, 18px)",
              backgroundColor: "rgba(15, 10, 25, 0.92)",
              borderRadius: "12px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(10px, 1.8vw, 12px)",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {disclaimerText}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DisclaimerButton;
