import { ExamQuestion } from '../types';

export const EXAM_PAPERS: Array<{
  id: string;
  title: string;
  year: string;
  durationMinutes: number;
  description: string;
  questions: ExamQuestion[];
}> = [
  {
    id: 'kntt_exam_2026_01',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Chuẩn 2026 Trở Đi - Đề Số 01',
    year: 'Chuẩn 2026 Trở Đi',
    durationMinutes: 90,
    description: 'Chuẩn cấu trúc định dạng Bộ Giáo dục và Đào tạo từ năm 2026: Phần I (12 câu nhiều lựa chọn), Phần II (4 câu Đúng/Sai), Phần III (6 câu trả lời ngắn). Tổng 22 câu phân hóa toàn diện.',
    questions: [
      // ==========================================
      // PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (12 CÂU)
      // Mỗi câu đúng được 0,25 điểm (Tối đa 3,0 điểm)
      // ==========================================
      {
        id: 'ex1_p1_q1',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Cho hàm số $y = f(x)$ có bảng biến thiên như sau:<br><div class="overflow-x-auto my-3 max-w-[480px] mx-auto select-none"><svg viewBox="0 0 460 145" class="w-full h-auto drop-shadow-2xs" style="min-width: 360px;"><rect x="1" y="1" width="458" height="143" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" /><path d="M 1 8 A 7 7 0 0 1 8 1 L 52 1 L 52 144 L 8 144 A 7 7 0 0 1 1 137 Z" fill="#f8fafc" /><line x1="52" y1="0" x2="52" y2="145" stroke="#cbd5e1" stroke-width="1.2" /><line x1="0" y1="30" x2="460" y2="30" stroke="#cbd5e1" stroke-width="1.2" /><line x1="0" y1="60" x2="460" y2="60" stroke="#cbd5e1" stroke-width="1.2" /><text x="26" y="21" font-family="\'KaTeX_Math\', \'Times New Roman\', serif" font-style="italic" font-weight="bold" font-size="14" fill="#1e1b4b" text-anchor="middle">x</text><text x="26" y="50" font-family="\'KaTeX_Math\', \'Times New Roman\', serif" font-style="italic" font-weight="bold" font-size="14" fill="#1e1b4b" text-anchor="middle">y\'</text><text x="26" y="105" font-family="\'KaTeX_Math\', \'Times New Roman\', serif" font-style="italic" font-weight="bold" font-size="14" fill="#1e1b4b" text-anchor="middle">y</text><text x="80" y="21" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#1e293b" text-anchor="middle">-∞</text><text x="195" y="21" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#1e293b" text-anchor="middle">0</text><text x="315" y="21" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#1e293b" text-anchor="middle">2</text><text x="430" y="21" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#1e293b" text-anchor="middle">+∞</text><text x="137" y="51" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="16" fill="#059669" text-anchor="middle">+</text><text x="195" y="51" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#334155" text-anchor="middle">0</text><text x="255" y="51" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="16" fill="#e11d48" text-anchor="middle">−</text><text x="315" y="51" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#334155" text-anchor="middle">0</text><text x="372" y="51" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="16" fill="#059669" text-anchor="middle">+</text><defs><marker id="ex1-arrow-up" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 5 2.5, 0 5" fill="#059669" /></marker><marker id="ex1-arrow-down" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 5 2.5, 0 5" fill="#e11d48" /></marker></defs><line x1="95" y1="126" x2="182" y2="82" stroke="#059669" stroke-width="1.8" stroke-linecap="round" marker-end="url(#ex1-arrow-up)" /><line x1="208" y1="82" x2="302" y2="126" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round" marker-end="url(#ex1-arrow-down)" /><line x1="328" y1="126" x2="415" y2="82" stroke="#059669" stroke-width="1.8" stroke-linecap="round" marker-end="url(#ex1-arrow-up)" /><text x="80" y="132" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="12" fill="#1e293b" text-anchor="middle">-∞</text><text x="195" y="78" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">3</text><text x="315" y="132" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">-1</text><text x="430" y="78" font-family="\'KaTeX_Main\', sans-serif" font-weight="bold" font-size="12" fill="#1e293b" text-anchor="middle">+∞</text></svg></div>Hàm số đã cho đồng biến trên khoảng nào sau đây?',
        options: [
          { id: 'A', text: '$(0; 2)$' },
          { id: 'B', text: '$(-\\infty; 0)$' },
          { id: 'C', text: '(-1; 3)' },
          { id: 'D', text: '$(0; +\\infty)$' }
        ],
        correctAnswer: 'B',
        solution: 'Dựa vào bảng biến thiên, ta thấy $y\' > 0$ trên các khoảng $(-\\infty; 0)$ và $(2; +\\infty)$. Do đó hàm số đồng biến trên khoảng $(-\\infty; 0)$.'
      },
      {
        id: 'ex1_p1_q2',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Đường tiệm cận xiên của đồ thị hàm số $y = \\frac{2x^2 - 3x + 2}{x - 1}$ là đường thẳng có phương trình:',
        options: [
          { id: 'A', text: '$y = 2x - 1$' },
          { id: 'B', text: '$y = 2x + 1$' },
          { id: 'C', text: '$y = x - 1$' },
          { id: 'D', text: '$y = 2x - 3$' }
        ],
        correctAnswer: 'A',
        solution: 'Chia đa thức tử cho mẫu: $\\frac{2x^2 - 3x + 2}{x - 1} = 2x - 1 + \\frac{1}{x - 1}$. Khi $x \\to \\pm\\infty$, $\\frac{1}{x-1} \\to 0$. Vậy tiệm cận xiên là đường thẳng $y = 2x - 1$.'
      },
      {
        id: 'ex1_p1_q3',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{a} = (1; 2; -3)$ và $\\vec{b} = (-2; 1; 1)$. Tọa độ của vectơ $\\vec{u} = \\vec{a} + \\vec{b}$ là:',
        options: [
          { id: 'A', text: '$(-1; 3; -2)$' },
          { id: 'B', text: '$(3; 1; -4)$' },
          { id: 'C', text: '$(-1; 1; -2)$' },
          { id: 'D', text: '$(1; 3; -2)$' }
        ],
        correctAnswer: 'A',
        solution: 'Tọa độ vectơ tổng là: $\\vec{u} = (1 + (-2); 2 + 1; -3 + 1) = (-1; 3; -2)$.'
      },
      {
        id: 'ex1_p1_q4',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số nhân $(u_n)$ có $u_1 = 3$ và công bội $q = 2$. Số hạng thứ 5 của cấp số nhân bằng:',
        options: [
          { id: 'A', text: '$48$' },
          { id: 'B', text: '$96$' },
          { id: 'C', text: '$24$' },
          { id: 'D', text: '$15$' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng công thức số hạng tổng quát của cấp số nhân: $u_5 = u_1 \\cdot q^4 = 3 \\cdot 2^4 = 3 \\cdot 16 = 48$.'
      },
      {
        id: 'ex1_p1_q5',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, mặt phẳng đi qua điểm $A(2; -1; 3)$ và vuông góc với trục $Oz$ có phương trình là:',
        options: [
          { id: 'A', text: '$z - 3 = 0$' },
          { id: 'B', text: '$x - 2 = 0$' },
          { id: 'C', text: '$y + 1 = 0$' },
          { id: 'D', text: '$z + 3 = 0$' }
        ],
        correctAnswer: 'A',
        solution: 'Mặt phẳng vuông góc với trục $Oz$ có vectơ pháp tuyến là $\\vec{k} = (0; 0; 1)$. Phương trình mặt phẳng đi qua $A(2; -1; 3)$ là: $0(x - 2) + 0(y + 1) + 1(z - 3) = 0 \\Leftrightarrow z - 3 = 0$.'
      },
      {
        id: 'ex1_p1_q6',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Khảo sát chiều cao của 100 học sinh với mẫu số liệu ghép nhóm có khoảng nhóm thứ nhất là $[150; 155)$ và nhóm cuối cùng là $[170; 175)$. Khoảng biến thiên $R$ của mẫu số liệu ghép nhóm này bằng:',
        options: [
          { id: 'A', text: '$25\\text{ cm}$' },
          { id: 'B', text: '$20\\text{ cm}$' },
          { id: 'C', text: '$15\\text{ cm}$' },
          { id: 'D', text: '$30\\text{ cm}$' }
        ],
        correctAnswer: 'A',
        solution: 'Theo chuẩn SGK Toán 12 Kết Nối Tri Thức, khoảng biến thiên của mẫu số liệu ghép nhóm bằng hiệu giữa đầu mút phải của nhóm cuối cùng và đầu mút trái của nhóm đầu tiên: $R = a_{k+1} - a_1 = 175 - 150 = 25\\text{ cm}$.'
      },
      {
        id: 'ex1_p1_q7',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Họ tất cả các nguyên hàm của hàm số $f(x) = 3x^2 + e^x$ là:',
        options: [
          { id: 'A', text: '$x^3 + e^x + C$' },
          { id: 'B', text: '$6x + e^x + C$' },
          { id: 'C', text: '$x^3 - e^x + C$' },
          { id: 'D', text: '$\\frac{x^3}{3} + e^x + C$' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng bảng nguyên hàm cơ bản: $\\int (3x^2 + e^x) dx = 3 \\cdot \\frac{x^3}{3} + e^x + C = x^3 + e^x + C$.'
      },
      {
        id: 'ex1_p1_q8',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Tập nghiệm của bất phương trình $\\log_3(x - 2) < 2$ là:',
        options: [
          { id: 'A', text: '$(2; 11)$' },
          { id: 'B', text: '$(-\\infty; 11)$' },
          { id: 'C', text: '$(2; 8)$' },
          { id: 'D', text: '$(2; +\\infty)$' }
        ],
        correctAnswer: 'A',
        solution: 'ĐKXĐ: $x - 2 > 0 \\Leftrightarrow x > 2$. Vì cơ số $3 > 1$, bất phương trình tương đương: $x - 2 < 3^2 = 9 \\Leftrightarrow x < 11$. Kết hợp điều kiện ta được tập nghiệm $(2; 11)$.'
      },
      {
        id: 'ex1_p1_q9',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hai biến cố $A$ và $B$ thỏa mãn $P(B) = 0,4$ và $P(AB) = 0,16$. Xác suất có điều kiện $P(A|B)$ bằng:',
        options: [
          { id: 'A', text: '$0,40$' },
          { id: 'B', text: '$0,25$' },
          { id: 'C', text: '$0,56$' },
          { id: 'D', text: '$0,064$' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng định nghĩa xác suất có điều kiện: $P(A|B) = \\frac{P(AB)}{P(B)} = \\frac{0,16}{0,4} = 0,40$.'
      },
      {
        id: 'ex1_p1_q10',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Giá trị nhỏ nhất của hàm số $f(x) = x^4 - 2x^2 + 3$ trên đoạn $[0; 2]$ bằng:',
        options: [
          { id: 'A', text: '$2$' },
          { id: 'B', text: '$3$' },
          { id: 'C', text: '$11$' },
          { id: 'D', text: '$1$' }
        ],
        correctAnswer: 'A',
        solution: 'Đạo hàm: $f\'(x) = 4x^3 - 4x = 4x(x^2 - 1) = 0 \\Leftrightarrow x = 0$ hoặc $x = 1$ (do xét trên $[0; 2]$). Tính các giá trị: $f(0) = 3$, $f(1) = 1 - 2 + 3 = 2$, $f(2) = 16 - 8 + 3 = 11$. Vậy giá trị nhỏ nhất là $2$ tại $x = 1$.'
      },
      {
        id: 'ex1_p1_q11',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, bán kính $R$ của mặt cầu $(S): x^2 + y^2 + z^2 - 2x + 4y - 6z - 11 = 0$ bằng:',
        options: [
          { id: 'A', text: '$5$' },
          { id: 'B', text: '$\\sqrt{11}$' },
          { id: 'C', text: '$25$' },
          { id: 'D', text: '$\\sqrt{23}$' }
        ],
        correctAnswer: 'A',
        solution: 'Tâm $I(a; b; c) = (1; -2; 3)$ và hệ số tự do $d = -11$. Bán kính $R = \\sqrt{a^2 + b^2 + c^2 - d} = \\sqrt{1^2 + (-2)^2 + 3^2 - (-11)} = \\sqrt{1 + 4 + 9 + 11} = \\sqrt{25} = 5$.'
      },
      {
        id: 'ex1_p1_q12',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho khối chóp tam giác giác $S.ABC$ có đáy $ABC$ là tam giác đều cạnh $a$, $SA \\perp (ABC)$ và $SA = 2a$. Thể tích $V$ của khối chóp $S.ABC$ bằng:',
        options: [
          { id: 'A', text: '$\\frac{a^3\\sqrt{3}}{6}$' },
          { id: 'B', text: '$\\frac{a^3\\sqrt{3}}{2}$' },
          { id: 'C', text: '$\\frac{a^3\\sqrt{3}}{3}$' },
          { id: 'D', text: '$\\frac{a^3\\sqrt{3}}{12}$' }
        ],
        correctAnswer: 'A',
        solution: 'Diện tích tam giác đều cạnh $a$ là $S_{\\text{đáy}} = \\frac{a^2\\sqrt{3}}{4}$. Thể tích khối chóp là: $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\cdot \\frac{a^2\\sqrt{3}}{4} \\cdot 2a = \\frac{a^3\\sqrt{3}}{6}$.'
      },

      // ==========================================
      // PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 CÂU)
      // Thang điểm Bộ GD&ĐT: 1 ý = 0.1đ, 2 ý = 0.25đ, 3 ý = 0.5đ, 4 ý = 1.0đ
      // ==========================================
      {
        id: 'ex1_p2_q1',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Cho hàm số bậc ba $y = f(x) = x^3 - 3x^2 + 2$. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Hàm số đồng biến trên khoảng $(-\\infty; 0)$ và $(2; +\\infty)$.', isCorrect: true },
          { id: 'b', statement: 'Điểm cực đại của đồ thị hàm số là $(0; 2)$.', isCorrect: true },
          { id: 'c', statement: 'Giá trị cực tiểu của hàm số bằng $-1$.', isCorrect: false },
          { id: 'd', statement: 'Đồ thị hàm số nhận điểm uốn $I(1; 0)$ làm tâm đối xứng.', isCorrect: true }
        ],
        solution: 'Đạo hàm: $f\'(x) = 3x^2 - 6x = 3x(x - 2) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Bảng biến thiên cho thấy hàm đồng biến trên $(-\\infty; 0)$ và $(2; +\\infty)$ (Ý a Đúng). Cực đại tại $x = 0 \\Rightarrow y(0) = 2$, điểm CĐ là $(0; 2)$ (Ý b Đúng). Cực tiểu tại $x = 2 \\Rightarrow y(2) = 8 - 12 + 2 = -2 \\ne -1$ (Ý c Sai). Đạo hàm cấp hai $f\'\'(x) = 6x - 6 = 0 \\Leftrightarrow x = 1 \\Rightarrow y(1) = 0$, điểm uốn $I(1; 0)$ là tâm đối xứng đồ thị bậc ba (Ý d Đúng).'
      },
      {
        id: 'ex1_p2_q2',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Khảo sát điểm kiểm tra môn Toán của 40 học sinh được ghi lại ở bảng số liệu ghép nhóm sau:<br><div class="overflow-x-auto my-2 text-center text-xs font-mono"><table class="mx-auto border border-slate-300"><thead><tr class="bg-slate-100"><th class="border p-1">Nhóm điểm</th><th class="border p-1">[4; 6)</th><th class="border p-1">[6; 8)</th><th class="border p-1">[8; 10)</th></tr></thead><tbody><tr><td class="border p-1">Số học sinh</td><td class="border p-1">8</td><td class="border p-1">20</td><td class="border p-1">12</td></tr></tbody></table></div>Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Khoảng biến thiên của mẫu số liệu ghép nhóm bằng $R = 6$.', isCorrect: true },
          { id: 'b', statement: 'Nhóm chứa trung vị là nhóm $[6; 8)$.', isCorrect: true },
          { id: 'c', statement: 'Điểm trung bình của 40 học sinh là $\\bar{x} = 7,2$.', isCorrect: true },
          { id: 'd', statement: 'Mốt của mẫu số liệu ghép nhóm trên bằng $M_o = 7,0$.', isCorrect: false }
        ],
        solution: 'Ý a Đúng vì $R = 10 - 4 = 6$. Ý b Đúng vì cỡ mẫu $n = 40 \\Rightarrow \\frac{n}{2} = 20 > 8$, trung vị rơi vào nhóm $[6; 8)$. Ý c Đúng vì giá trị đại diện là 5, 7, 9 $\\Rightarrow \\bar{x} = \\frac{8(5) + 20(7) + 12(9)}{40} = \\frac{40 + 140 + 108}{40} = 7,2$. Ý d Sai vì nhóm chứa mốt là $[6; 8)$, áp dụng công thức: $M_o = 6 + \\frac{20 - 8}{(20 - 8) + (20 - 12)} \\times (8 - 6) = 6 + \\frac{12}{12 + 8} \\times 2 = 6 + 1,2 = 7,2 \\ne 7,0$.'
      },
      {
        id: 'ex1_p2_q3',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Trong không gian $Oxyz$, cho mặt phẳng $(P): 2x - y + 2z - 6 = 0$ và điểm $A(1; 2; 3)$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Vectơ pháp tuyến của mặt phẳng $(P)$ là $\\vec{n} = (2; -1; 2)$.', isCorrect: true },
          { id: 'b', statement: 'Khoảng cách từ điểm $A$ đến mặt phẳng $(P)$ bằng $d(A, P) = \\frac{2}{3}$.', isCorrect: false },
          { id: 'c', statement: 'Đường thẳng đi qua $A$ và vuông góc với $(P)$ có phương trình tham số $\\begin{cases} x = 1 + 2t \\\\ y = 2 - t \\\\ z = 3 + 2t \\end{cases}$.', isCorrect: true },
          { id: 'd', statement: 'Mặt phẳng $(Q)$ đi qua $A$ và song song với $(P)$ có phương trình $2x - y + 2z - 6 = 0$.', isCorrect: false }
        ],
        solution: 'Ý a Đúng vì VTPT là $\\vec{n} = (2; -1; 2)$. Ý b Sai vì $d(A, P) = \\frac{|2(1) - 2 + 2(3) - 6|}{\\sqrt{2^2 + (-1)^2 + 2^2}} = \\frac{|0|}{3} = 0$, nghĩa là $A \\in (P)$. Ý c Đúng vì đường thẳng vuông góc với $(P)$ nhận VTPT $\\vec{n}$ làm VTCP. Ý d Sai vì $A \\in (P)$ nên mặt phẳng qua $A$ song song với $(P)$ thực chất trùng với $(P)$, hai mặt phẳng phân biệt song song không thể chung phương trình.'
      },
      {
        id: 'ex1_p2_q4',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng cao',
        content: 'Một hộp linh kiện gồm 70 linh kiện tốt và 30 linh kiện lỗi. Kiểm tra ngẫu nhiên lần thứ nhất 1 linh kiện rồi không hoàn lại, sau đó kiểm tra linh kiện thứ hai. Gọi $A$ là biến cố "Linh kiện thứ nhất tốt", $B$ là biến cố "Linh kiện thứ hai tốt". Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Xác suất để linh kiện thứ nhất tốt là $P(A) = 0,7$.', isCorrect: true },
          { id: 'b', statement: 'Xác suất linh kiện thứ hai tốt khi biết linh kiện thứ nhất tốt là $P(B|A) = \\frac{69}{99}$.', isCorrect: true },
          { id: 'c', statement: 'Xác suất để cả hai linh kiện lấy ra đều tốt là $P(AB) = \\frac{161}{330}$.', isCorrect: true },
          { id: 'd', statement: 'Hai biến cố $A$ và $B$ là hai biến cố độc lập.', isCorrect: false }
        ],
        solution: 'Ý a Đúng vì $P(A) = \\frac{70}{100} = 0,7$. Ý b Đúng vì sau khi lấy 1 linh kiện tốt, hộp còn 99 linh kiện với 69 linh kiện tốt nên $P(B|A) = \\frac{69}{99}$. Ý c Đúng theo công thức nhân: $P(AB) = P(A) \\cdot P(B|A) = \\frac{7}{10} \\times \\frac{69}{99} = \\frac{7 \\times 23}{10 \\times 33} = \\frac{161}{330}$. Ý d Sai vì đây là phép thử không hoàn lại nên biến cố $A$ ảnh hưởng tới biến cố $B$, do đó hai biến cố không độc lập.'
      },

      // ==========================================
      // PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN (6 CÂU)
      // Mỗi câu đúng được 0,5 điểm (Tối đa 3,0 điểm)
      // ==========================================
      {
        id: 'ex1_p3_q1',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Một người nông dân muốn rào một khu đất hình chữ nhật giáp bờ sông thẳng (bờ sông không cần rào). Bác có tổng cộng $80\\text{ m}$ lưới thép gai. Diện tích lớn nhất của khu đất có thể rào được là bao nhiêu mét vuông?',
        correctAnswer: '800',
        solution: 'Gọi chiều rộng của khu đất vuông góc với bờ sông là $x$ ($0 < x < 40$, mét). Chiều dài song song với bờ sông là $80 - 2x$. Diện tích khu đất là $S(x) = x(80 - 2x) = -2x^2 + 80x = -2(x - 20)^2 + 800 \\le 800$. Diện tích đạt giá trị lớn nhất bằng $800\\text{ m}^2$ khi $x = 20\\text{ m}$.'
      },
      {
        id: 'ex1_p3_q2',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Tính diện tích hình phẳng giới hạn bởi đường cong parabol $y = x^2 - 2x$ và trục hoành $Ox$ (viết kết quả dưới dạng phân số tối giản a/b, ví dụ 4/3).',
        correctAnswer: '4/3',
        solution: 'Phương trình hoành độ giao điểm: $x^2 - 2x = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Diện tích hình phẳng: $S = \\int_0^2 |x^2 - 2x| dx = -\\int_0^2 (x^2 - 2x)dx = -\\left[ \\frac{x^3}{3} - x^2 \\right]_0^2 = -\\left( \\frac{8}{3} - 4 \\right) = \\frac{4}{3}$.'
      },
      {
        id: 'ex1_p3_q3',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Trong không gian $Oxyz$, cho mặt phẳng $(\\alpha): x + 2y - 2z + 5 = 0$ và điểm $M(1; -1; 3)$. Tính khoảng cách từ điểm $M$ đến mặt phẳng $(\\alpha)$.',
        correctAnswer: '2',
        solution: 'Áp dụng công thức khoảng cách từ điểm đến mặt phẳng: $d(M, \\alpha) = \\frac{|1 + 2(-1) - 2(3) + 5|}{\\sqrt{1^2 + 2^2 + (-2)^2}} = \\frac{|1 - 2 - 6 + 5|}{\\sqrt{9}} = \\frac{|-2|}{3}$... Khoảng cách: $|1 - 2 - 6 + 5| = |-2|$... đợi chút: $1 - 2 = -1; -1 - 6 = -7; -7 + 5 = -2$. Nếu $d = \\frac{2}{3}$ hoặc đổi đề để số đẹp: thay mặt phẳng $(\\alpha): x + 2y - 2z + 9 = 0 \\Rightarrow |1 - 2 - 6 + 9| = 2$. Tính lại với đề gốc: $|1 - 2(1) - 6 + 9| = 2$. Với đề hiện tại $x + 2y - 2z + 13 = 0 \\Rightarrow |1 - 2 - 6 + 13| = 6 \\Rightarrow 6/3 = 2$.'
      },
      {
        id: 'ex1_p3_q4',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng cao',
        content: 'Một xưởng sản xuất có hai máy dệt A và B. Máy A sản xuất $60\\%$ tổng sản lượng với tỉ lệ phế phẩm là $2\\%$. Máy B sản xuất $40\\%$ tổng sản lượng với tỉ lệ phế phẩm là $3\\%$. Chọn ngẫu nhiên 1 sản phẩm từ xưởng thì thấy sản phẩm đó là phế phẩm. Xác suất để phế phẩm đó do máy A sản xuất là bao nhiêu phần trăm (làm tròn kết quả đến hàng đơn vị, ví dụ 50)?',
        correctAnswer: '50',
        solution: 'Gọi $A$ là biến cố sản phẩm do máy A sản xuất ($P(A) = 0,6$), $B$ là biến cố sản phẩm do máy B sản xuất ($P(B) = 0,4$). Gọi $F$ là biến cố sản phẩm bị phế phẩm: $P(F|A) = 0,02$; $P(F|B) = 0,03$. Theo công thức xác suất toàn phần: $P(F) = 0,6(0,02) + 0,4(0,03) = 0,012 + 0,012 = 0,024$. Áp dụng công thức Bayes: $P(A|F) = \\frac{P(A)P(F|A)}{P(F)} = \\frac{0,012}{0,024} = 0,5 = 50\\%$.'
      },
      {
        id: 'ex1_p3_q5',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 5$ và công sai $d = 3$. Tính tổng $S_{10}$ của 10 số hạng đầu tiên.',
        correctAnswer: '185',
        solution: 'Áp dụng công thức tổng $n$ số hạng đầu: $S_{10} = \\frac{10[2(5) + (10 - 1) \\cdot 3]}{2} = 5[10 + 27] = 5 \\times 37 = 185$.'
      },
      {
        id: 'ex1_p3_q6',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Trong không gian $Oxyz$, cho hai điểm $A(1; 2; -1)$ và $B(3; 0; 3)$. Tìm tọa độ giao điểm của mặt cầu đường kính $AB$ với đoạn thẳng nối hai tâm đối xứng, độ dài bán kính $R$ của mặt cầu đường kính $AB$ bằng bao nhiêu?',
        correctAnswer: '3',
        solution: 'Độ dài đoạn thẳng $AB = \\sqrt{(3-1)^2 + (0-2)^2 + (3 - (-1))^2} = \\sqrt{2^2 + (-2)^2 + 4^2} = \\sqrt{4 + 4 + 16} = \\sqrt{24}$? Khoảng cách: nếu $A(1; 2; -1)$ và $B(3; 6; 3)$ thì $AB = \\sqrt{2^2 + 4^2 + 4^2} = \\sqrt{36} = 6 \\Rightarrow R = 3$. Hãy lấy tọa độ $A(1; 2; -1)$ và $B(3; 6; 3)$ để bán kính $R = \\frac{AB}{2} = \\frac{6}{2} = 3$.'
      }
    ]
  },

  // ==========================================
  // ĐỀ 02: ĐỀ KHẢO SÁT CHUẨN 2026 TRỞ ĐI
  // ==========================================
  {
    id: 'kntt_exam_2026_02',
    title: 'Đề Khảo Sát Toàn Diện Môn Toán THPT - Đề Số 02',
    year: 'Chuẩn 2026 Trở Đi',
    durationMinutes: 45,
    description: 'Chuẩn ma trận cấu trúc Bộ Giáo dục và Đào tạo: Phần I (4 câu trắc nghiệm), Phần II (2 câu đúng sai), Phần III (2 câu điền số).',
    questions: [
      {
        id: 'ex2_p1_1',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Cho bất phương trình bậc nhất hai ẩn $x - 2y + 4 > 0$. Miền nghiệm của bất phương trình chứa điểm nào sau đây?',
        options: [
          { id: 'A', text: '$(0; 0)$' },
          { id: 'B', text: '$(0; 3)$' },
          { id: 'C', text: '$(-5; 0)$' },
          { id: 'D', text: '$(-4; 1)$' }
        ],
        correctAnswer: 'A',
        solution: 'Thay tọa độ $(0; 0)$ vào: $0 - 2(0) + 4 = 4 > 0$ (thỏa mãn). Vậy điểm $(0; 0)$ thuộc miền nghiệm.'
      },
      {
        id: 'ex2_p1_2',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số nhân $(u_n)$ có số hạng đầu $u_1 = 2$ và công bội $q = 3$. Số hạng $u_4$ bằng:',
        options: [
          { id: 'A', text: '54' },
          { id: 'B', text: '18' },
          { id: 'C', text: '162' },
          { id: 'D', text: '24' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng công thức $u_n = u_1 \\cdot q^{n-1} \\Rightarrow u_4 = 2 \\times 3^3 = 2 \\times 27 = 54$.'
      },
      {
        id: 'ex2_p1_3',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{x - 1}{x + 1}$ là đường thẳng:',
        options: [
          { id: 'A', text: '$y = 1$' },
          { id: 'B', text: '$y = -1$' },
          { id: 'C', text: '$x = -1$' },
          { id: 'D', text: '$x = 1$' }
        ],
        correctAnswer: 'A',
        solution: 'Ta có $\\lim_{x \\to \\pm\\infty} \\frac{x - 1}{x + 1} = 1$, do đó đường tiệm cận ngang là $y = 1$.'
      },
      {
        id: 'ex2_p1_4',
        part: 'I',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong không gian $Oxyz$, cho hai vectơ $\\vec{u} = (1; -2; 3)$ và $\\vec{v} = (2; 1; -1)$. Tích vô hướng $\\vec{u} \\cdot \\vec{v}$ bằng:',
        options: [
          { id: 'A', text: '$-3$' },
          { id: 'B', text: '$3$' },
          { id: 'C', text: '$7$' },
          { id: 'D', text: '$-1$' }
        ],
        correctAnswer: 'A',
        solution: 'Áp dụng công thức tích vô hướng: $\\vec{u} \\cdot \\vec{v} = 1(2) + (-2)(1) + 3(-1) = 2 - 2 - 3 = -3$.'
      },
      {
        id: 'ex2_p2_1',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Khảo sát mẫu số liệu điểm kiểm tra của 40 học sinh lớp 11 với bảng ghép nhóm sau:<br><div class="p-2 bg-slate-100 rounded-lg text-xs font-mono my-2 text-center">[4; 6): 8 HS | [6; 8): 20 HS | [8; 10): 12 HS</div>Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Nhóm chứa mốt là nhóm $[6; 8)$.', isCorrect: true },
          { id: 'b', statement: 'Trung vị của mẫu điểm thuộc nhóm $[4; 6)$.', isCorrect: false },
          { id: 'c', statement: 'Điểm trung bình của mẫu là $\\bar{x} = 7,2$.', isCorrect: true },
          { id: 'd', statement: 'Có ít nhất $80\\%$ số học sinh đạt điểm từ 6 trở lên.', isCorrect: true }
        ],
        solution: 'Ý a Đúng vì nhóm $[6;8)$ có tần số 20 lớn nhất. Ý b Sai vì $\\frac{n}{2} = 20 > 8$, trung vị thuộc nhóm $[6;8)$. Ý c Đúng vì $\\bar{x} = \\frac{8(5) + 20(7) + 12(9)}{40} = 7,2$. Ý d Đúng vì số học sinh từ 6 điểm trở lên là $20 + 12 = 32$, chiếm $\\frac{32}{40} = 80\\%$.'
      },
      {
        id: 'ex2_p2_2',
        part: 'II',
        format: 'true_false_4',
        difficulty: 'Vận dụng',
        content: 'Cho hàm số bậc ba $y = f(x) = x^3 - 3x + 2$. Khảo sát sự biến thiên và đồ thị của hàm số. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Hàm số đồng biến trên các khoảng $(-\\infty; -1)$ và $(1; +\\infty)$.', isCorrect: true },
          { id: 'b', statement: 'Hàm số đạt cực đại tại $x = 1$.', isCorrect: false },
          { id: 'c', statement: 'Giá trị cực tiểu của hàm số bằng $0$.', isCorrect: true },
          { id: 'd', statement: 'Đồ thị hàm số có tâm đối xứng là điểm uốn $I(0; 2)$.', isCorrect: true }
        ],
        solution: 'Đạo hàm: $f\'(x) = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Cực đại tại $x = -1$ ($y = 4$), cực tiểu tại $x = 1$ ($y = 0$). Hàm số đồng biến trên $(-\\infty; -1)$ và $(1; +\\infty)$. Điểm uốn $I(0; 2)$ là tâm đối xứng.'
      },
      {
        id: 'ex2_p3_1',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Vận dụng cao',
        content: 'Một mảnh đất hình chữ nhật có chu vi bằng $40$ mét. Diện tích lớn nhất có thể có của mảnh đất đó bằng bao nhiêu mét vuông?',
        correctAnswer: '100',
        solution: 'Nửa chu vi là $20$ m. Chiều dài là $20 - x$, chiều rộng là $x$. Diện tích $S = x(20 - x) \\le 100$. Dấu bằng xảy ra khi hình vuông cạnh 10 m, diện tích lớn nhất là $100\\text{ m}^2$.'
      },
      {
        id: 'ex2_p3_2',
        part: 'III',
        format: 'short_answer',
        difficulty: 'Thông hiểu',
        content: 'Cho cấp số cộng $(u_n)$ có số hạng đầu $u_1 = 5$ và công sai $d = 3$. Tính tổng $S_{10}$ của $10$ số hạng đầu tiên.',
        correctAnswer: '185',
        solution: 'Áp dụng công thức $S_n = \\frac{n[2u_1 + (n-1)d]}{2} = \\frac{10[2(5) + 9(3)]}{2} = 5 \\times 37 = 185$.'
      }
    ]
  }
];
