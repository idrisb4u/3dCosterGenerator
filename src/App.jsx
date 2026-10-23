import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import Navbar from './components/Navbar';
import Viewport3D from './components/Viewport3D';
import ShapeControls from './components/Controls/ShapeControls';
import DesignControls from './components/Controls/DesignControls';
import TransformControls from './components/Controls/TransformControls';
import MaterialControls from './components/Controls/MaterialControls';
import SlicerAssistant from './components/Controls/SlicerAssistant';
import PrinterSelector from './components/Controls/PrinterSelector';
import ExportModal from './components/ExportModal';
import HelpModal from './components/HelpModal';

import { PREBUILT_SVGS } from './utils/prebuiltSvgs';
import { createTextSvg } from './utils/textToSvg';
import {
  createBaseShape,
  createAccentPlateGeometry,
  createRimGeometry,
  parseSvgToShapes,
  transformShapes,
  createArtworkGeometry,
} from './utils/geometryGenerator';

import {
  Sliders,
  Sparkles,
  Layers,
  Palette,
  Cpu,
  Download,
  AlertCircle,
  HelpCircle,
  Scissors,
  Printer,
  Puzzle,
} from 'lucide-react';

export default function App() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('design');
  const [activeDesignTab, setActiveDesignTab] = useState('prebuilt');

  // 3D Printer Mode Selection:
  // 'single_glue' = Single-color printer: Print separately & glue together
  // 'single_swap' = Single-color printer: Layer change swap with Klipper PAUSE / M600
  // 'multi_ams'   = Multi-color printer: Bambu AMS / Prusa MMU
  const [printerMode, setPrinterMode] = useState('single_glue');

  // Exploded Assembly View (0 = Assembled, 1 = Exploded)
  const [explodedView, setExplodedView] = useState(0);

  // Base Coaster Configuration
  const [shapeType, setShapeType] = useState('circle');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [cornerRadius, setCornerRadius] = useState(12);
  const [baseThickness, setBaseThickness] = useState(2.2);

  // Outer Rim (Border) Toggle
  // If hasRim is TRUE  => 3 STLs in Print & Glue (Base Rim + Infill Floor + Artwork)
  // If hasRim is FALSE => 2 STLs in Print & Glue (Solid Back Panel + Artwork)
  const [hasRim, setHasRim] = useState(true);
  const [rimWidth, setRimWidth] = useState(4.0);
  const [rimHeight, setRimHeight] = useState(1.4);
  const [hasChamfer, setHasChamfer] = useState(true);

  // Middle Accent Infill Plate (Active only when border is there)
  const [hasAccent, setHasAccent] = useState(true);
  const [accentThickness, setAccentThickness] = useState(1.0);

  // Artwork & SVG Configuration
  const [currentSvgId, setCurrentSvgId] = useState(PREBUILT_SVGS[0].id);
  const [currentSvgString, setCurrentSvgString] = useState(PREBUILT_SVGS[0].svg);
  const [designName, setDesignName] = useState(PREBUILT_SVGS[0].name);
  const [artMode, setArtMode] = useState('embossed');
  const [artworkHeight, setArtworkHeight] = useState(1.2);
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  // Custom Text Tool Configuration
  const [customTextConfig, setCustomTextConfig] = useState({
    text: 'S',
    fontId: 'calligraphy',
    borderStyle: 'circle-double',
    fontSize: 52,
  });

  // Material / Filament Colors
  const [baseColor, setBaseColor] = useState('#111827');
  const [accentColor, setAccentColor] = useState('#dc2626');
  const [rimColor, setRimColor] = useState('#111827');
  const [artworkColor, setArtworkColor] = useState('#111827');

  // Slicer Settings
  const [layerHeight, setLayerHeight] = useState(0.2);

  // Viewport Settings
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // Interior available size
  const interiorMargin = hasRim ? rimWidth * 2 + 6 : 8;
  const targetInteriorSize = Math.max(20, width - interiorMargin);

  // Total Z Height:
  // If border: base + accent + max(rim, art)
  // If no border: base + art
  const maxTotalZ = useMemo(() => {
    return (
      baseThickness +
      (hasRim && hasAccent ? accentThickness : 0) +
      Math.max(hasRim ? rimHeight : 0, artworkHeight)
    );
  }, [baseThickness, hasRim, hasAccent, accentThickness, rimHeight, artworkHeight]);

  const [layerCutHeight, setLayerCutHeight] = useState(maxTotalZ + 1);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 3D Meshes state
  const [baseMesh, setBaseMesh] = useState(null);
  const [accentMesh, setAccentMesh] = useState(null);
  const [rimMesh, setRimMesh] = useState(null);
  const [artworkMesh, setArtworkMesh] = useState(null);

  // Regenerate 3D Geometries
  useEffect(() => {
    // 1. Base Geometry (Solid Back Panel)
    const baseShape = createBaseShape({
      shapeType,
      width,
      height,
      cornerRadius,
    });

    const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
      depth: baseThickness,
      bevelEnabled: hasChamfer,
      bevelSegments: 2,
      bevelSize: 0.4,
      bevelThickness: 0.4,
    });
    baseGeom.computeVertexNormals();

    const newBaseMesh = new THREE.Mesh(baseGeom);
    newBaseMesh.position.set(0, 0, 0);
    setBaseMesh(newBaseMesh);

    // 2. Middle Accent Infill Plate (ONLY created if border hasRim is TRUE!)
    let zAboveBase = baseThickness;
    if (hasRim && hasAccent && accentThickness > 0) {
      const plateGeom = createAccentPlateGeometry({
        shapeType,
        width,
        height,
        cornerRadius,
        rimWidth,
        accentThickness,
      });
      if (plateGeom) {
        plateGeom.computeVertexNormals();
        const newPlateMesh = new THREE.Mesh(plateGeom);
        newPlateMesh.position.set(0, 0, baseThickness);
        setAccentMesh(newPlateMesh);
        zAboveBase += accentThickness;
      } else {
        setAccentMesh(null);
      }
    } else {
      setAccentMesh(null);
    }

    // 3. Rim Geometry (ONLY created if hasRim is TRUE!)
    if (hasRim && rimWidth > 0 && rimHeight > 0) {
      const rimGeom = createRimGeometry({
        shapeType,
        width,
        height,
        cornerRadius,
        rimWidth,
        rimHeight,
      });
      if (rimGeom) {
        rimGeom.computeVertexNormals();
        const newRimMesh = new THREE.Mesh(rimGeom);
        newRimMesh.position.set(0, 0, zAboveBase);
        setRimMesh(newRimMesh);
      } else {
        setRimMesh(null);
      }
    } else {
      setRimMesh(null);
    }

    // 4. Artwork Geometry
    if (currentSvgString) {
      const parsedShapes = parseSvgToShapes(currentSvgString);
      if (parsedShapes && parsedShapes.length > 0) {
        const transformed = transformShapes(parsedShapes, {
          targetSize: targetInteriorSize,
          scale,
          offsetX,
          offsetY,
          rotationDeg: rotation,
          flipX,
          flipY,
        });

        const artGeom = createArtworkGeometry(transformed, artworkHeight, true);
        if (artGeom) {
          artGeom.computeVertexNormals();
          const newArtMesh = new THREE.Mesh(artGeom);

          if (artMode === 'embossed') {
            newArtMesh.position.set(0, 0, zAboveBase);
          } else {
            newArtMesh.position.set(0, 0, Math.max(0.2, zAboveBase - artworkHeight));
          }

          setArtworkMesh(newArtMesh);
        } else {
          setArtworkMesh(null);
        }
      } else {
        setArtworkMesh(null);
      }
    } else {
      setArtworkMesh(null);
    }
  }, [
    shapeType,
    width,
    height,
    cornerRadius,
    baseThickness,
    hasRim,
    hasAccent,
    accentThickness,
    rimWidth,
    rimHeight,
    hasChamfer,
    currentSvgString,
    artMode,
    artworkHeight,
    scale,
    offsetX,
    offsetY,
    rotation,
    flipX,
    flipY,
    targetInteriorSize,
  ]);

  useEffect(() => {
    setLayerCutHeight(maxTotalZ + 1);
  }, [maxTotalZ]);

  const handleSelectPrebuilt = (item) => {
    setCurrentSvgId(item.id);
    setCurrentSvgString(item.svg);
    setDesignName(item.name);
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);

    if (item.id === 'spiderman-mask-head' || item.id === 'spiderman-web-coaster') {
      setHasAccent(true);
      setBaseColor('#111827');
      setAccentColor('#dc2626');
      setRimColor('#111827');
      setArtworkColor('#111827');
    } else if (item.id === 'batman-logo') {
      setHasAccent(true);
      setBaseColor('#18181b');
      setAccentColor('#f59e0b');
      setRimColor('#18181b');
      setArtworkColor('#18181b');
    } else if (item.category === 'alphabets_cal') {
      setHasAccent(true);
      setBaseColor('#0f172a');
      setAccentColor('#fef08a');
      setRimColor('#0f172a');
      setArtworkColor('#ca8a04');
    }
  };

  const handleCustomSvgUpload = (svgCode) => {
    setCurrentSvgId('custom-upload');
    setCurrentSvgString(svgCode);
    setDesignName('Custom Vector');
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
  };

  const handleUpdateTextConfig = async (partialConfig) => {
    const updated = { ...customTextConfig, ...partialConfig };
    setCustomTextConfig(updated);
    try {
      const generatedSvg = await createTextSvg(updated);
      setCurrentSvgId(`text-${updated.text}`);
      setCurrentSvgString(generatedSvg);
      setDesignName(`Monogram "${updated.text}"`);
    } catch (err) {
      console.error('Error generating text SVG:', err);
    }
  };

  const handleApplyPresetTemplate = (presetKey) => {
    switch (presetKey) {
      case 'spiderman':
        setShapeType('circle');
        setWidth(100);
        setBaseThickness(2.2);
        setHasRim(true); // Border is ON -> 3 STLs
        setHasAccent(true);
        setAccentThickness(1.0);
        setRimWidth(4.0);
        setRimHeight(1.4);
        setBaseColor('#111827');
        setAccentColor('#dc2626');
        setRimColor('#111827');
        setArtworkColor('#111827');
        handleSelectPrebuilt(PREBUILT_SVGS[0]);
        break;
      case 'calligraphy':
        setShapeType('octagon');
        setWidth(95);
        setBaseThickness(2.4);
        setHasRim(false); // Border is OFF -> 2 STLs!
        setHasAccent(false);
        setBaseColor('#0f172a');
        setArtworkColor('#fbbf24');
        const calS = PREBUILT_SVGS.find((s) => s.id === 'cal-s') || PREBUILT_SVGS[1];
        handleSelectPrebuilt(calS);
        setActiveSidebarTab('design');
        setActiveDesignTab('alphabets');
        break;
      case 'coffee':
        setShapeType('square');
        setWidth(95);
        setHeight(95);
        setCornerRadius(16);
        setBaseThickness(2.6);
        setHasRim(true);
        setHasAccent(true);
        setAccentThickness(1.0);
        setRimWidth(4.5);
        setRimHeight(1.4);
        setBaseColor('#271713');
        setAccentColor('#fef3c7');
        setRimColor('#271713');
        setArtworkColor('#451a03');
        handleSelectPrebuilt(PREBUILT_SVGS.find((s) => s.id === 'coffee-steam') || PREBUILT_SVGS[0]);
        break;
      case 'mandala':
        setShapeType('hexagon');
        setWidth(100);
        setBaseThickness(2.4);
        setHasRim(false); // No border -> 2 STLs!
        setHasAccent(false);
        setBaseColor('#020617');
        setArtworkColor('#38bdf8');
        handleSelectPrebuilt(PREBUILT_SVGS.find((s) => s.id === 'flower-of-life') || PREBUILT_SVGS[0]);
        break;
      default:
        break;
    }
  };

  const handleCenterArtwork = () => {
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleFitToCoaster = () => {
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        onOpenExport={() => setIsExportOpen(true)}
        isWireframe={isWireframe}
        setIsWireframe={setIsWireframe}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        onApplyPresetTemplate={handleApplyPresetTemplate}
        onOpenHelp={() => setIsHelpOpen(true)}
        printerMode={printerMode}
        setPrinterMode={setPrinterMode}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center 3D Viewport */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 min-h-[460px] lg:min-h-0 relative">
          <div className="flex-1 w-full relative">
            <Viewport3D
              baseMesh={baseMesh}
              accentMesh={accentMesh}
              rimMesh={rimMesh}
              artworkMesh={artworkMesh}
              baseColor={baseColor}
              accentColor={accentColor}
              rimColor={rimColor}
              artworkColor={artworkColor}
              dimensions={{
                width,
                height: shapeType === 'square' || shapeType === 'rectangle' ? height : width,
                baseThickness,
                hasAccent: hasRim && hasAccent,
                accentThickness,
                artworkHeight,
              }}
              layerCutHeight={layerCutHeight}
              maxCutHeight={maxTotalZ}
              isWireframe={isWireframe}
              autoRotate={autoRotate}
              explodedView={explodedView}
            />
          </div>

          {/* Slicing Simulation Scrub Bar */}
          <div className="mt-3 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 flex items-center space-x-4 shadow-lg">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 shrink-0">
              <Scissors className="w-4 h-4 text-sky-400" />
              <span>Layer Cut Preview:</span>
            </div>

            <div className="flex-1 flex items-center space-x-3">
              <input
                type="range"
                min="0.4"
                max={maxTotalZ}
                step={layerHeight}
                value={layerCutHeight > maxTotalZ ? maxTotalZ : layerCutHeight}
                onChange={(e) => setLayerCutHeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono text-sky-400 font-bold shrink-0 w-16 text-right">
                {layerCutHeight > maxTotalZ ? 'Full' : `${layerCutHeight.toFixed(2)} mm`}
              </span>
            </div>

            {layerCutHeight <= maxTotalZ && (
              <button
                onClick={() => setLayerCutHeight(maxTotalZ + 1)}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg shrink-0"
              >
                Reset Cut
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <div className="w-full lg:w-[460px] xl:w-[490px] bg-slate-900/95 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-4rem)]">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-800 p-2 bg-slate-950/60 overflow-x-auto scrollbar-none">
            {[
              { id: 'design', label: 'SVG Design', icon: Sparkles },
              { id: 'shape', label: 'Base & Border', icon: Sliders },
              { id: 'printer', label: '3D Printer', icon: Puzzle },
              { id: 'transform', label: 'Artwork 3D', icon: Layers },
              { id: 'material', label: 'Filaments', icon: Palette },
              { id: 'slicer', label: 'Klipper Guide', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id)}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeSidebarTab === 'design' && (
              <DesignControls
                currentSvgId={currentSvgId}
                onSelectPrebuilt={handleSelectPrebuilt}
                customSvgString={currentSvgString}
                onCustomSvgUpload={handleCustomSvgUpload}
                customTextConfig={customTextConfig}
                onUpdateTextConfig={handleUpdateTextConfig}
                activeDesignTab={activeDesignTab}
                setActiveDesignTab={setActiveDesignTab}
                scale={scale}
                setScale={setScale}
                targetInteriorSize={targetInteriorSize}
                offsetX={offsetX}
                setOffsetX={setOffsetX}
                offsetY={offsetY}
                setOffsetY={setOffsetY}
                onCenterArtwork={handleCenterArtwork}
                onFitToCoaster={handleFitToCoaster}
              />
            )}

            {activeSidebarTab === 'shape' && (
              <ShapeControls
                shapeType={shapeType}
                setShapeType={setShapeType}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
                cornerRadius={cornerRadius}
                setCornerRadius={setCornerRadius}
                baseThickness={baseThickness}
                setBaseThickness={setBaseThickness}
                hasAccent={hasAccent}
                setHasAccent={setHasAccent}
                accentThickness={accentThickness}
                setAccentThickness={setAccentThickness}
                hasRim={hasRim}
                setHasRim={setHasRim}
                rimWidth={rimWidth}
                setRimWidth={setRimWidth}
                rimHeight={rimHeight}
                setRimHeight={setRimHeight}
              />
            )}

            {activeSidebarTab === 'printer' && (
              <PrinterSelector
                printerMode={printerMode}
                setPrinterMode={setPrinterMode}
                explodedView={explodedView}
                setExplodedView={setExplodedView}
                onOpenExport={() => setIsExportOpen(true)}
                hasRim={hasRim}
                hasAccent={hasAccent}
                setHasAccent={setHasAccent}
              />
            )}

            {activeSidebarTab === 'transform' && (
              <TransformControls
                artworkHeight={artworkHeight}
                setArtworkHeight={setArtworkHeight}
                artMode={artMode}
                setArtMode={setArtMode}
                scale={scale}
                setScale={setScale}
                offsetX={offsetX}
                setOffsetX={setOffsetX}
                offsetY={offsetY}
                setOffsetY={setOffsetY}
                rotation={rotation}
                setRotation={setRotation}
                flipX={flipX}
                setFlipX={setFlipX}
                flipY={flipY}
                setFlipY={setFlipY}
                onCenterArtwork={handleCenterArtwork}
                onFitToCoaster={handleFitToCoaster}
              />
            )}

            {activeSidebarTab === 'material' && (
              <MaterialControls
                baseColor={baseColor}
                setBaseColor={setBaseColor}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                rimColor={rimColor}
                setRimColor={setRimColor}
                artworkColor={artworkColor}
                setArtworkColor={setArtworkColor}
                hasRim={hasRim}
                hasAccent={hasAccent}
                setHasAccent={setHasAccent}
              />
            )}

            {activeSidebarTab === 'slicer' && (
              <SlicerAssistant
                baseThickness={baseThickness}
                hasAccent={hasRim && hasAccent}
                accentThickness={accentThickness}
                artworkHeight={artworkHeight}
                hasRim={hasRim}
                rimHeight={rimHeight}
                width={width}
                height={height}
                shapeType={shapeType}
                layerHeight={layerHeight}
                setLayerHeight={setLayerHeight}
              />
            )}
          </div>

          {/* Bottom Export Action Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">Mode:</span>
              <span className="text-xs font-bold text-white truncate max-w-[190px]">
                {printerMode === 'single_glue'
                  ? hasRim && hasAccent
                    ? '🧩 Print & Glue (3 STLs)'
                    : '🧩 Print & Glue (2 STLs)'
                  : printerMode === 'single_swap'
                  ? '⏸️ Klipper Filament Swap'
                  : '🌈 Bambu Lab AMS Pack'}
              </span>
            </div>

            <button
              onClick={() => setIsExportOpen(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-all transform active:scale-95 text-white ${
                printerMode === 'single_glue'
                  ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25'
                  : printerMode === 'single_swap'
                  ? 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/25'
                  : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>
                {printerMode === 'single_glue'
                  ? hasRim && hasAccent
                    ? 'Download 3 STLs'
                    : 'Download 2 STLs'
                  : 'Export STL'}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        printerMode={printerMode}
        setPrinterMode={setPrinterMode}
        baseMesh={baseMesh}
        accentMesh={accentMesh}
        rimMesh={rimMesh}
        artworkMesh={artworkMesh}
        hasRim={hasRim}
        hasAccent={hasAccent}
        setHasAccent={setHasAccent}
        dimensions={{ width, height, baseThickness, artworkHeight }}
        shapeType={shapeType}
        designName={designName}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
