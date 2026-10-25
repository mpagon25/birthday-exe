import { MusicPlayer, parse, type Track } from '../../shared/audio/sequencer';


// A short original jig in D (6/8), written for this project.
const jigA = 'D4 1,F#4 1,A4 1,D5 1,A4 1,F#4 1,G4 1,B4 1,D5 1,G5 1,D5 1,B4 1,A4 1,F#4 1,D4 1,A4 1,F#4 1,D4 1,E4 1,G4 1,B4 1,E5 2,E4 1';
const jigB = 'F#5 1,E5 1,D5 1,F#5 1,E5 1,D5 1,G5 1,F#5 1,E5 1,G5 1,F#5 1,E5 1,A5 1,G5 1,F#5 1,E5 1,D5 1,C#5 1,D5 2,A4 1,D5 2,"" 1';
const jigBass = 'D3 3,D3 3,G3 3,G3 3,D3 3,A2 3,E3 3,E3 3';
const jigBassB = 'D3 3,D3 3,G3 3,G3 3,A3 3,A3 3,D3 3,D3 3';

const birthdayMel = parse('G4 1,G4 1,A4 2,G4 2,C5 2,B4 4,G4 1,G4 1,A4 2,G4 2,D5 2,C5 4,G4 1,G4 1,G5 2,E5 2,C5 2,B4 2,A4 2,F5 1,F5 1,E5 2,C5 2,D5 2,C5 4,"" 2');
const birthdayBass = parse('"" 2,C3 6,G3 6,C3 6,C3 6,F3 6,C3 6,G3 6,C3 6,"" 2');

const tavernMel = parse('E4 1,"" 1,G4 1,A4 1,B4 2,A4 1,G4 1,E4 2,D4 1,E4 1,G4 2,"" 2,E4 1,"" 1,G4 1,A4 1,B4 1,D5 1,B4 1,A4 1,G4 2,A4 1,G4 1,E4 4');
const tavernBass = parse('E2 1,E3 1,E2 1,E3 1,G2 1,G3 1,G2 1,G3 1,D2 1,D3 1,D2 1,D3 1,A2 1,A3 1,A2 1,A3 1,E2 1,E3 1,E2 1,E3 1,G2 1,G3 1,G2 1,G3 1,D2 1,D3 1,D2 1,D3 1,E2 1,E3 1,E2 1,E3 1');
const tavernArp = parse('"" 8,E5 0.5,G5 0.5,B5 0.5,G5 0.5,E5 0.5,G5 0.5,B5 0.5,G5 0.5,D5 0.5,F#5 0.5,A5 0.5,F#5 0.5,A5 0.5,C#6 0.5,E6 0.5,C#6 0.5,"" 8,E5 0.5,G5 0.5,B5 0.5,E6 0.5,B5 0.5,G5 0.5,E5 0.5,"" 0.5,"" 4');

export const TRACKS: Track[] = [
  {
    id: 'jig',
    title: 'Whiskey in the Code (Jig)',
    bpm: 300,
    unit: 1,
    voices: [
      { type: 'square', gain: 0.12, pattern: [...parse(jigA), ...parse(jigA), ...parse(jigB), ...parse(jigB)] },
      { type: 'triangle', gain: 0.16, pattern: [...parse(jigBass), ...parse(jigBass), ...parse(jigBassB), ...parse(jigBassB)] },
    ],
  },
  {
    id: 'birthday',
    title: 'Happy Level 35 (8-bit)',
    bpm: 150,
    unit: 1,
    voices: [
      { type: 'square', gain: 0.12, pattern: birthdayMel },
      { type: 'triangle', gain: 0.16, pattern: birthdayBass },
    ],
  },
  {
    id: 'tavern',
    title: 'Tavern Loop (Chiptune)',
    bpm: 200,
    unit: 1,
    voices: [
      { type: 'square', gain: 0.1, pattern: tavernMel },
      { type: 'triangle', gain: 0.18, pattern: tavernBass },
      { type: 'sawtooth', gain: 0.04, pattern: tavernArp },
    ],
  },
];

export const music = new MusicPlayer(TRACKS);
