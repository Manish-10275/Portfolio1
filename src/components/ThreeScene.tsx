import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Text3D, Center, useGLTF, Environment, useTexture, Stars, Cloud, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

interface WebGLSupportResult {
  supported: boolean;
  error?: string;
  details?: {
    vendor?: string;
    renderer?: string;
    version?: string;
    errorMessage?: string;
  };
}

const checkWebGLSupport = (): WebGLSupportResult => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || 
               canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return {
        supported: false,
        error: 'WebGL is not supported by your browser'
      };
    }

    // Get detailed information about the WebGL context
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const details = {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION)
    };

    // Check for specific issues with Intel HD Graphics
    if (details.renderer?.includes('Intel') && details.renderer?.includes('Direct3D9')) {
      return {
        supported: false,
        error: 'Your Intel graphics driver needs to be updated for optimal WebGL support',
        details: {
          ...details,
          errorMessage: 'Direct3D9 mode detected. Please update your graphics drivers.'
        }
      };
    }

    // Check if running in a sandboxed environment
    const isSandboxed = window.navigator.userAgent.includes('Chrome') && !window.chrome;
    if (isSandboxed) {
      return {
        supported: false,
        error: 'WebGL is restricted in this sandboxed environment',
        details
      };
    }

    // Clean up the test context
    if (gl.getExtension('WEBGL_lose_context')) {
      gl.getExtension('WEBGL_lose_context').loseContext();
    }
    
    return { supported: true, details };
  } catch (e) {
    return {
      supported: false,
      error: e instanceof Error ? e.message : 'Unknown WebGL initialization error'
    };
  }
};

