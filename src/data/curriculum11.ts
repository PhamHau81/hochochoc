import { Chapter } from '../types';

export const GRADE_11_CHAPTERS: Chapter[] = [
  {
    id: '11_ch1',
    grade: 11,
    name: 'Chương I: Hàm số lượng giác & Phương trình lượng giác',
    lessons: [
      'Bài 1: Giá trị lượng giác của góc lượng giác',
      'Bài 2: Công thức lượng giác',
      'Bài 3: Hàm số lượng giác',
      'Bài 4: Phương trình lượng giác cơ bản'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Công thức lượng giác cốt lõi:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Công thức cộng:</b> $\\cos(a \\pm b) = \\cos a \\cos b \\mp \\sin a \\sin b$; $\\sin(a \\pm b) = \\sin a \\cos b \\pm \\cos a \\sin b$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Nhân đôi:</b> $\\sin 2a = 2\\sin a \\cos a$; $\\cos 2a = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Hạ bậc:</b> $\\cos^2 a = \\frac{1 + \\cos 2a}{2}$; $\\sin^2 a = \\frac{1 - \\cos 2a}{2}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Phương trình lượng giác cơ bản:</div>
          <p class="text-indigo-100 leading-relaxed">• $\\sin x = \\sin \\alpha \\Leftrightarrow x = \\alpha + k2\\pi$ hoặc $x = \\pi - \\alpha + k2\\pi$ ($k \\in \\mathbb{Z}$).</p>
          <p class="text-indigo-100 leading-relaxed">• $\\cos x = \\cos \\alpha \\Leftrightarrow x = \\pm \\alpha + k2\\pi$ ($k \\in \\mathbb{Z}$).</p>
          <p class="text-indigo-100 leading-relaxed">• $\\tan x = \\tan \\alpha \\Leftrightarrow x = \\alpha + k\\pi$ ($k \\in \\mathbb{Z}$).</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Đuôi nghiệm chu kỳ:</b> $\\sin$ và $\\cos$ có đuôi là $+ k2\\pi$, nhưng $\\tan$ và $\\cot$ có đuôi là $+ k\\pi$.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Điều kiện xác định:</b> Khi giải phương trình chứa $\\tan x$ (cần $\\cos x \\ne 0$) hoặc $\\cot x$ (cần $\\sin x \\ne 0$), bắt buộc phải đặt điều kiện trước khi giải để không lấy nhầm nghiệm ngoại lai.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch1_1',
        grade: 11,
        chapterId: '11_ch1',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Nghiệm của phương trình $\\cos x = \\frac{1}{2}$ là:',
        options: [
          { id: 'A', text: '$x = \\pm \\frac{\\pi}{3} + k2\\pi, k \\in \\mathbb{Z}$' },
          { id: 'B', text: '$x = \\pm \\frac{\\pi}{6} + k2\\pi, k \\in \\mathbb{Z}$' },
          { id: 'C', text: '$x = \\frac{\\pi}{3} + k\\pi, k \\in \\mathbb{Z}$' },
          { id: 'D', text: '$x = \\pm \\frac{2\\pi}{3} + k2\\pi, k \\in \\mathbb{Z}$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Ta có $\\frac{1}{2} = \\cos \\frac{\\pi}{3}$.',
          'Áp dụng công thức nghiệm của hàm cosin: $\\cos x = \\cos \\alpha \\Leftrightarrow x = \\pm \\alpha + k2\\pi$.'
        ],
        solution: 'Phương trình $\\cos x = \\frac{1}{2} = \\cos \\frac{\\pi}{3} \\Leftrightarrow x = \\pm \\frac{\\pi}{3} + k2\\pi$ ($k \\in \\mathbb{Z}$).'
      },
      {
        id: 'q11_ch1_2',
        grade: 11,
        chapterId: '11_ch1',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Số nghiệm thuộc khoảng $(0; 2\\pi)$ của phương trình $2\\sin x - 1 = 0$ là bao nhiêu?',
        correctAnswer: '2',
        hints: [
          'Biến đổi: $\\sin x = \\frac{1}{2} = \\sin \\frac{\\pi}{6}$.',
          'Các nghiệm trên một vòng tròn lượng giác $[0; 2\\pi)$ là $x = \\frac{\\pi}{6}$ và $x = \\frac{5\\pi}{6}$.'
        ],
        solution: 'Ta có $2\\sin x - 1 = 0 \\Leftrightarrow \\sin x = \\frac{1}{2} \\Leftrightarrow x = \\frac{\\pi}{6} + k2\\pi$ hoặc $x = \\frac{5\\pi}{6} + k2\\pi$. Trong khoảng $(0; 2\\pi)$, có đúng 2 nghiệm là $x = \\frac{\\pi}{6}$ và $x = \\frac{5\\pi}{6}$.'
      },
      {
        id: 'q11_ch1_3',
        grade: 11,
        chapterId: '11_ch1',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hàm số $y = f(x) = \\cos 2x$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Tập xác định của hàm số là $D = \\mathbb{R}$.', isCorrect: true },
          { id: 'b', statement: 'Hàm số $y = \\cos 2x$ là hàm số tuần hoàn với chu kì $T = \\pi$.', isCorrect: true },
          { id: 'c', statement: 'Giá trị lớn nhất của hàm số bằng $2$.', isCorrect: false },
          { id: 'd', statement: 'Hàm số đã cho là một hàm số chẵn trên $\\mathbb{R}$.', isCorrect: true }
        ],
        hints: [
          'Hàm cosin xác định với mọi $x \\in \\mathbb{R}$.',
          'Chu kì của $\\cos(\\omega x)$ là $T = \\frac{2\\pi}{|\\omega|} = \\frac{2\\pi}{2} = \\pi$.',
          'Vì $-1 \\le \\cos 2x \\le 1$ nên GTLN bằng 1, không phải 2.',
          'Hàm chẵn vì $f(-x) = \\cos(-2x) = \\cos 2x = f(x)$.'
        ],
        solution: 'Ý a Đúng vì hàm số xác định trên $\\mathbb{R}$. Ý b Đúng vì chu kì $T = \\frac{2\\pi}{2} = \\pi$. Ý c Sai vì GTLN của hàm số là $1$. Ý d Đúng vì $\\cos(-2x) = \\cos(2x)$ nên là hàm số chẵn.'
      }
    ]
  },
  {
    id: '11_ch2',
    grade: 11,
    name: 'Chương II: Dãy số, Cấp số cộng & Cấp số nhân',
    lessons: [
      'Bài 5: Dãy số',
      'Bài 6: Cấp số cộng',
      'Bài 7: Cấp số nhân'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Cấp số cộng $(u_n)$:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Số hạng tổng quát:</b> $u_n = u_1 + (n-1)d$ (với công sai $d$).</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tổng $n$ số hạng đầu:</b> $S_n = \\frac{n(u_1+u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tính chất 3 số hạng liên tiếp:</b> $u_k = \\frac{u_{k-1} + u_{k+1}}{2}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Cấp số nhân $(u_n)$:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Số hạng tổng quát:</b> $u_n = u_1 \\cdot q^{n-1}$ (với công bội $q$).</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tổng $n$ số hạng đầu ($q \\ne 1$):</b> $S_n = \\frac{u_1(1-q^n)}{1-q}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>CSN lùi vô hạn ($|q| < 1$):</b> $S = \\frac{u_1}{1-q}$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Số mũ và số hạng:</b> Trong CSN, $u_n = u_1 \\cdot q^{n-1}$ (số mũ là $n-1$, không phải $n$). Trong CSC, khoảng cách giữa $u_m$ và $u_n$ là $u_m - u_n = (m - n)d$.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>CSN lùi vô hạn:</b> Chỉ áp dụng công thức $S = \\frac{u_1}{1-q}$ khi công bội thỏa mãn $|q| < 1$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_csc_1',
        grade: 11,
        chapterId: '11_ch2',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 3$ và công sai $d = 4$. Số hạng thứ 5 bằng:',
        options: [
          { id: 'A', text: '$19$' },
          { id: 'B', text: '$23$' },
          { id: 'C', text: '$15$' },
          { id: 'D', text: '$20$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Áp dụng công thức số hạng tổng quát $u_n = u_1 + (n-1)d$.',
          'Với $n = 5$: $u_5 = 3 + (5-1) \\times 4 = 3 + 16 = 19$.'
        ],
        solution: 'Ta có $u_5 = u_1 + 4d = 3 + 4(4) = 19$.'
      },
      {
        id: 'q11_csn_2',
        grade: 11,
        chapterId: '11_ch2',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Một người gửi tiết kiệm 100 triệu đồng vào ngân hàng với lãi suất 6%/năm theo hình thức lãi kép (tiền lãi mỗi năm được cộng vào vốn để tính lãi cho năm sau). Hỏi sau đúng 3 năm, số tiền cả gốc lẫn lãi người đó nhận được là bao nhiêu triệu đồng (làm tròn kết quả đến hàng phần mười, ví dụ 119.1)?',
        correctAnswer: '119.1',
        hints: [
          'Công thức lãi kép: $A_n = A_0(1+r)^n$.',
          'Thay số: $A_3 = 100(1 + 0,06)^3 = 100 \\times 1,191016 = 119,1016$.'
        ],
        solution: 'Áp dụng công thức lãi kép: $A_3 = 100 \\times (1 + 0,06)^3 = 100 \\times 1,191016 \\approx 119,1$ triệu đồng.'
      },
      {
        id: 'q11_csc_3',
        grade: 11,
        chapterId: '11_ch2',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 2$ và công sai $d = 5$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Số hạng tổng quát của cấp số cộng là $u_n = 5n - 3$.', isCorrect: true },
          { id: 'b', statement: 'Số hạng thứ 10 là $u_{10} = 47$.', isCorrect: true },
          { id: 'c', statement: 'Số $102$ là một số hạng của cấp số cộng $(u_n)$.', isCorrect: true },
          { id: 'd', statement: 'Tổng 20 số hạng đầu tiên của cấp số cộng bằng $S_{20} = 990$.', isCorrect: true }
        ],
        hints: [
          'Số hạng tổng quát: $u_n = u_1 + (n-1)d = 2 + 5(n-1) = 5n - 3$.',
          '$u_{10} = 5(10) - 3 = 47$.',
          '$5n - 3 = 102 \\Leftrightarrow 5n = 105 \\Leftrightarrow n = 21 \\in \\mathbb{N}^*$.',
          'Tổng: $S_{20} = \\frac{20[2(2) + 19(5)]}{2} = 10[4 + 95] = 990$.'
        ],
        solution: 'Ý a Đúng vì $u_n = 2 + 5(n-1) = 5n - 3$. Ý b Đúng vì $u_{10} = 5(10) - 3 = 47$. Ý c Đúng vì $5n - 3 = 102 \\Leftrightarrow n = 21$ là số nguyên dương. Ý d Đúng vì $S_{20} = 10[4 + 95] = 990$.'
      }
    ]
  },
  {
    id: '11_ch3',
    grade: 11,
    name: 'Chương III: Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm',
    lessons: [
      'Bài 8: Mẫu số liệu ghép nhóm',
      'Bài 9: Các số đặc trưng đo xu thế trung tâm'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div class="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Số trung bình $\\bar{x}$:</div>
          <p>$$\\bar{x} = \\frac{\\sum_{i=1}^k m_i c_i}{n}$$</p>
          <p class="text-[11px] text-indigo-200">Mỗi nhóm là một nửa khoảng $[a_i; a_{i+1})$. Giá trị đại diện của nhóm là $c_i = \\frac{a_i + a_{i+1}}{2}$; tần số là $m_i$; cỡ mẫu $n = \\sum m_i$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Trung vị $M_e$ & Tứ phân vị:</div>
          <p>$$M_e = a_p + \\frac{\\frac{n}{2} - C}{m_p} \\cdot (a_{p+1} - a_p)$$</p>
          <p class="text-[11px] text-indigo-200">Nhóm $[a_p; a_{p+1})$ chứa trung vị có $cf_p \\ge \\frac{n}{2}$; $C = cf_{p-1} = \\sum_{j=1}^{p-1} m_j$.</p>
          <p class="text-[11px] text-indigo-200">Tứ phân vị $Q_1, Q_3$ dùng mốc $\\frac{n}{4}$ và $\\frac{3n}{4}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">3. Mốt $M_o$:</div>
          <p>$$M_o = a_j + \\frac{m_j - m_{j-1}}{(m_j - m_{j-1}) + (m_j - m_{j+1})} \\cdot (a_{j+1} - a_j)$$</p>
          <p class="text-[11px] text-indigo-200">Nhóm $[a_j; a_{j+1})$ chứa mốt có tần số $m_j$ lớn nhất trong mẫu số liệu ghép nhóm.</p>
        </div>
        <div class="md:col-span-3 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Xác định nhóm chứa trung vị & mốt:</b> Nhóm chứa trung vị $M_e$ là nhóm đầu tiên có tần số tích lũy $cf_p \\ge \\frac{n}{2}$. Nhóm chứa mốt $M_o$ là nhóm có tần số $m_j$ cao nhất.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Quy ước nhóm biên của mốt:</b> Nếu nhóm chứa mốt là nhóm đầu tiên ($j=1$), quy ước $m_0 = 0$; nếu là nhóm cuối cùng ($j=k$), quy ước $m_{k+1} = 0$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_1',
        grade: 11,
        chapterId: '11_ch3',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: `Khảo sát thời gian tự học môn Toán ở nhà của 50 học sinh lớp 11 được cho bởi bảng tần số ghép nhóm sau:

| Nhóm thời gian (h) | $[0; 4)$ | $[4; 8)$ | $[8; 12)$ | $[12; 16)$ | $[16; 20)$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Số HS ($m_i$) | 4 | 12 | 18 | 11 | 5 |

Nhóm chứa trung vị là nhóm nào sau đây?`,
        options: [
          { id: 'A', text: '$[4; 8)$' },
          { id: 'B', text: '$[8; 12)$' },
          { id: 'C', text: '$[12; 16)$' },
          { id: 'D', text: '$[16; 20)$' }
        ],
        correctAnswer: 'B',
        hints: [
          'Tính vị trí trung tâm: $\\frac{n}{2} = \\frac{50}{2} = 25$.',
          'Lập bảng tần số tích lũy: $cf_1 = 4$, $cf_2 = 16$, $cf_3 = 34$. Nhóm đầu tiên có $cf \\ge 25$ là $[8; 12)$.'
        ],
        solution: 'Cỡ mẫu $n = 50 \\Rightarrow \\frac{n}{2} = 25$. Tần số tích lũy: nhóm 1 là 4; nhóm 2 là $4+12=16 < 25$; nhóm 3 là $16+18=34 \\ge 25$. Vậy nhóm chứa trung vị là $[8; 12)$.'
      },
      {
        id: 'q11_2',
        grade: 11,
        chapterId: '11_ch3',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Đối với mẫu số liệu ghép nhóm 50 học sinh ở bài toán trên, xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Nhóm chứa mốt là nhóm $[8; 12)$.', isCorrect: true },
          { id: 'b', statement: 'Mốt của mẫu số liệu ghép nhóm trên xấp xỉ bằng $9,85$ giờ.', isCorrect: true },
          { id: 'c', statement: 'Trung vị của mẫu số liệu ghép nhóm trên bằng $10,0$ giờ.', isCorrect: true },
          { id: 'd', statement: 'Tứ phân vị thứ nhất $Q_1$ của mẫu số liệu ghép nhóm bằng $8,0$ giờ.', isCorrect: false }
        ],
        hints: [
          'Nhóm chứa mốt có tần số $18$ lớn nhất $\\Rightarrow [8; 12)$.',
          'Tính $M_o = 8 + \\frac{18-12}{(18-12)+(18-11)} \\cdot (12-8) = 8 + \\frac{24}{13} \\approx 9,85$.',
          'Tính $Q_1$: $\\frac{n}{4} = 12,5 \\Rightarrow Q_1 = 4 + \\frac{12,5-4}{12} \\cdot 4 = 6,83 \\ne 8,0$.'
        ],
        solution: 'Ý a: Đúng vì $m_3=18$ lớn nhất. Ý b: Đúng vì $M_o = 8 + \\frac{6}{6+7}\\cdot 4 \\approx 9,85$. Ý c: Đúng vì $M_e = 8 + \\frac{25-16}{18}\\cdot 4 = 10,0$. Ý d: Sai vì $Q_1 = 4 + \\frac{12,5-4}{12}\\cdot 4 \\approx 6,83$.'
      },
      {
        id: 'q11_3',
        grade: 11,
        chapterId: '11_ch3',
        format: 'short_answer',
        difficulty: 'Vận dụng cao',
        content: 'Tính giá trị tứ phân vị thứ ba $Q_3$ của mẫu số liệu ghép nhóm 50 học sinh trên (làm tròn kết quả đến hàng phần trăm, ví dụ 13.27).',
        correctAnswer: '13.27',
        hints: [
          'Tính vị trí: $\\frac{3n}{4} = \\frac{3 \\cdot 50}{4} = 37,5$.',
          'Nhóm chứa $Q_3$ là $[12; 16)$ với $a_p = 12$, độ dài nhóm $(16 - 12) = 4$, $m_p = 11$, $C = 34$.',
          'Áp dụng công thức $Q_3 = 12 + \\frac{37,5 - 34}{11} \\cdot 4$.'
        ],
        solution: 'Ta có $\\frac{3n}{4} = 37,5$. Tần số tích lũy: $cf_3 = 34 < 37,5$ và $cf_4 = 45 \\ge 37,5$. Nhóm chứa $Q_3$ là $[12; 16)$. Do đó: $Q_3 = 12 + \\frac{37,5 - 34}{11} \\cdot 4 = 12 + \\frac{14}{11} \\approx 13,27$.'
      }
    ]
  },
  {
    id: '11_ch4',
    grade: 11,
    name: 'Chương IV: Quan hệ song song trong không gian',
    lessons: [
      'Bài 10: Đường thẳng và mặt phẳng trong không gian',
      'Bài 11: Hai đường thẳng song song',
      'Bài 12: Đường thẳng và mặt phẳng song song',
      'Bài 13: Hai mặt phẳng song song',
      'Bài 14: Phép chiếu song song'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Đường thẳng & Mặt phẳng song song:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>$d \\parallel (\\alpha)$:</b> Nếu đường thẳng $d$ không nằm trong $(\\alpha)$ và song song với một đường thẳng $d'$ nằm trong $(\\alpha)$ thì $d \\parallel (\\alpha)$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Giao tuyến song song:</b> Nếu hai mặt phẳng cùng chứa một đường thẳng song song với nhau thì giao tuyến của chúng (nếu có) cũng song song với đường thẳng đó.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Hai mặt phẳng song song:</div>
          <p class="text-indigo-100 leading-relaxed">• Nếu mặt phẳng $(\\alpha)$ chứa hai đường thẳng cắt nhau cùng song song với mặt phẳng $(\\beta)$ thì $(\\alpha) \\parallel (\\beta)$.</p>
          <p class="text-indigo-100 leading-relaxed">• Định lí Talet trong không gian: Ba mặt phẳng đôi một song song chắn trên hai cát tuyến bất kì các đoạn thẳng tương ứng tỉ lệ.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Điều kiện $d \\parallel (\\alpha)$:</b> Bắt buộc $d$ không được nằm trong $(\\alpha)$ ($d \\not\\subset (\\alpha)$). Nếu $d \\subset (\\alpha)$ thì không được kết luận song song.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Hai mặt phẳng song song:</b> Phải chứa HAI ĐƯỜNG THẲNG CẮT NHAU cùng song song với mặt phẳng kia (hai đường thẳng song song là chưa đủ!).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch4_1',
        grade: 11,
        chapterId: '11_ch4',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành. Gọi $M, N$ lần lượt là trung điểm của $SA$ và $SD$. Khẳng định nào sau đây là ĐÚNG?',
        options: [
          { id: 'A', text: '$MN \\parallel (SBC)$' },
          { id: 'B', text: '$MN \\parallel (ABCD)$' },
          { id: 'C', text: '$MN$ cắt mặt phẳng $(ABCD)$' },
          { id: 'D', text: '$MN \\parallel (SAB)$' }
        ],
        correctAnswer: 'B',
        hints: [
          '$MN$ là đường trung bình của tam giác $SAD$, suy ra $MN \\parallel AD$.',
          'Vì $AD \\subset (ABCD)$ và $MN \\not\\subset (ABCD)$ nên $MN \\parallel (ABCD)$.'
        ],
        solution: 'Trong tam giác $SAD$, $MN$ là đường trung bình nên $MN \\parallel AD$. Mặt khác $AD \\subset (ABCD)$ và $MN$ không nằm trong $(ABCD)$, suy ra $MN \\parallel (ABCD)$.'
      },
      {
        id: 'q11_ch4_2',
        grade: 11,
        chapterId: '11_ch4',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hình lăng trụ tam giác $ABC.A\'B\'C\'$. Gọi $M, N$ lần lượt là trung điểm của $AB$ và $A\'B\'$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Tứ giác $ABB\'A\'$ là một hình bình hành.', isCorrect: true },
          { id: 'b', statement: 'Đường thẳng $MN$ song song với đường thẳng $AA\'$.', isCorrect: true },
          { id: 'c', statement: 'Đường thẳng $MN$ song song với mặt phẳng $(BCC\'B\')$.', isCorrect: true },
          { id: 'd', statement: 'Mặt phẳng $(ABC)$ cắt mặt phẳng $(A\'B\'C\')$ theo một giao tuyến.', isCorrect: false }
        ],
        hints: [
          'Các cạnh bên của lăng trụ đôi một song song và bằng nhau.',
          '$MN$ nối trung điểm hai đáy tương ứng nên $MN \\parallel AA\' \\parallel BB\'$.',
          'Vì $MN \\parallel BB\'$ và $BB\' \\subset (BCC\'B\')$ nên $MN \\parallel (BCC\'B\')$.',
          'Hai mặt phẳng đáy của lăng trụ song song với nhau nên không cắt nhau.'
        ],
        solution: 'Ý a Đúng vì các mặt bên của lăng trụ là hình bình hành. Ý b Đúng vì $M, N$ là trung điểm của $AB$ và $A\'B\'$ nên $AMNB$ tạo thành đoạn nối song song với $AA\'$. Ý c Đúng vì $MN \\parallel BB\' \\subset (BCC\'B\')$. Ý d Sai vì hai mặt đáy $(ABC) \\parallel (A\'B\'C\')$ nên không có giao tuyến.'
      },
      {
        id: 'q11_ch4_3',
        grade: 11,
        chapterId: '11_ch4',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình thang với đáy lớn $AB = 3CD$. Mặt phẳng $(\\alpha)$ song song với đáy và cắt cạnh bên $SA$ tại $M$ sao cho $SM = 2MA$. Tính tỉ số đồng dạng $k = \\frac{SM}{SA}$ của thiết diện cắt bởi $(\\alpha)$ so với đáy (làm tròn đến hàng phần trăm, ví dụ 0.67).',
        correctAnswer: '0.67',
        hints: [
          'Vì $SM = 2MA$ nên $\\frac{SM}{SA} = \\frac{2}{3} \\approx 0,67$.',
          'Thiết diện cắt bởi mặt phẳng song song với đáy đồng dạng với đáy theo tỉ số $k = \\frac{SM}{SA} = \\frac{2}{3} \\approx 0,67$.'
        ],
        solution: 'Vì $(\\alpha) \\parallel (ABCD)$ nên theo định lí Ta-lét trong không gian, các đoạn thẳng trên thiết diện tỉ lệ với các đoạn thẳng trên đáy theo tỉ số $k = \\frac{SM}{SA} = \\frac{2}{2+1} = \\frac{2}{3} \\approx 0,67$.'
      }
    ]
  },
  {
    id: '11_ch5',
    grade: 11,
    name: 'Chương V: Giới hạn & Hàm số liên tục',
    lessons: [
      'Bài 15: Giới hạn của dãy số',
      'Bài 16: Giới hạn của hàm số',
      'Bài 17: Hàm số liên tục'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Giới hạn dãy số & hàm số:</div>
          <p class="text-indigo-100 leading-relaxed">• $\\lim_{n\\to\\infty} \\frac{1}{n^k} = 0$ ($k > 0$); $\\lim_{n\\to\\infty} q^n = 0$ nếu $|q| < 1$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Khử dạng vô định:</b> $\\left[\\frac{0}{0}\\right]$ phân tích nhân tử hoặc nhân liên hợp; $\\left[\\frac{\\infty}{\\infty}\\right]$ chia bậc cao nhất.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Hàm số liên tục:</div>
          <p class="text-indigo-100 leading-relaxed">• Hàm số $y = f(x)$ liên tục tại $x_0 \\Leftrightarrow \\lim_{x\\to x_0} f(x) = f(x_0)$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Định lí giá trị trung gian:</b> Nếu $f(x)$ liên tục trên $[a; b]$ và $f(a) \\cdot f(b) < 0$ thì phương trình $f(x) = 0$ có ít nhất 1 nghiệm thuộc $(a; b)$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Giới hạn một bên:</b> $\\lim_{x \\to x_0} f(x) = L \\Leftrightarrow \\lim_{x \\to x_0^+} f(x) = \\lim_{x \\to x_0^-} f(x) = L$. Nếu hai giới hạn một bên khác nhau thì KHÔNG tồn tại giới hạn tại $x_0$.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Liên tục trên đoạn $[a; b]$:</b> Đòi hỏi liên tục trên khoảng mở $(a; b)$ VÀ liên tục phải tại $a$ ($\\lim_{x \\to a^+} f(x) = f(a)$), liên tục trái tại $b$ ($\\lim_{x \\to b^-} f(x) = f(b)$).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch5_1',
        grade: 11,
        chapterId: '11_ch5',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Tính giới hạn $L = \\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$.',
        options: [
          { id: 'A', text: '$4$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$0$' },
          { id: 'D', text: '$\\infty$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Đây là dạng vô định $\\frac{0}{0}$.',
          'Phân tích tử: $x^2 - 4 = (x - 2)(x + 2)$. Triệt tiêu thừa số $(x - 2)$.'
        ],
        solution: 'Ta có $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2} (x+2) = 4$.'
      },
      {
        id: 'q11_ch5_2',
        grade: 11,
        chapterId: '11_ch5',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Tính giới hạn $I = \\lim_{n \\to \\infty} \\frac{2n^2 + 3n - 1}{n^2 - 4}$.',
        correctAnswer: '2',
        hints: [
          'Chia cả tử và mẫu cho $n^2$.',
          '$\\frac{2 + 3/n - 1/n^2}{1 - 4/n^2} \\to \\frac{2}{1} = 2$.'
        ],
        solution: 'Chia cả tử và mẫu cho $n^2$: $\\lim_{n \\to \\infty} \\frac{2 + \\frac{3}{n} - \\frac{1}{n^2}}{1 - \\frac{4}{n^2}} = \\frac{2 + 0 - 0}{1 - 0} = 2$.'
      },
      {
        id: 'q11_ch5_3',
        grade: 11,
        chapterId: '11_ch5',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hàm số $f(x) = \\begin{cases} \\frac{x^2 - 1}{x - 1} & \\text{khi } x \\ne 1 \\\\ m & \\text{khi } x = 1 \\end{cases}$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Giới hạn $\\lim_{x \\to 1} f(x) = 2$.', isCorrect: true },
          { id: 'b', statement: 'Với $m = 2$, hàm số $f(x)$ liên tục tại điểm $x = 1$.', isCorrect: true },
          { id: 'c', statement: 'Với $m = 0$, hàm số $f(x)$ liên tục trên $\\mathbb{R}$.', isCorrect: false },
          { id: 'd', statement: 'Phương trình $x^3 - 3x + 1 = 0$ có ít nhất một nghiệm trong khoảng $(0; 1)$.', isCorrect: true }
        ],
        hints: [
          '$\\lim_{x \\to 1} \\frac{(x-1)(x+1)}{x-1} = \\lim_{x \\to 1} (x+1) = 2$.',
          'Hàm số liên tục tại $x=1 \\Leftrightarrow \\lim_{x \\to 1} f(x) = f(1) = m \\Rightarrow m = 2$.',
          'Với $m = 0 \\ne 2$, hàm số bị gián đoạn tại $x = 1$.',
          'Đặt $g(x) = x^3 - 3x + 1$: $g(0) = 1 > 0$, $g(1) = -1 < 0 \\Rightarrow g(0)g(1) < 0$, có nghiệm thuộc $(0; 1)$.'
        ],
        solution: 'Ý a Đúng vì $\\lim_{x \\to 1} (x+1) = 2$. Ý b Đúng vì $\\lim_{x \\to 1} f(x) = f(1) = 2$. Ý c Sai vì tại $x=1$ giới hạn bằng 2 khác $f(1)=0$. Ý d Đúng theo định lí giá trị trung gian vì $g(0) \\cdot g(1) = 1(-1) = -1 < 0$.'
      }
    ]
  },
  {
    id: '11_ch6',
    grade: 11,
    name: 'Chương VI: Hàm số mũ & Hàm số lôgarit',
    lessons: [
      'Bài 18: Luỹ thừa với số mũ thực',
      'Bài 19: Lôgarit',
      'Bài 20: Hàm số mũ và hàm số lôgarit',
      'Bài 21: Phương trình, bất phương trình mũ và lôgarit'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Quy tắc Lôgarit cốt lõi:</div>
          <p class="text-indigo-100 leading-relaxed">• $\\log_a (xy) = \\log_a x + \\log_a y$; $\\log_a \\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y$.</p>
          <p class="text-indigo-100 leading-relaxed">• $\\log_a (x^\\alpha) = \\alpha \\log_a x$; $\\log_{a^\\beta} x = \\frac{1}{\\beta} \\log_a x$; Đổi cơ số: $\\log_a b = \\frac{\\log_c b}{\\log_c a}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Phương trình & Bất phương trình:</div>
          <p class="text-indigo-100 leading-relaxed">• $a^x = b \\Leftrightarrow x = \\log_a b$ ($b > 0$). Nếu $a > 1$: $a^f > a^g \\Leftrightarrow f > g$. Nếu $0 < a < 1$: $a^f > a^g \\Leftrightarrow f < g$.</p>
          <p class="text-indigo-100 leading-relaxed">• $\\log_a f(x) = b \\Leftrightarrow f(x) = a^b$. Luôn chú ý điều kiện xác định $f(x) > 0$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Đổi chiều bất phương trình khi cơ số $0 < a < 1$:</b> Khi $0 < a < 1$, $\\log_a f(x) > \\log_a g(x) \\Leftrightarrow 0 < f(x) < g(x)$ (bắt buộc ĐỔI CHIỀU bất đẳng thức và kẹp điều kiện dương!).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Điều kiện xác định của biểu thức lôgarit:</b> $\\log_a b$ có nghĩa khi và chỉ khi $a > 0, a \\ne 1$ và $b > 0$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch6_1',
        grade: 11,
        chapterId: '11_ch6',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Nghiệm của phương trình $\\log_2 (x - 1) = 3$ là:',
        options: [
          { id: 'A', text: '$x = 9$' },
          { id: 'B', text: '$x = 7$' },
          { id: 'C', text: '$x = 8$' },
          { id: 'D', text: '$x = 10$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Điều kiện: $x - 1 > 0 \\Leftrightarrow x > 1$.',
          'Phương trình tương đương $x - 1 = 2^3 = 8 \\Rightarrow x = 9$.'
        ],
        solution: 'ĐKXĐ: $x > 1$. Ta có $\\log_2 (x - 1) = 3 \\Leftrightarrow x - 1 = 2^3 = 8 \\Leftrightarrow x = 9$ (thỏa mãn ĐK).'
      },
      {
        id: 'q11_ch6_2',
        grade: 11,
        chapterId: '11_ch6',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Tập nghiệm của bất phương trình $2^{2x-1} < 8$ có dạng $(-\\infty; m)$. Tìm giá trị của số $m$.',
        correctAnswer: '2',
        hints: [
          'Đưa về cùng cơ số 2: $8 = 2^3$.',
          'Vì cơ số $2 > 1$, bất phương trình giữ nguyên chiều: $2x - 1 < 3 \\Leftrightarrow 2x < 4 \\Leftrightarrow x < 2$.'
        ],
        solution: 'Ta có $2^{2x-1} < 8 \\Leftrightarrow 2^{2x-1} < 2^3 \\Leftrightarrow 2x - 1 < 3 \\Leftrightarrow 2x < 4 \\Leftrightarrow x < 2$. Do đó $m = 2$.'
      },
      {
        id: 'q11_ch6_3',
        grade: 11,
        chapterId: '11_ch6',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hai số thực dương $a, b$ thỏa mãn $\\log_2 a + 2\\log_2 b = 3$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Biểu thức đã cho tương đương với $\\log_2 (a b^2) = 3$.', isCorrect: true },
          { id: 'b', statement: 'Mối quan hệ giữa $a$ và $b$ là $a b^2 = 8$.', isCorrect: true },
          { id: 'c', statement: 'Nếu $b = 2$ thì giá trị của $a$ bằng $4$.', isCorrect: false },
          { id: 'd', statement: 'Hàm số $y = \\log_2 x$ là hàm số đồng biến trên khoảng $(0; +\\infty)$.', isCorrect: true }
        ],
        hints: [
          '$\\log_2 a + 2\\log_2 b = \\log_2 a + \\log_2 (b^2) = \\log_2 (ab^2)$.',
          '$\\log_2(ab^2) = 3 \\Leftrightarrow ab^2 = 2^3 = 8$.',
          'Nếu $b = 2$ thì $a(2^2) = 8 \\Leftrightarrow 4a = 8 \\Leftrightarrow a = 2$ (không phải 4).',
          'Cơ số $2 > 1$ nên hàm lôgarit đồng biến trên $(0; +\\infty)$.'
        ],
        solution: 'Ý a Đúng vì đưa hệ số 2 vào trong mũ. Ý b Đúng vì $ab^2 = 2^3 = 8$. Ý c Sai vì khi $b=2 \\Rightarrow a = \\frac{8}{4} = 2$. Ý d Đúng vì cơ số $2 > 1$.'
      }
    ]
  },
  {
    id: '11_ch7',
    grade: 11,
    name: 'Chương VII: Quan hệ vuông góc trong không gian',
    lessons: [
      'Bài 22: Hai đường thẳng vuông góc',
      'Bài 23: Đường thẳng vuông góc với mặt phẳng',
      'Bài 24: Phép chiếu vuông góc. Góc giữa đường thẳng và mặt phẳng',
      'Bài 25: Hai mặt phẳng vuông góc',
      'Bài 26: Khoảng cách trong không gian',
      'Bài 27: Thể tích của một số khối đa diện'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Đường thẳng $\\perp$ Mặt phẳng:</div>
          <p class="text-indigo-100 leading-relaxed">• Đường thẳng $d \\perp (\\alpha)$ nếu $d$ vuông góc với hai đường thẳng cắt nhau nằm trong $(\\alpha)$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Định lí ba đường vuông góc:</b> Cho $a \\subset (\\alpha)$ và $b'$ là hình chiếu vuông góc của $b$ lên $(\\alpha)$. Khi đó $a \\perp b \\Leftrightarrow a \\perp b'$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Khoảng cách & Thể tích:</div>
          <p class="text-indigo-100 leading-relaxed">• Thể tích chóp: $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$. Thể tích lăng trụ: $V = S_{\\text{đáy}} \\cdot h$.</p>
          <p class="text-indigo-100 leading-relaxed">• Khoảng cách từ điểm đến mặt phẳng: Kẻ đoạn vuông góc từ điểm tới mặt phẳng.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Chứng minh $d \\perp (\\alpha)$:</b> Bắt buộc phải chỉ ra $d$ vuông góc với HAI ĐƯỜNG THẲNG CẮT NHAU nằm trong $(\\alpha)$ (nếu chỉ vuông góc với 2 đường thẳng song song thì chưa đủ!).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Góc giữa đường thẳng và mặt phẳng:</b> Luôn là góc nhọn hoặc góc vuông $[0^\\circ; 90^\\circ]$ giữa đường thẳng và hình chiếu vuông góc của nó lên mặt phẳng.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch7_1',
        grade: 11,
        chapterId: '11_ch7',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B$ và $SA \\perp (ABC)$. Khẳng định nào sau đây là ĐÚNG?',
        options: [
          { id: 'A', text: '$BC \\perp (SAB)$' },
          { id: 'B', text: '$BC \\perp (SAC)$' },
          { id: 'C', text: '$AB \\perp (SBC)$' },
          { id: 'D', text: '$AC \\perp (SAB)$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Ta có $BC \\perp AB$ (do tam giác $ABC$ vuông tại $B$).',
          'Ta có $BC \\perp SA$ (vì $SA \\perp (ABC)$). Suy ra $BC \\perp (SAB)$.'
        ],
        solution: 'Ta có $\\begin{cases} BC \\perp AB \\\\ BC \\perp SA \\text{ (do } SA \\perp (ABC)) \\end{cases} \\Rightarrow BC \\perp (SAB)$.'
      },
      {
        id: 'q11_ch7_2',
        grade: 11,
        chapterId: '11_ch7',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a\\sqrt{2}$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Đường thẳng $SA$ vuông góc với đường thẳng $CD$.', isCorrect: true },
          { id: 'b', statement: 'Mặt phẳng $(SBC)$ vuông góc với mặt phẳng $(SAB)$.', isCorrect: true },
          { id: 'c', statement: 'Góc giữa đường thẳng $SC$ và mặt phẳng đáy $(ABCD)$ bằng $45^\\circ$.', isCorrect: true },
          { id: 'd', statement: 'Khoảng cách từ điểm $S$ đến mặt phẳng $(ABCD)$ bằng $a$.', isCorrect: false }
        ],
        hints: [
          'Vì $SA \\perp (ABCD)$ nên $SA$ vuông góc với mọi đường trong đáy, kể cả $CD$.',
          '$BC \\perp AB$ và $BC \\perp SA \\Rightarrow BC \\perp (SAB) \\Rightarrow (SBC) \\perp (SAB)$.',
          'Hình chiếu của $SC$ lên $(ABCD)$ là $AC$. $\\tan \\widehat{SCA} = \\frac{SA}{AC} = \\frac{a\\sqrt{2}}{a\\sqrt{2}} = 1 \\Rightarrow \\widehat{SCA} = 45^\\circ$.',
          '$d(S, ABCD) = SA = a\\sqrt{2} \\ne a$.'
        ],
        solution: 'Ý a Đúng vì $SA \\perp (ABCD) \\Rightarrow SA \\perp CD$. Ý b Đúng vì $BC \\perp (SAB)$ mà $BC \\subset (SBC)$. Ý c Đúng vì góc là $\\widehat{SCA}$ có $\\tan = \\frac{a\\sqrt{2}}{a\\sqrt{2}} = 1 \\Rightarrow 45^\\circ$. Ý d Sai vì $d(S, ABCD) = SA = a\\sqrt{2}$.'
      },
      {
        id: 'q11_ch7_3',
        grade: 11,
        chapterId: '11_ch7',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Cho khối chóp tứ giác đều $S.ABCD$ có cạnh đáy bằng $6$ và chiều cao $h = SO = 4$. Thể tích của khối chóp $S.ABCD$ bằng bao nhiêu?',
        correctAnswer: '48',
        hints: [
          'Diện tích đáy hình vuông: $S = 6^2 = 36$.',
          'Thể tích khối chóp: $V = \\frac{1}{3} S \\cdot h = \\frac{1}{3} \\times 36 \\times 4 = 48$.'
        ],
        solution: 'Đáy $ABCD$ là hình vuông cạnh 6 nên diện tích $S_{\\text{đáy}} = 6^2 = 36$. Thể tích khối chóp là $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\cdot 36 \\cdot 4 = 48$.'
      }
    ]
  },
  {
    id: '11_ch8',
    grade: 11,
    name: 'Chương VIII: Các quy tắc tính xác suất',
    lessons: [
      'Bài 28: Biến cố hợp, biến cố giao, biến cố độc lập',
      'Bài 29: Công thức cộng xác suất',
      'Bài 30: Công thức nhân xác suất cho hai biến cố độc lập'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Quy tắc cộng xác suất:</div>
          <p class="text-indigo-100 leading-relaxed">• Biến cố hợp: $P(A \\cup B) = P(A) + P(B) - P(AB)$.</p>
          <p class="text-indigo-100 leading-relaxed">• Nếu $A$ và $B$ xung khắc ($A \\cap B = \\emptyset$): $P(A \\cup B) = P(A) + P(B)$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Quy tắc nhân (Biến cố độc lập):</div>
          <p class="text-indigo-100 leading-relaxed">• $A$ và $B$ là hai biến cố độc lập khi và chỉ khi $P(AB) = P(A) \\cdot P(B)$.</p>
          <p class="text-indigo-100 leading-relaxed">• Nếu $A, B$ độc lập thì các cặp $(A, \\bar{B})$, $(\\bar{A}, B)$, $(\\bar{A}, \\bar{B})$ cũng độc lập.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Biến cố độc lập vs Xung khắc:</b> $A$ và $B$ độc lập khi $P(AB) = P(A) \\cdot P(B)$ (hai phép thử không ảnh hưởng nhau). $A$ và $B$ xung khắc khi $A \\cap B = \\emptyset \\Rightarrow P(AB) = 0$. Đây là 2 khái niệm hoàn toàn khác nhau!</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Phương pháp biến cố đối:</b> Khi gặp câu hỏi "có ít nhất một", hãy luôn tính thông qua biến cố đối $\\bar{A}$ ("không có cái nào"): $P(A) = 1 - P(\\bar{A})$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch8_1',
        grade: 11,
        chapterId: '11_ch8',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Hai xạ thủ bắn mỗi người một viên đạn vào bia một cách độc lập. Xác suất bắn trúng bia của xạ thủ 1 là $0,8$, của xạ thủ 2 là $0,7$. Xác suất để cả hai xạ thủ cùng bắn trúng bia là:',
        options: [
          { id: 'A', text: '$0,56$' },
          { id: 'B', text: '$0,94$' },
          { id: 'C', text: '$0,24$' },
          { id: 'D', text: '$0,15$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Vì hai biến cố độc lập, áp dụng quy tắc nhân: $P(AB) = P(A) \\cdot P(B)$.',
          '$0,8 \\times 0,7 = 0,56$.'
        ],
        solution: 'Do hai xạ thủ bắn độc lập: $P(AB) = P(A) \\cdot P(B) = 0,8 \\times 0,7 = 0,56$.'
      },
      {
        id: 'q11_ch8_2',
        grade: 11,
        chapterId: '11_ch8',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Cho hai biến cố độc lập $A$ và $B$ với $P(A) = 0,6$ và $P(B) = 0,5$. Tính xác suất của biến cố hợp $P(A \\cup B)$.',
        correctAnswer: '0.8',
        hints: [
          '$P(AB) = P(A) \\cdot P(B) = 0,6 \\times 0,5 = 0,3$.',
          '$P(A \\cup B) = P(A) + P(B) - P(AB) = 0,6 + 0,5 - 0,3 = 0,8$.'
        ],
        solution: 'Vì $A$ và $B$ độc lập: $P(AB) = 0,6 \\times 0,5 = 0,3$. Theo công thức cộng: $P(A \\cup B) = 0,6 + 0,5 - 0,3 = 0,8$.'
      },
      {
        id: 'q11_ch8_3',
        grade: 11,
        chapterId: '11_ch8',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Một hộp đựng 4 quả bóng xanh và 6 quả bóng đỏ. Lấy ngẫu nhiên 2 quả bóng liên tiếp (không hoàn lại). Gọi $A$ là biến cố "Quả bóng thứ nhất màu xanh", $B$ là biến cố "Quả bóng thứ hai màu đỏ". Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Xác suất $P(A) = \\frac{2}{5}$.', isCorrect: true },
          { id: 'b', statement: 'Nếu quả bóng thứ nhất màu xanh thì xác suất quả thứ hai màu đỏ là $P(B|A) = \\frac{2}{3}$.', isCorrect: true },
          { id: 'c', statement: 'Xác suất để quả thứ nhất màu xanh và quả thứ hai màu đỏ là $P(AB) = \\frac{4}{15}$.', isCorrect: true },
          { id: 'd', statement: 'Hai biến cố $A$ và $B$ là hai biến cố độc lập.', isCorrect: false }
        ],
        hints: [
          '$P(A) = \\frac{4}{10} = \\frac{2}{5} = 0,4$.',
          'Sau khi lấy 1 quả xanh, hộp còn 9 quả (3 xanh, 6 đỏ) $\\Rightarrow P(B|A) = \\frac{6}{9} = \\frac{2}{3}$.',
          'Theo công thức nhân: $P(AB) = P(A) \\cdot P(B|A) = \\frac{2}{5} \\times \\frac{2}{3} = \\frac{4}{15}$.',
          'Vì việc biến cố $A$ xảy ra làm thay đổi số bi còn lại trong hộp nên $A$ và $B$ phụ thuộc, không độc lập.'
        ],
        solution: 'Ý a Đúng vì $P(A) = \\frac{4}{10} = \\frac{2}{5}$. Ý b Đúng vì sau khi rút 1 bóng xanh, còn 9 quả trong đó có 6 quả đỏ nên $P(B|A) = \\frac{6}{9} = \\frac{2}{3}$. Ý c Đúng vì $P(AB) = \\frac{2}{5} \\cdot \\frac{2}{3} = \\frac{4}{15}$. Ý d Sai vì việc lấy không hoàn lại làm hai biến cố phụ thuộc nhau.'
      }
    ]
  },
  {
    id: '11_ch9',
    grade: 11,
    name: 'Chương IX: Đạo hàm & Ý nghĩa thực tiễn',
    lessons: [
      'Bài 31: Định nghĩa và ý nghĩa của đạo hàm',
      'Bài 32: Các quy tắc tính đạo hàm',
      'Bài 33: Đạo hàm cấp hai'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Ý nghĩa hình học & Vật lí:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Ý nghĩa hình học:</b> Đạo hàm $f'(x_0)$ là hệ số góc của tiếp tuyến tại $M_0(x_0; y_0)$. Phương trình tiếp tuyến: $y = f'(x_0)(x - x_0) + y_0$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Ý nghĩa vật lí:</b> Vận tốc tức thời $v(t) = s'(t)$; Gia tốc tức thời $a(t) = v'(t) = s''(t)$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Bảng đạo hàm hàm số cơ bản:</div>
          <p class="text-indigo-100 leading-relaxed">• $(x^n)' = n x^{n-1}$; $(\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}$; $\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}$.</p>
          <p class="text-indigo-100 leading-relaxed">• $(\\sin x)' = \\cos x$; $(\\cos x)' = -\\sin x$; $(\\tan x)' = \\frac{1}{\\cos^2 x}$.</p>
          <p class="text-indigo-100 leading-relaxed">• Đạo hàm hàm hợp: $[f(u)]' = f'(u) \\cdot u'$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Tiếp tuyến "tại" vs "đi qua":</b> Tiếp tuyến "tại điểm $M_0(x_0; y_0)$" thì $M_0$ là tiếp điểm ($k = f'(x_0)$). Tiếp tuyến "đi qua điểm $A$" thì $A$ chưa chắc là tiếp điểm, phải gọi tiếp điểm $M_0(x_0; y_0)$ rồi giải phương trình $y_A = f'(x_0)(x_A - x_0) + y_0$.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Đạo hàm hàm hợp:</b> Luôn nhớ nhân thêm $u'$ khi tính đạo hàm hàm hợp $[f(u)]' = f'(u) \\cdot u'$ (ví dụ: $(\\sin 2x)' = 2\\cos 2x$, không phải $\\cos 2x$).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q11_ch9_1',
        grade: 11,
        chapterId: '11_ch9',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Hệ số góc của tiếp tuyến với đồ thị hàm số $y = x^3 - 3x + 1$ tại điểm có hoành độ $x_0 = 2$ bằng:',
        options: [
          { id: 'A', text: '$9$' },
          { id: 'B', text: '$3$' },
          { id: 'C', text: '$12$' },
          { id: 'D', text: '$6$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Tính đạo hàm: $y\' = 3x^2 - 3$.',
          'Thay $x = 2$: $k = y\'(2) = 3(2)^2 - 3 = 12 - 3 = 9$.'
        ],
        solution: 'Ta có $y\' = 3x^2 - 3$. Hệ số góc của tiếp tuyến tại $x_0 = 2$ là $k = y\'(2) = 3(2^2) - 3 = 9$.'
      },
      {
        id: 'q11_ch9_2',
        grade: 11,
        chapterId: '11_ch9',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Một vật chuyển động theo phương trình $s(t) = t^3 - 3t^2 + 5t + 2$ ($t$ tính bằng giây, $s$ tính bằng mét). Tính gia tốc của vật tại thời điểm $t = 3$ giây (đơn vị $\\text{m/s}^2$).',
        correctAnswer: '12',
        hints: [
          'Vận tốc $v(t) = s\'(t) = 3t^2 - 6t + 5$.',
          'Gia tốc $a(t) = v\'(t) = s\'\'(t) = 6t - 6$. Thay $t = 3$.'
        ],
        solution: 'Ta có $v(t) = s\'(t) = 3t^2 - 6t + 5$ và gia tốc $a(t) = s\'\'(t) = 6t - 6$. Tại $t = 3$, ta có $a(3) = 6(3) - 6 = 12\\text{ m/s}^2$.'
      },
      {
        id: 'q11_ch9_3',
        grade: 11,
        chapterId: '11_ch9',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hàm số $y = f(x) = x^3 - 3x^2 + 2$. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Đạo hàm của hàm số là $f\'(x) = 3x^2 - 6x$.', isCorrect: true },
          { id: 'b', statement: 'Phương trình $f\'(x) = 0$ có hai nghiệm phân biệt $x = 0$ và $x = 2$.', isCorrect: true },
          { id: 'c', statement: 'Hệ số góc của tiếp tuyến của đồ thị tại điểm có hoành độ $x = 1$ bằng $-3$.', isCorrect: true },
          { id: 'd', statement: 'Đạo hàm cấp hai của hàm số bằng $f\'\'(x) = 6x + 6$.', isCorrect: false }
        ],
        hints: [
          '$f\'(x) = 3x^2 - 6x$.',
          '$3x^2 - 6x = 0 \\Leftrightarrow 3x(x - 2) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$.',
          '$k = f\'(1) = 3(1^2) - 6(1) = -3$.',
          'Đạo hàm cấp hai $f\'\'(x) = (3x^2 - 6x)\' = 6x - 6$, không phải $6x + 6$.'
        ],
        solution: 'Ý a Đúng vì $(x^3 - 3x^2 + 2)\' = 3x^2 - 6x$. Ý b Đúng vì $3x(x-2)=0 \\Leftrightarrow x=0, x=2$. Ý c Đúng vì $f\'(1) = 3-6 = -3$. Ý d Sai vì $f\'\'(x) = 6x - 6$.'
      }
    ]
  }
];
