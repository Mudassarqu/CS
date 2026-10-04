import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Maximize2, 
  BookOpen, 
  Info, 
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { SectionTab } from '../types';

interface HeaderProps {
  currentTab: SectionTab;
  onSelectTab: (tab: SectionTab) => void;
  walkthroughActive: boolean;
  onToggleWalkthrough: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  walkthroughActive,
  onToggleWalkthrough,
  onReset,
}) => {
  const getTabTitle = (tab: SectionTab) => {
    switch (tab) {
      case 'number-systems':
        return {
          title: 'Principal Methods of Representing Data (Topic A1.2.1)',
          subtitle: 'Base-2, Base-10, Base-16, Ternary Setun, Doubling & Division methods, and Transistor noise immunity.',
          page: 'pp. 24–31 (PDF 34–41)',
        };
      case 'circuit-builder':
        return {
          title: 'Circuit Builder Canvas: Logic Gates & Diagrams',
          subtitle: 'Place AND, OR, NOT, XOR, NAND, NOR gates, wire inputs/outputs & toggle switches in real-time.',
          page: 'pp. 65–66 (PDF 75–76)',
        };
      case 'gate-catalog':
        return {
          title: 'Logic Gates & Transistor Architecture',
          subtitle: 'Transistors in series (AND) and parallel (OR), inverters (NOT), truth tables & Boolean algebra.',
          page: 'pp. 51–56 (PDF 61–66)',
        };
      case 'truth-tables':
        return {
          title: 'Truth Table Construction & Analysis',
          subtitle: '3-input 2³=8 row systematically alternating tables, intermediate terms (P, Q, R), and logic evaluation.',
          page: 'pp. 56–60 (PDF 66–70)',
        };
      case 'binary-storage':
        return {
          title: 'How Binary Stores Data (Topic A1.2.2)',
          subtitle: 'Characters (ASCII/UTF-8), Bitmap Images, Audio ADC Sampling, Video Frames & Integer Encodings.',
          page: 'pp. 31–51 (PDF 41–61)',
        };
      case 'ib-exam-practice':
        return {
          title: 'IB DP Exam Practice Suite: Topics A1.2.1 – A1.2.5',
          subtitle: 'Authentic IB Paper 1 questions, detailed markschemes, examiner tips, and easy plain-English explanations.',
          page: 'Hodder pp. 24–66 Exam Prep',
        };
      case 'misconceptions':
        return {
          title: 'Common Misconceptions & IB Exam Practice',
          subtitle: 'Address tricky exam traps, calculation mistakes, and test your knowledge against the Hodder textbook questions.',
          page: 'Chapter Review pp. 58–66',
        };
      case 'video-walkthrough':
        return {
          title: 'Animated Lesson Simulation (Video Walkthrough Mode)',
          subtitle: 'Step-by-step automated visual guide ready for classroom display or screen recording.',
          page: 'Topic A1.2 Complete',
        };
    }
  };

  const currentInfo = getTabTitle(currentTab);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono font-medium">
          <span>IBDP CS</span>
          <span className="text-slate-600">•</span>
          <span>A1.2.2</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
            {walkthroughActive ? '🎬 Animated Walkthrough Mode' : currentInfo.title}
          </h2>
          <p className="text-[11px] text-slate-400 truncate hidden md:block">
            {walkthroughActive 
              ? 'Automated narrated lesson video. Scrub chapters below or record for your class presentation.'
              : currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentInfo.page}</span>
        </span>

        <button
          onClick={onReset}
          title="Reset simulator values to defaults"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={onToggleWalkthrough}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
            walkthroughActive
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-cyan-900/30'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{walkthroughActive ? 'Exit Walkthrough' : 'Play Walkthrough'}</span>
        </button>

        <button
          onClick={toggleFullScreen}
          title="Toggle Fullscreen"
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
