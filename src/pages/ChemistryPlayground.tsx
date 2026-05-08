import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { SEO } from '@/components/SEO';
import { Copy, RotateCcw, Beaker as BeakerIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  DEFAULT_TUNING,
  type ChemistryHeroTuning,
  type EnvPreset,
} from '@/components/products/ChemistryHero3D';
import type { MoleculeSpec } from '@/data/productTypes';

// Lazy-load the 3D scene so the playground respects the same chunk-split
// strategy as the production hero (three.js + drei + postprocessing in their
// own chunk).
const ChemistryHero3D = lazy(
  () => import('@/components/products/ChemistryHero3D'),
);

const ENV_PRESETS: EnvPreset[] = [
  'apartment',
  'city',
  'dawn',
  'forest',
  'lobby',
  'night',
  'park',
  'studio',
  'sunset',
  'warehouse',
];

// NaOH spec — same as the pilot. The 3D scene is currently NaOH-specific so
// passing any other molecule has no visual effect, but we keep the type-safe
// shape here for parity with the production hero.
const NAOH_MOLECULE: MoleculeSpec = {
  atoms: [
    { el: 'Na', x: 25, y: 50 },
    { el: 'O', x: 55, y: 50 },
    { el: 'H', x: 80, y: 50 },
  ],
  bonds: [
    { from: 0, to: 1, kind: 'ionic' },
    { from: 1, to: 2, kind: 'covalent', order: 1 },
  ],
};

