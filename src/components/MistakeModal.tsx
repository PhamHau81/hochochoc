import React from 'react';
import { Question } from '../types';
import { MathView } from './MathView';
import { Bookmark, X, Trash2, CheckCircle2 } from 'lucide-react';

interface MistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakes: Question[];
  onRemoveMistake: (id: string) => void;
  onClearAll: () => void;
}

export const MistakeModal: React.FC<MistakeModalProps> = ({
  isOpen,
  onClose,
  mistakes,
  onRemoveMistake,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Sổ Tay Câu Hỏi Cần Ôn Lại</h3>
              <p className="text-[11px] text-slate-500">{mistakes.length} câu hỏi đã lưu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 custom-scrollbar">
          {mistakes.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-slate-700 text-sm">Sổ tay hiện đang trống!</p>
              <p className="text-slate-500 max-w-xs mx-auto">
                Khi làm bài sai hoặc nhấn biểu tượng lưu câu hỏi, các câu đó sẽ xuất hiện ở đây để bạn ôn luyện lại.
              </p>
            </div>
          ) : (
            mistakes.map((q, i) => (
              <div
                key={q.id}
                className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2 text-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-900 text-white flex items-center justify-center text-[10px] font-black">
                      #{i + 1}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                      Lớp {q.grade} • {q.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveMistake(q.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition"
                    title="Xóa khỏi sổ tay"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-slate-900 line-clamp-3 font-semibold">
                  <MathView content={q.content} />
                </div>

                <div className="text-indigo-700 font-bold pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span>Đáp số / Đáp án:</span>
                  <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-900">
                    {q.correctAnswer || 'Xem lời giải'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {mistakes.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
            <button
              onClick={onClearAll}
              className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa Tất Cả Khỏi Sổ Tay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
