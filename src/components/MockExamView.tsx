import React, { useState, useEffect, useRef } from 'react';
import { EXAM_PAPERS } from '../data/mockExams';
import { ExamQuestion } from '../types';
import { MathView } from './MathView';
import { exportExamToWord } from '../services/docxExport';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  Send, 
  RotateCcw, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Eye,
  ArrowRight,
  FileDown,
  Printer,
  Sparkles
} from 'lucide-react';

interface MockExamViewProps {
  onAddScore: (points: number) => void;
  onToast: (msg: string, icon?: string) => void;
  onAskAI?: (q: ExamQuestion) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({ onAddScore, onToast, onAskAI }) => {
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const exam = EXAM_PAPERS[selectedExamIndex];

  const [timeRemaining, setTimeRemaining] = useState(exam.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    scoreOutOf10: number;
    correctCount: number;
    totalCount: number;
    elapsedSeconds: number;
  } | null>(null);

  const timerRef = useRef<any>(null);

  // Countdown timer
  useEffect(() => {
    if (!isSubmitted && isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isSubmitted, timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Handle radio select
  const handleSelectRadio = (qId: string, optId: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  // Handle True/False select
  const handleSelectTF = (qId: string, subId: string, val: boolean) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [subId]: val
      }
    }));
  };

