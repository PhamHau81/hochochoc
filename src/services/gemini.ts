import { GoogleGenAI } from '@google/genai';
import { Question, ExamQuestion, GradeNumber } from '../types';

export interface AIModelConfig {
  id: string;
  name: string;
  badge: string;
  description: string;
}

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash (Khuyên Dùng)',
    badge: 'Mặc định • Tốc độ cao & Ổn định nhất',
    description: 'Model tốc độ siêu nhanh, độ ổn định tuyệt đối trên 100% tài khoản Google API Key cá nhân miễn phí.'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    badge: 'Tương thích cao • Quota dồi dào',
    description: 'Model tin cậy kinh điển, hạn ngạch dồi dào, giải toán THPT chuẩn mực.'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Thế hệ mới • Suy luận nâng cao',
    description: 'Tối ưu cho phản hồi nhanh và giải các bài toán tư duy vận dụng cao.'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    badge: 'Suy luận chuyên sâu',
    description: 'Mạnh mẽ trong việc phân tích các bài toán hình không gian và xác suất thống kê phức tạp.'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    badge: 'Mô hình Pro cao cấp',
    description: 'Chuyên gia giải toán tư duy logic chuyên sâu và tối ưu hóa giải tích.'
  }
];

const FALLBACK_CHAIN = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-2.5-pro'
];

export const getStoredApiKey = (): string => {
  try {
    const local = localStorage.getItem('gemini_api_key');
    if (local && local.trim()) {
      return local.trim();
    }
  } catch {
    // ignore
  }

  // Tự động nhận diện API Key từ biến môi trường Vite nếu đã cấu hình (.env hoặc Vercel)
  try {
    const envKey =
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (import.meta as any).env?.GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim()) {
      return envKey.trim();
    }
  } catch {
    // ignore
  }

  return '';
};

export const setStoredApiKey = (key: string): void => {
  try {
    localStorage.setItem('gemini_api_key', key.trim());
  } catch {
    // ignore
  }
};

export const getStoredModel = (): string => {
  try {
    const saved = localStorage.getItem('gemini_selected_model');
    if (saved && (AI_MODELS.some(m => m.id === saved) || saved.startsWith('gemini-'))) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'gemini-2.0-flash';
};

export const setStoredModel = (modelId: string): void => {
  try {
    localStorage.setItem('gemini_selected_model', modelId);
  } catch {
    // ignore
  }
};

interface CallAIOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  onModelAttempt?: (modelName: string) => void;
}

/**
 * Helper trích xuất an toàn nội dung text từ response của GoogleGenAI,
 * tự động loại bỏ các khối suy luận reasoning/thought để lấy chuỗi kết quả thực sự.
 */
function extractResponseText(response: any): string {
  if (!response) return '';

  if (response.candidates && response.candidates[0]?.content?.parts) {
    const parts = response.candidates[0].content.parts;
    // Lọc bỏ part suy luận (thought: true) nếu có, chỉ lấy part trả lời thực sự
    const textParts = parts.filter((p: any) => !p.thought && typeof p.text === 'string');
    if (textParts.length > 0) {
      return textParts.map((p: any) => p.text).join('').trim();
    }
    // Nếu tất cả part đều có text
    const allText = parts
      .map((p: any) => (typeof p.text === 'string' ? p.text : ''))
      .join('')
      .trim();
    if (allText) return allText;
  }

  if (typeof response.text === 'string' && response.text) {
    return response.text.trim();
  }

  if (typeof response.text === 'function') {
    try {
      const t = response.text();
      if (t) return String(t).trim();
    } catch {
      // ignore
    }
  }

  return '';
}

/**
 * Tạo cấu hình an toàn cho từng model của Google GenAI
 */
function getModelGenConfig(modelId: string, options: {
  systemInstruction?: string;
  responseMimeType?: string;
  maxOutputTokens?: number;
  temperature?: number;
}) {
  const config: Record<string, any> = {
    maxOutputTokens: options.maxOutputTokens || 8192,
    temperature: options.temperature !== undefined ? options.temperature : 0.7
  };

  if (options.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }

  if (options.responseMimeType) {
    config.responseMimeType = options.responseMimeType;
  }

  // Đối với các model 2.5 flash/pro hoặc 3.x có tính năng thinking:
  // Thiết lập thinking budget bằng 0 khi cần tạo JSON đề thi nhanh chóng
  if (modelId.includes('2.5') || modelId.includes('3-')) {
    config.thinkingConfig = {
      thinkingBudget: 0
    };
  }

  return config;
}

