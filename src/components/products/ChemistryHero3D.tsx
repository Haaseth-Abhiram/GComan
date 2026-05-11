import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  Suspense,
  type MutableRefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  MeshTransmissionMaterial,
  RoundedBox,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SMAA, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { Group, Mesh, Points, PerspectiveCamera } from 'three';
import type { MoleculeSpec } from '@/data/productTypes';
import { Ions } from './scene/Ions';
import { createDissolveMaterial } from './scene/dissolveShader';
import { seededRandom } from './scene/brownian';

/* ─── Stage timeline (seconds) ─────────────────────────────── */
const T_CRYSTALLINE_END = 1.5;
const T_FLAKES_END      = 3.5;
const T_HYDRATION_END   = 5.0;
const T_DISSOLUTION_END = 7.0;
const T_TOTAL           = 8.0;
const T_SKIP_TARGET     = 7.0;

/* ─── Tuning surface ────────────────────────────────────────
   Live-tunable parameters for the cinematic look. Defaults match
   the values shipped with the pilot — overriding any subset via
   the `tuning` prop only affects the receiving instance, so the
   /dev/chemistry-playground page can iterate without changing
   the production hero. */

export type EnvPreset =
  | 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby'
  | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';

export interface ChemistryHeroTuning {
  /* Glass / beaker material */
  beakerRoughness: number;
  beakerChromaticAberration: number; // desktop only — mobile force-zero
  beakerIor: number;
  beakerThickness: number;

  /* Lighting */
  envPreset: EnvPreset;
  envIntensity: number;
  ambientIntensity: number;
  keyLightIntensity: number;
  fillLightIntensity: number;
  backLightIntensity: number;
  keyLightColor: string;
  fillLightColor: string;

  /* Tone mapping */
  toneMappingExposure: number;

  /* Post-processing */
  bloomIntensity: number;
  bloomThreshold: number;
  bloomRadius: number;
  vignetteDarkness: number;
  vignetteOffset: number;

  /* Camera */
  autoRotate: boolean;
  autoRotateSpeed: number;
  cameraFov: number;

  /* Warmth / palette */
  flakeEdgeColor: string;   // exothermic-glow edge during dissolve
  particleColor: string;    // warm dust drifting up

  /* Film grain — subtle analog noise overlay. 0 = off (production default).
     Recommended dial-in range for "cinematic" feel: 0.025–0.06. */
  grainOpacity: number;
}

export const DEFAULT_TUNING: ChemistryHeroTuning = {
  beakerRoughness: 0.12,
  beakerChromaticAberration: 0.006,
  beakerIor: 1.52,
  beakerThickness: 0.25,

  envPreset: 'warehouse',
  envIntensity: 0.55,
  ambientIntensity: 0.22,
  keyLightIntensity: 0.95,
  fillLightIntensity: 0.4,
  backLightIntensity: 0.3,
  keyLightColor: '#fff8ee',
  fillLightColor: '#cfe5ff',

  toneMappingExposure: 0.92,

  bloomIntensity: 0.32,
  bloomThreshold: 0.92,
  bloomRadius: 0.7,
  vignetteDarkness: 0.42,
  vignetteOffset: 0.12,

  autoRotate: true,
  autoRotateSpeed: 0.18,
  cameraFov: 38,

  flakeEdgeColor: '#ffd9a8',
  particleColor: '#f1d6a8',

  grainOpacity: 0,
};

