/**
 * Deterministic seeded RNG so SSR/CSR renders produce identical layouts and
 * subsequent frames don't jitter from non-determinism.
 */
export function seededRandom(seed: number): () => number {
  let state = seed | 0 || 1;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export interface BrownianBody {
  // Resting (anchor) position — the body softly drifts around this.
  anchor: [number, number, number];
  // Current world position (mutated each frame).
  pos: [number, number, number];
  // Current velocity (mutated each frame).
  vel: [number, number, number];
  // Per-body phase so wiggles don't synchronise.
  phase: number;
}

/**
 * Allocate `n` bodies inside a vertical cylindrical region. Used for ions
 * floating in the beaker's water column.
 */
export function makeBrownianBodies(n: number, opts: {
  seed: number;
  radius: number;     // horizontal jitter radius around centre
  yMin: number;
  yMax: number;
}): BrownianBody[] {
  const rand = seededRandom(opts.seed);
  const out: BrownianBody[] = [];
  for (let i = 0; i < n; i++) {
    const angle = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * opts.radius;        // uniform-area sample
    const y = opts.yMin + rand() * (opts.yMax - opts.yMin);
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    out.push({
      anchor: [x, y, z],
      pos:    [x, y, z],
      vel:    [0, 0, 0],
      phase:  rand() * Math.PI * 2,
    });
  }
  return out;
}

/**
 * Update bodies in-place with cheap pseudo-Brownian motion:
 *   - small randomised acceleration each frame
 *   - velocity damping
 *   - soft pull back to anchor (so bodies don't drift out of the beaker)
 *
 * Costs ~10 floats × n bodies per frame. Trivial for n ≤ 20.
 */
export function updateBrownian(
  bodies: BrownianBody[],
  dt: number,
  t: number,
  opts: {
    jitter?: number;     // acceleration magnitude
    damping?: number;    // 0..1, fraction of vel retained per frame
    spring?: number;     // pull strength toward anchor
  } = {},
) {
  const jitter = opts.jitter ?? 0.6;
  const damping = opts.damping ?? 0.92;
  const spring = opts.spring ?? 0.8;

  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    // Use a smooth-ish noise driver based on time + per-body phase so the
    // motion is continuous rather than purely white-noise jitter.
    const ax = Math.sin(t * 1.7 + b.phase) * jitter;
    const ay = Math.sin(t * 1.3 + b.phase * 1.7) * jitter * 0.6;
    const az = Math.cos(t * 1.9 + b.phase * 0.6) * jitter;

    b.vel[0] += ax * dt;
    b.vel[1] += ay * dt;
    b.vel[2] += az * dt;

    // spring back to anchor
    b.vel[0] += (b.anchor[0] - b.pos[0]) * spring * dt;
    b.vel[1] += (b.anchor[1] - b.pos[1]) * spring * dt;
    b.vel[2] += (b.anchor[2] - b.pos[2]) * spring * dt;

    // damping
    b.vel[0] *= damping;
    b.vel[1] *= damping;
    b.vel[2] *= damping;

    b.pos[0] += b.vel[0] * dt;
    b.pos[1] += b.vel[1] * dt;
    b.pos[2] += b.vel[2] * dt;
  }
}
