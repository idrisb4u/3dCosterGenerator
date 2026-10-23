import React, { useState } from 'react';
import { calculatePrintStats } from '../../utils/slicerHelpers';
import { Layers, Clock, Weight, Copy, Check, Info, Cpu, Play } from 'lucide-react';

export default function SlicerAssistant({
  baseThickness,
  hasAccent,
  accentThickness,
  artworkHeight,
  hasRim,
  rimHeight,
  width,
  height,
  shapeType,
  layerHeight = 0.2,
  setLayerHeight,
}) {
  const [copiedMacro, setCopiedMacro] = useState(false);

  const stats = calculatePrintStats({
    baseThickness,
    hasAccent,
    accentThickness,
    artworkHeight,
    hasRim,
    rimHeight,
    width,
    height,
    shapeType,
    layerHeight,
  });

  const klipperMacroSnippet = stats.hasAccent && stats.swap2_layer
    ? `; --- Klipper Dual Filament Swap (Reference 3-Layer Coaster) ---
; SWAP 1 at Layer ${stats.swap1_layer} (Z = ${stats.swap1_z}mm):
; Change filament from Base (Black) to Infill Plate (Red)
PAUSE

; SWAP 2 at Layer ${stats.swap2_layer} (Z = ${stats.swap2_z}mm):
; Change filament from Infill Plate (Red) back to Raised Web/Rim (Black)
PAUSE`
    : `; --- Klipper Single Filament Swap (2-Layer Coaster) ---
; SWAP at Layer ${stats.swap1_layer} (Z = ${stats.swap1_z}mm):
PAUSE ; Pause print for filament color change`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedMacro(true);
    setTimeout(() => setCopiedMacro(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* 1. Slicer Layer Setup */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Target Layer Height</span>
          </span>
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[0.16, 0.20, 0.28].map((lh) => (
              <button
                key={lh}
                onClick={() => setLayerHeight(lh)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  layerHeight === lh
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lh.toFixed(2)}mm
              </button>
            ))}
          </div>
        </div>

        {/* 3D Print Key Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-2 bg-slate-950/70 rounded-lg text-center">
            <span className="text-[10px] text-slate-400 block">Total Layers</span>
            <span className="text-sm font-bold font-mono text-white">{stats.totalLayers}</span>
          </div>

          <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-center">
            <span className="text-[10px] text-sky-400 font-semibold block">Swap 1 (Infill)</span>
            <span className="text-sm font-bold font-mono text-sky-300">
              L{stats.swap1_layer} ({stats.swap1_z}mm)
            </span>
          </div>

          {stats.hasAccent && stats.swap2_layer ? (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <span className="text-[10px] text-red-400 font-semibold block">Swap 2 (Web/Rim)</span>
              <span className="text-sm font-bold font-mono text-red-300">
                L{stats.swap2_layer} ({stats.swap2_z}mm)
              </span>
            </div>
          ) : (
            <div className="p-2 bg-slate-950/70 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block">Total Height</span>
              <span className="text-sm font-bold font-mono text-white">{stats.maxZ} mm</span>
            </div>
          )}
        </div>

        {/* Print Weight & Time Estimation */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 px-1 border-t border-slate-800/50">
          <span className="flex items-center space-x-1.5">
            <Weight className="w-3.5 h-3.5 text-slate-400" />
            <span>Filament: ~{stats.estimatedWeightGrams}g PLA</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Time: ~{stats.estimatedMinutes} min</span>
          </span>
        </div>
      </div>

      {/* 2. Klipper Instructions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Klipper G-Code / Pause Commands</span>
          </label>
          <button
            onClick={() => copyToClipboard(klipperMacroSnippet)}
            className="flex items-center space-x-1 text-[11px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20"
          >
            {copiedMacro ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedMacro ? 'Copied!' : 'Copy Snippet'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
            {klipperMacroSnippet}
          </pre>
        </div>

        {/* Step-by-Step Print Walkthrough */}
        <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-2 leading-relaxed">
          <div className="font-semibold text-white flex items-center space-x-1.5">
            <span>How to Print this Reference Spider-Man Coaster:</span>
          </div>

          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
              1
            </span>
            <span>
              Export the <strong>Combined Single STL</strong> and load it into OrcaSlicer, PrusaSlicer, or Bambu Studio.
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
              2
            </span>
            <span>
              Right-click <strong>Layer {stats.swap1_layer} ({stats.swap1_z}mm)</strong> $\rightarrow$ Add <em>Change Filament / Pause</em> (to swap to <strong>Red</strong>).
            </span>
          </div>

          {stats.hasAccent && stats.swap2_layer && (
            <div className="flex items-start space-x-2">
              <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                3
              </span>
              <span>
                Right-click <strong>Layer {stats.swap2_layer} ({stats.swap2_z}mm)</strong> $\rightarrow$ Add <em>Change Filament / Pause</em> (to swap back to <strong>Black</strong>).
              </span>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
              {stats.hasAccent ? '4' : '3'}
            </span>
            <span>
              Print! Klipper automatically pauses at each exact height for toolhead parking and seamless filament swapping!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
