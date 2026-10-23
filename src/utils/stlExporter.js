import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import JSZip from 'jszip';

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function generateBinaryStlBuffer(threeObject) {
  const exporter = new STLExporter();
  const stlData = exporter.parse(threeObject, { binary: true });
  return stlData.buffer || stlData;
}

export function exportObjectToBinaryStl(threeObject, filename = 'coaster.stl') {
  const buffer = generateBinaryStlBuffer(threeObject);
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  downloadBlob(blob, filename);
  return blob;
}

/**
 * Single Combined STL (Klipper Layer Swap or Monolithic print).
 */
export function exportCombinedCoasterStl(
  { baseMesh, accentMesh, rimMesh, artworkMesh, hasRim },
  baseFilename = 'coaster_3d_print'
) {
  const exportGroup = new THREE.Group();

  if (baseMesh) exportGroup.add(baseMesh.clone());
  if (hasRim && accentMesh) exportGroup.add(accentMesh.clone());
  if (hasRim && rimMesh) exportGroup.add(rimMesh.clone());
  if (artworkMesh) exportGroup.add(artworkMesh.clone());

  exportGroup.updateMatrixWorld(true);
  exportObjectToBinaryStl(exportGroup, `${baseFilename}_combined_single.stl`);
}

/**
 * Multi-Color AMS Pack (Bambu Studio / OrcaSlicer).
 */
