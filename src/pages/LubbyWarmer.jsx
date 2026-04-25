import {
    useState,
    useCallback,
    useRef,
    useEffect,
  } from "react";
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
  import WarmerModel from "../assets/lubby-warmer/model/Lullaby Warmer.glb";
  import VideoOpening from "../assets/lubby-warmer/videos/Lubby_Warmer_Opening.mp4";
  import VideoRapidUniformHeating from "../assets/lubby-warmer/videos/Lubby_Warmer_Rapid_Uniform_Heating_With_Calrod_Heater.mp4";
  import VideoFarInfraredHeat from "../assets/lubby-warmer/videos/Lubby_Warmer_Far_Infrared_Heat_For_Infant_Safety.mp4";
  import VideoWallsOfWarmth from "../assets/lubby-warmer/videos/Lubby_Warmer_Walls_Of_Warmth_Technology.mp4";
  import VideoHighIrradiance from "../assets/lubby-warmer/videos/Lubby_Warmer_High_Irradiance_At_Lower_Wattage.mp4";
  import VideoPreciseHeatingControl from "../assets/lubby-warmer/videos/Lubby_Warmer_Precise_Heating_Control.mp4";
  import VideoHeaterHeadRotation from "../assets/lubby-warmer/videos/Lubby_Warmer_90_Rotating_Heater_Head_With_Auto_Shut_Off.mp4";
  import VideoBioCompatiblePanels from "../assets/lubby-warmer/videos/Lubby_Warmer_Bio_Compatible_Side_Panels_And_Thermal_Mattress.mp4";
  import VideoBuiltForReliability from "../assets/lubby-warmer/videos/Lubby_Warmer_Built_For_Reliability_And_Longevity.mp4";
  import VideoClearDisplay from "../assets/lubby-warmer/videos/Lubby_Warmer_Clear_Display_And_Visual_Alerts.mp4";
  import VideoSmoothBedTilt from "../assets/lubby-warmer/videos/Lubby_Warmer_Smooth_Bed_Tilt_For_Clinical_Flexibility.mp4";
  import VideoXrayTray from "../assets/lubby-warmer/videos/Lubby_Warmer_In_Built_X_Ray_Tray.mp4";
  import VideoGlobalSafety from "../assets/lubby-warmer/videos/Lubby_Warmer_Global_Safety_And_Quality_Certifications.mp4";
  import ModelInteractionPopup from "../components/ModelInteractionPopup";
import DisclaimerButton from "../components/DisclaimerButton";
import WhyButton from "../components/WhyButton";
import ProductContactUsModal from "../components/ProductContactUsModal";

