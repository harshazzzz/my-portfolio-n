"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh, Points, MathUtils } from "three";
import DeveloperFallback from "./DeveloperFallback";
import styles from "./DeveloperAvatar.module.css";
type V3 = [number, number, number];
function Box({
  position,
  size,
  color,
  glow = false,
  rotation,
}: {
  position: V3;
  size: V3;
  color: string;
  glow?: boolean;
  rotation?: V3;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        metalness={0.25}
        emissive={glow ? color : "#000000"}
        emissiveIntensity={glow ? 1.7 : 0}
      />
    </mesh>
  );
}
function Ball({
  position,
  scale,
  color,
}: {
  position: V3;
  scale: V3;
  color: string;
}) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 20, 16]} />
      <meshStandardMaterial color={color} roughness={0.78} />
    </mesh>
  );
}
function CodePanel({
  position,
  rotation = [0, 0, 0],
  small = false,
  animate,
}: {
  position: V3;
  rotation?: V3;
  small?: boolean;
  animate: boolean;
}) {
  const group = useRef<Group>(null),
    cursor = useRef<Mesh>(null),
    time = useRef(0);
  useFrame((_, delta) => {
    if (!animate) return;
    time.current += Math.min(delta, 0.04);
    if (group.current && small) {
      group.current.position.y =
        position[1] + Math.sin(time.current + position[0]) * 0.045;
      group.current.rotation.y =
        rotation[1] + Math.sin(time.current * 0.4) * 0.04;
    }
    if (cursor.current) cursor.current.visible = Math.sin(time.current * 5) > 0;
  });
  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={small ? 0.72 : 1}
    >
      <Box position={[0, 0, 0]} size={[1.1, 0.72, 0.04]} color="#112436" />
      <Box position={[0, 0, 0.026]} size={[1.02, 0.63, 0.01]} color="#06171e" />
      <Box
        position={[0, 0.32, 0.04]}
        size={[1.04, 0.015, 0.015]}
        color={small ? "#8b5cf6" : "#00f5ff"}
        glow
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={i}>
          <Box
            position={[-0.4, 0.21 - i * 0.075, 0.04]}
            size={[0.035, 0.014, 0.009]}
            color="#47727d"
          />
          <Box
            position={[-0.13 + (i % 2) * 0.05, 0.21 - i * 0.075, 0.04]}
            size={[0.35 + (i % 3) * 0.09, 0.018, 0.009]}
            color={i % 3 === 0 ? "#8b5cf6" : "#00bfc9"}
            glow
          />
        </group>
      ))}
      <mesh ref={cursor} position={[0.25, -0.165, 0.05]}>
        <boxGeometry args={[0.015, 0.04, 0.008]} />
        <meshBasicMaterial color="#00f5ff" />
      </mesh>
    </group>
  );
}
function Character({ animate }: { animate: boolean }) {
  const body = useRef<Group>(null),
    eyes = useRef<Group>(null),
    left = useRef<Group>(null),
    right = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, delta) => {
    if (!animate) return;
    time.current += Math.min(delta, 0.04);
    const t = time.current;
    if (body.current) {
      body.current.position.y = Math.sin(t * 1.7) * 0.014;
      body.current.rotation.z = Math.sin(t * 0.7) * 0.012;
    }
    if (left.current) left.current.position.y = Math.sin(t * 10) * 0.012;
    if (right.current) right.current.position.y = Math.sin(t * 10 + 2) * 0.012;
    if (eyes.current) {
      const phase = t % 4.7;
      eyes.current.scale.y =
        phase > 4.5 ? Math.max(0.06, Math.abs(phase - 4.6) * 10) : 1;
    }
  });
  return (
    <group position={[0, 0, -0.42]}>
      {/* Chair and seated legs remain stable while the upper body breathes. */}
      <Box
        position={[0, 0.54, -0.22]}
        size={[0.8, 0.13, 0.68]}
        color="#172032"
      />
      <Box position={[0, 1, -0.53]} size={[0.8, 0.96, 0.13]} color="#121a2b" />
      <Box
        position={[-0.4, 1, -0.44]}
        size={[0.015, 0.8, 0.015]}
        color="#8b5cf6"
        glow
      />
      <Box
        position={[0.4, 1, -0.44]}
        size={[0.015, 0.8, 0.015]}
        color="#8b5cf6"
        glow
      />
      <Box
        position={[0, 0.15, -0.23]}
        size={[0.12, 0.75, 0.12]}
        color="#37465a"
      />
      <Box
        position={[0, -0.21, -0.23]}
        size={[0.8, 0.08, 0.5]}
        color="#182231"
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Ball
            position={[side * 0.22, 0.58, 0.14]}
            scale={[0.17, 0.18, 0.43]}
            color="#273449"
          />
          <Ball
            position={[side * 0.22, 0.2, 0.43]}
            scale={[0.145, 0.39, 0.15]}
            color="#273449"
          />
          <Ball
            position={[side * 0.22, -0.12, 0.54]}
            scale={[0.18, 0.13, 0.29]}
            color="#8a9aaf"
          />
        </group>
      ))}
      <group ref={body}>
        <Ball
          position={[0, 1.1, -0.12]}
          scale={[0.39, 0.55, 0.25]}
          color="#21405a"
        />
        <Box
          position={[0, 1.06, 0.129]}
          size={[0.025, 0.64, 0.015]}
          color="#7c96a9"
        />
        <Box
          position={[0.2, 1.29, 0.13]}
          size={[0.12, 0.09, 0.02]}
          color="#00a3ae"
        />
        <Ball
          position={[0, 1.63, -0.09]}
          scale={[0.12, 0.19, 0.12]}
          color="#bc815f"
        />
        <Ball
          position={[0, 1.99, -0.1]}
          scale={[0.34, 0.4, 0.31]}
          color="#c88e6b"
        />
        <Ball
          position={[0, 2.24, -0.16]}
          scale={[0.36, 0.22, 0.33]}
          color="#171923"
        />
        {[-1, 1].map((side) => (
          <group key={side}>
            <Ball
              position={[side * 0.33, 1.98, -0.1]}
              scale={[0.055, 0.095, 0.06]}
              color="#bc815f"
            />
            <Ball
              position={[side * 0.3, 2.17, -0.13]}
              scale={[0.08, 0.18, 0.22]}
              color="#171923"
            />
          </group>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <Ball
            key={i}
            position={[-0.25 + i * 0.12, 2.26 + Math.sin(i) * 0.045, 0.025]}
            scale={[0.13, 0.15, 0.17]}
            color="#171923"
          />
        ))}
        <group position={[0, 2.01, 0.194]} ref={eyes}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <Ball
                position={[side * 0.12, 0, 0]}
                scale={[0.066, 0.046, 0.025]}
                color="#f5ebe2"
              />
              <Ball
                position={[side * 0.12, -0.005, 0.02]}
                scale={[0.026, 0.032, 0.012]}
                color="#17202b"
              />
            </group>
          ))}
        </group>
        <Ball
          position={[0, 1.94, 0.212]}
          scale={[0.05, 0.075, 0.06]}
          color="#ba7d5c"
        />
        <Box
          position={[0, 1.82, 0.176]}
          size={[0.12, 0.018, 0.015]}
          color="#744635"
        />
        {[-1, 1].map((side) => (
          <group key={side}>
            <Ball
              position={[side * 0.4, 1.26, -0.04]}
              scale={[0.15, 0.29, 0.15]}
              color="#21405a"
            />
            <Ball
              position={[side * 0.4, 1.07, 0.19]}
              scale={[0.14, 0.13, 0.33]}
              color="#2b526b"
            />
          </group>
        ))}
        <group ref={left}>
          <Ball
            position={[-0.27, 1.035, 0.46]}
            scale={[0.13, 0.055, 0.14]}
            color="#c88e6b"
          />
          {[0, 1, 2].map((i) => (
            <Ball
              key={i}
              position={[-0.35 + i * 0.06, 1.035, 0.56]}
              scale={[0.027, 0.027, 0.09]}
              color="#c88e6b"
            />
          ))}
        </group>
        <group ref={right}>
          <Ball
            position={[0.27, 1.035, 0.46]}
            scale={[0.13, 0.055, 0.14]}
            color="#c88e6b"
          />
          {[0, 1, 2].map((i) => (
            <Ball
              key={i}
              position={[0.21 + i * 0.06, 1.035, 0.56]}
              scale={[0.027, 0.027, 0.09]}
              color="#c88e6b"
            />
          ))}
        </group>
      </group>
    </group>
  );
}
function Workspace({ animate }: { animate: boolean }) {
  const world = useRef<Group>(null),
    particles = useRef<Points>(null),
    time = useRef(0);
  const [positions] = useState(() => {
    const values = new Float32Array(90);
    for (let i = 0; i < 30; i++) {
      values[i * 3] = Math.sin(i * 7.13) * 2.2;
      values[i * 3 + 1] = 0.2 + (i % 11) * 0.24;
      values[i * 3 + 2] = Math.cos(i * 3.17) * 1.3;
    }
    return values;
  });
  useFrame(({ pointer }, delta) => {
    if (!animate) return;
    time.current += Math.min(delta, 0.04);
    if (world.current)
      world.current.rotation.y = MathUtils.damp(
        world.current.rotation.y,
        pointer.x * 0.13,
        3,
        delta,
      );
    if (particles.current) {
      particles.current.rotation.y = time.current * 0.035;
      particles.current.position.y = Math.sin(time.current * 0.6) * 0.07;
    }
  });
  return (
    <group ref={world} position={[0, -0.7, 0]}>
      <Character animate={animate} />
      <Box
        position={[0, 0.88, 0.35]}
        size={[2.05, 0.09, 1.05]}
        color="#152537"
      />
      <Box
        position={[0, 0.875, 0.88]}
        size={[2, 0.016, 0.014]}
        color="#00f5ff"
        glow
      />
      {[-0.85, 0.85].map((x) => (
        <Box
          key={x}
          position={[x, 0.32, 0.38]}
          size={[0.075, 1, 0.7]}
          color="#1a2639"
        />
      ))}
      <Box
        position={[0, 0.95, 0.37]}
        size={[1.15, 0.035, 0.58]}
        color="#5a6b82"
      />
      {[0, 1, 2].map((row) => (
        <Box
          key={row}
          position={[0, 0.975, 0.23 + row * 0.1]}
          size={[0.82, 0.008, 0.045]}
          color="#142a3d"
        />
      ))}
      <CodePanel
        position={[0, 1.35, 0.68]}
        rotation={[-0.16, 0, 0]}
        animate={animate}
      />
      <CodePanel
        position={[-1.35, 1.85, -0.25]}
        rotation={[0, 0.2, 0.04]}
        small
        animate={animate}
      />
      <CodePanel
        position={[1.35, 1.8, -0.15]}
        rotation={[0, -0.2, -0.04]}
        small
        animate={animate}
      />
      <mesh position={[0, -0.29, 0]}>
        <cylinderGeometry args={[1.8, 1.85, 0.08, 64]} />
        <meshStandardMaterial color="#0b1320" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.76, 1.78, 64]} />
        <meshBasicMaterial color="#00a7b5" transparent opacity={0.65} />
      </mesh>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#7ddde8"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
export default function DeveloperScene({ animate }: { animate: boolean }) {
  const [lost, setLost] = useState(false);
  if (lost) return <DeveloperFallback />;
  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [3.2, 2.45, 6], fov: 35 }}
        frameloop={animate ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        fallback={<DeveloperFallback />}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0.55, 0);
          gl.domElement.addEventListener(
            "webglcontextlost",
            () => setLost(true),
            { once: true },
          );
        }}
      >
        <ambientLight intensity={1.3} />
        <hemisphereLight args={["#c8e5ff", "#171025", 1.5]} />
        <directionalLight position={[3, 5, 4]} intensity={3} color="#d9f7ff" />
        <pointLight position={[-3, 2, 2]} color="#00f5ff" intensity={12} />
        <pointLight position={[3, 2, -2]} color="#8b5cf6" intensity={16} />
        <Workspace animate={animate} />
      </Canvas>
    </div>
  );
}
