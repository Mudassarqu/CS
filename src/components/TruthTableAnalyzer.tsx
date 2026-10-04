import React, { useState } from 'react';
import { 
  Table2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Layers,
  ArrowRight,
  BookOpen,
  Grid,
  Zap,
  Lightbulb
} from 'lucide-react';

interface ExampleTruthTable {
  id: string;
  name: string;
  formula: string;
  textbookRef: string;
  inputs: string[];
  intermediateCols: { label: string; formula: string; calc: (a: number, b: number, c: number) => number }[];
  outputCol: { label: string; formula: string; calc: (a: number, b: number, c: number, p: number, q: number, r: number) => number };
}

export const TruthTableAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'truth-tables' | 'k-maps' | 'scenarios'>('truth-tables');

  // Truth table examples from textbook
  const examples: ExampleTruthTable[] = [
    {
      id: 'textbook-circuit',
      name: 'Textbook Example: 3-Input Circuit with P, Q, R, X (p. 56–57)',
      formula: 'P = A·B, Q = (B+C)̄, R = P+Q, X = C ⊕ R',
      textbookRef: 'Hodder p. 56–57 (PDF p. 66–67)',
      inputs: ['A', 'B', 'C'],
      intermediateCols: [
        { label: 'P', formula: '(A AND B)', calc: (a, b) => (a === 1 && b === 1 ? 1 : 0) },
        { label: 'Q', formula: '(B NOR C)', calc: (_, b, c) => (!(b === 1 || c === 1) ? 1 : 0) },
        { label: 'R', formula: '(P OR Q)', calc: (a, b, c) => {
          const p = a === 1 && b === 1 ? 1 : 0;
          const q = !(b === 1 || c === 1) ? 1 : 0;
          return p === 1 || q === 1 ? 1 : 0;
        }}
      ],
      outputCol: {
        label: 'X',
        formula: '(C XOR R)',
        calc: (a, b, c, p, q, r) => (c !== r ? 1 : 0)
      }
    },
    {
      id: 'baby-alarm',
      name: 'Baby Alarm Scenario: X = A · (B + C)',
      formula: 'Alarm triggers if Switch (A) is ON and (Crying (B) OR Cold (C))',
      textbookRef: 'Hodder p. 59 (PDF p. 69)',
      inputs: ['A (Switch)', 'B (Crying)', 'C (Cold)'],
      intermediateCols: [
        { label: 'P', formula: '(B OR C)', calc: (_, b, c) => (b === 1 || c === 1 ? 1 : 0) }
      ],
      outputCol: {
        label: 'X',
        formula: '(A AND P)',
        calc: (a, _, __, p) => (a === 1 && p === 1 ? 1 : 0)
      }
    },
    {
      id: 'irrigation',
      name: 'Water Irrigation: I = E · (D + H)',
      formula: 'Activates if manually Enabled (E) and (Soil Dry (D) OR Temp High (H))',
      textbookRef: 'Hodder p. 60 Review Q2 (PDF p. 70)',
      inputs: ['E (Enable)', 'D (Dry)', 'H (Heat)'],
      intermediateCols: [
        { label: 'P', formula: '(D OR H)', calc: (_, d, h) => (d === 1 || h === 1 ? 1 : 0) }
      ],
      outputCol: {
        label: 'I',
        formula: '(E AND P)',
        calc: (e, _, __, p) => (e === 1 && p === 1 ? 1 : 0)
      }
    }
  ];

  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [userInputs, setUserInputs] = useState<{ [cellKey: string]: number }>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // K-Map interactive state (Textbook pp. 60–65 / PDF pp. 70–75)
  // 3-input K-map: Rows = C (0, 1), Cols = AB (00, 01, 11, 10 in Gray code!)
  // Initialized to textbook p. 63 example: ĀBC + AB̄C + ABC
  const [kmapGrid3, setKmapGrid3] = useState<number[][]>([
    [0, 0, 0, 0], // C = 0 (AB = 00, 01, 11, 10)
    [0, 1, 1, 1], // C = 1 (01=ĀBC, 11=ABC, 10=AB̄C)
  ]);

  const activeExample = examples[selectedExampleIndex];

  // Generate the 8 rows following the exact textbook order rule (000 to 111)
  const rows = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      for (let c = 0; c <= 1; c++) {
        const p = activeExample.intermediateCols[0]?.calc(a, b, c) ?? 0;
        const q = activeExample.intermediateCols[1]?.calc(a, b, c) ?? 0;
        const r = activeExample.intermediateCols[2]?.calc(a, b, c) ?? 0;
        const x = activeExample.outputCol.calc(a, b, c, p, q, r);

        rows.push({ a, b, c, p, q, r, x });
      }
    }
  }

  const handleCellClick = (key: string) => {
    if (!practiceMode) return;
    const current = userInputs[key];
    const next = current === 1 ? 0 : 1;
    setUserInputs({ ...userInputs, [key]: next });
  };

  const resetPractice = () => {
    setUserInputs({});
    setShowFeedback(false);
  };

  const toggleKmapCell = (r: number, c: number) => {
    const next = kmapGrid3.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? (val === 1 ? 0 : 1) : val))
    );
    setKmapGrid3(next);
  };

  // Derive simplification from current K-map grid
  // Textbook example 1 (p. 63): C=1 and cols 01, 11, 10 active -> BC + AC
  // Textbook example 2 (p. 64): Wrap-around edges: cols 00 and 10 active across rows -> B̄
  const isTextbookEx1 = kmapGrid3[1][1] === 1 && kmapGrid3[1][2] === 1 && kmapGrid3[1][3] === 1 &&
    kmapGrid3[0].every(v => v === 0) && kmapGrid3[1][0] === 0;

  const isWrapAroundBbar = kmapGrid3[0][0] === 1 && kmapGrid3[1][0] === 1 &&
    kmapGrid3[0][3] === 1 && kmapGrid3[1][3] === 1 &&
    kmapGrid3[0][1] === 0 && kmapGrid3[0][2] === 0 &&
    kmapGrid3[1][1] === 0 && kmapGrid3[1][2] === 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Textbook p. 56–65 (PDF p. 66–75)
              </span>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Topic A1.2.4 Truth Tables & K-Maps</span>
            </div>
            <h3 className="text-lg font-bold text-white">Constructing & Analysing Truth Tables & Karnaugh Maps</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Master the systematic $2^n$ truth table construction pattern, step-by-step intermediate column derivation ($P, Q, R, X$), 
              and visual <strong>Karnaugh Map (K-map)</strong> algebraic simplification using Gray code column headers ($00, 01, 11, 10$).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto justify-around">
            <button
              onClick={() => setActiveTab('truth-tables')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'truth-tables' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Truth Table Generator
            </button>
            <button
              onClick={() => setActiveTab('k-maps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'k-maps' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              K-Maps & Simplification
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Truth Table Analyzer */}
      {activeTab === 'truth-tables' && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Example:</span>
              {examples.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setSelectedExampleIndex(idx);
                    resetPractice();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedExampleIndex === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {ex.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPracticeMode(!practiceMode);
                  resetPractice();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  practiceMode 
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {practiceMode ? 'Exit Practice Mode' : 'Test Yourself (Practice Mode)'}
              </button>
            </div>
          </div>

          {/* Main Truth Table Display */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-cyan-400" />
                  <span>{activeExample.name}</span>
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{activeExample.formula}</p>
              </div>

              {practiceMode && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    {showFeedback ? 'Hide Feedback' : 'Check Answers'}
                  </button>
                  <button
                    onClick={resetPractice}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                    title="Reset answers"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* The Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-center text-xs border-collapse bg-slate-950 font-mono">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-3 font-bold text-slate-400 border-r border-slate-800">Row</th>
                    {activeExample.inputs.map((inp, idx) => (
                      <th key={idx} className="p-3 font-bold text-cyan-400 border-r border-slate-800">
                        {inp}
                      </th>
                    ))}
                    {activeExample.intermediateCols.map((col, idx) => (
                      <th key={idx} className="p-3 font-bold text-purple-400 border-r border-slate-800">
                        <div>{col.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{col.formula}</div>
                      </th>
                    ))}
                    <th className="p-3 font-bold text-amber-400">
                      <div>{activeExample.outputCol.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{activeExample.outputCol.formula}</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {rows.map((row, idx) => {
                    const outKey = `out_${idx}`;
                    const userOut = userInputs[outKey];
                    const isCorrect = userOut === row.x;

                    return (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-2.5 text-slate-400 font-sans border-r border-slate-800">#{idx + 1}</td>
                        <td className="p-2.5 border-r border-slate-800">{row.a}</td>
                        <td className="p-2.5 border-r border-slate-800">{row.b}</td>
                        <td className="p-2.5 border-r border-slate-800">{row.c}</td>
                        
                        {/* Intermediate columns */}
                        {activeExample.intermediateCols.map((col, cIdx) => {
                          const val = cIdx === 0 ? row.p : cIdx === 1 ? row.q : row.r;
                          return (
                            <td key={cIdx} className="p-2.5 border-r border-slate-800 text-purple-300 font-bold">
                              {val}
                            </td>
                          );
                        })}

                        {/* Final Output Column */}
                        <td className="p-2.5">
                          {practiceMode ? (
                            <button
                              onClick={() => handleCellClick(outKey)}
                              className={`w-10 h-8 rounded-lg font-mono font-bold text-sm transition-all border ${
                                userOut === undefined 
                                  ? 'bg-slate-900 border-slate-700 text-slate-500' 
                                  : userOut === 1
                                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                                  : 'bg-slate-800 text-slate-300 border-slate-600'
                              } ${
                                showFeedback && userOut !== undefined
                                  ? isCorrect ? 'ring-2 ring-emerald-500' : 'ring-2 ring-rose-500'
                                  : ''
                              }`}
                            >
                              {userOut === undefined ? '?' : userOut}
                            </button>
                          ) : (
                            <span className={`text-sm font-bold ${row.x === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
                              {row.x}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Systematic Construction Guide from Textbook p. 56 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-cyan-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>How to Construct Any Truth Table Without Mistakes (Textbook p. 56 Rule):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>Calculate total rows needed: <code>2ⁿ</code> where n = number of inputs (for 3 inputs, <code>2³ = 8 rows</code>).</li>
                <li><strong>Furthest right column (C):</strong> alternate every single row: <code>0, 1, 0, 1, 0, 1, 0, 1</code>.</li>
                <li><strong>Middle column (B):</strong> alternate every two rows: <code>0, 0, 1, 1, 0, 0, 1, 1</code>.</li>
                <li><strong>Leftmost column (A):</strong> alternate every four rows: <code>0, 0, 0, 0, 1, 1, 1, 1</code>.</li>
                <li>Follow order of operations: Parentheses first, then NOT, then AND (and NAND), then OR (and NOR/XOR).</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Karnaugh Maps (K-Maps) and Algebraic Simplification (Hodder pp. 60–65) */}
      {activeTab === 'k-maps' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Grid className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white">Interactive 3-Input Karnaugh Map (K-Map) Solver</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Karnaugh maps visually group terms of $1$s from a truth table to simplify Boolean expressions, 
                drastically reducing the number of physical logic gates needed. 
                <strong className="text-amber-300 ml-1">Critical Textbook Rule (p. 62):</strong> The columns MUST follow <strong>Gray Code (00, 01, 11, 10)</strong> so only one bit changes between adjacent cells!
              </p>
            </div>

            {/* Presets for K-Maps */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold">Load Textbook Examples:</span>
              <button
                onClick={() => setKmapGrid3([[0, 0, 0, 0], [0, 1, 1, 1]])}
                className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700"
              >
                Example 1 (p. 62–64): B·C + A·C
              </button>
              <button
                onClick={() => setKmapGrid3([[1, 0, 0, 1], [1, 0, 0, 1]])}
                className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700"
              >
                Wrap-Around Edge Example (p. 64): B̄
              </button>
              <button
                onClick={() => setKmapGrid3([[0, 0, 0, 0], [0, 0, 0, 0]])}
                className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-slate-700"
              >
                Clear K-Map
              </button>
            </div>

            {/* The K-Map Grid */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-inner">
              <div className="text-xs font-mono text-slate-400">
                Variables: <span className="text-purple-400 font-bold">C</span> (Rows) \ <span className="text-cyan-400 font-bold">AB</span> (Columns in Gray Code)
              </div>

              {/* Table rendering K-Map */}
              <div className="overflow-x-auto">
                <table className="border-collapse font-mono text-sm text-center">
                  <thead>
                    <tr>
                      <th className="p-3 border border-slate-800 text-slate-500 font-normal">C \ AB</th>
                      <th className="p-3 border border-slate-800 text-cyan-400 font-bold bg-slate-900/60">00 (ĀB̄)</th>
                      <th className="p-3 border border-slate-800 text-cyan-400 font-bold bg-slate-900/60">01 (ĀB)</th>
                      <th className="p-3 border border-slate-800 text-amber-400 font-bold bg-slate-900/60">11 (AB)*</th>
                      <th className="p-3 border border-slate-800 text-cyan-400 font-bold bg-slate-900/60">10 (AB̄)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1].map((cVal, rIdx) => (
                      <tr key={cVal}>
                        <td className="p-3 border border-slate-800 font-bold text-purple-400 bg-slate-900/60">
                          {cVal} ({cVal === 0 ? 'C̄' : 'C'})
                        </td>
                        {[0, 1, 2, 3].map((colIdx) => {
                          const val = kmapGrid3[rIdx][colIdx];
                          const isHighlighted = val === 1;

                          return (
                            <td key={colIdx} className="p-2 border border-slate-800">
                              <button
                                onClick={() => toggleKmapCell(rIdx, colIdx)}
                                className={`w-14 h-14 rounded-xl text-lg font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-md ${
                                  isHighlighted
                                    ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 border border-cyan-200 shadow-cyan-500/30 scale-105'
                                    : 'bg-slate-900 hover:bg-slate-800 text-slate-500 border border-slate-800'
                                }`}
                              >
                                {val}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Simplification Result Box */}
              <div className="w-full max-w-xl p-4 rounded-xl bg-slate-900 border border-cyan-800/40 font-mono text-center space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-sans">
                  Algebraic Simplification Result:
                </span>
                <div className="text-xl font-extrabold text-cyan-300">
                  {isTextbookEx1 ? 'Y = B · C + A · C' :
                   isWrapAroundBbar ? 'Y = B̄  (Wrap-around edges combined!)' :
                   'Interactive K-Map (Click cells to toggle 0 / 1)'}
                </div>
                {isTextbookEx1 && (
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Group 1 (cells 01 and 11 at C=1): A changes (0→1), so discard A. B stays 1, C stays 1 ➔ <strong>B·C</strong>.
                    <br />
                    Group 2 (cells 11 and 10 at C=1): B changes (1→0), so discard B. A stays 1, C stays 1 ➔ <strong>A·C</strong>.
                    <br />
                    Final simplified Boolean expression: <strong className="text-emerald-300">B·C + A·C</strong>!
                  </p>
                )}
                {isWrapAroundBbar && (
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Textbook p. 64: Left column (00) and right column (10) are adjacent in torus geometry! 
                    They form a single group of 4 where A and C both change, leaving only <strong className="text-amber-300">B̄</strong>!
                  </p>
                )}
              </div>
            </div>

            {/* K-Map Grouping Rules from Hodder p. 63 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-amber-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Essential K-Map Grouping Rules (Textbook p. 63):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li><strong>Powers of 2:</strong> Groups must contain 1, 2, 4, 8, or 16 ones.</li>
                <li><strong>Rectangular or Square:</strong> Groups cannot be diagonal (only horizontal or vertical).</li>
                <li><strong>Largest Possible:</strong> Always maximize group size to eliminate the most variables.</li>
                <li><strong>Overlapping Allowed:</strong> Cells of 1 can be shared between groups if it enlarges another group.</li>
                <li><strong>Wrapping Around Edges:</strong> The table wraps around like a cylinder/torus (leftmost column 00 is adjacent to rightmost 10).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