/**
 * Gọi Gemini API với cơ chế tự động thử lại (Retry) và Fallback tuần tự theo AI_INSTRUCTIONS.md
 */
export async function callGeminiWithFallback(options: CallAIOptions): Promise<{ text: string; modelUsed: string }> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const preferredModel = getStoredModel();
  // Sắp xếp danh sách fallback bắt đầu từ model được người dùng chọn
  const candidateModels = [
    preferredModel,
    ...FALLBACK_CHAIN.filter((m) => m !== preferredModel)
  ];

  let lastError: unknown = null;

  for (const modelId of candidateModels) {
    try {
      if (options.onModelAttempt) {
        options.onModelAttempt(modelId);
      }

      const ai = new GoogleGenAI({ apiKey });
      const config = getModelGenConfig(modelId, {
        systemInstruction:
          options.systemInstruction ||
          'Bạn là trợ lý AI Gia Sư Môn Toán THPT chuẩn sách Kết Nối Tri Thức. Bạn giải thích chi tiết, sư phạm, kèm công thức LaTeX ($...$, $$...$$), chỉ ra các bẫy thường gặp và hướng dẫn mẹo máy tính Casio fx-580VN X / 880BTG khi phù hợp. Hệ thống giao diện đã kích hoạt Markdown Parser với breaks: true (nhận diện xuống dòng tự nhiên) và công cụ render bảng toán học / bảng biến thiên SVG tự động (hỗ trợ bảng markdown | ... | và khối ```bbt ... ```). Hãy sử dụng xuống dòng tự nhiên, danh sách gạch đầu dòng và bảng toán học khi cần thiết để lời giải hiển thị chuẩn như sách giáo khoa.',
        responseMimeType: options.responseMimeType,
        maxOutputTokens: 8192
      });

      let response: any;
      try {
        response = await ai.models.generateContent({
          model: modelId,
          contents: options.prompt,
          config
        });
      } catch (callErr: any) {
        // Nếu model không hỗ trợ thinkingConfig hoặc responseMimeType, thử lại phiên bản tối giản
        if (config.thinkingConfig) {
          delete config.thinkingConfig;
          response = await ai.models.generateContent({
            model: modelId,
            contents: options.prompt,
            config
          });
        } else {
          throw callErr;
        }
      }

      const responseText = extractResponseText(response);
      if (responseText && responseText.trim().length > 0) {
        return { text: responseText, modelUsed: modelId };
      }
    } catch (err: unknown) {
      console.warn(`Model ${modelId} thất bại:`, err);
      lastError = err;
      // Tiếp tục thử với model tiếp theo trong chuỗi fallback
    }
  }

  // Nếu tất cả model đều thất bại -> Báo lỗi chi tiết theo AI_INSTRUCTIONS.md
  let errMsg = 'Không thể kết nối đến Gemini API';
  if (lastError instanceof Error) {
    errMsg = lastError.message;
  } else if (typeof lastError === 'object' && lastError !== null) {
    errMsg = (lastError as any).message || JSON.stringify(lastError);
  } else if (lastError) {
    errMsg = String(lastError);
  }

  throw new Error(`Tất cả các model AI đều thất bại: ${errMsg}`);
}

/**
 * Nhờ AI giải thích chi tiết câu hỏi toán học
 */
