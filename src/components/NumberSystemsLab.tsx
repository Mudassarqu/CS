import React, { useState } from 'react';
import { 
  Binary, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Calculator, 
  HelpCircle, 
  BookOpen, 
  Cpu, 
  History, 
  Layers, 
  Zap,
  Gauge
} from 'lucide-react';
import { to8BitBinary } from '../utils/binaryMath';

export const NumberSystemsLab: React.FC = () => {
  const [decimalVal, setDecimalVal] = useState<number>(42); // Default from textbook p. 27
  const [activeSubTab, setActiveSubTab] = useState<'converter' | 'methods' | 'hex' | 'prefixes' | 'history'>('converter');
  const [interactiveBits, setInteractiveBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]); // 42

  // Sync interactiveBits when decimalVal changes
  const handleDecimalChange = (val: number) => {
    const clamped = Math.max(0, Math.min(255, val));
    setDecimalVal(clamped);
    const binStr = clamped.toString(2).padStart(8, '0');
    setInteractiveBits(binStr.split('').map(b => parseInt(b)));
  };

  const toggleBit = (idx: number) => {
    const updated = [...interactiveBits];
    updated[idx] = updated[idx] === 1 ? 0 : 1;
    setInteractiveBits(updated);
    const newDec = updated.reduce((acc, bit, i) => acc + (bit ? Math.pow(2, 7 - i) : 0), 0);
    setDecimalVal(newDec);
  };

  // Convert to various bases
  const binaryString = decimalVal.toString(2).padStart(8, '0');
  const hexString = decimalVal.toString(16).toUpperCase().padStart(2, '0');
  const ternaryString = decimalVal.toString(3); // Base-3 for Setun computer

  // Doubling method steps for binaryString (Textbook p. 26-27)
  const doublingSteps: { step: number; bit: number; calculation: string; total: number }[] = [];
  let runningTotal = 0;
  for (let i = 0; i < binaryString.length; i++) {
    const bit = parseInt(binaryString[i]);
    if (i === 0) {
      runningTotal = bit;
      doublingSteps.push({
        step: 1,
        bit,
        calculation: 'Initial value from MSB',
        total: runningTotal
      });
    } else {
      const calcStr = `${runningTotal} × 2 + ${bit} = ${runningTotal * 2 + bit}`;
      runningTotal = runningTotal * 2 + bit;
      doublingSteps.push({
        step: i + 1,
        bit,
        calculation: calcStr,
        total: runningTotal
      });
    }
  }

  // Division by 2 steps for decimalVal (Textbook p. 27)
  const divisionSteps: { step: number; division: string; quotient: number; remainder: number }[] = [];
  let tempQuotient = decimalVal;
  let divStepCount = 1;
  if (tempQuotient === 0) {
    divisionSteps.push({ step: 1, division: '0 / 2', quotient: 0, remainder: 0 });
  } else {
    while (tempQuotient > 0) {
      const q = Math.floor(tempQuotient / 2);
      const r = tempQuotient % 2;
      divisionSteps.push({
        step: divStepCount++,
        division: `${tempQuotient} / 2`,
        quotient: q,
        remainder: r
      });
      tempQuotient = q;
    }
  }

  // Subtraction method steps (Textbook p. 28)
  const powersOfTwo = [128, 64, 32, 16, 8, 4, 2, 1];
  let remainingForSub = decimalVal;
  const subtractionSteps = powersOfTwo.map(p => {
    if (p <= remainingForSub) {
      const remainder = remainingForSub - p;
      const res = { power: p, fits: true, remainder, prev: remainingForSub };
      remainingForSub = remainder;
      return res;
    } else {
      return { power: p, fits: false, remainder: remainingForSub, prev: remainingForSub };
    }
  });

  // Hex conversion steps: Nibble splitting (Textbook p. 29)
  const nibble1 = binaryString.slice(0, 4);
  const nibble2 = binaryString.slice(4);
  const nibble1Dec = parseInt(nibble1, 2);
  const nibble2Dec = parseInt(nibble2, 2);
  const nibble1Hex = nibble1Dec.toString(16).toUpperCase();
  const nibble2Hex = nibble2Dec.toString(16).toUpperCase();

  // Division by 16 steps (Textbook p. 30)
  const hexQ = Math.floor(decimalVal / 16);
  const hexR = decimalVal % 16;
  const hexRChar = hexR.toString(16).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                Textbook p. 24–31 (PDF p. 34–41)
              </span>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Topic A1.2.1 Methods of Representing Data</span>
            </div>
            <h3 className="text-lg font-bold text-white">Number Systems: Binary, Decimal, Hexadecimal & Ternary</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Why did modern computing settle on base-2 binary? Explore early mechanical decimals (Babbage), Soviet ternary computers (Setun 1958), 
              the noise immunity of two-state transistors, and master all conversion methods from the IB DP syllabus.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('converter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSubTab === 'converter' ? 'bg-blue-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Converter
            </button>
            <button
              onClick={() => setActiveSubTab('methods')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSubTab === 'methods' ? 'bg-blue-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Conversion Methods
            </button>
            <button
              onClick={() => setActiveSubTab('hex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSubTab === 'hex' ? 'bg-blue-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hexadecimal & Nibbles
            </button>
            <button
              onClick={() => setActiveSubTab('prefixes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSubTab === 'prefixes' ? 'bg-blue-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bits vs Bytes & Prefixes
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSubTab === 'history' ? 'bg-blue-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Why Binary Won
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Interactive Converter & Place Values */}
      {activeSubTab === 'converter' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-blue-400" />
                  Interactive 8-Bit Place Value Switchboard
                </h4>
                <p className="text-xs text-slate-400">
                  Click any bit switch to toggle 0 and 1, or enter a decimal number below (0 to 255).
                </p>
              </div>

              {/* Presets from Textbook Exercises */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400">Textbook Examples:</span>
                {[42, 33, 187, 20, 87, 123, 255].map(pVal => (
                  <button
                    key={pVal}
                    onClick={() => handleDecimalChange(pVal)}
                    className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 font-mono"
                  >
                    {pVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Clickable 8-Bit Place Values */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
              {interactiveBits.map((bit, idx) => {
                const placeVal = Math.pow(2, 7 - idx);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">
                      2^{7 - idx} ({placeVal})
                    </span>
                    <button
                      onClick={() => toggleBit(idx)}
                      className={`w-12 h-16 sm:w-14 sm:h-20 rounded-xl font-mono text-2xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                        bit === 1
                          ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-slate-950 border border-cyan-300 shadow-cyan-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      <span>{bit}</span>
                      <span className="text-[10px] font-normal opacity-70">bit {7 - idx}</span>
                    </button>
                    <span className={`text-[11px] font-mono font-bold mt-1.5 ${bit === 1 ? 'text-cyan-400' : 'text-slate-600'}`}>
                      +{bit === 1 ? placeVal : 0}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Number System Representations Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Decimal (Base 10)</span>
                <div className="text-3xl font-extrabold font-mono text-white">{decimalVal}₁₀</div>
                <div className="text-[10px] text-slate-400 mt-1">Sum of active powers of 2</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 text-center">
                <span className="text-xs text-slate-400 block mb-1">Binary (Base 2)</span>
                <div className="text-2xl font-extrabold font-mono text-cyan-300 tracking-wider">{binaryString}₂</div>
                <div className="text-[10px] text-slate-400 mt-1">8 bits (1 byte)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 text-center">
                <span className="text-xs text-slate-400 block mb-1">Hexadecimal (Base 16)</span>
                <div className="text-3xl font-extrabold font-mono text-amber-400">0x{hexString}₁₆</div>
                <div className="text-[10px] text-slate-400 mt-1">2 nibbles ({nibble1Hex} {nibble2Hex})</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 text-center">
                <span className="text-xs text-slate-400 block mb-1">Ternary (Base 3 - Setun)</span>
                <div className="text-2xl font-extrabold font-mono text-purple-300">{ternaryString}₃</div>
                <div className="text-[10px] text-slate-400 mt-1">Soviet Setun computer 1958</div>
              </div>
            </div>

            {/* Decimal Input Slider */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <span className="text-xs text-slate-400 whitespace-nowrap">Adjust Decimal Slider:</span>
              <input
                type="range"
                min="0"
                max="255"
                value={decimalVal}
                onChange={(e) => handleDecimalChange(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="font-mono text-sm text-cyan-300 font-bold min-w-[3rem] text-right">{decimalVal}</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Conversion Methods Step-by-Step (Hodder pp. 26–28) */}
      {activeSubTab === 'methods' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Method 1: Doubling Method (Textbook p. 26-27) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">Method 1</span>
                <h4 className="text-sm font-bold text-white">The Doubling Method (Binary to Decimal)</h4>
              </div>
              <p className="text-xs text-slate-400">
                Rule from textbook p. 26: "Start with the leftmost bit (MSB). Double the current total and add the next bit. Repeat until all bits are processed."
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-center text-xs border-collapse bg-slate-950 font-mono">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2 border-r border-slate-800">Step</th>
                    <th className="p-2 border-r border-slate-800">Binary Bit</th>
                    <th className="p-2 border-r border-slate-800">Calculation</th>
                    <th className="p-2 text-cyan-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {doublingSteps.map((s) => (
                    <tr key={s.step} className="hover:bg-slate-900/40">
                      <td className="p-2 border-r border-slate-800 text-slate-400">{s.step}</td>
                      <td className="p-2 border-r border-slate-800 font-bold text-white">{s.bit}</td>
                      <td className="p-2 border-r border-slate-800 text-[11px] text-slate-400">{s.calculation}</td>
                      <td className="p-2 font-bold text-cyan-300">{s.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-cyan-800/40 text-xs font-mono text-slate-300">
              Final Result: <span className="text-cyan-400 font-bold">{binaryString}₂ = {decimalVal}₁₀</span>
            </div>
          </div>

          {/* Method 2: Division by 2 Method (Textbook p. 27) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">Method 2</span>
                <h4 className="text-sm font-bold text-white">The Division Method (Decimal to Binary)</h4>
              </div>
              <p className="text-xs text-slate-400">
                Rule from textbook p. 27: "Divide the decimal number by 2. Record quotient and remainder. Read remainders from bottom to top (LSB to MSB)."
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-center text-xs border-collapse bg-slate-950 font-mono">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2 border-r border-slate-800">Step</th>
                    <th className="p-2 border-r border-slate-800">Division</th>
                    <th className="p-2 border-r border-slate-800">Quotient</th>
                    <th className="p-2 text-emerald-400 font-bold">Remainder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {divisionSteps.map((s) => (
                    <tr key={s.step} className="hover:bg-slate-900/40">
                      <td className="p-2 border-r border-slate-800 text-slate-400">{s.step}</td>
                      <td className="p-2 border-r border-slate-800">{s.division}</td>
                      <td className="p-2 border-r border-slate-800 text-slate-400">{s.quotient}</td>
                      <td className="p-2 font-bold text-emerald-400">{s.remainder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-800/40 text-xs font-mono text-slate-300">
              Read Remainders Bottom-to-Top: <span className="text-emerald-400 font-bold">{binaryString}₂</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Hexadecimal & Nibble Splitting (Hodder pp. 29–30) */}
      {activeSubTab === 'hex' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Hexadecimal: Splitting into 4-Bit Nibbles (Textbook p. 29)
            </h4>
            <p className="text-xs text-slate-400">
              Each hexadecimal symbol ($0–9, A–F$) corresponds directly to an exact 4-bit nibble. 
              This makes hexadecimal the preferred human-readable shorthand for memory dumps, MAC addresses, and color codes.
            </p>
          </div>

          {/* Visual Nibble Split Box */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="text-center space-y-2">
              <span className="text-xs text-slate-400">Full 8-Bit Byte:</span>
              <div className="text-3xl font-mono font-bold text-white tracking-widest">{binaryString}</div>
            </div>

            <div className="text-2xl text-slate-600 font-bold">➔ Split ➔</div>

            {/* High Nibble */}
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-800/50 text-center space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono uppercase">High Nibble (Bits 7..4)</span>
              <div className="text-2xl font-mono font-bold text-cyan-300">{nibble1}</div>
              <div className="text-xs text-slate-400 font-mono">Value: {nibble1Dec}₁₀</div>
              <div className="text-lg font-bold font-mono text-amber-400">Hex: {nibble1Hex}</div>
            </div>

            {/* Low Nibble */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-800/50 text-center space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono uppercase">Low Nibble (Bits 3..0)</span>
              <div className="text-2xl font-mono font-bold text-emerald-300">{nibble2}</div>
              <div className="text-xs text-slate-400 font-mono">Value: {nibble2Dec}₁₀</div>
              <div className="text-lg font-bold font-mono text-amber-400">Hex: {nibble2Hex}</div>
            </div>

            <div className="text-2xl text-slate-600 font-bold">➔ Combine ➔</div>

            <div className="text-center space-y-1 p-3 rounded-xl bg-amber-950/40 border border-amber-800">
              <span className="text-[10px] text-amber-300 font-mono uppercase">Resulting Hex</span>
              <div className="text-3xl font-mono font-extrabold text-amber-400">{hexString}₁₆</div>
            </div>
          </div>

          {/* Hexadecimal Reference Table */}
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-1.5 text-center font-mono text-xs">
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-amber-400 font-bold text-sm">{i.toString(16).toUpperCase()}</div>
                <div className="text-slate-400 text-[10px]">{i}</div>
                <div className="text-cyan-400 text-[9px] mt-0.5">{i.toString(2).padStart(4, '0')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Bits vs Bytes & Prefixes (Hodder p. 26 Review Question) */}
      {activeSubTab === 'prefixes' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          {/* Textbook speed review question */}
          <div className="p-5 rounded-xl bg-slate-950 border border-amber-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Textbook Review Question: 100 Mb/s vs 100 MB/s (p. 26)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Bits and byte notation are worth knowing when dealing with internet companies:
              <br />
              <code className="text-cyan-300 font-mono">Company A: Download speeds of up to 100 Mb/s!</code>
              <br />
              <code className="text-emerald-300 font-mono">Company B: Download speeds of up to 100 MB/s!</code>
              <br />
              Assuming the cost is identical, which one offers faster speeds and by how much?"
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-mono">
              <strong>Answer:</strong> Company B (100 MB/s) is <strong>8 times faster</strong> than Company A (100 Mb/s), 
              because lowercase <strong>b</strong> = bits, while uppercase <strong>B</strong> = bytes (8 bits = 1 byte). 
              100 MB/s = 800 Mb/s!
            </div>
          </div>

          {/* IEC Base-2 Prefixes vs SI Base-10 (Textbook Table p. 26) */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse bg-slate-950 font-mono">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <th className="p-3 font-bold text-cyan-400">IEC Base-2 Prefix (1999 Standard)</th>
                  <th className="p-3 font-bold text-cyan-400">Multiplier (2^n)</th>
                  <th className="p-3 font-bold text-amber-400">SI Base-10 Metric</th>
                  <th className="p-3 font-bold text-amber-400">Multiplier (10^n)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-white">1 KiB (Kibibyte)</td>
                  <td className="p-2.5">1024 bytes (2¹⁰)</td>
                  <td className="p-2.5 font-bold text-white">1 KB (Kilobyte)</td>
                  <td className="p-2.5">1000 bytes (10³)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">1 MiB (Mebibyte)</td>
                  <td className="p-2.5">1024 KiB = 1,048,576 B (2²⁰)</td>
                  <td className="p-2.5 font-bold text-white">1 MB (Megabyte)</td>
                  <td className="p-2.5">1000 KB = 1,000,000 B (10⁶)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">1 GiB (Gibibyte)</td>
                  <td className="p-2.5">1024 MiB = 1,073,741,824 B (2³⁰)</td>
                  <td className="p-2.5 font-bold text-white">1 GB (Gigabyte)</td>
                  <td className="p-2.5">1000 MB = 1,000,000,000 B (10⁹)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">1 TiB (Tebibyte)</td>
                  <td className="p-2.5">1024 GiB (2⁴⁰)</td>
                  <td className="p-2.5 font-bold text-white">1 TB (Terabyte)</td>
                  <td className="p-2.5">1000 GB (10¹²)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: History & Why Binary Won (Hodder pp. 24–25) */}
      {activeSubTab === 'history' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              19th Century
            </span>
            <h4 className="text-sm font-bold text-white">Babbage's Analytical Engine (Decimal)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Charles Babbage used the decimal system (base-10) for his mechanical mechanical engine because humans naturally count in base-10. 
              However, mechanical gears with 10 teeth were bulky and jammed easily.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              1958 Soviet Union
            </span>
            <h4 className="text-sm font-bold text-white">The Setun Computer (Ternary Base-3)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Over 50 Setun computers were built in Moscow using balanced ternary logic (-1, 0, +1). 
              While mathematically elegant, manufacturing three-state electronic hardware was far more complex than two-state switches.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-800/40 space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Modern Computing
            </span>
            <h4 className="text-sm font-bold text-cyan-300">Why Binary (Base-2) Won: Noise Robustness</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transistors act naturally as ON/OFF switches. Most crucially, <strong>noise immunity</strong>: 
              in a binary system, 5V is 1 and 0V is 0. If electrical interference causes a voltage wobble to 4.2V, it is still unambiguously read as a 1!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
