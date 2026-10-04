import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  AlertTriangle, 
  Award, 
  ArrowRight 
} from 'lucide-react';

export const MisconceptionsQuiz: React.FC = () => {
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "When seeing the 8-bit binary number 11111111₂, a very common mistake is to say this is 256. What is its true decimal value?",
      options: [
        "256",
        "255",
        "128",
        "512"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 25 'Common Mistake': While 8 bits allow for 256 unique possibilities, 0 is the first state (00000000₂), making 255 (2⁸ - 1) the highest representable number in 1 byte.",
      textbookPage: 25,
      misconceptionAlert: "Never confuse the total count of combinations (256) with the maximum value (255)!"
    },
    {
      id: 2,
      question: "In ASCII encoding, what do the first 3 bits from the left communicate for letters of the Latin alphabet?",
      options: [
        "The vowel/consonant classification",
        "The letter casing (010 = Uppercase, 011 = Lowercase)",
        "The language font family",
        "The parity check bit"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 31–32: The first 3 bits indicate casing (010 = uppercase, 011 = lowercase), while the first 5 bits from the right indicate the 1-based position in the alphabet (e.g. 00001 = 1 = A).",
      textbookPage: 31,
      misconceptionAlert: "Notice how flipping bit 5 converts upper to lower case with zero math overhead."
    },
    {
      id: 3,
      question: "Why do modern CPU ALUs exclusively use Two's Complement instead of Sign-Magnitude or One's Complement for negative integers?",
      options: [
        "It doubles the range of positive numbers",
        "It eliminates dual representations of zero (±0) and allows the same ALU adder circuit to perform subtraction",
        "It requires only 7 bits per integer",
        "It is non-volatile in RAM"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 48: One's complement and Sign-magnitude have two zeros (+0 and -0), creating logic errors. Two's complement has a single zero and allows A - B to be executed as A + (-B in 2's comp) on the existing hardware adder.",
      textbookPage: 48,
      misconceptionAlert: "Notice the asymmetric range: -128 to +127 for 8 bits."
    },
    {
      id: 4,
      question: "A robotic arm uses a rotary position sensor. Why is Gray Code (Reflected Binary Code) used instead of standard binary?",
      options: [
        "Gray code uses fewer bits per angle",
        "Between any two successive positions, only one bit changes, preventing false multi-bit mechanical transition errors",
        "Gray code can be directly read by analog sensors",
        "It automatically encrypts the motor telemetry"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 49: If standard binary were used, moving from 3 (011) to 4 (100) requires three bits to flip simultaneously. Small mechanical vibration could cause intermediate glitches (e.g. reading 0 or 7). Gray code only flips 1 bit per step.",
      textbookPage: 49,
      misconceptionAlert: "Gray code headings (00, 01, 11, 10) are also mandatory for Karnaugh Maps!"
    },
    {
      id: 5,
      question: "An image needs to support 512 distinct colours. What is the minimum colour depth (bits per pixel) required?",
      options: [
        "8 bits",
        "9 bits",
        "16 bits",
        "512 bits"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 38, 40 (Review Q4): Number of colours = 2^n. Since 2⁸ = 256 is insufficient, 2⁹ = 512, which means exactly 9 bits per pixel are required.",
      textbookPage: 40,
      misconceptionAlert: "Always take log₂(colours) rounded up to the nearest integer."
    },
    {
      id: 6,
      question: "What is the primary difference between Spatial (intraframe) and Temporal (interframe) video compression?",
      options: [
        "Spatial compression compresses audio; temporal compresses subtitles",
        "Spatial removes redundancy within an individual frame; temporal removes redundancy between consecutive frames",
        "Spatial is lossless; temporal is always uncompressed",
        "Spatial is only for black-and-white videos"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 47: Spatial compression reduces redundant data within a frame (like sky textures). Temporal compression only stores the changes or motion vectors from one frame to the next.",
      textbookPage: 47,
      misconceptionAlert: "Without temporal compression, 10 minutes of 1080p video would take over 111 GB!"
    },
    {
      id: 7,
      question: "In the logic circuit for Y = (A · B) + (Ā · B̄), when does the output lightbulb glow ON (1)?",
      options: [
        "Only when A = 1 and B = 1",
        "Whenever A and B have identical values (both 0 or both 1)",
        "Whenever A and B have different values",
        "Only when A = 0 and B = 0"
      ],
      correctIndex: 1,
      explanation: "From Textbook p. 65–66: A · B is 1 when both are 1. Ā · B̄ is 1 when both are 0. The OR gate combines them, so Y = 1 when A == B (the definition of an XNOR gate).",
      textbookPage: 65,
      misconceptionAlert: "This circuit detects equality between two binary inputs!"
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIdx });
  };

  const calculateScore = () => {
    return questions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/40 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                IBDP Exam Prep
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Common Traps & Review</span>
            </div>
            <h3 className="text-lg font-bold text-white">IBDP Computer Science Exam Misconception Trainer</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Based directly on the <strong>Common Mistake</strong> boxes and Review Questions in the Hodder IBDP textbook. 
              Master the exact distinctions tested on Paper 1.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {submitted ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Answers ({Object.keys(selectedAnswers).length}/{questions.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Summary if submitted */}
      {submitted && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
              score >= 6 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {score}/{questions.length}
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {score === questions.length ? '🌟 Perfect IB Score (Grade 7 Level)!' : score >= 5 ? 'Great Work! Solid Conceptual Mastery.' : 'Review Key Textbook Sections.'}
              </div>
              <p className="text-xs text-slate-400">
                You got {score} out of {questions.length} questions correct. Review the highlighted explanations below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div 
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                submitted 
                  ? isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-800/60' 
                    : 'bg-rose-950/20 border-rose-800/60'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  <span className="text-amber-400 font-mono mr-2">Q{idx + 1}.</span>
                  {q.question}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                  p. {q.textbookPage}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  const isCorrectOpt = q.correctIndex === optIdx;

                  let optClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900';
                  if (isSelected && !submitted) {
                    optClass = 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold';
                  } else if (submitted) {
                    if (isCorrectOpt) {
                      optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrectOpt) {
                      optClass = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                    } else {
                      optClass = 'bg-slate-950/40 border-slate-900 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {submitted && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submit */}
              {submitted && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Textbook Explanation:</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{q.explanation}</p>
                  {q.misconceptionAlert && (
                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px] pt-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{q.misconceptionAlert}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
