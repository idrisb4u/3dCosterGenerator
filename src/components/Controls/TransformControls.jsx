import React from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Move, Maximize, Layers } from 'lucide-react';

export default function TransformControls({
  artworkHeight,
  setArtworkHeight,
  artMode, // 'embossed' | 'debossed'
  setArtMode,
  scale,
  setScale,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
  rotation,
  setRotation,
  flipX,
  setFlipX,
  flipY,
  setFlipY,
  onCenterArtwork,
  onFitToCoaster,
}) {
  return (
    <div className="space-y-5">
      {/* 1. Emboss vs Deboss Mode */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Layer 3D Style
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setArtMode('embossed')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              artMode === 'embossed'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Embossed (Raised)</span>
          </button>

          <button
            onClick={() => setArtMode('debossed')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              artMode === 'debossed'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 rotate-180" />
            <span>Debossed (Carved)</span>
          </button>
        </div>
      </div>

      {/* 2. Front Artwork Height */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300">
            {artMode === 'embossed' ? 'Raised Artwork Height' : 'Recessed Engraving Depth'}
          </span>
          <span className="font-mono font-semibold text-sky-400">{artworkHeight.toFixed(1)} mm</span>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0.4"
            max="3.0"
            step="0.2"
            value={artworkHeight}
            onChange={(e) => setArtworkHeight(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-16 text-center text-xs font-mono text-white bg-slate-900 py-1 border border-slate-800 rounded-lg">
            {artworkHeight.toFixed(1)} mm
          </span>
        </div>
      </div>

      {/* 3. Scale & Fit Controls */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300">Artwork Scale</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onFitToCoaster}
              className="text-[10px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20"
            >
              Fit Inside Rim
            </button>
            <span className="font-mono font-semibold text-sky-400">{Math.round(scale * 100)}%</span>
          </div>
        </div>
        <input
          type="range"
          min="0.3"
          max="1.8"
          step="0.05"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* 4. Position Offsets (X & Y) */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300">Position Offsets</span>
          <button
            onClick={onCenterArtwork}
            className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-md"
          >
            Center (0,0)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>X Offset</span>
              <span className="font-mono text-slate-200">{offsetX}mm</span>
            </div>
            <input
              type="range"
              min="-35"
              max="35"
              step="1"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Y Offset</span>
              <span className="font-mono text-slate-200">{offsetY}mm</span>
            </div>
            <input
              type="range"
              min="-35"
              max="35"
              step="1"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 5. Rotation & Flip */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300">Rotation & Flipping</span>
          <span className="font-mono text-sky-400 text-xs font-semibold">{rotation}°</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-800"
          />
          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
            title="+90 Degrees"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex space-x-2 pt-1">
          <button
            onClick={() => setFlipX(!flipX)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs border flex items-center justify-center space-x-1.5 transition-all ${
              flipX
                ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Flip X</span>
          </button>

          <button
            onClick={() => setFlipY(!flipY)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs border flex items-center justify-center space-x-1.5 transition-all ${
              flipY
                ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <FlipVertical className="w-3.5 h-3.5" />
            <span>Flip Y</span>
          </button>
        </div>
      </div>
    </div>
  );
}
