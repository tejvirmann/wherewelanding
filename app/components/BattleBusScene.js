"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";

function BattleBusModel() {
  const { scene } = useGLTF("/battle_bus.glb");
  return (
    <primitive
      object={scene}
      scale={0.95}
      position={[0, -1.4, 0]}
      rotation={[0, Math.PI * 1.05, 0]}
    />
  );
}

export default function BattleBusScene() {
  return (
    <div className="bus-hero">
      <Canvas
        camera={{ position: [400, 467, 200], fov: 28 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#f5f6fb"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 6, 6]} intensity={1.1} />
        <Float speed={0.4} rotationIntensity={0.25} floatIntensity={0.15}>
          <BattleBusModel />
        </Float>
        <Environment preset="city" />
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

useGLTF.preload("/battle_bus.glb");