export async function askAIExplainQuestion(
  q: Question,
  userAnswer?: string,
  onModelAttempt?: (modelName: string) => void
): Promise<{ text: string; modelUsed: string }> {
  let questionDetails = `ĐỀ BÀI: ${q.content}\n`;
  if (q.format === 'multiple_choice_4' && q.options) {
    questionDetails += 'CÁC LỰA CHỌN:\n';
    q.options.forEach((opt) => {
      questionDetails += `- [${opt.id}] ${opt.text}\n`;
    });
    questionDetails += `ĐÁP ÁN ĐÚNG: ${q.correctAnswer}\n`;
    if (userAnswer) {
      questionDetails += `HỌC SINH ĐÃ CHỌN: ${userAnswer} (${userAnswer === q.correctAnswer ? 'Đúng' : 'Chưa đúng'})\n`;
    }
  } else if (q.format === 'true_false_4' && q.subQuestions) {
    questionDetails += 'CÁC MỆNH ĐỀ:\n';
    q.subQuestions.forEach((sub) => {
      questionDetails += `- [${sub.id}] ${sub.statement} (Đáp án: ${sub.isCorrect ? 'ĐÚNG' : 'SAI'})\n`;
    });
  } else if (q.format === 'short_answer') {
    questionDetails += `ĐÁP ÁN ĐÚNG: ${q.correctAnswer}\n`;
    if (userAnswer) {
      questionDetails += `HỌC SINH ĐÃ TRẢ LỜI: ${userAnswer}\n`;
    }
  }

  if (q.solution) {
    questionDetails += `HƯỚNG DẪN GIẢI HIỆN CÓ: ${q.solution}\n`;
  }

  const prompt = `
Dưới đây là một câu hỏi môn Toán THPT theo chương trình Kết Nối Tri Thức:
${questionDetails}

Hãy đóng vai Thầy/Cô giáo dạy Toán ôn thi tốt nghiệp THPT, phân tích giúp học sinh:
1. **Phương pháp tư duy & Lời giải chi tiết**: Trình bày từng bước mạch lạc, dùng chuẩn công thức LaTeX ($...$ hoặc $$...$$) đặc biệt là vectơ (\\overrightarrow{AB}, \\vec{a}), bảng biến thiên nếu có.
2. **Cảnh báo lỗi sai / Bẫy đề thi**: Học sinh thường mắc sai lầm gì ở bài này?
3. **Mẹo Casio (nếu có)**: Hướng dẫn bấm máy tính Casio fx-580VN X hoặc fx-880BTG để kiểm tra nhanh.
4. **Lời khuyên ôn tập**: Khắc sâu kiến thức trọng tâm của dạng toán này.
`;

  return callGeminiWithFallback({
    prompt,
    onModelAttempt
  });
}

/**
 * Nhờ AI tạo một câu hỏi toán học tương tự cùng dạng
 */
export async function askAIGenerateSimilarQuestion(
  q: Question,
  onModelAttempt?: (modelName: string) => void
): Promise<{ text: string; modelUsed: string }> {
  const prompt = `
Hãy tạo 1 câu hỏi môn Toán THPT TƯƠNG TỰ VÀ CÙNG DẠNG với câu hỏi sau nhưng thay đổi số liệu, tình huống:
ĐỀ BÀI GỐC: ${q.content}
DẠNG: ${q.format} (Mức độ: ${q.difficulty})

Yêu cầu xuất ra cấu trúc rõ ràng:
- **Đề bài tương tự**: (dùng LaTeX $...$ cho công thức)
- **Các phương án** (nếu là trắc nghiệm) hoặc **Các mệnh đề Đúng/Sai**
- **Đáp án chính xác**
- **Lời giải tóm tắt**
`;

  return callGeminiWithFallback({
    prompt,
    onModelAttempt
  });
}

export interface AIExamConfig {
  grade: GradeNumber;
  chapterId: string;
  chapterName: string;
  lessonName?: string;
  durationMinutes: number;
  difficulty: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao' | 'Hỗn hợp phân hóa (Đề thi chuẩn)';
  counts: {
    part1Count: number;
    part2Count: number;
    part3Count: number;
  };
  customPrompt?: string;
}

export interface GeneratedExam {
  id: string;
  title: string;
  subtitle: string;
  grade: GradeNumber;
  chapterId: string;
  lessonName?: string;
  durationMinutes: number;
  createdAt: string;
  questions: ExamQuestion[];
}

/**
 * Chuẩn hóa các phương án trắc nghiệm A, B, C, D từ nhiều kiểu cấu trúc khác nhau của AI
 */
function normalizeOptions(rawOptions: any): { id: string; text: string }[] {
  if (!rawOptions) return [];
  if (Array.isArray(rawOptions)) {
    return rawOptions.map((opt, idx) => {
      const defaultId = ['A', 'B', 'C', 'D'][idx] || `opt_${idx + 1}`;
      if (typeof opt === 'string') {
        const match = opt.match(/^([A-D])[\.\:\)]\s*(.*)$/i);
        if (match) {
          return { id: match[1].toUpperCase(), text: match[2].trim() };
        }
        return { id: defaultId, text: opt.trim() };
      }
      if (typeof opt === 'object' && opt !== null) {
        return {
          id: String(opt.id || opt.key || defaultId).toUpperCase().trim(),
          text: String(opt.text || opt.content || opt.value || '').trim()
        };
      }
      return { id: defaultId, text: String(opt).trim() };
    });
  }
  if (typeof rawOptions === 'object') {
    return Object.entries(rawOptions).map(([key, value]) => ({
      id: key.toUpperCase().trim(),
      text: typeof value === 'string' ? value.trim() : String(value)
    }));
  }
  return [];
}

