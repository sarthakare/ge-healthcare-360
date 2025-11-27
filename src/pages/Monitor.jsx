import { useState, useEffect, useRef, useCallback } from "react";
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
import MonitorModel from "../assets/monitor/model/Monitor.glb";
import MonitorVideo from "../assets/monitor/videos/01-Modes_of_Ventilation.mp4";
import ModelInteractionPopup from "../components/ModelInteractionPopup";

const Model = ({ glbPath, onLoad }) => {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return <primitive object={scene} position={[0, -2, 0]} scale={0.75} />;
};

// Hotspot component that follows the 3D position
const Hotspot = ({ position, annotation, onHotspotClick, isVideoPlaying }) => {
  const { camera, scene } = useThree();
  const [isVisible, setIsVisible] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const raycasterRef = useRef(new THREE.Raycaster());

  useFrame(() => {
    // Project 3D position to screen coordinates
    const worldPosition = new THREE.Vector3(
      position[0],
      position[1],
      position[2]
    );
    worldPosition.project(camera);

    // Check if hotspot is in front of camera
    const isInFront = worldPosition.z < 1;

    if (!isInFront) {
      setIsVisible(false);
      return;
    }

    // Perform occlusion check using raycasting
    const cameraPosition = camera.position.clone();
    const hotspotPosition = new THREE.Vector3(
      position[0],
      position[1],
      position[2]
    );

    // Create a direction vector from camera to hotspot
    const direction = hotspotPosition.clone().sub(cameraPosition).normalize();

    // Calculate distance from camera to hotspot
    const distance = cameraPosition.distanceTo(hotspotPosition);

    // Set up raycaster
    raycasterRef.current.set(cameraPosition, direction);

    // Collect all meshes in the scene (excluding HTML containers)
    const objectsToCheck = [];
    scene.traverse((object) => {
      if (object.isMesh && object.visible) {
        objectsToCheck.push(object);
      }
    });

    // Find all intersections with the model geometry
    const intersections = raycasterRef.current.intersectObjects(
      objectsToCheck,
      false
    );

    // Check if hotspot is occluded
    // If there's an intersection closer than the hotspot, it's occluded
    let isOccluded = false;
    if (intersections.length > 0) {
      const closestIntersection = intersections[0];
      // Add a small threshold (0.2 units) to account for floating point precision
      // This ensures hotspots on the surface aren't incorrectly hidden
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
        onMouseEnter={() => {
          setShowAnnotation(true);
        }}
        onMouseLeave={() => {
          setShowAnnotation(false);
        }}
      >
        <img
          src="/hotspot.svg"
          alt="hotspot"
          style={{
            width: "100%",
            height: "100%",
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

// Video Popup Component
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

  // Close popup on Escape key
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
                position:"absolute",
                top:"15px",
                right:"15px",
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
          
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
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
                lineHeight:"27px",
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

const Monitor = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const orbitControlsRef = useRef();
  const [hotspotMenuOpen, setHotspotMenuOpen] = useState(false);
  const hotspotMenuRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [showInteractionPopup, setShowInteractionPopup] = useState(false);
  const hasShownPopupRef = useRef(false);

  const hotspots = [
    { id: 1, name: "Monitor Display", position: [0, 0, 1.5] },
    { id: 2, name: "Connection Ports", position: [-1, -1.2, -0.3] },
    { id: 3, name: "Connection pins (Left)", position: [-2, 0, 0.5] },
    { id: 4, name: "Connection pins (Right)", position: [1.8, -0.2, 0.8] },
  ];

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
    setHotspotsVisible(!hotspotsVisible);
  };

  // Centralized hotspot configuration with popup data and rotation angles
  const hotspotsConfig = {
    1: {
      videoSrc: MonitorVideo,
      title: "Monitor Display - Modes of Ventilation",
      overview:
        "This video demonstrates the various modes of ventilation available on our advanced medical monitoring system. The monitor provides comprehensive respiratory support configurations for critical care environments.",
      features: [
        "Multiple ventilation modes including AC, SIMV, and CPAP",
        "Real-time waveform display and monitoring",
        "Advanced alarm system for patient safety",
        "User-friendly interface with intuitive controls",
        "High-resolution display for precise monitoring",
      ],
      specifications: {
        Display: '15.6" HD Touchscreen',
        Power: "AC/DC Compatible",
        Dimensions: "400 × 300 × 200 mm",
        Weight: "8.5 kg",
      },
      // Rotation angles in radians: [azimuthal (horizontal), polar (vertical)]
      // azimuthal: 0 = front, Math.PI/2 = right, Math.PI = back, -Math.PI/2 = left
      // polar: 0 = top, Math.PI/2 = horizontal
      rotation: {
        azimuthal: 0, // Front view
        polar: Math.PI / 2, // Slightly above horizontal
      },
    },
    2: {
      videoSrc: MonitorVideo, // Using same video for now - can be updated when more videos are added
      title: "Connection Ports - Power & I/O",
      overview:
        "The connection ports panel provides all necessary power and data connectivity options for the medical monitor. These ports enable seamless integration with various medical devices and ensure reliable power supply for continuous operation.",
      features: [
        "AC Power Input (100-240V, 50/60Hz)",
        "DC Power Input for battery backup",
        "USB 3.0 ports for data transfer",
        "Ethernet port for network connectivity",
        "HDMI output for external displays",
        "Serial communication ports (RS-232)",
        "Multiple sensor input connectors",
        "Emergency power disconnect switch",
      ],
      specifications: {
        "Power Input": "AC 100-240V / DC 12-24V",
        "USB Ports": "4× USB 3.0 Type-A",
        Network: "Gigabit Ethernet (RJ-45)",
        "Video Output": "HDMI 2.0",
        "Serial Ports": "2× RS-232",
        "Power Consumption": "Max 150W",
        "Power Backup": "Built-in battery option",
      },
      rotation: {
        azimuthal: -Math.PI, // Left side view
        polar: Math.PI / 2, // Slightly above horizontal
      },
    },
    3: {
      videoSrc: MonitorVideo,
      title: "Connection Pins - Sensor Connectors",
      overview:
        "The connection pins provide secure electrical connections for various medical sensors and monitoring equipment. These pins ensure reliable data transmission and power delivery for critical patient monitoring applications.",
      features: [
        "Gold-plated pins for optimal conductivity",
        "Multiple pin configurations (4, 6, 8, 12 pin options)",
        "Locking mechanism for secure connections",
        "Weather-resistant housing",
        "Color-coded pin assignments",
        "Support for analog and digital signals",
        "High-quality materials for durability",
        "EMI/RFI shielding protection",
      ],
      specifications: {
        "Pin Material": "Gold-plated Brass",
        "Voltage Rating": "Up to 24V DC",
        "Current Rating": "Max 5A per pin",
        "Connector Type": "Circular DIN connector",
        "Pin Count": "4-12 pins available",
        "Operating Temp": "-20°C to +70°C",
        "IP Rating": "IP65 (dust and water resistant)",
      },
      rotation: {
        azimuthal: -Math.PI / 2, // More left side
        polar: Math.PI / 2,
      },
    },
    4: {
      videoSrc: MonitorVideo,
      title: "Connection Pins - Header & Terminal Blocks",
      overview:
        "These rectangular header pins and terminal block connectors provide flexible wiring options for modular connections. Designed for quick assembly and disassembly, ideal for maintenance and configuration changes in medical equipment.",
      features: [
        "Rectangular pin header connectors",
        "Spring-loaded terminal blocks",
        "Quick-connect/disconnect capability",
        "Multiple row configurations (1×4, 2×4, 2×8)",
        "Pitch options: 2.54mm, 3.96mm, 5.08mm",
        "Insulation displacement contacts",
        "Strain relief cable management",
        "Polarized connectors to prevent misconnection",
      ],
      specifications: {
        "Pin Type": "Rectangular header pins",
        "Contact Material": "Phosphor Bronze",
        "Voltage Rating": "Up to 250V AC/DC",
        "Current Rating": "Max 10A per terminal",
        "Pitch Options": "2.54mm, 3.96mm, 5.08mm",
        "Terminal Count": "4-24 positions",
        "Wire Gauge": "12-24 AWG",
        "Operating Temp": "-40°C to +85°C",
      },
      rotation: {
        azimuthal: Math.PI / 2, // Right side view
        polar: Math.PI / 2,
      },
    },
  };

  // Convert camera position to spherical coordinates
  const cartesianToSpherical = useCallback((position, target) => {
    const relativePos = position.clone().sub(target);
    const radius = relativePos.length();
    const polar = Math.acos(relativePos.y / radius); // Angle from Y-axis
    const azimuthal = Math.atan2(relativePos.x, relativePos.z); // Angle around Y-axis
    return { radius, polar, azimuthal };
  }, []);

  // Smooth camera rotation animation that follows shortest path around model
  const animateCameraRotation = useCallback((targetAzimuthal, targetPolar, currentDistance, duration = 1000) => {
    if (!orbitControlsRef.current) return;

    const controls = orbitControlsRef.current;
    const camera = controls.object;
    const target = controls.target;

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Get current spherical coordinates
    const currentSpherical = cartesianToSpherical(camera.position, target);
    const startAzimuthal = currentSpherical.azimuthal;
    const startPolar = currentSpherical.polar;

    // Calculate the shortest path for azimuthal angle (avoid going through model)
    let azimuthalDelta = targetAzimuthal - startAzimuthal;
    
    // Normalize to [-PI, PI] range to find the shortest angular path
    while (azimuthalDelta > Math.PI) azimuthalDelta -= 2 * Math.PI;
    while (azimuthalDelta < -Math.PI) azimuthalDelta += 2 * Math.PI;

    // If the absolute difference is greater than PI/2 (90°), 
    // prefer going via the left side to avoid going through the model center
    // This ensures the camera rotates around the outside, not through the model
    if (Math.abs(azimuthalDelta) > Math.PI / 2) {
      // For large rotations, go the long way around via the left side
      // Example: front (0) to back (PI) -> go via left: 0 -> -PI/2 -> -PI (same as PI)
      if (azimuthalDelta > 0) {
        azimuthalDelta = azimuthalDelta - 2 * Math.PI; // Go counter-clockwise (via left)
      } else {
        azimuthalDelta = azimuthalDelta + 2 * Math.PI; // Go clockwise (via right)
      }
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutCubic for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      // Interpolate angles
      const currentAzimuthal = startAzimuthal + azimuthalDelta * easedProgress;
      const currentPolar = startPolar + (targetPolar - startPolar) * easedProgress;

      // Convert back to Cartesian coordinates
      const x = currentDistance * Math.sin(currentPolar) * Math.sin(currentAzimuthal);
      const y = currentDistance * Math.cos(currentPolar);
      const z = currentDistance * Math.sin(currentPolar) * Math.cos(currentAzimuthal);

      // Update camera position
      camera.position.set(
        target.x + x,
        target.y + y,
        target.z + z
      );
      
      // Make camera look at target
      camera.lookAt(target);

      // Update controls
      controls.update();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [cartesianToSpherical]);

  // Animate camera rotation on Y-axis (left and right) - like a shake motion
  const animateYAxisRotation = useCallback((duration = 3500) => {
    if (!orbitControlsRef.current) return;

    const controls = orbitControlsRef.current;
    const camera = controls.object;
    const target = controls.target;

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Get current spherical coordinates
    const currentSpherical = cartesianToSpherical(camera.position, target);
    const startAzimuthal = currentSpherical.azimuthal;
    const startPolar = currentSpherical.polar;
    const currentDistance = currentSpherical.radius;

    // Rotation range: ±20 degrees (in radians) for left/right motion
    const rotationRange = (20 * Math.PI) / 180; // 20 degrees in radians

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Create a smooth oscillating motion: left then right
      // Use sine wave: 0 -> PI/2 (left) -> PI (back to start) -> 3*PI/2 (right) -> 2*PI (back to start)
      // This creates: start -> left -> start -> right -> start
      const oscillation = Math.sin(progress * Math.PI * 2); // Full cycle: left and right

      // Apply the oscillation to azimuthal angle (Y-axis rotation)
      const currentAzimuthal = startAzimuthal + oscillation * rotationRange;

      // Keep polar angle constant (no vertical rotation)
      const currentPolar = startPolar;

      // Convert back to Cartesian coordinates
      const x = currentDistance * Math.sin(currentPolar) * Math.sin(currentAzimuthal);
      const y = currentDistance * Math.cos(currentPolar);
      const z = currentDistance * Math.sin(currentPolar) * Math.cos(currentAzimuthal);

      // Update camera position
      camera.position.set(
        target.x + x,
        target.y + y,
        target.z + z
      );
      
      // Make camera look at target
      camera.lookAt(target);

      // Update controls
      controls.update();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [cartesianToSpherical]);

  // Centralized function to open hotspot popup and rotate model
  const openHotspotPopup = (hotspotId) => {
    const config = hotspotsConfig[hotspotId] || hotspotsConfig[1];

    // Set popup data
    setPopupData({
      hotspotId: hotspotId,
      videoSrc: config.videoSrc,
      title: config.title,
      overview: config.overview,
      features: config.features,
      specifications: config.specifications,
    });

    // Rotate camera to the specified angle (keeping current distance) with smooth transition
    if (orbitControlsRef.current && config.rotation) {
      const { azimuthal, polar } = config.rotation;
      const controls = orbitControlsRef.current;
      const target = controls.target;
      const camera = controls.object;

      // Calculate current distance from camera to target to preserve it
      const currentDistance = camera.position.distanceTo(target);

      // Animate camera rotation using spherical coordinates (follows shortest path around model)
      animateCameraRotation(azimuthal, polar, currentDistance, 1000);
    }
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleHotspotClick = (hotspotId) => {
    openHotspotPopup(hotspotId);
  };

  const handleSelectHotspot = (h) => {
    // Keep the menu open on selection
    handleHotspotClick(h.id);
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  // Close hotspot menu when clicking outside
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
        backgroundColor: "#202438",
        position: "relative",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          padding: "10px 15px",
          backgroundColor: "#6022A6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgb(65, 23, 113)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#6022A6";
        }}
      >
        ← Back to Home
      </button>

      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: "20px",
          right: "180px",
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: "rgba(255, 0, 0, 0.9)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.9)";
        }}
      >
        Reset
      </button>

      <button
        onClick={handleHotspotToggle}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: hotspotsVisible
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(180, 180, 180, 0.9)",
          color: "#6022A6",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hotspotsVisible
            ? "rgba(255, 255, 255, 1)"
            : "rgba(180, 180, 180, 1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = hotspotsVisible
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(180, 180, 180, 0.9)";
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
          // Trigger X-axis rotation animation after popup closes
          setTimeout(() => {
            animateYAxisRotation(3500); // 3.5 seconds duration
          }, 100); // Small delay to ensure popup is fully closed
        }}
        modelName="Monitor"
      />

      <Canvas>
        <PerspectiveCamera makeDefault position={[-15, 0, 10]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
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
        <Model glbPath={MonitorModel} onLoad={handleModelLoad} />
        {hotspotsVisible && (
          <>
            {hotspots.map((h) => (
              <Hotspot
                key={h.id}
                position={h.position}
                annotation={h.name}
                onHotspotClick={() => {
                  handleHotspotClick(h.id);
                }}
                isVideoPlaying={popupData !== null && popupData.hotspotId === h.id}
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

      {/* Bottom-right features dropdown */}
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
            backgroundColor: "#fff",
            color: "#6022A6",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            width: "240px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              marginBottom: "8px",
              background: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              minWidth: "240px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {hotspots.map((h, index) => (
              <div
                key={h.id}
                onClick={() => handleSelectHotspot(h)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#111827",
                  borderBottom: index < hotspots.length - 1 ? "1px solid #f1f5f9" : "none",
                  background: "#ffffff",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
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

export default Monitor;
