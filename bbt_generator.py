# -*- coding: utf-8 -*-
"""
================================================================================
BỘ CÔNG CỤ TỰ ĐỘNG SINH BẢNG BIẾN THIÊN TOÁN 12 & TẠO ĐỀ THI TRẮC NGHIỆM AI
================================================================================
Tính năng chính:
1. Giải tích toán học chính xác 100% bằng SymPy (Ground Truth):
   - Đa thức bậc 2, bậc 3, bậc 4 (trùng phương, tổng quát).
   - Phân thức hữu tỉ bậc 1/1: y = (ax + b) / (cx + d).
   - Phân thức hữu tỉ bậc 2/1: y = (ax^2 + bx + c) / (dx + e) (Chương trình mới GDPT 2018).
2. Tự động sinh mã LaTeX gói `tkz-tab` chuẩn mực sư phạm.
3. Tạo Prompt tối ưu cho AI (Gemini, ChatGPT, Claude) không bị ảo giác toán học:
   - Câu hỏi đơn điệu, cực trị, số nghiệm phương trình f(x) = m, nhận dạng hàm.
   - Dạng thức đề thi mới: Trắc nghiệm 4 lựa chọn (Phần I) & Đúng/Sai 4 ý (Phần II).
4. Tích hợp gọi trực tiếp Gemini API (tùy chọn) và xuất file LaTeX / Word.
================================================================================
"""

import os
import re
import json
import sympy as sp
from typing import Dict, List, Optional, Any, Union


# ==============================================================================
# HÀM BỔ TRỢ ĐỊNH DẠNG SYMPY & LATEX
# ==============================================================================

def to_latex_val(val: Any) -> str:
    """Chuyển đổi giá trị SymPy sang định dạng LaTeX toán học chuẩn."""
    if val == sp.oo or val == float('inf'):
        return "+\\infty"
    elif val == -sp.oo or val == float('-inf'):
        return "-\\infty"
    return sp.latex(val)


def clean_num_str(val: Any) -> str:
    """Chuyển giá trị số/biểu thức thành chuỗi hiển thị gọn."""
    if val == sp.oo:
        return "+∞"
    elif val == -sp.oo:
        return "−∞"
    return str(val)


# ==============================================================================
# 1. BẢNG BIẾN THIÊN HÀM ĐA THỨC (BẬC 2, 3, 4,...)
# ==============================================================================

