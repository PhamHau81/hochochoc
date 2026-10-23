import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { MathView } from './MathView';
import { 
  Sparkles, 
  X, 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calculator, 
  Lightbulb,
  Copy,
  BookOpen,
  StopCircle
} from 'lucide-react';
import { 
  askAIExplainQuestion, 
  askAIGenerateSimilarQuestion, 
  getStoredApiKey 
} from '../services/gemini';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  userAnswer?: string;
  onOpenApiKeyModal: () => void;
  onToast: (msg: string, icon?: string) => void;
}

type StepStatus = 'waiting' | 'in_progress' | 'completed' | 'stopped_error';

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  question,
  userAnswer,
  onOpenApiKeyModal,
  onToast
}) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [similarQuestion, setSimilarQuestion] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'explain' | 'similar'>('explain');
  const [currentModelAttempt, setCurrentModelAttempt] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [attemptHistory, setAttemptHistory] = useState<string[]>([]);

  // 3 Bước xử lý theo quy định AI_INSTRUCTIONS.md
  const [step1Status, setStep1Status] = useState<StepStatus>('waiting');
  const [step2Status, setStep2Status] = useState<StepStatus>('waiting');
  const [step3Status, setStep3Status] = useState<StepStatus>('waiting');

  useEffect(() => {
    if (isOpen && question) {
      setExplanation('');
      setSimilarQuestion('');
      setErrorMsg('');
      setAttemptHistory([]);
      setActiveTab('explain');
      handleFetchExplanation(question);
    }
  }, [isOpen, question]);

  if (!isOpen || !question) return null;

  const handleFetchExplanation = async (q: Question) => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      onOpenApiKeyModal();
      onClose();
      onToast('Vui lòng nhập API Key để sử dụng AI Gia Sư', 'alert');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setAttemptHistory([]);

    // Bước 1: Tiếp nhận và phân tích dữ kiện
    setStep1Status('in_progress');
    setStep2Status('waiting');
    setStep3Status('waiting');

    await new Promise((r) => setTimeout(r, 200));
    setStep1Status('completed');

    // Bước 2: Gọi AI với cơ chế Retry & Fallback
    setStep2Status('in_progress');

    try {
      const res = await askAIExplainQuestion(q, userAnswer, (model) => {
        setCurrentModelAttempt(model);
        setAttemptHistory((prev) => [...prev, model]);
      });

      setStep2Status('completed');
      setStep3Status('in_progress');

      setExplanation(res.text);
      setModelUsed(res.modelUsed);

      setStep3Status('completed');
    } catch (err: unknown) {
      // Theo AI_INSTRUCTIONS.md: Nếu thất bại -> Hiện thông báo màu đỏ, nguyên văn lỗi
      // Trạng thái các bước đang chờ phải chuyển thành "Đã dừng do lỗi", tuyệt đối không hiện Hoàn tất hay checkmark xanh
      const rawError = err instanceof Error ? err.message : String(err);
      setErrorMsg(rawError);

      if (step1Status !== 'completed') setStep1Status('stopped_error');
      setStep2Status('stopped_error');
      setStep3Status('stopped_error');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSimilar = async (q: Question) => {
    setActiveTab('similar');
    if (similarQuestion) return;

    setLoading(true);
    setErrorMsg('');
    setStep1Status('completed');
    setStep2Status('in_progress');
    setStep3Status('waiting');

    try {
      const res = await askAIGenerateSimilarQuestion(q, (model) => {
        setCurrentModelAttempt(model);
      });
      setStep2Status('completed');
      setStep3Status('completed');
      setSimilarQuestion(res.text);
      setModelUsed(res.modelUsed);
    } catch (err: unknown) {
      const rawError = err instanceof Error ? err.message : String(err);
      setErrorMsg(rawError);
      setStep2Status('stopped_error');
      setStep3Status('stopped_error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = () => {
    const textToCopy = activeTab === 'explain' ? explanation : similarQuestion;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      onToast('Đã sao chép nội dung vào khay nhớ tạm', 'check');
    }
  };

  // Helper render trạng thái bước theo AI_INSTRUCTIONS.md
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">AI Gia Sư Toán THPT</h3>
                {modelUsed && (
                  <span className="text-[10px] bg-indigo-700/80 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-indigo-600/50">
                    {modelUsed}
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200 font-medium">
                Phân tích tư duy sư phạm • Mẹo bấm Casio • Chỉ ra bẫy đề thi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Bước tiến trình quy định trong AI_INSTRUCTIONS.md */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {renderStepBadge(step1Status, 'Bước 1 (Đề bài)')}
            {renderStepBadge(step2Status, 'Bước 2 (AI Suy luận)')}
            {renderStepBadge(step3Status, 'Bước 3 (Định dạng)')}
          </div>
        </div>

        {/* Tab switch: Giảng giải vs Tạo câu hỏi tương tự */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-6 py-2 flex items-center justify-between text-xs font-bold">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('explain')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'explain'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-indigo-900 hover:bg-indigo-100'
              }`}
            >
              📖 Giảng Giải Chi Tiết
            </button>
            <button
              onClick={() => handleFetchSimilar(question)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'similar'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-indigo-900 hover:bg-indigo-100'
              }`}
            >
              🎯 Tạo Câu Hỏi Tương Tự
            </button>
          </div>

          <button
            onClick={handleCopyContent}
            disabled={loading || (!explanation && !similarQuestion)}
            className="flex items-center gap-1 text-[11px] text-indigo-700 hover:text-indigo-900 font-bold disabled:opacity-40 cursor-pointer"
            title="Sao chép lời giải"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Sao chép</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* Question summary badge */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <div className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
              Đề bài đang hỏi ({question.format} • {question.difficulty}):
            </div>
            <MathView content={question.content} />
          </div>

          {/* Loading spinner with model attempt info */}
          {loading && (
            <div className="py-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  AI đang tư duy giải toán và thiết lập các bước giảng...
                </p>
                {currentModelAttempt && (
                  <p className="text-[11px] text-indigo-600 font-mono">
                    Đang kết nối: <b>{currentModelAttempt}</b>
                  </p>
                )}
                {attemptHistory.length > 1 && (
                  <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block border border-amber-200">
                    🔄 Đã tự động kích hoạt Fallback: {attemptHistory.join(' ➔ ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Message if all models failed (Chuẩn Mục 3 AI_INSTRUCTIONS.md) */}
          {errorMsg && !loading && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs text-rose-900 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-black text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>LỖI API: TẤT CẢ CÁC MODEL AI ĐỀU THẤT BẠI</span>
              </div>
              <p className="text-slate-700 font-medium">
                Nguyên văn thông báo lỗi trả về từ Google Gemini API:
              </p>
              <div className="font-mono text-[11px] bg-white p-3 rounded-xl border border-rose-300 text-rose-700 font-bold whitespace-pre-wrap select-all">
                {errorMsg}
              </div>
              <div className="text-[11px] text-rose-600 italic">
                * Trạng thái tiến trình đã tự động chuyển sang <b>"Đã dừng do lỗi"</b> để bảo toàn tính toàn vẹn hệ thống.
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleFetchExplanation(question)}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Thử lại với Model tiếp theo
                </button>
                <button
                  onClick={onOpenApiKeyModal}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                >
                  Kiểm tra hoặc thay đổi Gemini API Key khác
                </button>
              </div>
            </div>
          )}

          {/* Tab 1: Explanation View */}
          {!loading && activeTab === 'explain' && explanation && (
            <div className="prose prose-indigo max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <MathView content={explanation} />
            </div>
          )}

          {/* Tab 2: Similar Question View */}
          {!loading && activeTab === 'similar' && similarQuestion && (
            <div className="prose prose-indigo max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl inline-block border border-emerald-200">
                ✨ Câu hỏi tương tự để bạn tự rèn luyện phản xạ:
              </div>
              <MathView content={similarQuestion} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 italic text-[11px]">
            Học tập thông minh cùng Bộ sách Kết Nối Tri Thức Với Cuộc Sống
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-extrabold text-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
