/** Pixel sprites as text grids. Palette letters shared; '.' is transparent. */
export const SPRITE_PALETTE: Record<string, string> = {
  k: '#0a0a0a',
  w: '#ffffff',
  p: '#ff3fa4',
  P: '#ff7fc3',
  g: '#f2c14e',
  G: '#c58f1f',
  r: '#d62828',
  b: '#6b4423',
  B: '#3b2410',
  t: '#c9a06b',
  n: '#1f7a2e',
  N: '#4cd964',
  s: '#7a7a7a',
  S: '#bdbdbd',
  u: '#1e63c8',
  U: '#6fb1ff',
  o: '#ff8c42',
  y: '#ffe066',
  e: '#f2c9a0',
  c: '#2a2a2a',
  m: '#8e3bd6',
};

export interface SpriteDef {
  rows: string[];
  palette?: Record<string, string>;
}

export const SPRITES: Record<string, SpriteDef> = {
  heart: { rows: ['.pp..pp.', 'pPPppPPp', 'pPPPPPPp', 'pPPPPPPp', '.pPPPPp.', '..pPPp..', '...pp...', '........'] },
  heartSmall: { rows: ['.p.p.', 'ppppp', 'ppppp', '.ppp.', '..p..'] },
  star: { rows: ['...p...', '...p...', '.ppppp.', '..ppp..', '.pp.pp.', '.......', '.......'] },
  note: { rows: ['....kk..', '....kkk.', '....k.k.', '....k...', '....k...', '..kkk...', '.kkkk...', '..kk....'] },
  horns: {
    rows: [
      '..k.........k...', '.kek.......kek..', '.kek.......kek..', '.kek..kkkk.kek..', '.kek.kekekkkek..', '.kek.kekekekek..', '.keekkeeeeeeek..', '.keeeeeeeeeeek..',
      '..keeeeeeeeek...', '..keeeeeeeeek...', '...keeeeeeek....', '...kcccccccck...', '...kcccccccck...', '...kkkkkkkkk....',
    ],
  },
  exclaim: { rows: ['.pppp.', 'pPPPPp', 'pPPPPp', 'pPPPPp', '.pPPp.', '.pPPp.', '.pPPp.', '..pp..', '......', '.pPPp.', '.pPPp.', '..pp..'] },
  bugA: {
    rows: ['..k......k..', '...k....k...', '..kkkkkkkk..', '.kccccccccck', 'kcckcccckcck', 'kccccccccck.', '.kccccccccck', 'kcckcccckcck', '.kkcccccckk.', '..kkkkkkkk..', '.k..k..k..k.', 'k...k..k...k'],
  },
  bugCat: {
    rows: ['.pk......kp.', 'pPk......kPp', '..kkkkkkkk..', '.kccccccccck', 'kccpccccpcck', 'kccccccccck.', '.kccccccccck', 'kcckcccckcck', '.kkcccccckk.', '..kkkkkkkk..', '.k..k..k..k.', 'k...k..k...k'],
  },
  catWalk1: {
    rows: ['.kk...kk........', '.kck.kck........', '.kcccccck.......', '.kcwccwck.......', '.kcccccckkkkkkk.', '..kcccccccccccck', '..kcccccccccccck', '..kcccccccccccck', '...kcckcckcckcc.', '...kk..kk.kk.k..'],
  },
  catWalk2: {
    rows: ['.kk...kk........', '.kck.kck........', '.kcccccck.......', '.kcwccwck.......', '.kcccccckkkkkkk.', '..kccccccccccccc', '..kcccccccccccck', '..kcccccccccccck', '...kcc.kcc.kcc..', '..kk..kk....kk..'],
  },
  batA: { rows: ['k......k', 'kk....kk', 'kkk..kkk', 'kkkkkkkk', '.kkkkkk.', '..kkkk..', '...kk...', '........'] },
  batB: { rows: ['........', '........', 'kk....kk', 'kkkkkkkk', 'kkkkkkkk', '..kkkk..', '...kk...', '........'] },
  football: { rows: ['.wwwwww.', 'wwkkwwww', 'wkwwkwww', 'wkwwkwkk', 'wwkkwwkk', 'wwwwkwww', 'wwwkwkww', '.wwwwww.'] },
  partyHat: { rows: ['....p....', '....p....', '...ppp...', '...pgp...', '..ppppp..', '..pgpgp..', '.ppppppp.', '.pgpgpgp.', 'ppppppppp'] },
  slothPaw: { rows: ['..bb.bb..', '.bbbbbbb.', 'bbkbbkbbb', 'bbbbbbbbb', '.bbbbbbb.', '..bbbbb..', '...bbb...', '...bbb...', '...bbb...'] },
  viking: {
    rows: [
      '..s..s..', '.sgggg s', '..gggg..', '..keek..', '.keeeek.', '..kttk..', '.ttttttg', 'kuuuuukg', 'kuuuuuk.', 'kuuuuuk.', '.kbbbbk.', '.kb..bk.', '.kk..kk.',
    ],
  },
  palm: {
    rows: [
      '..N...N...N..', '.NNN.NNN.NNN.', 'NNNNNNNNNNNNN', '.NNNNNNNNNNN.', '..NN.NNN.NN..', '.....bbb.....', '.....bbb.....', '.....bbb.....', '....bbbb.....', '....bbb......', '....bbb......', '...bbbb......', '...bbb.......',
    ],
  },
  poolSloth: {
    rows: [
      '.......bbbb.......', '......bbbbbb......', '......bkbbkb......', '......bbbbbb......', '..pppppbbbbppppp..', '.pPPPPPPPPPPPPPPp.', 'pPPPPPPPPPPPPPPPPp', 'pPPPPPPPPPPPPPPPPp', '.pPPPPPPPPPPPPPPp.', '..pppppppppppppp..',
    ],
  },
  glass: { rows: ['kkkkkkk', 'kwwwwwk', 'kwggggk', 'kggggGk', 'kggggGk', 'kGGGGGk', '.kkkkk.'] },
  potato: { rows: ['..tttt..', '.ttttttt', 'tttbtttt', 'ttttttbt', 'tbtttttt', 'ttttbttt', '.ttttttt', '..tttt..'] },
  carrot: { rows: ['...NN...', '..NNN...', '...oo...', '..oooo..', '..oooo..', '...ooo..', '...oo...', '....o...'] },
  tomato: { rows: ['...NN...', '..rrrr..', '.rrrrrr.', 'rrwrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..', '........'] },
  pumpkin: { rows: ['...bb...', '.oooooo.', 'oooooooo', 'ookoookо', 'oooooooo', 'oookkooo', '.oooooo.', '..oooo..'], palette: { 'о': '#ff8c42' } },
  pinkplant: { rows: ['..p..p..', '.pPppPp.', '..pppp..', '...NN...', '...NN...', '..NNNN..', '...NN...', '...NN...'] },
  seed: { rows: ['........', '........', '...bb...', '..bbbb..', '..bbbb..', '...bb...', '........', '........'] },
  sprout: { rows: ['........', '...N....', '..NN.N..', '...NN...', '...N....', '..bbbb..', '.bbbbbb.', '........'] },
  cabbage: { rows: ['.NNNNNN.', 'NNwNNwNN', 'NwwwwwwN', 'NwwwwwwN', 'NNwwwwNN', '.NNwwNN.', '..NNNN..', '........'] },
  chili: { rows: ['......N.', '.....rN.', '....rr..', '...rrr..', '..rrr...', '.rrr....', 'rrr.....', 'r.......'] },
  garlic: { rows: ['...N....', '...w....', '..www...', '.wwwww..', '.wwwww..', '.wSwSw..', '..www...', '........'] },
  ginger: { rows: ['..tt....', '.tttt.t.', 'tttttttt', '.tttttt.', '..tttt..', '.tt.tt..', '........', '........'] },
  onion: { rows: ['...N....', '...N....', '..NN....', '..NN....', '..ww....', '.www....', '.www....', '..w.....'] },
  donut: { rows: ['..pppp..', '.pPPPPp.', 'pPPkkPPp', 'pPk..kPp', 'pPk..kPp', 'pPPkkPPp', '.pPPPPp.', '..pppp..'] },
  sock: { rows: ['.ssss...', '.sSSs...', '.sSSs...', '.sSSs...', '.sSSsss.', 'ssSSSSs.', 'sSSSSs..', '.ssss...'] },
  choco: { rows: ['bbbbbbbb', 'bBBbBBbB', 'bbbbbbbb', 'bBBbBBbB', 'bbbbbbbb', 'bBBbBBbB', 'bbbbbbbb', '........'] },
  keyboard: { rows: ['........', 'kkkkkkkk', 'kSkSkSkk', 'kkkkkkkk', 'kSkSkSkk', 'kkkkkkkk', 'kSSSSSSk', 'kkkkkkkk'] },
  whiskey: { rows: ['..kkk...', '..kbk...', '.kkgkk..', '.kggggk.', '.kggggk.', '.kggggk.', '.kGGGGk.', '..kkkk..'] },
  rum: { rows: ['..kkk...', '..kbk...', '.kkkkk..', '.kbbbbk.', '.kbgbbk.', '.kbbbbk.', '.kBBBBk.', '..kkkk..'] },
  passion: { rows: ['..mmmm..', '.mmmmmm.', 'mmyyyymm', 'mmykyymm', 'mmyykymm', 'mmyyyymm', '.mmmmmm.', '..mmmm..'] },
  pineapple: { rows: ['..N.N...', '.NNNN...', '..yyy...', '.yyyyy..', '.ykyky..', '.yyyyy..', '.ykyky..', '..yyy...'] },
  coconut: { rows: ['..bbbb..', '.bbbbbb.', 'bbkbbkbb', 'bbbbbbbb', 'bbbkbbbb', 'bbbbbbbb', '.bbbbbb.', '..bbbb..'] },
  grapefruit: { rows: ['..pppp..', '.pPPPPp.', 'pPwPwPPp', 'pPPPPPPp', 'pPwPwPPp', 'pPPPPPPp', '.pPPPPp.', '..pppp..'] },
  lime: { rows: ['..NNNN..', '.NNNNNN.', 'NNwNwNNN', 'NNNNNNNN', 'NNwNwNNN', 'NNNNNNNN', '.NNNNNN.', '..NNNN..'] },
  cola: { rows: ['..kkk...', '.kkrkk..', '.krrrk..', '.krwrk..', '.krrrk..', '.krrrk..', '.kkkkk..', '........'] },
  cathair: { rows: ['........', '.c....c.', '..c..c..', '...cc...', '..c..c..', '.c....c.', '........', '........'] },
  cocktail: { rows: ['kkkkkkkk', '.kppppk.', '..kppk..', '...kk...', '...kk...', '...kk...', '..kkkk..', '.kkkkkk.'] },
  cat: { rows: ['k.....k.', 'kk...kk.', 'kccccck.', 'kcwccwck', 'kcccccck', '.kccck..', '.kcpck..', '..kkk...'] },
  sloth: { rows: ['..bbbb..', '.bbbbbb.', 'bbkbbkbb', 'bbbbbbbb', 'bbbttbbb', '.bbbbbb.', '..bbbb..', '........'] },
  star8: { rows: ['...g....', '...g....', '.ggggg..', '..ggg...', '.gg.gg..', '........', '........', '........'] },
  globe: { rows: ['..uuuu..', '.uNNuuu.', 'uuNNNuuu', 'uuuNNuuu', 'uuuuNNuu', 'uNNuuNuu', '.uNNuuu.', '..uuuu..'] },
  heel: { rows: ['........', '......pp', '.....ppp', '....pppp', '...ppppp', 'pppppppp', 'ppp..ppp', 'kk....kk'] },
  ticket: { rows: ['gggggggg', 'gkkkkkkg', 'gkppppkg', 'gkpwwpkg', 'gkppppkg', 'gkkkkkkg', 'gggggggg', '........'] },
  skull: { rows: ['..wwww..', '.wwwwww.', 'wwkwwkww', 'wwkwwkww', 'wwwwwwww', '.wwkkww.', '..wwww..', '..w.w...'] },
  ball: { rows: ['.wwwwww.', 'wrwwwwrw', 'wwwrrwww', 'wwrwwrww', 'wwrwwrww', 'wwwrrwww', 'wrwwwwrw', '.wwwwww.'] },
  bug: { rows: ['k......k', '.kkkkkk.', 'kcckkcck', 'kcccccck', '.kccck..', 'kcccccck', '.kkkkkk.', 'k..kk..k'] },
};
