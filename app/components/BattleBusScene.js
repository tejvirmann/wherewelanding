"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";

function BattleBusModel() {
  const { scene } = useGLTF("/battle_bus.glb");
  return (
    <primitive
      object={scene}
      scale={0.7}
      position={[0, -0.7, 0]}
      rotation={[0, Math.PI * 0.35, 0]}
    />
  );
}

export default function BattleBusScene() {
  return (
    <div className="bus-3d">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#f5f6fb"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 6]} intensity={1} />
        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.6}>
          <BattleBusModel />
        </Float>
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/battle_bus.glb");
