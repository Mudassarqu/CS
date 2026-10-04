import React, { useState } from 'react';
import { 
  stringToAsciiBinary, 
  charToUtf8Bytes, 
  to8BitBinary 
} from '../utils/binaryMath';
import { 
  Type, 
  Sparkles, 
  HelpCircle, 
  Key, 
  FileCode, 
  Globe, 
  ArrowRight, 
  Lightbulb, 
  Lock, 
  Unlock,
  Layers
} from 'lucide-react';

export const TextModule: React.FC = () => {
  // Interactive state
  const [inputText, setInputText] = useState<string>('Hello!');
  const [interactiveBits, setInteractiveBits] = useState<number[]>([0, 1, 0, 0, 0, 0, 0, 1]); // 'A' = 65
  const [activeTab, setActiveTab] = useState<'ascii-rules' | 'bit-switchboard' | 'utf8' | 'secret-cipher'>('ascii-rules');
  const [cipherShift, setCipherShift] = useState<number>(3);
  const [secretRevealed, setSecretRevealed] = useState<boolean>(false);

  // Parse current input string into ASCII breakdown
  const asciiData = stringToAsciiBinary(inputText || ' ');

  // Compute character from 8-bit switchboard
  const currentByteVal = interactiveBits.reduce((acc, bit, idx) => acc + (bit ? Math.pow(2, 7 - idx) : 0), 0);
  const currentByteChar = currentByteVal >= 32 && currentByteVal <= 126 
    ? String.fromCharCode(currentByteVal) 
    : (currentByteVal === 32 ? '[SPACE]' : `Control (0x${currentByteVal.toString(16).toUpperCase()})`);

  const isCurrentUpper = currentByteVal >= 65 && currentByteVal <= 90;
  const isCurrentLower = currentByteVal >= 97 && currentByteVal <= 122;
  const currentAlphaPos = isCurrentUpper ? currentByteVal - 64 : isCurrentLower ? currentByteVal - 96 : null;

  const toggleBit = (index: number) => {
    const updated = [...interactiveBits];
    updated[index] = updated[index] === 1 ? 0 : 1;
    setInteractiveBits(updated);
  };

  // Caesar cipher calculation (Textbook p. 45)
  const applyCaesar = (str: string, shift: number) => {
    return str.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
      }
      return char;
    }).join('');
  };

  const secretMessageBits = "01000110 01101111 01101100 01101100 01101111 01110111 00100000 01110100 01101000 01100101 00100000 01110111 01101000 01101001 01110100 01100101 00100000 01110010 01100001 01100010 01100010 01101001 01110100";
  const decodedSecret = "Follow the white rabbit";

  return (
    <div className="space-y-6">
      {/* Overview Banner from Hodder Textbook p. 31 */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Textbook p. 31–36
              </span>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">A1.2.2 Representation of Characters</span>
            </div>
            <h3 className="text-lg font-bold text-white">How Text is Stored in Binary: ASCII & UTF-8</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Computers do not store "letters"—they store binary numbers mapped through standardized encoding standards. 
              Discover the mathematical rules behind ASCII’s 7/8-bit layout and why UTF-8 revolutionized global multilingual communication.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-around">
            <button
              onClick={() => setActiveTab('ascii-rules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ascii-rules' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ASCII Bit Rules
            </button>
            <button
              onClick={() => setActiveTab('bit-switchboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'bit-switchboard' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bit Switchboard
            </button>
            <button
              onClick={() => setActiveTab('utf8')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'utf8' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unicode & UTF-8
            </button>
            <button
              onClick={() => setActiveTab('secret-cipher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'secret-cipher' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cipher & Decoder
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ASCII Bit Anatomy & Rules */}
      {activeTab === 'ascii-rules' && (
        <div className="space-y-6">
          {/* Live Text Inspector */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Type className="w-4 h-4 text-cyan-400" />
                  Interactive Text-to-Binary Inspector
                </h4>
                <p className="text-xs text-slate-400">Type any word or sentence to see its ASCII byte breakdown and internal bit patterns.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Sample:</span>
                {['Hello', 'IB CS', 'Dog', 'Matrix'].map(sample => (
                  <button
                    key={sample}
                    onClick={() => setInputText(sample)}
                    className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={24}
                placeholder="Type characters here..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-cyan-800/60 rounded-xl text-cyan-300 font-mono text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                <span>{inputText.length} characters ({inputText.length * 8} bits / {inputText.length} bytes)</span>
                <span>Max 24 chars for clear layout</span>
              </div>
            </div>

            {/* Character Cards Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {asciiData.map((item, index) => {
                const prefixBits = item.binary.slice(0, 3);
                const posBits = item.binary.slice(3);
                return (
                  <div 
                    key={index}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-center flex flex-col items-center"
                  >
                    <div className="text-2xl font-bold font-mono text-white mb-1">
                      {item.char === ' ' ? <span className="text-xs text-slate-400">[SPACE]</span> : item.char}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mb-2">
                      Dec: <span className="text-cyan-400 font-semibold">{item.code}</span> (0x{item.code.toString(16).toUpperCase()})
                    </div>

                    {/* Bit breakdown highlighting textbook rule */}
                    <div className="w-full bg-slate-900 rounded-lg p-1.5 border border-slate-800/80 font-mono text-xs">
                      <div className="flex justify-center items-center gap-1">
                        <span className={`px-1 py-0.5 rounded font-bold ${
                          prefixBits === '010' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : prefixBits === '011' 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`} title={`Case Bits (first 3): ${prefixBits === '010' ? 'Uppercase' : prefixBits === '011' ? 'Lowercase' : 'Special/Space'}`}>
                          {prefixBits}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold" title={`Alphabet Position (last 5 bits): ${posBits}`}>
                          {posBits}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-between px-1">
                        <span>{prefixBits === '010' ? 'UPPER' : prefixBits === '011' ? 'lower' : prefixBits === '001' ? 'SPACE' : 'SYM'}</span>
                        <span>{item.alphaPos ? `#${item.alphaPos}` : '-'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Textbook Core Insight: The "First 3 Bits & First 5 Bits" Rule (Hodder p. 31) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">The Clever ASCII Latin Design (Textbook p. 31)</h5>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-cyan-400 font-bold">First 3 bits (left):</span>
                  <span>
                    Indicates letter casing! <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">010</code> = Uppercase, <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300 font-mono">011</code> = Lowercase.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-emerald-400 font-bold">First 5 bits (right):</span>
                  <span>
                    Represents the letter's numerical place in the alphabet! 
                    <br />
                    <code className="bg-slate-950 px-1 rounded font-mono text-emerald-300">00001</code> = 1 = <strong>a/A</strong>, <code className="bg-slate-950 px-1 rounded font-mono text-emerald-300">00010</code> = 2 = <strong>b/B</strong>, <code className="bg-slate-950 px-1 rounded font-mono text-emerald-300">00011</code> = 3 = <strong>c/C</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-purple-400 font-bold">Case Conversion:</span>
                  <span>
                    To convert lowercase to uppercase in binary, simply flip bit 5 from <code className="text-cyan-400">1</code> to <code className="text-amber-400">0</code>! (Difference is exactly 32).
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-800/30">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Textbook "Top Tip!" (p. 32)</h5>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  "If the first five bits from the right are <code className="font-mono text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">00000</code>, it is almost certainly a <strong>SPACE</strong> (<code className="font-mono text-cyan-300">00100000₂ = 32₁₀</code>)."
                </p>
                <p>
                  "If the first three bits from the left are not <code className="font-mono text-amber-300">011</code> or <code className="font-mono text-amber-300">010</code>, it is likely to be a punctuation mark or number symbol (e.g. <code className="font-mono">! = 00100001</code>, <code className="font-mono">0 = 00110000</code>)."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Bit Switchboard (Click bits to change char) */}
      {activeTab === 'bit-switchboard' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Interactive 8-Bit ASCII Switchboard
            </h4>
            <p className="text-xs text-slate-400">
              Flip the individual physical binary switches (0 or 1) to inspect how modern hardware decodes any arbitrary byte in memory.
            </p>
          </div>

          {/* Interactive Bit Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            {interactiveBits.map((bit, idx) => {
              const placeValue = Math.pow(2, 7 - idx);
              const isCaseBit = idx < 3;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-slate-400 mb-1">
                    Bit {7 - idx}
                  </span>
                  <button
                    onClick={() => toggleBit(idx)}
                    className={`w-12 h-16 sm:w-14 sm:h-20 rounded-xl font-mono text-2xl font-bold flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                      bit === 1
                        ? isCaseBit 
                          ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 border border-amber-300 shadow-amber-500/20'
                          : 'bg-gradient-to-b from-cyan-500 to-cyan-600 text-slate-950 border border-cyan-300 shadow-cyan-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span>{bit}</span>
                    <span className="text-[10px] opacity-75 font-normal mt-1">2^{7 - idx}</span>
                  </button>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 mt-1.5">
                    +{bit ? placeValue : 0}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Result Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Resulting Character</span>
              <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-1">
                {currentByteChar}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isCurrentUpper ? 'Uppercase Letter' : isCurrentLower ? 'Lowercase Letter' : 'Symbol / Control'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Decimal Value (Base 10)</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {currentByteVal}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Hexadecimal: <span className="font-mono text-cyan-400 font-semibold">0x{currentByteVal.toString(16).toUpperCase().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Alphabet Position</span>
              <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
                {currentAlphaPos ? `#${currentAlphaPos}` : 'N/A'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {currentAlphaPos ? `${currentByteChar} is letter ${currentAlphaPos}` : 'Non-alphabetic character'}
              </div>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400">Test Preset Characters:</span>
            {[
              { label: "'A' (65)", bits: [0, 1, 0, 0, 0, 0, 0, 1] },
              { label: "'a' (97)", bits: [0, 1, 1, 0, 0, 0, 0, 1] },
              { label: "'B' (66)", bits: [0, 1, 0, 0, 0, 0, 1, 0] },
              { label: "'b' (98)", bits: [0, 1, 1, 0, 0, 0, 1, 0] },
              { label: "'Z' (90)", bits: [0, 1, 0, 1, 1, 0, 1, 0] },
              { label: "'z' (122)", bits: [0, 1, 1, 1, 1, 0, 1, 0] },
              { label: "Space (32)", bits: [0, 0, 1, 0, 0, 0, 0, 0] },
              { label: "'?' (63)", bits: [0, 0, 1, 1, 1, 1, 1, 1] },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => setInteractiveBits([...preset.bits])}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Unicode & UTF-8 Variable-Length Encoding (Hodder p. 32-34) */}
      {activeTab === 'utf8' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Why Unicode & UTF-8 Were Created (Hodder p. 32)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In the 1960s, 7-bit ASCII was sufficient for English (128 characters). Extended 8-bit ASCII gave 256 characters, but countries used competing conflicting standards (e.g., Japan used 4 different incompatible schemes). 
              In 1991, the <strong>Unicode Consortium</strong> was formed to assign a single unique number to every character across all human languages, technical symbols, and emojis (now over 149,186 characters in Unicode 15.0).
            </p>
          </div>

          {/* Comparison Table from Textbook p. 34 */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                  <th className="p-3 font-semibold">Standard</th>
                  <th className="p-3 font-semibold">Length</th>
                  <th className="p-3 font-semibold">Key Properties</th>
                  <th className="p-3 font-semibold">Common Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                <tr className="hover:bg-slate-900/30">
                  <td className="p-3 font-bold text-cyan-400">UTF-8</td>
                  <td className="p-3">1 to 4 bytes per char</td>
                  <td className="p-3 text-slate-300 font-sans">
                    <strong>100% backward compatible with ASCII</strong>. Most web traffic.
                  </td>
                  <td className="p-3 font-sans text-slate-400">Web, Linux, APIs, Git</td>
                </tr>
                <tr className="hover:bg-slate-900/30">
                  <td className="p-3 font-bold text-indigo-400">UTF-16</td>
                  <td className="p-3">2 or 4 bytes</td>
                  <td className="p-3 font-sans text-slate-300">Uses surrogate pairs for characters outside Basic Multilingual Plane (BMP)</td>
                  <td className="p-3 font-sans text-slate-400">Java runtime, Windows internal APIs</td>
                </tr>
                <tr className="hover:bg-slate-900/30">
                  <td className="p-3 font-bold text-emerald-400">UTF-32</td>
                  <td className="p-3">Fixed 4 bytes (32-bit)</td>
                  <td className="p-3 font-sans text-slate-300">Simple indexing, but quadruples ASCII memory/storage requirements</td>
                  <td className="p-3 font-sans text-slate-400">Internal fixed-width memory operations</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive UTF-8 Byte Inspector */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Live UTF-8 Multi-Byte Breakdown (Textbook Examples p. 34)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Notice how the leading bits communicate the byte count, and continuation bytes always start with <code className="text-cyan-400">10</code> so systems never get lost or produce 8 zeros in a row!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { char: 'A', label: "ASCII 'A'", desc: "1 byte (starts with 0)", expected: "01000001", codePoint: 65 },
                { char: 'é', label: "Accented 'é'", desc: "2 bytes (prefix 110 + 10)", expected: "11000011 10101001", codePoint: 233 },
                { char: '💩', label: "Emoji '💩'", desc: "4 bytes (prefix 11110 + three 10)", expected: "11110000 10011111 10011000 10000100", codePoint: 128169 },
              ].map(example => {
                const info = charToUtf8Bytes(example.char);
                return (
                  <div key={example.char} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-mono">{example.char}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                          Code Point: {info.codePoint}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-white">{example.label}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">{example.desc}</p>
                    </div>

                    <div className="mt-3 p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase">Binary Bytes:</div>
                      <div className="text-cyan-400 font-bold break-all">
                        {info.bytes.join(' ')}
                      </div>
                      <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                        <span>Hex: {info.hex.join(' ')}</span>
                        <span>{info.bytes.length} Byte{info.bytes.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Caesar Cipher & Secret Message Decoder (Hodder Exercises p. 32, p. 35) */}
      {activeTab === 'secret-cipher' && (
        <div className="space-y-6">
          {/* Textbook Secret Message Question (p. 32) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Textbook Review Question: Decode the Hidden Message (p. 32)</h4>
              </div>
              <button
                onClick={() => setSecretRevealed(!secretRevealed)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold"
              >
                {secretRevealed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {secretRevealed ? 'Hide Solution' : 'Reveal Solution'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              "Convert the following binary stream back into text to reveal the hidden message:"
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed break-all">
              {secretMessageBits}
            </div>

            {secretRevealed && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200">
                <span className="font-bold text-emerald-400">Decoded Text:</span> "{decodedSecret}"
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  Notice the space is <code className="font-mono bg-slate-950 px-1 rounded">00100000</code> between words, and the first letter <code className="font-mono">F = 01000110</code> (010 = upper, 00110 = 6th letter F).
                </p>
              </div>
            )}
          </div>

          {/* Interactive Caesar Shift Cipher (Textbook p. 35) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Interactive Caesar Shift Cipher (Textbook Programming Exercise p. 35)
              </h4>
              <p className="text-xs text-slate-400">
                Each letter is treated as an integer (a=1, b=2...) and rotated by the secret key offset modulo 26.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="text-xs text-slate-400 mb-1 block">Input Plaintext:</label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm"
                />
              </div>
              <div className="w-full sm:w-48">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Shift Key:</span>
                  <span className="font-mono text-cyan-400 font-bold">+{cipherShift}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={cipherShift}
                  onChange={(e) => setCipherShift(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 font-mono text-xs">
              <div className="text-slate-400 text-[10px] uppercase">Encrypted Ciphertext:</div>
              <div className="text-base text-cyan-300 font-bold mt-1">
                {applyCaesar(inputText, cipherShift)}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Python formula: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">chr((ord(char) - shift + key) % 26 + shift)</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
