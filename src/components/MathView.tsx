import React, { useEffect, useState, useMemo } from 'react';
import { VariationTable, VariationTableProps, BBTArrow } from './VariationTable';
import { FunctionGraph, FunctionGraphProps, KeyPoint, Asymptote } from './FunctionGraph';
import { GraphData } from '../types';

declare global {
  interface Window {
    katex?: {
      render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
      renderToString: (tex: string, options?: Record<string, unknown>) => string;
    };
    renderMathInElement?: (
      element: HTMLElement,
      options?: {
        delimiters: Array<{ left: string; right: string; display: boolean }>;
        throwOnError?: boolean;
        macros?: Record<string, string>;
      }
    ) => void;
    markdownit?: (options?: Record<string, unknown>) => {
      render: (src: string) => string;
    };
  }
}

export interface MathViewProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Bộ tiền xử lý công thức toán học MathType & TeX chuyên sâu
 * Tự động sửa các lỗi thường gặp khi xuất từ MathType hoặc Word sang web:
 * - Chuẩn hóa vector 2 điểm: \vec{AB} -> \overrightarrow{AB}
 * - Chuẩn hóa các macro vector phổ biến: \vecto, \vt, \vv
 * - Tối ưu tích vô hướng, tích có hướng, độ dài vectơ
 * - Khắc phục các tag MathType rác: {\rm }, {\bf }, &nbsp;, v.v.
 */
export function preprocessMathType(raw: string): string {
  if (!raw) return '';

  // Chuẩn hóa Unicode dựng sẵn NFC để dấu tiếng Việt luôn chuẩn xác 100%
  let text = typeof raw === 'string' ? raw.normalize('NFC') : String(raw);

  // 1. Sửa các ký tự entity HTML lẫn vào công thức
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&amp;/g, '&');

  // 2. Chuẩn hóa công thức vectơ MathType
  // Vector 2 chữ cái viết hoa (AB, BC, CD, MN, PQ, v.v.): trong MathType hay để \vec{AB} hoặc \vec AB
  // KaTeX hiển thị \vec{AB} rất xấu (mũi tên cụt ở chữ A). Phải chuyển sang \overrightarrow{AB}!
  text = text.replace(/\\vec\s*\{([A-Z]{2,3})\}/g, '\\overrightarrow{$1}');
  text = text.replace(/\\vec\s+([A-Z]{2,3})(?![a-zA-Z])/g, '\\overrightarrow{$1}');

  // Chuẩn hóa \vt{...}, \vecto{...}, \vv{...} do giáo viên hay gõ tắt
  text = text.replace(/\\(vecto|vt|vv)\s*\{([A-Z]{2,3})\}/g, '\\overrightarrow{$2}');
  text = text.replace(/\\(vecto|vt|vv)\s*\{([a-z0-9_]+)\}/g, '\\vec{$2}');
  text = text.replace(/\\(vecto|vt|vv)\s+([A-Z]{2,3})(?![a-zA-Z])/g, '\\overrightarrow{$2}');
  text = text.replace(/\\(vecto|vt|vv)\s+([a-z0-9])(?![a-zA-Z])/g, '\\vec{$2}');

  // Tích vô hướng: \vec{a}.\vec{b} hoặc \vec{a} . \vec{b} -> \vec{a} \cdot \vec{b}
  text = text.replace(/(\\vec\{[a-z0-9]\})\s*\.\s*(\\vec\{[a-z0-9]\})/g, '$1 \\cdot $2');
  text = text.replace(/(\\overrightarrow\{[A-Z]+\})\s*\.\s*(\\overrightarrow\{[A-Z]+\})/g, '$1 \\cdot $2');

  // Góc giữa hai vectơ: (\vec{a}, \vec{b})
  text = text.replace(/\((\\vec\{[a-z]\})\s*,\s*(\\vec\{[a-z]\})\)/g, '($1,\\,\\vec{$2})');

  // Ký hiệu góc: \widehat{ABC} hoặc \angle ABC
  text = text.replace(/\\hat\s*\{([A-Z]{3})\}/g, '\\widehat{$1}');

  // Ký hiệu độ: 60^o, 90^o, 45^o -> 60^\circ
  text = text.replace(/(\d+)\s*\^[oO]\b/g, '$1^\\circ');

  // 3. Khắc phục các tag định dạng cũ từ MathType
  text = text.replace(/\{\\rm\s+([^}]+)\}/g, '\\mathrm{$1}');
  text = text.replace(/\{\\bf\s+([^}]+)\}/g, '\\mathbf{$1}');
  text = text.replace(/\{\\it\s+([^}]+)\}/g, '\\mathit{$1}');
  text = text.replace(/\{\\cal\s+([^}]+)\}/g, '\\mathcal{$1}');

  // 4. Chuẩn hóa song song và vuông góc
  text = text.replace(/\\parallel/g, '\\mathrel{/\\!/}');

  return text;
}

