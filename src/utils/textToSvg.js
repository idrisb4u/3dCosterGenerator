import opentype from 'opentype.js';

const fontCache = {};

export const FONT_OPTIONS = [
  { id: 'calligraphy', name: 'Calligraphy Script', file: '/fonts/GreatVibes.ttf', sample: 'Graceful & Flourished' },
  { id: 'royal', name: 'Royal Monogram Serif', file: '/fonts/CinzelDecorative.ttf', sample: 'Ornate & Classical' },
  { id: 'bold', name: 'Modern Bold Sans', file: '/fonts/Montserrat.ttf', sample: 'Clean & High Impact' },
  { id: 'gothic', name: 'Vintage Gothic', file: '/fonts/PirataOne.ttf', sample: 'Medieval & Edgy' },
];

export const BORDER_STYLES = [
  { id: 'none', name: 'No Border' },
  { id: 'circle-double', name: 'Double Circle Crest' },
  { id: 'circle-dots', name: 'Beaded Circle Ring' },
  { id: 'octagon', name: 'Geometric Octagon' },
  { id: 'diamond', name: 'Diamond Crest' },
  { id: 'square-rounded', name: 'Rounded Frame' },
];

export async function loadFontById(fontId) {
  const fontDef = FONT_OPTIONS.find(f => f.id === fontId) || FONT_OPTIONS[0];
  if (fontCache[fontDef.id]) {
    return fontCache[fontDef.id];
  }
  return new Promise((resolve, reject) => {
    opentype.load(fontDef.file, (err, font) => {
      if (err) {
        console.error('Failed to load font:', err);
        reject(err);
      } else {
        fontCache[fontDef.id] = font;
        resolve(font);
      }
    });
  });
}

/**
 * Generate a complete centered SVG string with vector paths for given text, font, and border.
 */
export async function createTextSvg({ text = 'A', fontId = 'calligraphy', borderStyle = 'circle-double', fontSize = 48 }) {
  const font = await loadFontById(fontId);
  const cleanText = text.trim() || 'A';

  // 1. Get raw glyph path at (0,0) to compute bounding box
  const testPath = font.getPath(cleanText, 0, 0, fontSize);
  const bbox = testPath.getBoundingBox();

  const width = bbox.x2 - bbox.x1;
  const height = bbox.y2 - bbox.y1;

  // Scale down if text is too wide for 100x100 box (target max 70x70 to fit with border)
  const maxTargetDim = borderStyle === 'none' ? 78 : 62;
  let effectiveFontSize = fontSize;
  if (width > maxTargetDim || height > maxTargetDim) {
    const scaleFactor = maxTargetDim / Math.max(width, height);
    effectiveFontSize = Math.floor(fontSize * scaleFactor);
  }

  // Recalculate with effective font size
  const rawPath = font.getPath(cleanText, 0, 0, effectiveFontSize);
  const finalBbox = rawPath.getBoundingBox();
  const textCenterX = (finalBbox.x1 + finalBbox.x2) / 2;
  const textCenterY = (finalBbox.y1 + finalBbox.y2) / 2;

  // Center at (50, 50)
  const targetX = 50 - textCenterX;
  const targetY = 50 - textCenterY;

  const centeredPath = font.getPath(cleanText, targetX, targetY, effectiveFontSize);
  const pathData = centeredPath.toPathData(2);

  // 2. Generate border SVG element
  let borderSvg = '';
  switch (borderStyle) {
    case 'circle-double':
      borderSvg = `
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
      `;
      break;
    case 'circle-dots':
      borderSvg = `
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="2.2"/>
        <circle cx="50" cy="50" r="39.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"/>
      `;
      break;
    case 'octagon':
      borderSvg = `
        <polygon points="50,8 80,21 92,50 80,79 50,92 20,79 8,50 20,21" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <polygon points="50,13 76,24 87,50 76,76 50,87 24,76 13,50 24,24" fill="none" stroke="currentColor" stroke-width="1.2"/>
      `;
      break;
    case 'diamond':
      borderSvg = `
        <polygon points="50,7 93,50 50,93 7,50" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <polygon points="50,13 87,50 50,87 13,50" fill="none" stroke="currentColor" stroke-width="1.2"/>
      `;
      break;
    case 'square-rounded':
      borderSvg = `
        <rect x="8" y="8" width="84" height="84" rx="12" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <rect x="13" y="13" width="74" height="74" rx="9" fill="none" stroke="currentColor" stroke-width="1.2"/>
      `;
      break;
    case 'none':
    default:
      borderSvg = '';
      break;
  }

  // 3. Combine into unified SVG
  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    ${borderSvg}
    <path d="${pathData}" fill="currentColor"/>
  </svg>`;

  return svg;
}