/**
 * Chuẩn hóa các mệnh đề Đúng/Sai a, b, c, d từ AI
 */
function normalizeSubQuestions(rawSubs: any): { id: string; statement: string; isCorrect: boolean }[] {
  if (!rawSubs) return [];
  if (Array.isArray(rawSubs)) {
    return rawSubs.map((sub, idx) => {
      const defaultId = ['a', 'b', 'c', 'd'][idx] || `sub_${idx + 1}`;
      if (typeof sub === 'object' && sub !== null) {
        const id = String(sub.id || sub.key || defaultId).toLowerCase().trim();
        const statement = String(sub.statement || sub.content || sub.text || '').trim();
        const isCorrect =
          sub.isCorrect === true ||
          sub.correct === true ||
          sub.answer === true ||
          String(sub.isCorrect).toLowerCase() === 'true' ||
          String(sub.answer).toLowerCase() === 'đúng' ||
          String(sub.answer).toLowerCase() === 'true';
        return { id, statement, isCorrect };
      }
      return { id: defaultId, statement: String(sub).trim(), isCorrect: false };
    });
  }
  return [];
}

/**
 * Gỡ bỏ an toàn vỏ bọc markdown ```json ... ``` ở ngoài cùng
 * mà KHÔNG làm cắt nhầm các code block con (như ```graph hoặc ```bbt) bên trong câu hỏi.
 */
