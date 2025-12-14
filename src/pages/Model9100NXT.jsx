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
import Model9100NXTModel from "../assets/9100nxt/model/9100NXT.glb";
import VideoVentilationModes from "../assets/9100nxt/videos/Ventilation Modes.mp4";
import VideoAutoclavableBreathingCircuit from "../assets/9100nxt/videos/Autoclavable breathing circuit, bellows and canister.mp4";
import VideoPreUseGuidedCheck from "../assets/9100nxt/videos/Pre-use guided check.mp4";
import VideoPSVProAlgorithm from "../assets/9100nxt/videos/PSVPro algorithm.mp4";
import VideoCO2Bypass from "../assets/9100nxt/videos/CO₂ bypass.mp4";
import VideoFlowValveTechnology from "../assets/9100nxt/videos/flow-valve technology.mp4";
import VideoHypoxiaGuardApnea from "../assets/9100nxt/videos/Hypoxia Guard Apnea back-up.mp4";
import VideoIntegratedACGO from "../assets/9100nxt/videos/Integrated Auxiliary Common Gas Outlet (ACGO).mp4";
import VideoThreeGasCapability from "../assets/9100nxt/videos/Three-gas capability.mp4";
import VideoTwoFlowSensors from "../assets/9100nxt/videos/Two flow sensors (inspiratory + expiratory).mp4";
import VideoOneDeviceHospital from "../assets/9100nxt/videos/one device for the whole hospital.mp4";
import ModelInteractionPopup from "../components/ModelInteractionPopup";

const Model = ({ glbPath, onLoad }) => {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return <primitive object={scene} position={[0, -2, 0]} scale={1} />;
};