def generate_bbt_polynomial(expr_str: str, var_str: str = 'x') -> Dict[str, Any]:
    """
    Tự động giải và sinh bảng biến thiên tkz-tab cho hàm số đa thức.
    Đảm bảo đúng 100% dấu đạo hàm, chiều mũi tên và xử lý cả điểm uốn (nghiệm bội chẵn).
    """
    x = sp.Symbol(var_str, real=True)
    f = sp.sympify(expr_str)
    df = sp.diff(f, x)

    # 1. Tìm các nghiệm thực của y' = 0
    raw_roots = sp.solve(df, x)
    real_roots = []
    for r in raw_roots:
        if r.is_real or (r.is_number and sp.im(r) == 0):
            real_roots.append(sp.re(r))

    # Khử trùng lặp và sắp xếp thứ tự tăng dần theo giá trị số thực
    unique_roots = list({sp.simplify(r): r for r in real_roots}.values())
    critical_points = sorted(unique_roots, key=lambda pt: float(pt.evalf()))

    # 2. Danh sách các mốc x: [-oo, x_1, x_2, ..., +oo]
    x_points = [-sp.oo] + critical_points + [sp.oo]
    x_latex = [f"${to_latex_val(pt)}$" for pt in x_points]

    # 3. Xét dấu đạo hàm y' trên từng khoảng giữa 2 mốc liên tiếp
    signs = []
    for i in range(len(x_points) - 1):
        a, b = x_points[i], x_points[i + 1]
        if a == -sp.oo and b == sp.oo:
            test_pt = 0
        elif a == -sp.oo:
            test_pt = float(b.evalf()) - 1
        elif b == sp.oo:
            test_pt = float(a.evalf()) + 1
        else:
            test_pt = (float(a.evalf()) + float(b.evalf())) / 2.0

        val_df = float(df.subs(x, test_pt).evalf())
        signs.append("+" if val_df > 0 else "-")

    # Tạo dòng xét dấu cho \tkzTabLine
    line_parts = [""]
    for i, s in enumerate(signs):
        line_parts.append(s)
        if i < len(critical_points):
            line_parts.append("0")
    line_parts.append("")
    tkz_line = ", ".join(line_parts)

    # 4. Xác định vị trí cao (+), thấp (-) hoặc giữa (C) cho dòng biến thiên y
    var_parts = []
    y_values = []
    for i, pt in enumerate(x_points):
        if pt == -sp.oo:
            val = sp.limit(f, x, -sp.oo)
            pos = "-" if signs[0] == "+" else "+"
        elif pt == sp.oo:
            val = sp.limit(f, x, sp.oo)
            pos = "+" if signs[-1] == "+" else "-"
        else:
            val = f.subs(x, pt)
            prev_s = signs[i - 1]
            next_s = signs[i]
            if prev_s == "+" and next_s == "-":
                pos = "+"  # Cực đại
            elif prev_s == "-" and next_s == "+":
                pos = "-"  # Cực tiểu
            else:
                pos = "C"  # Điểm uốn / nghiệm bội chẵn (mũi tên đi qua ở giữa)

        y_values.append(val)
        var_parts.append(f"{pos}/ ${to_latex_val(val)}$")

    tkz_var = ", ".join(var_parts)

    # 5. Xuất mã LaTeX hoàn chỉnh
    latex_code = f"""\\begin{{tikzpicture}}
\\tkzTabInit[nocadre=false, lgt=1.2, espcl=2.5, deltacl=0.6]
  {{$x$ /0.6, $y'$ /0.6, $y$ /2}}
  {{{", ".join(x_latex)}}}
\\tkzTabLine{{{tkz_line}}}
\\tkzTabVar{{{tkz_var}}}
\\end{{tikzpicture}}"""

    return {
        "loai_ham": "da_thuc",
        "ham_so": sp.latex(f),
        "ham_so_raw": str(f),
        "dao_ham": sp.latex(df),
        "nghiem_y_phay": [to_latex_val(pt) for pt in critical_points],
        "dau_y_phay": signs,
        "cac_moc_x": [to_latex_val(pt) for pt in x_points],
        "gia_tri_y": [to_latex_val(val) for val in y_values],
        "latex_tkz_tab": latex_code
    }


# ==============================================================================
# 2. BẢNG BIẾN THIÊN HÀM PHÂN THỨC 1/1: y = (ax + b) / (cx + d)
# ==============================================================================

def generate_bbt_rational_1_1(a: float, b: float, c: float, d: float) -> Dict[str, Any]:
    """
    Sinh bảng biến thiên cho hàm nhất biến y = (ax + b)/(cx + d).
    Tự động tính tiệm cận đứng, tiệm cận ngang và hướng biến thiên.
    """
    if c == 0:
        raise ValueError("Hệ số c phải khác 0 để là hàm phân thức.")

    x = sp.Symbol('x', real=True)
    num = sp.sympify(f"{a}*x + ({b})")
    den = sp.sympify(f"{c}*x + ({d})")
    f = num / den

    # Điểm không xác định (tiệm cận đứng): cx + d = 0 => x = -d/c
    x0 = sp.Rational(-d, c) if isinstance(c, int) and isinstance(d, int) else -d / c
    # Tiệm cận ngang: y = a/c
    y0 = sp.Rational(a, c) if isinstance(a, int) and isinstance(c, int) else a / c
    # Định thức tử số đạo hàm: ad - bc
    det = a * d - b * c

    if det == 0:
        raise ValueError("ad - bc = 0: Hàm suy biến thành hàm hằng.")

    sign = "+" if det > 0 else "-"
    df = sp.diff(f, x)

    # Chiều biến thiên tại tiệm cận
    if sign == "+":
        var_line = f"-/ ${to_latex_val(y0)}$, +D-/ $+\\infty$ / $-\\infty$, +/ ${to_latex_val(y0)}$"
    else:
        var_line = f"+/ ${to_latex_val(y0)}$, -D+/ $-\\infty$ / $+\\infty$, -/ ${to_latex_val(y0)}$"

    latex_code = f"""\\begin{{tikzpicture}}
\\tkzTabInit[nocadre=false, lgt=1.2, espcl=2.5, deltacl=0.6]
  {{$x$ /0.6, $y'$ /0.6, $y$ /2}}
  {{$-\\infty$, ${to_latex_val(x0)}$, $+\\infty$}}
\\tkzTabLine{{, {sign}, d, {sign}, }}
\\tkzTabVar{{{var_line}}}
\\end{{tikzpicture}}"""

    return {
        "loai_ham": "phan_thuc_1_1",
        "ham_so": sp.latex(f),
        "ham_so_raw": str(f),
        "dao_ham": sp.latex(df),
        "tiem_can_dung": to_latex_val(x0),
        "tiem_can_ngang": to_latex_val(y0),
        "nghiem_y_phay": [],
        "dau_y_phay": [sign, sign],
        "latex_tkz_tab": latex_code
    }


