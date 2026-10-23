import React, { useState, useEffect } from 'react';
import { GradeNumber, Question } from './types';
import { CURRICULUM_DATA } from './data/curriculum';
import { Navbar } from './components/Navbar';
import { PracticeView } from './components/PracticeView';
import { StatisticsTool } from './components/StatisticsTool';
import { MockExamView } from './components/MockExamView';
import { CurriculumMapView } from './components/CurriculumMapView';
import { MistakeModal } from './components/MistakeModal';
import { FunctionStudio } from './components/FunctionStudio';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AITutorModal } from './components/AITutorModal';
import { FlashMathGame } from './components/FlashMathGame';
import { AIExamGeneratorView } from './components/AIExamGeneratorView';
import { getStoredApiKey } from './services/gemini';
import { 
  BookOpen, 
  Calculator, 
  Clock, 
  Network, 
  LineChart,
  Zap,
  CheckCircle2, 
  Bookmark, 
  Info,
  AlertTriangle,
  Bot,
  Sparkles
} from 'lucide-react';

type ActiveTab = 'practice' | 'statistics' | 'exam' | 'functions' | 'game' | 'curriculum' | 'ai-exam';

export default function App() {
  const [grade, setGrade] = useState<GradeNumber>(11);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [currentChapterId, setCurrentChapterId] = useState<string>('11_ch3');

  // User state
  const [score, setScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mathconnect_score');
      return saved ? parseInt(saved, 10) : 1450;
    } catch {
      return 1450;
    }
  });

  const [streak] = useState<number>(7);

  const [mistakes, setMistakes] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('mathconnect_mistakes');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initial sample mistake
    return [
      CURRICULUM_DATA[11].chapters[0].questions[1] // sample question for quick testing
    ];
  });

  const [isMistakesOpen, setIsMistakesOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAITutorModalOpen, setIsAITutorModalOpen] = useState(false);
  const [selectedQuestionForAI, setSelectedQuestionForAI] = useState<Question | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; icon?: string; visible: boolean }>({
    message: '',
    visible: false
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mathconnect_mistakes', JSON.stringify(mistakes));
      localStorage.setItem('mathconnect_score', score.toString());
    } catch {
      // storage unavailable
    }
  }, [mistakes, score]);

  // Bắt buộc hiển thị modal nhập API Key ban đầu nếu chưa có theo AI_INSTRUCTIONS.md
  useEffect(() => {
    const key = getStoredApiKey();
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const triggerToast = (message: string, icon = 'check') => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  const handleSelectGrade = (newGrade: GradeNumber) => {
    setGrade(newGrade);
    const firstChapter = CURRICULUM_DATA[newGrade].chapters[0];
    if (firstChapter) {
      setCurrentChapterId(firstChapter.id);
    }
  };

  const handleToggleBookmark = (q: Question) => {
    setMistakes(prev => {
      const exists = prev.some(m => m.id === q.id);
      if (exists) {
        triggerToast('Đã xóa khỏi Sổ tay câu sai!', 'info');
        return prev.filter(m => m.id !== q.id);
      } else {
        triggerToast('Đã lưu vào Sổ tay câu sai!', 'bookmark');
        return [...prev, q];
      }
    });
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes(prev => prev.filter(m => m.id !== id));
    triggerToast('Đã xóa câu hỏi khỏi sổ tay', 'info');
  };

  const handleClearAllMistakes = () => {
    setMistakes([]);
    triggerToast('Đã xóa sạch sổ tay ôn tập', 'check');
  };

  const handleAddScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleSelectGradeAndChapter = (g: GradeNumber, chId: string) => {
    setGrade(g);
    setCurrentChapterId(chId);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAI = (q: Question) => {
    setSelectedQuestionForAI(q);
    setIsAITutorModalOpen(true);
  };

  const currentGradeChapters = CURRICULUM_DATA[grade].chapters;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentGrade={grade}
        onSelectGrade={handleSelectGrade}
        streak={streak}
        score={score}
        mistakesCount={mistakes.length}
        onOpenMistakes={() => setIsMistakesOpen(true)}
        onBrandClick={() => setActiveTab('practice')}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Sub Navigation / Mode Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 md:top-16 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 custom-scrollbar text-xs sm:text-sm font-extrabold">
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'practice'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ôn Luyện Dạng Toán</span>
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'statistics'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Công Cụ Mẫu Số Liệu & Casio</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'exam'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Phòng Thi Ảo (Chuẩn 2026 Trở Đi)</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-exam')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'ai-exam'
                  ? 'text-indigo-950 bg-gradient-to-r from-amber-100 via-indigo-50 to-indigo-100 border border-indigo-300 shadow-xs font-black ring-1 ring-indigo-400'
                  : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/60 font-bold'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>A.I Tự Tạo Đề (Chương/Bài)</span>
              <span className="text-[10px] bg-amber-400 text-indigo-950 font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-2xs">
                MỚI
              </span>
            </button>

            <button
              onClick={() => setActiveTab('functions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'functions'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-200 shadow-2xs font-black'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LineChart className="w-4 h-4 text-rose-500" />
              <span>Xưởng BBT & Đồ Thị Hàm Số</span>
            </button>

            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'game'
                  ? 'text-amber-700 bg-amber-50 border border-amber-300 shadow-2xs font-black'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>Đấu Trí 60s (Game)</span>
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === 'curriculum'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Bản Đồ Tri Thức KNTT</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'practice' && (
          <PracticeView
            grade={grade}
            chapters={currentGradeChapters}
            currentChapterId={currentChapterId}
            onSelectChapter={setCurrentChapterId}
            mistakes={mistakes}
            onToggleBookmark={handleToggleBookmark}
            onAddScore={handleAddScore}
            onToast={triggerToast}
            onAskAI={handleAskAI}
            onOpenAIGenerator={() => setActiveTab('ai-exam')}
          />
        )}

        {activeTab === 'statistics' && <StatisticsTool />}

        {activeTab === 'exam' && (
          <MockExamView
            onAddScore={handleAddScore}
            onToast={triggerToast}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === 'ai-exam' && (
          <AIExamGeneratorView
            initialGrade={grade}
            initialChapterId={currentChapterId}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onAddScore={handleAddScore}
            onToast={triggerToast}
            onAskAI={(examQ) => {
              const q: Question = {
                id: examQ.id,
                grade: grade,
                chapterId: currentChapterId,
                format: examQ.format,
                difficulty: examQ.difficulty,
                content: examQ.content,
                options: examQ.options,
                subQuestions: examQ.subQuestions,
                correctAnswer: examQ.correctAnswer,
                hints: [],
                solution: examQ.solution || ''
              };
              handleAskAI(q);
            }}
          />
        )}

        {activeTab === 'functions' && <FunctionStudio />}

        {activeTab === 'game' && <FlashMathGame />}

        {activeTab === 'curriculum' && (
          <CurriculumMapView
            onSelectGradeAndChapter={handleSelectGradeAndChapter}
            onOpenAIGenerator={(g, chId) => {
              setGrade(g);
              setCurrentChapterId(chId);
              setActiveTab('ai-exam');
            }}
          />
        )}
      </main>

      {/* Slide-over Mistake Modal */}
      <MistakeModal
        isOpen={isMistakesOpen}
        onClose={() => setIsMistakesOpen(false)}
        mistakes={mistakes}
        onRemoveMistake={handleRemoveMistake}
        onClearAll={handleClearAllMistakes}
      />

      {/* Modal Cài đặt Model AI & API Key */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={(msg) => triggerToast(msg, 'check')}
      />

      {/* Modal AI Gia Sư Giảng Giải Bài Toán */}
      <AITutorModal
        isOpen={isAITutorModalOpen}
        onClose={() => setIsAITutorModalOpen(false)}
        question={selectedQuestionForAI}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onToast={triggerToast}
      />

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold z-50 transition-all duration-300 pointer-events-none ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        {toast.icon === 'bookmark' ? (
          <Bookmark className="w-4 h-4 text-amber-400 fill-current" />
        ) : toast.icon === 'alert' ? (
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
