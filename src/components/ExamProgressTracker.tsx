import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Award, 
  TrendingUp, 
  GraduationCap, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  Target,
  FileCheck,
  Zap
} from 'lucide-react';

export interface TopicProgressSummary {
  topicId: number;
  title: string;
  totalSubQuestions: number;
  answeredSubQuestions: number;
  masteredSubQuestions: number;
  earnedMarks: number;
  maxMarks: number;
}

interface ExamProgressTrackerProps {
  totalQuestions: number; // e.g. 13 subquestions
  answeredCount: number;
  masteredCount: number;
  totalMarksEarned: number;
  maxTotalMarks: number;
  topicBreakdown: TopicProgressSummary[];
  onJumpToUnanswered?: () => void;
  onResetProgress: () => void;
  onFilterStatus?: (status: 'all' | 'unanswered' | 'answered') => void;
  currentFilterStatus?: 'all' | 'unanswered' | 'answered';
}

export const ExamProgressTracker: React.FC<ExamProgressTrackerProps> = ({
  totalQuestions,
  answeredCount,
  masteredCount,
  totalMarksEarned,
  maxTotalMarks,
  topicBreakdown,
  onJumpToUnanswered,
  onResetProgress,
  onFilterStatus,
  currentFilterStatus = 'all',
}) => {
  const percentage = maxTotalMarks > 0 ? (totalMarksEarned / maxTotalMarks) * 100 : 0;
  const answeredPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Official IB Grade Boundaries for CS
  const getIBGradeDetails = (pct: number) => {
    if (pct >= 80) return { grade: 7, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40', title: 'Grade 7 (Excellent)', desc: 'High Distinction / Proficient' };
    if (pct >= 68) return { grade: 6, color: 'text-cyan-400', bg: 'bg-cyan-500/20 border-cyan-500/40', title: 'Grade 6 (Very Good)', desc: 'Well above IB standard' };
    if (pct >= 56) return { grade: 5, color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40', title: 'Grade 5 (Good)', desc: 'Competent mastery' };
    if (pct >= 44) return { grade: 4, color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40', title: 'Grade 4 (Satisfactory)', desc: 'Meets IB standard' };
    if (pct >= 32) return { grade: 3, color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40', title: 'Grade 3 (Basic)', desc: 'Developing knowledge' };
    if (pct >= 20) return { grade: 2, color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/40', title: 'Grade 2 (Poor)', desc: 'Requires revision' };
    return { grade: 1, color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700', title: 'Grade 1 (Very Poor)', desc: 'Begin review' };
  };

  const ibGrade = getIBGradeDetails(percentage);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-6">
      {/* Top Heading & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Target className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">IB Exam Progress & Mastery Tracker</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Live Assessment
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Track how many IB exam questions you have answered, scored, and mastered out of the {totalQuestions} questions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {answeredCount < totalQuestions && onJumpToUnanswered && (
            <button
              onClick={onJumpToUnanswered}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>Next Unanswered</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onResetProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
            title="Reset All Questions & Scores"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Questions Answered */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Questions Answered</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-300">
              {answeredCount}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {totalQuestions}</span>
          </div>
          {/* Progress Mini Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${answeredPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between font-mono pt-0.5">
            <span>{answeredPercentage.toFixed(0)}% Completed</span>
            <span>{totalQuestions - answeredCount} Remaining</span>
          </div>
        </div>

        {/* Metric 2: Full Marks Mastered */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Questions Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-300">
              {masteredCount}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {totalQuestions}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${totalQuestions > 0 ? (masteredCount / totalQuestions) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between font-mono pt-0.5">
            <span>100% Mark on Question</span>
            <span className="text-emerald-400 font-bold">{masteredCount} Perfect</span>
          </div>
        </div>

        {/* Metric 3: Total Marks Score */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Marks Earned</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-300">
              {totalMarksEarned}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {maxTotalMarks}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between font-mono pt-0.5">
            <span>Score: {percentage.toFixed(1)}%</span>
            <span>{maxTotalMarks - totalMarksEarned} Marks Left</span>
          </div>
        </div>

        {/* Metric 4: Projected IB Grade */}
        <div className={`p-4 rounded-2xl border transition-all ${ibGrade.bg} space-y-2 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300 font-medium">Predicted IB Grade</span>
              <GraduationCap className={`w-4 h-4 ${ibGrade.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold font-mono ${ibGrade.color}`}>
                Grade {ibGrade.grade}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 7</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-white truncate">{ibGrade.title}</div>
            <div className="text-[10px] text-slate-400 truncate">{ibGrade.desc}</div>
          </div>
        </div>
      </div>

      {/* Topic-by-Topic Sub-Progress Bars */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Progress Breakdown by Sub-Topic (Hodder pp. 31–51):</span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {answeredCount} of {totalQuestions} answered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {topicBreakdown.map((t) => {
            const topicPct = t.totalSubQuestions > 0 ? (t.answeredSubQuestions / t.totalSubQuestions) * 100 : 0;
            const marksPct = t.maxMarks > 0 ? (t.earnedMarks / t.maxMarks) * 100 : 0;
            const isCompleted = t.answeredSubQuestions === t.totalSubQuestions;

            return (
              <div 
                key={t.topicId} 
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-bold text-slate-200 truncate">
                      Q{t.topicId}. {t.title}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{t.answeredSubQuestions}/{t.totalSubQuestions} answered</span>
                    <span className="font-bold text-amber-400">{t.earnedMarks}/{t.maxMarks}m</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      marksPct >= 80 ? 'bg-emerald-400' : marksPct > 0 ? 'bg-cyan-400' : 'bg-slate-700'
                    }`}
                    style={{ width: `${topicPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter by Status Pill Buttons */}
      {onFilterStatus && (
        <div className="flex items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">View Filter:</span>
            <button
              onClick={() => onFilterStatus('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                currentFilterStatus === 'all'
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Questions ({totalQuestions})
            </button>
            <button
              onClick={() => onFilterStatus('unanswered')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                currentFilterStatus === 'unanswered'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unanswered ({totalQuestions - answeredCount})
            </button>
            <button
              onClick={() => onFilterStatus('answered')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                currentFilterStatus === 'answered'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Answered ({answeredCount})
            </button>
          </div>

          {answeredCount === totalQuestions && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Questions Completed! Excellent Exam Prep!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
