/**
 * Roll the Night — Web Audio API Synthesizer
 * Pure zero-dependency procedural audio for authentic lottery arcade excitement.
 * Features realistic air-flow vortex and stereo ball-rattling collisions during shuffle.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.mixingSource = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMixing();
    }
    return this.isMuted;
  }

  stopMixing() {
    if (this.mixingSource) {
      try {
        this.mixingSource.stop();
      } catch {
        // already stopped
      }
      this.mixingSource = null;
    }
  }

  // 1. Air Vortex + Ball Rattling Shuffling Sound
  playMixing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    this.stopMixing();

    try {
      const sampleRate = this.ctx.sampleRate;
      const duration = 3.3; // 3.2s mixing phase + 0.1s tail
      const totalSamples = Math.floor(sampleRate * duration);

      const audioBuffer = this.ctx.createBuffer(2, totalSamples, sampleRate);
      const left = audioBuffer.getChannelData(0);
      const right = audioBuffer.getChannelData(1);

      // --- Layer A: Air Stream Vortex ---
      let lastNoiseL = 0;
      let lastNoiseR = 0;

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;

        // Air velocity envelope: swells up to 0.7s, peaks, softens after 2.7s
        let airEnv = 0;
        if (t < 0.7) {
          airEnv = (t / 0.7) * 0.14;
        } else if (t < 2.7) {
          // Subtle rhythmic vortex breathing (3.5Hz)
          airEnv = 0.14 + 0.03 * Math.sin(t * 3.5 * Math.PI * 2);
        } else {
          airEnv = Math.max(0, 0.14 * (1 - (t - 2.7) / 0.6));
        }

        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;

        // Two-stage smoothed pink/bandpass noise simulation
        lastNoiseL = lastNoiseL * 0.82 + whiteL * 0.18;
        lastNoiseR = lastNoiseR * 0.82 + whiteR * 0.18;

        left[i] += lastNoiseL * airEnv * 0.75;
        right[i] += lastNoiseR * airEnv * 0.75;
      }

      // --- Layer B: Plastic & Acrylic Ball Collisions (Rattling Clatter) ---
      // Generate ~90 micro-clacks distributed across the 3.2s agitation
      const numClicks = 92;

      for (let c = 0; c < numClicks; c++) {
        // Density curve: sparse at start, very dense during peak air (0.7s - 2.6s), slows at end
        // Map c through a custom timing curve
        const progress = c / numClicks;
        let t;
        if (progress < 0.2) {
          t = 0.1 + progress * 3.0; // 0.1s to 0.7s
        } else if (progress < 0.85) {
          t = 0.7 + ((progress - 0.2) / 0.65) * 1.95; // 0.7s to 2.65s (dense peak)
        } else {
          t = 2.65 + ((progress - 0.85) / 0.15) * 0.55; // 2.65s to 3.2s (settling down)
        }

        // Add slight timing jitter
        t += (Math.random() - 0.5) * 0.04;
        if (t < 0.05 || t > 3.25) continue;

        const startSample = Math.floor(t * sampleRate);

        // Acoustic properties of hollow ping-pong / lottery balls
        // Primary resonance: 900Hz - 2200Hz
        const freq1 = 950 + Math.random() * 1150;
        const freq2 = freq1 * (1.6 + Math.random() * 0.4); // Overharmonic shell mode
        const decay = 0.012 + Math.random() * 0.016; // 12ms - 28ms fast decay
        const pan = Math.random(); // 0 (left) to 1 (right) stereo position
        const amp = 0.18 + Math.random() * 0.32; // Random strike force

        const clickSamples = Math.floor(decay * 4 * sampleRate);

        for (let j = 0; j < clickSamples && (startSample + j) < totalSamples; j++) {
          const dt = j / sampleRate;
          const clickEnv = Math.exp(-dt / decay);

          // Hard transient contact click
          const snap = dt < 0.0018 ? (Math.random() * 2 - 1) * 0.35 : 0;

          // Hollow ball shell ringing
          const shellTone = Math.sin(2 * Math.PI * freq1 * dt) * 0.75 + Math.sin(2 * Math.PI * freq2 * dt) * 0.25;
          const sampleVal = (shellTone * 0.85 + snap) * clickEnv * amp;

          left[startSample + j] += sampleVal * (1 - pan);
          right[startSample + j] += sampleVal * pan;
        }
      }

      // Headroom check to avoid clipping
      let peak = 0;
      for (let i = 0; i < totalSamples; i++) {
        peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
      }
      if (peak > 0.95) {
        const normFactor = 0.95 / peak;
        for (let i = 0; i < totalSamples; i++) {
          left[i] *= normFactor;
          right[i] *= normFactor;
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      source.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      source.start();
      this.mixingSource = source;

      source.onended = () => {
        if (this.mixingSource === source) {
          this.mixingSource = null;
        }
      };
    } catch {
      // Audio fallback silent
    }
  }

  // 2. Ball Floats & Glows Up
  playFloatAscend() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + idx * 0.1 + 0.25);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // 3. Pokeball Split Pop / Release
  playBallSplit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Punchy mechanical snap
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Energy release whoosh
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.28);

      gain2.gain.setValueAtTime(0.15, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.38);
    } catch {
      // Audio fallback silent
    }
  }

  // 4. Triumph Fanfare & Sparkles
  playRevealFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Major triad fanfare: G4 -> C5 -> E5 -> G5
      const fanfare = [
        { freq: 392.0, time: 0, dur: 0.15 },
        { freq: 523.25, time: 0.12, dur: 0.15 },
        { freq: 659.25, time: 0.24, dur: 0.18 },
        { freq: 783.99, time: 0.38, dur: 0.6 },
        { freq: 1046.5, time: 0.42, dur: 0.7 },
      ];

      fanfare.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0, now + n.time);
        gain.gain.linearRampToValueAtTime(0.14, now + n.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });

      // Sparkle shimmer bells
      const bells = [1200, 1500, 1800, 2200, 2600];
      bells.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + 0.4 + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // 5. Ball Snap Shut Click
  playSnapShut() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.07);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback silent
    }
  }

  // 6. Ball Settles into Tray
  playTraySettle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio fallback silent
    }
  }
}

export const sound = new SoundEngine();
