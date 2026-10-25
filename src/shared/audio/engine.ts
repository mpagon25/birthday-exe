/**
 * All sounds are synthesised with the Web Audio API. No audio files, no licences.
 */
export type SoundName =
  | 'click'
  | 'open'
  | 'close'
  | 'error'
  | 'warn'
  | 'info'
  | 'xp'
  | 'achievement'
  | 'clink'
  | 'pour'
  | 'dice'
  | 'gameover'
  | 'confetti'
  | 'fanfare'
  | 'birthday'
  | 'boot'
  | 'step'
  | 'glitch'
  | 'levelup'
  | 'snore'
  | 'moo'
  | 'bubble'
  | 'firework'
  | 'tick'
  | 'meow'
  | 'coin'
  | 'hover'
  | 'explosion'
  | 'combo'
  | 'sloth'
  | 'arcade'
  | 'hurt'
  | 'squish'
  | 'whoosh'
  | 'countdown'
  | 'metalhit'
  | 'splash'
  | 'purr';

type Wave = OscillatorType;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private _volume = 0.7;
  private _musicVolume = 0.5;
  private _muted = false;

  get context(): AudioContext | null {
    return this.ctx;
  }

  get unlocked(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  /** Must be called from a user gesture. */
  unlock(): void {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.sfx = this.ctx.createGain();
      this.sfx.connect(this.master);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this._musicVolume;
      this.musicBus.connect(this.master);
      this.applyGain();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  suspend(): void {
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend();
  }
  resume(): void {
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
  }

  get volume(): number {
    return this._volume;
  }
  set volume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    this.applyGain();
  }
  get muted(): boolean {
    return this._muted;
  }
  set muted(m: boolean) {
    this._muted = m;
    this.applyGain();
  }
  private applyGain(): void {
    if (!this.master || !this.ctx) return;
    const target = this._muted ? 0 : this._volume * this._volume;
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.02);
  }

  get musicOut(): GainNode | null {
    return this.musicBus;
  }
  get musicVolume(): number {
    return this._musicVolume;
  }
  set musicVolume(v: number) {
    this._musicVolume = Math.max(0, Math.min(1, v));
    if (this.musicBus && this.ctx) this.musicBus.gain.setTargetAtTime(this._musicVolume, this.ctx.currentTime, 0.02);
  }

  // ---------- primitives ----------
  private tone(freq: number, start: number, dur: number, opts: { type?: Wave; gain?: number; attack?: number; release?: number; slide?: number; out?: AudioNode } = {}): void {
    if (!this.ctx || !this.sfx) return;
    const { type = 'square', gain = 0.2, attack = 0.005, release = 0.05, slide, out = this.sfx } = opts;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slide), start + dur);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + attack);
    g.gain.setValueAtTime(gain, Math.max(start + attack, start + dur - release));
    g.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(g).connect(out);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  private noise(start: number, dur: number, opts: { gain?: number; filter?: number; filterEnd?: number; q?: number; type?: BiquadFilterType } = {}): void {
    if (!this.ctx || !this.sfx) return;
    const { gain = 0.2, filter = 2000, filterEnd, q = 1, type = 'lowpass' } = opts;
    const src = this.ctx.createBufferSource();
    src.buffer = this.getNoise();
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(filter, start);
    if (filterEnd) f.frequency.exponentialRampToValueAtTime(filterEnd, start + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(f).connect(g).connect(this.sfx);
    src.start(start);
    src.stop(start + dur + 0.05);
  }

  private getNoise(): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noiseBuffer = buf;
    return buf;
  }

  private seq(notes: Array<[number, number]>, start: number, step: number, opts: Parameters<AudioEngine['tone']>[3] = {}): void {
    let t = start;
    for (const [freq, len] of notes) {
      if (freq > 0) this.tone(freq, t, step * len * 0.95, opts);
      t += step * len;
    }
  }

  play(name: SoundName): void {
    if (!this.ctx || this._muted) return;
    if (this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime + 0.01;
    switch (name) {
      case 'click':
        this.tone(1200, t, 0.03, { type: 'square', gain: 0.08 });
        break;
      case 'tick':
        this.tone(2000, t, 0.015, { type: 'square', gain: 0.05 });
        break;
      case 'open':
        this.tone(523, t, 0.08, { type: 'triangle', gain: 0.18 });
        this.tone(784, t + 0.07, 0.12, { type: 'triangle', gain: 0.18 });
        break;
      case 'close':
        this.tone(784, t, 0.08, { type: 'triangle', gain: 0.15 });
        this.tone(523, t + 0.07, 0.12, { type: 'triangle', gain: 0.15 });
        break;
      case 'info':
        this.tone(880, t, 0.18, { type: 'sine', gain: 0.25 });
        this.tone(1320, t, 0.3, { type: 'sine', gain: 0.12 });
        break;
      case 'warn':
        this.tone(660, t, 0.12, { type: 'triangle', gain: 0.25 });
        this.tone(660, t + 0.16, 0.2, { type: 'triangle', gain: 0.25 });
        break;
      case 'error':
        this.tone(220, t, 0.25, { type: 'sawtooth', gain: 0.18 });
        this.tone(164, t, 0.25, { type: 'square', gain: 0.12 });
        this.tone(110, t + 0.25, 0.35, { type: 'sawtooth', gain: 0.2 });
        break;
      case 'xp':
        this.seq([[523, 1], [659, 1], [784, 1], [1047, 2]], t, 0.07, { type: 'square', gain: 0.12 });
        break;
      case 'levelup':
        this.seq([[392, 1], [523, 1], [659, 1], [784, 1], [1047, 3], [784, 1], [1047, 4]], t, 0.09, { type: 'square', gain: 0.14 });
        this.seq([[196, 2], [262, 2], [330, 2], [392, 6]], t, 0.09, { type: 'triangle', gain: 0.14 });
        break;
      case 'achievement':
        this.seq([[659, 1], [784, 1], [1319, 2], [1047, 1], [1319, 3]], t, 0.09, { type: 'square', gain: 0.13 });
        this.noise(t + 0.3, 0.5, { gain: 0.05, filter: 8000, type: 'highpass' });
        break;
      case 'clink':
        this.tone(2637, t, 0.5, { type: 'sine', gain: 0.18, release: 0.45 });
        this.tone(4186, t, 0.35, { type: 'sine', gain: 0.1, release: 0.3 });
        this.tone(5274, t, 0.2, { type: 'triangle', gain: 0.05, release: 0.18 });
        this.noise(t, 0.04, { gain: 0.1, filter: 6000, type: 'highpass' });
        break;
      case 'pour':
        this.noise(t, 1.4, { gain: 0.22, filter: 400, filterEnd: 2400, q: 2 });
        for (let i = 0; i < 9; i++) {
          this.tone(600 + Math.random() * 900, t + 0.2 + i * 0.13, 0.05, { type: 'sine', gain: 0.05, slide: 1600 });
        }
        break;
      case 'bubble':
        this.tone(500 + Math.random() * 400, t, 0.07, { type: 'sine', gain: 0.08, slide: 1400 });
        break;
      case 'dice':
        for (let i = 0; i < 9; i++) {
          const dt = i * i * 0.012 + i * 0.03;
          this.noise(t + dt, 0.03, { gain: 0.18, filter: 1800 + Math.random() * 1500, q: 4, type: 'bandpass' });
          this.tone(300 + Math.random() * 300, t + dt, 0.02, { type: 'square', gain: 0.05 });
        }
        break;
      case 'gameover':
        this.seq([[392, 2], [370, 2], [349, 2], [330, 5]], t, 0.14, { type: 'square', gain: 0.14 });
        this.seq([[196, 2], [185, 2], [175, 2], [165, 5]], t, 0.14, { type: 'triangle', gain: 0.12 });
        break;
      case 'confetti':
        this.noise(t, 0.25, { gain: 0.25, filter: 3000, filterEnd: 300 });
        this.tone(200, t, 0.12, { type: 'sine', gain: 0.3, slide: 60 });
        for (let i = 0; i < 6; i++) this.tone(1500 + i * 400, t + 0.05 + i * 0.04, 0.1, { type: 'sine', gain: 0.05 });
        break;
      case 'firework':
        this.tone(300, t, 0.5, { type: 'sine', gain: 0.1, slide: 1200 });
        this.noise(t + 0.5, 0.6, { gain: 0.3, filter: 4000, filterEnd: 200 });
        this.tone(150, t + 0.5, 0.3, { type: 'sine', gain: 0.3, slide: 40 });
        break;
      case 'fanfare':
        this.seq([[523, 1], [523, 1], [523, 1], [659, 3], [523, 2], [659, 2], [784, 6]], t, 0.11, { type: 'square', gain: 0.14 });
        this.seq([[262, 3], [330, 3], [392, 4], [523, 6]], t, 0.11, { type: 'triangle', gain: 0.14 });
        this.seq([[131, 6], [165, 4], [196, 6]], t, 0.11, { type: 'sawtooth', gain: 0.08 });
        break;
      case 'birthday': {
        // Happy Birthday (public domain melody), 8-bit arrangement.
        const n = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
        const mel: Array<[number, number]> = [
          [n.G4, 1], [n.G4, 1], [n.A4, 2], [n.G4, 2], [n.C5, 2], [n.B4, 4],
          [n.G4, 1], [n.G4, 1], [n.A4, 2], [n.G4, 2], [n.D5, 2], [n.C5, 4],
          [n.G4, 1], [n.G4, 1], [n.G5, 2], [n.E5, 2], [n.C5, 2], [n.B4, 2], [n.A4, 2],
          [n.F5, 1], [n.F5, 1], [n.E5, 2], [n.C5, 2], [n.D5, 2], [n.C5, 4],
        ];
        this.seq(mel, t, 0.16, { type: 'square', gain: 0.12 });
        const bass: Array<[number, number]> = [
          [0, 2], [131, 6], [196, 6], [131, 6], [131, 6], [175, 6], [131, 6], [196, 6], [131, 6],
        ];
        this.seq(bass, t, 0.16, { type: 'triangle', gain: 0.14 });
        break;
      }
      case 'boot':
        [261.6, 329.6, 392, 523.3].forEach((f, i) => this.tone(f, t + i * 0.12, 1.6 - i * 0.1, { type: 'sine', gain: 0.12, attack: 0.3, release: 0.9 }));
        this.tone(1046.5, t + 0.6, 1.2, { type: 'triangle', gain: 0.05, attack: 0.4, release: 0.6 });
        break;
      case 'step':
        this.noise(t, 0.03, { gain: 0.08, filter: 900, q: 3, type: 'bandpass' });
        break;
      case 'glitch':
        for (let i = 0; i < 12; i++) {
          this.tone(100 + Math.random() * 2000, t + i * 0.05, 0.04, { type: i % 2 ? 'sawtooth' : 'square', gain: 0.07 });
        }
        this.noise(t, 0.6, { gain: 0.08, filter: 1200, filterEnd: 6000, type: 'highpass' });
        break;
      case 'snore':
        this.tone(90, t, 0.5, { type: 'sawtooth', gain: 0.05, slide: 70, attack: 0.2, release: 0.25 });
        break;
      case 'moo':
        this.tone(180, t, 0.6, { type: 'sawtooth', gain: 0.08, slide: 120, attack: 0.08, release: 0.3 });
        this.tone(362, t, 0.6, { type: 'triangle', gain: 0.04, slide: 240, attack: 0.08, release: 0.3 });
        break;
      case 'meow': {
        const base = 600 + Math.random() * 300;
        this.tone(base, t, 0.09, { type: 'triangle', gain: 0.12, slide: base * 1.6, attack: 0.01 });
        this.tone(base * 1.6, t + 0.09, 0.22, { type: 'triangle', gain: 0.12, slide: base * 0.9, release: 0.15 });
        break;
      }
      case 'purr':
        for (let i = 0; i < 10; i++) this.tone(55, t + i * 0.06, 0.04, { type: 'sawtooth', gain: 0.04 });
        break;
      case 'coin':
        this.tone(988, t, 0.08, { type: 'square', gain: 0.12 });
        this.tone(1319, t + 0.08, 0.3, { type: 'square', gain: 0.12, release: 0.25 });
        break;
      case 'hover':
        this.tone(1500, t, 0.02, { type: 'square', gain: 0.03 });
        break;
      case 'explosion':
        this.noise(t, 0.6, { gain: 0.35, filter: 2500, filterEnd: 120 });
        this.tone(120, t, 0.4, { type: 'sine', gain: 0.35, slide: 30 });
        break;
      case 'combo':
        this.seq([[659, 1], [784, 1], [988, 1], [1319, 2]], t, 0.06, { type: 'square', gain: 0.12 });
        break;
      case 'sloth':
        this.tone(220, t, 0.9, { type: 'sine', gain: 0.1, slide: 160, attack: 0.3, release: 0.5 });
        break;
      case 'arcade':
        this.seq([[262, 1], [330, 1], [392, 1], [523, 1], [659, 1], [784, 1], [1047, 3]], t, 0.07, { type: 'square', gain: 0.14 });
        this.noise(t + 0.5, 0.3, { gain: 0.08, filter: 6000, type: 'highpass' });
        break;
      case 'hurt':
        this.tone(300, t, 0.18, { type: 'sawtooth', gain: 0.15, slide: 90 });
        break;
      case 'squish':
        this.tone(500, t, 0.08, { type: 'square', gain: 0.12, slide: 120 });
        this.noise(t, 0.08, { gain: 0.15, filter: 900, q: 2, type: 'bandpass' });
        break;
      case 'whoosh':
        this.noise(t, 0.4, { gain: 0.15, filter: 300, filterEnd: 4000, type: 'bandpass', q: 1.5 });
        break;
      case 'countdown':
        this.tone(880, t, 0.25, { type: 'square', gain: 0.18 });
        break;
      case 'metalhit':
        this.noise(t, 0.12, { gain: 0.3, filter: 3000, filterEnd: 200 });
        this.tone(82, t, 0.25, { type: 'sawtooth', gain: 0.2, slide: 41 });
        this.tone(123, t, 0.25, { type: 'square', gain: 0.1, slide: 62 });
        break;
      case 'splash':
        this.noise(t, 0.5, { gain: 0.2, filter: 1200, filterEnd: 400 });
        for (let i = 0; i < 5; i++) this.tone(400 + Math.random() * 600, t + 0.1 + i * 0.08, 0.06, { type: 'sine', gain: 0.06, slide: 1500 });
        break;
      default:
        break;
    }
  }
}

export const engine = new AudioEngine();
