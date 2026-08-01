"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------- */
/* helpers                                                           */
/* ---------------------------------------------------------------- */

const NEON = "#39ff88";
const BODY = "#0c130f";

function useGeo<T extends THREE.BufferGeometry>(factory: () => T, deps: unknown[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

/** Solid dark mesh + neon edge lines (blueprint/glow look). */
function Part({
  geo,
  position,
  rotation,
  scale,
  wire = false,
  emissive = false,
}: {
  geo: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  wire?: boolean;
  emissive?: boolean;
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 30), [geo]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geo}>
        {emissive ? (
          <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={2.4} />
        ) : (
          <meshStandardMaterial color={BODY} roughness={0.38} metalness={0.75} />
        )}
      </mesh>
      {wire ? (
        <mesh geometry={geo} scale={1.015}>
          <meshBasicMaterial color={NEON} wireframe transparent opacity={0.18} />
        </mesh>
      ) : (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={NEON} transparent opacity={emissive ? 0.05 : 0.4} />
        </lineSegments>
      )}
    </group>
  );
}

/* ---------------------------------------------------------------- */
/* filmmaking gear models (low-poly, neon-edged)                     */
/* ---------------------------------------------------------------- */

function CinemaCamera() {
  const body = useGeo(() => new THREE.BoxGeometry(1.7, 1.05, 0.95), []);
  const barrel = useGeo(() => new THREE.CylinderGeometry(0.34, 0.42, 0.85, 20), []);
  const glass = useGeo(() => new THREE.CylinderGeometry(0.3, 0.3, 0.06, 20), []);
  const matte = useGeo(() => new THREE.BoxGeometry(1.15, 0.95, 0.34), []);
  const reel = useGeo(() => new THREE.CylinderGeometry(0.42, 0.42, 0.14, 24), []);
  const hub = useGeo(() => new THREE.CylinderGeometry(0.08, 0.08, 0.2, 10), []);
  const post = useGeo(() => new THREE.BoxGeometry(0.14, 0.5, 0.14), []);
  const bar = useGeo(() => new THREE.BoxGeometry(1.1, 0.12, 0.12), []);
  return (
    <group>
      <Part geo={body} />
      <Part geo={barrel} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0.85]} />
      <Part geo={glass} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 1.2]} emissive />
      <Part geo={matte} position={[0, 0.08, 1.6]} />
      <Part geo={reel} rotation={[Math.PI / 2, 0, 0]} position={[-0.42, 0.78, -0.1]} />
      <Part geo={reel} rotation={[Math.PI / 2, 0, 0]} position={[0.42, 0.78, -0.1]} />
      <Part geo={hub} rotation={[Math.PI / 2, 0, 0]} position={[-0.42, 0.78, -0.1]} wire />
      <Part geo={hub} rotation={[Math.PI / 2, 0, 0]} position={[0.42, 0.78, -0.1]} wire />
      <Part geo={post} position={[-0.5, -0.72, 0]} />
      <Part geo={post} position={[0.5, -0.72, 0]} />
      <Part geo={bar} position={[0, -1.0, 0]} />
    </group>
  );
}

function BigLens() {
  const barrel1 = useGeo(() => new THREE.CylinderGeometry(0.55, 0.62, 0.9, 24), []);
  const barrel2 = useGeo(() => new THREE.CylinderGeometry(0.62, 0.55, 0.7, 24), []);
  const hood = useGeo(() => new THREE.CylinderGeometry(0.78, 0.62, 0.5, 24, 1, true), []);
  const glass = useGeo(() => new THREE.CylinderGeometry(0.56, 0.56, 0.05, 24), []);
  const ring = useGeo(() => new THREE.TorusGeometry(0.6, 0.05, 10, 28), []);
  return (
    <group rotation={[Math.PI / 2.4, 0, 0]}>
      <Part geo={barrel1} position={[0, -0.4, 0]} />
      <Part geo={barrel2} position={[0, 0.35, 0]} />
      <Part geo={hood} position={[0, 0.95, 0]} wire />
      <Part geo={glass} position={[0, 1.05, 0]} emissive />
      <Part geo={ring} position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]} wire />
      <Part geo={ring} position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]} wire />
    </group>
  );
}

function Spotlight() {
  const cone = useGeo(() => new THREE.CylinderGeometry(0.25, 0.72, 0.9, 20, 1, true), []);
  const barn = useGeo(() => new THREE.BoxGeometry(0.1, 0.72, 0.02), []);
  const bulb = useGeo(() => new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), []);
  const standTop = useGeo(() => new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8), []);
  const legA = useGeo(() => new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), []);
  return (
    <group>
      <Part geo={cone} rotation={[Math.PI / 2.15, 0, 0]} position={[0, 0.4, 0.2]} wire />
      <Part geo={bulb} rotation={[Math.PI / 2.15, 0, 0]} position={[0, 0.62, 0.5]} emissive />
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r) => (
        <Part key={r} geo={barn} rotation={[Math.PI / 2.15, r, 0]} position={[Math.sin(r) * 0.42, 0.18, 0.02 + Math.cos(r) * 0.42]} wire />
      ))}
      <Part geo={standTop} position={[0, -0.55, 0.1]} />
      <Part geo={legA} rotation={[0, 0, 0.5]} position={[-0.32, -1.35, 0.3]} />
      <Part geo={legA} rotation={[0, 0, -0.5]} position={[0.32, -1.35, 0.3]} />
      <Part geo={legA} rotation={[0.4, 0, 0]} position={[0, -1.35, -0.25]} />
    </group>
  );
}