// Bộ KaTeX macros phong phú
export const KATEX_MACROS: Record<string, string> = {
  '\\vecto': '\\overrightarrow',
  '\\vt': '\\overrightarrow',
  '\\vv': '\\overrightarrow',
  '\\degree': '^\\circ',
  '\\parallel': '\\mathrel{/\\!/}',
  '\\Oxy': 'Oxy',
  '\\Oxyz': 'Oxyz',
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  '\\dx': '\\,\\mathrm{d}x',
  '\\dy': '\\,\\mathrm{d}y',
  '\\dz': '\\,\\mathrm{d}z',
  '\\dt': '\\,\\mathrm{d}t'
};

/**
 * Render công thức TeX an toàn bằng katex.renderToString
 */
export function renderTex(math: string, displayMode: boolean): string {
  if (typeof window !== 'undefined' && window.katex && window.katex.renderToString) {
    try {
      const cleaned = preprocessMathType(math.trim());
      return window.katex.renderToString(cleaned, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: true,
        macros: KATEX_MACROS
      });
    } catch {
      return displayMode ? `\\[${math}\\]` : `$${math}$`;
    }
  }
  return displayMode ? `\\[${math}\\]` : `$${math}$`;
}

/**
 * Fallback Markdown Parser khi markdown-it chưa tải xong
 * ĐẢM BẢO TUÂN THỦ CẤU HÌNH breaks: true để nhận diện dấu ngắt dòng \n thành <br>
 */
