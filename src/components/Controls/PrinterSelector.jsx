import React from 'react';
import { Layers, Puzzle, Cpu, Palette, Sparkles, Check, ArrowUpRight, HelpCircle } from 'lucide-react';

export const PRINTER_MODES = [
  {
    id: 'single_glue',
    title: 'Single Color: Print & Glue',
    subtitle: 'Separate STLs for each color, assemble with glue',
    badge: 'Standard 3D Printer',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Puzzle,
    description:
      'Print each piece separately flat on your bed in different color filaments. Perfect for Ender-3, Neptune, Voron, or any single-nozzle printer with ZERO filament swaps or waste!',
    advantages: ['Zero purge waste', 'No filament changes mid-print', 'Flawless PEI surface finish on all parts'],
  },
  {
    id: 'single_swap',
    title: 'Single Color: Layer Swap (Klipper)',
    subtitle: '1 single print with automatic pause at Z-height',
    badge: 'Klipper / M600',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    icon: Cpu,
    description:
      'Prints as a single object. Klipper or Marlin pauses the printer at exact layer heights (e.g. Z = 2.2mm) to swap spools.',
    advantages: ['No glue needed', 'Solid monolithic print', 'Automated Klipper pause macro provided'],
  },
  {
    id: 'multi_ams',
    title: 'Multi-Color: Bambu AMS / MMU',
    subtitle: 'Multi-material assembly for AMS & toolchangers',
    badge: 'AMS / MMU Ready',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Palette,
    description:
      'Exports multi-part STLs with matching (0,0,0) origins. Bambu Studio, OrcaSlicer, and PrusaSlicer load them together as an automatic multi-color object.',
    advantages: ['Full automation', 'Bambu Studio 1-click import', 'Seamless color transitions'],
  },
];

export default function PrinterSelector({
  printerMode,
  setPrinterMode,
  explodedView,
  setExplodedView,
  onOpenExport,
  hasRim = true,
  hasAccent = true,
  setHasAccent,
}) {
  const isThreePart = Boolean(hasRim && hasAccent);

  return (
    <div className="space-y-5">
      {/* Printer Mode Cards */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Your 3D Printer Setup
        </label>

        <div className="space-y-2">
          {PRINTER_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = printerMode === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => setPrinterMode(mode.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{mode.title}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${mode.badgeColor}`}
                        >
                          {mode.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{mode.subtitle}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 animate-fade-in">
                    <p className="text-[11px] text-slate-400 leading-relaxed">{mode.description}</p>

                    {/* If Print & Glue is selected, show 2-part vs 3-part toggle when rim is on */}
                    {mode.id === 'single_glue' && hasRim && setHasAccent && (
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            Print & Glue Setup:
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {isThreePart ? '3 Parts / 3 STLs' : '2 Parts / 2 STLs'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHasAccent(false);
                            }}
                            className={`py-1 px-2 rounded-lg text-[11px] font-medium border transition-all ${
                              !isThreePart
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            2-Color (Rim on Back)
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHasAccent(true);
                            }}
                            className={`py-1 px-2 rounded-lg text-[11px] font-medium border transition-all ${
                              isThreePart
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            3-Color (With Infill Floor)
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mode.advantages.map((adv, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-sky-300 flex items-center space-x-1"
                        >
                          <span>✓</span>
                          <span>{adv}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exploded 3D Assembly Preview Slider */}
      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Exploded Assembly 3D View</span>
          </label>
          <span className="font-mono text-sky-400 font-bold text-xs">{Math.round(explodedView * 100)}%</span>
        </div>
        <p className="text-[11px] text-slate-400">
          {isThreePart
            ? 'Separate the 3 layers in 3D: Base with Rim, Middle Infill Floor Plate, and Top Artwork.'
            : hasRim
            ? 'Separate the 2 parts in 3D: Unified Back Panel with Rim, and Top Artwork.'
            : 'Separate the 2 parts in 3D: Solid Back Panel, and Top Artwork.'}
        </p>

        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodedView}
            onChange={(e) => setExplodedView(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          {explodedView > 0 && (
            <button
              onClick={() => setExplodedView(0)}
              className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md"
            >
              Reset (0%)
            </button>
          )}
        </div>
      </div>

      {/* Mode-Specific Actions */}
      <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Ready to Export?</span>
          <button
            onClick={onOpenExport}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>Open STL Exporter</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-slate-300">
          {printerMode === 'single_glue' &&
            (isThreePart
              ? 'Downloads 3 STLs (Base Rim + Infill Floor + Artwork) in a single ZIP or individually.'
              : hasRim
              ? 'Downloads 2 STLs (Back Panel with Rim + Artwork) in a single ZIP or individually.'
              : 'Downloads 2 STLs (Solid Back Panel + Artwork) in a single ZIP or individually.')}
          {printerMode === 'single_swap' &&
            'Download the Combined STL and copy your ready-to-use Klipper pause snippet.'}
          {printerMode === 'multi_ams' &&
            'Download the multi-material STL assembly pack with shared coordinates for Bambu Studio.'}
        </p>
      </div>
    </div>
  );
}
