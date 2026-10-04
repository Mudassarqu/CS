import React from 'react';
import { GateType } from '../types';

interface LogicGateSymbolProps {
  type: GateType;
  outputVal?: number;
  inputVals?: { [key: string]: number | null };
  width?: number;
  height?: number;
  label?: string;
  isConnecting?: boolean;
}

export const LogicGateSymbol: React.FC<LogicGateSymbolProps> = ({
  type,
  outputVal = 0,
  width = 110,
  height = 70,
  label,
}) => {
  const isHigh = outputVal === 1;

  // Render SVG gate body based on IEEE/ANSI textbook standard
  switch (type) {
    case 'AND':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          {/* Input lines */}
          <line x1="0" y1="20" x2="25" y2="20" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="25" y2="50" stroke="#64748b" strokeWidth="2.5" />
          {/* AND Body: Flat back at x=25, curved nose to x=80 */}
          <path
            d="M 25 10 L 55 10 A 25 25 0 0 1 55 60 L 25 60 Z"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          {/* Output line */}
          <line x1="80" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="46" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="11" fontWeight="bold" fontFamily="monospace">
            AND
          </text>
        </svg>
      );

    case 'OR':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          {/* Input lines */}
          <line x1="0" y1="20" x2="28" y2="20" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="28" y2="50" stroke="#64748b" strokeWidth="2.5" />
          {/* OR Body: Curved back, pointed nose */}
          <path
            d="M 25 10 Q 40 35 25 60 Q 55 60 80 35 Q 55 10 25 10 Z"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          {/* Output line */}
          <line x1="80" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="47" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="11" fontWeight="bold" fontFamily="monospace">
            OR
          </text>
        </svg>
      );

    case 'NOT':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          {/* Input line */}
          <line x1="0" y1="35" x2="30" y2="35" stroke="#64748b" strokeWidth="2.5" />
          {/* Triangle */}
          <polygon
            points="30,12 30,58 72,35"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          {/* Inversion Bubble */}
          <circle 
            cx="78" 
            cy="35" 
            r="6" 
            fill="#0f172a" 
            stroke={isHigh ? '#22d3ee' : '#334155'} 
            strokeWidth="2.5" 
          />
          {/* Output line */}
          <line x1="84" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="46" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="11" fontWeight="bold" fontFamily="monospace">
            NOT
          </text>
        </svg>
      );

    case 'XOR':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          {/* Input lines */}
          <line x1="0" y1="20" x2="25" y2="20" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="25" y2="50" stroke="#64748b" strokeWidth="2.5" />
          {/* Extra curved line behind */}
          <path
            d="M 18 10 Q 32 35 18 60"
            fill="none"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
          />
          {/* OR Body */}
          <path
            d="M 27 10 Q 42 35 27 60 Q 58 60 82 35 Q 58 10 27 10 Z"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          {/* Output line */}
          <line x1="82" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="48" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="11" fontWeight="bold" fontFamily="monospace">
            XOR
          </text>
        </svg>
      );

    case 'NAND':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          <line x1="0" y1="20" x2="25" y2="20" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="25" y2="50" stroke="#64748b" strokeWidth="2.5" />
          <path
            d="M 25 10 L 55 10 A 25 25 0 0 1 55 60 L 25 60 Z"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          <circle cx="85" cy="35" r="5" fill="#0f172a" stroke={isHigh ? '#22d3ee' : '#334155'} strokeWidth="2.5" />
          <line x1="90" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="48" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="10" fontWeight="bold" fontFamily="monospace">
            NAND
          </text>
        </svg>
      );

    case 'NOR':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          <line x1="0" y1="20" x2="28" y2="20" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="28" y2="50" stroke="#64748b" strokeWidth="2.5" />
          <path
            d="M 25 10 Q 40 35 25 60 Q 55 60 76 35 Q 55 10 25 10 Z"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          <circle cx="82" cy="35" r="5.5" fill="#0f172a" stroke={isHigh ? '#22d3ee' : '#334155'} strokeWidth="2.5" />
          <line x1="88" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="47" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="10" fontWeight="bold" fontFamily="monospace">
            NOR
          </text>
        </svg>
      );

    case 'XNOR':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          <line x1="0" y1="20" x2="25" y2="20" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="50" x2="25" y2="50" stroke="#64748b" strokeWidth="2.5" />
          <path d="M 18 10 Q 32 35 18 60" fill="none" stroke={isHigh ? '#22d3ee' : '#334155'} strokeWidth="3" />
          <path
            d="M 27 10 Q 42 35 27 60 Q 56 60 76 35 Q 56 10 27 10 Z"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          <circle cx="82" cy="35" r="5.5" fill="#0f172a" stroke={isHigh ? '#22d3ee' : '#334155'} strokeWidth="2.5" />
          <line x1="88" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="48" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
            XNOR
          </text>
        </svg>
      );

    case 'BUFFER':
      return (
        <svg width={width} height={height} viewBox="0 0 110 70" className="overflow-visible select-none pointer-events-none">
          <line x1="0" y1="35" x2="30" y2="35" stroke="#64748b" strokeWidth="2.5" />
          <polygon
            points="30,12 30,58 78,35"
            fill="#0f172a"
            stroke={isHigh ? '#22d3ee' : '#334155'}
            strokeWidth="3"
            filter={isHigh ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))' : undefined}
          />
          <line x1="78" y1="35" x2="110" y2="35" stroke={isHigh ? '#22d3ee' : '#64748b'} strokeWidth="2.5" />
          <text x="46" y="39" textAnchor="middle" fill={isHigh ? '#67e8f9' : '#94a3b8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
            BUF
          </text>
        </svg>
      );

    case 'LIGHTBULB':
      return (
        <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl select-none">
          {/* Incandescent Lightbulb Shape (Textbook p. 75) */}
          <div className="relative">
            <svg width="60" height="60" viewBox="0 0 60 60" className="overflow-visible">
              <defs>
                <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                  <stop offset="40%" stopColor="#facc15" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Glowing Halo when ON */}
              {isHigh && (
                <circle cx="30" cy="24" r="28" fill="url(#bulbGlow)" className="animate-pulse" />
              )}

              {/* Glass Bulb Dome */}
              <path
                d="M 20 38 C 15 32 12 25 15 16 C 18 8 28 4 38 7 C 46 10 48 20 44 28 C 42 32 40 38 40 38 Z"
                fill={isHigh ? '#fef08a' : '#1e293b'}
                stroke={isHigh ? '#facc15' : '#475569'}
                strokeWidth="2"
                filter={isHigh ? 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.8))' : undefined}
              />

              {/* Internal Filament */}
              <path
                d="M 26 38 L 26 24 L 30 18 L 34 24 L 34 38"
                fill="none"
                stroke={isHigh ? '#ea580c' : '#334155'}
                strokeWidth="2"
              />

              {/* Screw Base & Terminal */}
              <rect x="23" y="38" width="14" height="4" rx="1" fill="#475569" stroke="#64748b" strokeWidth="1" />
              <rect x="24" y="42" width="12" height="4" rx="1" fill="#334155" stroke="#64748b" strokeWidth="1" />
              <path d="M 26 46 Q 30 50 34 46 Z" fill="#1e293b" />
            </svg>
          </div>

          <div className="mt-1 flex flex-col items-center">
            <span className="text-xs font-bold font-mono text-white">
              {label || 'OUTPUT'} = <span className={isHigh ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>{outputVal}</span>
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-full mt-0.5 ${
              isHigh ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-slate-900 text-slate-500'
            }`}>
              {isHigh ? 'HIGH (1)' : 'LOW (0)'}
            </span>
          </div>
        </div>
      );

    case 'SWITCH':
      return null; // Handled directly in interactive switch component
    default:
      return null;
  }
};
