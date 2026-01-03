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
import MAC5Video1 from "../assets/mac-5/videos/Mac 5 Autoecg Function.mp4";
import MAC5Video2 from "../assets/mac-5/videos/Mac 5 Enhanced Hook Up Advisor.mp4";
import MAC5Video3 from "../assets/mac-5/videos/Mac 5 Advanced Ecg Filtering.mp4";
import MAC5Video4 from "../assets/mac-5/videos/Mac 5 Critical Values Highlighting.mp4";
import MAC5Video5 from "../assets/mac-5/videos/Mac 5 Internal Ecg Storage.mp4";
import MAC5Video6 from "../assets/mac-5/videos/Mac 5 Pdf & Xml Data Transfer.mp4";
import MAC5Video7 from "../assets/mac-5/videos/Mac 5 Print Preview.mp4";
import MAC5Video8 from "../assets/mac-5/videos/Mac 5 Trusted Clinical Interpretation.mp4";
import MAC5Video9 from "../assets/mac-5/videos/Mac  5 Secure & Connected Workflow.mp4";
import MAC5Video10 from "../assets/mac-5/videos/Mac 5 Smart Lead Technology.mp4";
import MAC5Video11 from "../assets/mac-5/videos/Mac 5 8-9 Capacitive Touchscreen.mp4";
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
              {specifications && Object.keys(specifications).length > 0 && (
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
    { id: 1, name: "Auto-ECG Function", position: [2, -0.25, 0.75] },
    { id: 2, name: "Enhanced Hook-Up Advisor", position: [2.5, -0.25, 0.75] },
    { id: 3, name: "Advanced ECG Filtering", position: [1.25, -0.25, 0.75] },
    { id: 4, name: "Critical Values Highlighting", position: [0.75, -0.25, 0.75] },
    { id: 5, name: "Internal ECG Storage", position:[2.5, 0, 0] },
    { id: 6, name: "PDF & XML Data Transfer", position: [2.45, 0, -1.5] },
    { id: 7, name: "Print Preview", position: [-0.75, -0.25, 0] },
    { id: 8, name: "Trusted Clinical Interpretation", position: [1, 0, -0.75] },
    { id: 9, name: "Secure & Connected Workflow", position:[1.5, 0, -0.75] },
    { id: 10, name: "Smart Lead Technology", position: [2, 0, -0.75] },
    { id: 11, name: "8.9\" Capacitive Touchscreen", position: [1.5, 0, 0] },
  ];

  const hotspotsConfig = {
    1: {
      videoSrc: MAC5Video1,
      title: "Auto-ECG Function",
      overview:
        "Once the leads are correctly connected, the MAC 5 automatically begins ECG acquisition — allowing you to capture a clean, high-quality ECG without extra steps.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    2: {
      videoSrc: MAC5Video2,
      title: "Enhanced Hook-Up Advisor",
      overview:
        "As you place the electrodes, the Enhanced Hook-Up Advisor guides you in real time — alerting you to loose, misplaced or noisy leads to ensure signal quality before acquisition.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    3: {
      videoSrc: MAC5Video3,
      title: "Advanced ECG Filtering",
      overview:
        "You can rely on intelligent ECG filters that reduce motion, muscle and electrical noise — helping you obtain clear waveforms even in challenging conditions.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    4: {
      videoSrc: MAC5Video4,
      title: "Critical Values Highlighting",
      overview:
        "When critical findings such as STEMI, ischemia or arrhythmias are detected, they're clearly highlighted on the ECG — helping you prioritize urgent clinical action.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    5: {
      videoSrc: MAC5Video5,
      title: "Internal ECG Storage",
      overview:
        "You can store up to 300 ECGs directly on the device, giving you quick access to previous studies without immediate network dependency.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    6: {
      videoSrc: MAC5Video6,
      title: "PDF & XML Data Transfer",
      overview:
        "ECG reports can be exported in PDF or XML format via USB, shared folders, SFTP or optional wireless connectivity — supporting flexible data sharing.",
      rotation: {
        azimuthal: Math.PI,
        polar: Math.PI / 2,
      },
    },
    7: {
      videoSrc: MAC5Video7,
      title: "Print Preview",
      overview:
        "Before printing, you can preview exactly how the ECG will appear on paper — ensuring clarity, legibility and report quality every time.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    8: {
      videoSrc: MAC5Video8,
      title: "Trusted Clinical Interpretation",
      overview:
        "The MAC 5 uses the proven Marquette™ 12SL analysis program to provide automated, clinically validated ECG interpretation — supporting confident decision-making.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    9: {
      videoSrc: MAC5Video9,
      title: "Secure & Connected Workflow",
      overview:
        "With user authentication, encrypted data handling and optional HIS/CIS integration, the MAC 5 fits seamlessly into modern, networked clinical environments.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    10: {
      videoSrc: MAC5Video10,
      title: "Smart Lead Technology",
      overview:
        "When you connect a new patient, Smart Lead Technology automatically detects the change — helping you avoid patient mix-ups and supporting safer ECG acquisition in high-throughput areas.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
      },
    },
    11: {
      videoSrc: MAC5Video11,
      title: "8.9\" Capacitive Touchscreen",
      overview:
        "You interact through a large 8.9-inch capacitive touchscreen that remains responsive even when you're wearing gloves — allowing fast, intuitive navigation in clinical environments.",
      rotation: {
        azimuthal: 0,
        polar: Math.PI / 4,
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
        <ambientLight intensity={0.35} />
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
        {/* <Environment preset="apartment" /> */}
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
          // onMouseEnter={(e) => {
          //   e.currentTarget.style.filter = "brightness(1.1)";
          // }}
          // onMouseLeave={(e) => {
          //   e.currentTarget.style.filter = "brightness(1)";
          // }}
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

export default MAC5;

