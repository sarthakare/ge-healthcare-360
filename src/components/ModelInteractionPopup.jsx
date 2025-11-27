import { useState, useEffect } from "react";
import MouseRightIcon from "../assets/info_popup/Mouse-right.svg";
import FingerIcon from "../assets/info_popup/Finger.svg";
import PinchZoomIcon from "../assets/info_popup/Pinch-Zoom.svg";

const ModelInteractionPopup = ({ isOpen, onClose, modelName = "CS750" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // Wait for fade-out animation
  };

  const handleDone = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease",
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
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
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
            top: "15px",
            right: "15px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            color: "#666",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s, transform 0.2s",
            lineHeight: "1",
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ×
        </button>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* First Instruction */}
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#333",
              fontWeight: "400",
            }}
          >
            Press right-click & scroll to zoom in & zoom out any section on the
            model.
          </p>

          {/* Icons Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              gap: "20px",
              padding: "10px 0",
            }}
          >
            <img
              src={MouseRightIcon}
              alt="Mouse right-click"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
              }}
            />
            <img
              src={FingerIcon}
              alt="Single finger tap"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
              }}
            />
            <img
              src={PinchZoomIcon}
              alt="Pinch zoom"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Second Instruction */}
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#333",
              fontWeight: "400",
            }}
          >
            To explore {modelName}, Click on features button or click the
            hotspots on the model.
          </p>

          {/* Done Button */}
          <button
            onClick={handleDone}
            style={{
              alignSelf: "flex-start",
              padding: "12px 24px",
              backgroundColor: "#337ab7",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s",
              marginTop: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2868a0";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#337ab7";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelInteractionPopup;

