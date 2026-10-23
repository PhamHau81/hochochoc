import { Chapter, GradeNumber } from '../types';
import { GRADE_10_CHAPTERS } from './curriculum10';
import { GRADE_11_CHAPTERS } from './curriculum11';
import { GRADE_12_CHAPTERS } from './curriculum12';

export const CURRICULUM_DATA: Record<GradeNumber, { title: string; subtitle: string; chapters: Chapter[] }> = {
  10: {
    title: 'Toán Lớp 10 - Kết Nối Tri Thức (Chuẩn 2026 Trở Đi)',
    subtitle: 'Nền tảng Đại số, Hình học phẳng Oxy, Thống kê không ghép nhóm và Đại số tổ hợp',
    chapters: GRADE_10_CHAPTERS
  },
  11: {
    title: 'Toán Lớp 11 - Kết Nối Tri Thức (Chuẩn 2026 Trở Đi)',
    subtitle: 'Trọng tâm Mẫu số liệu ghép nhóm, Cấp số cộng/nhân, Đạo hàm, Mũ - Lôgarit và Hình không gian',
    chapters: GRADE_11_CHAPTERS
  },
  12: {
    title: 'Toán Lớp 12 - Kết Nối Tri Thức (Chuẩn 2026 Trở Đi)',
    subtitle: 'Khảo sát hàm số (tiệm cận xiên), Vectơ Oxyz, Tích phân và Xác suất Bayes',
    chapters: GRADE_12_CHAPTERS
  }
};
