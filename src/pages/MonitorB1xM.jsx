import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Environment,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import MonitorB1xMModel from "../assets/monitors-b1xm/model/Monitor Combined File.glb";
import ScalableAcrossCareAreasVideo from "../assets/monitors-b1xm/videos/01 Scalable Across Care Areas.mp4";
import IntuitiveVideo from "../assets/monitors-b1xm/videos/02 Intuitive.mp4";
import DINAMAPVideo from "../assets/monitors-b1xm/videos/04 Dinamap.mp4";
import EKProArrhythmiaAlgorithmVideo from "../assets/monitors-b1xm/videos/05 Ek-Pro Arrhythmia Algorithm.mp4";
import SpirometryVideo from "../assets/monitors-b1xm/videos/06 Spirometry.mp4";
import TestedForPerformanceVideo from "../assets/monitors-b1xm/videos/07 Tested For Performance.mp4";
import ScalableVideo from "../assets/monitors-b1xm/videos/08 Multi-Module Scalability.mp4";
import MonitorPortsVideo from "../assets/monitors-b1xm/videos/09 Multiple Monitor Ports.mp4";
import EntropyVideo from "../assets/monitors-b1xm/videos/10 Entropy™ Monitoring.mp4";
import ConnectedVideo from "../assets/monitors-b1xm/videos/11 Advanced Connectivity.mp4";
import ModelInteractionPopup from "../components/ModelInteractionPopup";
import DisclaimerButton from "../components/DisclaimerButton";
import WhyButton from "../components/WhyButton";
import ProductContactUsModal from "../components/ProductContactUsModal";

const b1x5mWhyDetails = {
  title: "Why B1 x5M Patient Monitors?",
  intro:
    "Because monitoring must adapt to patient acuity — and GE’s platform scales without changing systems.",
  subheading: "Key differentiators:",
  bullets: [
    "Same UI across acuity levels (reduces training burden)",
    "DINAMAP™ for consistent NIBP accuracy",
    "EK-Pro algorithm for advanced arrhythmia detection",
    "Modular architecture for parameter expansion",
  ],
};

const Model = ({ glbPath, onLoad }) => {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return <primitive object={scene} position={[0, -5, -5]} scale={6} />;
};

const Hotspot = ({
  position,
  annotation,
  hotspotNumber,
  onHotspotClick,
  isVideoPlaying,
  isSelected,
}) => {
  const { camera, scene } = useThree();
  const [isVisible, setIsVisible] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const raycasterRef = useRef(new THREE.Raycaster());

  useFrame(() => {
    const worldPosition = new THREE.Vector3(...position);
    worldPosition.project(camera);

    const isInFront = worldPosition.z < 1;
    if (!isInFront) {
      setIsVisible(false);
      return;
    }

    const cameraPosition = camera.position.clone();
    const hotspotPosition = new THREE.Vector3(...position);
    const direction = hotspotPosition.clone().sub(cameraPosition).normalize();
    const distance = cameraPosition.distanceTo(hotspotPosition);

    raycasterRef.current.set(cameraPosition, direction);
    const objectsToCheck = [];
    scene.traverse((object) => {
      if (object.isMesh && object.visible) {
        objectsToCheck.push(object);
      }
    });

    const intersections = raycasterRef.current.intersectObjects(
      objectsToCheck,
      false,
    );

    let isOccluded = false;
    if (intersections.length > 0) {
      const closestIntersection = intersections[0];
      if (closestIntersection.distance < distance - 0.2) {
        isOccluded = true;
      }
    }

    setIsVisible(!isOccluded);
  });

  if (!isVisible) return null;

  return (
    <Html
      position={position}
      center
      zIndexRange={showAnnotation || isVideoPlaying ? [70, 80] : [50, 60]}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease",
          animation: "pulse 2s infinite",
          position: "relative",
        }}
        onClick={onHotspotClick}
        onMouseEnter={() => setShowAnnotation(true)}
        onMouseLeave={() => setShowAnnotation(false)}
      >
        <svg
          width="44"
          height="56"
          viewBox="0 0 44 56"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "26px", height: "33px" }}
        >
          <path
            d="M22 2C11.5 2 3 10.5 3 21c0 14 19 33 19 33s19-19 19-33C41 10.5 32.5 2 22 2z"
            fill="#F37F63"
            stroke={isSelected ? "#FFE082" : "#FFFFFF"}
            strokeWidth={isSelected ? "3" : "2"}
          />
          <circle cx="22" cy="21" r="11" fill="#6022A6" />
          <text
            x="22"
            y="25"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#FFFFFF"
          >
            {hotspotNumber}
          </text>
        </svg>
        <div
          style={{
            position: "absolute",
            top: "calc(75%)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            fontSize: "12px",
            fontWeight: "600",
            color: "#6022A6",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            pointerEvents: "none",
            opacity: showAnnotation || isVideoPlaying ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 9999,
          }}
        >
          {annotation}
        </div>
      </div>
    </Html>
  );
};

