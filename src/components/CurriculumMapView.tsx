import React from 'react';
import { GradeNumber } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';
import { ArrowRight, BookOpen, Sparkles, CheckCircle2, Bot } from 'lucide-react';

interface CurriculumMapViewProps {
  onSelectGradeAndChapter: (grade: GradeNumber, chapterId: string) => void;
  onOpenAIGenerator?: (grade: GradeNumber, chapterId: string) => void;
}

export const CurriculumMapView: React.FC<CurriculumMapViewProps> = ({
  onSelectGradeAndChapter,
  onOpenAIGenerator
}) => {
  const grades: Array<{
    grade: GradeNumber;
    stage: string;
    badgeColor: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    hoverBorder: string;
  }> = [
    {
      grade: 10,
      stage: 'Giai Đoạn Nền Tảng (9 Chương • 27 Bài)',
      badgeColor: 'bg-indigo-200 text-indigo-900',
      borderColor: 'border-indigo-200',
      bgColor: 'bg-indigo-50/40',
      textColor: 'text-indigo-950',
      accentColor: 'text-indigo-600',
      hoverBorder: 'hover:border-indigo-400'
    },
    {
      grade: 11,
      stage: 'Cơ Sở Chuyên Sâu (9 Chương • 33 Bài)',
      badgeColor: 'bg-emerald-200 text-emerald-900',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/40',
      textColor: 'text-emerald-950',
      accentColor: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-400'
    },
    {
      grade: 12,
      stage: 'Trọng Tâm Tốt Nghiệp (6 Chương • 19 Bài)',
      badgeColor: 'bg-purple-200 text-purple-900',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50/40',
      textColor: 'text-purple-950',
      accentColor: 'text-purple-600',
      hoverBorder: 'hover:border-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="pb-6 border-b border-slate-200">
          <div className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            KHUNG CHƯƠNG TRÌNH TOÁN PHỔ THÔNG 2018 • SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG • CHUẨN 2026 TRỞ ĐI
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Bản Đồ Cấu Trúc Khung Chương Trình Toàn Bộ Khối 10, 11, 12
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bao gồm đầy đủ 24 chương và 79 bài học chuẩn phân phối SGK Kết Nối Tri Thức. Bấm vào bất kỳ chương nào để vào học lý thuyết và làm bài tập trắc nghiệm đúng sai, 4 lựa chọn, và điền số!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {grades.map(g => {
            const data = CURRICULUM_DATA[g.grade];
            return (
              <div
                key={g.grade}
                className={`border ${g.borderColor} rounded-3xl p-5 ${g.bgColor} space-y-4 flex flex-col`}
              >
                <div className={`pb-3 border-b ${g.borderColor} flex items-center justify-between`}>
                  <div>
                    <span className={`text-[11px] font-bold ${g.accentColor} uppercase`}>{g.stage}</span>
                    <h3 className={`font-black ${g.textColor} text-xl mt-0.5`}>TOÁN LỚP {g.grade}</h3>
                  </div>
                  <span className={`text-xs ${g.badgeColor} font-extrabold px-2.5 py-1 rounded-full`}>
                    {data.chapters.length} Chương
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 flex-1">
                  {data.chapters.map(chapter => (
                    <li
                      key={chapter.id}
                      onClick={() => onSelectGradeAndChapter(g.grade, chapter.id)}
                      className={`p-3 bg-white hover:bg-slate-50 rounded-xl shadow-2xs border border-slate-200/80 ${g.hoverBorder} flex flex-col gap-1.5 cursor-pointer transition group`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          <span>{chapter.name}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
                      </div>

                      {chapter.lessons && chapter.lessons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {chapter.lessons.map((lesson, lIdx) => (
                            <span
                              key={lIdx}
                              className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                            >
                              {lesson}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100 mt-0.5">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{chapter.questions.length} câu mẫu</span>
                        </span>
                        <div className="flex items-center gap-2">
                          {onOpenAIGenerator && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAIGenerator(g.grade, chapter.id);
                              }}
                              className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1 transition"
                              title="Tạo đề thi AI riêng cho chương này"
                            >
                              <Bot className="w-3 h-3 text-indigo-600" />
                              <span>AI Tạo Đề</span>
                            </button>
                          )}
                          <span className="text-[10px] text-indigo-500 font-bold group-hover:underline">Học ngay →</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
