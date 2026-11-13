"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const R = 1; // radio
const H = 2.3; // alto
const GROSOR = 0.07; // grosor de la pared

// Cerámica satinada: menos brillo "espejo" para que no se queme el diseño
const CERAMICA = { color: "#ffffff", roughness: 0.45, metalness: 0 } as const;

function Taza({ textura }: { textura: THREE.Texture | null }) {
  return (
    // Gira la taza para que el arte quede de frente y el asa a un lado
    <group rotation={[0, Math.PI / 2 - 0.6, 0]}>
      {/* Pared exterior: aquí se aplica el arte */}
      <mesh>
        <cylinderGeometry
          args={[R, R, H, 96, 1, true, Math.PI / 2, Math.PI * 2]}
        />
        <meshStandardMaterial
          key={textura ? "con-arte" : "sin-arte"}
          map={textura}
          {...CERAMICA}
        />
      </mesh>

      {/* Fondo exterior */}
      <mesh position={[0, -H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 64]} />
        <meshStandardMaterial {...CERAMICA} />
      </mesh>

      {/* Pared interior */}
      <mesh>
        <cylinderGeometry args={[R - GROSOR, R - GROSOR, H, 64, 1, true]} />
        <meshStandardMaterial {...CERAMICA} side={THREE.BackSide} />
      </mesh>

      {/* Fondo interior */}
      <mesh position={[0, -H / 2 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R - GROSOR, 64]} />
        <meshStandardMaterial {...CERAMICA} />
      </mesh>

      {/* Borde superior */}
      <mesh position={[0, H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R - GROSOR, R, 64]} />
        <meshStandardMaterial {...CERAMICA} />
      </mesh>

      {/* Asa */}
      <mesh position={[R - 0.02, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.6, 0.09, 24, 48, Math.PI]} />
        <meshStandardMaterial {...CERAMICA} />
      </mesh>
    </group>
  );
}

export default function TazaViewer({
  textura,
  autoGirar = false,
}: {
  textura: THREE.Texture | null;
  autoGirar?: boolean;
}) {
  const [tocada, setTocada] = useState(false);

  return (
    // flat = sin tone mapping, para que los colores se vean fieles al diseño
    <Canvas flat camera={{ position: [0, 1, 6], fov: 35 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} />
      <directionalLight position={[-5, 2, 3]} intensity={0.4} />
      <Taza textura={textura} />
      <ContactShadows
        position={[0, -H / 2 - 0.01, 0]}
        opacity={0.4}
        blur={2.5}
        scale={8}
      />
      <Environment preset="studio" environmentIntensity={0.4} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        autoRotate={autoGirar && !tocada}
        autoRotateSpeed={1.5}
        onStart={() => setTocada(true)}
      />
    </Canvas>
  );
}