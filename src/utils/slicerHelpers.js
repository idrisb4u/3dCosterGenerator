/**
 * Slicer & Klipper helper calculations for 3D printing coasters.
 * Supports both 2-layer and 3-layer (Reference photo style: Base -> Accent -> Top Artwork) prints.
 */

export function calculatePrintStats({
  baseThickness = 2.4,
  hasAccent = true,
  accentThickness = 1.0,
  artworkHeight = 1.2,
  hasRim = true,
  rimHeight = 1.6,
  width = 100,
  height = 100,
  shapeType = 'circle',
  layerHeight = 0.2,
  infillPercent = 20,
}) {
  const effectiveLayerHeight = Math.max(0.05, layerHeight);

  // Height thresholds
  const z1_base = baseThickness;
  const z2_accent = hasAccent ? baseThickness + accentThickness : baseThickness;
  const z3_top = z2_accent + Math.max(hasRim ? rimHeight : 0, artworkHeight);

  // Layer numbers (1-indexed)
  const baseLayers = Math.round(z1_base / effectiveLayerHeight);
  const swap1_layer = baseLayers + 1;
  const swap1_z = (baseLayers * effectiveLayerHeight).toFixed(2);

  let swap2_layer = null;
  let swap2_z = null;
  if (hasAccent && accentThickness > 0) {
    const accentLayers = Math.round(accentThickness / effectiveLayerHeight);
    swap2_layer = baseLayers + accentLayers + 1;
    swap2_z = ((baseLayers + accentLayers) * effectiveLayerHeight).toFixed(2);
  }

  const totalLayers = Math.round(z3_top / effectiveLayerHeight);

  // Surface area in cm^2
  let areaCm2 = 0;
  const rCm = width / 20;
  switch (shapeType) {
    case 'circle':
      areaCm2 = Math.PI * rCm * rCm;
      break;
    case 'square':
    case 'rectangle':
      areaCm2 = (width / 10) * (height / 10);
      break;
    case 'hexagon':
      areaCm2 = (3 * Math.sqrt(3) / 2) * (rCm * rCm);
      break;
    case 'octagon':
      areaCm2 = 2 * (1 + Math.sqrt(2)) * (rCm * rCm);
      break;
    default:
      areaCm2 = Math.PI * rCm * rCm * 0.9;
      break;
  }

  // PLA Volume & Weight
  const baseVolCm3 = areaCm2 * (baseThickness / 10) * (0.4 + 0.6 * (infillPercent / 100));
  const accentVolCm3 = hasAccent ? areaCm2 * 0.85 * (accentThickness / 10) : 0;
  const artVolCm3 = areaCm2 * 0.28 * (artworkHeight / 10);
  const rimVolCm3 = hasRim ? (areaCm2 * 0.15) * (rimHeight / 10) : 0;
  const totalVolCm3 = baseVolCm3 + accentVolCm3 + artVolCm3 + rimVolCm3;

  const estimatedWeightGrams = Math.round(totalVolCm3 * 1.24);
  const estimatedMinutes = Math.max(15, Math.round(estimatedWeightGrams * 1.35));

  return {
    baseLayers,
    totalLayers,
    hasAccent,
    swap1_layer,
    swap1_z,
    swap2_layer,
    swap2_z,
    maxZ: z3_top.toFixed(2),
    estimatedWeightGrams,
    estimatedMinutes,
    areaCm2: Math.round(areaCm2),
  };
}
