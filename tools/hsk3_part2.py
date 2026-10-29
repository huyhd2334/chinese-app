# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

lessons_7_to_12 = [
    {
        "lessonNumber": 7,
        "title": "那条裙子比短裤更好看",
        "titleVi": "Chiếc váy đó đẹp hơn quần soóc",
        "titlePinyin": "Nà tiáo qúnzi bǐ duǎnkù gèng hǎokàn",
        "vocabulary": [
            {"id": "nh3_7_1", "hanzi": "裙子", "pinyin": "qúnzi", "hanViet": "Quần Tử", "meaning": "váy, đầm", "partOfSpeech": "d.từ"},
            {"id": "nh3_7_2", "hanzi": "短裤", "pinyin": "duǎnkù", "hanViet": "Đoản Khố", "meaning": "quần soóc, quần cộc", "partOfSpeech": "d.từ"},
            {"id": "nh3_7_3", "hanzi": "试穿", "pinyin": "shìchuān", "hanViet": "Thí Xuyên", "meaning": "mặc thử", "partOfSpeech": "đg.từ"},
            {"id": "nh3_7_4", "hanzi": "越来越", "pinyin": "yuèláiyuè", "hanViet": "Việt Lai Việt", "meaning": "càng ngày càng", "partOfSpeech": "phó.từ"},
            {"id": "nh3_7_5", "hanzi": "衬衫", "pinyin": "chènshān", "hanViet": "Sấn Sam", "meaning": "áo sơ mi", "partOfSpeech": "d.từ"},
            {"id": "nh3_7_6", "hanzi": "打折", "pinyin": "dǎ zhé", "hanViet": "Đả Chiết", "meaning": "giảm giá", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_7_7", "hanzi": "镜子", "pinyin": "jìngzi", "hanViet": "Kính Tử", "meaning": "chiếc gương", "partOfSpeech": "d.từ"},
            {"id": "nh3_7_8", "hanzi": "适合", "pinyin": "shìhé", "hanViet": "Thích Hợp", "meaning": "phù hợp, thích hợp", "partOfSpeech": "đg.từ"},
            {"id": "nh3_7_9", "hanzi": "不但", "pinyin": "búdàn", "hanViet": "Bất Đán", "meaning": "không những", "partOfSpeech": "liên.từ"},
            {"id": "nh3_7_10", "hanzi": "而且", "pinyin": "érqiě", "hanViet": "Nhi Thả", "meaning": "mà còn", "partOfSpeech": "liên.từ"}
        ],
        "dialogues": [
            {"id": "nh3_7_d_1", "role": "白家月", "chinese": "安妮，你看这件红色的短裤怎么样？", "pinyin": "Ānnī, nǐ kàn zhè jiàn hóngsè de duǎnkù zěnmeyàng?", "vietnamese": "Annie, cậu thấy chiếc quần soóc màu đỏ này thế nào?"},
            {"id": "nh3_7_d_2", "role": "安妮", "chinese": "红色的短裤挺可爱的，不过我觉得旁边那条米黄色的长裙比短裤更好看，也更适合你。", "pinyin": "Hóngsè de duǎnkù tǐng kě'ài de, búguò wǒ juéde pángbiān nà tiáo mǐhuángsè de chángqún bǐ duǎnkù gèng hǎokàn, yě gèng shìhé nǐ.", "vietnamese": "Quần soóc đỏ khá dễ thương, nhưng mình thấy chiếc váy dài màu be bên cạnh đẹp hơn quần soóc, mà cũng hợp với cậu hơn."},
            {"id": "nh3_7_d_3", "role": "白家月", "chinese": "真的吗？我去试衣间穿上照照镜子看看。哇，不但显瘦，而且面料穿在身上特别舒服！", "pinyin": "Zhēn de ma? Wǒ qù shìyījiān chuān shàng zhàozhao jìngzi kànkan. Wā, búdàn xiǎn shòu, érqiě miànliào chuān zài shēnshang tèbié shūfu!", "vietnamese": "Thật sao? Để mình vào phòng thử đồ mặc vào soi gương xem nào. Oa, không những tôn dáng thon gọn mà chất vải mặc lên người còn cực kỳ dễ chịu!"}
        ],
        "readingPassage": {
            "title": "商场购物选新装 (Buổi mua sắm chọn đồ mới tại trung tâm thương mại)",
            "content": "周末的大型购物商场热闹非凡，服装专柜正在进行秋季换季打折大促销。随着天气越来越冷，白家月和安妮打算挑选几件合适的新衣服。家月平时喜欢穿舒适休闲的牛仔裤和运动短裤，但安妮建议她多尝试温婉大方的连衣裙。在试衣间试穿了一条淡雅的格子长裙后，家月在明亮的大镜子前转了一圈，惊喜地发现自己的气质完全不一样了。店员也热情地赞美道：“这件裙子不但剪裁精美，而且今天全场打七折，性价比非常高！”",
            "pinyin": "Zhōumò de dàxíng gòuwù shāngchǎng rènào-fēifán, fúzhuāng zhuānguì zhèngzài jìnxíng qiūjì huànjì dǎzhé dà cùxiāo. Suízhe tiānqì yuèláiyuè lěng, Bái Jiāyuè hé Ānnī dǎsuàn tiāoxuǎn jǐ jiàn héshì de xīn yīfu. Jiāyuè píngshí xǐhuan chuān shūshì xiūxián de niúzǎikù hé yùndòng duǎnkù, dàn Ānnī jiànyì tā duō chángshì wēnwǎn dàfāng de liányīqún. Zài shìyījiān shìchuān le yì tiáo dànyǎ de gèzi chángqún hòu, Jiāyuè zài míngliàng de dà jìngzi qián zhuàn le yì quān, jīngxǐ de fāxiàn zìjǐ de qìzhì wánquán bù yíyàng le. Diànyuán yě rèqíng de zànměi dào: 'Zhè jiàn qúnzi búdàn jiǎncái jīngměi, érqiě jīntiān quánchǎng dǎ qī zhé, xìngjiàbǐ fēicháng gāo!'",
            "vietnamese": "Cuối tuần trung tâm thương mại lớn vô cùng náo nhiệt, các quầy hàng quần áo đang mở đợt đại hạ giá chuyển mùa thu đông. Khi tiết trời ngày một lạnh hơn, Bạch Gia Nguyệt và Annie dự định chọn vài bộ quần áo mới phù hợp. Bình thường Gia Nguyệt thích mặc quần bò rộng rãi thoải mái và quần soóc thể thao, nhưng Annie khuyên cô nên thử thêm những chiếc đầm liền thùy mị trang nhã. Sau khi thử chiếc váy dài kẻ carô thanh lịch trong phòng thử đồ, Gia Nguyệt xoay một vòng trước gương lớn sáng choang, vui mừng nhận thấy khí chất của mình đã hoàn toàn thay đổi. Nhân viên bán hàng cũng niềm nở khen ngợi: 'Chiếc váy này không những đường may tinh xảo mà hôm nay còn giảm giá tới 30%, chất lượng vượt xa giá tiền!'"
        },
        "grammarNotes": [
            "1. Cụm từ cố định '越来越……': Biểu thị mức độ thay đổi tăng tiến theo thời gian (Ví dụ: 天气越来越冷 - Thời tiết càng ngày càng lạnh; 汉语水平越来越高 - Trình độ tiếng Trung ngày một nâng cao).",
            "2. Câu so sánh (10) 'A 比 B 更 / 还 + Tính từ': Dùng '更' hoặc '还' trước tính từ để nhấn mạnh mức độ cao hơn (Ví dụ: 这条裙子比短裤更好看 - Chiếc váy này còn đẹp hơn chiếc quần soóc).",
            "3. Câu ghép tăng tiến '不但……，而且……': Biểu thị lớp nghĩa sau sâu hơn, tiến thêm một bậc so với lớp nghĩa trước (Ví dụ: 他不但会说汉语，而且说得非常流利 - Anh ấy không những biết nói tiếng Trung mà còn nói rất lưu loát)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_7_lis_1",
                "audioText": "男：你觉得今天这件衬衫怎么样？女：不但颜色好看，而且现在买还打五折呢！",
                "question": "女的觉得这件衬衫怎么样？(Người nữ thấy chiếc áo sơ mi thế nào?)",
                "questionPinyin": "Nǚ de juéde zhè jiàn chènshān zěnmeyàng?",
                "options": ["太贵了", "颜色好看且打五折", "尺寸不合适"],
                "answerIndex": 1,
                "explanation": "Người nữ khen: '不但颜色好看，而且现在买还打五折'."
            },
            {
                "id": "nh3_7_lis_2",
                "audioText": "女：明天去参加聚会，我穿裤子还是穿裙子？男：穿裙子吧，那条红色的裙子比裤子更漂亮。",
                "question": "男的建议女的穿什么？(Người nam gợi ý người nữ mặc gì?)",
                "questionPinyin": "Nán de jiànyì nǚ de chuān shénme?",
                "options": ["运动裤", "红色裙子", "大衣"],
                "answerIndex": 1,
                "explanation": "Người nam khuyên: '那条红色的裙子比裤子更漂亮' (Chiếc váy đỏ đẹp hơn quần)."
            }
        ]
    },
    {
        "lessonNumber": 8,
        "title": "今天我出院了",
        "titleVi": "Hôm nay tôi xuất viện rồi",
        "titlePinyin": "Jīntiān wǒ chūyuàn le",
        "vocabulary": [
            {"id": "nh3_8_1", "hanzi": "出院", "pinyin": "chū yuàn", "hanViet": "Xuất Viện", "meaning": "xuất viện, ra viện", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_8_2", "hanzi": "恢复", "pinyin": "huìfù", "hanViet": "Khôi Phục", "meaning": "hồi phục, bình phục", "partOfSpeech": "đg.từ"},
            {"id": "nh3_8_3", "hanzi": "锻炼", "pinyin": "duànliàn", "hanViet": "Đoán Luyện", "meaning": "rèn luyện, tập thể dục", "partOfSpeech": "đg.từ"},
            {"id": "nh3_8_4", "hanzi": "散步", "pinyin": "sàn bù", "hanViet": "Tán Bộ", "meaning": "đi dạo", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_8_5", "hanzi": "按时", "pinyin": "ànshí", "hanViet": "Án Thời", "meaning": "đúng giờ", "partOfSpeech": "phó.từ"},
            {"id": "nh3_8_6", "hanzi": "吃药", "pinyin": "chī yào", "hanViet": "Ngật Dược", "meaning": "uống thuốc", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_8_7", "hanzi": "以前", "pinyin": "yǐqián", "hanViet": "Dĩ Tiền", "meaning": "trước đây, trước khi", "partOfSpeech": "d.từ thời gian"},
            {"id": "nh3_8_8", "hanzi": "以后", "pinyin": "yǐhòu", "hanViet": "Dĩ Hậu", "meaning": "sau này, sau khi", "partOfSpeech": "d.từ thời gian"},
            {"id": "nh3_8_9", "hanzi": "担心", "pinyin": "dānxīn", "hanViet": "Đam Tâm", "meaning": "lo lắng", "partOfSpeech": "đg.từ / t.từ"},
            {"id": "nh3_8_10", "hanzi": "健康", "pinyin": "jiànkāng", "hanViet": "Kiện Khang", "meaning": "khỏe mạnh, sức khỏe", "partOfSpeech": "t.từ / d.từ"}
        ],
        "dialogues": [
            {"id": "nh3_8_d_1", "role": "医生", "chinese": "刘明，检查结果都很好，你的身体已经恢复得差不多了，今天就可以办出院手续了。", "pinyin": "Liú Míng, jiǎnchá jiéguǒ dōu hěn hǎo, nǐ de shēntǐ yǐjīng huìfù de chàbuduō le, jīntiān jiù kěyǐ bàn chūyuàn shǒuxù le.", "vietnamese": "Lưu Minh, kết quả kiểm tra đều rất tốt, sức khỏe của anh đã hồi phục gần như hoàn toàn, hôm nay có thể làm thủ tục xuất viện rồi."},
            {"id": "nh3_8_d_2", "role": "刘明", "chinese": "太感谢您了张医生！出院以后我还需要继续吃药吗？", "pinyin": "Tài gǎnxiè nín le Zhāng yīshēng! Chūyuàn yǐhòu wǒ hái xūyào jìxù chī yào ma?", "vietnamese": "Cảm ơn bác sĩ Trương rất nhiều! Sau khi ra viện tôi có cần tiếp tục uống thuốc không ạ?"},
            {"id": "nh3_8_d_3", "role": "医生", "chinese": "这瓶药每天饭后吃一次，再吃一个星期。平时多去公园散散步，但千万不要做剧烈运动。", "pinyin": "Zhè píng yào měitiān fànhòu chī yí cì, zài chī yí gè xīngqī. Píngshí duō qù gōngyuán sànsanbù, dàn qiānwàn bú yào zuò jùliè yùndòng.", "vietnamese": "Lọ thuốc này uống mỗi ngày một lần sau bữa ăn, uống thêm một tuần nữa. Bình thường hãy đi dạo công viên nhiều hơn, nhưng tuyệt đối không được vận động quá mạnh nhé."}
        ],
        "readingPassage": {
            "title": "重获健康的喜悦 (Niềm vui bình phục xuất viện)",
            "content": "在医院住了两个星期之后，刘明今天终于拿到了出院通知书。两个星期以前，他因为连续熬夜加班和不规律的饮食突发肠胃炎住进了医院。在张医生和护士们的悉心照料下，他的病情一天天好转起来。王一雪特地开车来到医院接他回家。走在温暖的阳光下，呼吸着新鲜清爽的空气，刘明深有感触地对一雪说：“生了一场病，我才真正体会到健康比什么都重要。从今以后，我一定要按时吃饭，少熬夜，每天坚持晨跑锻炼身体。”",
            "pinyin": "Zài yīyuàn zhù le liǎng gè xīngqī zhīhòu, Liú Míng jīntiān zhōngyú ná dào le chūyuàn tōngzhīshū. Liǎng gè xīngqī yǐqián, tā yīnwèi liánxù áoyè jiābān hé bù guīlǜ de yǐnshí tūfā chángwèiyán zhù jìn le yīyuàn. Zài Zhāng yīshēng hé hùshi men de xīxīn zhàoliào xià, tā de bìngqíng yìtiāntiān hǎozhuǎn qǐlai. Wáng Yīxuě tèdì kāichē lái dào yīyuàn jiē tā huí jiā. Zǒu zài wēnnuǎn de yángguāng xià, hūxī zhe xīnxiān qīngshuǎng de kōngqì, Liú Míng shēnyǒu gǎncù de duì Yīxuě shuō: 'Shēng le yì chǎng bìng, wǒ cái zhēnzhèng tǐhuì dào jiànkāng bǐ shénme dōu zhòngyào. Cóng jīn yǐhòu, wǒ yídìng yào ànshí chīfàn, shǎo áoyè, měitiān jiānchí chénpǎo duànliàn shēntǐ.'",
            "vietnamese": "Sau hai tuần nằm viện điều trị, hôm nay Lưu Minh cuối cùng đã nhận được giấy báo xuất viện. Hai tuần trước, vì liên tục thức đêm làm thêm giờ và ăn uống thất thường nên anh bị viêm dạ dày ruột cấp tính phải nhập viện. Dưới sự chăm sóc tận tình của bác sĩ Trương và các y tá, bệnh tình của anh đã chuyển biến tốt lên từng ngày. Vương Nhất Tuyết đặc biệt lái xe đến bệnh viện đón anh về nhà. Bước đi dưới ánh nắng ấm áp, hít thở bầu không khí trong lành tươi mới, Lưu Minh xúc động sâu sắc nói với Nhất Tuyết: 'Trải qua một trận ốm đau, anh mới thực sự thấu hiểu rằng sức khỏe quan trọng hơn bất cứ điều gì. Từ nay về sau, anh nhất định sẽ ăn cơm đúng giờ, bớt thức khuya và kiên trì chạy bộ rèn luyện sức khỏe mỗi sáng.'"
        },
        "grammarNotes": [
            "1. Cách dùng mở rộng của bổ ngữ xu hướng (1): 'Động từ + 起来' biểu thị hành động hoặc trạng thái bắt đầu và tiếp tục phát triển (Ví dụ: 好转起来 - Chuyển biến tốt lên; 聊起来 - Bắt đầu rôm rả trò chuyện).",
            "2. Từ ly hợp (离合词) (2): Các động từ kết hợp như '出院', '散步', '睡觉' có thể chèn từ chỉ số lượng hoặc thời gian vào giữa (Ví dụ: 散了半个小时步 - Đi dạo nửa tiếng đồng hồ; 睡了一个好觉 - Ngủ một giấc thật ngon).",
            "3. Bổ ngữ thời lượng (2): Biểu thị độ dài thời gian duy trì hành động (Ví dụ: 他在医院住了两个星期 - Anh ấy đã nằm viện hai tuần).",
            "4. Cấu trúc cố định '……以前 / 以后': Biểu thị mốc trước hoặc sau một khoảng thời gian/sự kiện (Ví dụ: 吃饭以前要洗手 - Rửa tay trước khi ăn; 出院以后多休息 - Nghỉ ngơi nhiều sau khi ra viện)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_8_lis_1",
                "audioText": "男：医生，我什么时候可以出院？女：各项指标都恢复正常了，你今天下午就可以办理出院。",
                "question": "男的什么时候可以出院？(Khi nào người nam có thể xuất viện?)",
                "questionPinyin": "Nán de shénme shíhou kěyǐ chūyuàn?",
                "options": ["下周一", "今天下午", "还要住两个星期"],
                "answerIndex": 1,
                "explanation": "Bác sĩ trả lời: '你今天下午就可以办理出院' (Chiều nay anh có thể làm thủ tục ra viện)."
            },
            {
                "id": "nh3_8_lis_2",
                "audioText": "女：你现在每天晚上都去公园散步吗？男：对，我每天都坚持散半个小时步。",
                "question": "男的每天散步多长时间？(Người nam đi dạo bao lâu mỗi ngày?)",
                "questionPinyin": "Nán de měitiān sànbù duō cháng shíjiān?",
                "options": ["十分钟", "半个小时", "一个小时"],
                "answerIndex": 1,
                "explanation": "Người nam nói: '每天都坚持散半个小时步' (Mỗi ngày kiên trì đi dạo nửa tiếng)."
            }
        ]
    },
    {
        "lessonNumber": 9,
        "title": "打不好没关系",
        "titleVi": "Chơi không tốt cũng không sao",
        "titlePinyin": "Dǎ bù hǎo méiguānxi",
        "vocabulary": [
            {"id": "nh3_9_1", "hanzi": "羽毛球", "pinyin": "yǔmáoqiú", "hanViet": "Vũ Mao Cầu", "meaning": "cầu lông", "partOfSpeech": "d.từ"},
            {"id": "nh3_9_2", "hanzi": "输赢", "pinyin": "shūyíng", "hanViet": "Thâu Doanh", "meaning": "thắng thua", "partOfSpeech": "d.từ"},
            {"id": "nh3_9_3", "hanzi": "紧张", "pinyin": "jǐnzhāng", "hanViet": "Khẩn Trương", "meaning": "căng thẳng, hồi hộp", "partOfSpeech": "t.từ"},
            {"id": "nh3_9_4", "hanzi": "水平", "pinyin": "shuǐpíng", "hanViet": "Thủy Bình", "meaning": "trình độ", "partOfSpeech": "d.từ"},
            {"id": "nh3_9_5", "hanzi": "提高", "pinyin": "tígāo", "hanViet": "Đề Cao", "meaning": "nâng cao, tiến bộ", "partOfSpeech": "đg.từ"},
            {"id": "nh3_9_6", "hanzi": "关键", "pinyin": "guānjiàn", "hanViet": "Quan Kiện", "meaning": "mấu chốt, điểm then chốt", "partOfSpeech": "d.từ / t.từ"},
            {"id": "nh3_9_7", "hanzi": "为了", "pinyin": "wèile", "hanViet": "Vị Liễu", "meaning": "để, vì mục đích", "partOfSpeech": "giới.từ"},
            {"id": "nh3_9_8", "hanzi": "越……越……", "pinyin": "yuè...yuè...", "hanViet": "Việt... Việt...", "meaning": "càng... càng...", "partOfSpeech": "cấu trúc liên từ"},
            {"id": "nh3_9_9", "hanzi": "鼓励", "pinyin": "gǔlì", "hanViet": "Cổ Lệ", "meaning": "cổ vũ, khích lệ", "partOfSpeech": "đg.từ"},
            {"id": "nh3_9_10", "hanzi": "平时", "pinyin": "píngshí", "hanViet": "Bình Thời", "meaning": "bình thường, ngày thường", "partOfSpeech": "d.từ thời gian"}
        ],
        "dialogues": [
            {"id": "nh3_9_d_1", "role": "李文", "chinese": "天中，我好几年没打羽毛球了，技术很差，等会儿比赛我怕拖累你。", "pinyin": "Tiānzhōng, wǒ hǎo jǐ nián méi dǎ yǔmáoqiú le, jìshù hěn chà, děnghuìr bǐsài wǒ pà tuōlěi nǐ.", "vietnamese": "Thiên Trung, mấy năm nay mình không đánh cầu lông, kỹ thuật kém lắm, lát nữa thi đấu mình sợ làm liên lụy đến bạn."},
            {"id": "nh3_9_d_2", "role": "陈天中", "chinese": "打不好没关系！我们打球是为了锻炼身体、放松心情，输赢根本不重要。", "pinyin": "Dǎ bù hǎo méiguānxi! Wǒmen dǎqiú shì wèile duànliàn shēntǐ, fàngsōng xīnqíng, shūyíng gēnběn bú zhòngyào.", "vietnamese": "Chơi không tốt cũng không sao cả! Chúng mình đánh cầu là để rèn luyện thân thể, giải tỏa tâm trạng, thắng thua hoàn toàn không quan trọng đâu."},
            {"id": "nh3_9_d_3", "role": "李文", "chinese": "听你这么说我就不紧张了。那我们赶紧入场活动一下手脚吧！", "pinyin": "Tīng nǐ zhème shuō wǒ jiù bù jǐnzhāng le. Nà wǒmen gǎnjǐn rùchǎng huódòng yíxià shǒujiǎo ba!", "vietnamese": "Nghe bạn nói thế mình hết căng thẳng rồi. Vậy chúng mình mau vào sân khởi động chân tay một chút đi!"}
        ],
        "readingPassage": {
            "title": "充满欢声笑语的球场 (Tiếng cười rộn rã trên sân cầu lông)",
            "content": "星期六下午，大学体育馆的羽毛球场上格外热闹。李文和陈天中组成了一对双打搭档，跟另外两个留学生进行友谊比赛。刚开始李文因为担心自己接不住球而非常紧张，连发了两个界外球。陈天中不仅没有抱怨，反而微笑着拍拍他的肩膀鼓励他：“别慌，越打越有感觉，看准球的方向用力挥拍就行！”渐渐地，李文找到了击球的节奏，两人配合得越来越默契，接连救起了好几个险球。大家在挥汗如雨中体会到了运动带来的无穷快乐。",
            "pinyin": "Xīngqīliù xiàwǔ, dàxué tǐyùguǎn de yǔmáoqiúchǎng shang géwài rènào. Lǐ Wén hé Chén Tiānzhōng zǔchéng le yí duì shuāngdǎ dādàng, gēn lìngwài liǎng gè liúxuéshēng jìnxíng yǒuyì bǐsài. Gāng kāishǐ Lǐ Wén yīnwèi dānxīn zìjǐ jiē bú zhù qiú ér fēicháng jǐnzhāng, lián fā le liǎng gè jièwàiqiú. Chén Tiānzhōng bùjǐn méiyǒu bàoyuàn, fǎn'ér wēixiào zhe pāipai tā de jiānbǎng gǔlì tā: 'Bié huāng, yuè dǎ yuè yǒu gǎnjué, kànzhǔn qiú de fāngxiàng yònglì huīpāi jiù xíng!' Jiànjiàn de, Lǐ Wén zhǎodào le jīqiú de jièzòu, liǎng rén pèihé de yuèláiyuè mòqì, jiēlián jiù qǐ le hǎojǐ gè xiǎnqiú. Dàjiā zài huīhàn-rúyǔ zhōng tǐhuì dào le yùndòng dàilái de wúqióng kuàilè.",
            "vietnamese": "Chiều thứ Bảy, các sân cầu lông tại nhà thi đấu thể thao trường đại học náo nhiệt vô cùng. Lý Văn và Trần Thiên Trung hợp thành một cặp đánh đôi giao lưu với hai bạn du học sinh khác. Lúc đầu Lý Văn vì sợ không đỡ nổi cầu nên rất căng thẳng, phát hỏng liên tiếp hai quả ra ngoài sân. Trần Thiên Trung không những không phàn nàn mà còn mỉm cười vỗ vai khích lệ: 'Đừng cuống, càng đánh sẽ càng có cảm giác, nhìn chuẩn hướng cầu rồi vung vợt dứt khoát là được!' Dần dần, Lý Văn đã tìm lại được nhịp đánh, hai bạn phối hợp ngày càng ăn ý, liên tiếp cứu được những quả cầu hiểm hóc. Mọi người trong lúc mồ hôi ướt đẫm đã cảm nhận sâu sắc niềm vui bất tận mà thể thao mang lại."
        },
        "grammarNotes": [
            "1. Câu ghép chỉ mục đích '为了……，……': Đặt mệnh đề mục đích ở đầu câu (Ví dụ: 为了学好汉语，他每天都听广播 - Để học tốt tiếng Trung, ngày nào anh ấy cũng nghe đài).",
            "2. Bổ ngữ khả năng (可能补语): Biểu thị có hay không có khả năng đạt được kết quả (Ví dụ: 打得好 - Đánh giỏi; 打不好 - Đánh không tốt; 听得懂 - Nghe hiểu; 听不懂 - Nghe không hiểu).",
            "3. Cấu trúc cố định '越 A 越 B': Mức độ của B biến đổi tỷ lệ thuận với mức độ của A (Ví dụ: 越打越好 - Càng đánh càng hay; 雨越下越大 - Mưa càng lúc càng to)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_9_lis_1",
                "audioText": "男：你每天下班后都跑五公里，不累吗？女：为了身体健康，累一点儿也值得！",
                "question": "女的跑步是为了什么？(Người nữ chạy bộ vì mục đích gì?)",
                "questionPinyin": "Nǚ de pǎobù shì wèile shénme?",
                "options": ["为了减肥买衣服", "为了身体健康", "为了参加比赛"],
                "answerIndex": 1,
                "explanation": "Người nữ nói: '为了身体健康，累一点儿也值得' (Vì sức khỏe dẻo dai, mệt một chút cũng rất xứng đáng)."
            },
            {
                "id": "nh3_9_lis_2",
                "audioText": "女：李文，你觉得今天这部电影怎么样？男：我觉得情节非常吸引人，真是越看越想看！",
                "question": "男的对这部电影评价如何？(Người nam đánh giá bộ phim này thế nào?)",
                "questionPinyin": "Nán de duì zhè bù diànyǐng píngjià rúhé?",
                "options": ["没意思", "太长了", "越看越想看"],
                "answerIndex": 2,
                "explanation": "Người nam thốt lên: '真是越看越想看' (Thực sự càng xem càng cuốn)."
            }
        ]
    },
    {
        "lessonNumber": 10,
        "title": "你明天再把书还给我",
        "titleVi": "Ngày mai em trả lại sách cho cô nhé",
        "titlePinyin": "Nǐ míngtiān zài bǎ shū huán gěi wǒ",
        "vocabulary": [
            {"id": "nh3_10_1", "hanzi": "还", "pinyin": "huán", "hanViet": "Hoàn", "meaning": "trả lại, hoàn trả", "partOfSpeech": "đg.từ"},
            {"id": "nh3_10_2", "hanzi": "借", "pinyin": "jiè", "hanViet": "Tá", "meaning": "mượn, vay", "partOfSpeech": "đg.từ"},
            {"id": "nh3_10_3", "hanzi": "图书馆", "pinyin": "túshūguǎn", "hanViet": "Đồ Thư Quán", "meaning": "thư viện", "partOfSpeech": "d.từ"},
            {"id": "nh3_10_4", "hanzi": "借书证", "pinyin": "jièshūzhèng", "hanViet": "Tá Thư Chứng", "meaning": "thẻ mượn sách", "partOfSpeech": "d.từ"},
            {"id": "nh3_10_5", "hanzi": "把", "pinyin": "bǎ", "hanViet": "Bả", "meaning": "đem, lấy (giới từ câu chữ 把)", "partOfSpeech": "giới.từ"},
            {"id": "nh3_10_6", "hanzi": "忘", "pinyin": "wàng", "hanViet": "Vong", "meaning": "quên", "partOfSpeech": "đg.từ"},
            {"id": "nh3_10_7", "hanzi": "办公室", "pinyin": "bàngōngshì", "hanViet": "Biện Công Thất", "meaning": "văn phòng làm việc", "partOfSpeech": "d.từ"},
            {"id": "nh3_10_8", "hanzi": "笔记", "pinyin": "bǐjì", "hanViet": "Bút Ký", "meaning": "ghi chép, vở ghi", "partOfSpeech": "d.từ"},
            {"id": "nh3_10_9", "hanzi": "复习", "pinyin": "fùxí", "hanViet": "Phục Tập", "meaning": "ôn tập", "partOfSpeech": "đg.từ"},
            {"id": "nh3_10_10", "hanzi": "按期", "pinyin": "ànqī", "hanViet": "Án Kỳ", "meaning": "đúng kỳ hạn", "partOfSpeech": "phó.từ"}
        ],
        "dialogues": [
            {"id": "nh3_10_d_1", "role": "白家月", "chinese": "王老师，真不好意思，您上次借给我的那本《现代汉语词汇学》，我今天忘带了。", "pinyin": "Wáng lǎoshī, zhēn bù hǎoyìsi, nín shàng cì jiè gěi wǒ de nà běn 《Xiàndài Hànyǔ Cíhuìxué》, wǒ jīntiān wàng dài le.", "vietnamese": "Cô Vương ơi, thật ngại quá ạ, cuốn sách 'Từ vựng học tiếng Hán hiện đại' cô cho em mượn đợt trước, hôm nay em quên mang theo rồi."},
            {"id": "nh3_10_d_2", "role": "王老师", "chinese": "没关系，我不急着用。你明天上课的时候再把书还给我吧。", "pinyin": "Méiguānxi, wǒ bù jí zhe yòng. Nǐ míngtiān shàngkè de shíhou zài bǎ shū huán gěi wǒ ba.", "vietnamese": "Không sao đâu, cô chưa cần dùng gấp. Ngày mai lúc đi học em mang trả lại sách cho cô cũng được nhé."},
            {"id": "nh3_10_d_3", "role": "白家月", "chinese": "好的王老师，我今晚一定把书放进书包里，明天一早送到您办公室！", "pinyin": "Hǎo de Wáng lǎoshī, wǒ jīnwǎn yídìng bǎ shū fàng jìn shūbāo lǐ, míngtiān yì zǎo sòng dào nín bàngōngshì!", "vietnamese": "Vâng ạ thưa cô, tối nay em nhất định sẽ cất sách vào cặp, sáng sớm mai em mang đến văn phòng gửi cô ạ!"}
        ],
        "readingPassage": {
            "title": "图书馆借阅与学术探索 (Mượn sách thư viện và niềm đam mê học thuật)",
            "content": "北京大学图书馆藏书丰富，是留学生们最喜欢去的知识宝库。为了写好学期论文，白家月在图书馆的文献检索机上查找了好几本珍贵的语言学专著。根据借阅规则，每位同学凭校园卡一次可以借阅十本书，借期为一个月。王老师也慷慨地把自己个人珍藏的研究资料借给了家月参考。在老师和同学们的悉心指导下，家月把书中的重点理论认真做成了笔记。学术研究让她体会到了严谨求实的治学精神，也让她更加热爱博大精深的中文世界。",
            "pinyin": "Běijīng Dàxué túshūguǎn cángshū fēngfù, shì liúxuéshēng men zuì xǐhuan qù de zhīshi bǎokù. Wèile xiě hǎo xuéqī lùnwén, Bái Jiāyuè zài túshūguǎn de wénxiàn jiǎnsuǒjī shang zhǎocháo le hǎojǐ běn zhēnguì de yǔyánxué zhuānzhù. Gēnjù jièyuè guīzé, měi wèi tóngxué píng xiàoyuánkǎ yí cì kěyǐ jièyuè shí běn shū, jièqī wéi yí gè yuè. Wáng lǎoshī yě kāngkǎi de bǎ zìjǐ gèrén zhēncáng de yánjiū zīliào jiè gěi le Jiāyuè cānkǎo. Zài lǎoshī hé tóngxué men de xīxīn zhǐdǎo xià, Jiāyuè bǎ shū zhōng de zhòngdiǎn lǐlùn rènzhēn zuò chéng le bǐjì. Xuéshù yánjiū ràng tā tǐhuì dào le yánjǐn-qiúshí de zhìxué jīngshén, yě ràng tā gèngjiā rè'ài bódà-jīngshēn de Zhōngwén shìjiè.",
            "vietnamese": "Thư viện Đại học Bắc Kinh tàng trữ sách vô cùng phong phú, là kho tàng tri thức mà các bạn du học sinh thích đến nhất. Để hoàn thành tốt bài luận văn học kỳ, Bạch Gia Nguyệt đã tra cứu được nhiều chuyên khảo ngôn ngữ học quý giá trên máy tra cứu tài liệu. Theo quy định mượn trả, mỗi sinh viên dùng thẻ sinh viên có thể mượn tối đa 10 cuốn sách trong thời hạn một tháng. Cô giáo Vương cũng hào phóng cho Gia Nguyệt mượn những tài liệu nghiên cứu cá nhân quý báu để tham khảo. Dưới sự hướng dẫn tận tình của cô giáo và bạn bè, Gia Nguyệt đã chắt lọc các luận điểm trọng yếu thành những trang ghi chép tỉ mỉ. Việc nghiên cứu học thuật giúp cô cảm nhận được tinh thần học thuật nghiêm cẩn, đồng thời càng thêm say mê thế giới tiếng Trung uyên thâm quảng đại."
        },
        "grammarNotes": [
            "1. Câu chữ '把' (1): Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (Biểu thị sự xử lý hoặc tác động làm thay đổi vị trí, trạng thái của tân ngữ) (Ví dụ: 你把书还给我 - Em mang sách trả lại cho cô; 我把作业做完了 - Tôi đã làm xong bài tập về nhà rồi).",
            "2. Cấu trúc cố định '在……上 / 中 / 下': Biểu thị phương diện, quá trình hoặc điều kiện bối cảnh (Ví dụ: 在老师的帮助下 - Dưới sự giúp đỡ của cô giáo; 在学习中 - Trong quá trình học tập).",
            "3. Câu chữ '把' (2): Tân ngữ của câu chữ '把' phải là đối tượng xác định, đã được cả người nói và người nghe biết rõ (Ví dụ: 请把那扇窗户关上 - Làm ơn hãy đóng cánh cửa sổ đó lại)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_10_lis_1",
                "audioText": "女：王老师，您借给我的书，我今天放桌上忘记装包里了。男：没关系，你明天上课再把书带给我就行。",
                "question": "男的让女的什么时候还书？(Người nam bảo người nữ khi nào trả sách?)",
                "questionPinyin": "Nán de ràng nǚ de shénme shíhou huán shū?",
                "options": ["今天下午", "明天上课时", "下个星期"],
                "answerIndex": 1,
                "explanation": "Người nam nói: '你明天上课再把书带给我就行' (Ngày mai đi học em mang trả cho thầy là được)."
            },
            {
                "id": "nh3_10_lis_2",
                "audioText": "男：请大家在离开教室前，把垃圾随手扔进垃圾桶里。女：好的，我们一定保持教室清洁。",
                "question": "男的提出了什么要求？(Người nam đưa ra yêu cầu gì?)",
                "questionPinyin": "Nán de tíchū le shénme yāoqiú?",
                "options": ["把垃圾扔进垃圾桶", "把门锁上", "擦黑板"],
                "answerIndex": 0,
                "explanation": "Yêu cầu là: '把垃圾随手扔进垃圾桶里' (Tiện tay vứt rác vào thùng rác)."
            }
        ]
    },
    {
        "lessonNumber": 11,
        "title": "看来我没办法解决这个问题",
        "titleVi": "Xem ra em không thể giải quyết vấn đề này",
        "titlePinyin": "Kànlai wǒ méi bànfǎ jiějué zhè ge wèntí",
        "vocabulary": [
            {"id": "nh3_11_1", "hanzi": "解决", "pinyin": "jiějué", "hanViet": "Giải Quyết", "meaning": "giải quyết", "partOfSpeech": "đg.từ"},
            {"id": "nh3_11_2", "hanzi": "问题", "pinyin": "wèntí", "hanViet": "Vấn Đề", "meaning": "vấn đề, câu hỏi", "partOfSpeech": "d.từ"},
            {"id": "nh3_11_3", "hanzi": "看来", "pinyin": "kànlai", "hanViet": "Khán Lai", "meaning": "xem ra, nhìn chung", "partOfSpeech": "phó.từ / cụm từ"},
            {"id": "nh3_11_4", "hanzi": "办法", "pinyin": "bànfǎ", "hanViet": "Biện Pháp", "meaning": "biện pháp, cách làm", "partOfSpeech": "d.từ"},
            {"id": "nh3_11_5", "hanzi": "或者", "pinyin": "huòzhě", "hanViet": "Hoặc Giả", "meaning": "hoặc là (dùng trong câu trần thuật)", "partOfSpeech": "liên.từ"},
            {"id": "nh3_11_6", "hanzi": "修理", "pinyin": "xiūlǐ", "hanViet": "Tu Lý", "meaning": "sửa chữa", "partOfSpeech": "đg.từ"},
            {"id": "nh3_11_7", "hanzi": "重启", "pinyin": "chóngqǐ", "hanViet": "Trùng Khởi", "meaning": "khởi động lại máy", "partOfSpeech": "đg.từ"},
            {"id": "nh3_11_8", "hanzi": "复杂", "pinyin": "fùzá", "hanViet": "Phức Tạp", "meaning": "phức tạp", "partOfSpeech": "t.từ"},
            {"id": "nh3_11_9", "hanzi": "师傅", "pinyin": "shīfu", "hanViet": "Sư Phụ", "meaning": "thợ, bác tài, chú kỹ thuật", "partOfSpeech": "d.từ"},
            {"id": "nh3_11_10", "hanzi": "对……来说", "pinyin": "duì...láishuō", "hanViet": "Đối... Lai Thuyết", "meaning": "đối với... mà nói", "partOfSpeech": "cấu trúc giới từ"}
        ],
        "dialogues": [
            {"id": "nh3_11_d_1", "role": "李文", "chinese": "我的笔记本电脑屏幕突然黑了，怎么按开机键都没反应。看来我没办法自己解决这个问题了。", "pinyin": "Wǒ de bǐjìběn diànnǎo píngmù tūrán hēi le, zěnme àn kāijījiàn dōu méi fǎnyìng. Kànlai wǒ méi bànfǎ zìjǐ jiějué zhè ge wèntí le.", "vietnamese": "Màn hình laptop của mình bỗng đen thui, ấn nút nguồn thế nào cũng không phản hồi. Xem ra mình không có cách nào tự giải quyết vấn đề này rồi."},
            {"id": "nh3_11_d_2", "role": "陈天中", "chinese": "别着急，对我们学文科的学生来说，修电脑确实太难了。学校南门外有一家专业的电脑维修店，我们或者下午送过去，或者明天上午去修。", "pinyin": "Bié zháojí, duì wǒmen xué wénkē de xuésheng láishuō, xiū diànnǎo quèshí tài nán le. Xuéxiào nánmén wài yǒu yì jiā zhuānyè de diànnǎo wéixiūdiàn, wǒmen huòzhě xiàwǔ sòng guòqù, huòzhě míngtiān shàngwǔ qù xiū.", "vietnamese": "Đừng lo, đối với sinh viên chuyên ngành xã hội như tụi mình thì sửa máy tính đúng là khó quá. Ngoài cổng Nam trường có tiệm sửa máy tính chuyên nghiệp, chúng mình hoặc là chiều nay mang qua hoặc sáng mai đi sửa nhé."},
            {"id": "nh3_11_d_3", "role": "李文", "chinese": "那我还是下午去吧，先把里面的期末论文备份一下，免得耽误交作业。", "pinyin": "Nà wǒ háishi xiàwǔ qù ba, xiān bǎ lǐmiàn de qīmò lùnwén bèifèn yíxià, miǎnde dānwu jiāo zuòyè.", "vietnamese": "Thế mình vẫn nên đi vào chiều nay, trước tiên sao lưu bài luận cuối kỳ bên trong đề phòng trễ hạn nộp bài."}
        ],
        "readingPassage": {
            "title": "数字生活中的技术小插曲 (Khúc mắc công nghệ nhỏ trong nhịp sống số)",
            "content": "现代大学生的学习生活几乎一刻也离不开电脑和智能手机。李文的笔记本电脑在做演示文稿时突然蓝屏死机，尝试了多次强制关机和重启都无济于事。看来硬件出现了故障。陈天中热心地陪李文来到了校外维修点。维修师傅用专业测试仪器检测后发现，只是内部散热风扇积灰过多导致处理器过热保护。师傅熟练地拆开后盖，清理了灰尘并更换了散热硅脂，不到二十分钟电脑就完好如初了。师傅微笑着对李文说：“定期清理灰尘很重要，这样电脑性能才能持久稳定。”",
            "pinyin": "Xiàndài dàxuéshēng de xuéxí shēnghuó jīhū yíkè yě lí bù kāi diànnǎo hé zhìnéng shǒujī. Lǐ Wén de bǐjìběn diànnǎo zài zuò yǎnshì wéngǎo shí tūrán lánpíng sǐjī, chángshì le duō cì qiángzhì guānjī hé chóngqǐ dōu wújì-yúshì. Kànlai yìngjiàn chūxiàn le gùzhàng. Chén Tiānzhōng rèxīn de péi Lǐ Wén lái dào le xiàowài wéixiūdiǎn. Wéixiū shīfu yòng zhuānyè cèshì yíqì jiǎncè hòu fāxiàn, zhǐshì nèibù sànrè fēngshàn jīhuī guò duō dǎozhì chǔlǐqì guòrè bǎohù. Shīfu shúliàn de chāi kāi hòugài, qīnglǐ le huīchén bìng gēnghuàn le sànrè guīzhī, bú dào èrshí fēnzhōng diànnǎo jiù wánhǎo-rúchū le. Shīfu wēixiào zhe duì Lǐ Wén shuō: 'Dìngqī qīnglǐ huīchén hěn zhòngyào, zhèyàng diànnǎo xìngnéng cái néng chíchǐ wěndìng.'",
            "vietnamese": "Cuộc sống học tập của sinh viên đại học ngày nay hầu như một phút cũng chẳng thể tách rời máy tính và điện thoại thông minh. Laptop của Lý Văn trong lúc đang làm bài thuyết trình bỗng dính màn hình xanh treo cứng, thử nhiều lần tắt máy ép buộc và khởi động lại đều vô hiệu. Xem ra phần cứng đã xảy ra sự cố. Trần Thiên Trung nhiệt tình cùng Lý Văn đến cửa hàng sửa chữa ngoài khuôn viên trường. Bác thợ sửa chữa dùng máy đo chuyên dụng kiểm tra và phát hiện chỉ do quạt tản nhiệt bên trong bám bụi quá nhiều khiến chip xử lý ngắt nguồn bảo vệ. Bác thợ thuần thục tháo nắp lưng, vệ sinh sạch bụi bẩn và thay keo tản nhiệt mới, chưa đầy hai mươi phút chiếc máy tính đã chạy êm như lúc mới mua. Bác mỉm cười căn dặn Lý Văn: 'Vệ sinh máy định kỳ rất quan trọng, như vậy hiệu năng máy tính mới có thể bền bỉ và ổn định lâu dài.'"
        },
        "grammarNotes": [
            "1. Phân biệt liên từ '还是' và '或者': Cả hai đều biểu thị sự lựa chọn 'hoặc là'; '还是' dùng trong câu nghi vấn lựa chọn, '或者' dùng trong câu trần thuật khẳng định (Ví dụ: 你喝茶还是咖啡？ - Bạn uống trà hay cà phê?; 我想喝茶或者咖啡 - Tôi muốn uống trà hoặc cà phê).",
            "2. Cụm từ cố định '看来': Đặt ở đầu câu biểu thị sự phỏng đoán dựa trên quan sát tình hình thực tế (Ví dụ: 看来明天要下雨 - Xem ra ngày mai trời sẽ mưa đấy).",
            "3. Cấu trúc cố định '对……来说': Đứng đầu câu để nêu rõ lập trường, góc nhìn đánh giá của đối tượng được nhắc đến (Ví dụ: 对留学生来说，学好汉字很重要 - Đối với du học sinh mà nói, học tốt chữ Hán là điều vô cùng quan trọng)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_11_lis_1",
                "audioText": "男：我的手机充不上电了，你帮我看看是怎么回事？女：看来充电接口坏了，我们下午拿去专卖店修吧。",
                "question": "手机出了什么问题？(Điện thoại xảy ra vấn đề gì?)",
                "questionPinyin": "Shǒujī chū le shénme wèntí?",
                "options": ["屏幕碎了", "充不上电", "丢了"],
                "answerIndex": 1,
                "explanation": "Đoạn thoại nêu rõ: '我的手机充不上电了' (Điện thoại không sạc được điện vào)."
            },
            {
                "id": "nh3_11_lis_2",
                "audioText": "女：你周末打算做什么？男：或者在宿舍复习中文，或者跟天中去爬香山。",
                "question": "男的周末有什么打算？(Người nam cuối tuần có dự định gì?)",
                "questionPinyin": "Nán de zhōumò yǒu shénme dǎsuàn?",
                "options": ["只在宿舍睡觉", "复习中文或者去爬香山", "去火车站接朋友"],
                "answerIndex": 1,
                "explanation": "Người nam trả lời dùng '或者': '或者在宿舍复习中文，或者跟天中去爬香山'."
            }
        ]
    },
    {
        "lessonNumber": 12,
        "title": "这个季节天气变化很快",
        "titleVi": "Thời tiết thay đổi rất nhanh vào mùa này",
        "titlePinyin": "Zhè ge jìjié tiānqì biànhuà hěn kuài",
        "vocabulary": [
            {"id": "nh3_12_1", "hanzi": "季节", "pinyin": "jìjié", "hanViet": "Quý Tiết", "meaning": "mùa trong năm", "partOfSpeech": "d.từ"},
            {"id": "nh3_12_2", "hanzi": "变化", "pinyin": "biànhuà", "hanViet": "Biến Hóa", "meaning": "thay đổi, biến đổi", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_12_3", "hanzi": "刮风", "pinyin": "guā fēng", "hanViet": "Quát Phong", "meaning": "nổi gió, gió thổi", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_12_4", "hanzi": "降温", "pinyin": "jiàngwēn", "hanViet": "Hàng Ôn", "meaning": "hạ nhiệt, giảm nhiệt độ", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_12_5", "hanzi": "外套", "pinyin": "wàitào", "hanViet": "Ngoại Sáo", "meaning": "áo khoác ngoài", "partOfSpeech": "d.từ"},
            {"id": "nh3_12_6", "hanzi": "突然", "pinyin": "tūrán", "hanViet": "Đột Nhiên", "meaning": "đột nhiên", "partOfSpeech": "phó.từ / t.từ"},
            {"id": "nh3_12_7", "hanzi": "感冒", "pinyin": "gǎnmào", "hanViet": "Cảm Mạo", "meaning": "bị cảm, cảm cúm", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_12_8", "hanzi": "随身", "pinyin": "suíshēn", "hanViet": "Tùy Thân", "meaning": "mang theo bên mình", "partOfSpeech": "phó.từ"},
            {"id": "nh3_12_9", "hanzi": "伞", "pinyin": "sǎn", "hanViet": "Tản", "meaning": "chiếc ô, chiếc dù", "partOfSpeech": "d.từ"},
            {"id": "nh3_12_10", "hanzi": "照顾", "pinyin": "zhàogù", "hanViet": "Chiếu Cố", "meaning": "chăm sóc, săn sóc", "partOfSpeech": "đg.từ"}
        ],
        "dialogues": [
            {"id": "nh3_12_d_1", "role": "白家月", "chinese": "安妮，今天早晨出门时还是晴空万里，怎么现在突然刮起大风，冷起来了？", "pinyin": "Ānnī, jīntiān zǎochén chūmén shí háishi qíngkōng-wànlǐ, zěnme xiànzài tūrán guā qǐ dàfēng, lěng qǐlai le?", "vietnamese": "Annie ơi, sáng sớm nay lúc ra khỏi nhà trời vẫn còn trong xanh nắng ấm, sao lúc này bỗng dưng nổi gió to lạnh buốt lên thế nhỉ?"},
            {"id": "nh3_12_d_2", "role": "安妮", "chinese": "北方秋冬交替的季节就是这样，天气变化特别快。天气预报说今天下午气温一下子要降八度呢！", "pinyin": "Běifāng qiūdōng jiāotì de jìjié jiù shì zhèyàng, tiānqì biànhuà tèbié kuài. Tiānqì yùbào shuō jīntiān xiàwǔ qìwēn yíxiàzi yào jiàng bā dù ne!", "vietnamese": "Mùa giao mùa thu đông ở miền Bắc là vậy đó, thời tiết thay đổi nhanh ghê gớm. Dự báo thời tiết nói chiều nay nhiệt độ giảm một mạch tới 8 độ lận đấy!"},
            {"id": "nh3_12_d_3", "role": "白家月", "chinese": "幸好我包里随身带了一件厚外套，快穿上吧，千万别感冒了。", "pinyin": "Xìnghǎo wǒ bāolǐ suíshēn dài le yí jiàn hòu wàitào, kuài chuān shang ba, qiānwàn bié gǎnmào le.", "vietnamese": "May mắn trong túi mình có mang sẵn chiếc áo khoác dày, mau khoác vào đi, kẻo lại bị cảm lạnh bây giờ."}
        ],
        "readingPassage": {
            "title": "色彩斑斓与变幻莫测的秋天 (Mùa thu rực rỡ và những biến đổi khó lường)",
            "content": "北京的深秋是一年中最美丽的季节，银杏金黄，枫叶如火。然而这也是气温变化最剧烈的时候。早晨阳光明媚，温度宜人，到了傍晚冷空气一旦南下，常常呼呼地刮起北风，气温骤降十多度。初来乍到的南方留学生李文一开始很不适应，刚冷下来就着凉打喷嚏了。白家月细心地给他煮了一碗热气腾腾的生姜红糖茶，并提醒他出门前一定要查看手机上的天气预报。学会了随着天气添减衣物，大家更加懂得如何在异国他乡照顾好自己的身体。",
            "pinyin": "Běijīng de shēnqiū shì yì nián zhōng zuì měilì de jìjié, yínxìng jīnhuáng, fēngyè rú huǒ. Rán'ér zhè yě shì qìwēn biànhuà zuì jùliè de shíhou. Zǎochén yángguāng míngmèi, wēndù yírén, dào le bàngwǎn lěng kōngqì yídàn nánxià, chángcháng hūhū de guā qǐ běifēng, qìwēn zhòujiàng shí duō dù. Chūlái-zhàdào de nánfāng liúxuéshēng Lǐ Wén yì kāishǐ hěn bù shìyìng, gāng lěng xiàlai jiù zháoliáng dǎ pēntì le. Bái Jiāyuè xìnxīn de gěi tā zhǔ le yì wǎn rèqì-téngténg de shēngjiāng hóngtángchá, bìng tíxǐng tā chūmén qián yídìng yào chákàn shǒujī shang de tiānqì yùbào. Xuéhuì le suízhe tiānqì tiān jiǎn yīwù, dàjiā gèngjiā dǒngde rúhé zài yìguó-tāxiāng zhàogù hǎo zìjǐ de shēntǐ.",
            "vietnamese": "Cuối thu ở Bắc Kinh là mùa đẹp nhất trong năm, lá ngân hạnh vàng óng ả, lá phong đỏ tựa ráng chiều. Tuy nhiên đây cũng là thời điểm nhiệt độ dao động khôn lường nhất. Buổi sáng nắng ấm chan hòa, nhiệt độ dễ chịu, nhưng đến chập tối khi không khí lạnh tràn về, gió bấc thường rít từng hồi khiến nhiệt độ giảm sâu hơn mười độ. Chàng du học sinh miền Nam Lý Văn mới tới chưa kịp thích nghi, trời vừa trở lạnh đã bị cảm sụt sịt. Bạch Gia Nguyệt chu đáo nấu cho cậu một bát trà gừng đường đỏ nóng hổi và dặn cậu trước khi ra ngoài nhất định phải xem ứng dụng dự báo thời tiết. Biết cách thêm bớt quần áo theo diễn biến thời tiết, mọi người càng biết cách chăm sóc bản thân tốt hơn khi sống xa gia đình."
        },
        "grammarNotes": [
            "1. Cách dùng mở rộng của bổ ngữ xu hướng (2): 'Tính từ + 起来' biểu thị trạng thái bắt đầu chuyển biến (Ví dụ: 天气冷起来了 - Trời bắt đầu trở lạnh rồi; 热闹起来 - Bắt đầu nhộn nhịp hẳn lên).",
            "2. Phó từ chỉ phạm vi '就': Nhấn mạnh phạm vi nhỏ hẹp hoặc khẳng định chắc chắn (Ví dụ: 他就买了一本书 - Cậu ấy chỉ mua đúng một quyển sách; 他就是我们要找的人 - Anh ấy chính là người chúng ta cần tìm).",
            "3. Cách dùng mở rộng của bổ ngữ xu hướng (3): 'Động từ + 下去' biểu thị hành động đang diễn ra tiếp tục duy trì (Ví dụ: 坚持学下去 - Kiên trì học tiếp tục)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_12_lis_1",
                "audioText": "男：今天下午刮大风，气温降了好几度。女：外面冷起来了，你出门时把厚大衣穿上吧。",
                "question": "女的让男的做什么？(Người nữ bảo người nam làm gì?)",
                "questionPinyin": "Nǚ de ràng nán de zuò shénme?",
                "options": ["穿上厚大衣", "打开窗户", "不要出门"],
                "answerIndex": 0,
                "explanation": "Người nữ khuyên: '你出门时把厚大衣穿上吧' (Lúc ra ngoài anh hãy mặc áo khoác dày vào nhé)."
            },
            {
                "id": "nh3_12_lis_2",
                "audioText": "女：听说明天有阵雨，我们还要去香山吗？男：如果下雨的话，我们就在家看书吧。",
                "question": "如果明天下雨，他们打算做什么？(Nếu ngày mai mưa họ định làm gì?)",
                "questionPinyin": "Rúguǒ míngtiān xià yǔ, tāmen dǎsuàn zuò shénme?",
                "options": ["去公园散步", "在家里看书", "去爬香山"],
                "answerIndex": 1,
                "explanation": "Người nam trả lời: '如果下雨的话，我们就在家看书吧'."
            }
        ]
    }
]

print(f"Loaded Lessons 7 to 12 ({len(lessons_7_to_12)} lessons)")
