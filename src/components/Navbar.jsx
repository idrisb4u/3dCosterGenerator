import React from 'react';
import { Download, Box, RotateCw, Eye, Sparkles, HelpCircle, Layers, Cpu, Puzzle, Palette } from 'lucide-react';

export default function Navbar({
  onOpenExport,
  isWireframe,
  setIsWireframe,
  autoRotate,
  setAutoRotate,
  onApplyPresetTemplate,
  onOpenHelp,
  printerMode,
  setPrinterMode,
}) {
  return (
    <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Box className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-base tracking-tight text-white">3D Coaster Studio</h1>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
              {printerMode === 'single_glue'
                ? 'PRINT & GLUE READY'
                : printerMode === 'single_swap'
                ? 'KLIPPER READY'
                : 'BAMBU AMS READY'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Multi-Layer Coaster CAD for 3D Printing</p>
        </div>
      </div>

      {/* 3D Printer Mode Selector Pills */}
      <div className="flex items-center space-x-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
        <button
          onClick={() => setPrinterMode('single_glue')}
          title="Single-Color Printer: Print each layer in different colors & glue together"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            printerMode === 'single_glue'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Print & Glue</span>
        </button>

        <button
          onClick={() => setPrinterMode('single_swap')}
          title="Single-Color Printer: Layer change filament swap (Klipper PAUSE / M600)"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            printerMode === 'single_swap'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Klipper Swap</span>
        </button>

        <button
          onClick={() => setPrinterMode('multi_ams')}
          title="Multi-Color Printer: Automatic multi-material (Bambu Lab AMS / Prusa MMU)"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            printerMode === 'multi_ams'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Bambu AMS</span>
        </button>
      </div>

      {/* Right Controls: View Toggles & Export CTA */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Turntable 360° Spin"
          className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
            autoRotate
              ? 'bg-sky-500/20 border-sky-500 text-sky-400'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          title="Toggle Wireframe View"
          className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
            isWireframe
              ? 'bg-sky-500/20 border-sky-500 text-sky-400'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHelp}
          title="3D Printing & Assembly Guide"
          className="p-2 rounded-xl border border-slate-700/60 bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenExport}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-all transform active:scale-95 text-white ${
            printerMode === 'single_glue'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25'
              : printerMode === 'single_swap'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/25'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>
            {printerMode === 'single_glue'
              ? 'Download STLs'
              : printerMode === 'single_swap'
              ? 'Export STL'
              : 'Export AMS Pack'}
          </span>
        </button>
      </div>
    </header>
  );
}
