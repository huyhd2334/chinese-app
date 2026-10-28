import json
import os

lessons = [
    {
        "book": "Giáo trình New HSK 1 (3.0) - Song ngữ",
        "lessonNumber": 1,
        "titleZh": "AI小语，你好！",
        "titlePinyin": "AI Xiǎoyǔ, nǐ hǎo!",
        "titleVi": "Xin chào AI Tiểu Ngữ!",
        "pageRange": "Trang 17 - 20",
        "objectives": [
            "Nghe hiểu và sử dụng ngôn ngữ lịch sự để chào hỏi, cảm ơn, tạm biệt.",
            "Hiểu về nghi thức giao tiếp tiếng Trung, sử dụng đại từ kính trọng '您'.",
            "Luyện đọc chuẩn các thanh mẫu, vận mẫu và thanh điệu cơ bản."
        ],
        "dialogues": [
            {
                "id": "l1_d1",
                "part": "课文 1 (Bài khóa 1)",
                "context": "Khai trường ngày đầu tiên, trong văn phòng, Vương Nhất Phi chào hỏi trợ giảng AI Tiểu Ngữ.",
                "lines": [
                    {"role": "王一飞 (Vương Nhất Phi)", "chinese": "AI小语，你好！", "pinyin": "AI Xiǎoyǔ, nǐ hǎo!", "vietnamese": "Xin chào AI Tiểu Ngữ!"},
                    {"role": "小语 (Tiểu Ngữ)", "chinese": "王老师，你好！", "pinyin": "Wáng lǎoshī, nǐ hǎo!", "vietnamese": "Chào cô Vương!"}
                ]
            },
            {
                "id": "l1_d2",
                "part": "课文 2 (Bài khóa 2)",
                "context": "Ngày đầu tiên đi học, tại lớp học, học sinh học cách diễn đạt chào hỏi.",
                "lines": [
                    {"role": "王一飞 (Vương Nhất Phi)", "chinese": "大家好！", "pinyin": "Dàjiā hǎo!", "vietnamese": "Chào cả lớp!"},
                    {"role": "学生们 (Học sinh)", "chinese": "老师，您好！", "pinyin": "Lǎoshī, nín hǎo!", "vietnamese": "Chào cô ạ!"},
                    {"role": "小语 (Tiểu Ngữ)", "chinese": "你们好！", "pinyin": "Nǐmen hǎo!", "vietnamese": "Chào các bạn!"},
                    {"role": "学生们 (Học sinh)", "chinese": "你好，小语！", "pinyin": "Nǐ hǎo, Xiǎoyǔ!", "vietnamese": "Chào Tiểu Ngữ!"}
                ]
            },
            {
                "id": "l1_d3",
                "part": "课文 3 (Bài khóa 3)",
                "context": "Tại lớp học, học sinh học các mẫu câu cảm ơn và tạm biệt.",
                "lines": [
                    {"role": "学生们 (Học sinh)", "chinese": "谢谢！", "pinyin": "Xièxie!", "vietnamese": "Cảm ơn bạn!"},
                    {"role": "小语 (Tiểu Ngữ)", "chinese": "不客气！", "pinyin": "Bú kèqi!", "vietnamese": "Đừng khách sáo!"},
                    {"role": "王一飞 (Vương Nhất Phi)", "chinese": "同学们，再见！", "pinyin": "Tóngxuémen, zàijiàn!", "vietnamese": "Tạm biệt các em!"},
                    {"role": "学生们 (Học sinh)", "chinese": "老师，再见！", "pinyin": "Lǎoshī, zàijiàn!", "vietnamese": "Tạm biệt cô ạ!"}
                ]
            }
        ],
        "vocabulary": [
            {"hanzi": "你好", "pinyin": "nǐ hǎo", "hanViet": "Nhĩ Hảo", "partOfSpeech": "c.từ", "meaning": "xin chào, chào bạn"},
            {"hanzi": "王老师", "pinyin": "Wáng lǎoshī", "hanViet": "Vương Lão Sư", "partOfSpeech": "d.từ riêng", "meaning": "cô Vương, thầy Vương"},
            {"hanzi": "大家", "pinyin": "dàjiā", "hanViet": "Đại Gia", "partOfSpeech": "đ.từ", "meaning": "mọi người, cả lớp"},
            {"hanzi": "好", "pinyin": "hǎo", "hanViet": "Hảo", "partOfSpeech": "t.từ", "meaning": "tốt, khỏe, đẹp"},
            {"hanzi": "学生", "pinyin": "xuésheng", "hanViet": "Học Sinh", "partOfSpeech": "d.từ", "meaning": "học sinh, sinh viên"},
            {"hanzi": "们", "pinyin": "men", "hanViet": "Môn", "partOfSpeech": "h.từ", "meaning": "hậu tố số nhiều (chúng, các)"},
            {"hanzi": "老师", "pinyin": "lǎoshī", "hanViet": "Lão Sư", "partOfSpeech": "d.từ", "meaning": "thầy giáo, cô giáo"},
            {"hanzi": "您", "pinyin": "nín", "hanViet": "Nẫm", "partOfSpeech": "đ.từ", "meaning": "ngài, ông, bà, thầy (kính ngữ của 你)"},
            {"hanzi": "你们", "pinyin": "nǐmen", "hanViet": "Nhĩ Môn", "partOfSpeech": "đ.từ", "meaning": "các bạn, các anh chị"},
            {"hanzi": "谢谢", "pinyin": "xièxie", "hanViet": "Tạ Tạ", "partOfSpeech": "đg.từ", "meaning": "cảm ơn"},
            {"hanzi": "不客气", "pinyin": "bú kèqi", "hanViet": "Bất Khách Khí", "partOfSpeech": "c.từ", "meaning": "đừng khách sáo, không có gì"},
            {"hanzi": "同学", "pinyin": "tóngxué", "hanViet": "Đồng Học", "partOfSpeech": "d.từ", "meaning": "bạn học, học sinh"},
            {"hanzi": "再见", "pinyin": "zàijiàn", "hanViet": "Tái Kiến", "partOfSpeech": "đg.từ", "meaning": "tạm biệt, hẹn gặp lại"}
        ],
        "grammarNotes": [
            "1. Kính ngữ '您' (Nín): Là đại từ nhân xưng mang sắc thái trang trọng, dùng để xưng hô với người lớn tuổi, thầy cô hoặc đối tác tôn kính (Ví dụ: 老师，您好！).",
            "2. Hậu tố số nhiều '们' (Men): Đặt sau đại từ hoặc danh từ chỉ người để biểu thị số nhiều: 我们 (chúng tôi), 你们 (các bạn), 他们 (họ), 学生们 (các học sinh), 同学们 (các bạn học).",
            "3. Lời cảm ơn và đáp lại: Lời cảm ơn dùng '谢谢！', đối phương đáp lại lịch sự '不客气！'.",
            "4. Bài vè luyện phát âm (跟读绕口令): 妈种麻，我放马。马吃麻，妈骂马。 (Mẹ trồng cây gai, tôi thả ngựa. Ngựa ăn cây gai, mẹ mắng ngựa)."
        ],
        "exercises": [
            {
                "type": "matching",
                "question": "Nối các từ chào hỏi, cảm ơn với nghĩa tương ứng",
                "pairs": [
                    {"left": "你好", "right": "Xin chào"},
                    {"left": "谢谢", "right": "Cảm ơn"},
                    {"left": "不客气", "right": "Đừng khách sáo"},
                    {"left": "再见", "right": "Tạm biệt"},
                    {"left": "老师", "right": "Thầy / Cô giáo"}
                ]
            },
            {
                "type": "fill_in_the_blank",
                "sentence": "老师，_____好！",
                "options": ["您", "们", "再见"],
                "answer": "您"
            },
            {
                "type": "sentence_reorder",
                "tokens": ["好", "您", "！", "老师"],
                "answer": "老师，您好！"
            }
        ]
    },
    {
        "book": "Giáo trình New HSK 1 (3.0) - Song ngữ",
        "lessonNumber": 2,
        "titleZh": "我叫李文",
        "titlePinyin": "Wǒ jiào Lǐ Wén",
        "titleVi": "Mình tên là Lý Văn",
        "pageRange": "Trang 21 - 25",
        "objectives": [
            "Nghe hiểu và sử dụng họ tên tiếng Trung để tự giới thiệu bản thân.",
            "Biết dùng '对不起' để xin lỗi và đáp lại bằng '没关系' hoặc '没事'.",
            "Nắm vững trật tự từ cơ bản của câu trong tiếng Trung (Chủ ngữ + Vị ngữ + Tân ngữ).",
            "Hiểu cấu trúc họ tên người Trung Quốc (Họ + Tên)."
        ],
        "dialogues": [
            {
                "id": "l2_d1",
                "part": "课文 1 (Bài khóa 1)",
                "context": "Trong lớp học, Vương Nhất Phi làm quen với học sinh.",
                "lines": [
                    {"role": "王一飞 (Vương Nhất Phi)", "chinese": "请问，你叫什么名字？", "pinyin": "Qǐngwèn, nǐ jiào shénme míngzi?", "vietnamese": "Xin hỏi, em tên là gì?"},
                    {"role": "陈天中 (Trần Thiên Trung)", "chinese": "我叫陈天中。", "pinyin": "Wǒ jiào Chén Tiānzhōng.", "vietnamese": "Em tên là Trần Thiên Trung ạ."}
                ]
            },
            {
                "id": "l2_d2",
                "part": "课文 2 (Bài khóa 2)",
                "context": "Trong khuôn viên trường, Trần Thiên Trung chào nhầm Bạch Gia Nguyệt.",
                "lines": [
                    {"role": "陈天中 (Trần Thiên Trung)", "chinese": "你好，安妮！", "pinyin": "Nǐ hǎo, Ānnī!", "vietnamese": "Chào Annie!"},
                    {"role": "白家月 (Bạch Gia Nguyệt)", "chinese": "你好，陈天中！我不是安妮，我是白家月。", "pinyin": "Nǐ hǎo, Chén Tiānzhōng! Wǒ bú shì Ānnī, wǒ shì Bái Jiāyuè.", "vietnamese": "Chào Trần Thiên Trung! Mình không phải là Annie, mình là Bạch Gia Nguyệt."},
                    {"role": "陈天中 (Trần Thiên Trung)", "chinese": "对不起！", "pinyin": "Duìbuqǐ!", "vietnamese": "Xin lỗi bạn!"},
                    {"role": "白家月 (Bạch Gia Nguyệt)", "chinese": "没关系！", "pinyin": "Méi guānxi!", "vietnamese": "Không sao đâu!"}
                ]
            },
            {
                "id": "l2_d3",
                "part": "课文 3 (Bài khóa 3)",
                "context": "Trong khuôn viên trường, Lý Văn và Bạch Gia Nguyệt lần đầu gặp nhau.",
                "lines": [
                    {"role": "李文 (Lý Văn)", "chinese": "你好！我叫李文。", "pinyin": "Nǐ hǎo! Wǒ jiào Lǐ Wén.", "vietnamese": "Chào bạn! Mình tên là Lý Văn."},
                    {"role": "白家月 (Bạch Gia Nguyệt)", "chinese": "你好！我叫白家月。", "pinyin": "Nǐ hǎo! Wǒ jiào Bái Jiāyuè.", "vietnamese": "Xin chào! Mình tên là Bạch Gia Nguyệt."},
                    {"role": "李文 (Lý Văn)", "chinese": "很高兴认识你。", "pinyin": "Hěn gāoxìng rènshi nǐ.", "vietnamese": "Rất vui được làm quen với bạn."},
                    {"role": "白家月 (Bạch Gia Nguyệt)", "chinese": "认识你我也很高兴。", "pinyin": "Rènshi nǐ wǒ yě hěn gāoxìng.", "vietnamese": "Mình cũng rất vui được làm quen với bạn."}
                ]
            }
        ],
        "vocabulary": [
            {"hanzi": "请问", "pinyin": "qǐngwèn", "hanViet": "Thỉnh Vấn", "partOfSpeech": "đg.từ", "meaning": "xin hỏi"},
            {"hanzi": "你", "pinyin": "nǐ", "hanViet": "Nhĩ", "partOfSpeech": "đ.từ", "meaning": "bạn, anh, chị"},
            {"hanzi": "叫", "pinyin": "jiào", "hanViet": "Khiếu", "partOfSpeech": "đg.từ", "meaning": "gọi là, tên là"},
            {"hanzi": "什么", "pinyin": "shénme", "hanViet": "Thập Ma", "partOfSpeech": "đ.từ", "meaning": "gì, cái gì"},
            {"hanzi": "名字", "pinyin": "míngzi", "hanViet": "Danh Tự", "partOfSpeech": "d.từ", "meaning": "tên"},
            {"hanzi": "我", "pinyin": "wǒ", "hanViet": "Ngã", "partOfSpeech": "đ.từ", "meaning": "tôi, mình"},
            {"hanzi": "不", "pinyin": "bù", "hanViet": "Bất", "partOfSpeech": "phó.từ", "meaning": "không, chẳng"},
            {"hanzi": "是", "pinyin": "shì", "hanViet": "Thị", "partOfSpeech": "đg.từ", "meaning": "là (to be)"},
            {"hanzi": "对不起", "pinyin": "duìbuqǐ", "hanViet": "Đối Bất Khởi", "partOfSpeech": "c.từ", "meaning": "xin lỗi"},
            {"hanzi": "没关系", "pinyin": "méi guānxi", "hanViet": "Một Quan Hệ", "partOfSpeech": "c.từ", "meaning": "không sao, không có gì"},
            {"hanzi": "没事", "pinyin": "méi shì", "hanViet": "Một Sự", "partOfSpeech": "c.từ", "meaning": "không sao (khẩu ngữ)"},
            {"hanzi": "很", "pinyin": "hěn", "hanViet": "Khẩn", "partOfSpeech": "phó.từ", "meaning": "rất"},
            {"hanzi": "高兴", "pinyin": "gāoxìng", "hanViet": "Cao Hứng", "partOfSpeech": "t.từ", "meaning": "vui vẻ, phấn khởi"},
            {"hanzi": "认识", "pinyin": "rènshi", "hanViet": "Nhận Thức", "partOfSpeech": "đg.từ", "meaning": "quen biết, làm quen"},
            {"hanzi": "也", "pinyin": "yě", "hanViet": "Dã", "partOfSpeech": "phó.từ", "meaning": "cũng"}
        ],
        "grammarNotes": [
            "1. Trật tự từ cơ bản của câu tiếng Trung: Chủ ngữ + Vị ngữ + Tân ngữ (Ví dụ: 我 [Chủ] 叫 [Vị] 陈天中 [Tân]).",
            "2. Cấu trúc họ tên người Trung Quốc: Họ đứng trước, Tên đứng sau (Ví dụ: 李文 [Họ Lý + Tên Văn], 白家月 [Họ Bạch + Tên Gia Nguyệt]).",
            "3. Khẩu ngữ '没事': Trong văn nói hàng ngày, người Trung Quốc rất hay dùng '没事' hoặc '没事儿' để đáp lại lời xin lỗi thay cho '没关系'.",
            "4. Đồng dao luyện phát âm: 七加一，再减一，加完减完等于几？加完减完还是七。 (Bảy cộng một, lại trừ một. Cộng xong trừ xong thì bằng mấy? Vẫn là bảy)."
        ],
        "exercises": [
            {
                "type": "matching",
                "question": "Nối các từ với nghĩa tương ứng",
                "pairs": [
                    {"left": "请问", "right": "Xin hỏi"},
                    {"left": "名字", "right": "Tên"},
                    {"left": "对不起", "right": "Xin lỗi"},
                    {"left": "高兴", "right": "Vui vẻ"},
                    {"left": "认识", "right": "Làm quen"}
                ]
            },
            {
                "type": "fill_in_the_blank",
                "sentence": "你叫什么_____？",
                "options": ["名字", "老师", "学生"],
                "answer": "名字"
            },
            {
                "type": "sentence_reorder",
                "tokens": ["名字", "？", "叫", "什么", "你"],
                "answer": "你叫什么名字？"
            }
        ]
    }
]

os.makedirs("data/processed", exist_ok=True)
with open("data/processed/new_hsk1_lessons.json", "w", encoding="utf-8") as f:
    json.dump(lessons, f, ensure_ascii=False, indent=2)

print("Exported", len(lessons), "lessons to data/processed/new_hsk1_lessons.json successfully!")
