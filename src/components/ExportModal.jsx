import React, { useState } from 'react';
import {
  Download,
  X,
  Check,
  Box,
  Layers,
  FileDown,
  ShieldCheck,
  Printer,
  Puzzle,
  Palette,
  Cpu,
  Archive,
} from 'lucide-react';
import {
  exportCombinedCoasterStl,
  exportSingleColorGlueZip,
  exportMultiColorAmsZip,
  exportSingleFlatPart,
  exportCombinedBaseAndRim,
} from '../utils/stlExporter';

export default function ExportModal({
  isOpen,
  onClose,
  printerMode = 'single_glue',
  setPrinterMode,
  baseMesh,
  accentMesh,
  rimMesh,
  artworkMesh,
  hasRim = true,
  hasAccent = true,
  setHasAccent,
  dimensions,
  shapeType,
  designName,
}) {
  const [fileName, setFileName] = useState(
    `coaster_${shapeType}_${designName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  );
  const [downloadStatus, setDownloadStatus] = useState(null);

  if (!isOpen) return null;

  const isThreePart = Boolean(hasRim && hasAccent && accentMesh);

  const handleCombined = () => {
    exportCombinedCoasterStl({ baseMesh, accentMesh, rimMesh, artworkMesh, hasRim }, fileName);
    setDownloadStatus('combined');
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  const handleGlueZip = async () => {
    setDownloadStatus('zipping');
    await exportSingleColorGlueZip({ baseMesh, accentMesh, rimMesh, artworkMesh, hasRim }, fileName);
    setDownloadStatus('glue_zip');
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  const handleAmsZip = async () => {
    setDownloadStatus('zipping');
    await exportMultiColorAmsZip({ baseMesh, accentMesh, rimMesh, artworkMesh, hasRim }, fileName);
    setDownloadStatus('ams_zip');
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  const handleDownloadPart = (mesh, suffix) => {
    exportSingleFlatPart(mesh, `${fileName}_${suffix}`);
    setDownloadStatus(suffix);
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  const handleDownloadBaseAndRim = (suffix) => {
    exportCombinedBaseAndRim(baseMesh, rimMesh, hasRim, `${fileName}_${suffix}`);
    setDownloadStatus(suffix);
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Export 3D Print STL Files</h2>
            <p className="text-xs text-slate-400">
              {printerMode === 'single_glue'
                ? isThreePart
                  ? '3-Piece Border Assembly (Base Rim + Infill Floor + Artwork)'
                  : hasRim
                  ? '2-Piece Assembly (Rim Integrated on Back Panel + Artwork)'
                  : '2-Piece Clean Assembly (Solid Flat Back Panel + Artwork)'
                : 'Optimized for your selected printer workflow'}
            </p>
          </div>
        </div>

        {/* Printer Mode Selector Tabs inside Modal */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setPrinterMode('single_glue')}
            className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center text-center space-y-1 transition-all ${
              printerMode === 'single_glue'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span className="text-[11px] leading-tight">Print & Glue</span>
          </button>

          <button
            onClick={() => setPrinterMode('single_swap')}
            className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center text-center space-y-1 transition-all ${
              printerMode === 'single_swap'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span className="text-[11px] leading-tight">Klipper Swap</span>
          </button>

          <button
            onClick={() => setPrinterMode('multi_ams')}
            className={`py-2 px-2 rounded-lg flex flex-col items-center justify-center text-center space-y-1 transition-all ${
              printerMode === 'multi_ams'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="text-[11px] leading-tight">Bambu AMS</span>
          </button>
        </div>

        {/* File Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">File Base Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Quick 2-Color vs 3-Color Toggle when Rim is ON */}
        {hasRim && setHasAccent && (
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Coaster Layer Architecture:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasAccent(false)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                  !isThreePart
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>2 Colors (Rim on Back)</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-500/30 text-white">2 STLs</span>
              </button>

              <button
                type="button"
                onClick={() => setHasAccent(true)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                  isThreePart
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>3 Colors (Infill Floor)</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/30 text-white">3 STLs</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 1: PRINT SEPARATELY & GLUE TOGETHER */}
        {printerMode === 'single_glue' && (
          <div className="space-y-3.5 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Puzzle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    {isThreePart
                      ? '3-Part Glue Assembly (With Infill Floor)'
                      : hasRim
                      ? '2-Part Glue Assembly (Rim on Back Panel)'
                      : '2-Part Glue Assembly (No Border)'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isThreePart ? '3 STLs' : '2 STLs'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isThreePart
                    ? '3-Color Mode: Generates 3 STLs (Base with Rim, Infill Floor, and Top Artwork).'
                    : hasRim
                    ? '2-Color Mode: Generates EXACTLY 2 STLs! The rim and back panel are united into 1 solid tray in Color A, and artwork is in Color B.'
                    : 'Clean Mode: Generates EXACTLY 2 STLs! Solid flat back panel in Color A, and artwork in Color B.'}
                </p>
              </div>
            </div>

            {/* 1-Click ZIP Download */}
            <button
              onClick={handleGlueZip}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Archive className="w-4 h-4" />
              <span>
                {downloadStatus === 'glue_zip'
                  ? isThreePart
                    ? 'Downloaded 3 STLs Pack (ZIP)!'
                    : 'Downloaded 2 STLs Pack (ZIP)!'
                  : downloadStatus === 'zipping'
                  ? 'Packing ZIP...'
                  : isThreePart
                  ? 'Download Complete 3-Part Glue Assembly (ZIP)'
                  : hasRim
                  ? 'Download 2-Part Glue Assembly (Rim on Back Panel)'
                  : 'Download Complete 2-Part Glue Assembly (ZIP)'}
              </span>
            </button>

            {/* Individual Part Download Buttons */}
            <div className="pt-2 border-t border-emerald-500/20 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isThreePart ? 'Or Download Individual STLs (3 Parts):' : 'Or Download Individual STLs (2 Parts):'}
              </span>

              {isThreePart ? (
                // 3 Parts (Border + Infill Floor)
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDownloadPart(baseMesh, 'Part1_Base_With_Rim')}
                    className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1. Base With Rim</span>
                  </button>

                  {accentMesh && (
                    <button
                      onClick={() => handleDownloadPart(accentMesh, 'Part2_Infill_Floor_Flat')}
                      className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5 text-red-400" />
                      <span>2. Infill Floor</span>
                    </button>
                  )}

                  {artworkMesh && (
                    <button
                      onClick={() => handleDownloadPart(artworkMesh, 'Part3_Top_Artwork_Flat')}
                      className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5 text-sky-400" />
                      <span>3. Top Artwork</span>
                    </button>
                  )}
                </div>
              ) : hasRim ? (
                // 2 Parts (Rim on Back Panel)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadBaseAndRim('Part1_Back_Panel_With_Rim')}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    <span>1. Back Panel With Rim (Color A)</span>
                  </button>

                  {artworkMesh && (
                    <button
                      onClick={() => handleDownloadPart(artworkMesh, 'Part2_Artwork_Flat')}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center space-x-2 transition-colors"
                    >
                      <FileDown className="w-4 h-4 text-sky-400" />
                      <span>2. Top Artwork (Color B)</span>
                    </button>
                  )}
                </div>
              ) : (
                // 2 Parts (No Border)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadPart(baseMesh, 'Part1_Back_Panel')}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    <span>1. Solid Back Panel (Color A)</span>
                  </button>

                  {artworkMesh && (
                    <button
                      onClick={() => handleDownloadPart(artworkMesh, 'Part2_Artwork_Flat')}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center space-x-2 transition-colors"
                    >
                      <FileDown className="w-4 h-4 text-sky-400" />
                      <span>2. Top Artwork (Color B)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: SINGLE-COLOR LAYER SWAP (KLIPPER) */}
        {printerMode === 'single_swap' && (
          <div className="space-y-3.5 p-4 rounded-2xl border border-sky-500/40 bg-sky-500/5">
            <div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-bold text-white">Single-Color: Layer Swap (Klipper)</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Single unified STL. Slicer pauses with <code>PAUSE</code> or <code>M600</code> at the exact layer height to change filament spools.
              </p>
            </div>

            <button
              onClick={handleCombined}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>{downloadStatus === 'combined' ? 'Downloaded Combined STL!' : 'Download Combined Single STL'}</span>
            </button>
          </div>
        )}

        {/* MODE 3: MULTI-COLOR (BAMBU AMS / MMU) */}
        {printerMode === 'multi_ams' && (
          <div className="space-y-3.5 p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5">
            <div>
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Multi-Color: Bambu AMS / Prusa MMU</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isThreePart
                  ? '3-part assembly (Base Rim + Infill Floor + Artwork) with shared (0,0,0) origins for automatic multi-filament printing.'
                  : hasRim
                  ? '2-part assembly (Back Panel with Rim + Artwork) with shared (0,0,0) origins for automatic 2-color printing.'
                  : '2-part assembly (Flat Back Panel + Artwork) with shared (0,0,0) origins.'}
              </p>
            </div>

            <button
              onClick={handleAmsZip}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/25 transition-all"
            >
              <Archive className="w-4 h-4" />
              <span>
                {downloadStatus === 'ams_zip'
                  ? 'Downloaded AMS Multi-Material Pack!'
                  : downloadStatus === 'zipping'
                  ? 'Packing ZIP...'
                  : 'Download AMS Multi-Material Pack (ZIP)'}
              </span>
            </button>
          </div>
        )}

        {/* Quality Guarantees */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Watertight & Manifold Binary STL</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Printer className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Ready for Any FDM / Resin Slicer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
