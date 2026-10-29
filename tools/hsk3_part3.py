# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

lessons_13_to_18 = [
    {
        "lessonNumber": 13,
        "title": "我的新邻居来自英国",
        "titleVi": "Hàng xóm mới của tôi đến từ Vương quốc Anh",
        "titlePinyin": "Wǒ de xīn línjū láizì Yīngguó",
        "vocabulary": [
            {"id": "nh3_13_1", "hanzi": "邻居", "pinyin": "línjū", "hanViet": "Lân Cư", "meaning": "hàng xóm, người láng giềng", "partOfSpeech": "d.từ"},
            {"id": "nh3_13_2", "hanzi": "来自", "pinyin": "láizì", "hanViet": "Lai Tự", "meaning": "đến từ, xuất phát từ", "partOfSpeech": "đg.từ"},
            {"id": "nh3_13_3", "hanzi": "留学", "pinyin": "liúxué", "hanViet": "Lưu Học", "meaning": "du học", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_13_4", "hanzi": "互相", "pinyin": "hùxiāng", "hanViet": "Hỗ Tương", "meaning": "lẫn nhau, cùng nhau", "partOfSpeech": "phó.từ"},
            {"id": "nh3_13_5", "hanzi": "交流", "pinyin": "jiāoliú", "hanViet": "Giao Lưu", "meaning": "giao lưu, trao đổi", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_13_6", "hanzi": "习惯", "pinyin": "xíguàn", "hanViet": "Tập Quán", "meaning": "thói quen, quen với", "partOfSpeech": "d.từ / đg.từ"},
            {"id": "nh3_13_7", "hanzi": "一边……一边……", "pinyin": "yìbiān...yìbiān...", "hanViet": "Nhất Biên... Nhất Biên...", "meaning": "vừa... vừa...", "partOfSpeech": "cấu trúc liên từ"},
            {"id": "nh3_13_8", "hanzi": "介绍", "pinyin": "jièshào", "hanViet": "Giới Thiệu", "meaning": "giới thiệu", "partOfSpeech": "đg.từ"},
            {"id": "nh3_13_9", "hanzi": "茶道", "pinyin": "chádào", "hanViet": "Trà Đạo", "meaning": "nghệ thuật trà đạo", "partOfSpeech": "d.từ"},
            {"id": "nh3_13_10", "hanzi": "热情", "pinyin": "rèqíng", "hanViet": "Nhiệt Tình", "meaning": "nhiệt tình", "partOfSpeech": "t.từ"}
        ],
        "dialogues": [
            {"id": "nh3_13_d_1", "role": "白家月", "chinese": "你好！我是住在对门402室的白家月，欢迎你搬到这个小区！", "pinyin": "Nǐ hǎo! Wǒ shì zhù zài duìmén sì-líng-èr shì de Bái Jiāyuè, huānyíng nǐ bān dào zhè ge xiǎoqū!", "vietnamese": "Chào bạn! Mình là Bạch Gia Nguyệt ở phòng 402 đối diện, chào mừng bạn chuyển đến khu chung cư này!"},
            {"id": "nh3_13_d_2", "role": "Mark", "chinese": "你好家月！我叫Mark，来自英国伦敦，今年刚到中文系留学。", "pinyin": "Nǐ hǎo Jiāyuè! Wǒ jiào Mark, láizì Yīngguó Lúndūn, jīnnián gāng dào zhōngwénxì liúxué.", "vietnamese": "Chào Gia Nguyệt! Mình là Mark, đến từ London, Vương quốc Anh, năm nay mới sang du học tại khoa tiếng Trung."},
            {"id": "nh3_13_d_3", "role": "白家月", "chinese": "太好了！以后我们可以互相学习，一边喝茶一边练习口语。", "pinyin": "Tài hǎo le! Yǐhòu wǒmen kěyǐ hùxiāng xuéxí, yìbiān hē chá yìbiān liànxí kǒuyǔ.", "vietnamese": "Tuyệt quá! Sau này chúng mình có thể cùng nhau học tập, vừa uống trà vừa luyện nói chuyện nhé."}
        ],
        "readingPassage": {
            "title": "公寓走廊里的跨文化友谊 (Tình bạn đa văn hóa nơi hành lang chung cư)",
            "content": "在国际留学生公寓里，白家月结识了新搬来的英国邻居Mark。Mark性格开朗幽默，酷爱中国功夫和中国历史。虽然他的汉语还不够熟练，但他非常乐于开口交流。周末下午，Mark把从英国带来的红茶和黄油饼干送给家月品尝，家月也把中国绿茶和茉莉花茶介绍给他。两个人坐在小阳台上，一边品尝不同风味的茶点，一边交流彼此国家的风土人情。语言和文化的碰撞没有带来隔阂，反而拉近了彼此心灵的距离。",
            "pinyin": "Zài guójì liúxuéshēng gōngyù lǐ, Bái Jiāyuè jiéshí le xīn bān lái de Yīngguó línjū Mark. Mark xìnggé kāilǎng yōumò, kù'ài Zhōngguó gōngfu hé Zhōngguó lìshǐ. Suīrán tā de Hànyǔ hái bú gòu shúliàn, dàn tā fēicháng lèyú kāikǒu jiāoliú. Zhōumò xiàwǔ, Mark bǎ cóng Yīngguó dài lái de hóngchá hé huángyóu bǐnggān sòng gěi Jiāyuè pǐncháng, Jiāyuè yě bǎ Zhōngguó lǜchá hé mòlìhuāchá jièshào gěi tā. Liǎng gè rén zuò zài xiǎo yángtái shang, yìbiān pǐncháng bùtóng fēngwèi de chādiǎn, yìbiān jiāoliú bǐcǐ guójiā de fēngtǔ-rénqíng. Yǔyán hé wénhuà de pèngzhuàng méiyǒu dàilái géhé, fǎn'ér lājìn le bǐcǐ xīnlíng de jùlí.",
            "vietnamese": "Tại khu căn hộ du học sinh quốc tế, Bạch Gia Nguyệt đã làm quen với người bạn hàng xóm người Anh mới chuyển đến tên là Mark. Mark tính tình cởi mở hóm hỉnh, say mê võ thuật và lịch sử Trung Hoa. Dù tiếng Trung của anh chưa thật lưu loát nhưng anh rất thích mở lời giao tiếp. Chiều cuối tuần, Mark mang hồng trà và bánh quy bơ mang từ nước Anh sang biếu Gia Nguyệt nếm thử, Gia Nguyệt cũng giới thiệu trà xanh và trà hoa nhài Trung Quốc cho anh. Hai bạn ngồi bên ban công nhỏ, vừa nhâm nhi các món trà bánh mang phong vị đặc trưng khác nhau, vừa hào hứng trao đổi về phong tục tập quán quê hương mình. Sự va chạm ngôn ngữ và văn hóa không tạo nên khoảng cách, mà trái lại còn kéo gần hơn sự thấu hiểu giữa những tâm hồn trẻ tuổi."
        },
        "grammarNotes": [
            "1. Câu ghép giả thiết '……的话，就……': '……的话' đặt ở cuối vế câu biểu thị điều kiện giả định (Ví dụ: 你有空的话，就来我家玩吧 - Nếu bạn rảnh thì ghé nhà mình chơi nhé).",
            "2. Câu chữ '把' (4): Dùng '把' kết hợp với kết quả dịch chuyển hoặc tặng cho (Ví dụ: 他把红茶送给了邻居 - Anh ấy đã tặng hồng trà cho người hàng xóm; 把书放在桌子上 - Đặt sách lên bàn).",
            "3. Câu ghép đẳng lập '一边……，一边……': Diễn tả hai hành động do cùng một chủ thể thực hiện đồng thời cùng một lúc (Ví dụ: 一边喝茶一边聊天儿 - Vừa uống trà vừa chuyện trò; 一边听音乐一边写作业 - Vừa nghe nhạc vừa làm bài tập)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_13_lis_1",
                "audioText": "男：新搬来的邻居是哪国人？女：他是来自英国伦敦的留学生，叫Mark。",
                "question": "新邻居来自哪里？(Người hàng xóm mới đến từ đâu?)",
                "questionPinyin": "Xīn línjū láizì nǎlǐ?",
                "options": ["美国纽约", "英国伦敦", "法国巴黎"],
                "answerIndex": 1,
                "explanation": "Người nữ trả lời: '来自英国伦敦' (Đến từ London, Vương quốc Anh)."
            },
            {
                "id": "nh3_13_lis_2",
                "audioText": "女：今天下午我们做什么？男：我们一边喝中国绿茶，一边练习汉语对话吧。",
                "question": "男的提议做什么？(Người nam đề nghị làm gì?)",
                "questionPinyin": "Nán de tíyì zuò shénme?",
                "options": ["出去踢足球", "一边喝茶一边练口语", "去电影院看电影"],
                "answerIndex": 1,
                "explanation": "Người nam đề nghị: '一边喝中国绿茶，一边练习汉语对话'."
            }
        ]
    },
    {
        "lessonNumber": 14,
        "title": "这本书被别人借走了",
        "titleVi": "Quyển sách này đã bị người khác mượn rồi",
        "titlePinyin": "Zhè běn shū bèi biérén jiè zǒu le",
        "vocabulary": [
            {"id": "nh3_14_1", "hanzi": "被", "pinyin": "bèi", "hanViet": "Bị", "meaning": "bị, được (giới từ câu bị động)", "partOfSpeech": "giới.từ"},
            {"id": "nh3_14_2", "hanzi": "借走", "pinyin": "jiè zǒu", "hanViet": "Tá Tẩu", "meaning": "mượn đi mất", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_14_3", "hanzi": "书架", "pinyin": "shūjià", "hanViet": "Thư Giá", "meaning": "giá sách, kệ sách", "partOfSpeech": "d.từ"},
            {"id": "nh3_14_4", "hanzi": "预约", "pinyin": "yùyuē", "hanViet": "Dự Ước", "meaning": "đặt trước, hẹn trước", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_14_5", "hanzi": "先", "pinyin": "xiān", "hanViet": "Tiên", "meaning": "trước tiên", "partOfSpeech": "phó.từ"},
            {"id": "nh3_14_6", "hanzi": "然后", "pinyin": "ránhòu", "hanViet": "Nhiên Hậu", "meaning": "sau đó, rồi thì", "partOfSpeech": "liên.từ"},
            {"id": "nh3_14_7", "hanzi": "提醒", "pinyin": "tíxǐng", "hanViet": "Đề Tỉnh", "meaning": "nhắc nhở", "partOfSpeech": "đg.từ"},
            {"id": "nh3_14_8", "hanzi": "短信", "pinyin": "duǎnxìn", "hanViet": "Đoản Tín", "meaning": "tin nhắn điện thoại", "partOfSpeech": "d.từ"},
            {"id": "nh3_14_9", "hanzi": "管理员", "pinyin": "guǎnlǐyuán", "hanViet": "Quản Lý Viên", "meaning": "người quản lý", "partOfSpeech": "d.từ"},
            {"id": "nh3_14_10", "hanzi": "着急", "pinyin": "zháojí", "hanViet": "Trước Cấp", "meaning": "sốt ruột, lo lắng", "partOfSpeech": "t.từ"}
        ],
        "dialogues": [
            {"id": "nh3_14_d_1", "role": "白家月", "chinese": "老师您好，我在三楼语言学书架上找了半天，怎么没找到这本《中国古代寓言故事》？", "pinyin": "Lǎoshī nín hǎo, wǒ zài sān lóu yǔyánxué shūjià shang zhǎo le bàntiān, zěnme méi zhǎodào zhè běn 《Zhōngguó Gǔdài Yùyán Gùshi》?", "vietnamese": "Thưa cô, em tìm cả buổi trên giá sách ngôn ngữ tầng 3 mà sao không thấy cuốn 'Truyện ngụ ngôn cổ đại Trung Quốc' ạ?"},
            {"id": "nh3_14_d_2", "role": "管理员", "chinese": "我帮你查一下借阅系统……哎呀，真不巧，这本书昨天下午刚被别的同学借走了。", "pinyin": "Wǒ bāng nǐ chá yíxià jièyuè xìtǒng... Āiyā, zhēn bùqiǎo, zhè běn shū zuótiān xiàwǔ gāng bèi bié de tóngxué jiè zǒu le.", "vietnamese": "Để cô tra trên hệ thống mượn sách giúp em nhé... Ôi chao, thật không may, cuốn sách này chiều hôm qua vừa bị một bạn khác mượn đi rồi."},
            {"id": "nh3_14_d_3", "role": "白家月", "chinese": "那我该怎么办呢？我写论文急着用呢。", "pinyin": "Nà wǒ gāi zěnme bàn ne? Wǒ xiě lùnwén jí zhe yòng ne.", "vietnamese": "Vậy em phải làm thế nào ạ? Em đang cần gấp để viết bài luận."},
            {"id": "nh3_14_d_4", "role": "管理员", "chinese": "别着急，你可以先在图书馆网站上预约，等书被还回来以后，系统就会发短信通知你来取。", "pinyin": "Bié zháojí, nǐ kěyǐ xiān zài túshūguǎn wǎngzhàn shang yùyuē, děng shū bèi huán huílái yǐhòu, xìtǒng jiù huì fā duǎnxìn tōngzhī nǐ lái qǔ.", "vietnamese": "Đừng lo, em có thể đặt trước trên trang web thư viện, sau khi sách được trả về, hệ thống sẽ gửi tin nhắn thông báo cho em đến nhận."}
        ],
        "readingPassage": {
            "title": "智慧图书馆里的预约服务 (Dịch vụ đặt mượn tiện ích tại thư viện thông minh)",
            "content": "现代化大学图书馆不仅馆藏丰富，借阅流程也越来越智能化。白家月想借一本热门的中国当代文学研究专著，但书架上的两本实体书都已被读者借走。按照管理员老师的指导，家月登录了校园网的图书馆专属平台。她先在检索栏输入书名，再点击“一键预约”按钮。根据规定，一旦预约成功，借书人的借期将不能续借。两天后，家月的手机就收到了系统发来的自动取书短信，提醒她预约的书已被按时归还，正存放在智能图书借还柜里。数字化服务为广大学子提供了极大便利。",
            "pinyin": "Xiàndàihuà dàxué túshūguǎn bùjǐn guǎncáng fēngfù, jièyuè liúchéng yě yuèláiyuè zhìnénghuà. Bái Jiāyuè xiǎng jiè yì běn rèmén de Zhōngguó dāngdài wénxué yánjiū zhuānzhù, dàn shūjià shang de liǎng běn shítǐ shū dōu yǐ bèi dúzhě jiè zǒu. Ànzhào guǎnlǐyuán lǎoshī de zhǐdǎo, Jiāyuè dēnglù le xiàoyuánwǎng de túshūguǎn zhuānshǔ píngtái. Tā xiān zài jiǎnsuǒlán shūrù shūmíng, zài diǎnjī 'yíjiàn yùyuē' ànniǔ. Gēnjù guīdìng, yídàn yùyuē chénggōng, jièshūrén de jièqī jiāng bù néng xùjiè. Liǎng tiān hòu, Jiāyuè de shǒujī jiù shōudào le xìtǒng fā lái de zìdòng qǔshū duǎnxìn, tíxǐng tā yùyuē de shū yǐ bèi ànshí guīhuán, zhèng cúnfàng zài zhìnéng túshū jièhuán guì lǐ. Shùzìhuà fúwù wèi guǎngdà xuézǐ tígōng le jídà biànlì.",
            "vietnamese": "Thư viện đại học hiện đại ngày nay không chỉ có kho sách đồ sộ mà quy trình mượn trả cũng ngày một thông minh hóa. Bạch Gia Nguyệt muốn mượn một cuốn chuyên khảo văn học đương đại Trung Quốc rất được săn đón, nhưng cả hai bản sách in trên kệ đều đã bị bạn đọc khác mượn đi mất. Theo chỉ dẫn của cô thủ thư, Gia Nguyệt đăng nhập vào cổng thông tin thư viện trường. Bạn ấy trước tiên nhập tên sách vào ô tìm kiếm, sau đó nhấp vào nút 'Đặt trước chỉ với một chạm'. Theo quy chế, một khi đã có người đặt trước thì người đang mượn sẽ không thể gia hạn thêm. Hai ngày sau, điện thoại của Gia Nguyệt đã nhận được tin nhắn báo lấy sách tự động, nhắc nhở rằng quyển sách đặt trước đã được hoàn trả đúng hạn và đang được cất tại tủ mượn trả sách thông minh. Các dịch vụ số hóa đã đem lại sự tiện lợi vô cùng to lớn cho học sinh sinh viên."
        },
        "grammarNotes": [
            "1. Câu bị động câu chữ '被' (1): Chủ ngữ (đối tượng chịu tác động) + 被 + Chủ thể tác động + Động từ + Thành phần khác (Ví dụ: 这本书被借走了 - Cuốn sách này đã bị mượn đi mất; 他的自行车被偷了 - Xe đạp của anh ấy bị mất cắp).",
            "2. Câu ghép tiếp nối '先……，再 / 然后……': Diễn tả thứ tự trước sau của các hành động (Ví dụ: 我们先吃饭，然后去看电影 - Chúng ta ăn cơm trước, sau đó đi xem phim).",
            "3. Cấu trúc cố định '……什么（啊）': Dùng trong ngữ cảnh khẩu ngữ biểu thị sự phản bác, phủ định nhẹ nhàng hoặc khuyên nhủ (Ví dụ: 急什么啊，还有半个小时呢 - Vội vàng cái gì chứ, vẫn còn tận nửa tiếng nữa mà)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_14_lis_1",
                "audioText": "男：请问那本《唐诗选》还在架子上吗？女：真不好意思，刚刚被一位老师借走了。",
                "question": "那本书怎么了？(Quyển sách đó bị làm sao rồi?)",
                "questionPinyin": "Nà běn shū zěnme le?",
                "options": ["破损了", "被一位老师借走了", "已经卖完了"],
                "answerIndex": 1,
                "explanation": "Người nữ trả lời: '刚刚被一位老师借走了' (Vừa bị một thầy giáo mượn đi mất rồi)."
            },
            {
                "id": "nh3_14_lis_2",
                "audioText": "女：我们今天下午的安排是什么？男：我们先去超市买菜，然后再回宿舍做饭。",
                "question": "男的打算先做什么？(Người nam dự định làm việc gì trước?)",
                "questionPinyin": "Nán de dǎsuàn xiān zuò shénme?",
                "options": ["回宿舍做饭", "去超市买菜", "去图书馆看书"],
                "answerIndex": 1,
                "explanation": "Người nam nói: '先去超市买菜' (Trước tiên đi siêu thị mua thức ăn)."
            }
        ]
    },
    {
        "lessonNumber": 15,
        "title": "我是半个南京人",
        "titleVi": "Em cũng là một nửa người Nam Kinh",
        "titlePinyin": "Wǒ shì bàn gè Nánjīng rén",
        "vocabulary": [
            {"id": "nh3_15_1", "hanzi": "南京", "pinyin": "Nánjīng", "hanViet": "Nam Kinh", "meaning": "thành phố Nam Kinh", "partOfSpeech": "d.từ riêng"},
            {"id": "nh3_15_2", "hanzi": "故乡", "pinyin": "gùxiāng", "hanViet": "Cố Hương", "meaning": "quê hương, quê nhà", "partOfSpeech": "d.từ"},
            {"id": "nh3_15_3", "hanzi": "鸭血粉丝汤", "pinyin": "yāxuě fěnsītāng", "hanViet": "Áp Huyết Phấn Ti Thang", "meaning": "canh miến tiết vịt (đặc sản Nam Kinh)", "partOfSpeech": "d.từ"},
            {"id": "nh3_15_4", "hanzi": "根据", "pinyin": "gēnjù", "hanViet": "Căn Cứ", "meaning": "căn cứ vào, dựa theo", "partOfSpeech": "giới.từ / d.từ"},
            {"id": "nh3_15_5", "hanzi": "长大", "pinyin": "zhǎngdà", "hanViet": "Trưởng Đại", "meaning": "lớn lên, trưởng thành", "partOfSpeech": "đg.từ"},
            {"id": "nh3_15_6", "hanzi": "景点", "pinyin": "jǐngdiǎn", "hanViet": "Cảnh Điểm", "meaning": "điểm tham quan thắng cảnh", "partOfSpeech": "d.từ"},
            {"id": "nh3_15_7", "hanzi": "风土人情", "pinyin": "fēngtǔ-rénqíng", "hanViet": "Phong Thổ Nhân Tình", "meaning": "phong tục tập quán địa phương", "partOfSpeech": "thành ngữ"},
            {"id": "nh3_15_8", "hanzi": "在……看来", "pinyin": "zài...kànlai", "hanViet": "Tại... Khán Lai", "meaning": "theo quan điểm của...", "partOfSpeech": "cấu trúc giới từ"},
            {"id": "nh3_15_9", "hanzi": "导游", "pinyin": "dǎoyóu", "hanViet": "Đạo Du", "meaning": "hướng dẫn viên du lịch", "partOfSpeech": "d.từ"},
            {"id": "nh3_15_10", "hanzi": "深厚", "pinyin": "shēnhòu", "hanViet": "Thâm Hậu", "meaning": "sâu sắc, sâu đậm", "partOfSpeech": "t.từ"}
        ],
        "dialogues": [
            {"id": "nh3_15_d_1", "role": "王一雪", "chinese": "李文，听你说话带有一点儿南方口音，而且特别喜欢吃鸭血粉丝汤，你老家是哪里的？", "pinyin": "Lǐ Wén, tīng nǐ shuōhuà dài yǒu yìdiǎnr nánfāng kǒuyīn, érqiě tèbié xǐhuan chī yāxuě fěnsītāng, nǐ lǎojiā shì nǎlǐ de?", "vietnamese": "Lý Văn, nghe em nói chuyện có chút âm hưởng giọng miền Nam, hơn nữa lại đặc biệt thích ăn món canh miến tiết vịt, quê gốc của em ở đâu vậy?"},
            {"id": "nh3_15_d_2", "role": "李文", "chinese": "雪姐好眼力！我外婆是地道的南京人，我从小在秦淮河边住过好几年，所以我也算是半个南京人呢！", "pinyin": "Xuě jiě hǎo yǎnlì! Wǒ wàipó shì dìdao de Nánjīng rén, wǒ cóngxiǎo zài Qínhuáihé biān zhù guò hǎo jǐ nián, suǒyǐ wǒ yě suàn shì bàn gè Nánjīng rén ne!", "vietnamese": "Chị Tuyết tinh mắt thật đấy! Bà ngoại em là người Nam Kinh chính gốc, từ nhỏ em từng sống mấy năm bên bờ sông Tần Hoài, nên em cũng được tính là một nửa người Nam Kinh đó ạ!"},
            {"id": "nh3_15_d_3", "role": "王一雪", "chinese": "太巧了，下个月我们要去南京开学术研讨会，到时候你给我们当导游吧！", "pinyin": "Tài qiǎo le, xià gè yuè wǒmen yào qù Nánjīng kāi xuéshù yántǎohuì, dào shíhou nǐ gěi wǒmen dāng dǎoyóu ba!", "vietnamese": "Khéo quá, tháng sau bọn chị đi Nam Kinh dự hội thảo học thuật, đến lúc đó em làm hướng dẫn viên cho bọn chị nhé!"}
        ],
        "readingPassage": {
            "title": "秦淮河畔的儿时记忆 (Ký ức ấu thơ bên dòng sông Tần Hoài)",
            "content": "六朝古都南京是一座底蕴深厚的江南历史名城。李文虽然在国外长大，但他对南京有着极其深厚的感情。童年的每一个寒暑假，他都是在夫子庙和中山陵脚下的外婆家度过的。在他看来，南京不仅有秀丽的玄武湖和宏伟的明城墙，更有让人念念不忘的街头美食。一碗热气腾腾的鸭血粉丝汤，配上焦黄酥脆的鸭油酥烧饼，是世间最温暖的故乡滋味。根据李文的介绍，大家对即将到来的南京之行充满了向往与期盼。",
            "pinyin": "Liùcháo gǔdū Nánjīng shì yí zuò dǐyùn shēnhòu de Jiāngnán lìshǐ míngchéng. Lǐ Wén suīrán zài guówài zhǎngdà, dàn tā duì Nánjīng yǒu zhe jíqí shēnhòu de gǎnqíng. Tóngnián de měi yí gè hánshǔjià, tā dōu shì zài Fūzǐmiào hé Zhōngshānlíng jiǎoxià de wàipó jiā dùguò de. Zài tā kànlai, Nánjīng bùjǐn yǒu xiùlì de Xuánwǔ Hú hé hóngwěi de Míng chéngqiáng, gèng yǒu ràng rén niànniàn-bùwàng de jiētóu měishí. Yì wǎn rèqì-téngténg de yāxuě fěnsītāng, pèi shàng jiāohuáng sūcuì de yāyóu sūshāobǐng, shì shìjiān zuì wēnnuǎn de gùxiāng zīwèi. Gēnjù Lǐ Wén de jièshào, dàjiā duì jíjiāng dàolái de Nánjīng zhī xíng chōngmǎn le xiàngwǎng yǔ qīpàn.",
            "vietnamese": "Cố đô Lục triều Nam Kinh là một danh thành lịch sử Giang Nam bề dày văn hiến sâu sắc. Lý Văn tuy lớn lên ở nước ngoài nhưng cậu lại dành cho Nam Kinh một tình cảm gắn bó vô cùng sâu đậm. Mỗi kỳ nghỉ đông nghỉ hè thời thơ ấu, cậu đều trải qua tại nhà bà ngoại dưới chân Miếu Phu Tử và lăng Trung Sơn. Theo cảm nhận của cậu, Nam Kinh không chỉ có hồ Huyền Vũ thơ mộng và tường thành nhà Minh sừng sững, mà còn có vô số món ngon đường phố khiến người ta nhớ mãi không nguôi. Một bát canh miến tiết vịt nóng hổi ăn kèm chiếc bánh nướng mỡ vịt vàng ruộm giòn tan là hương vị quê nhà ấm áp nhất trần đời. Căn cứ vào lời giới thiệu say sưa của Lý Văn, mọi người đều háo hức chờ đón chuyến đi Nam Kinh sắp tới."
        },
        "grammarNotes": [
            "1. Giới từ '根据': Biểu thị căn cứ, dựa trên cơ sở nào đó để đưa ra phán đoán hoặc hành động (Ví dụ: 根据天气预报，明天有小雨 - Theo dự báo thời tiết, ngày mai có mưa nhỏ; 根据这本书的记载 - Căn cứ theo ghi chép trong cuốn sách này).",
            "2. Trùng điệp số lượng từ 'Số từ + Lượng từ + Số từ + Lượng từ': Biểu thị từng cái một tuần tự hoặc số lượng nhiều (Ví dụ: 一个一个地回答 - Từng người một lần lượt trả lời; 一步一步来 - Từng bước từng bước một).",
            "3. Cụm từ cố định '在……看来': Nêu quan điểm từ góc nhìn chủ quan của đối tượng (Ví dụ: 在我看来，学汉语贵在坚持 - Theo tôi thấy, học tiếng Hán quý ở sự kiên trì bền bỉ)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_15_lis_1",
                "audioText": "男：李文，你从小在南京生活过吗？女：对，我外婆是南京人，我小时候在南京住过四年。",
                "question": "李文小时候在南京住了几年？(Hồi nhỏ Lý Văn đã ở Nam Kinh mấy năm?)",
                "questionPinyin": "Lǐ Wén xiǎoshíhou zài Nánjīng zhù le jǐ nián?",
                "options": ["两年", "三年", "四年"],
                "answerIndex": 2,
                "explanation": "Đoạn thoại nêu rõ: '我小时候在南京住过四年' (Hồi nhỏ tôi ở Nam Kinh 4 năm)."
            },
            {
                "id": "nh3_15_lis_2",
                "audioText": "女：在你看來，这次中文演讲比赛谁能拿第一名？男：根据平时的表现，我认为白家月最有希望。",
                "question": "男的根据什么做出判断？(Người nam dựa vào điều gì để phán đoán?)",
                "questionPinyin": "Nán de gēnjù shénme zuòchū pànduàn?",
                "options": ["考试成绩", "平时的表现", "抽签结果"],
                "answerIndex": 1,
                "explanation": "Người nam trả lời: '根据平时的表现' (Căn cứ vào biểu hiện thường ngày)."
            }
        ]
    },
    {
        "lessonNumber": 16,
        "title": "我听说有的熊猫出国了",
        "titleVi": "Con nghe nói có một số con gấu trúc đã ra nước ngoài",
        "titlePinyin": "Wǒ tīngshuō yǒude xióngmāo chūguó le",
        "vocabulary": [
            {"id": "nh3_16_1", "hanzi": "熊猫", "pinyin": "xióngmāo", "hanViet": "Hùng Miêu", "meaning": "gấu trúc", "partOfSpeech": "d.từ"},
            {"id": "nh3_16_2", "hanzi": "国宝", "pinyin": "guóbǎo", "hanViet": "Quốc Bảo", "meaning": "quốc bảo, báu vật quốc gia", "partOfSpeech": "d.từ"},
            {"id": "nh3_16_3", "hanzi": "竹子", "pinyin": "zhúzi", "hanViet": "Trúc Tử", "meaning": "cây tre, cây trúc", "partOfSpeech": "d.từ"},
            {"id": "nh3_16_4", "hanzi": "可爱", "pinyin": "kě'ài", "hanViet": "Khả Ái", "meaning": "đáng yêu, dễ thương", "partOfSpeech": "t.từ"},
            {"id": "nh3_16_5", "hanzi": "出国", "pinyin": "chū guó", "hanViet": "Xuất Quốc", "meaning": "ra nước ngoài", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_16_6", "hanzi": "关于", "pinyin": "guānyú", "hanViet": "Quan Vu", "meaning": "về, liên quan đến", "partOfSpeech": "giới.từ"},
            {"id": "nh3_16_7", "hanzi": "一般来说", "pinyin": "yìbān láishuō", "hanViet": "Nhất Ban Lai Thuyết", "meaning": "thông thường mà nói", "partOfSpeech": "cụm từ"},
            {"id": "nh3_16_8", "hanzi": "保护", "pinyin": "bǎohù", "hanViet": "Bảo Hộ", "meaning": "bảo vệ", "partOfSpeech": "đg.từ"},
            {"id": "nh3_16_9", "hanzi": "受欢迎", "pinyin": "shòu huānyíng", "hanViet": "Thụ Hoan Nghênh", "meaning": "được chào đón, được yêu thích", "partOfSpeech": "cụm từ"},
            {"id": "nh3_16_10", "hanzi": "一会儿……一会儿……", "pinyin": "yíhuìr...yíhuìr...", "hanViet": "Nhất Hội Nhi...", "meaning": "lúc thì... lúc thì...", "partOfSpeech": "cấu trúc liên từ"}
        ],
        "dialogues": [
            {"id": "nh3_16_d_1", "role": "小男孩", "chinese": "讲解员阿姨，大熊猫长得圆滚滚的真可爱！我听说有的熊猫还出国了呢，是真的吗？", "pinyin": "Jiǎngjiěyuán āyí, dàxióngmāo zhǎng de yuángǔngǔn de zhēn kě'ài! Wǒ tīngshuō yǒude xióngmāo hái chūguó le ne, shì zhēn de ma?", "vietnamese": "Cô hướng dẫn viên ơi, gấu trúc lớn tròn vo trông đáng yêu quá! Con nghe nói có những chú gấu trúc còn được ra nước ngoài nữa, có thật không cô?"},
            {"id": "nh3_16_d_2", "role": "讲解员", "chinese": "小朋友你说得完全没错！大熊猫是中国的国宝，它们作为友好使者，到过许多国家的动物园做客呢。", "pinyin": "Xiǎopéngyou nǐ shuō de wánquán méi cuò! Dàxióngmāo shì Zhōngguó de guóbǎo, tāmen zuòwéi yǒuhǎo shǐzhě, dào guò xǔduō guójiā de dòngwùyuán zuòkè ne.", "vietnamese": "Cháu nói hoàn toàn chính xác rồi đấy! Gấu trúc lớn là quốc bảo của Trung Quốc, các bạn ấy đóng vai trò là sứ giả hữu nghị, từng đến làm khách ở vườn thú nhiều quốc gia trên thế giới đấy."},
            {"id": "nh3_16_d_3", "role": "小男孩", "chinese": "那外国小朋友一定也特别喜欢它们吧？你看那只小熊猫，一会儿爬树，一会儿吃竹子，逗得大家哈哈大笑！", "pinyin": "Nà wàiguó xiǎopéngyou yídìng yě tèbié xǐhuan tāmen ba? Nǐ kàn nà zhī xiǎo xióngmāo, yíhuìr pá shù, yíhuìr chī zhúzi, dòu de dàjiā hāhā dàxiào!", "vietnamese": "Thế thì các bạn nhỏ nước ngoài chắc chắn cũng thích mê các bạn ấy cô nhỉ? Cô nhìn chú gấu trúc con kìa, lúc thì trèo cây, lúc thì gặm trúc, làm cho mọi người cười nghiêng ngả!"}
        ],
        "readingPassage": {
            "title": "和平使者——大熊猫的全球魅力 (Sứ giả hòa bình - Sức hút toàn cầu của gấu trúc)",
            "content": "大熊猫是中国特有的珍稀濒危野生动物，因其黑白相间的皮毛和憨态可掬的动作被誉为“中国国宝”。一般来说，大熊猫每天有一半的时间在咀嚼新鲜鲜嫩的竹子，另一半时间则在香甜地睡大觉。关于大熊猫的对外交流，早在几十年前，中国就将大熊猫作为象征和平友好的国礼赠送给友邦。如今，旅居海外的大熊猫生活在现代化的熊猫馆内，受到全球亿万民众的热烈喜爱与精心守护。憨厚可爱的大熊猫架起了一座座连接中国与世界各国人民友谊的坚实桥梁。",
            "pinyin": "Dàxióngmāo shì Zhōngguó tèyǒu de zhēnxī bīnwēi yěshēng dòngwù, yīn qí hēibái-xiāngjiàn de pímáo hé hāntài-kějū de dòngzuò bèi yù wéi 'Zhōngguó guóbǎo'. Yìbān láishuō, dàxióngmāo měitiān yǒu yíbàn de shíjiān zài jǔjué xīnxiān xiānnèn de zhúzi, lìng yíbàn shíjiān zé zài xiāngtián de shuì dà jiào. Guānyú dàxióngmāo de duìwài jiāoliú, zǎozài jǐ shí nián qián, Zhōngguó jiù jiāng dàxióngmāo zuòwéi xiàngzhēng hépíng yǒuhǎo de guólǐ zèngsòng gěi yǒubāng. Rújīn, lǚjū hǎiwài de dàxióngmāo shēnghuó zài xiàndàihuà de xióngmāoguǎn nèi, shòudào quánqiú yìwàn mínzhòng de rèliè xǐ'ài yǔ jīngxīn shǒuhù. Hānhòu kě'ài de dàxióngmāo jià qǐ le yízuòzuò liánjiē Zhōngguó yǔ shìjiè gèguó rénmín yǒuyì de jiānshí qiáoliáng.",
            "vietnamese": "Gấu trúc lớn là loài động vật hoang dã quý hiếm đặc hữu của Trung Quốc, với bộ lông hai màu đen trắng đan xen cùng dáng vẻ ngây ngô ngộ nghĩnh nên được tôn vinh là 'Quốc bảo Trung Hoa'. Thông thường mà nói, mỗi ngày gấu trúc dành một nửa thời gian để nhai những nhánh trúc tươi non, nửa thời gian còn lại thì ngủ tì tì say giấc nồng. Về phương diện giao lưu hữu nghị đối ngoại, ngay từ nhiều thập kỷ trước, Trung Quốc đã gửi tặng gấu trúc như món quốc lễ biểu tượng cho hòa bình hữu hảo tới các nước bạn bè. Ngày nay, những chú gấu trúc sinh sống tại nước ngoài đều được hưởng tiện nghi chăm sóc tối tân và nhận được tình yêu thương nồng nhiệt của hàng trăm triệu người dân khắp năm châu. Hình ảnh chú gấu trúc phúc hậu đáng yêu đã bắc nên những nhịp cầu hữu nghị vững bền kết nối nhân dân Trung Quốc với bè bạn năm châu."
        },
        "grammarNotes": [
            "1. Cấu trúc cố định '一会儿……，一会儿……': Biểu thị hai hành động hoặc trạng thái thay đổi luân phiên nhau trong khoảng thời gian ngắn (Ví dụ: 小猫一会儿跑，一会儿跳 - Chú mèo con lúc thì chạy, lúc lại nhảy tót lên).",
            "2. Giới từ '关于': Đặt ở đầu câu biểu thị phạm vi đối tượng được nói tới (Ví dụ: 关于这件事，我们还要讨论 - Về sự việc này, chúng ta còn phải bàn bạc thêm).",
            "3. Cụm từ cố định '一般来说': Dùng để mở đầu nhận xét mang tính quy luật phổ quát chung (Ví dụ: 一般来说，秋天的天气最好 - Nhìn chung, thời tiết mùa thu là dễ chịu nhất).",
            "4. Câu so sánh (11): 'A 比 B + Động từ + 得 + Bổ ngữ' (Ví dụ: 熊猫爬树爬得比我想象的还要快 - Gấu trúc trèo cây nhanh hơn cả tưởng tượng của tôi)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_16_lis_1",
                "audioText": "男：大熊猫平时最喜欢吃什么？女：一般来说，竹子是它们最主要的食物，偶尔也吃苹果。",
                "question": "大熊猫主要吃什么食物？(Thức ăn chủ yếu của gấu trúc là gì?)",
                "questionPinyin": "Dàxióngmāo zhǔyào chī shénme shíwù?",
                "options": ["肉类", "竹子", "鱼"],
                "answerIndex": 1,
                "explanation": "Người nữ trả lời: '竹子是它们最主要的食物' (Cây trúc là thức ăn chính của chúng)."
            },
            {
                "id": "nh3_16_lis_2",
                "audioText": "女：你看那只大熊猫在干什么呢？男：它一会儿翻跟头，一会儿躺着啃竹子，太有趣了！",
                "question": "大熊猫在做什么？(Gấu trúc đang làm gì?)",
                "questionPinyin": "Dàxióngmāo zài zuò shénme?",
                "options": ["在树上睡觉", "翻跟头和啃竹子", "在池塘里游泳"],
                "answerIndex": 1,
                "explanation": "Người nam tả: '一会儿翻跟头，一会儿躺着啃竹子'."
            }
        ]
    },
    {
        "lessonNumber": 17,
        "title": "我要多向认真的人学习",
        "titleVi": "Mình sẽ học hỏi từ những người cẩn thận",
        "titlePinyin": "Wǒ yào duō xiàng rènzhēn de rén xuéxí",
        "vocabulary": [
            {"id": "nh3_17_1", "hanzi": "认真", "pinyin": "rènzhēn", "hanViet": "Nhận Chân", "meaning": "nghiêm túc, cẩn thận, chăm chỉ", "partOfSpeech": "t.từ"},
            {"id": "nh3_17_2", "hanzi": "向", "pinyin": "xiàng", "hanViet": "Hướng", "meaning": "hướng về, học hỏi từ", "partOfSpeech": "giới.từ"},
            {"id": "nh3_17_3", "hanzi": "细心", "pinyin": "xìxīn", "hanViet": "Tế Tâm", "meaning": "tỉ mỉ, chu đáo", "partOfSpeech": "t.từ"},
            {"id": "nh3_17_4", "hanzi": "态度", "pinyin": "tàidu", "hanViet": "Thái Độ", "meaning": "thái độ", "partOfSpeech": "d.từ"},
            {"id": "nh3_17_5", "hanzi": "反问", "pinyin": "fǎnwèn", "hanViet": "Phản Vấn", "meaning": "hỏi ngược lại, vặn lại", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_17_6", "hanzi": "只有……才……", "pinyin": "zhǐyǒu...cái...", "hanViet": "Chỉ Hữu... Tài...", "meaning": "chỉ khi... mới...", "partOfSpeech": "cấu trúc liên từ"},
            {"id": "nh3_17_7", "hanzi": "更", "pinyin": "gèng", "hanViet": "Canh", "meaning": "càng, hơn nữa", "partOfSpeech": "phó.từ"},
            {"id": "nh3_17_8", "hanzi": "进步", "pinyin": "jìnbù", "hanViet": "Tiến Bộ", "meaning": "tiến bộ", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_17_9", "hanzi": "成绩", "pinyin": "chéngjì", "hanViet": "Thành Tích", "meaning": "thành tích, điểm số", "partOfSpeech": "d.từ"},
            {"id": "nh3_17_10", "hanzi": "榜样", "pinyin": "bǎngyàng", "hanViet": "Bảng Dạng", "meaning": "tấm gương mẫu mực", "partOfSpeech": "d.từ"}
        ],
        "dialogues": [
            {"id": "nh3_17_d_1", "role": "陈天中", "chinese": "家月，这次期中考试你的听力又拿了满分，字迹也写得这么工整漂亮，真是太厉害了！", "pinyin": "Jiāyuè, zhè cì qīzhōng kǎoshì nǐ de tīnglì yòu ná le mǎnfēn, zìjì yě xiě de zhème gōngzhěng piàoliang, zhēn shì tài lìhai le!", "vietnamese": "Gia Nguyệt ơi, bài thi giữa kỳ lần này phần nghe bạn lại đạt điểm tối đa, nét chữ cũng nắn nót đẹp đẽ thế này, cừ khôi thật đấy!"},
            {"id": "nh3_17_d_2", "role": "白家月", "chinese": "你过奖了天中。其实王老师平时一直教导我们：‘态度决定一切，只有课前认真预习、课后反复复习，才能把汉语学扎实。’不是吗？", "pinyin": "Nǐ guòjiǎng le Tiānzhōng. Qíshí Wáng lǎoshī píngshí yìzhí jiàodǎo wǒmen: 'Tàidu juédìng yíqiè, zhǐyǒu kèqián rènzhēn yùxí, kèhòu fǎnfù fùxí, cái néng bǎ Hànyǔ xué zhāshi.' Bú shì ma?", "vietnamese": "Bạn quá khen rồi Thiên Trung. Thực ra cô Vương thường dạy tụi mình: 'Thái độ quyết định tất cả, chỉ khi trước giờ học chuẩn bị bài kỹ lưỡng, sau giờ học ôn đi ôn lại nhiều lần, mới có thể nắm chắc tiếng Trung.' Chẳng phải vậy sao?"},
            {"id": "nh3_17_d_3", "role": "陈天中", "chinese": "你说得太对了！我平时总是马马虎虎，我真要多向你这样认真的人学习，把学习态度端正起来！", "pinyin": "Nǐ shuō de tài duì le! Wǒ píngshí zǒngshì mǎmǎhūhū, wǒ zhēn yào duō xiàng nǐ zhèyàng rènzhēn de rén xuéxí, bǎ xuéxí tàidu duānzhèng qǐlai!", "vietnamese": "Bạn nói đúng lắm! Bình thường mình hay làm ăn đại khái qua loa, mình thực sự phải học tập những bạn cẩn thận chỉn chu như bạn, chấn chỉnh lại thái độ học tập thôi!"}
        ],
        "readingPassage": {
            "title": "精益求精的学习之道 (Con đường học tập hướng đến sự tinh hoa)",
            "content": "学习一门外语不仅需要浓厚的兴趣，更需要坚持不懈和精益求精的治学态度。在汉语课堂上，白家月永远是那个坐姿端正、笔记本写得最整洁的学生。每次遇到生疏的语法点和生词，她都会主动向老师和中国同学请教，直到彻底弄懂为止。陈天中受她的积极影响，也改变了过去粗心大意的坏习惯。俗话说：“榜样的力量是无穷的。”只有向优秀认真的人看齐，脚踏实地积累知识，我们才能在求学道路上走得更稳、更远。",
            "pinyin": "Xuéxí yì mén wàiyǔ bùjǐn xūyào nónghòu de xìngqù, gèng xūyào jiānchí-búxiè hé jīngyì-qiújīng de zhìxué tàidu. Zài Hànyǔ kètáng shang, Bái Jiāyuè yǒngyuǎn shì nà ge zuòzī duānzhèng, bǐjìběn xiě de zuì zhěngjié de xuésheng. Měi cì yù dào shēngshū de yǔfǎdiǎn hé shēngcí, tā dōu huì zhǔdòng xiàng lǎoshī hé Zhōngguó tóngxué qǐngjiào, zhídào chèdǐ nòng dǒng wéizhǐ. Chén Tiānzhōng shòu tā de jījí yǐngxiǎng, yě gǎibiàn le guòqù cūxīn-dàyì de huài xíguàn. Súhuà shuō: 'Bǎngyàng de lìliang shì wúqióng de.' Zhǐyǒu xiàng yōuxiù rènzhēn de rén kànqí, jiǎotà-shídì jīlěi zhīshi, wǒmen cái néng zài qiúxué dàolù shang zǒu de gèng wěn, gèng yuǎn.",
            "vietnamese": "Học một ngoại ngữ không chỉ cần niềm say mê hứng thú mà hơn thế nữa còn đòi hỏi sự kiên trì bền bỉ và thái độ học tập tinh ích cầu tinh. Trong lớp học tiếng Hán, Bạch Gia Nguyệt luôn là người ngồi ngay ngắn nhất và có cuốn vở ghi chép sạch đẹp nhất. Mỗi khi gặp điểm ngữ pháp mới hay từ vựng xa lạ, bạn ấy đều chủ động hướng về phía thầy cô và các bạn Trung Quốc xin chỉ giáo, cho tới khi hiểu tường tận cặn kẽ mới thôi. Trần Thiên Trung chịu ảnh hưởng tích cực từ bạn cũng đã thay đổi thói quen cẩu thả qua loa trước đây. Người xưa có câu: 'Sức mạnh của tấm gương sáng là vô hạn.' Chỉ khi noi theo những con người ưu tú và cẩn trọng, vững bước tích lũy tri thức từng ngày, chúng ta mới có thể tiến xa và vững vàng trên con đường học vấn."
        },
        "grammarNotes": [
            "1. Giới từ '向': Biểu thị phương hướng hoặc đối tượng học tập, thỉnh giáo (Ví dụ: 向老师请教 - Xin thầy cô chỉ bảo; 向优秀同学学习 - Học tập bạn học ưu tú).",
            "2. Câu phản vấn cấu trúc '不是……吗？': Dùng câu hỏi để nhấn mạnh khẳng định chân lý hiển nhiên hoặc nhắc nhở (Ví dụ: 你不是已经答应他了吗？ - Chẳng phải bạn đã nhận lời anh ấy rồi sao?).",
            "3. Câu ghép tăng tiến '……，更……': Biểu thị mức độ vế sau sâu sắc hơn vế trước (Ví dụ: 他不仅聪明，更非常勤奋 - Cậu ấy không những thông minh mà càng chăm chỉ hơn).",
            "4. Câu ghép điều kiện '只有……，才……': Biểu thị điều kiện duy nhất tất yếu để đạt được kết quả (Ví dụ: 只有努力学习，才能考上好大学 - Chỉ có chăm chỉ học tập mới có thể thi đỗ đại học tốt)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_17_lis_1",
                "audioText": "男：这次中文考试全班就家月考了满分。女：她平时学习最认真，只有付出努力，才能取得好成绩啊。",
                "question": "家月为什么能考满分？(Tại sao Gia Nguyệt đạt điểm tối đa?)",
                "questionPinyin": "Jiāyuè wèishénme néng kǎo mǎnfēn?",
                "options": ["运气特别好", "平时学习最认真努力", "题目太简单"],
                "answerIndex": 1,
                "explanation": "Người nữ giải thích: '她平时学习最认真，只有付出努力，才能取得好成绩'."
            },
            {
                "id": "nh3_17_lis_2",
                "audioText": "女：你明天下午有空吗？我想向你请教几个语法问题。男：没问题，我们明天下午两点在图书馆见。",
                "question": "女的找男的有什么事？(Người nữ tìm người nam có việc gì?)",
                "questionPinyin": "Nǚ de zhǎo nán de yǒu shénme shì?",
                "options": ["请他吃饭", "向他请教语法问题", "一起去看电影"],
                "answerIndex": 1,
                "explanation": "Người nữ đề nghị: '我想向你请教几个语法问题' (Em muốn hỏi anh vài vấn đề ngữ pháp)."
            }
        ]
    },
    {
        "lessonNumber": 18,
        "title": "我学会了包饺子",
        "titleVi": "Cháu đã học được cách gói sủi cảo",
        "titlePinyin": "Wǒ xuéhuì le bāo jiǎozi",
        "vocabulary": [
            {"id": "nh3_18_1", "hanzi": "包饺子", "pinyin": "bāo jiǎozi", "hanViet": "Bao Sủi Cảo", "meaning": "gói sủi cảo", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_18_2", "hanzi": "面粉", "pinyin": "miànfěn", "hanViet": "Diện Phấn", "meaning": "bột mì", "partOfSpeech": "d.từ"},
            {"id": "nh3_18_3", "hanzi": "馅儿", "pinyin": "xiànr", "hanViet": "Hãm Nhi", "meaning": "nhân bánh, nhân sủi cảo", "partOfSpeech": "d.từ"},
            {"id": "nh3_18_4", "hanzi": "刚才", "pinyin": "gāngcái", "hanViet": "Cương Tài", "meaning": "vừa nãy, lúc nãy", "partOfSpeech": "d.từ thời gian"},
            {"id": "nh3_18_5", "hanzi": "刚刚", "pinyin": "gānggang", "hanViet": "Cương Cương", "meaning": "vừa mới", "partOfSpeech": "phó.từ"},
            {"id": "nh3_18_6", "hanzi": "只要……就……", "pinyin": "zhǐyào...jiù...", "hanViet": "Chỉ Yếu... Tựu...", "meaning": "chỉ cần... là...", "partOfSpeech": "cấu trúc liên từ"},
            {"id": "nh3_18_7", "hanzi": "从……起", "pinyin": "cóng...qǐ", "hanViet": "Tùng... Khởi", "meaning": "kể từ... trở đi", "partOfSpeech": "cấu trúc giới từ"},
            {"id": "nh3_18_8", "hanzi": "传统", "pinyin": "chuántǒng", "hanViet": "Truyền Thống", "meaning": "truyền thống", "partOfSpeech": "d.từ / t.từ"},
            {"id": "nh3_18_9", "hanzi": "团圆", "pinyin": "tuányuán", "hanViet": "Đoàn Viên", "meaning": "đoàn viên, sum họp", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_18_10", "hanzi": "成功", "pinyin": "chénggōng", "hanViet": "Thành Công", "meaning": "thành công", "partOfSpeech": "đg.từ / t.từ"}
        ],
        "dialogues": [
            {"id": "nh3_18_d_1", "role": "白家月", "chinese": "阿姨，刚才看您捏饺子皮的动作好快啊！我刚刚试着包了一个，怎么馅儿都露出来了？", "pinyin": "Āyí, gāngcái kàn nín niē jiǎozipí de dòngzuò hǎo kuài a! Wǒ gānggang shì zhe bāo le yí gè, zěnme xiànr dōu lù chūlái le?", "vietnamese": "Cô ơi, vừa nãy nhìn cô nắn vỏ bánh sủi cảo nhanh thoăn thoắt! Cháu vừa mới thử gói một cái, sao nhân lại bị bục hết cả ra thế này ạ?"},
            {"id": "nh3_18_d_2", "role": "房东阿姨", "chinese": "哈哈傻孩子，只要掌握了技巧就很简单。把馅儿放在皮子中间，边缘沾一点儿清水，两只手这样轻轻一捏就合上了！", "pinyin": "Hāhā shǎ háizi, zhǐyào zhǎngwò le jìqiǎo jiù hěn jiǎndān. Bǎ xiànr fàng zài pízi zhōngjiān, biānyuán zhān yìdiǎnr qīngshuǐ, liǎng zhī shǒu zhèyàng qīngqīng yì niē jiù hé shàng le!", "vietnamese": "Haha ngốc quá, chỉ cần nắm được mẹo là dễ ngay thôi mà. Cháu đặt nhân vào chính giữa vỏ bánh, mép chấm một chút nước lọc, hai bàn tay nhẹ nhàng bóp lại như thế này là khép chặt ngay!"},
            {"id": "nh3_18_d_3", "role": "白家月", "chinese": "哇，我照着您的方法捏好了！太漂亮了，阿姨，我终于学会包饺子啦！", "pinyin": "Wā, wǒ zhào zhe nín de fāngfǎ niē hǎo le! Tài piàoliang le, āyí, wǒ zhōngyú xuéhuì bāo jiǎozi la!", "vietnamese": "Oa, cháu làm theo cách của cô nắn được rồi này! Đẹp quá, cô ơi, cuối cùng cháu cũng học được cách gói sủi cảo rồi ạ!"}
        ],
        "readingPassage": {
            "title": "除夕夜的温情包饺子 (Nét ấm áp gói sủi cảo đêm trừ tịch)",
            "content": "在中国传统文化中，吃饺子是辞旧迎新、阖家团圆的温馨象征。除夕之夜，房东阿姨特地邀请独自留校过年的外国留学生们到家里一起包饺子。大家围坐在热气腾腾的大圆桌旁，揉面、擀皮、拌馅儿，分工合作其乐融融。白家月在阿姨的耐心地指导下，从最开始的笨手笨脚，到后来包出的饺子个个圆润饱满像金元宝一样。下锅煮熟捞出后，沾上香醋和辣椒油，咬上一口满嘴留香。家月激动地说：“从今晚起，我也是一个会做中国传统美食的人了！”大家在异国他乡感受到了家一般的融融暖意。",
            "pinyin": "Zài Zhōngguó chuántǒng wénhuà zhōng, chī jiǎozi shì cíjiù-yíngxīn, héjiā-tuányuán de wēnxīn xiàngzhēng. Chúxī zhī yè, fángdōng āyí tèdì yāoqǐng dúzì liúxiào guònián de wàiguó liúxuéshēng men dào jiā lǐ yìqǐ bāo jiǎozi. Dàjiā wéizuò zài rèqì-téngténg de dà yuánzhuō páng, róumiàn, gǎnpí, bànxiànr, fēngōng-hézuò qílè-róngróng. Bái Jiāyuè zài āyí de nàixīn de zhǐdǎo xià, cóng zuì kāishǐ de bènshǒu-bènjiǎo, dào hòulái bāo chū de jiǎozi gègè yuánrùn bǎomǎn xiàng jīn yuánbǎo yíyàng. Xià guō zhǔ shú lāo chū hòu, zhān shàng xiāngcù hé làjiāoyóu, yǎo shàng yì kǒu mǎnzǔi liúxiāng. Jiāyuè jīdòng de shuō: 'Cóng jīnwǎn qǐ, wǒ yě shì yí gè huì zuò Zhōngguó chuántǒng měishí de rén le!' Dàjiā zài yìguó-tāxiāng gǎnshòu dào le jiā yíbān de róngróng nuǎnyì.",
            "vietnamese": "Trong văn hóa truyền thống Trung Hoa, ăn sủi cảo là biểu tượng ấm áp của việc tiễn năm cũ đón năm mới và gia đình sum họp đoàn viên. Đêm giao thừa, cô chủ nhà chu đáo mời các bạn du học sinh quốc tế ở lại trường ăn Tết sang nhà cùng gói sủi cảo. Mọi người quây quần bên chiếc bàn tròn lớn bốc hơi ấm, nhào bột, cán vỏ, trộn nhân, phân công nhau rộn rã tiếng cười. Bạch Gia Nguyệt dưới sự chỉ dẫn kiên nhẫn của cô chủ nhà, từ chỗ ban đầu lóng ngóng vụng về, về sau gói cái nào cái nấy tròn căng mũm mĩm như những nén vàng nén bạc. Bánh thả vào nồi luộc chín vớt ra, chấm cùng giấm thơm và dầu ớt, cắn một miếng ngập tràn hương vị thơm ngon béo ngậy. Gia Nguyệt xúc động nói: 'Kể từ tối nay trở đi, cháu cũng là một người biết làm món ngon truyền thống Trung Hoa rồi!' Mọi người giữa đất khách quê người đã cảm nhận được hơi ấm gia đình ngập tràn yêu thương."
        },
        "grammarNotes": [
            "1. Cách biểu thị số ước lượng (概数表达法): Dùng hai số liền kề (Ví dụ: 三四个 - Ba bốn cái; 七八十岁 - Bảy tám mươi tuổi) hoặc dùng '左右', '上下' (Ví dụ: 二十块钱左右 - Khoảng tầm hai mươi tệ).",
            "2. Phân biệt '刚才' và '刚刚': '刚才' là danh từ thời gian (chỉ thời điểm cách hiện tại vài phút); '刚刚' là phó từ (biểu thị hành động vừa mới xảy ra, có thể đứng sau chủ ngữ hoặc làm trạng ngữ) (Ví dụ: 他刚才在这儿 - Lúc nãy cậu ấy ở đây; 我刚刚吃完饭 - Tôi vừa mới ăn cơm xong).",
            "3. Câu ghép điều kiện '只要……，就……': Biểu thị chỉ cần có điều kiện này thì ắt sẽ sinh ra kết quả (Ví dụ: 只要多练习，就能学会 - Chỉ cần luyện tập nhiều là sẽ học được ngay).",
            "4. Cấu trúc cố định '从……起': Biểu thị mốc thời gian bắt đầu (Ví dụ: 从今天起 - Kể từ hôm nay trở đi; 从下个月起 - Bắt đầu từ tháng sau)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_18_lis_1",
                "audioText": "男：你刚刚学会包饺子，感觉难不难？女：只要阿姨在旁边指导，我觉得一点儿也不难。",
                "question": "女的觉得包饺子难不难？(Người nữ thấy gói sủi cảo khó hay không?)",
                "questionPinyin": "Nǚ de juéde bāo jiǎozi nán bù nán?",
                "options": ["太难了学不会", "一点儿也不难", "非常麻烦"],
                "answerIndex": 1,
                "explanation": "Người nữ khẳng định: '我觉得一点儿也不难' (Tôi thấy chẳng khó chút nào)."
            },
            {
                "id": "nh3_18_lis_2",
                "audioText": "女：今天除夕夜，大家包了多少个饺子？男：我们七八个人一起包，大概包了一百多个呢！",
                "question": "他们一共包了多少个饺子？(Họ đã gói tổng cộng bao nhiêu cái sủi cảo?)",
                "questionPinyin": "Tāmen yígòng bāo le duōshao gè jiǎozi?",
                "options": ["几十个", "一百多个", "三百多个"],
                "answerIndex": 1,
                "explanation": "Người nam trả lời: '大概包了一百多个呢' (Khoảng hơn một trăm cái)."
            }
        ]
    }
]

print(f"Loaded Lessons 13 to 18 ({len(lessons_13_to_18)} lessons)")
