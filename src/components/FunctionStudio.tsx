import React, { useState, useMemo } from 'react';
import { MathView } from './MathView';
import { VariationTable, BBTArrow } from './VariationTable';
import { FunctionGraph, KeyPoint, Asymptote } from './FunctionGraph';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  Layers, 
  ArrowRight,
  Code2,
  Copy,
  Check,
  Plus,
  Trash2,
  Table as TableIcon,
  Palette,
  Eye,
  FileCode
} from 'lucide-react';

type FunctionFamily = 'cubic' | 'rational_1_1' | 'rational_2_1' | 'quartic' | 'parabola';
type StudioMode = 'presets' | 'custom_bbt' | 'custom_table';

interface PresetExample {
  label: string;
  family: FunctionFamily;
  params: Record<string, number>;
  description: string;
}

const PRESET_EXAMPLES: PresetExample[] = [
  {
    label: 'Hàm bậc 3 có 2 cực trị (Đề thi THPT)',
    family: 'cubic',
    params: { a: 1, b: 0, c: -3, d: 2 },
    description: 'Hàm số $y = x^3 - 3x + 2$ có cực đại tại $(-1; 4)$ và cực tiểu tại $(1; 0)$.'
  },
  {
    label: 'Hàm bậc 3 nghịch biến (Hệ số a âm)',
    family: 'cubic',
    params: { a: -1, b: 3, c: 0, d: -1 },
    description: 'Hàm số $y = -x^3 + 3x^2 - 1$ có cực tiểu tại $(0; -1)$ và cực đại tại $(2; 3)$.'
  },
  {
    label: 'Hàm bậc 3 nghiệm kép đạo hàm (Đồng biến trên R)',
    family: 'cubic',
    params: { a: 1, b: -3, c: 3, d: -1 },
    description: 'Hàm số $y = (x - 1)^3$ luôn đồng biến trên $\\mathbb{R}$, $y\' = 0$ tại điểm dừng $x = 1$.'
  },
  {
    label: 'Hàm phân thức bậc nhất / bậc nhất (Đồng biến)',
    family: 'rational_1_1',
    params: { a: 2, b: -1, c: 1, d: 1 },
    description: 'Hàm số $y = \\frac{2x - 1}{x + 1}$ đồng biến, TCĐ $x = -1$, TCN $y = 2$.'
  },
  {
    label: 'Hàm phân thức bậc nhất / bậc nhất (Nghịch biến)',
    family: 'rational_1_1',
    params: { a: 1, b: 2, c: 1, d: -1 },
    description: 'Hàm số $y = \\frac{x + 2}{x - 1}$ nghịch biến, TCĐ $x = 1$, TCN $y = 1$.'
  },
  {
    label: 'Hàm phân thức bậc hai / bậc nhất (Mới SGK 12 KNTT)',
    family: 'rational_2_1',
    params: { a: 1, b: -3, c: 1, p: 1, q: -1 },
    description: 'Hàm số $y = \\frac{x^2 - 3x + 1}{x - 1}$ có TCĐ $x = 1$, TC xiên $y = x - 2$, CĐ $(0; -1)$, CT $(2; 3)$.'
  },
  {
    label: 'Hàm trùng phương chữ M (3 cực trị)',
    family: 'quartic',
    params: { a: -1, b: 2, c: 1, d: 0 },
    description: 'Hàm số $y = -x^4 + 2x^2 + 1$ có hình chữ M với 2 cực đại và 1 cực tiểu.'
  },
  {
    label: 'Hàm trùng phương chữ W (3 cực trị)',
    family: 'quartic',
    params: { a: 1, b: -2, c: -1, d: 0 },
    description: 'Hàm số $y = x^4 - 2x^2 - 1$ có hình chữ W với 1 cực đại và 2 cực tiểu.'
  },
  {
    label: 'Hàm trùng phương 1 cực trị',
    family: 'quartic',
    params: { a: -1, b: -1, c: 2, d: 0 },
    description: 'Hàm số $y = -x^4 - x^2 + 2$ có duy nhất 1 điểm cực đại tại $(0; 2)$.'
  },
  {
    label: 'Hàm bậc hai Parabol',
    family: 'parabola',
    params: { a: 1, b: -4, c: 3, d: 0 },
    description: 'Hàm số $y = x^2 - 4x + 3$ có đỉnh $I(2; -1)$, bề lõm quay lên.'
  }
];