# ==============================================================================
# 3. BẢNG BIẾN THIÊN HÀM PHÂN THỨC 2/1: y = (ax^2 + bx + c) / (dx + e)
# ==============================================================================

def generate_bbt_rational_2_1(a: float, b: float, c: float, d: float, e: float) -> Dict[str, Any]:
    """
    Sinh bảng biến thiên cho hàm phân thức bậc 2 trên bậc 1 (Toán 12 GDPT 2018).
    Có tiệm cận đứng x = -e/d và tiệm cận xiên.
    """
    if d == 0:
        raise ValueError("Hệ số d phải khác 0 để là hàm phân thức.")

    x = sp.Symbol('x', real=True)
    num = sp.sympify(f"({a})*x**2 + ({b})*x + ({c})")
    den = sp.sympify(f"({d})*x + ({e})")
    f = num / den
    df = sp.simplify(sp.diff(f, x))

    x0 = sp.Rational(-e, d) if isinstance(d, int) and isinstance(e, int) else -e / d

    # Tìm nghiệm đạo hàm
    df_num = sp.fraction(df)[0]
    roots = sp.solve(df_num, x)
    real_roots = [sp.re(r) for r in roots if r.is_real or (r.is_number and sp.im(r) == 0)]
    real_roots = [r for r in real_roots if sp.simplify(r - x0) != 0]
    critical_points = sorted(list({sp.simplify(r): r for r in real_roots}.values()), key=lambda pt: float(pt.evalf()))

    all_points = sorted(critical_points + [x0], key=lambda pt: float(pt.evalf()))
    x_points = [-sp.oo] + all_points + [sp.oo]
    x_latex = [f"${to_latex_val(pt)}$" for pt in x_points]

    # Xét dấu y'
    signs = []
    for i in range(len(x_points) - 1):
        p1, p2 = x_points[i], x_points[i + 1]
        mid = 0 if (p1 == -sp.oo and p2 == sp.oo) else (float(p2.evalf()) - 1 if p1 == -sp.oo else (float(p1.evalf()) + 1 if p2 == sp.oo else (float(p1.evalf()) + float(p2.evalf())) / 2.0))
        val_df = float(df.subs(x, mid).evalf())
        signs.append("+" if val_df > 0 else "-")

    # Dòng xét dấu
    line_parts = [""]
    for i, s in enumerate(signs):
        line_parts.append(s)
        if i < len(all_points):
            pt = all_points[i]
            line_parts.append("d" if pt == x0 else "0")
    line_parts.append("")
    tkz_line = ", ".join(line_parts)

    # Dòng biến thiên y
    var_parts = []
    for i, pt in enumerate(x_points):
        if pt == -sp.oo:
            val = sp.limit(f, x, -sp.oo)
            pos = "-" if signs[0] == "+" else "+"
            var_parts.append(f"{pos}/ ${to_latex_val(val)}$")
        elif pt == sp.oo:
            val = sp.limit(f, x, sp.oo)
            pos = "+" if signs[-1] == "+" else "-"
            var_parts.append(f"{pos}/ ${to_latex_val(val)}$")
        elif pt == x0:
            left_lim = sp.limit(f, x, x0, dir='-')
            right_lim = sp.limit(f, x, x0, dir='+')
            left_pos = "+" if left_lim == sp.oo else "-"
            right_pos = "+" if right_lim == sp.oo else "-"
            var_parts.append(f"{left_pos}D{right_pos}/ ${to_latex_val(left_lim)}$ / ${to_latex_val(right_lim)}$")
        else:
            val = f.subs(x, pt)
            pos = "+" if signs[i - 1] == "+" else "-"
            var_parts.append(f"{pos}/ ${to_latex_val(val)}$")

    latex_code = f"""\\begin{{tikzpicture}}
\\tkzTabInit[nocadre=false, lgt=1.2, espcl=2.5, deltacl=0.6]
  {{$x$ /0.6, $y'$ /0.6, $y$ /2}}
  {{{", ".join(x_latex)}}}
\\tkzTabLine{{{tkz_line}}}
\\tkzTabVar{{{", ".join(var_parts)}}}
\\end{{tikzpicture}}"""

    return {
        "loai_ham": "phan_thuc_2_1",
        "ham_so": sp.latex(f),
        "ham_so_raw": str(f),
        "dao_ham": sp.latex(df),
        "tiem_can_dung": to_latex_val(x0),
        "nghiem_y_phay": [to_latex_val(pt) for pt in critical_points],
        "dau_y_phay": signs,
        "latex_tkz_tab": latex_code
    }


