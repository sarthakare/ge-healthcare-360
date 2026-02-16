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
import CS750Model from "../assets/cs750/model/CS750.glb";
import CS750Video0 from "../assets/cs750/videos/cs750_Introduction.mp4";
import CS750Video1 from "../assets/cs750/videos/cs750_Modes_Of_Ventilation.mp4";
import CS750Video2 from "../assets/cs750/videos/cs750_EcoFlow.mp4";
import CS750Video3 from "../assets/cs750/videos/cs750_Recruitment_Maneuver.mp4";
import CS750Video4 from "../assets/cs750/videos/cs750_Customizable_Case_Profiles.mp4";
import CS750Video5 from "../assets/cs750/videos/cs750_ICU_Quality_Ventilation.mp4";
import CS750Video6 from "../assets/cs750/videos/cs750_Compact_Breathing_System.mp4";
import CS750Video7 from "../assets/cs750/videos/cs750_Intelligent_Lighting.mp4";
import CS750Video8 from "../assets/cs750/videos/cs750_Integrated_Gas_Module.mp4";
import CS750Video9 from "../assets/cs750/videos/cs750_Checkout.mp4";
import CS750Video10 from "../assets/cs750/videos/cs750_Cable_Management.mp4";
import CS750Video11 from "../assets/cs750/videos/cs750_360_Arm.mp4";
import CS750Video12 from "../assets/cs750/videos/cs750_Flow_Rates_Fio2.mp4";
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
                Video file not available. Please add the video file to the assets folder.
              </div>
            )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CS750 = () => {
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
    { id: 0, name: "Introduction to Carestation 750", position: [0.5, 2.25, 0.5] },
    { id: 1, name: "Modes of Ventilation", position: [-1.5, 1.75, 0.65] },
    { id: 2, name: "Flow Rates & FiO₂ Control", position: [-1.825, 2, 0.65] },
    { id: 3, name: "ecoFLOW", position: [-1.825, 1.75, 0.65] },
    { id: 4, name: "Customisable Case Profiles", position: [-1.825, 2.25, 0.65] },
    { id: 5, name: "Recruitment Manoeuvre", position: [-0.9, 2.05, 0.65] },
    { id: 6, name: "ICU Quality Ventilation", position: [0, 0.95, 0.75] },
    { id: 7, name: "Compact Breathing System", position: [-1.15, 0.6, 1.1] },
    { id: 8, name: "Intelligent Lighting", position: [-0.5, 1.5, 0.35] },
    { id: 9, name: "Integrated Gas Module", position: [-0.75, 1.4, -0.35] },
    { id: 10, name: "Checkout", position: [-0.9, 1.85, 0.65] },
    { id: 11, name: "Cable Management", position: [0.85, 0, -0.5] },
    { id: 12, name: "360° Arm (Optional)", position: [-1, 2.35, 0.1] },
  ];

  const hotspotsConfig = {
    0: {
      videoSrc: CS750Video0,
      title: "Introduction to Carestation 750",
      overview:
        "The Carestation 750 is an advanced anesthesia delivery system designed to provide precise ventilation, optimized gas delivery, and intuitive clinical control across a wide range of surgical settings.",
      features: [
        "Advanced anesthesia workstation",
        "Precision ventilation & gas delivery",
        "Designed for modern OR workflows",
        "Trusted GE HealthCare platform",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    1: {
      videoSrc: CS750Video1,
      title: "Modes of Ventilation",
      overview:
        "Carestation 750 offers a comprehensive range of ventilation modes, allowing clinicians to tailor respiratory support based on patient condition and procedural needs.",
      features: [
        "Multiple ventilation modes",
        "Controlled & spontaneous support",
        "Adaptable to patient needs",
        "Clinical flexibility",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    2: {
      videoSrc: CS750Video12,
      title: "Flow Rates & FiO₂ Control",
      overview:
        "Precise control over fresh gas flow and FiO₂ enables clinicians to fine-tune anesthesia delivery for optimal patient care.",
      features: [
        "Precise flow control",
        "Adjustable FiO₂ settings",
        "Supports anesthesia strategies",
        "Consistent gas delivery",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    3: {
      videoSrc: CS750Video2,
      title: "ecoFLOW",
      overview:
        "ecoFLOW technology helps optimize fresh gas usage by adjusting delivery based on patient demand, supporting efficiency and sustainability.",
      features: [
        "Optimized gas usage",
        "Supports low-flow anesthesia",
        "Improved efficiency",
        "Environmentally conscious design",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    4: {
      videoSrc: CS750Video4,
      title: "Customisable Case Profiles",
      overview:
        "Customisable case profiles allow clinicians to save and recall preferred settings, helping streamline setup and maintain consistency.",
      features: [
        "Save preferred settings",
        "Faster setup",
        "Consistent workflows",
        "Personalized configurations",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    5: {
      videoSrc: CS750Video3,
      title: "Recruitment Manoeuvre",
      overview:
        "The recruitment manoeuvre feature helps reopen collapsed alveoli, supporting improved oxygenation and lung performance.",
      features: [
        "Supports lung recruitment",
        "Improved oxygenation",
        "Helpful in critical phases",
        "Enhances ventilation quality",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    6: {
      videoSrc: CS750Video5,
      title: "ICU Quality Ventilation",
      overview:
        "Carestation 750 delivers ICU-quality ventilation, maintaining stable pressures and volumes even in complex respiratory conditions.",
      features: [
        "ICU-level ventilation",
        "Stable pressure delivery",
        "Reliable volume control",
        "Supports complex cases",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    7: {
      videoSrc: CS750Video6,
      title: "Compact Breathing System",
      overview:
        "A compact breathing system design helps reduce circuit resistance and supports efficient respiratory management.",
      features: [
        "Compact circuit design",
        "Low resistance breathing",
        "Efficient gas delivery",
        "Streamlined setup",
      ],
      rotation: { azimuthal: -Math.PI / 3, polar: Math.PI / 2 },
    },
    8: {
      videoSrc: CS750Video7,
      title: "Intelligent Lighting",
      overview:
        "Intelligent lighting enhances visibility around the workstation, helping clinicians focus during procedures.",
      features: [
        "Smart illumination",
        "Better visibility",
        "Supports OR workflow",
        "Clinician-focused design",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    9: {
      videoSrc: CS750Video8,
      title: "Integrated Gas Module",
      overview:
        "The integrated gas module continuously monitors anesthetic and respiratory gases, supporting safe and precise delivery.",
      features: [
        "Continuous gas monitoring",
        "Real-time insights",
        "Enhanced patient safety",
        "Integrated design",
      ],
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    10: {
      videoSrc: CS750Video9,
      title: "Checkout",
      overview:
        "The guided checkout process helps ensure the system is ready for use, supporting safety before every case.",
      features: [
        "Guided system checks",
        "Faster readiness",
        "Safety assurance",
        "Pre-case confidence",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    11: {
      videoSrc: CS750Video10,
      title: "Cable Management",
      overview:
        "Thoughtful cable management keeps the workspace organized, reducing clutter and improving safety around the workstation.",
      features: [
        "Organized setup",
        "Reduced clutter",
        "Improved safety",
        "Easy accessibility",
      ],
      rotation: { azimuthal: Math.PI / 1.5, polar: Math.PI / 2 },
    },
    12: {
      videoSrc: CS750Video11,
      title: "360° Arm (Optional)",
      overview:
        "The optional 360-degree arm allows flexible positioning of displays and controls for improved ergonomics.",
      features: [
        "360° positioning",
        "Better ergonomics",
        "Flexible access",
        "Optional upgrade",
      ],
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
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
      />

      <ModelInteractionPopup
        isOpen={showInteractionPopup}
        onClose={() => {
          setShowInteractionPopup(false);
          setTimeout(() => {
            animateYAxisRotation(4000);
          }, 100);
        }}
        modelName="CS750"
      />

      <Canvas>
        <PerspectiveCamera makeDefault position={[-15, 0, 10]} />
        {/* <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.75} /> */}
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
        <Model
          glbPath={CS750Model}
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
            width: "240px",
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
            className="hotspot-menu-scroll"
            style={{
              marginBottom: "-9px",
              // background: "#ffffff",
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

export default CS750;