const Hotspot = ({ position, annotation, onHotspotClick, isVideoPlaying }) => {
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
      false
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
    <Html position={position} center zIndexRange={[50, 60]}>
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
        <img
          src="/hotspot.svg"
          alt="hotspot"
          style={{
            width: "30px",
            height: "30px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
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
          }}
        >
          {annotation}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(65, 23, 113, 0.7));
            }
            50% {
              filter: drop-shadow(0 0 15px rgba(65, 23, 113, 0.9));
            }
          }
        `}</style>
      </div>
    </Html>
  );
};

const VideoPopup = ({
  isOpen,
  onClose,
  videoSrc,
  title,
  overview,
  features,
  specifications,
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
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                maxHeight: "300px",
                borderRadius: "8px",
                outline: "none",
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div
            style={{
              color: "#000000",
            }}
          >
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
              {title}
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

              {specifications && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#6022A6",
                    }}
                  >
                    Technical Specifications
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Model9100NXT = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const orbitControlsRef = useRef();
  const [showInteractionPopup, setShowInteractionPopup] = useState(false);
  const hasShownPopupRef = useRef(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [hotspotMenuOpen, setHotspotMenuOpen] = useState(false);
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

  const handleHotspotToggle = () => {
    setHotspotsVisible((prev) => !prev);
  };

  const hotspots = [
    { id: 1, name: "Ventilation Modes", position: [0.5, 1.75, 0.05] },
    { id: 2, name: "Autoclavable Breathing Circuit", position: [-1.4, 0.2, 0.3] },
    { id: 3, name: "Pre-use Guided Check", position: [0.5, 1.6, 0.1] },
    { id: 4, name: "PSVPro Algorithm", position: [-0.3, 0.3, -1.2] },
    { id: 5, name: "CO₂ Bypass", position: [-1.3, 0.1, 0.4] },
    { id: 6, name: "Flow-Valve Technology", position: [-0.2, 0.4, -1.1] },
    { id: 7, name: "Hypoxia Guard Apnea Back-up", position: [0.4, 1.5, 0.15] },
    { id: 8, name: "Integrated ACGO", position: [1.2, 0.5, 0.2] },
    { id: 9, name: "Three-Gas Capability", position: [1.1, 0.6, 0.1] },
    { id: 10, name: "Two Flow Sensors", position: [-1.5, 0.3, 0.2] },
    { id: 11, name: "One Device for the Whole Hospital", position: [0, 1.2, 0] },
  ];

  const hotspotsConfig = {
    1: {
      videoSrc: VideoVentilationModes,
      title: "Ventilation Modes",
      overview:
        "The 9100 NXT offers comprehensive ventilation modes designed for various clinical scenarios, providing flexibility and precision in patient care.",
      features: [
        "Multiple ventilation modes including AC, SIMV, and CPAP",
        "Adaptive ventilation algorithms",
        "Real-time mode switching capabilities",
        "Patient-specific mode optimization",
      ],
      specifications: {
        "Modes Available": "AC, SIMV, CPAP, PSV",
        "Mode Switching": "Real-time",
        "Algorithm": "Advanced adaptive",
      },
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    2: {
      videoSrc: VideoAutoclavableBreathingCircuit,
      title: "Autoclavable Breathing Circuit, Bellows and Canister",
      overview:
        "Fully autoclavable breathing circuit components ensure maximum infection control and patient safety with easy sterilization processes.",
      features: [
        "Complete autoclavable system",
        "Tool-free disassembly",
        "Durable bellows design",
        "Integrated canister system",
      ],
      specifications: {
        "Autoclave Temperature": "Up to 134°C",
        "Sterilization Time": "Standard cycle",
        "Material": "Medical-grade autoclavable",
      },
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    3: {
      videoSrc: VideoPreUseGuidedCheck,
      title: "Pre-use Guided Check",
      overview:
        "Intelligent pre-use check system guides clinicians through comprehensive safety verification before each procedure.",
      features: [
        "Step-by-step guided workflow",
        "Automated system diagnostics",
        "Visual and audio prompts",
        "Checklist completion tracking",
      ],
      specifications: {
        "Check Duration": "< 2 minutes",
        "Automated Tests": "System-wide",
        "Documentation": "Automatic logging",
      },
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    4: {
      videoSrc: VideoPSVProAlgorithm,
      title: "PSVPro Algorithm",
      overview:
        "Advanced PSVPro algorithm provides intelligent pressure support ventilation with adaptive response to patient needs.",
      features: [
        "Adaptive pressure support",
        "Patient-triggered ventilation",
        "Real-time algorithm adjustment",
        "Enhanced patient comfort",
      ],
      specifications: {
        "Algorithm Type": "Adaptive PSV",
        "Response Time": "< 100ms",
        "Trigger Sensitivity": "Adjustable",
      },
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    5: {
      videoSrc: VideoCO2Bypass,
      title: "CO₂ Bypass",
      overview:
        "Integrated CO₂ bypass system provides efficient gas management and monitoring capabilities.",
      features: [
        "Automatic CO₂ monitoring",
        "Bypass valve control",
        "Real-time CO₂ level display",
        "Safety alarm integration",
      ],
      specifications: {
        "CO₂ Measurement": "Capnography",
        "Bypass Control": "Automatic/Manual",
        "Alarm Threshold": "Configurable",
      },
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    6: {
      videoSrc: VideoFlowValveTechnology,
      title: "Flow-Valve Technology",
      overview:
        "Advanced flow-valve technology ensures precise gas delivery and optimal flow control throughout the ventilation system.",
      features: [
        "Precise flow control",
        "Low resistance design",
        "Rapid response valves",
        "Digital flow monitoring",
      ],
      specifications: {
        "Flow Range": "0.2 - 15 L/min",
        "Response Time": "< 50ms",
        "Accuracy": "±2%",
      },
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    7: {
      videoSrc: VideoHypoxiaGuardApnea,
      title: "Hypoxia Guard Apnea Back-up",
      overview:
        "Advanced safety system that automatically detects and responds to apnea events and hypoxia conditions to ensure patient safety.",
      features: [
        "Automatic apnea detection",
        "Hypoxia monitoring",
        "Back-up ventilation activation",
        "Real-time alarm system",
      ],
      specifications: {
        "Detection Time": "< 20 seconds",
        "Back-up Mode": "Automatic",
        "Alarm Levels": "Configurable",
      },
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    8: {
      videoSrc: VideoIntegratedACGO,
      title: "Integrated Auxiliary Common Gas Outlet (ACGO)",
      overview:
        "Integrated ACGO provides flexible gas delivery options for additional equipment and accessories.",
      features: [
        "Standard ACGO connection",
        "Multiple gas support",
        "Easy accessory integration",
        "Flow monitoring",
      ],
      specifications: {
        "Connection Type": "Standard ACGO",
        "Gas Support": "Multiple",
        "Flow Capacity": "Up to 15 L/min",
      },
      rotation: { azimuthal: Math.PI / 2, polar: Math.PI / 2 },
    },
    9: {
      videoSrc: VideoThreeGasCapability,
      title: "Three-Gas Capability",
      overview:
        "Comprehensive three-gas system supporting oxygen, air, and nitrous oxide for complete anesthesia delivery.",
      features: [
        "Three-gas support (O₂, Air, N₂O)",
        "Individual gas flow control",
        "Gas mixture monitoring",
        "Safety interlocks",
      ],
      specifications: {
        "Gases Supported": "O₂, Air, N₂O",
        "Flow Range": "0.2 - 15 L/min each",
        "Mixture Control": "Precise",
      },
      rotation: { azimuthal: Math.PI / 2, polar: Math.PI / 2 },
    },
    10: {
      videoSrc: VideoTwoFlowSensors,
      title: "Two Flow Sensors (Inspiratory + Expiratory)",
      overview:
        "Dual flow sensor system provides comprehensive monitoring of both inspiratory and expiratory flows for accurate ventilation management.",
      features: [
        "Inspiratory flow monitoring",
        "Expiratory flow monitoring",
        "Real-time flow measurement",
        "Accurate volume calculation",
      ],
      specifications: {
        "Sensor Type": "Dual flow sensors",
        "Measurement Range": "0 - 120 L/min",
        "Accuracy": "±2%",
      },
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    11: {
      videoSrc: VideoOneDeviceHospital,
      title: "One Device for the Whole Hospital",
      overview:
        "The 9100 NXT is designed as a versatile solution that can serve multiple departments and clinical needs throughout the hospital.",
      features: [
        "Multi-department compatibility",
        "Versatile clinical applications",
        "Unified platform",
        "Cost-effective solution",
      ],
      specifications: {
        "Applications": "OR, ICU, Emergency",
        "Versatility": "Multi-purpose",
        "Compatibility": "Hospital-wide",
      },
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
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
    [cartesianToSpherical]
  );

  const animateYAxisRotation = useCallback((duration = 4000) => {
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
  }, [cartesianToSpherical]);

  const openHotspotPopup = (hotspotId) => {
    const config = hotspotsConfig[hotspotId] || hotspotsConfig[1];

    setPopupData({
      hotspotId,
      videoSrc: config.videoSrc,
      title: config.title,
      overview: config.overview,
      features: config.features,
      specifications: config.specifications,
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
          fontWeight:"600",
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
          fontWeight:"600",
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
        onClick={handleHotspotToggle}
        style={{
          position: "absolute",
          top: "20px",
          right: "36%",
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: hotspotsVisible
            ? "#F37F63"
            : "#F37F63",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight:"600",
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
        title={popupData?.title}
        overview={popupData?.overview}
        features={popupData?.features}
        specifications={popupData?.specifications}
      />

      <ModelInteractionPopup
        isOpen={showInteractionPopup}
        onClose={() => {
          setShowInteractionPopup(false);
          setTimeout(() => {
            animateYAxisRotation(4000);
          }, 100);
        }}
        modelName="9100NXT"
      />

      <Canvas>
        <PerspectiveCamera makeDefault position={[-15, 0, 10]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.75} />
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          target={[0, 0, 0]}
        />
        <Environment preset="warehouse" />
        <Model
          glbPath={Model9100NXTModel}
          onLoad={handleModelLoad}
        />
        {hotspotsVisible && (
          <>
            {hotspots.map((h) => (
              <Hotspot
                key={h.id}
                position={h.position}
                annotation={h.name}
                onHotspotClick={() => handleHotspotClick(h.id)}
                isVideoPlaying={
                  popupData !== null && popupData.hotspotId === h.id
                }
              />
            ))}
          </>
        )}
      </Canvas>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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
            width: "278px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight:"600",
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
            style={{
              marginBottom: "-9px",
              // background: "#ffffff",
              // boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              minWidth: "240px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderWidth: "2px",
              borderStyle: "solid",
              borderImage:"linear-gradient( to top, #F37F63, rgba(0, 0, 0, 0)) 1 100%",
              borderRadius:"6px", 
              padding:"0px 15px 10px",
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
                  color: "#fff",
                  borderBottom:
                    index < hotspots.length - 1 ? "1px solid #f1f5f9" : "none",
                  // background: "#ffffff",
                  transition: "background-color 0.01s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#F37F63";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#fff";
                }}
              >
                {h.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Model9100NXT;