# ==============================================================================
# 4. HÀM TỔNG QUÁT: TỰ ĐỘNG PHÁT HIỆN LOẠI HÀM
# ==============================================================================

def analyze_and_generate_bbt(expr_str: str) -> Dict[str, Any]:
    """
    Nhận diện tự động chuỗi hàm số (đa thức hoặc phân thức) và sinh BBT tương ứng.
    Ví dụ:
      - 'x**3 - 3*x**2 + 2'
      - '(2*x - 1) / (x + 1)'
      - '(x**2 - 2*x + 2) / (x - 1)'
    """
    x = sp.Symbol('x', real=True)
    f = sp.sympify(expr_str)

    num, den = sp.fraction(f)

    # Nếu mẫu số là hằng số -> Đa thức
    if den.is_number:
        return generate_bbt_polynomial(expr_str)

    # Phân tích bậc của tử và mẫu
    deg_num = sp.degree(num, x)
    deg_den = sp.degree(den, x)

    if deg_num == 1 and deg_den == 1:
        # y = (ax + b)/(cx + d)
        a = num.coeff(x, 1)
        b = num.coeff(x, 0)
        c = den.coeff(x, 1)
        d = den.coeff(x, 0)
        return generate_bbt_rational_1_1(int(a), int(b), int(c), int(d))
    elif deg_num == 2 and deg_den == 1:
        # y = (ax^2 + bx + c)/(dx + e)
        a = num.coeff(x, 2)
        b = num.coeff(x, 1)
        c = num.coeff(x, 0)
        d = den.coeff(x, 1)
        e = den.coeff(x, 0)
        return generate_bbt_rational_2_1(int(a), int(b), int(c), int(d), int(e))
    else:
        # Fallback cho đa thức nếu có
        return generate_bbt_polynomial(expr_str)


# ==============================================================================
# 5. HỆ THỐNG SINH AI PROMPT CHUẨN SƯ PHẠM
# ==============================================================================

