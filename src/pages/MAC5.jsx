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
import MAC5Model from "../assets/mac-5/model/MAC 5.glb";
import MAC5Video from "../assets/mac-5/videos/01-Modes_of_Ventilation.mp4";
import ModelInteractionPopup from "../components/ModelInteractionPopup";

const Model = ({ glbPath, onLoad }) => {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  return <primitive object={scene} position={[1, -3, 0]} scale={1.5} />;
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

const MAC5 = () => {
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
    { id: 1, name: "Breathing Circuit", position: [1.5, -0.5, 1] },
    { id: 2, name: "Touch Console", position: [1.3, 0, 0] },
    { id: 3, name: "Ventilator Cart", position: [-2, -0.5, 0] },
  ];

  const hotspotsConfig = {
    1: {
      videoSrc: MAC5Video,
      title: "Dual-Limb Breathing Circuit",
      overview:
        "Integrated heated wire breathing circuit keeps humidity stable and minimizes condensation for neonatal to adult ventilation.",
      features: [
        "Dual-limb configuration with inspiratory heaters",
        "Quick-release wye connector",
        "Color-coded compliance cuffs",
        "Autoclavable components",
      ],
      specifications: {
        Diameter: "22 mm ISO",
        Heater: "37 °C closed-loop",
        FlowRange: "2–200 L/min",
        Cleaning: "Autoclave + EO",
      },
      rotation: {
        azimuthal: -Math.PI / 2,
        polar: Math.PI / 2,
      },
    },
    2: {
      videoSrc: MAC5Video,
      title: "Capacitive Touch Console",
      overview:
        "15-inch touchscreen with multi-mode ventilation presets, lung graphics, and guided workflows for rapid configuration.",
      features: [
        "Adaptive ventilation modes (AC, SIMV, APRV)",
        "3D lung compliance visualization",
        "Contextual help overlays",
        "USB + network export",
      ],
      specifications: {
        Display: '15.6" FHD capacitive',
        Processor: "Quad-core ARM",
        Storage: "128 GB SSD",
        Interfaces: "USB-A, USB-C, Ethernet",
      },
      rotation: {
        azimuthal: Math.PI / 2,
        polar: Math.PI / 2,
      },
    },
    3: {
      videoSrc: MAC5Video,
      title: "Stable Mobile Cart",
      overview:
        "Low center-of-gravity trolley with cable management and hot-swappable batteries keeps the ventilator ready for transport.",
      features: [
        "Four locking castors",
        "Rear oxygen bottle bracket",
        "Integrated cable channels",
        "Dual battery bays (8 hr)",
      ],
      specifications: {
        Footprint: "70 × 80 cm",
        Weight: "65 kg",
        Batteries: "2× 400 Wh packs",
        Mobility: "360° castors",
      },
      rotation: {
        azimuthal: Math.PI,
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
          azimuthalDelta > 0 ? azimuthalDelta - 2 * Math.PI : azimuthalDelta + 2 * Math.PI;
      }

      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const currentAzimuthal = startAzimuthal + azimuthalDelta * easedProgress;
        const currentPolar =
          startPolar + (targetPolar - startPolar) * easedProgress;

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
        onClick={() => setHotspotsVisible((v) => !v)}
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
          setTimeout(() => {
            animateYAxisRotation(3500);
          }, 100);
        }}
        modelName="MAC 5"
      />

      <Canvas>
        <PerspectiveCamera makeDefault position={[-10, 10, 20]} />
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
        <Model
          glbPath={MAC5Model}
          onLoad={handleModelLoad}
        />
        {hotspotsVisible &&
          hotspots.map((h) => (
            <Hotspot
              key={h.id}
              position={h.position}
              annotation={h.name}
              onHotspotClick={() => handleHotspotClick(h.id)}
              isVideoPlaying={popupData !== null && popupData.hotspotId === h.id}
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
                  borderBottom:
                    index < hotspots.length - 1 ? "1px solid #f1f5f9" : "none",
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

export default MAC5;

