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
  import VideoHeaterHeadRotation from "../assets/lubby-warmer/videos/±90 Heater Head Rotation.mp4";
  import VideoBabyModeManualMode from "../assets/lubby-warmer/videos/Baby Mode and Manual Mode.mp4";
  import VideoCalrodFarInfraredHeater from "../assets/lubby-warmer/videos/Calrod Far-Infrared Heater.mp4";
  import VideoIntuitiveControlPanel from "../assets/lubby-warmer/videos/Intuitive Control Panel.mp4";
  import VideoSmoothBedTilting from "../assets/lubby-warmer/videos/Smooth bed tilting of ±15.mp4";
  import VideoSpecializedReflectorHeating from "../assets/lubby-warmer/videos/Specialized Reflector & Heating Element.mp4";
  import VideoWallsOfWarmth from "../assets/lubby-warmer/videos/Walls of Warmth.mp4";
  import VideoXrayTray from "../assets/lubby-warmer/videos/X-ray tray with marks as a standard-.mp4";
  import ModelInteractionPopup from "../components/ModelInteractionPopup";
  
  const Model = ({ glbPath, onLoad }) => {
    const { scene } = useGLTF(glbPath);
  
    useEffect(() => {
      if (scene && onLoad) {
        onLoad();
      }
    }, [scene, onLoad]);
  
    return <primitive object={scene} position={[0, -3, 0]} scale={1} />;
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
  
  const LubbyWarmer = () => {
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
      { id: 1, name: "±90 Heater Head Rotation", position: [0, 1.5, 0.5] },
      { id: 2, name: "Baby Mode and Manual Mode", position: [0, -2, 0.75] },
      { id: 3, name: "Calrod Far-Infrared Heater", position: [0, 1.2, 0.6] },
      { id: 4, name: "Intuitive Control Panel", position: [0, -1.8, 0.8] },
      { id: 5, name: "Smooth Bed Tilting ±15°", position: [-0.5, -0.25, 0] },
      { id: 6, name: "Specialized Reflector & Heating Element", position: [0, 1.0, 0.7] },
      { id: 7, name: "Walls of Warmth", position: [0.5, 0.5, 0.3] },
      { id: 8, name: "X-ray Tray with Marks", position: [0.3, -1.0, 0.2] },
    ];
  
    const hotspotsConfig = {
      1: {
        videoSrc: VideoHeaterHeadRotation,
        title: "±90 Heater Head Rotation",
        overview:
          "The heater head can rotate up to ±90 degrees, providing flexible positioning to ensure optimal warmth distribution for the infant.",
        features: [
          "Smooth ±90 degree rotation range",
          "Easy positioning adjustment",
          "Lock mechanism for secure placement",
          "Optimal heat distribution",
        ],
        specifications: {
          "Rotation Range": "±90 degrees",
          "Control": "Manual adjustment",
          "Locking": "Secure lock mechanism",
        },
        rotation: {
          azimuthal: 0,
          polar: Math.PI / 2,
        },
      },
      2: {
        videoSrc: VideoBabyModeManualMode,
        title: "Baby Mode and Manual Mode",
        overview:
          "Dual operating modes provide flexibility: Baby Mode for automatic temperature control and Manual Mode for precise clinician control.",
        features: [
          "Automatic Baby Mode operation",
          "Manual Mode for precise control",
          "Easy mode switching",
          "Temperature monitoring",
        ],
        specifications: {
          "Modes": "Baby Mode, Manual Mode",
          "Control": "Automatic or Manual",
          "Temperature Range": "Adjustable",
        },
        rotation: {
          azimuthal: 0,
          polar: Math.PI / 2,
        },
      },
      3: {
        videoSrc: VideoCalrodFarInfraredHeater,
        title: "Calrod Far-Infrared Heater",
        overview:
          "Advanced Calrod far-infrared heating technology provides efficient and safe radiant warmth for neonatal care.",
        features: [
          "Far-infrared heating technology",
          "Efficient heat transfer",
          "Safe radiant warmth",
          "Energy efficient operation",
        ],
        specifications: {
          "Heating Type": "Far-infrared Calrod",
          "Efficiency": "High efficiency",
          "Safety": "Radiant heat technology",
        },
        rotation: {
          azimuthal: 0,
          polar: Math.PI / 2,
        },
      },
      4: {
        videoSrc: VideoIntuitiveControlPanel,
        title: "Intuitive Control Panel",
        overview:
          "User-friendly control panel with clear displays and easy-to-use controls for temperature and mode management.",
        features: [
          "Clear digital display",
          "Intuitive button controls",
          "Temperature readout",
          "Mode selection",
        ],
        specifications: {
          "Display": "Digital LCD",
          "Controls": "Touch buttons",
          "Interface": "User-friendly",
        },
        rotation: {
          azimuthal: 0,
          polar: Math.PI / 2,
        },
      },
      5: {
        videoSrc: VideoSmoothBedTilting,
        title: "Smooth Bed Tilting ±15°",
        overview:
          "The bed can be smoothly tilted up to ±15 degrees to facilitate various clinical procedures and patient positioning.",
        features: [
          "±15 degree tilting range",
          "Smooth tilting mechanism",
          "Easy adjustment",
          "Secure positioning",
        ],
        specifications: {
          "Tilt Range": "±15 degrees",
          "Control": "Manual adjustment",
          "Mechanism": "Smooth operation",
        },
        rotation: {
          azimuthal: -Math.PI / 2,
          polar: Math.PI / 2,
        },
      },
      6: {
        videoSrc: VideoSpecializedReflectorHeating,
        title: "Specialized Reflector & Heating Element",
        overview:
          "Specialized reflector design optimizes heat distribution while the advanced heating element ensures consistent warmth.",
        features: [
          "Optimized reflector design",
          "Efficient heat distribution",
          "Advanced heating element",
          "Consistent temperature",
        ],
        specifications: {
          "Reflector": "Specialized design",
          "Heating Element": "Advanced technology",
          "Distribution": "Optimized",
        },
        rotation: {
          azimuthal: 0,
          polar: Math.PI / 2,
        },
      },
      7: {
        videoSrc: VideoWallsOfWarmth,
        title: "Walls of Warmth",
        overview:
          "The innovative Walls of Warmth design creates a protective thermal environment around the infant for optimal care.",
        features: [
          "Protective thermal environment",
          "Innovative design",
          "Optimal warmth retention",
          "Infant protection",
        ],
        specifications: {
          "Design": "Walls of Warmth",
          "Function": "Thermal protection",
          "Benefit": "Optimal care environment",
        },
        rotation: {
          azimuthal: Math.PI / 2,
          polar: Math.PI / 2,
        },
      },
      8: {
        videoSrc: VideoXrayTray,
        title: "X-ray Tray with Marks",
        overview:
          "Integrated X-ray tray with positioning marks as standard, facilitating radiographic procedures without moving the infant.",
        features: [
          "Integrated X-ray tray",
          "Positioning marks included",
          "Standard feature",
          "Radiographic compatibility",
        ],
        specifications: {
          "Tray": "X-ray compatible",
          "Marks": "Positioning marks",
          "Standard": "Included as standard",
        },
        rotation: {
          azimuthal: -Math.PI / 2,
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
          modelName="Warmer"
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
          <Model
            glbPath={WarmerModel}
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
  
  export default LubbyWarmer;
  
  