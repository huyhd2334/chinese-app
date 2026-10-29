import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

HSK3_LESSONS_DATA = [
    {
        "lessonNumber": 1,
        "title": "我们去机场接你们",
        "titleVi": "Anh chị sẽ đến sân bay đón các em",
        "titlePinyin": "Wǒmen qù jīchǎng jiē nǐmen",
        "vocabulary": [
            {"id": "nh3_1_1", "hanzi": "接", "pinyin": "jiē", "hanViet": "Tiếp", "meaning": "đón, nhận", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_2", "hanzi": "行李", "pinyin": "xíngli", "hanViet": "Hành Lý", "meaning": "hành lý", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_3", "hanzi": "领取", "pinyin": "lǐngqǔ", "hanViet": "Lãnh Thủ", "meaning": "nhận lấy", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_4", "hanzi": "丢失", "pinyin": "diūshī", "hanViet": "Đâu Thất", "meaning": "thất lạc, mất", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_5", "hanzi": "应该", "pinyin": "yīnggāi", "hanViet": "Ưng Cai", "meaning": "nên, chắc là", "partOfSpeech": "đg.từ năng nguyện"},
            {"id": "nh3_1_6", "hanzi": "站", "pinyin": "zhàn", "hanViet": "Trạm", "meaning": "đứng, trạm dừng", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_7", "hanzi": "中间", "pinyin": "zhōngjiān", "hanViet": "Trung Gian", "meaning": "ở giữa", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_8", "hanzi": "短", "pinyin": "duǎn", "hanViet": "Đoản", "meaning": "ngắn", "partOfSpeech": "t.từ"},
            {"id": "nh3_1_9", "hanzi": "发型", "pinyin": "fàxíng", "hanViet": "Phát Hình", "meaning": "kiểu tóc", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_10", "hanzi": "发现", "pinyin": "fāxiàn", "hanViet": "Phát Hiện", "meaning": "phát hiện, nhận ra", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_11", "hanzi": "不见", "pinyin": "bújiàn", "hanViet": "Bất Kiến", "meaning": "biến mất, không thấy", "partOfSpeech": "đg.từ"},
            {"id": "nh3_1_12", "hanzi": "帮助", "pinyin": "bāngzhù", "hanViet": "Bang Trợ", "meaning": "giúp đỡ", "partOfSpeech": "đg.từ / d.từ"},
            {"id": "nh3_1_13", "hanzi": "照片", "pinyin": "zhàopiàn", "hanViet": "Chiếu Phiến", "meaning": "bức ảnh", "partOfSpeech": "d.từ"},
            {"id": "nh3_1_14", "hanzi": "带", "pinyin": "dài", "hanViet": "Đái", "meaning": "mang theo, dẫn dắt", "partOfSpeech": "đg.từ"}
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
                "options": ["很严格", "很累", "很年轻热情"],
                "answerIndex": 2,
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
    }
]

# We will build all 18 lessons programmatically
print(f"Base data initialized: {len(HSK3_LESSONS_DATA)} lessons")
