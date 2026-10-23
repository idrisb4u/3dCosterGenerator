/**
 * Curated 3D Coaster Designs.
 * All graphics and alphabets use pure filled paths and compound annular rings
 * to guarantee 100% watertight 3D meshes without accidental solid lidded discs.
 */

import { CALLIGRAPHY_GLYPHS, BOLD_GLYPHS } from './alphabetGlyphs';

export const PREBUILT_CATEGORIES = [
  { id: 'all', name: 'All Designs' },
  { id: 'pop', name: 'Spider-Man & Superheroes' },
  { id: 'alphabets_cal', name: 'Calligraphy Alphabets' },
  { id: 'alphabets_bold', name: 'Bold Alphabets' },
  { id: 'drinks', name: 'Coffee & Drinks' },
  { id: 'patterns', name: 'Mandalas & Patterns' },
];

export function createAnnularRing(cx, cy, r, w = 2.4) {
  const rOut = +(r + w / 2).toFixed(2);
  const rIn = +(r - w / 2).toFixed(2);
  return `M ${cx} ${cy - rOut} A ${rOut} ${rOut} 0 1 0 ${cx} ${cy + rOut} A ${rOut} ${rOut} 0 1 0 ${cx} ${cy - rOut} Z ` +
         `M ${cx} ${cy - rIn} A ${rIn} ${rIn} 0 1 1 ${cx} ${cy + rIn} A ${rIn} ${rIn} 0 1 1 ${cx} ${cy - rIn} Z `;
}

export function createOvalRing(cx, cy, rx, ry, w = 2.8) {
  const rxOut = +(rx + w / 2).toFixed(2);
  const ryOut = +(ry + w / 2).toFixed(2);
  const rxIn = +(rx - w / 2).toFixed(2);
  const ryIn = +(ry - w / 2).toFixed(2);
  return `M ${cx} ${cy - ryOut} A ${rxOut} ${ryOut} 0 1 0 ${cx} ${cy + ryOut} A ${rxOut} ${ryOut} 0 1 0 ${cx} ${cy - ryOut} Z ` +
         `M ${cx} ${cy - ryIn} A ${rxIn} ${ryIn} 0 1 1 ${cx} ${cy + ryIn} A ${rxIn} ${ryIn} 0 1 1 ${cx} ${cy - ryIn} Z `;
}

/**
 * Exact Spider-Man Mask Head from reference image:
 * - Outer head oval border RETAINED
 * - Eye frames with UNFILLED inside (hollow cutout showing coaster floor)
 * - Radial webs & sagging arcs
 */
