import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface WebGLSupportResult {
  supported: boolean;
  error?: string;
}

const checkWebGLSupport = (): WebGLSupportResult => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { supported: false, error: 'WebGL is not supported by your browser' };
    return { supported: true };
  } catch (e) {
    return { supported: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
};

const GlowingSphere = ({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.2 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

const GeometricRing = ({ position, rotation, color, radius = 2 }: { position: [number, number, number]; rotation: [number, number, number]; color: string; radius?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = rotation[0] + state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={1} roughness={0.1} />
    </mesh>
  );
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const t = Math.random();
      colors[i * 3] = 0.2 + t * 0.3;
      colors[i * 3 + 1] = 0.4 + t * 0.4;
      colors[i * 3 + 2] = 0.8 + t * 0.2;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const FloatingCrystal = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.007;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.9} roughness={0.05} transparent opacity={0.85} />
    </mesh>
  );
};

const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 50; i++) {
      const t = (i / 50) * Math.PI * 4;
      pts.push({ x: Math.cos(t) * 1.2, y: (i / 50) * 8 - 4, z: Math.sin(t) * 1.2, strand: 0 });
      pts.push({ x: Math.cos(t + Math.PI) * 1.2, y: (i / 50) * 8 - 4, z: Math.sin(t + Math.PI) * 1.2, strand: 1 });
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <group ref={groupRef} position={[5, 0, -5]}>
      {points.map((pt, i) => (
        <mesh key={i} position={[pt.x, pt.y, pt.z]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial
            color={pt.strand === 0 ? '#3b82f6' : '#06b6d4'}
            emissive={pt.strand === 0 ? '#3b82f6' : '#06b6d4'}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

const HeroScene = () => (
  <>
    <GlowingSphere position={[-4, 1, -3]} color="#1e40af" scale={1.2} speed={0.8} />
    <GlowingSphere position={[4, -1, -4]} color="#0891b2" scale={0.9} speed={1.2} />
    <GlowingSphere position={[0, 3, -6]} color="#0f766e" scale={0.7} speed={0.6} />
    <GeometricRing position={[0, 0, -3]} rotation={[0, 0, 0]} color="#3b82f6" radius={3} />
    <GeometricRing position={[0, 0, -3]} rotation={[Math.PI / 4, 0, 0]} color="#06b6d4" radius={2.5} />
    <GeometricRing position={[0, 0, -3]} rotation={[0, Math.PI / 4, 0]} color="#0f766e" radius={2} />
    {([-3, -1, 1, 3] as number[]).map((x, i) => (
      <FloatingCrystal key={i} position={[x * 1.5, -2, -2]} color={(['#3b82f6', '#06b6d4', '#0f766e', '#1d4ed8'] as string[])[i]} />
    ))}
  </>
);

const SectionScene = ({ section }: { section: string }) => {
  if (section === 'education') {
    return (
      <>
        <GeometricRing position={[-3, 0, -4]} rotation={[0.5, 0, 0]} color="#2563eb" radius={2} />
        <GlowingSphere position={[3, 1, -5]} color="#0891b2" scale={0.8} speed={1} />
        <FloatingCrystal position={[-2, -1, -2]} color="#1e40af" />
        <FloatingCrystal position={[2, 2, -3]} color="#0f766e" />
      </>
    );
  }
  if (section === 'skills' || section === 'experience') {
    return (
      <>
        <DNAHelix />
        <GlowingSphere position={[-4, 0, -5]} color="#1d4ed8" scale={0.7} speed={0.9} />
        <GeometricRing position={[0, 2, -4]} rotation={[0, 0, 0.5]} color="#0891b2" radius={2.5} />
      </>
    );
  }
  if (section === 'projects') {
    return (
      <>
        {([-2, 0, 2] as number[]).map((x, i) => (
          <FloatingCrystal key={i} position={[x, 2, -3]} color={(['#1e40af', '#0891b2', '#0f766e'] as string[])[i]} />
        ))}
        <GeometricRing position={[0, 0, -5]} rotation={[0.2, 0, 0.3]} color="#3b82f6" radius={3} />
        <GlowingSphere position={[-3, -1, -4]} color="#0f766e" scale={0.8} speed={1} />
      </>
    );
  }
  if (section === 'contact') {
    return (
      <>
        <GlowingSphere position={[0, 0, -5]} color="#1e40af" scale={1.5} speed={0.5} />
        <GeometricRing position={[0, 0, -5]} rotation={[0, 0, 0]} color="#3b82f6" radius={3.5} />
        <GeometricRing position={[0, 0, -5]} rotation={[Math.PI / 3, 0, 0]} color="#06b6d4" radius={3} />
      </>
    );
  }
  return <HeroScene />;
};

interface ThreeSceneProps {
  currentSection?: string;
}

export default function ThreeScene({ currentSection = 'hero' }: ThreeSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [webGLStatus, setWebGLStatus] = useState<WebGLSupportResult>({ supported: true });

  useEffect(() => {
    setMounted(true);
    setWebGLStatus(checkWebGLSupport());
  }, []);

  if (!mounted) return null;

  if (!webGLStatus.supported) {
    return <div className="fixed inset-0 bg-gray-950" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 -z-10"
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#3b82f6" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[0, 0, 3]} intensity={2} color="#1e40af" distance={15} />
        <Stars radius={80} depth={60} count={4000} factor={3} saturation={0.5} fade speed={0.5} />
        <ParticleField />
        <SectionScene section={currentSection} />
        <fog attach="fog" args={['#000510', 20, 35]} />
      </Canvas>
    </motion.div>
  );
}

export { ThreeScene }
