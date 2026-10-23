import React from 'react';
import { Palette, Sparkles, Check, Layers } from 'lucide-react';

const COLOR_PRESETS = [
  {
    name: 'Spider-Man 2-Color (Black Tray + Red Art)',
    base: '#111827', // Black Rim & Back Panel
    accent: '#dc2626',
    rim: '#111827',
    art: '#dc2626', // Red Web & Spider
    badge: '2-Color Direct',
  },
  {
    name: 'Spider-Man 2-Color Inverted (Red Tray + Black Art)',
    base: '#dc2626', // Red Rim & Back Panel
    accent: '#111827',
    rim: '#dc2626',
    art: '#111827', // Black Web & Spider
    badge: '2-Color Inverted',
  },
  {
    name: 'Spider-Man 3-Color Classic (Photo Match)',
    base: '#111827', // Black
    accent: '#dc2626', // Red Infill Plate
    rim: '#111827', // Black Rim
    art: '#111827', // Black Web & Spider
    badge: '3-Color Photo Match',
  },
  {
    name: 'Dark Knight (Carbon Tray & Bat Gold)',
    base: '#18181b', // Carbon Black
    accent: '#f59e0b', // Yellow Accent Floor
    rim: '#18181b',
    art: '#f59e0b', // Bat Gold
    badge: 'Bat Signal',
  },
  {
    name: 'Royal Monogram (Navy & Silk Gold)',
    base: '#0f172a', // Navy
    accent: '#fef08a', // Pale Gold Disc
    rim: '#0f172a',
    art: '#ca8a04', // Silk Gold Monogram
    badge: 'Navy & Gold',
  },
  {
    name: 'Espresso Barista (Dark Brown & Cream)',
    base: '#271713', // Espresso Brown
    accent: '#fef3c7', // Cream Infill
    rim: '#271713',
    art: '#fef3c7', // Cream Art
    badge: 'Coffee Shop',
  },
  {
    name: 'Cyberpunk Neon (Midnight & Cyan)',
    base: '#020617', // Midnight
    accent: '#0891b2', // Cyan Glow Floor
    rim: '#020617',
    art: '#06b6d4', // Neon Cyan
    badge: 'Cyberpunk',
  },
  {
    name: 'Monochrome Minimalist (White & Black)',
    base: '#f8fafc', // White
    accent: '#0f172a', // Jet Black
    rim: '#f8fafc',
    art: '#0f172a', // Jet Black
    badge: 'Black & White',
  },
];

export default function MaterialControls({
  baseColor,
  setBaseColor,
  accentColor,
  setAccentColor,
  rimColor,
  setRimColor,
  artworkColor,
  setArtworkColor,
  hasRim,
  hasAccent,
  setHasAccent,
}) {
  const isThreePart = Boolean(hasRim && hasAccent);

  const applyPreset = (preset) => {
    setBaseColor(preset.base);
    setAccentColor(preset.accent);
    setRimColor(preset.rim);
    setArtworkColor(preset.art);
  };

  return (
    <div className="space-y-5">
      {/* Filament Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Filament Color Themes</span>
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COLOR_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left group"
            >
              <div className="flex -space-x-1 shrink-0">
                <span
                  className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                  style={{ backgroundColor: preset.base }}
                />
                {isThreePart && (
                  <span
                    className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                    style={{ backgroundColor: preset.accent }}
                  />
                )}
                <span
                  className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                  style={{ backgroundColor: preset.art }}
                />
              </div>
              <div className="truncate flex-1">
                <span className="text-xs font-medium text-white block truncate group-hover:text-sky-400">
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">{preset.badge}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Layer Color Customizers */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {isThreePart
              ? '3-Part Filament Colors (With Infill Floor)'
              : hasRim
              ? '2-Part Filament Colors (Rim on Back Panel)'
              : '2-Part Filament Colors (No Border)'}
          </label>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-400 border border-slate-700">
            {isThreePart ? '3 Colors' : '2 Colors'}
          </span>
        </div>

        {/* Quick 2-Color vs 3-Color Toggle when Rim is active */}
        {hasRim && setHasAccent && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setHasAccent(false)}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                !isThreePart
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>2 Colors (Rim on Back)</span>
            </button>
            <button
              type="button"
              onClick={() => setHasAccent(true)}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                isThreePart
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>3 Colors (Infill Floor)</span>
            </button>
          </div>
        )}

        {/* 1. Base / Back Panel */}
        <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-200 block">
              {isThreePart
                ? '1. Base & Rim (Color A)'
                : hasRim
                ? '1. Back Panel & Rim (Color A)'
                : '1. Solid Back Panel (Color A)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {isThreePart
                ? 'Base foundation and outer perimeter'
                : hasRim
                ? 'Back panel and outer rim printed together as one solid tray'
                : 'Entire solid coaster foundation'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400 uppercase">{baseColor}</span>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => {
                setBaseColor(e.target.value);
                setRimColor(e.target.value);
              }}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>
        </div>

        {/* 2. Middle Infill Floor (ONLY shown when 3-color mode is on) */}
        {isThreePart && (
          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-medium text-slate-200 block">2. Infill Floor Plate (Color B)</span>
              <span className="text-[10px] text-slate-400">Drops into the rim pocket under the web</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400 uppercase">{accentColor}</span>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
        )}

        {/* 3. Top Artwork */}
        <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
          <div>
            <span className="text-xs font-medium text-slate-200 block">
              {isThreePart
                ? '3. Top Web & Artwork (Color C)'
                : hasRim
                ? '2. Top Artwork (Color B)'
                : '2. Top Artwork (Color B)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {isThreePart
                ? 'Raised web, spider, or monogram details'
                : hasRim
                ? 'Glues directly inside the rim onto the back panel'
                : 'Glues directly onto the solid back panel'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400 uppercase">{artworkColor}</span>
            <input
              type="color"
              value={artworkColor}
              onChange={(e) => setArtworkColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