function stripOuterMarkdownCodeBlock(raw: string): string {
  let s = raw.trim();

  // Kiểm tra nếu toàn bộ chuỗi bắt đầu bằng ```
  if (s.startsWith('```')) {
    const firstNewline = s.indexOf('\n');
    if (firstNewline !== -1) {
      s = s.substring(firstNewline + 1);
    } else {
      s = s.replace(/^```[a-zA-Z]*\s*/, '');
    }

    // Gỡ bỏ ``` ở cuối nếu có
    const lastFence = s.lastIndexOf('```');
    const lastBrace = s.lastIndexOf('}');
    if (lastFence !== -1 && (lastBrace === -1 || lastFence > lastBrace)) {
      s = s.substring(0, lastFence);
    } else if (s.endsWith('```')) {
      s = s.substring(0, s.length - 3);
    }
  }

  // Cắt lấy phạm vi từ dấu { mở đầu tiên tới dấu } đóng cuối cùng
  const firstBrace = s.indexOf('{');
  const lastBrace = s.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    s = s.substring(firstBrace, lastBrace + 1);
  }

  return s.trim();
}

/**
 * Bộ tiền xử lý và phục hồi chuỗi JSON từ AI một cách bền bỉ (Bulletproof JSON Repair):
 * - Bảo toàn các lệnh LaTeX (\frac, \sqrt, \vec, \alpha, \text, \times, \right, \rho, \beta, \neq,...)
 * - Tự động escape các ký tự điều khiển (unescaped raw newlines/tabs trong chuỗi)
 * - Tự động loại bỏ trailing commas (, } và , ])
 * - Tự động đóng các cặp ngoặc khi chuỗi JSON bị ngắt giữa chừng do hết token (Truncated JSON repair)
 */
export function sanitizeAndRepairJSON(raw: string): string {
  if (!raw || !raw.trim()) {
    throw new Error('Dữ liệu AI trả về rỗng.');
  }

  let text = stripOuterMarkdownCodeBlock(raw);

  // Tìm vị trí dấu { mở đầu tiên
  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('Không tìm thấy khối JSON trong dữ liệu AI phản hồi.');
  }
  text = text.substring(firstBrace);

  let result = '';
  let inString = false;
  let isEscaped = false;
  const braceStack: ('{' | '[')[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const nextCh = text[i + 1] || '';

    if (!inString) {
      if (ch === '"') {
        inString = true;
        result += ch;
      } else if (ch === '{' || ch === '[') {
        braceStack.push(ch);
        result += ch;
      } else if (ch === '}') {
        if (braceStack.length > 0 && braceStack[braceStack.length - 1] === '{') {
          braceStack.pop();
        }
        result += ch;
        // Nếu đã đóng hết tất cả ngoặc của root object, dừng lại để bỏ qua lời chat phía sau
        if (braceStack.length === 0) {
          break;
        }
      } else if (ch === ']') {
        if (braceStack.length > 0 && braceStack[braceStack.length - 1] === '[') {
          braceStack.pop();
        }
        result += ch;
      } else {
        result += ch;
      }
    } else {
      // Đang ở TRONG chuỗi ký tự "..."
      if (isEscaped) {
        // Ký tự trước đó là dấu \
        isEscaped = false;
        result += ch;
      } else if (ch === '\\') {
        // Kiểm tra xem đây có phải là lệnh LaTeX phổ biến bắt đầu bằng \t, \r, \n, \b, \f không:
        // Ví dụ: \text, \times, \tan, \tau, \theta, \right, \rho, \beta, \bar, \begin, \frac, \neq, \nabla,...
        const nextLetters = text.substring(i + 1, i + 8).toLowerCase();
        const isLatexCommandWithControlLetter = /^(text|times|tan|tau|theta|tilde|right|rho|beta|bar|begin|bullet|frac|neq|nabla|nu|notin|left|sqrt|vec|over|alpha|gamma|delta|pi|in|sum|int|lim|le|ge|cdot|pm)/.test(nextLetters);

        if (isLatexCommandWithControlLetter) {
          // Đây là lệnh LaTeX -> nhân đôi gạch chéo để KaTeX hiểu và JSON.parse không hỏng
          result += '\\\\';
        } else if (nextCh === '"' || nextCh === '\\' || nextCh === '/') {
          // Escape tiêu chuẩn hợp lệ của JSON -> giữ nguyên
          result += ch;
          isEscaped = true;
        } else if (
          nextCh === 'u' &&
          /^[0-9a-fA-F]{4}$/.test(text.substring(i + 2, i + 6))
        ) {
          // Escape unicode hợp lệ \uXXXX -> giữ nguyên
          result += ch;
          isEscaped = true;
        } else if (nextCh === 'b' || nextCh === 'f' || nextCh === 'n' || nextCh === 'r' || nextCh === 't') {
          // Escape tiêu chuẩn hợp lệ JSON (newline, tab, CR,...) -> giữ nguyên
          result += ch;
          isEscaped = true;
        } else {
          // Tất cả các ký tự thoát khác (như \alpha, \vec, \Delta, \int,...) -> nhân đôi \
          result += '\\\\';
        }
      } else if (ch === '"') {
        inString = false;
        result += ch;
      } else if (ch === '\n') {
        // Xuống dòng thực tế trong string literal -> chuyển thành \n
        result += '\\n';
      } else if (ch === '\r') {
        // Carriage return thực tế -> chuyển thành \r
        result += '\\r';
      } else if (ch === '\t') {
        // Tab thực tế -> chuyển thành \t
        result += '\\t';
      } else {
        result += ch;
      }
    }
  }

  // 4. Khắc phục chuỗi JSON bị ngắt giữa chừng (Truncated JSON Recovery)
  if (inString) {
    result += '"';
  }

  // Làm sạch trailing commas ở ngoài chuỗi: ", }" -> "}" và ", ]" -> "]"
  result = result.replace(/,\s*([\}\]])/g, '$1');

  // Xóa các key hoặc thuộc tính dở dang ở cuối trước khi đóng ngoặc
  result = result.replace(/,\s*"[^"]*"?\s*:\s*$/g, '');
  result = result.replace(/,\s*"[^"]*"?\s*$/g, '');
  result = result.replace(/,\s*$/g, '');

  // Đóng tất cả các ngoặc mở còn thiếu theo thứ tự LIFO
  while (braceStack.length > 0) {
    const unclosed = braceStack.pop();
    if (unclosed === '{') {
      result += '}';
    } else if (unclosed === '[') {
      result += ']';
    }
  }

  return result;
}

/**
 * Cứu nguy tối thượng: Trích xuất danh sách câu hỏi trực tiếp bằng Regex
 * khi toàn bộ JSON object lớn bị lỗi cú pháp không thể parse theo cách thông thường.
 */