export async function exportMultiColorAmsZip(
  { baseMesh, accentMesh, rimMesh, artworkMesh, hasRim },
  baseFilename = 'coaster_ams'
) {
  const zip = new JSZip();
  const isThreePart = Boolean(hasRim && accentMesh);

  if (!isThreePart) {
    // 2-part AMS assembly (Back Panel + Artwork)
    // If hasRim is true, rim is part of the back panel!
    const baseGroup = new THREE.Group();
    if (baseMesh) baseGroup.add(baseMesh.clone());
    if (hasRim && rimMesh) baseGroup.add(rimMesh.clone());
    baseGroup.updateMatrixWorld(true);

    const part1Name = hasRim
      ? `${baseFilename}_Part1_Back_Panel_With_Rim.stl`
      : `${baseFilename}_Part1_Back_Panel.stl`;
    zip.file(part1Name, generateBinaryStlBuffer(baseGroup));

    if (artworkMesh) {
      const artGroup = new THREE.Group();
      artGroup.add(artworkMesh.clone());
      artGroup.updateMatrixWorld(true);
      zip.file(`${baseFilename}_Part2_Top_Artwork.stl`, generateBinaryStlBuffer(artGroup));
    }
  } else {
    // 3-part AMS assembly (Base Rim + Infill Floor + Top Artwork)
    const baseGroup = new THREE.Group();
    if (baseMesh) baseGroup.add(baseMesh.clone());
    if (rimMesh) baseGroup.add(rimMesh.clone());
    baseGroup.updateMatrixWorld(true);
    zip.file(`${baseFilename}_Part1_Base_Rim.stl`, generateBinaryStlBuffer(baseGroup));

    if (accentMesh) {
      const accGroup = new THREE.Group();
      accGroup.add(accentMesh.clone());
      accGroup.updateMatrixWorld(true);
      zip.file(`${baseFilename}_Part2_Accent_Plate.stl`, generateBinaryStlBuffer(accGroup));
    }

    if (artworkMesh) {
      const artGroup = new THREE.Group();
      artGroup.add(artworkMesh.clone());
      artGroup.updateMatrixWorld(true);
      zip.file(`${baseFilename}_Part3_Top_Artwork.stl`, generateBinaryStlBuffer(artGroup));
    }
  }

  const readme = `=== BAMBU LAB AMS / PRUSA MMU GUIDE ===
1. Drag and drop all STL files from this zip together into Bambu Studio or OrcaSlicer.
2. When prompted: "Load these files as a single object with multiple parts?", click YES!
3. Assign your desired filament colors to each part.`;
  zip.file('Bambu_Orca_AMS_Guide.txt', readme);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${baseFilename}_AMS_MultiColor_Pack.zip`);
}

/**
 * Single-Color Printer (Print Separately & Glue):
 * - If 2-Color mode (no middle infill plate):
 *     Generates EXACTLY 2 STL files:
 *     1. Part_1_Back_Panel_With_Rim.stl (or Part_1_Back_Panel.stl if no rim) in Color A
 *     2. Part_2_Artwork_Flat.stl in Color B
 * - If 3-Color mode (with separate middle infill plate):
 *     Generates 3 STL files:
 *     1. Part_1_Base_With_Rim.stl in Color A
 *     2. Part_2_Infill_Floor_Flat.stl in Color B
 *     3. Part_3_Top_Artwork_Flat.stl in Color C/A
 */
export async function exportSingleColorGlueZip(
  { baseMesh, accentMesh, rimMesh, artworkMesh, hasRim },
  baseFilename = 'coaster_glue'
) {
  const zip = new JSZip();
  const isThreePart = Boolean(hasRim && accentMesh);

  if (!isThreePart) {
    // ==========================================
    // 2-COLOR MODE: EXACTLY 2 STL FILES GENERATED
    // ==========================================

    // Part 1: Solid Back Panel (includes Rim if hasRim is TRUE!)
    const baseGroup = new THREE.Group();
    if (baseMesh) baseGroup.add(baseMesh.clone());
    if (hasRim && rimMesh) baseGroup.add(rimMesh.clone());
    baseGroup.updateMatrixWorld(true);

    const part1Name = hasRim
      ? `${baseFilename}_Part1_Back_Panel_With_Rim.stl`
      : `${baseFilename}_Part1_Back_Panel.stl`;

    zip.file(part1Name, generateBinaryStlBuffer(baseGroup));

    // Part 2: Top Artwork (Flat on bed at Z = 0)
    if (artworkMesh) {
      const flatArt = artworkMesh.clone();
      flatArt.position.set(0, 0, 0); // Flat on bed!
      flatArt.updateMatrixWorld(true);
      zip.file(`${baseFilename}_Part2_Artwork_Flat.stl`, generateBinaryStlBuffer(flatArt));
    }

    const twoPartGuide = hasRim
      ? `=== 2-PIECE PRINT & GLUE ASSEMBLY GUIDE (RIM ON BACK PANEL) ===
Your coaster is designed as 2 separate parts for simple printing on ANY single-color 3D printer:

PART 1: ${part1Name}
- Print in Filament Color A (e.g. Black PLA, White PLA, or Slate Grey).
- The solid back foundation AND raised outer rim are printed together as ONE complete tray!

PART 2: ${baseFilename}_Part2_Artwork_Flat.stl
- Print in Filament Color B (e.g. Red, Silk Gold, White, or Neon Green).
- Prints completely flat on your build plate at Z = 0 for maximum bed adhesion.

ASSEMBLY (30 SECONDS):
1. Place Part 1 (the tray) on your table.
2. Apply small dots of CA gel superglue (Gorilla Super Glue Gel or Loctite Gel) to the back of Part 2.
3. Drop Part 2 inside the rim of Part 1 and press down firmly for 15 seconds.
Done! A crisp, professional 2-color framed coaster with zero purge waste and zero filament swaps!`
      : `=== 2-PIECE PRINT & GLUE ASSEMBLY GUIDE (NO BORDER) ===
Your coaster is designed as 2 separate parts for simple printing on ANY single-color 3D printer:

PART 1: ${part1Name}
- Print in Filament Color A (e.g. White, Red, Wood PLA, or Black).
- This is the complete solid foundation panel.

PART 2: ${baseFilename}_Part2_Artwork_Flat.stl
- Print in Filament Color B (e.g. Black, Silk Gold, or Red).
- Prints flat on your build plate.

ASSEMBLY (30 SECONDS):
1. Place Part 1 on your table.
2. Apply small dots of CA gel superglue to the back of Part 2.
3. Position Part 2 onto Part 1, press down for 15 seconds.
Done! A gorgeous 2-color coaster with zero filament change hassles.`;

    zip.file('2_Part_Assembly_Guide.txt', twoPartGuide);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${baseFilename}_2Part_Glue_Pack.zip`);
  } else {
    // ==========================================
    // 3-COLOR MODE: 3 STL FILES GENERATED
    // ==========================================

    // Part 1: Base with Raised Outer Rim (Pocket)
    const baseGroup = new THREE.Group();
    if (baseMesh) baseGroup.add(baseMesh.clone());
    if (rimMesh) baseGroup.add(rimMesh.clone());
    baseGroup.updateMatrixWorld(true);
    zip.file(`${baseFilename}_Part1_Base_With_Rim.stl`, generateBinaryStlBuffer(baseGroup));

    // Part 2: Infill Floor Plate (Flat on bed at Z = 0)
    if (accentMesh) {
      const flatAccent = accentMesh.clone();
      flatAccent.position.set(0, 0, 0);
      flatAccent.updateMatrixWorld(true);
      zip.file(`${baseFilename}_Part2_Infill_Floor_Flat.stl`, generateBinaryStlBuffer(flatAccent));
    }

    // Part 3: Top Artwork & Web (Flat on bed at Z = 0)
    if (artworkMesh) {
      const flatArt = artworkMesh.clone();
      flatArt.position.set(0, 0, 0);
      flatArt.updateMatrixWorld(true);
      zip.file(`${baseFilename}_Part3_Top_Artwork_Flat.stl`, generateBinaryStlBuffer(flatArt));
    }

    const threePartGuide = `=== 3-PIECE PRINT & GLUE ASSEMBLY GUIDE (WITH INFILL FLOOR) ===
Your coaster includes an outer rim and a separate middle infill floor, exported as 3 separate parts:

PART 1: ${baseFilename}_Part1_Base_With_Rim.stl
- Print in Color A (e.g. Black PLA). Has the outer rim forming an interior pocket.

PART 2: ${baseFilename}_Part2_Infill_Floor_Flat.stl
- Print in Color B (e.g. Red PLA). Drops into the pocket of Part 1.

PART 3: ${baseFilename}_Part3_Top_Artwork_Flat.stl
- Print in Color C or A (e.g. Black PLA). Glues onto the infill floor.

ASSEMBLY:
1. Glue Part 2 into the pocket of Part 1 with a few drops of CA gel glue.
2. Glue Part 3 on top of Part 2. Press firmly for 15 seconds.`;

    zip.file('3_Part_Assembly_Guide.txt', threePartGuide);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${baseFilename}_3Part_Glue_Pack.zip`);
  }
}

/**
 * Downloads the combined Back Panel and Rim as a single STL (Part 1).
 */
export function exportCombinedBaseAndRim(baseMesh, rimMesh, hasRim, partName = 'coaster_base') {
  const baseGroup = new THREE.Group();
  if (baseMesh) baseGroup.add(baseMesh.clone());
  if (hasRim && rimMesh) baseGroup.add(rimMesh.clone());
  baseGroup.updateMatrixWorld(true);
  exportObjectToBinaryStl(baseGroup, `${partName}.stl`);
}

/**
 * Downloads a single flat part for the glue assembly.
 */
export function exportSingleFlatPart(mesh, partName = 'coaster_part') {
  if (!mesh) return;
  const clone = mesh.clone();
  clone.position.set(0, 0, 0);
  clone.updateMatrixWorld(true);
  exportObjectToBinaryStl(clone, `${partName}.stl`);
}
