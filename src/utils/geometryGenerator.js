import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/**
 * Creates the 2D base coaster shape based on shape type and dimensions.
 */
export function createBaseShape({ shapeType, width, height, cornerRadius }) {
  const shape = new THREE.Shape();
  const w = width;
  const h = shapeType === 'circle' || shapeType === 'hexagon' || shapeType === 'octagon' ? width : height;
  const hw = w / 2;
  const hh = h / 2;

  switch (shapeType) {
    case 'circle': {
      const radius = hw;
      shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
      break;
    }
    case 'square':
    case 'rectangle': {
      const r = Math.min(cornerRadius, hw, hh);
      if (r <= 0.1) {
        shape.moveTo(-hw, -hh);
        shape.lineTo(hw, -hh);
        shape.lineTo(hw, hh);
        shape.lineTo(-hw, hh);
        shape.closePath();
      } else {
        shape.moveTo(-hw + r, -hh);
        shape.lineTo(hw - r, -hh);
        shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
        shape.lineTo(hw, hh - r);
        shape.quadraticCurveTo(hw, hh, hw - r, hh);
        shape.lineTo(-hw + r, hh);
        shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
        shape.lineTo(-hw, -hh + r);
        shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
        shape.closePath();
      }
      break;
    }
    case 'hexagon': {
      const radius = hw;
      const sides = 6;
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides + Math.PI / 6;
        const px = radius * Math.cos(angle);
        const py = radius * Math.sin(angle);
        if (i === 0) shape.moveTo(px, py);
        else shape.lineTo(px, py);
      }
      shape.closePath();
      break;
    }
    case 'octagon': {
      const radius = hw;
      const sides = 8;
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides + Math.PI / 8;
        const px = radius * Math.cos(angle);
        const py = radius * Math.sin(angle);
        if (i === 0) shape.moveTo(px, py);
        else shape.lineTo(px, py);
      }
      shape.closePath();
      break;
    }
    case 'heart': {
      const s = hw / 45;
      shape.moveTo(0, 15 * s);
      shape.bezierCurveTo(0, 25 * s, -35 * s, 45 * s, -40 * s, 20 * s);
      shape.bezierCurveTo(-45 * s, -5 * s, -20 * s, -25 * s, 0, -42 * s);
      shape.bezierCurveTo(20 * s, -25 * s, 45 * s, -5 * s, 40 * s, 20 * s);
      shape.bezierCurveTo(35 * s, 45 * s, 0, 25 * s, 0, 15 * s);
      shape.closePath();
      break;
    }
    case 'shield': {
      shape.moveTo(-hw, hh);
      shape.lineTo(hw, hh);
      shape.lineTo(hw, 0);
      shape.bezierCurveTo(hw, -hh * 0.6, 0, -hh * 0.9, 0, -hh);
      shape.bezierCurveTo(0, -hh * 0.9, -hw, -hh * 0.6, -hw, 0);
      shape.closePath();
      break;
    }
    default: {
      const radius = hw;
      shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
      break;
    }
  }

  return shape;
}

/**
 * Creates the Middle Accent Plate (e.g. Red layer in Spider-Man).
 */
export function createAccentPlateGeometry({ shapeType, width, height, cornerRadius, rimWidth, accentThickness }) {
  if (accentThickness <= 0) return null;

  const margin = rimWidth > 0 ? rimWidth - 0.2 : 1.0;
  const innerW = Math.max(10, width - margin * 2);
  const innerH = Math.max(10, height - margin * 2);
  const innerR = Math.max(0, cornerRadius - margin);

  const plateShape = createBaseShape({
    shapeType,
    width: innerW,
    height: innerH,
    cornerRadius: innerR,
  });

  const plateGeom = new THREE.ExtrudeGeometry(plateShape, {
    depth: accentThickness,
    bevelEnabled: false,
  });

  return plateGeom;
}

/**
 * Creates the rim (lip) geometry.
 */
