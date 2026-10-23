# APP TỰ ÔN TẬP - PHẠM HẬU 🎓📐

Ứng dụng Nền tảng Tự Ôn Tập & Luyện Thi Môn Toán THPT theo chương trình GDPT mới (Bộ sách Kết Nối Tri Thức Với Cuộc Sống - Lớp 10, 11, 12).

---

## 🌟 Điểm nổi bật & Tính năng chính

1. **Hiển thị công thức Toán học MathType & TeX chuyên sâu**:
   - Tối ưu chuẩn xác 100% công thức **Vectơ** ($\overrightarrow{AB}$, $\vec{a}$, tích vô hướng $\vec{a} \cdot \vec{b}$, góc giữa hai vectơ, hệ tọa độ $Oxy$ và $Oxyz$).
   - Tự động khắc phục các lỗi MathType kinh điển (vector cụt mũi tên, tag `\rm`, entity HTML, căn chỉnh dấu song song/vuông góc).
   - Render KaTeX thời gian thực sắc nét, siêu nhanh và mượt mà.

2. **Kẻ Bảng Biến Thiên Hàm Số chuẩn Sư phạm**:
   - Chuẩn quy cách Bộ Giáo Dục: Đầy đủ 3 dòng $x$, $y'$, $y$.
   - Mũi tên biến thiên SVG mượt mà chỉ rõ chiều đồng biến ($\nearrow$) và nghịch biến ($\searrow$).
   - Đầy đủ điểm cực đại, cực tiểu, giới hạn vô cực và tiệm cận đứng gạch đôi ($||$).

3. **Vẽ Đồ Thị Hàm Số trực quan trên mặt phẳng Oxy**:
   - Hệ trục tọa độ vuông góc $Oxy$, vạch chia đơn vị (ticks) và lưới tọa độ (grid).
   - Vẽ mượt mà các dạng hàm số: Bậc ba, Bậc nhất/Bậc nhất, Bậc bốn trùng phương, Parabol.
   - Thể hiện rõ ràng đường tiệm cận đứng, tiệm cận ngang dạng nét đứt.
   - Đánh dấu tọa độ cực trị (CĐ, CT), điểm uốn, giao điểm với các trục tọa độ.
   - Hỗ trợ rê chuột xem tọa độ $(x; y)$, phóng to / thu nhỏ.

4. **Xưởng Khảo Sát Hàm Số Tương Tác**:
   - Cho phép học sinh chọn các bài toán mẫu hoặc tùy chỉnh hệ số $a, b, c, d$.
   - Tự động lập bảng biến thiên và vẽ đồ thị tương ứng ngay lập tức.

5. **Hệ thống Ngân hàng câu hỏi & Phòng thi ảo Chuẩn 2026 trở đi**:
   - Đầy đủ 3 dạng câu hỏi chuẩn cấu trúc mới: Trắc nghiệm nhiều lựa chọn, Trắc nghiệm Đúng/Sai 4 ý, Câu hỏi trả lời ngắn.
   - Công cụ phân tích Mẫu số liệu ghép nhóm và hướng dẫn bấm máy tính cầm tay Casio fx-580VN X / fx-880BTG.

---

## 🚀 Triển khai (Deployment)

Dự án đã được cấu hình sẵn file `vercel.json` phục vụ triển khai lên **Vercel** một chạm:
```bash
npm install
npm run build
```
Mã nguồn chạy Vite + React 19 + Tailwind CSS + KaTeX.
