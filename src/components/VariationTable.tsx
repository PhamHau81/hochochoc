import React, { useState, useId, useRef } from 'react';
import { MathView } from './MathView';
import { Copy, Check, Palette, Sparkles, Code2, Download } from 'lucide-react';

export interface BBTXPoint {
  label: string; // vd: "-\\infty", "-1", "1", "+\\infty"
  isAsymptote?: boolean; // Tiệm cận đứng ||
}

export interface BBTYPrimeInterval {
  sign: '+' | '-' | '';
}

export interface BBTYPrimePoint {
  val: '0' | '||' | '';
}

export interface BBTYNode {
  label: string;
  level: 'top' | 'mid-high' | 'mid' | 'mid-low' | 'bottom'; // độ cao
}

export interface BBTArrow {
  fromIndex: number;
  toIndex: number;
  fromLevel: 'top' | 'mid-high' | 'mid' | 'mid-low' | 'bottom';
  toLevel: 'top' | 'mid-high' | 'mid' | 'mid-low' | 'bottom';
  fromLabel: string;
  toLabel: string;
  direction: 'up' | 'down';
}

export interface VariationTableProps {
  title?: string;
  functionTex?: string;
  xPoints: string[]; // [ "-\\infty", "x_1", "x_2", "+\\infty" ]
  asymptoteIndices?: number[]; // Các chỉ số x là tiệm cận đứng ||
  yPrimeValues: string[]; // xen kẽ: [ "+", "0", "-", "0", "+" ] hoặc chỉ định
  arrows: BBTArrow[];
  className?: string;
  variableName?: string; // Mặc định: 'x'
  derivativeName?: string; // Mặc định: "y'" hoặc "f'(x)"
  functionName?: string; // Mặc định: "y" hoặc "f(x)"
  showToolbar?: boolean;
}