function extractQuestionsFallback(raw: string): any[] {
  const questions: any[] = [];
  const qRegex = /\{\s*"id"\s*:\s*"([^"]+)"[\s\S]*?"content"\s*:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g;
  
  let match: RegExpExecArray | null;
  while ((match = qRegex.exec(raw)) !== null) {
    try {
      const qBlock = match[0];
      const repaired = sanitizeAndRepairJSON(qBlock);
      const parsedQ = JSON.parse(repaired);
      if (parsedQ && parsedQ.content) {
        questions.push(parsedQ);
      }
    } catch {
      // ignore
    }
  }

  return questions;
}

/**
 * Trích xuất và phân tích JSON từ AI một cách bền bỉ (multi-strategy resilient parser)
 */
export function parseJSONFromLLM(text: string): any {
  if (!text || !text.trim()) {
    throw new Error('Dữ liệu AI trả về rỗng.');
  }

  const clean = stripOuterMarkdownCodeBlock(text);

  // Lần thử 1: Parse trực tiếp sau khi bóc tách code block ngoài cùng
  try {
    const parsed = JSON.parse(clean);
    if (parsed && (Array.isArray(parsed.questions) || parsed.title)) {
      return parsed;
    }
  } catch {
    // Chuyển sang Lần thử 2
  }

  // Lần thử 2: Chạy bộ phục hồi và chuẩn hóa LaTeX / Unescaped Control Chars / Truncated JSON
  try {
    const repaired = sanitizeAndRepairJSON(clean);
    const parsed = JSON.parse(repaired);
    if (parsed && (Array.isArray(parsed.questions) || parsed.title)) {
      return parsed;
    }
  } catch {
    // Chuyển sang Lần thử 3
  }

  // Lần thử 3: Cứu vãn bằng cách tìm mảng questions regex
  try {
    const questionMatch = clean.match(/"questions"\s*:\s*(\[[\s\S]*?\])/);
    if (questionMatch) {
      const repairedArray = sanitizeAndRepairJSON(questionMatch[1]);
      const questions = JSON.parse(repairedArray);
      if (Array.isArray(questions) && questions.length > 0) {
        return {
          title: 'Đề Kiểm Tra Môn Toán THPT',
          subtitle: 'Biên soạn bởi AI KNTT',
          questions
        };
      }
    }
  } catch {
    // Chuyển sang Lần thử 4
  }

  // Lần thử 4: Cứu nguy tối thượng bằng Regex Question Extractor
  const fallbackQuestions = extractQuestionsFallback(clean);
  if (fallbackQuestions.length > 0) {
    return {
      title: 'Đề Kiểm Tra Môn Toán THPT',
      subtitle: 'Biên soạn bởi AI KNTT',
      questions: fallbackQuestions
    };
  }

  throw new Error('Không thể phân tích dữ liệu đề thi do AI trả về định dạng JSON chưa hoàn chỉnh. Vui lòng bấm tạo lại!');
}

/**
 * Tự động tạo đề thi môn Toán theo yêu cầu từng chương, từng bài bằng AI Gemini
 * Tích hợp cơ chế tự động thử lại (Retry) và Fallback tuần tự theo AI_INSTRUCTIONS.md:
 * Nếu một model bị lỗi hoặc trả về JSON không thể phân tích, hệ thống sẽ tự động
 * chuyển sang model tiếp theo trong danh sách cho đến khi thành công!
 */