/* ─── Shared per-frame animation state ─────────────────────── */
interface AnimRefs {
  t:                MutableRefObject<number>;
  beakerOpacity:    MutableRefObject<number>;
  flakeScale:       MutableRefObject<number>;
  flakeDrop:        MutableRefObject<number>;
  flakeDissolve:    MutableRefObject<number>;
  waterDropY:       MutableRefObject<number>;
  waterDropVis:     MutableRefObject<number>;
  waterFill:        MutableRefObject<number>;
  particleEmit:     MutableRefObject<number>;
  ionScale:         MutableRefObject<number>;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// Smooth deceleration — natural settling, not bouncy.
const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
// Very subtle ease for camera breathing.
const easeInOutSine = (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2;

/* ─── Beaker ────────────────────────────────────────────────── */

const Beaker = ({
  animRefs,
  isMobile,
  tuning,
}: {
  animRefs: AnimRefs;
  isMobile: boolean;
  tuning: ChemistryHeroTuning;
}) => {
  const wallRef = useRef<Mesh>(null);
  const baseRef = useRef<Mesh>(null);

  useFrame(() => {
    const v = animRefs.beakerOpacity.current;
    if (wallRef.current) {
      const m = wallRef.current.material as THREE.Material & { opacity: number };
      m.opacity = v;
    }
    if (baseRef.current) {
      const m = baseRef.current.material as THREE.Material & { opacity: number };
      m.opacity = v;
    }
  });

  const samples = isMobile ? 4 : 12;
  const resolution = isMobile ? 256 : 512;
  // Mobile forces zero chromatic aberration — see CLAUDE.md graceful-degradation note.
  const chromaticAberration = isMobile ? 0 : tuning.beakerChromaticAberration;

  return (
    <group>
      <mesh ref={wallRef} castShadow={false} receiveShadow={false}>
        <cylinderGeometry args={[1.22, 1.16, 2.3, 96, 1, true]} />
        <MeshTransmissionMaterial
          color="#f5fbff"
          transmission={1}
          transmissionSampler
          samples={samples}
          resolution={resolution}
          ior={tuning.beakerIor}
          thickness={tuning.beakerThickness}
          chromaticAberration={chromaticAberration}
          roughness={tuning.beakerRoughness}
          // Anisotropy stays at 0 — non-zero values generate directional streaks
          // along the cylinder axis (the glass-streak bug from session history).
          anisotropy={0}
          background={undefined}
          side={THREE.DoubleSide}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={baseRef} position={[0, -1.18, 0]}>
        <cylinderGeometry args={[1.16, 1.16, 0.04, 64]} />
        <MeshTransmissionMaterial
          color="#f5fbff"
          transmission={1}
          transmissionSampler
          samples={samples}
          resolution={resolution}
          ior={tuning.beakerIor}
          thickness={0.18}
          roughness={Math.max(0.08, tuning.beakerRoughness - 0.02)}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
};

/* ─── Water ────────────────────────────────────────────────── */

const Water = ({ animRefs, isMobile }: { animRefs: AnimRefs; isMobile: boolean }) => {
  const cylRef = useRef<Mesh>(null);
  const dropRef = useRef<Mesh>(null);

  useFrame(() => {
    const fill = animRefs.waterFill.current;
    if (cylRef.current) {
      const minY = -1.13;
      const maxFillHeight = 1.55;
      const h = 0.04 + maxFillHeight * fill;
      cylRef.current.scale.set(1, h / 0.5, 1);
      cylRef.current.position.y = minY + h / 2;
      cylRef.current.visible = fill > 0.005;
    }
    if (dropRef.current) {
      dropRef.current.position.y = animRefs.waterDropY.current;
      const vis = animRefs.waterDropVis.current;
      dropRef.current.visible = vis > 0.01;
      dropRef.current.scale.setScalar(0.55 + (1 - vis) * 0.15);
    }
  });

  // Cleaner water — clear with very slight blue-grey tint, not cartoon cyan.
  const transmission = isMobile ? 0.7 : 0.92;

  return (
    <group>
      <mesh ref={dropRef} position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial
          color="#eaf4ff"
          transmission={transmission}
          
          ior={1.33}
          thickness={0.3}
          roughness={0.04}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={cylRef} position={[0, -1.13, 0]} visible={false}>
        <cylinderGeometry args={[1.13, 1.13, 0.5, 64]} />
        <meshPhysicalMaterial
          color="#dceefa"
          transmission={transmission}
          
          ior={1.33}
          thickness={0.55}
          roughness={0.12}
          transparent
          opacity={0.86}
        />
      </mesh>
    </group>
  );
};

/* ─── Flakes ───────────────────────────────────────────────── */

interface FlakeData {
  rest: [number, number, number];
  rot:  [number, number, number];
  delay: number;
  size: number;
  freqOffset: number;
}

function generateFlakes(count: number, isMobile: boolean): FlakeData[] {
  const rand = seededRandom(7919);
  const out: FlakeData[] = [];
  const finalCount = isMobile ? Math.max(8, count - 6) : count;
  for (let i = 0; i < finalCount; i++) {
    const angle = rand() * Math.PI * 2;
    const r = rand() * 0.74;
    out.push({
      rest: [Math.cos(angle) * r, -1.04 + rand() * 0.05, Math.sin(angle) * r],
      rot:  [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      delay: rand() * 0.45,
      size:  0.85 + rand() * 0.45,
      freqOffset: 3.2 + rand() * 2.5,
    });
  }
  return out;
}

const Flakes = ({
  flakes,
  animRefs,
  edgeColor,
}: {
  flakes: FlakeData[];
  animRefs: AnimRefs;
  edgeColor: string;
}) => {
  const groupRef = useRef<Group>(null);
  const materials = useMemo(
    () =>
      flakes.map((f) =>
        createDissolveMaterial({
          color: '#f3eee5',          // off-white with very slight warmth
          edgeColor,                 // warm exothermic glow — tunable
          freq: f.freqOffset,
          edge: 0.06,
        }),
      ),
    [flakes, edgeColor],
  );

  useFrame(() => {
    const drop = animRefs.flakeDrop.current;
    const scale = animRefs.flakeScale.current;
    const dissolve = animRefs.flakeDissolve.current;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const f = flakes[i];
      if (!f) return;
      const local = clamp01((drop - f.delay) / Math.max(0.01, 1 - f.delay));
      // Natural settling — quartic ease-out, not bouncy.
      const eased = easeOutQuart(local);
      const startY = 2.5;
      const y = startY + (f.rest[1] - startY) * eased;
      child.position.set(f.rest[0], y, f.rest[2]);
      // Slight residual rotation during fall, settles to rest rotation.
      child.rotation.x = f.rot[0] + (1 - eased) * 0.9;
      child.rotation.y = f.rot[1] + (1 - eased) * 0.7;
      child.rotation.z = f.rot[2];
      child.scale.setScalar(scale * f.size);
      const localDissolve = clamp01((dissolve - f.delay * 0.3) / 0.85);
      const m = materials[i];
      if (m) m.uniforms.uProgress.value = localDissolve;
    });
  });

  return (
    <group ref={groupRef}>
      {flakes.map((f, i) => (
        <RoundedBox key={i} args={[0.5, 0.07, 0.32]} radius={0.04} smoothness={3}>
          <primitive object={materials[i]} attach="material" />
        </RoundedBox>
      ))}
    </group>
  );
};

/* ─── Particle puffs ───────────────────────────────────────── */

const PARTICLE_COUNT_DESKTOP = 220;
const PARTICLE_COUNT_MOBILE  = 70;

interface ParticleState {
  life:  number;
  vel:   [number, number, number];
  spawn: [number, number, number];
}

const ParticlePuff = ({
  flakes,
  animRefs,
  isMobile,
  color,
}: {
  flakes: FlakeData[];
  animRefs: AnimRefs;
  isMobile: boolean;
  color: string;
}) => {
  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  const ref = useRef<Points>(null);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const alphas    = useMemo(() => new Float32Array(count), [count]);
  const states    = useMemo<ParticleState[]>(
    () => Array.from({ length: count }, () => ({ life: 0, vel: [0, 0, 0], spawn: [0, 0, 0] })),
    [count],
  );
  const lastEmitRef = useRef(0);
  const rngRef      = useRef(seededRandom(31337));
  const flakeIdxRef = useRef(0);

  useFrame((_, dt) => {
    const emit = animRefs.particleEmit.current;
    const dissolve = animRefs.flakeDissolve.current;
    const t = animRefs.t.current;

    if (emit > 0.01 && dissolve > 0.02 && dissolve < 0.95) {
      const desiredPerSec = 70 * emit;
      lastEmitRef.current += desiredPerSec * dt;
      while (lastEmitRef.current >= 1) {
        lastEmitRef.current -= 1;
        let slot = -1;
        for (let k = 0; k < count; k++) {
          if (states[k].life <= 0) { slot = k; break; }
        }
        if (slot < 0) break;
        const f = flakes[flakeIdxRef.current % flakes.length];
        flakeIdxRef.current++;
        const rng = rngRef.current;
        const sx = f.rest[0] + (rng() - 0.5) * 0.35;
        const sy = f.rest[1] + 0.05;
        const sz = f.rest[2] + (rng() - 0.5) * 0.35;
        states[slot].life = 1;
        states[slot].spawn = [sx, sy, sz];
        states[slot].vel = [
          (rng() - 0.5) * 0.3,
          0.4 + rng() * 0.5,
          (rng() - 0.5) * 0.3,
        ];
      }
    }

    let geoNeedsUpdate = false;
    for (let k = 0; k < count; k++) {
      const s = states[k];
      if (s.life <= 0) {
        positions[k * 3 + 0] = 999;
        positions[k * 3 + 1] = 999;
        positions[k * 3 + 2] = 999;
        alphas[k] = 0;
        continue;
      }
      s.life -= dt * 0.55;
      const wig = Math.sin(t * 6 + k * 1.7) * 0.1 * dt;
      s.spawn[0] += s.vel[0] * dt + wig;
      s.spawn[1] += s.vel[1] * dt;
      s.spawn[2] += s.vel[2] * dt;
      s.vel[1] *= 0.985;
      positions[k * 3 + 0] = s.spawn[0];
      positions[k * 3 + 1] = s.spawn[1];
      positions[k * 3 + 2] = s.spawn[2];
      alphas[k] = clamp01(s.life) * 0.55;
      geoNeedsUpdate = true;
    }
    if (geoNeedsUpdate && ref.current) {
      const geo = ref.current.geometry;
      (geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (geo.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  // Subdued warm dust — not a fireworks display.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(color) } },
        vertexShader: /* glsl */ `
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 7.0 * (1.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            vec2 d = gl_PointCoord - 0.5;
            float r = length(d);
            float a = smoothstep(0.5, 0.0, r) * vAlpha;
            gl_FragColor = vec4(uColor, a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  // Live-update particle color without rebuilding the material/buffers.
  useEffect(() => {
    (material.uniforms.uColor.value as THREE.Color).set(color);
  }, [color, material]);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aAlpha"   count={count} array={alphas}    itemSize={1} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
};

/* ─── Camera breathing & idle auto-rotate ─────────────────── */

const CameraDrift = ({ animRefs }: { animRefs: AnimRefs }) => {
  // Idle camera life: slow auto-orbit + tiny breathing once t > 7s.
  // Doesn't interfere with user OrbitControls — works at the camera level
  // before controls run, then OrbitControls re-target each frame.
  // We modulate the OrbitControls target subtly via THREE camera.
  const initialPolarRef = useRef<number | null>(null);
  return (
    <DriftDriver animRefs={animRefs} initialPolarRef={initialPolarRef} />
  );
};

const DriftDriver = ({
  animRefs,
  initialPolarRef,
}: {
  animRefs: AnimRefs;
  initialPolarRef: MutableRefObject<number | null>;
}) => {
  // We don't want to fight OrbitControls — but we can subtly nudge the camera
  // along its existing orbit when the animation enters idle. For simplicity
  // we add a tiny vertical breathing motion in world space.
  useFrame(({ camera }, dt) => {
    const t = animRefs.t.current;
    if (t < T_DISSOLUTION_END) return;
    // 0.018 m vertical sway over ~6s — subtle but alive.
    const breath = Math.sin((t - T_DISSOLUTION_END) * 0.32) * 0.018;
    camera.position.y += breath * dt; // small drift, accumulated; clamped by OrbitControls re-targeting
    // Soft re-clamp so it doesn't drift over time
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.5, 0.005);
  });
  return null;
};

/* ─── Imperative tuning sync ───────────────────────────────
   The <Canvas> reads gl.toneMappingExposure and camera.fov at mount only,
   so live-updating those values from the playground requires an imperative
   write to the renderer + camera. This component does that without forcing
   a Canvas remount. */

const LiveTuningSync = ({ tuning }: { tuning: ChemistryHeroTuning }) => {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    gl.toneMappingExposure = tuning.toneMappingExposure;
  }, [gl, tuning.toneMappingExposure]);
  useEffect(() => {
    if ('fov' in camera) {
      (camera as THREE.PerspectiveCamera).fov = tuning.cameraFov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  }, [camera, tuning.cameraFov]);
  return null;
};

/* ─── Lighting + scene driver ─────────────────────────────── */

const SceneContent = ({
  flakes,
  animRefs,
  startRef,
  isMobile,
  hoveredEl,
  setHoveredEl,
  reducedMotion,
  tuning,
}: {
  flakes: FlakeData[];
  animRefs: AnimRefs;
  startRef: MutableRefObject<number | null>;
  isMobile: boolean;
  hoveredEl: string | null;
  setHoveredEl: (el: string | null) => void;
  reducedMotion: boolean;
  tuning: ChemistryHeroTuning;
}) => {
  useFrame(({ clock }) => {
    if (startRef.current === null) startRef.current = clock.elapsedTime;
    const t = clock.elapsedTime - startRef.current;
    animRefs.t.current = t;

    animRefs.beakerOpacity.current = clamp01(t / 0.8);
    animRefs.flakeDrop.current = clamp01((t - T_CRYSTALLINE_END) / (T_FLAKES_END - T_CRYSTALLINE_END));

    if (t < T_HYDRATION_END) {
      animRefs.flakeScale.current = clamp01((t - T_CRYSTALLINE_END) / 0.4);
    } else {
      animRefs.flakeScale.current = clamp01(1 - (t - T_HYDRATION_END) / (T_DISSOLUTION_END - T_HYDRATION_END));
    }

    animRefs.flakeDissolve.current = clamp01((t - T_HYDRATION_END) / (T_DISSOLUTION_END - T_HYDRATION_END));

    const dropPhase = clamp01((t - T_FLAKES_END) / 0.7);
    animRefs.waterDropY.current = 2.4 + (-1.0 - 2.4) * easeOutQuart(dropPhase);
    animRefs.waterDropVis.current = t > T_FLAKES_END + 0.7 ? 0 : (t > T_FLAKES_END ? 1 : 0);

    animRefs.waterFill.current = clamp01((t - T_FLAKES_END - 0.4) / (T_HYDRATION_END - T_FLAKES_END - 0.4));

    animRefs.particleEmit.current = clamp01(
      Math.sin(Math.PI * clamp01((t - T_HYDRATION_END) / (T_DISSOLUTION_END - T_HYDRATION_END))),
    );

    animRefs.ionScale.current = clamp01((t - (T_HYDRATION_END + 1.0)) / 1.2);
  });

  return (
    <>
      {/* HDR environment for soft ambient PBR reflections. Default 'warehouse'
          (large diffuse soft-boxes) avoids the streaking that 'studio' caused
          through the transmission glass — but every preset is now exposed via
          the playground for live A/B comparison. */}
      <Environment preset={tuning.envPreset} environmentIntensity={tuning.envIntensity} />

      {/* Softened 3-point lighting. Original key light at 1.6 drew long vertical
          specular streaks on the cylinder wall — kept the defaults at 0.95/0.4/0.3. */}
      <ambientLight intensity={tuning.ambientIntensity} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={tuning.keyLightIntensity}
        color={tuning.keyLightColor}
        castShadow={false}
      />
      <directionalLight
        position={[-4, 3, -3]}
        intensity={tuning.fillLightIntensity}
        color={tuning.fillLightColor}
      />
      <directionalLight
        position={[0, 2, -5]}
        intensity={tuning.backLightIntensity}
        color="#ffffff"
      />

      <Beaker animRefs={animRefs} isMobile={isMobile} tuning={tuning} />
      <Water animRefs={animRefs} isMobile={isMobile} />
      <Flakes flakes={flakes} animRefs={animRefs} edgeColor={tuning.flakeEdgeColor} />
      <ParticlePuff
        flakes={flakes}
        animRefs={animRefs}
        isMobile={isMobile}
        color={tuning.particleColor}
      />
      <Ions
        scaleRef={animRefs.ionScale}
        hoveredEl={hoveredEl}
        setHoveredEl={setHoveredEl}
        isMobile={isMobile}
      />

      {/* Subtle ground shadow so the beaker feels rooted in space. */}
      <ContactShadows
        position={[0, -1.21, 0]}
        opacity={0.35}
        scale={6}
        blur={2.4}
        far={4}
        resolution={isMobile ? 256 : 512}
      />

      {!reducedMotion && <CameraDrift animRefs={animRefs} />}

      <LiveTuningSync tuning={tuning} />
    </>
  );
};

/* ─── Public component ────────────────────────────────────── */

export interface ChemistryHero3DProps {
  formula: string;
  molecule: MoleculeSpec;
  productTitle: string;
  /** Override any subset of tuning values. Merged over DEFAULT_TUNING. */
  tuning?: Partial<ChemistryHeroTuning>;
}

export default function ChemistryHero3D({
  formula,
  molecule,
  productTitle,
  tuning: tuningOverrides,
}: ChemistryHero3DProps) {
  const tuning = useMemo<ChemistryHeroTuning>(
    () => ({ ...DEFAULT_TUNING, ...tuningOverrides }),
    [tuningOverrides],
  );
  const [hoveredEl, setHoveredEl] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [progress, setProgress] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const flakes = useMemo(() => generateFlakes(18, isMobile), [isMobile]);

  const animRefs = useMemo<AnimRefs>(
    () => ({
      t:               { current: 0 },
      beakerOpacity:   { current: 0 },
      flakeScale:      { current: 0 },
      flakeDrop:       { current: 0 },
      flakeDissolve:   { current: 0 },
      waterDropY:      { current: 2.4 },
      waterDropVis:    { current: 0 },
      waterFill:       { current: 0 },
      particleEmit:    { current: 0 },
      ionScale:        { current: 0 },
    }),
    [],
  );

  const startRef = useRef<number | null>(null);
  const skipPendingRef = useRef(false);

  const handleReplay = useCallback(() => {
    startRef.current = null;
    setResetSignal((n) => n + 1);
    setProgress(0);
  }, []);

  const handleSkip = useCallback(() => {
    skipPendingRef.current = true;
    setProgress(1);
  }, []);

  // Throttled progress updates for the thin top progress bar (max ~10 Hz).
  useEffect(() => {
    let raf = 0;
    let lastUpdate = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - lastUpdate < 100) return;
      lastUpdate = now;
      const t = animRefs.t.current;
      const p = clamp01(t / T_TOTAL);
      setProgress((prev) => (Math.abs(prev - p) > 0.005 ? p : prev));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animRefs]);

  useEffect(() => {
    if (reducedMotion) skipPendingRef.current = true;
  }, [reducedMotion]);

  return (
    <div
      role="img"
      aria-label={`${productTitle} — interactive 3D chemistry sequence: caustic soda flakes dissolving in water and dissociating into Na⁺ and OH⁻ ions`}
      className="relative h-[340px] sm:h-[400px] md:h-[440px] w-full overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_50%_30%,hsl(var(--background))_0%,hsl(var(--muted))_100%)]"
    >
      <Canvas
        key={resetSignal}
        camera={{ position: [0, 0.5, 4.6], fov: tuning.cameraFov }}
        dpr={[1, 2]}
        gl={{
          antialias: false,         // SMAA in post handles AA
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: tuning.toneMappingExposure,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows={false}
      >
        <SkipBridge skipPendingRef={skipPendingRef} startRef={startRef} />

        <Suspense fallback={null}>
          <SceneContent
            flakes={flakes}
            animRefs={animRefs}
            startRef={startRef}
            isMobile={isMobile}
            hoveredEl={hoveredEl}
            setHoveredEl={setHoveredEl}
            reducedMotion={reducedMotion}
            tuning={tuning}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={(2 * Math.PI) / 3}
          rotateSpeed={0.5}
          autoRotate={!reducedMotion && tuning.autoRotate}
          autoRotateSpeed={tuning.autoRotateSpeed}
          enableDamping
          dampingFactor={0.08}
        />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={tuning.bloomIntensity}
            luminanceThreshold={tuning.bloomThreshold}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={tuning.bloomRadius}
          />
          <Vignette eskil={false} offset={tuning.vignetteOffset} darkness={tuning.vignetteDarkness} />
          {tuning.grainOpacity > 0 && (
            <Noise
              opacity={tuning.grainOpacity}
              premultiply
              blendFunction={BlendFunction.SCREEN}
            />
          )}
          <SMAA />
        </EffectComposer>
      </Canvas>

      {/* Top progress bar — discreet, no labels, no toy chips */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-foreground/5">
        <div
          className="h-full bg-foreground/40 transition-[width] duration-100"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Top-left: monochrome formula chip */}
      <div className="pointer-events-none absolute left-3 top-4 inline-flex items-center gap-1.5 rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-mono backdrop-blur-sm">
        <span className="font-medium tracking-wide text-foreground">{formula}</span>
      </div>

      {/* Top-right: skip — monochrome */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute right-3 top-4 rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-sm hover:bg-foreground/[0.1]"
        aria-label="Skip to solution state"
      >
        Skip
      </button>

      {/* Bottom-right: replay — monochrome */}
      <button
        type="button"
        onClick={handleReplay}
        className="absolute right-3 bottom-3 rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-sm hover:bg-foreground/[0.1]"
        aria-label="Replay animation"
      >
        ↻ Replay
      </button>
    </div>
  );
}

const SkipBridge = ({
  skipPendingRef,
  startRef,
}: {
  skipPendingRef: MutableRefObject<boolean>;
  startRef: MutableRefObject<number | null>;
}) => {
  useFrame(({ clock }) => {
    if (skipPendingRef.current) {
      startRef.current = clock.elapsedTime - T_SKIP_TARGET;
      skipPendingRef.current = false;
    }
  });
  return null;
};
