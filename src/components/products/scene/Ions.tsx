import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html } from '@react-three/drei';
import type { Group } from 'three';
import {
  makeBrownianBodies,
  updateBrownian,
  type BrownianBody,
} from './brownian';

/**
 * Population of Na⁺ and OH⁻ ions floating in solution. Subdued, chemistry-grade
 * CPK colours (not toy primaries), small radii, no emissive glow on idle.
 * Charge labels appear only on hover, in a small monochrome tooltip.
 */

export interface IonsProps {
  scaleRef: React.MutableRefObject<number>;
  hoveredEl: string | null;
  setHoveredEl: (el: string | null) => void;
  isMobile: boolean;
}

// CPK-inspired but desaturated to feel like a render, not a science-class kit.
const C_NA   = '#5e4a9b';  // muted violet — sodium
const C_O    = '#b53a3a';  // brick red — oxygen
const C_H    = '#d8d8db';  // pale grey-white — hydrogen
const C_BOND = '#a8a8a8';

export const Ions = ({ scaleRef, hoveredEl, setHoveredEl, isMobile }: IonsProps) => {
  const sodiumCount = isMobile ? 4 : 6;
  const hydroxideCount = isMobile ? 4 : 6;

  const sodiumBodies = useMemo<BrownianBody[]>(
    () =>
      makeBrownianBodies(sodiumCount, {
        seed: 91317,
        radius: 0.7,
        yMin: -0.55,
        yMax: 0.4,
      }),
    [sodiumCount],
  );

  const hydroxideBodies = useMemo<BrownianBody[]>(
    () =>
      makeBrownianBodies(hydroxideCount, {
        seed: 27431,
        radius: 0.7,
        yMin: -0.55,
        yMax: 0.4,
      }),
    [hydroxideCount],
  );

  const sodiumGroupRef = useRef<Group>(null);
  const hydroxideGroupRef = useRef<Group>(null);

  useFrame((_, dt) => {
    const t = performance.now() / 1000;
    const scale = scaleRef.current;
    if (scale <= 0.001) {
      if (sodiumGroupRef.current) sodiumGroupRef.current.visible = false;
      if (hydroxideGroupRef.current) hydroxideGroupRef.current.visible = false;
      return;
    }
    if (sodiumGroupRef.current) sodiumGroupRef.current.visible = true;
    if (hydroxideGroupRef.current) hydroxideGroupRef.current.visible = true;

    // Subtler ion drift than before.
    const opts = { jitter: 0.28, damping: 0.94, spring: 0.65 };
    updateBrownian(sodiumBodies, Math.min(dt, 0.05), t, opts);
    updateBrownian(hydroxideBodies, Math.min(dt, 0.05), t, opts);

    if (sodiumGroupRef.current) {
      sodiumGroupRef.current.children.forEach((child, i) => {
        const b = sodiumBodies[i];
        if (!b) return;
        child.position.set(b.pos[0], b.pos[1], b.pos[2]);
        child.scale.setScalar(scale);
      });
    }
    if (hydroxideGroupRef.current) {
      hydroxideGroupRef.current.children.forEach((child, i) => {
        const b = hydroxideBodies[i];
        if (!b) return;
        child.position.set(b.pos[0], b.pos[1], b.pos[2]);
        child.scale.setScalar(scale);
      });
    }
  });

  const naActive = hoveredEl === 'Na';
  const ohActive = hoveredEl === 'O' || hoveredEl === 'H';

  return (
    <>
      <group ref={sodiumGroupRef} visible={false}>
        {sodiumBodies.map((_, i) => (
          <SodiumIon
            key={`na-${i}`}
            highlighted={naActive}
            onHover={(h) => setHoveredEl(h ? 'Na' : null)}
          />
        ))}
      </group>

      <group ref={hydroxideGroupRef} visible={false}>
        {hydroxideBodies.map((_, i) => (
          <HydroxideIon
            key={`oh-${i}`}
            highlighted={ohActive}
            onHover={(h) => setHoveredEl(h ? 'O' : null)}
          />
        ))}
      </group>
    </>
  );
};

/* ─── Na⁺ ───────────────────────────────────────────── */

const SodiumIon = ({
  highlighted,
  onHover,
}: {
  highlighted: boolean;
  onHover: (entered: boolean) => void;
}) => (
  <group>
    <mesh
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
      onPointerOut={() => onHover(false)}
    >
      <sphereGeometry args={[0.11, 32, 32]} />
      <meshStandardMaterial
        color={C_NA}
        roughness={0.4}
        metalness={0.15}
        // No emissive on idle — only a touch on hover.
        emissive={highlighted ? C_NA : '#000000'}
        emissiveIntensity={highlighted ? 0.45 : 0}
      />
    </mesh>
    {highlighted && (
      <Billboard>
        <Html
          position={[0, 0.18, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(20,20,24,0.8)',
              color: 'rgba(255,255,255,0.92)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              fontFamily: 'ui-monospace,SFMono-Regular,monospace',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Na⁺
          </div>
        </Html>
      </Billboard>
    )}
  </group>
);

/* ─── OH⁻ ───────────────────────────────────────────── */

const HydroxideIon = ({
  highlighted,
  onHover,
}: {
  highlighted: boolean;
  onHover: (entered: boolean) => void;
}) => (
  <group
    onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
    onPointerOut={() => onHover(false)}
  >
    {/* O atom */}
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.10, 32, 32]} />
      <meshStandardMaterial
        color={C_O}
        roughness={0.42}
        metalness={0.05}
        emissive={highlighted ? C_O : '#000000'}
        emissiveIntensity={highlighted ? 0.35 : 0}
      />
    </mesh>
    {/* H atom */}
    <mesh position={[0.13, 0.05, 0]}>
      <sphereGeometry args={[0.05, 24, 24]} />
      <meshStandardMaterial
        color={C_H}
        roughness={0.55}
        metalness={0.0}
      />
    </mesh>
    {/* O–H bond */}
    <mesh position={[0.065, 0.025, 0]} rotation={[0, 0, -0.36]}>
      <cylinderGeometry args={[0.018, 0.018, 0.14, 12]} />
      <meshStandardMaterial color={C_BOND} roughness={0.5} metalness={0.1} />
    </mesh>
    {highlighted && (
      <Billboard>
        <Html
          position={[0.05, 0.22, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(20,20,24,0.8)',
              color: 'rgba(255,255,255,0.92)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              fontFamily: 'ui-monospace,SFMono-Regular,monospace',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            OH⁻
          </div>
        </Html>
      </Billboard>
    )}
  </group>
);