  // Handle short answer
  const handleInputShort = (qId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  // Check if a question is answered
  const isQuestionAnswered = (q: ExamQuestion) => {
    const a = answers[q.id];
    if (!a) return false;
    if (q.format === 'multiple_choice_4') return typeof a === 'string';
    if (q.format === 'short_answer') return typeof a === 'string' && a.trim().length > 0;
    if (q.format === 'true_false_4') {
      const subs = q.subQuestions || [];
      return subs.every(s => a[s.id] !== undefined);
    }
    return false;
  };

  const answeredCount = exam.questions.filter(isQuestionAnswered).length;

  const handleSelectExam = (index: number) => {
    setSelectedExamIndex(index);
    setTimeRemaining(EXAM_PAPERS[index].durationMinutes * 60);
    setIsTimerRunning(true);
    setAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setScoreResult(null);
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);
    clearInterval(timerRef.current);
    setIsSubmitted(true);

    let part1Score = 0;
    let part2Score = 0;
    let part3Score = 0;
    let correctCount = 0;
    const totalCount = exam.questions.length;

    const p1 = exam.questions.filter(q => q.part === 'I' || q.format === 'multiple_choice_4');
    const p2 = exam.questions.filter(q => q.part === 'II' || q.format === 'true_false_4');
    const p3 = exam.questions.filter(q => q.part === 'III' || q.format === 'short_answer');

    // Phần I: 0.25đ / câu
    p1.forEach(q => {
      const ans = answers[q.id];
      if (ans === q.correctAnswer) {
        part1Score += 0.25;
        correctCount++;
      }
    });

    // Phần II: Thang điểm chuẩn Bộ GD&ĐT (1 ý = 0.1, 2 ý = 0.25, 3 ý = 0.5, 4 ý = 1.0)
    p2.forEach(q => {
      const ans = answers[q.id] || {};
      let subCorrect = 0;
      (q.subQuestions || []).forEach(sub => {
        if (ans[sub.id] === sub.isCorrect) {
          subCorrect++;
        }
      });
      if (subCorrect === 1) part2Score += 0.1;
      else if (subCorrect === 2) part2Score += 0.25;
      else if (subCorrect === 3) part2Score += 0.5;
      else if (subCorrect === 4) {
        part2Score += 1.0;
        correctCount++;
      }
    });

    // Phần III: 0.5đ / câu
    p3.forEach(q => {
      const ans = (answers[q.id] || '').toString().trim().replace(',', '.');
      const expected = (q.correctAnswer || '').toString().trim().replace(',', '.');
      if (ans && (ans === expected || Math.abs(parseFloat(ans) - parseFloat(expected)) < 0.05)) {
        part3Score += 0.5;
        correctCount++;
      }
    });

    const totalRaw = part1Score + part2Score + part3Score;
    const maxPossible = (p1.length * 0.25) + (p2.length * 1.0) + (p3.length * 0.5);
    const scoreOutOf10 = maxPossible > 0 ? parseFloat(Math.min(10, (totalRaw / maxPossible) * 10).toFixed(1)) : 0;
    const elapsedSeconds = exam.durationMinutes * 60 - timeRemaining;

    setScoreResult({
      scoreOutOf10,
      correctCount,
      totalCount,
      elapsedSeconds
    });

    setShowResultModal(true);
    onAddScore(Math.round(scoreOutOf10 * 10));

    if (scoreOutOf10 >= 7) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const resetExam = () => {
    setTimeRemaining(exam.durationMinutes * 60);
    setIsTimerRunning(true);
    setAnswers({});
    setIsSubmitted(false);
    setShowResultModal(false);
    setScoreResult(null);
  };

  const scrollToQuestion = (id: string) => {
    const el = document.getElementById(`exam-q-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
        {/* Exam Select Tabs */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 overflow-x-auto">
          {EXAM_PAPERS.map((exItem, idx) => (
            <button
              key={exItem.id}
              onClick={() => handleSelectExam(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                selectedExamIndex === idx
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{exItem.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                selectedExamIndex === idx ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {exItem.durationMinutes} phút • {exItem.questions.length} câu
              </span>
            </button>
          ))}
        </div>

        {/* Exam Title & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full uppercase">
                {exam.year}
              </span>
              <span className="text-xs text-slate-500 font-semibold">• Sách Kết Nối Tri Thức</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {exam.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {exam.description}
            </p>
          </div>

          {/* Timer and Action */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xs border font-mono font-bold text-base transition ${
              timeRemaining < 300
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}>
              <span className="text-amber-400 font-sans text-xs uppercase font-extrabold flex items-center gap-1">
                ⏱ Thời Gian:
              </span>
              <span>{timeFormatted}</span>
            </div>

            {/* Export buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => exportExamToWord({
                  title: exam.title,
                  durationMinutes: exam.durationMinutes,
                  includeAnswers: false,
                  includeSolutions: false,
                  questions: exam.questions
                })}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Tải đề thi trống ra file Word (.doc)"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tải Đề Word</span>
              </button>

              <button
                onClick={() => exportExamToWord({
                  title: exam.title,
                  durationMinutes: exam.durationMinutes,
                  includeAnswers: true,
                  includeSolutions: true,
                  questions: exam.questions
                })}
                className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-extrabold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Tải đề thi kèm bảng đáp án và lời giải chi tiết"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tải Kèm Lời Giải</span>
              </button>
            </div>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-sm transition flex items-center gap-2 text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" /> Nộp Bài Thi
              </button>
            ) : (
              <button
                onClick={resetExam}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-sm transition flex items-center gap-2 text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Làm Lại Đề
              </button>
            )}
          </div>
        </div>

        {/* Layout: Left Questions, Right OMR Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Questions Area */}
          <div className="lg:col-span-9 space-y-6">
            {exam.questions.map((q, idx) => {
              const isAnswered = isQuestionAnswered(q);
              const userAns = answers[q.id];

              return (
                <div
                  key={q.id}
                  id={`exam-q-${q.id}`}
                  className={`p-5 sm:p-6 rounded-2xl border transition ${
                    isSubmitted
                      ? 'bg-white border-slate-300'
                      : isAnswered
                      ? 'bg-white border-indigo-300 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-950 text-white flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      {q.part === 'I' && (
                        <span className="bg-blue-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                          Phần I: 4 Lựa chọn
                        </span>
                      )}
                      {q.part === 'II' && (
                        <span className="bg-purple-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                          Phần II: Đúng / Sai
                        </span>
                      )}
                      {q.part === 'III' && (
                        <span className="bg-amber-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                          Phần III: Điền số
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.difficulty}
                      </span>
                    </div>

                    {isAnswered && !isSubmitted && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã trả lời
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-900 leading-relaxed mb-4">
                    <MathView content={q.content} />
                  </div>

                  {/* Input format */}
                  {q.format === 'multiple_choice_4' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map(opt => {
                        const isSelected = userAns === opt.id;
                        let optStyle = 'border-slate-200 bg-white hover:border-indigo-400';

                        if (isSubmitted) {
                          if (opt.id === q.correctAnswer) {
                            optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                          } else if (isSelected) {
                            optStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold';
                          } else {
                            optStyle = 'opacity-50 border-slate-200';
                          }
                        } else if (isSelected) {
                          optStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold';
                        }

                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition ${optStyle}`}
                          >
                            <input
                              type="radio"
                              name={`exam_${q.id}`}
                              disabled={isSubmitted}
                              checked={isSelected}
                              onChange={() => handleSelectRadio(q.id, opt.id)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-black text-indigo-900">{opt.id}.</span>
                            <span className="flex-1">
                              <MathView content={opt.text} inline />
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.format === 'true_false_4' && q.subQuestions && (
                    <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
                      {q.subQuestions.map(sub => {
                        const userVal = userAns?.[sub.id];

                        return (
                          <div
                            key={sub.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg border border-slate-100 text-xs"
                          >
                            <div className="font-semibold text-slate-800 flex-1">
                              <span className="font-black text-indigo-700 mr-1.5">{sub.id})</span>
                              <MathView content={sub.statement} inline />
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                                <input
                                  type="radio"
                                  name={`exam_tf_${q.id}_${sub.id}`}
                                  disabled={isSubmitted}
                                  checked={userVal === true}
                                  onChange={() => handleSelectTF(q.id, sub.id, true)}
                                  className="text-indigo-600 focus:ring-0"
                                />
                                <span className={userVal === true ? 'text-indigo-700 font-extrabold' : 'text-slate-600'}>
                                  Đúng
                                </span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                                <input
                                  type="radio"
                                  name={`exam_tf_${q.id}_${sub.id}`}
                                  disabled={isSubmitted}
                                  checked={userVal === false}
                                  onChange={() => handleSelectTF(q.id, sub.id, false)}
                                  className="text-indigo-600 focus:ring-0"
                                />
                                <span className={userVal === false ? 'text-indigo-700 font-extrabold' : 'text-slate-600'}>
                                  Sai
                                </span>
                              </label>

                              {isSubmitted && (
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                  userVal === sub.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {sub.isCorrect ? 'Chuẩn: Đúng' : 'Chuẩn: Sai'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.format === 'short_answer' && (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-slate-600">Đáp số:</span>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={userAns || ''}
                        onChange={(e) => handleInputShort(q.id, e.target.value)}
                        placeholder="Điền số..."
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold w-44 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      {isSubmitted && (
                        <div className="text-xs font-bold">
                          Đáp án đúng: <b className="text-emerald-700">{q.correctAnswer}</b>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solution review after submit */}
                  {isSubmitted && q.solution && (
                    <div className="mt-4 p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-2 text-indigo-950">
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-indigo-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Lời giải chi tiết:
                        </div>
                        {onAskAI && (
                          <button
                            onClick={() => onAskAI(q)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] transition flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>✨ Nhờ AI Giảng Giải Sâu</span>
                          </button>
                        )}
                      </div>
                      <MathView content={q.solution} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Floating Navigator (OMR) */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Phiếu Trả Lời (OMR)
                </h3>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full">
                  {answeredCount}/{exam.questions.length} câu
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                Bấm số câu để di chuyển nhanh:
              </div>

              <div className="grid grid-cols-4 gap-2">
                {exam.questions.map((q, idx) => {
                  const answered = isQuestionAnswered(q);

                  return (
                    <button
                      key={q.id}
                      onClick={() => scrollToQuestion(q.id)}
                      className={`h-9 rounded-xl font-black text-xs transition flex items-center justify-center border shadow-2xs ${
                        answered
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      C{idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 inline-block"></span> Đã hoàn thành
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-white border border-slate-300 inline-block"></span> Chưa làm
                </div>
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 mt-2"
                >
                  <Send className="w-3.5 h-3.5" /> Nộp Bài & Chấm Điểm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Result Modal */}
      {showResultModal && scoreResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Hoàn Thành Bài Thi!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kết quả khảo sát chuẩn theo cấu trúc Đề thi Tốt nghiệp THPT từ 2026 trở đi
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500 font-extrabold uppercase">Điểm Số</div>
                <div className="text-2xl font-black text-indigo-700 mt-0.5">
                  {scoreResult.scoreOutOf10} <span className="text-xs text-slate-400">/ 10</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-extrabold uppercase">Số Câu Đúng</div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">
                  {scoreResult.correctCount} <span className="text-xs text-slate-400">/ {scoreResult.totalCount}</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-extrabold uppercase">Thời Gian</div>
                <div className="text-xl font-black text-amber-600 mt-1">
                  {Math.floor(scoreResult.elapsedSeconds / 60)}p {scoreResult.elapsedSeconds % 60}s
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-700 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-left leading-relaxed font-medium">
              💡 <b>Nhận xét năng lực:</b>{' '}
              {scoreResult.scoreOutOf10 >= 8
                ? 'Bạn có phản xạ giải toán rất tốt và nắm chắc các dạng câu hỏi! Hãy duy trì phong độ này để tự tin bước vào kỳ thi tốt nghiệp.'
                : scoreResult.scoreOutOf10 >= 5
                ? 'Kết quả khá tốt! Bạn làm chủ được các câu trắc nghiệm nhiều lựa chọn, nhưng cần cẩn trọng hơn ở các ý đúng/sai và bài toán thực tế.'
                : 'Bạn cần dành thêm thời gian ôn lại lý thuyết trọng tâm và luyện tập thêm các câu hỏi mẫu số liệu ghép nhóm và xác suất.'}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowResultModal(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs transition text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Xem Chi Tiết Đáp Án & Lời Giải
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
