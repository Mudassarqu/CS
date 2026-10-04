import React, { useState } from 'react';
import { GateType } from '../types';
import { LogicGateSymbol } from './LogicGateSymbol';
import { evaluateGate } from '../utils/circuitEngine';
import { 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const GateCatalog: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);

  // Transistor simulation for AND / OR / NOT (Textbook p. 52–54)
  const [transistorA, setTransistorA] = useState<boolean>(true);
  const [transistorB, setTransistorB] = useState<boolean>(false);

  const gatesList: { type: GateType; name: string; booleanExpr: string; desc: string; isDerived: boolean; textbookPage: number }[] = [
    { type: 'BUFFER', name: 'Buffer Gate', booleanExpr: 'X = A', desc: 'Outputs the exact input value. Single transistor switch.', isDerived: false, textbookPage: 52 },
    { type: 'NOT', name: 'NOT Gate (Inverter)', booleanExpr: 'X = Ā', desc: 'Inverts input signal. Transistor grounds output when input is 1.', isDerived: false, textbookPage: 54 },
    { type: 'AND', name: 'AND Gate', booleanExpr: 'X = A · B', desc: 'Two transistors in series. Outputs 1 only if BOTH inputs are 1.', isDerived: false, textbookPage: 53 },
    { type: 'OR', name: 'OR Gate', booleanExpr: 'X = A + B', desc: 'Two transistors in parallel. Outputs 1 if AT LEAST ONE input is 1.', isDerived: false, textbookPage: 53 },
    { type: 'NAND', name: 'NAND Gate (NOT-AND)', booleanExpr: 'X = (A · B)̄', desc: 'AND gate followed by NOT. Outputs 0 only if both are 1.', isDerived: true, textbookPage: 54 },
    { type: 'NOR', name: 'NOR Gate (NOT-OR)', booleanExpr: 'X = (A + B)̄', desc: 'OR gate followed by NOT. Outputs 1 only if both are 0.', isDerived: true, textbookPage: 55 },
    { type: 'XOR', name: 'XOR Gate (Exclusive OR)', booleanExpr: 'X = A ⊕ B', desc: 'Outputs 1 if inputs are DIFFERENT (one is 1, one is 0).', isDerived: true, textbookPage: 55 },
    { type: 'XNOR', name: 'XNOR Gate (Exclusive NOR)', booleanExpr: 'X = (A ⊕ B)̄', desc: 'Outputs 1 if inputs are the SAME (both 0 or both 1).', isDerived: true, textbookPage: 56 },
  ];

  const currentGateInfo = gatesList.find(g => g.type === selectedGate) || gatesList[2];

  const currentOutput = evaluateGate(selectedGate, { in1: inputA, in2: inputB, in: inputA });

  // Truth table rows for 2-input gate or 1-input gate
  const isSingleInput = selectedGate === 'NOT' || selectedGate === 'BUFFER';
  const tableRows = isSingleInput
    ? [
        { a: 0, b: 0, out: evaluateGate(selectedGate, { in: 0 }) },
        { a: 1, b: 0, out: evaluateGate(selectedGate, { in: 1 }) },
      ]
    : [
        { a: 0, b: 0, out: evaluateGate(selectedGate, { in1: 0, in2: 0 }) },
        { a: 0, b: 1, out: evaluateGate(selectedGate, { in1: 0, in2: 1 }) },
        { a: 1, b: 0, out: evaluateGate(selectedGate, { in1: 1, in2: 0 }) },
        { a: 1, b: 1, out: evaluateGate(selectedGate, { in1: 1, in2: 1 }) },
      ];

  // Transistor circuit state
  const andTransistorCurrentFlows = transistorA && transistorB;
  const orTransistorCurrentFlows = transistorA || transistorB;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Textbook p. 51–56 (PDF p. 61–66)
              </span>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Topic A1.2.3 Logic Gates</span>
            </div>
            <h3 className="text-lg font-bold text-white">Purpose & Use of Logic Gates (Transistor Level & Derived)</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Logic gates are the physical building blocks of all digital processors. 
              Invented following George Boole (Boolean algebra) and Claude Shannon's circuit theory, modern gates are implemented using microscopic silicon <strong>transistors</strong> acting as ultra-fast electronic switches.
            </p>
          </div>
        </div>
      </div>

      {/* Gate Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Select Gate:</span>
        {gatesList.map((g) => (
          <button
            key={g.type}
            onClick={() => setSelectedGate(g.type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              selectedGate === g.type
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            {g.type}
          </button>
        ))}
      </div>

      {/* Main Gate Interactive Inspection Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gate Visual & Live Switch Tester */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentGateInfo.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  currentGateInfo.isDerived ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}>
                  {currentGateInfo.isDerived ? 'Derived Gate' : 'Basic Gate'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{currentGateInfo.desc}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-sans">Boolean Algebra:</span>
              <span className="text-sm font-bold font-mono text-cyan-400">{currentGateInfo.booleanExpr}</span>
            </div>
          </div>

          {/* Interactive Gate Diagram */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-6 shadow-inner">
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {/* Inputs Column */}
              <div className="flex flex-col gap-5 items-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">Input A:</span>
                  <button
                    onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                    className={`w-12 h-10 rounded-xl font-mono text-sm font-bold flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                      inputA === 1 ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-cyan-500/30' : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {inputA}
                  </button>
                </div>

                {!isSingleInput && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">Input B:</span>
                    <button
                      onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                      className={`w-12 h-10 rounded-xl font-mono text-sm font-bold flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                        inputB === 1 ? 'bg-cyan-500 text-slate-950 border border-cyan-300 shadow-cyan-500/30' : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {inputB}
                    </button>
                  </div>
                )}
              </div>

              {/* Logic Gate Symbol */}
              <div className="relative">
                <LogicGateSymbol type={selectedGate} outputVal={currentOutput} width={130} height={80} />
              </div>

              {/* Output Display */}
              <div className="flex flex-col items-center pl-2">
                <div className="text-[10px] font-mono text-slate-400 mb-1">Output X:</div>
                <div className={`w-14 h-14 rounded-2xl font-mono text-2xl font-extrabold flex items-center justify-center border-2 transition-all shadow-xl ${
                  currentOutput === 1 
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400 shadow-amber-500/30 animate-pulse' 
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  {currentOutput}
                </div>
                <span className={`text-[10px] font-bold mt-1 uppercase ${currentOutput === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {currentOutput === 1 ? 'HIGH (1)' : 'LOW (0)'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center font-mono">
              Evaluation: <span className="text-white font-bold">{selectedGate}({isSingleInput ? inputA : `${inputA}, ${inputB}`}) = {currentOutput}</span>
            </div>
          </div>

          {/* Quick preset truth tests */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Quick Test Inputs:</span>
            {!isSingleInput ? (
              <div className="flex gap-1.5">
                {[
                  { a: 0, b: 0 },
                  { a: 0, b: 1 },
                  { a: 1, b: 0 },
                  { a: 1, b: 1 },
                ].map(pair => (
                  <button
                    key={`${pair.a}-${pair.b}`}
                    onClick={() => { setInputA(pair.a); setInputB(pair.b); }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono border border-slate-700"
                  >
                    A={pair.a}, B={pair.b}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={() => setInputA(0)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono">A=0</button>
                <button onClick={() => setInputA(1)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono">A=1</button>
              </div>
            )}
          </div>
        </div>

        {/* Truth Table for Selected Gate */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Standard Truth Table (Hodder p. 52–56)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Lists every possible combination of inputs and corresponding binary output.
            </p>

            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-center text-xs border-collapse bg-slate-950 font-mono">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2.5 font-bold text-cyan-400">Input A</th>
                    {!isSingleInput && <th className="p-2.5 font-bold text-cyan-400">Input B</th>}
                    <th className="p-2.5 font-bold text-amber-400">Output X</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {tableRows.map((row, idx) => {
                    const isSelectedRow = isSingleInput
                      ? row.a === inputA
                      : row.a === inputA && row.b === inputB;

                    return (
                      <tr 
                        key={idx}
                        className={`transition-colors ${
                          isSelectedRow 
                            ? 'bg-cyan-950/70 text-cyan-200 font-bold border-l-4 border-l-cyan-400' 
                            : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="p-2.5">{row.a}</td>
                        {!isSingleInput && <td className="p-2.5">{row.b}</td>}
                        <td className={`p-2.5 font-bold ${row.out === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {row.out}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 font-sans">Textbook Rule:</span>
            <p className="text-[11px] leading-relaxed">
              {selectedGate === 'AND' && '"The AND gate outputs 1 only if both inputs are 1." (p. 53)'}
              {selectedGate === 'OR' && '"The OR gate outputs 1 if at least one input is 1." (p. 53)'}
              {selectedGate === 'NOT' && '"The NOT gate outputs the opposite value of the input." (p. 54)'}
              {selectedGate === 'XOR' && '"The XOR gate outputs 1 if the inputs are different." (p. 55)'}
              {selectedGate === 'NAND' && '"The NAND gate outputs 1 unless both inputs are 1." (p. 54)'}
              {selectedGate === 'NOR' && '"The NOR gate outputs 1 only if both inputs are 0." (p. 55)'}
              {selectedGate === 'XNOR' && '"The XNOR gate outputs 1 if the inputs are the same." (p. 56)'}
              {selectedGate === 'BUFFER' && '"Buffer gate: if input is on, output is on; if off, output is off." (p. 52)'}
            </p>
          </div>
        </div>
      </div>

      {/* Transistor-Level Inner Workings (Textbook Figures p. 52–54) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h4 className="text-base font-bold text-white">Transistor-Level Inner Workings (Textbook p. 52–54)</h4>
          </div>
          <p className="text-xs text-slate-400">
            A transistor is an electronic switch with a <strong>Source</strong>, <strong>Drain</strong>, and <strong>Gate (control wire)</strong>. 
            When voltage is applied to the control wire, electricity conducts between electrodes.
          </p>
        </div>

        {/* Transistor Switches Interactive Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AND Gate: Series Transistors */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">AND Gate: 2 Transistors in Series (p. 53)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                andTransistorCurrentFlows ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'
              }`}>
                {andTransistorCurrentFlows ? 'CURRENT FLOWS (1)' : 'CIRCUIT BROKEN (0)'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 py-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-xs font-mono text-amber-400 font-bold">5V Current ➔</span>

              {/* Transistor A */}
              <button
                onClick={() => setTransistorA(!transistorA)}
                className={`p-2.5 rounded-xl border font-mono text-xs flex flex-col items-center transition-all ${
                  transistorA 
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md' 
                    : 'bg-slate-950 border-slate-700 text-slate-500'
                }`}
              >
                <span className="font-bold">Transistor A</span>
                <span className="text-[10px] mt-0.5">{transistorA ? 'CONDUCTING' : 'OPEN (OFF)'}</span>
              </button>

              <span className="text-slate-600 font-mono">───</span>

              {/* Transistor B */}
              <button
                onClick={() => setTransistorB(!transistorB)}
                className={`p-2.5 rounded-xl border font-mono text-xs flex flex-col items-center transition-all ${
                  transistorB 
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md' 
                    : 'bg-slate-950 border-slate-700 text-slate-500'
                }`}
              >
                <span className="font-bold">Transistor B</span>
                <span className="text-[10px] mt-0.5">{transistorB ? 'CONDUCTING' : 'OPEN (OFF)'}</span>
              </button>

              <span className="text-xs font-mono text-cyan-400 font-bold">➔ Output</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              In series: If either transistor without an input is OFF, it blocks the flow of current. It is ONLY when <strong>both A and B are energized (1)</strong> that current reaches the output!
            </p>
          </div>

          {/* OR Gate: Parallel Transistors */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">OR Gate: 2 Transistors in Parallel (p. 53)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                orTransistorCurrentFlows ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-500'
              }`}>
                {orTransistorCurrentFlows ? 'CURRENT FLOWS (1)' : 'CIRCUIT BROKEN (0)'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 py-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-xs font-mono text-amber-400 font-bold">5V Current ➔</span>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setTransistorA(!transistorA)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all ${
                    transistorA ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-700 text-slate-500'
                  }`}
                >
                  <span>Branch A: {transistorA ? 'CLOSED' : 'OPEN'}</span>
                </button>
                <button
                  onClick={() => setTransistorB(!transistorB)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all ${
                    transistorB ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-700 text-slate-500'
                  }`}
                >
                  <span>Branch B: {transistorB ? 'CLOSED' : 'OPEN'}</span>
                </button>
              </div>

              <span className="text-xs font-mono text-cyan-400 font-bold">➔ Output</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              In parallel: When either Branch A or Branch B turns ON, electricity can bypass the other branch and complete the circuit, producing a HIGH (1) output!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
