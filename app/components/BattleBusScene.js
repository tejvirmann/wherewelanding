"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";

function BattleBusModel() {
  const { scene } = useGLTF("/battle_bus_opt2.glb");
  return (
    <primitive
      object={scene}
      scale={1.1}
      position={[0, -1.4, 0]}
      rotation={[0, Math.PI * 1.05, 0]}
    />
  );
}

export default function BattleBusScene() {
  return (
    <div className="bus-hero">
      <Canvas
        camera={{ position: [300, 350, 150], fov: 22 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#f5f6fb"]} />
        <ambientLight intensity={2.2} />
        <hemisphereLight skyColor="#ffffff" groundColor="#d0d8f0" intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-4, 4, -4]} intensity={0.6} />
        <Float speed={0.4} rotationIntensity={0.25} floatIntensity={0.15}>
          <BattleBusModel />
        </Float>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          target={[0, -0.6, 0]}
          autoRotate
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/battle_bus_opt2.glb");