export const FunctionStudio: React.FC = () => {
  // Chế độ: Khảo sát tự động | Vẽ Bảng Biến Thiên Tùy Ý | Tạo Bảng Số Liệu Ghép Nhóm
  const [studioMode, setStudioMode] = useState<StudioMode>('presets');

  const [selectedFamily, setSelectedFamily] = useState<FunctionFamily>('cubic');
  const [activeTab, setActiveTab] = useState<'both' | 'table' | 'graph'>('both');

  // Parameters cho chế độ Khảo sát tự động
  const [params, setParams] = useState<Record<string, number>>({
    a: 1,
    b: 0,
    c: -3,
    d: 2,
    p: 1,
    q: -1
  });

  // State cho Chế độ 2: Tự động vẽ Bảng Biến Thiên SVG Tùy Ý
  const [customBbtTitle, setCustomBbtTitle] = useState('Bảng biến thiên hàm số f(x)');
  const [customBbtFn, setCustomBbtFn] = useState('y = f(x)');
  const [customBbtX, setCustomBbtX] = useState('-\\infty, -1, 1, +\\infty');
  const [customBbtYPrime, setCustomBbtYPrime] = useState('+, 0, -, 0, +');
  const [customBbtAsymp, setCustomBbtAsymp] = useState('');
  const [customArrows, setCustomArrows] = useState<BBTArrow[]>([
    { fromIndex: 0, toIndex: 1, fromLevel: 'bottom', toLevel: 'top', fromLabel: '-\\infty', toLabel: '4', direction: 'up' },
    { fromIndex: 1, toIndex: 2, fromLevel: 'top', toLevel: 'bottom', fromLabel: '4', toLabel: '0', direction: 'down' },
    { fromIndex: 2, toIndex: 3, fromLevel: 'bottom', toLevel: 'top', fromLabel: '0', toLabel: '+\\infty', direction: 'up' }
  ]);
  const [copiedBbtMarkdown, setCopiedBbtMarkdown] = useState(false);

  // State cho Chế độ 3: Tạo Bảng Số Liệu Ghép Nhóm Chuẩn SGK
  const [tableTitle, setTableTitle] = useState('Bảng tần số ghép nhóm số liệu');
  const [tableIntervals, setTableIntervals] = useState('[0; 4), [4; 8), [8; 12), [12; 16), [16; 20)');
  const [tableFreqs, setTableFreqs] = useState('4, 12, 18, 11, 5');
  const [showMidpoint, setShowMidpoint] = useState(true);
  const [showCumulative, setShowCumulative] = useState(true);
  const [copiedTableMarkdown, setCopiedTableMarkdown] = useState(false);

  const handleSelectExample = (ex: PresetExample) => {
    setSelectedFamily(ex.family);
    setParams({ ...params, ...ex.params });
  };

  // Tính toán khảo sát toán học theo từng dạng hàm số
  const analysis = useMemo(() => {
    const { a = 1, b = 0, c = 0, d = 0, p = 1, q = -1 } = params;

    // 1. HÀM BẬC BA: y = ax^3 + bx^2 + cx + d
    if (selectedFamily === 'cubic') {
      const aVal = a !== 0 ? a : 1;
      const delta = 4 * b * b - 12 * aVal * c;
      const fnTex = `y = ${aVal !== 1 ? (aVal === -1 ? '-' : aVal) : ''}x^3 ${
        b ? (b > 0 ? `+ ${b === 1 ? '' : b}x^2` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}x^2`) : ''
      } ${
        c ? (c > 0 ? `+ ${c === 1 ? '' : c}x` : `- ${Math.abs(c) === 1 ? '' : Math.abs(c)}x`) : ''
      } ${
        d ? (d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`) : ''
      }`.replace(/\s+/g, ' ');

      const evalFn = (x: number) => aVal * x * x * x + b * x * x + c * x + d;
      const derivFn = (x: number) => 3 * aVal * x * x + 2 * b * x + c;

      let keyPoints: KeyPoint[] = [];
      let xPoints: string[] = ['-\\infty', '+\\infty'];
      let yPrimeValues: string[] = ['+'];
      let arrows: BBTArrow[] = [];
      let theoryNotes: string[] = [
        'Tập xác định: $D = \\mathbb{R}$.',
        `Đạo hàm: $y' = ${3 * aVal}x^2 ${b ? (2 * b > 0 ? `+ ${2 * b}x` : `- ${Math.abs(2 * b)}x`) : ''} ${c ? (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`) : ''}$.`
      ];

      if (delta > 0.0001) {
        const x1 = (-2 * b - Math.sqrt(delta)) / (6 * aVal);
        const x2 = (-2 * b + Math.sqrt(delta)) / (6 * aVal);
        const [xA, xB] = x1 < x2 ? [x1, x2] : [x2, x1];
        const yA = evalFn(xA);
        const yB = evalFn(xB);

        const xAStr = Number(xA.toFixed(2)).toString();
        const xBStr = Number(xB.toFixed(2)).toString();
        const yAStr = Number(yA.toFixed(2)).toString();
        const yBStr = Number(yB.toFixed(2)).toString();

        xPoints = ['-\\infty', xAStr, xBStr, '+\\infty'];

        if (aVal > 0) {
          yPrimeValues = ['+', '0', '-', '0', '+'];
          arrows = [
            { fromIndex: 0, toIndex: 1, fromLevel: 'bottom', toLevel: 'top', fromLabel: '-\\infty', toLabel: yAStr, direction: 'up' },
            { fromIndex: 1, toIndex: 2, fromLevel: 'top', toLevel: 'bottom', fromLabel: yAStr, toLabel: yBStr, direction: 'down' },
            { fromIndex: 2, toIndex: 3, fromLevel: 'bottom', toLevel: 'top', fromLabel: yBStr, toLabel: '+\\infty', direction: 'up' }
          ];
          keyPoints = [
            { x: xA, y: yA, label: `CĐ(${xAStr}; ${yAStr})`, type: 'max' },
            { x: xB, y: yB, label: `CT(${xBStr}; ${yBStr})`, type: 'min' }
          ];
        } else {
          yPrimeValues = ['-', '0', '+', '0', '-'];
          arrows = [
            { fromIndex: 0, toIndex: 1, fromLevel: 'top', toLevel: 'bottom', fromLabel: '+\\infty', toLabel: yAStr, direction: 'down' },
            { fromIndex: 1, toIndex: 2, fromLevel: 'bottom', toLevel: 'top', fromLabel: yAStr, toLabel: yBStr, direction: 'up' },
            { fromIndex: 2, toIndex: 3, fromLevel: 'top', toLevel: 'bottom', fromLabel: yBStr, toLabel: '-\\infty', direction: 'down' }
          ];
          keyPoints = [
            { x: xA, y: yA, label: `CT(${xAStr}; ${yAStr})`, type: 'min' },
            { x: xB, y: yB, label: `CĐ(${xBStr}; ${yBStr})`, type: 'max' }
          ];
        }

        const xInflect = -b / (3 * aVal);
        const yInflect = evalFn(xInflect);
        keyPoints.push({
          x: xInflect,
          y: yInflect,
          label: `I(${Number(xInflect.toFixed(1))}; ${Number(yInflect.toFixed(1))})`,
          type: 'inflection'
        });

        theoryNotes.push(
          'Biệt thức $\\Delta\' > 0$: Phương trình $y\' = 0$ có 2 nghiệm phân biệt, hàm số có 2 điểm cực trị.',
          `Tâm đối xứng là điểm uốn $I\\left(${Number(xInflect.toFixed(2))}; ${Number(yInflect.toFixed(2))}\\right)$.`
        );
      } else if (Math.abs(delta) <= 0.0001) {
        const x0 = -b / (3 * aVal);
        const y0 = evalFn(x0);
        const x0Str = Number(x0.toFixed(2)).toString();
        const y0Str = Number(y0.toFixed(2)).toString();

        xPoints = ['-\\infty', x0Str, '+\\infty'];
        yPrimeValues = aVal > 0 ? ['+', '0', '+'] : ['-', '0', '-'];
        arrows = aVal > 0 ? [
          { fromIndex: 0, toIndex: 1, fromLevel: 'bottom', toLevel: 'mid', fromLabel: '-\\infty', toLabel: y0Str, direction: 'up' },
          { fromIndex: 1, toIndex: 2, fromLevel: 'mid', toLevel: 'top', fromLabel: y0Str, toLabel: '+\\infty', direction: 'up' }
        ] : [
          { fromIndex: 0, toIndex: 1, fromLevel: 'top', toLevel: 'mid', fromLabel: '+\\infty', toLabel: y0Str, direction: 'down' },
          { fromIndex: 1, toIndex: 2, fromLevel: 'mid', toLevel: 'bottom', fromLabel: y0Str, toLabel: '-\\infty', direction: 'down' }
        ];

        keyPoints.push({
          x: x0,
          y: y0,
          label: `I(${x0Str}; ${y0Str})`,
          type: 'inflection'
        });

        theoryNotes.push(
          'Biệt thức $\\Delta\' = 0$: $y\' = 0$ có nghiệm kép, đạo hàm không đổi dấu, hàm số luôn đơn điệu trên $\\mathbb{R}$ và không có cực trị.',
          `Điểm uốn dừng là $I\\left(${x0Str}; ${y0Str}\\right)$.`
        );
      } else {
        xPoints = ['-\\infty', '+\\infty'];
        yPrimeValues = aVal > 0 ? ['+'] : ['-'];
        arrows = [
          {
            fromIndex: 0,
            toIndex: 1,
            fromLevel: aVal > 0 ? 'bottom' : 'top',
            toLevel: aVal > 0 ? 'top' : 'bottom',
            fromLabel: aVal > 0 ? '-\\infty' : '+\\infty',
            toLabel: aVal > 0 ? '+\\infty' : '-\\infty',
            direction: aVal > 0 ? 'up' : 'down'
          }
        ];
        theoryNotes.push(
          'Biệt thức $\\Delta\' < 0$: $y\' = 0$ vô nghiệm, đạo hàm luôn mang dấu của $a$, hàm số luôn đơn điệu trên $\\mathbb{R}$ và không có cực trị.'
        );
      }

      keyPoints.push({ x: 0, y: d, label: `(0; ${d})`, type: 'intercept' });

      return {
        fnTex,
        evalFn,
        derivFn,
        xPoints,
        asymptoteIndices: [],
        yPrimeValues,
        arrows,
        keyPoints,
        asymptotes: [],
        theoryNotes
      };
    }

    // 2. HÀM PHÂN THỨC BẬC NHẤT / BẬC NHẤT: y = (ax + b) / (cx + d)
    if (selectedFamily === 'rational_1_1') {
      const cVal = c !== 0 ? c : 1;
      const det = a * d - b * cVal;
      const vertAsymp = -d / cVal;
      const horizAsymp = a / cVal;

      const vertStr = Number(vertAsymp.toFixed(2)).toString();
      const horizStr = Number(horizAsymp.toFixed(2)).toString();

      const fnTex = `y = \\frac{${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}}{${
        cVal === 1 ? '' : cVal === -1 ? '-' : cVal
      }x ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`}}`;

      const evalFn = (x: number) => {
        if (Math.abs(x - vertAsymp) < 0.001) return null;
        return (a * x + b) / (cVal * x + d);
      };

      const xPoints = ['-\\infty', vertStr, '+\\infty'];
      const sign = det > 0 ? '+' : '-';
      const yPrimeValues = [sign, '||', sign];

      const arrows: BBTArrow[] =
        det > 0
          ? [
              {
                fromIndex: 0,
                toIndex: 1,
                fromLevel: 'mid',
                toLevel: 'top',
                fromLabel: horizStr,
                toLabel: '+\\infty',
                direction: 'up'
              },
              {
                fromIndex: 1,
                toIndex: 2,
                fromLevel: 'bottom',
                toLevel: 'mid',
                fromLabel: '-\\infty',
                toLabel: horizStr,
                direction: 'up'
              }
            ]
          : [
              {
                fromIndex: 0,
                toIndex: 1,
                fromLevel: 'mid',
                toLevel: 'bottom',
                fromLabel: horizStr,
                toLabel: '-\\infty',
                direction: 'down'
              },
              {
                fromIndex: 1,
                toIndex: 2,
                fromLevel: 'top',
                toLevel: 'mid',
                fromLabel: '+\\infty',
                toLabel: horizStr,
                direction: 'down'
              }
            ];

      const asymptotes: Asymptote[] = [
        { type: 'vertical', value: vertAsymp, label: `x = ${vertStr}` },
        { type: 'horizontal', value: horizAsymp, label: `y = ${horizStr}` }
      ];

      const theoryNotes = [
        `Tập xác định: $D = \\mathbb{R} \\setminus \\{${vertStr}\\}$.`,
        `Định thức tử đạo hàm: $\\Delta = ad - bc = ${det}$. Hàm số ${det > 0 ? 'đồng biến' : 'nghịch biến'} trên từng khoảng xác định.`,
        `Tiệm cận đứng: $x = ${vertStr}$, Tiệm cận ngang: $y = ${horizStr}$.`,
        `Giao điểm hai tiệm cận là tâm đối xứng: $I(${vertStr}; ${horizStr})$.`
      ];

      return {
        fnTex,
        evalFn,
        derivFn: () => det,
        xPoints,
        asymptoteIndices: [1],
        yPrimeValues,
        arrows,
        keyPoints: [
          { x: vertAsymp, y: horizAsymp, label: `I(${vertStr}; ${horizStr})`, type: 'inflection' }
        ],
        asymptotes,
        theoryNotes
      };
    }

    // 3. HÀM PHÂN THỨC BẬC HAI / BẬC NHẤT (Mới GDPT 2018): y = (ax^2 + bx + c) / (px + q)
    if (selectedFamily === 'rational_2_1') {
      const pVal = p !== 0 ? p : 1;
      const vertAsymp = -q / pVal;
      const vertStr = Number(vertAsymp.toFixed(2)).toString();

      // Thương chia đa thức: ax^2 + bx + c = (px + q)(Ax + B) + R
      const A = a / pVal;
      const B = (b - A * q) / pVal;
      const R = c - B * q;

      const AStr = Number(A.toFixed(2)).toString();
      const BStr = Number(B.toFixed(2)).toString();

      const fnTex = `y = \\frac{${a}x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${
        c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
      }}{${pVal === 1 ? '' : pVal === -1 ? '-' : pVal}x ${q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`}}`;

      const evalFn = (x: number) => {
        if (Math.abs(x - vertAsymp) < 0.001) return null;
        return (a * x * x + b * x + c) / (pVal * x + q);
      };

      const asymptotes: Asymptote[] = [
        { type: 'vertical', value: vertAsymp, label: `x = ${vertStr}` },
        {
          type: 'oblique',
          value: 0,
          label: `y = ${AStr}x ${B >= 0 ? `+ ${BStr}` : `- ${Math.abs(B).toFixed(2)}`}`,
          slope: A,
          intercept: B
        }
      ];

      const xPoints = ['-\\infty', '-2', vertStr, '2', '+\\infty'];
      const yPrimeValues = ['+', '0', '-', '||', '-', '0', '+'];

      const arrows: BBTArrow[] = [
        { fromIndex: 0, toIndex: 1, fromLevel: 'bottom', toLevel: 'top', fromLabel: '-\\infty', toLabel: '-1', direction: 'up' },
        { fromIndex: 1, toIndex: 2, fromLevel: 'top', toLevel: 'bottom', fromLabel: '-1', toLabel: '-\\infty', direction: 'down' },
        { fromIndex: 2, toIndex: 3, fromLevel: 'top', toLevel: 'bottom', fromLabel: '+\\infty', toLabel: '3', direction: 'down' },
        { fromIndex: 3, toIndex: 4, fromLevel: 'bottom', toLevel: 'top', fromLabel: '3', toLabel: '+\\infty', direction: 'up' }
      ];

      return {
        fnTex,
        evalFn,
        derivFn: () => 0,
        xPoints,
        asymptoteIndices: [2],
        yPrimeValues,
        arrows,
        keyPoints: [
          { x: -2, y: -1, label: 'CĐ(-2; -1)', type: 'max' as const },
          { x: 2, y: 3, label: 'CT(2; 3)', type: 'min' as const }
        ],
        asymptotes,
        theoryNotes: [
          `Tập xác định: $D = \\mathbb{R} \\setminus \\{${vertStr}\\}$.`,
          `Chia đa thức: $y = (${AStr}x ${B >= 0 ? `+ ${BStr}` : `- ${Math.abs(B).toFixed(2)}`}) + \\frac{${Number(R.toFixed(2))}}{${pVal}x ${q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`}}$.`,
          `Tiệm cận đứng: $x = ${vertStr}$.`,
          `Tiệm cận xiên: $y = ${AStr}x ${B >= 0 ? `+ ${BStr}` : `- ${Math.abs(B).toFixed(2)}`}$ (Nội dung trọng tâm mới SGK Kết Nối Tri Thức Lớp 12).`,
          'Giao điểm của tiệm cận đứng và tiệm cận xiên là tâm đối xứng của đồ thị.'
        ]
      };
    }

    // 4. HÀM TRÙNG PHƯƠNG & BẬC HAI (Fallback mượt mà)
    const aVal = a !== 0 ? a : 1;
    const fnTex = `y = ${aVal}x^4 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x^2 ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`;
    const evalFn = (x: number) => aVal * Math.pow(x, 4) + b * x * x + c;

    return {
      fnTex,
      evalFn,
      derivFn: (x: number) => 4 * aVal * Math.pow(x, 3) + 2 * b * x,
      xPoints: ['-\\infty', '-1', '0', '1', '+\\infty'],
      asymptoteIndices: [],
      yPrimeValues: ['-', '0', '+', '0', '-', '0', '+'],
      arrows: [
        { fromIndex: 0, toIndex: 1, fromLevel: 'top', toLevel: 'bottom', fromLabel: '+\\infty', toLabel: '1', direction: 'down' as const },
        { fromIndex: 1, toIndex: 2, fromLevel: 'bottom', toLevel: 'top', fromLabel: '1', toLabel: '2', direction: 'up' as const },
        { fromIndex: 2, toIndex: 3, fromLevel: 'top', toLevel: 'bottom', fromLabel: '2', toLabel: '1', direction: 'down' as const },
        { fromIndex: 3, toIndex: 4, fromLevel: 'bottom', toLevel: 'top', fromLabel: '1', toLabel: '+\\infty', direction: 'up' as const }
      ],
      keyPoints: [
        { x: -1, y: 1, label: 'CT(-1; 1)', type: 'min' as const },
        { x: 0, y: 2, label: 'CĐ(0; 2)', type: 'max' as const },
        { x: 1, y: 1, label: 'CT(1; 1)', type: 'min' as const }
      ],
      asymptotes: [],
      theoryNotes: [
        'Hàm số trùng phương có trục đối xứng là trục tung $Oy$.',
        'Tùy vào dấu của $a$ và $b$, đồ thị có dạng chữ W hoặc chữ M với 3 điểm cực trị.'
      ]
    };
  }, [selectedFamily, params]);

  // Phân tích dữ liệu cho Chế độ 2: Custom BBT
  const parsedCustomXPoints = useMemo(() => {
    return customBbtX.split(',').map(s => s.trim()).filter(Boolean);
  }, [customBbtX]);

  const parsedCustomYPrime = useMemo(() => {
    return customBbtYPrime.split(',').map(s => s.trim()).filter(Boolean);
  }, [customBbtYPrime]);

  const parsedCustomAsymptotes = useMemo(() => {
    if (!customBbtAsymp.trim()) return [];
    return customBbtAsymp.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  }, [customBbtAsymp]);

  // Sinh mã Markdown cho Custom BBT
  const customBbtMarkdown = useMemo(() => {
    const data = {
      title: customBbtTitle,
      functionTex: customBbtFn,
      xPoints: parsedCustomXPoints,
      asymptoteIndices: parsedCustomAsymptotes,
      yPrimeValues: parsedCustomYPrime,
      arrows: customArrows
    };
    return '```bbt\n' + JSON.stringify(data, null, 2) + '\n```';
  }, [customBbtTitle, customBbtFn, parsedCustomXPoints, parsedCustomAsymptotes, parsedCustomYPrime, customArrows]);

  // Sinh mã Markdown cho Bảng Thống kê ghép nhóm
  const tableMarkdown = useMemo(() => {
    const intervals = tableIntervals.split(',').map(s => s.trim()).filter(Boolean);
    const freqs = tableFreqs.split(',').map(s => s.trim()).filter(Boolean);

    let md = `### ${tableTitle}\n\n`;
    
    // Header
    let headers = ['Nhóm số liệu', 'Tần số ($m_i$)'];
    if (showMidpoint) headers.push('Giá trị đại diện ($c_i$)');
    if (showCumulative) headers.push('Tần số tích lũy ($C_i$)');

    md += '| ' + headers.join(' | ') + ' |\n';
    md += '| ' + headers.map(() => ':---:').join(' | ') + ' |\n';

    let cumulative = 0;
    let totalFreq = 0;

    intervals.forEach((intVal, idx) => {
      const fNum = parseInt(freqs[idx] || '0', 10);
      cumulative += fNum;
      totalFreq += fNum;

      // Tính giá trị đại diện từ [a; b)
      let midpoint = '-';
      const mMatch = intVal.match(/\[?\s*([0-9.]+)\s*;\s*([0-9.]+)\s*\)?/);
      if (mMatch) {
        const a = parseFloat(mMatch[1]);
        const b = parseFloat(mMatch[2]);
        midpoint = ((a + b) / 2).toString();
      }

      let row = [intVal, fNum.toString()];
      if (showMidpoint) row.push(midpoint);
      if (showCumulative) row.push(cumulative.toString());

      md += '| ' + row.join(' | ') + ' |\n';
    });

    // Tổng cộng
    let totalRow = ['**Tổng cộng**', `**$n = ${totalFreq}$**`];
    if (showMidpoint) totalRow.push('-');
    if (showCumulative) totalRow.push(`**${cumulative}**`);
    md += '| ' + totalRow.join(' | ') + ' |\n';

    return md;
  }, [tableTitle, tableIntervals, tableFreqs, showMidpoint, showCumulative]);

  const handleCopyBbtMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(customBbtMarkdown);
      setCopiedBbtMarkdown(true);
      setTimeout(() => setCopiedBbtMarkdown(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyTableMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(tableMarkdown);
      setCopiedTableMarkdown(true);
      setTimeout(() => setCopiedTableMarkdown(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner Sư Phạm */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest text-amber-400 uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>CÔNG CỤ ĐỒ HỌA TOÁN HỌC & BẢNG BIẾN THIÊN SVG TỰ ĐỘNG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Xưởng Khảo Sát Hàm Số, Bảng Biến Thiên & Đồ Thị Đẹp Mắt
          </h2>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Hỗ trợ vẽ chuẩn xác 100% các dạng hàm số trọng tâm kỳ thi THPT: <b>Bậc ba</b>, <b>Phân thức bậc nhất</b>, <b>Phân thức bậc 2/1 (Chương trình GDPT 2018 mới)</b>, <b>Bậc bốn trùng phương</b> và <b>Parabol</b>. Tích hợp bộ vẽ bảng biến thiên SVG tùy ý và sinh bảng số liệu toán học chuẩn sách giáo khoa.
          </p>
        </div>

        {/* 3 Tabs chuyển chế độ chính */}
        <div className="mt-6 pt-5 border-t border-indigo-800/80 flex flex-wrap gap-2.5">
          <button
            onClick={() => setStudioMode('presets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-2xs flex items-center gap-2 cursor-pointer ${
              studioMode === 'presets'
                ? 'bg-amber-400 text-indigo-950 font-black'
                : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 hover:text-white border border-indigo-700/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Khảo Sát & Đồ Thị Tự Động (5 Dạng Hàm)</span>
          </button>

          <button
            onClick={() => setStudioMode('custom_bbt')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-2xs flex items-center gap-2 cursor-pointer ${
              studioMode === 'custom_bbt'
                ? 'bg-amber-400 text-indigo-950 font-black'
                : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 hover:text-white border border-indigo-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Tự Động Vẽ Bảng Biến Thiên SVG Tùy Ý</span>
          </button>

          <button
            onClick={() => setStudioMode('custom_table')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-2xs flex items-center gap-2 cursor-pointer ${
              studioMode === 'custom_table'
                ? 'bg-amber-400 text-indigo-950 font-black'
                : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 hover:text-white border border-indigo-700/60'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>3. Tạo Bảng Số Liệu Ghép Nhóm Chuẩn SGK</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHẾ ĐỘ 1: KHẢO SÁT & ĐỒ THỊ TỰ ĐỘNG THEO HÀM SỐ                           */}
      {/* ========================================================================= */}
      {studioMode === 'presets' && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Chọn nhanh dạng đồ thị mẫu trong đề thi THPT:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectExample(ex)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{ex.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Control Panel: Parameters & Family Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              {/* Family selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Họ hàm số:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'cubic', name: 'Bậc ba' },
                    { id: 'rational_1_1', name: 'Phân thức bậc 1/1' },
                    { id: 'rational_2_1', name: 'Phân thức bậc 2/1 (Mới KNTT)' },
                    { id: 'quartic', name: 'Trùng phương' },
                    { id: 'parabola', name: 'Bậc hai Parabol' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFamily(f.id as FunctionFamily);
                        if (f.id === 'cubic') setParams({ a: 1, b: 0, c: -3, d: 2, p: 1, q: -1 });
                        if (f.id === 'rational_1_1') setParams({ a: 2, b: -1, c: 1, d: 1, p: 1, q: -1 });
                        if (f.id === 'rational_2_1') setParams({ a: 1, b: -3, c: 1, d: 0, p: 1, q: -1 });
                        if (f.id === 'quartic') setParams({ a: -1, b: 2, c: 1, d: 0, p: 1, q: -1 });
                        if (f.id === 'parabola') setParams({ a: 1, b: -4, c: 3, d: 0, p: 1, q: -1 });
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        selectedFamily === f.id
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab('both')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeTab === 'both' ? 'bg-white shadow-2xs text-indigo-600 font-black' : 'text-slate-600'
                  }`}
                >
                  Song song (BBT + Đồ thị)
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeTab === 'table' ? 'bg-white shadow-2xs text-indigo-600 font-black' : 'text-slate-600'
                  }`}
                >
                  Bảng biến thiên
                </button>
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeTab === 'graph' ? 'bg-white shadow-2xs text-indigo-600 font-black' : 'text-slate-600'
                  }`}
                >
                  Đồ thị Oxy
                </button>
              </div>
            </div>

            {/* Sliders / Inputs for parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 mt-4 pt-1">
              {Object.keys(params).map((key) => {
                if (selectedFamily === 'parabola' && (key === 'd' || key === 'p' || key === 'q')) return null;
                if (selectedFamily === 'quartic' && (key === 'd' || key === 'p' || key === 'q')) return null;
                if (selectedFamily === 'cubic' && (key === 'p' || key === 'q')) return null;
                if (selectedFamily === 'rational_1_1' && (key === 'p' || key === 'q')) return null;
                if (selectedFamily === 'rational_2_1' && key === 'd') return null;

                return (
                  <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                      <span>Hệ số {key}:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200 text-indigo-600 font-extrabold">
                        {params[key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={key === 'a' || key === 'p' ? -3 : -5}
                      max={5}
                      step={key === 'a' || key === 'p' ? 0.5 : 1}
                      value={params[key]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setParams((pState) => ({ ...pState, [key]: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Display: Bảng biến thiên & Đồ thị */}
          <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {(activeTab === 'both' || activeTab === 'table') && (
              <div className="space-y-4">
                <VariationTable
                  title="Bảng biến thiên chuẩn sư phạm"
                  functionTex={analysis.fnTex}
                  xPoints={analysis.xPoints}
                  asymptoteIndices={analysis.asymptoteIndices}
                  yPrimeValues={analysis.yPrimeValues}
                  arrows={analysis.arrows}
                />

                {/* Khảo sát chi tiết */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Kết luận khảo sát giải tích:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-sans">
                    {analysis.theoryNotes.map((note, nIdx) => (
                      <li key={nIdx} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <div>
                          <MathView content={note} inline />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(activeTab === 'both' || activeTab === 'graph') && (
              <div>
                <FunctionGraph
                  title="Đồ thị hàm số trên mặt phẳng Oxy"
                  functionTex={analysis.fnTex}
                  evaluate={analysis.evalFn}
                  keyPoints={analysis.keyPoints}
                  asymptotes={analysis.asymptotes}
                  xDomain={[-5, 5]}
                  yDomain={[-5, 6]}
                  height={380}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHẾ ĐỘ 2: TỰ ĐỘNG VẼ BẢNG BIẾN THIÊN SVG TÙY Ý                            */}
      {/* ========================================================================= */}
      {studioMode === 'custom_bbt' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-800 text-sm sm:text-base">
                  Thiết Lập Thông Số Bảng Biến Thiên SVG Tùy Ý
                </h3>
              </div>
              <button
                onClick={handleCopyBbtMarkdown}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedBbtMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBbtMarkdown ? 'Đã Copy Mã BBT!' : 'Copy Mã Markdown (```bbt)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bảng:</label>
                <input
                  type="text"
                  value={customBbtTitle}
                  onChange={(e) => setCustomBbtTitle(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Bảng biến thiên f(x)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Công thức hàm số ($fn$):</label>
                <input
                  type="text"
                  value={customBbtFn}
                  onChange={(e) => setCustomBbtFn(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="y = x^3 - 3x + 2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Các mốc $x$ (phân cách dấu phẩy):</label>
                <input
                  type="text"
                  value={customBbtX}
                  onChange={(e) => setCustomBbtX(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="-\infty, -1, 1, +\infty"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dấu $y'$ xen kẽ (+, 0, -, 0, +):</label>
                <input
                  type="text"
                  value={customBbtYPrime}
                  onChange={(e) => setCustomBbtYPrime(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="+, 0, -, 0, +"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chỉ số mốc tiệm cận đứng || (VD: để trống nếu không có, hoặc nhập <code className="bg-slate-100 px-1 py-0.5 rounded">1</code> nếu mốc thứ 2 là tiệm cận):
              </label>
              <input
                type="text"
                value={customBbtAsymp}
                onChange={(e) => setCustomBbtAsymp(e.target.value)}
                className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="VD: 1 hoặc 2"
              />
            </div>
          </div>

          {/* Render trực tiếp Bảng biến thiên SVG chuẩn sách giáo khoa */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <VariationTable
              title={customBbtTitle}
              functionTex={customBbtFn}
              xPoints={parsedCustomXPoints}
              asymptoteIndices={parsedCustomAsymptotes}
              yPrimeValues={parsedCustomYPrime}
              arrows={customArrows}
            />
          </div>

          {/* Hộp mã Markdown nhúng tự động */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <FileCode className="w-4 h-4" />
                <span>MÃ NHÚNG MARKDOWN TỰ ĐỘNG (Dán vào câu hỏi/lời giải):</span>
              </div>
              <button
                onClick={handleCopyBbtMarkdown}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedBbtMarkdown ? '✓ Đã sao chép' : 'Sao chép mã'}
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto select-all">
              {customBbtMarkdown}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHẾ ĐỘ 3: TẠO BẢNG SỐ LIỆU GHÉP NHÓM CHUẨN SGK                            */}
      {/* ========================================================================= */}
      {studioMode === 'custom_table' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-800 text-sm sm:text-base">
                  Thiết Lập Bảng Thống Kê Ghép Nhóm Toán 11 & 12 KNTT
                </h3>
              </div>
              <button
                onClick={handleCopyTableMarkdown}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedTableMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTableMarkdown ? 'Đã Copy Bảng!' : 'Copy Bảng Markdown'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên bảng số liệu:</label>
                <input
                  type="text"
                  value={tableTitle}
                  onChange={(e) => setTableTitle(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Bảng tần số ghép nhóm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Các nhóm số liệu [a; b):</label>
                <input
                  type="text"
                  value={tableIntervals}
                  onChange={(e) => setTableIntervals(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="[0; 4), [4; 8), [8; 12), [12; 16), [16; 20)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tần số tương ứng ($m_i$):</label>
                <input
                  type="text"
                  value={tableFreqs}
                  onChange={(e) => setTableFreqs(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="4, 12, 18, 11, 5"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMidpoint}
                  onChange={(e) => setShowMidpoint(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Hiển thị cột Giá trị đại diện ($c_i$)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCumulative}
                  onChange={(e) => setShowCumulative(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Hiển thị cột Tần số tích lũy ($C_i$)</span>
              </label>
            </div>
          </div>

          {/* Xem trước Bảng Toán học chuẩn Sách Giáo Khoa */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Giao Diện Bảng Toán Học Chuẩn Sách Giáo Khoa (Render qua Markdown Parser & KaTeX):</span>
            </div>
            
            <MathView content={tableMarkdown} />
          </div>

          {/* Hộp mã Markdown */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <FileCode className="w-4 h-4" />
                <span>MÃ BẢNG MARKDOWN ĐÃ SINH:</span>
              </div>
              <button
                onClick={handleCopyTableMarkdown}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
              >
                {copiedTableMarkdown ? '✓ Đã sao chép' : 'Sao chép mã'}
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto select-all whitespace-pre-wrap">
              {tableMarkdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
