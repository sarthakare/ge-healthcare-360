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
import CS750Video1 from "../assets/cs750/videos/01-Modes_of_Ventilation.mp4";
import CS750Video2 from "../assets/cs750/videos/02-EcoFlow.mp4";
import CS750Video3 from "../assets/cs750/videos/03-Lung_Recruitment_Procedures.mp4";
import CS750Video4 from "../assets/cs750/videos/04-Customisable_Case_profiles.mp4";
import CS750Video5 from "../assets/cs750/videos/05-ICU_Quality_Ventilation.mp4";
import CS750Video6 from "../assets/cs750/videos/06-Compact_Breathing_System.mp4";
import CS750Video7 from "../assets/cs750/videos/07-Intelligent_Lighting.mp4";
import CS750Video8 from "../assets/cs750/videos/08-Integrated_Anaesthesia_Gas.mp4";
import CS750Video9 from "../assets/cs750/videos/09-checkout.mp4";
import CS750Video10 from "../assets/cs750/videos/10-Cable_Management.mp4";
import CS750Video11 from "../assets/cs750/videos/11-Premium_Arm.mp4";
import CS750Video12 from "../assets/cs750/videos/12-Flow_rates_Fio2.mp4";
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
    { id: 1, name: "Modes of ventilation", position: [-1.5, 1.75, 0.65] },
    { id: 2, name: "Flow rates & FiO2", position: [-1.825, 2, 0.65] },
    { id: 3, name: "ecoFLOW", position: [-1.825, 1.75, 0.65] },
    { id: 4, name: "Customisable Case Profiles", position: [-1.825, 2.25, 0.65] },
    { id: 5, name: "Recruitment Manoeuvre", position: [-0.9, 2.05, 0.65] },
    { id: 6, name: "ICU Quality Ventilation", position: [0, 0.95, 0.75] },
    { id: 7, name: "Compact Breathing System", position: [-1.15, 0.6, 1.1] },
    { id: 8, name: "Intelligent Lighting", position: [-0.5, 1.5, 0.35] },
    { id: 9, name: "Integrated Gas Module", position: [-0.75, 1.4, -0.35] },
    { id: 10, name: "Checkout", position:  [-0.9, 1.85, 0.65] },
    { id: 11, name: "Cable Management", position: [0.85, 0, -0.5] },
    { id: 12, name: "360° Arm (optional)", position: [-1, 2.35, 0.1] },
  ];

  const hotspotsConfig = {
    1: {
      videoSrc: CS750Video1,
      title: "Modes of ventilation",
      overview:
        "Comprehensive ventilation modes designed for diverse patient needs, from basic support to advanced lung-protective strategies.",
      features: [
        "Multiple ventilation modes including Volume Control, Pressure Control, and SIMV",
        "Adaptive pressure support for patient-triggered breaths",
        "Lung-protective ventilation strategies",
        "Real-time mode switching without interruption",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    2: {
      videoSrc: CS750Video12,
      title: "Flow rates & FiO2",
      overview:
        "Precise control and monitoring of fresh gas flow rates and inspired oxygen concentration for optimal patient ventilation.",
      features: [
        "Precise flow rate control",
        "Accurate FiO2 delivery",
        "Real-time flow monitoring",
        "Automatic flow adjustment",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    3: {
      videoSrc: CS750Video2,
      title: "ecoFLOW",
      overview:
        "Advanced flow management system that optimizes gas consumption while maintaining precise ventilation delivery.",
      features: [
        "Intelligent fresh gas flow optimization",
        "Reduced agent consumption up to 50%",
        "Automatic flow adjustment based on patient needs",
        "Real-time consumption monitoring",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    4: {
      videoSrc: CS750Video4,
      title: "Customisable Case Profiles",
      overview:
        "Pre-configured and customizable patient profiles that streamline workflow and ensure consistent ventilation parameters across cases.",
      features: [
        "Pre-loaded profiles for common procedures",
        "User-defined custom profiles",
        "Quick profile switching",
        "Profile sharing across workstations",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    5: {
      videoSrc: CS750Video3,
      title: "Recruitment Manoeuvre",
      overview:
        "Specialized protocols and automated maneuvers to optimize lung recruitment and prevent atelectasis in critical care settings.",
      features: [
        "Automated recruitment maneuver protocols",
        "Sustained inflation capabilities",
        "PEEP titration guidance",
        "Pressure-volume loop monitoring",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    6: {
      videoSrc: CS750Video5,
      title: "ICU Quality Ventilation",
      overview:
        "Advanced ventilation capabilities that bring ICU-quality respiratory support to the operating room environment.",
      features: [
        "ICU-grade monitoring and alarms",
        "Advanced waveform analysis",
        "Comprehensive gas monitoring",
        "Integrated capnography",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    7: {
      videoSrc: CS750Video6,
      title: "Compact Breathing System",
      overview:
        "Space-efficient breathing circuit design that reduces setup time and maintains low dead space for optimal ventilation efficiency.",
      features: [
        "Compact circuit footprint",
        "Low dead space design",
        "Quick-connect components",
        "Integrated safety features",
      ],
      rotation: { azimuthal: -Math.PI / 3, polar: Math.PI / 2 },
    },
    8: {
      videoSrc: CS750Video7,
      title: "Intelligent Lighting",
      overview:
        "Adaptive lighting system that provides optimal illumination for procedures while reducing eye strain and maintaining ambient conditions.",
      features: [
        "Automatic brightness adjustment",
        "Color temperature control",
        "Shadow-free illumination",
        "Energy-efficient LED technology",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    9: {
      videoSrc: CS750Video8,
      title: "Integrated Gas Module",
      overview:
        "Seamlessly integrated anesthesia gas delivery system with precise agent control and comprehensive monitoring capabilities.",
      features: [
        "Integrated vaporizer system",
        "Multi-agent support",
        "Precise agent delivery",
        "Real-time agent monitoring",
      ],
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    10: {
      videoSrc: CS750Video9,
      title: "Checkout",
      overview:
        "Comprehensive automated checkout system that verifies system integrity and ensures all components are functioning correctly before use.",
      features: [
        "Automated system checks",
        "Leak detection and testing",
        "Component verification",
        "Checkout report generation",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    11: {
      videoSrc: CS750Video10,
      title: "Cable Management",
      overview:
        "Organized cable routing system that keeps the workspace clean, reduces clutter, and prevents cable damage during procedures.",
      features: [
        "Integrated cable channels",
        "Quick-release cable management",
        "Strain relief protection",
        "Easy access for maintenance",
      ],
      rotation: { azimuthal: Math.PI /1.5, polar: Math.PI / 2 },
    },
    12: {
      videoSrc: CS750Video11,
      title: "360° Arm (optional)",
      overview:
        "Advanced articulating arm system that provides flexible positioning of monitors and accessories while maintaining stability and ease of use.",
      features: [
        "Multi-axis articulation",
        "Counterbalanced design",
        "Locking mechanisms",
        "Smooth positioning",
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

export default CS750;


