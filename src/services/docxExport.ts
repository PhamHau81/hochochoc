import { ExamQuestion } from '../types';

export interface ExamExportOptions {
  title: string;
  subtitle?: string;
  durationMinutes: number;
  includeAnswers: boolean;
  includeSolutions: boolean;
  questions: ExamQuestion[];
}

/**
 * Xuất đề thi ra file Word (.docx / .doc) mở được trực tiếp trên Microsoft Word & Google Docs
 */
export function exportExamToWord(options: ExamExportOptions): void {
  const { title, subtitle, durationMinutes, includeAnswers, includeSolutions, questions } = options;

  const part1 = questions.filter((q) => q.part === 'I');
  const part2 = questions.filter((q) => q.part === 'II');
  const part3 = questions.filter((q) => q.part === 'III');

  // Làm sạch công thức LaTeX sang text dễ đọc trong Word nếu chưa render
  const cleanMathForWord = (raw: string) => {
    if (!raw) return '';
    let text = raw;
    text = text.replace(/```(?:graph|bbt)[\s\S]*?```/gi, (m) => {
      if (m.toLowerCase().includes('bbt')) return '\n[Bảng biến thiên hàm số]\n';
      return '\n[Hình vẽ: Đồ thị hàm số]\n';
    });
    text = text.replace(/\[(?:graph|bbt):[\s\S]*?\]/gi, (m) => {
      if (m.toLowerCase().includes('bbt')) return '\n[Bảng biến thiên hàm số]\n';
      return '\n[Hình vẽ: Đồ thị hàm số]\n';
    });

    return text
      .replace(/\\overrightarrow\{([A-Z]+)\}/g, 'vectơ $1')
      .replace(/\\vec\{([a-z0-9]+)\}/g, 'vectơ $1')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\ne/g, '≠')
      .replace(/\\pm/g, '±')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\in/g, '∈')
      .replace(/\\infty/g, '∞')
      .replace(/\\mathbb\{R\}/g, 'R')
      .replace(/\$+/g, '');
  };

  let htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${title}</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; margin: 2cm; }
  h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 2pt; text-transform: uppercase; }
  h2 { font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; color: #1e3a8a; }
  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 15pt; }
  .header-table td { border: none; vertical-align: top; }
  .question-item { margin-bottom: 10pt; }
  .question-title { font-weight: bold; }
  .options-table { width: 100%; border-collapse: collapse; margin-top: 4pt; }
  .options-table td { border: none; padding: 2pt 4pt; width: 25%; }
  .answer-table { width: 100%; border-collapse: collapse; margin-top: 10pt; }
  .answer-table th, .answer-table td { border: 1px solid #333; padding: 4pt 6pt; text-align: center; }
  .solution-box { background-color: #f8fafc; border-left: 3px solid #2563eb; padding: 6pt; margin-top: 4pt; font-size: 11pt; }
</style>
</head>
<body>

<!-- Tiêu đề đầu đề thi chuẩn Bộ GD&ĐT -->
<table class='header-table'>
  <tr>
    <td style='width: 45%; text-align: center;'>
      <b>BỘ GIÁO DỤC VÀ ĐÀO TẠO</b><br>
      <b>APP TỰ ÔN TẬP - PHẠM HẬU</b><br>
      <i>(Đề thi gồm có ${questions.length} câu)</i>
    </td>
    <td style='width: 55%; text-align: center;'>
      <b>KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG</b><br>
      <b>Môn thi: TOÁN HỌC (Chuẩn 2026 Trở Đi)</b><br>
      <i>Thời gian làm bài: ${durationMinutes} phút (không kể thời gian phát đề)</i>
    </td>
  </tr>
</table>

<div style='text-align: center; margin-bottom: 12pt;'>
  <b>MÃ ĐỀ THI: 101</b><br>
  <span>Họ, tên thí sinh: ...................................................................... Số báo danh: ........................</span>
</div>

<hr style='border: 1px solid #333; margin-bottom: 14pt;'>
`;

  // PHẦN I
  if (part1.length > 0) {
    htmlContent += `
<h2>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (Thí sinh trả lời từ câu 1 đến câu ${part1.length}. Mỗi câu hỏi chỉ chọn một phương án).</h2>
`;
    part1.forEach((q, idx) => {
      htmlContent += `
<div class='question-item'>
  <div class='question-title'>Câu ${idx + 1}: ${cleanMathForWord(q.content)}</div>
`;
      if (q.options && q.options.length > 0) {
        htmlContent += `<table class='options-table'><tr>`;
        q.options.forEach((opt) => {
          htmlContent += `<td><b>${opt.id}.</b> ${cleanMathForWord(opt.text)}</td>`;
        });
        htmlContent += `</tr></table>`;
      }
      if (includeSolutions && q.solution) {
        htmlContent += `<div class='solution-box'><b>Đáp án đúng: ${q.correctAnswer}</b><br><i>Lời giải:</i> ${cleanMathForWord(q.solution)}</div>`;
      }
      htmlContent += `</div>`;
    });
  }

  // PHẦN II
  if (part2.length > 0) {
    htmlContent += `
<h2>PHẦN II. Câu trắc nghiệm đúng sai (Thí sinh trả lời từ câu 1 đến câu ${part2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai).</h2>
`;
    part2.forEach((q, idx) => {
      htmlContent += `
<div class='question-item'>
  <div class='question-title'>Câu ${idx + 1}: ${cleanMathForWord(q.content)}</div>
`;
      if (q.subQuestions && q.subQuestions.length > 0) {
        q.subQuestions.forEach((sub) => {
          htmlContent += `<div style='margin-left: 15pt;'><b>${sub.id})</b> ${cleanMathForWord(sub.statement)} ${includeAnswers ? `<b>[${sub.isCorrect ? 'ĐÚNG' : 'SAI'}]</b>` : ''}</div>`;
        });
      }
      if (includeSolutions && q.solution) {
        htmlContent += `<div class='solution-box'><i>Lời giải chi tiết:</i> ${cleanMathForWord(q.solution)}</div>`;
      }
      htmlContent += `</div>`;
    });
  }

  // PHẦN III
  if (part3.length > 0) {
    htmlContent += `
<h2>PHẦN III. Câu trắc nghiệm trả lời ngắn (Thí sinh trả lời từ câu 1 đến câu ${part3.length}).</h2>
`;
    part3.forEach((q, idx) => {
      htmlContent += `
<div class='question-item'>
  <div class='question-title'>Câu ${idx + 1}: ${cleanMathForWord(q.content)}</div>
  <div style='margin-top: 4pt;'><i>Trả lời:</i> ................................................................</div>
`;
      if (includeSolutions && q.solution) {
        htmlContent += `<div class='solution-box'><b>Đáp án: ${q.correctAnswer}</b><br><i>Lời giải chi tiết:</i> ${cleanMathForWord(q.solution)}</div>`;
      }
      htmlContent += `</div>`;
    });
  }

  // BẢNG ĐÁP ÁN TỔNG HỢP NẾU CHỌN INCLUDE ANSWERS
  if (includeAnswers) {
    htmlContent += `
<div style='page-break-before: always;'></div>
<h2>BẢNG ĐÁP ÁN THAM KHẢO & TỔNG KẾT</h2>
<table class='answer-table'>
  <tr>
    <th>Câu</th>
    <th>Phần</th>
    <th>Dạng</th>
    <th>Đáp án đúng</th>
  </tr>
`;
    questions.forEach((q, i) => {
      let ansText = q.correctAnswer || '';
      if (q.format === 'true_false_4' && q.subQuestions) {
        ansText = q.subQuestions.map((s) => `${s.id}: ${s.isCorrect ? 'Đ' : 'S'}`).join(' | ');
      }
      htmlContent += `
  <tr>
    <td>${i + 1}</td>
    <td>Phần ${q.part}</td>
    <td>${q.difficulty}</td>
    <td><b>${ansText}</b></td>
  </tr>
`;
    });
    htmlContent += `</table>`;
  }

  htmlContent += `
<div style='text-align: center; margin-top: 25pt; font-weight: bold;'>
  -------------------- HẾT --------------------<br>
  <i>(Cán bộ coi thi không giải thích gì thêm)</i>
</div>
</body>
</html>
`;

  // Tạo Blob và trigger download
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileNameSuffix = includeAnswers ? 'kem_dap_an' : 'de_thi';
  a.download = `De_Thi_Toan_THPT_${fileNameSuffix}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
