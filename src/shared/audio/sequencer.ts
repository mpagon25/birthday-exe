import { engine } from './engine';

export interface Voice {
  type: OscillatorType;
  gain: number;
  pattern: Array<[string, number]>;
  octave?: number;
}

export interface Track {
  id: string;
  title: string;
  bpm: number;
  /** Beat unit in quarter notes; patterns use [note, lengthInUnits]. '' = rest. */
  unit: number;
  voices: Voice[];
  /** Stop after one pass instead of looping. */
  once?: boolean;
}

const NOTE_INDEX: Record<string, number> = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };

export function noteToFreq(note: string, octaveShift = 0): number {
  const m = /^([A-G][#b]?)(\d)$/.exec(note);
  if (!m) return 0;
  const semis = NOTE_INDEX[m[1]] + (parseInt(m[2], 10) + octaveShift + 1) * 12;
  return 440 * Math.pow(2, (semis - 69) / 12);
}

/** "C4 1,D4 0.5,"" 2" -> [[note, len], ...] */
export function parse(p: string): Array<[string, number]> {
  return p.split(',').map((tok) => {
    const [n, l] = tok.trim().split(' ');
    return [n.replace(/"/g, ''), parseFloat(l)];
  });
}

export type NoteListener = (voice: number, freq: number) => void;

/** Lookahead scheduler for looping chiptune tracks. */
export class MusicPlayer {
  private timer: number | null = null;
  private trackIndex = 0;
  private positions: number[] = [];
  private nextTimes: number[] = [];
  private passes: number[] = [];
  private listeners = new Set<NoteListener>();
  private _playing = false;
  private gain: GainNode | null = null;
  private onEnd: (() => void) | null = null;

  constructor(private readonly tracks: Track[]) {}

  get playing(): boolean {
    return this._playing;
  }
  get track(): Track {
    return this.tracks[this.trackIndex];
  }
  get index(): number {
    return this.trackIndex;
  }
  get list(): Track[] {
    return this.tracks;
  }

  onNote(fn: NoteListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  select(index: number): void {
    const wasPlaying = this._playing;
    this.stop();
    this.trackIndex = ((index % this.tracks.length) + this.tracks.length) % this.tracks.length;
    if (wasPlaying) this.play();
  }

  selectById(id: string): void {
    const i = this.tracks.findIndex((t) => t.id === id);
    if (i >= 0) this.select(i);
  }

  /** Play a track by id; `onEnd` fires when a `once` track finishes. */
  playTrack(id: string, onEnd?: () => void): void {
    this.stop();
    const i = this.tracks.findIndex((t) => t.id === id);
    if (i >= 0) this.trackIndex = i;
    this.onEnd = onEnd ?? null;
    this.play();
  }

  play(): void {
    const ctx = engine.context;
    const out = engine.musicOut;
    if (!ctx || !out) return;
    if (this._playing) return;
    this._playing = true;
    this.gain = ctx.createGain();
    this.gain.connect(out);
    const start = ctx.currentTime + 0.1;
    this.positions = this.track.voices.map(() => 0);
    this.nextTimes = this.track.voices.map(() => start);
    this.passes = this.track.voices.map(() => 0);
    this.timer = window.setInterval(() => this.schedule(), 40);
    this.schedule();
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this._playing = false;
    this.onEnd = null;
    if (this.gain && engine.context) {
      const g = this.gain;
      g.gain.setTargetAtTime(0, engine.context.currentTime, 0.05);
      window.setTimeout(() => g.disconnect(), 300);
    }
    this.gain = null;
  }

  private schedule(): void {
    const ctx = engine.context;
    if (!ctx || !this.gain) return;
    const secPerUnit = (60 / this.track.bpm) * this.track.unit;
    const horizon = ctx.currentTime + 0.25;
    let finished = false;
    this.track.voices.forEach((voice, vi) => {
      while (this.nextTimes[vi] < horizon) {
        if (this.track.once && this.passes[vi] > 0) {
          this.nextTimes[vi] = Infinity;
          break;
        }
        const [note, len] = voice.pattern[this.positions[vi]];
        const dur = len * secPerUnit;
        if (note) {
          const freq = noteToFreq(note, voice.octave ?? 0);
          this.playNote(voice, freq, this.nextTimes[vi], dur);
          const when = Math.max(0, (this.nextTimes[vi] - ctx.currentTime) * 1000);
          window.setTimeout(() => this.listeners.forEach((l) => l(vi, freq)), when);
        }
        this.nextTimes[vi] += dur;
        this.positions[vi] = (this.positions[vi] + 1) % voice.pattern.length;
        if (this.positions[vi] === 0) this.passes[vi] += 1;
      }
    });
    if (this.track.once && this.nextTimes.every((t) => t === Infinity)) finished = true;
    if (finished) {
      const cb = this.onEnd;
      this.stop();
      cb?.();
    }
  }

  private playNote(voice: Voice, freq: number, start: number, dur: number): void {
    const ctx = engine.context;
    if (!ctx || !this.gain) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = voice.type;
    osc.frequency.value = freq;
    const sustain = Math.max(0.03, dur * 0.85);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(voice.gain, start + 0.008);
    g.gain.setValueAtTime(voice.gain, start + sustain * 0.6);
    g.gain.linearRampToValueAtTime(0, start + sustain);
    osc.connect(g).connect(this.gain);
    osc.start(start);
    osc.stop(start + sustain + 0.02);
  }
}
