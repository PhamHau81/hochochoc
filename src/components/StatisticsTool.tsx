import React, { useState, useMemo } from 'react';
import { StatGroup } from '../types';
import { MathView } from './MathView';
import { BoxPlotChart } from './BoxPlotChart';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Cpu, 
  TrendingUp, 
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const PRESETS: Record<string, { name: string; description: string; data: StatGroup[] }> = {
  study_hours: {
    name: 'Mẫu 1: Giờ tự học môn Toán (50 HS)',
    description: 'Khảo sát số giờ tự ôn Toán trong 1 tuần của học sinh khối 11',
    data: [
      { min: 0, max: 4, freq: 4 },
      { min: 4, max: 8, freq: 12 },
      { min: 8, max: 12, freq: 18 },
      { min: 12, max: 16, freq: 11 },
      { min: 16, max: 20, freq: 5 }
    ]
  },
  crop_yield: {
    name: 'Mẫu 2: Năng suất lúa vụ mùa (70 thửa)',
    description: 'Năng suất tính theo tạ/ha của 70 thửa ruộng thí nghiệm',
    data: [
      { min: 50, max: 55, freq: 8 },
      { min: 55, max: 60, freq: 15 },
      { min: 60, max: 65, freq: 24 },
      { min: 65, max: 70, freq: 18 },
      { min: 70, max: 75, freq: 5 }
    ]
  },
  test_scores: {
    name: 'Mẫu 3: Điểm thi thử khảo sát (100 HS)',
    description: 'Thang điểm 10 chia theo 5 khoảng năng lực',
    data: [
      { min: 0, max: 4, freq: 10 },
      { min: 4, max: 6, freq: 28 },
      { min: 6, max: 8, freq: 42 },
      { min: 8, max: 10, freq: 20 }
    ]
  }
};

