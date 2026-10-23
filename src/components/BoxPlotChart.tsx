import React, { useMemo } from 'react';
import { MathView } from './MathView';
import { BarChart3, HelpCircle } from 'lucide-react';

interface BoxPlotChartProps {
  min: number;
  max: number;
  q1: number;
  median: number;
  q3: number;
  mean: number;
  histogramData: Array<{ label: string; freq: number; min: number; max: number }>;
  className?: string;
}

export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  min,
  max,
  q1,
  median,
  q3,
  mean,
  histogramData,
  className = ''
}) => {
  const width = 560;
  const height = 180;
  const paddingX = 45;

  // Tính miền x
  const xMin = Math.min(min, q1 - (q3 - q1) * 0.2);
  const xMax = Math.max(max, q3 + (q3 - q1) * 0.2);
  const domainWidth = xMax - xMin || 1;

  const toSvgX = (val: number) => paddingX + ((val - xMin) / domainWidth) * (width - paddingX * 2);

  const boxLeft = toSvgX(q1);
  const boxRight = toSvgX(q3);
  const medX = toSvgX(median);
  const meanX = toSvgX(mean);
  const minX = toSvgX(min);
  const maxX = toSvgX(max);

  const boxTop = 38;
  const boxHeight = 44;
  const boxCenterY = boxTop + boxHeight / 2;

  // Tối đa tần số cho biểu đồ cột mini bên dưới
  const maxFreq = Math.max(...histogramData.map((d) => d.freq), 1);

  return (
    <div className={`bg-white rounded-2xl border border-indigo-200/80 shadow-md p-5 space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              Biểu Đồ Hộp (Box Plot) & Phân Bố Mẫu Ghép Nhóm
            </h4>
            <p className="text-[11px] text-slate-500">
              Trực quan hóa xu thế trung tâm và độ phân tán tứ phân vị $(Q_1, M_e, Q_3)$
            </p>
          </div>
        </div>
      </div>

      {/* SVG Box Plot Canvas */}
      <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-200/70 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto select-none font-sans">
          {/* Trục số phía dưới */}
          <line
            x1={paddingX}
            y1={140}
            x2={width - paddingX}
            y2={140}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Râu bên trái (Whisker Left: min -> Q1) */}
          <line
            x1={minX}
            y1={boxCenterY}
            x2={boxLeft}
            y2={boxCenterY}
            stroke="#4f46e5"
            strokeWidth="2.2"
          />
          <line
            x1={minX}
            y1={boxTop + 10}
            x2={minX}
            y2={boxTop + boxHeight - 10}
            stroke="#4f46e5"
            strokeWidth="2.5"
          />

          {/* Râu bên phải (Whisker Right: Q3 -> max) */}
          <line
            x1={boxRight}
            y1={boxCenterY}
            x2={maxX}
            y2={boxCenterY}
            stroke="#4f46e5"
            strokeWidth="2.2"
          />
          <line
            x1={maxX}
            y1={boxTop + 10}
            x2={maxX}
            y2={boxTop + boxHeight - 10}
            stroke="#4f46e5"
            strokeWidth="2.5"
          />

          {/* Hộp chữ nhật Tứ phân vị (IQR Box) */}
          <rect
            x={boxLeft}
            y={boxTop}
            width={Math.max(4, boxRight - boxLeft)}
            height={boxHeight}
            rx="6"
            fill="#e0e7ff"
            stroke="#4338ca"
            strokeWidth="2"
          />

          {/* Vạch Trung vị Median (Me = Q2) */}
          <line
            x1={medX}
            y1={boxTop}
            x2={medX}
            y2={boxTop + boxHeight}
            stroke="#e11d48"
            strokeWidth="3.2"
          />

          {/* Điểm Số Trung Bình (Mean diamond) */}
          <polygon
            points={`${meanX},${boxCenterY - 6} ${meanX + 5},${boxCenterY} ${meanX},${boxCenterY + 6} ${meanX - 5},${boxCenterY}`}
            fill="#059669"
            stroke="#ffffff"
            strokeWidth="1.2"
          />

          {/* Đường dóng nét đứt xuống trục số */}
          {[
            { val: min, x: minX, label: 'x_min', color: '#64748b' },
            { val: q1, x: boxLeft, label: 'Q_1', color: '#4338ca' },
            { val: median, x: medX, label: 'M_e', color: '#e11d48' },
            { val: q3, x: boxRight, label: 'Q_3', color: '#4338ca' },
            { val: max, x: maxX, label: 'x_max', color: '#64748b' }
          ].map((pt, idx) => (
            <g key={idx}>
              <line
                x1={pt.x}
                y1={boxTop + boxHeight}
                x2={pt.x}
                y2={140}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={pt.x}
                y1={137}
                x2={pt.x}
                y2={143}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text
                x={pt.x}
                y={156}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="bold"
                fill={pt.color}
              >
                {pt.val.toFixed(2)}
              </text>
              <text
                x={pt.x}
                y={26}
                textAnchor="middle"
                fontSize="10"
                fontWeight="extrabold"
                fill={pt.color}
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Chú thích thông số */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Tứ phân vị 1:</span>
          <span className="font-extrabold text-indigo-950 text-sm">{q1.toFixed(2)}</span>
        </div>
        <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Trung vị (Me = Q2):</span>
          <span className="font-extrabold text-rose-700 text-sm">{median.toFixed(2)}</span>
        </div>
        <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Tứ phân vị 3:</span>
          <span className="font-extrabold text-indigo-950 text-sm">{q3.toFixed(2)}</span>
        </div>
        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Khoảng tứ phân vị:</span>
          <span className="font-extrabold text-emerald-700 text-sm">{(q3 - q1).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