export const VariationTable: React.FC<VariationTableProps> = ({
  title = 'Bảng biến thiên chuẩn sư phạm',
  functionTex,
  xPoints,
  asymptoteIndices = [],
  yPrimeValues,
  arrows,
  className = '',
  variableName = 'x',
  derivativeName,
  functionName,
  showToolbar = true
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Giao diện: 'sgk' (chuẩn mực mực in SGK) hoặc 'vibrant' (sắc nét màu sắc sư phạm)
  const [theme, setTheme] = useState<'sgk' | 'vibrant'>('vibrant');
  // Ký hiệu đạo hàm: 'y' ($y, y'$) hoặc 'f' ($f(x), f'(x)$)
  const [notation, setNotation] = useState<'y' | 'f'>('y');
  const [copiedLatex, setCopiedLatex] = useState(false);

  const displayDerivative = derivativeName || (notation === 'y' ? "y'" : "f'(x)");
  const displayFunction = functionName || (notation === 'y' ? "y" : "f(x)");

  // Bản đồ độ cao theo level cho SVG
  const levelYMap: Record<string, number> = {
    top: 110,
    'mid-high': 130,
    mid: 152,
    'mid-low': 174,
    bottom: 196
  };

  const colCount = Math.max(xPoints.length, 2);
  const intervalCount = colCount - 1;

  // Kích thước chuẩn của bảng SVG
  const svgWidth = 740;
  const svgHeight = 224;
  const headerWidth = 76;
  const row1H = 42; // Dòng x
  const row2H = 42; // Dòng y'
  const row3H = svgHeight - row1H - row2H; // Dòng y (140px)
  const lineY1 = row1H; // 42
  const lineY2 = row1H + row2H; // 84

  // Tọa độ X cho từng điểm x_k
  // Để cân đối bảng: điểm đầu x=0 và điểm cuối x=N-1 cách lề một khoảng an toàn
  const padLeft = 48;
  const padRight = 48;
  const availableContentWidth = svgWidth - headerWidth - padLeft - padRight;
  const getPointX = (idx: number) => {
    if (intervalCount <= 0) return headerWidth + availableContentWidth / 2;
    return headerWidth + padLeft + (idx / intervalCount) * availableContentWidth;
  };

  // Trích xuất dấu trên từng khoảng cho dòng y'
  // yPrimeValues có thể truyền dạng xen kẽ [sign0, root0, sign1, root1, sign2]
  // hoặc chỉ truyền mảng dấu [sign0, sign1, sign2]
  const intervalSigns: string[] = [];
  const pointRoots: Record<number, string> = {};

  if (yPrimeValues.length === intervalCount * 2 - 1) {
    // Kiểu xen kẽ
    for (let i = 0; i < intervalCount; i++) {
      intervalSigns.push(yPrimeValues[i * 2] || '');
      if (i < intervalCount - 1) {
        pointRoots[i + 1] = yPrimeValues[i * 2 + 1] || '0';
      }
    }
  } else if (yPrimeValues.length === intervalCount) {
    // Chỉ có các dấu của khoảng
    for (let i = 0; i < intervalCount; i++) {
      intervalSigns.push(yPrimeValues[i] || '');
      if (i < intervalCount - 1) {
        pointRoots[i + 1] = asymptoteIndices.includes(i + 1) ? '||' : '0';
      }
    }
  } else {
    // Fallback thông minh
    for (let i = 0; i < intervalCount; i++) {
      intervalSigns.push(yPrimeValues[i] || '+');
      if (i < intervalCount - 1) {
        pointRoots[i + 1] = asymptoteIndices.includes(i + 1) ? '||' : '0';
      }
    }
  }

  // Bảng màu theo theme
  const colors = theme === 'vibrant'
    ? {
        border: '#cbd5e1',
        headerBg: '#f8fafc',
        headerText: '#1e1b4b',
        arrowUp: '#059669',
        arrowDown: '#e11d48',
        arrowUpMarker: `url(#marker-up-${uniqueId})`,
        arrowDownMarker: `url(#marker-down-${uniqueId})`,
        asymptoteLine: '#f43f5e',
        signPlus: '#059669',
        signMinus: '#e11d48',
        zero: '#334155'
      }
    : {
        border: '#334155',
        headerBg: '#f8fafc',
        headerText: '#0f172a',
        arrowUp: '#1e293b',
        arrowDown: '#1e293b',
        arrowUpMarker: `url(#marker-sgk-${uniqueId})`,
        arrowDownMarker: `url(#marker-sgk-${uniqueId})`,
        asymptoteLine: '#334155',
        signPlus: '#0f172a',
        signMinus: '#0f172a',
        zero: '#0f172a'
      };

  // Tạo mã LaTeX TikZ chuẩn tkz-tab cho giáo viên / học sinh
  const generateTikzCode = () => {
    const xList = xPoints.join(', ');
    const yPrimeList = yPrimeValues.map(v => v === '||' ? 'd' : v === '0' ? 'z' : v === '+' ? '+' : '-').join(', ');
    return `% === MÃ LATEX BẢNG BIẾN THIÊN (GÓI TKZ-TAB) ===
\\begin{tikzpicture}
  \\tkzTabInit[lgt=1.5,espcl=2.2]{$${variableName}$/1, $${displayDerivative}$/1, $${displayFunction}$/2.5}{${xList}}
  \\tkzTabLine{${yPrimeList}}
  % Các mũi tên biến thiên dòng y:
  % \\tkzTabVar{...}
\\end{tikzpicture}`;
  };

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(generateTikzCode());
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2400);
    } catch {
      // Fallback
    }
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    try {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bang_Bien_Thien_${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`my-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all ${className}`}>
      {/* Thanh Tiêu đề & Công cụ Sư Phạm */}
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block animate-pulse"></span>
            <span className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight">
              {title}
            </span>
            {functionTex && (
              <span className="text-xs bg-indigo-50/80 text-indigo-900 font-semibold px-2.5 py-0.5 rounded-lg border border-indigo-100/80">
                <MathView content={`$${functionTex}$`} inline />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Nút đổi theme */}
            <button
              onClick={() => setTheme(theme === 'vibrant' ? 'sgk' : 'vibrant')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              title="Đổi phong cách bảng biến thiên"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>{theme === 'vibrant' ? 'Màu trực quan' : 'Chuẩn mực SGK'}</span>
            </button>

            {/* Nút đổi ký hiệu y hoặc f(x) */}
            <button
              onClick={() => setNotation(notation === 'y' ? 'f' : 'y')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="Chuyển đổi ký hiệu hàng"
            >
              <span>{notation === 'y' ? "Dạng y, y'" : "Dạng f(x), f'(x)"}</span>
            </button>

            {/* Sao chép LaTeX */}
            <button
              onClick={handleCopyLatex}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                copiedLatex
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Sao chép mã LaTeX tkz-tab"
            >
              {copiedLatex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{copiedLatex ? 'Đã sao chép TeX!' : 'Copy LaTeX'}</span>
            </button>

            {/* Tải SVG */}
            <button
              onClick={handleDownloadSvg}
              className="p-1 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              title="Tải ảnh vector SVG về máy"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Vùng Bảng Biến Thiên Vector Toán Học Đồng Bộ 100% */}
      <div className="overflow-x-auto custom-scrollbar pb-1">
        <div className="min-w-[580px] max-w-[820px] mx-auto select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto drop-shadow-2xs"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Đầu mũi tên xanh (đồng biến) */}
              <marker
                id={`marker-up-${uniqueId}`}
                markerWidth="8"
                markerHeight="8"
                refX="6.5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 7 3, 0 6" fill="#059669" />
              </marker>

              {/* Đầu mũi tên đỏ (nghịch biến) */}
              <marker
                id={`marker-down-${uniqueId}`}
                markerWidth="8"
                markerHeight="8"
                refX="6.5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 7 3, 0 6" fill="#e11d48" />
              </marker>

              {/* Đầu mũi tên chuẩn SGK (đen/xám đậm) */}
              <marker
                id={`marker-sgk-${uniqueId}`}
                markerWidth="8"
                markerHeight="8"
                refX="6.5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 7 3, 0 6" fill="#1e293b" />
              </marker>
            </defs>

            {/* Nền toàn bảng */}
            <rect
              x="0.75"
              y="0.75"
              width={svgWidth - 1.5}
              height={svgHeight - 1.5}
              rx="12"
              fill="#ffffff"
              stroke={colors.border}
              strokeWidth="1.5"
            />

            {/* Nền cột Tiêu đề (x, y', y) */}
            <path
              d={`M 1.5 12 A 10.5 10.5 0 0 1 12 1.5 L ${headerWidth} 1.5 L ${headerWidth} ${svgHeight - 1.5} L 12 ${svgHeight - 1.5} A 10.5 10.5 0 0 1 1.5 ${svgHeight - 12} Z`}
              fill={colors.headerBg}
            />

            {/* Đường kẻ dọc ngăn cột tiêu đề với vùng dữ liệu */}
            <line
              x1={headerWidth}
              y1="0"
              x2={headerWidth}
              y2={svgHeight}
              stroke={colors.border}
              strokeWidth="1.5"
            />

            {/* Đường kẻ ngang ngăn dòng x và dòng y' */}
            <line
              x1="0"
              y1={lineY1}
              x2={svgWidth}
              y2={lineY1}
              stroke={colors.border}
              strokeWidth="1.5"
            />

            {/* Đường kẻ ngang ngăn dòng y' và dòng y */}
            <line
              x1="0"
              y1={lineY2}
              x2={svgWidth}
              y2={lineY2}
              stroke={colors.border}
              strokeWidth="1.5"
            />

            {/* TIÊU ĐỀ HÀNG 1: x */}
            <foreignObject
              x={0}
              y={0}
              width={headerWidth}
              height={row1H}
              className="overflow-visible pointer-events-none"
            >
              <div className="flex items-center justify-center w-full h-full text-indigo-950 font-black italic text-base">
                <MathView content={`$${variableName}$`} inline />
              </div>
            </foreignObject>

            {/* TIÊU ĐỀ HÀNG 2: y' hoặc f'(x) */}
            <foreignObject
              x={0}
              y={lineY1}
              width={headerWidth}
              height={row2H}
              className="overflow-visible pointer-events-none"
            >
              <div className="flex items-center justify-center w-full h-full text-indigo-950 font-black italic text-base">
                <MathView content={`$${displayDerivative}$`} inline />
              </div>
            </foreignObject>

            {/* TIÊU ĐỀ HÀNG 3: y hoặc f(x) */}
            <foreignObject
              x={0}
              y={lineY2}
              width={headerWidth}
              height={row3H}
              className="overflow-visible pointer-events-none"
            >
              <div className="flex items-center justify-center w-full h-full text-indigo-950 font-black italic text-base">
                <MathView content={`$${displayFunction}$`} inline />
              </div>
            </foreignObject>

            {/* ĐƯỜNG TIỆM CẬN ĐỨNG: KẺ 2 VẠCH SONG SONG THẲNG TẮP XUYÊN SUỐT DÒNG Y' VÀ Y */}
            {asymptoteIndices.map((asympIdx) => {
              const xCoord = getPointX(asympIdx);
              return (
                <g key={`asymp-lines-${asympIdx}`}>
                  {/* Vạch 1 bên trái */}
                  <line
                    x1={xCoord - 2.5}
                    y1={lineY1}
                    x2={xCoord - 2.5}
                    y2={svgHeight}
                    stroke={colors.asymptoteLine}
                    strokeWidth="1.5"
                  />
                  {/* Vạch 2 bên phải */}
                  <line
                    x1={xCoord + 2.5}
                    y1={lineY1}
                    x2={xCoord + 2.5}
                    y2={svgHeight}
                    stroke={colors.asymptoteLine}
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* DÒNG 1: CÁC GIÁ TRỊ CỦA X */}
            {xPoints.map((xp, idx) => {
              const posX = getPointX(idx);
              const isAsymp = asymptoteIndices.includes(idx);
              return (
                <foreignObject
                  key={`x-pt-${idx}`}
                  x={posX - 45}
                  y={4}
                  width={90}
                  height={34}
                  className="overflow-visible pointer-events-none"
                >
                  <div
                    className={`flex items-center justify-center w-full h-full text-sm font-bold ${
                      isAsymp
                        ? theme === 'vibrant'
                          ? 'text-rose-600 font-extrabold'
                          : 'text-slate-900 font-bold'
                        : 'text-slate-800'
                    }`}
                  >
                    <MathView content={`$${xp}$`} inline />
                  </div>
                </foreignObject>
              );
            })}

            {/* DÒNG 2: DẤU CỦA Y' TRÊN TỪNG KHOẢNG (CĂN CHÍNH GIỮA 2 ĐIỂM) */}
            {intervalSigns.map((sign, idx) => {
              const xA = getPointX(idx);
              const xB = getPointX(idx + 1);
              const midX = (xA + xB) / 2;
              const isPlus = sign.includes('+');
              const isMinus = sign.includes('-') || sign.includes('−');

              return (
                <foreignObject
                  key={`sign-${idx}`}
                  x={midX - 25}
                  y={lineY1 + 5}
                  width={50}
                  height={32}
                  className="overflow-visible pointer-events-none"
                >
                  <div
                    className={`flex items-center justify-center w-full h-full text-base font-extrabold ${
                      isPlus
                        ? theme === 'vibrant'
                          ? 'text-emerald-600'
                          : 'text-slate-800'
                        : isMinus
                        ? theme === 'vibrant'
                          ? 'text-rose-600'
                          : 'text-slate-800'
                        : 'text-slate-700'
                    }`}
                  >
                    <MathView content={`$${sign}$`} inline />
                  </div>
                </foreignObject>
              );
            })}

            {/* DÒNG 2: SỐ 0 ĐẠO HÀM DƯỚI TỪNG ĐIỂM CỰC TRỊ */}
            {Object.entries(pointRoots).map(([ptIdxStr, val]) => {
              const ptIdx = parseInt(ptIdxStr, 10);
              // Nếu là tiệm cận đứng thì 2 vạch song song đã vẽ sẵn, không in text
              if (asymptoteIndices.includes(ptIdx) || val === '||') return null;

              const posX = getPointX(ptIdx);
              return (
                <foreignObject
                  key={`root-zero-${ptIdx}`}
                  x={posX - 25}
                  y={lineY1 + 5}
                  width={50}
                  height={32}
                  className="overflow-visible pointer-events-none"
                >
                  <div className="flex items-center justify-center w-full h-full text-sm font-bold text-slate-700">
                    <MathView content={`$${val}$`} inline />
                  </div>
                </foreignObject>
              );
            })}

            {/* DÒNG 3: CÁC MŨI TÊN BIẾN THIÊN SVG */}
            {arrows.map((arr, aIdx) => {
              const xStartPt = getPointX(arr.fromIndex);
              const xEndPt = getPointX(arr.toIndex);

              const y1 = levelYMap[arr.fromLevel] || 152;
              const y2 = levelYMap[arr.toLevel] || 152;

              const fromIsAsymp = asymptoteIndices.includes(arr.fromIndex);
              const toIsAsymp = asymptoteIndices.includes(arr.toIndex);

              // Tinh chỉnh điểm xuất phát mũi tên để không đè vào chữ hoặc tiệm cận
              const offsetStart =
                arr.fromIndex === 0
                  ? 32 // Điểm biên âm vô cùng
                  : fromIsAsymp
                  ? 26 // Bên phải tiệm cận đứng
                  : 18; // Điểm cực trị

              // Tinh chỉnh điểm kết thúc mũi tên
              const offsetEnd =
                arr.toIndex === colCount - 1
                  ? 32 // Điểm biên dương vô cùng
                  : toIsAsymp
                  ? 26 // Bên trái tiệm cận đứng
                  : 18; // Điểm cực trị

              const startX = xStartPt + offsetStart;
              const endX = xEndPt - offsetEnd;

              // Rút ngắn 1 chút theo phương nghiêng để mũi tên hướng thẳng, đẹp
              const dx = endX - startX;
              const dy = y2 - y1;
              const len = Math.sqrt(dx * dx + dy * dy);

              if (len <= 10) return null; // tránh lỗi nếu quá gần

              const strokeColor =
                theme === 'vibrant'
                  ? arr.direction === 'up'
                    ? colors.arrowUp
                    : colors.arrowDown
                  : colors.arrowUp;

              const marker =
                theme === 'vibrant'
                  ? arr.direction === 'up'
                    ? colors.arrowUpMarker
                    : colors.arrowDownMarker
                  : colors.arrowUpMarker;

              return (
                <g key={`arrow-line-${aIdx}`}>
                  <line
                    x1={startX}
                    y1={y1}
                    x2={endX}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    markerEnd={marker}
                  />
                </g>
              );
            })}

            {/* DÒNG 3: CÁC GIÁ TRỊ TẠI ĐẦU VÀ CUỐI MŨI TÊN (KHÔNG CHỒNG ĐÈ, CHUẨN SƯ PHẠM) */}
            {/* 1. Điểm biên bên trái (x = -oo) */}
            {arrows.length > 0 && (
              <foreignObject
                x={getPointX(0) - 40}
                y={levelYMap[arrows[0].fromLevel] - 16}
                width={80}
                height={32}
                className="overflow-visible pointer-events-none"
              >
                <div className="flex items-center justify-center w-full h-full text-xs sm:text-sm font-bold text-slate-800">
                  <MathView content={`$${arrows[0].fromLabel}$`} inline />
                </div>
              </foreignObject>
            )}

            {/* 2. Các điểm trung gian (cực trị hoặc giới hạn 2 bên tiệm cận đứng) */}
            {Array.from({ length: colCount - 2 }, (_, i) => i + 1).map((idx) => {
              const isAsymp = asymptoteIndices.includes(idx);
              const posX = getPointX(idx);

              const incomingArrow = arrows.find((a) => a.toIndex === idx);
              const outgoingArrow = arrows.find((a) => a.fromIndex === idx);

              if (isAsymp) {
                // TIỆM CẬN ĐỨNG: 2 giới hạn nằm ở 2 bên đường đôi (trái x0 và phải x0)
                return (
                  <g key={`asymp-labels-${idx}`}>
                    {/* Giới hạn bên TRÁI tiệm cận (x -> x0-) */}
                    {incomingArrow && (
                      <foreignObject
                        x={posX - 52}
                        y={levelYMap[incomingArrow.toLevel] - 16}
                        width={48}
                        height={32}
                        className="overflow-visible pointer-events-none"
                      >
                        <div className="flex items-center justify-end pr-1 w-full h-full text-xs font-bold text-slate-800">
                          <MathView content={`$${incomingArrow.toLabel}$`} inline />
                        </div>
                      </foreignObject>
                    )}

                    {/* Giới hạn bên PHẢI tiệm cận (x -> x0+) */}
                    {outgoingArrow && (
                      <foreignObject
                        x={posX + 4}
                        y={levelYMap[outgoingArrow.fromLevel] - 16}
                        width={48}
                        height={32}
                        className="overflow-visible pointer-events-none"
                      >
                        <div className="flex items-center justify-start pl-1 w-full h-full text-xs font-bold text-slate-800">
                          <MathView content={`$${outgoingArrow.fromLabel}$`} inline />
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              }

              // ĐIỂM CỰC TRỊ: Nằm chính giữa cột x_k tại đúng độ cao cực trị
              const targetLevel = incomingArrow?.toLevel || outgoingArrow?.fromLevel || 'mid';
              const targetLabel = incomingArrow?.toLabel || outgoingArrow?.fromLabel || '';

              return (
                <foreignObject
                  key={`node-val-${idx}`}
                  x={posX - 40}
                  y={levelYMap[targetLevel] - 16}
                  width={80}
                  height={32}
                  className="overflow-visible pointer-events-none"
                >
                  <div className="flex items-center justify-center w-full h-full text-xs sm:text-sm font-bold text-slate-900">
                    <MathView content={`$${targetLabel}$`} inline />
                  </div>
                </foreignObject>
              );
            })}

            {/* 3. Điểm biên bên phải (x = +oo) */}
            {arrows.length > 0 && (
              <foreignObject
                x={getPointX(colCount - 1) - 40}
                y={levelYMap[arrows[arrows.length - 1].toLevel] - 16}
                width={80}
                height={32}
                className="overflow-visible pointer-events-none"
              >
                <div className="flex items-center justify-center w-full h-full text-xs sm:text-sm font-bold text-slate-800">
                  <MathView content={`$${arrows[arrows.length - 1].toLabel}$`} inline />
                </div>
              </foreignObject>
            )}
          </svg>
        </div>
      </div>

      {/* Chú thích màu sắc và quy chuẩn sư phạm */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Chuẩn hóa đồ họa vector toán học & Công thức KaTeX sắc nét</span>
        </div>
        {theme === 'vibrant' ? (
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-0.5 bg-emerald-600 inline-block rounded-full"></span>
              <span>Đồng biến ($\nearrow$)</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-3 h-0.5 bg-rose-600 inline-block rounded-full"></span>
              <span>Nghịch biến ($\searrow$)</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="font-mono font-bold tracking-tighter">||</span>
              <span>Tiệm cận đứng</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600">
            <span>Định dạng mực in chuẩn sách giáo khoa Bộ GD&ĐT</span>
          </div>
        )}
      </div>
    </div>
  );
};
