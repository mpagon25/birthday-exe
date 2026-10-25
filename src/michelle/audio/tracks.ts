import { MusicPlayer, parse, type Track } from '../../shared/audio/sequencer';

// All original material, written for this project. Keys chosen for chiptune oscillators.
const mainMelA = parse('D5 1,F#5 1,A5 1,F#5 1,D5 1,"" 1,E5 1,F#5 1,G5 2,F#5 1,E5 1,D5 2,"" 2,A4 1,B4 1,D5 1,E5 1,F#5 2,E5 1,D5 1,B4 2,A4 2,"" 2');
const mainMelB = parse('A5 1,G5 1,F#5 1,E5 1,D5 2,F#5 2,G5 1,F#5 1,E5 1,D5 1,E5 2,"" 2,F#5 1,G5 1,A5 1,B5 1,A5 1,G5 1,F#5 1,E5 1,D5 4,"" 2');
const mainBass = parse('D2 0.5,D3 0.5,D2 0.5,D3 0.5,D2 0.5,D3 0.5,D2 0.5,D3 0.5,G2 0.5,G3 0.5,G2 0.5,G3 0.5,A2 0.5,A3 0.5,A2 0.5,A3 0.5,B2 0.5,B3 0.5,B2 0.5,B3 0.5,G2 0.5,G3 0.5,G2 0.5,G3 0.5,D2 0.5,D3 0.5,A2 0.5,A3 0.5,D2 0.5,D3 0.5,D2 0.5,D3 0.5');
const mainChords = parse('"" 8,D4 0.5,F#4 0.5,A4 0.5,F#4 0.5,G4 0.5,B4 0.5,D5 0.5,B4 0.5,A4 0.5,C#5 0.5,E5 0.5,C#5 0.5,B4 0.5,D5 0.5,F#5 0.5,D5 0.5,G4 0.5,B4 0.5,D5 0.5,B4 0.5,A4 0.5,C#5 0.5,E5 0.5,C#5 0.5,D4 0.5,F#4 0.5,A4 0.5,F#4 0.5,"" 2');

const metalRiff = parse('E2 0.5,E2 0.5,E2 0.5,G2 0.5,E2 0.5,E2 0.5,Bb2 0.5,A2 0.5,E2 0.5,E2 0.5,E2 0.5,G2 0.5,E2 0.5,C3 0.5,B2 0.5,"" 0.5,E2 0.25,E2 0.25,E2 0.25,E2 0.25,G2 0.5,E2 0.5,Bb2 0.5,A2 0.5,E2 0.5,E2 0.5,D3 0.5,C3 0.5,B2 0.5,G2 0.5,E2 1');
const metalLead = parse('"" 8,E4 0.5,"" 0.5,G4 0.5,"" 0.5,Bb4 0.5,A4 0.5,"" 1,E4 0.5,"" 0.5,G4 0.5,"" 0.5,D5 0.5,C5 0.5,B4 0.5,"" 0.5');
const metalDrum = parse('C1 0.5,"" 0.5,C1 0.5,"" 0.5,C1 0.5,"" 0.5,C1 0.5,"" 0.5,C1 0.5,"" 0.5,C1 0.5,"" 0.5,C1 0.5,C1 0.5,C1 0.5,"" 0.5');

const arcadeMel = parse('C5 0.5,E5 0.5,G5 0.5,C6 0.5,G5 0.5,E5 0.5,C5 0.5,"" 0.5,A4 0.5,C5 0.5,E5 0.5,A5 0.5,E5 0.5,C5 0.5,A4 0.5,"" 0.5,F4 0.5,A4 0.5,C5 0.5,F5 0.5,G4 0.5,B4 0.5,D5 0.5,G5 0.5,C5 0.5,E5 0.5,G5 0.5,C6 0.5,"" 2');
const arcadeBass = parse('C2 1,C2 1,C2 1,C2 1,A1 1,A1 1,A1 1,A1 1,F1 1,F1 1,G1 1,G1 1,C2 1,C2 1,G1 1,"" 1');

const victoryMel = parse('G4 0.5,G4 0.5,A4 1,G4 1,C5 1,B4 2,G4 0.5,G4 0.5,A4 1,G4 1,D5 1,C5 2,G4 0.5,G4 0.5,G5 1,E5 1,C5 1,B4 1,A4 1,F5 0.5,F5 0.5,E5 1,C5 1,D5 1,C5 2,"" 1,C5 0.5,E5 0.5,G5 0.5,C6 2,"" 2');
const victoryBass = parse('C3 2,C3 2,G2 2,C3 2,C3 2,C3 2,F2 2,C3 2,C3 2,E2 2,F2 2,G2 2,C3 2,G2 2,C3 4,"" 2');

const concertRiff = parse('E2 0.5,E2 0.5,G2 0.5,E2 0.5,Bb2 0.5,A2 0.5,E2 0.5,E2 0.5,E2 0.5,E2 0.5,G2 0.5,E2 0.5,D3 0.5,C3 0.5,B2 0.5,E2 1');
const concertMeow = parse('"" 2,E5 0.25,G5 0.25,"" 1.5,E5 0.25,G5 0.25,"" 1.5,B5 0.25,A5 0.25,"" 2.5');

export const M_TRACKS: Track[] = [
  {
    id: 'main',
    title: 'Pub Quest Theme',
    bpm: 168,
    unit: 1,
    voices: [
      { type: 'square', gain: 0.09, pattern: [...mainMelA, ...mainMelB] },
      { type: 'triangle', gain: 0.1, pattern: mainChords },
      { type: 'sawtooth', gain: 0.07, pattern: mainBass },
    ],
  },
  {
    id: 'metal',
    title: 'BLEGH! (Chiptune Breakdown)',
    bpm: 190,
    unit: 1,
    voices: [
      { type: 'sawtooth', gain: 0.16, pattern: metalRiff },
      { type: 'square', gain: 0.07, pattern: metalRiff, octave: 1 },
      { type: 'square', gain: 0.08, pattern: metalLead },
      { type: 'triangle', gain: 0.2, pattern: metalDrum },
    ],
  },
  {
    id: 'arcade',
    title: 'Bug Hunter Arcade',
    bpm: 230,
    unit: 1,
    voices: [
      { type: 'square', gain: 0.09, pattern: arcadeMel },
      { type: 'triangle', gain: 0.14, pattern: arcadeBass },
    ],
  },
  {
    id: 'victory',
    title: 'Level 33 Victory',
    bpm: 160,
    unit: 1,
    once: true,
    voices: [
      { type: 'square', gain: 0.12, pattern: victoryMel },
      { type: 'triangle', gain: 0.14, pattern: victoryBass },
      { type: 'sawtooth', gain: 0.04, pattern: victoryBass, octave: 1 },
    ],
  },
  {
    id: 'concert',
    title: 'Cat Concert',
    bpm: 200,
    unit: 1,
    once: true,
    voices: [
      { type: 'sawtooth', gain: 0.16, pattern: concertRiff },
      { type: 'triangle', gain: 0.12, pattern: concertMeow },
    ],
  },
];

export const mMusic = new MusicPlayer(M_TRACKS);
