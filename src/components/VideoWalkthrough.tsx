import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Maximize2, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { VideoScene, SectionTab } from '../types';

interface VideoWalkthroughProps {
  onJumpToLab: (tab: SectionTab) => void;
}

export const VideoWalkthrough: React.FC<VideoWalkthroughProps> = ({ onJumpToLab }) => {
  const scenes: VideoScene[] = [
    {
      id: 'a121-intro',
      title: '1. Number Systems: Babbage, Setun & Binary (A1.2.1)',
      duration: 14,
      subtopic: 'A1.2.1 Principal Methods',
      textbookRef: 'Hodder p. 24–25 (PDF p. 34–35)',
      visualType: 'number-bases',
      caption: 'Babbage tried base-10, the Soviet Setun (1958) tried base-3 ternary. Modern computing chose base-2 binary because 2-state transistors provide supreme noise immunity!',
      narration: 'Topic A1.2.1 examines the history of representing data. Babbage used base-10 decimal for the Analytical Engine. In 1958, the Soviet Union built over 50 Setun computers using base-3 ternary. Yet modern computers settled on binary because transistors act naturally as two-state electrical switches. Two-state logic resists electrical noise and perfectly implements Boolean algebra.'
    },
    {
      id: 'a121-conversions',
      title: '2. Conversions: Doubling & Division Methods (A1.2.1)',
      duration: 15,
      subtopic: 'A1.2.1 Number Conversions',
      textbookRef: 'Hodder p. 26–28 (PDF p. 36–38)',
      visualType: 'number-bases',
      caption: 'Converting Binary to Decimal via the Doubling Method (double & add next bit), and Decimal to Binary via repeated division by 2, collecting remainders bottom-to-top.',
      narration: 'Converting numbers is an essential IB skill. To convert binary to decimal, use the Doubling Method: start with the leftmost bit, double the running total, and add the next bit. To convert decimal to binary, repeatedly divide by 2, record the quotients and remainders, then read the remainders from bottom to top (LSB first).'
    },
    {
      id: 'ascii',
      title: '3. Characters: ASCII Bit-Level Architecture (A1.2.2)',
      duration: 15,
      subtopic: 'A1.2.2 Characters & Strings',
      textbookRef: 'Hodder p. 31–32 (PDF p. 41–42)',
      visualType: 'ascii',
      caption: 'In standard ASCII: First 3 bits dictate casing (010 = Upper, 011 = Lower), and the last 5 bits store the letter position in the alphabet (00001 = 1 = A).',
      narration: 'Topic A1.2.2 explains how binary stores data. For text, standard ASCII uses an ingenious mathematical layout: the first three bits from the left dictate casing (010 for uppercase, 011 for lowercase). The remaining five bits store the letter\'s alphabetical position (00001 is 1). Space is 00100000.'
    },
    {
      id: 'utf8',
      title: '4. Unicode & UTF-8 Variable-Length Encoding (A1.2.2)',
      duration: 15,
      subtopic: 'A1.2.2 Unicode Standards',
      textbookRef: 'Hodder p. 32–34 (PDF p. 42–44)',
      visualType: 'utf8',
      caption: 'UTF-8 is 100% backward compatible with 7-bit ASCII. Multi-byte characters use continuation bytes (10...) to prevent desynchronization across global networks.',
      narration: 'In 1991, the Unicode Consortium created a universal standard for all world languages and emojis. UTF-8 was created on the back of a napkin in 1987. It uses 1 to 4 bytes per character. 1-byte characters match ASCII exactly, while multi-byte characters use continuation bytes starting with 10 so transmission never loses synchronization.'
    },
    {
      id: 'images',
      title: '5. Digital Images: Pixels & Colour Depth (A1.2.2)',
      duration: 14,
      subtopic: 'A1.2.2 Bitmap Graphics',
      textbookRef: 'Hodder p. 37–40 (PDF p. 47–50)',
      visualType: 'pixels',
      caption: 'Image Size = Width × Height × Colour Depth (bits) + Metadata. 24-bit True Colour allocates 1 byte each for Red, Green, and Blue (16.8 million colours).',
      narration: 'In 1957, Russell Kirsch scanned the first digital image. Raster images are 2D grids of pixels. In a 1-bit monochrome image, each pixel is 0 or 1. Increasing colour depth to 24-bit True Colour uses 3 bytes per pixel: Red, Green, and Blue, allowing 16.8 million colors without banding.'
    },
    {
      id: 'audio',
      title: '6. Audio: ADC Sampling & Bit Depth (A1.2.2)',
      duration: 15,
      subtopic: 'A1.2.2 Sound Sampling',
      textbookRef: 'Hodder p. 44–46 (PDF p. 54–56)',
      visualType: 'audio',
      caption: 'Sound is a continuous wave. ADC samples amplitude at discrete intervals (Hz). CD Audio uses 44.1 kHz, 16-bit, stereo (176,400 bytes/sec).',
      narration: 'Physical sound is a continuous analogue wave. An ADC samples the amplitude at regular intervals. CD quality captures 44,100 samples per second at 16-bit depth across 2 stereo channels. That equals 176,400 bytes every second, or over 10 megabytes per minute.'
    },
    {
      id: 'video',
      title: '7. Digital Video & Spatial/Temporal Compression (A1.2.2)',
      duration: 15,
      subtopic: 'A1.2.2 Digital Video',
      textbookRef: 'Hodder p. 46–47 (PDF p. 56–57)',
      visualType: 'video-frames',
      caption: 'Uncompressed 1080p video at 30 fps requires ~112 GB for 10 minutes! Temporal compression only records motion vectors and differences between frames.',
      narration: 'Video is a rapid sequence of still frames shown at 24 to 60 fps to create the illusion of motion. Without compression, a 10-minute HD video requires over 111 gigabytes! Temporal compression solves this by only recording the delta and motion vectors between consecutive frames.'
    },
    {
      id: 'integers',
      title: '8. Two\'s Complement & Gray Code (A1.2.2)',
      duration: 16,
      subtopic: 'A1.2.2 Integer Encodings',
      textbookRef: 'Hodder p. 47–51 (PDF p. 57–61)',
      visualType: 'twos-comp',
      caption: 'Two\'s complement: Invert bits + add 1. Eliminates dual zero and allows subtraction using standard addition hardware. Gray code flips only 1 bit per step.',
      narration: 'Sign-magnitude and One\'s complement suffer from two representations of zero (+0 and -0). Modern CPUs use Two\'s Complement: invert all bits and add one. This eliminates negative zero and allows subtraction using existing adder circuits. For robotic sensors, Gray code is used so only one bit flips at a time.'
    },
    {
      id: 'gates-a123',
      title: '9. Purpose of Logic Gates & Transistors (A1.2.3)',
      duration: 16,
      subtopic: 'A1.2.3 Logic Gates',
      textbookRef: 'Hodder p. 51–56 (PDF p. 61–66)',
      visualType: 'logic-gate',
      caption: 'Transistors in series form AND gates (both must conduct). Transistors in parallel form OR gates (either conducts). Inverters ground output for NOT gates.',
      narration: 'Topic A1.2.3 explores logic gates. Following George Boole and Claude Shannon, Bell Labs invented the transistor in 1947. Connecting two transistors in series creates an AND gate: current only flows when both inputs are energized. Connecting them in parallel creates an OR gate. Combining basic gates gives NAND, NOR, and XOR.'
    },
    {
      id: 'truth-a124',
      title: '10. Truth Tables & Karnaugh Maps (A1.2.4)',
      duration: 16,
      subtopic: 'A1.2.4 Truth Tables & K-Maps',
      textbookRef: 'Hodder p. 56–65 (PDF p. 66–75)',
      visualType: 'truth-table',
      caption: 'Construct 2ⁿ truth table rows with alternating columns (0/1, 00/11, 0000/1111). Karnaugh maps simplify expressions using Gray code headings (00, 01, 11, 10).',
      narration: 'Topic A1.2.4 covers truth tables and Karnaugh maps. A 3-input circuit requires 2³ = 8 rows, constructed systematically from right to left. Karnaugh maps visually group adjacent ones in powers of 2. Columns must use Gray code (00, 01, 11, 10) so only one bit changes, allowing edge wrap-around grouping to minimize logic gates.'
    },
    {
      id: 'diagrams-a125',
      title: '11. Constructing Logic Diagrams (A1.2.5)',
      duration: 16,
      subtopic: 'A1.2.5 Logic Diagrams',
      textbookRef: 'Hodder p. 65–66 (PDF p. 75–76)',
      visualType: 'circuit',
      caption: 'Translating Boolean expressions into physical circuits: Y = (A · B) + (Ā · B̄). Signals propagate from input switches through gate layers to the output lightbulb.',
      narration: 'Finally, Topic A1.2.5 constructs complete logic diagrams from Boolean algebra. In the textbook example, Y = (A · B) + (Ā · B̄) is constructed step-by-step: first parenthesis uses an AND gate, second parenthesis uses NOT gates into an AND gate, linked by an OR gate to illuminate the output lamp whenever A and B have identical values.'
    }
  ];

  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const activeScene = scenes[currentSceneIndex];

  // Timer loop for scene progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= activeScene.duration) {
            // Next scene
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex(curr => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return activeScene.duration;
            }
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentSceneIndex, activeScene.duration, scenes.length]);

  const selectScene = (index: number) => {
    setCurrentSceneIndex(index);
    setProgressSec(0);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setProgressSec(0);
    setIsPlaying(true);
  };

  // Map visualType to corresponding interactive lab tab
  const getCorrespondingTab = (type: VideoScene['visualType']): SectionTab => {
    switch (type) {
      case 'number-bases':
        return 'number-systems';
      case 'ascii':
      case 'utf8':
      case 'pixels':
      case 'audio':
      case 'video-frames':
      case 'twos-comp':
      case 'gray-code':
        return 'binary-storage';
      case 'logic-gate':
        return 'gate-catalog';
      case 'truth-table':
        return 'truth-tables';
      case 'circuit':
        return 'circuit-builder';
      default:
        return 'circuit-builder';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Lesson Video Screen Container */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Virtual Video Viewport / Canvas Stage */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none border-b border-slate-800/80">
          {/* Subtle Cyber Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          {/* Glowing Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Overlay: Title & Textbook Citation */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                IBDP CS Lesson Video
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-cyan-400">{activeScene.subtopic}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800 backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeScene.textbookRef}</span>
            </div>
          </div>

          {/* Dynamic Scene Visualizer Centerpiece */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4">
            {/* Visual for Scene 1 & 2: ASCII */}
            {activeScene.visualType === 'ascii' && (
              <div className="space-y-4 text-center max-w-xl animate-fade-in">
                <div className="text-5xl sm:text-6xl font-extrabold font-mono text-white tracking-widest flex items-center justify-center gap-3">
                  <span className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/10">
                    010
                  </span>
                  <span className="text-slate-600 font-sans">•</span>
                  <span className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/10">
                    00001
                  </span>
                  <span className="text-slate-600 font-sans">=</span>
                  <span className="p-3 rounded-2xl bg-cyan-500 text-slate-950 font-sans shadow-lg shadow-cyan-500/30">
                    'A'
                  </span>
                </div>
                <div className="flex justify-center gap-8 text-xs font-mono">
                  <div className="text-amber-300">
                    <strong>First 3 Bits (Left):</strong>
                    <br />010 = UPPERCASE (011 = Lower)
                  </div>
                  <div className="text-emerald-300">
                    <strong>First 5 Bits (Right):</strong>
                    <br />00001 = 1st Letter in Alphabet (A)
                  </div>
                </div>
              </div>
            )}

            {/* Visual for Scene 3: UTF-8 */}
            {activeScene.visualType === 'utf8' && (
              <div className="space-y-3 text-center max-w-2xl font-mono">
                <div className="text-3xl font-bold text-cyan-300">
                  Unicode 15.0: 149,186 Characters
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl mb-1">A</div>
                    <div className="text-slate-400 text-[10px]">1 Byte</div>
                    <div className="text-cyan-400 font-bold">01000001</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl mb-1">é</div>
                    <div className="text-slate-400 text-[10px]">2 Bytes</div>
                    <div className="text-indigo-400 font-bold">11000011 10101001</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl mb-1">汉</div>
                    <div className="text-slate-400 text-[10px]">3 Bytes</div>
                    <div className="text-purple-400 font-bold">11100110 10110011...</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl mb-1">💩</div>
                    <div className="text-slate-400 text-[10px]">4 Bytes</div>
                    <div className="text-amber-400 font-bold">11110000 10011111...</div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual for Scene 4: Pixels */}
            {activeScene.visualType === 'pixels' && (
              <div className="space-y-3 text-center max-w-xl">
                <div className="inline-grid grid-cols-8 gap-1.5 p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                  {Array(32).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-md font-mono text-[10px] flex items-center justify-center font-bold transition-all ${
                        (i % 3 === 0 || i % 7 === 0) 
                          ? 'bg-emerald-400 text-slate-950 scale-105' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {(i % 3 === 0 || i % 7 === 0) ? '1' : '0'}
                    </div>
                  ))}
                </div>
                <div className="text-xs font-mono text-emerald-300">
                  Image Size = Width × Height × Colour Depth + Metadata
                </div>
              </div>
            )}

            {/* Visual for Scene 5: Audio */}
            {activeScene.visualType === 'audio' && (
              <div className="space-y-3 text-center w-full max-w-md">
                <div className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800 p-2 flex items-center justify-around relative">
                  <div className="absolute inset-x-0 h-0.5 bg-slate-800" />
                  {[20, 55, 85, 95, 80, 50, 20, 10, 20, 50, 80, 95, 85, 55].map((h, i) => (
                    <div key={i} className="flex flex-col items-center h-full justify-center z-10">
                      <div 
                        className="w-1.5 bg-rose-500 rounded-full transition-all duration-300 shadow-sm shadow-rose-500/50"
                        style={{ height: `${h}%` }}
                      />
                      <div className="w-2.5 h-2.5 rounded-full bg-white border border-rose-500 -mt-1 shadow" />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-mono text-sky-300">
                  44,100 samples/sec × 16 bits/sample × 2 channels = 176,400 bytes/sec
                </div>
              </div>
            )}

            {/* Visual for Scene 6: Video */}
            {activeScene.visualType === 'video-frames' && (
              <div className="space-y-3 text-center max-w-xl">
                <div className="flex items-center justify-center gap-2 font-mono text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Frame N</span>
                    <div className="w-16 h-12 bg-slate-950 rounded flex items-center justify-center border border-slate-800">
                      <span className="text-cyan-400">⛰️ ●</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                  <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800">
                    <span className="text-purple-300 block mb-1">Temporal Delta</span>
                    <div className="w-16 h-12 bg-slate-950 rounded flex items-center justify-center border border-purple-600">
                      <span className="text-amber-400 font-bold">+Δx</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Frame N+1</span>
                    <div className="w-16 h-12 bg-slate-950 rounded flex items-center justify-center border border-slate-800">
                      <span className="text-cyan-400">⛰️ &nbsp;●</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-purple-300">
                  Only moving pixels are transmitted • Static background is reused!
                </div>
              </div>
            )}

            {/* Visual for Scene 7: Two's Complement */}
            {activeScene.visualType === 'twos-comp' && (
              <div className="space-y-2 text-center max-w-lg font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">1. Positive (+5):</span>
                  <span className="text-cyan-300 font-bold text-sm tracking-widest">0000 0101</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-indigo-400">2. Invert Bits:</span>
                  <span className="text-indigo-300 font-bold text-sm tracking-widest">1111 1010</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800 flex justify-between items-center">
                  <span className="text-emerald-400 font-bold">3. Add 1 (=-5):</span>
                  <span className="text-emerald-300 font-bold text-sm tracking-widest">1111 1011</span>
                </div>
              </div>
            )}

            {/* Visual for Scene 1 & 2: Number Bases & Conversions (A1.2.1) */}
            {activeScene.visualType === 'number-bases' && (
              <div className="space-y-3 text-center max-w-2xl font-mono">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Decimal (Base-10)</div>
                    <div className="text-2xl font-bold text-white mt-1">42₁₀</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Babbage Analytical</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 shadow">
                    <div className="text-[10px] text-cyan-400 uppercase font-bold">Binary (Base-2)</div>
                    <div className="text-xl font-bold text-cyan-300 mt-1">00101010₂</div>
                    <div className="text-[10px] text-cyan-500 mt-0.5">High Noise Margin</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 shadow">
                    <div className="text-[10px] text-purple-400 uppercase font-bold">Hex (Base-16)</div>
                    <div className="text-2xl font-bold text-purple-300 mt-1">2A₁₆</div>
                    <div className="text-[10px] text-purple-500 mt-0.5">Compact 4-bit nibbles</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 shadow">
                    <div className="text-[10px] text-amber-400 uppercase font-bold">Ternary (Base-3)</div>
                    <div className="text-2xl font-bold text-amber-300 mt-1">1120₃</div>
                    <div className="text-[10px] text-amber-500 mt-0.5">Soviet Setun (1958)</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-center gap-2">
                  <span className="text-cyan-400 font-bold">Doubling Method:</span>
                  <span>(1) → (1×2+0=2) → (2×2+1=5) → (5×2+0=10) → (10×2+1=21) → (21×2+0=<strong className="text-emerald-400">42</strong>)</span>
                </div>
              </div>
            )}

            {/* Visual for Scene 8: Gray Code vs Binary (A1.2.2) */}
            {activeScene.visualType === 'gray-code' && (
              <div className="space-y-3 text-center max-w-xl font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/60">
                    <div className="text-[11px] font-bold text-rose-400 mb-1">Standard Binary (Glitch Prone)</div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-slate-300">3: 011₂</span>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span className="text-rose-400 font-bold">4: 100₂</span>
                    </div>
                    <div className="text-[10px] text-rose-400/80 mt-1">
                      ⚠️ 3 bits flip at once! Timing lag causes transient false readings.
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/60">
                    <div className="text-[11px] font-bold text-emerald-400 mb-1">Gray Code (Robotics Safe)</div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-slate-300">3: 010₂</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-400 font-bold">4: 110₂</span>
                    </div>
                    <div className="text-[10px] text-emerald-400/80 mt-1">
                      ✓ Exactly 1 bit flips! Zero glitching in optical rotary encoders.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual for Scene 9: Transistors & Logic Gates (A1.2.3) */}
            {activeScene.visualType === 'logic-gate' && (
              <div className="space-y-3 text-center max-w-xl font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-800/50 flex flex-col items-center">
                    <div className="text-cyan-400 font-bold mb-1">Transistors in SERIES: AND Gate</div>
                    <div className="flex items-center gap-2 my-2 text-xs">
                      <span className="px-2 py-1 bg-cyan-900/60 text-cyan-200 rounded border border-cyan-700">T₁ (A)</span>
                      <span className="text-slate-500">───</span>
                      <span className="px-2 py-1 bg-cyan-900/60 text-cyan-200 rounded border border-cyan-700">T₂ (B)</span>
                      <span className="text-slate-500">───▶</span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-bold">OUT</span>
                    </div>
                    <div className="text-[10px] text-slate-400">BOTH switches must conduct for current to flow (A · B)</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-indigo-800/50 flex flex-col items-center">
                    <div className="text-indigo-400 font-bold mb-1">Transistors in PARALLEL: OR Gate</div>
                    <div className="flex flex-col items-center gap-1 my-1 text-xs">
                      <span className="px-2 py-0.5 bg-indigo-900/60 text-indigo-200 rounded border border-indigo-700">T₁ (A)</span>
                      <span className="text-[10px] text-indigo-300">║ parallel ║</span>
                      <span className="px-2 py-0.5 bg-indigo-900/60 text-indigo-200 rounded border border-indigo-700">T₂ (B)</span>
                    </div>
                    <div className="text-[10px] text-slate-400">EITHER switch conducts to deliver output current (A + B)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual for Scene 10: Truth Tables & K-Maps (A1.2.4) */}
            {activeScene.visualType === 'truth-table' && (
              <div className="space-y-2 text-center max-w-xl font-mono text-xs">
                <div className="flex items-center justify-center gap-4">
                  {/* Truth Table Miniature */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow text-[10px]">
                    <div className="grid grid-cols-4 gap-1 font-bold text-cyan-400 border-b border-slate-800 pb-1 mb-1">
                      <span>A</span><span>B</span><span>C</span><span>Y</span>
                    </div>
                    {[
                      { a: 0, b: 0, c: 0, y: 0 },
                      { a: 0, b: 1, c: 1, y: 1 },
                      { a: 1, b: 0, c: 1, y: 1 },
                      { a: 1, b: 1, c: 1, y: 1 },
                    ].map((row, i) => (
                      <div key={i} className={`grid grid-cols-4 gap-1 py-0.5 ${row.y === 1 ? 'text-emerald-300 font-bold bg-emerald-950/30 rounded' : 'text-slate-400'}`}>
                        <span>{row.a}</span><span>{row.b}</span><span>{row.c}</span><span>{row.y}</span>
                      </div>
                    ))}
                    <div className="text-[9px] text-slate-500 mt-1">2³ = 8 Systematic Rows</div>
                  </div>

                  {/* Karnaugh Map Miniature */}
                  <div className="bg-slate-900 border border-purple-800/60 rounded-xl p-2.5 shadow text-[10px]">
                    <div className="text-purple-300 font-bold mb-1">K-Map (Gray Code: 00 01 11 10)</div>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      <span className="text-slate-500">A\BC</span>
                      <span className="text-cyan-400 font-bold">00</span>
                      <span className="text-cyan-400 font-bold">01</span>
                      <span className="text-cyan-400 font-bold">11</span>
                      <span className="text-cyan-400 font-bold">10</span>

                      <span className="text-slate-400 font-bold">0</span>
                      <span className="text-slate-600">0</span>
                      <span className="p-0.5 bg-emerald-950 text-emerald-400 rounded font-bold ring-1 ring-emerald-500">1</span>
                      <span className="p-0.5 bg-emerald-950 text-emerald-400 rounded font-bold ring-1 ring-emerald-500">1</span>
                      <span className="text-slate-600">0</span>

                      <span className="text-slate-400 font-bold">1</span>
                      <span className="text-slate-600">0</span>
                      <span className="p-0.5 bg-emerald-950 text-emerald-400 rounded font-bold ring-1 ring-emerald-500">1</span>
                      <span className="p-0.5 bg-emerald-950 text-emerald-400 rounded font-bold ring-1 ring-emerald-500">1</span>
                      <span className="text-slate-600">0</span>
                    </div>
                    <div className="text-[9px] text-emerald-400 mt-1.5 font-bold">Group 4 adjacent 1s → Simplifies to C!</div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual for Scene 11: Constructing Logic Diagrams (A1.2.5) */}
            {activeScene.visualType === 'circuit' && (
              <div className="space-y-3 text-center max-w-xl font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-around shadow-xl">
                  {/* Inputs */}
                  <div className="flex flex-col gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">A = 1</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">B = 1</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                  {/* Gate Layer */}
                  <div className="flex flex-col gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-[10px]">
                      AND Gate (A · B)
                    </div>
                    <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 text-[10px]">
                      AND Gate (Ā · B̄)
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 animate-pulse" />
                  {/* Final Gate */}
                  <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-700 text-purple-300 font-bold">
                    OR Gate (+)
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
                  {/* Output Lightbulb */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 flex items-center justify-center text-slate-950 font-bold text-xs animate-pulse">
                      ON
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1 font-bold">Y = 1</span>
                  </div>
                </div>
                <div className="text-[11px] text-cyan-300">
                  Boolean Expression: Y = (A · B) + (Ā · B̄) • Active circuit live simulation
                </div>
              </div>
            )}
          </div>

          {/* Bottom Captions & Narration Banner */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-center space-y-1.5 shadow-xl">
            <div className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
              {activeScene.caption}
            </div>
            <div className="text-[11px] text-slate-400 italic">
              "{activeScene.narration}"
            </div>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 bg-slate-900/95 border-b border-slate-800 space-y-3">
          {/* Progress Timeline Scrubber */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">{activeScene.title}</span>
              <span>{progressSec.toFixed(1)}s / {activeScene.duration.toFixed(1)}s</span>
            </div>
            <div 
              className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setProgressSec(pos * activeScene.duration);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-100"
                style={{ width: `${(progressSec / activeScene.duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentSceneIndex > 0) selectScene(currentSceneIndex - 1);
                }}
                disabled={currentSceneIndex === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
                title="Previous Scene"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Video' : 'Resume Playback'}</span>
              </button>

              <button
                onClick={() => {
                  if (currentSceneIndex < scenes.length - 1) selectScene(currentSceneIndex + 1);
                }}
                disabled={currentSceneIndex === scenes.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
                title="Next Scene"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Restart From Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {[1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg font-mono text-[11px] ${
                      playbackSpeed === speed 
                        ? 'bg-cyan-500 text-slate-950 font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Pause & Try in Simulator CTA */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  onJumpToLab(getCorrespondingTab(activeScene.visualType));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Pause & Open in Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scene Playlist / Chapters Index */}
        <div className="p-4 bg-slate-950/70 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Lesson Video Chapters (Scrub to any topic):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => selectScene(idx)}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                  currentSceneIndex === idx
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="truncate pr-2">
                  <div className={`font-semibold truncate ${currentSceneIndex === idx ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {scene.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{scene.subtopic}</div>
                </div>
                <span className="font-mono text-[10px] shrink-0 text-slate-400">{scene.duration}s</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
