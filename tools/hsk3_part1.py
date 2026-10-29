# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

lessons_1_to_6 = [
    {
        "lessonNumber": 1,
        "title": "我们去机场接你们",
        "titleVi": "Anh chị sẽ đến sân bay đón các em",
        "titlePinyin": "Wǒmen qù jīchǎng jiē nǐmen",
        "vocabulary": [
            {"id": "nh3_1_1", "hanzi": "接", "pinyin": "jiē", "hanViet": "Tiếp", "meaning": "đón, nhận", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_2", "hanzi": "行李", "pinyin": "xíngli", "hanViet": "Hành Lý", "meaning": "hành lý", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_3", "hanzi": "丢失", "pinyin": "diūshī", "hanViet": "Đâu Thất", "meaning": "mất mát, thất lạc", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_4", "hanzi": "应该", "pinyin": "yīnggāi", "hanViet": "Ưng Cai", "meaning": "nên, chắc là", "partOfSpeech": "đg.từ năng nguyện"},
            {"id": "nh3_1_5", "hanzi": "站", "pinyin": "zhàn", "hanViet": "Trạm", "meaning": "đứng, trạm dừng", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_6", "hanzi": "中间", "pinyin": "zhōngjiān", "hanViet": "Trung Gian", "meaning": "ở giữa", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_7", "hanzi": "短", "pinyin": "duǎn", "hanViet": "Đoản", "meaning": "ngắn", "partOfSpeech": "t.từ"},
            {"id": "nh3_1_8", "hanzi": "头发", "pinyin": "tóufa", "hanViet": "Đầu Phát", "meaning": "tóc", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_9", "hanzi": "发现", "pinyin": "fāxiàn", "hanViet": "Phát Hiện", "meaning": "phát hiện, nhận ra", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_10", "hanzi": "不见", "pinyin": "bújiàn", "hanViet": "Bất Kiến", "meaning": "mất tích, không thấy", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_11", "hanzi": "帮助", "pinyin": "bāngzhù", "hanViet": "Bang Trợ", "meaning": "giúp đỡ", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_12", "hanzi": "照片", "pinyin": "zhàopiàn", "hanViet": "Chiếu Phiến", "meaning": "bức ảnh", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_13", "hanzi": "带", "pinyin": "dài", "hanViet": "Đái", "meaning": "mang, dẫn dắt", "partOfSpeech": "đg.từ"}
        ],
        "dialogues": [
            {"id": "nh3_1_d_1", "role": "刘明", "chinese": "飞机早就到了，你看见白家月他们了吗？", "pinyin": "Fēijī zǎojiù dào le, nǐ kànjiàn Bái Jiāyuè tāmen le ma?", "vietnamese": "Máy bay đã đến từ sớm rồi, em thấy Bạch Gia Nguyệt và các bạn chưa?"},
            {"id": "nh3_1_d_2", "role": "王一雪", "chinese": "没有，他们应该快出来了。我们站到中间去吧，这样他们好找一些。", "pinyin": "Méiyǒu, tāmen yīnggāi kuài chūlái le. Wǒmen zhàn dào zhōngjiān qù ba, zhèyàng tāmen hǎo zhǎo yìxiē.", "vietnamese": "Chưa thấy, chắc các em ấy sắp ra rồi. Chúng ta đứng ra giữa đi, như thế các em ấy dễ tìm hơn."},
            {"id": "nh3_1_d_3", "role": "李文", "chinese": "家月，你看！那边举着牌子接我们的是王老师的姐姐吗？", "pinyin": "Jiāyuè, nǐ kàn! Nàbiān jǔ zhe páizi jiē wǒmen de shì Wáng lǎoshī de jiějie ma?", "vietnamese": "Gia Nguyệt, cậu xem kìa! Người đang giơ bảng đón chúng mình bên kia là chị gái cô Vương phải không?"},
            {"id": "nh3_1_d_4", "role": "白家月", "chinese": "对，就是她！旁边那位高个子的男士看上去很热情，应该是刘明哥。", "pinyin": "Duì, jiù shì tā! Pángbiān nà wèi gāo gèzi de nánshì kàn shàngqù hěn rèqíng, yīnggāi shì Liú Míng gē.", "vietnamese": "Đúng rồi, chính là chị ấy! Người đàn ông cao ráo bên cạnh trông rất nhiệt tình, chắc là anh Lưu Minh."}
        ],
        "readingPassage": {
            "title": "到达北京第一天 (Ngày đầu tiên đặt chân đến Bắc Kinh)",
            "content": "昨天我顺利到达北京了。虽然一路上坐了十几个小时的飞机，但是跟家月坐在一起聊着天，我觉得时间过得特别快。到了首都机场取行李的时候，白家月突然发现自己的小背包不见了，里面装有护照和学生签证。幸好在机场问询处工作人员的热情帮助下，不到半个小时就找回了背包。一走出到达大厅，王一雪姐姐和刘明哥就热情地接到了我们，还开车把我们送到了学校旁边的宾馆。北京的秋天凉爽宜人，这一切都让我感到十分温暖。",
            "pinyin": "Zuótiān wǒ shùnlì dàodá Běijīng le. Suīrán yílù shang zuò le shí jǐ gè xiǎoshí de fēijī, dànshì gēn Jiāyuè zuò zài yìqǐ liáo zhe tiān, wǒ juéde shíjiān guò de tèbié kuài. Dào le shǒudū jīchǎng qǔ xíngli de shíhou, Bái Jiāyuè tūrán fāxiàn zìjǐ de xiǎo bèibāo bújiàn le, lǐmiàn zhuāng yǒu hùzhào hé xuésheng qiānzhèng. Xìnghǎo zài jīchǎng wènxúnchù gōngzuò rényuán de rèqíng bāngzhù xià, bú dào bàn gè xiǎoshí jiù zhǎohuí le bèibāo. Yì zǒu chū dàodá dàtīng, Wáng Yīxuě jiějie hé Liú Míng gē jiù rèqíng de jiē dào le wǒmen, hái kāichē bǎ wǒmen sòng dào le xuéxiào pángbiān de bīnguǎn. Běijīng de qiūtiān liángshuǎng yírén, zhè yíqiè dōu ràng wǒ gǎndào shífēn wēnnuǎn.",
            "vietnamese": "Hôm qua tôi đã đến Bắc Kinh an toàn, thuận lợi. Tuy suốt chặng đường bay hơn mười tiếng đồng hồ, nhưng vì ngồi cạnh nói chuyện cùng Gia Nguyệt nên tôi cảm thấy thời gian trôi qua rất nhanh. Đến sân bay Thủ Đô lúc lấy hành lý, Bạch Gia Nguyệt bỗng phát hiện chiếc ba lô nhỏ của mình không thấy đâu, bên trong có hộ chiếu và thị thực du học. May mắn nhờ sự giúp đỡ tận tình của các nhân viên tại quầy thông tin sân bay, chưa đầy nửa tiếng đã tìm lại được ba lô. Vừa bước ra khỏi sảnh đến, chị Vương Nhất Tuyết và anh Lưu Minh đã niềm nở đón chúng tôi và lái xe đưa chúng tôi về khách sạn cạnh trường đại học. Mùa thu Bắc Kinh mát mẻ dễ chịu, tất cả khiến tôi cảm thấy vô cùng ấm áp."
        },
        "grammarNotes": [
            "1. Cụm từ cố định '看上去 / 看起来': Dùng để miêu tả vẻ ngoài, diện mạo hoặc phỏng đoán trạng thái của người hoặc vật (Ví dụ: 他看上去很年轻 - Anh ấy trông rất trẻ trung; 这道菜看起来很好吃 - Món này nhìn có vẻ rất ngon).",
            "2. Đại từ nghi vấn dùng linh hoạt phi nghi vấn (1): Dùng đại từ nghi vấn (什么, 谁, 怎么...) biểu thị đối tượng phiếm chỉ hoặc không xác định (Ví dụ: 我想吃点儿什么 - Tôi muốn ăn chút gì đó).",
            "3. Định ngữ đa tầng (多项定语): Khi danh từ có nhiều định ngữ, trật tự thông thường là: Từ chỉ sở hữu -> Từ chỉ số lượng -> Hình dung từ / Động từ miêu tả đặc điểm (Ví dụ: 那本新买的中文书 - Cuốn sách tiếng Trung mới mua đó)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_1_lis_1",
                "audioText": "男：飞机早就到了，白家月他们怎么还没出来？女：他们应该在取行李呢，我们站到中间等吧。",
                "question": "白家月他们为什么还没出来？(Tại sao nhóm Bạch Gia Nguyệt vẫn chưa ra?)",
                "questionPinyin": "Bái Jiāyuè tāmen wèishénme hái méi chūlái?",
                "options": ["飞机晚点了", "在取行李", "在找护照"],
                "answerIndex": 1,
                "explanation": "Người nữ giải thích: '他们应该在取行李呢' (Chắc các em ấy đang lấy hành lý)."
            },
            {
                "id": "nh3_1_lis_2",
                "audioText": "女：李文，你觉得王老师的姐姐看起来怎么样？男：她看上去很年轻，也很热情。",
                "question": "李文觉得王老师的姐姐怎么样？(Lý Văn thấy chị gái cô giáo Vương như thế nào?)",
                "questionPinyin": "Lǐ Wén juéde Wáng lǎoshī de jiějie zěnmeyàng?",
                "options": ["很累", "很年轻热情", "很严格"],
                "answerIndex": 1,
                "explanation": "Lý Văn trả lời: '她看上去很年轻，也很热情' (Chị ấy trông rất trẻ và nhiệt tình)."
            }
        ]
    },
    {
        "lessonNumber": 2,
        "title": "你们想吃什么就点什么",
        "titleVi": "Các em muốn ăn món gì thì gọi món đó",
        "titlePinyin": "Nǐmen xiǎng chī shénme jiù diǎn shénme",
        "vocabulary": [
            {"id": "nh3_2_1", "hanzi": "点菜", "pinyin": "diǎncài", "hanViet": "Điểm Thái", "meaning": "gọi món", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_2_2", "hanzi": "菜单", "pinyin": "càidān", "hanViet": "Thái Đơn", "meaning": "thực đơn", "partOfSpeech": "d.từ"},
            {"id": "nh3_2_3", "hanzi": "饿", "pinyin": "è", "hanViet": "Ngạ", "meaning": "đói", "partOfSpeech": "t.từ"},
            {"id": "nh3_2_4", "hanzi": "渴", "pinyin": "kě", "hanViet": "Khát", "meaning": "khát", "partOfSpeech": "t.từ"},
            {"id": "nh3_2_5", "hanzi": "外卖", "pinyin": "wàimài", "hanViet": "Ngoại Mại", "meaning": "đồ ăn giao tận nơi", "partOfSpeech": "d.từ"},
            {"id": "nh3_2_6", "hanzi": "扫码", "pinyin": "sǎomǎ", "hanViet": "Tảo Mã", "meaning": "quét mã QR", "partOfSpeech": "đg.từ"},
            {"id": "nh3_2_7", "hanzi": "饺子", "pinyin": "jiǎozi", "hanViet": "Sủi Cảo", "meaning": "sủi cảo, bánh chẻo", "partOfSpeech": "d.từ"},
            {"id": "nh3_2_8", "hanzi": "绿茶", "pinyin": "lǜchá", "hanViet": "Lục Trà", "meaning": "trà xanh", "partOfSpeech": "d.từ"},
            {"id": "nh3_2_9", "hanzi": "特色", "pinyin": "tèsè", "hanViet": "Đặc Sắc", "meaning": "đặc sắc, nét riêng", "partOfSpeech": "d.từ"},
            {"id": "nh3_2_10", "hanzi": "随便", "pinyin": "suíbiàn", "hanViet": "Tùy Tiện", "meaning": "tùy ý, tự nhiên", "partOfSpeech": "t.từ / phó.từ"}
        ],
        "dialogues": [
            {"id": "nh3_2_d_1", "role": "王一雪", "chinese": "坐了这么长时间的飞机，你们一定又累又饿了吧？想吃什么就点什么，别客气！", "pinyin": "Zuò le zhème cháng shíjiān de fēijī, nǐmen yídìng yòu lèi yòu è le ba? Xiǎng chī shénme jiù diǎn shénme, bié kèqi!", "vietnamese": "Ngồi máy bay lâu như vậy, các em chắc hẳn vừa mệt vừa đói rồi đúng không? Muốn ăn gì cứ gọi món đó, đừng khách sáo nhé!"},
            {"id": "nh3_2_d_2", "role": "白家月", "chinese": "雪姐，好久没喝到地道的中国茶了，我想喝杯热绿茶，再来一份牛肉饺子。", "pinyin": "Xuě jiě, hǎojiǔ méi hē dào dìdao de Zhōngguó chá le, wǒ xiǎng hē bēi rè lǜchá, zài lái yí fèn niúròu jiǎozi.", "vietnamese": "Chị Tuyết ơi, lâu lắm rồi em chưa được uống trà Trung Quốc chính gốc, em muốn uống một cốc trà xanh nóng, và gọi thêm một phần sủi cảo thịt bò ạ."},
            {"id": "nh3_2_d_3", "role": "李文", "chinese": "桌子上有二维码，现在可以直接用手机扫码点菜，真方便！", "pinyin": "Zhuōzi shang yǒu èrwèimǎ, xiànzài kěyǐ zhíjiē yòng shǒujī sǎomǎ diǎncài, zhēn fāngbiàn!", "vietnamese": "Trên bàn có mã QR này, bây giờ có thể quét mã gọi món trực tiếp bằng điện thoại, tiện lợi thật đấy!"}
        ],
        "readingPassage": {
            "title": "便捷的扫码点餐 (Trải nghiệm quét mã gọi món tiện lợi)",
            "content": "晚上王一雪姐姐带大家去了一家古色古香的北方家常菜馆。一走进餐馆，桌面上贴着清晰的二维码。服务员微笑着告诉大家，只要拿手机扫一下，就能看到图文并茂的电子菜单。李文和白家月惊奇地发现，菜单上每道菜不仅有高清图片，还标注了辣度和顾客评分。他们想吃什么就点什么，既点了地道的三鲜水饺，又点了著名的宫保鸡丁。点完单几秒钟厨房就接单制作了，数字化生活让用餐变得无比高效与轻松。",
            "pinyin": "Wǎnshang Wáng Yīxuě jiějie dài dàjiā qù le yì jiā gǔsègǔxiāng de běifāng jiācháng cǎiguǎn. Yì zǒu jìn cānguǎn, zhuōmiàn shang tiē zhe qīngxī de èrwèimǎ. Fúwùyuán wēixiào zhe gàosu dàjiā, zhǐyào ná shǒujī sǎo yíxià, jiù néng kàn dào túwén bìngmào de diànzǐ càidān. Lǐ Wén hé Bái Jiāyuè jīngqí de fāxiàn, càidān shang měi dào cài bùjǐn yǒu gāoqīng túpiàn, hái biāozhù le làdù hé gùkè píngfēn. Tāmen xiǎng chī shénme jiù diǎn shénme, jì diǎn le dìdao de sānxiān shuǐjiǎo, yòu diǎn le zhùmíng de gōngbǎojīdīng. Diǎn wán dān jǐ miǎozhōng chúfáng jiù jiē dān zhìzuò le, shùzìhuà shēnghuó ràng yòngcān biànde wúbǐ gāoxiào yǔ qīngsōng.",
            "vietnamese": "Buổi tối, chị Vương Nhất Tuyết dẫn mọi người đến một nhà hàng món ăn gia đình miền Bắc mang phong cách cổ kính. Vừa bước vào quán, trên mặt bàn đã dán sẵn mã QR rõ nét. Nhân viên phục vụ mỉm cười cho biết, chỉ cần dùng điện thoại quét mã là xem được thực đơn điện tử có đầy đủ hình ảnh và lời giới thiệu. Lý Văn và Bạch Gia Nguyệt ngạc nhiên thấy mỗi món ăn trên menu không những có ảnh sắc nét mà còn ghi rõ độ cay và đánh giá của thực khách. Các bạn muốn ăn gì thì gọi món đó, vừa gọi món sủi cảo tam tiên chuẩn vị, vừa gọi món gà xào Cung Bảo trứ danh. Vừa gửi đơn xong vài giây nhà bếp đã nhận món để chế biến, cuộc sống số hóa khiến việc ăn uống trở nên cực kỳ nhanh chóng và thảnh thơi."
        },
        "grammarNotes": [
            "1. Câu ghép đẳng lập '又……又……': Diễn tả hai trạng thái hoặc hành động cùng tồn tại song song ở một chủ thể (Ví dụ: 又累又饿 - Vừa mệt vừa đói; 这里的苹果又大又甜 - Táo ở đây vừa to vừa ngọt).",
            "2. Đại từ nghi vấn dùng linh hoạt phi nghi vấn (2): Cấu trúc '……什么，就……什么' biểu thị sự tương ứng có điều kiện vô điều kiện (Ví dụ: 你想吃什么就买什么 - Bạn muốn ăn gì thì mua nấy; 谁想去谁就去 - Ai muốn đi thì người đó đi).",
            "3. Đại từ nghi vấn dùng linh hoạt phi nghi vấn (3): Dùng trước từ phủ định biểu thị sự phủ định hoàn toàn (Ví dụ: 我什么都不知道 - Tôi không biết bất cứ điều gì cả)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_2_lis_1",
                "audioText": "男：今天晚上我请客，大家想吃什么就点什么！女：那我们点一份烤鸭，再来两碗牛肉面吧。",
                "question": "男的是什么意思？(Người nam có ý gì?)",
                "questionPinyin": "Nán de shì shénme yìsi?",
                "options": ["让大家随便点菜", "菜太贵了不要点", "他不想吃晚饭"],
                "answerIndex": 0,
                "explanation": "Câu '想吃什么就点什么' có nghĩa là để mọi người tùy ý gọi món yêu thích."
            },
            {
                "id": "nh3_2_lis_2",
                "audioText": "女：这家饭馆的菜怎么样？男：这里的菜又便宜又好吃，服务态度也特别好。",
                "question": "这家饭馆的菜怎么样？(Món ăn quán này thế nào?)",
                "questionPinyin": "Zhè jiā fànguǎn de cài zěnmeyàng?",
                "options": ["很贵", "又便宜又好吃", "不太好吃"],
                "answerIndex": 1,
                "explanation": "Người nam nhận xét: '这里的菜又便宜又好吃' (Món ăn ở đây vừa rẻ vừa ngon)."
            }
        ]
    },
    {
        "lessonNumber": 3,
        "title": "这个小区挺好的",
        "titleVi": "Khu dân cư này khá tốt",
        "titlePinyin": "Zhè ge xiǎoqū tǐng hǎo de",
        "vocabulary": [
            {"id": "nh3_3_1", "hanzi": "小区", "pinyin": "xiǎoqū", "hanViet": "Tiểu Khu", "meaning": "khu dân cư, khu chung cư", "partOfSpeech": "d.từ"},
            {"id": "nh3_3_2", "hanzi": "环境", "pinyin": "huánjìng", "hanViet": "Hoàn Cảnh", "meaning": "môi trường xung quanh", "partOfSpeech": "d.từ"},
            {"id": "nh3_3_3", "hanzi": "安静", "pinyin": "ānjìng", "hanViet": "An Tĩnh", "meaning": "yên tĩnh, thanh tịnh", "partOfSpeech": "t.từ"},
            {"id": "nh3_3_4", "hanzi": "挺", "pinyin": "tǐng", "hanViet": "Đĩnh", "meaning": "khá, rất", "partOfSpeech": "phó.từ"},
            {"id": "nh3_3_5", "hanzi": "满意", "pinyin": "mǎnyì", "hanViet": "Mãn Ý", "meaning": "hài lòng, vừa ý", "partOfSpeech": "đg.từ / t.từ"},
            {"id": "nh3_3_6", "hanzi": "搬家", "pinyin": "bānjiā", "hanViet": "Ban Gia", "meaning": "chuyển nhà", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_3_7", "hanzi": "房东", "pinyin": "fángdōng", "hanViet": "Phòng Đông", "meaning": "chủ nhà", "partOfSpeech": "d.từ"},
            {"id": "nh3_3_8", "hanzi": "房租", "pinyin": "fángzū", "hanViet": "Phòng Tô", "meaning": "tiền thuê nhà", "partOfSpeech": "d.từ"},
            {"id": "nh3_3_9", "hanzi": "绿化", "pinyin": "lǜhuà", "hanViet": "Lục Hóa", "meaning": "trồng cây xanh", "partOfSpeech": "d.từ / đg.từ"},
            {"id": "nh3_3_10", "hanzi": "收拾", "pinyin": "shōushi", "hanViet": "Thu Thập", "meaning": "thu dọn, dọn dẹp", "partOfSpeech": "đg.từ"}
        ],
        "dialogues": [
            {"id": "nh3_3_d_1", "role": "白家月", "chinese": "李文，你觉得这个小区环境怎么样？", "pinyin": "Lǐ Wén, nǐ juéde zhè ge xiǎoqū huánjìng zěnmeyàng?", "vietnamese": "Lý Văn, cậu thấy môi trường khu chung cư này thế nào?"},
            {"id": "nh3_3_d_2", "role": "李文", "chinese": "我觉得挺好的，绿树很多，周围特别安静，离学校走路只要十分钟。", "pinyin": "Wǒ juéde tǐng hǎo de, lǜ shù hěn duō, zhōuwéi tèbié ānjìng, lí xuéxiào zǒulù zhǐ yào shí fēnzhōng.", "vietnamese": "Mình thấy khá tốt, nhiều cây xanh, xung quanh rất yên tĩnh, đi bộ đến trường chỉ mất 10 phút thôi."},
            {"id": "nh3_3_d_3", "role": "王一雪", "chinese": "你们满意就好，房东人很和气，房租也比别的地方便宜不少。", "pinyin": "Nǐmen mǎnyì jiù hǎo, fángdōng rén hěn héqi, fángzū yě bǐ bié de dìfang piányi bùshǎo.", "vietnamese": "Các em hài lòng là tốt rồi, chủ nhà rất hiền hòa, tiền thuê nhà cũng rẻ hơn các nơi khác khá nhiều."}
        ],
        "readingPassage": {
            "title": "舒适的新家 (Ngôi nhà mới ấm cúng)",
            "content": "白家月和李文的新公寓位于学校东门附近的一个现代住宅小区。这里不仅交通极其便利，而且绿化做得非常出色。小区中心有一个大花园，清晨常常有许多老年人在那里打太极拳。公寓里面的家具家电一应俱全，窗户朝南，阳光充足。李文开心地说：“房租很合理，房东阿姨还特意给我们准备了全新的被子和热水壶，住在这里我们一定能安心学好中文。”",
            "pinyin": "Bái Jiāyuè hé Lǐ Wén de xīn gōngyù wèiyú xuéxiào dōngmén fùjìn de yí gè xiàndài zhùzhái xiǎoqū. Zhèlǐ bùjǐn jiāotōng jíqí biànlì, érqiě lǜhuà zuò de fēicháng chūsè. Xiǎoqū zhōngxīn yǒu yí gè dà huāyuán, qīngchén chángcháng yǒu xǔduō lǎoniánrén zài nàlǐ dǎ tàijíquán. Gōngyù lǐmiàn de jiājù jiādiàn yìyīng-jùquán, chuānghu cháo nán, yángguāng chōngzú. Lǐ Wén kāixīn de shuō: 'Fángzū hěn hélǐ, fángdōng āyí hái tèyì gěi wǒmen zhǔnbèi le quánxīn de bèizi hé rèshuǐhú, zhù zài zhèlǐ wǒmen yídìng néng ānxīn xué hǎo Zhōngwén.'",
            "vietnamese": "Căn hộ mới của Bạch Gia Nguyệt và Lý Văn nằm trong một khu chung cư hiện đại gần cổng phía Đông của trường. Nơi đây giao thông không những cực kỳ thuận tiện mà cây xanh cảnh quan cũng được chăm chút rất đẹp mắt. Trung tâm khu chung cư có một hoa viên lớn, buổi sáng sớm thường có nhiều cụ già tập thái cực quyền. Trong căn hộ nội thất đồ điện đầy đủ tiện nghi, cửa sổ hướng Nam đón ánh nắng chan hòa. Lý Văn vui mừng nói: 'Tiền thuê nhà rất hợp lý, cô chủ nhà còn chu đáo chuẩn bị chăn nệm và ấm đun nước hoàn toàn mới cho chúng mình, sống ở đây tụi mình nhất định sẽ an tâm học tốt tiếng Trung.'"
        },
        "grammarNotes": [
            "1. Phó từ chỉ mức độ '挺……的': Biểu thị mức độ tương đối cao, tương đương với '很' nhưng mang sắc thái khẩu ngữ thân mật (Ví dụ: 挺好的 - Khá tốt; 挺漂亮的 - Rất xinh xắn).",
            "2. Bổ ngữ trình độ (1): Cấu trúc 'Động từ/Tính từ + 得 + Bổ ngữ' (Ví dụ: 睡得早 - Ngủ sớm; 跑得快 - Chạy nhanh).",
            "3. Phân biệt phó từ '就' và '才': '就' biểu thị hành động diễn ra sớm, nhanh, thuận lợi; '才' biểu thị hành động diễn ra muộn, chậm, khó khăn (Ví dụ: 他八点就到了 - 8h cậu ấy đã tới rồi; 他十点才来 - 10h cậu ấy mới đến)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_3_lis_1",
                "audioText": "女：李文，你觉得新搬的这个小区怎么样？男：环境挺安静的，而且离学校特别近，走十分钟就到了。",
                "question": "男的为什么喜欢这个小区？(Tại sao người nam thích khu dân cư này?)",
                "questionPinyin": "Nán de wèishénme xǐhuan zhè ge xiǎoqū?",
                "options": ["很吵闹", "安静且离学校近", "房租很贵"],
                "answerIndex": 1,
                "explanation": "Người nam nói: '环境挺安静的，而且离学校特别近' (Môi trường khá yên tĩnh và rất gần trường)."
            },
            {
                "id": "nh3_3_lis_2",
                "audioText": "女：你今天怎么十一点才起床？男：昨晚收拾行李到深夜，所以今天起晚了。",
                "question": "男的今天几点起床的？(Người nam hôm nay mấy giờ thức dậy?)",
                "questionPinyin": "Nán de jīntiān jǐ diǎn qǐchuáng de?",
                "options": ["八点", "九点半", "十一点"],
                "answerIndex": 2,
                "explanation": "Đoạn thoại nêu rõ: '十一点才起床' (11 giờ mới thức dậy)."
            }
        ]
    },
    {
        "lessonNumber": 4,
        "title": "这家宾馆跟别的都不一样",
        "titleVi": "Khách sạn này không giống như những khách sạn khác",
        "titlePinyin": "Zhè jiā bīnguǎn gēn bié de dōu bù yíyàng",
        "vocabulary": [
            {"id": "nh3_4_1", "hanzi": "宾馆", "pinyin": "bīnguǎn", "hanViet": "Tân Quán", "meaning": "khách sạn", "partOfSpeech": "d.từ"},
            {"id": "nh3_4_2", "hanzi": "区别", "pinyin": "qūbié", "hanViet": "Khu Biệt", "meaning": "khác biệt, phân biệt", "partOfSpeech": "d.từ / đg.từ"},
            {"id": "nh3_4_3", "hanzi": "服务", "pinyin": "fúwù", "hanViet": "Phục Vụ", "meaning": "phục vụ", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_4_4", "hanzi": "设施", "pinyin": "shèshī", "hanViet": "Thiết Thi", "meaning": "tiện nghi, cơ sở vật chất", "partOfSpeech": "d.từ"},
            {"id": "nh3_4_5", "hanzi": "除了", "pinyin": "chúle", "hanViet": "Trừ Liễu", "meaning": "ngoài ra, trừ phi", "partOfSpeech": "giới.từ"},
            {"id": "nh3_4_6", "hanzi": "干净", "pinyin": "gānjìng", "hanViet": "Càn Tịnh", "meaning": "sạch sẽ", "partOfSpeech": "t.từ"},
            {"id": "nh3_4_7", "hanzi": "感觉", "pinyin": "gǎnjué", "hanViet": "Cảm Giác", "meaning": "cảm giác, cảm thấy", "partOfSpeech": "d.từ / đg.từ"},
            {"id": "nh3_4_8", "hanzi": "经理", "pinyin": "jīnglǐ", "hanViet": "Kinh Lý", "meaning": "giám đốc, quản lý", "partOfSpeech": "d.từ"},
            {"id": "nh3_4_9", "hanzi": "热情", "pinyin": "rèqíng", "hanViet": "Nhiệt Tình", "meaning": "nhiệt tình", "partOfSpeech": "t.từ"},
            {"id": "nh3_4_10", "hanzi": "传统", "pinyin": "chuántǒng", "hanViet": "Truyền Thống", "meaning": "truyền thống", "partOfSpeech": "d.từ / t.từ"}
        ],
        "dialogues": [
            {"id": "nh3_4_d_1", "role": "安妮", "chinese": "家月，这家四合院宾馆真的跟别的宾馆都不一样！", "pinyin": "Jiāyuè, zhè jiā sìhéyuàn bīnguǎn zhēn de gēn bié de bīnguǎn dōu bù yíyàng!", "vietnamese": "Gia Nguyệt ơi, khách sạn tứ hợp viện này thực sự không giống như những khách sạn khác chút nào!"},
            {"id": "nh3_4_d_2", "role": "白家月", "chinese": "是啊，除了房间特别干净舒适以外，院子里还种着竹子和石榴树，非常有中国传统特色。", "pinyin": "Shì a, chúle fángjiān tèbié gānjìng shūshì yǐwài, yuànzi lǐ hái zhòng zhe zhúzi hé shíliushù, fēicháng yǒu Zhōngguó chuántǒng tèsè.", "vietnamese": "Đúng thế, ngoài phòng ốc vô cùng sạch sẽ tiện nghi ra, trong sân còn trồng cả trúc và cây lựu, đậm đà phong vị truyền thống Trung Hoa."},
            {"id": "nh3_4_d_3", "role": "安妮", "chinese": "前台的服务员也都特别热情，住在这里感觉像住在朋友家里一样温馨。", "pinyin": "Qiántái de fúwùyuán yě dōu tèbié rèqíng, zhù zài zhèlǐ gǎnjué xiàng zhù zài péngyou jiā lǐ yíyàng wēnxīn.", "vietnamese": "Nhân viên lễ tân cũng đều hết sức niềm nở, ở đây cảm giác ấm cúng y như ở nhà bạn bè vậy."}
        ],
        "readingPassage": {
            "title": "北京胡同里的特色客栈 (Khách sạn phong cách trong ngõ nhỏ Bắc Kinh)",
            "content": "安妮这次来北京选择了一家坐落在老胡同里的传统四合院宾馆。这家宾馆跟现代化的高楼大厦酒店完全不一样，它保留了老北京青砖红瓦的古典风貌。庭院里绿树成荫，红灯笼高高挂起。除了提供现代化的卫浴设施和高速网络以外，宾馆每天早晨还免费为客人们准备热腾腾的豆汁、焦圈和香浓的豆浆。住在这里的各国旅客围坐在院子里品茶聊天，大家都对这种独特深厚的文化氛围赞不绝口。",
            "pinyin": "Ānnī zhè cì lái Běijīng xuǎnzé le yì jiā zuòluò zài lǎo hútòng lǐ de chuántǒng sìhéyuàn bīnguǎn. Zhè jiā bīnguǎn gēn xiàndàihuà de gāolóu-dàshà jiǔdiàn wánquán bù yíyàng, tā bǎoliú le lǎo Běijīng qīngzhuān-hóngwǎ de gǔdiǎn fēngmào. Tíngyuàn lǐ lǜshù-chéngyīn, hóng dēnglong gāogāo guà qǐ. Chúle tígōng xiàndàihuà de wèiyù shèshī hé gāosù wǎngluò yǐwài, bīnguǎn měitiān zǎochén hái miǎnfèi wèi kèrénmen zhǔnbèi rèténgténg de dòuzhī, jiāoquān hé xiāngnóng de dòujiāng. Zhù zài zhèlǐ de gèguó lǚkè wéizuò zài yuànzi lǐ pǐn chá liáotiān, dàjiā dōu duì zhè zhǒng dútè shēnhòu de wénhuà fēnwéi zàn-bù-jué-kǒu.",
            "vietnamese": "Annie chuyến này đến Bắc Kinh đã chọn một khách sạn tứ hợp viện truyền thống nằm sâu trong ngõ nhỏ cổ xưa. Khách sạn này hoàn toàn khác biệt với những khách sạn nhà cao tầng hiện đại, nó lưu giữ nguyên vẹn nét đẹp cổ điển ngói đỏ gạch xanh của Bắc Kinh xưa. Sân vườn rợp bóng cây xanh, lồng đèn đỏ treo cao rực rỡ. Ngoài việc cung cấp tiện nghi phòng tắm hiện đại và mạng tốc độ cao, mỗi sáng khách sạn còn chu đáo chuẩn bị sữa đậu, bánh quẩy giòn thơm bốc khói nghi ngút cho du khách. Du khách đến từ các nước ngồi quây quần trong sân nhâm nhi tách trà trò chuyện, ai nấy đều không tiếc lời khen ngợi không gian văn hóa đậm đà độc đáo này."
        },
        "grammarNotes": [
            "1. Cấu trúc so sánh (9) 'A 跟 B 一样 / 不一样': Biểu thị hai đối tượng giống nhau hoặc khác nhau (Ví dụ: 这家宾馆跟别的不一样 - Khách sạn này không giống các khách sạn khác; 他跟他哥哥一样高 - Anh ấy cao bằng anh trai).",
            "2. Cấu trúc cố định '除了……（以外），……都 / 还 / 也……': Biểu thị ngoại trừ hoặc bổ sung (Ví dụ: 除了小李，大家都来了 - Trừ Tiểu Lý ra, mọi người đều đã đến; 除了汉语，他还会说法语 - Ngoài tiếng Trung, anh ấy còn biết nói tiếng Pháp).",
            "3. Cấu trúc phủ định tuyệt đối '……也都 + 不 / 没……': (Ví dụ: 他一句中文也没说 - Cậu ấy chẳng nói câu tiếng Trung nào cả)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_4_lis_1",
                "audioText": "男：这家宾馆怎么样？女：除了房间有点儿小以外，别的都很让人满意。",
                "question": "这家宾馆有什么缺点？(Khách sạn này có nhược điểm gì?)",
                "questionPinyin": "Zhè jiā bīnguǎn yǒu shénme quēdiǎn?",
                "options": ["服务不好", "房间有点儿小", "环境很吵"],
                "answerIndex": 1,
                "explanation": "Người nữ nói: '除了房间有点儿小以外' (Ngoại trừ phòng hơi nhỏ một chút ra)."
            },
            {
                "id": "nh3_4_lis_2",
                "audioText": "女：你觉得这家店的面条味道如何？男：跟我妈妈做的一样好吃！",
                "question": "男的觉得面条怎么样？(Người nam thấy món mì thế nào?)",
                "questionPinyin": "Nán de juéde miàntiáo zěnmeyàng?",
                "options": ["太咸了", "不好吃", "跟妈妈做的一样好吃"],
                "answerIndex": 2,
                "explanation": "Người nam so sánh: '跟我妈妈做的一样好吃' (Ngon y như mẹ tôi nấu)."
            }
        ]
    },
    {
        "lessonNumber": 5,
        "title": "这样的照片才好看",
        "titleVi": "Những bức ảnh như thế này mới đẹp",
        "titlePinyin": "Zhèyàng de zhàopiàn cái hǎokàn",
        "vocabulary": [
            {"id": "nh3_5_1", "hanzi": "照片", "pinyin": "zhàopiàn", "hanViet": "Chiếu Phiến", "meaning": "bức ảnh", "partOfSpeech": "d.từ"},
            {"id": "nh3_5_2", "hanzi": "拍照", "pinyin": "pāi zhào", "hanViet": "Phách Chiếu", "meaning": "chụp ảnh", "partOfSpeech": "cụm đg.từ"},
            {"id": "nh3_5_3", "hanzi": "照相机", "pinyin": "zhàoxiàngjī", "hanViet": "Chiếu Tương Cơ", "meaning": "máy ảnh", "partOfSpeech": "d.từ"},
            {"id": "nh3_5_4", "hanzi": "风景", "pinyin": "fēngjǐng", "hanViet": "Phong Cảnh", "meaning": "phong cảnh", "partOfSpeech": "d.từ"},
            {"id": "nh3_5_5", "hanzi": "角度", "pinyin": "jiǎodù", "hanViet": "Góc Độ", "meaning": "góc độ, góc chụp", "partOfSpeech": "d.từ"},
            {"id": "nh3_5_6", "hanzi": "阳光", "pinyin": "yángguāng", "hanViet": "Dương Quang", "meaning": "ánh nắng", "partOfSpeech": "d.từ"},
            {"id": "nh3_5_7", "hanzi": "清楚", "pinyin": "qīngchu", "hanViet": "Thanh Sở", "meaning": "rõ ràng, nét", "partOfSpeech": "t.từ"},
            {"id": "nh3_5_8", "hanzi": "笑容", "pinyin": "xiàoróng", "hanViet": "Tiếu Dung", "meaning": "nụ cười", "partOfSpeech": "d.từ"},
            {"id": "nh3_5_9", "hanzi": "站", "pinyin": "zhàn", "hanViet": "Trạm", "meaning": "đứng", "partOfSpeech": "đg.từ"},
            {"id": "nh3_5_10", "hanzi": "自然", "pinyin": "zìrán", "hanViet": "Tự Nhiên", "meaning": "tự nhiên", "partOfSpeech": "t.từ"}
        ],
        "dialogues": [
            {"id": "nh3_5_d_1", "role": "白家月", "chinese": "天中，你帮我拍的那几张照片洗出来了吗？拍得怎么样？", "pinyin": "Tiānzhōng, nǐ bāng wǒ pāi de nà jǐ zhāng zhàopiàn xǐ chūlái le ma? Pāi de zěnmeyàng?", "vietnamese": "Thiên Trung, mấy tấm ảnh bạn chụp giúp mình đã rửa ra chưa? Chụp thế nào?"},
            {"id": "nh3_5_d_2", "role": "陈天中", "chinese": "都在手机相册里呢！你看这张，阳光刚好照在你的侧脸上，笑得多自然啊！这样的照片才好看。", "pinyin": "Dōu zài shǒujī xiàngcè lǐ ne! Nǐ kàn zhè zhāng, yángguāng gānghǎo zhào zài nǐ de cèliǎn shang, xiào de duō zìrán a! Zhèyàng de zhàopiàn cái hǎokàn.", "vietnamese": "Đều nằm trong album ảnh điện thoại đây này! Cậu nhìn bức này xem, ánh nắng vừa khéo chiếu vào góc nghiêng khuôn mặt, cười tự nhiên biết bao! Những bức ảnh như thế này mới thực sự đẹp."},
            {"id": "nh3_5_d_3", "role": "白家月", "chinese": "哇，真的太棒了！你的摄影水平提高得真快，像专业摄影师一样。", "pinyin": "Wā, zhēn de tài bàng le! Nǐ de shèyǐng shuǐpíng tígāo de zhēn kuài, xiàng zhuānyè shèyǐngshī yíyàng.", "vietnamese": "Oa, tuyệt thật đấy! Tay nghề chụp ảnh của cậu tiến bộ nhanh quá, hệt như nhiếp ảnh gia chuyên nghiệp vậy."}
        ],
        "readingPassage": {
            "title": "颐和园的秋日镜头 (Ống kính ngày thu ở Di Hòa Viên)",
            "content": "周末陈天中和白家月相约去颐和园游玩拍照。秋天的昆明湖碧波荡漾，万寿山上红叶满枝，风景美不胜收。天中手里拿着一台新买的单反照相机，教家月如何寻找最佳的光线与角度。他说拍照时人不要呆呆地站着，走动起来捕捉抓拍的笑容才是最鲜活的。在十七孔桥边，天中为家月拍下了几十张充满青春活力的优美瞬间。湖面上漂着几只彩色游船，岸边的垂柳在微风中轻轻摇曳，每一张照片都像一幅美丽的油画。",
            "pinyin": "Zhōumò Chén Tiānzhōng hé Bái Jiāyuè xiāngyuē qù Yíhéyuán yóuwán pāizhào. Qiūtiān de Kūnmíng Hú bìbō-dàngyàng, Wànshòushān shang hóngyè-mǎnzhī, fēngjǐng měi-bù-shèng-shōu. Tiānzhōng shǒulǐ ná zhe yì tái xīn mǎi de dānfǎn zhàoxiàngjī, jiāo Jiāyuè rúhé xúnzhǎo zuì jiā de guāngxiàn yǔ jiǎodù. Tā shuō pāizhào shí rén bú yào dāidāi de zhàn zhe, zǒudòng qǐlai bǔzhuō zhuāpāi de xiàoróng cái shì zuì xiānhuó de. Zài Shíqīkǒngqiáo biān, Tiānzhōng wèi Jiāyuè pāi xià le jǐ shí zhāng chōngmǎn qīngchūn huólì de yōuměi shùnjiān. Húmiàn shang piāo zhe jǐ zhī cǎisè yóuchuán, ànbiān de chuíliǔ zài wēifēng zhōng qīngqīng yáoyè, měi yì zhāng zhàopiàn dōu xiàng yì fú měilì de yóuhuà.",
            "vietnamese": "Cuối tuần Trần Thiên Trung và Bạch Gia Nguyệt hẹn nhau đi Di Hòa Viên ngắm cảnh và chụp ảnh. Mùa thu hồ Côn Minh sóng biếc dập dờn, núi Vạn Thọ rực rỡ lá phong đỏ, phong cảnh đẹp không sao xiết. Thiên Trung cầm trên tay chiếc máy ảnh cơ mới mua, chỉ cho Gia Nguyệt cách căn góc chụp và ánh sáng tối ưu nhất. Cậu chia sẻ rằng khi chụp ảnh không nên đứng đơ một chỗ, vừa đi dạo tự nhiên vừa bắt trọn nụ cười tươi mới là sống động nhất. Bên cầu Mười Bảy Nhịp, Thiên Trung đã chụp cho Gia Nguyệt hàng chục bức ảnh tràn đầy sức sống thanh xuân. Trên mặt hồ dập dềnh vài con thuyền du lịch rực rỡ, rặng liễu rủ bên bờ khẽ đung đưa trong gió thu, mỗi tấm hình đều đẹp như một bức tranh sơn dầu."
        },
        "grammarNotes": [
            "1. Bổ ngữ trình độ (2): 'Động từ + 得 + Tính từ/Trạng thái' (Ví dụ: 笑得真好看 - Cười thật đẹp; 拍得十分清楚 - Chụp rất rõ nét).",
            "2. Lượng từ trùng điệp (量词重叠): Lượng từ lặp lại dạng AA biểu thị 'mỗi', 'tất cả mọi cái' (Ví dụ: 张张照片 - Mỗi bức ảnh / bức nào cũng; 件件事 - Việc nào cũng).",
            "3. Câu tồn hiện (3): Cấu trúc 'Từ chỉ nơi chốn + Động từ + 着 + Danh từ' biểu thị sự tồn tại hoặc trạng thái tĩnh (Ví dụ: 湖面上漂着游船 - Trên mặt hồ đang trôi dập dềnh những chiếc thuyền; 门上贴着福字 - Trên cửa dán chữ Phúc)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_5_lis_1",
                "audioText": "女：天中，这张照片把我都拍模糊了。男：别急，太阳出来了，站在这棵银杏树下，我再给你拍一张！",
                "question": "男的接下来要做什么？(Người nam tiếp theo sẽ làm gì?)",
                "questionPinyin": "Nán de jiēxiàlai yào zuò shénme?",
                "options": ["去买照相机", "再给女的拍一张照片", "回学校休息"],
                "answerIndex": 1,
                "explanation": "Người nam nói: '我再给你拍一张' (Tôi chụp lại cho bạn một tấm nữa)."
            },
            {
                "id": "nh3_5_lis_2",
                "audioText": "男：你拍的风景照张张都像画一样美。女：哪里哪里，主要是这里的秋色太迷人了。",
                "question": "男的在夸赞女的什么？(Người nam đang khen ngợi người nữ điều gì?)",
                "questionPinyin": "Nán de zài kuāzàn nǚ de shénme?",
                "options": ["衣服好看", "照相技术高超", "唱歌好听"],
                "answerIndex": 1,
                "explanation": "Người nam khen ngợi ảnh chụp đẹp: '你拍的风景照张张都像画一样美'."
            }
        ]
    },
    {
        "lessonNumber": 6,
        "title": "高铁上还可以点外卖",
        "titleVi": "Trên tàu cao tốc vẫn có thể đặt đồ ăn giao tận nơi",
        "titlePinyin": "Gāotiě shang hái kěyǐ diǎn wàimài",
        "vocabulary": [
            {"id": "nh3_6_1", "hanzi": "高铁", "pinyin": "gāotiě", "hanViet": "Cao Thiết", "meaning": "tàu cao tốc", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_2", "hanzi": "外卖", "pinyin": "wàimài", "hanViet": "Ngoại Mại", "meaning": "đồ ăn giao tận nơi", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_3", "hanzi": "车厢", "pinyin": "chēxiāng", "hanViet": "Xa Sương", "meaning": "toa tàu, toa xe", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_4", "hanzi": "座位", "pinyin": "zuòwèi", "hanViet": "Tọa Vị", "meaning": "chỗ ngồi", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_5", "hanzi": "准时", "pinyin": "zhǔnshí", "hanViet": "Chuẩn Thời", "meaning": "đúng giờ", "partOfSpeech": "t.từ / phó.từ"},
            {"id": "nh3_6_6", "hanzi": "速度", "pinyin": "sùdù", "hanViet": "Tốc Độ", "meaning": "tốc độ", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_7", "hanzi": "沿途", "pinyin": "yántú", "hanViet": "Duyên Đồ", "meaning": "dọc đường đi", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_8", "hanzi": "配送", "pinyin": "pèisòng", "hanViet": "Phối Tống", "meaning": "giao hàng, chuyển phát", "partOfSpeech": "đg.từ"},
            {"id": "nh3_6_9", "hanzi": "乘务员", "pinyin": "chéngwùyuán", "hanViet": "Thừa Vụ Viên", "meaning": "tiếp viên tàu/máy bay", "partOfSpeech": "d.từ"},
            {"id": "nh3_6_10", "hanzi": "如果", "pinyin": "rúguǒ", "hanViet": "Như Quả", "meaning": "nếu như", "partOfSpeech": "liên.từ"}
        ],
        "dialogues": [
            {"id": "nh3_6_d_1", "role": "李文", "chinese": "乘务员，请问我们什么时候能吃上预订的高铁外卖？", "pinyin": "Chéngwùyuán, qǐngwèn wǒmen shénme shíhou néng chī shàng yùdìng de gāotiě wàimài?", "vietnamese": "Tiếp viên ơi, xin hỏi khi nào chúng tôi có thể nhận được đồ ăn đã đặt trước trên tàu cao tốc ạ?"},
            {"id": "nh3_6_d_2", "role": "乘务员", "chinese": "列车一到了济南西站，沿途餐馆就会把热饭菜送上车，我们马上给您送到座位上。", "pinyin": "Lièchē yì dào le Jǐnán Xīzhàn, yántú cānguǎn jiù huì bǎ rè fàncài sòng shàng chē, wǒmen mǎshàng gěi nín sòng dào zuòwèi shang.", "vietnamese": "Đoàn tàu vừa đến ga Tế Nam Tây, nhà hàng dọc đường sẽ đưa cơm canh nóng sốt lên tàu, chúng tôi sẽ lập tức mang đến tận chỗ ngồi cho quý khách ngay ạ."},
            {"id": "nh3_6_d_3", "role": "李文", "chinese": "太神奇了！列车时速三百多公里，居然还能吃到沿途城市的招牌美食！", "pinyin": "Tài shénqí le! Lièchē shísù sānbǎi duō gōnglǐ, jūrán hái néng chī dào yántú chéngshì de zhāopai měishí!", "vietnamese": "Kỳ diệu thật đấy! Tàu chạy với vận tốc hơn 300 km/h mà vẫn thưởng thức được món ngon đặc sản của thành phố dọc tuyến đường!"}
        ],
        "readingPassage": {
            "title": "飞驰高铁上的舌尖之旅 (Hành trình ẩm thực trên đoàn tàu cao tốc)",
            "content": "中国的高速铁路不仅以高速和平稳闻名于世，其人性化的智能服务更让旅客赞叹不已。在手机APP上购买高铁车票后，旅客可以直接选择“列车订餐”服务。系统会根据列车经过的站点，提供沿途各大名城的特色菜肴。比如列车停靠南京南站时可以吃到盐水鸭，停靠武汉站时可以吃上热气腾腾的武汉热干面。一到指定车站，外卖人员准时把餐食送到车厢对接处，乘务员再送到座位前。该吃饭的时候吃到热菜，既准时又美味，让漫长的旅途充满了温馨的期待。",
            "pinyin": "Zhōngguó de gāosù tiělù bùjǐn yǐ gāosù hé píngwěn wénmíng yú shì, qí rénxìnghuà de zhìnéng fúwù gèng ràng lǚkè zàntàn-bùyǐ. Zài shǒujī APP shang gòumǎi gāotiě chēpiào hòu, lǚkè kěyǐ zhíjiē xuǎnzé 'lièchē dìngcān' fúwù. Xìtǒng huì gēnjù lièchē jīngguò de zhàndiǎn, tígōng yántú gè dà míngchéng de tèsè càiyáo. Bǐrú lièchē tíngkào Nánjīng Nánzhàn shí kěyǐ chī dào yánshuǐyā, tíngkào Wǔhànzhàn shí kěyǐ chī shàng rèqì-téngténg de Wǔhàn règānmiàn. Yì dào zhǐdìng chēzhàn, wàimài rényuán zhǔnshí bǎ cānshí sòng dào chēxiāng duìjiēchù, chéngwùyuán zài sòng dào zuòwèi qián. Gāi chīfàn de shíhou chī dào rè cài, jì zhǔnshí yòu měiwèi, ràng màncháng de lǚtú chōngmǎn le wēnxīn de qīdài.",
            "vietnamese": "Đường sắt cao tốc Trung Quốc không những nổi tiếng khắp thế giới bởi tốc độ vượt trội và độ êm ái mà dịch vụ thông minh giàu tính nhân văn còn khiến du khách trầm trồ khen ngợi. Sau khi mua vé tàu trên ứng dụng di động, hành khách có thể trực tiếp chọn dịch vụ 'Đặt cơm trên tàu'. Hệ thống sẽ căn cứ vào các nhà ga đoàn tàu chạy qua để cung cấp các món ăn đặc sản của từng danh thành dọc tuyến đường. Chẳng hạn khi tàu đỗ ga Nam Kinh Nam có thể ăn món vịt muối, dừng ga Vũ Hán có thể thưởng thức món mì khô nóng Vũ Hán bốc khói ngào ngạt. Vừa đến nhà ga chỉ định, nhân viên giao nhận đúng giờ chuyển đồ ăn đến cửa toa xe để tiếp viên mang đến tận ghế. Đến giờ ăn được thưởng thức cơm dẻo canh nóng, vừa đúng giờ vừa ngon miệng, khiến hành trình dài tràn ngập sự ấm áp và thú vị."
        },
        "grammarNotes": [
            "1. Câu ghép rút gọn '……了……就……': Biểu thị hai hành động xảy ra nối tiếp nhau rất nhanh chóng (Ví dụ: 列车一停他就下车了 - Tàu vừa dừng là anh ấy xuống xe ngay).",
            "2. Cấu trúc cố định '该……了': Biểu thị đã đến lúc phải làm việc gì đó (Ví dụ: 时间不早了，该吃午饭了 - Không còn sớm nữa, đến giờ ăn trưa rồi; 该出发了 - Đến lúc lên đường rồi).",
            "3. Câu ghép giả thiết '如果……，就……': Biểu thị mối quan hệ điều kiện giả thiết và kết quả (Ví dụ: 如果明天不下雨，我们就去长城 - Nếu ngày mai trời không mưa, chúng ta sẽ đi Vạn Lý Trường Thành)."
        ],
        "listeningExercises": [
            {
                "id": "nh3_6_lis_1",
                "audioText": "男：在高铁上也能点肯德基和中餐外卖吗？女：当然可以，用手机软件提前下单，到站就送上车了。",
                "question": "怎么在高铁上点外卖？(Đặt đồ ăn trên tàu cao tốc bằng cách nào?)",
                "questionPinyin": "Zěnme zài gāotiě shang diǎn wàimài?",
                "options": ["大声喊乘务员", "用手机软件提前下单", "自己下车去餐馆买"],
                "answerIndex": 1,
                "explanation": "Người nữ hướng dẫn: '用手机软件提前下单' (Đặt trước bằng ứng dụng điện thoại)."
            },
            {
                "id": "nh3_6_lis_2",
                "audioText": "女：十二点了，该去餐车吃午饭了吧？男：我刚才点的高铁外卖快送到了，就在座位上吃吧。",
                "question": "男的打算在哪里吃午饭？(Người nam dự định ăn trưa ở đâu?)",
                "questionPinyin": "Nán de dǎsuàn zài nǎlǐ chī wǔfàn?",
                "options": ["餐车", "自己座位上", "下车去吃"],
                "answerIndex": 1,
                "explanation": "Người nam trả lời: '就在座位上吃吧' (Ăn ngay tại chỗ ngồi thôi)."
            }
        ]
    }
]

print(f"Loaded Lessons 1 to 6 ({len(lessons_1_to_6)} lessons)")