function Clapperboard() {
  const board = useGeo(() => new THREE.BoxGeometry(1.3, 0.9, 0.07), []);
  const stick = useGeo(() => new THREE.BoxGeometry(1.3, 0.24, 0.07), []);
  const stripe = useGeo(() => new THREE.BoxGeometry(0.16, 0.24, 0.075), []);
  const line = useGeo(() => new THREE.BoxGeometry(1.05, 0.035, 0.075), []);
  return (
    <group>
      <Part geo={board} />
      <group position={[0, 0.56, 0]} rotation={[0, 0, 0.28]}>
        <Part geo={stick} />
        {[-0.5, -0.17, 0.17, 0.5].map((x) => (
          <Part key={x} geo={stripe} position={[x, 0, 0]} emissive={x === -0.17} />
        ))}
      </group>
      <Part geo={line} position={[0, 0.12, 0.045]} wire />
      <Part geo={line} position={[0, -0.14, 0.045]} wire />
      <Part geo={line} position={[0, -0.34, 0.045]} scale={[0.7, 1, 1]} wire />
    </group>
  );
}

function FilmReel() {
  const disc = useGeo(() => new THREE.CylinderGeometry(0.85, 0.85, 0.1, 30), []);
  const spoke = useGeo(() => new THREE.BoxGeometry(0.16, 1.5, 0.06), []);
  const hub = useGeo(() => new THREE.CylinderGeometry(0.16, 0.16, 0.2, 14), []);
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <Part geo={disc} wire />
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((r) => (
        <Part key={r} geo={spoke} rotation={[0, 0, r]} />
      ))}
      <Part geo={hub} emissive />
    </group>
  );
}

function RingPortal() {
  const torus = useGeo(() => new THREE.TorusGeometry(6.4, 0.03, 8, 90), []);
  const torus2 = useGeo(() => new THREE.TorusGeometry(7.6, 0.02, 8, 90), []);
  return (
    <group position={[0, 0.6, -11]}>
      <mesh geometry={torus}>
        <meshBasicMaterial color={NEON} transparent opacity={0.16} />
      </mesh>
      <mesh geometry={torus2} rotation={[0.5, 0.4, 0]}>
        <meshBasicMaterial color={NEON} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Particles({ count = 130 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = -2 - Math.random() * 12;
    }
    return arr;
  }, [count]);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={NEON} size={0.05} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ---------------------------------------------------------------- */
/* floating motion + pointer parallax                                */
/* ---------------------------------------------------------------- */

function Floaty({
  children,
  position,
  amp = 0.35,
  speed = 0.7,
  rotSpeed = 0.12,
  scale = 1,
}: {
  children: React.ReactNode;
  position: [number, number, number];
  amp?: number;
  speed?: number;
  rotSpeed?: number;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 100, []);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime * speed + seed;
    g.position.y = position[1] + Math.sin(t) * amp;
    g.position.x = position[0] + Math.cos(t * 0.6) * amp * 0.4;
    g.rotation.y += dt * rotSpeed;
    g.rotation.x = Math.sin(t * 0.5) * 0.12;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.14, dt * 1.8);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.08, dt * 1.8);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.current.x * 0.7, dt * 1.6);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.8 - pointer.current.y * 0.45, dt * 1.6);
    state.camera.lookAt(0, 0, -2);
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------------------------------------------------------------- */
/* scene                                                             */
/* ---------------------------------------------------------------- */

export default function CinemaScene() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.8, 13.5], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#030503", 11, 26]} />
      <ambientLight intensity={0.5} color="#cfe8d8" />
      <directionalLight position={[6, 8, 4]} intensity={1.1} color="#eaffe9" />
      <pointLight position={[-6, 4, -2]} intensity={small ? 8 : 14} distance={26} color={NEON} />
      <pointLight position={[6, -3, 2]} intensity={small ? 6 : 10} distance={22} color="#0ea654" />

      <RingPortal />
      <Particles count={small ? 70 : 140} />

      <Rig>
        <Floaty position={[small ? -4.6 : -7, 2.4, -3.5]} speed={0.5} rotSpeed={0.16} scale={small ? 0.8 : 1.05}>
          <CinemaCamera />
        </Floaty>
        <Floaty position={[small ? 4.4 : 7.2, 1.4, -4.5]} speed={0.62} rotSpeed={-0.14} scale={small ? 0.85 : 1.15}>
          <BigLens />
        </Floaty>
        {!small && (
          <Floaty position={[0.6, 4.2, -7.5]} speed={0.44} rotSpeed={0.1} amp={0.3} scale={1.15}>
            <Spotlight />
          </Floaty>
        )}
        <Floaty position={[small ? -3.6 : -5.2, -3.2, -2]} speed={0.74} rotSpeed={0.18} amp={0.42} scale={0.85}>
          <Clapperboard />
        </Floaty>
        <Floaty position={[small ? 3.4 : 5.6, -3, -3]} speed={0.56} rotSpeed={0.3} amp={0.34}>
          <FilmReel />
        </Floaty>
        {!small && (
          <Floaty position={[1.6, -4.6, -6.5]} speed={0.66} rotSpeed={0.14} scale={0.62}>
            <CinemaCamera />
          </Floaty>
        )}
      </Rig>
    </Canvas>
  );
}
