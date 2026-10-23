import React, { useState, useMemo } from 'react';
import { MathView } from './MathView';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles } from 'lucide-react';

export interface KeyPoint {
  x: number;
  y: number;
  label?: string;
  type?: 'max' | 'min' | 'inflection' | 'intercept' | 'custom';
}

export interface Asymptote {
  type: 'vertical' | 'horizontal' | 'slant';
  value: number; // x = c hoặc y = c
  slantSlope?: number; // với slant y = ax + b
  label?: string;
}

export interface FunctionGraphProps {
  title?: string;
  functionTex?: string;
  evaluate: (x: number) => number | null; // Hàm f(x)
  derivative?: (x: number) => number | null; // Hàm f'(x)
  keyPoints?: KeyPoint[];
  asymptotes?: Asymptote[];
  xDomain?: [number, number]; // mặc định [-5, 5]
  yDomain?: [number, number]; // mặc định [-5, 5]
  width?: number;
  height?: number;
  className?: string;
}

export const FunctionGraph: React.FC<FunctionGraphProps> = ({
  title,
  functionTex,
  evaluate,
  keyPoints = [],
  asymptotes = [],
  xDomain: initialXDomain = [-5, 5],
  yDomain: initialYDomain = [-4, 6],
  width = 560,
  height = 380,
  className = ''
}) => {
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const xMin = initialXDomain[0] / scale;
  const xMax = initialXDomain[1] / scale;
  const yMin = initialYDomain[0] / scale;
  const yMax = initialYDomain[1] / scale;

  // Chuyển đổi tọa độ toán học sang tọa độ SVG
  const toSvgX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
  const toSvgY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

  // Chuyển tọa độ SVG sang toán học
  const toMathX = (svgX: number) => xMin + (svgX / width) * (xMax - xMin);
  const toMathY = (svgY: number) => yMax - (svgY / height) * (yMax - yMin);

  // Sinh đường cong đồ thị
  const pathData = useMemo(() => {
    const steps = 300;
    const dx = (xMax - xMin) / steps;
    const paths: string[] = [];
    let currentPath = '';
    let isDrawing = false;

    // Lấy các điểm tiệm cận đứng để ngắt nét vẽ
    const verticalAsympValues = asymptotes
      .filter((a) => a.type === 'vertical')
      .map((a) => a.value);

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;

      // Kiểm tra xem có quá gần tiệm cận đứng không
      const nearAsymptote = verticalAsympValues.some(
        (asymp) => Math.abs(x - asymp) < dx * 0.95
      );

      if (nearAsymptote) {
        if (currentPath) {
          paths.push(currentPath);
          currentPath = '';
          isDrawing = false;
        }
        continue;
      }

      const y = evaluate(x);

      if (y === null || !isFinite(y) || isNaN(y) || y < yMin - 15 || y > yMax + 15) {
        if (currentPath) {
          paths.push(currentPath);
          currentPath = '';
          isDrawing = false;
        }
      } else {
        const sx = toSvgX(x);
        const sy = toSvgY(y);

        if (!isDrawing) {
          currentPath += `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
          isDrawing = true;
        } else {
          currentPath += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        }
      }
    }

    if (currentPath) paths.push(currentPath);
    return paths;
  }, [xMin, xMax, yMin, yMax, evaluate, asymptotes, width, height]);

  // Sinh các vạch chia trên trục Ox, Oy
  const ticks = useMemo(() => {
    const xTicks: number[] = [];
    const yTicks: number[] = [];

    const xStep = Math.ceil((xMax - xMin) / 10);
    const yStep = Math.ceil((yMax - yMin) / 10);

    const step = Math.max(1, Math.min(xStep, yStep));

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += step) {
      if (x !== 0) xTicks.push(x);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += step) {
      if (y !== 0) yTicks.push(y);
    }
    return { xTicks, yTicks };
  }, [xMin, xMax, yMin, yMax]);

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    const mathX = toMathX(svgX);
    const mathY = evaluate(mathX);
    if (mathY !== null && isFinite(mathY) && mathY >= yMin && mathY <= yMax) {
      setHoverCoord({ x: mathX, y: mathY });
    } else {
      setHoverCoord(null);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-indigo-200/80 shadow-md p-4 overflow-hidden ${className}`}>
      {/* Header điều khiển */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
        <div>
          {title && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
            </div>
          )}
          {functionTex && (
            <div className="text-xs bg-indigo-50 text-indigo-950 px-2.5 py-0.5 rounded-md font-serif inline-block mt-0.5 border border-indigo-100">
              <MathView content={`$${functionTex}$`} inline />
            </div>
          )}
        </div>

        {/* Các nút chức năng phóng to/thu nhỏ/lưới */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setScale((s) => Math.min(s * 1.25, 3))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s * 0.8, 0.4))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            title="Đặt lại tỉ lệ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowGrid((g) => !g)}
            className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition flex items-center gap-1 ${
              showGrid
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3 h-3" />
            Lưới
          </button>
        </div>
      </div>

      {/* Vùng vẽ SVG */}
      <div className="relative flex justify-center bg-slate-900/[0.02] rounded-xl overflow-hidden border border-slate-200/70">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[620px] h-auto select-none font-sans"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverCoord(null)}
        >
          <defs>
            {/* Mũi tên trục Ox, Oy */}
            <marker
              id="axis-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 7 3, 0 6" fill="#475569" />
            </marker>
          </defs>

          {/* Lưới tọa độ Grid lines */}
          {showGrid && (
            <g stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3">
              {ticks.xTicks.map((x) => (
                <line key={`gx-${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={height} />
              ))}
              {ticks.yTicks.map((y) => (
                <line key={`gy-${y}`} x1={0} y1={toSvgY(y)} x2={width} y2={toSvgY(y)} />
              ))}
            </g>
          )}

          {/* Đường tiệm cận */}
          {asymptotes.map((asymp, idx) => {
            if (asymp.type === 'vertical') {
              const sx = toSvgX(asymp.value);
              return (
                <g key={`asymp-${idx}`}>
                  <line
                    x1={sx}
                    y1={0}
                    x2={sx}
                    y2={height}
                    stroke="#f43f5e"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                  />
                  <text
                    x={sx + 5}
                    y={20}
                    fill="#e11d48"
                    fontSize="11"
                    fontWeight="bold"
                    className="font-serif"
                  >
                    x = {asymp.value}
                  </text>
                </g>
              );
            }
            if (asymp.type === 'horizontal') {
              const sy = toSvgY(asymp.value);
              return (
                <g key={`asymp-${idx}`}>
                  <line
                    x1={0}
                    y1={sy}
                    x2={width}
                    y2={sy}
                    stroke="#8b5cf6"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                  />
                  <text
                    x={width - 55}
                    y={sy - 6}
                    fill="#7c3aed"
                    fontSize="11"
                    fontWeight="bold"
                    className="font-serif"
                  >
                    y = {asymp.value}
                  </text>
                </g>
              );
            }
            if (asymp.type === 'slant') {
              const m = asymp.slantSlope ?? 1;
              const n = asymp.value;
              const sx1 = toSvgX(xMin);
              const sy1 = toSvgY(m * xMin + n);
              const sx2 = toSvgX(xMax);
              const sy2 = toSvgY(m * xMax + n);
              return (
                <g key={`asymp-${idx}`}>
                  <line
                    x1={sx1}
                    y1={sy1}
                    x2={sx2}
                    y2={sy2}
                    stroke="#059669"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                  />
                  <text
                    x={Math.max(20, width - 85)}
                    y={Math.min(height - 10, Math.max(20, toSvgY(m * (xMax - 1) + n) - 8))}
                    fill="#059669"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {asymp.label || `y = ${m}x + ${n}`}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Hệ trục tọa độ vuông góc Ox, Oy */}
          <g stroke="#334155" strokeWidth="1.6">
            {/* Trục Ox */}
            {originY >= 0 && originY <= height && (
              <line
                x1={0}
                y1={originY}
                x2={width - 4}
                y2={originY}
                markerEnd="url(#axis-arrow)"
              />
            )}
            {/* Trục Oy */}
            {originX >= 0 && originX <= width && (
              <line
                x1={originX}
                y1={height}
                x2={originX}
                y2={4}
                markerEnd="url(#axis-arrow)"
              />
            )}
          </g>

          {/* Nhãn trục x, y và gốc tọa độ O */}
          <text
            x={width - 15}
            y={originY - 8}
            fill="#1e293b"
            fontSize="13"
            fontWeight="bold"
            fontStyle="italic"
          >
            x
          </text>
          <text
            x={originX + 8}
            y={16}
            fill="#1e293b"
            fontSize="13"
            fontWeight="bold"
            fontStyle="italic"
          >
            y
          </text>
          <text
            x={originX - 12}
            y={originY + 14}
            fill="#64748b"
            fontSize="11"
            fontWeight="bold"
          >
            O
          </text>

          {/* Vạch chia đơn vị (Ticks) */}
          <g fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle">
            {ticks.xTicks.map((x) => {
              const sx = toSvgX(x);
              return (
                <g key={`tx-${x}`}>
                  <line x1={sx} y1={originY - 3} x2={sx} y2={originY + 3} stroke="#334155" strokeWidth="1.2" />
                  <text x={sx} y={originY + 15}>
                    {x}
                  </text>
                </g>
              );
            })}
            {ticks.yTicks.map((y) => {
              const sy = toSvgY(y);
              return (
                <g key={`ty-${y}`}>
                  <line x1={originX - 3} y1={sy} x2={originX + 3} stroke="#334155" strokeWidth="1.2" />
                  <text x={originX - 10} y={sy + 3} textAnchor="end">
                    {y}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Đường cong đồ thị hàm số */}
          {pathData.map((d, idx) => (
            <path
              key={`graph-${idx}`}
              d={d}
              fill="none"
              stroke="#4338ca"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-xs"
            />
          ))}

          {/* Các điểm đặc biệt (Key Points: Cực đại, Cực tiểu, Uốn, v.v.) */}
          {keyPoints.map((pt, idx) => {
            if (pt.x < xMin || pt.x > xMax || pt.y < yMin || pt.y > yMax) return null;
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);

            const isExtremum = pt.type === 'max' || pt.type === 'min';
            const color =
              pt.type === 'max'
                ? '#e11d48'
                : pt.type === 'min'
                ? '#059669'
                : '#4f46e5';

            return (
              <g key={`pt-${idx}`}>
                {/* Đường gióng nét đứt xuống hai trục tọa độ */}
                <line
                  x1={sx}
                  y1={sy}
                  x2={sx}
                  y2={originY}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line
                  x1={sx}
                  y1={sy}
                  x2={originX}
                  y2={sy}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Điểm chấm tròn nổi bật */}
                <circle cx={sx} cy={sy} r="5" fill={color} stroke="#ffffff" strokeWidth="2" />

                {/* Nhãn điểm tọa độ */}
                {showCoordinates && (
                  <g>
                    <rect
                      x={sx + 6}
                      y={sy - 22}
                      width={pt.label ? 75 : 55}
                      height="18"
                      rx="4"
                      fill="#0f172a"
                      opacity="0.85"
                    />
                    <text
                      x={sx + 10}
                      y={sy - 9}
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {pt.label || `(${pt.x.toFixed(1)}; ${pt.y.toFixed(1)})`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Điểm hover của chuột hiển thị tọa độ tương tác */}
          {hoverCoord && (
            <g>
              <circle
                cx={toSvgX(hoverCoord.x)}
                cy={toSvgY(hoverCoord.y)}
                r="4.5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <rect
                x={toSvgX(hoverCoord.x) + 8}
                y={toSvgY(hoverCoord.y) - 24}
                width="84"
                height="19"
                rx="4"
                fill="#1e293b"
                opacity="0.9"
              />
              <text
                x={toSvgX(hoverCoord.x) + 12}
                y={toSvgY(hoverCoord.y) - 10}
                fill="#fef08a"
                fontSize="10"
                fontWeight="bold"
              >
                x={hoverCoord.x.toFixed(2)}, y={hoverCoord.y.toFixed(2)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Chú thích phía dưới */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            Đường cong $y = f(x)$
          </span>
          {asymptotes.some((a) => a.type === 'vertical') && (
            <span className="flex items-center gap-1 font-medium text-rose-600">
              <span className="w-3 h-0.5 border-t-2 border-rose-500 border-dashed inline-block"></span>
              Tiệm cận đứng
            </span>
          )}
          {asymptotes.some((a) => a.type === 'horizontal') && (
            <span className="flex items-center gap-1 font-medium text-purple-600">
              <span className="w-3 h-0.5 border-t-2 border-purple-500 border-dashed inline-block"></span>
              Tiệm cận ngang
            </span>
          )}
        </div>
        <div className="italic text-[11px] text-slate-400">
          Rê chuột trên đồ thị để xem tọa độ điểm $(x; y)$
        </div>
      </div>
    </div>
  );
};
