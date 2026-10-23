import { Chapter } from '../types';

export const GRADE_12_CHAPTERS: Chapter[] = [
  {
    id: '12_ch1',
    grade: 12,
    name: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessons: [
      'Bài 1: Tính đơn điệu và cực trị của hàm số',
      'Bài 2: Giá trị lớn nhất và giá trị nhỏ nhất của hàm số',
      'Bài 3: Đường tiệm cận của đồ thị hàm số',
      'Bài 4: Khảo sát sự biến thiên và vẽ đồ thị của hàm số',
      'Bài 5: Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Tính đơn điệu & Cực trị:</div>
          <p class="text-indigo-100 leading-relaxed">• $f'(x) \\ge 0, \\forall x \\in K$ (bằng 0 tại hữu hạn điểm) $\\Leftrightarrow f(x)$ đồng biến trên $K$.</p>
          <p class="text-indigo-100 leading-relaxed">• Cực trị: Đổi dấu từ $+$ sang $-$ qua $x_0 \\Rightarrow x_0$ là điểm cực đại; đổi dấu từ $-$ sang $+$ qua $x_0 \\Rightarrow x_0$ là điểm cực tiểu.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Đường tiệm cận & Tâm đối xứng:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Tiệm cận đứng:</b> $\\lim_{x \\to x_0^\\pm} f(x) = \\pm\\infty \\Rightarrow x = x_0$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tiệm cận ngang:</b> $\\lim_{x \\to \\pm\\infty} f(x) = y_0 \\Rightarrow y = y_0$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tiệm cận xiên:</b> $\\lim_{x\\to\\pm\\infty} [f(x) - (ax+b)] = 0 \\Rightarrow y = ax+b$ ($a \\ne 0$). Với hàm phân thức bậc hai/bậc nhất: chia đa thức $f(x) = ax+b + \\frac{r}{cx+d}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tâm đối xứng:</b> Đồ thị hàm bậc 3 nhận điểm uốn $I(x_0; y_0)$ (với $f''(x_0)=0$) làm tâm đối xứng.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Bẫy kết luận đồng biến/nghịch biến:</b> Phải viết riêng rẽ: $(-\\infty; 1)$ và $(1; +\\infty)$ hoặc dùng chữ "và". TUYỆT ĐỐI KHÔNG dùng dấu hợp $\\cup$, dấu hiệu $\\setminus$ hay dấu phẩy nối liền.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Phân biệt các khái niệm cực trị:</b> "Điểm cực trị của hàm số" là $x_0$; "Cực trị/Giá trị cực trị" là $y_0 = f(x_0)$; còn "Điểm cực trị của đồ thị hàm số" là tọa độ $M(x_0; y_0)$.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Tiệm cận xiên (GDPT 2018):</b> Hàm phân thức bậc 2 trên bậc 1: $y = \\frac{ax^2+bx+c}{px+q} = Ax + B + \\frac{R}{px+q}$ ($A = \\frac{a}{p} \\ne 0$). Tiệm cận xiên luôn là $y = Ax + B$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q12_1',
        grade: 12,
        chapterId: '12_ch1',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 - 3x + 1}{x - 1}$ là đường thẳng có phương trình:',
        options: [
          { id: 'A', text: '$y = x - 2$' },
          { id: 'B', text: '$y = x + 2$' },
          { id: 'C', text: '$y = x - 3$' },
          { id: 'D', text: '$y = 2x - 1$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Thực hiện phép chia đa thức tử cho mẫu: $x^2 - 3x + 1 = (x - 1)(x - 2) - 1$.',
          'Biểu thức viết lại: $y = (x - 2) - \\frac{1}{x - 1}$.',
          'Khi $x \\to \\pm\\infty$, $\\frac{1}{x-1} \\to 0$, do đó tiệm cận xiên là $y = x - 2$.'
        ],
        solution: `Chia tử cho mẫu: $\\frac{x^2 - 3x + 1}{x - 1} = x - 2 - \\frac{1}{x - 1}$. Khi $x \\to \\pm \\infty$, phần dư $-\\frac{1}{x - 1} \\to 0$. Do đó đường thẳng $y = x - 2$ là tiệm cận xiên của đồ thị.

\`\`\`graph
{
  "title": "Đồ thị hàm số y = (x^2 - 3x + 1)/(x - 1) & Tiệm cận xiên y = x - 2",
  "functionTex": "y = \\\\frac{x^2 - 3x + 1}{x - 1}",
  "expr": "(x^2 - 3*x + 1)/(x - 1)",
  "xDomain": [-4, 6],
  "yDomain": [-6, 6],
  "asymptotes": [
    {"type": "vertical", "value": 1, "label": "x = 1"},
    {"type": "slant", "value": -2, "slantSlope": 1, "label": "y = x - 2"}
  ],
  "keyPoints": [
    {"x": 0, "y": -1, "label": "(0; -1)"},
    {"x": 2, "y": -1, "label": "CT(2; -1)", "type": "min"}
  ]
}
\`\`\``
      },
      {
        id: 'q12_2',
        grade: 12,
        chapterId: '12_ch1',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Tìm giá trị nhỏ nhất của hàm số $f(x) = x + \\frac{4}{x}$ trên khoảng $(0; +\\infty)$.',
        correctAnswer: '4',
        hints: [
          'Áp dụng bất đẳng thức Cô-si (AM-GM) cho hai số dương $x$ và $\\frac{4}{x}$.',
          '$x + \\frac{4}{x} \\ge 2\\sqrt{x \\cdot \\frac{4}{x}} = 2\\sqrt{4} = 4$.',
          'Dấu bằng xảy ra khi $x = \\frac{4}{x} \\Leftrightarrow x^2 = 4 \\Leftrightarrow x = 2 > 0$.'
        ],
        solution: 'Với $x > 0$, áp dụng BĐT Cô-si: $x + \\frac{4}{x} \\ge 2\\sqrt{x \\cdot \\frac{4}{x}} = 4$. Dấu đẳng thức xảy ra khi $x = \\frac{4}{x} \\Leftrightarrow x = 2$. Do đó giá trị nhỏ nhất là 4.'
      },
      {
        id: 'q12_3',
        grade: 12,
        chapterId: '12_ch1',
        format: 'true_false_4',
        difficulty: 'Vận dụng cao',
        content: 'Cho hàm số $y = f(x) = x^3 - 3x + 2$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Hàm số đồng biến trên khoảng $(-\\infty; -1)$ và $(1; +\\infty)$.', isCorrect: true },
          { id: 'b', statement: 'Điểm cực đại của đồ thị hàm số là $(-1; 4)$.', isCorrect: true },
          { id: 'c', statement: 'Giá trị cực tiểu của hàm số bằng $2$.', isCorrect: false },
          { id: 'd', statement: 'Đồ thị hàm số nhận điểm $I(0; 2)$ làm tâm đối xứng.', isCorrect: true }
        ],
        hints: [
          'Tính đạo hàm: $y\' = 3x^2 - 3 = 3(x-1)(x+1)$. $y\'=0 \\Leftrightarrow x = \\pm 1$.',
          'Với $x = -1 \\Rightarrow y = (-1)^3 - 3(-1) + 2 = 4$ (Cực đại).',
          'Với $x = 1 \\Rightarrow y = 1 - 3 + 2 = 0$ (Cực tiểu, không phải 2).',
          'Điểm uốn: $y\'\' = 6x = 0 \\Leftrightarrow x = 0 \\Rightarrow y = 2 \\Rightarrow I(0; 2)$ là tâm đối xứng.'
        ],
        solution: `Ta có $y' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$.

\`\`\`bbt
{
  "title": "Bảng biến thiên hàm số y = x^3 - 3x + 2",
  "functionTex": "y = x^3 - 3x + 2",
  "xPoints": ["-\\infty", "-1", "1", "+\\infty"],
  "yPrimeValues": ["+", "0", "-", "0", "+"],
  "arrows": [
    {"fromIndex": 0, "toIndex": 1, "fromLevel": "bottom", "toLevel": "top", "fromLabel": "-\\infty", "toLabel": "4", "direction": "up"},
    {"fromIndex": 1, "toIndex": 2, "fromLevel": "top", "toLevel": "bottom", "fromLabel": "4", "toLabel": "0", "direction": "down"},
    {"fromIndex": 2, "toIndex": 3, "fromLevel": "bottom", "toLevel": "top", "fromLabel": "0", "toLabel": "+\\infty", "direction": "up"}
  ]
}
\`\`\`

**Kết luận từ bảng biến thiên sư phạm:**
- Hàm số đồng biến trên $(-\\infty; -1)$ và $(1; +\\infty)$ (Ý a Đúng).
- Điểm cực đại của đồ thị hàm số là $(-1; 4)$ (Ý b Đúng).
- Giá trị cực tiểu $y_{\\text{CT}} = 0 \\ne 2$ (Ý c Sai).
- Điểm uốn $I(0; 2)$ với $y''(0)=0$ là tâm đối xứng của đồ thị bậc 3 (Ý d Đúng).`
      }
    ]
  },
  {
    id: '12_ch2',
    grade: 12,
    name: 'Chương II: Vectơ & Hệ toạ độ trong không gian',
    lessons: [
      'Bài 6: Vectơ trong không gian',
      'Bài 7: Hệ toạ độ trong không gian',
      'Bài 8: Biểu thức toạ độ của các phép toán vectơ'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Vectơ trong không gian:</div>
          <p class="text-indigo-100 leading-relaxed">• Quy tắc hình hộp: Nếu $ABCD.A'B'C'D'$ là hình hộp thì $\\overrightarrow{AB} + \\overrightarrow{AD} + \\overrightarrow{AA'} = \\overrightarrow{AC'}$.</p>
          <p class="text-indigo-100 leading-relaxed">• Trọng tâm tứ diện $ABCD$: $\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} + \\overrightarrow{GD} = \\vec{0}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Biểu thức toạ độ trong $Oxyz$:</div>
          <p class="text-indigo-100 leading-relaxed">• $\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$; $|\\vec{u}| = \\sqrt{x_1^2 + y_1^2 + z_1^2}$.</p>
          <p class="text-indigo-100 leading-relaxed">• Góc: $\\cos(\\vec{u}, \\vec{v}) = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}| \\cdot |\\vec{v}|} = \\frac{x_1 x_2 + y_1 y_2 + z_1 z_2}{\\sqrt{x_1^2+y_1^2+z_1^2}\\sqrt{x_2^2+y_2^2+z_2^2}}$.</p>
          <p class="text-indigo-100 leading-relaxed">• Tọa độ trung điểm $M$ của $AB$: $x_M = \\frac{x_A+x_B}{2}, y_M = \\frac{y_A+y_B}{2}, z_M = \\frac{z_A+z_B}{2}$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Thứ tự tọa độ trong không gian:</b> Luôn viết đúng thứ tự hoành độ $x$, tung độ $y$, cao độ $z$. Tọa độ vectơ $\\overrightarrow{AB} = (x_B - x_A; y_B - y_A; z_B - z_A)$ (lấy tọa độ điểm sau trừ điểm trước).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Vectơ vuông góc & Cùng phương:</b> $\\vec{u} \\perp \\vec{v} \\Leftrightarrow \\vec{u} \\cdot \\vec{v} = 0 \\Leftrightarrow x_1 x_2 + y_1 y_2 + z_1 z_2 = 0$. Hai vectơ cùng phương: $\\vec{u} = k\\vec{v} \\Leftrightarrow \\frac{x_1}{x_2} = \\frac{y_1}{y_2} = \\frac{z_1}{z_2}$ (khi các mẫu số khác 0).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q12_vect_1',
        grade: 12,
        chapterId: '12_ch2',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{u} = (1; -2; 2)$ và $\\vec{v} = (2; 1; -1)$. Tích vô hướng $\\vec{u} \\cdot \\vec{v}$ bằng:',
        options: [
          { id: 'A', text: '$-2$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$0$' },
          { id: 'D', text: '$-4$' }
        ],
        correctAnswer: 'A',
        hints: [
          '$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$.',
          'Tính: $1(2) + (-2)(1) + 2(-1) = 2 - 2 - 2 = -2$.'
        ],
        solution: 'Ta có $\\vec{u} \\cdot \\vec{v} = 1 \\cdot 2 + (-2) \\cdot 1 + 2 \\cdot (-1) = 2 - 2 - 2 = -2$.'
      },
      {
        id: 'q12_vect_2',
        grade: 12,
        chapterId: '12_ch2',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Trong không gian $Oxyz$, cho hai điểm $A(1; 2; 3)$ và $B(3; 6; 7)$. Tính độ dài đoạn thẳng $AB$.',
        correctAnswer: '6',
        hints: [
          '$\\overrightarrow{AB} = (3-1; 6-2; 7-3) = (2; 4; 4)$.',
          'Độ dài: $AB = \\sqrt{2^2 + 4^2 + 4^2} = \\sqrt{4 + 16 + 16} = \\sqrt{36} = 6$.'
        ],
        solution: 'Ta có $\\overrightarrow{AB} = (2; 4; 4)$. Độ dài đoạn thẳng $AB = \\sqrt{2^2 + 4^2 + 4^2} = \\sqrt{36} = 6$.'
      },
      {
        id: 'q12_vect_3',
        grade: 12,
        chapterId: '12_ch2',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, cho ba điểm $A(1; 0; -2)$, $B(2; 1; -1)$ và $C(1; -2; 2)$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Tọa độ vectơ $\\overrightarrow{AB} = (1; 1; 1)$.', isCorrect: true },
          { id: 'b', statement: 'Độ dài đoạn thẳng $AB$ bằng $\\sqrt{3}$.', isCorrect: true },
          { id: 'c', statement: 'Tích vô hướng $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 0$.', isCorrect: false },
          { id: 'd', statement: 'Tọa độ trung điểm $M$ của đoạn thẳng $BC$ là $\\left(\\frac{3}{2}; -\\frac{1}{2}; \\frac{1}{2}\\right)$.', isCorrect: true }
        ],
        hints: [
          '$\\overrightarrow{AB} = (2-1; 1-0; -1 - (-2)) = (1; 1; 1)$.',
          'Độ dài $AB = \\sqrt{1^2 + 1^2 + 1^2} = \\sqrt{3}$.',
          '$\\overrightarrow{AC} = (0; -2; 4) \\Rightarrow \\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 1(0) + 1(-2) + 1(4) = 2 \\ne 0$.',
          'Trung điểm $M$: $x_M = \\frac{2+1}{2} = 1,5; y_M = \\frac{1-2}{2} = -0,5; z_M = \\frac{-1+2}{2} = 0,5$.'
        ],
        solution: 'Ta có: $\\overrightarrow{AB} = (1; 1; 1)$ (Ý a Đúng). Độ dài $AB = \\sqrt{1^2+1^2+1^2} = \\sqrt{3}$ (Ý b Đúng). $\\overrightarrow{AC} = (0; -2; 4) \\Rightarrow \\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 0 - 2 + 4 = 2 \\ne 0$ (Ý c Sai). Trung điểm $M$ của $BC$ có tọa độ $\\left(\\frac{3}{2}; -\\frac{1}{2}; \\frac{1}{2}\\right)$ (Ý d Đúng).'
      }
    ]
  },
  {
    id: '12_ch3',
    grade: 12,
    name: 'Chương III: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm',
    lessons: [
      'Bài 9: Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm',
      'Bài 10: Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Khoảng biến thiên & Khoảng tứ phân vị (KNTT Chuẩn):</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Mẫu ghép nhóm $k$ nhóm:</b> $[a_1; a_2), [a_2; a_3), \\dots, [a_k; a_{k+1})$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Khoảng biến thiên $R$:</b> Hiệu giữa đầu mút phải của nhóm cuối cùng và đầu mút trái của nhóm đầu tiên: $$R = a_{k+1} - a_1$$</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Khoảng tứ phân vị $\\Delta_Q$:</b> $$\\Delta_Q = Q_3 - Q_1$$ Đo độ phân tán của 50% số liệu chính giữa mẫu.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Phương sai & Độ lệch chuẩn:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Phương sai $s^2$:</b> $$s^2 = \\frac{1}{n} \\sum_{i=1}^k m_i (c_i - \\bar{x})^2 = \\left( \\frac{1}{n} \\sum_{i=1}^k m_i c_i^2 \\right) - (\\bar{x})^2$$</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Độ lệch chuẩn $s$:</b> $$s = \\sqrt{s^2}$$</p>
          <p class="text-indigo-100 leading-relaxed">• Ý nghĩa: $s$ càng nhỏ chứng tỏ các số liệu càng tập trung quanh số trung bình $\\bar{x}$, độ phân tán càng thấp.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Khoảng biến thiên $R$ của mẫu ghép nhóm:</b> Luôn bằng $a_{k+1} - a_1$ (đầu mút phải nhóm cuối trừ đầu mút trái nhóm đầu tiên), TUYỆT ĐỐI KHÔNG lấy hiệu giữa hai giá trị đại diện!</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Độ lệch chuẩn $s$:</b> $s = \\sqrt{s^2}$. Đơn vị của độ lệch chuẩn cùng đơn vị với số liệu ban đầu (khác với phương sai có đơn vị bình phương).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q12_disp_1',
        grade: 12,
        chapterId: '12_ch3',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Ý nghĩa thực tiễn của độ lệch chuẩn $s$ trong mẫu số liệu ghép nhóm là gì?',
        options: [
          { id: 'A', text: 'Đo lường mức độ phân tán của các số liệu xung quanh số trung bình' },
          { id: 'B', text: 'Cho biết giá trị xuất hiện nhiều nhất trong mẫu' },
          { id: 'C', text: 'Chia mẫu số liệu thành 2 phần bằng nhau' },
          { id: 'D', text: 'Là giá trị đại diện lớn nhất của mẫu' }
        ],
        correctAnswer: 'A',
        hints: [
          'Xem định nghĩa các số đo mức độ phân tán trong SGK Toán 12 KNTT.',
          'Độ lệch chuẩn càng nhỏ thì số liệu càng đồng đều và tập trung quanh số trung bình.'
        ],
        solution: 'Độ lệch chuẩn $s$ dùng để đo mức độ phân tán của các số liệu xung quanh số trung bình. $s$ càng nhỏ chứng tỏ số liệu càng tập trung quanh $\\bar{x}$.'
      },
      {
        id: 'q12_disp_2',
        grade: 12,
        chapterId: '12_ch3',
        format: 'short_answer',
        difficulty: 'Thông hiểu',
        content: 'Cho mẫu số liệu ghép nhóm gồm 4 nhóm: $[10; 20), [20; 30), [30; 40), [40; 50)$. Tính khoảng biến thiên $R$ của mẫu số liệu ghép nhóm trên.',
        correctAnswer: '40',
        hints: [
          'Theo công thức SGK Toán 12 Kết Nối Tri Thức: Khoảng biến thiên của mẫu ghép nhóm $R = a_{k+1} - a_1$.',
          'Đầu mút phải của nhóm cuối là 50, đầu mút trái của nhóm đầu là 10.',
          '$R = 50 - 10 = 40$.'
        ],
        solution: 'Theo định nghĩa trong SGK Toán 12 KNTT: Khoảng biến thiên của mẫu số liệu ghép nhóm bằng hiệu giữa đầu mút phải của nhóm cuối cùng và đầu mút trái của nhóm đầu tiên: $R = a_{k+1} - a_1 = 50 - 10 = 40$.'
      },
      {
        id: 'q12_disp_3',
        grade: 12,
        chapterId: '12_ch3',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Khảo sát cân nặng của 40 học sinh được cho bởi bảng sau: $[40; 45): 8$ HS; $[45; 50): 16$ HS; $[50; 55): 12$ HS; $[55; 60): 4$ HS. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Khoảng biến thiên của mẫu số liệu ghép nhóm bằng $R = 20$ kg.', isCorrect: true },
          { id: 'b', statement: 'Giá trị đại diện của nhóm $[45; 50)$ là $47,5$ kg.', isCorrect: true },
          { id: 'c', statement: 'Cỡ mẫu bằng $n = 40$.', isCorrect: true },
          { id: 'd', statement: 'Khoảng tứ phân vị của mẫu số liệu ghép nhóm $\\Delta_Q$ lớn hơn khoảng biến thiên $R$.', isCorrect: false }
        ],
        hints: [
          'Khoảng biến thiên: $R = 60 - 40 = 20$ kg.',
          'Giá trị đại diện: $c = \\frac{45+50}{2} = 47,5$.',
          'Khoảng tứ phân vị luôn nhỏ hơn khoảng biến thiên vì $\\Delta_Q$ chỉ đo độ phân tán của 50% số liệu ở giữa.'
        ],
        solution: 'Ý a Đúng vì $R = 60 - 40 = 20$. Ý b Đúng vì $c_2 = \\frac{45+50}{2} = 47,5$. Ý c Đúng vì tổng tần số là $8+16+12+4 = 40$. Ý d Sai vì $\\Delta_Q \\le R$.'
      }
    ]
  },
  {
    id: '12_ch4',
    grade: 12,
    name: 'Chương IV: Nguyên hàm & Tích phân',
    lessons: [
      'Bài 11: Nguyên hàm',
      'Bài 12: Tích phân',
      'Bài 13: Ứng dụng hình học của tích phân'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Nguyên hàm & Bảng công thức:</div>
          <p class="text-indigo-100 leading-relaxed">• $\\int x^\\alpha dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C$ ($\\alpha \\ne -1$); $\\int \\frac{1}{x} dx = \\ln|x| + C$.</p>
          <p class="text-indigo-100 leading-relaxed">• $\\int e^x dx = e^x + C$; $\\int a^x dx = \\frac{a^x}{\\ln a} + C$.</p>
          <p class="text-indigo-100 leading-relaxed">• $\\int \\cos x dx = \\sin x + C$; $\\int \\sin x dx = -\\cos x + C$.</p>
          <p class="text-indigo-100 leading-relaxed">• Tích phân từng phần: $\\int u dv = uv - \\int v du$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Ứng dụng hình học:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Diện tích hình phẳng:</b> $S = \\int_a^b |f(x) - g(x)| dx$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Thể tích vật thể tròn xoay quanh trục $Ox$:</b> $$V = \\pi \\int_a^b [f(x)]^2 dx$$</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Dấu trị tuyệt đối trong nguyên hàm $1/x$:</b> $\\int \\frac{1}{x} dx = \\ln|x| + C$ (bắt buộc phải có dấu giá trị tuyệt đối $|x|$).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Thể tích tròn xoay:</b> Bắt buộc có hệ số $\\pi$ phía trước: $V = \\pi \\int_a^b [f(x)]^2 dx$. Diện tích hình phẳng $S = \\int_a^b |f(x) - g(x)| dx$ thì KHÔNG có $\\pi$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q12_ch4_1',
        grade: 12,
        chapterId: '12_ch4',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Tích phân $I = \\int_0^1 (3x^2 + 2x) dx$ có giá trị bằng:',
        options: [
          { id: 'A', text: '$2$' },
          { id: 'B', text: '$3$' },
          { id: 'C', text: '$1$' },
          { id: 'D', text: '$5$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Tìm nguyên hàm: $\\int (3x^2 + 2x)dx = x^3 + x^2$.',
          'Thế cận từ 0 đến 1: $(1^3 + 1^2) - (0) = 2$.'
        ],
        solution: 'Ta có $I = \\left[ x^3 + x^2 \\right]_0^1 = (1 + 1) - 0 = 2$.'
      },
      {
        id: 'q12_ch4_2',
        grade: 12,
        chapterId: '12_ch4',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Tính diện tích hình phẳng giới hạn bởi parabol $y = x^2$ và đường thẳng $y = 2x$ (viết kết quả dưới dạng phân số tối giản a/b, ví dụ 4/3).',
        correctAnswer: '4/3',
        hints: [
          'Phương trình hoành độ giao điểm: $x^2 = 2x \\Leftrightarrow x = 0$ hoặc $x = 2$.',
          'Diện tích: $S = \\int_0^2 (2x - x^2) dx = \\left[ x^2 - \\frac{x^3}{3} \\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3}$.'
        ],
        solution: 'Giao điểm là $x = 0$ và $x = 2$. Diện tích $S = \\int_0^2 (2x - x^2) dx = \\left[ x^2 - \\frac{x^3}{3} \\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3}$.'
      },
      {
        id: 'q12_ch4_3',
        grade: 12,
        chapterId: '12_ch4',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Cho hàm số $f(x)$ liên tục trên $\\mathbb{R}$ và thỏa mãn $\\int_0^2 f(x)dx = 4$, $\\int_2^5 f(x)dx = 6$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Tích phân $\\int_0^5 f(x)dx = 10$.', isCorrect: true },
          { id: 'b', statement: 'Tích phân $\\int_0^2 [2f(x) - 3]dx = 2$.', isCorrect: true },
          { id: 'c', statement: 'Nếu $F(x)$ là một nguyên hàm của $f(x)$ thì $F(2) - F(0) = 4$.', isCorrect: true },
          { id: 'd', statement: 'Tích phân $\\int_2^0 f(x)dx = 4$.', isCorrect: false }
        ],
        hints: [
          'Chèn cận: $\\int_0^5 f(x)dx = \\int_0^2 f(x)dx + \\int_2^5 f(x)dx = 4 + 6 = 10$.',
          '$\\int_0^2 [2f(x) - 3]dx = 2(4) - 3(2 - 0) = 8 - 6 = 2$.',
          'Theo công thức Newton - Leibniz: $\\int_0^2 f(x)dx = F(2) - F(0) = 4$.',
          'Đổi cận: $\\int_2^0 f(x)dx = -\\int_0^2 f(x)dx = -4$.'
        ],
        solution: 'Áp dụng tính chất tích phân: Ý a Đúng vì $\\int_0^5 = \\int_0^2 + \\int_2^5 = 4 + 6 = 10$. Ý b Đúng vì $\\int_0^2 [2f(x)-3]dx = 2(4) - 6 = 2$. Ý c Đúng theo định nghĩa tích phân Newton - Leibniz: $F(2) - F(0) = 4$. Ý d Sai vì khi đảo cận, tích phân đổi dấu: $\\int_2^0 f(x)dx = -4$.'
      }
    ]
  },
  {
    id: '12_ch5',
    grade: 12,
    name: 'Chương V: Phương pháp toạ độ trong không gian (Oxyz)',
    lessons: [
      'Bài 14: Phương trình mặt phẳng',
      'Bài 15: Phương trình đường thẳng trong không gian',
      'Bài 16: Công thức tính góc và khoảng cách trong không gian',
      'Bài 17: Phương trình mặt cầu'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Phương trình Mặt phẳng & Mặt cầu:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Mặt phẳng:</b> Qua $M_0(x_0; y_0; z_0)$ có VTPT $\\vec{n}=(A; B; C)$: $A(x-x_0) + B(y-y_0) + C(z-z_0) = 0$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Mặt cầu:</b> Tâm $I(a; b; c)$, bán kính $R$: $(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Khoảng cách từ điểm $M_0$ đến $(\\alpha)$:</b> $d(M_0, \\alpha) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Phương trình Đường thẳng:</div>
          <p class="text-indigo-100 leading-relaxed">• Qua $M_0(x_0; y_0; z_0)$ có VTCP $\\vec{u}=(a; b; c)$:</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tham số:</b> $\\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\\\ z = z_0 + ct \\end{cases}$; <b>Chính tắc:</b> $\\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Tâm mặt cầu từ phương trình khai triển:</b> $x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$ có tâm $I(a; b; c)$ (chia hệ số của $x, y, z$ cho $-2$), bán kính $R = \\sqrt{a^2 + b^2 + c^2 - d}$ (với điều kiện $a^2 + b^2 + c^2 - d > 0$).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Quan hệ vuông góc & Song song:</b> Hai mặt phẳng $(\\alpha) \\perp (\\beta) \\Leftrightarrow \\vec{n}_\\alpha \\cdot \\vec{n}_\\beta = 0$. Nhưng đường thẳng $d \\parallel (\\alpha) \\Leftrightarrow \\vec{u}_d \\cdot \\vec{n}_\\alpha = 0$ (VTCP của đường thẳng vuông góc với VTPT của mặt phẳng!).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q12_ch5_1',
        grade: 12,
        chapterId: '12_ch5',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, mặt phẳng đi qua điểm $M(1; -2; 3)$ và có một vectơ pháp tuyến $\\vec{n} = (2; 1; -1)$ có phương trình là:',
        options: [
          { id: 'A', text: '$2x + y - z + 3 = 0$' },
          { id: 'B', text: '$2x + y - z - 3 = 0$' },
          { id: 'C', text: '$x - 2y + 3z - 3 = 0$' },
          { id: 'D', text: '$2x - y + z - 7 = 0$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Phương trình có dạng $A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$.',
          '$2(x - 1) + 1(y + 2) - 1(z - 3) = 0 \\Leftrightarrow 2x + y - z + 3 = 0$.'
        ],
        solution: 'Phương trình mặt phẳng: $2(x - 1) + 1(y + 2) - 1(z - 3) = 0 \\Leftrightarrow 2x - 2 + y + 2 - z + 3 = 0 \\Leftrightarrow 2x + y - z + 3 = 0$.'
      },
      {
        id: 'q12_ch5_2',
        grade: 12,
        chapterId: '12_ch5',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Trong không gian $Oxyz$, cho mặt cầu $(S): (x-1)^2 + (y+2)^2 + (z-3)^2 = 25$. Khoảng cách từ tâm $I$ của mặt cầu $(S)$ đến mặt phẳng $(P): 2x - 2y + z + 3 = 0$ bằng bao nhiêu?',
        correctAnswer: '4',
        hints: [
          'Tâm mặt cầu là $I(1; -2; 3)$.',
          'Khoảng cách: $d(I, P) = \\frac{|2(1) - 2(-2) + 1(3) + 3|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{|2 + 4 + 3 + 3|}{\\sqrt{9}} = \\frac{12}{3} = 4$.'
        ],
        solution: 'Tâm mặt cầu là $I(1; -2; 3)$. Ta có khoảng cách: $d(I, P) = \\frac{|2(1) - 2(-2) + 3 + 3|}{\\sqrt{2^2 + (-2)^2 + 1^2}} = \\frac{12}{3} = 4$.'
      },
      {
        id: 'q12_ch5_3',
        grade: 12,
        chapterId: '12_ch5',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, cho đường thẳng $d: \\frac{x - 1}{2} = \\frac{y + 1}{-1} = \\frac{z - 2}{3}$ và mặt phẳng $(P): 2x - y + 3z - 5 = 0$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Một vectơ chỉ phương của đường thẳng $d$ là $\\vec{u} = (2; -1; 3)$.', isCorrect: true },
          { id: 'b', statement: 'Điểm $M(1; -1; 2)$ thuộc đường thẳng $d$.', isCorrect: true },
          { id: 'c', statement: 'Vectơ pháp tuyến của mặt phẳng $(P)$ cùng phương với vectơ chỉ phương của đường thẳng $d$.', isCorrect: true },
          { id: 'd', statement: 'Đường thẳng $d$ song song với mặt phẳng $(P)$.', isCorrect: false }
        ],
        hints: [
          'Đọc VTCP từ mẫu số: $\\vec{u} = (2; -1; 3)$.',
          'Thay tọa độ $(1; -1; 2)$ vào PT chính tắc: $\\frac{0}{2} = \\frac{0}{-1} = \\frac{0}{3} = 0$ (thỏa mãn).',
          'VTPT của $(P)$ là $\\vec{n} = (2; -1; 3)$, trùng với $\\vec{u}$ nên cùng phương.',
          'Khi $\\vec{u}$ cùng phương $\\vec{n}$, đường thẳng $d$ vuông góc với $(P)$, không phải song song.'
        ],
        solution: 'Ý a Đúng vì $\\vec{u} = (2; -1; 3)$. Ý b Đúng vì thay $(1; -1; 2)$ vào $d$ thỏa mãn. Ý c Đúng vì $\\vec{n} = (2; -1; 3) = \\vec{u}$. Ý d Sai vì khi $\\vec{u}$ cùng phương $\\vec{n}$ thì đường thẳng $d$ vuông góc với mặt phẳng $(P)$.'
      }
    ]
  },
  {
    id: '12_ch6',
    grade: 12,
    name: 'Chương VI: Xác suất có điều kiện & Công thức Bayes',
    lessons: [
      'Bài 18: Xác suất có điều kiện',
      'Bài 19: Công thức xác suất toàn phần và công thức Bayes'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Xác suất có điều kiện:</div>
          <p class="text-indigo-100 leading-relaxed">• Định nghĩa: $$P(A|B) = \\frac{P(AB)}{P(B)} \\quad (P(B) > 0)$$</p>
          <p class="text-indigo-100 leading-relaxed">• Quy tắc nhân xác suất: $P(AB) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)$.</p>
          <p class="text-indigo-100 leading-relaxed">• Hai biến cố độc lập: $P(A|B) = P(A)$ và $P(B|A) = P(B)$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Công thức Xác suất toàn phần & Bayes:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Xác suất toàn phần:</b> Với hệ đầy đủ $\\{B_1, B_2, \\dots, B_n\\}$:</p>
          <p class="text-indigo-100 leading-relaxed text-center font-bold">$$P(A) = \\sum_{i=1}^n P(B_i) \\cdot P(A|B_i)$$</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Công thức Bayes (đánh giá hậu nghiệm):</b></p>
          <p class="text-indigo-100 leading-relaxed text-center font-bold">$$P(B_k|A) = \\frac{P(B_k) \\cdot P(A|B_k)}{P(A)} = \\frac{P(B_k) \\cdot P(A|B_k)}{\\sum_{i=1}^n P(B_i) P(A|B_i)}$$</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Phân biệt $P(A|B)$ và $P(B|A)$:</b> $P(A|B)$ là xác suất của biến cố $A$ khi biết $B$ ĐÃ XẢY RA ($P(A|B) = \\frac{P(AB)}{P(B)}$). Hai xác suất này có ý nghĩa thực tế và kết quả hoàn toàn khác nhau!</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Mẹo giải Bayes nhanh:</b> Dùng phương pháp sơ đồ hình cây (Tree Diagram) hoặc lập bảng xác suất 2 chiều để tránh nhầm lẫn mẫu số toàn phần $P(A)$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q12_bayes_1',
        grade: 12,
        chapterId: '12_ch6',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hai biến cố $A$ và $B$ thỏa mãn $P(B) = 0,5$ và $P(AB) = 0,2$. Xác suất có điều kiện $P(A|B)$ bằng:',
        options: [
          { id: 'A', text: '$0,4$' },
          { id: 'B', text: '$0,1$' },
          { id: 'C', text: '$0,7$' },
          { id: 'D', text: '$0,25$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Áp dụng công thức xác suất có điều kiện: $P(A|B) = \\frac{P(AB)}{P(B)}$.',
          'Thay số: $\\frac{0,2}{0,5} = 0,4$.'
        ],
        solution: 'Ta có $P(A|B) = \\frac{P(AB)}{P(B)} = \\frac{0,2}{0,5} = 0,4$.'
      },
      {
        id: 'q12_bayes_2',
        grade: 12,
        chapterId: '12_ch6',
        format: 'short_answer',
        difficulty: 'Vận dụng cao',
        content: 'Tỉ lệ người mắc bệnh X trong một cộng đồng là $2\\%$. Một xét nghiệm chẩn đoán bệnh X có độ nhạy $95\\%$ (người có bệnh xét nghiệm dương tính) và tỉ lệ dương tính giả là $5\\%$ (người không bệnh xét nghiệm dương tính). Một người được chọn ngẫu nhiên có kết quả xét nghiệm dương tính. Xác suất thực sự người đó bị bệnh X là bao nhiêu phần trăm (làm tròn kết quả đến hàng phần mười, ví dụ 28.0)?',
        correctAnswer: '28.0',
        hints: [
          'Gọi $B$ là biến cố "Người đó bị bệnh", $P(B) = 0,02 \\Rightarrow P(\\bar{B}) = 0,98$.',
          'Gọi $A$ là biến cố "Xét nghiệm dương tính". Ta có $P(A|B) = 0,95$ và $P(A|\\bar{B}) = 0,05$.',
          'Xác suất toàn phần $P(A) = 0,02(0,95) + 0,98(0,05) = 0,019 + 0,049 = 0,068$.',
          'Xác suất Bayes: $P(B|A) = \\frac{0,019}{0,068} \\approx 0,2794 = 27,94\\% \\approx 28,0\\%$.'
        ],
        solution: 'Theo công thức xác suất toàn phần: $P(A) = P(B)P(A|B) + P(\\bar{B})P(A|\\bar{B}) = 0,02(0,95) + 0,98(0,05) = 0,068$. Áp dụng công thức Bayes: $P(B|A) = \\frac{P(B)P(A|B)}{P(A)} = \\frac{0,019}{0,068} \\approx 0,2794 \\approx 28,0\\%$.'
      },
      {
        id: 'q12_bayes_3',
        grade: 12,
        chapterId: '12_ch6',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hai biến cố $A$ và $B$ có $P(A) = 0,4$, $P(B) = 0,5$ và $P(A|B) = 0,6$. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Xác suất của biến cố giao $P(AB) = 0,3$.', isCorrect: true },
          { id: 'b', statement: 'Xác suất có điều kiện $P(B|A) = 0,75$.', isCorrect: true },
          { id: 'c', statement: 'Hai biến cố $A$ và $B$ là hai biến cố độc lập.', isCorrect: false },
          { id: 'd', statement: 'Xác suất của biến cố hợp $P(A \\cup B) = 0,6$.', isCorrect: true }
        ],
        hints: [
          'Quy tắc nhân xác suất: $P(AB) = P(B) \\cdot P(A|B) = 0,5 \\times 0,6 = 0,3$.',
          'Định nghĩa $P(B|A) = \\frac{P(AB)}{P(A)} = \\frac{0,3}{0,4} = 0,75$.',
          'Kiểm tra độc lập: $P(A) \\cdot P(B) = 0,4 \\times 0,5 = 0,2 \\ne 0,3 = P(AB)$ nên không độc lập.',
          'Công thức cộng: $P(A \\cup B) = P(A) + P(B) - P(AB) = 0,4 + 0,5 - 0,3 = 0,6$.'
        ],
        solution: 'Ta có: $P(AB) = P(B)P(A|B) = 0,5 \\cdot 0,6 = 0,3$ (Ý a Đúng). $P(B|A) = \\frac{P(AB)}{P(A)} = \\frac{0,3}{0,4} = 0,75$ (Ý b Đúng). Vì $P(AB) = 0,3 \\ne P(A)P(B) = 0,2$ nên hai biến cố không độc lập (Ý c Sai). $P(A \\cup B) = 0,4 + 0,5 - 0,3 = 0,6$ (Ý d Đúng).'
      }
    ]
  }
];