function generateSpiderManMaskHeadSvg() {
  const w = 3.6; // Outer head border thickness

  // 1. Outer head contour (egg/oval silhouette) with inner hole forming a bold border ribbon
  const headBorderRibbon = `
    M 50 3
    C 77 3 93 20 93 47
    C 93 70 76 88 50 97
    C 24 88 7 70 7 47
    C 7 20 23 3 50 3 Z
    M 50 ${3 + w}
    C ${23 + w * 0.7} ${3 + w} ${7 + w} ${20 + w * 0.7} ${7 + w} 47
    C ${7 + w} ${70 - w * 0.7} ${24 + w * 0.7} ${88 - w * 0.7} 50 ${97 - w}
    C ${76 - w * 0.7} ${88 - w * 0.7} ${93 - w} ${70 - w * 0.7} ${93 - w} 47
    C ${93 - w} ${20 + w * 0.7} ${77 - w * 0.7} ${3 + w} 50 ${3 + w} Z
  `;

  // 2. Eye Frames with UNFILLED inside:
  // Left eye: outer contour + inner hole contour
  const leftEyeFrame = `
    M 47 49 
    C 38 41 26 31 16 26 
    C 14 38 12 52 14 62 
    C 24 62 36 57 47 49 Z
    M 44 49
    C 35 55 24 58 17 58
    C 16 50 18 39 19 31
    C 27 35 37 42 44 49 Z
  `;

  // Right eye: outer contour + inner hole contour
  const rightEyeFrame = `
    M 53 49 
    C 62 41 74 31 84 26 
    C 86 38 88 52 86 62 
    C 76 62 64 57 53 49 Z
    M 56 49
    C 65 55 76 58 83 58
    C 84 50 82 39 81 31
    C 73 35 63 42 56 49 Z
  `;

  // 3. Web radiating lines & arcs
  let webRibbons = '';
  const rw = 0.8;

  const topSpokes = [
    { a: -Math.PI / 2, len: 44 },
    { a: -Math.PI / 2 - 0.28, len: 43 },
    { a: -Math.PI / 2 + 0.28, len: 43 },
    { a: -Math.PI / 2 - 0.58, len: 42 },
    { a: -Math.PI / 2 + 0.58, len: 42 },
    { a: -Math.PI / 2 - 0.92, len: 40 },
    { a: -Math.PI / 2 + 0.92, len: 40 },
  ];

  for (const s of topSpokes) {
    const x1 = 50;
    const y1 = 49;
    const x2 = 50 + s.len * Math.cos(s.a);
    const y2 = 49 + s.len * Math.sin(s.a);
    const px = -Math.sin(s.a) * rw;
    const py = Math.cos(s.a) * rw;
    webRibbons += `M ${(x1 + px).toFixed(2)} ${(y1 + py).toFixed(2)} L ${(x2 + px).toFixed(2)} ${(y2 + py).toFixed(2)} L ${(x2 - px).toFixed(2)} ${(y2 - py).toFixed(2)} L ${(x1 - px).toFixed(2)} ${(y1 - py).toFixed(2)} Z `;
  }

  const bottomSpokes = [
    { a: Math.PI / 2, len: 44 },
    { a: Math.PI / 2 - 0.28, len: 42 },
    { a: Math.PI / 2 + 0.28, len: 42 },
    { a: Math.PI / 2 - 0.60, len: 39 },
    { a: Math.PI / 2 + 0.60, len: 39 },
    { a: Math.PI / 2 - 0.95, len: 35 },
    { a: Math.PI / 2 + 0.95, len: 35 },
  ];

  for (const s of bottomSpokes) {
    const x1 = 50;
    const y1 = 51;
    const x2 = 50 + s.len * Math.cos(s.a);
    const y2 = 51 + s.len * Math.sin(s.a);
    const px = -Math.sin(s.a) * rw;
    const py = Math.cos(s.a) * rw;
    webRibbons += `M ${(x1 + px).toFixed(2)} ${(y1 + py).toFixed(2)} L ${(x2 + px).toFixed(2)} ${(y2 + py).toFixed(2)} L ${(x2 - px).toFixed(2)} ${(y2 - py).toFixed(2)} L ${(x1 - px).toFixed(2)} ${(y1 - py).toFixed(2)} Z `;
  }

  const topArcs = [12, 22, 32, 41];
  for (const rad of topArcs) {
    const aStart = -Math.PI / 2 - 0.92;
    const aEnd = -Math.PI / 2 + 0.92;
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const a1 = aStart + (i * (aEnd - aStart)) / steps;
      const a2 = aStart + ((i + 1) * (aEnd - aStart)) / steps;
      const amid = (a1 + a2) / 2;
      const sag = rad * 0.93;
      const x1 = 50 + rad * Math.cos(a1);
      const y1 = 49 + rad * Math.sin(a1);
      const x2 = 50 + rad * Math.cos(a2);
      const y2 = 49 + rad * Math.sin(a2);
      const xmid = 50 + sag * Math.cos(amid);
      const ymid = 49 + sag * Math.sin(amid);
      webRibbons += `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${xmid.toFixed(2)} ${ymid.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} L ${(x2 + rw).toFixed(2)} ${(y2 + rw).toFixed(2)} Q ${(xmid + rw).toFixed(2)} ${(ymid + rw).toFixed(2)} ${(x1 + rw).toFixed(2)} ${(y1 + rw).toFixed(2)} Z `;
    }
  }

  const bottomArcs = [11, 21, 31, 40];
  for (const rad of bottomArcs) {
    const aStart = Math.PI / 2 - 0.95;
    const aEnd = Math.PI / 2 + 0.95;
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const a1 = aStart + (i * (aEnd - aStart)) / steps;
      const a2 = aStart + ((i + 1) * (aEnd - aStart)) / steps;
      const amid = (a1 + a2) / 2;
      const sag = rad * 0.93;
      const x1 = 50 + rad * Math.cos(a1);
      const y1 = 51 + rad * Math.sin(a1);
      const x2 = 50 + rad * Math.cos(a2);
      const y2 = 51 + rad * Math.sin(a2);
      const xmid = 50 + sag * Math.cos(amid);
      const ymid = 51 + sag * Math.sin(amid);
      webRibbons += `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${xmid.toFixed(2)} ${ymid.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} L ${(x2 + rw).toFixed(2)} ${(y2 + rw).toFixed(2)} Q ${(xmid + rw).toFixed(2)} ${(ymid + rw).toFixed(2)} ${(x1 + rw).toFixed(2)} ${(y1 + rw).toFixed(2)} Z `;
    }
  }

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="${headBorderRibbon} ${webRibbons} ${leftEyeFrame} ${rightEyeFrame}" fill="currentColor"/>
  </svg>`;
}

function generateRaimiSpiderManCoasterSvg() {
  const numSpokes = 16;
  const rings = [14, 24, 34, 43];
  let webRibbons = '';
  const webRibbonWidth = 1.4;

  for (let r = 0; r < rings.length; r++) {
    const rad = rings[r];
    for (let i = 0; i < numSpokes; i++) {
      const a1 = (i * 2 * Math.PI) / numSpokes;
      const a2 = ((i + 1) * 2 * Math.PI) / numSpokes;
      const x1 = +(50 + rad * Math.cos(a1)).toFixed(2);
      const y1 = +(50 + rad * Math.sin(a1)).toFixed(2);
      const x2 = +(50 + rad * Math.cos(a2)).toFixed(2);
      const y2 = +(50 + rad * Math.sin(a2)).toFixed(2);

      const amid = (a1 + a2) / 2;
      const sagRad = rad * 0.94;
      const xmid = +(50 + sagRad * Math.cos(amid)).toFixed(2);
      const ymid = +(50 + sagRad * Math.sin(amid)).toFixed(2);

      const rw = webRibbonWidth / 2;
      webRibbons += `M ${x1} ${y1} Q ${xmid} ${ymid} ${x2} ${y2} L ${(x2 + rw).toFixed(2)} ${(y2 + rw).toFixed(2)} Q ${(xmid + rw).toFixed(2)} ${(ymid + rw).toFixed(2)} ${(x1 + rw).toFixed(2)} ${(y1 + rw).toFixed(2)} Z `;
    }
  }

  for (let i = 0; i < numSpokes; i++) {
    const a = (i * 2 * Math.PI) / numSpokes;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const perpX = -sin * (webRibbonWidth / 2);
    const perpY = cos * (webRibbonWidth / 2);

    const x1 = 50 + 9 * cos;
    const y1 = 50 + 9 * sin;
    const x2 = 50 + 44 * cos;
    const y2 = 50 + 44 * sin;

    webRibbons += `M ${(x1 + perpX).toFixed(2)} ${(y1 + perpY).toFixed(2)} L ${(x2 + perpX).toFixed(2)} ${(y2 + perpY).toFixed(2)} L ${(x2 - perpX).toFixed(2)} ${(y2 - perpY).toFixed(2)} L ${(x1 - perpX).toFixed(2)} ${(y1 - perpY).toFixed(2)} Z `;
  }

  const spiderBody = `
    M 50 35 L 48 31 L 49.5 35 L 50.5 35 L 52 31 L 50 35 Z
    M 50 35 C 46.5 35 44.5 38 44.5 42 C 44.5 45 46.5 47.5 49 48 C 44 50 42 55 42 62 C 42 70 47 78 50 82 C 53 78 58 70 58 62 C 58 55 56 50 51 48 C 53.5 47.5 55.5 45 55.5 42 C 55.5 38 53.5 35 50 35 Z
    M 46 39 Q 40 22 33 16 Q 31 15 30 18 Q 32 23 37 32 Q 41 39 44.5 41 Z
    M 45 42 Q 33 26 23 27 Q 21 28 22 30 Q 28 35 36 43 Q 41 45 44 44 Z
    M 45 47 Q 30 44 20 48 Q 18 50 20 52 Q 28 54 36 53 Q 41 52 44.5 49 Z
    M 46 51 Q 32 54 23 66 Q 21 69 23 71 Q 28 69 36 61 Q 42 56 45.5 53 Z
    M 54 39 Q 60 22 67 16 Q 69 15 70 18 Q 68 23 63 32 Q 59 39 55.5 41 Z
    M 55 42 Q 67 26 77 27 Q 79 28 78 30 Q 72 35 64 43 Q 59 45 56 44 Z
    M 55 47 Q 70 44 80 48 Q 82 50 80 52 Q 72 54 64 53 Q 59 52 55.5 49 Z
    M 54 51 Q 68 54 77 66 Q 79 69 77 71 Q 72 69 64 61 Q 58 56 54.5 53 Z
  `;

  const outerRing = createAnnularRing(50, 50, 44.5, 2.6);

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="${outerRing} ${webRibbons} ${spiderBody}" fill="currentColor"/>
  </svg>`;
}

