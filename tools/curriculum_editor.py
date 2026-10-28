"""
HSK Curriculum Studio - Desktop Offline Authoring Tool
Công cụ độc lập trên máy tính để biên soạn giáo trình HSK, tự động trích xuất từ PDF và xuất JSON.
"""

import os
import sys
import json
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import threading

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

try:
    import fitz  # pymupdf
except ImportError:
    fitz = None

try:
    from rapidocr_onnxruntime import RapidOCR
    ocr_engine = RapidOCR()
except Exception:
    ocr_engine = None

class CurriculumEditorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("HSK Curriculum Studio - Công Cụ Soạn Giáo Trình & OCR Offline")
        self.root.geometry("1100x750")
        self.root.minsize(900, 600)

        self.pdf_path = r"D:\dowload\hsk1 - tiếng việt (3.0).pdf" if os.path.exists(r"D:\dowload\hsk1 - tiếng việt (3.0).pdf") else ""
        self.current_lesson_data = self.get_empty_lesson()

        self.setup_ui()

    def get_empty_lesson(self):
        return {
            "bookTitle": "Giáo trình New HSK 1 (3.0)",
            "lessonNumber": 1,
            "titleZh": "AI小语，你好！",
            "titleVi": "Xin chào AI Tiểu Ngữ!",
            "titlePinyin": "AI Xiǎoyǔ, nǐ hǎo!",
            "objectives": "Nghe hiểu và sử dụng ngôn ngữ lịch sự để chào hỏi, cảm ơn, tạm biệt.",
            "dialogues": [],
            "vocabulary": [],
            "grammarNotes": [],
            "exercises": []
        }

    def setup_ui(self):
        # Top Bar: File & PDF Selector
        top_frame = ttk.Frame(self.root, padding=8)
        top_frame.pack(fill=tk.X, side=tk.TOP)

        ttk.Label(top_frame, text="File PDF Giáo Trình:", font=("Segoe UI", 9, "bold")).pack(side=tk.LEFT, padx=(0, 5))
        self.lbl_pdf_path = ttk.Label(top_frame, text=self.pdf_path or "(Chưa chọn file PDF)", foreground="blue", width=55)
        self.lbl_pdf_path.pack(side=tk.LEFT, padx=5)

        ttk.Button(top_frame, text="Chọn PDF khác...", command=self.browse_pdf).pack(side=tk.LEFT, padx=5)

        # Right action buttons
        ttk.Button(top_frame, text="📥 Nạp JSON", command=self.load_json).pack(side=tk.RIGHT, padx=4)
        ttk.Button(top_frame, text="💾 Xuất File JSON", command=self.save_json).pack(side=tk.RIGHT, padx=4)

        # Lesson Navigation Bar
        nav_frame = ttk.Frame(self.root, padding=6)
        nav_frame.pack(fill=tk.X, side=tk.TOP)

        ttk.Label(nav_frame, text="Chọn Bài Học:").pack(side=tk.LEFT, padx=(0, 5))
        self.spin_lesson = ttk.Spinbox(nav_frame, from_=1, to=20, width=5, command=self.on_lesson_change)
        self.spin_lesson.set(1)
        self.spin_lesson.pack(side=tk.LEFT, padx=5)

        ttk.Label(nav_frame, text="Từ trang PDF số:").pack(side=tk.LEFT, padx=(15, 5))
        self.entry_start_page = ttk.Entry(nav_frame, width=5)
        self.entry_start_page.insert(0, "17")
        self.entry_start_page.pack(side=tk.LEFT)

        ttk.Label(nav_frame, text="đến trang:").pack(side=tk.LEFT, padx=5)
        self.entry_end_page = ttk.Entry(nav_frame, width=5)
        self.entry_end_page.insert(0, "20")
        self.entry_end_page.pack(side=tk.LEFT)

        self.btn_auto_extract = ttk.Button(nav_frame, text="⚡ Trích xuất tự động từ PDF (AI OCR)", command=self.run_auto_extract)
        self.btn_auto_extract.pack(side=tk.LEFT, padx=15)

        self.lbl_ocr_status = ttk.Label(nav_frame, text="", foreground="green")
        self.lbl_ocr_status.pack(side=tk.LEFT, padx=5)

        # Notebook (Tabs) for Content Sections
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=8, pady=5)

        # Tab 1: Thông tin bài học (General Info)
        self.tab_info = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(self.tab_info, text="📌 1. Tiêu Đề & Mục Tiêu")
        self.build_info_tab()

        # Tab 2: Bài khóa / Hội thoại (Dialogues)
        self.tab_dialogue = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(self.tab_dialogue, text="🗣️ 2. Bài Khóa Hội Thoại")
        self.build_dialogue_tab()

        # Tab 3: Bảng Từ Mới (Vocabulary)
        self.tab_vocab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(self.tab_vocab, text="📚 3. Bảng Từ Mới")
        self.build_vocab_tab()

        # Tab 4: Ngữ pháp & Lớp học Tiểu Ngữ (Grammar)
        self.tab_grammar = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(self.tab_grammar, text="💡 4. Ngữ Pháp & Chú Thích")
        self.build_grammar_tab()

        # Tab 5: Bài tập trong sách (Exercises / Workbook)
        self.tab_exercise = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(self.tab_exercise, text="✍️ 5. Bài Tập Trong Sách (Workbook)")
        self.build_exercise_tab()

    def build_info_tab(self):
        f = self.tab_info
        row = 0

        ttk.Label(f, text="Tên Bộ Giáo Trình:", font=("Segoe UI", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=4)
        self.txt_book = ttk.Entry(f, width=50)
        self.txt_book.insert(0, "Giáo trình New HSK 1 (3.0)")
        self.txt_book.grid(row=row, column=1, sticky=tk.W, pady=4)

        row += 1
        ttk.Label(f, text="Tiêu đề Chữ Hán (Bài):", font=("Segoe UI", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=4)
        self.txt_title_zh = ttk.Entry(f, width=50, font=("Noto Serif SC", 12))
        self.txt_title_zh.insert(0, "AI小语，你好！")
        self.txt_title_zh.grid(row=row, column=1, sticky=tk.W, pady=4)

        row += 1
        ttk.Label(f, text="Pinyin Tiêu đề:", font=("Segoe UI", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=4)
        self.txt_title_py = ttk.Entry(f, width=50)
        self.txt_title_py.insert(0, "AI Xiǎoyǔ, nǐ hǎo!")
        self.txt_title_py.grid(row=row, column=1, sticky=tk.W, pady=4)

        row += 1
        ttk.Label(f, text="Dịch Nghĩa Tiếng Việt:", font=("Segoe UI", 9, "bold")).grid(row=row, column=0, sticky=tk.W, pady=4)
        self.txt_title_vi = ttk.Entry(f, width=50)
        self.txt_title_vi.insert(0, "Xin chào AI Tiểu Ngữ!")
        self.txt_title_vi.grid(row=row, column=1, sticky=tk.W, pady=4)

        row += 1
        ttk.Label(f, text="Mục Tiêu Bài Học (目标):", font=("Segoe UI", 9, "bold")).grid(row=row, column=0, sticky=tk.NW, pady=8)
        self.txt_objectives = tk.Text(f, height=5, width=65, font=("Segoe UI", 10))
        self.txt_objectives.insert(tk.END, "1. 能听懂并使用礼貌用语打招呼、致谢、告别。\n2. Có thể nghe hiểu và sử dụng ngôn ngữ lịch sự để chào hỏi, cảm ơn, tạm biệt.\n3. 了解中文交际礼仪，能听懂并使用敬称“您”。")
        self.txt_objectives.grid(row=row, column=1, sticky=tk.W, pady=8)

    def build_dialogue_tab(self):
        f = self.tab_dialogue
        ttk.Label(f, text="Nội Dung Các Bài Khóa (课文 1, 课文 2, 课文 3) - Copy hoặc trích từ PDF:", font=("Segoe UI", 9, "bold")).pack(anchor=tk.W)

        self.txt_dialogues = tk.Text(f, font=("Segoe UI", 10), height=25)
        self.txt_dialogues.pack(fill=tk.BOTH, expand=True, pady=5)
        sample = """[BÀI KHÓA 1] Bối cảnh: Ngày đầu tiên đi học, trong văn phòng, Vương Nhất Phi chào hỏi trợ giảng AI Tiểu Ngữ.
王一飞 (Wang Yifei): AI小语，你好！ (AI Xiaoyu, ni hao!) [Dịch: Xin chào AI Tiểu Ngữ!]
小语 (Xiaoyu): 王老师，你好！ (Wang laoshi, ni hao!) [Dịch: Chào cô Vương!]

[BÀI KHÓA 2] Bối cảnh: Tại lớp học, học sinh học cách diễn đạt chào hỏi.
王一飞 (Wang Yifei): 大家好！ (Dajia hao!) [Dịch: Chào cả lớp!]
学生们 (Học sinh): 老师，您好！ (Laoshi, nin hao!) [Dịch: Chào cô ạ!]
小语 (Xiaoyu): 你们好！ (Nimen hao!) [Dịch: Chào các bạn!]
学生们 (Học sinh): 你好，小语！ (Ni hao, Xiaoyu!) [Dịch: Chào Tiểu Ngữ!]

[BÀI KHÓA 3] Bối cảnh: Tại lớp học, học sinh học các mẫu câu cảm ơn và tạm biệt.
学生们 (Học sinh): 谢谢！ (Xiexie!) [Dịch: Cảm ơn bạn!]
小语 (Xiaoyu): 不客气！ (Bu keqi!) [Dịch: Đừng khách sáo!]
王一飞 (Wang Yifei): 同学们，再见！ (Tongxuemen, zaijian!) [Dịch: Tạm biệt các em!]
学生们 (Học sinh): 老师，再见！ (Laoshi, zaijian!) [Dịch: Tạm biệt cô ạ!]"""
        self.txt_dialogues.insert(tk.END, sample)

    def build_vocab_tab(self):
        f = self.tab_vocab
        ttk.Label(f, text="Danh Sách Từ Mới (Mỗi dòng 1 từ: Chữ Hán | Pinyin | Loại từ | Nghĩa tiếng Việt):", font=("Segoe UI", 9, "bold")).pack(anchor=tk.W)

        self.txt_vocab = tk.Text(f, font=("Segoe UI", 10), height=25)
        self.txt_vocab.pack(fill=tk.BOTH, expand=True, pady=5)
        sample = """你好 | nǐ hǎo | c.từ | xin chào, chào bạn
王老师 | Wáng lǎoshī | d.từ riêng | cô Vương, thầy Vương
大家 | dàjiā | đ.từ | mọi người, cả lớp
好 | hǎo | t.từ | tốt, khỏe, an lành
学生 | xuésheng | d.từ | học sinh, sinh viên
们 | men | h.từ | hậu tố số nhiều (chúng, các)
老师 | lǎoshī | d.từ | thầy giáo, cô giáo
您 | nín | đ.từ | ngài, ông, bà, thầy (kính ngữ của 你)
你们 | nǐmen | đ.từ | các bạn, các anh chị
谢谢 | xièxie | đg.từ | cảm ơn
不客气 | bú kèqi | c.từ | đừng khách sáo, không có gì
同学 | tóngxué | d.từ | bạn học, học sinh
再见 | zàijiàn | đg.từ | tạm biệt, hẹn gặp lại"""
        self.txt_vocab.insert(tk.END, sample)

    def build_grammar_tab(self):
        f = self.tab_grammar
        ttk.Label(f, text="Ngữ Pháp Trọng Điểm & Lớp Học Tiểu Ngữ (小语讲堂 / 小语助力):", font=("Segoe UI", 9, "bold")).pack(anchor=tk.W)

        self.txt_grammar = tk.Text(f, font=("Segoe UI", 10), height=25)
        self.txt_grammar.pack(fill=tk.BOTH, expand=True, pady=5)
        sample = """1. Kính ngữ '您' (Nín):
- “您” là đại từ nhân xưng mang sắc thái trang trọng, dùng để xưng hô với người lớn tuổi, thầy cô hoặc những người mình tôn kính.
- Ví dụ: 老师，您好！ (Laoshi, nin hao! - Chào cô ạ!)

2. Hậu tố số nhiều '们' (Men):
- Đứng sau đại từ nhân xưng hoặc danh từ chỉ người để biểu thị số nhiều: 我们 (chúng tôi), 你们 (các bạn), 他们 (họ), 学生们 (các học sinh), 同学们 (các bạn học).

3. Lời cảm ơn và đáp lại:
- Lời cảm ơn: 谢谢！ (Xièxie!)
- Lời đáp lại: 不客气！ (Bú kèqi!)

4. Bài vè luyện phát âm (跟读绕口令):
- 妈种麻，我放马。马吃麻，妈骂马。
(Mā zhòng má, wǒ fàng mǎ. Mǎ chī má, mā mà mǎ.)
Mẹ trồng cây gai, tôi thả ngựa. Ngựa ăn cây gai, mẹ mắng ngựa."""
        self.txt_grammar.insert(tk.END, sample)

    def build_exercise_tab(self):
        f = self.tab_exercise
        ttk.Label(f, text="Bài Tập Trong Sách (Copy y nguyên bài tập trong sách vào đây):", font=("Segoe UI", 9, "bold")).pack(anchor=tk.W)

        self.txt_exercises = tk.Text(f, font=("Segoe UI", 10), height=25)
        self.txt_exercises.pack(fill=tk.BOTH, expand=True, pady=5)
        sample = """[BÀI TẬP 1: NỐI TỪ VỚI NGHĨA]
1. 你好 ---- Xin chào
2. 谢谢 ---- Cảm ơn
3. 不客气 ---- Đừng khách sáo
4. 再见 ---- Tạm biệt
5. 老师 ---- Giáo viên

[BÀI TẬP 2: ĐIỀN TỪ VÀO CHỖ TRỐNG]
1. 老师，_____好！ (选词: 您 / 们 / 再见)
2. 谢谢！—— _____！ (选词: 不客气 / 老师 / 同学)
3. 同学_____，再见！ (选词: 们 / 您 / 好)

[BÀI TẬP 3: SẮP XẾP CÂU]
1. 好 / 您 / ！ / 老师 -> 老师，您好！
2. 大家好 / ！ -> 大家好！
3. 再见 / ， / 老师 / ！ -> 老师，再见！"""
        self.txt_exercises.insert(tk.END, sample)

    def browse_pdf(self):
        filename = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if filename:
            self.pdf_path = filename
            self.lbl_pdf_path.config(text=filename)

    def on_lesson_change(self):
        lesson_num = int(self.spin_lesson.get())
        # Map lesson numbers to page ranges in HSK 1 (3.0)
        page_map = {
            1: (17, 20),
            2: (21, 25),
            3: (26, 33),
            4: (34, 42),
            5: (43, 50),
            6: (51, 60),
            7: (61, 69),
            8: (70, 77),
            9: (78, 85),
            10: (86, 94),
            11: (95, 102),
            12: (103, 111),
            13: (112, 120),
            14: (121, 129),
            15: (130, 138),
        }
        if lesson_num in page_map:
            p_start, p_end = page_map[lesson_num]
            self.entry_start_page.delete(0, tk.END)
            self.entry_start_page.insert(0, str(p_start))
            self.entry_end_page.delete(0, tk.END)
            self.entry_end_page.insert(0, str(p_end))

    def run_auto_extract(self):
        if not self.pdf_path or not os.path.exists(self.pdf_path):
            messagebox.showerror("Lỗi", "Không tìm thấy file PDF giáo trình!")
            return

        if not fitz or not ocr_engine:
            messagebox.showerror("Lỗi", "Cần thư viện pymupdf và rapidocr_onnxruntime để OCR!")
            return

        try:
            start_p = int(self.entry_start_page.get())
            end_p = int(self.entry_end_page.get())
        except ValueError:
            messagebox.showerror("Lỗi", "Số trang không hợp lệ!")
            return

        self.btn_auto_extract.config(state=tk.DISABLED)
        self.lbl_ocr_status.config(text="Đang nhận diện AI OCR từ PDF...", foreground="orange")

        def task():
            try:
                import numpy as np
                from PIL import Image
                import io

                doc = fitz.open(self.pdf_path)
                lines_extracted = []

                for p in range(start_p - 1, min(end_p, len(doc))):
                    page = doc[p]
                    pix = page.get_pixmap(dpi=130)
                    img = Image.open(io.BytesIO(pix.tobytes("png")))
                    result, _ = ocr_engine(np.array(img))
                    if result:
                        for line in result:
                            lines_extracted.append(line[1])

                self.root.after(0, lambda: self.on_ocr_finished(lines_extracted))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Lỗi OCR", str(e)))
                self.root.after(0, lambda: self.btn_auto_extract.config(state=tk.NORMAL))
                self.root.after(0, lambda: self.lbl_ocr_status.config(text="Lỗi OCR!", foreground="red"))

        threading.Thread(target=task, daemon=True).start()

    def on_ocr_finished(self, lines):
        self.btn_auto_extract.config(state=tk.NORMAL)
        self.lbl_ocr_status.config(text=f"Đã trích xuất {len(lines)} dòng thành công!", foreground="green")

        # Show raw OCR in dialogue or prompt to append
        if lines:
            text_str = "\n".join(lines)
            self.txt_dialogues.insert(tk.END, f"\n\n--- DỮ LIỆU OCR TỪ TRANG {self.entry_start_page.get()} ĐẾN {self.entry_end_page.get()} ---\n" + text_str)
            messagebox.showinfo("Thành công", f"Đã bóc tách thành công {len(lines)} dòng chữ từ sách!\nDữ liệu đã được nạp vào Tab để bạn rà soát.")

    def save_json(self):
        lesson_num = int(self.spin_lesson.get())
        # Parse vocab lines
        vocab_lines = self.txt_vocab.get("1.0", tk.END).strip().split("\n")
        vocab_list = []
        for line in vocab_lines:
            if not line.strip() or "|" not in line:
                continue
            parts = [p.strip() for p in line.split("|")]
            vocab_list.append({
                "hanzi": parts[0] if len(parts) > 0 else "",
                "pinyin": parts[1] if len(parts) > 1 else "",
                "partOfSpeech": parts[2] if len(parts) > 2 else "",
                "meaning": parts[3] if len(parts) > 3 else "",
            })

        data = {
            "book": self.txt_book.get().strip(),
            "lessonNumber": lesson_num,
            "titleZh": self.txt_title_zh.get().strip(),
            "titlePinyin": self.txt_title_py.get().strip(),
            "titleVi": self.txt_title_vi.get().strip(),
            "objectives": self.txt_objectives.get("1.0", tk.END).strip(),
            "dialoguesRaw": self.txt_dialogues.get("1.0", tk.END).strip(),
            "vocabulary": vocab_list,
            "grammarRaw": self.txt_grammar.get("1.0", tk.END).strip(),
            "exercisesRaw": self.txt_exercises.get("1.0", tk.END).strip(),
        }

        save_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            initialfile=f"hsk1_lesson_{lesson_num}.json",
            filetypes=[("JSON Files", "*.json")]
        )
        if save_path:
            with open(save_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            messagebox.showinfo("Thành công", f"Đã lưu bài học thành công vào:\n{save_path}")

    def load_json(self):
        open_path = filedialog.askopenfilename(filetypes=[("JSON Files", "*.json")])
        if open_path:
            with open(open_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            self.txt_book.delete(0, tk.END)
            self.txt_book.insert(0, data.get("book", ""))

            self.spin_lesson.set(data.get("lessonNumber", 1))

            self.txt_title_zh.delete(0, tk.END)
            self.txt_title_zh.insert(0, data.get("titleZh", ""))

            self.txt_title_py.delete(0, tk.END)
            self.txt_title_py.insert(0, data.get("titlePinyin", ""))

            self.txt_title_vi.delete(0, tk.END)
            self.txt_title_vi.insert(0, data.get("titleVi", ""))

            self.txt_objectives.delete("1.0", tk.END)
            self.txt_objectives.insert(tk.END, data.get("objectives", ""))

            self.txt_dialogues.delete("1.0", tk.END)
            self.txt_dialogues.insert(tk.END, data.get("dialoguesRaw", ""))

            self.txt_grammar.delete("1.0", tk.END)
            self.txt_grammar.insert(tk.END, data.get("grammarRaw", ""))

            self.txt_exercises.delete("1.0", tk.END)
            self.txt_exercises.insert(tk.END, data.get("exercisesRaw", ""))

            # Reconstruct vocab
            vocab_list = data.get("vocabulary", [])
            lines = [f"{v.get('hanzi','')} | {v.get('pinyin','')} | {v.get('partOfSpeech','')} | {v.get('meaning','')}" for v in vocab_list]
            self.txt_vocab.delete("1.0", tk.END)
            self.txt_vocab.insert(tk.END, "\n".join(lines))

            messagebox.showinfo("Thành công", "Đã nạp bài học thành công!")

if __name__ == "__main__":
    root = tk.Tk()
    app = CurriculumEditorApp(root)
    root.mainloop()