export async function generateAIExam(
  config: AIExamConfig,
  onModelAttempt?: (modelName: string) => void
): Promise<{ exam: GeneratedExam; modelUsed: string }> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('Vui lòng nhập Gemini API Key để bắt đầu tạo đề!');
  }

  const lessonScope = config.lessonName && config.lessonName !== 'all'
    ? `- Trọng tâm bài học cụ thể: "${config.lessonName}"`
    : `- Phạm vi: Toàn bộ các bài học trong chương "${config.chapterName}"`;

  const prompt = `
Bạn là chuyên gia thẩm định và ra đề thi môn Toán THPT theo chương trình GDPT mới (Sách giáo khoa Kết Nối Tri Thức Với Cuộc Sống), chuẩn ma trận định dạng kỳ thi Tốt nghiệp THPT từ năm 2026 trở đi.
Hãy biên soạn một bộ đề thi kiểm tra theo đúng ma trận và yêu cầu sau:

THÔNG TIN BẮT BUỘC:
- Khối lớp: Lớp ${config.grade}
- Chương: ${config.chapterName}
${lessonScope}
- Thời gian làm bài: ${config.durationMinutes} phút
- Mức độ nhận thức: ${config.difficulty}
- Số lượng câu hỏi:
  + Phần I (Trắc nghiệm 4 lựa chọn, chỉ 1 đáp án đúng): ${config.counts.part1Count} câu
  + Phần II (Trắc nghiệm Đúng / Sai, mỗi câu có 4 ý a, b, c, d): ${config.counts.part2Count} câu
  + Phần III (Trả lời ngắn / Điền kết quả số): ${config.counts.part3Count} câu
${config.customPrompt ? `- Yêu cầu bổ sung đặc biệt: ${config.customPrompt}` : ''}

QUY TẮC TIẾNG VIỆT & TOÁN HỌC BẮT BUỘC:
1. Toàn bộ câu hỏi, phương án, mệnh đề và lời giải PHẢI viết bằng tiếng Việt chuẩn ngữ pháp Bộ Giáo dục & Đào tạo, có dấu đầy đủ và chuẩn xác (Unicode dựng sẵn: toán, tọa độ, khoảng biến thiên, nghiệm, phương trình,...).
2. Tất cả công thức toán, biến số, tọa độ, nửa khoảng đều phải đặt trong dấu LaTeX $...$ (inline) hoặc $$...$$ (display). Ví dụ: $\\frac{a}{b}$, $\\vec{a}$, $\\overrightarrow{AB}$, $\\sqrt{x}$, $\\alpha$, $[a; b)$.
3. QUAN TRỌNG VỀ ĐỊNH DẠNG JSON: Trong chuỗi JSON, viết dấu gạch chéo ngược kép cho LaTeX (\\\\frac, \\\\sqrt, \\\\vec) để đảm bảo chuỗi JSON hợp lệ. Tuyệt đối không để dấu nháy kép trần chưa escape trong chuỗi text.
4. Phần II: Trường "subQuestions" phải có đủ 4 phần tử với id: 'a', 'b', 'c', 'd' và statement, isCorrect (true hoặc false).
5. Phần III: "correctAnswer" phải là một số nguyên hoặc số thập phân/phân số gọn (ví dụ: '12', '4.5', '3/4').
6. Mỗi câu phải có trường "solution" giải thích chi tiết từng bước bằng tiếng Việt sư phạm chuẩn mực.

QUY TẮC ĐỒ THỊ & BẢNG BIẾN THIÊN (NẾU CÓ):
- Với câu hỏi có khảo sát hàm số, đồ thị hoặc bảng biến thiên: Bạn có thể nhúng khối \`\`\`graph ... \`\`\` hoặc \`\`\`bbt ... \`\`\` ngay trong "content" hoặc "solution", chú ý dùng dấu nháy đơn ' hoặc escape \\" cho các key bên trong khối graph để JSON ngoài không bị vỡ.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
Chỉ trả về DUY NHẤT một chuỗi JSON hợp lệ không có giải thích mở đầu hay kết thúc, tuân theo schema:
{
  "title": "Đề Kiểm Tra Toán ${config.grade} - ${config.lessonName && config.lessonName !== 'all' ? config.lessonName : config.chapterName} (Chuẩn 2026 Trở Đi)",
  "subtitle": "Thời gian ${config.durationMinutes} phút • Khung chương trình Kết Nối Tri Thức",
  "questions": [
    {
      "id": "q1",
      "part": "I",
      "format": "multiple_choice_4",
      "difficulty": "Thông hiểu",
      "content": "Nội dung câu hỏi...",
      "options": [
        {"id": "A", "text": "Phương án A"},
        {"id": "B", "text": "Phương án B"},
        {"id": "C", "text": "Phương án C"},
        {"id": "D", "text": "Phương án D"}
      ],
      "correctAnswer": "A",
      "solution": "Lời giải chi tiết..."
    },
    {
      "id": "q2",
      "part": "II",
      "format": "true_false_4",
      "difficulty": "Vận dụng",
      "content": "Nội dung câu hỏi đúng sai...",
      "subQuestions": [
        {"id": "a", "statement": "Mệnh đề a...", "isCorrect": true},
        {"id": "b", "statement": "Mệnh đề b...", "isCorrect": false},
        {"id": "c", "statement": "Mệnh đề c...", "isCorrect": true},
        {"id": "d", "statement": "Mệnh đề d...", "isCorrect": false}
      ],
      "solution": "Lời giải chi tiết..."
    },
    {
      "id": "q3",
      "part": "III",
      "format": "short_answer",
      "difficulty": "Vận dụng",
      "content": "Nội dung câu hỏi điền số...",
      "correctAnswer": "12",
      "solution": "Lời giải chi tiết..."
    }
  ]
}
`;

  const preferredModel = getStoredModel();
  const candidateModels = [
    preferredModel,
    ...FALLBACK_CHAIN.filter((m) => m !== preferredModel)
  ];

  let lastError: unknown = null;

  for (const modelId of candidateModels) {
    try {
      if (onModelAttempt) {
        onModelAttempt(modelId);
      }

      const ai = new GoogleGenAI({ apiKey });
      const configObj = getModelGenConfig(modelId, {
        systemInstruction:
          'Bạn là chuyên gia soạn thảo đề thi môn Toán THPT Kết Nối Tri Thức. Bạn CHỈ trả về dữ liệu định dạng JSON chuẩn không bọc thêm bất kỳ lời nói chuyện nào.',
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
        temperature: 0.7
      });

      let response: any;
      try {
        response = await ai.models.generateContent({
          model: modelId,
          contents: prompt,
          config: configObj
        });
      } catch (callErr: any) {
        // Nếu model không hỗ trợ thinkingConfig hoặc responseMimeType, gỡ bỏ và thử lại
        if (configObj.thinkingConfig) {
          delete configObj.thinkingConfig;
        }
        try {
          response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: configObj
          });
        } catch (retryErr: any) {
          // Thử lại không có responseMimeType (cho các model cũ)
          delete configObj.responseMimeType;
          response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: configObj
          });
        }
      }

      const responseText = extractResponseText(response);
      if (!responseText || responseText.trim().length === 0) {
        throw new Error(`Model ${modelId} trả về kết quả rỗng.`);
      }

      // Phân tích và sửa lỗi JSON đa tầng
      const parsed = parseJSONFromLLM(responseText);

      if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error(`Model ${modelId} không tạo được danh sách câu hỏi hợp lệ.`);
      }

      const generatedExam: GeneratedExam = {
        id: `ai_exam_${Date.now()}`,
        title: parsed.title || `Đề Kiểm Tra Toán ${config.grade} - ${config.chapterName}`,
        subtitle: parsed.subtitle || `Thời gian: ${config.durationMinutes} phút • Soạn bởi AI KNTT`,
        grade: config.grade,
        chapterId: config.chapterId,
        lessonName: config.lessonName,
        durationMinutes: config.durationMinutes,
        createdAt: new Date().toLocaleString('vi-VN'),
        questions: (parsed.questions || []).map((q: any, idx: number) => {
          const rawPart = q.part ? String(q.part).toUpperCase().trim() : '';
          const rawFormat = q.format || '';
          const format =
            rawFormat === 'true_false_4' || rawPart === 'II'
              ? 'true_false_4'
              : rawFormat === 'short_answer' || rawPart === 'III'
              ? 'short_answer'
              : 'multiple_choice_4';
          const part = rawPart === 'II' || format === 'true_false_4'
            ? 'II'
            : rawPart === 'III' || format === 'short_answer'
            ? 'III'
            : 'I';

          return {
            id: q.id || `ai_q_${idx + 1}`,
            part,
            format,
            difficulty: q.difficulty || config.difficulty || 'Thông hiểu',
            content: q.content || `Câu hỏi ${idx + 1}`,
            options: format === 'multiple_choice_4' ? normalizeOptions(q.options) : undefined,
            subQuestions: format === 'true_false_4' ? normalizeSubQuestions(q.subQuestions) : undefined,
            correctAnswer: q.correctAnswer !== undefined && q.correctAnswer !== null ? String(q.correctAnswer).trim() : '',
            solution: q.solution || ''
          };
        })
      };

      return {
        exam: generatedExam,
        modelUsed: modelId
      };
    } catch (err: unknown) {
      console.warn(`Tạo đề với model ${modelId} thất bại:`, err);
      lastError = err;
      // Tự động thử lại với model tiếp theo trong Fallback chain
    }
  }

  let errMsg = 'Không thể kết nối đến Gemini API';
  if (lastError instanceof Error) {
    errMsg = lastError.message;
  } else if (typeof lastError === 'object' && lastError !== null) {
    errMsg = (lastError as any).message || JSON.stringify(lastError);
  } else if (lastError) {
    errMsg = String(lastError);
  }

  throw new Error(`Tất cả các model AI đều thất bại: ${errMsg}`);
}