const lullabyWarmerWhyDetails = {
  title: "Why Lullaby Warmer?",
  intro:
    "Because thermal stability in the first minutes of life is critical — and Lullaby Warmer is built for rapid, controlled, and safe heat delivery.",
  subheading: "Key differentiators:",
  bullets: [
    "Bed ready in ~240 seconds (rapid stabilization)",
    "3-zone “Walls of Warmth” reduces conductive loss",
    "Far-infrared heating supports retinal safety",
    "High irradiance at lower wattage (540W efficiency)",
  ],
};
  
  const Model = ({ glbPath, onLoad }) => {
    const { scene } = useGLTF(glbPath);
  
    useEffect(() => {
      if (scene && onLoad) {
        onLoad();
      }
    }, [scene, onLoad]);
  
    return <primitive object={scene} position={[0, -3, 0]} scale={1} />;
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
  
  const LubbyWarmer = () => {
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
      { id: 1, name: "Introduction", position: [0, 0, 0] },
      { id: 2, name: "Calrod Heater – Rapid & Uniform Heating", position: [0, 1.8, 0] },
      { id: 3, name: "Far-Infrared Heat Safety", position: [0, 1.8, 0.35] },
      { id: 4, name: "Walls of Warmth", position: [0, -0.25, 0.75] },
      { id: 5, name: "High Irradiance", position:[0, 1.8, 0.75] },
      { id: 6, name: "Precise Heater Control", position: [0, 0.75, -0.75] },
      { id: 7, name: "Rotating Heater Head", position: [0, 1.75, -0.75] },
      { id: 8, name: "Bio-Compatible Panels & Mattress", position: [-0.6, -0.25, 0] },
      { id: 9, name: "Durability & Reliability", position: [0, 0, 0] },
      { id: 10, name: "Display & Visual Alerts", position: [-0.25, 1.1, -0.75] },
      { id: 11, name: "Bed Tilting", position: [-0.6, -1, 0.15] },
      { id: 12, name: "X-ray Tray", position: [0, -0.5, 0.75] },
      { id: 13, name: "Safety Certifications", position: [0, 0, 0] },
    ].map((hotspot, index) => ({
      ...hotspot,
      displayNumber: index + 1,
    }));
  
    const defaultRotation = { azimuthal: 0, polar: Math.PI / 2 };
    const hotspotsConfig = {
      1: {
        videoSrc: VideoOpening,
        title: "Introduction",
        overview:
          "The Lullaby Warmer is designed to provide fast, gentle, and controlled thermal care for newborns, supporting safety and comfort from the very first moments of life.",
        features: [
          "Infant warming system",
          "Gentle thermal care",
          "NICU & L&D ready",
          "Clinically trusted design",
        ],
        rotation: defaultRotation,
      },
      2: {
        videoSrc: VideoRapidUniformHeating,
        title: "Calrod Heater - Rapid & Uniform Heating",
        overview:
          "The Calrod heater delivers uniform heat distribution and prepares the bed within 240 seconds, enabling quick response in critical situations.",
        features: [
          "Uniform heat distribution",
          "Bed ready in 240 seconds",
          "Rapid thermal response",
        ],
        rotation: defaultRotation,
      },
      3: {
        videoSrc: VideoFarInfraredHeat,
        title: "Far-Infrared Heat Safety",
        overview:
          "Far-infrared heat is easily absorbed by the cornea, helping reduce the risk of retinal damage while providing safe warming.",
        features: [
          "Far-infrared technology",
          "Supports eye safety",
          "Gentle heat delivery",
        ],
        rotation: defaultRotation,
      },
      4: {
        videoSrc: VideoWallsOfWarmth,
        title: "Walls of Warmth Technology",
        overview:
          "Three heating zones help minimize conductive heat loss and maintain a stable thermal environment.",
        features: [
          "Three heating zones",
          "Reduced heat loss",
          "Thermal stability",
        ],
        rotation: defaultRotation,
      },
      5: {
        videoSrc: VideoHighIrradiance,
        title: "High Irradiance at Lower Wattage",
        overview:
          "Operating at 540 watts, the warmer achieves high irradiance while helping reduce insensible water loss.",
        features: ["540W operation", "High irradiance", "Reduced water loss"],
        rotation: defaultRotation,
      },
      6: {
        videoSrc: VideoPreciseHeatingControl,
        title: "Precise Heater Control",
        overview:
          "Heater power can be adjusted in 5% increments for precise temperature management.",
        features: ["5% increments", "Accurate control", "Improved management"],
        rotation: defaultRotation,
      },
      7: {
        videoSrc: VideoHeaterHeadRotation,
        title: "Rotating Heater Head",
        overview:
          "A 90° rotating heater head allows bedside X-rays and automatically shuts off for safety.",
        features: ["90° rotation", "Auto shut-off", "X-ray friendly"],
        rotation: defaultRotation,
      },
      8: {
        videoSrc: VideoBioCompatiblePanels,
        title: "Bio-Compatible Panels & Mattress",
        overview:
          "Foldable bio-compatible panels and a thermal mattress help retain warmth and ensure comfort.",
        features: [
          "Bio-compatible panels",
          "Thermal mattress",
          "Heat retention",
        ],
        rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2},
      },
      9: {
        videoSrc: VideoBuiltForReliability,
        title: "Durability & Reliability",
        overview:
          "Lower power use, rugged probes, and a 7-year heater warranty support long-term reliability.",
        features: [
          "Lower power use",
          "Rugged probes",
          "7-year heater warranty",
        ],
        rotation: defaultRotation,
      },
      10: {
        videoSrc: VideoClearDisplay,
        title: "Display & Visual Alerts",
        overview:
          "A large display and color-coded alarms provide quick system status visibility.",
        features: ["Large display", "Color-coded alarms", "Clear indicators"],
        rotation: defaultRotation,
      },
      11: {
        videoSrc: VideoSmoothBedTilt,
        title: "Bed Tilting",
        overview:
          "Smooth ±15° tilt allows flexible positioning during care.",
        features: ["±15° tilt", "Clinical flexibility", "Caregiver comfort"],
        rotation: { azimuthal: -Math.PI / 2, polar: Math.PI / 2},
      },
      12: {
        videoSrc: VideoXrayTray,
        title: "In-Built X-Ray Tray",
        overview:
          "Integrated tray enables imaging without moving the baby.",
        features: ["Integrated tray", "No repositioning", "Maintains warmth"],
        rotation: defaultRotation,
      },
      13: {
        videoSrc: VideoGlobalSafety,
        title: "Safety Certifications",
        overview:
          "US FDA and CE approvals reflect global safety and quality standards.",
        features: ["US FDA approved", "CE certified", "Global compliance"],
        rotation: defaultRotation,
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
          azimuthalDelta = azimuthalDelta > 0 ? azimuthalDelta - 2 * Math.PI : azimuthalDelta + 2 * Math.PI;
        }
  
        const startTime = performance.now();
  
        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
  
          const currentAzimuthal = startAzimuthal + azimuthalDelta * easedProgress;
          const currentPolar = startPolar + (targetPolar - startPolar) * easedProgress;
  
          const x = currentDistance * Math.sin(currentPolar) * Math.sin(currentAzimuthal);
          const y = currentDistance * Math.cos(currentPolar);
          const z = currentDistance * Math.sin(currentPolar) * Math.cos(currentAzimuthal);
  
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
  
          const x = currentDistance * Math.sin(currentPolar) * Math.sin(currentAzimuthal);
          const y = currentDistance * Math.cos(currentPolar);
          const z = currentDistance * Math.sin(currentPolar) * Math.cos(currentAzimuthal);
  
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
          onClick={() => setHotspotsVisible((v) => !v)}
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
          modelName="Warmer"
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
          <Model
            glbPath={WarmerModel}
            onLoad={handleModelLoad}
          />
          {hotspotsVisible &&
            !isContactModalOpen &&
            hotspots.map((h) => (
              <Hotspot
                key={h.id}
                position={h.position}
                annotation={h.name}
                hotspotNumber={h.displayNumber}
                onHotspotClick={() => handleHotspotClick(h.id)}
                isVideoPlaying={popupData !== null && popupData.hotspotId === h.id}
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
            productCategory="Neonatal Care"
          productName="Lullaby Warmer"
          />

          <WhyButton
            details={lullabyWarmerWhyDetails}
            label="Why Lullaby Warmer?"
            inline
          />

          <DisclaimerButton
            inline
            disclaimerText="The official name of the product is Lullaby Warmer, authorized by Wipro GE HealthCare Pvt. Ltd., located at No 4, Kadugodi Industrial Area, Whitefield, Bangalore, Karnataka – 560067. The system is intended for use by trained healthcare professionals familiar with relevant clinical workflows and equipment operation. For safe and effective operation, users must verify system calibration, ensure correct supply and connectivity, and confirm settings appropriate to the patient’s clinical condition. Continuous monitoring of patient vitals and system performance is essential throughout use. This system must not be used in environments containing explosive gases or on patients with contraindications to its intended clinical use. Operators must follow all institutional protocols, manufacturer instructions, and established clinical guidelines. This material was created and reviewed on 22nd December 2025, and additional product and safety information is available upon request."
            vivaId="JB03232IN"
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
  
  export default LubbyWarmer;
  
  