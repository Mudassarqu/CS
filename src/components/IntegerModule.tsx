import React, { useState } from 'react';
import { 
  Binary, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  Layers, 
  AlertTriangle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { 
  to8BitBinary, 
  from8BitBinary, 
  toSignMagnitude, 
  toOnesComplement, 
  toTwosComplement, 
  toBCD, 
  toGrayCode, 
  toFixedPoint4_4, 
  toIEEE754 
} from '../utils/binaryMath';

export const IntegerModule: React.FC = () => {
  // Input number state
  const [inputVal, setInputVal] = useState<number>(-5); // Default matches textbook example p. 47 (-5)
  const [activeTab, setActiveTab] = useState<'all-formats' | 'bit-comparator' | 'twos-step' | 'gray-code' | 'float'>('all-formats');
  
  // Interactive 8-bit switchboard
  const [testBits, setTestBits] = useState<number[]>([1, 1, 1, 1, 1, 0, 1, 1]); // Represents -5 in 2's complement

  // Rotary encoder state (0 to 7) for Gray code
  const [rotaryAngle, setRotaryAngle] = useState<number>(3); // position 3

  // Fixed point / Float input
  const [floatInput, setFloatInput] = useState<number>(-5.75); // Matches textbook p. 51

  const toggleTestBit = (idx: number) => {
    const updated = [...testBits];
    updated[idx] = updated[idx] === 1 ? 0 : 1;
    setTestBits(updated);
  };

  // Interpretations of testBits
  const bitString = testBits.join('');
  const unsignedVal = parseInt(bitString, 2);
  
  // Sign-magnitude interpretation
  const signMagVal = (testBits[0] === 1 ? -1 : 1) * parseInt(bitString.slice(1), 2);
  
  // 1's complement interpretation
  const onesCompVal = testBits[0] === 0 
    ? unsignedVal 
    : -parseInt(testBits.map(b => (b === 0 ? 1 : 0)).join(''), 2);

  // 2's complement interpretation
  const twosCompVal = testBits[0] === 0
    ? unsignedVal
    : unsignedVal - 256;

  // Format computations for inputVal
  const signMag = toSignMagnitude(inputVal);
  const onesComp = toOnesComplement(inputVal);
  const twosComp = toTwosComplement(inputVal);
  const bcd = toBCD(inputVal);
  const gray = toGrayCode(Math.abs(inputVal));
  const fixed = toFixedPoint4_4(Math.abs(floatInput));
  const ieee = toIEEE754(floatInput);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                Textbook p. 47–51
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">A1.2.2 Representation of Integers</span>
            </div>
            <h3 className="text-lg font-bold text-white">Integer Formats: Two's Comp, BCD, Gray Code & Float</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Computers use different schemes to store positive, negative, and real numbers. 
              Modern CPUs rely on <strong>Two's Complement</strong> for seamless addition/subtraction, <strong>BCD</strong> for financial precision, and <strong>Gray Code</strong> to eliminate robotic positioning noise.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('all-formats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'all-formats' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All 7 Formats
            </button>
            <button
              onClick={() => setActiveTab('bit-comparator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'bit-comparator' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Byte Comparator
            </button>
            <button
              onClick={() => setActiveTab('twos-step')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'twos-step' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              2's Comp Step-by-Step
            </button>
            <button
              onClick={() => setActiveTab('gray-code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'gray-code' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gray Code & Robotics
            </button>
            <button
              onClick={() => setActiveTab('float')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'float' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              IEEE-754 Float
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Master All-in-One Format Converter */}
      {activeTab === 'all-formats' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-amber-400" />
                  Live Integer Multi-Encoding Matrix
                </h4>
                <p className="text-xs text-slate-400">
                  Enter an integer between -128 and 127 to examine how it is stored across different computer architectures.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Textbook Presets:</span>
                {[5, -5, 42, 45, 127, -128, 0].map(val => (
                  <button
                    key={val}
                    onClick={() => setInputVal(val)}
                    className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 font-mono"
                  >
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">Decimal Integer Input (-128 to 127):</label>
                <input
                  type="number"
                  min="-128"
                  max="127"
                  value={inputVal}
                  onChange={(e) => setInputVal(Math.max(-128, Math.min(127, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-amber-800/60 rounded-xl text-amber-300 font-mono text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Formats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Two's Complement */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Two's Complement</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">Modern CPUs</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Standard for signed integers. Single zero, range: -128 to +127.</p>
                </div>
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center">
                  <div className="text-base text-emerald-300 font-bold tracking-widest">{twosComp.binary}</div>
                  <div className="text-[10px] text-slate-400 mt-1">MSB: {twosComp.binary[0]} ({inputVal < 0 ? 'Negative' : 'Positive'})</div>
                </div>
              </div>

              {/* 2. Sign-Magnitude */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-400 uppercase">Sign-Magnitude</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Dual Zero ±0</span>
                  </div>
                  <p className="text-[11px] text-slate-400">MSB is sign (0=+, 1=-), next 7 bits are magnitude. Range: -127 to +127.</p>
                </div>
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center">
                  <div className="text-base text-cyan-300 font-bold tracking-widest">
                    <span className="text-amber-400 font-bold">{signMag.signBit}</span>
                    <span>{signMag.magnitudeBits}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Sign: {signMag.signBit} | Mag: {signMag.magnitudeBits}
                  </div>
                </div>
              </div>

              {/* 3. One's Complement */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-400 uppercase">One's Complement</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Inverted Bits</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Negative is bitwise NOT. Two zeros: +0 (00000000), -0 (11111111).</p>
                </div>
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center">
                  <div className="text-base text-indigo-300 font-bold tracking-widest">{onesComp.binary}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Range: -127 to +127</div>
                </div>
              </div>

              {/* 4. Binary Coded Decimal (BCD) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase">Binary-Coded Decimal (BCD)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">Clocks & Finance</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Each decimal digit (0-9) gets 4 bits (Textbook p. 48).</p>
                </div>
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center">
                  <div className="text-base text-amber-300 font-bold tracking-widest">
                    {inputVal < 0 ? `(-) ${bcd.fullBcd}` : bcd.fullBcd}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {bcd.bcdParts.map(p => `${p.digit}→${p.bcd}`).join(', ')}
                  </div>
                </div>
              </div>

              {/* 5. Gray Code */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-sky-400 uppercase">Gray Code (Reflected)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono">Rotary Encoders</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Only 1 bit changes between consecutive values (Textbook p. 49).</p>
                </div>
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center">
                  <div className="text-base text-sky-300 font-bold tracking-widest">{gray.grayBinary}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Std Bin: {gray.standardBinary}</div>
                </div>
              </div>

              {/* 6. Excess-N / Excess-127 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-400 uppercase">Excess-127 (Biased)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">IEEE Exponent</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Adds bias 127 so positive & negative numbers are non-negative.</p>
                </div>
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center">
                  <div className="text-base text-purple-300 font-bold tracking-widest">
                    {to8BitBinary(inputVal + 127)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {inputVal} + 127 = {inputVal + 127}₁₀
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Byte Comparator (Same Byte, Different Meanings) */}
      {activeTab === 'bit-comparator' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              The "Same Byte, Different Interpretation" Simulator
            </h4>
            <p className="text-xs text-slate-400">
              In a computer's memory, a byte is just 8 charges of electricity (1s and 0s). 
              Toggle any bit below to see how different systems calculate completely different values from the exact same byte!
            </p>
          </div>

          {/* Clickable Bitboard */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {testBits.map((b, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400 mb-1">
                  {idx === 0 ? 'MSB (Sign)' : `b${7 - idx}`}
                </span>
                <button
                  onClick={() => toggleTestBit(idx)}
                  className={`w-12 h-16 sm:w-14 sm:h-20 rounded-xl font-mono text-2xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                    b === 1 
                      ? idx === 0 
                        ? 'bg-rose-500 text-slate-950 border border-rose-300 shadow-rose-500/20' 
                        : 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span>{b}</span>
                  <span className="text-[10px] font-normal opacity-70">2^{7 - idx}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Results table for the exact same byte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Unsigned Binary:</span>
              <div className="text-2xl font-bold font-mono text-white">{unsignedVal}</div>
              <p className="text-[10px] text-slate-400 mt-1">Range: 0 to 255. All bits are positive place values.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Two's Complement:</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">{twosCompVal}</div>
              <p className="text-[10px] text-slate-400 mt-1">
                {testBits[0] === 1 ? 'Negative value (MSB weight is -128)' : 'Positive value (0 to 127)'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Sign-Magnitude:</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">{signMagVal}</div>
              <p className="text-[10px] text-slate-400 mt-1">MSB is pure sign; remaining 7 bits are magnitude ({parseInt(bitString.slice(1), 2)}).</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">One's Complement:</span>
              <div className="text-2xl font-bold font-mono text-indigo-400">{onesCompVal}</div>
              <p className="text-[10px] text-slate-400 mt-1">Bitwise NOT inversion format.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Two's Complement Step-by-Step Machine (Textbook p. 47) */}
      {activeTab === 'twos-step' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Two's Complement Step-by-Step Generator (Textbook Example p. 47)
            </h4>
            <p className="text-xs text-slate-400">
              Follow the exact rule from the IB DP textbook: "Invert all the bits (change 0s to 1s and 1s to 0s) and then add 1 to the least significant bit (LSB)."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <span className="text-xs text-slate-400">Target Negative Number:</span>
            <input
              type="number"
              min="-128"
              max="-1"
              value={inputVal < 0 ? inputVal : -5}
              onChange={(e) => setInputVal(Math.min(-1, Math.max(-128, parseInt(e.target.value) || -1)))}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono text-sm w-32"
            />
            <span className="text-xs text-slate-400">Positive counterpart: <strong className="text-white">+{Math.abs(inputVal < 0 ? inputVal : -5)}</strong></span>
          </div>

          {/* Visual 3-Stage Pipeline */}
          <div className="space-y-4 font-mono text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold mr-2">Step 1</span>
                <span className="text-slate-300">Represent Positive (+{Math.abs(inputVal < 0 ? inputVal : -5)}) in 8-bit Binary:</span>
              </div>
              <span className="text-base text-cyan-300 font-bold tracking-widest">
                {to8BitBinary(Math.abs(inputVal < 0 ? inputVal : -5))}
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold mr-2">Step 2</span>
                <span className="text-slate-300">Invert All Bits (Bitwise NOT / One's Complement):</span>
              </div>
              <span className="text-base text-indigo-300 font-bold tracking-widest">
                {twosComp.invertedBits}
              </span>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold mr-2">Step 3</span>
                <span className="text-slate-300">Add 1 to Least Significant Bit (LSB):</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">+ 00000001 =</span>
                <span className="text-base text-emerald-300 font-bold tracking-widest">
                  {twosComp.binary}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-800/30 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-emerald-400">Why Modern Computers Exclusively Use Two's Complement:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li><strong>Single Zero:</strong> <code>00000000</code> is the only representation for 0 (no confusing +0 and -0).</li>
              <li><strong>Standard Addition Circuitry:</strong> Addition and subtraction use the exact same ALU hardware adder circuit! For <code>A - B</code>, the CPU simply calculates <code>A + (-B in 2's comp)</code>.</li>
              <li><strong>Range:</strong> For 8 bits, range is <code>-128 to +127</code> (giving 256 unique numbers).</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: Gray Code & Rotary Encoder (Textbook p. 49) */}
      {activeTab === 'gray-code' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-sky-400" />
              Gray Code & Rotary Encoder (Textbook p. 49)
            </h4>
            <p className="text-xs text-slate-400">
              In Gray Code (Reflected Binary Code), any two successive values differ by <strong>only one single bit</strong>. 
              This prevents catastrophic multi-bit transition errors in robotic arms and angle sensors!
            </p>
          </div>

          {/* Interactive Rotary Dial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs text-slate-400">Simulate Robotic Arm Angle (Position 0 to 7):</span>
              
              {/* Dial visual */}
              <div className="relative w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900 shadow-xl">
                <div 
                  className="w-1.5 h-14 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-full origin-bottom absolute bottom-1/2 transition-transform duration-300"
                  style={{ transform: `rotate(${(rotaryAngle / 7) * 315}deg)` }}
                />
                <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-white/60 z-10" />
              </div>

              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setRotaryAngle(pos)}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                      rotaryAngle === pos 
                        ? 'bg-sky-500 text-slate-950 shadow-md' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Analysis */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Angle Step:</span>
                <span className="font-mono text-white font-bold">Position {rotaryAngle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Standard Binary</div>
                  <div className="text-lg text-rose-400 font-bold mt-1">
                    {rotaryAngle.toString(2).padStart(3, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {rotaryAngle === 4 ? '⚠ 3 BITS FLIP (011→100)' : 'May glitch on transition'}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-sky-800/50 text-center">
                  <div className="text-[10px] text-sky-400 uppercase">Gray Code</div>
                  <div className="text-lg text-sky-300 font-bold mt-1">
                    {toGrayCode(rotaryAngle).grayBinary.slice(5)}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-sans">
                    ✓ Always exactly 1 bit flips
                  </div>
                </div>
              </div>

              {/* Textbook p. 49 Table excerpt */}
              <div className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200">The Problem in Standard Binary:</strong> Moving from 3 (<code className="text-white">011</code>) to 4 (<code className="text-white">100</code>) requires three bits to flip simultaneously. If bit 2 flips 1 microsecond before bit 0 due to mechanical vibration, the system temporarily reads an erroneous position (e.g. 7 or 0), causing robotic arm jerking!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Fixed Point & IEEE-754 Single Precision (Textbook p. 50-51) */}
      {activeTab === 'float' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Real Numbers: Fixed-Point & IEEE-754 Floating-Point (Textbook p. 50–51)
            </h4>
            <p className="text-xs text-slate-400">
              Computers represent decimal fractions using either a fixed binary point or the normalized <strong>IEEE-754 standard</strong> with sign, biased exponent, and mantissa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Input Real Number:</span>
            <input
              type="number"
              step="0.25"
              value={floatInput}
              onChange={(e) => setFloatInput(parseFloat(e.target.value) || 0)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-purple-300 font-mono text-sm w-36"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setFloatInput(-5.75)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-slate-700"
              >
                Load Textbook Example (-5.75)
              </button>
              <button
                onClick={() => setFloatInput(5.25)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-slate-700"
              >
                Fixed-Point Example (5.25)
              </button>
            </div>
          </div>

          {/* IEEE-754 32-bit Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 space-y-3 font-mono text-xs">
            <div className="text-purple-400 font-bold uppercase font-sans text-xs">
              IEEE-754 Single-Precision 32-Bit Representation (Textbook Walkthrough p. 51):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">1. Sign Bit (1 bit)</span>
                <div className="text-xl font-bold text-rose-400 mt-1">{ieee.signBit}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{floatInput < 0 ? 'Negative (1)' : 'Positive (0)'}</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">2. Exponent (8 bits, Excess-127)</span>
                <div className="text-xl font-bold text-cyan-400 mt-1">{ieee.exponentBits}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Biased: {ieee.biasedExponent} (2^{ieee.unbiasedExponent})</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">3. Mantissa / Significand (23 bits)</span>
                <div className="text-sm font-bold text-emerald-400 mt-1 truncate">{ieee.mantissaBits}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Implicit leading 1 omitted</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>Scientific Normalized Form: <code className="text-amber-300 font-bold">{ieee.scientificForm}</code></div>
              <div>Hexadecimal in Memory: <code className="text-cyan-300 font-bold">{ieee.hex}</code></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