const FloatingText = ({ text, position, color = '#4f46e5' }) => {
  const [hovered, setHovered] = useState(false);
  const textRef = useRef();

  useFrame((state) => {
    if (!textRef.current) return;
    textRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
    if (hovered) {
      textRef.current.rotation.y += 0.02;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={1}
      color={color}
      anchorX="center"
      anchorY="middle"
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {text}
    </Text>
  );
};

const InteractiveCloud = ({ position }) => {
  const [hovered, setHovered] = useState(false);
  const cloudRef = useRef();

  useFrame((state) => {
    if (!cloudRef.current) return;
    cloudRef.current.rotation.y += 0.001;
    if (hovered) {
      cloudRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <Cloud
        opacity={0.5}
        speed={0.4}
        width={10}
        depth={1.5}
        segments={20}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </group>
  );
};

const AnimatedStars = () => {
  const { camera } = useThree();
  const starsRef = useRef();

  useFrame((state) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y += 0.0002;
    starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={50}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
};

const ProfilePicture = () => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('https://i.imgur.com/YQfhYGN.jpg');
  
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle floating motion
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    
    // Rotation based on hover state
    if (hovered) {
      meshRef.current.rotation.y += 0.02;
    } else {
      meshRef.current.rotation.y += 0.001;
    }
    
    // Glow effect
    glowRef.current.scale.set(
      1 + Math.sin(time * 2) * 0.04,
      1 + Math.sin(time * 2) * 0.04,
      1
    );
    glowRef.current.material.opacity = 0.5 + Math.sin(time * 2) * 0.2;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
      position={[0, 1.5, -2]}
    >
      <group>
        {/* Glow effect */}
        <mesh
          ref={glowRef}
          scale={1.2}
          position={[0, 0, -0.1]}
        >
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial
            color="#4f46e5"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Main profile picture */}
        <animated.mesh
          ref={meshRef}
          scale={scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial
            map={texture}
            emissive="#ffffff"
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
          <meshPhysicalMaterial
            map={texture}
            transparent
            opacity={0.9}
            metalness={0.5}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </animated.mesh>

        {/* Decorative rings */}
        {[1.2, 1.4, 1.6].map((radius, index) => (
          <mesh
            key={index}
            position={[0, 0, -0.2 - index * 0.1]}
            rotation={[0, 0, index * Math.PI / 4]}
          >
            <ringGeometry args={[radius, radius + 0.02, 32]} />
            <meshBasicMaterial
              color="#4f46e5"
              transparent
              opacity={0.2 - index * 0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

const BackgroundShapes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const shapes = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 15
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: Math.random() * 0.5 + 0.2,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      speed: Math.random() * 0.002 + 0.001
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.001;
    
    groupRef.current.children.forEach((mesh, i) => {
      mesh.rotation.x += shapes[i].speed;
      mesh.rotation.y += shapes[i].speed;
      mesh.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          position={shape.position as [number, number, number]}
          rotation={shape.rotation as [number, number, number]}
          scale={shape.scale}
        >
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial
            color={shape.color}
            transparent
            opacity={0.6}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

const SectionSpecificShapes = ({ section }: { section: string }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += hovered ? 0.02 : 0.001;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  const shapes = {
    hero: (
      <group position={[0, 0, -5]}>
        <FloatingText text="Welcome" position={[0, 2, 0]} />
        <InteractiveCloud position={[3, 0, -2]} />
        <InteractiveCloud position={[-3, 1, -3]} />
      </group>
    ),
    about: (
      <group
        ref={groupRef}
        position={[0, 0, -5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <torusGeometry args={[2, 0.5, 16, 100]} />
          <meshStandardMaterial
            color="#6366f1"
            wireframe
            emissive="#6366f1"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>
        <FloatingText text="About" position={[0, 0, 0]} />
      </group>
    ),
    projects: (
      <group
        ref={groupRef}
        position={[0, 0, -5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <octahedronGeometry args={[2]} />
          <meshStandardMaterial
            color="#8b5cf6"
            wireframe
            emissive="#8b5cf6"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>
        <FloatingText text="Projects" position={[0, 3, 0]} />
      </group>
    ),
    contact: (
      <group
        ref={groupRef}
        position={[0, 0, -5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <icosahedronGeometry args={[2]} />
          <meshStandardMaterial
            color="#ec4899"
            wireframe
            emissive="#ec4899"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>
        <FloatingText text="Contact" position={[0, 3, 0]} />
      </group>
    )
  };

  return shapes[section as keyof typeof shapes] || null;
};

export default function ThreeScene({ currentSection = "hero" }) {
  const [mounted, setMounted] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [webGLStatus, setWebGLStatus] = useState<WebGLSupportResult>({ supported: true });

  useEffect(() => {
    setMounted(true);
    const status = checkWebGLSupport();
    setWebGLStatus(status);
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile adjustments
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  if (!webGLStatus.supported) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">WebGL Not Supported</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {webGLStatus.error || 'Your browser or device is having trouble initializing WebGL graphics.'}
          </p>
          {webGLStatus.details && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold">Graphics Information:</p>
              <ul className="mt-2 space-y-1">
                {webGLStatus.details.vendor && (
                  <li>• Vendor: {webGLStatus.details.vendor}</li>
                )}
                {webGLStatus.details.renderer && (
                  <li>• Renderer: {webGLStatus.details.renderer}</li>
                )}
                {webGLStatus.details.version && (
                  <li>• Version: {webGLStatus.details.version}</li>
                )}
                {webGLStatus.details.errorMessage && (
                  <li className="text-red-500">• Error: {webGLStatus.details.errorMessage}</li>
                )}
              </ul>
            </div>
          )}
          <div className="text-left text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">Recommended actions:</p>
            <ul className="space-y-2">
              {webGLStatus.details?.renderer?.includes('Intel') ? (
                <>
                  <li>• Update your Intel graphics drivers from the manufacturer's website</li>
                  <li>• Enable hardware acceleration in your browser settings</li>
                </>
              ) : (
                <>
                  <li>• Update your graphics drivers to the latest version</li>
                  <li>• Enable hardware acceleration in your browser settings</li>
                </>
              )}
              <li>• Try a different modern browser (Chrome, Firefox, or Edge)</li>
              <li>• Check if your device meets the minimum requirements for WebGL</li>
              <li>• Disable any browser extensions that might interfere with WebGL</li>
            </ul>
          </div>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>
              You can verify your browser's WebGL support at{' '}
              <a 
                href="https://webglreport.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                WebGL Report
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 -z-10"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      style={{
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      <Canvas
        className="touch-none"
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: true
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, window.innerWidth < 768 ? 7 : 5]}
          fov={window.innerWidth < 768 ? 75 : 60}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate={!isInteracting}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.8}
          touches={{
            one: THREE.TOUCH.ROTATE,
            two: THREE.TOUCH.NONE
          }}
        />
        <AnimatedStars />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {currentSection === 'hero' && <ProfilePicture />}
        <BackgroundShapes />
        <SectionSpecificShapes section={currentSection} />
        <Environment preset="sunset" />
        <fog attach="fog" args={['#000', 15, 25]} />
      </Canvas>
    </motion.div>
  );
}

export { ThreeScene }