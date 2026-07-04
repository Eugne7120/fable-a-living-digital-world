// Ambient audio — procedurally synthesized, never autoplayed.
//
// A single WebAudio graph mounts once at root and persists across route
// changes. District changes crossfade a secondary "bed" layer.
//
// Design notes:
// - Off by default. User must explicitly enable via SoundToggle.
// - Muted state persists in localStorage (via WorldProvider).
// - Beds are procedural (oscillators + filtered noise) so v1 ships without
//   audio assets. Swap in real loops later by replacing buildBed().

import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

import { useWorld } from "@/lib/world-state";
import { districtForPath } from "@/data/districts";
import { ATMOSPHERE, type AudioBedKey } from "@/lib/atmosphere";

interface BedConfig {
  freq: number;      // base drone frequency
  detune: number;    // secondary detune amount
  noiseCutoff: number; // lowpass cutoff for wind/room noise
  noiseGain: number;
  droneGain: number;
  chimeEvery?: number; // seconds between soft chime (library, dream)
  heartbeat?: boolean; // genesis
}

const BEDS: Record<AudioBedKey, BedConfig> = {
  field:      { freq: 55,  detune: 8,  noiseCutoff: 380, noiseGain: 0.05,  droneGain: 0.08 },
  observe:    { freq: 49,  detune: 10, noiseCutoff: 520, noiseGain: 0.08,  droneGain: 0.09 },
  population: { freq: 65,  detune: 6,  noiseCutoff: 620, noiseGain: 0.06,  droneGain: 0.07 },
  archive:    { freq: 41,  detune: 4,  noiseCutoff: 260, noiseGain: 0.09,  droneGain: 0.06 },
  assembly:   { freq: 58,  detune: 3,  noiseCutoff: 320, noiseGain: 0.07,  droneGain: 0.09 },
  library:    { freq: 73,  detune: 14, noiseCutoff: 480, noiseGain: 0.05,  droneGain: 0.08, chimeEvery: 14 },
  dream:      { freq: 87,  detune: 22, noiseCutoff: 700, noiseGain: 0.06,  droneGain: 0.1,  chimeEvery: 9 },
  genesis:    { freq: 44,  detune: 2,  noiseCutoff: 200, noiseGain: 0.02,  droneGain: 0.04, heartbeat: true },
};

interface Bed {
  key: AudioBedKey;
  gain: GainNode;
  nodes: AudioNode[];
  intervals: number[];
}

function createNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  // Pinkish noise (simple approximation)
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.997 * b0 + 0.029591 * white;
    b1 = 0.985 * b1 + 0.032534 * white;
    b2 = 0.95 * b2 + 0.048056 * white;
    data[i] = (b0 + b1 + b2 + white * 0.1) * 0.22;
  }
  return buf;
}

function buildBed(ctx: AudioContext, cfg: BedConfig, noiseBuf: AudioBuffer, dest: AudioNode): Bed {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(dest);

  // Drone: two detuned sines through a slow LFO on gain
  const droneGain = ctx.createGain();
  droneGain.gain.value = cfg.droneGain;
  droneGain.connect(gain);

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = cfg.freq;
  osc1.connect(droneGain);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = cfg.freq * 1.5;
  osc2.detune.value = cfg.detune;
  osc2.connect(droneGain);

  // LFO on drone gain (breath)
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = cfg.droneGain * 0.4;
  lfo.connect(lfoGain).connect(droneGain.gain);

  // Noise bed
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const noiseFilt = ctx.createBiquadFilter();
  noiseFilt.type = "lowpass";
  noiseFilt.frequency.value = cfg.noiseCutoff;
  noiseFilt.Q.value = 0.4;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = cfg.noiseGain;
  noise.connect(noiseFilt).connect(noiseGain).connect(gain);

  osc1.start();
  osc2.start();
  lfo.start();
  noise.start();

  const intervals: number[] = [];

  // Soft chime for library/dream
  if (cfg.chimeEvery) {
    const chimeFn = () => {
      const t = ctx.currentTime;
      const chime = ctx.createOscillator();
      const cg = ctx.createGain();
      chime.type = "sine";
      const notes = [523.25, 659.25, 783.99, 987.77];
      chime.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      cg.gain.setValueAtTime(0, t);
      cg.gain.linearRampToValueAtTime(0.05, t + 0.1);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      chime.connect(cg).connect(gain);
      chime.start(t);
      chime.stop(t + 3.6);
    };
    intervals.push(window.setInterval(chimeFn, cfg.chimeEvery * 1000));
  }

  // Heartbeat for genesis
  if (cfg.heartbeat) {
    const beat = () => {
      const t = ctx.currentTime;
      const b = ctx.createOscillator();
      const bg = ctx.createGain();
      b.type = "sine";
      b.frequency.value = 62;
      bg.gain.setValueAtTime(0, t);
      bg.gain.linearRampToValueAtTime(0.14, t + 0.02);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      b.connect(bg).connect(gain);
      b.start(t);
      b.stop(t + 0.55);
    };
    intervals.push(window.setInterval(beat, 2200));
  }

  return {
    key: cfg as unknown as AudioBedKey, // reassigned by caller
    gain,
    nodes: [osc1, osc2, lfo, noise],
    intervals,
  };
}

function stopBed(ctx: AudioContext, bed: Bed) {
  const now = ctx.currentTime;
  bed.gain.gain.cancelScheduledValues(now);
  bed.gain.gain.setValueAtTime(bed.gain.gain.value, now);
  bed.gain.gain.linearRampToValueAtTime(0, now + 1.8);
  bed.intervals.forEach((i) => clearInterval(i));
  setTimeout(() => {
    bed.nodes.forEach((n) => {
      const src = n as OscillatorNode | AudioBufferSourceNode;
      try { src.stop?.(); } catch { /* noop */ }
      try { n.disconnect(); } catch { /* noop */ }
    });
    try { bed.gain.disconnect(); } catch { /* noop */ }
  }, 2000);
}

export function AmbientAudio() {
  const { audioEnabled, markAudioReady } = useWorld();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentDistrict = districtForPath(pathname);
  const targetBed = ATMOSPHERE[currentDistrict.id].bed;

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const bedRef = useRef<Bed | null>(null);

  // Establish graph on enable
  useEffect(() => {
    if (!audioEnabled) return;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
      noiseRef.current = createNoiseBuffer(ctx, 3);
      markAudioReady();
    }
    const ctx = ctxRef.current;
    const master = masterRef.current!;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.4, now + 2.4);
  }, [audioEnabled, markAudioReady]);

  // Fade master out when disabled
  useEffect(() => {
    if (audioEnabled) return;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.5);
  }, [audioEnabled]);

  // Swap beds on district change
  useEffect(() => {
    if (!audioEnabled) return;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    const noise = noiseRef.current;
    if (!ctx || !master || !noise) return;

    if (bedRef.current?.key === targetBed) return;
    const prev = bedRef.current;
    const cfg = BEDS[targetBed];
    const bed = buildBed(ctx, cfg, noise, master);
    bed.key = targetBed;
    const now = ctx.currentTime;
    bed.gain.gain.setValueAtTime(0, now);
    bed.gain.gain.linearRampToValueAtTime(1, now + 2.2);
    bedRef.current = bed;
    if (prev) stopBed(ctx, prev);
  }, [audioEnabled, targetBed]);

  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (bedRef.current && ctx) stopBed(ctx, bedRef.current);
      // Do not close the context; keep it warm for the session.
    };
  }, []);

  return null;
}
