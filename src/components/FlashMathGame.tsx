import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MathView } from './MathView';
import { 
  Trophy, 
  Flame, 
  Timer, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Award, 
  CheckCircle2, 
  XCircle,
  Medal,
  Crown
} from 'lucide-react';

interface FlashQuestion {
  question: string;
  options: string[];
  correct: number; // index 0..3
  explanation: string;
}

const QUESTION_BANK: FlashQuestion[] = [
  {
    question: 'Cho hàm số $y = x^3 - 3x + 1$. Đạo hàm $y\'(1)$ bằng bao nhiêu?',
    options: ['0', '3', '-3', '6'],
    correct: 0,
    explanation: '$y\' = 3x^2 - 3 \\Rightarrow y\'(1) = 3(1)^2 - 3 = 0$.'
  },
  {
    question: 'Trong mặt phẳng $Oxy$, cho $\\vec{u} = (2; 3)$ và $\\vec{v} = (4; -1)$. Tích vô hướng $\\vec{u} \\cdot \\vec{v}$ bằng:',
    options: ['5', '8', '11', '-5'],
    correct: 0,
    explanation: '$\\vec{u} \\cdot \\vec{v} = 2(4) + 3(-1) = 8 - 3 = 5$.'
  },
  {
    question: 'Đường tiệm cận đứng của đồ thị hàm số $y = \\frac{3x - 1}{x - 2}$ là:',
    options: ['$x = 2$', '$y = 3$', '$x = -2$', '$y = -1$'],
    correct: 0,
    explanation: 'Nghiệm của mẫu số là $x - 2 = 0 \\Leftrightarrow x = 2$.'
  },
  {
    question: 'Trong không gian $Oxyz$, độ dài của vectơ $\\vec{a} = (1; 2; 2)$ bằng:',
    options: ['3', '5', '9', '$\\sqrt{5}$'],
    correct: 0,
    explanation: '$|\\vec{a}| = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$.'
  },
  {
    question: 'Đạo hàm của hàm số $y = \\ln(x)$ với $x > 0$ là:',
    options: ['$\\frac{1}{x}$', '$x$', '$e^x$', '$\\frac{1}{x^2}$'],
    correct: 0,
    explanation: '$(\\ln x)\' = \\frac{1}{x}$.'
  },
  {
    question: 'Cho hình vuông $ABCD$ cạnh 2. Tích vô hướng $\\overrightarrow{AB} \\cdot \\overrightarrow{AD}$ bằng:',
    options: ['0', '4', '2', '$2\\sqrt{2}$'],
    correct: 0,
    explanation: 'Do $AB \\perp AD$ nên $\\overrightarrow{AB} \\cdot \\overrightarrow{AD} = 0$.'
  },
  {
    question: 'Một mẫu số liệu có cỡ mẫu $n = 60$. Vị trí mốc xác định trung vị $\\frac{n}{2}$ là:',
    options: ['30', '15', '45', '20'],
    correct: 0,
    explanation: '$\\frac{n}{2} = \\frac{60}{2} = 30$.'
  },
  {
    question: 'Tâm đối xứng của đồ thị hàm số $y = x^3 - 3x$ là điểm nào?',
    options: ['$O(0; 0)$', '$I(1; -2)$', '$I(-1; 2)$', '$I(0; 1)$'],
    correct: 0,
    explanation: 'Hàm số lẻ nên nhận gốc tọa độ $O(0; 0)$ làm tâm đối xứng.'
  },
  {
    question: 'Cho cấp số nhân $(u_n)$ có $u_1 = 3, q = 2$. Số hạng $u_3$ bằng:',
    options: ['12', '6', '18', '24'],
    correct: 0,
    explanation: '$u_3 = u_1 \\cdot q^2 = 3 \\cdot 2^2 = 12$.'
  },
  {
    question: 'Trong không gian $Oxyz$, góc giữa trục $Ox$ và trục $Oy$ bằng bao nhiêu độ?',
    options: ['$90^\\circ$', '$60^\\circ$', '$45^\\circ$', '$180^\\circ$'],
    correct: 0,
    explanation: 'Hệ trục tọa độ Descartes ba chiều có các trục đôi một vuông góc ($90^\\circ$).'
  }
];

interface Badge {
  id: string;
  name: string;
  req: string;
  icon: string;
  unlocked: boolean;
}

