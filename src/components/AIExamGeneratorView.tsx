import React, { useState, useEffect, useRef } from 'react';
import { GradeNumber, ExamQuestion, Question } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { generateAIExam, GeneratedExam, getStoredApiKey, getStoredModel } from '../services/gemini';
import { exportExamToWord } from '../services/docxExport';
import { MathView, parseGraphDataToProps } from './MathView';
import { FunctionGraph } from './FunctionGraph';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Bot,
  Play,
  RotateCcw,
  FileDown,
  Printer,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  Sliders,
  ChevronDown,
  Layers,
  BookOpen,
  AlertCircle,
  ArrowRight,
  Eye,
  Settings,
  Flame,
  Award,
  StopCircle,
  KeyRound,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

type StepStatus = 'waiting' | 'in_progress' | 'completed' | 'stopped_error';

interface AIExamGeneratorViewProps {
  initialGrade?: GradeNumber;
  initialChapterId?: string;
  onOpenApiKeyModal: () => void;
  onAddScore: (points: number) => void;
  onToast: (msg: string, icon?: string) => void;
  onAskAI?: (q: ExamQuestion) => void;
}

export const AIExamGeneratorView: React.FC<AIExamGeneratorViewProps> = ({
  initialGrade = 11,
  initialChapterId,
  onOpenApiKeyModal,
  onAddScore,
  onToast,
  onAskAI
}) => {
  // Configuration state
  const [grade, setGrade] = useState<GradeNumber>(initialGrade);
  const chapters = CURRICULUM_DATA[grade].chapters;
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId && chapters.some(c => c.id === initialChapterId)
      ? initialChapterId
      : chapters[0].id
  );
  const [selectedLesson, setSelectedLesson] = useState<string>('all');
  const [preset, setPreset] = useState<'15min' | '45min' | '90min' | 'custom'>('15min');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [difficulty, setDifficulty] = useState<
    'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao' | 'Hỗn hợp phân hóa (Đề thi chuẩn)'
  >('Hỗn hợp phân hóa (Đề thi chuẩn)');
  const [part1Count, setPart1Count] = useState<number>(4);
  const [part2Count, setPart2Count] = useState<number>(1);
  const [part3Count, setPart3Count] = useState<number>(1);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [attemptedModel, setAttemptedModel] = useState<string>('');
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<string[]>([]);

  // 3 Bước tiến trình theo quy định AI_INSTRUCTIONS.md
  const [step1Status, setStep1Status] = useState<StepStatus>('waiting');
  const [step2Status, setStep2Status] = useState<StepStatus>('waiting');
  const [step3Status, setStep3Status] = useState<StepStatus>('waiting');

  // Test Taking State
  const [mode, setMode] = useState<'taking' | 'review'>('taking');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    scoreOutOf10: number;
    part1Score: number;
    part2Score: number;
    part3Score: number;
    totalCorrect: number;
    totalCount: number;
  } | null>(null);

  const timerRef = useRef<any>(null);

  // Synchronize chapter when grade changes
  useEffect(() => {
    const available = CURRICULUM_DATA[grade].chapters;
    if (!available.some(c => c.id === selectedChapterId)) {
      setSelectedChapterId(available[0].id);
      setSelectedLesson('all');
    }
  }, [grade]);

  // Current active chapter and its lessons
  const currentChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const lessonList = currentChapter.lessons || [];

  // Handle Preset Selection
  const applyPreset = (p: '15min' | '45min' | '90min' | 'custom') => {
    setPreset(p);
    if (p === '15min') {
      setDurationMinutes(15);
      setPart1Count(4);
      setPart2Count(1);
      setPart3Count(1);
    } else if (p === '45min') {
      setDurationMinutes(45);
      setPart1Count(6);
      setPart2Count(2);
      setPart3Count(2);
    } else if (p === '90min') {
      setDurationMinutes(90);
      setPart1Count(12);
      setPart2Count(4);
      setPart3Count(6);
    }
  };

  // Countdown timer for taking exam
  useEffect(() => {
    if (generatedExam && !isSubmitted && timeRemaining > 0) {
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
  }, [generatedExam, isSubmitted, timeRemaining]);

  // Helper hiển thị badge trạng thái từng bước theo AI_INSTRUCTIONS.md
  const renderStepBadge = (status: StepStatus, stepName: string) => {
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>{stepName}: Hoàn tất</span>
        </div>
      );
    }
    if (status === 'in_progress') {
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 animate-pulse">
          <div className="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
          <span>{stepName}: Đang xử lý...</span>
        </div>
      );
    }
    if (status === 'stopped_error') {
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-300">
          <StopCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span>{stepName}: Đã dừng do lỗi</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
        <span>{stepName}: Đang chờ</span>
      </div>
    );
  };

  // Handle Generating Exam via Gemini
  const handleGenerateExam = async () => {
    const key = getStoredApiKey();
    if (!key) {
      onToast('Vui lòng nhập API Key để bắt đầu tạo đề!', 'alert');
      onOpenApiKeyModal();
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setAttemptHistory([]);
    setAttemptedModel(getStoredModel());

    // Bước 1: Tiếp nhận cấu trúc ma trận
    setStep1Status('in_progress');
    setStep2Status('waiting');
    setStep3Status('waiting');
    await new Promise((r) => setTimeout(r, 200));
    setStep1Status('completed');

    // Bước 2: Soạn đề thi AI với Retry & Fallback
    setStep2Status('in_progress');

    try {
      const selectedLessonName = selectedLesson === 'all'
        ? undefined
        : lessonList.find((_, idx) => `lesson_${idx}` === selectedLesson);

      const result = await generateAIExam(
        {
          grade,
          chapterId: currentChapter.id,
          chapterName: currentChapter.name,
          lessonName: selectedLessonName,
          durationMinutes,
          difficulty,
          counts: {
            part1Count,
            part2Count,
            part3Count
          },
          customPrompt: customPrompt.trim() || undefined
        },
        (model) => {
          setAttemptedModel(model);
          setAttemptHistory((prev) => (prev.includes(model) ? prev : [...prev, model]));
        }
      );

      setStep2Status('completed');
      setStep3Status('in_progress');
      await new Promise((r) => setTimeout(r, 200));
      setStep3Status('completed');

      setGeneratedExam(result.exam);
      setTimeRemaining(result.exam.durationMinutes * 60);
      setAnswers({});
      setIsSubmitted(false);
      setScoreResult(null);
      setMode('taking');
      onToast('AI đã tạo đề thi thành công! Bắt đầu làm bài ngay.', 'check');
    } catch (err: any) {
      console.error('Error generating AI exam:', err);
      const rawError = err instanceof Error ? err.message : String(err);
      setGenerationError(rawError);

      if (step1Status !== 'completed') setStep1Status('stopped_error');
      setStep2Status('stopped_error');
      setStep3Status('stopped_error');
      onToast(`Lỗi tạo đề: ${rawError}`, 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit and Grade Exam
  const handleSubmitExam = () => {
    if (!generatedExam || isSubmitted) return;
    setIsSubmitted(true);
    clearInterval(timerRef.current);

    let part1Score = 0;
    let part2Score = 0;
    let part3Score = 0;
    let totalCorrectCount = 0;

    const questions = generatedExam.questions;

    // Grade Part I
    const p1 = questions.filter(q => q.part === 'I');
    p1.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        part1Score += 0.25;
        totalCorrectCount++;
      }
    });

    // Grade Part II (MOET 2025 Scale: 1 statement = 0.1, 2 = 0.25, 3 = 0.5, 4 = 1.0)
    const p2 = questions.filter(q => q.part === 'II');
    p2.forEach(q => {
      const userSubs = answers[q.id] || {};
      let subCorrect = 0;
      (q.subQuestions || []).forEach(sub => {
        if (userSubs[sub.id] === sub.isCorrect) {
          subCorrect++;
        }
      });
      if (subCorrect === 1) part2Score += 0.1;
      else if (subCorrect === 2) part2Score += 0.25;
      else if (subCorrect === 3) part2Score += 0.5;
      else if (subCorrect === 4) {
        part2Score += 1.0;
        totalCorrectCount++;
      }
    });

    // Grade Part III (0.5 points per correct answer)
    const p3 = questions.filter(q => q.part === 'III');
    p3.forEach(q => {
      const u = (answers[q.id] || '').toString().trim().replace(',', '.');
      const c = (q.correctAnswer || '').toString().trim().replace(',', '.');
      if (u && (u === c || Math.abs(parseFloat(u) - parseFloat(c)) < 0.01)) {
        part3Score += 0.5;
        totalCorrectCount++;
      }
    });

    const totalRaw = part1Score + part2Score + part3Score;
    // Normalize to 10 scale based on full available points
    const maxPossible = (p1.length * 0.25) + (p2.length * 1.0) + (p3.length * 0.5);
    const normalizedScore = maxPossible > 0 ? (totalRaw / maxPossible) * 10 : totalRaw;
    const finalScore = Math.min(10, Math.round(normalizedScore * 100) / 100);

    setScoreResult({
      scoreOutOf10: finalScore,
      part1Score,
      part2Score,
      part3Score,
      totalCorrect: totalCorrectCount,
      totalCount: questions.length
    });

    onAddScore(Math.round(finalScore * 10));
    setMode('review');

    if (finalScore >= 8) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    onToast(`Bạn đạt ${finalScore}/10 điểm! Lời giải chi tiết đã sẵn sàng bên dưới.`, 'check');
  };

  // Export to Word
  const handleExportWord = () => {
    if (!generatedExam) return;
    exportExamToWord({
      title: generatedExam.title,
      subtitle: generatedExam.subtitle,
      durationMinutes: generatedExam.durationMinutes,
      includeAnswers: true,
      includeSolutions: true,
      questions: generatedExam.questions
    });
    onToast('Đã xuất file Word đề thi và đáp án chi tiết!', 'check');
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-6 rounded-3xl shadow-md border border-indigo-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>TÍNH NĂNG ĐỘC QUYỀN TOÁN KNTT • TRÍ TUỆ NHÂN TẠO GEMINI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            A.I Tự Động Tạo Đề Thi Theo Từng Chương, Từng Bài
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
            Hệ thống AI tự động biên soạn đề kiểm tra trắc nghiệm chuẩn cấu trúc 2026 trở đi bám sát từng bài học của sách Kết Nối Tri Thức. Bạn có thể làm bài chấm điểm trực tiếp, xem lời giải chi tiết hoặc xuất đề ra file Word (.docx) để in ấn!
          </p>
        </div>

        {generatedExam && (
          <button
            onClick={() => {
              setGeneratedExam(null);
              setIsSubmitted(false);
            }}
            className="self-start md:self-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Tạo đề thi mới</span>
          </button>
        )}
      </div>

      {/* Main View: Either Config Wizard or Exam Taking/Review */}
      {!generatedExam ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
          <div className="pb-4 border-b border-slate-200 flex items-center gap-2 font-black text-slate-800 text-lg">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <span>Thiết Lập Ma Trận & Yêu Cầu Đề Thi</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Target Scope */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Chọn Khối */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  1. Chọn Khối Lớp:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([10, 11, 12] as GradeNumber[]).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-3 px-4 rounded-2xl font-black text-sm border transition flex flex-col items-center justify-center gap-1 ${
                        grade === g
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Lớp {g}</span>
                      <span className={`text-[10px] font-semibold ${grade === g ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {CURRICULUM_DATA[g].chapters.length} Chương
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Chọn Chương */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  2. Chọn Chương Kiến Thức (Toán {grade} KNTT):
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => {
                    setSelectedChapterId(e.target.value);
                    setSelectedLesson('all');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-2xl p-3.5 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Chọn Bài Học Cụ Thể Trong Chương */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  3. Chọn Bài Học Cụ Thể Cần Ra Đề (Tùy Chọn):
                </label>
                <select
                  value={selectedLesson}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  className="w-full bg-indigo-50/50 border border-indigo-200 rounded-2xl p-3.5 text-xs sm:text-sm font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                >
                  <option value="all">★ Tất cả bài học trong chương (Đề kiểm tra tổng hợp chương)</option>
                  {lessonList.map((lesson, idx) => (
                    <option key={idx} value={`lesson_${idx}`}>
                      {lesson}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 italic">
                  * Bạn có thể chọn ra đề cho riêng một bài học cụ thể (ví dụ: chỉ ra đề cho Bài phương sai & độ lệch chuẩn) hoặc ra đề kiểm tra tổng hợp toàn bộ chương.
                </p>
              </div>

              {/* 4. Yêu Cầu Đặc Biệt / Prompt Tùy Biến */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  4. Yêu Cầu Thêm Của Giáo Viên / Học Sinh (Prompt Tùy Biến):
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Tập trung các câu ứng dụng thực tế, bài toán tối ưu hóa, mẹo bấm máy tính Casio fx-580VN X..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right Col: Question Structure & Difficulty */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Mẫu Đề Thi Nhanh:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('15min')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                      preset === '15min'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    15 Phút
                    <div className="text-[10px] font-normal opacity-80 mt-0.5">6 Câu</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('45min')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                      preset === '45min'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    45 Phút (1 Tiết)
                    <div className="text-[10px] font-normal opacity-80 mt-0.5">10 Câu</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('90min')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                      preset === '90min'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    90 Phút
                    <div className="text-[10px] font-normal opacity-80 mt-0.5">22 Câu</div>
                  </button>
                </div>
              </div>

              {/* Mức độ */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Mức Độ Nhận Thức:
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Hỗn hợp phân hóa (Đề thi chuẩn)">Hỗn hợp phân hóa (Đề thi chuẩn BGD từ 2026)</option>
                  <option value="Nhận biết">Cơ bản - Nhận biết (Học sinh yếu / Trung bình)</option>
                  <option value="Thông hiểu">Thông hiểu & Vận dụng trung bình</option>
                  <option value="Vận dụng">Vận dụng (Mục tiêu 8+)</option>
                  <option value="Vận dụng cao">Vận dụng cao (Mục tiêu 9 - 10 điểm)</option>
                </select>
              </div>

              {/* Số lượng câu chi tiết */}
              <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
                <div className="font-bold text-slate-800">Cơ cấu số câu theo Chuẩn 2026 trở đi:</div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Phần I: 4 Lựa chọn (A-B-C-D)</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={part1Count}
                    onChange={(e) => {
                      setPart1Count(Math.max(1, parseInt(e.target.value, 10) || 1));
                      setPreset('custom');
                    }}
                    className="w-14 p-1 text-center font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Phần II: Đúng / Sai (4 ý a,b,c,d)</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={part2Count}
                    onChange={(e) => {
                      setPart2Count(Math.max(0, parseInt(e.target.value, 10) || 0));
                      setPreset('custom');
                    }}
                    className="w-14 p-1 text-center font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Phần III: Điền kết quả số</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={part3Count}
                    onChange={(e) => {
                      setPart3Count(Math.max(0, parseInt(e.target.value, 10) || 0));
                      setPreset('custom');
                    }}
                    className="w-14 p-1 text-center font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Thời gian làm bài (phút)</span>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={durationMinutes}
                    onChange={(e) => {
                      setDurationMinutes(Math.max(5, parseInt(e.target.value, 10) || 15));
                      setPreset('custom');
                    }}
                    className="w-16 p-1 text-center font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200/80 text-[11px] text-indigo-900 font-semibold flex items-center justify-between">
                <span>Tổng số câu hỏi: <b>{part1Count + part2Count + part3Count} câu</b></span>
                <span>Thời gian: <b>{durationMinutes} phút</b></span>
              </div>

              {/* Graph & BBT Feature Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-900 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Hỗ trợ tạo & hiển thị trực quan <b>Đồ thị hàm số Oxy</b> và <b>Bảng biến thiên SVG</b> chuẩn GDPT mới.</span>
              </div>

              {/* 3 Bước tiến trình quy định trong AI_INSTRUCTIONS.md */}
              {(isGenerating || step1Status !== 'waiting') && (
                <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Tiến trình biên soạn đề (AI Instructions):
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {renderStepBadge(step1Status, 'Bước 1: Tiếp nhận ma trận')}
                    {renderStepBadge(step2Status, 'Bước 2: AI Gemini soạn đề')}
                    {renderStepBadge(step3Status, 'Bước 3: Thẩm định LaTeX')}
                  </div>
                </div>
              )}

              {/* Progress Detail during generation */}
              {isGenerating && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-2 text-indigo-950">
                  <div className="flex items-center gap-2 font-bold text-indigo-900">
                    <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>AI đang phân tích kiến thức và biên soạn câu hỏi...</span>
                  </div>
                  {attemptedModel && (
                    <div className="text-[11px] font-mono text-indigo-700">
                      Model đang thực hiện: <b>{attemptedModel}</b>
                    </div>
                  )}
                  {attemptHistory.length > 1 && (
                    <div className="text-[10px] text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-300">
                      🔄 Tự động chuyển đổi Fallback: {attemptHistory.join(' ➔ ')}
                    </div>
                  )}
                </div>
              )}

              {/* Generate Button */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateExam}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>AI Đang Soạn Đề ({attemptedModel})...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5 text-amber-300" />
                    <span>BẮT ĐẦU TẠO ĐỀ THEO YÊU CẦU</span>
                  </>
                )}
              </button>

              {/* Error Message if all models failed (Chuẩn Mục 3 AI_INSTRUCTIONS.md) */}
              {generationError && !isGenerating && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs text-rose-900 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-black text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>LỖI TẠO ĐỀ THI: TẤT CẢ MODEL AI ĐỀU THẤT BẠI</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Nguyên văn lỗi trả về từ Google Gemini API:
                  </p>
                  <div className="font-mono text-[11px] bg-white p-3 rounded-xl border border-rose-300 text-rose-700 font-bold whitespace-pre-wrap break-all select-all">
                    {generationError}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateExam}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Thử lại ngay</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenApiKeyModal}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Cài đặt / Thay đổi API Key</span>
                    </button>
                    <a
                      href="https://aistudio.google.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                      <span>Lấy key mới miễn phí</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Exam Interaction Area */
        <div className="space-y-6">
          {/* Exam Header Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-28 z-30">
            <div>
              <div className="text-xs uppercase font-extrabold text-indigo-600 flex items-center gap-2">
                <span>ĐỀ THI SOẠN BỞI AI GEMINI</span>
                <span>•</span>
                <span>TOÁN {generatedExam.grade}</span>
                {generatedExam.lessonName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-600 font-bold">{generatedExam.lessonName}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {generatedExam.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Timer Pill */}
              <div className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm flex items-center gap-2 ${
                isSubmitted
                  ? 'bg-slate-100 text-slate-600 border-slate-300'
                  : timeRemaining < 180
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{timeFormatted}</span>
              </div>

              {/* Mode switch */}
              {isSubmitted && (
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setMode('taking')}
                    className={`px-3 py-1.5 rounded-lg transition ${mode === 'taking' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                  >
                    Xem bài làm
                  </button>
                  <button
                    onClick={() => setMode('review')}
                    className={`px-3 py-1.5 rounded-lg transition ${mode === 'review' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Xem lời giải & Đáp án
                  </button>
                </div>
              )}

              {/* Export Word */}
              <button
                onClick={handleExportWord}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                title="Tải đề thi và đáp án file Word (.docx) chuẩn in ấn"
              >
                <FileDown className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Tải File Word (.docx)</span>
              </button>

              {/* Submit button */}
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>NỘP BÀI THI</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setGeneratedExam(null);
                    setIsSubmitted(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đổi đề khác</span>
                </button>
              )}
            </div>
          </div>

          {/* Result Score Banner (if submitted) */}
          {scoreResult && (
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md border border-indigo-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-indigo-950 flex flex-col items-center justify-center font-black shadow-lg">
                  <span className="text-2xl leading-none">{scoreResult.scoreOutOf10}</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold mt-0.5">/ 10 ĐIỂM</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{scoreResult.scoreOutOf10 >= 8 ? 'Xuất Sắc! Nắm Rất Chắc Kiến Thức' : scoreResult.scoreOutOf10 >= 5 ? 'Đạt Yêu Cầu - Hãy Ôn Kỹ Lời Giải' : 'Cần Ôn Lại Trọng Tâm Chuyên Đề'}</span>
                  </h3>
                  <p className="text-xs text-indigo-200 mt-1">
                    Đúng {scoreResult.totalCorrect}/{scoreResult.totalCount} câu hỏi • Phần I: +{scoreResult.part1Score.toFixed(2)}đ • Phần II: +{scoreResult.part2Score.toFixed(2)}đ • Phần III: +{scoreResult.part3Score.toFixed(2)}đ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('review')}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem Chi Tiết Lời Giải</span>
                </button>
              </div>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {generatedExam.questions.map((q, idx) => {
              const isP1 = q.part === 'I';
              const isP2 = q.part === 'II';
              const isP3 = q.part === 'III';

              return (
                <div
                  key={q.id}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs rounded-lg">
                        Câu {idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        {isP1 ? 'Phần I: 4 Lựa chọn' : isP2 ? 'Phần II: Đúng/Sai' : 'Phần III: Điền số'}
                      </span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                        {q.difficulty}
                      </span>
                    </div>

                    {onAskAI && (
                      <button
                        onClick={() => onAskAI(q)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition"
                        title="Nhờ AI Tutor giải thích chi tiết câu này"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Hỏi AI Tutor</span>
                      </button>
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    <MathView content={q.content} />
                  </div>

                  {/* Direct Graph if provided in q.graph */}
                  {q.graph && (
                    <div className="my-4 flex justify-center overflow-x-auto">
                      {(() => {
                        const gProps = parseGraphDataToProps(q.graph);
                        return gProps ? <FunctionGraph {...gProps} /> : null;
                      })()}
                    </div>
                  )}

                  {/* Part I Options */}
                  {isP1 && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {q.options.map(opt => {
                        const isSelected = answers[q.id] === opt.id;
                        const isCorrect = q.correctAnswer === opt.id;
                        let optionStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                        if (isSubmitted) {
                          if (isCorrect) {
                            optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-400';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-1 ring-indigo-600';
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              if (!isSubmitted) {
                                setAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                              }
                            }}
                            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 text-xs sm:text-sm ${optionStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-black flex items-center justify-center shrink-0">
                              {opt.id}
                            </span>
                            <div className="flex-1">
                              <MathView content={opt.text} inline />
                            </div>
                            {isSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Part II True/False */}
                  {isP2 && q.subQuestions && (
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-12 text-[11px] font-black uppercase text-slate-500 pb-1 px-2 border-b border-slate-100">
                        <div className="col-span-8 sm:col-span-9">Mệnh đề khẳng định</div>
                        <div className="col-span-4 sm:col-span-3 text-center grid grid-cols-2">
                          <span>Đúng</span>
                          <span>Sai</span>
                        </div>
                      </div>

                      {q.subQuestions.map(sub => {
                        const currentVal = answers[q.id]?.[sub.id];
                        const isSubCorrect = isSubmitted && currentVal === sub.isCorrect;

                        return (
                          <div
                            key={sub.id}
                            className={`grid grid-cols-12 items-center p-2.5 rounded-xl border text-xs transition ${
                              isSubmitted
                                ? isSubCorrect
                                  ? 'bg-emerald-50/60 border-emerald-200'
                                  : 'bg-rose-50/60 border-rose-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="col-span-8 sm:col-span-9 font-medium text-slate-800 flex items-start gap-2 pr-2">
                              <b className="font-mono text-indigo-700 font-bold uppercase">{sub.id})</b>
                              <div>
                                <MathView content={sub.statement} inline />
                                {isSubmitted && (
                                  <span className="ml-2 text-[10px] font-bold text-slate-500">
                                    [Đáp án: <b>{sub.isCorrect ? 'Đúng' : 'Sai'}</b>]
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="col-span-4 sm:col-span-3 grid grid-cols-2 gap-1">
                              <button
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => {
                                  setAnswers(prev => ({
                                    ...prev,
                                    [q.id]: { ...(prev[q.id] || {}), [sub.id]: true }
                                  }));
                                }}
                                className={`py-1 rounded-lg font-bold text-xs border transition ${
                                  currentVal === true
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                Đ
                              </button>
                              <button
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => {
                                  setAnswers(prev => ({
                                    ...prev,
                                    [q.id]: { ...(prev[q.id] || {}), [sub.id]: false }
                                  }));
                                }}
                                className={`py-1 rounded-lg font-bold text-xs border transition ${
                                  currentVal === false
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                S
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Part III Short Answer */}
                  {isP3 && (
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
                        Điền kết quả số:
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={answers[q.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAnswers(prev => ({ ...prev, [q.id]: val }));
                        }}
                        placeholder="Nhập số tự nhiên hoặc số thập phân..."
                        className={`w-full sm:w-64 p-2.5 rounded-xl border text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                          isSubmitted
                            ? (answers[q.id] || '').trim().replace(',', '.') === (q.correctAnswer || '').trim().replace(',', '.')
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      {isSubmitted && (
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                          Đáp án chuẩn: <b>{q.correctAnswer}</b>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solution View (When Reviewing or Submitted) */}
                  {(isSubmitted || mode === 'review') && q.solution && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl text-xs space-y-1.5 leading-relaxed text-slate-700">
                      <div className="font-extrabold text-indigo-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Hướng dẫn giải chi tiết:</span>
                      </div>
                      <MathView content={q.solution} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