function fallbackMarkdownParse(src: string, options: { breaks: boolean } = { breaks: true }): string {
  if (!src) return '';

  const lines = src.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (!inTable) return;
    let html = '<div class="math-table-container my-3"><table class="w-full border-collapse text-center">';
    if (tableHeaders.length > 0) {
      html += '<thead><tr>';
      tableHeaders.forEach((h) => {
        html += `<th class="border border-slate-300 bg-slate-100/90 text-slate-800 font-bold px-3 py-2">${h.trim()}</th>`;
      });
      html += '</tr></thead>';
    }
    if (tableRows.length > 0) {
      html += '<tbody>';
      tableRows.forEach((row) => {
        html += '<tr>';
        row.forEach((cell) => {
          html += `<td class="border border-slate-300 px-3 py-2 text-slate-700">${cell.trim()}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody>';
    }
    html += '</table></div>';
    result.push(html);
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check Markdown Table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Delimiter row: | :--- | :---: | ---: |
      const isDelimiter = cells.every((c) => /^:?-+:?$/.test(c));
      if (isDelimiter) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (/^#{1,6}\s+/.test(trimmed)) {
      const level = trimmed.match(/^(#{1,6})\s+/)?.[1].length || 1;
      const text = trimmed.replace(/^#{1,6}\s+/, '');
      result.push(`<h${level} class="font-extrabold text-slate-900 my-2">${text}</h${level}>`);
      continue;
    }

    // Unordered List (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s+/, '');
      result.push(`<li class="ml-4 list-disc">${text}</li>`);
      continue;
    }

    // Ordered List (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s+/, '');
      result.push(`<li class="ml-4 list-decimal">${text}</li>`);
      continue;
    }

    // Blockquote (> )
    if (trimmed.startsWith('>')) {
      const text = trimmed.replace(/^>\s*/, '');
      result.push(`<blockquote class="border-l-4 border-indigo-500 pl-3 my-2 text-slate-600 italic bg-slate-50 py-1 rounded-r-lg">${text}</blockquote>`);
      continue;
    }

    // Empty line
    if (!trimmed) {
      result.push('<div class="h-2"></div>');
      continue;
    }

    // HTML tag line: don't add <br>
    if (trimmed.startsWith('<') && (trimmed.endsWith('>') || trimmed.startsWith('</') || trimmed.includes('>'))) {
      result.push(trimmed);
      continue;
    }

    // Normal paragraph with breaks: true
    result.push(options.breaks ? `${trimmed}<br>` : trimmed);
  }

  if (inTable) {
    flushTable();
  }

  let finalHtml = result.join('\n');

  // Inline formats: **bold**, *italic*, `code`, [link](url)
  finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  finalHtml = finalHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');
  finalHtml = finalHtml.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-700 font-mono px-1.5 py-0.5 rounded text-xs">$1</code>');
  finalHtml = finalHtml.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline font-semibold">$1</a>');

  // Remove trailing <br> at end of blocks
  finalHtml = finalHtml.replace(/<br>\s*<\/div>/g, '</div>');
  finalHtml = finalHtml.replace(/<br>\s*$/g, '');

  return finalHtml;
}

/**
 * Loại bỏ khoảng trắng thụt đầu dòng chung (dedent) của chuỗi multiline template literal
 * Ngăn chặn Markdown-It biến chuỗi HTML hoặc công thức có thụt lề thành khối <pre><code>
 */
export function dedent(str: string): string {
  if (!str) return '';
  const lines = str.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const match = line.match(/^([ \t]*)/);
      const indent = match ? match[1].length : 0;
      if (indent < minIndent) minIndent = indent;
    }
  }
  if (minIndent > 0 && minIndent !== Infinity) {
    return lines
      .map((l) => (l.length >= minIndent ? l.slice(minIndent) : l.trim()))
      .join('\n');
  }
  return str;
}

/**
 * Khởi tạo Markdown Parser với cấu hình breaks: true
 * Nhận diện ngắt dòng \n thành <br> theo đúng chuẩn sư phạm
 */
let cachedMarkdownParser: { render: (s: string) => string; disable?: (rule: string) => void } | null = null;

function getMarkdownParser() {
  if (cachedMarkdownParser) return cachedMarkdownParser;

  if (typeof window !== 'undefined' && typeof window.markdownit === 'function') {
    cachedMarkdownParser = window.markdownit({
      html: true,         // Bật hỗ trợ thẻ HTML
      xhtmlOut: false,    // Không bắt buộc xhtml
      breaks: true,       // BẬT CẤU HÌNH breaks: true ĐỂ NHẬN DIỆN DẤU NGẮT DÒNG \n THÀNH <br>
      langPrefix: 'language-',
      linkify: true,      // Tự động nhận diện URL thành link
      typographer: false  // Tắt typographic thay thế để tránh xung đột ký hiệu toán học
    });

    // TẮT INDENTED CODE BLOCK: tránh việc các chuỗi HTML thụt lề bị biến thành thẻ <pre><code>
    try {
      if (typeof cachedMarkdownParser.disable === 'function') {
        cachedMarkdownParser.disable('code');
      }
    } catch {
      // Bỏ qua nếu phiên bản cdn không hỗ trợ disable
    }

    return cachedMarkdownParser;
  }
  return null;
}

/**
 * Tokenize chuỗi kết hợp HTML, Markdown (breaks: true) và Toán học ($...$, $$...$$, \(...\), \[...\])
 * Tự động bọc bảng Toán học chuẩn sách giáo khoa
 */
export function renderMixedContent(raw: string): string {
  if (!raw) return '';

  // Khử thụt lề multiline template literal để không bị hiểu nhầm thành indented code block
  const normalizedRaw = dedent(raw.trim());

  const mathTokens: Array<{ token: string; rendered: string; display: boolean }> = [];
  let tokenCounter = 0;

  // 1. Bảo vệ các khối công thức TeX trước khi đưa qua Markdown Parser
  // Ngăn chặn Markdown Parser phá hoại dấu _, *, \, | trong công thức toán
  const mathRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g;

  const protectedText = normalizedRaw.replace(mathRegex, (match) => {
    const isDisplay =
      (match.startsWith('$$') && match.endsWith('$$')) ||
      (match.startsWith('\\[') && match.endsWith('\\]'));

    let formula = match;
    if (match.startsWith('$$') && match.endsWith('$$')) {
      formula = match.slice(2, -2);
    } else if (match.startsWith('\\[') && match.endsWith('\\]')) {
      formula = match.slice(2, -2);
    } else if (match.startsWith('$') && match.endsWith('$')) {
      formula = match.slice(1, -1);
    } else if (match.startsWith('\\(') && match.endsWith('\\)')) {
      formula = match.slice(2, -2);
    }

    const renderedTex = renderTex(formula, isDisplay);
    const token = `KATEXTOKEN${tokenCounter++}Z`;

    mathTokens.push({
      token,
      rendered: renderedTex,
      display: isDisplay
    });

    return token;
  });

  // 2. Chạy Markdown Parser với cấu hình breaks: true
  const md = getMarkdownParser();
  let parsedHtml = '';

  if (md) {
    try {
      parsedHtml = md.render(protectedText);
    } catch {
      parsedHtml = fallbackMarkdownParse(protectedText, { breaks: true });
    }
  } else {
    parsedHtml = fallbackMarkdownParse(protectedText, { breaks: true });
  }

  // 3. Khôi phục lại các token công thức TeX đã render
  for (const { token, rendered, display } of mathTokens) {
    const tokenRegex = new RegExp(token, 'g');

    if (display) {
      const displayHtml = `<span class="katex-display-wrapper my-3 block text-center overflow-x-auto">${rendered}</span>`;
      // Nếu Markdown Parser bọc token display trong thẻ <p>...</p>, thay thế nguyên thẻ <p> để tránh lồng khối
      const paragraphWithTokenRegex = new RegExp(`<p>\\s*${token}\\s*<\\/p>`, 'g');
      if (paragraphWithTokenRegex.test(parsedHtml)) {
        parsedHtml = parsedHtml.replace(paragraphWithTokenRegex, displayHtml);
      } else {
        parsedHtml = parsedHtml.replace(tokenRegex, displayHtml);
      }
    } else {
      const inlineHtml = `<span class="katex-inline-wrapper inline-block mx-0.5">${rendered}</span>`;
      parsedHtml = parsedHtml.replace(tokenRegex, inlineHtml);
    }
  }

  // 4. Bọc các thẻ <table> sinh bởi Markdown parser vào container chuẩn SGK nếu chưa bọc
  parsedHtml = parsedHtml.replace(
    /(<table[\s\S]*?<\/table>)/g,
    (match) => {
      // Nếu đã nằm trong .math-table-container thì giữ nguyên
      return `<div class="math-table-container">${match}</div>`;
    }
  );

  return parsedHtml;
}

/**
 * Trình phân tích cú pháp khối Bảng Biến Thiên Tự Động (BBT Parser)
 * Hỗ trợ định dạng JSON hoặc cú pháp tốc ký:
 * ```bbt
 * {
 *   "title": "Bảng biến thiên f(x)",
 *   "xPoints": ["-\\infty", "-1", "1", "+\\infty"],
 *   "yPrimeValues": ["+", "0", "-", "0", "+"],
 *   "arrows": [...]
 * }
 * ```
 */
export function parseBBTBlock(rawBlock: string): VariationTableProps | null {
  try {
    const trimmed = rawBlock.trim();

    // 1. Thử parse dạng JSON chuẩn (có khử lỗi ký tự thoát TeX unescaped \infty, \frac,...)
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const sanitized = trimmed.replace(/\\(?![/"\\bfnrtu])/g, '\\\\');
      const data = JSON.parse(sanitized);
      if (Array.isArray(data.xPoints) && Array.isArray(data.yPrimeValues)) {
        return {
          title: data.title || 'Bảng biến thiên chuẩn sư phạm',
          functionTex: data.functionTex || data.fn,
          xPoints: data.xPoints,
          asymptoteIndices: data.asymptoteIndices || [],
          yPrimeValues: data.yPrimeValues,
          arrows: data.arrows || [],
          variableName: data.variableName || 'x',
          derivativeName: data.derivativeName,
          functionName: data.functionName,
          showToolbar: data.showToolbar !== false
        };
      }
    }

    // 2. Thử parse dạng shorthand [bbt: x=... | y'=... | arrows=...]
    const parts = trimmed.split('|').map((p) => p.trim());
    const config: Record<string, string> = {};

    parts.forEach((p) => {
      const eqIdx = p.indexOf('=');
      if (eqIdx !== -1) {
        const key = p.substring(0, eqIdx).trim().toLowerCase();
        const val = p.substring(eqIdx + 1).trim();
        config[key] = val;
      }
    });

    if (config['x']) {
      const xPoints = config['x'].split(',').map((s) => s.trim());
      const yPrimeValues = (config['y\''] || config['yprime'] || '')
        .split(',')
        .map((s) => s.trim());
      const title = config['title'] || 'Bảng biến thiên chuẩn sư phạm';
      const functionTex = config['fn'] || config['function'];

      const asymptoteIndices: number[] = config['asymp']
        ? config['asymp'].split(',').map((s) => parseInt(s.trim(), 10))
        : [];

      // Mặc định sinh mũi tên nếu chưa chỉ định rõ
      const arrows: BBTArrow[] = [];
      if (config['arrows']) {
        const arrowDefs = config['arrows'].split(';').map((s) => s.trim());
        arrowDefs.forEach((aDef) => {
          // định dạng: 0:bottom->1:top:4
          const m = aDef.match(/(\d+):([a-z-]+)->(\d+):([a-z-]+)(?::(.+))?/i);
          if (m) {
            const fromIdx = parseInt(m[1], 10);
            const fromLvl = m[2] as BBTArrow['fromLevel'];
            const toIdx = parseInt(m[3], 10);
            const toLvl = m[4] as BBTArrow['toLevel'];
            const label = m[5] || '';
            const isUp = fromLvl === 'bottom' || (fromLvl === 'mid' && toLvl === 'top');

            arrows.push({
              fromIndex: fromIdx,
              toIndex: toIdx,
              fromLevel: fromLvl,
              toLevel: toLvl,
              fromLabel: '',
              toLabel: label,
              direction: isUp ? 'up' : 'down'
            });
          }
        });
      }

      return {
        title,
        functionTex,
        xPoints,
        asymptoteIndices,
        yPrimeValues: yPrimeValues.length ? yPrimeValues : ['+'],
        arrows,
        showToolbar: true
      };
    }
  } catch {
    // Không parse được BBT
  }
  return null;
}

/**
 * Biên dịch an toàn chuỗi biểu thức toán học thành hàm tính giá trị y = f(x)
 * Hỗ trợ các dạng: x^3 - 3*x + 1, (2x - 1)/(x + 1), (x^2 + 1)/(x - 1), v.v.
 */
export function compileMathExpr(rawExpr: string): (x: number) => number | null {
  try {
    let clean = (rawExpr || '').trim();
    if (!clean) return () => null;

    // Khử y = hoặc f(x) = nếu có
    clean = clean.replace(/^(?:y|f\(x\))\s*=\s*/i, '');

    // Khử các lệnh TeX nếu người dùng hoặc AI viết LaTeX
    clean = clean.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '(($1)/($2))');
    clean = clean.replace(/\\sqrt\{([^}]+)\}/g, 'Math.sqrt($1)');
    clean = clean.replace(/\\sin\b/g, 'sin');
    clean = clean.replace(/\\cos\b/g, 'cos');
    clean = clean.replace(/\\tan\b/g, 'tan');

    // Chuyển lũy thừa: ^ -> **
    clean = clean.replace(/\^/g, '**');

    // Chuyển nhân ngầm:
    // Số liền kề biến hoặc mở ngoặc: 2x -> 2*x, 2( -> 2*(
    clean = clean.replace(/(\d+)\s*([a-zA-Z(])/g, '$1*$2');
    // Đóng ngoặc liền kề: )( -> )*(, )x -> )*x, )2 -> )*2
    clean = clean.replace(/\)\s*([a-zA-Z0-9(])/g, ')*$1');
    // Biến x liền kề mở ngoặc: x( -> x*(
    clean = clean.replace(/\bx\s*\(/gi, 'x*(');

    // Chuẩn hóa các hàm toán sang Math.*
    clean = clean.replace(/\b(sin|cos|tan|asin|acos|atan|sqrt|abs|exp)\b/g, 'Math.$1');
    clean = clean.replace(/\bln\b/g, 'Math.log');
    clean = clean.replace(/\blog\b/g, 'Math.log10');
    clean = clean.replace(/\bpi\b/gi, 'Math.PI');
    clean = clean.replace(/\be\b/g, 'Math.E');

    // Kiểm tra an toàn: chỉ cho phép ký tự toán học hợp lệ
    const disallowed = clean
      .replace(/\bMath\.(?:sin|cos|tan|asin|acos|atan|sqrt|abs|exp|log|log10|PI|E)\b/g, '')
      .replace(/\bx\b/gi, '');
    if (/[a-zA-Z_$]/.test(disallowed)) {
      return () => null;
    }

    const fn = new Function('x', 'Math', `try { return (${clean}); } catch (e) { return null; }`);
    return (x: number) => {
      try {
        const val = fn(x, Math);
        if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return null;
        return val;
      } catch {
        return null;
      }
    };
  } catch {
    return () => null;
  }
}

/**
 * Tạo hàm evaluate(x) từ cấu hình dạng type hoặc dạng biểu thức expr
 */
export function createEvaluateFunction(data: any): ((x: number) => number | null) | null {
  if (!data) return null;

  const { expr, type } = data;
  const a = typeof data.a === 'number' ? data.a : 1;
  const b = typeof data.b === 'number' ? data.b : 0;
  const c = typeof data.c === 'number' ? data.c : 0;
  const d = typeof data.d === 'number' ? data.d : 0;
  const p = typeof data.p === 'number' ? data.p : 1;
  const q = typeof data.q === 'number' ? data.q : 0;

  if (type === 'cubic') {
    return (x: number) => a * x * x * x + b * x * x + c * x + d;
  }
  if (type === 'quadratic' || type === 'parabola') {
    return (x: number) => a * x * x + b * x + c;
  }
  if (type === 'quartic') {
    return (x: number) => a * Math.pow(x, 4) + b * x * x + c;
  }
  if (type === 'rational_1_1') {
    return (x: number) => {
      const denom = c * x + d;
      if (Math.abs(denom) < 0.0001) return null;
      return (a * x + b) / denom;
    };
  }
  if (type === 'rational_2_1') {
    return (x: number) => {
      const denom = p * x + q;
      if (Math.abs(denom) < 0.0001) return null;
      return (a * x * x + b * x + c) / denom;
    };
  }
  if (type === 'linear') {
    return (x: number) => a * x + b;
  }

  if (expr && typeof expr === 'string') {
    return compileMathExpr(expr);
  }

  return null;
}

/**
 * Chuyển đổi dữ liệu GraphData sang FunctionGraphProps
 */
export function parseGraphDataToProps(data: GraphData): FunctionGraphProps | null {
  if (!data) return null;
  const evaluate = createEvaluateFunction(data);
  if (!evaluate) return null;

  return {
    title: data.title || 'Đồ thị hàm số trên mặt phẳng Oxy',
    functionTex: data.functionTex || data.expr,
    evaluate,
    keyPoints: (data.keyPoints as KeyPoint[]) || [],
    asymptotes: (data.asymptotes as Asymptote[]) || [],
    xDomain: data.xDomain || [-5, 5],
    yDomain: data.yDomain || [-5, 5],
    width: 560,
    height: 360
  };
}

/**
 * Trình phân tích cú pháp khối Đồ Thị Hàm Số Tự Động (Graph Parser)
 * Hỗ trợ định dạng JSON trong ```graph ... ``` hoặc cú pháp tốc ký: [graph: expr=... | title=...]
 */
export function parseGraphBlock(rawBlock: string): FunctionGraphProps | null {
  try {
    const trimmed = rawBlock.trim();

    // 1. Thử parse dạng JSON chuẩn
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const sanitized = trimmed.replace(/\\(?![/"\\bfnrtu])/g, '\\\\');
      const data = JSON.parse(sanitized);

      const evaluate = createEvaluateFunction(data);
      if (!evaluate) return null;

      return {
        title: data.title || 'Đồ thị hàm số trên mặt phẳng Oxy',
        functionTex: data.functionTex || data.fn || data.expr,
        evaluate,
        keyPoints: data.keyPoints || [],
        asymptotes: data.asymptotes || [],
        xDomain: data.xDomain || [-5, 5],
        yDomain: data.yDomain || [-5, 5],
        width: data.width || 560,
        height: data.height || 360
      };
    }

    // 2. Thử parse dạng shorthand [graph: expr=... | title=... | xDomain=-4,4 | yDomain=-4,4]
    const parts = trimmed.split('|').map((p) => p.trim());
    const config: Record<string, string> = {};

    parts.forEach((p) => {
      const eqIdx = p.indexOf('=');
      if (eqIdx !== -1) {
        const key = p.substring(0, eqIdx).trim().toLowerCase();
        const val = p.substring(eqIdx + 1).trim();
        config[key] = val;
      }
    });

    const expr = config['expr'] || config['function'] || config['fn'];
    if (!expr) return null;

    const evaluate = compileMathExpr(expr);
    const title = config['title'] || 'Đồ thị hàm số trên mặt phẳng Oxy';
    const functionTex = config['fntex'] || config['tex'] || expr;

    let xDomain: [number, number] = [-5, 5];
    if (config['xdomain']) {
      const xd = config['xdomain'].split(',').map((s) => parseFloat(s.trim()));
      if (xd.length === 2 && !isNaN(xd[0]) && !isNaN(xd[1])) {
        xDomain = [xd[0], xd[1]];
      }
    }

    let yDomain: [number, number] = [-5, 5];
    if (config['ydomain']) {
      const yd = config['ydomain'].split(',').map((s) => parseFloat(s.trim()));
      if (yd.length === 2 && !isNaN(yd[0]) && !isNaN(yd[1])) {
        yDomain = [yd[0], yd[1]];
      }
    }

    const keyPoints: KeyPoint[] = [];
    if (config['points']) {
      const pts = config['points'].split(';').map((s) => s.trim());
      pts.forEach((ptStr) => {
        const m = ptStr.match(/\(?\s*([-\d.]+)\s*,\s*([-\d.]+)(?:\s*:\s*([^)]+))?\s*\)?/);
        if (m) {
          const x = parseFloat(m[1]);
          const y = parseFloat(m[2]);
          const label = m[3] || `(${x}; ${y})`;
          if (!isNaN(x) && !isNaN(y)) {
            keyPoints.push({ x, y, label });
          }
        }
      });
    }

    const asymptotes: Asymptote[] = [];
    if (config['asymp']) {
      const asList = config['asymp'].split(';').map((s) => s.trim());
      asList.forEach((asStr) => {
        const [type, val, extra] = asStr.split(':');
        if (type === 'vert' || type === 'vertical') {
          asymptotes.push({ type: 'vertical', value: parseFloat(val), label: `x = ${val}` });
        } else if (type === 'horiz' || type === 'horizontal') {
          asymptotes.push({ type: 'horizontal', value: parseFloat(val), label: `y = ${val}` });
        } else if (type === 'slant') {
          asymptotes.push({
            type: 'slant',
            value: parseFloat(extra || '0'),
            slantSlope: parseFloat(val),
            label: `y = ${val}x + ${extra || '0'}`
          });
        }
      });
    }

    return {
      title,
      functionTex,
      evaluate,
      keyPoints,
      asymptotes,
      xDomain,
      yDomain,
      width: 560,
      height: 360
    };
  } catch {
    return null;
  }
}

/**
 * Phân tách nội dung thành các phân đoạn Text (Markdown + Math), Bảng Biến Thiên SVG và Đồ Thị Hàm Số SVG
 */
type ContentSegment =
  | { type: 'markdown'; content: string }
  | { type: 'bbt'; props: VariationTableProps }
  | { type: 'graph'; props: FunctionGraphProps };

export function splitContentSegments(raw: string): ContentSegment[] {
  if (!raw) return [];

  const segments: ContentSegment[] = [];

  // Nhận diện khối code ```bbt / ```graph hoặc thẻ [bbt: ...] / [graph: ...]
  const blockRegex = /(?:```(bbt|graph)\s*([\s\S]*?)\s*```|\[(bbt|graph):\s*([\s\S]*?)\s*\])/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(raw)) !== null) {
    const matchStart = match.index;
    const matchEnd = blockRegex.lastIndex;

    // Thêm đoạn Markdown trước khối
    if (matchStart > lastIndex) {
      const textChunk = raw.substring(lastIndex, matchStart);
      if (textChunk.trim()) {
        segments.push({ type: 'markdown', content: textChunk });
      }
    }

    const blockType = (match[1] || match[3] || '').toLowerCase();
    const blockSource = match[2] || match[4] || '';

    if (blockType === 'bbt') {
      const bbtProps = parseBBTBlock(blockSource);
      if (bbtProps) {
        segments.push({ type: 'bbt', props: bbtProps });
      } else {
        segments.push({ type: 'markdown', content: match[0] });
      }
    } else if (blockType === 'graph') {
      const graphProps = parseGraphBlock(blockSource);
      if (graphProps) {
        segments.push({ type: 'graph', props: graphProps });
      } else {
        segments.push({ type: 'markdown', content: match[0] });
      }
    } else {
      segments.push({ type: 'markdown', content: match[0] });
    }

    lastIndex = matchEnd;
  }

  // Thêm đoạn text còn lại sau khối cuối cùng
  if (lastIndex < raw.length) {
    const trailingChunk = raw.substring(lastIndex);
    if (trailingChunk.trim()) {
      segments.push({ type: 'markdown', content: trailingChunk });
    }
  }

  return segments;
}

export const MathView: React.FC<MathViewProps> = ({ content, className = '', inline = false }) => {
  const [katexLoaded, setKatexLoaded] = useState(() => {
    return typeof window !== 'undefined' && !!window.katex;
  });

  const [mdLoaded, setMdLoaded] = useState(() => {
    return typeof window !== 'undefined' && typeof window.markdownit === 'function';
  });

  // Tự động kiểm tra và đồng bộ khi thư viện CDN KaTeX và markdown-it sẵn sàng
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.katex && window.markdownit) {
      setKatexLoaded(true);
      setMdLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      let changed = false;
      if (window.katex && !katexLoaded) {
        setKatexLoaded(true);
        changed = true;
      }
      if (window.markdownit && !mdLoaded) {
        setMdLoaded(true);
        cachedMarkdownParser = null; // Làm mới parser
        changed = true;
      }
      if (window.katex && window.markdownit) {
        clearInterval(interval);
      }
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [katexLoaded, mdLoaded]);

  // Phân tích phân đoạn nội dung
  const segments = useMemo(() => {
    if (inline) {
      return [{ type: 'markdown' as const, content }];
    }
    return splitContentSegments(content);
  }, [content, inline]);

  if (inline) {
    const renderedInline = renderMixedContent(content);
    return (
      <span
        className={`math-content leading-relaxed inline ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedInline }}
      />
    );
  }

  const textColorClass = className.includes('text-') ? '' : 'text-slate-800';

  return (
    <div className={`math-content leading-relaxed space-y-2 ${textColorClass} ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'bbt') {
          return (
            <div key={`bbt-seg-${idx}`} className="my-3">
              <VariationTable {...seg.props} />
            </div>
          );
        }

        if (seg.type === 'graph') {
          return (
            <div key={`graph-seg-${idx}`} className="my-4 flex justify-center overflow-x-auto">
              <FunctionGraph {...seg.props} />
            </div>
          );
        }

        const renderedHtml = renderMixedContent(seg.content);
        return (
          <div
            key={`md-seg-${idx}`}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        );
      })}
    </div>
  );
};
