import React, { useState } from 'react';
import { SectionTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CircuitBuilder } from './components/CircuitBuilder';
import { GateCatalog } from './components/GateCatalog';
import { TruthTableAnalyzer } from './components/TruthTableAnalyzer';
import { BinaryStorageLab } from './components/BinaryStorageLab';
import { VideoWalkthrough } from './components/VideoWalkthrough';
import { MisconceptionsQuiz } from './components/MisconceptionsQuiz';
import { IBExamPractice } from './components/IBExamPractice';
import { NumberSystemsLab } from './components/NumberSystemsLab';

export default function App() {
  const [currentTab, setCurrentTab] = useState<SectionTab>('circuit-builder');
  const [walkthroughActive, setWalkthroughActive] = useState<boolean>(false);
  const [resetCounter, setResetCounter] = useState<number>(0);

  const handleToggleWalkthrough = () => {
    setWalkthroughActive(!walkthroughActive);
  };

  const handleJumpToLab = (tab: SectionTab) => {
    setWalkthroughActive(false);
    setCurrentTab(tab);
  };

  const handleReset = () => {
    setResetCounter(prev => prev + 1);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        walkthroughActive={walkthroughActive}
        onToggleWalkthrough={handleToggleWalkthrough}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          walkthroughActive={walkthroughActive}
          onToggleWalkthrough={handleToggleWalkthrough}
          onReset={handleReset}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
          <div className="max-w-7xl mx-auto" key={resetCounter}>
            {walkthroughActive ? (
              <VideoWalkthrough onJumpToLab={handleJumpToLab} />
            ) : (
              <>
                {currentTab === 'number-systems' && <NumberSystemsLab />}
                {currentTab === 'binary-storage' && <BinaryStorageLab />}
                {currentTab === 'gate-catalog' && <GateCatalog />}
                {currentTab === 'truth-tables' && <TruthTableAnalyzer />}
                {currentTab === 'circuit-builder' && <CircuitBuilder />}
                {currentTab === 'ib-exam-practice' && <IBExamPractice />}
                {currentTab === 'misconceptions' && <MisconceptionsQuiz />}
                {currentTab === 'video-walkthrough' && <VideoWalkthrough onJumpToLab={handleJumpToLab} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