export function createRimGeometry({ shapeType, width, height, cornerRadius, rimWidth, rimHeight }) {
  if (rimWidth <= 0 || rimHeight <= 0) return null;

  const outerShape = createBaseShape({ shapeType, width, height, cornerRadius });
  const innerW = Math.max(10, width - rimWidth * 2);
  const innerH = Math.max(10, height - rimWidth * 2);
  const innerR = Math.max(0, cornerRadius - rimWidth);
  const innerShape = createBaseShape({ shapeType, width: innerW, height: innerH, cornerRadius: innerR });

  outerShape.holes = [innerShape];

  const rimGeom = new THREE.ExtrudeGeometry(outerShape, {
    depth: rimHeight,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.3,
    bevelThickness: 0.3,
  });

  return rimGeom;
}

function getSingleShapeBox(shape) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const points = shape.getPoints();
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return {
    minX, maxX, minY, maxY,
    width: maxX - minX,
    height: maxY - minY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

/**
 * Parses raw SVG string and extracts array of 2D THREE.Shape objects.
 * - RETAINS SVG strokes & borders by converting them to solid 3D ribbons
 * - UNFILLS white shapes (like eye lenses) by converting them into HOLES
 *   of enclosing black shapes rather than solid black blocks.
 */
export function parseSvgToShapes(svgString) {
  if (!svgString || typeof svgString !== 'string') return [];

  const loader = new SVGLoader();
  let parsed;
  try {
    parsed = loader.parse(svgString);
  } catch (err) {
    console.warn('SVGLoader parse error:', err);
    return [];
  }

  const solidShapes = [];
  const holeCandidates = [];

  for (const path of parsed.paths) {
    const style = path.userData?.style || {};
    const rawFill = (style.fill || '').toLowerCase().trim();
    const isWhite =
      rawFill === '#ffffff' ||
      rawFill === '#fff' ||
      rawFill === 'white' ||
      rawFill === 'rgb(255,255,255)';
    const isNone = rawFill === 'none' || rawFill === 'transparent' || rawFill === '';

    // 1. STROKE-ONLY PATHS (e.g. outer mask borders, lines)
    // Retain them as 3D ribbons so the border is never lost!
    if (isNone && path.subPaths && path.subPaths.length > 0) {
      const strokeW = Math.max(1.8, parseFloat(style.strokeWidth) || 2.2);
      const halfW = strokeW / 2;

      for (const subPath of path.subPaths) {
        const points = subPath.getPoints(32);
        if (points.length < 2) continue;

        const pFirst = points[0];
        const pLast = points[points.length - 1];
        const isClosed = Math.hypot(pFirst.x - pLast.x, pFirst.y - pLast.y) < 0.5;

        const ribbonShape = new THREE.Shape();
        const numPts = isClosed ? points.length - 1 : points.length;

        // Forward (+halfW)
        for (let i = 0; i < numPts; i++) {
          const p = points[i];
          const nextP = points[(i + 1) % numPts];
          const prevP = points[(i - 1 + numPts) % numPts];

          let dx, dy;
          if (isClosed) {
            dx = nextP.x - prevP.x;
            dy = nextP.y - prevP.y;
          } else {
            dx = i === numPts - 1 ? p.x - prevP.x : nextP.x - p.x;
            dy = i === numPts - 1 ? p.y - prevP.y : nextP.y - p.y;
          }
          const len = Math.hypot(dx, dy) || 1;
          const nx = (-dy / len) * halfW;
          const ny = (dx / len) * halfW;

          if (i === 0) ribbonShape.moveTo(p.x + nx, p.y + ny);
          else ribbonShape.lineTo(p.x + nx, p.y + ny);
        }

        // Return (-halfW)
        for (let i = numPts - 1; i >= 0; i--) {
          const p = points[i];
          const nextP = points[(i + 1) % numPts];
          const prevP = points[(i - 1 + numPts) % numPts];

          let dx, dy;
          if (isClosed) {
            dx = nextP.x - prevP.x;
            dy = nextP.y - prevP.y;
          } else {
            dx = i === numPts - 1 ? p.x - prevP.x : nextP.x - p.x;
            dy = i === numPts - 1 ? p.y - prevP.y : nextP.y - p.y;
          }
          const len = Math.hypot(dx, dy) || 1;
          const nx = (-dy / len) * halfW;
          const ny = (dx / len) * halfW;

          ribbonShape.lineTo(p.x - nx, p.y - ny);
        }

        ribbonShape.closePath();
        solidShapes.push(ribbonShape);
      }
      continue;
    }

    // 2. FILLED PATHS
    const shapes = SVGLoader.createShapes(path);
    if (!shapes || shapes.length === 0) continue;

    if (isWhite) {
      // White shapes (like the inside of the eye) are converted to UNFILLED HOLES!
      for (const s of shapes) {
        holeCandidates.push(s);
      }
    } else {
      for (const s of shapes) {
        solidShapes.push(s);
      }
    }
  }

  // 3. Subtract white shapes from enclosing solid shapes to leave the eye inside UNFILLED!
  if (holeCandidates.length > 0 && solidShapes.length > 0) {
    for (const holeShape of holeCandidates) {
      const hBox = getSingleShapeBox(holeShape);
      let bestEnclosing = null;

      for (const solid of solidShapes) {
        const sBox = getSingleShapeBox(solid);
        // Center of hole is inside bounding box of solid shape
        if (
          hBox.cx >= sBox.minX - 1 &&
          hBox.cx <= sBox.maxX + 1 &&
          hBox.cy >= sBox.minY - 1 &&
          hBox.cy <= sBox.maxY + 1
        ) {
          bestEnclosing = solid;
          break;
        }
      }

      if (bestEnclosing) {
        const holePath = new THREE.Path();
        for (const curve of holeShape.curves) {
          holePath.curves.push(curve.clone());
        }
        bestEnclosing.holes.push(holePath);
      }
    }
  }

  return solidShapes;
}

/**
 * Calculates bounding box of shapes.
 */
export function getShapesBoundingBox(shapes) {
  if (!shapes || shapes.length === 0) {
    return { minX: -50, maxX: 50, minY: -50, maxY: 50, width: 100, height: 100, centerX: 0, centerY: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const shape of shapes) {
    const points = shape.getPoints();
    for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    if (shape.holes && shape.holes.length > 0) {
      for (const hole of shape.holes) {
        const hp = hole.getPoints();
        for (const p of hp) {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
      }
    }
  }

  if (minX === Infinity) {
    return { minX: -50, maxX: 50, minY: -50, maxY: 50, width: 100, height: 100, centerX: 0, centerY: 0 };
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return { minX, maxX, minY, maxY, width, height, centerX, centerY };
}

/**
 * Normalizes, scales, rotates, and translates shapes.
 */
export function transformShapes(shapes, {
  targetSize = 65,
  scale = 1.0,
  offsetX = 0,
  offsetY = 0,
  rotationDeg = 0,
  flipX = false,
  flipY = false,
}) {
  if (!shapes || shapes.length === 0) return [];

  const bbox = getShapesBoundingBox(shapes);
  const maxDim = Math.max(bbox.width, bbox.height) || 1;
  const baseScale = targetSize / maxDim;
  const finalScale = baseScale * scale;
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const transformedShapes = shapes.map(origShape => {
    const newShape = new THREE.Shape();

    const transformPt = (x, y) => {
      let dx = x - bbox.centerX;
      let dy = -(y - bbox.centerY);

      if (flipX) dx = -dx;
      if (flipY) dy = -dy;

      dx *= finalScale;
      dy *= finalScale;

      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      return {
        x: rx + offsetX,
        y: ry + offsetY,
      };
    };

    for (let i = 0; i < origShape.curves.length; i++) {
      const curve = origShape.curves[i];
      if (curve.isLineCurve) {
        const v1 = transformPt(curve.v1.x, curve.v1.y);
        const v2 = transformPt(curve.v2.x, curve.v2.y);
        if (i === 0) newShape.moveTo(v1.x, v1.y);
        newShape.lineTo(v2.x, v2.y);
      } else if (curve.isQuadraticBezierCurve) {
        const v0 = transformPt(curve.v0.x, curve.v0.y);
        const v1 = transformPt(curve.v1.x, curve.v1.y);
        const v2 = transformPt(curve.v2.x, curve.v2.y);
        if (i === 0) newShape.moveTo(v0.x, v0.y);
        newShape.quadraticCurveTo(v1.x, v1.y, v2.x, v2.y);
      } else if (curve.isCubicBezierCurve) {
        const v0 = transformPt(curve.v0.x, curve.v0.y);
        const v1 = transformPt(curve.v1.x, curve.v1.y);
        const v2 = transformPt(curve.v2.x, curve.v2.y);
        const v3 = transformPt(curve.v3.x, curve.v3.y);
        if (i === 0) newShape.moveTo(v0.x, v0.y);
        newShape.bezierCurveTo(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
      } else {
        const pts = curve.getPoints(16);
        for (let pIdx = 0; pIdx < pts.length; pIdx++) {
          const tp = transformPt(pts[pIdx].x, pts[pIdx].y);
          if (i === 0 && pIdx === 0) newShape.moveTo(tp.x, tp.y);
          else newShape.lineTo(tp.x, tp.y);
        }
      }
    }
    newShape.closePath();

    if (origShape.holes && origShape.holes.length > 0) {
      newShape.holes = origShape.holes.map(hole => {
        const newHole = new THREE.Path();
        for (let i = 0; i < hole.curves.length; i++) {
          const curve = hole.curves[i];
          if (curve.isLineCurve) {
            const v1 = transformPt(curve.v1.x, curve.v1.y);
            const v2 = transformPt(curve.v2.x, curve.v2.y);
            if (i === 0) newHole.moveTo(v1.x, v1.y);
            newHole.lineTo(v2.x, v2.y);
          } else if (curve.isQuadraticBezierCurve) {
            const v0 = transformPt(curve.v0.x, curve.v0.y);
            const v1 = transformPt(curve.v1.x, curve.v1.y);
            const v2 = transformPt(curve.v2.x, curve.v2.y);
            if (i === 0) newHole.moveTo(v0.x, v0.y);
            newHole.quadraticCurveTo(v1.x, v1.y, v2.x, v2.y);
          } else if (curve.isCubicBezierCurve) {
            const v0 = transformPt(curve.v0.x, curve.v0.y);
            const v1 = transformPt(curve.v1.x, curve.v1.y);
            const v2 = transformPt(curve.v2.x, curve.v2.y);
            const v3 = transformPt(curve.v3.x, curve.v3.y);
            if (i === 0) newHole.moveTo(v0.x, v0.y);
            newHole.bezierCurveTo(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
          } else {
            const pts = curve.getPoints(16);
            for (let pIdx = 0; pIdx < pts.length; pIdx++) {
              const tp = transformPt(pts[pIdx].x, pts[pIdx].y);
              if (i === 0 && pIdx === 0) newHole.moveTo(tp.x, tp.y);
              else newHole.lineTo(tp.x, tp.y);
            }
          }
        }
        newHole.closePath();
        return newHole;
      });
    }

    return newShape;
  });

  return transformedShapes;
}

/**
 * Creates the Front Artwork 3D ExtrudeGeometry from shapes.
 */
export function createArtworkGeometry(shapes, depth = 1.0, bevel = true) {
  if (!shapes || shapes.length === 0) return null;

  try {
    const geom = new THREE.ExtrudeGeometry(shapes, {
      depth: Math.max(0.2, depth),
      bevelEnabled: bevel,
      bevelSegments: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    });
    return geom;
  } catch (err) {
    console.warn('Failed to extrude artwork shapes:', err);
    return null;
  }
}
