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
import SLE6000Model from "../assets/sle6000/model/SLE6000.glb";
import SLE6000Video1 from "../assets/sle6000/videos/Sle_6000_Introduction.mp4";
import SLE6000Video2 from "../assets/sle6000/videos/Sle_6000_Comprehensive_Ventilation_Modes.mp4";
import SLE6000Video3 from "../assets/sle6000/videos/Sle_6000_High_Performance_Hfo_Capability.mp4";
import SLE6000Video4 from "../assets/sle6000/videos/Sle_6000_Broad_Patient_Weight_Range.mp4";
import SLE6000Video5 from "../assets/sle6000/videos/Sle_6000_Advanced_Non_Invasive_Ventilation_For_Neonates.mp4";
import SLE6000Video6 from "../assets/sle6000/videos/Sle_6000_Future_Ready_Upgradeable_Platform.mp4";
import SLE6000Video7 from "../assets/sle6000/videos/Sle_6000_12_1_Lunar_Capacitive_Touchscreen.mp4";
import SLE6000Video8 from "../assets/sle6000/videos/Sle_6000_Accurate_Volume_Targeted_Ventilation.mp4";
import SLE6000Video9 from "../assets/sle6000/videos/Sle_6000_Seamless_Mode_Switching_Without_Disconnection.mp4";
import SLE6000Video10 from "../assets/sle6000/videos/Sle_6000_Patented_Valve_Less_Technology.mp4";
import SLE6000Video11 from "../assets/sle6000/videos/Sle_6000_Clear_Top_Mounted_Alarm_Visibility.mp4";
import SLE6000Video12 from "../assets/sle6000/videos/Sle_6000_Real_Time_Lung_Mechanics_Monitoring.mp4";
import SLE6000Video13 from "../assets/sle6000/videos/Sle_6000_Intuitive_Mode_Panel_Interface.mp4";
import ModelInteractionPopup from "../components/ModelInteractionPopup";

