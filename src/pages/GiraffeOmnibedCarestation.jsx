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
import GiraffeOmnibedCarestationModel from "../assets/giraffe-omnibed-carestation/model/Omnibed Giraffe.glb";
import GiraffeVideo1 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_One_Baby_One_Bed_Concept.mp4";
import GiraffeVideo2 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_One_Touch_Incubator_To_Warmer_Conversion.mp4";
import GiraffeVideo3 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_Cascade_Control_Temperature_Technology.mp4";
import GiraffeVideo4 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_High_Humidity_Servo_Control.mp4";
import GiraffeVideo5 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_Patented_Baby_Susan_Mattress.mp4";
import GiraffeVideo6 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_Ultra_Low_Noise_Environment.mp4";
import GiraffeVideo7 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_Double_Walled_Incubator_With_Air_Curtain.mp4";
import GiraffeVideo8 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_Improved_Access_With_Uniform_Heat.mp4";
import GiraffeVideo9 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_10_4_Inch_Color_Touchscreen_Interface.mp4";
import GiraffeVideo10 from "../assets/giraffe-omnibed-carestation/videos/Giraffe_Omnibed_In_Bed_Weighing_With_Trend_Tracking.mp4";
import ModelInteractionPopup from "../components/ModelInteractionPopup";
import DisclaimerButton from "../components/DisclaimerButton";
import WhyButton from "../components/WhyButton";
import ProductContactUsModal from "../components/ProductContactUsModal";

const giraffeOmnibedWhyDetails = {
  title: "Why Giraffe Omnibed Carestation?",
  intro:
    "Because minimizing infant handling improves outcomes — and the OmniBed is designed to deliver complete care without disruption.",
  subheading: "Key differentiators:",
  bullets: [
    "One-touch incubator-to-warmer conversion",
    "Cascade Control™ reduces temp variability by ~80%",
    "Servo humidity up to 95% for skin protection",
    "“Baby Susan” 360° rotating mattress for access",
  ],
};

