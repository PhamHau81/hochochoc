import React from 'react';
import { GradeNumber } from '../types';
import { Shapes, Flame, Star, Bookmark, KeyRound } from 'lucide-react';

interface NavbarProps {
  currentGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  streak: number;
  score: number;
  mistakesCount: number;
  onOpenMistakes: () => void;
  onBrandClick: () => void;
  onOpenApiKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentGrade,
  onSelectGrade,
  streak,
  score,
  mistakesCount,
  onOpenMistakes,
  onBrandClick,
  onOpenApiKeyModal
}) => {
  return (
    <header className="bg-indigo-950 text-white shadow-lg sticky top-0 z-50 border-b border-indigo-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={onBrandClick}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Shapes className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-black text-base sm:text-lg tracking-tight flex flex-wrap items-center gap-2">
                <span className="text-white drop-shadow-xs font-black uppercase tracking-wide">
                  APP TỰ ÔN TẬP <span className="text-amber-400">- PHẠM HẬU</span>
                </span>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-300 text-indigo-950 font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  KNTT THPT
                </span>
              </div>
              <div className="text-[11px] text-indigo-200 font-medium flex items-center gap-1.5">
                <span>Hệ thống Ôn Tập & Luyện Thi Môn Toán Chuẩn 2026 Trở Đi</span>
              </div>
            </div>
          </div>

          {/* Grade Selector - Desktop */}
          <div className="hidden md:flex items-center bg-indigo-900/60 p-1 rounded-2xl border border-indigo-700/50 shadow-inner">
            {([10, 11, 12] as GradeNumber[]).map((g) => (
              <button
                key={g}
                onClick={() => onSelectGrade(g)}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                  currentGrade === g
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* User Stats & Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* API Key Settings Button with red notice according to AI_INSTRUCTIONS.md */}
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-xl bg-indigo-900/90 hover:bg-indigo-800 border border-indigo-700/70 transition group cursor-pointer shadow-xs"
              title="Cài đặt Model AI & Gemini API Key"
            >
              <KeyRound className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">API Key</span>
                <span className="text-[9px] sm:text-[9.5px] font-black text-rose-400 uppercase tracking-tighter leading-tight animate-pulse">
                  Lấy API key để sử dụng app
                </span>
              </div>
            </button>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs font-black shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>{streak} ngày</span>
            </div>

            {/* Score */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-black shadow-xs">
              <Star className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>{score.toLocaleString('vi-VN')} đ</span>
            </div>

            {/* Mistakes notebook button */}
            <button
              onClick={onOpenMistakes}
              className="relative p-2 text-indigo-200 hover:text-white hover:bg-indigo-900 rounded-xl transition"
              title="Sổ tay câu sai"
            >
              <Bookmark className="w-5 h-5" />
              {mistakesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-xs animate-bounce">
                  {mistakesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Grade Bar */}
      <div className="flex md:hidden bg-indigo-900/80 px-4 py-1.5 border-t border-indigo-800/80 justify-around text-xs font-extrabold">
        {([10, 11, 12] as GradeNumber[]).map((g) => (
          <button
            key={g}
            onClick={() => onSelectGrade(g)}
            className={`px-3 py-1 rounded-lg transition ${
              currentGrade === g
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            Lớp {g}
          </button>
        ))}
      </div>
    </header>
  );
};
