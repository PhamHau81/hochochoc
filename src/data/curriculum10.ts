import { Chapter } from '../types';

export const GRADE_10_CHAPTERS: Chapter[] = [
  {
    id: '10_ch1',
    grade: 10,
    name: 'Chương I: Mệnh đề & Tập hợp',
    lessons: [
      'Bài 1: Mệnh đề',
      'Bài 2: Tập hợp và các phép toán trên tập hợp'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Mệnh đề & Phủ định:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Mệnh đề logic:</b> Một khẳng định có tính đúng hoặc sai, không thể vừa đúng vừa sai.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Mệnh đề phủ định $\\bar{P}$:</b> Đúng khi $P$ sai, sai khi $P$ đúng. Phủ định của $\\forall x \\in X, P(x)$ là $\\exists x \\in X, \\overline{P(x)}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Mệnh đề kéo theo $P \\Rightarrow Q$:</b> Chỉ sai khi $P$ đúng mà $Q$ sai. Mệnh đề đảo của $P \\Rightarrow Q$ là $Q \\Rightarrow P$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Tập hợp & Các phép toán:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Giao:</b> $A \\cap B = \\{x \\mid x \\in A \\text{ và } x \\in B\\}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Hợp:</b> $A \\cup B = \\{x \\mid x \\in A \\text{ hoặc } x \\in B\\}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Hiệu & Phần bù:</b> $A \\setminus B = \\{x \\mid x \\in A \\text{ và } x \\notin B\\}$. Nếu $B \\subset A$ thì $C_A B = A \\setminus B$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Các tập con số thực:</b> Đoạn $[a; b]$, khoảng $(a; b)$, nửa khoảng $[a; b)$ hoặc $(a; b]$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Phủ định lượng từ:</b> Phủ định của $\\forall$ là $\\exists$, phủ định của $\\exists$ là $\\forall$. Phủ định của dấu "$>$" là "$\\le$", của "$<$" là "$\\ge$".</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Biểu diễn trục số:</b> Khi làm các phép toán giao $A \\cap B$, hợp $A \\cup B$, hiệu $A \\setminus B$, luôn vẽ trục số và gạch bỏ phần không thuộc để tránh nhầm ngoặc vuông $[ \\ ]$ và ngoặc tròn $( \\ )$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_ch1_1',
        grade: 10,
        chapterId: '10_ch1',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Mệnh đề phủ định của mệnh đề "$P: \\forall x \\in \\mathbb{R}, x^2 + 1 > 0$" là gì?',
        options: [
          { id: 'A', text: '$\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$' },
          { id: 'B', text: '$\\forall x \\in \\mathbb{R}, x^2 + 1 \\le 0$' },
          { id: 'C', text: '$\\exists x \\in \\mathbb{R}, x^2 + 1 < 0$' },
          { id: 'D', text: '$\\forall x \\in \\mathbb{R}, x^2 + 1 < 0$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Phủ định của lượng từ $\\forall$ là $\\exists$.',
          'Phủ định của dấu "$>$" là "$\\le$".'
        ],
        solution: 'Theo quy tắc phủ định mệnh đề chứa lượng từ: $\\overline{\\forall x \\in X, P(x)} \\Leftrightarrow \\exists x \\in X, \\overline{P(x)}$. Phủ định của $x^2 + 1 > 0$ là $x^2 + 1 \\le 0$. Do đó phương án đúng là A.'
      },
      {
        id: 'q10_ch1_2',
        grade: 10,
        chapterId: '10_ch1',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hai tập hợp $A = [-2; 4)$ và $B = [1; 6]$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Tập hợp $A \\cap B = [1; 4)$.', isCorrect: true },
          { id: 'b', statement: 'Tập hợp $A \\cup B = [-2; 6]$.', isCorrect: true },
          { id: 'c', statement: 'Hiệu $A \\setminus B = [-2; 1]$.', isCorrect: false },
          { id: 'd', statement: 'Số phần tử nguyên thuộc tập hợp $A \\cap B$ là 3.', isCorrect: true }
        ],
        hints: [
          'Vẽ trục số biểu diễn hai tập $A$ và $B$.',
          'Chú ý ngoặc tròn và ngoặc vuông tại đầu mút 1: khi lấy $A \\setminus B$, số 1 thuộc $B$ nên bị loại ra: $A \\setminus B = [-2; 1)$.'
        ],
        solution: 'Ý a Đúng vì $A \\cap B = [\\max(-2,1); \\min(4,6)) = [1; 4)$. Ý b Đúng vì $A \\cup B = [-2; 6]$. Ý c Sai vì $1 \\in B$ nên $A \\setminus B = [-2; 1)$. Ý d Đúng vì các số nguyên thuộc $[1; 4)$ là $\\{1, 2, 3\\}$, có đúng 3 phần tử.'
      },
      {
        id: 'q10_ch1_3',
        grade: 10,
        chapterId: '10_ch1',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Lớp 10A có 45 học sinh. Trong đó có 25 học sinh thích môn Toán, 20 học sinh thích môn Văn, và 10 học sinh thích cả hai môn Toán và Văn. Hỏi có bao nhiêu học sinh trong lớp không thích môn nào trong hai môn Toán và Văn?',
        correctAnswer: '10',
        hints: [
          'Sử dụng công thức hợp: $|A \\cup B| = |A| + |B| - |A \\cap B|$.',
          'Số học sinh không thích môn nào bằng tổng số học sinh trừ đi số học sinh thích ít nhất một môn.'
        ],
        solution: 'Số học sinh thích ít nhất một trong hai môn là: $|A \\cup B| = 25 + 20 - 10 = 35$. Số học sinh không thích cả hai môn là: $45 - 35 = 10$.'
      }
    ]
  },
  {
    id: '10_ch2',
    grade: 10,
    name: 'Chương II: Bất phương trình & Hệ bất phương trình bậc nhất hai ẩn',
    lessons: [
      'Bài 3: Bất phương trình bậc nhất hai ẩn',
      'Bài 4: Hệ bất phương trình bậc nhất hai ẩn'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Miền nghiệm bất phương trình:</div>
          <p class="text-indigo-100 leading-relaxed">Bất phương trình $ax + by + c \\le 0$ có bờ là đường thẳng $d: ax + by + c = 0$. Điểm $O(0;0)$ thường được dùng làm điểm thử nếu $c \\ne 0$. Nếu tọa độ thỏa mãn thì nửa mặt phẳng chứa $O$ là miền nghiệm.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Bài toán quy hoạch tuyến tính:</div>
          <p class="text-indigo-100 leading-relaxed">Giá trị lớn nhất hoặc nhỏ nhất của biểu thức mục tiêu $F(x,y) = ax + by$ trên miền đa giác nghiệm lồi luôn đạt tại một trong các đỉnh của đa giác đó.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Kể cả bờ hay không kể bờ:</b> Dấu $\\le, \\ge$ thì miền nghiệm KỂ CẢ BỜ (đường liền nét). Dấu $<, >$ thì miền nghiệm KHÔNG KỂ BỜ (đường đứt nét).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Tối ưu hóa $F(x,y)$:</b> Chỉ cần tính giá trị của $F$ tại tất cả các ĐỈNH của miền đa giác, so sánh các kết quả để tìm Min / Max.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_1',
        grade: 10,
        chapterId: '10_ch2',
        format: 'multiple_choice_4',
        difficulty: 'Nhận biết',
        content: 'Cặp số nào sau đây là một nghiệm của bất phương trình $2x - 3y + 1 > 0$?',
        options: [
          { id: 'A', text: '$(1; 2)$' },
          { id: 'B', text: '$(2; 1)$' },
          { id: 'C', text: '$(0; 1)$' },
          { id: 'D', text: '$(-1; 1)$' }
        ],
        correctAnswer: 'B',
        hints: [
          'Thay trực tiếp tọa độ $(x; y)$ của từng phương án vào vế trái $2x - 3y + 1$.',
          'Với cặp $(2; 1)$, ta có $2(2) - 3(1) + 1 = 4 - 3 + 1 = 2 > 0$ (thỏa mãn).'
        ],
        solution: 'Thay $(x=2, y=1)$ vào vế trái: $2(2) - 3(1) + 1 = 2 > 0$. Vậy $(2; 1)$ là nghiệm của bất phương trình.'
      },
      {
        id: 'q10_2b',
        grade: 10,
        chapterId: '10_ch2',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hệ bất phương trình bậc nhất hai ẩn: $\\begin{cases} x + y \\le 4 \\\\ x \\ge 0 \\\\ y \\ge 0 \\end{cases}$. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Miền nghiệm của hệ là một hình tam giác vuông.', isCorrect: true },
          { id: 'b', statement: 'Điểm $M(2; 3)$ thuộc miền nghiệm của hệ.', isCorrect: false },
          { id: 'c', statement: 'Điểm $O(0; 0)$ là một đỉnh của miền nghiệm.', isCorrect: true },
          { id: 'd', statement: 'Diện tích của miền nghiệm bằng 8 đơn vị diện tích.', isCorrect: true }
        ],
        hints: [
          'Miền nghiệm giới hạn bởi 2 trục tọa độ và đường thẳng $x + y = 4$.',
          'Tam giác có 3 đỉnh là $(0;0), (4;0), (0;4)$. Diện tích bằng $\\frac{1}{2} \\times 4 \\times 4 = 8$.'
        ],
        solution: 'Ý a Đúng vì các trục tọa độ vuông góc nhau tạo thành tam giác vuông tại $O$. Ý b Sai vì $2 + 3 = 5 > 4$. Ý c Đúng vì $O(0;0)$ thỏa mãn cả 3 bất phương trình. Ý d Đúng vì diện tích $S = \\frac{1}{2} \\cdot 4 \\cdot 4 = 8$.'
      },
      {
        id: 'q10_2',
        grade: 10,
        chapterId: '10_ch2',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Một xưởng sản xuất 2 loại sản phẩm I và II. Mỗi kg sản phẩm I lãi 30 nghìn đồng, mỗi kg sản phẩm II lãi 40 nghìn đồng. Biết miền nghiệm biểu diễn số lượng $x, y$ (kg) là tứ giác có 4 đỉnh $O(0;0), A(0;4), B(3;3), C(4;0)$. Lợi nhuận lớn nhất mà xưởng có thể đạt được là bao nhiêu nghìn đồng?',
        correctAnswer: '210',
        hints: [
          'Hàm mục tiêu lợi nhuận là $F(x, y) = 30x + 40y$.',
          'Tính giá trị của $F$ tại 4 đỉnh: $O(0;0), A(0;4), B(3;3), C(4;0)$.'
        ],
        solution: 'Tính giá trị $F(x, y) = 30x + 40y$ tại các đỉnh: $F(O) = 0$, $F(A) = 30(0)+40(4) = 160$, $F(B) = 30(3)+40(3) = 90+120 = 210$, $F(C) = 30(4)+40(0) = 120$. Do đó lợi nhuận lớn nhất là 210 nghìn đồng tại đỉnh $B(3;3)$.'
      }
    ]
  },
  {
    id: '10_ch3',
    grade: 10,
    name: 'Chương III: Hệ thức lượng trong tam giác',
    lessons: [
      'Bài 5: Giá trị lượng giác của một góc từ 0° đến 180°',
      'Bài 6: Hệ thức lượng trong tam giác'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Định lí Côsin & Định lí Sin:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Định lí côsin:</b> $a^2 = b^2 + c^2 - 2bc \\cos A$; $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Định lí sin:</b> $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$ ($R$ là bán kính đường tròn ngoại tiếp).</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Các công thức tính diện tích tam giác:</div>
          <p class="text-indigo-100 leading-relaxed">• $S = \\frac{1}{2} a h_a = \\frac{1}{2}ab \\sin C = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$ (với $p = \\frac{a+b+c}{2}$).</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Phân biệt bán kính $R$ và $r$:</b> $R$ là bán kính đường tròn NGOẠI tiếp ($S = \\frac{abc}{4R}, \\frac{a}{\\sin A} = 2R$), còn $r$ là bán kính đường tròn NỘI tiếp ($S = pr$).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Góc tù trong định lí Côsin:</b> Nếu $\\widehat{A} > 90^\\circ$ thì $\\cos A < 0$, dẫn đến $-2bc \\cos A > 0 \\Rightarrow a^2 > b^2 + c^2$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_ch3_1',
        grade: 10,
        chapterId: '10_ch3',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho tam giác $ABC$ có $b = 8, c = 5$ và góc $\\widehat{A} = 60^\\circ$. Độ dài cạnh $a$ bằng:',
        options: [
          { id: 'A', text: '$7$' },
          { id: 'B', text: '$\\sqrt{97}$' },
          { id: 'C', text: '$6$' },
          { id: 'D', text: '$\\sqrt{129}$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Áp dụng định lí côsin: $a^2 = b^2 + c^2 - 2bc \\cos A$.',
          'Thay số: $a^2 = 8^2 + 5^2 - 2(8)(5) \\cos 60^\\circ = 64 + 25 - 40 = 49$.'
        ],
        solution: 'Áp dụng định lí côsin: $a^2 = 8^2 + 5^2 - 2 \\cdot 8 \\cdot 5 \\cdot \\cos 60^\\circ = 64 + 25 - 40 = 49 \\Rightarrow a = 7$.'
      },
      {
        id: 'q10_ch3_2',
        grade: 10,
        chapterId: '10_ch3',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho tam giác $ABC$ có ba cạnh $a = 13, b = 14, c = 15$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Nửa chu vi của tam giác bằng $p = 21$.', isCorrect: true },
          { id: 'b', statement: 'Diện tích tam giác $S = 84$.', isCorrect: true },
          { id: 'c', statement: 'Bán kính đường tròn nội tiếp tam giác $r = 4$.', isCorrect: true },
          { id: 'd', statement: 'Bán kính đường tròn ngoại tiếp tam giác $R = 8$.', isCorrect: false }
        ],
        hints: [
          'Tính $p = \\frac{13+14+15}{2} = 21$.',
          'Dùng công thức Heron: $S = \\sqrt{21(21-13)(21-14)(21-15)} = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$.',
          '$r = \\frac{S}{p} = \\frac{84}{21} = 4$.',
          '$R = \\frac{abc}{4S} = \\frac{13 \\cdot 14 \\cdot 15}{4 \\cdot 84} = 8,125 \\ne 8$.'
        ],
        solution: 'Ta có $p = 21$. Diện tích $S = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = 84$ (a Đúng, b Đúng). Bán kính nội tiếp $r = \\frac{S}{p} = 4$ (c Đúng). Bán kính ngoại tiếp $R = \\frac{abc}{4S} = \\frac{2730}{336} = 8,125$ (d Sai).'
      },
      {
        id: 'q10_ch3_3',
        grade: 10,
        chapterId: '10_ch3',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Cho tam giác $ABC$ có cạnh $a = 10$ và góc đối diện $\\widehat{A} = 30^\\circ$. Tính bán kính đường tròn ngoại tiếp $R$ của tam giác $ABC$.',
        correctAnswer: '10',
        hints: [
          'Áp dụng định lí sin: $\\frac{a}{\\sin A} = 2R$.',
          '$2R = \\frac{10}{\\sin 30^\\circ} = \\frac{10}{0,5} = 20$.'
        ],
        solution: 'Theo định lí sin: $2R = \\frac{a}{\\sin A} = \\frac{10}{\\sin 30^\\circ} = 20 \\Rightarrow R = 10$.'
      }
    ]
  },
  {
    id: '10_ch4',
    grade: 10,
    name: 'Chương IV: Vectơ & Các phép toán vectơ trong mặt phẳng',
    lessons: [
      'Bài 7: Các khái niệm mở đầu',
      'Bài 8: Tổng và hiệu của hai vectơ',
      'Bài 9: Tích của một vectơ với một số',
      'Bài 10: Vectơ trong mặt phẳng toạ độ',
      'Bài 11: Tích vô hướng của hai vectơ'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Các quy tắc vectơ cơ bản:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Quy tắc 3 điểm:</b> $\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}$; $\\overrightarrow{AB} = \\overrightarrow{OB} - \\overrightarrow{OA}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Quy tắc hình bình hành:</b> Nếu $ABCD$ là hình bình hành thì $\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{AC}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Trung điểm & Trọng tâm:</b> $I$ là trung điểm $AB \\Leftrightarrow \\overrightarrow{MA} + \\overrightarrow{MB} = 2\\overrightarrow{MI}$; Với trọng tâm $G$: $\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\vec{0}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Tích vô hướng của hai vectơ:</div>
          <p class="text-indigo-100 leading-relaxed">• Định nghĩa: $\\vec{a} \\cdot \\vec{b} = |\\vec{a}| \\cdot |\\vec{b}| \\cdot \\cos(\\vec{a}, \\vec{b})$.</p>
          <p class="text-indigo-100 leading-relaxed">• Biểu thức tọa độ trong $Oxy$: Nếu $\\vec{a} = (x_1; y_1)$ và $\\vec{b} = (x_2; y_2)$ thì $\\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2$.</p>
          <p class="text-indigo-100 leading-relaxed">• Hai vectơ vuông góc: $\\vec{a} \\perp \\vec{b} \\Leftrightarrow x_1 x_2 + y_1 y_2 = 0$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Quy tắc trừ vectơ:</b> $\\overrightarrow{AB} = \\overrightarrow{OB} - \\overrightarrow{OA}$ (ngọn trừ gốc, không được viết ngược thành $\\overrightarrow{OA} - \\overrightarrow{OB}$).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Bình phương vô hướng:</b> Bình phương vô hướng bằng bình phương độ dài: $\\vec{a}^2 = |\\vec{a}|^2$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_3',
        grade: 10,
        chapterId: '10_ch4',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Trong mặt phẳng tọa độ $Oxy$, cho $\\vec{u} = (2; -3)$ và $\\vec{v} = (1; 4)$. Tích vô hướng $\\vec{u} \\cdot \\vec{v}$ bằng:',
        options: [
          { id: 'A', text: '$-10$' },
          { id: 'B', text: '$14$' },
          { id: 'C', text: '$-14$' },
          { id: 'D', text: '$10$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Biểu thức tọa độ tích vô hướng: $\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2$.',
          'Tính: $2(1) + (-3)(4) = 2 - 12 = -10$.'
        ],
        solution: 'Ta có $\\vec{u} \\cdot \\vec{v} = 2(1) + (-3)(4) = 2 - 12 = -10$.'
      },
      {
        id: 'q10_4',
        grade: 10,
        chapterId: '10_ch4',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho tam giác đều $ABC$ cạnh bằng $a$, trọng tâm $G$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Độ dài vectơ $\\overrightarrow{AB} - \\overrightarrow{AC}$ bằng $a$.', isCorrect: true },
          { id: 'b', statement: 'Tích vô hướng $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = \\frac{1}{2}a^2$.', isCorrect: true },
          { id: 'c', statement: 'Vectơ $\\overrightarrow{GA} + \\overrightarrow{GB} + \\overrightarrow{GC} = \\vec{0}$.', isCorrect: true },
          { id: 'd', statement: 'Độ dài vectơ $\\overrightarrow{AB} + \\overrightarrow{AC}$ bằng $a$.', isCorrect: false }
        ],
        hints: [
          '$\\overrightarrow{AB} - \\overrightarrow{AC} = \\overrightarrow{CB} \\Rightarrow |\\overrightarrow{CB}| = a$.',
          '$\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = a \\cdot a \\cdot \\cos 60^\\circ = \\frac{1}{2}a^2$.',
          'Gọi $M$ là trung điểm $BC$: $|\\overrightarrow{AB} + \\overrightarrow{AC}| = |2\\overrightarrow{AM}| = 2 \\cdot \\frac{a\\sqrt{3}}{2} = a\\sqrt{3} \\ne a$.'
        ],
        solution: 'Ý a Đúng vì $\\overrightarrow{AB} - \\overrightarrow{AC} = \\overrightarrow{CB}$. Ý b Đúng vì góc giữa hai vectơ là $60^\\circ$. Ý c Đúng theo tính chất trọng tâm. Ý d Sai vì $|\\overrightarrow{AB} + \\overrightarrow{AC}| = 2AM = a\\sqrt{3}$.'
      },
      {
        id: 'q10_5',
        grade: 10,
        chapterId: '10_ch4',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Trong mặt phẳng tọa độ $Oxy$, cho $\\vec{a} = (x; 3)$ và $\\vec{b} = (2; -4)$. Tìm giá trị của $x$ để hai vectơ $\\vec{a}$ và $\\vec{b}$ vuông góc với nhau.',
        correctAnswer: '6',
        hints: [
          'Điều kiện vuông góc: $\\vec{a} \\cdot \\vec{b} = 0$.',
          'Phương trình: $x \\cdot 2 + 3(-4) = 0 \\Leftrightarrow 2x - 12 = 0$.'
        ],
        solution: '$\\vec{a} \\perp \\vec{b} \\Leftrightarrow \\vec{a} \\cdot \\vec{b} = 0 \\Leftrightarrow 2x + 3(-4) = 0 \\Leftrightarrow 2x = 12 \\Leftrightarrow x = 6$.'
      }
    ]
  },
  {
    id: '10_ch5',
    grade: 10,
    name: 'Chương V: Các số đặc trưng mẫu số liệu không ghép nhóm',
    lessons: [
      'Bài 12: Số gần đúng và sai số',
      'Bài 13: Các số đặc trưng đo xu thế trung tâm',
      'Bài 14: Các số đặc trưng đo độ phân tán'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Số đặc trưng đo xu thế trung tâm:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Số trung bình:</b> $\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Trung vị $M_e$:</b> Giá trị đứng giữa sau khi sắp xếp mẫu số liệu theo thứ tự không giảm.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tứ phân vị:</b> $Q_2 = M_e$; $Q_1$ là trung vị nửa dưới; $Q_3$ là trung vị nửa trên.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Mốt $M_o$:</b> Giá trị có tần số xuất hiện nhiều nhất.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Số đặc trưng đo độ phân tán:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Khoảng biến thiên:</b> $R = x_{\\max} - x_{\\min}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Khoảng tứ phân vị:</b> $\\Delta_Q = Q_3 - Q_1$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Phương sai & Độ lệch chuẩn:</b> $s^2 = \\frac{1}{n}\\sum (x_i - \\bar{x})^2$; $s = \\sqrt{s^2}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Giá trị ngoại lệ:</b> $x < Q_1 - 1,5\\Delta_Q$ hoặc $x > Q_3 + 1,5\\Delta_Q$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Sắp xếp số liệu trước tiên:</b> Muốn tìm trung vị $M_e$, tứ phân vị $Q_1, Q_3$, BẮT BUỘC phải sắp xếp dãy số liệu theo thứ tự không giảm trước tiên!</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Giá trị bất thường (outliers):</b> Giá trị $x$ được coi là bất thường nếu $x < Q_1 - 1,5\\Delta_Q$ hoặc $x > Q_3 + 1,5\\Delta_Q$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_ch5_1',
        grade: 10,
        chapterId: '10_ch5',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Cho mẫu số liệu điểm kiểm tra: $4, 6, 7, 7, 8, 9, 10$. Khoảng tứ phân vị $\\Delta_Q$ của mẫu số liệu trên bằng:',
        options: [
          { id: 'A', text: '$3$' },
          { id: 'B', text: '$2$' },
          { id: 'C', text: '$6$' },
          { id: 'D', text: '$4$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Mẫu có $n=7$ đã sắp xếp. Trung vị $Q_2 = 7$ (vị trí thứ 4).',
          'Nửa dưới gồm: 4, 6, 7 $\\Rightarrow Q_1 = 6$.',
          'Nửa trên gồm: 8, 9, 10 $\\Rightarrow Q_3 = 9$.',
          '$\\Delta_Q = Q_3 - Q_1 = 9 - 6 = 3$.'
        ],
        solution: 'Mẫu số liệu có 7 giá trị. Vị trí thứ tư là $Q_2 = 7$. Nửa dưới $\\{4, 6, 7\\} \\Rightarrow Q_1 = 6$. Nửa trên $\\{8, 9, 10\\} \\Rightarrow Q_3 = 9$. Vậy $\\Delta_Q = 9 - 6 = 3$.'
      },
      {
        id: 'q10_ch5_2',
        grade: 10,
        chapterId: '10_ch5',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Cho mẫu số liệu 5 số: $2, 4, 6, 8, 10$. Tính phương sai $s^2$ của mẫu số liệu trên.',
        correctAnswer: '8',
        hints: [
          'Số trung bình $\\bar{x} = \\frac{2+4+6+8+10}{5} = 6$.',
          'Phương sai $s^2 = \\frac{(2-6)^2 + (4-6)^2 + (6-6)^2 + (8-6)^2 + (10-6)^2}{5}$.'
        ],
        solution: 'Ta có $\\bar{x} = 6$. Sai số bình phương: $(-4)^2 + (-2)^2 + 0^2 + 2^2 + 4^2 = 16 + 4 + 0 + 4 + 16 = 40$. Phương sai $s^2 = \\frac{40}{5} = 8$.'
      },
      {
        id: 'q10_ch5_3',
        grade: 10,
        chapterId: '10_ch5',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho mẫu số liệu điểm của 8 học sinh: $5, 6, 6, 7, 8, 8, 9, 10$. Xét tính Đúng / Sai của các mệnh đề sau:',
        subQuestions: [
          { id: 'a', statement: 'Khoảng biến thiên của mẫu số liệu là $R = 5$.', isCorrect: true },
          { id: 'b', statement: 'Số trung bình của mẫu điểm bằng $\\bar{x} = 7,375$.', isCorrect: true },
          { id: 'c', statement: 'Trung vị của mẫu số liệu là $M_e = 7,5$.', isCorrect: true },
          { id: 'd', statement: 'Mẫu số liệu chỉ có duy nhất một mốt là $M_o = 6$.', isCorrect: false }
        ],
        hints: [
          '$R = 10 - 5 = 5$.',
          '$\\bar{x} = \\frac{5 + 6 + 6 + 7 + 8 + 8 + 9 + 10}{8} = \\frac{59}{8} = 7,375$.',
          'Vị trí giữa là thứ 4 và thứ 5: $M_e = \\frac{7 + 8}{2} = 7,5$.',
          'Cả số 6 và số 8 đều xuất hiện 2 lần nên mẫu số liệu có hai mốt là 6 và 8.'
        ],
        solution: 'Ý a Đúng vì $R = x_{\\max} - x_{\\min} = 10 - 5 = 5$. Ý b Đúng vì $\\bar{x} = \\frac{59}{8} = 7,375$. Ý c Đúng vì $M_e = \\frac{7+8}{2} = 7,5$. Ý d Sai vì cả 6 và 8 đều xuất hiện nhiều nhất (2 lần) nên mẫu có 2 mốt.'
      }
    ]
  },
  {
    id: '10_ch6',
    grade: 10,
    name: 'Chương VI: Hàm số, Đồ thị & Hàm số bậc hai',
    lessons: [
      'Bài 15: Hàm số và đồ thị',
      'Bài 16: Hàm số bậc hai',
      'Bài 17: Dấu của tam thức bậc hai',
      'Bài 18: Phương trình quy về phương trình bậc hai'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Parabol $y = ax^2 + bx + c$ ($a \\ne 0$):</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Tọa độ đỉnh:</b> $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Trục đối xứng:</b> Đường thẳng $x = -\\frac{b}{2a}$. Bề lõm quay lên nếu $a > 0$, quay xuống nếu $a < 0$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Dấu tam thức bậc hai $f(x) = ax^2 + bx + c$:</div>
          <p class="text-indigo-100 leading-relaxed">• $\\Delta < 0 \\Rightarrow f(x)$ cùng dấu với $a$ với mọi $x \\in \\mathbb{R}$.</p>
          <p class="text-indigo-100 leading-relaxed">• $\\Delta = 0 \\Rightarrow f(x)$ cùng dấu với $a$ với mọi $x \\ne -\\frac{b}{2a}$.</p>
          <p class="text-indigo-100 leading-relaxed">• $\\Delta > 0 \\Rightarrow f(x)$ có 2 nghiệm phân biệt: "Trong trái dấu với $a$, ngoài cùng dấu với $a$".</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Điều kiện tam thức bậc 2:</b> Muốn $f(x) > 0, \\forall x \\in \\mathbb{R}$ thì $a > 0$ và $\\Delta < 0$. Muốn $f(x) \\ge 0, \\forall x \\in \\mathbb{R}$ thì $a > 0$ và $\\Delta \\le 0$ (dấu bằng chỉ đi với $\\Delta$, không bao giờ đi với $a$!).</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Xét trường hợp $a = 0$:</b> Nếu hệ số $a$ chứa tham số $m$, BẮT BUỘC phải xét riêng trường hợp $a = 0$ trước khi tính $\\Delta$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_ch6_1',
        grade: 10,
        chapterId: '10_ch6',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Tọa độ đỉnh của parabol $(P): y = x^2 - 4x + 3$ là:',
        options: [
          { id: 'A', text: '$(2; -1)$' },
          { id: 'B', text: '$(-2; 15)$' },
          { id: 'C', text: '$(2; 1)$' },
          { id: 'D', text: '$(4; 3)$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Hoành độ đỉnh $x_I = -\\frac{b}{2a} = -\\frac{-4}{2(1)} = 2$.',
          'Thay $x = 2$ vào hàm số để tìm $y_I$.'
        ],
        solution: 'Hoành độ đỉnh $x_I = -\\frac{-4}{2} = 2$. Tung độ đỉnh $y_I = 2^2 - 4(2) + 3 = 4 - 8 + 3 = -1$. Đỉnh là $I(2; -1)$.'
      },
      {
        id: 'q10_ch6_2',
        grade: 10,
        chapterId: '10_ch6',
        format: 'short_answer',
        difficulty: 'Thông hiểu',
        content: 'Tập nghiệm của bất phương trình $x^2 - 5x + 6 \\le 0$ là đoạn $[a; b]$. Tính giá trị của biểu thức $T = a + b$.',
        correctAnswer: '5',
        hints: [
          'Giải phương trình $x^2 - 5x + 6 = 0 \\Leftrightarrow x = 2$ hoặc $x = 3$.',
          'Xét dấu: tam thức âm ở trong khoảng hai nghiệm $\\Rightarrow x \\in [2; 3]$.'
        ],
        solution: 'Phương trình $x^2 - 5x + 6 = 0$ có 2 nghiệm $x_1 = 2, x_2 = 3$. Vì $a = 1 > 0$, bất phương trình lấy giá trị $\\le 0$ nên tập nghiệm là $[2; 3]$. Do đó $a = 2, b = 3 \\Rightarrow a + b = 5$.'
      },
      {
        id: 'q10_ch6_3',
        grade: 10,
        chapterId: '10_ch6',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Cho hàm số bậc hai $y = f(x) = -x^2 + 4x - 3$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Đồ thị hàm số có bề lõm quay xuống phía dưới.', isCorrect: true },
          { id: 'b', statement: 'Tọa độ đỉnh của parabol là $I(2; 1)$.', isCorrect: true },
          { id: 'c', statement: 'Hàm số đồng biến trên khoảng $(2; +\\infty)$.', isCorrect: false },
          { id: 'd', statement: 'Tập nghiệm của bất phương trình $f(x) > 0$ là khoảng $(1; 3)$.', isCorrect: true }
        ],
        hints: [
          'Hệ số $a = -1 < 0$ nên bề lõm quay xuống dưới.',
          '$x_I = -\\frac{4}{2(-1)} = 2$, $y_I = -4 + 8 - 3 = 1 \\Rightarrow I(2; 1)$.',
          'Vì $a < 0$, hàm số đồng biến trên $(-\\infty; 2)$ và nghịch biến trên $(2; +\\infty)$.',
          '$-x^2 + 4x - 3 = 0 \\Leftrightarrow x = 1$ hoặc $x = 3$. Trong khoảng $(1; 3)$, $f(x) > 0$.'
        ],
        solution: 'Ý a Đúng vì $a = -1 < 0$. Ý b Đúng vì đỉnh là $I(2; 1)$. Ý c Sai vì hàm số nghịch biến trên $(2; +\\infty)$. Ý d Đúng vì nghiệm phương trình là 1 và 3, tam thức mang dấu dương trong khoảng hai nghiệm.'
      }
    ]
  },
  {
    id: '10_ch7',
    grade: 10,
    name: 'Chương VII: Phương pháp toạ độ trong mặt phẳng & Ba đường Conic',
    lessons: [
      'Bài 19: Phương trình đường thẳng',
      'Bài 20: Vị trí tương đối giữa hai đường thẳng. Góc và khoảng cách',
      'Bài 21: Đường tròn trong mặt phẳng toạ độ',
      'Bài 22: Ba đường conic'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Đường thẳng & Đường tròn:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Khoảng cách:</b> $d(M_0, \\Delta) = \\frac{|a x_0 + b y_0 + c|}{\\sqrt{a^2 + b^2}}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Phương trình đường tròn:</b> $(x-a)^2 + (y-b)^2 = R^2$ có tâm $I(a;b)$, bán kính $R$. Dạng khai triển $x^2 + y^2 - 2ax - 2by + c = 0$ với $R = \\sqrt{a^2+b^2-c}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Ba đường Conic chính tắc:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Elip $(E)$:</b> $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ ($a > b > 0, c^2 = a^2 - b^2$).</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Hypebol $(H)$:</b> $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ ($c^2 = a^2 + b^2$).</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Parabol $(P)$:</b> $y^2 = 2px$ ($p > 0$), tiêu điểm $F\\left(\\frac{p}{2}; 0\\right)$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Mối liên hệ $a, b, c$ trong Conic:</b> Trong Elip: $a^2 = b^2 + c^2$ ($a$ lớn nhất). Trong Hypebol: $c^2 = a^2 + b^2$ ($c$ lớn nhất). Hai công thức này học sinh rất hay nhầm lẫn!</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Điều kiện đường tròn:</b> $x^2 + y^2 - 2ax - 2by + c = 0$ là phương trình đường tròn khi và chỉ khi $a^2 + b^2 - c > 0$.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_6',
        grade: 10,
        chapterId: '10_ch7',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Khoảng cách từ điểm $M(1; -2)$ đến đường thẳng $\\Delta: 3x - 4y + 4 = 0$ bằng:',
        options: [
          { id: 'A', text: '$3$' },
          { id: 'B', text: '$5$' },
          { id: 'C', text: '$\\frac{7}{5}$' },
          { id: 'D', text: '$15$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Áp dụng công thức khoảng cách: $d(M, \\Delta) = \\frac{|3(1) - 4(-2) + 4|}{\\sqrt{3^2 + (-4)^2}}$.',
          'Tử số: $|3 + 8 + 4| = 15$. Mẫu số: $\\sqrt{25} = 5$.'
        ],
        solution: '$d(M, \\Delta) = \\frac{|3(1) - 4(-2) + 4|}{\\sqrt{3^2 + (-4)^2}} = \\frac{15}{5} = 3$.'
      },
      {
        id: 'q10_7',
        grade: 10,
        chapterId: '10_ch7',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Cho elip $(E): \\frac{x^2}{25} + \\frac{y^2}{9} = 1$. Tiêu cự của elip $(E)$ bằng bao nhiêu?',
        correctAnswer: '8',
        hints: [
          'Từ phương trình: $a^2 = 25 \\Rightarrow a = 5$, $b^2 = 9 \\Rightarrow b = 3$.',
          'Hệ thức liên hệ tiêu cự: $c^2 = a^2 - b^2$. Tiêu cự bằng $2c$.'
        ],
        solution: 'Ta có $c = \\sqrt{a^2 - b^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4$. Tiêu cự của elip là $2c = 2 \\times 4 = 8$.'
      },
      {
        id: 'q10_ch7_3',
        grade: 10,
        chapterId: '10_ch7',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Trong mặt phẳng tọa độ $Oxy$, cho đường tròn $(C): (x - 2)^2 + (y + 1)^2 = 16$ và đường thẳng $\\Delta: 3x - 4y + 5 = 0$. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Tâm của đường tròn $(C)$ là $I(2; -1)$ và bán kính $R = 4$.', isCorrect: true },
          { id: 'b', statement: 'Khoảng cách từ tâm $I$ đến đường thẳng $\\Delta$ bằng $3$.', isCorrect: true },
          { id: 'c', statement: 'Đường thẳng $\\Delta$ cắt đường tròn $(C)$ tại hai điểm phân biệt.', isCorrect: true },
          { id: 'd', statement: 'Đường thẳng $\\Delta$ tiếp xúc với đường tròn $(C)$.', isCorrect: false }
        ],
        hints: [
          'Tâm $I(2; -1)$, bán kính $R = \\sqrt{16} = 4$.',
          '$d(I, \\Delta) = \\frac{|3(2) - 4(-1) + 5|}{\\sqrt{3^2 + (-4)^2}} = \\frac{|6 + 4 + 5|}{5} = \\frac{15}{5} = 3$.',
          'Vì $d(I, \\Delta) = 3 < R = 4$ nên đường thẳng cắt đường tròn tại 2 điểm phân biệt.',
          'Vì cắt tại 2 điểm phân biệt nên không tiếp xúc.'
        ],
        solution: 'Ý a Đúng vì tâm $I(2; -1)$ và bán kính $R = 4$. Ý b Đúng vì $d(I, \\Delta) = \\frac{15}{5} = 3$. Ý c Đúng vì $d < R$ (3 < 4) nên cắt tại 2 điểm phân biệt. Ý d Sai vì đường thẳng không tiếp xúc (tiếp xúc khi $d = R$).'
      }
    ]
  },
  {
    id: '10_ch8',
    grade: 10,
    name: 'Chương VIII: Đại số tổ hợp & Nhị thức Newton',
    lessons: [
      'Bài 23: Quy tắc đếm',
      'Bài 24: Hoán vị, chỉnh hợp và tổ hợp',
      'Bài 25: Nhị thức Newton'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Quy tắc đếm & Hoán vị - Chỉnh hợp - Tổ hợp:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Quy tắc cộng (phương án):</b> $N = n_1 + n_2$. <b>Quy tắc nhân (công đoạn):</b> $N = n_1 \\times n_2$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Hoán vị:</b> $P_n = n!$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Chỉnh hợp (có thứ tự):</b> $A_n^k = \\frac{n!}{(n-k)!}$.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Tổ hợp (không kể thứ tự):</b> $C_n^k = \\frac{n!}{k!(n-k)!}$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Nhị thức Newton bậc 4 và bậc 5:</div>
          <p class="text-indigo-100 leading-relaxed">• $(a+b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$.</p>
          <p class="text-indigo-100 leading-relaxed">• $(a+b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Phân biệt Chỉnh hợp $A_n^k$ và Tổ hợp $C_n^k$:</b> Có phân chia chức vụ, thứ tự, vị trí $\\Rightarrow$ dùng $A_n^k$. Chỉ chọn ra một nhóm không phân biệt vai trò $\\Rightarrow$ dùng $C_n^k$.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Dấu trong Nhị thức Newton:</b> Khi khai triển $(a - b)^n$, dấu của các số hạng luôn đan xen nhau: $+ - + - \\dots$ (số hạng chứa $b$ mũ lẻ sẽ mang dấu âm!).</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_ch8_1',
        grade: 10,
        chapterId: '10_ch8',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Có bao nhiêu cách chọn một ban cán sự gồm 3 học sinh (1 lớp trưởng, 1 lớp phó, 1 bí thư) từ một tổ gồm 10 học sinh?',
        options: [
          { id: 'A', text: '$720$' },
          { id: 'B', text: '$120$' },
          { id: 'C', text: '$30$' },
          { id: 'D', text: '$1000$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Việc phân công 3 chức danh khác nhau đòi hỏi tính thứ tự.',
          'Số cách chọn là chỉnh hợp chập 3 của 10 phần tử: $A_{10}^3 = 10 \\times 9 \\times 8$.'
        ],
        solution: 'Vì 3 chức vụ khác nhau nên việc chọn có phân biệt thứ tự. Số cách chọn là $A_{10}^3 = 10 \\cdot 9 \\cdot 8 = 720$.'
      },
      {
        id: 'q10_ch8_2',
        grade: 10,
        chapterId: '10_ch8',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Tìm hệ số của số hạng chứa $x^3$ trong khai triển nhị thức Newton của $(2x - 1)^5$.',
        correctAnswer: '80',
        hints: [
          'Số hạng chứa $x^3$ trong $(a+b)^5$ có dạng $C_5^2 a^3 b^2$ hoặc tương ứng $10 \\cdot (2x)^3 \\cdot (-1)^2$.',
          'Tính hệ số: $10 \\cdot 2^3 \\cdot 1 = 10 \\cdot 8 = 80$.'
        ],
        solution: 'Trong khai triển $(2x - 1)^5$, số hạng chứa $x^3$ là: $C_5^3 (2x)^3 (-1)^2 = 10 \\cdot 8x^3 \\cdot 1 = 80x^3$. Vậy hệ số bằng 80.'
      },
      {
        id: 'q10_ch8_3',
        grade: 10,
        chapterId: '10_ch8',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Một đội văn nghệ có 6 nam và 5 nữ. Cần chọn ra một nhóm gồm 4 học sinh. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Số cách chọn 4 học sinh bất kì từ đội văn nghệ là $C_{11}^4 = 330$ cách.', isCorrect: true },
          { id: 'b', statement: 'Số cách chọn 4 học sinh toàn là nam là $C_6^4 = 15$ cách.', isCorrect: true },
          { id: 'c', statement: 'Số cách chọn 4 học sinh gồm 2 nam và 2 nữ là $C_6^2 \\times C_5^2 = 150$ cách.', isCorrect: true },
          { id: 'd', statement: 'Số cách chọn 4 học sinh có ít nhất 1 nữ bằng 300 cách.', isCorrect: false }
        ],
        hints: [
          'Chọn 4 người từ 11 người: $C_{11}^4 = \\frac{11 \\times 10 \\times 9 \\times 8}{24} = 330$.',
          'Chọn 4 nam từ 6 nam: $C_6^4 = 15$.',
          'Chọn 2 nam, 2 nữ: $C_6^2 \\times C_5^2 = 15 \\times 10 = 150$.',
          'Số cách có ít nhất 1 nữ = Tổng số cách trừ đi số cách toàn nam = $330 - 15 = 315 \\ne 300$.'
        ],
        solution: 'Ý a Đúng vì $C_{11}^4 = 330$. Ý b Đúng vì $C_6^4 = 15$. Ý c Đúng vì $C_6^2 \\cdot C_5^2 = 15 \\cdot 10 = 150$. Ý d Sai vì số cách có ít nhất 1 nữ là $330 - 15 = 315$ cách (không phải 300).'
      }
    ]
  },
  {
    id: '10_ch9',
    grade: 10,
    name: 'Chương IX: Tính xác suất theo định nghĩa cổ điển',
    lessons: [
      'Bài 26: Biến cố và định nghĩa cổ điển của xác suất',
      'Bài 27: Thực hành tính xác suất theo định nghĩa cổ điển'
    ],
    theory: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">1. Không gian mẫu & Biến cố:</div>
          <p class="text-indigo-100 leading-relaxed">• <b>Không gian mẫu $\\Omega$:</b> Tập hợp tất cả các kết quả có thể xảy ra của phép thử.</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Biến cố $A$:</b> Là tập con của không gian mẫu ($A \\subset \\Omega$).</p>
          <p class="text-indigo-100 leading-relaxed">• <b>Biến cố đối $\\bar{A}$:</b> Là biến cố "không xảy ra $A$". Khi đó $P(\\bar{A}) = 1 - P(A)$.</p>
        </div>
        <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
          <div class="font-bold text-amber-300">2. Định nghĩa cổ điển của xác suất:</div>
          <p class="text-indigo-100 leading-relaxed">• Nếu các kết quả của phép thử là đồng khả năng thì xác suất của biến cố $A$ là:</p>
          <p class="text-indigo-100 leading-relaxed text-center font-bold">$$P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{|A|}{|\\Omega|}$$</p>
          <p class="text-indigo-100 leading-relaxed">• Luôn có: $0 \\le P(A) \\le 1$; $P(\\emptyset) = 0$; $P(\\Omega) = 1$.</p>
        </div>
        <div class="md:col-span-2 bg-gradient-to-r from-amber-950/60 via-indigo-950/70 to-amber-950/60 p-3.5 rounded-xl border border-amber-400/40 space-y-1.5 shadow-xs">
          <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>⚡ KHẮC CỐT GHI TÂM (BẪY ĐỀ THI & LƯU Ý SỐNG CÒN):</span>
          </div>
          <p class="text-amber-100/90 leading-relaxed">• <b>Điều kiện đồng khả năng:</b> Công thức cổ điển $P(A) = \\frac{n(A)}{n(\\Omega)}$ CHỈ áp dụng được khi các kết quả sơ cấp có cùng khả năng xuất hiện.</p>
          <p class="text-amber-100/90 leading-relaxed">• <b>Mẹo giải biến cố đối:</b> Khi thấy từ khóa "ít nhất một", "có tối thiểu một", hãy tính biến cố đối $P(A) = 1 - P(\\bar{A})$ để rút ngắn 80% thời gian tính toán.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 'q10_ch9_1',
        grade: 10,
        chapterId: '10_ch9',
        format: 'multiple_choice_4',
        difficulty: 'Thông hiểu',
        content: 'Gieo ngẫu nhiên một con xúc xắc cân đối và đồng chất 2 lần liên tiếp. Xác suất để tổng số chấm xuất hiện trong hai lần gieo bằng 7 là:',
        options: [
          { id: 'A', text: '$\\frac{1}{6}$' },
          { id: 'B', text: '$\\frac{1}{12}$' },
          { id: 'C', text: '$\\frac{7}{36}$' },
          { id: 'D', text: '$\\frac{5}{36}$' }
        ],
        correctAnswer: 'A',
        hints: [
          'Không gian mẫu có $n(\\Omega) = 6 \\times 6 = 36$.',
          'Các cặp có tổng bằng 7: $(1;6), (2;5), (3;4), (4;3), (5;2), (6;1)$ (gồm 6 cặp).'
        ],
        solution: 'Không gian mẫu $n(\\Omega) = 36$. Các kết quả thuận lợi cho biến cố tổng bằng 7 là $\\{(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)\\}$, gồm 6 kết quả. Xác suất là $P = \\frac{6}{36} = \\frac{1}{6}$.'
      },
      {
        id: 'q10_ch9_2',
        grade: 10,
        chapterId: '10_ch9',
        format: 'short_answer',
        difficulty: 'Vận dụng',
        content: 'Một hộp chứa 5 viên bi xanh và 4 viên bi đỏ. Lấy ngẫu nhiên đồng thời 3 viên bi. Tính xác suất để lấy được ít nhất 1 viên bi đỏ (viết kết quả dưới dạng phân số tối giản a/b, ví dụ 37/42).',
        correctAnswer: '37/42',
        hints: [
          'Tổng số bi là 9. Số cách chọn 3 viên là $n(\\Omega) = C_9^3 = 84$.',
          'Dùng biến cố đối $\\bar{A}$: "Không lấy được viên bi đỏ nào" (cả 3 viên đều xanh) $\\Rightarrow n(\\bar{A}) = C_5^3 = 10$.',
          '$P(A) = 1 - \\frac{10}{84} = \\frac{74}{84} = \\frac{37}{42}$.'
        ],
        solution: 'Tổng số cách lấy 3 viên là $n(\\Omega) = C_9^3 = 84$. Số cách lấy 3 viên toàn bi xanh là $C_5^3 = 10$. Xác suất lấy được ít nhất 1 viên bi đỏ là $P = 1 - \\frac{10}{84} = \\frac{74}{84} = \\frac{37}{42}$.'
      },
      {
        id: 'q10_ch9_3',
        grade: 10,
        chapterId: '10_ch9',
        format: 'true_false_4',
        difficulty: 'Thông hiểu',
        content: 'Gieo một đồng xu cân đối và đồng chất 3 lần liên tiếp. Xét tính Đúng / Sai của các khẳng định sau:',
        subQuestions: [
          { id: 'a', statement: 'Số phần tử của không gian mẫu là $n(\\Omega) = 8$.', isCorrect: true },
          { id: 'b', statement: 'Xác suất để cả 3 lần gieo đều xuất hiện mặt ngửa bằng $\\frac{1}{8}$.', isCorrect: true },
          { id: 'c', statement: 'Xác suất để có đúng 2 lần xuất hiện mặt sấp bằng $\\frac{3}{8}$.', isCorrect: true },
          { id: 'd', statement: 'Xác suất để có ít nhất một lần xuất hiện mặt ngửa bằng $\\frac{1}{2}$.', isCorrect: false }
        ],
        hints: [
          '$n(\\Omega) = 2^3 = 8$.',
          'Biến cố cả 3 lần ngửa: $\\{NNN\\} \\Rightarrow P = \\frac{1}{8}$.',
          'Biến cố đúng 2 lần sấp: $\\{SSN, SNS, NSS\\} \\Rightarrow P = \\frac{3}{8}$.',
          'Ít nhất 1 lần ngửa = $1 - P(\\text{cả 3 sấp}) = 1 - \\frac{1}{8} = \\frac{7}{8} \\ne \\frac{1}{2}$.'
        ],
        solution: 'Ý a Đúng vì $n(\\Omega) = 2^3 = 8$. Ý b Đúng vì chỉ có 1 kết quả $\\{NNN\\}$ nên $P = \\frac{1}{8}$. Ý c Đúng vì có 3 kết quả $\\{SSN, SNS, NSS\\}$ nên $P = \\frac{3}{8}$. Ý d Sai vì biến cố đối là cả 3 lần sấp $\\{SSS\\}$, xác suất là $1 - \\frac{1}{8} = \\frac{7}{8}$.'
      }
    ]
  }
];