function generateFlowerOfLifeSvg() {
  const outerRing = createAnnularRing(50, 50, 44, 2.6);
  const rRing = 16;
  const w = 1.8;

  let rings = createAnnularRing(50, 50, rRing, w);

  for (let i = 0; i < 6; i++) {
    const a = (i * 2 * Math.PI) / 6;
    const cx = +(50 + rRing * Math.cos(a)).toFixed(2);
    const cy = +(50 + rRing * Math.sin(a)).toFixed(2);
    rings += ' ' + createAnnularRing(cx, cy, rRing, w);
  }

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="${outerRing} ${rings}" fill="currentColor"/>
  </svg>`;
}

export const PREBUILT_SVGS = [
  // 1. EXACT SPIDER-MAN MASK HEAD (FROM USER'S LATEST REFERENCE)
  {
    id: 'spiderman-mask-head',
    name: 'Spider-Man Mask Head (Reference)',
    category: 'pop',
    description: 'Outer head border retained with unfilled eye lenses',
    viewBox: '0 0 100 100',
    svg: generateSpiderManMaskHeadSvg(),
  },

  // 2. SPIDER-MAN WEB COASTER (CHEST SPIDER ON WEB)
  {
    id: 'spiderman-web-coaster',
    name: 'Spider-Man Web Coaster',
    category: 'pop',
    description: 'Iconic Raimi Spider with full radial spiderweb lattice',
    viewBox: '0 0 100 100',
    svg: generateRaimiSpiderManCoasterSvg(),
  },
  {
    id: 'spiderman-spider',
    name: 'Spider-Man Emblem (Solo)',
    category: 'pop',
    description: 'Clean classic Spider chest insignia',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 34 C46 34 43 38 43 43 C43 47 46 50 50 50 C54 50 57 47 57 43 C57 38 54 34 50 34 Z 
               M50 53 C44 53 40 59 40 68 C40 76 45 84 50 88 C55 84 60 76 60 68 C60 59 56 53 50 53 Z
               M47 38 L32 20 L26 24 L40 40 L45 40 Z
               M53 38 L68 20 L74 24 L60 40 L55 40 Z
               M46 44 L22 36 L18 42 L42 47 Z
               M54 44 L78 36 L82 42 L58 47 Z
               M44 55 L20 62 L22 68 L43 59 Z
               M56 55 L80 62 L78 68 L57 59 Z
               M45 66 L26 82 L30 87 L47 71 Z
               M55 66 L74 82 L70 87 L53 71 Z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'batman-logo',
    name: 'Batman Dark Knight',
    category: 'pop',
    description: 'Bat insignia with hollow oval crest frame',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="${createOvalRing(50, 50, 43, 31, 2.8)}
               M 50 33 C 48 33 48 30 46 28 C 44 33 42 33 38 34 C 29 36 21 44 19 55 C 26 53 31 57 33 62 C 38 56 45 59 47 68 C 48 67 50 64 50 64 C 50 64 52 67 53 68 C 55 59 62 56 67 62 C 69 57 74 53 81 55 C 79 44 71 36 62 34 C 58 33 56 33 54 28 C 52 30 52 33 50 33 Z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'captain-america',
    name: 'Captain America Shield',
    category: 'pop',
    description: 'Concentric rings & central star',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="${createAnnularRing(50, 50, 44, 3.4)}
               ${createAnnularRing(50, 50, 34, 3.4)}
               ${createAnnularRing(50, 50, 24, 3.4)}
               M 50 32 L 53.5 42.5 L 65 42.5 L 55.5 49.5 L 59 60 L 50 53.5 L 41 60 L 44.5 49.5 L 35 42.5 L 46.5 42.5 Z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'avengers-a',
    name: 'Avengers Crest',
    category: 'pop',
    description: 'Stylized Avengers emblem with outer border',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="${createAnnularRing(50, 50, 43, 3.2)}
               M 46 18 L 34 76 L 44 76 L 48 57 L 62 57 L 64 76 L 74 76 L 56 18 Z 
               M 50 34 L 59 50 L 49 50 Z
               M 62 54 L 78 54 L 78 48 L 88 57 L 78 66 L 78 60 L 62 60 Z" fill="currentColor"/>
    </svg>`
  },

  // 3. COFFEE & BEVERAGES
  {
    id: 'coffee-steam',
    name: 'Artisan Coffee & Steam',
    category: 'drinks',
    description: 'Steaming cup with saucer and rich crema swirls',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 26 44 L 28 72 C 28 78 34 82 42 82 L 58 82 C 66 82 72 78 72 72 L 74 44 Z 
               M 72 48 C 79 48 84 53 84 60 C 84 67 79 72 71 72 L 71 66 C 75 66 78 63 78 60 C 78 57 75 54 72 54 Z
               M 20 84 L 80 84 L 80 88 L 20 88 Z
               M 37 38 C 34 32 39 26 35 20 C 33 17 30 15 32 12 L 35 12 C 33 15 36 17 38 20 C 42 26 37 32 40 38 Z
               M 49 38 C 46 30 52 24 48 16 C 46 13 43 11 45 8 L 48 8 C 46 11 49 13 51 16 C 55 24 49 30 52 38 Z
               M 61 38 C 58 32 63 26 59 20 C 57 17 54 15 56 12 L 59 12 C 57 15 60 17 62 20 C 66 26 61 32 64 38 Z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'beer-mug',
    name: 'Craft Beer Mug',
    category: 'drinks',
    description: 'Frosted beer mug with frothy foam head',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 26 36 C 24 30 30 24 36 26 C 38 20 46 19 50 23 C 54 18 64 19 66 25 C 72 23 76 29 74 36 Z
               M 28 38 L 30 82 C 30 86 34 89 39 89 L 61 89 C 66 89 70 86 70 82 L 72 38 Z
               M 71 44 C 81 44 86 50 86 62 C 86 74 81 80 70 80 L 70 72 C 76 72 79 68 79 62 C 79 56 76 52 71 52 Z" fill="currentColor"/>
    </svg>`
  },

  // 4. MANDALAS & SACRED GEOMETRY
  {
    id: 'flower-of-life',
    name: 'Sacred Flower of Life',
    category: 'patterns',
    description: 'Harmonic geometric mandala pattern',
    viewBox: '0 0 100 100',
    svg: generateFlowerOfLifeSvg(),
  },
  {
    id: 'celtic-knot',
    name: 'Celtic Triskele Knot',
    category: 'patterns',
    description: 'Triple spiral Celtic knot with border',
    viewBox: '0 0 100 100',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="${createAnnularRing(50, 50, 44, 2.6)}
               M 50 30 C 58 18 78 24 76 42 C 74 58 56 50 50 50 C 44 50 26 58 24 42 C 22 24 42 18 50 30 Z
               M 50 46 A 4 4 0 1 0 50 54 A 4 4 0 1 0 50 46 Z" fill="currentColor"/>
    </svg>`
  },

  // 5. CALLIGRAPHY MONOGRAMS (A-Z)
  ...generateCalligraphyAlphabets(),

  // 6. BOLD MODERN ALPHABETS (A-Z)
  ...generateBoldAlphabets(),
];

