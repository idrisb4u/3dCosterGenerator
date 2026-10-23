import React from 'react';
import { Circle, Square, Hexagon, Shield, Heart, Octagon, Sliders, Layers, Sparkles, Puzzle } from 'lucide-react';

const SHAPE_OPTIONS = [
  { id: 'circle', name: 'Circle', icon: Circle, desc: 'Classic Round' },
  { id: 'square', name: 'Square / Rect', icon: Square, desc: 'Rounded Corners' },
  { id: 'hexagon', name: 'Hexagon', icon: Hexagon, desc: '6-Sided Modern' },
  { id: 'octagon', name: 'Octagon', icon: Octagon, desc: '8-Sided Geometric' },
  { id: 'heart', name: 'Heart', icon: Heart, desc: 'Valentine / Gift' },
  { id: 'shield', name: 'Shield Crest', icon: Shield, desc: 'Heraldic Badge' },
];

export default function ShapeControls({
  shapeType,
  setShapeType,
  width,
  setWidth,
  height,
  setHeight,
  cornerRadius,
  setCornerRadius,
  baseThickness,
  setBaseThickness,
  hasAccent,
  setHasAccent,
  accentThickness,
  setAccentThickness,
  hasRim,
  setHasRim,
  rimWidth,
  setRimWidth,
  rimHeight,
  setRimHeight,
}) {
  const isRect = shapeType === 'square' || shapeType === 'rectangle';

  return (
    <div className="space-y-6">
      {/* 1. Shape Selection */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 block">
          Coaster Base Shape
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SHAPE_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = shapeType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setShapeType(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500 text-sky-400 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-white">{item.name}</span>
                <span className="text-[10px] text-slate-400">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Dimensions */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Base Dimensions (mm)
        </label>

        {/* Width / Diameter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">{shapeType === 'circle' ? 'Diameter' : 'Width'}</span>
            <span className="font-mono font-semibold text-sky-400">{width} mm</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="60"
              max="150"
              step="1"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="60"
              max="150"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-center text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Height (only for Rectangle) */}
        {isRect && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Height</span>
              <span className="font-mono font-semibold text-sky-400">{height} mm</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="60"
                max="150"
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                min="60"
                max="150"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-center text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

        {/* Corner Radius (for Square/Rect) */}
        {isRect && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Corner Rounding</span>
              <span className="font-mono font-semibold text-sky-400">{cornerRadius} mm</span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 text-center text-xs font-mono text-slate-400">{cornerRadius} mm</span>
            </div>
          </div>
        )}

        {/* Base Solid Back Panel Thickness */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <div>
              <span className="text-slate-300">{hasRim ? 'Bottom Base Plate' : 'Solid Back Panel'}</span>
              <span className="block text-[10px] text-slate-400">
                {hasRim ? 'Foundation beneath the rim and pocket' : 'Entire solid panel printed in one color'}
              </span>
            </div>
            <span className="font-mono font-semibold text-sky-400">{baseThickness.toFixed(1)} mm</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="1.6"
              max="5.0"
              step="0.2"
              value={baseThickness}
              onChange={(e) => setBaseThickness(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-16 text-center text-xs font-mono text-white bg-slate-900 py-1 border border-slate-800 rounded-lg">
              {baseThickness.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>

      {/* 3. Outer Border (Rim) Toggle: Supports 2-Color (Rim on Back) or 3-Color (With Infill Floor) */}
      <div className="pt-2 border-t border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-200 block">Coaster Outer Border (Rim)</label>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                  hasRim
                    ? hasAccent
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-700/40 text-slate-300 border-slate-700'
                }`}
              >
                {hasRim
                  ? hasAccent
                    ? '3 STLs (INFILL FLOOR)'
                    : '2 STLs (RIM ON BACK PANEL)'
                  : '2 STLs (BORDERLESS)'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {hasRim
                ? hasAccent
                  ? '3-Color Mode: Base Rim + Infill Floor Plate + Artwork'
                  : '2-Color Mode: Rim printed together with Back Panel + Artwork'
                : 'Borderless Mode: Solid Back Panel + Artwork'}
            </span>
          </div>

          <button
            onClick={() => setHasRim(!hasRim)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              hasRim ? 'bg-sky-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                hasRim ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* If Border IS enabled: Show Rim adjustments & 2-Color vs 3-Color setup */}
        {hasRim ? (
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            {/* 2-Color vs 3-Color Selector */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Print & Color Architecture:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasAccent(false)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    !hasAccent
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">2-Color Print</span>
                    <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-500/30 text-emerald-200 font-bold">2 STLs</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                    Rim on Back Panel (Color A) + Artwork (Color B)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setHasAccent(true)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    hasAccent
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">3-Color Print</span>
                    <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/30 text-amber-200 font-bold">3 STLs</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                    Base Rim + Infill Floor + Artwork
                  </span>
                </button>
              </div>
            </div>

            {/* Rim Width & Height Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/60">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Rim Width</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="0.5"
                    value={rimWidth}
                    onChange={(e) => setRimWidth(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800"
                  />
                  <span className="text-xs font-mono text-slate-200">{rimWidth}mm</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Rim Height</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0.6"
                    max="3.0"
                    step="0.2"
                    value={rimHeight}
                    onChange={(e) => setRimHeight(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800"
                  />
                  <span className="text-xs font-mono text-slate-200">{rimHeight}mm</span>
                </div>
              </div>
            </div>

            {/* Infill Plate Thickness (ONLY shown when 3-color mode hasAccent is true) */}
            {hasAccent ? (
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Middle Infill Floor Thickness (Part 2)</span>
                  <span className="font-mono text-sky-400 font-semibold">{accentThickness.toFixed(1)} mm</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0.4"
                    max="2.0"
                    step="0.2"
                    value={accentThickness}
                    onChange={(e) => setAccentThickness(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800"
                  />
                  <span className="text-xs font-mono text-slate-300">{accentThickness.toFixed(1)} mm</span>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>2-Color Efficiency:</strong> The rim and back panel are united into 1 solid tray. The artwork will be printed flat in Color B and glued directly inside!
                </span>
              </div>
            )}
          </div>
        ) : (
          /* If Border is OFF: Show 2-Part Clean Mode Banner */
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-slate-300 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-300 font-semibold">
              <Puzzle className="w-3.5 h-3.5" />
              <span>2-Part Modular Mode Active:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The back panel will be exported as <strong>one solid piece</strong> in Color A, and the artwork as <strong>one piece</strong> in Color B. Glue Part 2 directly onto Part 1!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