const Model = ({ glbPath, onLoad }) => {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return <primitive object={scene} position={[0, -2, 0]} scale={1} />;
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

const GiraffeOmnibedCarestation = () => {
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

  const handleHotspotToggle = () => {
    setHotspotsVisible((prev) => !prev);
  };

  const hotspots = [
    { id: 1, name: "One Baby, One Bed", position: [0, 0.25, 1] },
    {
      id: 2,
      name: "One-Touch Conversion",
      position: [-0.65, -1.5, 0],
    },
    { id: 3, name: "Cascade Control", position: [0, 1.5, -1.1] },
    { id: 4, name: "Servo Humidity", position: [0, -0.2, 1.2] },
    { id: 5, name: "Baby Susan Mattress", position: [0, 1.25, 0] },
    { id: 6, name: "Low Noise", position: [0, 1.25, -0.75] },
    {
      id: 7,
      name: "Double-Walled Incubator",
      position: [0.75, 0.5, 0.0],
    },
    {
      id: 8,
      name: "Enhanced Access",
      position: [0, 0.25, 1],
    },
    { id: 9, name: "Touchscreen", position: [0, 1.5, -1.1] },
    {
      id: 10,
      name: "In-Bed Weighing",
      position: [0, 1.25, 0],
    },
    // {
    //   id: 11,
    //   name: "Servo Oxygen (Optional)",
    //   position: [0.65, -1.5, 0],
    // },
  ].map((hotspot, index) => ({
    ...hotspot,
    displayNumber: index + 1,
  }));

  const hotspotsConfig = {
    1: {
      videoSrc: GiraffeVideo1,
      title: "One Baby, One Bed Concept",
      overview:
        'The Giraffe OmniBed is designed around the "One Baby, One Bed" philosophy, helping reduce infant handling and supporting continuity of care from admission through recovery.',
      features: [
        "Reduced infant handling",
        "Continuity of care",
        "Supports developmental care",
        "Stable healing environment",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    2: {
      videoSrc: GiraffeVideo2,
      title: "One-Touch Incubator-to-Warmer Conversion",
      overview:
        "With a single touch, the system converts from a closed incubator to an open warmer, combining the benefits of both in one platform.",
      features: [
        "One-touch conversion",
        "Incubator + warmer in one",
        "Faster clinical response",
        "Workflow efficiency",
      ],
      rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2 },
    },
    3: {
      videoSrc: GiraffeVideo3,
      title: "Cascade Control Temperature Technology",
      overview:
        "Cascade Control technology helps reduce temperature variability by up to 80%, minimizing temperature swings for vulnerable newborns.",
      features: [
        "Up to 80% reduced variability",
        "Stable thermal environment",
        "Minimizes temperature swings",
        "Supports fragile infants",
      ],
      rotation: { azimuthal: Math.PI / 4, polar: Math.PI / 3 },
    },
    4: {
      videoSrc: GiraffeVideo4,
      title: "Servo Humidity",
      overview:
        "Servo humidity control delivers up to 95% humidity, helping protect skin integrity and reduce insensible water loss.",
      features: [
        "Up to 95% humidity",
        "Servo-controlled delivery",
        "Supports skin protection",
        "Reduces water loss",
      ],
      rotation: { azimuthal: -Math.PI / 4, polar: Math.PI / 2 },
    },
    5: {
      videoSrc: GiraffeVideo5,
      title: "Baby Susan Rotating Mattress",
      overview:
        "The patented Baby Susan mattress rotates 360° and translates smoothly, allowing easier access and better pressure distribution.",
      features: [
        "360° rotation",
        "Pressure-diffusing design",
        "Easier caregiver access",
        "Improved positioning",
      ],
      rotation: { azimuthal: 0, polar: 0 },
    },
    6: {
      videoSrc: GiraffeVideo6,
      title: "Low Noise",
      overview:
        "Special fan design and alarm placement keep noise levels as low as 41 dB, supporting a calm and development-friendly environment.",
      features: [
        "As low as 41 dB",
        "Quiet NICU environment",
        "Supports developmental care",
        "Reduced stress for infants",
      ],
      rotation: { azimuthal: 0, polar: 0 },
    },
    7: {
      videoSrc: GiraffeVideo7,
      title: "Double-Walled Incubator with Air Curtain",
      overview:
        "The double-wall structure and boost air curtain help protect infants from heat loss while maintaining consistent warmth.",
      features: [
        "Double-wall protection",
        "Boost air curtain",
        "Reduced heat loss",
        "Uniform warmth",
      ],
      rotation: { azimuthal: Math.PI / 2, polar: Math.PI / 2 },
    },
    8: {
      videoSrc: GiraffeVideo8,
      title: "Enhanced Access with Uniform Heat",
      overview:
        "The design allows better access for care and procedures while maintaining uniform heat distribution.",
      features: [
        "Improved caregiver access",
        "Uniform thermal care",
        "Supports interventions",
        "Minimal disruption",
      ],
      rotation: { azimuthal: 0, polar: Math.PI / 2 },
    },
    9: {
      videoSrc: GiraffeVideo9,
      title: '10.4" Color Touchscreen',
      overview:
        "A large 10.4-inch color touchscreen provides intuitive control, including a touch-free alarm silence feature for infection control.",
      features: [
        '10.4" color display',
        "Touch-free alarm silence",
        "Intuitive interface",
        "Infection-conscious design",
      ],
      rotation: { azimuthal: Math.PI / 4, polar: Math.PI / 3 },
    },
    10: {
      videoSrc: GiraffeVideo10,
      title: "In-Bed Weighing with Trend Tracking",
      overview:
        "Built-in weighing allows accurate measurements and trend tracking without moving the baby.",
      features: [
        "In-bed weighing",
        "Weight trending",
        "Reduced handling",
        "Continuous monitoring",
      ],
      rotation: { azimuthal: 0, polar: 0 },
    },
    11: {
      videoSrc: null,
      title: "Servo Oxygen (Optional)",
      overview:
        "The optional Servo Oxygen feature automatically maintains target oxygen levels, supporting precise oxygen therapy.",
      features: [
        "Automatic oxygen control",
        "Maintains target levels",
        "Optional module",
        "Supports respiratory care",
      ],
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
    [cartesianToSpherical],
  );

  const animateYAxisRotation = useCallback(
    (duration = 4000) => {
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
        onClick={handleHotspotToggle}
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
            animateYAxisRotation(4000);
          }, 100);
        }}
        modelName="Giraffe Omnibed Carestation"
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
        <Environment preset="city" />
        <Model
          glbPath={GiraffeOmnibedCarestationModel}
          onLoad={handleModelLoad}
        />
        {hotspotsVisible && !isContactModalOpen && (
          <>
            {hotspots.map((h) => (
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
          productCategory="Neonatal Care"
          productName="Giraffe Omnibed Carestation"
        />

        <WhyButton
          details={giraffeOmnibedWhyDetails}
          label="Why Giraffe Omnibed Carestation?"
          inline
        />

        <DisclaimerButton
          inline
          disclaimerText="The official name of the product is Giraffe™ Omnibed Carestation, authorized by Wipro GE HealthCare Pvt. Ltd., located at No. 4, Kadugodi Industrial Area, Whitefield, Bangalore, Karnataka – 560067. The system is intended for use by trained healthcare professionals familiar with neonatal care workflows and thermoregulation management. For safe and effective operation, users must verify system calibration, ensure proper probe placement and temperature settings, and confirm alarm and monitoring parameters appropriate to the infant’s clinical condition. Continuous monitoring of patient vitals and system performance is essential throughout use. This system must not be used in environments containing explosive gases or on infants with contraindications to thermal support. Operators must follow all institutional protocols, manufacturer instructions, and established clinical guidelines. This material was reviewed on 22 December 2025, and additional information is available upon request."
          veevaId="JB03230IN"
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

export default GiraffeOmnibedCarestation;