const Model = ({ glbPath, onLoad }) => {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return <primitive object={scene} position={[0, 0, 0]} scale={0.75} />;
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

const SLE6000 = () => {
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
    { id: 1, name: "Introduction to SLE 6000", position: [0, 2, 0] },
    { id: 2, name: "Comprehensive Ventilation Modes", position: [-0.35, 2.1, 0] },
    { id: 3, name: "High-Performance HFO Capability", position: [0.35, 1.85, 0] },
    { id: 4, name: "Broad Patient Weight Range", position: [0, 1.85, 0] },
    { id: 5, name: "Advanced Non-Invasive Ventilation", position: [0, 2.2, 0] },
    { id: 6, name: "Future-Ready & Upgradeable Platform", position: [0, 2.05, 0] },
    { id: 7, name: '12.1" Lunar™ Capacitive Touchscreen', position: [0.35, 2.2, 0] },
    { id: 8, name: "Accurate Volume-Targeted Ventilation", position: [0.20, 1.85, 0] },
    { id: 9, name: "Seamless Mode Switching Without Disconnection", position: [-0.35, 1.85, 0] },
    { id: 10, name: "Patented Valve-Less Technology", position: [-0.5, 1.3, -0.5] },
    { id: 11, name: "Clear, Top-Mounted Alarm Visibility", position: [-0.35, 2.35, -0.25] },
    { id: 12, name: "Real-Time Lung Mechanics Monitoring", position: [-0.35, 2, 0] },
    { id: 13, name: "Intuitive Mode Panel Interface", position: [-0.35, 2.15, 0] },
  ];

  const hotspotsConfig = {
    1: {
      videoSrc: SLE6000Video1,
      title: "Introduction to SLE 6000",
      overview:
        "The SLE 6000 is GE HealthCare's most advanced neonatal ventilator, designed to deliver powerful respiratory performance while supporting gentle, neurodevelopmentally focused care for fragile newborns.",
      features: [
        "Advanced neonatal ventilation platform",
        "Designed for fragile lungs",
        "Neurodevelopmentally focused care",
        "Performance with precision",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    2: {
      videoSrc: SLE6000Video2,
      title: "Comprehensive Ventilation Modes",
      overview:
        "The SLE 6000 supports conventional ventilation, high-frequency oscillation, and non-invasive ventilation — giving you multiple ventilation strategies in one integrated neonatal platform.",
      features: [
        "Conventional ventilation",
        "High-frequency oscillation (HFO)",
        "Non-invasive ventilation (NIV)",
        "One integrated system",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    3: {
      videoSrc: SLE6000Video3,
      title: "High-Performance HFO Capability",
      overview:
        "With powerful high-frequency oscillation and Delta-P amplitudes up to 180 mbar, the SLE 6000 delivers effective ventilation even for highly compliant neonatal lungs.",
      features: [
        "Delta-P up to 180 mbar",
        "High-performance HFO",
        "Effective for compliant lungs",
        "Designed for neonates",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    4: {
      videoSrc: SLE6000Video4,
      title: "Broad Patient Weight Range",
      overview:
        "Designed to support growing clinical needs, the SLE 6000 can ventilate neonates across a wide weight range — up to 20 kilograms.",
      features: [
        "Supports patients up to 20 kg",
        "Neonatal to pediatric coverage",
        "Reduces need for multiple ventilators",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    5: {
      videoSrc: SLE6000Video5,
      title: "Advanced Non-Invasive Ventilation",
      overview:
        "The SLE 6000 offers neonatal-specific non-invasive ventilation modes with built-in leak compensation to help maintain stable and effective respiratory support.",
      features: [
        "Double-limb NCPAP",
        "NIPPV & NIPPV-Triggered",
        "Leak compensation technology",
        "Neonatal-focused NIV",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    6: {
      videoSrc: SLE6000Video6,
      title: "Future-Ready & Upgradeable Platform",
      overview:
        "As clinical needs evolve, the SLE 6000 can be expanded through software upgrades, helping you stay future ready without replacing equipment.",
      features: [
        "Upgradeable software platform",
        "Oxygenie™ readiness",
        "HFNC & single-limb CPAP options",
        "EtCO₂ module support",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    7: {
      videoSrc: SLE6000Video7,
      title: '12.1" Lunar™ Capacitive Touchscreen',
      overview:
        "The large 12.1-inch Lunar™ capacitive touchscreen provides a clear, intuitive interface for quick adjustments and smooth clinical workflows.",
      features: [
        "12.1-inch touchscreen",
        "Capacitive, glove-friendly design",
        "Logical UI flow",
        "Fast, smooth adjustments",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    8: {
      videoSrc: SLE6000Video8,
      title: "Accurate Volume-Targeted Ventilation",
      overview:
        "Volume-targeted ventilation on the SLE 6000 helps deliver precise tidal volumes, supporting lung protection and reducing the risk of ventilation-related complications.",
      features: [
        "Precise tidal volume delivery",
        "Lung-protective ventilation",
        "Reduced clinical complications",
        "Consistent performance",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    9: {
      videoSrc: SLE6000Video9,
      title: "Seamless Mode Switching Without Disconnection",
      overview:
        "The SLE 6000 allows seamless switching between HFO and conventional ventilation without disconnecting the patient, maintaining stability throughout care.",
      features: [
        "One circuit for all modes",
        "No patient disconnection",
        "Maintains ventilation continuity",
        "Reduced handling risk",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    10: {
      videoSrc: SLE6000Video10,
      title: "Patented Valve-Less Technology",
      overview:
        "The patented valve-less design reduces resistance in the breathing circuit, helping lower work of breathing and minimize cross-contamination risk.",
      features: [
        "Valve-less ventilation design",
        "Reduced work of breathing",
        "Lower cross-contamination risk",
        "Supports faster recovery",
      ],
      rotation: {
        azimuthal: -Math.PI / 2,
        polar: Math.PI / 2,
      },
    },
    11: {
      videoSrc: SLE6000Video11,
      title: "Clear, Top-Mounted Alarm Visibility",
      overview:
        "A top-mounted alarm light ensures alerts are clearly visible to caregivers, even from a distance, while maintaining a calm NICU environment.",
      features: [
        "High-visibility alarm light",
        "Easy caregiver awareness",
        "Calm, controlled care setting",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    12: {
      videoSrc: SLE6000Video12,
      title: "Real-Time Lung Mechanics Monitoring",
      overview:
        "Real-time lung mechanics monitoring provides continuous insight through waveforms, loops, and trends, supporting informed ventilation decisions.",
      features: [
        "Real-time waveforms",
        "Lung loops & trends",
        "Continuous ventilatory data",
        "Clinical decision support",
      ],
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 2,
      },
    },
    13: {
      videoSrc: SLE6000Video13,
      title: "Intuitive Mode Panel Interface",
      overview:
        "The mode panel serves as a central control interface, allowing fast access to mode-specific ventilation settings when every second matters.",
      features: [
        "Centralized mode control",
        "Quick access to settings",
        "Optimized for high-acuity care",
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
    [cartesianToSpherical]
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
    [cartesianToSpherical]
  );

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
        modelName="SLE6000"
      />

      <Canvas>
        <PerspectiveCamera makeDefault position={[-15, 0, 10]} />
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
        <Model glbPath={SLE6000Model} onLoad={handleModelLoad} />
        {hotspotsVisible &&
          hotspots.map((h) => (
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
              borderRadius: "6px",
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

export default SLE6000;