export const StatisticsTool: React.FC = () => {
  const [data, setData] = useState<StatGroup[]>(PRESETS.study_hours.data);
  const [casioModel, setCasioModel] = useState<'580' | '880'>('580');

  // Handle row changes
  const updateRow = (index: number, field: keyof StatGroup, val: number) => {
    setData(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const addRow = () => {
    setData(prev => {
      const last = prev[prev.length - 1];
      const step = last ? last.max - last.min : 4;
      const newMin = last ? last.max : 0;
      return [...prev, { min: newMin, max: newMin + (step > 0 ? step : 4), freq: 5 }];
    });
  };

  const removeRow = (index: number) => {
    if (data.length <= 2) {
      alert('Bảng cần tối thiểu 2 nhóm số liệu ghép nhóm!');
      return;
    }
    setData(prev => prev.filter((_, i) => i !== index));
  };

  // Perform accurate statistics computation
  const stats = useMemo(() => {
    let n = 0;
    let sumMC = 0;
    let sumMC2 = 0;
    let runningCum = 0;

    const processed = data.map(row => {
      const c_i = (row.min + row.max) / 2;
      const h_i = row.max - row.min;
      n += row.freq;
      sumMC += row.freq * c_i;
      sumMC2 += row.freq * c_i * c_i;
      runningCum += row.freq;
      return {
        ...row,
        c_i,
        h_i,
        cumFreq: runningCum
      };
    });

    if (n === 0) {
      return {
        n: 0,
        mean: 0,
        median: 0,
        mode: 0,
        q1: 0,
        q2: 0,
        q3: 0,
        iqr: 0,
        range: 0,
        variance: 0,
        stdDev: 0,
        processed: [],
        medianGroup: null,
        prevCumMed: 0,
        halfN: 0,
        q1Group: null,
        q1Pos: 0,
        prevCumQ1: 0,
        q3Group: null,
        q3Pos: 0,
        prevCumQ3: 0,
        mg: null,
        prevFreq: 0,
        nextFreq: 0
      };
    }

    const mean = sumMC / n;
    const variance = (sumMC2 / n) - (mean * mean);
    const stdDev = Math.sqrt(Math.max(0, variance));

    // Range R = a_{k+1} - a_1 (SGK Toán 12 KNTT)
    const range = processed.length > 0 ? (processed[processed.length - 1].max - processed[0].min) : 0;

    // Median (Me)
    const halfN = n / 2;
    let medianGroup = processed.find(g => g.cumFreq >= halfN) || processed[0];
    const medIdx = processed.indexOf(medianGroup);
    const prevCumMed = medIdx > 0 ? processed[medIdx - 1].cumFreq : 0;
    const median = medianGroup.freq > 0
      ? medianGroup.min + ((halfN - prevCumMed) / medianGroup.freq) * medianGroup.h_i
      : medianGroup.c_i;

    // Q1
    const q1Pos = n / 4;
    let q1Group = processed.find(g => g.cumFreq >= q1Pos) || processed[0];
    const q1Idx = processed.indexOf(q1Group);
    const prevCumQ1 = q1Idx > 0 ? processed[q1Idx - 1].cumFreq : 0;
    const q1 = q1Group.freq > 0
      ? q1Group.min + ((q1Pos - prevCumQ1) / q1Group.freq) * q1Group.h_i
      : q1Group.c_i;

    // Q3
    const q3Pos = (3 * n) / 4;
    let q3Group = processed.find(g => g.cumFreq >= q3Pos) || processed[processed.length - 1];
    const q3Idx = processed.indexOf(q3Group);
    const prevCumQ3 = q3Idx > 0 ? processed[q3Idx - 1].cumFreq : 0;
    const q3 = q3Group.freq > 0
      ? q3Group.min + ((q3Pos - prevCumQ3) / q3Group.freq) * q3Group.h_i
      : q3Group.c_i;

    // Mode
    let maxFreq = -1;
    let modeGroupIdx = 0;
    processed.forEach((g, idx) => {
      if (g.freq > maxFreq) {
        maxFreq = g.freq;
        modeGroupIdx = idx;
      }
    });

    const mg = processed[modeGroupIdx];
    const prevFreq = modeGroupIdx > 0 ? processed[modeGroupIdx - 1].freq : 0;
    const nextFreq = modeGroupIdx < processed.length - 1 ? processed[modeGroupIdx + 1].freq : 0;
    const d1 = mg.freq - prevFreq;
    const d2 = mg.freq - nextFreq;
    const mode = (d1 + d2 > 0)
      ? mg.min + (d1 / (d1 + d2)) * mg.h_i
      : mg.c_i;

    return {
      n,
      mean,
      median,
      mode,
      q1,
      q2: median,
      q3,
      iqr: q3 - q1,
      range,
      variance,
      stdDev,
      processed,
      medianGroup,
      prevCumMed,
      halfN,
      q1Group,
      q1Pos,
      prevCumQ1,
      q3Group,
      q3Pos,
      prevCumQ3,
      mg,
      prevFreq,
      nextFreq
    };
  }, [data]);

  const maxFreq = Math.max(...data.map(d => d.freq), 1);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              CÔNG CỤ ĐỘC QUYỀN TOÁN KNTT (LỚP 11 & 12)
            </div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5 mt-1">
              <Calculator className="w-7 h-7 text-indigo-600" />
              Trình Phân Tích Mẫu Số Liệu Ghép Nhóm & Giả Lập Casio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tự động tính toán các số đặc trưng đo xu thế trung tâm (Lớp 11) và đo mức độ phân tán (Lớp 12), kèm quy trình phân giải chi tiết từng bước.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1">Dữ liệu mẫu:</span>
            {Object.entries(PRESETS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setData(item.data)}
                className="px-3 py-1.5 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition flex items-center gap-1.5 shadow-xs"
                title={item.description}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {item.name.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Column: Data Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <span>Bảng tần số ghép nhóm</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  {data.length} nhóm
                </span>
              </h3>
              <button
                onClick={addRow}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm nhóm
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3">Nửa khoảng $[a_i; a_{i+1})$</th>
                    <th className="p-3">Tần số ($m_i$)</th>
                    <th className="p-3 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-indigo-50/30 transition">
                      <td className="p-2.5">
                        <div className="flex items-center gap-1 font-semibold text-xs">
                          <span className="text-slate-400 font-mono">[</span>
                          <input
                            type="number"
                            className="w-14 p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={row.min}
                            onChange={(e) => updateRow(i, 'min', parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-slate-400 font-mono">;</span>
                          <input
                            type="number"
                            className="w-14 p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={row.max}
                            onChange={(e) => updateRow(i, 'max', parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-slate-400 font-mono">)</span>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          className="w-16 p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-center text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          value={row.freq}
                          onChange={(e) => updateRow(i, 'freq', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => removeRow(i)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
                          title="Xóa nhóm này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Casio Interactive Keystroke Box */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3.5 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="font-extrabold text-amber-400 text-xs sm:text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>Hướng Dẫn Bấm Máy Tính Cầm Tay</span>
                </div>
                <div className="flex bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    onClick={() => setCasioModel('580')}
                    className={`px-2.5 py-1 rounded-md transition ${casioModel === '580' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    fx-580VN X
                  </button>
                  <button
                    onClick={() => setCasioModel('880')}
                    className={`px-2.5 py-1 rounded-md transition ${casioModel === '880' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    fx-880BTG
                  </button>
                </div>
              </div>

              {casioModel === '580' ? (
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <b className="text-emerald-300">Bật cột tần số (Frequency):</b> Bấm <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">SHIFT</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">MENU</kbd> $\rightarrow$ bấm phím <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">▼</kbd> xuống $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">3: Thống kê</kbd> $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">1: Bật (On)</kbd>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <b className="text-emerald-300">Nhập dữ liệu mẫu:</b> Bấm <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">MENU</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">6</kbd> (Thống kê) $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">1: 1-Biến</kbd>. Nhập giá trị đại diện $c_i$ vào cột $x$ và tần số $m_i$ vào cột $FREQ$.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <b className="text-emerald-300">Xem kết quả tự động:</b> Bấm phím <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">OPTN</kbd> $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono text-[10px]">2: Tính 1-Biến</kbd>. Máy hiển thị <MathView content="$\bar{x}, \sum x, \sigma_x, s_x, Q_1, Med, Q_3$" inline />.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <b className="text-sky-300">Bật tần số:</b> Nhấn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">HOME</kbd> $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">Statistics</kbd> $\rightarrow$ nhấn phím <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">TOOLS</kbd> $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">Frequency</kbd> $\rightarrow$ chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">On</kbd>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <b className="text-sky-300">Nhập số liệu & tính:</b> Chọn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">1-Variable</kbd>, nhập giá trị đại diện $c_i$ và tần số $m_i$. Nhấn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">EXE</kbd> để hoàn tất.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Computed Metrics & Visual Chart */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-indigo-50/80 border border-indigo-200 p-3.5 rounded-2xl text-center">
                <div className="text-[11px] text-indigo-700 font-extrabold uppercase">Cỡ mẫu ($n$)</div>
                <div className="text-2xl font-black text-indigo-950 mt-1">{stats.n}</div>
                <div className="text-[10px] text-indigo-500 mt-0.5 font-medium">Tổng tần số</div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-center">
                <div className="text-[11px] text-amber-700 font-extrabold uppercase">Trung bình (<MathView content="$\bar{x}$" inline />)</div>
                <div className="text-2xl font-black text-amber-950 mt-1">{stats.mean.toFixed(2)}</div>
                <div className="text-[10px] text-amber-500 mt-0.5 font-medium">Số trung bình</div>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl text-center">
                <div className="text-[11px] text-emerald-700 font-extrabold uppercase">Trung vị ($M_e$)</div>
                <div className="text-2xl font-black text-emerald-950 mt-1">{stats.median.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-500 mt-0.5 font-medium">Vị trí mốc {stats.halfN}</div>
              </div>

              <div className="bg-rose-50/80 border border-rose-200 p-3.5 rounded-2xl text-center">
                <div className="text-[11px] text-rose-700 font-extrabold uppercase">Mốt ($M_o$)</div>
                <div className="text-2xl font-black text-rose-950 mt-1">{stats.mode.toFixed(2)}</div>
                <div className="text-[10px] text-rose-500 mt-0.5 font-medium">Đỉnh tần số</div>
              </div>
            </div>

            {/* Secondary Metrics: Quartiles and Dispersion (Lớp 11 & 12) */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 font-medium">Tứ phân vị $Q_1$:</div>
                <div className="font-extrabold text-indigo-700 text-base mt-0.5">{stats.q1.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 font-medium">Tứ phân vị $Q_3$:</div>
                <div className="font-extrabold text-indigo-700 text-base mt-0.5">{stats.q3.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 font-medium">Khoảng $\Delta_Q = Q_3 - Q_1$:</div>
                <div className="font-extrabold text-indigo-700 text-base mt-0.5">{stats.iqr.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-slate-500 font-medium">Khoảng biến thiên $R$:</div>
                <div className="font-extrabold text-emerald-700 text-base mt-0.5">{stats.range.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <div className="text-slate-500 font-medium">Phương sai $s^2$ / Độ lệch chuẩn $s$:</div>
                <div className="font-extrabold text-purple-700 text-base mt-0.5">
                  {stats.variance.toFixed(2)} <span className="text-slate-400 font-normal">/</span> {stats.stdDev.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Interactive Histogram Chart (SVG) */}
            <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Biểu Đồ Tần Số Ghép Nhóm (Histogram Phân Phối)
                </h4>
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-indigo-500 rounded-xs inline-block"></span> Cột tần số ($m$)
                  </span>
                </div>
              </div>

              {/* Chart Visual rendering */}
              <div className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 px-2">
                  {data.map((row, idx) => {
                    const heightPercent = maxFreq > 0 ? (row.freq / maxFreq) * 100 : 0;
                    const isMedianGroup = stats.medianGroup && stats.medianGroup.min === row.min;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                          Nhóm [{row.min}; {row.max}): <b>{row.freq}</b> ({(stats.n > 0 ? (row.freq / stats.n) * 100 : 0).toFixed(1)}%)
                        </div>

                        {/* Frequency number on bar */}
                        <span className="text-[11px] font-extrabold text-slate-700 mb-1">
                          {row.freq}
                        </span>

                        {/* Bar */}
                        <div
                          style={{ height: `${Math.max(8, heightPercent)}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 relative ${
                            isMedianGroup
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm'
                              : 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-700 group-hover:to-indigo-500'
                          }`}
                        >
                          {isMedianGroup && (
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200 whitespace-nowrap">
                              Chứa Me
                            </span>
                          )}
                        </div>

                        {/* Group Label */}
                        <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-2 text-center truncate max-w-full">
                          [{row.min}; {row.max})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Biểu Đồ Hộp (Box Plot) trực quan hóa theo Skill D3 Visualization */}
            <BoxPlotChart
              min={data[0]?.min || 0}
              max={data[data.length - 1]?.max || 20}
              q1={stats.q1}
              median={stats.median}
              q3={stats.q3}
              mean={stats.mean}
              histogramData={data.map(d => ({ label: `[${d.min}; ${d.max})`, freq: d.freq, min: d.min, max: d.max }))}
            />

            {/* Step by Step Mathematical Explanation */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Quy Trình Tính Toán Từng Bước Chuẩn SGK KNTT</span>
              </div>

              <div className="space-y-2.5 text-slate-700 leading-relaxed font-medium">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">1. Xác định cỡ mẫu ($n$) & Giá trị đại diện ($c_i$):</div>
                  <MathView content={`$$n = \\sum m_i = ${data.map(d => d.freq).join(' + ')} = ${stats.n}$$`} />
                  <div className="text-slate-600 text-[11px]">
                    Giá trị đại diện các nhóm: {stats.processed.map(p => `[${p.min};${p.max}) \\rightarrow c = ${p.c_i}`).join(', ')}
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">2. Số trung bình (<MathView content="$\bar{x}$" inline />):</div>
                  <MathView content={`$$\\bar{x} = \\frac{\\sum m_i c_i}{n} = \\frac{${stats.processed.map(p => `${p.freq}\\cdot${p.c_i}`).join(' + ')}}{${stats.n}} = ${stats.mean.toFixed(2)}$$`} />
                </div>

                {stats.medianGroup && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">3. Trung vị ($M_e$) [Toán 11]:</div>
                    <div>
                      Điểm mốc phân đôi: <MathView content={`$\\frac{n}{2} = \\frac{${stats.n}}{2} = ${stats.halfN}$`} inline />. Nhóm đầu tiên có tần số tích lũy <MathView content={`$cf \\ge ${stats.halfN}$`} inline /> là <b>[{stats.medianGroup.min}; {stats.medianGroup.max})</b> với đầu mút trái $a_p = {stats.medianGroup.min}$, độ dài $h = a_{p+1} - a_p = {stats.medianGroup.h_i}$, tần số $m_p = {stats.medianGroup.freq}$, và tần số tích lũy nhóm liền trước $C = {stats.prevCumMed}$.
                    </div>
                    <MathView content={`$$M_e = a_p + \\frac{\\frac{n}{2} - C}{m_p} \\cdot (a_{p+1} - a_p) = ${stats.medianGroup.min} + \\frac{${stats.halfN} - ${stats.prevCumMed}}{${stats.medianGroup.freq}} \\cdot ${stats.medianGroup.h_i} = ${stats.median.toFixed(2)}$$`} />
                  </div>
                )}

                {stats.q1Group && stats.q3Group && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">4. Tứ phân vị $Q_1, Q_3$ & Khoảng tứ phân vị $\Delta_Q$ [Toán 11 & 12]:</div>
                    <div className="space-y-1 mt-1">
                      <div>
                        • Vị trí <MathView content={`$\\frac{n}{4} = ${stats.q1Pos}$`} inline />: Nhóm chứa $Q_1$ là <b>[{stats.q1Group.min}; {stats.q1Group.max})</b> với $C = {stats.prevCumQ1}$, $m_p = {stats.q1Group.freq}$.
                        <MathView content={`$$Q_1 = ${stats.q1Group.min} + \\frac{${stats.q1Pos} - ${stats.prevCumQ1}}{${stats.q1Group.freq}} \\cdot ${stats.q1Group.h_i} = ${stats.q1.toFixed(2)}$$`} />
                      </div>
                      <div>
                        • Vị trí <MathView content={`$\\frac{3n}{4} = ${stats.q3Pos}$`} inline />: Nhóm chứa $Q_3$ là <b>[{stats.q3Group.min}; {stats.q3Group.max})</b> với $C = {stats.prevCumQ3}$, $m_p = {stats.q3Group.freq}$.
                        <MathView content={`$$Q_3 = ${stats.q3Group.min} + \\frac{${stats.q3Pos} - ${stats.prevCumQ3}}{${stats.q3Group.freq}} \\cdot ${stats.q3Group.h_i} = ${stats.q3.toFixed(2)}$$`} />
                      </div>
                      <div>
                        • Khoảng tứ phân vị:
                        <MathView content={`$$\\Delta_Q = Q_3 - Q_1 = ${stats.q3.toFixed(2)} - ${stats.q1.toFixed(2)} = ${stats.iqr.toFixed(2)}$$`} />
                      </div>
                    </div>
                  </div>
                )}

                {stats.mg && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">5. Mốt ($M_o$) [Toán 11]:</div>
                    <div>
                      Nhóm có tần số lớn nhất là <b>[{stats.mg.min}; {stats.mg.max})</b> ($m_j = ${stats.mg.freq}$). Tần số nhóm trước $m_{j-1} = {stats.prevFreq}$, nhóm sau $m_{j+1} = ${stats.nextFreq}$.
                    </div>
                    <MathView content={`$$M_o = a_j + \\frac{m_j - m_{j-1}}{(m_j - m_{j-1}) + (m_j - m_{j+1})} \\cdot (a_{j+1} - a_j) = ${stats.mg.min} + \\frac{${stats.mg.freq} - ${stats.prevFreq}}{(${stats.mg.freq} - ${stats.prevFreq}) + (${stats.mg.freq} - ${stats.nextFreq})} \\cdot ${stats.mg.h_i} = ${stats.mode.toFixed(2)}$$`} />
                  </div>
                )}

                {data.length > 0 && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">6. Khoảng biến thiên ($R$) mẫu ghép nhóm [Toán 12]:</div>
                    <div className="text-slate-600">
                      Hiệu giữa đầu mút phải của nhóm cuối cùng $a_{k+1}$ và đầu mút trái của nhóm đầu tiên $a_1$:
                    </div>
                    <MathView content={`$$R = a_{k+1} - a_1 = ${data[data.length - 1].max} - ${data[0].min} = ${stats.range.toFixed(2)}$$`} />
                  </div>
                )}

                {stats.n > 0 && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">7. Phương sai ($s^2$) & Độ lệch chuẩn ($s$) [Toán 12]:</div>
                    <MathView content={`$$s^2 = \\frac{1}{n} \\sum_{i=1}^k m_i c_i^2 - (\\bar{x})^2 = ${stats.variance.toFixed(2)}$$`} />
                    <MathView content={`$$s = \\sqrt{s^2} = \\sqrt{${stats.variance.toFixed(2)}} = ${stats.stdDev.toFixed(2)}$$`} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
