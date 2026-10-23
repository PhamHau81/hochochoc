import React, { useState } from 'react';
import { Chapter, Question, QuestionFormat, GradeNumber } from '../types';
import { MathView, parseGraphDataToProps } from './MathView';
import { FunctionGraph } from './FunctionGraph';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Filter,
  Check,
  Bot
} from 'lucide-react';

interface PracticeViewProps {
  grade: GradeNumber;
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  mistakes: Question[];
  onToggleBookmark: (q: Question) => void;
  onAddScore: (points: number) => void;
  onToast: (msg: string, icon?: string) => void;
  onAskAI?: (q: Question) => void;
  onOpenAIGenerator?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  grade,
  chapters,
  currentChapterId,
  onSelectChapter,
  mistakes,
  onToggleBookmark,
  onAddScore,
  onToast,
  onAskAI,
  onOpenAIGenerator
}) => {
  const [isTheoryOpen, setIsTheoryOpen] = useState(true);
  const [filterFormat, setFilterFormat] = useState<QuestionFormat | 'all'>('all');
  
  // Per question state
  const [selectedMCOptions, setSelectedMCOptions] = useState<Record<string, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [tfFeedback, setTfFeedback] = useState<Record<string, { correctCount: number; checked: boolean }>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [shortFeedback, setShortFeedback] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  const activeChapter = chapters.find(c => c.id === currentChapterId) || chapters[0];

  const filteredQuestions = activeChapter
    ? (filterFormat === 'all'
        ? activeChapter.questions
        : activeChapter.questions.filter(q => q.format === filterFormat))
    : [];

  const isBookmarked = (qId: string) => mistakes.some(m => m.id === qId);

  // Handle MC Option click
  const handleSelectMCOption = (q: Question, optionId: string) => {
    if (selectedMCOptions[q.id]) return; // already answered
    setSelectedMCOptions(prev => ({ ...prev, [q.id]: optionId }));

    if (optionId === q.correctAnswer) {
      onAddScore(10);
      onToast('Chính xác! Bạn được cộng +10 điểm', 'check');
    } else {
      onToggleBookmark(q);
      onToast('Chưa đúng. Câu hỏi đã được tự động lưu vào Sổ tay câu sai!', 'bookmark');
    }
  };

  // Handle TF Sub-item click
  const handleSelectTF = (qId: string, subId: string, val: boolean) => {
    setTfAnswers(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [subId]: val
      }
    }));
  };

  // Check TF Question
  const handleCheckTF = (q: Question) => {
    const userAnswers = tfAnswers[q.id] || {};
    let correctCount = 0;
    const subs = q.subQuestions || [];

    subs.forEach(s => {
      if (userAnswers[s.id] === s.isCorrect) {
        correctCount++;
      }
    });

    setTfFeedback(prev => ({
      ...prev,
      [q.id]: { correctCount, checked: true }
    }));

    if (correctCount === subs.length) {
      onAddScore(20);
      onToast('Xuất sắc! Bạn trả lời đúng cả 4 ý (+20 điểm)', 'check');
    } else {
      onToggleBookmark(q);
      onToast(`Bạn làm đúng ${correctCount}/${subs.length} ý. Đã thêm vào Sổ tay ôn lại.`, 'info');
    }
  };

  // Handle Short Answer Check
  const handleCheckShortAnswer = (q: Question) => {
    const inputVal = (shortAnswers[q.id] || '').trim().replace(',', '.');
    const expected = (q.correctAnswer || '').trim().replace(',', '.');
    const isCorrect = inputVal === expected || Math.abs(parseFloat(inputVal) - parseFloat(expected)) < 0.05;

    setShortFeedback(prev => ({ ...prev, [q.id]: isCorrect }));

    if (isCorrect) {
      onAddScore(15);
      onToast('Đáp số hoàn toàn chính xác! (+15 điểm)', 'check');
    } else {
      onToggleBookmark(q);
      onToast('Đáp số chưa khớp. Đã lưu vào Sổ tay để xem lại sau!', 'bookmark');
    }
  };

  const handleRevealHint = (qId: string) => {
    setRevealedHints(prev => ({
      ...prev,
      [qId]: (prev[qId] || 0) + 1
    }));
  };

  const handleToggleSolution = (qId: string) => {
    setShowSolution(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="space-y-6">
      {/* Chapter & Breadcrumb Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-md">TOÁN LỚP {grade}</span>
            <span>• SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {activeChapter.name}
          </h1>
          {activeChapter.lessons && activeChapter.lessons.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-indigo-600">Các bài học SGK:</span>
              {activeChapter.lessons.map((lesson, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-indigo-50/70 text-indigo-900 font-semibold px-2 py-0.5 rounded-md border border-indigo-200/60"
                >
                  {lesson}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Topic dropdown & AI Exam Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label htmlFor="chapter-select" className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Chọn chuyên đề:
          </label>
          <select
            id="chapter-select"
            value={currentChapterId}
            onChange={(e) => onSelectChapter(e.target.value)}
            className="bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition cursor-pointer max-w-xs"
          >
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
          {onOpenAIGenerator && (
            <button
              onClick={onOpenAIGenerator}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
              title="Dùng AI tự động tạo đề thi riêng cho chuyên đề này"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>A.I Tạo Đề</span>
            </button>
          )}
        </div>
      </div>

      {/* Theory Summary Accordion */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-900 to-indigo-800 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-indigo-700/50">
        <div
          onClick={() => setIsTheoryOpen(!isTheoryOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shadow-inner">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Tóm Tắt Công Thức Trọng Tâm & Khắc Cốt Ghi Tâm
              </h2>
              <p className="text-xs text-indigo-200">
                Nhấn để {isTheoryOpen ? 'thu gọn' : 'mở rộng'} bảng tóm tắt lý thuyết và công thức chuẩn SGK
              </p>
            </div>
          </div>
          <button className="p-1 rounded-lg hover:bg-white/10 transition text-indigo-200">
            {isTheoryOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isTheoryOpen && (
          <div className="mt-4 pt-4 border-t border-indigo-700/60 text-sm leading-relaxed text-indigo-100">
            <MathView content={activeChapter.theory} className="text-indigo-100" />
          </div>
        )}
      </div>

      {/* Filter Question Format Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-bold custom-scrollbar">
        <span className="text-slate-500 mr-1 flex items-center gap-1.5 whitespace-nowrap">
          <Filter className="w-4 h-4 text-indigo-600" /> Dạng bài:
        </span>
        <button
          onClick={() => setFilterFormat('all')}
          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition shadow-xs ${
            filterFormat === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Tất cả ({activeChapter.questions.length})
        </button>
        <button
          onClick={() => setFilterFormat('multiple_choice_4')}
          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition ${
            filterFormat === 'multiple_choice_4'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Phần I: 4 Lựa chọn
        </button>
        <button
          onClick={() => setFilterFormat('true_false_4')}
          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition ${
            filterFormat === 'true_false_4'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Phần II: Đúng/Sai (4 ý)
        </button>
        <button
          onClick={() => setFilterFormat('short_answer')}
          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition ${
            filterFormat === 'short_answer'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Phần III: Điền số
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">Chưa có câu hỏi cho định dạng này trong chương hiện tại.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const bookmarked = isBookmarked(q.id);
            const userMCOpt = selectedMCOptions[q.id];
            const currentHintStep = revealedHints[q.id] || 0;
            const isSolutionOpen = showSolution[q.id] || false;

            return (
              <div
                key={q.id}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4 transition hover:border-indigo-300"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-xs">
                      #{idx + 1}
                    </span>
                    {q.format === 'multiple_choice_4' && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        Phần I: 4 Lựa chọn
                      </span>
                    )}
                    {q.format === 'true_false_4' && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        Phần II: Đúng / Sai
                      </span>
                    )}
                    {q.format === 'short_answer' && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        Phần III: Điền số
                      </span>
                    )}
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => onToggleBookmark(q)}
                    className={`p-2 rounded-xl transition ${
                      bookmarked
                        ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={bookmarked ? 'Xóa khỏi sổ tay câu sai' : 'Lưu vào sổ tay câu sai'}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  <MathView content={q.content} />
                </div>

                {/* Direct Graph if provided */}
                {q.graph && (
                  <div className="my-3 flex justify-center overflow-x-auto">
                    {(() => {
                      const gProps = parseGraphDataToProps(q.graph);
                      return gProps ? <FunctionGraph {...gProps} /> : null;
                    })()}
                  </div>
                )}

                {/* Interactive Area */}
                <div className="pt-1">
                  {/* Format I: Multiple Choice */}
                  {q.format === 'multiple_choice_4' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map(opt => {
                        const isChosen = userMCOpt === opt.id;
                        const isCorrectAnswer = opt.id === q.correctAnswer;
                        let btnStyle = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 bg-white';

                        if (userMCOpt) {
                          if (isCorrectAnswer) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                          } else if (isChosen) {
                            btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold';
                          } else {
                            btnStyle = 'opacity-50 border-slate-200 bg-slate-50';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={Boolean(userMCOpt)}
                            onClick={() => handleSelectMCOption(q, opt.id)}
                            className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition flex items-center gap-3 ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs border border-slate-300 shrink-0">
                              {opt.id}
                            </span>
                            <span className="flex-1">
                              <MathView content={opt.text} inline />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Format II: True/False */}
                  {q.format === 'true_false_4' && q.subQuestions && (
                    <div className="space-y-2 border border-slate-200 rounded-2xl p-3 sm:p-4 bg-slate-50/70">
                      {q.subQuestions.map(sub => {
                        const currentChoice = tfAnswers[q.id]?.[sub.id];
                        const feedback = tfFeedback[q.id];
                        const isSubCorrect = feedback?.checked && currentChoice === sub.isCorrect;
                        const isSubIncorrect = feedback?.checked && currentChoice !== undefined && currentChoice !== sub.isCorrect;

                        return (
                          <div
                            key={sub.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition ${
                              isSubCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : isSubIncorrect
                                ? 'bg-rose-50 border-rose-300 text-rose-950'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="font-semibold text-slate-800 flex-1">
                              <span className="font-extrabold text-indigo-700 mr-1.5">{sub.id})</span>
                              <MathView content={sub.statement} inline />
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleSelectTF(q.id, sub.id, true)}
                                className={`px-3 py-1 rounded-lg font-bold border transition ${
                                  currentChoice === true
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                Đúng
                              </button>
                              <button
                                onClick={() => handleSelectTF(q.id, sub.id, false)}
                                className={`px-3 py-1 rounded-lg font-bold border transition ${
                                  currentChoice === false
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                Sai
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-2 flex items-center justify-between">
                        {tfFeedback[q.id]?.checked && (
                          <span className="text-xs font-bold text-indigo-700">
                            Kết quả: {tfFeedback[q.id].correctCount}/{q.subQuestions.length} ý đúng
                          </span>
                        )}
                        <button
                          onClick={() => handleCheckTF(q)}
                          className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Chấm điểm Đúng/Sai
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Format III: Short Answer */}
                  {q.format === 'short_answer' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={shortAnswers[q.id] || ''}
                        onChange={(e) => setShortAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleCheckShortAnswer(q)}
                        placeholder="Nhập số (vd: 210 hoặc 13.27)..."
                        className={`bg-slate-50 border rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56 transition ${
                          shortFeedback[q.id] === true
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : shortFeedback[q.id] === false
                            ? 'border-rose-400 bg-rose-50 text-rose-900'
                            : 'border-slate-300'
                        }`}
                      />
                      <button
                        onClick={() => handleCheckShortAnswer(q)}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition"
                      >
                        Kiểm Tra
                      </button>

                      {shortFeedback[q.id] === true && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Chính xác (+15đ)
                        </span>
                      )}
                      {shortFeedback[q.id] === false && (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Chưa đúng, hãy thử lại!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Socratic Hint & Solution Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Hint 1 */}
                    {q.hints.length > 0 && currentHintStep === 0 && (
                      <button
                        onClick={() => handleRevealHint(q.id)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold transition flex items-center gap-1.5"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        Gợi ý 1 (Ý tưởng)
                      </button>
                    )}

                    {/* Hint 2 */}
                    {q.hints.length > 1 && currentHintStep === 1 && (
                      <button
                        onClick={() => handleRevealHint(q.id)}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl font-bold transition flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        Gợi ý 2 (Bước đầu)
                      </button>
                    )}

                    {/* Solution Toggle */}
                    <button
                      onClick={() => handleToggleSolution(q.id)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold transition flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {isSolutionOpen ? 'Ẩn Lời Giải' : 'Xem Lời Giải Chuẩn KNTT'}
                    </button>

                    {/* AI Tutor Button */}
                    {onAskAI && (
                      <button
                        onClick={() => onAskAI(q)}
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-extrabold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Nhờ Gemini AI phân tích bài toán và hướng dẫn mẹo Casio"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
                        <span>✨ Nhờ AI Giảng Giải</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Hints Revealed Box */}
                {currentHintStep > 0 && (
                  <div className="space-y-2 text-xs pt-1">
                    {currentHintStep >= 1 && q.hints[0] && (
                      <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <b className="text-amber-800">Gợi ý 1 (Ý tưởng):</b>{' '}
                          <MathView content={q.hints[0]} inline />
                        </div>
                      </div>
                    )}
                    {currentHintStep >= 2 && q.hints[1] && (
                      <div className="p-3 bg-amber-100/80 border border-amber-300 rounded-xl text-amber-950 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <b className="text-amber-800">Gợi ý 2 (Bước đầu):</b>{' '}
                          <MathView content={q.hints[1]} inline />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Solution Box */}
                {isSolutionOpen && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-950 shadow-2xs">
                    <div className="font-extrabold flex items-center gap-1.5 text-emerald-800 text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Lời Giải Chi Tiết Chuẩn KNTT:
                    </div>
                    <div className="leading-relaxed font-medium">
                      <MathView content={q.solution} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
