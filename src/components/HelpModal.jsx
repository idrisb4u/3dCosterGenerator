import React from 'react';
import { X, Cpu, Layers, HelpCircle, CheckCircle, ExternalLink, Printer } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">3D Printing & Klipper Guide</h2>
            <p className="text-xs text-slate-400">How to print multi-layer coasters with zero hassle</p>
          </div>
        </div>

        {/* Instructions Content */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Blank Back Layer + Front Layer Concept */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Multi-Layer Architecture</span>
            </h3>
            <p>
              Your coaster is designed with <strong>two distinct vertical zones</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>
                <strong className="text-slate-200">Blank Back Layer (0 to 3.0mm):</strong> A solid, watertight base that insulates against condensation heat/cold and provides rigidity.
              </li>
              <li>
                <strong className="text-slate-200">Front Artwork Layer (3.0mm to 4.2mm):</strong> The detailed SVG logo, Spider-Man emblem, or calligraphy monogram extruded on top.
              </li>
            </ul>
          </div>

          {/* Section 2: How to Print in Multi-Color on Klipper */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Printing Multi-Color with Klipper (Single Nozzle)</span>
            </h3>
            <p>
              You do <strong>not</strong> need an expensive dual-extruder or AMS! You can print vibrant two-tone coasters on any standard 3D printer running Klipper:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
              <li>
                Export the <strong>Combined Single STL</strong> from 3D Coaster Studio.
              </li>
              <li>
                Open the file in <strong>OrcaSlicer, PrusaSlicer, Bambu Studio, or Cura</strong>.
              </li>
              <li>
                Check the <strong>Slicer Assistant tab</strong> in this app for your exact filament swap layer (e.g. <em>Layer 16 at Z = 3.20mm</em>).
              </li>
              <li>
                In your slicer's vertical layer preview bar, right-click that layer and choose <strong>"Add Color Change"</strong> (or <strong>"Pause Print"</strong>).
              </li>
              <li>
                Start the print with your Base filament (e.g. Black). When Klipper reaches the swap layer, it will automatically pause and park the toolhead.
              </li>
              <li>
                Feed your second filament (e.g. Red for Spider-Man or Gold for monogram), purge the nozzle, and click <strong>Resume</strong> in Mainsail / Fluidd!
              </li>
            </ol>
          </div>

          {/* Section 3: Recommended Slicer Settings */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>Recommended Slicer Settings</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
              <div>• <strong>Layer Height:</strong> 0.20mm (or 0.16mm fine)</div>
              <div>• <strong>Infill:</strong> 15% - 25% Gyroid or Grid</div>
              <div>• <strong>Top/Bottom Layers:</strong> 4 solid layers</div>
              <div>• <strong>Perimeters/Walls:</strong> 3 walls</div>
              <div>• <strong>Top Surface Pattern:</strong> Monotonic Line</div>
              <div>• <strong>Ironing:</strong> Optional (for glassy finish)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Got It, Let's Design!
        </button>
      </div>
    </div>
  );
}
