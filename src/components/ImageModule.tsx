import React, { useState } from 'react';
import { 
  ImageIcon, 
  Sparkles, 
  Grid3X3, 
  Maximize2, 
  Calculator, 
  Palette, 
  Info,
  RotateCcw
} from 'lucide-react';
import { to8BitBinary } from '../utils/binaryMath';

export const ImageModule: React.FC = () => {
  // 13x10 bitmap from textbook p. 37 (PDF p. 47)
  const textbookInitialGrid: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [pixelGrid, setPixelGrid] = useState<number[][]>(textbookInitialGrid);
  const [selectedBitDepth, setSelectedBitDepth] = useState<number>(24);
  const [activeSubTab, setActiveSubTab] = useState<'grid-editor' | 'colour-depth' | 'calculator'>('grid-editor');

  // RGB Pixel Inspector state (Textbook p. 39 example: R=216, G=190, B=199 = #d8bec7)
  const [redVal, setRedVal] = useState<number>(216);
  const [greenVal, setGreenVal] = useState<number>(190);
  const [blueVal, setBlueVal] = useState<number>(199);

  // File size calculator state (Textbook p. 38, 40)
  const [calcWidth, setCalcWidth] = useState<number>(800);
  const [calcHeight, setCalcHeight] = useState<number>(600);
  const [calcBitDepth, setCalcBitDepth] = useState<number>(9); // 512 colours = 2^9 (Textbook review q. 4)
  const [calcMetadataPercent, setCalcMetadataPercent] = useState<number>(25);

  const togglePixel = (r: number, c: number) => {
    const next = pixelGrid.map((row, ri) => 
      row.map((val, ci) => (ri === r && ci === c ? (val === 1 ? 0 : 1) : val))
    );
    setPixelGrid(next);
  };

  const resetToTextbook = () => {
    setPixelGrid(textbookInitialGrid);
  };

  const clearGrid = () => {
    setPixelGrid(Array(10).fill(0).map(() => Array(13).fill(0)));
  };

  // 13x10 grid stats
  const totalPixels = 13 * 10;
  const totalBits1Bit = totalPixels * 1;
  const totalBytes1Bit = totalBits1Bit / 8;

  // Calculator calculations
  const rawBits = calcWidth * calcHeight * calcBitDepth;
  const rawBytes = rawBits / 8;
  const totalWithMetadata = rawBytes * (1 + calcMetadataPercent / 100);
  const totalKB = totalWithMetadata / 1000; // SI kilobyte
  const totalKiB = totalWithMetadata / 1024; // IEC kibibyte

  // Hex color for RGB inspector
  const hexColor = `#${redVal.toString(16).padStart(2, '0')}${greenVal.toString(16).padStart(2, '0')}${blueVal.toString(16).padStart(2, '0')}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                Textbook p. 37–43
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">A1.2.2 Representation of Images</span>
            </div>
            <h3 className="text-lg font-bold text-white">Bitmap Images: Pixels, Bit Depth & Calculations</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              First scanned digitally by Russell Kirsch in 1957. A bitmap represents graphics as a 2D matrix of pixels. 
              Each pixel's color is encoded in binary bits: higher bit depth yields more realistic color palettes but exponentially larger files.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-around">
            <button
              onClick={() => setActiveSubTab('grid-editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'grid-editor'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              13×10 Pixel Grid
            </button>
            <button
              onClick={() => setActiveSubTab('colour-depth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'colour-depth'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bit Depth & RGB
            </button>
            <button
              onClick={() => setActiveSubTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'calculator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Storage Calculator
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: 13x10 Grid Editor (Hodder p. 37) */}
      {activeSubTab === 'grid-editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Canvas */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-emerald-400" />
                  Interactive 13×10 Monochrome Bitmap (Textbook p. 37)
                </h4>
                <p className="text-xs text-slate-400">Click any cell to flip the pixel bit: 1 = Black (foreground), 0 = White (background).</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetToTextbook}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Reset Figure
                </button>
                <button
                  onClick={clearGrid}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Pixel Grid Display */}
            <div className="flex justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <div className="inline-grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 p-2 bg-slate-900 rounded-lg shadow-inner">
                {pixelGrid.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => togglePixel(rIdx, cIdx)}
                      title={`Pixel (${cIdx}, ${rIdx}) = ${val}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                        val === 1
                          ? 'bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {val}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Formula calculation card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-400 font-sans text-xs font-semibold">Image Size Formula (Textbook p. 37):</div>
              <div className="text-emerald-400 font-bold text-sm">
                image size = width (px) × height (px) × colour depth (bits)
              </div>
              <div className="text-slate-300">
                = 13 × 10 × 1 bit = <span className="text-cyan-300 font-bold">{totalBits1Bit} bits</span> ({totalBytes1Bit} bytes)
              </div>
              <p className="text-[11px] font-sans text-slate-400 pt-1">
                *Note: Real images also require metadata headers (dimensions, bit depth, palette tables) so the CPU knows how to render them.
              </p>
            </div>
          </div>

          {/* Raw Bit Stream & History */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                Raw Binary Stream in Memory
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                How this 130-bit image is serialized in physical computer RAM as a contiguous sequence of bytes:
              </p>
              
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 max-h-52 overflow-y-auto leading-relaxed break-all">
                {pixelGrid.flat().map((b, i) => (
                  <span key={i} className={i % 8 === 0 ? 'text-amber-400 font-bold' : ''}>
                    {i % 8 === 0 && i !== 0 ? ' ' : ''}{b}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/30 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-emerald-300">Russell Kirsch & Walden (1957):</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Russell Kirsch and his team at the US National Bureau of Standards created the world's first digital image scanner in 1957. 
                They scanned a 176×176 pixel photograph of Kirsch's three-month-old son Walden, storing each pixel as black or white in memory.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Colour Depth & RGB Zoom (Hodder p. 38–39) */}
      {activeSubTab === 'colour-depth' && (
        <div className="space-y-6">
          {/* Colour Depth Table & Visualizer */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  Colour Depth: Increasing the Amount of Colours (2^n)
                </h4>
                <p className="text-xs text-slate-400">
                  Select a bit depth to observe the number of simultaneous colors available and visual color banding (Textbook p. 38, 40).
                </p>
              </div>

              {/* Bit depth picker */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[1, 4, 8, 16, 24].map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBitDepth(b)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-mono font-semibold transition-all ${
                      selectedBitDepth === b
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {b}-bit
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Banding Preview Simulation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Color Gradient Rendering Simulation at <strong className="text-cyan-300 font-mono">{selectedBitDepth}-bit</strong>:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  2^{selectedBitDepth} = {selectedBitDepth === 24 ? '16,777,216 (16.8M)' : Math.pow(2, selectedBitDepth).toLocaleString()} Colours
                </span>
              </div>

              {/* Simulated banded color strip */}
              <div 
                className="h-14 rounded-lg border border-slate-700 shadow-inner transition-all flex items-center justify-center font-mono text-xs text-white drop-shadow"
                style={{
                  background: selectedBitDepth === 1
                    ? 'linear-gradient(to right, #000 50%, #fff 50%)'
                    : selectedBitDepth === 4
                    ? 'linear-gradient(to right, #000 0%, #300 25%, #800 50%, #c44 75%, #fff 100%)'
                    : selectedBitDepth === 8
                    ? 'linear-gradient(to right, #000, #332244, #664488, #9966cc, #ccaaff, #ffffff)'
                    : 'linear-gradient(to right, #050b14, #0d3b66, #00a896, #028090, #f0f3f4)'
                }}
              >
                <span className="bg-black/60 px-3 py-1 rounded backdrop-blur-sm">
                  {selectedBitDepth === 1 ? '1-Bit: Only 2 states (Monochrome / High Contrast)' :
                   selectedBitDepth <= 4 ? `${selectedBitDepth}-Bit: Severe Banding (Distinct Steps)` :
                   selectedBitDepth <= 8 ? '8-Bit: 256 colors (Mild Banding / Web 216 Palette)' :
                   '24-Bit: True Colour (Seamless Smooth Gradient, 16.8M)'}
                </span>
              </div>
            </div>

            {/* Common Colour Depths Table from Hodder p. 38 */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse bg-slate-950/60">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2.5 font-semibold">Colour Depth</th>
                    <th className="p-2.5 font-semibold">Calculation</th>
                    <th className="p-2.5 font-semibold">Number of Colours</th>
                    <th className="p-2.5 font-semibold">Common Usage (Textbook p. 38)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-300">
                  <tr className={selectedBitDepth === 1 ? 'bg-cyan-950/40 text-cyan-200' : ''}>
                    <td className="p-2.5 font-bold">1 bit</td>
                    <td className="p-2.5">2¹</td>
                    <td className="p-2.5">2</td>
                    <td className="p-2.5 font-sans text-slate-400">Simple graphics, monochrome displays</td>
                  </tr>
                  <tr className={selectedBitDepth === 4 ? 'bg-cyan-950/40 text-cyan-200' : ''}>
                    <td className="p-2.5 font-bold">4 bit</td>
                    <td className="p-2.5">2⁴</td>
                    <td className="p-2.5">16</td>
                    <td className="p-2.5 font-sans text-slate-400">Early computer graphics, retro game icons</td>
                  </tr>
                  <tr className={selectedBitDepth === 8 ? 'bg-cyan-950/40 text-cyan-200' : ''}>
                    <td className="p-2.5 font-bold">8 bit</td>
                    <td className="p-2.5">2⁸</td>
                    <td className="p-2.5">256</td>
                    <td className="p-2.5 font-sans text-slate-400">GIF images, simple web graphics</td>
                  </tr>
                  <tr className={selectedBitDepth === 16 ? 'bg-cyan-950/40 text-cyan-200' : ''}>
                    <td className="p-2.5 font-bold">16 bit</td>
                    <td className="p-2.5">2¹⁶</td>
                    <td className="p-2.5">65,536</td>
                    <td className="p-2.5 font-sans text-slate-400">High-colour images, some video formats</td>
                  </tr>
                  <tr className={selectedBitDepth === 24 ? 'bg-cyan-950/40 text-cyan-200' : ''}>
                    <td className="p-2.5 font-bold">24 bit (True Colour)</td>
                    <td className="p-2.5">2²⁴</td>
                    <td className="p-2.5 text-emerald-400 font-bold">16.8 million</td>
                    <td className="p-2.5 font-sans text-slate-400">Standard for photos/video (RGB 3 bytes)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive RGB Pixel Zoom (Hodder p. 39 Example) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-cyan-400" />
                Pixel Channel Zoom: RGB Calculator (Textbook p. 39 Example)
              </h4>
              <p className="text-xs text-slate-400">
                In 24-bit True Colour, each pixel is composed of 3 sub-pixel lights (Red, Green, Blue), each requiring 1 byte (0 to 255).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Sliders */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs text-red-400 font-mono mb-1">
                    <span>Red Channel (1 byte)</span>
                    <span>{redVal} (0x{redVal.toString(16).toUpperCase().padStart(2, '0')})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={redVal}
                    onChange={(e) => setRedVal(parseInt(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="text-[10px] font-mono text-slate-400">{to8BitBinary(redVal)}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-emerald-400 font-mono mb-1">
                    <span>Green Channel (1 byte)</span>
                    <span>{greenVal} (0x{greenVal.toString(16).toUpperCase().padStart(2, '0')})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={greenVal}
                    onChange={(e) => setGreenVal(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-[10px] font-mono text-slate-400">{to8BitBinary(greenVal)}</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-blue-400 font-mono mb-1">
                    <span>Blue Channel (1 byte)</span>
                    <span>{blueVal} (0x{blueVal.toString(16).toUpperCase().padStart(2, '0')})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={blueVal}
                    onChange={(e) => setBlueVal(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="text-[10px] font-mono text-slate-400">{to8BitBinary(blueVal)}</div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => { setRedVal(216); setGreenVal(190); setBlueVal(199); }}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
                  >
                    Load Textbook Dress Pixel (#D8BEC7)
                  </button>
                </div>
              </div>

              {/* Color Swatch & Hex */}
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div 
                  className="w-24 h-24 rounded-2xl shadow-2xl border-2 border-white/20 mb-3"
                  style={{ backgroundColor: `rgb(${redVal}, ${greenVal}, ${blueVal})` }}
                />
                <div className="text-xl font-bold font-mono text-white">
                  rgb({redVal}, {greenVal}, {blueVal})
                </div>
                <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                  Hex: {hexColor}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-2">
                  Total Bits: 8 + 8 + 8 = 24 bits (3 bytes)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Storage Size & Metadata Calculator (Hodder p. 40 Review Question 4) */}
      {activeSubTab === 'calculator' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              IB Exam Image Storage & Metadata Calculator (Textbook Review Question 4)
            </h4>
            <p className="text-xs text-slate-400">
              Calculate exact file requirements for arbitrary dimensions and bit depths, including metadata overheads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Width (pixels):</label>
                <input
                  type="number"
                  value={calcWidth}
                  onChange={(e) => setCalcWidth(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Height (pixels):</label>
                <input
                  type="number"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Colour Depth (bits per pixel):</span>
                  <span className="font-mono text-cyan-400 font-bold">{calcBitDepth} bits ({Math.pow(2, calcBitDepth)} colours)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={calcBitDepth}
                  onChange={(e) => setCalcBitDepth(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  *Tip: If supporting 512 distinct colours, 2⁹ = 512, so colour depth = 9 bits!
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Metadata Overhead:</span>
                  <span className="font-mono text-amber-400 font-bold">+{calcMetadataPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={calcMetadataPercent}
                  onChange={(e) => setCalcMetadataPercent(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setCalcWidth(800); setCalcHeight(600); setCalcBitDepth(9); setCalcMetadataPercent(25); }}
                  className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
                >
                  Load Textbook Q4 (800×600, 512 colours, +25%)
                </button>
              </div>
            </div>

            {/* Step-by-Step Exam Solution */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 font-mono text-xs space-y-3">
              <div className="text-cyan-400 font-bold uppercase text-xs font-sans">Step-by-Step Exam Calculation:</div>
              
              <div className="space-y-1.5 text-slate-300 border-b border-slate-800 pb-3">
                <div>1. Total Pixels = {calcWidth} × {calcHeight} = <span className="text-white font-bold">{(calcWidth * calcHeight).toLocaleString()} px</span></div>
                <div>2. Raw Bits = {(calcWidth * calcHeight).toLocaleString()} × {calcBitDepth} bits = <span className="text-cyan-300 font-bold">{rawBits.toLocaleString()} bits</span></div>
                <div>3. Raw Bytes = {rawBits.toLocaleString()} ÷ 8 = <span className="text-white font-bold">{rawBytes.toLocaleString()} bytes</span></div>
                <div>4. With {calcMetadataPercent}% Metadata = {rawBytes.toLocaleString()} × (1 + {calcMetadataPercent}/100) = <span className="text-amber-300 font-bold">{totalWithMetadata.toLocaleString()} bytes</span></div>
              </div>

              <div className="pt-1 space-y-2">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-sans text-slate-300">File size in Kilobytes (kB, ÷1000):</span>
                  <span className="text-emerald-400 text-sm font-bold">{totalKB.toFixed(2)} kB</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-sans text-slate-300">File size in Kibibytes (KiB, ÷1024):</span>
                  <span className="text-cyan-400 text-sm font-bold">{totalKiB.toFixed(2)} KiB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