export const FlashMathGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Kỷ lục lưu localStorage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('flash_math_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trộn thứ tự câu hỏi khi bắt đầu
  const [questions, setQuestions] = useState<FlashQuestion[]>(QUESTION_BANK);

  const startGame = () => {
    // Shuffle câu hỏi
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setFeedback(null);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleEndGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const handleEndGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);

    setHighScore((prev) => {
      if (score > prev) {
        localStorage.setItem('flash_math_high_score', score.toString());
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        return score;
      }
      return prev;
    });
  };

  const handleAnswer = (optionIdx: number) => {
    if (!isPlaying || feedback !== null) return;

    const currentQ = questions[currentIdx % questions.length];
    if (optionIdx === currentQ.correct) {
      const newCombo = combo + 1;
      const points = 10 + newCombo * 5;
      setScore((s) => s + points);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setFeedback('correct');

      setTimeout(() => {
        setFeedback(null);
        setCurrentIdx((idx) => idx + 1);
      }, 350);
    } else {
      setCombo(0);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setCurrentIdx((idx) => idx + 1);
      }, 600);
    }
  };

  const currentQ = questions[currentIdx % questions.length];

  // Hệ thống huy hiệu
  const badges: Badge[] = [
    {
      id: 'b1',
      name: 'Tia Chớp Phản Xạ',
      req: 'Đạt từ 50 điểm trở lên',
      icon: '⚡',
      unlocked: highScore >= 50
    },
    {
      id: 'b2',
      name: 'Bậc Thầy Bảng Biến Thiên',
      req: 'Đạt từ 120 điểm trở lên',
      icon: '📈',
      unlocked: highScore >= 120
    },
    {
      id: 'b3',
      name: 'Thần Đồng Vectơ',
      req: 'Combo 5 câu liên tiếp',
      icon: '🎯',
      unlocked: maxCombo >= 5
    },
    {
      id: 'b4',
      name: 'Đại Kiện Tướng KNTT',
      req: 'Đạt từ 200 điểm trở lên',
      icon: '👑',
      unlocked: highScore >= 200
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner giới thiệu game */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>GAMIFICATION TOÁN THPT CHUẨN 2026 TRỞ ĐI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Đấu Trí Toán Học 60 Giây (Flash Math)
          </h2>
          <p className="text-sm text-white/90 leading-relaxed">
            Rèn luyện phản xạ tính nhanh đạo hàm, tích vô hướng vectơ, nhận diện bảng biến thiên và số liệu thống kê. Thử thách giải nhiều câu nhất trong vòng 1 phút!
          </p>
        </div>

        {/* High score badge */}
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Kỷ lục cao nhất: <span className="text-amber-300 text-sm font-black">{highScore} đ</span></span>
          </div>
          <div className="flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
            <Flame className="w-4 h-4 text-rose-400 fill-current" />
            <span>Combo đỉnh nhất: <span className="text-rose-300 text-sm font-black">{maxCombo}x</span></span>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
        {!isPlaying && !isGameOver && (
          <div className="py-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-400/20 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Timer className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Sẵn Sàng Thử Thách Phản Xạ?</h3>
              <p className="text-xs text-slate-500 mt-1">
                60 giây tính nhanh liên tục. Trả lời đúng liên tiếp để nhân điểm số Combo!
              </p>
            </div>
            <button
              onClick={startGame}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-base shadow-lg shadow-rose-600/30 transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>BẮT ĐẦU NGAY (60 GIÂY)</span>
            </button>
          </div>
        )}

        {/* Live Playing Area */}
        {isPlaying && (
          <div className="space-y-6">
            {/* Top Bar: Timer, Score, Combo */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              {/* Timer with color alert */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm transition-all ${
                  timeLeft <= 10
                    ? 'bg-rose-100 text-rose-700 animate-bounce'
                    : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                <Timer className="w-5 h-5" />
                <span>{timeLeft}s</span>
              </div>

              {/* Combo Multiplier */}
              {combo > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-indigo-950 text-xs font-black animate-bounce shadow-xs">
                  <Flame className="w-4 h-4 fill-current text-rose-600" />
                  <span>Combo x{combo}!</span>
                </div>
              )}

              {/* Score */}
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Điểm số</span>
                <span className="text-2xl font-black text-indigo-950">{score}</span>
              </div>
            </div>

            {/* Question Card */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all ${
                feedback === 'correct'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : feedback === 'wrong'
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 bg-slate-50/70'
              }`}
            >
              <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-2">
                Câu hỏi số #{currentIdx + 1}:
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-serif">
                <MathView content={currentQ.question} />
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(oIdx)}
                  disabled={feedback !== null}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/60 bg-white font-serif text-sm sm:text-base font-bold text-slate-800 transition-all text-left flex items-center justify-between cursor-pointer disabled:opacity-60 shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-sans font-black text-slate-700">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <MathView content={opt} inline />
                  </div>
                  {feedback === 'correct' && oIdx === currentQ.correct && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in zoom-in-50" />
                  )}
                  {feedback === 'wrong' && oIdx !== currentQ.correct && (
                    <XCircle className="w-5 h-5 text-rose-500 animate-in zoom-in-50" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="py-8 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                HẾT GIỜ! HOÀN THÀNH LƯỢT CHƠI
              </span>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {score} <span className="text-base font-bold text-slate-500">Điểm</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Chuỗi Combo cao nhất: <b>{maxCombo}x</b> • Trả lời được <b>{currentIdx}</b> câu hỏi.
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại một lượt nữa</span>
            </button>
          </div>
        )}
      </div>

      {/* Badges / Achievements Collection */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Medal className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
            Bộ Sưu Tập Huy Hiệu Danh Dự Toán Học
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border transition-all text-center space-y-1.5 ${
                b.unlocked
                  ? 'border-amber-300 bg-amber-50/70 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-60'
              }`}
            >
              <div className="text-3xl">{b.icon}</div>
              <div className="font-extrabold text-xs text-slate-900">{b.name}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{b.req}</div>
              <div className="pt-1">
                {b.unlocked ? (
                  <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Đã mở khóa
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-200/70 px-2 py-0.5 rounded-full">
                    Chưa đạt
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