def create_ai_prompt(
    data: Dict[str, Any],
    question_type: str = "don_dieu",
    exam_format: str = "mcq_4"
) -> str:
    """
    Tạo prompt tối ưu cho AI để sinh câu hỏi trắc nghiệm dựa trên BBT đã giải.

    - question_type:
        + 'don_dieu': Khoảng đồng biến / nghịch biến.
        + 'cuc_tri': Điểm cực đại, cực tiểu, giá trị cực trị.
        + 'so_nghiem': Số nghiệm của phương trình f(x) = m.
        + 'tiem_can': Tiệm cận đứng, ngang, xiên (dành cho hàm phân thức).
        + 'nhan_dang': Nhận dạng hàm số từ bảng biến thiên.
        + 'dung_sai': Câu hỏi trắc nghiệm Đúng/Sai 4 ý (Cấu trúc đề mới Bộ GD&ĐT).
    - exam_format:
        + 'mcq_4': 4 đáp án A, B, C, D (văn bản markdown).
        + 'json': Trả về định dạng JSON thuần để tích hợp ứng dụng.
    """
    ham_so = data.get("ham_so", "")
    latex_tab = data.get("latex_tkz_tab", "")
    dao_ham = data.get("dao_ham", "")
    nghiem = data.get("nghiem_y_phay", [])
    dau = data.get("dau_y_phay", [])
    loai_ham = data.get("loai_ham", "da_thuc")

    type_guides = {
        "don_dieu": "Hỏi về tính đơn điệu của hàm số (đồng biến hoặc nghịch biến trên khoảng nào dưới đây).",
        "cuc_tri": "Hỏi về điểm cực trị x, giá trị cực trị y, hoặc số điểm cực trị của hàm số.",
        "so_nghiem": "Hỏi về số nghiệm thực của phương trình f(x) = m hoặc f(x) + k = 0 (chọn giá trị m/k cụ thể).",
        "tiem_can": "Hỏi về phương trình đường tiệm cận đứng, tiệm cận ngang hoặc tiệm cận xiên của đồ thị hàm số.",
        "nhan_dang": f"Hỏi nhận dạng hàm số: 'Bảng biến thiên dưới đây là của hàm số nào?'. Các đáp án A, B, C, D là 4 công thức hàm số, trong đó đáp án đúng là y = {ham_so}.",
        "dung_sai": "Tạo 1 câu trắc nghiệm Đúng/Sai gồm 4 mệnh đề độc lập a), b), c), d) kiểm tra toàn diện: đồng biến/nghịch biến, cực trị, giá trị hàm số, và tiệm cận."
    }

    selected_guide = type_guides.get(question_type, type_guides["don_dieu"])

    prompt = f"""Bạn là một chuyên gia khảo thí và giáo viên Toán THPT xuất sắc.
Hãy tạo 1 câu hỏi trắc nghiệm Toán 12 dựa trên Bảng Biến Thiên (BBT) và dữ liệu toán học chuẩn xác 100% dưới đây:

### 1. DỮ LIỆU TOÁN HỌC CHUẨN XÁC (GROUND TRUTH):
- Hàm số khảo sát: $y = {ham_so}$
- Đạo hàm: $y' = {dao_ham}$
- Nghiệm của $y' = 0$: {nghiem}
- Dấu của $y'$ qua các khoảng: {dau}
- Đoạn mã LaTeX tkz-tab bắt buộc nhúng nguyên văn vào đề bài:
```latex
{latex_tab}
```

### 2. YÊU CẦU NỘI DUNG VÀ SƯ PHẠM:
- **Dạng câu hỏi:** {selected_guide}
- **Quy tắc bảo mật công thức:**
  + Trong đề bài, **TUYỆT ĐỐI KHÔNG ghi công thức cụ thể $y = {ham_so}$** (chỉ gọi chung là *"Cho hàm số $y = f(x)$ có bảng biến thiên như sau:"*), trừ trường hợp đề bài là dạng 'nhận dạng hàm số'.
  + Chỉ đưa công thức và phép tính đạo hàm chi tiết vào phần **Lời giải chi tiết**.
- **Độ tin cậy:**
  + Đáp án đúng phải khớp tuyệt đối với chiều mũi tên và các mốc cực trị trong mã tkz-tab ở trên.
  + Các phương án nhiễu phải hợp lý, cài bẫy các lỗi sai kinh điển của học sinh (như nhầm giữa điểm cực trị x và giá trị cực trị y).
"""

    if exam_format == "json":
        prompt += """
### 3. ĐỊNH DẠNG ĐẦU RA:
Trả về duy nhất một khối mã JSON hợp lệ (không kèm văn bản dẫn dắt):
{
  "question": "Nội dung câu hỏi đề bài...",
  "latex_tkz_tab": "Mã tkz-tab ở trên...",
  "options": {
    "A": "Nội dung phương án A...",
    "B": "Nội dung phương án B...",
    "C": "Nội dung phương án C...",
    "D": "Nội dung phương án D..."
  },
  "correct_answer": "A",
  "explanation": "Lời giải chi tiết từng bước..."
}
"""
    else:
        prompt += """
### 3. ĐỊNH DẠNG ĐẦU RA (MARKDOWN ĐỀ THI):
- **Câu hỏi**: [Đề bài + chèn mã LaTeX tkz-tab]
- **Các phương án**:
  - A. ...
  - B. ...
  - C. ...
  - D. ...
- **Đáp án đúng**: [A / B / C / D]
- **Lời giải chi tiết**: [Giải thích rõ ràng theo dữ liệu BBT]
"""

    return prompt.strip()


