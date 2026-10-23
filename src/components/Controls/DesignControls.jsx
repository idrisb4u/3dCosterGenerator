import React, { useState } from 'react';
import { PREBUILT_CATEGORIES, PREBUILT_SVGS } from '../../utils/prebuiltSvgs';
import { FONT_OPTIONS, BORDER_STYLES } from '../../utils/textToSvg';
import { Upload, Type, Sparkles, FileText, Check, Search, Maximize2, Move, Sliders } from 'lucide-react';

export default function DesignControls({
  currentSvgId,
  onSelectPrebuilt,
  customSvgString,
  onCustomSvgUpload,
  customTextConfig,
  onUpdateTextConfig,
  activeDesignTab,
  setActiveDesignTab,
  // Sizing & Positioning props
  scale,
  setScale,
  targetInteriorSize = 65,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
  onCenterArtwork,
  onFitToCoaster,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pastedSvg, setPastedSvg] = useState('');
  const [uploadError, setUploadError] = useState(null);

  // Current physical size in mm
  const currentSizeMm = Math.round(targetInteriorSize * scale);

  const handleSizeMmChange = (newSizeMm) => {
    const newScale = Math.max(0.2, Math.min(2.0, newSizeMm / targetInteriorSize));
    setScale(newScale);
  };

  const filteredSvgs = PREBUILT_SVGS.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'alphabets' && (item.category === 'alphabets_cal' || item.category === 'alphabets_bold'));
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      setUploadError('Please select a valid .svg vector file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (typeof content === 'string' && content.includes('<svg')) {
        onCustomSvgUpload(content);
      } else {
        setUploadError('Invalid SVG file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPastedSvg = () => {
    setUploadError(null);
    if (!pastedSvg.trim()) return;
    if (!pastedSvg.includes('<svg') || !pastedSvg.includes('</svg>')) {
      setUploadError('Text must be a valid SVG snippet with <svg>...</svg> tags.');
      return;
    }
    onCustomSvgUpload(pastedSvg);
  };

  return (
    <div className="space-y-5">
      {/* 1. Dedicated Inner Artwork Sizing Card */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-sky-500/30 space-y-3 shadow-lg shadow-sky-500/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Inner Artwork Size</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={onFitToCoaster}
              className="text-[10px] text-sky-400 hover:text-white bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-500/30 font-medium transition-colors"
            >
              Fit Inside Rim
            </button>
            <span className="font-mono font-bold text-sky-400 text-xs">{currentSizeMm} mm</span>
          </div>
        </div>

        {/* Size Slider in Millimeters */}
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="20"
            max={Math.round(targetInteriorSize * 1.3)}
            step="1"
            value={currentSizeMm}
            onChange={(e) => handleSizeMmChange(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono font-semibold text-slate-300 w-12 text-right">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Quick Size Presets */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
          <span className="text-slate-400">Quick Sizes:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => handleSizeMmChange(45)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
            >
              45mm
            </button>
            <button
              onClick={() => handleSizeMmChange(60)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
            >
              60mm
            </button>
            <button
              onClick={() => handleSizeMmChange(75)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
            >
              75mm
            </button>
            <button
              onClick={onCenterArtwork}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[10px]"
            >
              Center (0,0)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Design Category Selection Tabs */}
      <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveDesignTab('prebuilt')}
          className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeDesignTab === 'prebuilt'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          onClick={() => setActiveDesignTab('alphabets')}
          className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeDesignTab === 'alphabets'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="font-serif font-bold text-sm">A</span>
          <span>Letters</span>
        </button>

        <button
          onClick={() => setActiveDesignTab('custom_text')}
          className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeDesignTab === 'custom_text'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text Tool</span>
        </button>

        <button
          onClick={() => setActiveDesignTab('upload')}
          className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeDesignTab === 'upload'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* TAB 1: PREBUILT DESIGNS */}
      {activeDesignTab === 'prebuilt' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Spider-Man, Batman, Coffee, Mandala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All' },
                { id: 'pop', label: 'Spider-Man & Heroes' },
                { id: 'drinks', label: 'Coffee & Beer' },
                { id: 'patterns', label: 'Mandalas & Patterns' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-slate-800 text-sky-400 font-medium border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-300 bg-slate-900/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {filteredSvgs
              .filter((item) => item.category !== 'alphabets_cal' && item.category !== 'alphabets_bold')
              .map((item) => {
                const isSelected = currentSvgId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectPrebuilt(item)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-left transition-all relative group ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500 text-sky-400 shadow-md shadow-sky-500/10'
                        : 'bg-slate-900/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className="w-14 h-14 mb-2 flex items-center justify-center p-1 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-200 group-hover:text-sky-400 transition-colors"
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span className="text-xs font-semibold text-white truncate w-full text-center">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate w-full text-center">
                      {item.description}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: ALPHABETS & MONOGRAMS (A-Z) */}
      {activeDesignTab === 'alphabets' && (
        <div className="space-y-4">
          <div className="flex p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedCategory('alphabets_cal')}
              className={`flex-1 py-1.5 rounded-lg font-serif transition-colors ${
                selectedCategory === 'alphabets_cal' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Calligraphy Script (A-Z)
            </button>
            <button
              onClick={() => setSelectedCategory('alphabets_bold')}
              className={`flex-1 py-1.5 rounded-lg font-sans transition-colors ${
                selectedCategory === 'alphabets_bold' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Modern Bold (A-Z)
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {PREBUILT_SVGS.filter((item) =>
              selectedCategory === 'alphabets_bold'
                ? item.category === 'alphabets_bold'
                : item.category === 'alphabets_cal'
            ).map((item) => {
              const isSelected = currentSvgId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPrebuilt(item)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span className="text-[10px] font-mono mt-1 text-slate-400">{item.letter}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM TEXT & TYPOGRAPHY TOOL */}
      {activeDesignTab === 'custom_text' && (
        <div className="space-y-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Custom Letter / Name / Word
            </label>
            <input
              type="text"
              maxLength={15}
              value={customTextConfig.text}
              onChange={(e) => onUpdateTextConfig({ text: e.target.value })}
              placeholder="e.g. S, COFFEE, DAD"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">Typography Font Style</label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdateTextConfig({ fontId: font.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    customTextConfig.fontId === font.id
                      ? 'bg-sky-500/15 border-sky-500 text-sky-400'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold text-white block">{font.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{font.sample}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">Monogram Crest Frame</label>
            <select
              value={customTextConfig.borderStyle}
              onChange={(e) => onUpdateTextConfig({ borderStyle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {BORDER_STYLES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* TAB 4: UPLOAD / PASTE CUSTOM SVG */}
      {activeDesignTab === 'upload' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all text-center">
            <Upload className="w-7 h-7 text-sky-400 mb-2" />
            <span className="text-xs font-semibold text-white">Click or drag & drop SVG file</span>
            <span className="text-[10px] text-slate-400 mt-1">Accepts any standard .svg vector graphic</span>
            <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Or Paste Raw SVG Code</span>
              {customSvgString && <span className="text-emerald-400 text-[10px]">Custom SVG Active</span>}
            </div>
            <textarea
              rows={4}
              value={pastedSvg}
              onChange={(e) => setPastedSvg(e.target.value)}
              placeholder="<svg viewBox='0 0 100 100'>&#10;  <path d='...' />&#10;</svg>"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={handleApplyPastedSvg}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-white transition-colors"
            >
              Apply SVG Code
            </button>
          </div>

          {uploadError && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
              {uploadError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
