import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  Video, 
  Binary, 
  Tv2, 
  HelpCircle, 
  BookOpen, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  GitBranch,
  Zap,
  Table2,
  Award
} from 'lucide-react';
import { SectionTab } from '../types';

interface SidebarProps {
  currentTab: SectionTab;
  onSelectTab: (tab: SectionTab) => void;
  walkthroughActive: boolean;
  onToggleWalkthrough: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  walkthroughActive,
  onToggleWalkthrough,
}) => {
  const syllabusItems = [
    { id: 'number-systems', label: 'Number Systems & Base-2', icon: Binary, desc: 'Base-2/10/16/3, Doubling & Division methods', badge: 'A1.2.1' },
    { id: 'binary-storage', label: 'How Binary Stores Data', icon: Layers, desc: 'Text (ASCII/UTF-8), Images, Audio, Video, 2\'s Comp', badge: 'A1.2.2' },
    { id: 'gate-catalog', label: 'Logic Gates & Transistors', icon: Zap, desc: 'AND, OR, NOT, XOR & Transistor inner workings', badge: 'A1.2.3' },
    { id: 'truth-tables', label: 'Truth Tables & K-Maps', icon: Table2, desc: '2ⁿ rows, intermediate terms, Gray code K-maps', badge: 'A1.2.4' },
    { id: 'circuit-builder', label: 'Logic Circuit Builder', icon: Cpu, desc: 'Place gates, wire inputs/outputs & toggle switches', badge: 'A1.2.5' },
  ];

  const getCurrentTopicDetails = () => {
    switch (currentTab) {
      case 'number-systems':
        return { code: 'Topic A1.2.1', title: 'Representing Data', desc: 'Base-2/10/16/3, Doubling & Division algorithms, and transistor noise margins.' };
      case 'binary-storage':
        return { code: 'Topic A1.2.2', title: 'Binary Data Storage', desc: 'Characters (ASCII/UTF-8), Bitmap Images, Audio ADC, Video & Two\'s Complement.' };
      case 'gate-catalog':
        return { code: 'Topic A1.2.3', title: 'Purpose of Logic Gates', desc: 'Transistors as electronic switches, series/parallel circuit paths, and universal gates.' };
      case 'truth-tables':
        return { code: 'Topic A1.2.4', title: 'Truth Tables & K-Maps', desc: '2ⁿ rows, systematic counting pattern, intermediate terms & Karnaugh maps.' };
      case 'circuit-builder':
        return { code: 'Topic A1.2.5', title: 'Logic Diagrams', desc: 'Interactive canvas: place gates, connect wires & test circuits with live signals.' };
      case 'ib-exam-practice':
        return { code: 'Exam Suite', title: 'A1.2.1 – A1.2.5 Questions', desc: '10 Paper 1 questions, full markschemes, easy explanations & progress tracking.' };
      case 'misconceptions':
        return { code: 'Review', title: 'Common IB Misconceptions', desc: 'Exam traps and critical pitfalls highlighted from the Hodder textbook.' };
      default:
        return { code: 'A1.2 Core', title: 'Data Representation', desc: 'Grade 12 Computer Science: Complete A1.2 Curriculum.' };
    }
  };

  const currentTopic = getCurrentTopicDetails();

  return (
    <aside className="w-80 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col h-screen select-none shrink-0 z-20">
      {/* Header Branding */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-mono font-bold text-sm">
            01
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">IBDP CS Grade 12</span>
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-cyan-950 text-cyan-300 rounded border border-cyan-800/50">Core</span>
            </div>
            <h1 className="text-sm font-bold text-slate-100 leading-tight">Data Representation Lab</h1>
          </div>
        </div>

        {/* Current Syllabus Topic Badge */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-mono text-cyan-400 font-semibold">{currentTopic.code}</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Unit
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-200">{currentTopic.title}</div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">
            {currentTopic.desc}
          </p>
        </div>
      </div>

      {/* Main Mode CTA: Animated Walkthrough vs Lab */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-950/30">
        <button
          onClick={onToggleWalkthrough}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all shadow-sm ${
            walkthroughActive
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-rose-900/30 ring-2 ring-rose-400/40'
              : 'bg-gradient-to-r from-cyan-600/20 hover:from-cyan-600/30 to-indigo-600/20 text-cyan-300 border border-cyan-700/40 hover:border-cyan-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Tv2 className={`w-4 h-4 ${walkthroughActive ? 'animate-pulse text-white' : 'text-cyan-400'}`} />
            <div className="text-left">
              <div className="font-semibold leading-tight">Animated Walkthrough</div>
              <div className="text-[10px] opacity-80">Lesson Video / Screen-Record Mode</div>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
            walkthroughActive ? 'bg-black/30 text-white' : 'bg-cyan-500/20 text-cyan-300'
          }`}>
            {walkthroughActive ? 'ON AIR' : 'START'}
          </span>
        </button>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-2 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Interactive Labs</span>
          <span className="text-[10px] text-cyan-400 font-mono">A1.2.1 – A1.2.5</span>
        </div>

        {syllabusItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id && !walkthroughActive;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (walkthroughActive) onToggleWalkthrough();
                onSelectTab(item.id as SectionTab);
              }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-cyan-600/15 border border-cyan-500/40 text-white shadow-sm'
                  : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
              }`}
            >
              <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-semibold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 font-mono">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}

        {/* Misconceptions & Exam Prep */}
        <div className="pt-3 space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            IB Exam & Assessment Prep
          </div>

          <button
            onClick={() => {
              if (walkthroughActive) onToggleWalkthrough();
              onSelectTab('ib-exam-practice');
            }}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
              currentTab === 'ib-exam-practice' && !walkthroughActive
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 text-white shadow-sm'
                : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              currentTab === 'ib-exam-practice' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'
            }`}>
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-300">IB Exam Questions & Answers</div>
              <div className="text-[11px] text-slate-400">Full Paper 1 format & easy explanations</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (walkthroughActive) onToggleWalkthrough();
              onSelectTab('misconceptions');
            }}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
              currentTab === 'misconceptions' && !walkthroughActive
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 shadow-sm'
                : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              currentTab === 'misconceptions' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'
            }`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-300">Common Mistakes & Traps</div>
              <div className="text-[11px] text-slate-400">Hodder textbook "Common Mistake" boxes</div>
            </div>
          </button>
        </div>

        {/* Syllabus Roadmap Preview */}
        <div className="pt-3 border-t border-slate-800/60 mt-3">
          <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GitBranch className="w-3 h-3 text-cyan-400" />
            <span>Syllabus A1.2 Full Coverage</span>
          </div>
          <div className="space-y-1 text-xs">
            {[
              { id: 'number-systems', code: 'A1.2.1', label: 'Principal Methods', tag: 'Doubling/Div' },
              { id: 'binary-storage', code: 'A1.2.2', label: 'How Binary Stores Data', tag: 'Text/Media' },
              { id: 'gate-catalog', code: 'A1.2.3', label: 'Logic Gates Purpose', tag: 'Transistors' },
              { id: 'truth-tables', code: 'A1.2.4', label: 'Truth Tables & K-Maps', tag: '2ⁿ Rows' },
              { id: 'circuit-builder', code: 'A1.2.5', label: 'Logic Diagrams Canvas', tag: 'Interactive' },
            ].map((topic) => {
              const isSelected = currentTab === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    if (walkthroughActive) onToggleWalkthrough();
                    onSelectTab(topic.id as SectionTab);
                  }}
                  className={`w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-600/70 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`font-mono text-[11px] ${isSelected ? 'font-bold text-cyan-300' : ''}`}>
                    {topic.code} {topic.label}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isSelected ? 'bg-cyan-900/60 text-cyan-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {isSelected ? 'Active' : topic.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hodder IBDP CS Guide</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">pp. 24–66</span>
      </div>
    </aside>
  );
};