const ChemistryPlayground = () => {
  const [tuning, setTuning] = useState<ChemistryHeroTuning>(DEFAULT_TUNING);

  // Force a remount of the 3D scene when env-related material props change
  // that drei's MeshTransmissionMaterial caches at construction time. Most
  // tunables hot-update fine via re-render; environment preset changes also
  // re-create the HDR cubemap so they're cheap.
  // We bump a key to be safe whenever the user picks a different HDR preset.
  const [sceneKey, setSceneKey] = useState(0);
  useEffect(() => {
    setSceneKey((n) => n + 1);
  }, [tuning.envPreset]);

  const update = <K extends keyof ChemistryHeroTuning>(
    key: K,
    value: ChemistryHeroTuning[K],
  ) => setTuning((t) => ({ ...t, [key]: value }));

  const reset = () => {
    setTuning(DEFAULT_TUNING);
    toast.success('Reset to ship defaults');
  };

  const copyTuning = async () => {
    // Emit a TS object literal that can be pasted directly over DEFAULT_TUNING
    // in ChemistryHero3D.tsx. Delta-only would be more useful but harder to
    // proofread when iterating, so we emit the full object.
    const lines: string[] = ['export const DEFAULT_TUNING: ChemistryHeroTuning = {'];
    (Object.keys(tuning) as (keyof ChemistryHeroTuning)[]).forEach((k) => {
      const v = tuning[k];
      const formatted =
        typeof v === 'string'
          ? `'${v}'`
          : typeof v === 'boolean'
          ? v
          : Number.isInteger(v)
          ? v
          : (v as number).toFixed(3).replace(/\.?0+$/, '');
      lines.push(`  ${k}: ${formatted},`);
    });
    lines.push('};');
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Tuning copied to clipboard', {
        description: 'Paste over DEFAULT_TUNING in ChemistryHero3D.tsx',
      });
    } catch {
      // Fallback for browsers blocking the clipboard API
      // eslint-disable-next-line no-console
      console.log(text);
      toast.error('Clipboard blocked — see console');
    }
  };

  // Diff vs defaults for visual feedback
  const dirtyKeys = useMemo(() => {
    return (Object.keys(tuning) as (keyof ChemistryHeroTuning)[]).filter(
      (k) => tuning[k] !== DEFAULT_TUNING[k],
    );
  }, [tuning]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemistry Hero Playground"
        description="Internal design tool for tuning the 3D chemistry hero."
        noIndex
      />

      <div className="border-b border-border bg-card/40 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <BeakerIcon className="h-4 w-4 text-primary" />
            <h1 className="text-sm font-semibold tracking-tight">
              Chemistry Hero Playground
            </h1>
            <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              dev only · noindex
            </span>
            {dirtyKeys.length > 0 && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                {dirtyKeys.length} change{dirtyKeys.length === 1 ? '' : 's'} vs default
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={copyTuning}>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy tuning
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* 3D scene */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-2">
            <Suspense
              fallback={
                <div className="flex h-[440px] items-center justify-center text-sm text-muted-foreground">
                  Loading 3D scene…
                </div>
              }
            >
              <ChemistryHero3D
                key={sceneKey}
                formula="NaOH"
                molecule={NAOH_MOLECULE}
                productTitle="Caustic Soda Flakes (Playground)"
                tuning={tuning}
              />
            </Suspense>
          </div>

          <p className="text-xs text-muted-foreground">
            All sliders update live. The animation timeline (crystalline → flakes → dissolution → solution)
            replays via the chrome controls in the scene corner. Use <strong>Copy tuning</strong> to export
            current values as a TypeScript literal that overwrites <code>DEFAULT_TUNING</code> in
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[11px]">
              src/components/products/ChemistryHero3D.tsx
            </code>
            .
          </p>
        </div>

        {/* Control panel */}
        <aside className="max-h-[calc(100vh-12rem)] space-y-6 overflow-y-auto rounded-xl border border-border bg-card p-5 lg:sticky lg:top-6">
          <Section title="Environment & lighting">
            <SelectControl
              label="HDR preset"
              value={tuning.envPreset}
              options={ENV_PRESETS}
              onChange={(v) => update('envPreset', v as EnvPreset)}
            />
            <SliderControl
              label="HDR intensity"
              value={tuning.envIntensity}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => update('envIntensity', v)}
            />
            <SliderControl
              label="Ambient"
              value={tuning.ambientIntensity}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update('ambientIntensity', v)}
            />
            <SliderControl
              label="Key light"
              value={tuning.keyLightIntensity}
              min={0}
              max={3}
              step={0.01}
              onChange={(v) => update('keyLightIntensity', v)}
            />
            <ColorControl
              label="Key colour"
              value={tuning.keyLightColor}
              onChange={(v) => update('keyLightColor', v)}
            />
            <SliderControl
              label="Fill light"
              value={tuning.fillLightIntensity}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => update('fillLightIntensity', v)}
            />
            <ColorControl
              label="Fill colour"
              value={tuning.fillLightColor}
              onChange={(v) => update('fillLightColor', v)}
            />
            <SliderControl
              label="Back light"
              value={tuning.backLightIntensity}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => update('backLightIntensity', v)}
            />
          </Section>

          <Section title="Tone mapping">
            <SliderControl
              label="Exposure"
              value={tuning.toneMappingExposure}
              min={0.4}
              max={1.6}
              step={0.01}
              onChange={(v) => update('toneMappingExposure', v)}
            />
          </Section>

          <Section title="Post-processing">
            <SliderControl
              label="Bloom intensity"
              value={tuning.bloomIntensity}
              min={0}
              max={1.5}
              step={0.01}
              onChange={(v) => update('bloomIntensity', v)}
            />
            <SliderControl
              label="Bloom threshold"
              value={tuning.bloomThreshold}
              min={0.4}
              max={1.5}
              step={0.01}
              onChange={(v) => update('bloomThreshold', v)}
            />
            <SliderControl
              label="Bloom radius"
              value={tuning.bloomRadius}
              min={0.1}
              max={1.5}
              step={0.01}
              onChange={(v) => update('bloomRadius', v)}
            />
            <SliderControl
              label="Vignette darkness"
              value={tuning.vignetteDarkness}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update('vignetteDarkness', v)}
            />
            <SliderControl
              label="Vignette offset"
              value={tuning.vignetteOffset}
              min={0}
              max={0.6}
              step={0.01}
              onChange={(v) => update('vignetteOffset', v)}
            />
            <SliderControl
              label="Film grain"
              value={tuning.grainOpacity}
              min={0}
              max={0.15}
              step={0.005}
              format={(v) => v.toFixed(3)}
              onChange={(v) => update('grainOpacity', v)}
            />
          </Section>

          <Section title="Glass (beaker)">
            <SliderControl
              label="Roughness"
              value={tuning.beakerRoughness}
              min={0}
              max={0.4}
              step={0.005}
              onChange={(v) => update('beakerRoughness', v)}
            />
            <SliderControl
              label="Chromatic aberration"
              value={tuning.beakerChromaticAberration}
              min={0}
              max={0.05}
              step={0.001}
              format={(v) => v.toFixed(3)}
              onChange={(v) => update('beakerChromaticAberration', v)}
            />
            <SliderControl
              label="IOR"
              value={tuning.beakerIor}
              min={1.0}
              max={2.0}
              step={0.01}
              onChange={(v) => update('beakerIor', v)}
            />
            <SliderControl
              label="Thickness"
              value={tuning.beakerThickness}
              min={0.05}
              max={1.0}
              step={0.01}
              onChange={(v) => update('beakerThickness', v)}
            />
          </Section>

          <Section title="Camera">
            <SwitchControl
              label="Auto-rotate"
              value={tuning.autoRotate}
              onChange={(v) => update('autoRotate', v)}
            />
            <SliderControl
              label="Auto-rotate speed"
              value={tuning.autoRotateSpeed}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => update('autoRotateSpeed', v)}
            />
            <SliderControl
              label="FOV"
              value={tuning.cameraFov}
              min={20}
              max={70}
              step={1}
              format={(v) => `${v.toFixed(0)}°`}
              onChange={(v) => update('cameraFov', v)}
            />
          </Section>

          <Section title="Warmth & palette">
            <ColorControl
              label="Flake edge glow"
              value={tuning.flakeEdgeColor}
              onChange={(v) => update('flakeEdgeColor', v)}
            />
            <ColorControl
              label="Particle dust"
              value={tuning.particleColor}
              onChange={(v) => update('particleColor', v)}
            />
          </Section>
        </aside>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const SliderControl = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <Label className="text-foreground">{label}</Label>
      <span className="font-mono text-muted-foreground">
        {format ? format(value) : value.toFixed(2)}
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(arr) => onChange(arr[0])}
    />
  </div>
);

const ColorControl = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <Label className="text-xs">{label}</Label>
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] uppercase text-muted-foreground">{value}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent"
      />
    </div>
  </div>
);

const SwitchControl = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <Label className="text-xs">{label}</Label>
    <Switch checked={value} onCheckedChange={onChange} />
  </div>
);

export default ChemistryPlayground;