const VideoPopup = ({
  isOpen,
  onClose,
  videoSrc,
  displayNumber,
  title,
  overview,
  features,
}) => {
  const videoRef = useRef(null);

  const handleClose = useCallback(() => {
    onClose();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [onClose]);

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
        justifyContent: "flex-start",
        zIndex: 1000,
        pointerEvents: "none",
        marginLeft: "20px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "400px",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: 0,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "65vh",
          overflowY: "auto",
          marginTop: "30px",
          pointerEvents: "auto",
        }}
      >
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s, transform 0.2s",
            flexShrink: 0,
            zIndex: 1001,
            lineHeight: "1",
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ×
        </button>
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  aspectRatio: "16 / 9",
                  objectFit: "contain",
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  outline: "none",
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  aspectRatio: "16 / 9",
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Video file not available. Please add the video file to the
                assets folder.
              </div>
            )}
          </div>
          <div style={{ color: "#000000" }}>
            <h2
              style={{
                margin: "0 0 15px 0",
                fontSize: "24px",
                lineHeight: "27px",
                fontWeight: "600",
                color: "#222",
                paddingRight: "0px",
              }}
            >
              {displayNumber ? `${displayNumber}. ${title}` : title}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {overview && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#6022A6",
                    }}
                  >
                    Overview
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "#000000",
                    }}
                  >
                    {overview}
                  </p>
                </div>
              )}

              {features && features.length > 0 && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#6022A6",
                    }}
                  >
                    Key Features
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "20px",
                      fontSize: "14px",
                      lineHeight: "1.8",
                      color: "#000000",
                    }}
                  >
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MonitorB1xM = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const orbitControlsRef = useRef();
  const [showInteractionPopup, setShowInteractionPopup] = useState(false);
  const hasShownPopupRef = useRef(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [hotspotMenuOpen, setHotspotMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const hotspotMenuRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleModelLoad = useCallback(() => {
    setIsLoading(false);
    // Show interaction popup after model loads (only once)
    if (!hasShownPopupRef.current) {
      setShowInteractionPopup(true);
      hasShownPopupRef.current = true;
    }
  }, []);

  const handleReset = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  const hotspots = [
    // { Removed this hotspot as per request from the suresh
    //   id: 1,
    //   name: "Introduction to B1x5M Patient Monitors",
    //   position: [-1.25, 1, 1.5],
    // },
    {
      id: 2,
      name: "Scalable Across Care Areas",
      position: [-1.25, -0.15, 1.5],
    },
    { id: 3, name: "Intuitive User Experience", position: [-2.25, -0.15, 1.5] },
    // { id: 4, name: "Modular & Scalable Platform", position: [-2.25, 1, 1.5] },
    { id: 5, name: "DINAMAP™ Blood Pressure", position: [-0.25, 1, 1.5] },
    {
      id: 6,
      name: "EK-Pro Arrhythmia Algorithm",
      position: [-0.75, 1.5, 1.5],
    },
    { id: 7, name: "Spirometry Monitoring", position: [-2, 1.5, 1.5] },
    {
      id: 8,
      name: "Tested for Performance",
      position: [-1.25, 0.5, 1.5],
    },
    { id: 9, name: "Multi-Module Scalability", position: [1.4, 0.75, 2.5] },
    { id: 10, name: "Monitor Ports", position: [-1.5, 0.2, 0.5] },
    { id: 11, name: "Entropy™ Monitoring", position: [-0.25, 0.5, 1.5] },
    { id: 12, name: "Advanced Connectivity", position: [-2.25, 0.5, 1.5] },
  ].map((hotspot, index) => ({
    ...hotspot,
    displayNumber: index + 1,
  }));

  const hotspotsConfig = {
    1: {
      videoSrc: null,
      title: "Introduction to B1x5M Patient Monitors",
      overview:
        "The B1x5M patient monitors are designed to adapt to your care environment, delivering reliable monitoring with the flexibility to scale as patient needs evolve.",
      features: [
        "Adaptable patient monitoring",
        "Designed for multiple care areas",
        "Reliable GE HealthCare technology",
        "Scalable clinical platform",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    2: {
      videoSrc: ScalableAcrossCareAreasVideo,
      title: "Scalable Across Care Areas",
      overview:
        "The B1x5M monitors are built to move seamlessly across emergency, perioperative, ICU, and step-down care settings.",
      features: [
        "ER to ICU coverage",
        "Continuity of monitoring",
        "Flexible deployment",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    3: {
      videoSrc: IntuitiveVideo,
      title: "Intuitive User Experience",
      overview:
        "A clean, intuitive interface helps you access critical patient information quickly, reducing training time and cognitive load.",
      features: [
        "Simple navigation",
        "Touch-based interface",
        "Faster clinical decisions",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    4: {
      videoSrc: null,
      title: "Modular & Scalable Platform",
      overview:
        "The modular design allows you to start with essential monitoring and expand capabilities as patient acuity increases.",
      features: [
        "Modular architecture",
        "Scalable parameters",
        "Future-ready design",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    5: {
      videoSrc: DINAMAPVideo,
      title: "DINAMAP™ Blood Pressure with Early Warning Score",
      overview:
        "Proven DINAMAP™ technology delivers consistent blood pressure measurements that feed directly into Early Warning Scores.",
      features: [
        "DINAMAP™ NIBP",
        "Early Warning Score support",
        "Early detection of deterioration",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    6: {
      videoSrc: EKProArrhythmiaAlgorithmVideo,
      title: "EK-Pro Arrhythmia Algorithm",
      overview:
        "EK-Pro continuously analyzes ECG waveforms to help identify arrhythmias and support timely clinical intervention.",
      features: [
        "Continuous ECG analysis",
        "Arrhythmia detection",
        "Patient safety support",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    7: {
      videoSrc: SpirometryVideo,
      title: "Spirometry Monitoring",
      overview:
        "Integrated spirometry provides deeper insight into respiratory function, helping assess ventilation and breathing patterns.",
      features: [
        "Respiratory assessment",
        "Spirometry integration",
        "Critical care support",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    8: {
      videoSrc: TestedForPerformanceVideo,
      title: "Tested for Performance",
      overview:
        "Each monitor is rigorously tested to ensure accuracy, durability, and reliability in demanding clinical environments.",
      features: ["Performance-tested", "Durable design", "Reliable monitoring"],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    9: {
      videoSrc: ScalableVideo,
      title: "Multi-Module Scalability",
      overview:
        "You can add or remove monitoring modules as clinical needs change, without disrupting workflow.",
      features: [
        "Flexible module configuration",
        "Supports changing acuity",
        "Workflow continuity",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    10: {
      videoSrc: MonitorPortsVideo,
      title: "Monitor Ports",
      overview:
        "Dedicated monitor ports simplify the connection of modules and accessories, enabling fast configuration.",
      features: [
        "Multiple ports",
        "Easy accessory integration",
        "Reduced setup time",
      ],
      rotation: {
        azimuthal: -Math.PI,
        polar: Math.PI / 2,
      },
    },
    11: {
      videoSrc: EntropyVideo,
      title: "Entropy™ Monitoring",
      overview:
        "Entropy™ monitoring provides real-time insight into patient response to anesthesia and sedation.",
      features: [
        "Depth of anesthesia monitoring",
        "Real-time data",
        "Supports optimal dosing",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    12: {
      videoSrc: ConnectedVideo,
      title: "Advanced Connectivity",
      overview:
        "Designed for connected care environments, the B1x5M supports secure data sharing with hospital networks and central stations.",
      features: [
        "Network connectivity",
        "Central station integration",
        "Secure data flow",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
  };

  const cartesianToSpherical = useCallback((position, target) => {
    const relativePos = position.clone().sub(target);
    const radius = relativePos.length();
    const polar = Math.acos(relativePos.y / radius);
    const azimuthal = Math.atan2(relativePos.x, relativePos.z);
    return { radius, polar, azimuthal };
  }, []);

  const animateCameraRotation = useCallback(
    (targetAzimuthal, targetPolar, currentDistance, duration = 1000) => {
      if (!orbitControlsRef.current) return;
      const controls = orbitControlsRef.current;
      const camera = controls.object;
      const target = controls.target;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const currentSpherical = cartesianToSpherical(camera.position, target);
      const startAzimuthal = currentSpherical.azimuthal;
      const startPolar = currentSpherical.polar;

      let azimuthalDelta = targetAzimuthal - startAzimuthal;
      while (azimuthalDelta > Math.PI) azimuthalDelta -= 2 * Math.PI;
      while (azimuthalDelta < -Math.PI) azimuthalDelta += 2 * Math.PI;
      if (Math.abs(azimuthalDelta) > Math.PI / 2) {
        azimuthalDelta =
          azimuthalDelta > 0
            ? azimuthalDelta - 2 * Math.PI
            : azimuthalDelta + 2 * Math.PI;
      }

      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const currentAzimuthal =
          startAzimuthal + azimuthalDelta * easedProgress;
        const currentPolar =
          startPolar + (targetPolar - startPolar) * easedProgress;

        const x =
          currentDistance * Math.sin(currentPolar) * Math.sin(currentAzimuthal);
        const y = currentDistance * Math.cos(currentPolar);
        const z =
          currentDistance * Math.sin(currentPolar) * Math.cos(currentAzimuthal);

        camera.position.set(target.x + x, target.y + y, target.z + z);
        camera.lookAt(target);
        controls.update();

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [cartesianToSpherical],
  );

  const animateYAxisRotation = useCallback(
    (duration = 3500) => {
      if (!orbitControlsRef.current) return;
      const controls = orbitControlsRef.current;
      const camera = controls.object;
      const target = controls.target;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const currentSpherical = cartesianToSpherical(camera.position, target);
      const startAzimuthal = currentSpherical.azimuthal;
      const startPolar = currentSpherical.polar;
      const currentDistance = currentSpherical.radius;
      const rotationRange = (20 * Math.PI) / 180;

      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const oscillation = Math.sin(progress * Math.PI * 2);
        const currentAzimuthal = startAzimuthal + oscillation * rotationRange;
        const currentPolar = startPolar;

        const x =
          currentDistance * Math.sin(currentPolar) * Math.sin(currentAzimuthal);
        const y = currentDistance * Math.cos(currentPolar);
        const z =
          currentDistance * Math.sin(currentPolar) * Math.cos(currentAzimuthal);

        camera.position.set(target.x + x, target.y + y, target.z + z);
        camera.lookAt(target);
        controls.update();

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [cartesianToSpherical],
  );

  const openHotspotPopup = (hotspotId) => {
    const config = hotspotsConfig[hotspotId] || hotspotsConfig[1];
    const selectedHotspot = hotspots.find((h) => h.id === hotspotId);
    setPopupData({
      hotspotId,
      displayNumber: selectedHotspot?.displayNumber,
      videoSrc: config.videoSrc,
      title: config.title,
      overview: config.overview,
      features: config.features,
    });

    if (orbitControlsRef.current && config.rotation) {
      const { azimuthal, polar } = config.rotation;
      const controls = orbitControlsRef.current;
      const target = controls.target;
      const camera = controls.object;
      const currentDistance = camera.position.distanceTo(target);
      animateCameraRotation(azimuthal, polar, currentDistance, 1000);
    }
  };

  const handleHotspotClick = (hotspotId) => {
    openHotspotPopup(hotspotId);
  };

  const handleSelectHotspot = (h) => {
    handleHotspotClick(h.id);
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hotspotMenuOpen) return;
    const handleClickOutside = (e) => {
      if (!hotspotMenuRef.current) return;
      if (!hotspotMenuRef.current.contains(e.target)) {
        setHotspotMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hotspotMenuOpen]);

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        backgroundImage:
          "url('./img-tiles.png'), radial-gradient(ellipse at center, #6022a6 0%, #40146b 72%)",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "bottom center, center",
        backgroundSize: "auto, cover",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "35%",
          zIndex: 10,
          padding: "10px 15px",
          backgroundColor: "#F37F63",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "600",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#F37F63";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#F37F63";
        }}
      >
        Back to Home
      </button>

      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: "20px",
          right: "47.8%",
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: "#F37F63",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "600",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#F37F63";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#F37F63";
        }}
      >
        Reset
      </button>

      <button
        onClick={() => setHotspotsVisible((v) => !v)}
        style={{
          position: "absolute",
          top: "20px",
          right: "36%",
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: hotspotsVisible ? "#F37F63" : "#F37F63",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "600",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hotspotsVisible
            ? "#F37F63"
            : "#F37F63";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = hotspotsVisible
            ? "#F37F63"
            : "#F37F63";
        }}
      >
        {hotspotsVisible ? "Hide Hotspots" : "Show Hotspots"}
      </button>

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              borderTop: "4px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "500",
              margin: 0,
            }}
          >
            Loading Model...
          </p>
        </div>
      )}

      <VideoPopup
        isOpen={popupData !== null}
        onClose={handleClosePopup}
        videoSrc={popupData?.videoSrc}
        displayNumber={popupData?.displayNumber}
        title={popupData?.title}
        overview={popupData?.overview}
        features={popupData?.features}
      />

      <ModelInteractionPopup
        isOpen={showInteractionPopup}
        onClose={() => {
          setShowInteractionPopup(false);
          setTimeout(() => {
            animateYAxisRotation(3500);
          }, 100);
        }}
        modelName="Monitors B105M/B125M/B155M"
      />

      <Canvas>
        <PerspectiveCamera makeDefault position={[-10, 3, 10]} />
        {/* <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} /> */}
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          target={[0, 0, 0]}
        />
        <Environment preset="apartment" />
        <Model glbPath={MonitorB1xMModel} onLoad={handleModelLoad} />
        {hotspotsVisible &&
          !isContactModalOpen &&
          hotspots.map((h) => (
            <Hotspot
              key={h.id}
              position={h.position}
              annotation={h.name}
              hotspotNumber={h.displayNumber}
              onHotspotClick={() => handleHotspotClick(h.id)}
              isVideoPlaying={
                popupData !== null && popupData.hotspotId === h.id
              }
              isSelected={popupData?.hotspotId === h.id}
            />
          ))}
      </Canvas>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(65, 23, 113, 0.7));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(65, 23, 113, 0.9));
          }
        }
        .hotspot-menu-scroll {
          scrollbar-width: thin;
          scrollbar-color: #F37F63 rgba(255, 255, 255, 0.2);
        }
        .hotspot-menu-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .hotspot-menu-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .hotspot-menu-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #F37F63 0%, #6022A6 100%);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .hotspot-menu-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff987f 0%, #7a35c4 100%);
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          zIndex: 16,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setIsContactModalOpen(true)}
          style={{
            padding: "10px 16px",
            backgroundColor: "#F37F63",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          Contact Us
        </button>
        <ProductContactUsModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          productCategory="Patient Monitoring"
          productName="B1xM Patient Monitor"
        />

        <WhyButton
          details={b1x5mWhyDetails}
          label="Why B1 x5M Patient Monitors?"
          inline
        />

        <DisclaimerButton
          inline
          disclaimerText="The official name of the product is B1X5 Patient Monitors, authorized by Wipro GE HealthCare Pvt. Ltd., located at No 4, Kadugodi Industrial Area, Whitefield, Bangalore, Karnataka – 560067. The system is intended for use by trained healthcare professionals familiar with relevant clinical workflows and equipment operation. For safe and effective operation, users must verify system calibration, ensure correct supply and connectivity, and confirm settings appropriate to the patient’s clinical condition. Continuous monitoring of patient vitals and system performance is essential throughout use. This system must not be used in environments containing explosive gases or on patients with contraindications to its intended clinical use. Operators must follow all institutional protocols, manufacturer instructions, and established clinical guidelines. This material was created and reviewed on 22nd December 2025, and additional product and safety information is available upon request."
          veevaId="JB03226IN"
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 15,
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "flex-end",
        }}
        ref={hotspotMenuRef}
      >
        <button
          onClick={() => setHotspotMenuOpen((v) => !v)}
          style={{
            padding: "10px 14px",
            backgroundColor: "#F37F63",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            width: "240px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "600",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          <span>Features</span>
          <span>{hotspotMenuOpen ? "▲" : "▼"}</span>
        </button>
        {hotspotMenuOpen && (
          <div
            className="hotspot-menu-scroll"
            style={{
              marginBottom: "-9px",
              // background: "#ffffff",
              borderRadius: "8px",
              // boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              minWidth: "240px",
              overflow: "hidden",
              maxHeight: "60vh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              display: "flex",
              flexDirection: "column",
              borderWidth: "2px",
              borderStyle: "solid",
              borderImage:
                "linear-gradient( to top, #F37F63, rgba(0, 0, 0, 0)) 1 100%",
              padding: "0px 15px 10px",
            }}
          >
            {hotspots.map((h, index) => (
              <div
                key={h.id}
                onClick={() => handleSelectHotspot(h)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "15px",
                  color: popupData?.hotspotId === h.id ? "#F37F63" : "#fff",
                  borderBottom:
                    index < hotspots.length - 1 ? "1px solid #f1f5f9" : "none",
                  border:
                    popupData?.hotspotId === h.id
                      ? "2px solid #F37F63"
                      : "2px solid transparent",
                  borderRadius: "8px",
                  // background: "#ffffff",
                  transition: "background-color 0.01s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#F37F63";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    popupData?.hotspotId === h.id ? "#F37F63" : "#fff";
                }}
              >
                {h.displayNumber}. {h.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorB1xM;