function generateCalligraphyAlphabets() {
  const outerRing = createAnnularRing(50, 50, 44, 2.4);
  const innerRing = createAnnularRing(50, 50, 39.5, 1.2);

  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
    const glyphPath = CALLIGRAPHY_GLYPHS[letter] || '';
    return {
      id: `cal-${letter.toLowerCase()}`,
      name: `Calligraphy "${letter}"`,
      category: 'alphabets_cal',
      letter,
      description: `Flourished royal calligraphy monogram "${letter}"`,
      viewBox: '0 0 100 100',
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="${outerRing} ${innerRing}" fill="currentColor"/>
        <path d="${glyphPath}" fill="currentColor"/>
      </svg>`
    };
  });
}

function generateBoldAlphabets() {
  const outerOct = "M 50 7 L 81 20 L 93 50 L 81 80 L 50 93 L 19 80 L 7 50 L 19 20 Z " +
                   "M 50 11 L 22 23 L 11 50 L 22 77 L 50 89 L 78 77 L 89 50 L 78 23 Z";

  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
    const glyphPath = BOLD_GLYPHS[letter] || '';
    return {
      id: `bold-${letter.toLowerCase()}`,
      name: `Bold "${letter}"`,
      category: 'alphabets_bold',
      letter,
      description: `Modern high-impact typography "${letter}"`,
      viewBox: '0 0 100 100',
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="${outerOct}" fill="currentColor"/>
        <path d="${glyphPath}" fill="currentColor"/>
      </svg>`
    };
  });
}