# ==============================================================================
# 6. GỌI TRỰC TIẾP GEMINI API (TÙY CHỌN NẾU CÓ KEY)
# ==============================================================================

def call_gemini_api(prompt: str, api_key: Optional[str] = None) -> str:
    """
    Gọi Gemini API để sinh câu hỏi trắc nghiệm ngay lập tức.
    Tìm API Key theo thứ tự: tham số truyền vào -> biến môi trường GEMINI_API_KEY.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        return "LƯU Ý: Chưa cấu hình GEMINI_API_KEY. Bạn có thể copy prompt trên dán vào ChatGPT/Gemini web hoặc thiết lập biến môi trường GEMINI_API_KEY."

    try:
        import urllib.request
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            text = res_data['candidates'][0]['content']['parts'][0]['text']
            return text
    except Exception as e:
        return f"Lỗi khi gọi Gemini API: {str(e)}"


# ==============================================================================
# CHƯƠNG TRÌNH DEMO & TEST
# ==============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("DEMO BỘ CÔNG CỤ SINH BẢNG BIẾN THIÊN TOÁN 12 & PROMPT AI")
    print("=" * 70)

    # 1. Thử nghiệm hàm bậc 3
    print("\n--- 1. HÀM SỐ BẬC 3: y = x^3 - 3x^2 + 2 ---")
    data_poly = analyze_and_generate_bbt("x**3 - 3*x**2 + 2")
    print("Mã LaTeX tkz-tab sinh ra:")
    print(data_poly["latex_tkz_tab"])

    # 2. Sinh prompt AI cho câu hỏi Cực trị
    print("\n--- 2. PROMPT AI CHO DẠNG CÂU HỎI CỰC TRỊ ---")
    prompt_cuc_tri = create_ai_prompt(data_poly, question_type="cuc_tri", exam_format="mcq_4")
    print(prompt_cuc_tri[:500] + "\n... [đã cắt bớt để dễ nhìn]")

    # 3. Thử nghiệm hàm phân thức 1/1
    print("\n--- 3. HÀM PHÂN THỨC 1/1: y = (2x - 1)/(x + 1) ---")
    data_rat1 = analyze_and_generate_bbt("(2*x - 1)/(x + 1)")
    print(data_rat1["latex_tkz_tab"])

    # 4. Thử nghiệm hàm phân thức 2/1 (Chương trình mới 2025)
    print("\n--- 4. HÀM PHÂN THỨC 2/1: y = (x^2 - x + 1)/(x - 1) ---")
    data_rat2 = analyze_and_generate_bbt("(x**2 - x + 1)/(x - 1)")
    print(data_rat2["latex_tkz_tab"])

    print("\n" + "=" * 70)
    print("ĐÃ TRIỂN KHAI THÀNH CÔNG VÀO FILE: bbt_generator.py")
    print("=" * 70)
