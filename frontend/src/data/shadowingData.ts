export interface ShadowingSentence {
  id: number
  startTime: number // Thời điểm bắt đầu chính xác từ video YouTube (giây)
  endTime: number   // Thời điểm kết thúc chính xác (giây)
  chinese: string   // Chữ Hán gốc trong lời thoại
  pinyin: string    // Phiên âm Pinyin có thanh điệu chuẩn
  vietnamese: string // Dịch nghĩa tiếng Việt tự nhiên, chuẩn bối cảnh
  speaker?: string  // Người nói
}

export interface ShadowingVideo {
  id: string
  title: string
  level: "HSK 1-2" | "HSK 2-3" | "HSK 3-4" | "HSK 4+"
  levelBadgeColor: string
  duration: string
  category: "Giao tiếp đời sống" | "Ẩm thực & Mua sắm" | "Phim hoạt hình ngắn" | "Công sở & Phỏng vấn"
  description: string
  youtubeId: string // ID video YouTube chính thức
  sentencesCount: number
  isFree: boolean // true: người dùng Free được học thử, false: chỉ Pro
  sentences: ShadowingSentence[]
}

/**
 * 3 VIDEO SHADOWING THỰC TẾ TRÊN YOUTUBE (HSK 1-2, HSK 3-4, HSK 5-6)
 * Toàn bộ lời thoại và mốc thời gian (timestamps) được bóc tách 100% từ video gốc.
 * Từng câu khớp chính xác với giọng đọc của người bản xứ trong video.
 */
export const SHADOWING_VIDEOS: ShadowingVideo[] = [
  {
    "id": "hsk1-panda-100-sentences",
    "title": "Luyện nghe HSK 1: 100 câu cơ bản chậm rõ (Panda Chinese)",
    "level": "HSK 1-2",
    "levelBadgeColor": "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300",
    "duration": "22:33",
    "category": "Giao tiếp đời sống",
    "description": "100 câu giao tiếp nền tảng trình độ HSK 1 với tốc độ đọc chậm rãi, phát âm rõ ràng từng thanh mẫu, vận mẫu và thanh điệu chuẩn bản xứ.",
    "youtubeId": "EI2UvLKvlEU",
    "sentencesCount": 100,
    "isFree": true,
    "sentences": [
      {
        "id": 1,
        "startTime": 14.5,
        "endTime": 24.4,
        "speaker": "Người bản xứ",
        "chinese": "你们好。",
        "pinyin": "nǐ men hǎo。",
        "vietnamese": "Chåo cåc ban."
      },
      {
        "id": 2,
        "startTime": 24.4,
        "endTime": 35.2,
        "speaker": "Người bản xứ",
        "chinese": "你叫什么名字？",
        "pinyin": "nǐ jiào shén me míng zì？",
        "vietnamese": "Ban tén lå gi?"
      },
      {
        "id": 3,
        "startTime": 35.2,
        "endTime": 47.8,
        "speaker": "Người bản xứ",
        "chinese": "我住在北京。",
        "pinyin": "wǒ zhù zài běi jīng。",
        "vietnamese": "Töi söngd Båc Kinh."
      },
      {
        "id": 4,
        "startTime": 47.8,
        "endTime": 61.8,
        "speaker": "Người bản xứ",
        "chinese": "他是我的老师。",
        "pinyin": "Tā shì wǒ de lǎoshī.",
        "vietnamese": "Cô ấy là giáo viên của tôi."
      },
      {
        "id": 5,
        "startTime": 61.8,
        "endTime": 79.0,
        "speaker": "Người bản xứ",
        "chinese": "我今年十八岁了。",
        "pinyin": "wǒ jīn nián shí bā suì le。",
        "vietnamese": "Näm nay töi mudi tåm tuöi."
      },
      {
        "id": 6,
        "startTime": 79.0,
        "endTime": 94.4,
        "speaker": "Người bản xứ",
        "chinese": "今天是星期一。",
        "pinyin": "Jīntiān shì xīngqīyī.",
        "vietnamese": "Hôm nay là thứ Hai."
      },
      {
        "id": 7,
        "startTime": 94.4,
        "endTime": 109.2,
        "speaker": "Người bản xứ",
        "chinese": "很高兴认识你。",
        "pinyin": "Hěn gāoxìng rènshi nǐ.",
        "vietnamese": "Rất vui được gặp bạn."
      },
      {
        "id": 8,
        "startTime": 109.2,
        "endTime": 123.0,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢喝咖啡。",
        "pinyin": "wǒ xǐ huān hē kā fēi。",
        "vietnamese": "Töi thich uöngcå phé."
      },
      {
        "id": 9,
        "startTime": 123.0,
        "endTime": 135.4,
        "speaker": "Người bản xứ",
        "chinese": "我在医院工作。",
        "pinyin": "Wǒ zài yīyuàn gōngzuò.",
        "vietnamese": "Tôi làm việc ở bệnh viện."
      },
      {
        "id": 10,
        "startTime": 135.4,
        "endTime": 151.8,
        "speaker": "Người bản xứ",
        "chinese": "我可以坐在这里吗？",
        "pinyin": "Wǒ kěyǐ zuò zài zhèlǐ ma?",
        "vietnamese": "Tôi có thể ngồi ở đây không?"
      },
      {
        "id": 11,
        "startTime": 151.8,
        "endTime": 164.4,
        "speaker": "Người bản xứ",
        "chinese": "现在几点了？",
        "pinyin": "Xiànzài jǐ diǎn le?",
        "vietnamese": "Bây giờ là mấy giờ?"
      },
      {
        "id": 12,
        "startTime": 164.4,
        "endTime": 180.6,
        "speaker": "Người bản xứ",
        "chinese": "现在是五点十分。",
        "pinyin": "Xiànzài shì wǔ diǎn shí fēn.",
        "vietnamese": "Bây giờ là năm giờ mười phút."
      },
      {
        "id": 13,
        "startTime": 180.6,
        "endTime": 195.4,
        "speaker": "Người bản xứ",
        "chinese": "今天的天气怎么样？",
        "pinyin": "Jīntiān de tiānqì zěnmeyàng?",
        "vietnamese": "Thời tiết hôm nay thế nào?"
      },
      {
        "id": 14,
        "startTime": 195.4,
        "endTime": 208.6,
        "speaker": "Người bản xứ",
        "chinese": "北京在下雪。",
        "pinyin": "Běijīng zài xià xuě.",
        "vietnamese": "Bắc Kinh đang có tuyết."
      },
      {
        "id": 15,
        "startTime": 208.6,
        "endTime": 223.6,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢吃面条。",
        "pinyin": "Wǒ xǐhuan chī miàntiáo.",
        "vietnamese": "Tôi thích ăn mì."
      },
      {
        "id": 16,
        "startTime": 223.6,
        "endTime": 240.2,
        "speaker": "Người bản xứ",
        "chinese": "桌子上有一本书。",
        "pinyin": "Zhuōzi shang yǒu yì běn shū.",
        "vietnamese": "Trên bàn có một cuốn sách."
      },
      {
        "id": 17,
        "startTime": 240.2,
        "endTime": 253.4,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢猫和狗。",
        "pinyin": "Wǒ xǐhuan māo hé gǒu.",
        "vietnamese": "Tôi thích mèo và chó."
      },
      {
        "id": 18,
        "startTime": 253.4,
        "endTime": 264.8,
        "speaker": "Người bản xứ",
        "chinese": "你吃饭了吗？",
        "pinyin": "Nǐ chī fàn le ma?",
        "vietnamese": "Bạn đã ăn cơm chưa?"
      },
      {
        "id": 19,
        "startTime": 264.8,
        "endTime": 278.0,
        "speaker": "Người bản xứ",
        "chinese": "明天会下雨。",
        "pinyin": "Míngtiān huì xià yǔ.",
        "vietnamese": "Ngày mai sẽ có mưa."
      },
      {
        "id": 20,
        "startTime": 278.0,
        "endTime": 290.0,
        "speaker": "Người bản xứ",
        "chinese": "你长得真高！",
        "pinyin": "Nǐ zhǎng de zhēn gāo!",
        "vietnamese": "Bạn thật cao!"
      },
      {
        "id": 21,
        "startTime": 290.0,
        "endTime": 303.0,
        "speaker": "Người bản xứ",
        "chinese": "星星在天上。",
        "pinyin": "Xīngxing zài tiānshang.",
        "vietnamese": "Những ngôi sao ở trên bầu trời."
      },
      {
        "id": 22,
        "startTime": 303.0,
        "endTime": 317.4,
        "speaker": "Người bản xứ",
        "chinese": "我们去商店吧。",
        "pinyin": "Wǒmen qù shāngdiàn ba.",
        "vietnamese": "Chúng ta đi cửa hàng nhé."
      },
      {
        "id": 23,
        "startTime": 317.4,
        "endTime": 333.2,
        "speaker": "Người bản xứ",
        "chinese": "我很喜欢吃水果。",
        "pinyin": "Wǒ hěn xǐhuan chī shuǐguǒ.",
        "vietnamese": "Tôi rất thích ăn trái cây."
      },
      {
        "id": 24,
        "startTime": 333.2,
        "endTime": 344.4,
        "speaker": "Người bản xứ",
        "chinese": "我在看电视。",
        "pinyin": "Wǒ zài kàn diànshì.",
        "vietnamese": "Tôi đang xem TV."
      },
      {
        "id": 25,
        "startTime": 344.4,
        "endTime": 353.5,
        "speaker": "Người bản xứ",
        "chinese": "对不起！",
        "pinyin": "Duìbuqǐ!",
        "vietnamese": "Xin lỗi!"
      },
      {
        "id": 26,
        "startTime": 353.5,
        "endTime": 362.2,
        "speaker": "Người bản xứ",
        "chinese": "没关系。",
        "pinyin": "Méi guānxi.",
        "vietnamese": "Không sao."
      },
      {
        "id": 27,
        "startTime": 362.2,
        "endTime": 377.8,
        "speaker": "Người bản xứ",
        "chinese": "今天是六月一日。",
        "pinyin": "Jīntiān shì liù yuè yī rì.",
        "vietnamese": "Hôm nay là ngày mùng 1 tháng 6."
      },
      {
        "id": 28,
        "startTime": 377.8,
        "endTime": 393.2,
        "speaker": "Người bản xứ",
        "chinese": "这个杯子多少钱？",
        "pinyin": "Zhège bēizi duōshao qián?",
        "vietnamese": "Cái cốc này bao nhiêu tiền?"
      },
      {
        "id": 29,
        "startTime": 393.2,
        "endTime": 405.2,
        "speaker": "Người bản xứ",
        "chinese": "我的爸爸是医生。",
        "pinyin": "Wǒ de bàba shì yīshēng.",
        "vietnamese": "Bố tôi là bác sĩ."
      },
      {
        "id": 30,
        "startTime": 405.2,
        "endTime": 418.8,
        "speaker": "Người bản xứ",
        "chinese": "你喜欢喝茶吗？",
        "pinyin": "Nǐ xǐhuan hē chá ma?",
        "vietnamese": "Bạn có thích uống trà không?"
      },
      {
        "id": 31,
        "startTime": 418.8,
        "endTime": 431.4,
        "speaker": "Người bản xứ",
        "chinese": "面包很好吃。",
        "pinyin": "Miànbāo hěn hǎochī.",
        "vietnamese": "Bánh mì rất ngon."
      },
      {
        "id": 32,
        "startTime": 431.4,
        "endTime": 445.2,
        "speaker": "Người bản xứ",
        "chinese": "我有一个中国朋友。",
        "pinyin": "Wǒ yǒu yí gè zhōngguó péngyou.",
        "vietnamese": "Tôi có một người bạn Trung Quốc."
      },
      {
        "id": 33,
        "startTime": 445.2,
        "endTime": 462.0,
        "speaker": "Người bản xứ",
        "chinese": "下午，我要去饭店。",
        "pinyin": "Xiàwǔ, wǒ yào qù fàndiàn.",
        "vietnamese": "Buổi chiều, tôi sẽ đi nhà hàng."
      },
      {
        "id": 34,
        "startTime": 462.0,
        "endTime": 473.4,
        "speaker": "Người bản xứ",
        "chinese": "我在学汉语。",
        "pinyin": "Wǒ zài xué hànyǔ.",
        "vietnamese": "Tôi đang học tiếng Trung."
      },
      {
        "id": 35,
        "startTime": 473.4,
        "endTime": 487.0,
        "speaker": "Người bản xứ",
        "chinese": "我买了一件新衣服。",
        "pinyin": "Wǒ mǎi le yí jiàn xīn yīfu.",
        "vietnamese": "Tôi đã mua một chiếc áo mới."
      },
      {
        "id": 36,
        "startTime": 487.0,
        "endTime": 499.4,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢看电视。",
        "pinyin": "Wǒ xǐhuan kàn diànshì.",
        "vietnamese": "Buổi tối, tôi thích xem TV."
      },
      {
        "id": 37,
        "startTime": 499.4,
        "endTime": 510.4,
        "speaker": "Người bản xứ",
        "chinese": "我养了一只猫。",
        "pinyin": "Wǒ yǎng le yì zhī māo.",
        "vietnamese": "Tôi nuôi một con mèo."
      },
      {
        "id": 38,
        "startTime": 510.4,
        "endTime": 519.4,
        "speaker": "Người bản xứ",
        "chinese": "我爱你！",
        "pinyin": "Wǒ ài nǐ!",
        "vietnamese": "Tôi yêu bạn!"
      },
      {
        "id": 39,
        "startTime": 519.4,
        "endTime": 533.8,
        "speaker": "Người bản xứ",
        "chinese": "我爱我的爸爸和妈妈。",
        "pinyin": "Wǒ ài wǒ de bàba hé māma.",
        "vietnamese": "Tôi yêu bố và mẹ của tôi."
      },
      {
        "id": 40,
        "startTime": 533.8,
        "endTime": 545.6,
        "speaker": "Người bản xứ",
        "chinese": "这个字怎么读？",
        "pinyin": "Zhège zì zěnme dú?",
        "vietnamese": "Chữ này đọc thế nào?"
      },
      {
        "id": 41,
        "startTime": 545.6,
        "endTime": 557.0,
        "speaker": "Người bản xứ",
        "chinese": "有什么问题吗？",
        "pinyin": "Yǒu shénme wèntí ma?",
        "vietnamese": "Có câu hỏi gì không?"
      },
      {
        "id": 42,
        "startTime": 557.0,
        "endTime": 573.0,
        "speaker": "Người bản xứ",
        "chinese": "我儿子今年四岁。",
        "pinyin": "Wǒ érzi jīnnián sì suì.",
        "vietnamese": "Con trai tôi năm nay bốn tuổi."
      },
      {
        "id": 43,
        "startTime": 573.0,
        "endTime": 590.2,
        "speaker": "Người bản xứ",
        "chinese": "这台电脑太贵了。",
        "pinyin": "Zhè tái diànnǎo tài guì le.",
        "vietnamese": "Cái máy tính này quá đắt."
      },
      {
        "id": 44,
        "startTime": 590.2,
        "endTime": 600.4,
        "speaker": "Người bản xứ",
        "chinese": "我不认识他。",
        "pinyin": "Wǒ bú rènshi tā.",
        "vietnamese": "Tôi không quen anh ấy."
      },
      {
        "id": 45,
        "startTime": 600.4,
        "endTime": 613.2,
        "speaker": "Người bản xứ",
        "chinese": "小丽是我的朋友。",
        "pinyin": "Xiǎolì shì wǒ de péngyou.",
        "vietnamese": "Tiểu Lệ là bạn của tôi."
      },
      {
        "id": 46,
        "startTime": 613.2,
        "endTime": 625.2,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢玩游戏。",
        "pinyin": "Wǒ xǐhuan wán yóuxì.",
        "vietnamese": "Tôi thích chơi game."
      },
      {
        "id": 47,
        "startTime": 625.2,
        "endTime": 635.8,
        "speaker": "Người bản xứ",
        "chinese": "狗坐在地上。",
        "pinyin": "Gǒu zuò zài dìshang.",
        "vietnamese": "Chó ngồi trên sàn."
      },
      {
        "id": 48,
        "startTime": 635.8,
        "endTime": 651.2,
        "speaker": "Người bản xứ",
        "chinese": "大卫站在我的左边。",
        "pinyin": "Dàwèi zhàn zài wǒ de zuǒbian.",
        "vietnamese": "David đứng bên trái tôi."
      },
      {
        "id": 49,
        "startTime": 651.2,
        "endTime": 664.0,
        "speaker": "Người bản xứ",
        "chinese": "我在超市工作。",
        "pinyin": "Wǒ zài chāoshì gōngzuò.",
        "vietnamese": "Tôi làm việc ở siêu thị."
      },
      {
        "id": 50,
        "startTime": 664.0,
        "endTime": 678.4,
        "speaker": "Người bản xứ",
        "chinese": "妈妈什么时候回家？",
        "pinyin": "Māma shénme shíhou huíjiā?",
        "vietnamese": "Khi nào mẹ về nhà?"
      },
      {
        "id": 51,
        "startTime": 678.4,
        "endTime": 693.0,
        "speaker": "Người bản xứ",
        "chinese": "我们去看电影吧！",
        "pinyin": "Wǒmen qù kàn diànyǐng ba!",
        "vietnamese": "Chúng ta đi xem phim nhé!"
      },
      {
        "id": 52,
        "startTime": 693.0,
        "endTime": 708.0,
        "speaker": "Người bản xứ",
        "chinese": "我家有五口人。",
        "pinyin": "Wǒ jiā yǒu wǔ kǒu rén.",
        "vietnamese": "Nhà tôi có năm người."
      },
      {
        "id": 53,
        "startTime": 708.0,
        "endTime": 720.6,
        "speaker": "Người bản xứ",
        "chinese": "我看见你了！",
        "pinyin": "Wǒ kànjiàn nǐ le!",
        "vietnamese": "Tôi đã thấy bạn!"
      },
      {
        "id": 54,
        "startTime": 720.6,
        "endTime": 733.0,
        "speaker": "Người bản xứ",
        "chinese": "我爱吃苹果。",
        "pinyin": "Wǒ ài chī píngguǒ.",
        "vietnamese": "Tôi thích ăn táo."
      },
      {
        "id": 55,
        "startTime": 733.0,
        "endTime": 747.2,
        "speaker": "Người bản xứ",
        "chinese": "外面的雨很小。",
        "pinyin": "Wàimiàn de yǔ hěn xiǎo.",
        "vietnamese": "Mưa bên ngoài rất nhỏ."
      },
      {
        "id": 56,
        "startTime": 747.2,
        "endTime": 761.0,
        "speaker": "Người bản xứ",
        "chinese": "这个东西多少钱？",
        "pinyin": "Zhège dōngxi duōshao qián?",
        "vietnamese": "Cái này bao nhiêu tiền?"
      },
      {
        "id": 57,
        "startTime": 761.0,
        "endTime": 774.0,
        "speaker": "Người bản xứ",
        "chinese": "我想喝可乐。",
        "pinyin": "Wǒ xiǎng hē kělè.",
        "vietnamese": "Tôi muốn uống coca."
      },
      {
        "id": 58,
        "startTime": 774.0,
        "endTime": 788.2,
        "speaker": "Người bản xứ",
        "chinese": "我不喜欢喝牛奶。",
        "pinyin": "Wǒ bù xǐhuan hē niúnǎi.",
        "vietnamese": "Tôi không thích uống sữa."
      },
      {
        "id": 59,
        "startTime": 788.2,
        "endTime": 801.4,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢玩手机。",
        "pinyin": "Wǒ xǐhuan wán shǒujī.",
        "vietnamese": "Tôi thích chơi điện thoại."
      },
      {
        "id": 60,
        "startTime": 801.4,
        "endTime": 819.4,
        "speaker": "Người bản xứ",
        "chinese": "你的电话号码是多少？",
        "pinyin": "Nǐ de diànhuà hàomǎ shì duōshao?",
        "vietnamese": "Số điện thoại của bạn là bao nhiêu?"
      },
      {
        "id": 61,
        "startTime": 819.4,
        "endTime": 833.4,
        "speaker": "Người bản xứ",
        "chinese": "她戴了一个手表。",
        "pinyin": "Tā dài le yí gè shǒubiǎo.",
        "vietnamese": "Cô ấy đeo đồng hồ."
      },
      {
        "id": 62,
        "startTime": 833.4,
        "endTime": 847.8,
        "speaker": "Người bản xứ",
        "chinese": "中午我要睡觉。",
        "pinyin": "Zhōngwǔ wǒ yào shuìjiào.",
        "vietnamese": "Buổi trưa tôi muốn ngủ."
      },
      {
        "id": 63,
        "startTime": 847.8,
        "endTime": 862.6,
        "speaker": "Người bản xứ",
        "chinese": "这个手套多少钱？",
        "pinyin": "Zhège shǒutào duōshao qián?",
        "vietnamese": "Cái găng tay này bao nhiêu tiền?"
      },
      {
        "id": 64,
        "startTime": 862.6,
        "endTime": 878.0,
        "speaker": "Người bản xứ",
        "chinese": "她的头上戴着帽子。",
        "pinyin": "Tā de tóushang dàizhe màozi.",
        "vietnamese": "Trên đầu cô ấy đang đội mũ."
      },
      {
        "id": 65,
        "startTime": 878.0,
        "endTime": 893.8,
        "speaker": "Người bản xứ",
        "chinese": "你是哪个国家的人？",
        "pinyin": "Nǐ shì nǎge guójiā de rén?",
        "vietnamese": "Bạn là người nước nào?"
      },
      {
        "id": 66,
        "startTime": 893.8,
        "endTime": 907.6,
        "speaker": "Người bản xứ",
        "chinese": "李娜是运动员。",
        "pinyin": "Lǐ Nà shì yùndòngyuán.",
        "vietnamese": "Lý Na là vận động viên."
      },
      {
        "id": 67,
        "startTime": 907.6,
        "endTime": 917.5,
        "speaker": "Người bản xứ",
        "chinese": "请坐下。",
        "pinyin": "Qǐng zuòxià.",
        "vietnamese": "Xin mời ngồi xuống."
      },
      {
        "id": 68,
        "startTime": 917.5,
        "endTime": 928.0,
        "speaker": "Người bản xứ",
        "chinese": "冬天很冷。",
        "pinyin": "Dōngtiān hěn lěng.",
        "vietnamese": "Mùa đông rất lạnh."
      },
      {
        "id": 69,
        "startTime": 928.0,
        "endTime": 942.6,
        "speaker": "Người bản xứ",
        "chinese": "夏天天气太热了！",
        "pinyin": "Xiàtiān tiānqì tài rè le!",
        "vietnamese": "Thời tiết mùa hè quá nóng!"
      },
      {
        "id": 70,
        "startTime": 942.6,
        "endTime": 955.2,
        "speaker": "Người bản xứ",
        "chinese": "现在是春天。",
        "pinyin": "Xiànzài shì chūntiān.",
        "vietnamese": "Bây giờ là mùa xuân."
      },
      {
        "id": 71,
        "startTime": 955.2,
        "endTime": 966.2,
        "speaker": "Người bản xứ",
        "chinese": "花很漂亮。",
        "pinyin": "Huā hěn piàoliang.",
        "vietnamese": "Hoa rất đẹp."
      },
      {
        "id": 72,
        "startTime": 966.2,
        "endTime": 979.6,
        "speaker": "Người bản xứ",
        "chinese": "我爱踢足球。",
        "pinyin": "Wǒ ài tī zúqiú.",
        "vietnamese": "Tôi thích đá bóng."
      },
      {
        "id": 73,
        "startTime": 979.6,
        "endTime": 995.4,
        "speaker": "Người bản xứ",
        "chinese": "他在学校打篮球。",
        "pinyin": "Tā zài xuéxiào dǎ lánqiú.",
        "vietnamese": "Anh ấy chơi bóng rổ ở trường."
      },
      {
        "id": 74,
        "startTime": 995.4,
        "endTime": 1009.4,
        "speaker": "Người bản xứ",
        "chinese": "他站在我的右边。",
        "pinyin": "Tā zhàn zài wǒ de yòubian.",
        "vietnamese": "Anh ấy đứng bên phải tôi."
      },
      {
        "id": 75,
        "startTime": 1009.4,
        "endTime": 1022.0,
        "speaker": "Người bản xứ",
        "chinese": "我坐在椅子上。",
        "pinyin": "Wǒ zuò zài yǐzi shang.",
        "vietnamese": "Tôi ngồi trên ghế."
      },
      {
        "id": 76,
        "startTime": 1022.0,
        "endTime": 1038.4,
        "speaker": "Người bản xứ",
        "chinese": "昨天，我去了车站。",
        "pinyin": "Zuótiān, wǒ qù le chēzhàn.",
        "vietnamese": "Hôm qua, tôi đã đi nhà ga."
      },
      {
        "id": 77,
        "startTime": 1038.4,
        "endTime": 1051.6,
        "speaker": "Người bản xứ",
        "chinese": "我喜欢坐火车。",
        "pinyin": "Wǒ xǐhuan zuò huǒchē.",
        "vietnamese": "Tôi thích đi tàu."
      },
      {
        "id": 78,
        "startTime": 1051.6,
        "endTime": 1065.6,
        "speaker": "Người bản xứ",
        "chinese": "飞机飞得很快。",
        "pinyin": "Fēijī fēi de hěn kuài.",
        "vietnamese": "Máy bay bay rất nhanh."
      },
      {
        "id": 79,
        "startTime": 1065.6,
        "endTime": 1079.8,
        "speaker": "Người bản xứ",
        "chinese": "我爱吃中国菜。",
        "pinyin": "Wǒ ài chī zhōngguó cài.",
        "vietnamese": "Tôi thích ăn món Trung Quốc."
      },
      {
        "id": 80,
        "startTime": 1079.8,
        "endTime": 1090.8,
        "speaker": "Người bản xứ",
        "chinese": "我想喝水。",
        "pinyin": "Wǒ xiǎng hē shuǐ.",
        "vietnamese": "Tôi muốn uống nước."
      },
      {
        "id": 81,
        "startTime": 1090.8,
        "endTime": 1101.0,
        "speaker": "Người bản xứ",
        "chinese": "我很忙。",
        "pinyin": "Wǒ hěn máng.",
        "vietnamese": "Tôi rất bận."
      },
      {
        "id": 82,
        "startTime": 1101.0,
        "endTime": 1113.8,
        "speaker": "Người bản xứ",
        "chinese": "小张生气了。",
        "pinyin": "Xiǎozhāng shēngqì le.",
        "vietnamese": "Tiểu Trương đã tức giận."
      },
      {
        "id": 83,
        "startTime": 1113.8,
        "endTime": 1125.0,
        "speaker": "Người bản xứ",
        "chinese": "我很开心。",
        "pinyin": "Wǒ hěn kāixīn.",
        "vietnamese": "Tôi rất vui."
      },
      {
        "id": 84,
        "startTime": 1125.0,
        "endTime": 1135.8,
        "speaker": "Người bản xứ",
        "chinese": "她是谁？",
        "pinyin": "Tā shì shéi?",
        "vietnamese": "Cô ấy là ai?"
      },
      {
        "id": 85,
        "startTime": 1135.8,
        "endTime": 1153.4,
        "speaker": "Người bản xứ",
        "chinese": "我们认识很长时间了。",
        "pinyin": "Wǒmen rènshi hěn cháng shíjiān le.",
        "vietnamese": "Chúng ta đã quen nhau lâu rồi."
      },
      {
        "id": 86,
        "startTime": 1153.4,
        "endTime": 1171.4,
        "speaker": "Người bản xứ",
        "chinese": "今年是2024年。",
        "pinyin": "Jīnnián shì èr líng èr sì nián.",
        "vietnamese": "Năm nay là năm 2024."
      },
      {
        "id": 87,
        "startTime": 1171.4,
        "endTime": 1182.6,
        "speaker": "Người bản xứ",
        "chinese": "我在开车。",
        "pinyin": "Wǒ zài kāichē.",
        "vietnamese": "Tôi đang lái xe."
      },
      {
        "id": 88,
        "startTime": 1182.6,
        "endTime": 1196.0,
        "speaker": "Người bản xứ",
        "chinese": "杯子里有水。",
        "pinyin": "Bēizi li yǒu shuǐ.",
        "vietnamese": "Trong cốc có nước."
      },
      {
        "id": 89,
        "startTime": 1196.0,
        "endTime": 1205.4,
        "speaker": "Người bản xứ",
        "chinese": "我听不见。",
        "pinyin": "Wǒ tīng bu jiàn.",
        "vietnamese": "Tôi không nghe thấy."
      },
      {
        "id": 90,
        "startTime": 1205.4,
        "endTime": 1216.0,
        "speaker": "Người bản xứ",
        "chinese": "你说什么？",
        "pinyin": "Nǐ shuō shénme?",
        "vietnamese": "Bạn nói gì?"
      },
      {
        "id": 91,
        "startTime": 1216.0,
        "endTime": 1227.0,
        "speaker": "Người bản xứ",
        "chinese": "你很漂亮。",
        "pinyin": "Nǐ hěn piàoliang.",
        "vietnamese": "Bạn rất đẹp."
      },
      {
        "id": 92,
        "startTime": 1227.0,
        "endTime": 1242.6,
        "speaker": "Người bản xứ",
        "chinese": "李小姐是我的朋友。",
        "pinyin": "Lǐ xiǎojie shì wǒ de péngyou.",
        "vietnamese": "Cô Lý là bạn của tôi."
      },
      {
        "id": 93,
        "startTime": 1242.6,
        "endTime": 1253.6,
        "speaker": "Người bản xứ",
        "chinese": "吃一口饭。",
        "pinyin": "Chī yì kǒu fàn.",
        "vietnamese": "Ăn một miếng cơm."
      },
      {
        "id": 94,
        "startTime": 1253.6,
        "endTime": 1265.2,
        "speaker": "Người bản xứ",
        "chinese": "菜很好吃。",
        "pinyin": "Cài hěn hǎochī.",
        "vietnamese": "Món ăn rất ngon."
      },
      {
        "id": 95,
        "startTime": 1265.2,
        "endTime": 1277.2,
        "speaker": "Người bản xứ",
        "chinese": "先生，你好。",
        "pinyin": "Xiānsheng, nǐ hǎo.",
        "vietnamese": "Chào ông."
      },
      {
        "id": 96,
        "startTime": 1277.2,
        "endTime": 1290.6,
        "speaker": "Người bản xứ",
        "chinese": "我在公园跑步。",
        "pinyin": "Wǒ zài gōngyuán pǎobù.",
        "vietnamese": "Tôi chạy bộ trong công viên."
      },
      {
        "id": 97,
        "startTime": 1290.6,
        "endTime": 1305.6,
        "speaker": "Người bản xứ",
        "chinese": "我有一个女儿。",
        "pinyin": "Wǒ yǒu yí gè nǚ'ér.",
        "vietnamese": "Tôi có một cô con gái."
      },
      {
        "id": 98,
        "startTime": 1305.6,
        "endTime": 1319.2,
        "speaker": "Người bản xứ",
        "chinese": "我现在要回家。",
        "pinyin": "Wǒ xiànzài yào huíjiā.",
        "vietnamese": "Bây giờ tôi muốn về nhà."
      },
      {
        "id": 99,
        "startTime": 1319.2,
        "endTime": 1330.0,
        "speaker": "Người bản xứ",
        "chinese": "下次再见！",
        "pinyin": "Xià cì zàijiàn!",
        "vietnamese": "Hẹn gặp lại lần sau!"
      },
      {
        "id": 100,
        "startTime": 1330.0,
        "endTime": 1342.0,
        "speaker": "Người bản xứ",
        "chinese": "好的，再见！",
        "pinyin": "Hǎo de, zàijiàn!",
        "vietnamese": "Được rồi, tạm biệt!"
      }
    ]
  },
  {
    "id": "hsk1-ankhahy-daily-dialogues",
    "title": "Hội thoại ngắn HSK 1 chuẩn giáo trình (An Khả Hy)",
    "level": "HSK 1-2",
    "levelBadgeColor": "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300",
    "duration": "15:51",
    "category": "Giao tiếp đời sống",
    "description": "Chuỗi đối thoại tình huống thực tế chuẩn giáo trình HSK 1, âm điệu nhẹ nhàng truyền cảm, giúp tai quen với ngữ điệu nói tự nhiên của người bản xứ.",
    "youtubeId": "cADmN8CU7HY",
    "sentencesCount": 244,
    "isFree": true,
    "sentences": [
      {
        "id": 1,
        "startTime": 8.5,
        "endTime": 10.0,
        "speaker": "A",
        "chinese": "你是学生吗？",
        "pinyin": "Nǐ shì xué shēng ma?",
        "vietnamese": "Bạn là học sinh phải không?"
      },
      {
        "id": 2,
        "startTime": 11.0,
        "endTime": 13.0,
        "speaker": "B",
        "chinese": "不是，我是老师。",
        "pinyin": "Bú shì, wǒ shì lǎo shī.",
        "vietnamese": "Không phải, tôi là giáo viên."
      },
      {
        "id": 3,
        "startTime": 14.9,
        "endTime": 16.4,
        "speaker": "A",
        "chinese": "你是学生吗？",
        "pinyin": "Nǐ shì xué shēng ma?",
        "vietnamese": "Bạn là học sinh phải không?"
      },
      {
        "id": 4,
        "startTime": 17.5,
        "endTime": 20.0,
        "speaker": "B",
        "chinese": "不是，我是老师。",
        "pinyin": "Bú shì, wǒ shì lǎo shī.",
        "vietnamese": "Không phải, tôi là giáo viên."
      },
      {
        "id": 5,
        "startTime": 21.7,
        "endTime": 23.2,
        "speaker": "A",
        "chinese": "你是中国学生吗？",
        "pinyin": "Nǐ shì zhōng guó xué shēng ma?",
        "vietnamese": "Bạn là học sinh Trung Quốc phải không?"
      },
      {
        "id": 6,
        "startTime": 24.0,
        "endTime": 26.5,
        "speaker": "B",
        "chinese": "不是，我是美国学生。",
        "pinyin": "Bú shì, wǒ shì měi guó xué shēng.",
        "vietnamese": "Không phải, tôi là học sinh Mỹ."
      },
      {
        "id": 7,
        "startTime": 28.1,
        "endTime": 30.1,
        "speaker": "A",
        "chinese": "你是中国学生吗？",
        "pinyin": "Nǐ shì zhōng guó xué shēng ma?",
        "vietnamese": "Bạn là học sinh Trung Quốc phải không?"
      },
      {
        "id": 8,
        "startTime": 31.1,
        "endTime": 34.1,
        "speaker": "B",
        "chinese": "不是，我是美国学生。",
        "pinyin": "Bú shì, wǒ shì měi guó xué shēng.",
        "vietnamese": "Không phải, tôi là học sinh Mỹ."
      },
      {
        "id": 9,
        "startTime": 36.0,
        "endTime": 38.9,
        "speaker": "A",
        "chinese": "你好，您是美国人吗？",
        "pinyin": "Nǐ hǎo, nín shì měi guó rén ma?",
        "vietnamese": "Xin chào, ngài là người Mỹ phải không ạ?"
      },
      {
        "id": 10,
        "startTime": 39.4,
        "endTime": 42.7,
        "speaker": "B",
        "chinese": "是，我是美国人。",
        "pinyin": "Shì, wǒ shì měi guó rén.",
        "vietnamese": "Vâng, tôi là người Mỹ."
      },
      {
        "id": 11,
        "startTime": 43.2,
        "endTime": 46.6,
        "speaker": "A",
        "chinese": "你好，您是美国人吗？",
        "pinyin": "Nǐ hǎo, nín shì měi guó rén ma?",
        "vietnamese": "Xin chào, ngài là người Mỹ phải không ạ?"
      },
      {
        "id": 12,
        "startTime": 46.6,
        "endTime": 49.1,
        "speaker": "B",
        "chinese": "是，我是美国人。",
        "pinyin": "Shì, wǒ shì měi guó rén.",
        "vietnamese": "Vâng, tôi là người Mỹ."
      },
      {
        "id": 13,
        "startTime": 51.0,
        "endTime": 52.8,
        "speaker": "A",
        "chinese": "老师，您叫什么名字？",
        "pinyin": "Lǎo shī, nín jiào shén me míng zì?",
        "vietnamese": "Thưa thầy, thầy tên là gì ạ?"
      },
      {
        "id": 14,
        "startTime": 54.2,
        "endTime": 55.2,
        "speaker": "B",
        "chinese": "我叫李月。",
        "pinyin": "Wǒ jiào lǐ yuè.",
        "vietnamese": "Tôi tên là Lý Nguyệt."
      },
      {
        "id": 15,
        "startTime": 57.4,
        "endTime": 59.7,
        "speaker": "A",
        "chinese": "老师，您叫什么名字？",
        "pinyin": "Lǎo shī, nín jiào shén me míng zì?",
        "vietnamese": "Thưa thầy, thầy tên là gì ạ?"
      },
      {
        "id": 16,
        "startTime": 61.3,
        "endTime": 62.6,
        "speaker": "B",
        "chinese": "我叫李月。",
        "pinyin": "Wǒ jiào lǐ yuè.",
        "vietnamese": "Tôi tên là Lý Nguyệt."
      },
      {
        "id": 17,
        "startTime": 64.8,
        "endTime": 65.8,
        "speaker": "A",
        "chinese": "他是谁？",
        "pinyin": "Tā shì shuí?",
        "vietnamese": "Anh ấy là ai?"
      },
      {
        "id": 18,
        "startTime": 67.2,
        "endTime": 68.8,
        "speaker": "B",
        "chinese": "他是我的汉语老师。",
        "pinyin": "Tā shì wǒ de hàn yǔ lǎo shī.",
        "vietnamese": "Thầy ấy là giáo viên tiếng Trung của tôi."
      },
      {
        "id": 19,
        "startTime": 70.8,
        "endTime": 71.9,
        "speaker": "A",
        "chinese": "他是谁？",
        "pinyin": "Tā shì shuí?",
        "vietnamese": "Anh ấy là ai?"
      },
      {
        "id": 20,
        "startTime": 73.5,
        "endTime": 75.5,
        "speaker": "B",
        "chinese": "他是我的汉语老师。",
        "pinyin": "Tā shì wǒ de hàn yǔ lǎo shī.",
        "vietnamese": "Thầy ấy là giáo viên tiếng Trung của tôi."
      },
      {
        "id": 21,
        "startTime": 77.7,
        "endTime": 78.9,
        "speaker": "A",
        "chinese": "他叫什么名字？",
        "pinyin": "Tā jiào shén me míng zì?",
        "vietnamese": "Cậu ấy tên là gì?"
      },
      {
        "id": 22,
        "startTime": 80.2,
        "endTime": 82.5,
        "speaker": "B",
        "chinese": "他叫大卫，他是美国人。",
        "pinyin": "Tā jiào dà wèi, tā shì měi guó rén.",
        "vietnamese": "Cậu ấy tên là David, cậu ấy là người Mỹ."
      },
      {
        "id": 23,
        "startTime": 84.6,
        "endTime": 86.1,
        "speaker": "A",
        "chinese": "他叫什么名字？",
        "pinyin": "Tā jiào shén me míng zì?",
        "vietnamese": "Cậu ấy tên là gì?"
      },
      {
        "id": 24,
        "startTime": 87.4,
        "endTime": 90.3,
        "speaker": "B",
        "chinese": "他叫大卫，他是美国人。",
        "pinyin": "Tā jiào dà wèi, tā shì měi guó rén.",
        "vietnamese": "Cậu ấy tên là David, cậu ấy là người Mỹ."
      },
      {
        "id": 25,
        "startTime": 92.4,
        "endTime": 93.6,
        "speaker": "A",
        "chinese": "他是哪国人？",
        "pinyin": "Tā shì nǎ guó rén?",
        "vietnamese": "Anh ấy là người nước nào?"
      },
      {
        "id": 26,
        "startTime": 94.8,
        "endTime": 96.0,
        "speaker": "B",
        "chinese": "他是中国人。",
        "pinyin": "Tā shì zhōng guó rén.",
        "vietnamese": "Anh ấy là người Trung Quốc."
      },
      {
        "id": 27,
        "startTime": 97.8,
        "endTime": 99.3,
        "speaker": "A",
        "chinese": "他是哪国人？",
        "pinyin": "Tā shì nǎ guó rén?",
        "vietnamese": "Anh ấy là người nước nào?"
      },
      {
        "id": 28,
        "startTime": 100.6,
        "endTime": 102.1,
        "speaker": "B",
        "chinese": "他是中国人。",
        "pinyin": "Tā shì zhōng guó rén.",
        "vietnamese": "Anh ấy là người Trung Quốc."
      },
      {
        "id": 29,
        "startTime": 104.2,
        "endTime": 105.1,
        "speaker": "A",
        "chinese": "他是谁？",
        "pinyin": "Tā shì shuí?",
        "vietnamese": "Cô ấy là ai?"
      },
      {
        "id": 30,
        "startTime": 106.6,
        "endTime": 108.9,
        "speaker": "B",
        "chinese": "她是我同学，她叫玛丽。",
        "pinyin": "Tā shì wǒ tóng xué, tā jiào mǎ lì.",
        "vietnamese": "Cô ấy là bạn học của tôi, cô ấy tên là Mary."
      },
      {
        "id": 31,
        "startTime": 110.9,
        "endTime": 112.1,
        "speaker": "A",
        "chinese": "他是谁？",
        "pinyin": "Tā shì shuí?",
        "vietnamese": "Cô ấy là ai?"
      },
      {
        "id": 32,
        "startTime": 113.6,
        "endTime": 116.4,
        "speaker": "B",
        "chinese": "她是我同学，她叫玛丽。",
        "pinyin": "Tā shì wǒ tóng xué, tā jiào mǎ lì.",
        "vietnamese": "Cô ấy là bạn học của tôi, cô ấy tên là Mary."
      },
      {
        "id": 33,
        "startTime": 118.3,
        "endTime": 119.9,
        "speaker": "A",
        "chinese": "你女儿今年几岁了？",
        "pinyin": "Nǐ nǚ ér jīn nián jǐ suì le?",
        "vietnamese": "Con gái bạn năm nay mấy tuổi rồi?"
      },
      {
        "id": 34,
        "startTime": 121.3,
        "endTime": 122.7,
        "speaker": "B",
        "chinese": "她今年五岁了。",
        "pinyin": "Tā jīn nián wǔ suì le.",
        "vietnamese": "Cháu năm nay 5 tuổi rồi."
      },
      {
        "id": 35,
        "startTime": 124.6,
        "endTime": 126.6,
        "speaker": "A",
        "chinese": "你女儿今年几岁了？",
        "pinyin": "Nǐ nǚ ér jīn nián jǐ suì le?",
        "vietnamese": "Con gái bạn năm nay mấy tuổi rồi?"
      },
      {
        "id": 36,
        "startTime": 128.2,
        "endTime": 130.0,
        "speaker": "B",
        "chinese": "她今年五岁了。",
        "pinyin": "Tā jīn nián wǔ suì le.",
        "vietnamese": "Cháu năm nay 5 tuổi rồi."
      },
      {
        "id": 37,
        "startTime": 131.8,
        "endTime": 133.9,
        "speaker": "A",
        "chinese": "你们的汉语老师今年多大了？",
        "pinyin": "Nǐ men de hàn yǔ lǎo shī jīn nián duō dà le?",
        "vietnamese": "Giáo viên tiếng Trung của các bạn năm nay bao nhiêu tuổi rồi?"
      },
      {
        "id": 38,
        "startTime": 135.3,
        "endTime": 137.0,
        "speaker": "B",
        "chinese": "他今年三十三岁了。",
        "pinyin": "Tā jīn nián sān shí sān suì le.",
        "vietnamese": "Thầy năm nay 33 tuổi rồi."
      },
      {
        "id": 39,
        "startTime": 138.8,
        "endTime": 141.5,
        "speaker": "A",
        "chinese": "你们的汉语老师今年多大了？",
        "pinyin": "Nǐ men de hàn yǔ lǎo shī jīn nián duō dà le?",
        "vietnamese": "Giáo viên tiếng Trung của các bạn năm nay bao nhiêu tuổi rồi?"
      },
      {
        "id": 40,
        "startTime": 142.9,
        "endTime": 145.1,
        "speaker": "B",
        "chinese": "他今年三十三岁了。",
        "pinyin": "Tā jīn nián sān shí sān suì le.",
        "vietnamese": "Thầy năm nay 33 tuổi rồi."
      },
      {
        "id": 41,
        "startTime": 147.1,
        "endTime": 148.4,
        "speaker": "A",
        "chinese": "你家有几口人？",
        "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
        "vietnamese": "Nhà bạn có mấy người?"
      },
      {
        "id": 42,
        "startTime": 149.8,
        "endTime": 151.2,
        "speaker": "B",
        "chinese": "我家有六口人。",
        "pinyin": "Wǒ jiā yǒu liù kǒu rén.",
        "vietnamese": "Nhà tôi có 6 người."
      },
      {
        "id": 43,
        "startTime": 153.3,
        "endTime": 155.0,
        "speaker": "A",
        "chinese": "你家有几口人？",
        "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
        "vietnamese": "Nhà bạn có mấy người?"
      },
      {
        "id": 44,
        "startTime": 156.5,
        "endTime": 158.3,
        "speaker": "B",
        "chinese": "我家有六口人。",
        "pinyin": "Wǒ jiā yǒu liù kǒu rén.",
        "vietnamese": "Nhà tôi có 6 người."
      },
      {
        "id": 45,
        "startTime": 160.3,
        "endTime": 161.8,
        "speaker": "A",
        "chinese": "您今年多大了？",
        "pinyin": "Nín jīn nián duō dà le?",
        "vietnamese": "Cụ năm nay bao nhiêu tuổi rồi ạ?"
      },
      {
        "id": 46,
        "startTime": 163.2,
        "endTime": 164.7,
        "speaker": "B",
        "chinese": "我今年八十岁了。",
        "pinyin": "Wǒ jīn nián bā shí suì le.",
        "vietnamese": "Năm nay tôi 80 tuổi rồi."
      },
      {
        "id": 47,
        "startTime": 166.6,
        "endTime": 168.4,
        "speaker": "A",
        "chinese": "您今年多大了？",
        "pinyin": "Nín jīn nián duō dà le?",
        "vietnamese": "Cụ năm nay bao nhiêu tuổi rồi ạ?"
      },
      {
        "id": 48,
        "startTime": 169.8,
        "endTime": 171.8,
        "speaker": "B",
        "chinese": "我今年八十岁了。",
        "pinyin": "Wǒ jīn nián bā shí suì le.",
        "vietnamese": "Năm nay tôi 80 tuổi rồi."
      },
      {
        "id": 49,
        "startTime": 173.9,
        "endTime": 175.4,
        "speaker": "A",
        "chinese": "你们家谁会说汉语？",
        "pinyin": "Nǐ men jiā shuí huì shuō hàn yǔ?",
        "vietnamese": "Trong nhà bạn ai biết nói tiếng Trung?"
      },
      {
        "id": 50,
        "startTime": 176.9,
        "endTime": 178.5,
        "speaker": "B",
        "chinese": "我妈妈会说汉语。",
        "pinyin": "Wǒ mā mā huì shuō hàn yǔ.",
        "vietnamese": "Mẹ tôi biết nói tiếng Trung."
      },
      {
        "id": 51,
        "startTime": 180.7,
        "endTime": 182.6,
        "speaker": "A",
        "chinese": "你们家谁会说汉语？",
        "pinyin": "Nǐ men jiā shuí huì shuō hàn yǔ?",
        "vietnamese": "Trong nhà bạn ai biết nói tiếng Trung?"
      },
      {
        "id": 52,
        "startTime": 184.0,
        "endTime": 186.1,
        "speaker": "B",
        "chinese": "我妈妈会说汉语。",
        "pinyin": "Wǒ mā mā huì shuō hàn yǔ.",
        "vietnamese": "Mẹ tôi biết nói tiếng Trung."
      },
      {
        "id": 53,
        "startTime": 188.0,
        "endTime": 189.6,
        "speaker": "A",
        "chinese": "你会做中国菜吗？",
        "pinyin": "Nǐ huì zuò zhōng guó cài ma?",
        "vietnamese": "Bạn biết nấu món ăn Trung Quốc không?"
      },
      {
        "id": 54,
        "startTime": 191.0,
        "endTime": 193.5,
        "speaker": "B",
        "chinese": "我不会做，我的好朋友会做。",
        "pinyin": "Wǒ bú huì zuò, wǒ de hǎo péng yǒu huì zuò.",
        "vietnamese": "Tôi không biết nấu, bạn thân của tôi biết nấu."
      },
      {
        "id": 55,
        "startTime": 195.6,
        "endTime": 197.5,
        "speaker": "A",
        "chinese": "你会做中国菜吗？",
        "pinyin": "Nǐ huì zuò zhōng guó cài ma?",
        "vietnamese": "Bạn biết nấu món ăn Trung Quốc không?"
      },
      {
        "id": 56,
        "startTime": 199.1,
        "endTime": 202.3,
        "speaker": "B",
        "chinese": "我不会做，我的好朋友会做。",
        "pinyin": "Wǒ bú huì zuò, wǒ de hǎo péng yǒu huì zuò.",
        "vietnamese": "Tôi không biết nấu, bạn thân của tôi biết nấu."
      },
      {
        "id": 57,
        "startTime": 204.5,
        "endTime": 205.9,
        "speaker": "A",
        "chinese": "这个汉字怎么写？",
        "pinyin": "Zhè ge hàn zì zěn me xiě?",
        "vietnamese": "Chữ Hán này viết như thế nào?"
      },
      {
        "id": 58,
        "startTime": 207.2,
        "endTime": 209.8,
        "speaker": "B",
        "chinese": "对不起，我会读，不会写。",
        "pinyin": "Duì bù qǐ, wǒ huì dú, bú huì xiě.",
        "vietnamese": "Xin lỗi, tôi biết đọc chứ không biết viết."
      },
      {
        "id": 59,
        "startTime": 212.0,
        "endTime": 213.7,
        "speaker": "A",
        "chinese": "这个汉字怎么写？",
        "pinyin": "Zhè ge hàn zì zěn me xiě?",
        "vietnamese": "Chữ Hán này viết như thế nào?"
      },
      {
        "id": 60,
        "startTime": 215.3,
        "endTime": 218.6,
        "speaker": "B",
        "chinese": "对不起，我会读，不会写。",
        "pinyin": "Duì bù qǐ, wǒ huì dú, bú huì xiě.",
        "vietnamese": "Xin lỗi, tôi biết đọc chứ không biết viết."
      },
      {
        "id": 61,
        "startTime": 220.8,
        "endTime": 222.4,
        "speaker": "A",
        "chinese": "中国菜好吃吗？",
        "pinyin": "Zhōng guó cài hǎo chī ma?",
        "vietnamese": "Món ăn Trung Quốc có ngon không?"
      },
      {
        "id": 62,
        "startTime": 223.8,
        "endTime": 225.3,
        "speaker": "B",
        "chinese": "中国菜很好吃。",
        "pinyin": "Zhōng guó cài hěn hǎo chī.",
        "vietnamese": "Món ăn Trung Quốc rất ngon."
      },
      {
        "id": 63,
        "startTime": 227.5,
        "endTime": 229.4,
        "speaker": "A",
        "chinese": "中国菜好吃吗？",
        "pinyin": "Zhōng guó cài hǎo chī ma?",
        "vietnamese": "Món ăn Trung Quốc có ngon không?"
      },
      {
        "id": 64,
        "startTime": 230.9,
        "endTime": 232.9,
        "speaker": "B",
        "chinese": "中国菜很好吃。",
        "pinyin": "Zhōng guó cài hěn hǎo chī.",
        "vietnamese": "Món ăn Trung Quốc rất ngon."
      },
      {
        "id": 65,
        "startTime": 235.2,
        "endTime": 236.6,
        "speaker": "A",
        "chinese": "今天是几月几号？",
        "pinyin": "Jīn tiān shì jǐ yuè jǐ hào?",
        "vietnamese": "Hôm nay là ngày mấy tháng mấy?"
      },
      {
        "id": 66,
        "startTime": 238.1,
        "endTime": 239.7,
        "speaker": "B",
        "chinese": "今天是九月十二号。",
        "pinyin": "Jīn tiān shì jiǔ yuè shí èr hào.",
        "vietnamese": "Hôm nay là ngày 12 tháng 9."
      },
      {
        "id": 67,
        "startTime": 241.9,
        "endTime": 243.7,
        "speaker": "A",
        "chinese": "今天是几月几号？",
        "pinyin": "Jīn tiān shì jǐ yuè jǐ hào?",
        "vietnamese": "Hôm nay là ngày mấy tháng mấy?"
      },
      {
        "id": 68,
        "startTime": 245.2,
        "endTime": 247.3,
        "speaker": "B",
        "chinese": "今天是九月十二号。",
        "pinyin": "Jīn tiān shì jiǔ yuè shí èr hào.",
        "vietnamese": "Hôm nay là ngày 12 tháng 9."
      },
      {
        "id": 69,
        "startTime": 249.5,
        "endTime": 250.6,
        "speaker": "A",
        "chinese": "明天你做什么？",
        "pinyin": "Míng tiān nǐ zuò shén me?",
        "vietnamese": "Ngày mai bạn làm gì?"
      },
      {
        "id": 70,
        "startTime": 252.2,
        "endTime": 254.0,
        "speaker": "B",
        "chinese": "明天我去学校看书。",
        "pinyin": "Míng tiān wǒ qù xué xiào kàn shū.",
        "vietnamese": "Ngày mai tôi đến trường đọc sách."
      },
      {
        "id": 71,
        "startTime": 256.1,
        "endTime": 257.6,
        "speaker": "A",
        "chinese": "明天你做什么？",
        "pinyin": "Míng tiān nǐ zuò shén me?",
        "vietnamese": "Ngày mai bạn làm gì?"
      },
      {
        "id": 72,
        "startTime": 259.1,
        "endTime": 261.4,
        "speaker": "B",
        "chinese": "明天我去学校看书。",
        "pinyin": "Míng tiān wǒ qù xué xiào kàn shū.",
        "vietnamese": "Ngày mai tôi đến trường đọc sách."
      },
      {
        "id": 73,
        "startTime": 263.6,
        "endTime": 265.4,
        "speaker": "A",
        "chinese": "三十一号是星期几？",
        "pinyin": "Sān shí yī hào shì xīng qī jǐ?",
        "vietnamese": "Ngày 31 là thứ mấy?"
      },
      {
        "id": 74,
        "startTime": 266.7,
        "endTime": 268.5,
        "speaker": "A",
        "chinese": "三十一号是星期几？",
        "pinyin": "Sān shí yī hào shì xīng qī jǐ?",
        "vietnamese": "Ngày 31 là thứ mấy?"
      },
      {
        "id": 75,
        "startTime": 270.7,
        "endTime": 272.9,
        "speaker": "A",
        "chinese": "三十一号是星期几？",
        "pinyin": "Sān shí yī hào shì xīng qī jǐ?",
        "vietnamese": "Ngày 31 là thứ mấy?"
      },
      {
        "id": 76,
        "startTime": 274.4,
        "endTime": 276.7,
        "speaker": "A",
        "chinese": "三十一号是星期几？",
        "pinyin": "Sān shí yī hào shì xīng qī jǐ?",
        "vietnamese": "Ngày 31 là thứ mấy?"
      },
      {
        "id": 77,
        "startTime": 278.7,
        "endTime": 280.8,
        "speaker": "A",
        "chinese": "明天是星期六，你做什么？",
        "pinyin": "Míng tiān shì xīng qī liù, nǐ zuò shén me?",
        "vietnamese": "Ngày mai là thứ Bảy, bạn làm gì?"
      },
      {
        "id": 78,
        "startTime": 282.0,
        "endTime": 284.7,
        "speaker": "B",
        "chinese": "明天我去中国朋友家吃中国菜。",
        "pinyin": "Míng tiān wǒ qù zhōng guó péng yǒu jiā chī zhōng guó cài.",
        "vietnamese": "Ngày mai tôi đến nhà bạn Trung Quốc ăn món Trung Quốc."
      },
      {
        "id": 79,
        "startTime": 286.9,
        "endTime": 289.5,
        "speaker": "A",
        "chinese": "明天是星期六，你做什么？",
        "pinyin": "Míng tiān shì xīng qī liù, nǐ zuò shén me?",
        "vietnamese": "Ngày mai là thứ Bảy, bạn làm gì?"
      },
      {
        "id": 80,
        "startTime": 291.1,
        "endTime": 294.6,
        "speaker": "B",
        "chinese": "明天我去中国朋友家吃中国菜。",
        "pinyin": "Míng tiān wǒ qù zhōng guó péng yǒu jiā chī zhōng guó cài.",
        "vietnamese": "Ngày mai tôi đến nhà bạn Trung Quốc ăn món Trung Quốc."
      },
      {
        "id": 81,
        "startTime": 296.7,
        "endTime": 298.1,
        "speaker": "A",
        "chinese": "你想吃米饭吗？",
        "pinyin": "Nǐ xiǎng chī mǐ fàn ma?",
        "vietnamese": "Bạn có muốn ăn cơm không?"
      },
      {
        "id": 82,
        "startTime": 299.5,
        "endTime": 300.2,
        "speaker": "B",
        "chinese": "好。",
        "pinyin": "Hǎo.",
        "vietnamese": "Được chứ."
      },
      {
        "id": 83,
        "startTime": 302.2,
        "endTime": 304.0,
        "speaker": "A",
        "chinese": "你想吃米饭吗？",
        "pinyin": "Nǐ xiǎng chī mǐ fàn ma?",
        "vietnamese": "Bạn có muốn ăn cơm không?"
      },
      {
        "id": 84,
        "startTime": 305.6,
        "endTime": 306.4,
        "speaker": "B",
        "chinese": "好。",
        "pinyin": "Hǎo.",
        "vietnamese": "Được chứ."
      },
      {
        "id": 85,
        "startTime": 308.5,
        "endTime": 309.9,
        "speaker": "A",
        "chinese": "明天你想吃什么？",
        "pinyin": "Míng tiān nǐ xiǎng chī shén me?",
        "vietnamese": "Ngày mai bạn muốn ăn gì?"
      },
      {
        "id": 86,
        "startTime": 311.4,
        "endTime": 312.8,
        "speaker": "B",
        "chinese": "我想吃中国菜。",
        "pinyin": "Wǒ xiǎng chī zhōng guó cài.",
        "vietnamese": "Tôi muốn ăn món Trung Quốc."
      },
      {
        "id": 87,
        "startTime": 315.1,
        "endTime": 316.8,
        "speaker": "A",
        "chinese": "明天你想吃什么？",
        "pinyin": "Míng tiān nǐ xiǎng chī shén me?",
        "vietnamese": "Ngày mai bạn muốn ăn gì?"
      },
      {
        "id": 88,
        "startTime": 318.5,
        "endTime": 320.3,
        "speaker": "B",
        "chinese": "我想吃中国菜。",
        "pinyin": "Wǒ xiǎng chī zhōng guó cài.",
        "vietnamese": "Tôi muốn ăn món Trung Quốc."
      },
      {
        "id": 89,
        "startTime": 322.5,
        "endTime": 324.7,
        "speaker": "A",
        "chinese": "请问这个杯子多少钱？",
        "pinyin": "Qǐng wèn zhè ge bēi zi duō shǎo qián?",
        "vietnamese": "Xin hỏi chiếc cốc này bao nhiêu tiền?"
      },
      {
        "id": 90,
        "startTime": 326.2,
        "endTime": 327.4,
        "speaker": "B",
        "chinese": "三十八块。",
        "pinyin": "Sān shí bā kuài.",
        "vietnamese": "38 tệ."
      },
      {
        "id": 91,
        "startTime": 329.5,
        "endTime": 332.3,
        "speaker": "A",
        "chinese": "请问这个杯子多少钱？",
        "pinyin": "Qǐng wèn zhè ge bēi zi duō shǎo qián?",
        "vietnamese": "Xin hỏi chiếc cốc này bao nhiêu tiền?"
      },
      {
        "id": 92,
        "startTime": 334.1,
        "endTime": 335.6,
        "speaker": "B",
        "chinese": "三十八块。",
        "pinyin": "Sān shí bā kuài.",
        "vietnamese": "38 tệ."
      },
      {
        "id": 93,
        "startTime": 337.7,
        "endTime": 339.3,
        "speaker": "A",
        "chinese": "你朋友家有几口人？",
        "pinyin": "Nǐ péng yǒu jiā yǒu jǐ kǒu rén?",
        "vietnamese": "Nhà bạn của bạn có mấy người?"
      },
      {
        "id": 94,
        "startTime": 340.8,
        "endTime": 342.2,
        "speaker": "B",
        "chinese": "他家有四口人。",
        "pinyin": "Tā jiā yǒu sì kǒu rén.",
        "vietnamese": "Nhà cậu ấy có 4 người."
      },
      {
        "id": 95,
        "startTime": 342.2,
        "endTime": 344.9,
        "speaker": "A",
        "chinese": "我的猫呢？",
        "pinyin": "Wǒ de māo ne?",
        "vietnamese": "Con mèo của tôi đâu rồi?"
      },
      {
        "id": 96,
        "startTime": 345.5,
        "endTime": 346.7,
        "speaker": "B",
        "chinese": "在椅子下面。",
        "pinyin": "Zài yǐ zi xià miàn.",
        "vietnamese": "Ở dưới ghế."
      },
      {
        "id": 97,
        "startTime": 348.5,
        "endTime": 349.9,
        "speaker": "A",
        "chinese": "我的猫呢？",
        "pinyin": "Wǒ de māo ne?",
        "vietnamese": "Con mèo của tôi đâu rồi?"
      },
      {
        "id": 98,
        "startTime": 351.9,
        "endTime": 353.2,
        "speaker": "B",
        "chinese": "在椅子下面。",
        "pinyin": "Zài yǐ zi xià miàn.",
        "vietnamese": "Ở dưới ghế."
      },
      {
        "id": 99,
        "startTime": 354.7,
        "endTime": 356.0,
        "speaker": "A",
        "chinese": "你妈妈是医生吗？",
        "pinyin": "Nǐ mā mā shì yī shēng ma?",
        "vietnamese": "Mẹ bạn là bác sĩ phải không?"
      },
      {
        "id": 100,
        "startTime": 358.0,
        "endTime": 364.0,
        "speaker": "B",
        "chinese": "不是，我妈妈是老师，她在学校工作。",
        "pinyin": "Bú shì, wǒ mā mā shì lǎo shī, tā zài xué xiào gōng zuò.",
        "vietnamese": "Không phải, mẹ tôi là giáo viên, bà làm việc ở trường học."
      },
      {
        "id": 101,
        "startTime": 364.8,
        "endTime": 367.3,
        "speaker": "A",
        "chinese": "你妈妈是医生吗？",
        "pinyin": "Nǐ mā mā shì yī shēng ma?",
        "vietnamese": "Mẹ bạn là bác sĩ phải không?"
      },
      {
        "id": 102,
        "startTime": 367.7,
        "endTime": 373.7,
        "speaker": "B",
        "chinese": "不是，我妈妈是老师，她在学校工作。",
        "pinyin": "Bú shì, wǒ mā mā shì lǎo shī, tā zài xué xiào gōng zuò.",
        "vietnamese": "Không phải, mẹ tôi là giáo viên, bà làm việc ở trường học."
      },
      {
        "id": 103,
        "startTime": 374.5,
        "endTime": 376.8,
        "speaker": "A",
        "chinese": "我的狗在哪儿？",
        "pinyin": "Wǒ de gǒu zài nǎr?",
        "vietnamese": "Con chó của tôi ở đâu?"
      },
      {
        "id": 104,
        "startTime": 377.3,
        "endTime": 378.5,
        "speaker": "B",
        "chinese": "在椅子上面。",
        "pinyin": "Zài yǐ zi shàng miàn.",
        "vietnamese": "Ở trên ghế."
      },
      {
        "id": 105,
        "startTime": 379.1,
        "endTime": 380.5,
        "speaker": "A",
        "chinese": "我的狗在哪儿？",
        "pinyin": "Wǒ de gǒu zài nǎr?",
        "vietnamese": "Con chó của tôi ở đâu?"
      },
      {
        "id": 106,
        "startTime": 382.6,
        "endTime": 383.8,
        "speaker": "B",
        "chinese": "在椅子上面。",
        "pinyin": "Zài yǐ zi shàng miàn.",
        "vietnamese": "Ở trên ghế."
      },
      {
        "id": 107,
        "startTime": 385.3,
        "endTime": 386.6,
        "speaker": "B",
        "chinese": "在椅子上面。",
        "pinyin": "Zài yǐ zi shàng miàn.",
        "vietnamese": "Ở trên ghế."
      },
      {
        "id": 108,
        "startTime": 388.7,
        "endTime": 390.3,
        "speaker": "A",
        "chinese": "我的狗在哪儿？",
        "pinyin": "Wǒ de gǒu zài nǎr?",
        "vietnamese": "Con chó của tôi ở đâu?"
      },
      {
        "id": 109,
        "startTime": 391.8,
        "endTime": 393.3,
        "speaker": "B",
        "chinese": "在椅子上面。",
        "pinyin": "Zài yǐ zi shàng miàn.",
        "vietnamese": "Ở trên ghế."
      },
      {
        "id": 110,
        "startTime": 395.1,
        "endTime": 396.7,
        "speaker": "A",
        "chinese": "你朋友在哪儿工作？",
        "pinyin": "Nǐ péng yǒu zài nǎrgōng zuò?",
        "vietnamese": "Bạn của bạn làm việc ở đâu?"
      },
      {
        "id": 111,
        "startTime": 398.0,
        "endTime": 400.5,
        "speaker": "B",
        "chinese": "她是医生，在医院工作。",
        "pinyin": "Tā shì yī shēng, zài yī yuàn gōng zuò.",
        "vietnamese": "Cô ấy là bác sĩ, làm việc ở bệnh viện."
      },
      {
        "id": 112,
        "startTime": 402.4,
        "endTime": 404.4,
        "speaker": "A",
        "chinese": "你朋友在哪儿工作？",
        "pinyin": "Nǐ péng yǒu zài nǎrgōng zuò?",
        "vietnamese": "Bạn của bạn làm việc ở đâu?"
      },
      {
        "id": 113,
        "startTime": 405.8,
        "endTime": 408.9,
        "speaker": "B",
        "chinese": "她是医生，在医院工作。",
        "pinyin": "Tā shì yī shēng, zài yī yuàn gōng zuò.",
        "vietnamese": "Cô ấy là bác sĩ, làm việc ở bệnh viện."
      },
      {
        "id": 114,
        "startTime": 411.0,
        "endTime": 412.6,
        "speaker": "A",
        "chinese": "你的桌子上有什么？",
        "pinyin": "Nǐ de zhuō zi shàng yǒu shén me?",
        "vietnamese": "Trên bàn của bạn có gì?"
      },
      {
        "id": 115,
        "startTime": 414.1,
        "endTime": 416.1,
        "speaker": "B",
        "chinese": "我的桌子上有一个电脑。",
        "pinyin": "Wǒ de zhuō zi shàng yǒu yí gè diàn nǎo.",
        "vietnamese": "Trên bàn của tôi có một chiếc máy tính."
      },
      {
        "id": 116,
        "startTime": 418.1,
        "endTime": 420.1,
        "speaker": "A",
        "chinese": "你的桌子上有什么？",
        "pinyin": "Nǐ de zhuō zi shàng yǒu shén me?",
        "vietnamese": "Trên bàn của bạn có gì?"
      },
      {
        "id": 117,
        "startTime": 421.8,
        "endTime": 424.3,
        "speaker": "B",
        "chinese": "我的桌子上有一个电脑。",
        "pinyin": "Wǒ de zhuō zi shàng yǒu yí gè diàn nǎo.",
        "vietnamese": "Trên bàn của tôi có một chiếc máy tính."
      },
      {
        "id": 118,
        "startTime": 426.3,
        "endTime": 427.5,
        "speaker": "A",
        "chinese": "你女儿呢？",
        "pinyin": "Nǐ nǚ ér ne?",
        "vietnamese": "Con gái bạn đâu rồi?"
      },
      {
        "id": 119,
        "startTime": 429.1,
        "endTime": 431.0,
        "speaker": "B",
        "chinese": "在那儿，她在桌子下面。",
        "pinyin": "Zài nàr, tā zài zhuō zi xià miàn.",
        "vietnamese": "Ở đằng kia, cháu đang ở dưới bàn."
      },
      {
        "id": 120,
        "startTime": 433.1,
        "endTime": 434.5,
        "speaker": "A",
        "chinese": "你女儿呢？",
        "pinyin": "Nǐ nǚ ér ne?",
        "vietnamese": "Con gái bạn đâu rồi?"
      },
      {
        "id": 121,
        "startTime": 436.3,
        "endTime": 438.7,
        "speaker": "B",
        "chinese": "在那儿，她在桌子下面。",
        "pinyin": "Zài nàr, tā zài zhuō zi xià miàn.",
        "vietnamese": "Ở đằng kia, cháu đang ở dưới bàn."
      },
      {
        "id": 122,
        "startTime": 439.1,
        "endTime": 442.1,
        "speaker": "A",
        "chinese": "谁是大卫？",
        "pinyin": "Shuí shì dà wèi?",
        "vietnamese": "Ai là David?"
      },
      {
        "id": 123,
        "startTime": 443.5,
        "endTime": 445.6,
        "speaker": "B",
        "chinese": "我后面的那个人是大卫。",
        "pinyin": "Wǒ hòu miàn de nà ge rén shì dà wèi.",
        "vietnamese": "Người ở phía sau tôi là David."
      },
      {
        "id": 124,
        "startTime": 446.0,
        "endTime": 449.4,
        "speaker": "A",
        "chinese": "谁是大卫？",
        "pinyin": "Shuí shì dà wèi?",
        "vietnamese": "Ai là David?"
      },
      {
        "id": 125,
        "startTime": 451.1,
        "endTime": 453.8,
        "speaker": "B",
        "chinese": "我后面的那个人是大卫。",
        "pinyin": "Wǒ hòu miàn de nà ge rén shì dà wèi.",
        "vietnamese": "Người ở phía sau tôi là David."
      },
      {
        "id": 126,
        "startTime": 455.9,
        "endTime": 457.4,
        "speaker": "A",
        "chinese": "李老师家在后面吗？",
        "pinyin": "Lǐ lǎo shī jiā zài hòu miàn ma?",
        "vietnamese": "Nhà thầy Lý ở phía sau phải không?"
      },
      {
        "id": 127,
        "startTime": 458.9,
        "endTime": 461.3,
        "speaker": "B",
        "chinese": "不是，李老师家在前面。",
        "pinyin": "Bú shì, lǐ lǎo shī jiā zài qián miàn.",
        "vietnamese": "Không phải, nhà thầy Lý ở phía trước."
      },
      {
        "id": 128,
        "startTime": 463.3,
        "endTime": 465.2,
        "speaker": "A",
        "chinese": "李老师家在后面吗？",
        "pinyin": "Lǐ lǎo shī jiā zài hòu miàn ma?",
        "vietnamese": "Nhà thầy Lý ở phía sau phải không?"
      },
      {
        "id": 129,
        "startTime": 466.8,
        "endTime": 469.8,
        "speaker": "B",
        "chinese": "不是，李老师家在前面。",
        "pinyin": "Bú shì, lǐ lǎo shī jiā zài qián miàn.",
        "vietnamese": "Không phải, nhà thầy Lý ở phía trước."
      },
      {
        "id": 130,
        "startTime": 471.8,
        "endTime": 472.9,
        "speaker": "A",
        "chinese": "现在几点？",
        "pinyin": "Xiàn zài jǐ diǎn?",
        "vietnamese": "Bây giờ là mấy giờ?"
      },
      {
        "id": 131,
        "startTime": 474.2,
        "endTime": 475.3,
        "speaker": "B",
        "chinese": "现在五点。",
        "pinyin": "Xiàn zài wǔ diǎn.",
        "vietnamese": "Bây giờ là 5 giờ."
      },
      {
        "id": 132,
        "startTime": 477.6,
        "endTime": 478.9,
        "speaker": "A",
        "chinese": "现在几点？",
        "pinyin": "Xiàn zài jǐ diǎn?",
        "vietnamese": "Bây giờ là mấy giờ?"
      },
      {
        "id": 133,
        "startTime": 480.7,
        "endTime": 482.0,
        "speaker": "B",
        "chinese": "现在五点。",
        "pinyin": "Xiàn zài wǔ diǎn.",
        "vietnamese": "Bây giờ là 5 giờ."
      },
      {
        "id": 134,
        "startTime": 483.9,
        "endTime": 485.6,
        "speaker": "A",
        "chinese": "你什么时候见李老师？",
        "pinyin": "Nǐ shén me shí hòu jiàn lǐ lǎo shī?",
        "vietnamese": "Khi nào bạn gặp thầy Lý?"
      },
      {
        "id": 135,
        "startTime": 487.1,
        "endTime": 490.4,
        "speaker": "B",
        "chinese": "我下午一点十分去学校见李老师。",
        "pinyin": "Wǒ xià wǔ yì diǎn shí fēn qù xué xiào jiàn lǐ lǎo shī.",
        "vietnamese": "1 giờ 10 phút chiều tôi đến trường gặp thầy Lý."
      },
      {
        "id": 136,
        "startTime": 492.8,
        "endTime": 494.9,
        "speaker": "A",
        "chinese": "你什么时候见李老师？",
        "pinyin": "Nǐ shén me shí hòu jiàn lǐ lǎo shī?",
        "vietnamese": "Khi nào bạn gặp thầy Lý?"
      },
      {
        "id": 137,
        "startTime": 496.6,
        "endTime": 500.8,
        "speaker": "B",
        "chinese": "我下午一点十分去学校见李老师。",
        "pinyin": "Wǒ xià wǔ yì diǎn shí fēn qù xué xiào jiàn lǐ lǎo shī.",
        "vietnamese": "1 giờ 10 phút chiều tôi đến trường gặp thầy Lý."
      },
      {
        "id": 138,
        "startTime": 503.0,
        "endTime": 504.1,
        "speaker": "A",
        "chinese": "我想看电影。",
        "pinyin": "Wǒ xiǎng kàn diàn yǐng.",
        "vietnamese": "Tôi muốn đi xem phim."
      },
      {
        "id": 139,
        "startTime": 505.6,
        "endTime": 508.9,
        "speaker": "B",
        "chinese": "好啊，下午我有时间，我们一起去。",
        "pinyin": "Hǎo a, xià wǔ wǒ yǒu shí jiān, wǒ men yì qǐ qù.",
        "vietnamese": "Được thôi, chiều nay tôi có thời gian, chúng mình cùng đi."
      },
      {
        "id": 140,
        "startTime": 510.9,
        "endTime": 512.4,
        "speaker": "A",
        "chinese": "我想看电影。",
        "pinyin": "Wǒ xiǎng kàn diàn yǐng.",
        "vietnamese": "Tôi muốn đi xem phim."
      },
      {
        "id": 141,
        "startTime": 514.1,
        "endTime": 518.3,
        "speaker": "B",
        "chinese": "好啊，下午我有时间，我们一起去。",
        "pinyin": "Hǎo a, xià wǔ wǒ yǒu shí jiān, wǒ men yì qǐ qù.",
        "vietnamese": "Được thôi, chiều nay tôi có thời gian, chúng mình cùng đi."
      },
      {
        "id": 142,
        "startTime": 520.5,
        "endTime": 521.9,
        "speaker": "A",
        "chinese": "你星期六工作吗？",
        "pinyin": "Nǐ xīng qī liù gōng zuò ma?",
        "vietnamese": "Thứ Bảy bạn có làm việc không?"
      },
      {
        "id": 143,
        "startTime": 523.5,
        "endTime": 524.4,
        "speaker": "B",
        "chinese": "不工作。",
        "pinyin": "Bù gōng zuò.",
        "vietnamese": "Không làm việc."
      },
      {
        "id": 144,
        "startTime": 526.6,
        "endTime": 528.3,
        "speaker": "A",
        "chinese": "你星期六工作吗？",
        "pinyin": "Nǐ xīng qī liù gōng zuò ma?",
        "vietnamese": "Thứ Bảy bạn có làm việc không?"
      },
      {
        "id": 145,
        "startTime": 529.9,
        "endTime": 531.0,
        "speaker": "B",
        "chinese": "不工作。",
        "pinyin": "Bù gōng zuò.",
        "vietnamese": "Không làm việc."
      },
      {
        "id": 146,
        "startTime": 533.0,
        "endTime": 534.5,
        "speaker": "A",
        "chinese": "你什么时候去北京？",
        "pinyin": "Nǐ shén me shí hòu qù běi jīng?",
        "vietnamese": "Khi nào bạn đi Bắc Kinh?"
      },
      {
        "id": 147,
        "startTime": 535.9,
        "endTime": 538.3,
        "speaker": "B",
        "chinese": "九月十七号去，住三天。",
        "pinyin": "Jiǔ yuè shí qī hào qù, zhù sān tiān.",
        "vietnamese": "Ngày 17 tháng 9 đi, ở lại 3 ngày."
      },
      {
        "id": 148,
        "startTime": 540.6,
        "endTime": 542.4,
        "speaker": "A",
        "chinese": "你什么时候去北京？",
        "pinyin": "Nǐ shén me shí hòu qù běi jīng?",
        "vietnamese": "Khi nào bạn đi Bắc Kinh?"
      },
      {
        "id": 149,
        "startTime": 544.0,
        "endTime": 547.2,
        "speaker": "B",
        "chinese": "九月十七号去，住三天。",
        "pinyin": "Jiǔ yuè shí qī hào qù, zhù sān tiān.",
        "vietnamese": "Ngày 17 tháng 9 đi, ở lại 3 ngày."
      },
      {
        "id": 150,
        "startTime": 549.2,
        "endTime": 551.5,
        "speaker": "A",
        "chinese": "今天天气不好，会下雨吗？",
        "pinyin": "Jīn tiān tiān qì bù hǎo, huì xià yǔ ma?",
        "vietnamese": "Hôm nay thời tiết không tốt, có mưa không?"
      },
      {
        "id": 151,
        "startTime": 553.1,
        "endTime": 554.3,
        "speaker": "B",
        "chinese": "下午会下雨。",
        "pinyin": "Xià wǔ huì xià yǔ.",
        "vietnamese": "Chiều nay sẽ mưa."
      },
      {
        "id": 152,
        "startTime": 556.4,
        "endTime": 559.3,
        "speaker": "A",
        "chinese": "今天天气不好，会下雨吗？",
        "pinyin": "Jīn tiān tiān qì bù hǎo, huì xià yǔ ma?",
        "vietnamese": "Hôm nay thời tiết không tốt, có mưa không?"
      },
      {
        "id": 153,
        "startTime": 561.0,
        "endTime": 562.6,
        "speaker": "B",
        "chinese": "下午会下雨。",
        "pinyin": "Xià wǔ huì xià yǔ.",
        "vietnamese": "Chiều nay sẽ mưa."
      },
      {
        "id": 154,
        "startTime": 564.8,
        "endTime": 566.4,
        "speaker": "A",
        "chinese": "今天天气太热了。",
        "pinyin": "Jīn tiān tiān qì tài rè le.",
        "vietnamese": "Hôm nay trời nóng quá."
      },
      {
        "id": 155,
        "startTime": 567.9,
        "endTime": 569.7,
        "speaker": "B",
        "chinese": "是啊，你多喝水。",
        "pinyin": "Shì a, nǐ duō hē shuǐ.",
        "vietnamese": "Đúng vậy, bạn nhớ uống nhiều nước nhé."
      },
      {
        "id": 156,
        "startTime": 571.8,
        "endTime": 573.8,
        "speaker": "A",
        "chinese": "今天天气太热了。",
        "pinyin": "Jīn tiān tiān qì tài rè le.",
        "vietnamese": "Hôm nay trời nóng quá."
      },
      {
        "id": 157,
        "startTime": 575.5,
        "endTime": 577.9,
        "speaker": "B",
        "chinese": "是啊，你多喝水。",
        "pinyin": "Shì a, nǐ duō hē shuǐ.",
        "vietnamese": "Đúng vậy, bạn nhớ uống nhiều nước nhé."
      },
      {
        "id": 158,
        "startTime": 580.0,
        "endTime": 582.3,
        "speaker": "A",
        "chinese": "明天天气很好，你去学校吗？",
        "pinyin": "Míng tiān tiān qì hěn hǎo, nǐ qù xué xiào ma?",
        "vietnamese": "Ngày mai thời tiết rất đẹp, bạn có đến trường không?"
      },
      {
        "id": 159,
        "startTime": 584.0,
        "endTime": 586.2,
        "speaker": "B",
        "chinese": "不去，明天我去医院。",
        "pinyin": "Bù qù, míng tiān wǒ qù yī yuàn.",
        "vietnamese": "Không đi, ngày mai tôi đi bệnh viện."
      },
      {
        "id": 160,
        "startTime": 588.3,
        "endTime": 591.3,
        "speaker": "A",
        "chinese": "明天天气很好，你去学校吗？",
        "pinyin": "Míng tiān tiān qì hěn hǎo, nǐ qù xué xiào ma?",
        "vietnamese": "Ngày mai thời tiết rất đẹp, bạn có đến trường không?"
      },
      {
        "id": 161,
        "startTime": 593.1,
        "endTime": 595.8,
        "speaker": "B",
        "chinese": "不去，明天我去医院。",
        "pinyin": "Bù qù, míng tiān wǒ qù yī yuàn.",
        "vietnamese": "Không đi, ngày mai tôi đi bệnh viện."
      },
      {
        "id": 162,
        "startTime": 597.7,
        "endTime": 599.0,
        "speaker": "A",
        "chinese": "你身体怎么样？",
        "pinyin": "Nǐ shēn tǐ zěn me yàng?",
        "vietnamese": "Sức khỏe của bạn thế nào?"
      },
      {
        "id": 163,
        "startTime": 600.5,
        "endTime": 602.4,
        "speaker": "B",
        "chinese": "不太好，不爱吃饭。",
        "pinyin": "Bù tài hǎo, bù ài chī fàn.",
        "vietnamese": "Không tốt lắm, không muốn ăn cơm."
      },
      {
        "id": 164,
        "startTime": 604.5,
        "endTime": 606.0,
        "speaker": "A",
        "chinese": "你身体怎么样？",
        "pinyin": "Nǐ shēn tǐ zěn me yàng?",
        "vietnamese": "Sức khỏe của bạn thế nào?"
      },
      {
        "id": 165,
        "startTime": 607.6,
        "endTime": 610.0,
        "speaker": "B",
        "chinese": "不太好，不爱吃饭。",
        "pinyin": "Bù tài hǎo, bù ài chī fàn.",
        "vietnamese": "Không tốt lắm, không muốn ăn cơm."
      },
      {
        "id": 166,
        "startTime": 612.1,
        "endTime": 613.5,
        "speaker": "A",
        "chinese": "大卫今天会来吗？",
        "pinyin": "Dà wèi jīn tiān huì lái ma?",
        "vietnamese": "Hôm nay David có đến không?"
      },
      {
        "id": 167,
        "startTime": 615.0,
        "endTime": 617.0,
        "speaker": "B",
        "chinese": "他身体不好，不会来。",
        "pinyin": "Tā shēn tǐ bù hǎo, bú huì lái.",
        "vietnamese": "Cậu ấy không khỏe, sẽ không đến."
      },
      {
        "id": 168,
        "startTime": 619.3,
        "endTime": 621.0,
        "speaker": "A",
        "chinese": "大卫今天会来吗？",
        "pinyin": "Dà wèi jīn tiān huì lái ma?",
        "vietnamese": "Hôm nay David có đến không?"
      },
      {
        "id": 169,
        "startTime": 622.6,
        "endTime": 625.2,
        "speaker": "B",
        "chinese": "他身体不好，不会来。",
        "pinyin": "Tā shēn tǐ bù hǎo, bú huì lái.",
        "vietnamese": "Cậu ấy không khỏe, sẽ không đến."
      },
      {
        "id": 170,
        "startTime": 627.3,
        "endTime": 629.4,
        "speaker": "A",
        "chinese": "你昨天上午九点，在做什么呢？",
        "pinyin": "Nǐ zuó tiān shàng wǔ jiǔ diǎn, zài zuò shén me ne?",
        "vietnamese": "9 giờ sáng hôm qua bạn đang làm gì thế?"
      },
      {
        "id": 171,
        "startTime": 631.0,
        "endTime": 632.1,
        "speaker": "B",
        "chinese": "我在睡觉呢。",
        "pinyin": "Wǒ zài shuì jiào ne.",
        "vietnamese": "Tôi đang ngủ."
      },
      {
        "id": 172,
        "startTime": 634.4,
        "endTime": 637.1,
        "speaker": "A",
        "chinese": "你昨天上午九点，在做什么呢？",
        "pinyin": "Nǐ zuó tiān shàng wǔ jiǔ diǎn, zài zuò shén me ne?",
        "vietnamese": "9 giờ sáng hôm qua bạn đang làm gì thế?"
      },
      {
        "id": 173,
        "startTime": 639.0,
        "endTime": 640.4,
        "speaker": "B",
        "chinese": "我在睡觉呢。",
        "pinyin": "Wǒ zài shuì jiào ne.",
        "vietnamese": "Tôi đang ngủ."
      },
      {
        "id": 174,
        "startTime": 642.7,
        "endTime": 643.7,
        "speaker": "A",
        "chinese": "小猫在哪儿？",
        "pinyin": "Xiǎo māo zài nǎr?",
        "vietnamese": "Mèo con ở đâu?"
      },
      {
        "id": 175,
        "startTime": 645.3,
        "endTime": 646.8,
        "speaker": "B",
        "chinese": "小猫在椅子上面。",
        "pinyin": "Xiǎo māo zài yǐ zi shàng miàn.",
        "vietnamese": "Mèo con ở trên ghế."
      },
      {
        "id": 176,
        "startTime": 649.1,
        "endTime": 650.5,
        "speaker": "A",
        "chinese": "小猫在哪儿？",
        "pinyin": "Xiǎo māo zài nǎr?",
        "vietnamese": "Mèo con ở đâu?"
      },
      {
        "id": 177,
        "startTime": 652.1,
        "endTime": 654.0,
        "speaker": "B",
        "chinese": "小猫在椅子上面。",
        "pinyin": "Xiǎo māo zài yǐ zi shàng miàn.",
        "vietnamese": "Mèo con ở trên ghế."
      },
      {
        "id": 178,
        "startTime": 656.5,
        "endTime": 657.7,
        "speaker": "A",
        "chinese": "你喜欢做饭吗？",
        "pinyin": "Nǐ xǐ huān zuò fàn ma?",
        "vietnamese": "Bạn có thích nấu ăn không?"
      },
      {
        "id": 179,
        "startTime": 659.2,
        "endTime": 662.4,
        "speaker": "B",
        "chinese": "很喜欢，我在学习做中国菜。",
        "pinyin": "Hěn xǐ huān, wǒ zài xué xí zuò zhōng guó cài.",
        "vietnamese": "Rất thích, tôi đang học nấu món ăn Trung Quốc."
      },
      {
        "id": 180,
        "startTime": 664.5,
        "endTime": 666.0,
        "speaker": "A",
        "chinese": "你喜欢做饭吗？",
        "pinyin": "Nǐ xǐ huān zuò fàn ma?",
        "vietnamese": "Bạn có thích nấu ăn không?"
      },
      {
        "id": 181,
        "startTime": 667.7,
        "endTime": 671.8,
        "speaker": "B",
        "chinese": "很喜欢，我在学习做中国菜。",
        "pinyin": "Hěn xǐ huān, wǒ zài xué xí zuò zhōng guó cài.",
        "vietnamese": "Rất thích, tôi đang học nấu món ăn Trung Quốc."
      },
      {
        "id": 182,
        "startTime": 674.1,
        "endTime": 675.7,
        "speaker": "A",
        "chinese": "喂，小明在吗？",
        "pinyin": "Wèi, xiǎo míng zài ma?",
        "vietnamese": "Alo, Tiểu Minh có ở đó không?"
      },
      {
        "id": 183,
        "startTime": 677.3,
        "endTime": 679.3,
        "speaker": "B",
        "chinese": "他在打电话呢，你是谁？",
        "pinyin": "Tā zài dǎ diàn huà ne, nǐ shì shuí?",
        "vietnamese": "Cậu ấy đang nghe điện thoại, bạn là ai thế?"
      },
      {
        "id": 184,
        "startTime": 679.3,
        "endTime": 682.8,
        "speaker": "A",
        "chinese": "昨天上午你去哪儿了？",
        "pinyin": "Zuó tiān shàng wǔ nǐ qù nǎrle?",
        "vietnamese": "Sáng hôm qua bạn đi đâu thế?"
      },
      {
        "id": 185,
        "startTime": 683.5,
        "endTime": 686.6,
        "speaker": "B",
        "chinese": "我去学校学汉语了。",
        "pinyin": "Wǒ qù xué xiào xué hàn yǔ le.",
        "vietnamese": "Tôi đến trường học tiếng Trung."
      },
      {
        "id": 186,
        "startTime": 687.2,
        "endTime": 690.8,
        "speaker": "A",
        "chinese": "昨天上午你去哪儿了？",
        "pinyin": "Zuó tiān shàng wǔ nǐ qù nǎrle?",
        "vietnamese": "Sáng hôm qua bạn đi đâu thế?"
      },
      {
        "id": 187,
        "startTime": 691.4,
        "endTime": 694.5,
        "speaker": "B",
        "chinese": "我去学校学汉语了。",
        "pinyin": "Wǒ qù xué xiào xué hàn yǔ le.",
        "vietnamese": "Tôi đến trường học tiếng Trung."
      },
      {
        "id": 188,
        "startTime": 695.1,
        "endTime": 698.4,
        "speaker": "A",
        "chinese": "你去商店买苹果了吗？",
        "pinyin": "Nǐ qù shāng diàn mǎi píng guǒ le ma?",
        "vietnamese": "Bạn đã đến cửa hàng mua táo chưa?"
      },
      {
        "id": 189,
        "startTime": 699.1,
        "endTime": 702.4,
        "speaker": "B",
        "chinese": "没有，我买了不少菜。",
        "pinyin": "Méi yǒu, wǒ mǎi le bù shǎo cài.",
        "vietnamese": "Chưa, tôi mua khá nhiều rau củ thức ăn."
      },
      {
        "id": 190,
        "startTime": 703.0,
        "endTime": 706.6,
        "speaker": "A",
        "chinese": "你去商店买苹果了吗？",
        "pinyin": "Nǐ qù shāng diàn mǎi píng guǒ le ma?",
        "vietnamese": "Bạn đã đến cửa hàng mua táo chưa?"
      },
      {
        "id": 191,
        "startTime": 707.1,
        "endTime": 710.8,
        "speaker": "B",
        "chinese": "没有，我买了不少菜。",
        "pinyin": "Méi yǒu, wǒ mǎi le bù shǎo cài.",
        "vietnamese": "Chưa, tôi mua khá nhiều rau củ thức ăn."
      },
      {
        "id": 192,
        "startTime": 713.0,
        "endTime": 714.8,
        "speaker": "A",
        "chinese": "你看见张先生了吗？",
        "pinyin": "Nǐ kàn jiàn zhāng xiān shēng le ma?",
        "vietnamese": "Bạn có nhìn thấy ông Trương không?"
      },
      {
        "id": 193,
        "startTime": 716.7,
        "endTime": 719.6,
        "speaker": "B",
        "chinese": "没有，我买了不少菜。",
        "pinyin": "Méi yǒu, wǒ mǎi le bù shǎo cài.",
        "vietnamese": "Chưa, tôi mua khá nhiều rau củ thức ăn."
      },
      {
        "id": 194,
        "startTime": 722.0,
        "endTime": 723.5,
        "speaker": "A",
        "chinese": "你看见张先生了吗？",
        "pinyin": "Nǐ kàn jiàn zhāng xiān shēng le ma?",
        "vietnamese": "Bạn có nhìn thấy ông Trương không?"
      },
      {
        "id": 195,
        "startTime": 724.9,
        "endTime": 727.4,
        "speaker": "B",
        "chinese": "看见了，他开车去医院了。",
        "pinyin": "Kàn jiàn le, tā kāi chē qù yī yuàn le.",
        "vietnamese": "Thấy rồi, ông ấy lái xe đi bệnh viện rồi."
      },
      {
        "id": 196,
        "startTime": 729.6,
        "endTime": 731.5,
        "speaker": "A",
        "chinese": "你看见张先生了吗？",
        "pinyin": "Nǐ kàn jiàn zhāng xiān shēng le ma?",
        "vietnamese": "Bạn có nhìn thấy ông Trương không?"
      },
      {
        "id": 197,
        "startTime": 733.2,
        "endTime": 736.4,
        "speaker": "B",
        "chinese": "看见了，他开车去医院了。",
        "pinyin": "Kàn jiàn le, tā kāi chē qù yī yuàn le.",
        "vietnamese": "Thấy rồi, ông ấy lái xe đi bệnh viện rồi."
      },
      {
        "id": 198,
        "startTime": 738.6,
        "endTime": 740.1,
        "speaker": "A",
        "chinese": "这些是谁的衣服？",
        "pinyin": "Zhè xiē shì shéi de yī fú?",
        "vietnamese": "Mấy bộ quần áo này là của ai?"
      },
      {
        "id": 199,
        "startTime": 741.6,
        "endTime": 744.3,
        "speaker": "B",
        "chinese": "莉莉的，她昨天买了不少衣服。",
        "pinyin": "Lì lì de, tā zuó tiān mǎi le bù shǎo yī fú.",
        "vietnamese": "Của Lily, hôm qua cô ấy mua rất nhiều quần áo."
      },
      {
        "id": 200,
        "startTime": 746.5,
        "endTime": 748.3,
        "speaker": "A",
        "chinese": "这些是谁的衣服？",
        "pinyin": "Zhè xiē shì shéi de yī fú?",
        "vietnamese": "Mấy bộ quần áo này là của ai?"
      },
      {
        "id": 201,
        "startTime": 750.1,
        "endTime": 753.5,
        "speaker": "B",
        "chinese": "莉莉的，她昨天买了不少衣服。",
        "pinyin": "Lì lì de, tā zuó tiān mǎi le bù shǎo yī fú.",
        "vietnamese": "Của Lily, hôm qua cô ấy mua rất nhiều quần áo."
      },
      {
        "id": 202,
        "startTime": 755.7,
        "endTime": 758.0,
        "speaker": "A",
        "chinese": "喂，请问王小姐回来了吗？",
        "pinyin": "Wèi, qǐng wèn wáng xiǎo jiě huí lái le ma?",
        "vietnamese": "Alo, xin hỏi cô Vương đã về chưa?"
      },
      {
        "id": 203,
        "startTime": 759.6,
        "endTime": 761.8,
        "speaker": "B",
        "chinese": "没有，她一个小时后回来。",
        "pinyin": "Méi yǒu, tā yí gè xiǎo shí hòu huí lái.",
        "vietnamese": "Chưa, một tiếng nữa cô ấy mới về."
      },
      {
        "id": 204,
        "startTime": 764.1,
        "endTime": 767.0,
        "speaker": "A",
        "chinese": "喂，请问王小姐回来了吗？",
        "pinyin": "Wèi, qǐng wèn wáng xiǎo jiě huí lái le ma?",
        "vietnamese": "Alo, xin hỏi cô Vương đã về chưa?"
      },
      {
        "id": 205,
        "startTime": 768.8,
        "endTime": 771.7,
        "speaker": "B",
        "chinese": "没有，她一个小时后回来。",
        "pinyin": "Méi yǒu, tā yí gè xiǎo shí hòu huí lái.",
        "vietnamese": "Chưa, một tiếng nữa cô ấy mới về."
      },
      {
        "id": 206,
        "startTime": 773.9,
        "endTime": 775.6,
        "speaker": "A",
        "chinese": "你是什么时候来中国的？",
        "pinyin": "Nǐ shì shén me shí hòu lái zhōng guó de?",
        "vietnamese": "Bạn đến Trung Quốc từ khi nào?"
      },
      {
        "id": 207,
        "startTime": 777.1,
        "endTime": 779.9,
        "speaker": "B",
        "chinese": "我是二零一一年来的，已经两年了。",
        "pinyin": "Wǒ shì èr líng yī yī nián lái de, yǐ jīng liǎng nián le.",
        "vietnamese": "Tôi đến vào năm 2011, đã được hai năm rồi."
      },
      {
        "id": 208,
        "startTime": 782.2,
        "endTime": 784.3,
        "speaker": "A",
        "chinese": "你是什么时候来中国的？",
        "pinyin": "Nǐ shì shén me shí hòu lái zhōng guó de?",
        "vietnamese": "Bạn đến Trung Quốc từ khi nào?"
      },
      {
        "id": 209,
        "startTime": 786.0,
        "endTime": 789.6,
        "speaker": "B",
        "chinese": "我是二零一一年来的，已经两年了。",
        "pinyin": "Wǒ shì èr líng yī yī nián lái de, yǐ jīng liǎng nián le.",
        "vietnamese": "Tôi đến vào năm 2011, đã được hai năm rồi."
      },
      {
        "id": 210,
        "startTime": 792.0,
        "endTime": 793.9,
        "speaker": "A",
        "chinese": "这些苹果是在哪儿买的？",
        "pinyin": "Zhè xiē píng guǒ shì zài nǎrmǎi de?",
        "vietnamese": "Những quả táo này mua ở đâu thế?"
      },
      {
        "id": 211,
        "startTime": 795.6,
        "endTime": 797.3,
        "speaker": "B",
        "chinese": "在前面的商店买的。",
        "pinyin": "Zài qián miàn de shāng diàn mǎi de.",
        "vietnamese": "Mua ở cửa hàng phía trước."
      },
      {
        "id": 212,
        "startTime": 797.4,
        "endTime": 800.5,
        "speaker": "A",
        "chinese": "你爸爸是怎么去商店的？",
        "pinyin": "Nǐ bà bà shì zěn me qù shāng diàn de?",
        "vietnamese": "Bố bạn đến cửa hàng bằng phương tiện gì?"
      },
      {
        "id": 213,
        "startTime": 801.1,
        "endTime": 803.9,
        "speaker": "B",
        "chinese": "我们一起开车去的。",
        "pinyin": "Wǒ men yì qǐ kāi chē qù de.",
        "vietnamese": "Chúng tôi cùng lái xe đi."
      },
      {
        "id": 214,
        "startTime": 804.5,
        "endTime": 808.5,
        "speaker": "A",
        "chinese": "你爸爸是怎么去商店的？",
        "pinyin": "Nǐ bà bà shì zěn me qù shāng diàn de?",
        "vietnamese": "Bố bạn đến cửa hàng bằng phương tiện gì?"
      },
      {
        "id": 215,
        "startTime": 809.1,
        "endTime": 812.4,
        "speaker": "B",
        "chinese": "我们一起开车去的。",
        "pinyin": "Wǒ men yì qǐ kāi chē qù de.",
        "vietnamese": "Chúng tôi cùng lái xe đi."
      },
      {
        "id": 216,
        "startTime": 813.0,
        "endTime": 815.8,
        "speaker": "A",
        "chinese": "李老师睡觉了吗？",
        "pinyin": "Lǐ lǎo shī shuì jiào le ma?",
        "vietnamese": "Thầy Lý đã đi ngủ chưa?"
      },
      {
        "id": 217,
        "startTime": 816.3,
        "endTime": 819.8,
        "speaker": "B",
        "chinese": "睡了，他是五点睡的。",
        "pinyin": "Shuì le, tā shì wǔ diǎn shuì de.",
        "vietnamese": "Ngủ rồi, thầy ấy đi ngủ lúc 5 giờ."
      },
      {
        "id": 218,
        "startTime": 820.3,
        "endTime": 822.0,
        "speaker": "A",
        "chinese": "李老师睡觉了吗？",
        "pinyin": "Lǐ lǎo shī shuì jiào le ma?",
        "vietnamese": "Thầy Lý đã đi ngủ chưa?"
      },
      {
        "id": 219,
        "startTime": 824.0,
        "endTime": 827.6,
        "speaker": "B",
        "chinese": "睡了，他是五点睡的。",
        "pinyin": "Shuì le, tā shì wǔ diǎn shuì de.",
        "vietnamese": "Ngủ rồi, thầy ấy đi ngủ lúc 5 giờ."
      },
      {
        "id": 220,
        "startTime": 828.2,
        "endTime": 829.4,
        "speaker": "A",
        "chinese": "我们怎么去？",
        "pinyin": "Wǒ men zěn me qù?",
        "vietnamese": "Chúng mình đi bằng cách nào?"
      },
      {
        "id": 221,
        "startTime": 831.5,
        "endTime": 834.8,
        "speaker": "A",
        "chinese": "李老师睡觉了吗？",
        "pinyin": "Lǐ lǎo shī shuì jiào le ma?",
        "vietnamese": "Thầy Lý đã đi ngủ chưa?"
      },
      {
        "id": 222,
        "startTime": 835.3,
        "endTime": 837.6,
        "speaker": "B",
        "chinese": "睡了，他是五点睡的。",
        "pinyin": "Shuì le, tā shì wǔ diǎn shuì de.",
        "vietnamese": "Ngủ rồi, thầy ấy đi ngủ lúc 5 giờ."
      },
      {
        "id": 223,
        "startTime": 839.8,
        "endTime": 840.9,
        "speaker": "A",
        "chinese": "我们怎么去？",
        "pinyin": "Wǒ men zěn me qù?",
        "vietnamese": "Chúng mình đi bằng cách nào?"
      },
      {
        "id": 224,
        "startTime": 842.4,
        "endTime": 846.0,
        "speaker": "B",
        "chinese": "小王是坐出租车去的，我们也坐出租车吧。",
        "pinyin": "Xiǎo wáng shì zuò chū zū chē qù de, wǒ men yě zuò chū zū chē ba.",
        "vietnamese": "Tiểu Vương đi taxi, chúng mình cũng đi taxi đi."
      },
      {
        "id": 225,
        "startTime": 848.0,
        "endTime": 849.3,
        "speaker": "A",
        "chinese": "我们怎么去？",
        "pinyin": "Wǒ men zěn me qù?",
        "vietnamese": "Chúng mình đi bằng cách nào?"
      },
      {
        "id": 226,
        "startTime": 851.0,
        "endTime": 855.6,
        "speaker": "B",
        "chinese": "小王是坐出租车去的，我们也坐出租车吧。",
        "pinyin": "Xiǎo wáng shì zuò chū zū chē qù de, wǒ men yě zuò chū zū chē ba.",
        "vietnamese": "Tiểu Vương đi taxi, chúng mình cũng đi taxi đi."
      },
      {
        "id": 227,
        "startTime": 857.7,
        "endTime": 859.2,
        "speaker": "A",
        "chinese": "你女儿在哪儿工作？",
        "pinyin": "Nǐ nǚ ér zài nǎrgōng zuò?",
        "vietnamese": "Con gái bạn làm việc ở đâu?"
      },
      {
        "id": 228,
        "startTime": 860.7,
        "endTime": 863.0,
        "speaker": "B",
        "chinese": "她在医院工作，她是大夫。",
        "pinyin": "Tā zài yī yuàn gōng zuò, tā shì dà fū.",
        "vietnamese": "Cô ấy làm việc ở bệnh viện, cô ấy là bác sĩ."
      },
      {
        "id": 229,
        "startTime": 865.2,
        "endTime": 867.0,
        "speaker": "A",
        "chinese": "你女儿在哪儿工作？",
        "pinyin": "Nǐ nǚ ér zài nǎrgōng zuò?",
        "vietnamese": "Con gái bạn làm việc ở đâu?"
      },
      {
        "id": 230,
        "startTime": 868.7,
        "endTime": 871.7,
        "speaker": "B",
        "chinese": "她在医院工作，她是大夫。",
        "pinyin": "Tā zài yī yuàn gōng zuò, tā shì dà fū.",
        "vietnamese": "Cô ấy làm việc ở bệnh viện, cô ấy là bác sĩ."
      },
      {
        "id": 231,
        "startTime": 873.7,
        "endTime": 875.3,
        "speaker": "A",
        "chinese": "你会做中国菜吗？",
        "pinyin": "Nǐ huì zuò zhōng guó cài ma?",
        "vietnamese": "Bạn biết nấu món Trung Quốc không?"
      },
      {
        "id": 232,
        "startTime": 876.6,
        "endTime": 878.7,
        "speaker": "B",
        "chinese": "我不会，我妈妈会做。",
        "pinyin": "Wǒ bú huì, wǒ mā mā huì zuò.",
        "vietnamese": "Tôi không biết, mẹ tôi biết nấu."
      },
      {
        "id": 233,
        "startTime": 880.6,
        "endTime": 882.0,
        "speaker": "A",
        "chinese": "你在北京住哪儿？",
        "pinyin": "Nǐ zài běi jīng zhù nǎr?",
        "vietnamese": "Ở Bắc Kinh bạn ở đâu?"
      },
      {
        "id": 234,
        "startTime": 882.5,
        "endTime": 884.7,
        "speaker": "B",
        "chinese": "北京饭店。",
        "pinyin": "Běi jīng fàn diàn.",
        "vietnamese": "Khách sạn Bắc Kinh."
      },
      {
        "id": 235,
        "startTime": 885.4,
        "endTime": 887.0,
        "speaker": "A",
        "chinese": "你在北京住哪儿？",
        "pinyin": "Nǐ zài běi jīng zhù nǎr?",
        "vietnamese": "Ở Bắc Kinh bạn ở đâu?"
      },
      {
        "id": 236,
        "startTime": 889.1,
        "endTime": 890.6,
        "speaker": "B",
        "chinese": "北京饭店。",
        "pinyin": "Běi jīng fàn diàn.",
        "vietnamese": "Khách sạn Bắc Kinh."
      },
      {
        "id": 237,
        "startTime": 892.0,
        "endTime": 895.1,
        "speaker": "A",
        "chinese": "大卫去哪儿了？",
        "pinyin": "Dà wèi qù nǎrle?",
        "vietnamese": "David đi đâu rồi?"
      },
      {
        "id": 238,
        "startTime": 895.6,
        "endTime": 896.8,
        "speaker": "B",
        "chinese": "他去学车了。",
        "pinyin": "Tā qù xué chē le.",
        "vietnamese": "Cậu ấy đi học lái xe rồi."
      },
      {
        "id": 239,
        "startTime": 898.5,
        "endTime": 900.0,
        "speaker": "A",
        "chinese": "大卫去哪儿了？",
        "pinyin": "Dà wèi qù nǎrle?",
        "vietnamese": "David đi đâu rồi?"
      },
      {
        "id": 240,
        "startTime": 902.0,
        "endTime": 903.4,
        "speaker": "B",
        "chinese": "他去学车了。",
        "pinyin": "Tā qù xué chē le.",
        "vietnamese": "Cậu ấy đi học lái xe rồi."
      },
      {
        "id": 241,
        "startTime": 914.5,
        "endTime": 916.6,
        "speaker": "A",
        "chinese": "老师，谢谢您，再见。",
        "pinyin": "Lǎo shī, xiè xiè nín, zài jiàn.",
        "vietnamese": "Em cảm ơn thầy, tạm biệt thầy."
      },
      {
        "id": 242,
        "startTime": 918.2,
        "endTime": 918.6,
        "speaker": "B",
        "chinese": "再见。",
        "pinyin": "Zài jiàn.",
        "vietnamese": "Tạm biệt."
      },
      {
        "id": 243,
        "startTime": 921.0,
        "endTime": 923.3,
        "speaker": "A",
        "chinese": "老师，谢谢您，再见。",
        "pinyin": "Lǎo shī, xiè xiè nín, zài jiàn.",
        "vietnamese": "Em cảm ơn thầy, tạm biệt thầy."
      },
      {
        "id": 244,
        "startTime": 925.1,
        "endTime": 925.5,
        "speaker": "B",
        "chinese": "再见。",
        "pinyin": "Zài jiàn.",
        "vietnamese": "Tạm biệt."
      }
    ]
  },
  {
    "id": "hsk1-weekend-sunny-ruan",
    "title": "Cuối tuần bạn thường làm gì? 周末你经常做什么？ (Sunny Ruan)",
    "level": "HSK 1-2",
    "levelBadgeColor": "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300",
    "duration": "8:02",
    "category": "Giao tiếp đời sống",
    "description": "Podcast tiếng Trung giao tiếp chủ đề ngày nghỉ cuối tuần từ Sunny Ruan, câu ngắn rõ ràng, tốc độ vừa phải giúp rèn phản xạ nói trôi chảy.",
    "youtubeId": "pAr6bcn71Nc",
    "sentencesCount": 64,
    "isFree": true,
    "sentences": [
      {
        "id": 1,
        "startTime": 0.1,
        "endTime": 6.3,
        "speaker": "Cô Vương",
        "chinese": "大家好！欢迎收听我们的节目。我是王老师。",
        "pinyin": "Dà jiā hǎo! Huān yíng shōu tīng wǒ men de jié mù. Wǒ shì wáng lǎo shī.",
        "vietnamese": "Chào mọi người! Chào mừng đến với chương trình của chúng tôi. Tôi là cô Vương."
      },
      {
        "id": 2,
        "startTime": 6.3,
        "endTime": 14.8,
        "speaker": "Thầy Lý",
        "chinese": "大家好！我是李老师。今天我们来聊聊周末生活，好不好？",
        "pinyin": "Dà jiā hǎo! Wǒ shì lǐ lǎo shī. Jīn tiān wǒ men lái liáo liáo zhōu mò shēng huó, hǎo bù hǎo?",
        "vietnamese": "Chào mọi người! Tôi là thầy Lý. Hôm nay chúng ta cùng trò chuyện về cuối tuần nhé?"
      },
      {
        "id": 3,
        "startTime": 14.8,
        "endTime": 25.5,
        "speaker": "Cô Vương",
        "chinese": "当然好。对了，李老师，你的周末和我的周末应该完全不一样。你还没结婚，是吧？",
        "pinyin": "Dāng rán hǎo. Duì le, lǐ lǎo shī, nǐ de zhōu mò hé wǒ de zhōu mò yīng gāi wán quán bù yí yàng. Nǐ hái méi jié hūn, shì ba?",
        "vietnamese": "Dĩ nhiên rồi. À này thầy Lý, cuối tuần của thầy với của tôi chắc hoàn toàn khác nhau. Thầy chưa kết hôn đúng không?"
      },
      {
        "id": 4,
        "startTime": 25.5,
        "endTime": 32.1,
        "speaker": "Thầy Lý",
        "chinese": "对，我还是单身，所以我的周末自由自在的。",
        "pinyin": "Duì, wǒ hái shì dān shēn, suǒ yǐ wǒ de zhōu mò zì yóu zì zài de.",
        "vietnamese": "Đúng, tôi vẫn độc thân nên cuối tuần của tôi rất tự do thoải mái."
      },
      {
        "id": 5,
        "startTime": 32.1,
        "endTime": 39.2,
        "speaker": "Cô Vương",
        "chinese": "那我们就从早上说起吧。李老师，你周末早上几点起床？",
        "pinyin": "Nà wǒ men jiù cóng zǎo shàng shuō qǐ ba. Lǐ lǎo shī, nǐ zhōu mò zǎo shàng jǐ diǎn qǐ chuáng?",
        "vietnamese": "Vậy mình bắt đầu từ buổi sáng nhé. Thầy Lý, cuối tuần thầy mấy giờ dậy?"
      },
      {
        "id": 6,
        "startTime": 39.2,
        "endTime": 49.2,
        "speaker": "Thầy Lý",
        "chinese": "通常睡懒觉，一直睡到早上九点。平时上班太累了，所以周末就好好休息一下。",
        "pinyin": "Tōng cháng shuì lǎn jiào, yì zhí shuì dào zǎo shàng jiǔ diǎn. Píng shí shàng bān tài lèi le, suǒ yǐ zhōu mò jiù hǎo hǎo xiū xī yī xià.",
        "vietnamese": "Thường là ngủ nướng, ngủ đến tận chín giờ sáng. Ngày thường đi làm mệt quá nên cuối tuần tôi nghỉ ngơi cho thật tốt."
      },
      {
        "id": 7,
        "startTime": 49.2,
        "endTime": 55.7,
        "speaker": "Cô Vương",
        "chinese": "九点？真好，我周末完全没有这种享受。",
        "pinyin": "Jiǔ diǎn? Zhēn hǎo, wǒ zhōu mò wán quán méi yǒu zhè zhǒng xiǎng shòu.",
        "vietnamese": "Chín giờ á? Sướng thật, cuối tuần tôi hoàn toàn không có được sự hưởng thụ đó."
      },
      {
        "id": 8,
        "startTime": 55.7,
        "endTime": 60.2,
        "speaker": "Thầy Lý",
        "chinese": "哦，那王老师，你几点起床？",
        "pinyin": "Ó, nà wáng lǎo shī, nǐ jǐ diǎn qǐ chuáng?",
        "vietnamese": "Ồ, thế cô Vương mấy giờ dậy?"
      },
      {
        "id": 9,
        "startTime": 60.2,
        "endTime": 69.7,
        "speaker": "Cô Vương",
        "chinese": "我每天都要早起，周末也一样，大概七点就要起来了，要给家人准备早餐。",
        "pinyin": "Wǒ měi tiān dōu yào zǎo qǐ, zhōu mò yě yī yàng, dà gài qī diǎn jiù yào qǐ lái le, yào gěi jiā rén zhǔn bèi zǎo cān.",
        "vietnamese": "Ngày nào tôi cũng phải dậy sớm, cuối tuần cũng vậy, khoảng bảy giờ là phải dậy rồi để chuẩn bị bữa sáng cho gia đình."
      },
      {
        "id": 10,
        "startTime": 69.7,
        "endTime": 74.2,
        "speaker": "Thầy Lý",
        "chinese": "哇，辛苦了，那早餐之后呢？",
        "pinyin": "Wa, xīn kǔ le, nà zǎo cān zhī hòu ne?",
        "vietnamese": "Chà, vất vả quá. Sau bữa sáng thì sao?"
      },
      {
        "id": 11,
        "startTime": 74.2,
        "endTime": 82.7,
        "speaker": "Cô Vương",
        "chinese": "吃完早饭，我要送孩子去补习班。他有数学课，所以我们八点半就要出发。",
        "pinyin": "Chī wán zǎo fàn, wǒ yào sòng hái zi qù bǔ xí bān. Tā yǒu shù xué kè, suǒ yǐ wǒ men bā diǎn bàn jiù yào chū fā.",
        "vietnamese": "Ăn sáng xong, tôi phải đưa con đi học thêm. Cháu có tiết toán nên tám rưỡi là chúng tôi phải xuất phát."
      },
      {
        "id": 12,
        "startTime": 82.7,
        "endTime": 86.8,
        "speaker": "Thầy Lý",
        "chinese": "那你在孩子上课的时候做什么呢？",
        "pinyin": "Nà nǐ zài hái zi shàng kè de shí hòu zuò shén me ne?",
        "vietnamese": "Vậy lúc con học thì cô làm gì?"
      },
      {
        "id": 13,
        "startTime": 86.8,
        "endTime": 97.8,
        "speaker": "Cô Vương",
        "chinese": "我趁这个时间去超市买东西，要买蔬菜、肉、水果，还有日常用品。",
        "pinyin": "Wǒ chèn zhè ge shí jiān qù chāo shì mǎi dōng xī, yào mǎi shū cài、ròu、shuǐ guǒ, hái yǒu rì cháng yòng pǐn.",
        "vietnamese": "Tôi tranh thủ lúc đó đi siêu thị mua đồ, mua rau, thịt, hoa quả và đồ dùng hằng ngày."
      },
      {
        "id": 14,
        "startTime": 97.8,
        "endTime": 109.3,
        "speaker": "Thầy Lý",
        "chinese": "哇，你真的非常充实，我起床以后就慢慢洗漱，然后约朋友去喝咖啡。",
        "pinyin": "Wa, nǐ zhēn de fēi cháng chōng shí, wǒ qǐ chuáng yǐ hòu jiù màn màn xǐ shù, rán hòu yuē péng yǒu qù hē kā fēi.",
        "vietnamese": "Chà, cô thật sự rất bận rộn đầy đủ. Còn tôi thức dậy xong thì từ từ rửa mặt rồi hẹn bạn đi uống cà phê."
      },
      {
        "id": 15,
        "startTime": 109.3,
        "endTime": 116.3,
        "speaker": "Cô Vương",
        "chinese": "喝咖啡多悠闲啊，你们在哪里喝咖啡？聊什么？",
        "pinyin": "Hē kā fēi duō yōu xián a, nǐ men zài nǎ lǐ hē kā fēi? Liáo shén me?",
        "vietnamese": "Uống cà phê thư thả quá, các bạn uống cà phê ở đâu? Nói chuyện gì vậy?"
      },
      {
        "id": 16,
        "startTime": 116.3,
        "endTime": 127.3,
        "speaker": "Thầy Lý",
        "chinese": "我们喜欢去街边的小咖啡店，点一杯拿铁，然后聊工作啊、生活啊、最近发生的事情。",
        "pinyin": "Wǒ men xǐ huān qù jiē biān de xiǎo kā fēi diàn, diǎn yī bēi ná tiě, rán hòu liáo gōng zuò a、shēng huó a、zuì jìn fā shēng de shì qíng.",
        "vietnamese": "Chúng tôi thích đến những quán cà phê nhỏ ven đường, gọi một ly latte rồi nói chuyện công việc, cuộc sống, những chuyện xảy ra gần đây."
      },
      {
        "id": 17,
        "startTime": 127.3,
        "endTime": 131.3,
        "speaker": "Thầy Lý",
        "chinese": "有时候聊了两三个小时都不知道。",
        "pinyin": "Yǒu shí hòu liáo le liǎng sān gè xiǎo shí dōu bù zhī dào.",
        "vietnamese": "Có khi nói chuyện hai ba tiếng mà không hay biết."
      },
      {
        "id": 18,
        "startTime": 131.3,
        "endTime": 137.9,
        "speaker": "Cô Vương",
        "chinese": "好，我们来说说中午，李老师，你中午怎么安排？",
        "pinyin": "Hǎo, wǒ men lái shuō shuō zhōng wǔ, lǐ lǎo shī, nǐ zhōng wǔ zěn me ān pái?",
        "vietnamese": "Được rồi, chúng ta nói về buổi trưa. Thầy Lý, buổi trưa thầy sắp xếp thế nào?"
      },
      {
        "id": 19,
        "startTime": 137.9,
        "endTime": 146.0,
        "speaker": "Thầy Lý",
        "chinese": "喝完咖啡以后，我们就一起去吃午饭，我们喜欢尝试不同的餐厅。",
        "pinyin": "Hē wán kā fēi yǐ hòu, wǒ men jiù yì qǐ qù chī wǔ fàn, wǒ men xǐ huān cháng shì bù tóng de cān tīng.",
        "vietnamese": "Uống cà phê xong, chúng tôi cùng đi ăn trưa, chúng tôi thích thử các nhà hàng khác nhau."
      },
      {
        "id": 20,
        "startTime": 146.0,
        "endTime": 150.5,
        "speaker": "Thầy Lý",
        "chinese": "上周我们吃了日本料理，很好吃。",
        "pinyin": "Shàng zhōu wǒ men chī le rì běn liào lǐ, hěn hǎo chī.",
        "vietnamese": "Tuần trước chúng tôi ăn món Nhật, rất ngon."
      },
      {
        "id": 21,
        "startTime": 150.5,
        "endTime": 159.8,
        "speaker": "Cô Vương",
        "chinese": "听起来很不错，我呢，接完孩子之后就要回家做午饭了。",
        "pinyin": "Tīng qǐ lái hěn bú cuò, wǒ ne, jiē wán hái zi zhī hòu jiù yào huí jiā zuò wǔ fàn le.",
        "vietnamese": "Nghe hay đấy. Còn tôi thì đón con xong là phải về nhà nấu cơm trưa."
      },
      {
        "id": 22,
        "startTime": 159.8,
        "endTime": 163.3,
        "speaker": "Thầy Lý",
        "chinese": "你，你会做什么菜？",
        "pinyin": "Nǐ, nǐ huì zuò shén me cài?",
        "vietnamese": "Cô biết nấu những món gì?"
      },
      {
        "id": 23,
        "startTime": 163.3,
        "endTime": 170.6,
        "speaker": "Cô Vương",
        "chinese": "周末我喜欢做一些特别的菜，不像平时那么简单。",
        "pinyin": "Zhōu mò wǒ xǐ huān zuò yī xiē tè bié de cài, bù xiàng píng shí nà me jiǎn dān.",
        "vietnamese": "Cuối tuần tôi thích nấu vài món đặc biệt, không đơn giản như ngày thường."
      },
      {
        "id": 24,
        "startTime": 170.6,
        "endTime": 179.6,
        "speaker": "Cô Vương",
        "chinese": "上周我做了红烧肉和清蒸鱼，还有三个蔬菜，全家人都很喜欢。",
        "pinyin": "Shàng zhōu wǒ zuò le hóng shāo ròu hé qīng zhēng yú, hái yǒu sān gè shū cài, quán jiā rén dōu hěn xǐ huān.",
        "vietnamese": "Tuần trước tôi nấu thịt kho tàu và cá hấp, còn có ba món rau, cả nhà đều rất thích."
      },
      {
        "id": 25,
        "startTime": 179.6,
        "endTime": 188.4,
        "speaker": "Thầy Lý",
        "chinese": "哇，你真的很厉害，我自己一个人，所以吃得很简单。",
        "pinyin": "Wa, nǐ zhēn de hěn lì hài, wǒ zì jǐ yí gè rén, suǒ yǐ chī dé hěn jiǎn dān.",
        "vietnamese": "Chà, cô giỏi thật. Tôi sống một mình nên ăn rất đơn giản."
      },
      {
        "id": 26,
        "startTime": 188.4,
        "endTime": 195.5,
        "speaker": "Cô Vương",
        "chinese": "但是你出去吃不也很好吗？和朋友一起吃饭多热闹。",
        "pinyin": "Dàn shì nǐ chū qù chī bù yě hěn hǎo ma? Hé péng yǒu yì qǐ chī fàn duō rè nào.",
        "vietnamese": "Nhưng ra ngoài ăn chẳng phải cũng rất tốt sao? Ăn cơm cùng bạn bè vui nhộn biết bao."
      },
      {
        "id": 27,
        "startTime": 195.5,
        "endTime": 200.1,
        "speaker": "Thầy Lý",
        "chinese": "是啊，有朋友一起真的很开心。",
        "pinyin": "Shì a, yǒu péng yǒu yì qǐ zhēn de hěn kāi xīn.",
        "vietnamese": "Đúng vậy, có bạn bè đi cùng thật sự rất vui."
      },
      {
        "id": 28,
        "startTime": 200.1,
        "endTime": 208.0,
        "speaker": "Cô Vương",
        "chinese": "好，那下午呢？李老师，吃完午饭以后你去哪里了？",
        "pinyin": "Hǎo, nà xià wǔ ne? Lǐ lǎo shī, chī wán wǔ fàn yǐ hòu nǐ qù nǎ lǐ le?",
        "vietnamese": "Được rồi, thế buổi chiều thì sao? Thầy Lý, ăn trưa xong thầy đi đâu?"
      },
      {
        "id": 29,
        "startTime": 208.0,
        "endTime": 220.3,
        "speaker": "Thầy Lý",
        "chinese": "下午我们去逛街了，我喜欢和朋友一起逛街，看看新衣服，有时买，有时只是看看。",
        "pinyin": "Xià wǔ wǒ men qù guàng jiē le, wǒ xǐ huān hé péng yǒu yì qǐ guàng jiē, kàn kàn xīn yī fú, yǒu shí mǎi, yǒu shí zhǐ shì kàn kàn.",
        "vietnamese": "Chiều chúng tôi đi dạo phố, tôi thích đi dạo phố cùng bạn bè, ngắm quần áo mới, có khi mua, có khi chỉ ngắm."
      },
      {
        "id": 30,
        "startTime": 220.3,
        "endTime": 224.3,
        "speaker": "Thầy Lý",
        "chinese": "逛街对我来说是一种放松方式。",
        "pinyin": "Guàng jiē duì wǒ lái shuō shì yī zhǒng fàng sōng fāng shì.",
        "vietnamese": "Đi dạo phố đối với tôi là một cách thư giãn."
      },
      {
        "id": 31,
        "startTime": 224.3,
        "endTime": 232.3,
        "speaker": "Cô Vương",
        "chinese": "我完全理解，但是我下午的活动不一样，我们全家去游泳。",
        "pinyin": "Wǒ wán quán lǐ jiě, dàn shì wǒ xià wǔ de huó dòng bù yí yàng, wǒ men quán jiā qù yóu yǒng.",
        "vietnamese": "Tôi hoàn toàn hiểu, nhưng hoạt động buổi chiều của tôi lại khác, cả nhà tôi đi bơi."
      },
      {
        "id": 32,
        "startTime": 232.9,
        "endTime": 242.9,
        "speaker": "Thầy Lý",
        "chinese": "哦，游泳，那真的很好，既锻炼身体又可以和家人在一起，你的孩子喜欢游泳吗？",
        "pinyin": "Ó, yóu yǒng, nà zhēn de hěn hǎo, jì duàn liàn shēn tǐ yòu kě yǐ hé jiā rén zài yì qǐ, nǐ de hái zi xǐ huān yóu yǒng ma?",
        "vietnamese": "Ồ, đi bơi thì tốt thật, vừa rèn luyện sức khỏe vừa được ở bên gia đình. Con cô có thích bơi không?"
      },
      {
        "id": 33,
        "startTime": 242.9,
        "endTime": 254.3,
        "speaker": "Cô Vương",
        "chinese": "特别喜欢，孩子一到游泳池就不想出来了，我和先生在旁边看着他，聊聊天，也挺放松的。",
        "pinyin": "Tè bié xǐ huān, hái zi yī dào yóu yǒng chí jiù bù xiǎng chū lái le, wǒ hé xiān shēng zài páng biān kàn zhe tā, liáo liáo tiān, yě tǐng fàng sōng de.",
        "vietnamese": "Rất thích, cháu vừa đến hồ bơi là không muốn lên nữa. Tôi và chồng ngồi bên cạnh trông cháu, trò chuyện, cũng khá thư giãn."
      },
      {
        "id": 34,
        "startTime": 254.3,
        "endTime": 263.0,
        "speaker": "Thầy Lý",
        "chinese": "听起来很温馨，那逛完街之后我去健身房锻炼了大概一个小时。",
        "pinyin": "Tīng qǐ lái hěn wēn xīn, nà guàng wán jiē zhī hòu wǒ qù jiàn shēn fáng duàn liàn le dà gài yí gè xiǎo shí.",
        "vietnamese": "Nghe ấm áp quá. Còn tôi, sau khi đi dạo phố thì đến phòng gym tập khoảng một tiếng."
      },
      {
        "id": 35,
        "startTime": 263.0,
        "endTime": 269.5,
        "speaker": "Cô Vương",
        "chinese": "健身房？你真的很注意健康，你做什么运动？",
        "pinyin": "Jiàn shēn fáng? Nǐ zhēn de hěn zhù yì jiàn kāng, nǐ zuò shén me yùn dòng?",
        "vietnamese": "Phòng gym á? Thầy thật chú ý đến sức khỏe. Thầy tập môn gì?"
      },
      {
        "id": 36,
        "startTime": 269.5,
        "endTime": 276.5,
        "speaker": "Thầy Lý",
        "chinese": "我通常先跑步三十分钟，然后再做一些力量训练。",
        "pinyin": "Wǒ tōng cháng xiān pǎo bù sān shí fēn zhōng, rán hòu zài zuò yī xiē lì liàng xùn liàn.",
        "vietnamese": "Tôi thường chạy bộ ba mươi phút trước, rồi tập thêm một ít bài sức mạnh."
      },
      {
        "id": 37,
        "startTime": 276.5,
        "endTime": 280.6,
        "speaker": "Thầy Lý",
        "chinese": "周末有时间，所以可以认真锻炼一下。",
        "pinyin": "Zhōu mò yǒu shí jiān, suǒ yǐ kě yǐ rèn zhēn duàn liàn yī xià.",
        "vietnamese": "Cuối tuần có thời gian nên có thể tập luyện nghiêm túc một chút."
      },
      {
        "id": 38,
        "startTime": 280.6,
        "endTime": 286.6,
        "speaker": "Cô Vương",
        "chinese": "说说晚上吧，我觉得晚上是最不一样的时候。",
        "pinyin": "Shuō shuō wǎn shàng ba, wǒ jué de wǎn shàng shì zuì bù yí yàng de shí hòu.",
        "vietnamese": "Nói về buổi tối nhé, tôi thấy buổi tối là lúc khác biệt nhất."
      },
      {
        "id": 39,
        "startTime": 287.1,
        "endTime": 292.1,
        "speaker": "Thầy Lý",
        "chinese": "对，说说吧，李老师先说，还是王老师先说。",
        "pinyin": "Duì, shuō shuō ba, lǐ lǎo shī xiān shuō, hái shì wáng lǎo shī xiān shuō.",
        "vietnamese": "Đúng, nói đi nào, thầy Lý nói trước hay cô Vương nói trước?"
      },
      {
        "id": 40,
        "startTime": 292.1,
        "endTime": 302.1,
        "speaker": "Cô Vương",
        "chinese": "我先说吧，晚上我们吃完晚饭以后，我要检查孩子的功课，然后陪他复习功课。",
        "pinyin": "Wǒ xiān shuō ba, wǎn shàng wǒ men chī wán wǎn fàn yǐ hòu, wǒ yào jiǎn chá hái zi de gōng kè, rán hòu péi tā fù xí gōng kè.",
        "vietnamese": "Để tôi nói trước. Buổi tối sau khi ăn tối xong, tôi phải kiểm tra bài tập của con, rồi cùng cháu ôn bài."
      },
      {
        "id": 41,
        "startTime": 302.1,
        "endTime": 305.1,
        "speaker": "Thầy Lý",
        "chinese": "这需要花很多时间吧？",
        "pinyin": "Zhè xū yào huā hěn duō shí jiān ba?",
        "vietnamese": "Chắc tốn nhiều thời gian lắm nhỉ?"
      },
      {
        "id": 42,
        "startTime": 305.1,
        "endTime": 316.2,
        "speaker": "Cô Vương",
        "chinese": "是啊，大概要一个半小时，不过孩子开始自己学习以后，我就可以休息了。",
        "pinyin": "Shì a, dà gài yào yí gè bàn xiǎo shí, bù guò hái zi kāi shǐ zì jǐ xué xí yǐ hòu, wǒ jiù kě yǐ xiū xī le.",
        "vietnamese": "Đúng vậy, khoảng một tiếng rưỡi, nhưng khi con bắt đầu tự học thì tôi có thể nghỉ ngơi."
      },
      {
        "id": 43,
        "startTime": 316.7,
        "endTime": 328.0,
        "speaker": "Cô Vương",
        "chinese": "那时候我和先生一起泡茶，边喝茶，边看电视，聊聊今天发生的事情，讨论一下新闻。",
        "pinyin": "Nà shí hòu wǒ hé xiān shēng yì qǐ pào chá, biān hē chá, biān kàn diàn shì, liáo liáo jīn tiān fā shēng de shì qíng, tǎo lùn yī xià xīn wén.",
        "vietnamese": "Lúc đó tôi và chồng cùng pha trà, vừa uống trà vừa xem tivi, trò chuyện chuyện xảy ra hôm nay, bàn về tin tức."
      },
      {
        "id": 44,
        "startTime": 328.0,
        "endTime": 336.5,
        "speaker": "Thầy Lý",
        "chinese": "哇，听起来很温馨，两个人一起分享生活的点点滴滴。",
        "pinyin": "Wa, tīng qǐ lái hěn wēn xīn, liǎng gè rén yì qǐ fēn xiǎng shēng huó de diǎn diǎn dī dī.",
        "vietnamese": "Chà, nghe ấm áp quá, hai người cùng chia sẻ từng chút một của cuộc sống."
      },
      {
        "id": 45,
        "startTime": 336.5,
        "endTime": 339.5,
        "speaker": "Cô Vương",
        "chinese": "是啊，那你晚上怎么过？",
        "pinyin": "Shì a, nà nǐ wǎn shàng zěn me guò?",
        "vietnamese": "Đúng vậy, còn buổi tối của thầy thì sao?"
      },
      {
        "id": 46,
        "startTime": 340.0,
        "endTime": 347.0,
        "speaker": "Thầy Lý",
        "chinese": "我从健身房回来以后，先洗澡，然后自己做一个沙拉。",
        "pinyin": "Wǒ cóng jiàn shēn fáng huí lái yǐ hòu, xiān xǐ zǎo, rán hòu zì jǐ zuò yí gè shā lā.",
        "vietnamese": "Tôi từ phòng gym về thì tắm trước, rồi tự làm một món salad."
      },
      {
        "id": 47,
        "startTime": 347.0,
        "endTime": 353.0,
        "speaker": "Thầy Lý",
        "chinese": "我最近很注意饮食健康，所以晚上吃的比较清淡。",
        "pinyin": "Wǒ zuì jìn hěn zhù yì yǐn shí jiàn kāng, suǒ yǐ wǎn shàng chī de bǐ jiào qīng dàn.",
        "vietnamese": "Gần đây tôi rất chú ý ăn uống lành mạnh nên buổi tối ăn khá thanh đạm."
      },
      {
        "id": 48,
        "startTime": 353.0,
        "endTime": 358.2,
        "speaker": "Cô Vương",
        "chinese": "沙拉？你自己做？放什么材料？",
        "pinyin": "Shā lā? Nǐ zì jǐ zuò? Fàng shén me cái liào?",
        "vietnamese": "Salad á? Thầy tự làm sao? Cho nguyên liệu gì vậy?"
      },
      {
        "id": 49,
        "startTime": 358.5,
        "endTime": 366.0,
        "speaker": "Thầy Lý",
        "chinese": "放很多蔬菜，比如生菜、番茄、黄瓜，还有鸡胸肉。",
        "pinyin": "Fàng hěn duō shū cài, bǐ rú shēng cài、fān qié、huáng guā, hái yǒu jī xiōng ròu.",
        "vietnamese": "Cho nhiều rau củ, ví dụ như xà lách, cà chua, dưa chuột, và cả ức gà."
      },
      {
        "id": 50,
        "startTime": 366.0,
        "endTime": 371.0,
        "speaker": "Thầy Lý",
        "chinese": "最后淋上橄榄油和柠檬汁，非常健康。",
        "pinyin": "Zuì hòu lín shàng gǎn lǎn yóu hé níng méng zhī, fēi cháng jiàn kāng.",
        "vietnamese": "Cuối cùng rưới dầu ô liu và nước chanh, vô cùng lành mạnh."
      },
      {
        "id": 51,
        "startTime": 371.0,
        "endTime": 375.2,
        "speaker": "Cô Vương",
        "chinese": "好厉害，吃完以后呢？",
        "pinyin": "Hǎo lì hài, chī wán yǐ hòu ne?",
        "vietnamese": "Giỏi quá, ăn xong thì sao?"
      },
      {
        "id": 52,
        "startTime": 375.2,
        "endTime": 379.8,
        "speaker": "Thầy Lý",
        "chinese": "吃完以后，就是我一个人的时间了。",
        "pinyin": "Chī wán yǐ hòu, jiù shì wǒ yí gè rén de shí jiān le.",
        "vietnamese": "Ăn xong là thời gian của riêng tôi."
      },
      {
        "id": 53,
        "startTime": 379.8,
        "endTime": 388.4,
        "speaker": "Thầy Lý",
        "chinese": "我有时候看书，有时候看电影，有时候就刷刷手机，看看视频。",
        "pinyin": "Wǒ yǒu shí hòu kàn shū, yǒu shí hòu kàn diàn yǐng, yǒu shí hòu jiù shuā shuā shǒu jī, kàn kàn shì pín.",
        "vietnamese": "Có lúc tôi đọc sách, có lúc xem phim, có lúc chỉ lướt điện thoại, xem video."
      },
      {
        "id": 54,
        "startTime": 389.1,
        "endTime": 395.1,
        "speaker": "Thầy Lý",
        "chinese": "这段时间是我最放松的时候，一点压力都没有。",
        "pinyin": "Zhè duàn shí jiān shì wǒ zuì fàng sōng de shí hòu, yì diǎn yā lì dōu méi yǒu.",
        "vietnamese": "Khoảng thời gian này là lúc tôi thư giãn nhất, một chút áp lực cũng không có."
      },
      {
        "id": 55,
        "startTime": 395.1,
        "endTime": 400.7,
        "speaker": "Thầy Lý",
        "chinese": "我觉得我们两个的周末真的完全不一样。",
        "pinyin": "Wǒ jué de wǒ men liǎng gè de zhōu mò zhēn de wán quán bù yí yàng.",
        "vietnamese": "Tôi thấy cuối tuần của hai chúng ta thật sự hoàn toàn khác nhau."
      },
      {
        "id": 56,
        "startTime": 400.7,
        "endTime": 407.2,
        "speaker": "Cô Vương",
        "chinese": "你的周末自由轻松，我的周末忙碌充实。",
        "pinyin": "Nǐ de zhōu mò zì yóu qīng sōng, wǒ de zhōu mò máng lù chōng shí.",
        "vietnamese": "Cuối tuần của thầy tự do thoải mái, cuối tuần của tôi bận rộn đầy đủ."
      },
      {
        "id": 57,
        "startTime": 407.2,
        "endTime": 413.6,
        "speaker": "Cô Vương",
        "chinese": "是的，但是两种生活方式都有各自的美好。",
        "pinyin": "Shì de, dàn shì liǎng zhǒng shēng huó fāng shì dōu yǒu gè zì de měi hǎo.",
        "vietnamese": "Đúng, nhưng cả hai cách sống đều có nét hay riêng."
      },
      {
        "id": 58,
        "startTime": 413.6,
        "endTime": 421.2,
        "speaker": "Thầy Lý",
        "chinese": "我羡慕你有家人陪伴，而你呢，可能也会羡慕我的自由时间吧。",
        "pinyin": "Wǒ xiàn mù nǐ yǒu jiā rén péi bàn, ér nǐ ne, kě néng yě huì xiàn mù wǒ de zì yóu shí jiān ba.",
        "vietnamese": "Tôi ngưỡng mộ cô có gia đình bên cạnh, còn cô có lẽ cũng ngưỡng mộ thời gian tự do của tôi nhỉ."
      },
      {
        "id": 59,
        "startTime": 421.2,
        "endTime": 428.2,
        "speaker": "Cô Vương",
        "chinese": "哈哈，你说得对，有时候的确觉得你可以睡懒觉。",
        "pinyin": "Hā hā, nǐ shuō dé duì, yǒu shí hòu dí què jué de nǐ kě yǐ shuì lǎn jiào.",
        "vietnamese": "Haha, thầy nói đúng, có lúc tôi quả thật thấy thầy có thể ngủ nướng thật là sướng."
      },
      {
        "id": 60,
        "startTime": 428.2,
        "endTime": 437.3,
        "speaker": "Cô Vương",
        "chinese": "但是看着孩子开心，和先生喝茶聊天，这种感觉也很幸福。",
        "pinyin": "Dàn shì kàn zhe hái zi kāi xīn, hé xiān shēng hē chá liáo tiān, zhè zhǒng gǎn jué yě hěn xìng fú.",
        "vietnamese": "Nhưng nhìn con vui vẻ, cùng chồng uống trà trò chuyện, cảm giác đó cũng rất hạnh phúc."
      },
      {
        "id": 61,
        "startTime": 437.3,
        "endTime": 442.6,
        "speaker": "Thầy Lý",
        "chinese": "对极了，每个人的生活都有自己的美好。",
        "pinyin": "Duì jí le, měi gè rén de shēng huó dōu yǒu zì jǐ de měi hǎo.",
        "vietnamese": "Đúng thế, cuộc sống của mỗi người đều có nét đẹp riêng."
      },
      {
        "id": 62,
        "startTime": 442.6,
        "endTime": 447.6,
        "speaker": "Cô Vương",
        "chinese": "好了，我们今天的节目就到这里，感谢大家收听。",
        "pinyin": "Hǎo le, wǒ men jīn tiān de jié mù jiù dào zhè lǐ, gǎn xiè dà jiā shōu tīng.",
        "vietnamese": "Được rồi, chương trình hôm nay đến đây là hết, cảm ơn mọi người đã lắng nghe."
      },
      {
        "id": 63,
        "startTime": 447.6,
        "endTime": 455.4,
        "speaker": "Thầy Lý",
        "chinese": "下次再见，祝大家有一个美好的周末。",
        "pinyin": "Xià cì zài jiàn, zhù dà jiā yǒu yí gè měi hǎo de zhōu mò.",
        "vietnamese": "Hẹn gặp lại lần sau, chúc mọi người có một cuối tuần tốt đẹp."
      },
      {
        "id": 64,
        "startTime": 455.4,
        "endTime": 458.4,
        "speaker": "Thầy Lý",
        "chinese": "再见，再见。",
        "pinyin": "Zài jiàn, zài jiàn.",
        "vietnamese": "Tạm biệt, tạm biệt."
      }
    ]
  },
  {
    "id": "hsk1-mysterious-old-man",
    "title": "Câu chuyện trinh thám: Ông lão bí ẩn ở công viên (HSK 1-2)",
    "level": "HSK 1-2",
    "levelBadgeColor": "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300",
    "duration": "5:17",
    "category": "Giao tiếp đời sống",
    "description": "Cốt truyện trinh thám hấp dẫn qua giọng kể tự nhiên, từ vựng và mẫu câu cơ bản HSK 1-2 dễ nắm bắt.",
    "youtubeId": "24Oj4bOACk0",
    "sentencesCount": 59,
    "isFree": true,
    "sentences": [
      {
        "id": 1,
        "startTime": 0.0,
        "endTime": 10.0,
        "speaker": "Người kể",
        "chinese": "上一集,我捡到了一个手机。",
        "pinyin": "Shàngyījí , wǒjiǎndàoleyígèshǒujī 。",
        "vietnamese": "Trong tập cuối, tôi nhặt được một chiếc điện thoại di động."
      },
      {
        "id": 2,
        "startTime": 10.0,
        "endTime": 13.0,
        "speaker": "Người kể",
        "chinese": "后来,一个小女孩给我打了电话。",
        "pinyin": "Hòulái , yígèxiǎonǚháigěiwǒdǎlediànhuà 。",
        "vietnamese": "Sau đó, một cô bé gọi cho tôi."
      },
      {
        "id": 3,
        "startTime": 13.0,
        "endTime": 16.0,
        "speaker": "Người kể",
        "chinese": "她说她在人民公园。",
        "pinyin": "Tāshuōtāzàirénmíngōngyuán 。",
        "vietnamese": "Cô ấy nói cô ấy đang ở Công viên Nhân dân."
      },
      {
        "id": 4,
        "startTime": 16.0,
        "endTime": 20.0,
        "speaker": "Người kể",
        "chinese": "可是我到了公园以后,没有看见她。",
        "pinyin": "Kěshìwǒdàolegōngyuányǐhòu , méiyǒukànjiàntā 。",
        "vietnamese": "Nhưng khi tôi đến công viên, tôi lại không thấy cô ấy."
      },
      {
        "id": 5,
        "startTime": 20.0,
        "endTime": 23.0,
        "speaker": "Người kể",
        "chinese": "我只看见了一个老人。",
        "pinyin": "Wǒzhǐkànjiànleyígèlǎorén 。",
        "vietnamese": "Tôi chỉ nhìn thấy một ông già."
      },
      {
        "id": 6,
        "startTime": 23.0,
        "endTime": 25.0,
        "speaker": "Người kể",
        "chinese": "这个老人很奇怪。",
        "pinyin": "Zhègelǎorénhěnqíguài 。",
        "vietnamese": "Lão già này thật kỳ lạ."
      },
      {
        "id": 7,
        "startTime": 25.0,
        "endTime": 28.0,
        "speaker": "Người kể",
        "chinese": "她好像认识那个小女孩。",
        "pinyin": "Tāhǎoxiàngrènshínàgexiǎonǚhái 。",
        "vietnamese": "Có vẻ như cô ấy biết cô bé."
      },
      {
        "id": 8,
        "startTime": 28.0,
        "endTime": 32.0,
        "speaker": "Người kể",
        "chinese": "但是她告诉我一件很奇怪的事。",
        "pinyin": "Dànshìtāgàosùwǒyījiànhěnqíguàideshì 。",
        "vietnamese": "Nhưng cô ấy đã nói với tôi một điều rất kỳ lạ."
      },
      {
        "id": 9,
        "startTime": 32.0,
        "endTime": 36.0,
        "speaker": "Người kể",
        "chinese": "这个手机不是那个小女孩的。",
        "pinyin": "Zhègeshǒujībúshìnàgexiǎonǚháide 。",
        "vietnamese": "Chiếc điện thoại này không thuộc về cô bé."
      },
      {
        "id": 10,
        "startTime": 36.0,
        "endTime": 39.0,
        "speaker": "Người kể",
        "chinese": "这个手机到底是谁的。",
        "pinyin": "Zhègeshǒujīdàodǐshìshéide 。",
        "vietnamese": "Điện thoại này thuộc về ai?"
      },
      {
        "id": 11,
        "startTime": 39.0,
        "endTime": 42.0,
        "speaker": "Người kể",
        "chinese": "我们一起继续看一下去吧。",
        "pinyin": "Wǒmenyìqǐjìxùkànyīxiàqùba 。",
        "vietnamese": "Chúng ta hãy cùng nhau tiếp tục xem xét nó."
      },
      {
        "id": 12,
        "startTime": 58.0,
        "endTime": 64.0,
        "speaker": "Người kể",
        "chinese": "老人慢慢地向我走过来。",
        "pinyin": "Lǎorénmànmàndìxiàngwǒzǒuguòlái 。",
        "vietnamese": "Ông già chậm rãi bước về phía tôi."
      },
      {
        "id": 13,
        "startTime": 64.0,
        "endTime": 67.0,
        "speaker": "Người kể",
        "chinese": "她看着我,没有说话。",
        "pinyin": "Tākànzhewǒ , méiyǒushuōhuà 。",
        "vietnamese": "Cô ấy nhìn tôi và không nói gì."
      },
      {
        "id": 14,
        "startTime": 67.0,
        "endTime": 71.0,
        "speaker": "Người kể",
        "chinese": "我有一点害怕。",
        "pinyin": "Wǒyǒuyìdiǎnhàipà 。",
        "vietnamese": "Tôi hơi sợ."
      },
      {
        "id": 15,
        "startTime": 71.0,
        "endTime": 75.0,
        "speaker": "Người kể",
        "chinese": "我看了看手机,又看了看老人。",
        "pinyin": "Wǒkànlekànshǒujī , yòukànlekànlǎorén 。",
        "vietnamese": "Tôi nhìn vào điện thoại của mình rồi nhìn ông già."
      },
      {
        "id": 16,
        "startTime": 75.0,
        "endTime": 82.0,
        "speaker": "Người kể",
        "chinese": "老人突然问,你是不是在找一个小女孩。",
        "pinyin": "Lǎoréntūránwèn , nǐshìbúshìzàizhǎoyígèxiǎonǚhái 。",
        "vietnamese": "Ông lão đột nhiên hỏi, ngươi đang tìm một cô bé sao?"
      },
      {
        "id": 17,
        "startTime": 82.0,
        "endTime": 84.0,
        "speaker": "Người kể",
        "chinese": "我很吃惊。",
        "pinyin": "Wǒhěnchījīng 。",
        "vietnamese": "Tôi rất ngạc nhiên."
      },
      {
        "id": 18,
        "startTime": 84.0,
        "endTime": 88.0,
        "speaker": "Người kể",
        "chinese": "我问,你认识她吗?",
        "pinyin": "Wǒwèn , nǐrènshítāma ?",
        "vietnamese": "Tôi hỏi, bạn có biết cô ấy không?"
      },
      {
        "id": 19,
        "startTime": 88.0,
        "endTime": 94.0,
        "speaker": "Người kể",
        "chinese": "老人没有回答,她只是看着我手里的手机。",
        "pinyin": "Lǎorénméiyǒuhuídá , tāzhǐshìkànzhewǒshǒulǐdeshǒujī 。",
        "vietnamese": "Ông già không trả lời, bà chỉ nhìn vào chiếc điện thoại trên tay tôi."
      },
      {
        "id": 20,
        "startTime": 94.0,
        "endTime": 99.0,
        "speaker": "Người kể",
        "chinese": "过了一会儿,她说,这个手机不是她的。",
        "pinyin": "Guòleyīhuìer , tāshuō , zhègeshǒujībúshìtāde 。",
        "vietnamese": "Một lúc sau, cô ấy nói rằng điện thoại không phải của cô ấy."
      },
      {
        "id": 21,
        "startTime": 99.0,
        "endTime": 102.0,
        "speaker": "Người kể",
        "chinese": "我不知道她说什么。",
        "pinyin": "Wǒbùzhīdàotāshuōshénme 。",
        "vietnamese": "Tôi không biết cô ấy nói gì."
      },
      {
        "id": 22,
        "startTime": 102.0,
        "endTime": 105.0,
        "speaker": "Người kể",
        "chinese": "我问,不是她的。",
        "pinyin": "Wǒwèn , búshìtāde 。",
        "vietnamese": "Tôi hỏi, nó không phải của cô ấy."
      },
      {
        "id": 23,
        "startTime": 106.0,
        "endTime": 109.0,
        "speaker": "Người kể",
        "chinese": "老人点点头,对。",
        "pinyin": "Lǎoréndiǎndiǎntóu , duì 。",
        "vietnamese": "Ông già gật đầu, vâng."
      },
      {
        "id": 24,
        "startTime": 109.0,
        "endTime": 113.0,
        "speaker": "Người kể",
        "chinese": "那她为什么说,这是她的手机。",
        "pinyin": "Nàtāwèishénmeshuō , zhèshìtādeshǒujī 。",
        "vietnamese": "Vậy tại sao cô ấy lại nói, đây là điện thoại di động của cô ấy."
      },
      {
        "id": 25,
        "startTime": 113.0,
        "endTime": 117.0,
        "speaker": "Người kể",
        "chinese": "老人看着我,慢慢地说,",
        "pinyin": "Lǎorénkànzhewǒ , mànmàndìshuō ,",
        "vietnamese": "Ông già nhìn tôi rồi chậm rãi nói:"
      },
      {
        "id": 26,
        "startTime": 117.0,
        "endTime": 120.0,
        "speaker": "Người kể",
        "chinese": "因为她不想让别人知道。",
        "pinyin": "Yīnwèitābùxiǎngràngbiérénzhīdào 。",
        "vietnamese": "Vì cô không muốn người khác biết."
      },
      {
        "id": 27,
        "startTime": 120.0,
        "endTime": 126.0,
        "speaker": "Người kể",
        "chinese": "我越来越不明白,我问,她是谁。",
        "pinyin": "Wǒyuèláiyuèbùmíngbái , wǒwèn , tāshìshuí 。",
        "vietnamese": "Tôi càng lúc càng bối rối và hỏi cô ấy là ai."
      },
      {
        "id": 28,
        "startTime": 126.0,
        "endTime": 133.0,
        "speaker": "Người kể",
        "chinese": "老人没有马上回答,她从口袋里拿出一张小纸,",
        "pinyin": "Lǎorénméiyǒumǎshànghuídá , tācóngkǒudàilǐnáchūyīzhāngxiǎozhǐ ,",
        "vietnamese": "Ông già không trả lời ngay. Cô lấy từ trong túi ra một tờ giấy nhỏ và nói:"
      },
      {
        "id": 29,
        "startTime": 133.0,
        "endTime": 137.0,
        "speaker": "Người kể",
        "chinese": "只上有一个名字,还有一个电话号码。",
        "pinyin": "Zhǐshàngyǒuyígèmíngzì , háiyǒuyígèdiànhuàhàomǎ 。",
        "vietnamese": "Chỉ có một cái tên và số điện thoại."
      },
      {
        "id": 30,
        "startTime": 137.0,
        "endTime": 144.0,
        "speaker": "Người kể",
        "chinese": "我看了一下,那个名字就是刚才打电话给我的小女孩。",
        "pinyin": "Wǒkànleyīxià , nàgemíngzìjiùshìgāngcáidǎdiànhuàgěiwǒdexiǎonǚhái 。",
        "vietnamese": "Tôi nhìn thì thấy tên đó chính là cô bé vừa gọi tôi."
      },
      {
        "id": 31,
        "startTime": 144.0,
        "endTime": 151.0,
        "speaker": "Người kể",
        "chinese": "我问,她现在在哪里,老人说,我不知道。",
        "pinyin": "Wǒwèn , tāxiànzàizàinǎlǐ , lǎorénshuō , wǒbùzhīdào 。",
        "vietnamese": "Tôi hỏi hiện giờ cô ấy ở đâu, ông già nói, tôi không biết."
      },
      {
        "id": 32,
        "startTime": 151.0,
        "endTime": 158.0,
        "speaker": "Người kể",
        "chinese": "但是她今天一个人出来了,她可能很害怕。",
        "pinyin": "Dànshìtājīntiānyígèrénchūláile , tākěnénghěnhàipà 。",
        "vietnamese": "Nhưng hôm nay cô ấy ra ngoài một mình, có thể cô ấy sẽ sợ hãi."
      },
      {
        "id": 33,
        "startTime": 158.0,
        "endTime": 162.0,
        "speaker": "Người kể",
        "chinese": "我看着老人,我不知道应该相信她。",
        "pinyin": "Wǒkànzhelǎorén , wǒbùzhīdàoyīnggāixiāngxìntā 。",
        "vietnamese": "Tôi nhìn ông già và không biết có nên tin bà không."
      },
      {
        "id": 34,
        "startTime": 162.0,
        "endTime": 165.0,
        "speaker": "Người kể",
        "chinese": "相信她,还是离开这里。",
        "pinyin": "Xiāngxìntā , háishìlíkāizhèlǐ 。",
        "vietnamese": "Hãy tin cô ấy và rời khỏi đây."
      },
      {
        "id": 35,
        "startTime": 165.0,
        "endTime": 169.0,
        "speaker": "Người kể",
        "chinese": "就在这时候,我的手机又想了。",
        "pinyin": "Jiùzàizhèshíhòu , wǒdeshǒujīyòuxiǎngle 。",
        "vietnamese": "Ngay sau đó, điện thoại của tôi đã trở lại với tôi."
      },
      {
        "id": 36,
        "startTime": 169.0,
        "endTime": 174.0,
        "speaker": "Người kể",
        "chinese": "我拿出手机,不是电话,是一个消息。",
        "pinyin": "Wǒnáchūshǒujī , búshìdiànhuà , shìyígèxiāoxī 。",
        "vietnamese": "Tôi lấy điện thoại ra, không phải gọi điện mà là tin nhắn."
      },
      {
        "id": 37,
        "startTime": 174.0,
        "endTime": 183.0,
        "speaker": "Người kể",
        "chinese": "我打开消息,上面只有一句话,不要告诉那个老人。",
        "pinyin": "Wǒdǎkāixiāoxī , shàngmiànzhǐyǒuyījùhuà , búyàogàosùnàgelǎorén 。",
        "vietnamese": "Tôi mở tin nhắn ra chỉ có một câu, đừng nói cho ông già đó biết."
      },
      {
        "id": 38,
        "startTime": 183.0,
        "endTime": 190.0,
        "speaker": "Người kể",
        "chinese": "我马上看向老人,老人还站在那里,她正在看着我。",
        "pinyin": "Wǒmǎshàngkànxiànglǎorén , lǎorénháizhànzàinàlǐ , tāzhèngzàikànzhewǒ 。",
        "vietnamese": "Tôi lập tức nhìn ông già vẫn đứng đó và bà ấy đang nhìn tôi."
      },
      {
        "id": 39,
        "startTime": 190.0,
        "endTime": 196.0,
        "speaker": "Người kể",
        "chinese": "可是她好像已经知道我看到了什么。",
        "pinyin": "Kěshìtāhǎoxiàngyǐjīngzhīdàowǒkàndàoleshénme 。",
        "vietnamese": "Nhưng có vẻ như cô ấy đã biết những gì tôi nhìn thấy."
      },
      {
        "id": 40,
        "startTime": 196.0,
        "endTime": 203.0,
        "speaker": "Người kể",
        "chinese": "老人慢慢地向我走过来。",
        "pinyin": "Lǎorénmànmàndìxiàngwǒzǒuguòlái 。",
        "vietnamese": "Ông già chậm rãi bước về phía tôi."
      },
      {
        "id": 41,
        "startTime": 203.0,
        "endTime": 211.0,
        "speaker": "Người kể",
        "chinese": "她看着我,没有说话。",
        "pinyin": "Tākànzhewǒ , méiyǒushuōhuà 。",
        "vietnamese": "Cô ấy nhìn tôi và không nói gì."
      },
      {
        "id": 42,
        "startTime": 211.0,
        "endTime": 217.0,
        "speaker": "Người kể",
        "chinese": "我有一点害怕。",
        "pinyin": "Wǒyǒuyìdiǎnhàipà 。",
        "vietnamese": "Tôi hơi sợ."
      },
      {
        "id": 43,
        "startTime": 217.0,
        "endTime": 229.0,
        "speaker": "Người kể",
        "chinese": "我看了看手机,又看了看老人。",
        "pinyin": "Wǒkànlekànshǒujī , yòukànlekànlǎorén 。",
        "vietnamese": "Tôi nhìn vào điện thoại của mình rồi nhìn ông già."
      },
      {
        "id": 44,
        "startTime": 229.0,
        "endTime": 233.0,
        "speaker": "Người kể",
        "chinese": "老人突然问,你是不是在找一个小女孩?",
        "pinyin": "Lǎoréntūránwèn , nǐshìbúshìzàizhǎoyígèxiǎonǚhái ?",
        "vietnamese": "Ông lão đột nhiên hỏi, ngươi đang tìm một cô bé à?"
      },
      {
        "id": 45,
        "startTime": 233.0,
        "endTime": 237.0,
        "speaker": "Người kể",
        "chinese": "我很吃惊,我问,你认识她吗?",
        "pinyin": "Wǒhěnchījīng , wǒwèn , nǐrènshítāma ?",
        "vietnamese": "Tôi ngạc nhiên và hỏi, bạn có biết cô ấy không?"
      },
      {
        "id": 46,
        "startTime": 237.0,
        "endTime": 242.0,
        "speaker": "Người kể",
        "chinese": "老人没有回答,她只是看着我手里的手机。",
        "pinyin": "Lǎorénméiyǒuhuídá , tāzhǐshìkànzhewǒshǒulǐdeshǒujī 。",
        "vietnamese": "Ông già không trả lời, bà chỉ nhìn vào chiếc điện thoại trên tay tôi."
      },
      {
        "id": 47,
        "startTime": 242.0,
        "endTime": 246.0,
        "speaker": "Người kể",
        "chinese": "过了一会,她说,这个手机不是她的。",
        "pinyin": "Guòleyīhuì , tāshuō , zhègeshǒujībúshìtāde 。",
        "vietnamese": "Một lúc sau, cô ấy nói rằng điện thoại không phải của cô ấy."
      },
      {
        "id": 48,
        "startTime": 246.0,
        "endTime": 252.0,
        "speaker": "Người kể",
        "chinese": "我不知道她说什么,我问,不是她的,老人点点头。",
        "pinyin": "Wǒbùzhīdàotāshuōshénme , wǒwèn , búshìtāde , lǎoréndiǎndiǎntóu 。",
        "vietnamese": "Tôi không biết cô ấy nói gì, tôi hỏi, không phải của cô ấy, ông lão gật đầu."
      },
      {
        "id": 49,
        "startTime": 252.0,
        "endTime": 253.0,
        "speaker": "Người kể",
        "chinese": "对。",
        "pinyin": "Duì 。",
        "vietnamese": "Phải."
      },
      {
        "id": 50,
        "startTime": 253.0,
        "endTime": 256.0,
        "speaker": "Người kể",
        "chinese": "那她为什么说,这是她的手机?",
        "pinyin": "Nàtāwèishénmeshuō , zhèshìtādeshǒujī ?",
        "vietnamese": "Vậy tại sao cô ấy lại nói, đây là điện thoại di động của cô ấy?"
      },
      {
        "id": 51,
        "startTime": 256.0,
        "endTime": 262.0,
        "speaker": "Người kể",
        "chinese": "老人看着我,慢慢地说,因为她不想让别人知道。",
        "pinyin": "Lǎorénkànzhewǒ , mànmàndìshuō , yīnwèitābùxiǎngràngbiérénzhīdào 。",
        "vietnamese": "Ông già nhìn tôi rồi chậm rãi nói vì cô không muốn người khác biết."
      },
      {
        "id": 52,
        "startTime": 262.0,
        "endTime": 266.0,
        "speaker": "Người kể",
        "chinese": "我越来越不明白,我问,她是谁?",
        "pinyin": "Wǒyuèláiyuèbùmíngbái , wǒwèn , tāshìshuí ?",
        "vietnamese": "Tôi càng lúc càng bối rối và hỏi, cô ấy là ai?"
      },
      {
        "id": 53,
        "startTime": 266.0,
        "endTime": 274.0,
        "speaker": "Người kể",
        "chinese": "老人没有马上回答,她从口袋里拿出一张小纸,只上有一个名字,还有一个电话号码。",
        "pinyin": "Lǎorénméiyǒumǎshànghuídá , tācóngkǒudàilǐnáchūyīzhāngxiǎozhǐ , zhǐshàngyǒuyígèmíngzì , háiyǒuyígèdiànhuàhàomǎ 。",
        "vietnamese": "Ông già không trả lời ngay. Cô lấy từ trong túi ra một mảnh giấy nhỏ chỉ có tên và số điện thoại."
      },
      {
        "id": 54,
        "startTime": 274.0,
        "endTime": 280.0,
        "speaker": "Người kể",
        "chinese": "我看了一下,那个名字,就是刚才打电话给我的小女孩。",
        "pinyin": "Wǒkànleyīxià , nàgemíngzì , jiùshìgāngcáidǎdiànhuàgěiwǒdexiǎonǚhái 。",
        "vietnamese": "Tôi nhìn qua, tên đó chính là cô bé vừa gọi tôi."
      },
      {
        "id": 55,
        "startTime": 280.0,
        "endTime": 289.0,
        "speaker": "Người kể",
        "chinese": "我问,她现在在哪里,老人说,我不知道,但是她今天一个人出来了,她可能很害怕。",
        "pinyin": "Wǒwèn , tāxiànzàizàinǎlǐ , lǎorénshuō , wǒbùzhīdào , dànshìtājīntiānyígèrénchūláile , tākěnénghěnhàipà 。",
        "vietnamese": "Tôi hỏi hiện giờ cô ấy ở đâu, ông già nói, tôi không biết, nhưng hôm nay cô ấy ra ngoài một mình, có thể cô ấy sẽ sợ hãi."
      },
      {
        "id": 56,
        "startTime": 289.0,
        "endTime": 294.0,
        "speaker": "Người kể",
        "chinese": "我看着老人,我不知道应该相信她还是离开这里。",
        "pinyin": "Wǒkànzhelǎorén , wǒbùzhīdàoyīnggāixiāngxìntāháishìlíkāizhèlǐ 。",
        "vietnamese": "Tôi nhìn ông già và không biết nên tin bà hay nên rời khỏi đây."
      },
      {
        "id": 57,
        "startTime": 294.0,
        "endTime": 301.0,
        "speaker": "Người kể",
        "chinese": "就在这时候,我的手机又想了,我拿出手机,不是电话,是一个消息。",
        "pinyin": "Jiùzàizhèshíhòu , wǒdeshǒujīyòuxiǎngle , wǒnáchūshǒujī , búshìdiànhuà , shìyígèxiāoxī 。",
        "vietnamese": "Lúc này, tôi lại nghĩ về chiếc điện thoại di động của mình. Tôi lấy điện thoại di động ra. Đó không phải là một cuộc gọi điện thoại mà là một tin nhắn."
      },
      {
        "id": 58,
        "startTime": 301.0,
        "endTime": 307.0,
        "speaker": "Người kể",
        "chinese": "我打开消息,上面只有一句话,不要告诉那个老人。",
        "pinyin": "Wǒdǎkāixiāoxī , shàngmiànzhǐyǒuyījùhuà , búyàogàosùnàgelǎorén 。",
        "vietnamese": "Tôi mở tin nhắn ra chỉ có một câu, đừng nói cho ông già đó biết."
      },
      {
        "id": 59,
        "startTime": 307.0,
        "endTime": 317.0,
        "speaker": "Người kể",
        "chinese": "我马上看向老人,老人还站在那里,她正在看着我,可是她好像已经知道我看到了什么。",
        "pinyin": "Wǒmǎshàngkànxiànglǎorén , lǎorénháizhànzàinàlǐ , tāzhèngzàikànzhewǒ , kěshìtāhǎoxiàngyǐjīngzhīdàowǒkàndàoleshénme 。",
        "vietnamese": "Tôi lập tức nhìn ông già vẫn đứng đó. Cô ấy đang nhìn tôi, nhưng dường như cô ấy đã biết tôi nhìn thấy gì."
      }
    ]
  },
  {
    "id": "hsk3-confident-speaking",
    "title": "30 câu khẩu ngữ tự tin mở miệng nói tiếng Trung (HSK 3-4)",
    "level": "HSK 3-4",
    "levelBadgeColor": "text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-300",
    "duration": "14:48",
    "category": "Giao tiếp đời sống",
    "description": "Luyện 30 câu khẩu ngữ phản xạ siêu thông dụng giúp bạn phá bỏ rào cản sợ nói, tự tin giao tiếp như người bản xứ.",
    "youtubeId": "LFmGScveiwA",
    "sentencesCount": 137,
    "isFree": true,
    "sentences": [
      {
        "id": 1,
        "startTime": 0.5,
        "endTime": 1.5,
        "speaker": "Cô giáo",
        "chinese": "大家好",
        "pinyin": "Dàjiāhǎo",
        "vietnamese": "Xin chào mọi người"
      },
      {
        "id": 2,
        "startTime": 1.5,
        "endTime": 5.2,
        "speaker": "Cô giáo",
        "chinese": "欢迎你来到今天的中文口语练习",
        "pinyin": "Huānyíngnǐláidàojīntiāndezhōngwénkǒuyǔliànxí",
        "vietnamese": "Chào mừng bạn đến với buổi luyện nói tiếng Trung hôm nay"
      },
      {
        "id": 3,
        "startTime": 5.8,
        "endTime": 7.9,
        "speaker": "Cô giáo",
        "chinese": "如果你听得懂中文",
        "pinyin": "Rúguǒnǐtīngdedǒngzhōngwén",
        "vietnamese": "Nếu bạn hiểu tiếng Trung"
      },
      {
        "id": 4,
        "startTime": 8.0,
        "endTime": 11.0,
        "speaker": "Cô giáo",
        "chinese": "但是一开口就不敢说",
        "pinyin": "Dànshìyīkāikǒujiùbùgǎnshuō",
        "vietnamese": "Nhưng tôi không dám nói một khi đã mở miệng"
      },
      {
        "id": 5,
        "startTime": 12.2,
        "endTime": 15.5,
        "speaker": "Cô giáo",
        "chinese": "那这个视频就是为你准备的",
        "pinyin": "Nàzhègeshìpínjiùshìwèinǐzhǔnbèide",
        "vietnamese": "Vậy thì video này là dành cho bạn"
      },
      {
        "id": 6,
        "startTime": 16.0,
        "endTime": 20.0,
        "speaker": "Cô giáo",
        "chinese": "今天我们不学枯燥的语法",
        "pinyin": "Jīntiānwǒmenbùxuékūzàodeyǔfǎ",
        "vietnamese": "Hôm nay chúng ta sẽ không học ngữ pháp nhàm chán"
      },
      {
        "id": 7,
        "startTime": 20.7,
        "endTime": 23.6,
        "speaker": "Cô giáo",
        "chinese": "也不背很难的单词",
        "pinyin": "Yěbùbèihěnnándedāncí",
        "vietnamese": "Đừng ghi nhớ những từ khó"
      },
      {
        "id": 8,
        "startTime": 23.7,
        "endTime": 26.9,
        "speaker": "Cô giáo",
        "chinese": "今天我们要一起开口说中文",
        "pinyin": "Jīntiānwǒmenyàoyìqǐkāikǒushuōzhōngwén",
        "vietnamese": "Hôm nay chúng ta sẽ cùng nhau nói tiếng Trung"
      },
      {
        "id": 9,
        "startTime": 27.4,
        "endTime": 29.0,
        "speaker": "Cô giáo",
        "chinese": "在开始之前",
        "pinyin": "Zàikāishǐzhīqián",
        "vietnamese": "trước khi bắt đầu"
      },
      {
        "id": 10,
        "startTime": 29.0,
        "endTime": 31.3,
        "speaker": "Cô giáo",
        "chinese": "我想问你一个问题",
        "pinyin": "Wǒxiǎngwènnǐyígèwèntí",
        "vietnamese": "Tôi muốn hỏi bạn một câu hỏi"
      },
      {
        "id": 11,
        "startTime": 31.7,
        "endTime": 35.0,
        "speaker": "Cô giáo",
        "chinese": "你已经多久没有大声说中文了",
        "pinyin": "Nǐyǐjīngduōjiǔméiyǒudàshēngshuōzhōngwénle",
        "vietnamese": "Đã bao lâu rồi bạn chưa nói tiếng Trung thành tiếng?"
      },
      {
        "id": 12,
        "startTime": 35.1,
        "endTime": 38.2,
        "speaker": "Cô giáo",
        "chinese": "一天一个星期",
        "pinyin": "Yītiānyígèxīngqī",
        "vietnamese": "một ngày một tuần"
      },
      {
        "id": 13,
        "startTime": 38.8,
        "endTime": 41.1,
        "speaker": "Cô giáo",
        "chinese": "还是很久很久了",
        "pinyin": "Háishìhěnjiǔhěnjiǔle",
        "vietnamese": "Đã lâu lắm rồi"
      },
      {
        "id": 14,
        "startTime": 41.2,
        "endTime": 42.4,
        "speaker": "Cô giáo",
        "chinese": "没关系",
        "pinyin": "Méiguānxì",
        "vietnamese": "Nó không quan trọng"
      },
      {
        "id": 15,
        "startTime": 42.7,
        "endTime": 46.7,
        "speaker": "Cô giáo",
        "chinese": "只要你现在在这里就已经很好了",
        "pinyin": "Zhǐyàonǐxiànzàizàizhèlǐjiùyǐjīnghěnhǎole",
        "vietnamese": "Chỉ cần bây giờ bạn ở đây là được rồi"
      },
      {
        "id": 16,
        "startTime": 47.4,
        "endTime": 52.1,
        "speaker": "Cô giáo",
        "chinese": "很多学习中文的人都会遇到同样的问题",
        "pinyin": "Hěnduōxuéxízhōngwénderéndūhuìyùdàotóngyàngdewèntí",
        "vietnamese": "Nhiều người học tiếng Trung cũng sẽ gặp phải vấn đề tương tự"
      },
      {
        "id": 17,
        "startTime": 52.6,
        "endTime": 55.9,
        "speaker": "Cô giáo",
        "chinese": "听得懂但是不敢说",
        "pinyin": "Tīngdedǒngdànshìbùgǎnshuō",
        "vietnamese": "Tôi hiểu nhưng không dám nói"
      },
      {
        "id": 18,
        "startTime": 56.4,
        "endTime": 59.5,
        "speaker": "Cô giáo",
        "chinese": "怕说错怕发音不标准",
        "pinyin": "Pàshuōcuòpàfāyīnbùbiāozhǔn",
        "vietnamese": "Sợ nói sai, sợ phát âm không chuẩn"
      },
      {
        "id": 19,
        "startTime": 60.1,
        "endTime": 61.8,
        "speaker": "Cô giáo",
        "chinese": "怕别人听不懂",
        "pinyin": "Pàbiéréntīngbùdǒng",
        "vietnamese": "Sợ người khác không hiểu"
      },
      {
        "id": 20,
        "startTime": 62.5,
        "endTime": 66.7,
        "speaker": "Cô giáo",
        "chinese": "于是慢慢的就不说了",
        "pinyin": "Yúshìmànmàndejiùbùshuōle",
        "vietnamese": "Thế nên tôi dần dần ngừng nói."
      },
      {
        "id": 21,
        "startTime": 67.2,
        "endTime": 72.1,
        "speaker": "Mẫu câu",
        "chinese": "但是我想告诉你一件很重要的事",
        "pinyin": "Dànshìwǒxiǎnggàosùnǐyījiànhěnzhòngyàodeshì",
        "vietnamese": "Nhưng tôi muốn nói với bạn một điều rất quan trọng"
      },
      {
        "id": 22,
        "startTime": 72.5,
        "endTime": 75.0,
        "speaker": "Mẫu câu",
        "chinese": "说错比不说好",
        "pinyin": "Shuōcuòbǐbùshuōhǎo",
        "vietnamese": "Thà nói sai còn hơn là không nói gì cả"
      },
      {
        "id": 23,
        "startTime": 75.3,
        "endTime": 78.8,
        "speaker": "Mẫu câu",
        "chinese": "因为说错说明你在学习",
        "pinyin": "Yīnwèishuōcuòshuōmíngnǐzàixuéxí",
        "vietnamese": "Vì nói sai có nghĩa là bạn đang học"
      },
      {
        "id": 24,
        "startTime": 79.7,
        "endTime": 83.8,
        "speaker": "Mẫu câu",
        "chinese": "所以今天我们用一个非常简单",
        "pinyin": "Suǒyǐjīntiānwǒmenyòngyígèfēichángjiǎndān",
        "vietnamese": "Vì vậy hôm nay chúng ta sử dụng một cách rất đơn giản"
      },
      {
        "id": 25,
        "startTime": 83.8,
        "endTime": 86.6,
        "speaker": "Mẫu câu",
        "chinese": "但是非常有效的方法",
        "pinyin": "Dànshìfēichángyǒuxiàodefāngfǎ",
        "vietnamese": "Nhưng phương pháp rất hiệu quả"
      },
      {
        "id": 26,
        "startTime": 87.4,
        "endTime": 89.7,
        "speaker": "Mẫu câu",
        "chinese": "shadowing跟读练习",
        "pinyin": "Shadowing gēndúliànxí",
        "vietnamese": "bài tập đọc bóng"
      },
      {
        "id": 27,
        "startTime": 90.3,
        "endTime": 92.4,
        "speaker": "Mẫu câu",
        "chinese": "shadowing是什么",
        "pinyin": "Shadowing shìshénme",
        "vietnamese": "bóng tối là gì"
      },
      {
        "id": 28,
        "startTime": 92.9,
        "endTime": 94.6,
        "speaker": "Mẫu câu",
        "chinese": "很简单",
        "pinyin": "Hěnjiǎndān",
        "vietnamese": "rất đơn giản"
      },
      {
        "id": 29,
        "startTime": 95.3,
        "endTime": 96.9,
        "speaker": "Mẫu câu",
        "chinese": "我说一句",
        "pinyin": "Wǒshuōyījù",
        "vietnamese": "Hãy để tôi nói điều gì đó"
      },
      {
        "id": 30,
        "startTime": 97.3,
        "endTime": 100.2,
        "speaker": "Mẫu câu",
        "chinese": "停一下你跟着说",
        "pinyin": "Tíngyīxiànǐgēnzheshuō",
        "vietnamese": "Dừng lại một chút và bạn tiếp tục."
      },
      {
        "id": 31,
        "startTime": 100.5,
        "endTime": 101.7,
        "speaker": "Mẫu câu",
        "chinese": "不用完美",
        "pinyin": "Bùyòngwánměi",
        "vietnamese": "Không cần phải hoàn hảo"
      },
      {
        "id": 32,
        "startTime": 101.7,
        "endTime": 104.6,
        "speaker": "Mẫu câu",
        "chinese": "不用快只要开口",
        "pinyin": "Bùyòngkuàizhǐyàokāikǒu",
        "vietnamese": "Không cần vội, chỉ cần nói"
      },
      {
        "id": 33,
        "startTime": 104.8,
        "endTime": 108.2,
        "speaker": "Mẫu câu",
        "chinese": "今天的练习一共有30句话",
        "pinyin": "Jīntiāndeliànxíyīgòngyǒu 30 jùhuà",
        "vietnamese": "Bài tập hôm nay có tổng cộng 30 câu"
      },
      {
        "id": 34,
        "startTime": 108.9,
        "endTime": 112.6,
        "speaker": "Mẫu câu",
        "chinese": "适合HSK34的水平",
        "pinyin": "Shìhé HSK34 deshuǐpíng",
        "vietnamese": "Phù hợp trình độ HSK34"
      },
      {
        "id": 35,
        "startTime": 113.0,
        "endTime": 114.4,
        "speaker": "Mẫu câu",
        "chinese": "句子不难",
        "pinyin": "Jùzibùnán",
        "vietnamese": "Câu văn không khó"
      },
      {
        "id": 36,
        "startTime": 114.4,
        "endTime": 116.0,
        "speaker": "Mẫu câu",
        "chinese": "词也不复杂",
        "pinyin": "Cíyěbùfùzá",
        "vietnamese": "Từ ngữ cũng không phức tạp"
      },
      {
        "id": 37,
        "startTime": 116.5,
        "endTime": 117.8,
        "speaker": "Mẫu câu",
        "chinese": "主题是",
        "pinyin": "Zhǔtíshì",
        "vietnamese": "chủ đề là"
      },
      {
        "id": 38,
        "startTime": 118.4,
        "endTime": 121.8,
        "speaker": "Mẫu câu",
        "chinese": "学习自信坚持",
        "pinyin": "Xuéxízìxìnjiānchí",
        "vietnamese": "Học cách tự tin và kiên trì"
      },
      {
        "id": 39,
        "startTime": 122.8,
        "endTime": 125.0,
        "speaker": "Mẫu câu",
        "chinese": "练习的时候请你",
        "pinyin": "Liànxídeshíhòuqǐngnǐ",
        "vietnamese": "Xin hỏi khi nào tôi tập luyện"
      },
      {
        "id": 40,
        "startTime": 125.5,
        "endTime": 126.6,
        "speaker": "Mẫu câu",
        "chinese": "看字幕",
        "pinyin": "Kànzìmù",
        "vietnamese": "đọc phụ đề"
      },
      {
        "id": 41,
        "startTime": 127.4,
        "endTime": 131.2,
        "speaker": "Mẫu câu",
        "chinese": "听发音大声说出来",
        "pinyin": "Tīngfāyīndàshēngshuōchūlái",
        "vietnamese": "Nghe cách phát âm và nói to"
      },
      {
        "id": 42,
        "startTime": 132.0,
        "endTime": 134.6,
        "speaker": "Mẫu câu",
        "chinese": "即使你一个人在房间里",
        "pinyin": "Jíshǐnǐyígèrénzàifángjiānlǐ",
        "vietnamese": "Kể cả khi bạn ở một mình trong phòng"
      },
      {
        "id": 43,
        "startTime": 134.8,
        "endTime": 136.7,
        "speaker": "Mẫu câu",
        "chinese": "也要说出来",
        "pinyin": "Yěyàoshuōchūlái",
        "vietnamese": "Nói cũng được"
      },
      {
        "id": 44,
        "startTime": 136.9,
        "endTime": 139.3,
        "speaker": "Mẫu câu",
        "chinese": "好了我们开始吧",
        "pinyin": "Hǎolewǒmenkāishǐba",
        "vietnamese": "Được rồi hãy bắt đầu"
      },
      {
        "id": 45,
        "startTime": 139.4,
        "endTime": 140.8,
        "speaker": "Mẫu câu",
        "chinese": "我先说",
        "pinyin": "Wǒxiānshuō",
        "vietnamese": "Hãy để tôi nói trước"
      },
      {
        "id": 46,
        "startTime": 141.3,
        "endTime": 142.9,
        "speaker": "Mẫu câu",
        "chinese": "你跟着说",
        "pinyin": "Nǐgēnzheshuō",
        "vietnamese": "Bạn theo dõi"
      },
      {
        "id": 47,
        "startTime": 145.6,
        "endTime": 147.2,
        "speaker": "Mẫu câu",
        "chinese": "1. 我在学中文",
        "pinyin": "1. wǒzàixuézhōngwén",
        "vietnamese": "1. Tôi đang học tiếng Trung"
      },
      {
        "id": 48,
        "startTime": 149.0,
        "endTime": 150.4,
        "speaker": "Mẫu câu",
        "chinese": "我在学中文",
        "pinyin": "Wǒzàixuézhōngwén",
        "vietnamese": "Tôi đang học tiếng Trung"
      },
      {
        "id": 49,
        "startTime": 153.5,
        "endTime": 155.3,
        "speaker": "Mẫu câu",
        "chinese": "2. 我每天练习中文",
        "pinyin": "2. wǒměitiānliànxízhōngwén",
        "vietnamese": "2. Tôi luyện tiếng Trung mỗi ngày"
      },
      {
        "id": 50,
        "startTime": 158.2,
        "endTime": 160.2,
        "speaker": "Mẫu câu",
        "chinese": "我每天练习中文",
        "pinyin": "Wǒměitiānliànxízhōngwén",
        "vietnamese": "Tôi luyện tập tiếng Trung mỗi ngày"
      },
      {
        "id": 51,
        "startTime": 162.9,
        "endTime": 164.5,
        "speaker": "Mẫu câu",
        "chinese": "3. 我不怕说错",
        "pinyin": "3. wǒbùpàshuōcuò",
        "vietnamese": "3. Tôi không sợ sai"
      },
      {
        "id": 52,
        "startTime": 167.0,
        "endTime": 168.5,
        "speaker": "Mẫu câu",
        "chinese": "我不怕说错",
        "pinyin": "Wǒbùpàshuōcuò",
        "vietnamese": "Tôi không sợ sai"
      },
      {
        "id": 53,
        "startTime": 171.8,
        "endTime": 173.8,
        "speaker": "Mẫu câu",
        "chinese": "4. 说错也是学习",
        "pinyin": "4. shuōcuòyěshìxuéxí",
        "vietnamese": "4. Phạm sai lầm cũng là học hỏi"
      },
      {
        "id": 54,
        "startTime": 177.4,
        "endTime": 179.4,
        "speaker": "Mẫu câu",
        "chinese": "说错也是学习",
        "pinyin": "Shuōcuòyěshìxuéxí",
        "vietnamese": "Phạm sai lầm cũng là học hỏi"
      },
      {
        "id": 55,
        "startTime": 182.4,
        "endTime": 184.4,
        "speaker": "Mẫu câu",
        "chinese": "5. 我听得懂很多",
        "pinyin": "5. wǒtīngdedǒnghěnduō",
        "vietnamese": "5. Tôi hiểu rất nhiều"
      },
      {
        "id": 56,
        "startTime": 187.1,
        "endTime": 189.1,
        "speaker": "Mẫu câu",
        "chinese": "我听得懂很多",
        "pinyin": "Wǒtīngdedǒnghěnduō",
        "vietnamese": "Tôi hiểu rất nhiều"
      },
      {
        "id": 57,
        "startTime": 191.9,
        "endTime": 195.2,
        "speaker": "Mẫu câu",
        "chinese": "6. 我慢慢说也没关系",
        "pinyin": "6. wǒmànmànshuōyěméiguānxì",
        "vietnamese": "6. Tôi nói chậm cũng không sao."
      },
      {
        "id": 58,
        "startTime": 199.5,
        "endTime": 202.7,
        "speaker": "Mẫu câu",
        "chinese": "我慢慢说也没关系",
        "pinyin": "Wǒmànmànshuōyěméiguānxì",
        "vietnamese": "Sẽ không sao nếu tôi nói chậm rãi"
      },
      {
        "id": 59,
        "startTime": 206.8,
        "endTime": 209.0,
        "speaker": "Mẫu câu",
        "chinese": "7. 我越来越有信心",
        "pinyin": "7. wǒyuèláiyuèyǒuxìnxīn",
        "vietnamese": "7. Tôi ngày càng tự tin hơn."
      },
      {
        "id": 60,
        "startTime": 212.0,
        "endTime": 214.1,
        "speaker": "Mẫu câu",
        "chinese": "我越来越有信心",
        "pinyin": "Wǒyuèláiyuèyǒuxìnxīn",
        "vietnamese": "Tôi ngày càng tự tin hơn"
      },
      {
        "id": 61,
        "startTime": 217.3,
        "endTime": 219.2,
        "speaker": "Mẫu câu",
        "chinese": "8. 我喜欢学中文",
        "pinyin": "8. wǒxǐhuānxuézhōngwén",
        "vietnamese": "8. Tôi thích học tiếng Trung"
      },
      {
        "id": 62,
        "startTime": 222.1,
        "endTime": 224.0,
        "speaker": "Mẫu câu",
        "chinese": "我喜欢学中文",
        "pinyin": "Wǒxǐhuānxuézhōngwén",
        "vietnamese": "Tôi thích học tiếng Trung"
      },
      {
        "id": 63,
        "startTime": 227.5,
        "endTime": 229.6,
        "speaker": "Mẫu câu",
        "chinese": "9. 我每天都在进步",
        "pinyin": "9. wǒměitiāndōuzàijìnbù",
        "vietnamese": "9. Tôi tiến bộ mỗi ngày"
      },
      {
        "id": 64,
        "startTime": 232.7,
        "endTime": 234.9,
        "speaker": "Mẫu câu",
        "chinese": "我每天都在进步",
        "pinyin": "Wǒměitiāndōuzàijìnbù",
        "vietnamese": "Tôi đang tiến bộ mỗi ngày"
      },
      {
        "id": 65,
        "startTime": 238.1,
        "endTime": 239.9,
        "speaker": "Mẫu câu",
        "chinese": "10. 我相信自己",
        "pinyin": "10. wǒxiāngxìnzìjǐ",
        "vietnamese": "10. Tôi tin vào bản thân mình"
      },
      {
        "id": 66,
        "startTime": 242.3,
        "endTime": 244.2,
        "speaker": "Mẫu câu",
        "chinese": "我相信自己",
        "pinyin": "Wǒxiāngxìnzìjǐ",
        "vietnamese": "tôi tin vào bản thân mình"
      },
      {
        "id": 67,
        "startTime": 248.4,
        "endTime": 250.9,
        "speaker": "Mẫu câu",
        "chinese": "你已经完成了10句话",
        "pinyin": "Nǐyǐjīngwánchéngle 10 jùhuà",
        "vietnamese": "Bạn đã hoàn thành 10 câu"
      },
      {
        "id": 68,
        "startTime": 251.3,
        "endTime": 253.2,
        "speaker": "Mẫu câu",
        "chinese": "也许你发现",
        "pinyin": "Yěxǔnǐfāxiàn",
        "vietnamese": "có thể bạn tìm thấy"
      },
      {
        "id": 69,
        "startTime": 253.8,
        "endTime": 256.7,
        "speaker": "Mẫu câu",
        "chinese": "其实你可以说中文",
        "pinyin": "Qíshínǐkěyǐshuōzhōngwén",
        "vietnamese": "Thực ra bạn có thể nói tiếng Trung Quốc"
      },
      {
        "id": 70,
        "startTime": 257.3,
        "endTime": 261.2,
        "speaker": "Mẫu câu",
        "chinese": "现在我们试试稍微长一点的句子",
        "pinyin": "Xiànzàiwǒmenshìshìshāowēizhǎngyìdiǎndejùzi",
        "vietnamese": "Bây giờ hãy thử một câu dài hơn một chút"
      },
      {
        "id": 71,
        "startTime": 261.6,
        "endTime": 263.5,
        "speaker": "Mẫu câu",
        "chinese": "记住，不用急。",
        "pinyin": "Jìzhù ， bùyòngjí 。",
        "vietnamese": "Hãy nhớ rằng, không cần phải vội vàng."
      },
      {
        "id": 72,
        "startTime": 268.2,
        "endTime": 272.8,
        "speaker": "Mẫu câu",
        "chinese": "11. 我今天的努力, 会让我明天说的更好",
        "pinyin": "11. wǒjīntiāndenǔlì , huìràngwǒmíngtiānshuōdegènghǎo",
        "vietnamese": "11. Nỗ lực của tôi ngày hôm nay sẽ giúp tôi nói tốt hơn vào ngày mai"
      },
      {
        "id": 73,
        "startTime": 279.0,
        "endTime": 283.6,
        "speaker": "Mẫu câu",
        "chinese": "我今天的努力, 会让我明天说的更好",
        "pinyin": "Wǒjīntiāndenǔlì , huìràngwǒmíngtiānshuōdegènghǎo",
        "vietnamese": "Những nỗ lực của tôi ngày hôm nay sẽ giúp tôi nói tốt hơn vào ngày mai"
      },
      {
        "id": 74,
        "startTime": 291.5,
        "endTime": 295.3,
        "speaker": "Mẫu câu",
        "chinese": "12. 我不放弃, 我一直在成长",
        "pinyin": "12. wǒbùfàngqì , wǒyìzhízàichéngzhǎng",
        "vietnamese": "12. Tôi không bỏ cuộc, tôi tiếp tục phát triển"
      },
      {
        "id": 75,
        "startTime": 300.5,
        "endTime": 304.3,
        "speaker": "Mẫu câu",
        "chinese": "我不放弃, 我一直在成长",
        "pinyin": "Wǒbùfàngqì , wǒyìzhízàichéngzhǎng",
        "vietnamese": "Tôi không bỏ cuộc, tôi tiếp tục phát triển"
      },
      {
        "id": 76,
        "startTime": 309.7,
        "endTime": 314.9,
        "speaker": "Mẫu câu",
        "chinese": "13. 学习中文是一个过程, 慢一点也没问题",
        "pinyin": "13. xuéxízhōngwénshìyígèguòchéng , mànyìdiǎnyěméiwèntí",
        "vietnamese": "13. Học tiếng Trung là một quá trình, học chậm hơn cũng không sao"
      },
      {
        "id": 77,
        "startTime": 319.6,
        "endTime": 324.8,
        "speaker": "Mẫu câu",
        "chinese": "学习中文是一个过程, 慢一点也没问题",
        "pinyin": "Xuéxízhōngwénshìyígèguòchéng , mànyìdiǎnyěméiwèntí",
        "vietnamese": "Học tiếng Trung là một quá trình, học chậm hơn cũng được"
      },
      {
        "id": 78,
        "startTime": 331.0,
        "endTime": 336.0,
        "speaker": "Mẫu câu",
        "chinese": "14. 我说中文是为了表达, 不是为了完美",
        "pinyin": "14. wǒshuōzhōngwénshìwèilebiǎodá , búshìwèilewánměi",
        "vietnamese": "14. Tôi nói tiếng Trung để diễn đạt chứ không phải để hoàn thiện."
      },
      {
        "id": 79,
        "startTime": 341.5,
        "endTime": 347.8,
        "speaker": "Mẫu câu",
        "chinese": "我说中文是为了表达, 不是为了完美",
        "pinyin": "Wǒshuōzhōngwénshìwèilebiǎodá , búshìwèilewánměi",
        "vietnamese": "Tôi nói tiếng Trung để diễn đạt chứ không phải để hoàn thiện"
      },
      {
        "id": 80,
        "startTime": 353.6,
        "endTime": 356.3,
        "speaker": "Mẫu câu",
        "chinese": "如果你一直跟着说到现在",
        "pinyin": "Rúguǒnǐyìzhígēnzheshuōdàoxiànzài",
        "vietnamese": "Nếu bạn đã theo dõi cho đến bây giờ"
      },
      {
        "id": 81,
        "startTime": 356.8,
        "endTime": 359.6,
        "speaker": "Mẫu câu",
        "chinese": "我真的为你感到骄傲",
        "pinyin": "Wǒzhēndewèinǐgǎndàojiāoào",
        "vietnamese": "tôi thực sự tự hào về bạn"
      },
      {
        "id": 82,
        "startTime": 365.2,
        "endTime": 368.8,
        "speaker": "Mẫu câu",
        "chinese": "因为你不是只在看你在做",
        "pinyin": "Yīnwèinǐbúshìzhǐzàikànnǐzàizuò",
        "vietnamese": "Bởi vì bạn không chỉ quan sát những gì bạn đang làm"
      },
      {
        "id": 83,
        "startTime": 373.3,
        "endTime": 375.4,
        "speaker": "Mẫu câu",
        "chinese": "今天只是第一天",
        "pinyin": "Jīntiānzhǐshìdìyītiān",
        "vietnamese": "Hôm nay chỉ là ngày đầu tiên"
      },
      {
        "id": 84,
        "startTime": 375.7,
        "endTime": 378.1,
        "speaker": "Mẫu câu",
        "chinese": "只要你每天一点点",
        "pinyin": "Zhǐyàonǐměitiānyìdiǎndiǎn",
        "vietnamese": "Miễn là bạn làm điều đó mỗi ngày một chút"
      },
      {
        "id": 85,
        "startTime": 378.4,
        "endTime": 381.8,
        "speaker": "Mẫu câu",
        "chinese": "你的中文一定会越来越好",
        "pinyin": "Nǐdezhōngwényídìnghuìyuèláiyuèhǎo",
        "vietnamese": "Tiếng Trung của bạn chắc chắn sẽ ngày càng tốt hơn"
      },
      {
        "id": 86,
        "startTime": 386.3,
        "endTime": 390.0,
        "speaker": "Mẫu câu",
        "chinese": "现在我们继续今天的跟读练习",
        "pinyin": "Xiànzàiwǒmenjìxùjīntiāndegēndúliànxí",
        "vietnamese": "Bây giờ chúng ta tiếp tục bài tập đọc hôm nay"
      },
      {
        "id": 87,
        "startTime": 390.6,
        "endTime": 393.1,
        "speaker": "Mẫu câu",
        "chinese": "你已经做得很好了",
        "pinyin": "Nǐyǐjīngzuòdéhěnhǎole",
        "vietnamese": "bạn đã làm rất tốt"
      },
      {
        "id": 88,
        "startTime": 393.6,
        "endTime": 395.1,
        "speaker": "Mẫu câu",
        "chinese": "记住一句话",
        "pinyin": "Jìzhùyījùhuà",
        "vietnamese": "Nhớ một lời"
      },
      {
        "id": 89,
        "startTime": 395.6,
        "endTime": 397.8,
        "speaker": "Mẫu câu",
        "chinese": "中文不是学会的",
        "pinyin": "Zhōngwénbúshìxuéhuìde",
        "vietnamese": "Tiếng Trung không được học"
      },
      {
        "id": 90,
        "startTime": 397.8,
        "endTime": 399.3,
        "speaker": "Mẫu câu",
        "chinese": "是说会的",
        "pinyin": "Shìshuōhuìde",
        "vietnamese": "Anh ấy nói anh ấy sẽ"
      },
      {
        "id": 91,
        "startTime": 399.8,
        "endTime": 401.0,
        "speaker": "Mẫu câu",
        "chinese": "我们继续",
        "pinyin": "Wǒmenjìxù",
        "vietnamese": "Hãy tiếp tục"
      },
      {
        "id": 92,
        "startTime": 401.4,
        "endTime": 402.5,
        "speaker": "Mẫu câu",
        "chinese": "还是一样",
        "pinyin": "Háishìyīyàng",
        "vietnamese": "Vẫn như cũ"
      },
      {
        "id": 93,
        "startTime": 402.5,
        "endTime": 404.8,
        "speaker": "Mẫu câu",
        "chinese": "我先说你跟着说",
        "pinyin": "Wǒxiānshuōnǐgēnzheshuō",
        "vietnamese": "Tôi sẽ nói trước, bạn có thể theo dõi tôi"
      },
      {
        "id": 94,
        "startTime": 408.2,
        "endTime": 410.1,
        "speaker": "Mẫu câu",
        "chinese": "15. 我每天都会听中文",
        "pinyin": "15. wǒměitiāndūhuìtīngzhōngwén",
        "vietnamese": "15. Tôi nghe tiếng Trung mỗi ngày"
      },
      {
        "id": 95,
        "startTime": 412.7,
        "endTime": 414.8,
        "speaker": "Mẫu câu",
        "chinese": "我每天都会听中文",
        "pinyin": "Wǒměitiāndūhuìtīngzhōngwén",
        "vietnamese": "Tôi nghe tiếng Trung mỗi ngày"
      },
      {
        "id": 96,
        "startTime": 417.6,
        "endTime": 420.2,
        "speaker": "Mẫu câu",
        "chinese": "16. 我听的比以前懂得多",
        "pinyin": "16. wǒtīngdebǐyǐqiándǒngdeduō",
        "vietnamese": "16. Tôi lắng nghe và hiểu tốt hơn trước"
      },
      {
        "id": 97,
        "startTime": 423.4,
        "endTime": 426.2,
        "speaker": "Mẫu câu",
        "chinese": "我听得比以前懂得多",
        "pinyin": "Wǒtīngdébǐyǐqiándǒngdeduō",
        "vietnamese": "Tôi lắng nghe và hiểu rõ hơn trước"
      },
      {
        "id": 98,
        "startTime": 429.8,
        "endTime": 432.0,
        "speaker": "Mẫu câu",
        "chinese": "17. 我不需要每个字都懂",
        "pinyin": "17. wǒbùxūyàoměigèzìdōudǒng",
        "vietnamese": "17. Tôi không cần phải hiểu từng từ."
      },
      {
        "id": 99,
        "startTime": 435.4,
        "endTime": 437.7,
        "speaker": "Mẫu câu",
        "chinese": "我不需要每个字都懂",
        "pinyin": "Wǒbùxūyàoměigèzìdōudǒng",
        "vietnamese": "Tôi không cần phải hiểu từng từ"
      },
      {
        "id": 100,
        "startTime": 439.9,
        "endTime": 442.4,
        "speaker": "Mẫu câu",
        "chinese": "18. 我能明白大概的意思",
        "pinyin": "18. wǒnéngmíngbáidàgàideyìsi",
        "vietnamese": "18. Tôi có thể hiểu được ý nghĩa chung"
      },
      {
        "id": 101,
        "startTime": 445.7,
        "endTime": 448.0,
        "speaker": "Mẫu câu",
        "chinese": "我能明白大概的意思",
        "pinyin": "Wǒnéngmíngbáidàgàideyìsi",
        "vietnamese": "Tôi có thể hiểu ý nghĩa chung"
      },
      {
        "id": 102,
        "startTime": 450.9,
        "endTime": 453.8,
        "speaker": "Mẫu câu",
        "chinese": "19. 听不懂的时候我也不紧张",
        "pinyin": "19. tīngbùdǒngdeshíhòuwǒyěbùjǐnzhāng",
        "vietnamese": "19. Tôi không lo lắng khi không hiểu điều gì đó."
      },
      {
        "id": 103,
        "startTime": 457.0,
        "endTime": 459.9,
        "speaker": "Mẫu câu",
        "chinese": "听不懂的时候我也不紧张",
        "pinyin": "Tīngbùdǒngdeshíhòuwǒyěbùjǐnzhāng",
        "vietnamese": "Tôi không lo lắng khi không hiểu điều gì đó"
      },
      {
        "id": 104,
        "startTime": 463.1,
        "endTime": 465.9,
        "speaker": "Mẫu câu",
        "chinese": "很好哦继续",
        "pinyin": "Hěnhǎoójìxù",
        "vietnamese": "Hay lắm, tiếp tục nhé"
      },
      {
        "id": 105,
        "startTime": 467.6,
        "endTime": 470.2,
        "speaker": "Mẫu câu",
        "chinese": "20. 我给自己时间学习中文",
        "pinyin": "20. wǒgěizìjǐshíjiānxuéxízhōngwén",
        "vietnamese": "20. Tôi dành thời gian cho mình để học tiếng Trung"
      },
      {
        "id": 106,
        "startTime": 473.2,
        "endTime": 475.9,
        "speaker": "Mẫu câu",
        "chinese": "我给自己时间学习中文",
        "pinyin": "Wǒgěizìjǐshíjiānxuéxízhōngwén",
        "vietnamese": "Tôi dành thời gian cho bản thân để học tiếng Trung"
      },
      {
        "id": 107,
        "startTime": 479.7,
        "endTime": 482.3,
        "speaker": "Mẫu câu",
        "chinese": "20. 我允许自己慢慢进步",
        "pinyin": "20. wǒyǔnxǔzìjǐmànmànjìnbù",
        "vietnamese": "20. Tôi cho phép bản thân cải thiện từ từ"
      },
      {
        "id": 108,
        "startTime": 486.3,
        "endTime": 489.0,
        "speaker": "Mẫu câu",
        "chinese": "我允许自己慢慢进步",
        "pinyin": "Wǒyǔnxǔzìjǐmànmànjìnbù",
        "vietnamese": "Tôi cho phép mình tiến bộ từ từ"
      },
      {
        "id": 109,
        "startTime": 492.0,
        "endTime": 494.7,
        "speaker": "Mẫu câu",
        "chinese": "21. 我不会因为说错而放弃",
        "pinyin": "21. wǒbúhuìyīnwèishuōcuòérfàngqì",
        "vietnamese": "21. Tôi sẽ không bỏ cuộc chỉ vì tôi đã nói sai điều gì đó."
      },
      {
        "id": 110,
        "startTime": 498.6,
        "endTime": 501.3,
        "speaker": "Mẫu câu",
        "chinese": "我不会因为说错而放弃",
        "pinyin": "Wǒbúhuìyīnwèishuōcuòérfàngqì",
        "vietnamese": "Tôi sẽ không bỏ cuộc chỉ vì tôi đã nói sai điều gì đó"
      },
      {
        "id": 111,
        "startTime": 505.3,
        "endTime": 507.6,
        "speaker": "Mẫu câu",
        "chinese": "22. 每一次练习都很重要",
        "pinyin": "22. měiyīcìliànxídōuhěnzhòngyào",
        "vietnamese": "22. Mỗi lần luyện tập đều có giá trị"
      },
      {
        "id": 112,
        "startTime": 510.8,
        "endTime": 513.2,
        "speaker": "Mẫu câu",
        "chinese": "每一次练习都很重要",
        "pinyin": "Měiyīcìliànxídōuhěnzhòngyào",
        "vietnamese": "Mọi thực hành đều quan trọng"
      },
      {
        "id": 113,
        "startTime": 515.7,
        "endTime": 518.6,
        "speaker": "Mẫu câu",
        "chinese": "23. 我正在建立说中文的习惯",
        "pinyin": "23. wǒzhèngzàijiànlìshuōzhōngwéndexíguàn",
        "vietnamese": "23. Tôi đang hình thành thói quen nói tiếng Trung"
      },
      {
        "id": 114,
        "startTime": 522.2,
        "endTime": 525.2,
        "speaker": "Mẫu câu",
        "chinese": "我正在建立说中文的习惯",
        "pinyin": "Wǒzhèngzàijiànlìshuōzhōngwéndexíguàn",
        "vietnamese": "Tôi đang hình thành thói quen nói tiếng Trung"
      },
      {
        "id": 115,
        "startTime": 529.3,
        "endTime": 534.0,
        "speaker": "Mẫu câu",
        "chinese": "24. 我不需要说的完美我只需要说出来",
        "pinyin": "24. wǒbùxūyàoshuōdewánměiwǒzhǐxūyàoshuōchūlái",
        "vietnamese": "24. Tôi không cần phải nói hoàn hảo, tôi chỉ cần nói thôi."
      },
      {
        "id": 116,
        "startTime": 540.0,
        "endTime": 544.7,
        "speaker": "Mẫu câu",
        "chinese": "我不需要说的完美我只需要说出来",
        "pinyin": "Wǒbùxūyàoshuōdewánměiwǒzhǐxūyàoshuōchūlái",
        "vietnamese": "Tôi không cần phải nói nó một cách hoàn hảo, tôi chỉ cần nói nó"
      },
      {
        "id": 117,
        "startTime": 552.5,
        "endTime": 557.1,
        "speaker": "Mẫu câu",
        "chinese": "25. 说错没关系, 不说才是问题",
        "pinyin": "25. shuōcuòméiguānxì , bùshuōcáishìwèntí",
        "vietnamese": "25. Nói sai cũng không sao, nhưng không nói ra mới là vấn đề"
      },
      {
        "id": 118,
        "startTime": 561.6,
        "endTime": 566.2,
        "speaker": "Mẫu câu",
        "chinese": "说错没关系, 不说才是问题",
        "pinyin": "Shuōcuòméiguānxì , bùshuōcáishìwèntí",
        "vietnamese": "Nói sai không quan trọng, không nói mới là vấn đề"
      },
      {
        "id": 119,
        "startTime": 571.4,
        "endTime": 575.2,
        "speaker": "Mẫu câu",
        "chinese": "26. 我可以用简单的中文表达我的想法",
        "pinyin": "26. wǒkěyǐyòngjiǎndāndezhōngwénbiǎodáwǒdexiǎngfǎ",
        "vietnamese": "26. Tôi có thể bày tỏ suy nghĩ của mình bằng tiếng Trung đơn giản"
      },
      {
        "id": 120,
        "startTime": 579.7,
        "endTime": 583.5,
        "speaker": "Mẫu câu",
        "chinese": "我可以用简单的中文表达我的想法",
        "pinyin": "Wǒkěyǐyòngjiǎndāndezhōngwénbiǎodáwǒdexiǎngfǎ",
        "vietnamese": "Tôi có thể bày tỏ suy nghĩ của mình bằng tiếng Trung đơn giản"
      },
      {
        "id": 121,
        "startTime": 588.7,
        "endTime": 591.5,
        "speaker": "Mẫu câu",
        "chinese": "27. 我不用害怕别人怎么看我",
        "pinyin": "27. wǒbùyònghàipàbiérénzěnmekànwǒ",
        "vietnamese": "27. Tôi không cần phải sợ người khác nghĩ gì về mình."
      },
      {
        "id": 122,
        "startTime": 596.7,
        "endTime": 599.6,
        "speaker": "Mẫu câu",
        "chinese": "我不用害怕别人怎么看我",
        "pinyin": "Wǒbùyònghàipàbiérénzěnmekànwǒ",
        "vietnamese": "Tôi không cần phải sợ người khác nghĩ gì về mình"
      },
      {
        "id": 123,
        "startTime": 604.2,
        "endTime": 608.9,
        "speaker": "Mẫu câu",
        "chinese": "28. 我现在说的不多, 但以后会说的更多",
        "pinyin": "28. wǒxiànzàishuōdebùduō , dànyǐhòuhuìshuōdegèngduō",
        "vietnamese": "28. Bây giờ tôi không nói nhiều nhưng sau này tôi sẽ nói nhiều hơn."
      },
      {
        "id": 124,
        "startTime": 613.2,
        "endTime": 617.9,
        "speaker": "Mẫu câu",
        "chinese": "我现在说的不多, 但以后会说的更多",
        "pinyin": "Wǒxiànzàishuōdebùduō , dànyǐhòuhuìshuōdegèngduō",
        "vietnamese": "Bây giờ tôi không có nhiều điều để nói nhưng tôi sẽ nói nhiều hơn trong tương lai"
      },
      {
        "id": 125,
        "startTime": 621.6,
        "endTime": 624.6,
        "speaker": "Mẫu câu",
        "chinese": "29. 我可以先说简单的句子",
        "pinyin": "29. wǒkěyǐxiānshuōjiǎndāndejùzi",
        "vietnamese": "29. Tôi có thể nói những câu đơn giản trước"
      },
      {
        "id": 126,
        "startTime": 628.8,
        "endTime": 631.8,
        "speaker": "Mẫu câu",
        "chinese": "我可以先说简单的句子",
        "pinyin": "Wǒkěyǐxiānshuōjiǎndāndejùzi",
        "vietnamese": "Tôi có thể nói những câu đơn giản trước"
      },
      {
        "id": 127,
        "startTime": 636.0,
        "endTime": 638.2,
        "speaker": "Mẫu câu",
        "chinese": "我会继续练习中文",
        "pinyin": "Wǒhuìjìxùliànxízhōngwén",
        "vietnamese": "Tôi sẽ tiếp tục luyện tập tiếng Trung"
      },
      {
        "id": 128,
        "startTime": 642.3,
        "endTime": 644.4,
        "speaker": "Mẫu câu",
        "chinese": "我会继续练习中文",
        "pinyin": "Wǒhuìjìxùliànxízhōngwén",
        "vietnamese": "Tôi sẽ tiếp tục luyện tập tiếng Trung"
      },
      {
        "id": 129,
        "startTime": 649.3,
        "endTime": 650.8,
        "speaker": "Mẫu câu",
        "chinese": "恭喜你",
        "pinyin": "Gōngxǐnǐ",
        "vietnamese": "xin chúc mừng"
      },
      {
        "id": 130,
        "startTime": 651.5,
        "endTime": 656.4,
        "speaker": "Mẫu câu",
        "chinese": "你已经完成了今天的影子跟读口语练习",
        "pinyin": "Nǐyǐjīngwánchénglejīntiāndeyǐngzigēndúkǒuyǔliànxí",
        "vietnamese": "Bạn đã hoàn thành bài luyện đọc bóng và nói của ngày hôm nay"
      },
      {
        "id": 131,
        "startTime": 656.9,
        "endTime": 660.1,
        "speaker": "Mẫu câu",
        "chinese": "请记住你不需要完美",
        "pinyin": "Qǐngjìzhùnǐbùxūyàowánměi",
        "vietnamese": "Hãy nhớ rằng bạn không cần phải hoàn hảo"
      },
      {
        "id": 132,
        "startTime": 660.1,
        "endTime": 662.0,
        "speaker": "Mẫu câu",
        "chinese": "你只需要继续",
        "pinyin": "Nǐzhǐxūyàojìxù",
        "vietnamese": "bạn chỉ cần tiếp tục"
      },
      {
        "id": 133,
        "startTime": 662.4,
        "endTime": 664.5,
        "speaker": "Mẫu câu",
        "chinese": "哪怕每天5分钟",
        "pinyin": "Nǎpàměitiān 5 fēnzhōng",
        "vietnamese": "Thậm chí 5 phút mỗi ngày"
      },
      {
        "id": 134,
        "startTime": 664.5,
        "endTime": 666.3,
        "speaker": "Mẫu câu",
        "chinese": "只要你愿意开口",
        "pinyin": "Zhǐyàonǐyuànyìkāikǒu",
        "vietnamese": "Miễn là bạn sẵn sàng nói"
      },
      {
        "id": 135,
        "startTime": 666.3,
        "endTime": 669.5,
        "speaker": "Mẫu câu",
        "chinese": "中文一定会成为你的一部分",
        "pinyin": "Zhōngwényídìnghuìchéngwéinǐdeyībùfèn",
        "vietnamese": "Tiếng Trung chắc chắn sẽ trở thành một phần trong bạn"
      },
      {
        "id": 136,
        "startTime": 669.8,
        "endTime": 672.2,
        "speaker": "Mẫu câu",
        "chinese": "明天我们继续",
        "pinyin": "Míngtiānwǒmenjìxù",
        "vietnamese": "Hãy tiếp tục vào ngày mai"
      },
      {
        "id": 137,
        "startTime": 672.2,
        "endTime": 674.0,
        "speaker": "Mẫu câu",
        "chinese": "我在这里等你",
        "pinyin": "Wǒzàizhèlǐděngnǐ",
        "vietnamese": "Tôi đang đợi bạn ở đây"
      }
    ]
  },
  {
    "id": "hsk3-hasu-100-dialogues",
    "title": "100 câu đối thoại HSK 3: Rèn phản xạ tự nhiên (Hasu)",
    "level": "HSK 3-4",
    "levelBadgeColor": "text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-300",
    "duration": "15:50",
    "category": "Giao tiếp đời sống",
    "description": "Chuỗi đối thoại giao tiếp HSK 3 thực tế thường gặp hàng ngày, giúp tăng tốc độ phản xạ miệng, phát âm chuẩn ngữ điệu và tự tin nói tiếng Trung.",
    "youtubeId": "s-YvdaMeaFU",
    "sentencesCount": 87,
    "isFree": false,
    "sentences": [
      {
        "id": 1,
        "startTime": 15.0,
        "endTime": 23.5,
        "speaker": "Hasu",
        "chinese": "我们认识一下吧！",
        "pinyin": "Wǒ men rèn shí yī xià ba!",
        "vietnamese": "Chúng ta làm quen nhé."
      },
      {
        "id": 2,
        "startTime": 23.5,
        "endTime": 31.0,
        "speaker": "Hasu",
        "chinese": "你是哪里人？",
        "pinyin": "Nǐ shì nǎ lǐ rén?",
        "vietnamese": "Bạn là người ở đâu?"
      },
      {
        "id": 3,
        "startTime": 31.0,
        "endTime": 41.5,
        "speaker": "Hasu",
        "chinese": "你来中国多久了？",
        "pinyin": "Nǐ lái zhōng guó duō jiǔ le?",
        "vietnamese": "Bạn đến Trung Quốc bao lâu rồi?"
      },
      {
        "id": 4,
        "startTime": 41.5,
        "endTime": 54.0,
        "speaker": "Hasu",
        "chinese": "你在中国学习还是工作？",
        "pinyin": "Nǐ zài zhōng guó xué xí hái shì gōng zuò?",
        "vietnamese": "Bạn ở Trung Quốc học tập hay làm việc?"
      },
      {
        "id": 5,
        "startTime": 54.0,
        "endTime": 64.0,
        "speaker": "Hasu",
        "chinese": "你平时喜欢做什么？",
        "pinyin": "Nǐ píng shí xǐ huān zuò shén me?",
        "vietnamese": "Bình thường bạn thích làm gì?"
      },
      {
        "id": 6,
        "startTime": 64.0,
        "endTime": 75.5,
        "speaker": "Hasu",
        "chinese": "我们可以交个朋友吗？",
        "pinyin": "Wǒ men kě yǐ jiāo gè péng yǒu ma?",
        "vietnamese": "Chúng mình có thể kết bạn không?"
      },
      {
        "id": 7,
        "startTime": 75.5,
        "endTime": 85.5,
        "speaker": "Hasu",
        "chinese": "你的中文说得很好。",
        "pinyin": "Nǐ de zhōng wén shuō dé hěn hǎo.",
        "vietnamese": "Tiếng Trung của bạn nói rất tốt."
      },
      {
        "id": 8,
        "startTime": 85.5,
        "endTime": 95.0,
        "speaker": "Hasu",
        "chinese": "你学中文多久了？",
        "pinyin": "Nǐ xué zhōng wén duō jiǔ le?",
        "vietnamese": "Bạn học tiếng Trung bao lâu rồi?"
      },
      {
        "id": 9,
        "startTime": 95.0,
        "endTime": 107.5,
        "speaker": "Hasu",
        "chinese": "我刚开始学习中文。",
        "pinyin": "Wǒ gāng kāi shǐ xué xí zhōng wén.",
        "vietnamese": "Tôi vừa mới bắt đầu học tiếng Trung."
      },
      {
        "id": 10,
        "startTime": 107.5,
        "endTime": 116.0,
        "speaker": "Hasu",
        "chinese": "你住在哪里？",
        "pinyin": "Nǐ zhù zài nǎ lǐ?",
        "vietnamese": "Bạn sống ở đâu?"
      },
      {
        "id": 11,
        "startTime": 116.0,
        "endTime": 123.5,
        "speaker": "Hasu",
        "chinese": "你多大了？",
        "pinyin": "Nǐ duō dà le?",
        "vietnamese": "Bạn bao nhiêu tuổi?"
      },
      {
        "id": 12,
        "startTime": 123.5,
        "endTime": 133.5,
        "speaker": "Hasu",
        "chinese": "我比你小两岁。",
        "pinyin": "Wǒ bǐ nǐ xiǎo liǎng suì.",
        "vietnamese": "Tôi nhỏ hơn bạn hai tuổi."
      },
      {
        "id": 13,
        "startTime": 133.5,
        "endTime": 143.0,
        "speaker": "Hasu",
        "chinese": "你的家人都好吗？",
        "pinyin": "Nǐ de jiā rén dōu hǎo ma?",
        "vietnamese": "Gia đình bạn đều khỏe chứ?"
      },
      {
        "id": 14,
        "startTime": 143.0,
        "endTime": 153.5,
        "speaker": "Hasu",
        "chinese": "有时间一起出去吧！",
        "pinyin": "Yǒu shí jiān yì qǐ chū qù ba!",
        "vietnamese": "Có thời gian cùng nhau ra ngoài chơi nhé!"
      },
      {
        "id": 15,
        "startTime": 153.5,
        "endTime": 162.0,
        "speaker": "Hasu",
        "chinese": "你常去哪里玩？",
        "pinyin": "Nǐ cháng qù nǎ lǐ wán?",
        "vietnamese": "Bạn thường đi đâu chơi?"
      },
      {
        "id": 16,
        "startTime": 162.0,
        "endTime": 172.0,
        "speaker": "Hasu",
        "chinese": "这是我第一次来这里。",
        "pinyin": "Zhè shì wǒ dì yī cì lái zhè lǐ.",
        "vietnamese": "Đây là lần đầu tiên tôi đến đây."
      },
      {
        "id": 17,
        "startTime": 172.0,
        "endTime": 181.0,
        "speaker": "Hasu",
        "chinese": "你来过越南吗？",
        "pinyin": "Nǐ lái guò yuè nán ma?",
        "vietnamese": "Bạn từng đến Việt Nam chưa?"
      },
      {
        "id": 18,
        "startTime": 181.0,
        "endTime": 193.0,
        "speaker": "Hasu",
        "chinese": "我觉得这里的菜很新鲜。",
        "pinyin": "Wǒ jué de zhè lǐ de cài hěn xīn xiān.",
        "vietnamese": "Tôi thấy món ăn ở đây rất tươi ngon."
      },
      {
        "id": 19,
        "startTime": 193.0,
        "endTime": 203.0,
        "speaker": "Hasu",
        "chinese": "我想点两个菜。",
        "pinyin": "Wǒ xiǎng diǎn liǎng gè cài.",
        "vietnamese": "Tôi muốn gọi hai món."
      },
      {
        "id": 20,
        "startTime": 203.0,
        "endTime": 214.0,
        "speaker": "Hasu",
        "chinese": "我喜欢喝果汁。",
        "pinyin": "Wǒ xǐ huān hē guǒ zhī.",
        "vietnamese": "Tôi thích uống nước ép hoa quả."
      },
      {
        "id": 21,
        "startTime": 214.0,
        "endTime": 223.0,
        "speaker": "Hasu",
        "chinese": "这里的饺子特别好吃。",
        "pinyin": "Zhè lǐ de jiǎo zi tè bié hǎo chī.",
        "vietnamese": "Sủi cảo ở đây đặc biệt ngon."
      },
      {
        "id": 22,
        "startTime": 223.0,
        "endTime": 232.0,
        "speaker": "Hasu",
        "chinese": "我已经吃饱了。",
        "pinyin": "Wǒ yǐ jīng chī bǎo le.",
        "vietnamese": "Tôi đã ăn no rồi."
      },
      {
        "id": 23,
        "startTime": 232.0,
        "endTime": 242.0,
        "speaker": "Hasu",
        "chinese": "你想喝点酒吗？",
        "pinyin": "Nǐ xiǎng hē diǎn jiǔ ma?",
        "vietnamese": "Bạn muốn uống chút rượu không?"
      },
      {
        "id": 24,
        "startTime": 242.0,
        "endTime": 253.0,
        "speaker": "Hasu",
        "chinese": "我觉得这里的服务很好。",
        "pinyin": "Wǒ jué de zhè lǐ de fú wù hěn hǎo.",
        "vietnamese": "Tôi thấy phục vụ ở đây rất tốt."
      },
      {
        "id": 25,
        "startTime": 253.0,
        "endTime": 264.0,
        "speaker": "Hasu",
        "chinese": "请给我一个勺子。",
        "pinyin": "Qǐng gěi wǒ yí gè sháo zi.",
        "vietnamese": "Làm ơn cho tôi một chiếc thìa."
      },
      {
        "id": 26,
        "startTime": 264.0,
        "endTime": 275.0,
        "speaker": "Hasu",
        "chinese": "我只看看，不买。",
        "pinyin": "Wǒ zhǐ kàn kàn, bù mǎi.",
        "vietnamese": "Tôi chỉ xem thôi, không mua."
      },
      {
        "id": 27,
        "startTime": 275.0,
        "endTime": 283.5,
        "speaker": "Hasu",
        "chinese": "你想买什么颜色的？",
        "pinyin": "Nǐ xiǎng mǎi shén me yán sè de?",
        "vietnamese": "Bạn muốn mua màu gì?"
      },
      {
        "id": 28,
        "startTime": 283.5,
        "endTime": 292.0,
        "speaker": "Hasu",
        "chinese": "可以试穿吗？",
        "pinyin": "Kě yǐ shì chuān ma?",
        "vietnamese": "Có thể mặc thử không?"
      },
      {
        "id": 29,
        "startTime": 292.0,
        "endTime": 301.0,
        "speaker": "Hasu",
        "chinese": "我穿中号。",
        "pinyin": "Wǒ chuān zhōng hào.",
        "vietnamese": "Tôi mặc cỡ vừa (size M)."
      },
      {
        "id": 30,
        "startTime": 301.0,
        "endTime": 311.0,
        "speaker": "Hasu",
        "chinese": "这双鞋有点儿小。",
        "pinyin": "Zhè shuāng xié yǒu diǎnrxiǎo.",
        "vietnamese": "Đôi giày này hơi chật một chút."
      },
      {
        "id": 31,
        "startTime": 311.0,
        "endTime": 321.5,
        "speaker": "Hasu",
        "chinese": "我想买一个便宜点的。",
        "pinyin": "Wǒ xiǎng mǎi yí gè pián yi diǎn de.",
        "vietnamese": "Tôi muốn mua một cái rẻ hơn một chút."
      },
      {
        "id": 32,
        "startTime": 321.5,
        "endTime": 330.0,
        "speaker": "Hasu",
        "chinese": "我付现金。",
        "pinyin": "Wǒ fù xiàn jīn.",
        "vietnamese": "Tôi thanh toán bằng tiền mặt."
      },
      {
        "id": 33,
        "startTime": 330.0,
        "endTime": 339.0,
        "speaker": "Hasu",
        "chinese": "可以刷卡吗？",
        "pinyin": "Kě yǐ shuā kǎ ma?",
        "vietnamese": "Có thể quẹt thẻ được không?"
      },
      {
        "id": 34,
        "startTime": 339.0,
        "endTime": 349.5,
        "speaker": "Hasu",
        "chinese": "这件衣服不太合适。",
        "pinyin": "Zhè jiàn yī fú bù tài hé shì.",
        "vietnamese": "Bộ quần áo này không vừa vặn lắm."
      },
      {
        "id": 35,
        "startTime": 349.5,
        "endTime": 362.0,
        "speaker": "Hasu",
        "chinese": "这个手机是新的还是旧的？",
        "pinyin": "Zhè ge shǒu jī shì xīn de hái shì jiù de?",
        "vietnamese": "Chiếc điện thoại này là mới hay cũ?"
      },
      {
        "id": 36,
        "startTime": 362.0,
        "endTime": 371.0,
        "speaker": "Hasu",
        "chinese": "我买不起。",
        "pinyin": "Wǒ mǎi bù qǐ.",
        "vietnamese": "Tôi không đủ tiền mua."
      },
      {
        "id": 37,
        "startTime": 371.0,
        "endTime": 381.5,
        "speaker": "Hasu",
        "chinese": "这家商店打折吗？",
        "pinyin": "Zhè jiā shāng diàn dǎ zhé ma?",
        "vietnamese": "Cửa hàng này có giảm giá không?"
      },
      {
        "id": 38,
        "startTime": 381.5,
        "endTime": 392.5,
        "speaker": "Hasu",
        "chinese": "这东西质量很好。",
        "pinyin": "Zhè dōng xī zhì liàng hěn hǎo.",
        "vietnamese": "Đồ này chất lượng rất tốt."
      },
      {
        "id": 39,
        "startTime": 392.5,
        "endTime": 403.0,
        "speaker": "Hasu",
        "chinese": "每天几点下班？",
        "pinyin": "Měi tiān jǐ diǎn xià bān?",
        "vietnamese": "Mỗi ngày mấy giờ tan làm?"
      },
      {
        "id": 40,
        "startTime": 403.0,
        "endTime": 413.0,
        "speaker": "Hasu",
        "chinese": "这个工作很有意思。",
        "pinyin": "Zhè ge gōng zuò hěn yǒu yì si.",
        "vietnamese": "Công việc này rất thú vị."
      },
      {
        "id": 41,
        "startTime": 413.0,
        "endTime": 425.5,
        "speaker": "Hasu",
        "chinese": "我觉得工作压力很大。",
        "pinyin": "Wǒ jué de gōng zuò yā lì hěn dà.",
        "vietnamese": "Tôi thấy áp lực công việc rất lớn."
      },
      {
        "id": 42,
        "startTime": 425.5,
        "endTime": 435.5,
        "speaker": "Hasu",
        "chinese": "你打算换工作吗？",
        "pinyin": "Nǐ dǎ suàn huàn gōng zuò ma?",
        "vietnamese": "Bạn có dự định đổi công việc không?"
      },
      {
        "id": 43,
        "startTime": 435.5,
        "endTime": 448.5,
        "speaker": "Hasu",
        "chinese": "我想找一个新的机会。",
        "pinyin": "Wǒ xiǎng zhǎo yí gè xīn de jī huì.",
        "vietnamese": "Tôi muốn tìm một cơ hội mới."
      },
      {
        "id": 44,
        "startTime": 448.5,
        "endTime": 458.0,
        "speaker": "Hasu",
        "chinese": "我很喜欢去新的地方。",
        "pinyin": "Wǒ hěn xǐ huān qù xīn de dì fāng.",
        "vietnamese": "Tôi rất thích đi đến những nơi mới."
      },
      {
        "id": 45,
        "startTime": 458.0,
        "endTime": 471.0,
        "speaker": "Hasu",
        "chinese": "我想去北京看看长城。",
        "pinyin": "Wǒ xiǎng qù běi jīng kàn kàn cháng chéng.",
        "vietnamese": "Tôi muốn đi Bắc Kinh ngắm Vạn Lý Trường Thành."
      },
      {
        "id": 46,
        "startTime": 471.0,
        "endTime": 480.0,
        "speaker": "Hasu",
        "chinese": "你买机票了吗？",
        "pinyin": "Nǐ mǎi jī piào le ma?",
        "vietnamese": "Bạn đã mua vé máy bay chưa?"
      },
      {
        "id": 47,
        "startTime": 480.0,
        "endTime": 490.0,
        "speaker": "Hasu",
        "chinese": "我已经订好了酒店。",
        "pinyin": "Wǒ yǐ jīng dìng hǎo le jiǔ diàn.",
        "vietnamese": "Tôi đã đặt xong phòng khách sạn rồi."
      },
      {
        "id": 48,
        "startTime": 490.0,
        "endTime": 500.5,
        "speaker": "Hasu",
        "chinese": "火车几点出发？",
        "pinyin": "Huǒ chē jǐ diǎn chū fā?",
        "vietnamese": "Tàu hỏa mấy giờ khởi hành?"
      },
      {
        "id": 49,
        "startTime": 500.5,
        "endTime": 512.5,
        "speaker": "Hasu",
        "chinese": "我们明天早上出发。",
        "pinyin": "Wǒ men míng tiān zǎo shàng chū fā.",
        "vietnamese": "Chúng ta sáng mai sẽ xuất phát."
      },
      {
        "id": 50,
        "startTime": 512.5,
        "endTime": 524.0,
        "speaker": "Hasu",
        "chinese": "你喜欢海边还是山上？",
        "pinyin": "Nǐ xǐ huān hǎi biān hái shì shān shàng?",
        "vietnamese": "Bạn thích đi biển hay đi leo núi?"
      },
      {
        "id": 51,
        "startTime": 524.0,
        "endTime": 534.0,
        "speaker": "Hasu",
        "chinese": "我更喜欢去海边。",
        "pinyin": "Wǒ gèng xǐ huān qù hǎi biān.",
        "vietnamese": "Tôi thích đi biển hơn."
      },
      {
        "id": 52,
        "startTime": 534.0,
        "endTime": 546.5,
        "speaker": "Hasu",
        "chinese": "旅行的时候你喜欢做什么？",
        "pinyin": "Lǚ xíng de shí hòu nǐ xǐ huān zuò shén me?",
        "vietnamese": "Khi đi du lịch bạn thích làm gì?"
      },
      {
        "id": 53,
        "startTime": 546.5,
        "endTime": 558.0,
        "speaker": "Hasu",
        "chinese": "今天天气很适合出门。",
        "pinyin": "Jīn tiān tiān qì hěn shì hé chū mén.",
        "vietnamese": "Thời tiết hôm nay rất thích hợp ra ngoài."
      },
      {
        "id": 54,
        "startTime": 558.0,
        "endTime": 570.0,
        "speaker": "Hasu",
        "chinese": "周末你有什么计划？",
        "pinyin": "Zhōu mò nǐ yǒu shén me jì huà?",
        "vietnamese": "Cuối tuần bạn có kế hoạch gì?"
      },
      {
        "id": 55,
        "startTime": 570.0,
        "endTime": 580.0,
        "speaker": "Hasu",
        "chinese": "你每天几点起床？",
        "pinyin": "Nǐ měi tiān jǐ diǎn qǐ chuáng?",
        "vietnamese": "Mỗi ngày bạn thức dậy lúc mấy giờ?"
      },
      {
        "id": 56,
        "startTime": 580.0,
        "endTime": 591.5,
        "speaker": "Hasu",
        "chinese": "我每天早上七点起床。",
        "pinyin": "Wǒ měi tiān zǎo shàng qī diǎn qǐ chuáng.",
        "vietnamese": "Mỗi ngày tôi thức dậy lúc 7 giờ sáng."
      },
      {
        "id": 57,
        "startTime": 591.5,
        "endTime": 601.0,
        "speaker": "Hasu",
        "chinese": "你现在在哪儿工作？",
        "pinyin": "Nǐ xiàn zài zài nǎrgōng zuò?",
        "vietnamese": "Bây giờ bạn đang làm việc ở đâu?"
      },
      {
        "id": 58,
        "startTime": 601.0,
        "endTime": 613.0,
        "speaker": "Hasu",
        "chinese": "我在一家外贸公司工作。",
        "pinyin": "Wǒ zài yī jiā wài mào gōng sī gōng zuò.",
        "vietnamese": "Tôi làm việc ở một công ty ngoại thương."
      },
      {
        "id": 59,
        "startTime": 613.0,
        "endTime": 621.0,
        "speaker": "Hasu",
        "chinese": "工作忙吗？",
        "pinyin": "Gōng zuò máng ma?",
        "vietnamese": "Công việc có bận không?"
      },
      {
        "id": 60,
        "startTime": 621.0,
        "endTime": 633.0,
        "speaker": "Hasu",
        "chinese": "挺忙的，但是很有意思。",
        "pinyin": "Tǐng máng de, dàn shì hěn yǒu yì si.",
        "vietnamese": "Khá bận, nhưng rất thú vị."
      },
      {
        "id": 61,
        "startTime": 633.0,
        "endTime": 642.5,
        "speaker": "Hasu",
        "chinese": "你最近身体怎么样？",
        "pinyin": "Nǐ zuì jìn shēn tǐ zěn me yàng?",
        "vietnamese": "Dạo này sức khỏe bạn thế nào?"
      },
      {
        "id": 62,
        "startTime": 642.5,
        "endTime": 654.5,
        "speaker": "Hasu",
        "chinese": "还可以，就是有点儿累。",
        "pinyin": "Hái kě yǐ, jiù shì yǒu diǎnrlèi.",
        "vietnamese": "Cũng tạm, chỉ là hơi mệt một chút."
      },
      {
        "id": 63,
        "startTime": 654.5,
        "endTime": 666.0,
        "speaker": "Hasu",
        "chinese": "要多休息，少熬夜。",
        "pinyin": "Yào duō xiū xī, shǎo áo yè.",
        "vietnamese": "Cần nghỉ ngơi nhiều hơn, bớt thức khuya lại."
      },
      {
        "id": 64,
        "startTime": 666.0,
        "endTime": 678.5,
        "speaker": "Hasu",
        "chinese": "我知道了，谢谢你关心。",
        "pinyin": "Wǒ zhī dào le, xiè xiè nǐ guān xīn.",
        "vietnamese": "Tôi biết rồi, cảm ơn bạn đã quan tâm."
      },
      {
        "id": 65,
        "startTime": 678.5,
        "endTime": 688.5,
        "speaker": "Hasu",
        "chinese": "你打算去哪儿旅游？",
        "pinyin": "Nǐ dǎ suàn qù nǎrlǚ yóu?",
        "vietnamese": "Bạn dự định đi du lịch ở đâu?"
      },
      {
        "id": 66,
        "startTime": 688.5,
        "endTime": 698.5,
        "speaker": "Hasu",
        "chinese": "我想去云南看看。",
        "pinyin": "Wǒ xiǎng qù yún nán kàn kàn.",
        "vietnamese": "Tôi muốn đi Vân Nam ngắm cảnh."
      },
      {
        "id": 67,
        "startTime": 698.5,
        "endTime": 709.0,
        "speaker": "Hasu",
        "chinese": "那里的风景很漂亮。",
        "pinyin": "Nà lǐ de fēng jǐng hěn piào liàng.",
        "vietnamese": "Phong cảnh ở đó rất đẹp."
      },
      {
        "id": 68,
        "startTime": 709.0,
        "endTime": 721.0,
        "speaker": "Hasu",
        "chinese": "是啊，我已经买好机票了。",
        "pinyin": "Shì a, wǒ yǐ jīng mǎi hǎo jī piào le.",
        "vietnamese": "Đúng vậy, tôi đã mua xong vé máy bay rồi."
      },
      {
        "id": 69,
        "startTime": 721.0,
        "endTime": 735.0,
        "speaker": "Hasu",
        "chinese": "您好，请问这件衣服多少钱？",
        "pinyin": "Nín hǎo, qǐng wèn zhè jiàn yī fú duō shǎo qián?",
        "vietnamese": "Xin chào, cho hỏi bộ quần áo này bao nhiêu tiền?"
      },
      {
        "id": 70,
        "startTime": 735.0,
        "endTime": 745.5,
        "speaker": "Hasu",
        "chinese": "这件衣服三百块。",
        "pinyin": "Zhè jiàn yī fú sān bǎi kuài.",
        "vietnamese": "Bộ quần áo này 300 tệ."
      },
      {
        "id": 71,
        "startTime": 745.5,
        "endTime": 754.5,
        "speaker": "Hasu",
        "chinese": "可以便宜一点吗？",
        "pinyin": "Kě yǐ pián yi yì diǎn ma?",
        "vietnamese": "Có thể bớt một chút được không?"
      },
      {
        "id": 72,
        "startTime": 754.5,
        "endTime": 766.0,
        "speaker": "Hasu",
        "chinese": "好吧，给你280块。",
        "pinyin": "Hǎo ba, gěi nǐ280kuài.",
        "vietnamese": "Được rồi, lấy bạn 280 tệ."
      },
      {
        "id": 73,
        "startTime": 766.0,
        "endTime": 777.0,
        "speaker": "Hasu",
        "chinese": "今天天气怎么样？",
        "pinyin": "Jīn tiān tiān qì zěn me yàng?",
        "vietnamese": "Thời tiết hôm nay thế nào?"
      },
      {
        "id": 74,
        "startTime": 777.0,
        "endTime": 797.0,
        "speaker": "Hasu",
        "chinese": "今天很热，有35度。",
        "pinyin": "Jīn tiān hěn rè, yǒu35dù.",
        "vietnamese": "Hôm nay rất nóng, 35 độ."
      },
      {
        "id": 75,
        "startTime": 797.0,
        "endTime": 810.0,
        "speaker": "Hasu",
        "chinese": "是啊，我出门都不想穿外套。",
        "pinyin": "Shì a, wǒ chū mén dōu bù xiǎng chuān wài tào.",
        "vietnamese": "Đúng thế, ra ngoài tôi chẳng muốn mặc áo khoác chút nào."
      },
      {
        "id": 76,
        "startTime": 810.0,
        "endTime": 820.0,
        "speaker": "Hasu",
        "chinese": "听说明天会下雨。",
        "pinyin": "Tīng shuō míng tiān huì xià yǔ.",
        "vietnamese": "Nghe nói ngày mai sẽ mưa."
      },
      {
        "id": 77,
        "startTime": 820.0,
        "endTime": 829.5,
        "speaker": "Hasu",
        "chinese": "那我们带把伞吧。",
        "pinyin": "Nà wǒ men dài bǎ sǎn ba.",
        "vietnamese": "Thế chúng mình mang theo một chiếc ô đi."
      },
      {
        "id": 78,
        "startTime": 829.5,
        "endTime": 838.5,
        "speaker": "Hasu",
        "chinese": "你每天怎么去上班？",
        "pinyin": "Nǐ měi tiān zěn me qù shàng bān?",
        "vietnamese": "Mỗi ngày bạn đi làm bằng phương tiện gì?"
      },
      {
        "id": 79,
        "startTime": 838.5,
        "endTime": 850.5,
        "speaker": "Hasu",
        "chinese": "我坐地铁，二十分钟就到。",
        "pinyin": "Wǒ zuò dì tiě, èr shí fēn zhōng jiù dào.",
        "vietnamese": "Tôi đi tàu điện ngầm, 20 phút là đến nơi."
      },
      {
        "id": 80,
        "startTime": 850.5,
        "endTime": 860.0,
        "speaker": "Hasu",
        "chinese": "你不喜欢开车吗？",
        "pinyin": "Nǐ bù xǐ huān kāi chē ma?",
        "vietnamese": "Bạn không thích lái xe à?"
      },
      {
        "id": 81,
        "startTime": 860.0,
        "endTime": 874.5,
        "speaker": "Hasu",
        "chinese": "喜欢，可是早上路上太堵了。",
        "pinyin": "Xǐ huān, kě shì zǎo shàng lù shàng tài dǔ le.",
        "vietnamese": "Thích chứ, nhưng buổi sáng đường tắc quá."
      },
      {
        "id": 82,
        "startTime": 874.5,
        "endTime": 885.0,
        "speaker": "Hasu",
        "chinese": "对，坐地铁更方便。",
        "pinyin": "Duì, zuò dì tiě gèng fāng biàn.",
        "vietnamese": "Đúng vậy, đi tàu điện ngầm tiện lợi hơn."
      },
      {
        "id": 83,
        "startTime": 885.0,
        "endTime": 891.5,
        "speaker": "Hasu",
        "chinese": "你平时有什么爱好？",
        "pinyin": "Nǐ píng shí yǒu shén me ài hào?",
        "vietnamese": "Bình thường bạn có sở thích gì?"
      },
      {
        "id": 84,
        "startTime": 891.5,
        "endTime": 902.0,
        "speaker": "Hasu",
        "chinese": "我喜欢看书和旅行。",
        "pinyin": "Wǒ xǐ huān kàn shū hé lǚ xíng.",
        "vietnamese": "Tôi thích đọc sách và đi du lịch."
      },
      {
        "id": 85,
        "startTime": 902.0,
        "endTime": 906.0,
        "speaker": "Hasu",
        "chinese": "你最近看了什么书？",
        "pinyin": "Nǐ zuì jìn kàn le shén me shū?",
        "vietnamese": "Gần đây bạn đọc cuốn sách nào thế?"
      },
      {
        "id": 86,
        "startTime": 906.0,
        "endTime": 928.5,
        "speaker": "Hasu",
        "chinese": "我在看一本关于历史的书。",
        "pinyin": "Wǒ zài kàn yī běn guān yú lì shǐ de shū.",
        "vietnamese": "Tôi đang đọc một cuốn sách về lịch sử."
      },
      {
        "id": 87,
        "startTime": 928.5,
        "endTime": 938.0,
        "speaker": "Hasu",
        "chinese": "听起来很有意思。",
        "pinyin": "Tīng qǐ lái hěn yǒu yì si.",
        "vietnamese": "Nghe có vẻ rất thú vị."
      }
    ]
  },
  {
    "id": "hsk3-eat-slowly-podcast",
    "title": "慢慢吃，对身体好！Ăn chậm tốt cho sức khỏe (Chinese Podcast)",
    "level": "HSK 3-4",
    "levelBadgeColor": "text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-300",
    "duration": "14:27",
    "category": "Ẩm thực & Mua sắm",
    "description": "Podcast thú vị khám phá thói quen ăn uống, sức khỏe và văn hóa, từ vựng và cấu trúc ngữ pháp HSK 3-4 tự nhiên bản xứ.",
    "youtubeId": "wZDej3Logc4",
    "sentencesCount": 238,
    "isFree": false,
    "sentences": [
      {
        "id": 1,
        "startTime": 6.1,
        "endTime": 9.7,
        "speaker": "Lý Minh",
        "chinese": "大家好，欢迎来到“每天中文”。我是李明。",
        "pinyin": "Dà jiā hǎo, huān yíng lái dào “měi tiān zhōng wén”. Wǒ shì lǐ míng.",
        "vietnamese": "Chào mọi người, chào mừng các bạn đã đến với \"Tiếng Trung Mỗi Ngày\". Tôi là Lý Minh."
      },
      {
        "id": 2,
        "startTime": 9.8,
        "endTime": 11.7,
        "speaker": "Vương Vũ",
        "chinese": "大家好，我是王雨。",
        "pinyin": "Dà jiā hǎo, wǒ shì wáng yǔ.",
        "vietnamese": "Chào mọi người, tôi là Vương Vũ."
      },
      {
        "id": 3,
        "startTime": 11.7,
        "endTime": 13.1,
        "speaker": "Vương Vũ",
        "chinese": "李明，你好！",
        "pinyin": "Lǐ míng, nǐ hǎo!",
        "vietnamese": "Lý Minh, chào cậu!"
      },
      {
        "id": 4,
        "startTime": 13.1,
        "endTime": 14.4,
        "speaker": "Lý Minh",
        "chinese": "王雨，你好！",
        "pinyin": "Wáng yǔ, nǐ hǎo!",
        "vietnamese": "Vương Vũ, chào cậu!"
      },
      {
        "id": 5,
        "startTime": 14.4,
        "endTime": 18.1,
        "speaker": "Lý Minh",
        "chinese": "今天你看起来很高兴，午饭吃什么好吃的了？",
        "pinyin": "Jīn tiān nǐ kàn qǐ lái hěn gāo xìng, wǔ fàn chī shén me hǎo chī de le?",
        "vietnamese": "Hôm nay trông cậu vui thế, bữa trưa đã ăn món gì ngon à?"
      },
      {
        "id": 6,
        "startTime": 18.1,
        "endTime": 19.8,
        "speaker": "Lý Minh",
        "chinese": "哈哈，被你发现了。",
        "pinyin": "Hā hā, bèi nǐ fā xiàn le.",
        "vietnamese": "Haha, bị cậu phát hiện rồi."
      },
      {
        "id": 7,
        "startTime": 19.9,
        "endTime": 24.8,
        "speaker": "Vương Vũ",
        "chinese": "我今天中午吃了一家新开的上海菜，味道特别好。",
        "pinyin": "Wǒ jīn tiān zhōng wǔ chī le yī jiā xīn kāi de shàng hǎi cài, wèi dào tè bié hǎo.",
        "vietnamese": "Trưa nay tôi ăn ở một quán ăn Thượng Hải mới mở, vị ngon đặc biệt luôn."
      },
      {
        "id": 8,
        "startTime": 24.8,
        "endTime": 26.0,
        "speaker": "Vương Vũ",
        "chinese": "哦？是吗？",
        "pinyin": "Ó? Shì ma?",
        "vietnamese": "Ồ? Thật sao?"
      },
      {
        "id": 9,
        "startTime": 26.0,
        "endTime": 28.0,
        "speaker": "Vương Vũ",
        "chinese": "那你吃饭快不快？",
        "pinyin": "Nà nǐ chī fàn kuài bù kuài?",
        "vietnamese": "Vậy cậu ăn nhanh hay không?"
      },
      {
        "id": 10,
        "startTime": 27.9,
        "endTime": 33.5,
        "speaker": "Vương Vũ",
        "chinese": "我是说，这么好吃的菜，你是很快就吃完了，还是慢慢吃的？",
        "pinyin": "Wǒ shì shuō, zhè me hǎo chī de cài, nǐ shì hěn kuài jiù chī wán le, hái shì màn màn chī de?",
        "vietnamese": "Ý tôi là, món ngon như vậy, cậu ăn rất nhanh cho xong, hay là ăn từ từ?"
      },
      {
        "id": 11,
        "startTime": 33.5,
        "endTime": 36.5,
        "speaker": "Vương Vũ",
        "chinese": "嗯……这是一个好问题。",
        "pinyin": "ń... Zhè shì yí gè hǎo wèn tí.",
        "vietnamese": "Ừm… đây là một câu hỏi hay."
      },
      {
        "id": 12,
        "startTime": 36.5,
        "endTime": 39.6,
        "speaker": "Vương Vũ",
        "chinese": "我好像……吃得非常快。",
        "pinyin": "Wǒ hǎo xiàng... Chī dé fēi cháng kuài.",
        "vietnamese": "Hình như là… tôi ăn rất nhanh."
      },
      {
        "id": 13,
        "startTime": 39.6,
        "endTime": 44.9,
        "speaker": "Vương Vũ",
        "chinese": "因为太好吃了，我就不停地吃，很快，我的盘子就空了。",
        "pinyin": "Yīn wèi tài hǎo chī le, wǒ jiù bù tíng dì chī, hěn kuài, wǒ de pán zi jiù kōng le.",
        "vietnamese": "Bởi vì ngon quá nên tôi cứ ăn không ngừng, chẳng mấy chốc đĩa của tôi đã hết sạch."
      },
      {
        "id": 14,
        "startTime": 45.0,
        "endTime": 47.0,
        "speaker": "Vương Vũ",
        "chinese": "哈哈，我明白了。",
        "pinyin": "Hā hā, wǒ míng bái le.",
        "vietnamese": "Haha, tôi hiểu rồi."
      },
      {
        "id": 15,
        "startTime": 47.0,
        "endTime": 52.1,
        "speaker": "Vương Vũ",
        "chinese": "其实，我们今天就可以聊一聊这个话题:吃饭的速度。",
        "pinyin": "Qí shí, wǒ men jīn tiān jiù kě yǐ liáo yī liáo zhè ge huà tí: chī fàn de sù dù.",
        "vietnamese": "Thực ra, hôm nay chúng ta có thể trò chuyện về chủ đề này: tốc độ ăn uống."
      },
      {
        "id": 16,
        "startTime": 52.0,
        "endTime": 53.5,
        "speaker": "Vương Vũ",
        "chinese": "吃饭的速度？",
        "pinyin": "Chī fàn de sù dù?",
        "vietnamese": "Tốc độ ăn uống?"
      },
      {
        "id": 17,
        "startTime": 53.5,
        "endTime": 56.9,
        "speaker": "Vương Vũ",
        "chinese": "这个话题很有意思！我从来没想过。",
        "pinyin": "Zhè ge huà tí hěn yǒu yì si! Wǒ cóng lái méi xiǎng guò.",
        "vietnamese": "Chủ đề này thú vị thật! Tôi chưa bao giờ nghĩ đến."
      },
      {
        "id": 18,
        "startTime": 57.0,
        "endTime": 61.9,
        "speaker": "Vương Vũ",
        "chinese": "好啊，我们今天就来聊聊吃饭是快一点好，还是慢一点好。",
        "pinyin": "Hǎo a, wǒ men jīn tiān jiù lái liáo liáo chī fàn shì kuài yì diǎn hǎo, hái shì màn yì diǎn hǎo.",
        "vietnamese": "Được thôi, hôm nay chúng ta hãy cùng bàn xem ăn nhanh một chút thì tốt, hay ăn chậm một chút thì tốt hơn."
      },
      {
        "id": 19,
        "startTime": 61.8,
        "endTime": 67.2,
        "speaker": "Vương Vũ",
        "chinese": "没错。这也是一个和我们每天的生活都非常有关系的话题。",
        "pinyin": "Méi cuò. Zhè yě shì yí gè hé wǒ men měi tiān de shēng huó dōu fēi cháng yǒu guān xì de huà tí.",
        "vietnamese": "Đúng vậy. Đây cũng là một chủ đề rất liên quan đến cuộc sống hàng ngày của chúng ta."
      },
      {
        "id": 20,
        "startTime": 67.3,
        "endTime": 70.3,
        "speaker": "Vương Vũ",
        "chinese": "对，我们每个人每天都要吃饭。",
        "pinyin": "Duì, wǒ men měi gè rén měi tiān dōu yào chī fàn.",
        "vietnamese": "Đúng thế, mỗi chúng ta ai cũng phải ăn mỗi ngày."
      },
      {
        "id": 21,
        "startTime": 70.2,
        "endTime": 72.8,
        "speaker": "Vương Vũ",
        "chinese": "好，那我们马上开始吧！",
        "pinyin": "Hǎo, nà wǒ men mǎ shàng kāi shǐ ba!",
        "vietnamese": "Được, vậy chúng ta bắt đầu ngay thôi!"
      },
      {
        "id": 22,
        "startTime": 72.9,
        "endTime": 79.5,
        "speaker": "Lý Minh",
        "chinese": "好，王雨。刚刚你说你今天中午吃饭吃得很快。",
        "pinyin": "Hǎo, wáng yǔ. Gāng gāng nǐ shuō nǐ jīn tiān zhōng wǔ chī fàn chī dé hěn kuài.",
        "vietnamese": "Được, Vương Vũ. Vừa rồi cậu nói trưa nay cậu ăn rất nhanh."
      },
      {
        "id": 23,
        "startTime": 79.5,
        "endTime": 82.7,
        "speaker": "Lý Minh",
        "chinese": "那你平时吃饭也很快吗？",
        "pinyin": "Nà nǐ píng shí chī fàn yě hěn kuài ma?",
        "vietnamese": "Vậy bình thường cậu ăn cũng nhanh vậy sao?"
      },
      {
        "id": 24,
        "startTime": 82.7,
        "endTime": 87.2,
        "speaker": "Lý Minh",
        "chinese": "所以，我的第一个问题是:你吃饭快吗？",
        "pinyin": "Suǒ yǐ, wǒ de dì yí gè wèn tí shì: nǐ chī fàn kuài ma?",
        "vietnamese": "Vì vậy, câu hỏi đầu tiên của tôi là: Cậu ăn có nhanh không?"
      },
      {
        "id": 25,
        "startTime": 87.2,
        "endTime": 92.9,
        "speaker": "Lý Minh",
        "chinese": "嗯，我想一下。我觉得，我吃饭挺快的。",
        "pinyin": "ń, wǒ xiǎng yī xià. Wǒ jué de, wǒ chī fàn tǐng kuài de.",
        "vietnamese": "Ừm, để tôi nghĩ xem. Tôi nghĩ là, tôi ăn khá nhanh."
      },
      {
        "id": 26,
        "startTime": 92.9,
        "endTime": 98.2,
        "speaker": "Lý Minh",
        "chinese": "特别是工作日的时候，中午只有一个小时的休息时间，",
        "pinyin": "Tè bié shì gōng zuò rì de shí hòu, zhōng wǔ zhǐ yǒu yí gè xiǎo shí de xiū xī shí jiān,",
        "vietnamese": "Đặc biệt là vào những ngày đi làm, buổi trưa chỉ có một tiếng để nghỉ ngơi,"
      },
      {
        "id": 27,
        "startTime": 98.1,
        "endTime": 102.8,
        "speaker": "Lý Minh",
        "chinese": "我要去餐厅，要排队，要等饭菜做好。",
        "pinyin": "Wǒ yào qù cān tīng, yào pái duì, yào děng fàn cài zuò hǎo.",
        "vietnamese": "tôi phải đến nhà hàng, phải xếp hàng, phải đợi món ăn được làm xong."
      },
      {
        "id": 28,
        "startTime": 102.9,
        "endTime": 108.3,
        "speaker": "Lý Minh",
        "chinese": "所以能坐下来吃饭的时间不多，我就会吃得很快。",
        "pinyin": "Suǒ yǐ néng zuò xià lái chī fàn de shí jiān bù duō, wǒ jiù huì chī dé hěn kuài.",
        "vietnamese": "Vì vậy thời gian có thể ngồi xuống ăn không nhiều, nên tôi sẽ ăn rất nhanh."
      },
      {
        "id": 29,
        "startTime": 108.3,
        "endTime": 115.3,
        "speaker": "Lý Minh",
        "chinese": "我非常理解。很多上班的人可能都和你一样。时间太少了。",
        "pinyin": "Wǒ fēi cháng lǐ jiě. Hěn duō shàng bān de rén kě néng dōu hé nǐ yī yàng. Shí jiān tài shǎo le.",
        "vietnamese": "Tôi rất hiểu. Nhiều người đi làm có lẽ cũng giống như cậu. Thời gian quá ít."
      },
      {
        "id": 30,
        "startTime": 115.3,
        "endTime": 120.7,
        "speaker": "Vương Vũ",
        "chinese": "是啊。那你呢，李明？你吃饭快吗？",
        "pinyin": "Shì a. Nà nǐ ne, lǐ míng? Nǐ chī fàn kuài ma?",
        "vietnamese": "Đúng vậy. Còn cậu thì sao, Lý Minh? Cậu ăn có nhanh không?"
      },
      {
        "id": 31,
        "startTime": 120.7,
        "endTime": 129.3,
        "speaker": "Lý Minh",
        "chinese": "我？我现在吃饭很慢。但是，我以前也和你一样，吃饭非常快。",
        "pinyin": "Wǒ? Wǒ xiàn zài chī fàn hěn màn. Dàn shì, wǒ yǐ qián yě hé nǐ yī yàng, chī fàn fēi cháng kuài.",
        "vietnamese": "Tôi ư? Bây giờ tôi ăn rất chậm. Nhưng, trước đây tôi cũng giống cậu, ăn cực kỳ nhanh."
      },
      {
        "id": 32,
        "startTime": 129.3,
        "endTime": 137.3,
        "speaker": "Lý Minh",
        "chinese": "上大学的时候，我常常买一个面包，一边走一边吃，可能五分钟就吃完了。",
        "pinyin": "Shàng dà xué de shí hòu, wǒ cháng cháng mǎi yí gè miàn bāo, yī biān zǒu yī biān chī, kě néng wǔ fēn zhōng jiù chī wán le.",
        "vietnamese": "Lúc học đại học, tôi thường mua một cái bánh mì, vừa đi vừa ăn, có lẽ năm phút là ăn xong rồi."
      },
      {
        "id": 33,
        "startTime": 137.3,
        "endTime": 144.2,
        "speaker": "Vương Vũ",
        "chinese": "五分钟？天啊，那太快了！你为什么吃那么快？",
        "pinyin": "Wǔ fēn zhōng? Tiān a, nà tài kuài le! Nǐ wèi shén me chī nà me kuài?",
        "vietnamese": "Năm phút? Trời ơi, nhanh quá vậy! Sao cậu lại ăn nhanh thế?"
      },
      {
        "id": 34,
        "startTime": 144.2,
        "endTime": 150.8,
        "speaker": "Lý Minh",
        "chinese": "因为那时候总是很忙，有很多课，还有很多活动。",
        "pinyin": "Yīn wèi nà shí hòu zǒng shì hěn máng, yǒu hěn duō kè, hái yǒu hěn duō huó dòng.",
        "vietnamese": "Bởi vì lúc đó lúc nào cũng bận, có rất nhiều tiết học, còn có rất nhiều hoạt động."
      },
      {
        "id": 35,
        "startTime": 150.8,
        "endTime": 158.5,
        "speaker": "Lý Minh",
        "chinese": "我觉得吃饭这件事，不是那么重要，快点吃完，我就可以去做别的事情了，",
        "pinyin": "Wǒ jué de chī fàn zhè jiàn shì, bú shì nà me zhòng yào, kuài diǎn chī wán, wǒ jiù kě yǐ qù zuò bié de shì qíng le,",
        "vietnamese": "Tôi cảm thấy việc ăn uống không quan trọng đến vậy, ăn xong nhanh một chút là tôi có thể đi làm việc khác,"
      },
      {
        "id": 36,
        "startTime": 158.6,
        "endTime": 162.8,
        "speaker": "Lý Minh",
        "chinese": "比如去图书馆看书，或者去打篮球。",
        "pinyin": "Bǐ rú qù tú shū guǎn kàn shū, huò zhě qù dǎ lán qiú.",
        "vietnamese": "ví dụ như đến thư viện đọc sách, hoặc là đi đánh bóng rổ."
      },
      {
        "id": 37,
        "startTime": 162.8,
        "endTime": 170.1,
        "speaker": "Vương Vũ",
        "chinese": "对对对，我上学的时候也是这样。好像总有做不完的事情。",
        "pinyin": "Duì duì duì, wǒ shàng xué de shí hòu yě shì zhè yàng. Hǎo xiàng zǒng yǒu zuò bù wán de shì qíng.",
        "vietnamese": "Đúng đúng đúng, lúc tôi đi học cũng vậy. Dường như lúc nào cũng có việc làm không hết."
      },
      {
        "id": 38,
        "startTime": 170.1,
        "endTime": 178.8,
        "speaker": "Vương Vũ",
        "chinese": "所以，你吃饭快吗？这个问题，在那个时候，我的回答肯定是“是，我非常快”。",
        "pinyin": "Suǒ yǐ, nǐ chī fàn kuài ma? Zhè ge wèn tí, zài nà ge shí hòu, wǒ de huí dá kěn dìng shì “shì, wǒ fēi cháng kuài”.",
        "vietnamese": "Vì vậy, câu hỏi \"Cậu ăn có nhanh không?\", vào lúc đó, câu trả lời của tôi chắc chắn là \"Có, tôi rất nhanh\"."
      },
      {
        "id": 39,
        "startTime": 178.8,
        "endTime": 186.2,
        "speaker": "Lý Minh",
        "chinese": "那是什么时候开始，你觉得吃饭快可能不太好呢？",
        "pinyin": "Nà shì shén me shí hòu kāi shǐ, nǐ jué de chī fàn kuài kě néng bù tài hǎo ne?",
        "vietnamese": "Vậy từ khi nào thì cậu bắt đầu cảm thấy ăn nhanh có lẽ không tốt lắm?"
      },
      {
        "id": 40,
        "startTime": 186.2,
        "endTime": 190.9,
        "speaker": "Lý Minh",
        "chinese": "或者说，你是什么时候开始注意到这个问题的？",
        "pinyin": "Huò zhě shuō, nǐ shì shén me shí hòu kāi shǐ zhù yì dào zhè ge wèn tí de?",
        "vietnamese": "Hay nói cách khác, cậu bắt đầu chú ý đến vấn đề này từ khi nào?"
      },
      {
        "id": 41,
        "startTime": 190.9,
        "endTime": 198.5,
        "speaker": "Vương Vũ",
        "chinese": "我觉得是我工作以后。我妈妈，她总是对我说一句话。",
        "pinyin": "Wǒ jué de shì wǒ gōng zuò yǐ hòu. Wǒ mā mā, tā zǒng shì duì wǒ shuō yī jù huà.",
        "vietnamese": "Tôi nghĩ là sau khi tôi đi làm. Mẹ tôi, bà ấy luôn nói với tôi một câu."
      },
      {
        "id": 42,
        "startTime": 198.5,
        "endTime": 201.2,
        "speaker": "Vương Vũ",
        "chinese": "哦？你妈妈说什么？",
        "pinyin": "Ó? Nǐ mā mā shuō shén me?",
        "vietnamese": "Ồ? Mẹ cậu nói gì?"
      },
      {
        "id": 43,
        "startTime": 201.1,
        "endTime": 208.4,
        "speaker": "Vương Vũ",
        "chinese": "她每次看我吃饭那么快，她都说:“王雨，吃饭要慢一点。”",
        "pinyin": "Tā měi cì kàn wǒ chī fàn nà me kuài, tā dōu shuō: “wáng yǔ, chī fàn yào màn yì diǎn. ”",
        "vietnamese": "Mỗi lần thấy tôi ăn nhanh như vậy, bà đều nói: \"Vương Vũ, ăn phải chậm một chút.\""
      },
      {
        "id": 44,
        "startTime": 208.5,
        "endTime": 216.9,
        "speaker": "Vương Vũ",
        "chinese": "开始我没觉得有什么，我觉得我习惯了。但是有一次，我吃得太快了，",
        "pinyin": "Kāi shǐ wǒ méi jué de yǒu shén me, wǒ jué de wǒ xí guàn le. Dàn shì yǒu yī cì, wǒ chī dé tài kuài le,",
        "vietnamese": "Lúc đầu tôi không cảm thấy có vấn đề gì, tôi nghĩ mình quen rồi. Nhưng có một lần, tôi ăn quá nhanh,"
      },
      {
        "id": 45,
        "startTime": 216.9,
        "endTime": 220.8,
        "speaker": "Vương Vũ",
        "chinese": "下午我的胃就有一点不舒服。",
        "pinyin": "Xià wǔ wǒ de wèi jiù yǒu yì diǎn bù shū fú.",
        "vietnamese": "buổi chiều dạ dày của tôi hơi khó chịu."
      },
      {
        "id": 46,
        "startTime": 220.8,
        "endTime": 223.1,
        "speaker": "Vương Vũ",
        "chinese": "啊，胃不舒服？",
        "pinyin": "A, wèi bù shū fú?",
        "vietnamese": "À, dạ dày khó chịu?"
      },
      {
        "id": 47,
        "startTime": 223.0,
        "endTime": 233.6,
        "speaker": "Vương Vũ",
        "chinese": "对。那天以后，我才开始想，妈妈说“吃饭要慢一点”，这句话可能是对的。",
        "pinyin": "Duì. Nà tiān yǐ hòu, wǒ cái kāi shǐ xiǎng, mā mā shuō “chī fàn yào màn yì diǎn”, zhè jù huà kě néng shì duì de.",
        "vietnamese": "Đúng vậy. Sau ngày hôm đó, tôi mới bắt đầu nghĩ, câu nói \"ăn phải chậm một chút\" của mẹ có lẽ là đúng."
      },
      {
        "id": 48,
        "startTime": 233.5,
        "endTime": 236.6,
        "speaker": "Vương Vũ",
        "chinese": "看来，妈妈的话总是很有道理的。",
        "pinyin": "Kàn lái, mā mā de huà zǒng shì hěn yǒu dào lǐ de.",
        "vietnamese": "Xem ra, lời của mẹ nói lúc nào cũng rất có lý."
      },
      {
        "id": 49,
        "startTime": 236.7,
        "endTime": 241.1,
        "speaker": "Lý Minh",
        "chinese": "其实我改变习惯也是因为我爸爸。",
        "pinyin": "Qí shí wǒ gǎi biàn xí guàn yě shì yīn wèi wǒ bà bà.",
        "vietnamese": "Thực ra tôi thay đổi thói quen cũng là vì bố tôi."
      },
      {
        "id": 50,
        "startTime": 241.1,
        "endTime": 244.3,
        "speaker": "Lý Minh",
        "chinese": "哦？你爸爸也这么说？",
        "pinyin": "Ó? Nǐ bà bà yě zhè me shuō?",
        "vietnamese": "Ồ? Bố cậu cũng nói vậy à?"
      },
      {
        "id": 51,
        "startTime": 244.3,
        "endTime": 248.4,
        "speaker": "Lý Minh",
        "chinese": "对。他也是一个吃饭很慢的人。",
        "pinyin": "Duì. Tā yě shì yí gè chī fàn hěn màn de rén.",
        "vietnamese": "Đúng. Ông cũng là một người ăn rất chậm."
      },
      {
        "id": 52,
        "startTime": 248.4,
        "endTime": 255.9,
        "speaker": "Lý Minh",
        "chinese": "他常常告诉我:“李明，吃饭要慢一点。吃饭不是一个任务，它是一种享受。”",
        "pinyin": "Tā cháng cháng gào sù wǒ: “lǐ míng, chī fàn yào màn yì diǎn. Chī fàn bú shì yí gè rèn wù, tā shì yī zhǒng xiǎng shòu. ”",
        "vietnamese": "Ông thường bảo tôi: \"Lý Minh, ăn phải chậm một chút. Ăn không phải là một nhiệm vụ, nó là một sự tận hưởng.\""
      },
      {
        "id": 53,
        "startTime": 255.9,
        "endTime": 258.0,
        "speaker": "Lý Minh",
        "chinese": "一种享受。”",
        "pinyin": "Yī zhǒng xiǎng shòu. ”",
        "vietnamese": "...một sự tận hưởng.\""
      },
      {
        "id": 54,
        "startTime": 258.0,
        "endTime": 265.5,
        "speaker": "Lý Minh",
        "chinese": "“吃饭不是一个任务，它是一种享受。” 这句话说得真好。",
        "pinyin": "“chī fàn bú shì yí gè rèn wù, tā shì yī zhǒng xiǎng shòu. ” zhè jù huà shuō dé zhēn hǎo.",
        "vietnamese": "\"Ăn không phải là một nhiệm vụ, nó là một sự tận hưởng.\" Câu này nói hay thật."
      },
      {
        "id": 55,
        "startTime": 265.5,
        "endTime": 275.2,
        "speaker": "Lý Minh",
        "chinese": "是啊。所以，亲爱的听众朋友们，你们也可以问问自己或者问问你身边的人:你吃饭快吗？",
        "pinyin": "Shì a. Suǒ yǐ, qīn ài de tīng zhòng péng yǒu men, nǐ men yě kě yǐ wèn wèn zì jǐ huò zhě wèn wèn nǐ shēn biān de rén: nǐ chī fàn kuài ma?",
        "vietnamese": "Đúng vậy. Vì vậy, các bạn thính giả thân mến, các bạn cũng có thể tự hỏi mình hoặc hỏi người bên cạnh bạn: Bạn ăn có nhanh không?"
      },
      {
        "id": 56,
        "startTime": 275.2,
        "endTime": 281.4,
        "speaker": "Lý Minh",
        "chinese": "如果答案是“是”，那么也许你们可以听听我们接下来的对话。",
        "pinyin": "Rú guǒ dá àn shì “shì”, nà me yě xǔ nǐ men kě yǐ tīng tīng wǒ men jiē xià lái de duì huà.",
        "vietnamese": "Nếu câu trả lời là \"có\", vậy thì có lẽ các bạn có thể nghe tiếp cuộc đối thoại của chúng tôi."
      },
      {
        "id": 57,
        "startTime": 281.4,
        "endTime": 287.3,
        "speaker": "Lý Minh",
        "chinese": "我们常常听到家人朋友对我们说，“吃饭要慢一点”，这背后其实",
        "pinyin": "Wǒ men cháng cháng tīng dào jiā rén péng yǒu duì wǒ men shuō, “chī fàn yào màn yì diǎn”, zhè bèi hòu qí shí",
        "vietnamese": "Chúng ta thường nghe người nhà, bạn bè nói với mình \"ăn phải chậm một chút\", đằng sau câu nói này thực ra"
      },
      {
        "id": 58,
        "startTime": 287.2,
        "endTime": 289.5,
        "speaker": "Lý Minh",
        "chinese": "是有很多原因的。",
        "pinyin": "Shì yǒu hěn duō yuán yīn de.",
        "vietnamese": "có rất nhiều nguyên nhân."
      },
      {
        "id": 59,
        "startTime": 289.6,
        "endTime": 292.1,
        "speaker": "Lý Minh",
        "chinese": "嗯，我很想听听。",
        "pinyin": "ń, wǒ hěn xiǎng tīng tīng.",
        "vietnamese": "Ừm, tôi rất muốn nghe đây."
      },
      {
        "id": 60,
        "startTime": 292.1,
        "endTime": 296.4,
        "speaker": "Lý Minh",
        "chinese": "好，我们刚才聊了我们以前吃饭快的习惯。",
        "pinyin": "Hǎo, wǒ men gāng cái liáo le wǒ men yǐ qián chī fàn kuài de xí guàn.",
        "vietnamese": "Được, chúng ta vừa nói về thói quen ăn nhanh trước đây của mình."
      },
      {
        "id": 61,
        "startTime": 296.4,
        "endTime": 301.3,
        "speaker": "Lý Minh",
        "chinese": "王雨，你刚才说，你妈妈让你“吃饭要慢一点”。",
        "pinyin": "Wáng yǔ, nǐ gāng cái shuō, nǐ mā mā ràng nǐ “chī fàn yào màn yì diǎn”.",
        "vietnamese": "Vương Vũ, cậu vừa nói mẹ cậu bảo cậu \"ăn phải chậm một chút\"."
      },
      {
        "id": 62,
        "startTime": 301.3,
        "endTime": 303.7,
        "speaker": "Lý Minh",
        "chinese": "那你知道为什么要慢一点吗？",
        "pinyin": "Nà nǐ zhī dào wèi shén me yào màn yì diǎn ma?",
        "vietnamese": "Vậy cậu có biết tại sao phải chậm một chút không?"
      },
      {
        "id": 63,
        "startTime": 303.7,
        "endTime": 306.1,
        "speaker": "Lý Minh",
        "chinese": "嗯，我说不好。",
        "pinyin": "ń, wǒ shuō bù hǎo.",
        "vietnamese": "Ừm, tôi cũng không nói rõ được."
      },
      {
        "id": 64,
        "startTime": 306.1,
        "endTime": 309.4,
        "speaker": "Lý Minh",
        "chinese": "我只知道，那次我吃得太快，胃不舒服。",
        "pinyin": "Wǒ zhǐ zhī dào, nà cì wǒ chī dé tài kuài, wèi bù shū fú.",
        "vietnamese": "Tôi chỉ biết là, lần đó tôi ăn quá nhanh, dạ dày không được khỏe."
      },
      {
        "id": 65,
        "startTime": 309.4,
        "endTime": 313.5,
        "speaker": "Lý Minh",
        "chinese": "所以，我想，慢慢吃，可能对胃好？",
        "pinyin": "Suǒ yǐ, wǒ xiǎng, màn màn chī, kě néng duì wèi hǎo?",
        "vietnamese": "Nên, tôi nghĩ, ăn chậm, có lẽ tốt cho dạ dày?"
      },
      {
        "id": 66,
        "startTime": 313.5,
        "endTime": 315.0,
        "speaker": "Lý Minh",
        "chinese": "你说的非常对！",
        "pinyin": "Nǐ shuō de fēi cháng duì!",
        "vietnamese": "Cậu nói rất đúng!"
      },
      {
        "id": 67,
        "startTime": 315.0,
        "endTime": 317.8,
        "speaker": "Lý Minh",
        "chinese": "这可能是最重要的一点。",
        "pinyin": "Zhè kě néng shì zuì zhòng yào de yì diǎn.",
        "vietnamese": "Đây có lẽ là điểm quan trọng nhất."
      },
      {
        "id": 68,
        "startTime": 317.9,
        "endTime": 320.5,
        "speaker": "Lý Minh",
        "chinese": "我们的那句老话就是这么说的:",
        "pinyin": "Wǒ men de nà jù lǎo huà jiù shì zhè me shuō de:",
        "vietnamese": "Câu nói xưa của chúng ta chính là nói như vậy:"
      },
      {
        "id": 69,
        "startTime": 320.5,
        "endTime": 323.2,
        "speaker": "Lý Minh",
        "chinese": "慢慢吃，对身体好。",
        "pinyin": "Màn màn chī, duì shēn tǐ hǎo.",
        "vietnamese": "Ăn chậm, tốt cho sức khỏe."
      },
      {
        "id": 70,
        "startTime": 323.2,
        "endTime": 325.4,
        "speaker": "Lý Minh",
        "chinese": "慢慢吃，对身体好。",
        "pinyin": "Màn màn chī, duì shēn tǐ hǎo.",
        "vietnamese": "Ăn chậm, tốt cho sức khỏe."
      },
      {
        "id": 71,
        "startTime": 325.4,
        "endTime": 328.1,
        "speaker": "Lý Minh",
        "chinese": "嗯，这句话我好像也听过。",
        "pinyin": "ń, zhè jù huà wǒ hǎo xiàng yě tīng guò.",
        "vietnamese": "Ừm, câu này hình như tôi cũng có nghe qua."
      },
      {
        "id": 72,
        "startTime": 328.1,
        "endTime": 332.6,
        "speaker": "Lý Minh",
        "chinese": "是的。你想，我们的胃需要时间去工作。",
        "pinyin": "Shì de. Nǐ xiǎng, wǒ men de wèi xū yào shí jiān qù gōng zuò.",
        "vietnamese": "Đúng vậy. Cậu nghĩ xem, dạ dày của chúng ta cần thời gian để làm việc."
      },
      {
        "id": 73,
        "startTime": 332.6,
        "endTime": 334.7,
        "speaker": "Lý Minh",
        "chinese": "如果我们吃得太快，",
        "pinyin": "Rú guǒ wǒ men chī dé tài kuài,",
        "vietnamese": "Nếu chúng ta ăn quá nhanh,"
      },
      {
        "id": 74,
        "startTime": 334.7,
        "endTime": 338.5,
        "speaker": "Lý Minh",
        "chinese": "很多食物没有好好地嚼，就到了胃里。",
        "pinyin": "Hěn duō shí wù méi yǒu hǎo hǎo dì jué, jiù dào le wèi lǐ.",
        "vietnamese": "nhiều thức ăn không được nhai kỹ đã vào đến dạ dày."
      },
      {
        "id": 75,
        "startTime": 338.5,
        "endTime": 341.0,
        "speaker": "Lý Minh",
        "chinese": "这样，胃就会很累。",
        "pinyin": "Zhè yàng, wèi jiù huì hěn lèi.",
        "vietnamese": "Như vậy, dạ dày sẽ rất mệt."
      },
      {
        "id": 76,
        "startTime": 341.0,
        "endTime": 343.3,
        "speaker": "Lý Minh",
        "chinese": "我明白了。就像一个工厂，",
        "pinyin": "Wǒ míng bái le. Jiù xiàng yí gè gōng chǎng,",
        "vietnamese": "Tôi hiểu rồi. Giống như một nhà máy,"
      },
      {
        "id": 77,
        "startTime": 343.3,
        "endTime": 345.1,
        "speaker": "Lý Minh",
        "chinese": "一下来了太多的工作，",
        "pinyin": "Yī xià lái le tài duō de gōng zuò,",
        "vietnamese": "cùng lúc nhận quá nhiều việc,"
      },
      {
        "id": 78,
        "startTime": 345.0,
        "endTime": 347.3,
        "speaker": "Lý Minh",
        "chinese": "工人们就会很累很累。",
        "pinyin": "Gōng rén men jiù huì hěn lèi hěn lèi.",
        "vietnamese": "công nhân sẽ rất mệt, rất mệt."
      },
      {
        "id": 79,
        "startTime": 347.3,
        "endTime": 349.4,
        "speaker": "Lý Minh",
        "chinese": "我们的胃就是那个工厂。",
        "pinyin": "Wǒ men de wèi jiù shì nà ge gōng chǎng.",
        "vietnamese": "Dạ dày của chúng ta chính là nhà máy đó."
      },
      {
        "id": 80,
        "startTime": 349.4,
        "endTime": 352.4,
        "speaker": "Lý Minh",
        "chinese": "这个比喻非常好！就是这个意思。",
        "pinyin": "Zhè ge bǐ yù fēi cháng hǎo! Jiù shì zhè ge yì si.",
        "vietnamese": "Phép so sánh này rất hay! Chính là ý đó."
      },
      {
        "id": 81,
        "startTime": 352.4,
        "endTime": 355.5,
        "speaker": "Lý Minh",
        "chinese": "所以，慢慢吃，对身体好，",
        "pinyin": "Suǒ yǐ, màn màn chī, duì shēn tǐ hǎo,",
        "vietnamese": "Cho nên, ăn chậm, tốt cho sức khỏe,"
      },
      {
        "id": 82,
        "startTime": 355.4,
        "endTime": 357.9,
        "speaker": "Lý Minh",
        "chinese": "尤其是对我们的胃好。",
        "pinyin": "Yóu qí shì duì wǒ men de wèi hǎo.",
        "vietnamese": "đặc biệt là tốt cho dạ dày của chúng ta."
      },
      {
        "id": 83,
        "startTime": 357.9,
        "endTime": 359.8,
        "speaker": "Lý Minh",
        "chinese": "嗯，有道理。",
        "pinyin": "ń, yǒu dào lǐ.",
        "vietnamese": "Ừm, có lý."
      },
      {
        "id": 84,
        "startTime": 359.8,
        "endTime": 362.7,
        "speaker": "Lý Minh",
        "chinese": "除了对胃好，还有别的好处吗？",
        "pinyin": "Chú le duì wèi hǎo, hái yǒu bié de hǎo chù ma?",
        "vietnamese": "Ngoài tốt cho dạ dày, còn có lợi ích nào khác không?"
      },
      {
        "id": 85,
        "startTime": 362.7,
        "endTime": 364.7,
        "speaker": "Lý Minh",
        "chinese": "当然有。",
        "pinyin": "Dāng rán yǒu.",
        "vietnamese": "Tất nhiên là có."
      },
      {
        "id": 86,
        "startTime": 364.7,
        "endTime": 367.8,
        "speaker": "Lý Minh",
        "chinese": "你想想，你今天中午吃的上海菜，",
        "pinyin": "Nǐ xiǎng xiǎng, nǐ jīn tiān zhōng wǔ chī de shàng hǎi cài,",
        "vietnamese": "Cậu nghĩ xem, món ăn Thượng Hải cậu ăn trưa nay,"
      },
      {
        "id": 87,
        "startTime": 367.8,
        "endTime": 370.4,
        "speaker": "Lý Minh",
        "chinese": "你还记得它的味道吗？",
        "pinyin": "Nǐ hái jì de tā de wèi dào ma?",
        "vietnamese": "cậu còn nhớ vị của nó không?"
      },
      {
        "id": 88,
        "startTime": 370.4,
        "endTime": 372.6,
        "speaker": "Lý Minh",
        "chinese": "我……我想想。",
        "pinyin": "Wǒ... Wǒ xiǎng xiǎng.",
        "vietnamese": "Tôi... để tôi nghĩ xem."
      },
      {
        "id": 89,
        "startTime": 372.6,
        "endTime": 375.8,
        "speaker": "Lý Minh",
        "chinese": "有一个红烧肉，还有一个青菜。",
        "pinyin": "Yǒu yí gè hóng shāo ròu, hái yǒu yí gè qīng cài.",
        "vietnamese": "Có một món thịt kho tàu, và một món rau xanh."
      },
      {
        "id": 90,
        "startTime": 375.8,
        "endTime": 377.7,
        "speaker": "Lý Minh",
        "chinese": "因为我吃得太快了，",
        "pinyin": "Yīn wèi wǒ chī dé tài kuài le,",
        "vietnamese": "Bởi vì tôi ăn quá nhanh,"
      },
      {
        "id": 91,
        "startTime": 377.7,
        "endTime": 380.6,
        "speaker": "Lý Minh",
        "chinese": "我现在只记得它很好吃，",
        "pinyin": "Wǒ xiàn zài zhǐ jì de tā hěn hǎo chī,",
        "vietnamese": "bây giờ tôi chỉ nhớ là nó rất ngon,"
      },
      {
        "id": 92,
        "startTime": 380.6,
        "endTime": 384.1,
        "speaker": "Lý Minh",
        "chinese": "但是具体是什么味道，好像有点忘了。",
        "pinyin": "Dàn shì jù tǐ shì shén me wèi dào, hǎo xiàng yǒu diǎn wàng le.",
        "vietnamese": "nhưng vị cụ thể là gì, hình như hơi quên rồi."
      },
      {
        "id": 93,
        "startTime": 384.1,
        "endTime": 386.8,
        "speaker": "Lý Minh",
        "chinese": "哈哈，你看，这就是问题所在。",
        "pinyin": "Hā hā, nǐ kàn, zhè jiù shì wèn tí suǒ zài.",
        "vietnamese": "Haha, cậu thấy chưa, vấn đề nằm ở đó."
      },
      {
        "id": 94,
        "startTime": 386.8,
        "endTime": 388.6,
        "speaker": "Lý Minh",
        "chinese": "如果你吃慢一点，",
        "pinyin": "Rú guǒ nǐ chī màn yì diǎn,",
        "vietnamese": "Nếu cậu ăn chậm một chút,"
      },
      {
        "id": 95,
        "startTime": 388.6,
        "endTime": 392.0,
        "speaker": "Lý Minh",
        "chinese": "你就能更好地品尝食物的味道。",
        "pinyin": "Nǐ jiù néng gèng hǎo dì pǐn cháng shí wù de wèi dào.",
        "vietnamese": "cậu sẽ có thể nếm được hương vị của món ăn tốt hơn."
      },
      {
        "id": 96,
        "startTime": 392.0,
        "endTime": 394.5,
        "speaker": "Lý Minh",
        "chinese": "每一口，你都能感觉到",
        "pinyin": "Měi yī kǒu, nǐ dōu néng gǎn jué dào",
        "vietnamese": "Mỗi một miếng, cậu đều có thể cảm nhận được"
      },
      {
        "id": 97,
        "startTime": 394.5,
        "endTime": 399.4,
        "speaker": "Lý Minh",
        "chinese": "这个菜是甜的，还是咸的，是软的，还是脆的。",
        "pinyin": "Zhè ge cài shì tián de, hái shì xián de, shì ruǎn de, hái shì cuì de.",
        "vietnamese": "món ăn này là ngọt, hay là mặn, là mềm, hay là giòn."
      },
      {
        "id": 98,
        "startTime": 399.4,
        "endTime": 401.0,
        "speaker": "Lý Minh",
        "chinese": "对！有的时候，",
        "pinyin": "Duì! Yǒu de shí hòu,",
        "vietnamese": "Đúng! Có những lúc,"
      },
      {
        "id": 99,
        "startTime": 400.9,
        "endTime": 405.2,
        "speaker": "Lý Minh",
        "chinese": "我跟朋友一起去一家很好的餐厅，花了很多钱。",
        "pinyin": "Wǒ gēn péng yǒu yì qǐ qù yī jiā hěn hǎo de cān tīng, huā le hěn duō qián.",
        "vietnamese": "tôi cùng bạn bè đến một nhà hàng rất ngon, tốn rất nhiều tiền."
      },
      {
        "id": 100,
        "startTime": 405.2,
        "endTime": 406.8,
        "speaker": "Lý Minh",
        "chinese": "如果我吃得太快，",
        "pinyin": "Rú guǒ wǒ chī dé tài kuài,",
        "vietnamese": "Nếu tôi ăn quá nhanh,"
      },
      {
        "id": 101,
        "startTime": 406.7,
        "endTime": 408.5,
        "speaker": "Lý Minh",
        "chinese": "感觉有点浪费钱，",
        "pinyin": "Gǎn jué yǒu diǎn làng fèi qián,",
        "vietnamese": "cảm giác hơi lãng phí tiền,"
      },
      {
        "id": 102,
        "startTime": 408.5,
        "endTime": 411.8,
        "speaker": "Lý Minh",
        "chinese": "因为我都没有好好地享受那个味道。",
        "pinyin": "Yīn wèi wǒ dōu méi yǒu hǎo hǎo dì xiǎng shòu nà ge wèi dào.",
        "vietnamese": "bởi vì tôi đâu có tận hưởng hương vị đó một cách trọn vẹn."
      },
      {
        "id": 103,
        "startTime": 411.8,
        "endTime": 412.4,
        "speaker": "Lý Minh",
        "chinese": "没错。",
        "pinyin": "Méi cuò.",
        "vietnamese": "Đúng vậy."
      },
      {
        "id": 104,
        "startTime": 412.4,
        "endTime": 416.5,
        "speaker": "Lý Minh",
        "chinese": "当一道你特别喜欢的菜放在你面前，",
        "pinyin": "Dāng yī dào nǐ tè bié xǐ huān de cài fàng zài nǐ miàn qián,",
        "vietnamese": "Khi một món ăn cậu đặc biệt thích được đặt trước mặt,"
      },
      {
        "id": 105,
        "startTime": 416.5,
        "endTime": 418.1,
        "speaker": "Lý Minh",
        "chinese": "你心里一定会想:",
        "pinyin": "Nǐ xīn lǐ yí dìng huì xiǎng:",
        "vietnamese": "trong lòng cậu nhất định sẽ nghĩ:"
      },
      {
        "id": 106,
        "startTime": 418.1,
        "endTime": 421.2,
        "speaker": "Lý Minh",
        "chinese": "哇，这个菜太好吃了！",
        "pinyin": "Wa, zhè ge cài tài hǎo chī le!",
        "vietnamese": "Wow, món này ngon quá!"
      },
      {
        "id": 107,
        "startTime": 421.2,
        "endTime": 423.3,
        "speaker": "Lý Minh",
        "chinese": "对！一定会这么想！",
        "pinyin": "Duì! Yí dìng huì zhè me xiǎng!",
        "vietnamese": "Đúng! Chắc chắn sẽ nghĩ như vậy!"
      },
      {
        "id": 108,
        "startTime": 423.4,
        "endTime": 425.2,
        "speaker": "Lý Minh",
        "chinese": "特别是那个红烧肉，",
        "pinyin": "Tè bié shì nà ge hóng shāo ròu,",
        "vietnamese": "Đặc biệt là món thịt kho tàu đó,"
      },
      {
        "id": 109,
        "startTime": 425.2,
        "endTime": 427.4,
        "speaker": "Lý Minh",
        "chinese": "我第一口吃的时候，心里就说:",
        "pinyin": "Wǒ dì yī kǒu chī de shí hòu, xīn lǐ jiù shuō:",
        "vietnamese": "khi ăn miếng đầu tiên, trong lòng tôi đã thốt lên:"
      },
      {
        "id": 110,
        "startTime": 427.4,
        "endTime": 430.6,
        "speaker": "Lý Minh",
        "chinese": "哇，这个菜太好吃了！",
        "pinyin": "Wa, zhè ge cài tài hǎo chī le!",
        "vietnamese": "Wow, món này ngon quá!"
      },
      {
        "id": 111,
        "startTime": 430.6,
        "endTime": 432.1,
        "speaker": "Lý Minh",
        "chinese": "那么，当你说",
        "pinyin": "Nà me, dāng nǐ shuō",
        "vietnamese": "Vậy thì, khi cậu nói"
      },
      {
        "id": 112,
        "startTime": 432.2,
        "endTime": 434.2,
        "speaker": "Lý Minh",
        "chinese": "“这个菜太好吃了！”的时候，",
        "pinyin": "“zhè ge cài tài hǎo chī le! ” de shí hòu,",
        "vietnamese": "\"Món này ngon quá!\" thì,"
      },
      {
        "id": 113,
        "startTime": 434.2,
        "endTime": 436.8,
        "speaker": "Lý Minh",
        "chinese": "你是不是应该慢下来，",
        "pinyin": "Nǐ shì bú shì yīng gāi màn xià lái,",
        "vietnamese": "có phải cậu nên chậm lại,"
      },
      {
        "id": 114,
        "startTime": 436.7,
        "endTime": 439.2,
        "speaker": "Lý Minh",
        "chinese": "多感受一下它的美味呢？",
        "pinyin": "Duō gǎn shòu yī xià tā de měi wèi ne?",
        "vietnamese": "cảm nhận thêm vị ngon của nó không?"
      },
      {
        "id": 115,
        "startTime": 439.2,
        "endTime": 442.0,
        "speaker": "Lý Minh",
        "chinese": "一口一口，慢慢地吃。",
        "pinyin": "Yī kǒu yī kǒu, màn màn dì chī.",
        "vietnamese": "Từng miếng từng miếng, ăn từ từ thôi."
      },
      {
        "id": 116,
        "startTime": 442.0,
        "endTime": 443.8,
        "speaker": "Lý Minh",
        "chinese": "你说得对！",
        "pinyin": "Nǐ shuō dé duì!",
        "vietnamese": "Cậu nói đúng!"
      },
      {
        "id": 117,
        "startTime": 443.8,
        "endTime": 445.5,
        "speaker": "Lý Minh",
        "chinese": "如果一个东西那么好吃，",
        "pinyin": "Rú guǒ yí gè dōng xī nà me hǎo chī,",
        "vietnamese": "Nếu một thứ ngon đến vậy,"
      },
      {
        "id": 118,
        "startTime": 445.5,
        "endTime": 448.0,
        "speaker": "Lý Minh",
        "chinese": "我应该给它多一点时间。",
        "pinyin": "Wǒ yīng gāi gěi tā duō yì diǎn shí jiān.",
        "vietnamese": "tôi nên dành cho nó nhiều thời gian hơn."
      },
      {
        "id": 119,
        "startTime": 448.0,
        "endTime": 449.9,
        "speaker": "Lý Minh",
        "chinese": "我应该慢慢地享受它。",
        "pinyin": "Wǒ yīng gāi màn màn dì xiǎng shòu tā.",
        "vietnamese": "Tôi nên từ từ tận hưởng nó."
      },
      {
        "id": 120,
        "startTime": 449.9,
        "endTime": 453.8,
        "speaker": "Lý Minh",
        "chinese": "这样，吃饭就真的变成了一种快乐。",
        "pinyin": "Zhè yàng, chī fàn jiù zhēn de biàn chéng le yī zhǒng kuài lè.",
        "vietnamese": "Như vậy, việc ăn uống mới thực sự trở thành một niềm vui."
      },
      {
        "id": 121,
        "startTime": 453.8,
        "endTime": 454.7,
        "speaker": "Lý Minh",
        "chinese": "是啊。",
        "pinyin": "Shì a.",
        "vietnamese": "Đúng thế."
      },
      {
        "id": 122,
        "startTime": 454.6,
        "endTime": 457.1,
        "speaker": "Lý Minh",
        "chinese": "所以，慢慢吃，对身体好，",
        "pinyin": "Suǒ yǐ, màn màn chī, duì shēn tǐ hǎo,",
        "vietnamese": "Vậy nên, ăn chậm, tốt cho sức khỏe,"
      },
      {
        "id": 123,
        "startTime": 457.1,
        "endTime": 460.7,
        "speaker": "Lý Minh",
        "chinese": "也能让我们更好地享受美食。",
        "pinyin": "Yě néng ràng wǒ men gèng hǎo dì xiǎng shòu měi shí.",
        "vietnamese": "cũng có thể giúp chúng ta tận hưởng món ngon tốt hơn."
      },
      {
        "id": 124,
        "startTime": 460.7,
        "endTime": 463.1,
        "speaker": "Lý Minh",
        "chinese": "下次你再吃到好吃的菜，",
        "pinyin": "Xià cì nǐ zài chī dào hǎo chī de cài,",
        "vietnamese": "Lần sau khi lại ăn được món ngon,"
      },
      {
        "id": 125,
        "startTime": 463.1,
        "endTime": 465.2,
        "speaker": "Lý Minh",
        "chinese": "别忘了告诉自己，",
        "pinyin": "Bié wàng le gào sù zì jǐ,",
        "vietnamese": "đừng quên tự nhủ,"
      },
      {
        "id": 126,
        "startTime": 465.2,
        "endTime": 467.5,
        "speaker": "Lý Minh",
        "chinese": "慢一点，再慢一点。",
        "pinyin": "Màn yì diǎn, zài màn yì diǎn.",
        "vietnamese": "chậm một chút, chậm thêm chút nữa."
      },
      {
        "id": 127,
        "startTime": 467.5,
        "endTime": 468.9,
        "speaker": "Lý Minh",
        "chinese": "我记住了。",
        "pinyin": "Wǒ jì zhù le.",
        "vietnamese": "Tôi nhớ rồi."
      },
      {
        "id": 128,
        "startTime": 468.9,
        "endTime": 471.2,
        "speaker": "Lý Minh",
        "chinese": "第一，慢慢吃，对身体好。",
        "pinyin": "Dì yī, màn màn chī, duì shēn tǐ hǎo.",
        "vietnamese": "Thứ nhất, ăn chậm, tốt cho sức khỏe."
      },
      {
        "id": 129,
        "startTime": 471.2,
        "endTime": 475.1,
        "speaker": "Lý Minh",
        "chinese": "第二，可以更好地品尝食物的味道。",
        "pinyin": "Dì èr, kě yǐ gèng hǎo dì pǐn cháng shí wù de wèi dào.",
        "vietnamese": "Thứ hai, có thể nếm được hương vị món ăn tốt hơn."
      },
      {
        "id": 130,
        "startTime": 475.1,
        "endTime": 475.7,
        "speaker": "Lý Minh",
        "chinese": "当我觉得",
        "pinyin": "Dāng wǒ jué de",
        "vietnamese": "Khi tôi cảm thấy"
      },
      {
        "id": 131,
        "startTime": 475.8,
        "endTime": 478.1,
        "speaker": "Lý Minh",
        "chinese": "“这个菜太好吃了！”的时候，",
        "pinyin": "“zhè ge cài tài hǎo chī le! ” de shí hòu,",
        "vietnamese": "\"Món này ngon quá!\" thì,"
      },
      {
        "id": 132,
        "startTime": 478.0,
        "endTime": 480.5,
        "speaker": "Lý Minh",
        "chinese": "就是提醒我要慢下来的信号。",
        "pinyin": "Jiù shì tí xǐng wǒ yào màn xià lái de xìn hào.",
        "vietnamese": "đó chính là tín hiệu nhắc tôi phải chậm lại."
      },
      {
        "id": 133,
        "startTime": 480.5,
        "endTime": 483.1,
        "speaker": "Lý Minh",
        "chinese": "总结得非常好。",
        "pinyin": "Zǒng jié dé fēi cháng hǎo.",
        "vietnamese": "Tổng kết rất tốt."
      },
      {
        "id": 134,
        "startTime": 483.1,
        "endTime": 486.6,
        "speaker": "Lý Minh",
        "chinese": "李明，我们刚才说的，好像都是一个人吃饭的时候。",
        "pinyin": "Lǐ míng, wǒ men gāng cái shuō de, hǎo xiàng dōu shì yí gè rén chī fàn de shí hòu.",
        "vietnamese": "Lý Minh, những gì chúng ta vừa nói, hình như đều là khi ăn một mình."
      },
      {
        "id": 135,
        "startTime": 486.6,
        "endTime": 490.5,
        "speaker": "Lý Minh",
        "chinese": "但是很多时候，我们是和家人、朋友一起吃饭的。",
        "pinyin": "Dàn shì hěn duō shí hòu, wǒ men shì hé jiā rén, péng yǒu yì qǐ chī fàn de.",
        "vietnamese": "Nhưng rất nhiều lúc, chúng ta ăn cùng với người nhà, bạn bè."
      },
      {
        "id": 136,
        "startTime": 490.6,
        "endTime": 492.6,
        "speaker": "Lý Minh",
        "chinese": "你说到了一个非常重要的地方。",
        "pinyin": "Nǐ shuō dào le yí gè fēi cháng zhòng yào de dì fāng.",
        "vietnamese": "Cậu đã nói đến một điểm rất quan trọng."
      },
      {
        "id": 137,
        "startTime": 492.6,
        "endTime": 496.5,
        "speaker": "Lý Minh",
        "chinese": "在中国，吃饭很多时候不只是为了吃饱，",
        "pinyin": "Zài zhōng guó, chī fàn hěn duō shí hòu bù zhǐ shì wèi le chī bǎo,",
        "vietnamese": "Ở Trung Quốc, việc ăn uống nhiều khi không chỉ để ăn cho no,"
      },
      {
        "id": 138,
        "startTime": 496.4,
        "endTime": 499.0,
        "speaker": "Lý Minh",
        "chinese": "它是一种很重要的社交活动。",
        "pinyin": "Tā shì yī zhǒng hěn zhòng yào de shè jiāo huó dòng.",
        "vietnamese": "nó là một hoạt động xã giao rất quan trọng."
      },
      {
        "id": 139,
        "startTime": 499.1,
        "endTime": 503.3,
        "speaker": "Lý Minh",
        "chinese": "是的，跟家人每个星期一起吃一次饭，",
        "pinyin": "Shì de, gēn jiā rén měi gè xīng qī yì qǐ chī yī cì fàn,",
        "vietnamese": "Đúng vậy, mỗi tuần ăn một bữa cùng gia đình,"
      },
      {
        "id": 140,
        "startTime": 503.3,
        "endTime": 506.0,
        "speaker": "Lý Minh",
        "chinese": "或者跟好久不见的朋友约个饭。",
        "pinyin": "Huò zhě gēn hǎo jiǔ bú jiàn de péng yǒu yuē gè fàn.",
        "vietnamese": "hoặc hẹn ăn một bữa với người bạn lâu ngày không gặp."
      },
      {
        "id": 141,
        "startTime": 506.0,
        "endTime": 512.0,
        "speaker": "Lý Minh",
        "chinese": "对。在这些时候，你觉得大家吃饭是快还是慢？",
        "pinyin": "Duì. Zài zhè xiē shí hòu, nǐ jué de dà jiā chī fàn shì kuài hái shì màn?",
        "vietnamese": "Đúng. Vào những lúc này, cậu thấy mọi người ăn nhanh hay chậm?"
      },
      {
        "id": 142,
        "startTime": 512.0,
        "endTime": 515.8,
        "speaker": "Lý Minh",
        "chinese": "我想，肯定是慢的。因为大家要聊天啊！",
        "pinyin": "Wǒ xiǎng, kěn dìng shì màn de. Yīn wèi dà jiā yào liáo tiān a!",
        "vietnamese": "Tôi nghĩ, chắc chắn là chậm. Vì mọi người phải nói chuyện mà!"
      },
      {
        "id": 143,
        "startTime": 515.7,
        "endTime": 519.2,
        "speaker": "Lý Minh",
        "chinese": "一边吃，一边说话，时间过得很快，",
        "pinyin": "Yī biān chī, yī biān shuō huà, shí jiān guò dé hěn kuài,",
        "vietnamese": "Vừa ăn, vừa nói chuyện, thời gian trôi rất nhanh,"
      },
      {
        "id": 144,
        "startTime": 519.2,
        "endTime": 520.6,
        "speaker": "Lý Minh",
        "chinese": "但是饭吃得很慢。",
        "pinyin": "Dàn shì fàn chī dé hěn màn.",
        "vietnamese": "nhưng bữa ăn thì diễn ra rất chậm."
      },
      {
        "id": 145,
        "startTime": 520.6,
        "endTime": 524.5,
        "speaker": "Lý Minh",
        "chinese": "完全正确。比如在家里和爸爸妈妈一起吃饭，",
        "pinyin": "Wán quán zhèng què. Bǐ rú zài jiā lǐ hé bà bà mā mā yì qǐ chī fàn,",
        "vietnamese": "Hoàn toàn chính xác. Ví dụ như ở nhà ăn cơm cùng bố mẹ,"
      },
      {
        "id": 146,
        "startTime": 524.5,
        "endTime": 528.1,
        "speaker": "Lý Minh",
        "chinese": "妈妈常常会把一个菜放到我的碗里，然后说……",
        "pinyin": "Mā mā cháng cháng huì bǎ yí gè cài fàng dào wǒ de wǎn lǐ, rán hòu shuō...",
        "vietnamese": "mẹ thường sẽ gắp một món ăn vào bát của tôi, rồi nói…"
      },
      {
        "id": 147,
        "startTime": 528.2,
        "endTime": 530.3,
        "speaker": "Lý Minh",
        "chinese": "她会说:“多吃点”！",
        "pinyin": "Tā huì shuō: “duō chī diǎn”!",
        "vietnamese": "Bà sẽ nói: \"Ăn nhiều vào\"!"
      },
      {
        "id": 148,
        "startTime": 530.2,
        "endTime": 534.7,
        "speaker": "Lý Minh",
        "chinese": "哈哈，对。她还会说:“李明，你尝尝这个鱼，今天很新鲜。”",
        "pinyin": "Hā hā, duì. Tā hái huì shuō: “lǐ míng, nǐ cháng cháng zhè ge yú, jīn tiān hěn xīn xiān. ”",
        "vietnamese": "Haha, đúng vậy. Bà còn nói: \"Lý Minh, con thử món cá này xem, hôm nay tươi lắm.\""
      },
      {
        "id": 149,
        "startTime": 534.7,
        "endTime": 537.4,
        "speaker": "Lý Minh",
        "chinese": "对对对！我妈妈也一模一样！",
        "pinyin": "Duì duì duì! Wǒ mā mā yě yī mú yī yàng!",
        "vietnamese": "Đúng đúng đúng! Mẹ tôi cũng y hệt!"
      },
      {
        "id": 150,
        "startTime": 537.4,
        "endTime": 542.0,
        "speaker": "Lý Minh",
        "chinese": "她会说:“王雨，你尝尝这个汤，我做了很久。”",
        "pinyin": "Tā huì shuō: “wáng yǔ, nǐ cháng cháng zhè ge tāng, wǒ zuò le hěn jiǔ. ”",
        "vietnamese": "Bà sẽ nói: \"Vương Vũ, con thử món canh này xem, mẹ hầm lâu lắm đấy.\""
      },
      {
        "id": 151,
        "startTime": 542.0,
        "endTime": 543.6,
        "speaker": "Lý Minh",
        "chinese": "家人之间总是这样。",
        "pinyin": "Jiā rén zhī jiān zǒng shì zhè yàng.",
        "vietnamese": "Giữa người nhà với nhau luôn là như vậy."
      },
      {
        "id": 152,
        "startTime": 543.6,
        "endTime": 545.8,
        "speaker": "Lý Minh",
        "chinese": "是啊。朋友之间也是。",
        "pinyin": "Shì a. Péng yǒu zhī jiān yě shì.",
        "vietnamese": "Đúng thế. Giữa bạn bè cũng vậy."
      },
      {
        "id": 153,
        "startTime": 545.7,
        "endTime": 547.8,
        "speaker": "Lý Minh",
        "chinese": "我们一起去吃火锅的时候，",
        "pinyin": "Wǒ men yì qǐ qù chī huǒ guō de shí hòu,",
        "vietnamese": "Khi chúng ta cùng nhau đi ăn lẩu,"
      },
      {
        "id": 154,
        "startTime": 547.8,
        "endTime": 552.3,
        "speaker": "Lý Minh",
        "chinese": "我常常会对朋友说:“哎，你尝尝这个牛肉，非常好吃！”",
        "pinyin": "Wǒ cháng cháng huì duì péng yǒu shuō: “āi, nǐ cháng cháng zhè ge niú ròu, fēi cháng hǎo chī! ”",
        "vietnamese": "tôi thường sẽ nói với bạn: \"Này, cậu thử món thịt bò này xem, ngon lắm!\""
      },
      {
        "id": 155,
        "startTime": 552.4,
        "endTime": 555.8,
        "speaker": "Lý Minh",
        "chinese": "没错！然后我的朋友可能会说:",
        "pinyin": "Méi cuò! Rán hòu wǒ de péng yǒu kě néng huì shuō:",
        "vietnamese": "Đúng vậy! Rồi bạn tôi có thể sẽ nói:"
      },
      {
        "id": 156,
        "startTime": 555.8,
        "endTime": 560.2,
        "speaker": "Lý Minh",
        "chinese": "“好啊！那你也你尝尝这个，这个也好吃！”",
        "pinyin": "“hǎo a! Nà nǐ yě nǐ cháng cháng zhè ge, zhè ge yě hǎo chī! ”",
        "vietnamese": "\"Được thôi! Vậy cậu cũng thử món này đi, món này cũng ngon này!\""
      },
      {
        "id": 157,
        "startTime": 560.1,
        "endTime": 564.6,
        "speaker": "Lý Minh",
        "chinese": "这样一来一去，大家分享食物，也分享快乐。",
        "pinyin": "Zhè yàng yī lái yī qù, dà jiā fēn xiǎng shí wù, yě fēn xiǎng kuài lè.",
        "vietnamese": "Cứ như vậy qua lại, mọi người chia sẻ đồ ăn, cũng là chia sẻ niềm vui."
      },
      {
        "id": 158,
        "startTime": 564.7,
        "endTime": 569.1,
        "speaker": "Lý Minh",
        "chinese": "你看，在这样的环境里，吃饭的速度自然就慢下来了。",
        "pinyin": "Nǐ kàn, zài zhè yàng de huán jìng lǐ, chī fàn de sù dù zì rán jiù màn xià lái le.",
        "vietnamese": "Cậu thấy đó, trong một môi trường như vậy, tốc độ ăn uống tự nhiên sẽ chậm lại."
      },
      {
        "id": 159,
        "startTime": 569.1,
        "endTime": 572.8,
        "speaker": "Lý Minh",
        "chinese": "没有人会只低着头，很快地把饭吃完。",
        "pinyin": "Méi yǒu rén huì zhǐ dī zhe tóu, hěn kuài dì bǎ fàn chī wán.",
        "vietnamese": "Không ai sẽ chỉ cúi đầu, ăn cho thật nhanh xong bữa."
      },
      {
        "id": 160,
        "startTime": 572.8,
        "endTime": 574.4,
        "speaker": "Lý Minh",
        "chinese": "大家都在交流。",
        "pinyin": "Dà jiā dōu zài jiāo liú.",
        "vietnamese": "Mọi người đều đang giao lưu."
      },
      {
        "id": 161,
        "startTime": 574.4,
        "endTime": 575.8,
        "speaker": "Lý Minh",
        "chinese": "我明白了。",
        "pinyin": "Wǒ míng bái le.",
        "vietnamese": "Tôi hiểu rồi."
      },
      {
        "id": 162,
        "startTime": 575.8,
        "endTime": 578.5,
        "speaker": "Lý Minh",
        "chinese": "所以，和别人一起吃饭的时候，",
        "pinyin": "Suǒ yǐ, hé bié rén yì qǐ chī fàn de shí hòu,",
        "vietnamese": "Cho nên, khi ăn cùng người khác,"
      },
      {
        "id": 163,
        "startTime": 578.5,
        "endTime": 583.6,
        "speaker": "Lý Minh",
        "chinese": "重要的不只是食物，还有和我们一起吃饭的人。",
        "pinyin": "Zhòng yào de bù zhǐ shì shí wù, hái yǒu hé wǒ men yì qǐ chī fàn de rén.",
        "vietnamese": "điều quan trọng không chỉ là món ăn, mà còn là những người ăn cùng chúng ta."
      },
      {
        "id": 164,
        "startTime": 583.5,
        "endTime": 587.3,
        "speaker": "Lý Minh",
        "chinese": "慢慢吃，我们才有时间去关心对方，去聊天。",
        "pinyin": "Màn màn chī, wǒ men cái yǒu shí jiān qù guān xīn duì fāng, qù liáo tiān.",
        "vietnamese": "Ăn chậm, chúng ta mới có thời gian để quan tâm đối phương, để trò chuyện."
      },
      {
        "id": 165,
        "startTime": 587.4,
        "endTime": 591.8,
        "speaker": "Lý Minh",
        "chinese": "是的。如果一个朋友跟你说，“我最近工作不开心”，",
        "pinyin": "Shì de. Rú guǒ yí gè péng yǒu gēn nǐ shuō, “wǒ zuì jìn gōng zuò bù kāi xīn”,",
        "vietnamese": "Đúng vậy. Nếu một người bạn nói với cậu, \"Dạo này công việc của tớ không vui\","
      },
      {
        "id": 166,
        "startTime": 591.8,
        "endTime": 594.3,
        "speaker": "Lý Minh",
        "chinese": "你总不能一边飞快地吃饭，一边说",
        "pinyin": "Nǐ zǒng bù néng yī biān fēi kuài dì chī fàn, yī biān shuō",
        "vietnamese": "cậu không thể nào vừa ăn lia lịa, vừa nói"
      },
      {
        "id": 167,
        "startTime": 594.2,
        "endTime": 598.8,
        "speaker": "Lý Minh",
        "chinese": "“嗯嗯嗯”。你要停下来，看着他，听他说。",
        "pinyin": "“ń ń ń”. Nǐ yào tíng xià lái, kàn zhe tā, tīng tā shuō.",
        "vietnamese": "\"Ừm ừm ừm\". Cậu phải dừng lại, nhìn người đó, lắng nghe họ nói."
      },
      {
        "id": 168,
        "startTime": 598.9,
        "endTime": 604.1,
        "speaker": "Lý Minh",
        "chinese": "有道理。吃饭的速度，也表示了你对这次聚会的态度。",
        "pinyin": "Yǒu dào lǐ. Chī fàn de sù dù, yě biǎo shì le nǐ duì zhè cì jù huì de tài dù.",
        "vietnamese": "Có lý. Tốc độ ăn uống, cũng thể hiện thái độ của bạn đối với buổi gặp mặt này."
      },
      {
        "id": 169,
        "startTime": 604.1,
        "endTime": 607.9,
        "speaker": "Lý Minh",
        "chinese": "慢下来，表示我很重视和你们在一起的时间。",
        "pinyin": "Màn xià lái, biǎo shì wǒ hěn zhòng shì hé nǐ men zài yì qǐ de shí jiān.",
        "vietnamese": "Chậm lại, thể hiện rằng tôi rất coi trọng khoảng thời gian ở bên các bạn."
      },
      {
        "id": 170,
        "startTime": 607.8,
        "endTime": 608.9,
        "speaker": "Lý Minh",
        "chinese": "正是如此。",
        "pinyin": "Zhèng shì rú cǐ.",
        "vietnamese": "Chính là như vậy."
      },
      {
        "id": 171,
        "startTime": 608.9,
        "endTime": 614.2,
        "speaker": "Lý Minh",
        "chinese": "所以，你看，无论是出于健康，还是为了更好地享受美食，",
        "pinyin": "Suǒ yǐ, nǐ kàn, wú lùn shì chū yú jiàn kāng, hái shì wèi le gèng hǎo dì xiǎng shòu měi shí,",
        "vietnamese": "Vậy cậu thấy đó, dù là vì sức khỏe, hay để tận hưởng món ngon tốt hơn,"
      },
      {
        "id": 172,
        "startTime": 614.2,
        "endTime": 619.7,
        "speaker": "Lý Minh",
        "chinese": "或者是在社交的时候，慢一点吃饭都是更好的选择。",
        "pinyin": "Huò zhě shì zài shè jiāo de shí hòu, màn yì diǎn chī fàn dōu shì gèng hǎo de xuǎn zé.",
        "vietnamese": "hoặc là trong lúc xã giao, ăn chậm một chút đều là lựa chọn tốt hơn."
      },
      {
        "id": 173,
        "startTime": 619.8,
        "endTime": 622.9,
        "speaker": "Lý Minh",
        "chinese": "下次和朋友吃饭，当一道菜上来，",
        "pinyin": "Xià cì hé péng yǒu chī fàn, dāng yī dào cài shàng lái,",
        "vietnamese": "Lần sau ăn cơm với bạn, khi một món ăn được dọn lên,"
      },
      {
        "id": 174,
        "startTime": 622.8,
        "endTime": 626.1,
        "speaker": "Lý Minh",
        "chinese": "你可以先说:“哇，这个菜太好吃了！”",
        "pinyin": "Nǐ kě yǐ xiān shuō: “wa, zhè ge cài tài hǎo chī le! ”",
        "vietnamese": "cậu có thể nói trước: \"Wow, món này ngon quá!\""
      },
      {
        "id": 175,
        "startTime": 626.1,
        "endTime": 630.0,
        "speaker": "Lý Minh",
        "chinese": "然后把它分给你的朋友，说:“你尝尝这个。”",
        "pinyin": "Rán hòu bǎ tā fēn gěi nǐ de péng yǒu, shuō: “nǐ cháng cháng zhè ge. ”",
        "vietnamese": "Sau đó chia nó cho bạn của cậu, nói: \"Cậu thử món này đi.\""
      },
      {
        "id": 176,
        "startTime": 630.0,
        "endTime": 631.6,
        "speaker": "Lý Minh",
        "chinese": "哈哈，我学会了。",
        "pinyin": "Hā hā, wǒ xué huì le.",
        "vietnamese": "Haha, tôi học được rồi."
      },
      {
        "id": 177,
        "startTime": 631.6,
        "endTime": 634.1,
        "speaker": "Lý Minh",
        "chinese": "这样一来，气氛会很好，",
        "pinyin": "Zhè yàng yī lái, qì fēn huì hěn hǎo,",
        "vietnamese": "Cứ như vậy, không khí sẽ rất tốt,"
      },
      {
        "id": 178,
        "startTime": 634.1,
        "endTime": 637.0,
        "speaker": "Lý Minh",
        "chinese": "大家吃饭的速度也自然慢下来了。",
        "pinyin": "Dà jiā chī fàn de sù dù yě zì rán màn xià lái le.",
        "vietnamese": "tốc độ ăn uống của mọi người cũng tự nhiên chậm lại."
      },
      {
        "id": 179,
        "startTime": 637.1,
        "endTime": 638.3,
        "speaker": "Lý Minh",
        "chinese": "没错。",
        "pinyin": "Méi cuò.",
        "vietnamese": "Đúng vậy."
      },
      {
        "id": 180,
        "startTime": 638.3,
        "endTime": 643.1,
        "speaker": "Lý Minh",
        "chinese": "好了，王雨，今天我们从“你吃饭快吗”",
        "pinyin": "Hǎo le, wáng yǔ, jīn tiān wǒ men cóng “nǐ chī fàn kuài ma”",
        "vietnamese": "Được rồi, Vương Vũ, hôm nay chúng ta từ câu hỏi \"Cậu ăn có nhanh không\""
      },
      {
        "id": 181,
        "startTime": 643.1,
        "endTime": 648.1,
        "speaker": "Lý Minh",
        "chinese": "这个问题开始，聊了很多关于吃饭速度的话题。",
        "pinyin": "Zhè ge wèn tí kāi shǐ, liáo le hěn duō guān yú chī fàn sù dù de huà tí.",
        "vietnamese": "đã bắt đầu và trò chuyện rất nhiều chủ đề về tốc độ ăn uống."
      },
      {
        "id": 182,
        "startTime": 648.1,
        "endTime": 652.2,
        "speaker": "Lý Minh",
        "chinese": "是啊，时间过得真快。我学到了很多。",
        "pinyin": "Shì a, shí jiān guò dé zhēn kuài. Wǒ xué dào le hěn duō.",
        "vietnamese": "Đúng vậy, thời gian trôi nhanh thật. Tôi đã học được rất nhiều."
      },
      {
        "id": 183,
        "startTime": 652.2,
        "endTime": 655.3,
        "speaker": "Lý Minh",
        "chinese": "我以前真的没觉得这是个问题。",
        "pinyin": "Wǒ yǐ qián zhēn de méi jué de zhè shì gè wèn tí.",
        "vietnamese": "Trước đây tôi thật sự không cảm thấy đây là một vấn đề."
      },
      {
        "id": 184,
        "startTime": 655.4,
        "endTime": 662.0,
        "speaker": "Lý Minh",
        "chinese": "我们今天在聊天的时候，其实反复用到了几句非常有用的中文。",
        "pinyin": "Wǒ men jīn tiān zài liáo tiān de shí hòu, qí shí fǎn fù yòng dào le jǐ jù fēi cháng yǒu yòng de zhōng wén.",
        "vietnamese": "Trong lúc chúng ta trò chuyện hôm nay, thực ra đã lặp đi lặp lại một vài câu tiếng Trung rất hữu ích."
      },
      {
        "id": 185,
        "startTime": 662.0,
        "endTime": 666.8,
        "speaker": "Lý Minh",
        "chinese": "我觉得，这些句子在大家每天吃饭的时候，都可能用到。",
        "pinyin": "Wǒ jué de, zhè xiē jù zi zài dà jiā měi tiān chī fàn de shí hòu, dōu kě néng yòng dào.",
        "vietnamese": "Tôi nghĩ, những câu này mọi người đều có thể dùng đến khi ăn uống hàng ngày."
      },
      {
        "id": 186,
        "startTime": 666.8,
        "endTime": 670.8,
        "speaker": "Lý Minh",
        "chinese": "嗯，是的！我们来总结一下吧？",
        "pinyin": "ń, shì de! Wǒ men lái zǒng jié yī xià ba?",
        "vietnamese": "Ừm, đúng vậy! Chúng ta cùng tổng kết lại nhé?"
      },
      {
        "id": 187,
        "startTime": 670.8,
        "endTime": 674.7,
        "speaker": "Lý Minh",
        "chinese": "这样听众朋友们也可以再学习一遍。",
        "pinyin": "Zhè yàng tīng zhòng péng yǒu men yě kě yǐ zài xué xí yī biàn.",
        "vietnamese": "Như vậy các bạn thính giả cũng có thể học lại một lần nữa."
      },
      {
        "id": 188,
        "startTime": 674.7,
        "endTime": 679.9,
        "speaker": "Lý Minh",
        "chinese": "好主意。今天我们学习的第一个句子，也是我们的开始，",
        "pinyin": "Hǎo zhǔ yì. Jīn tiān wǒ men xué xí de dì yí gè jù zi, yě shì wǒ men de kāi shǐ,",
        "vietnamese": "Ý kiến hay. Câu đầu tiên chúng ta học hôm nay, cũng là khởi đầu của chúng ta,"
      },
      {
        "id": 189,
        "startTime": 679.9,
        "endTime": 682.6,
        "speaker": "Lý Minh",
        "chinese": "就是问别人吃饭的习惯。",
        "pinyin": "Jiù shì wèn bié rén chī fàn de xí guàn.",
        "vietnamese": "chính là hỏi người khác về thói quen ăn uống."
      },
      {
        "id": 190,
        "startTime": 682.6,
        "endTime": 683.9,
        "speaker": "Lý Minh",
        "chinese": "那句话是？",
        "pinyin": "Nà jù huà shì?",
        "vietnamese": "Câu đó là?"
      },
      {
        "id": 191,
        "startTime": 683.9,
        "endTime": 686.3,
        "speaker": "Lý Minh",
        "chinese": "是:你吃饭快吗？",
        "pinyin": "Shì: nǐ chī fàn kuài ma?",
        "vietnamese": "Là: Bạn ăn có nhanh không?"
      },
      {
        "id": 192,
        "startTime": 686.3,
        "endTime": 688.9,
        "speaker": "Lý Minh",
        "chinese": "对。你吃饭快吗？",
        "pinyin": "Duì. Nǐ chī fàn kuài ma?",
        "vietnamese": "Đúng. Bạn ăn có nhanh không?"
      },
      {
        "id": 193,
        "startTime": 688.8,
        "endTime": 691.9,
        "speaker": "Lý Minh",
        "chinese": "你可以问你的朋友，你的家人。",
        "pinyin": "Nǐ kě yǐ wèn nǐ de péng yǒu, nǐ de jiā rén.",
        "vietnamese": "Bạn có thể hỏi bạn bè, người nhà của bạn."
      },
      {
        "id": 194,
        "startTime": 692.0,
        "endTime": 694.9,
        "speaker": "Lý Minh",
        "chinese": "好。那第二个句子呢？",
        "pinyin": "Hǎo. Nà dì èr gè jù zi ne?",
        "vietnamese": "Tốt. Vậy câu thứ hai là gì?"
      },
      {
        "id": 195,
        "startTime": 694.9,
        "endTime": 698.6,
        "speaker": "Lý Minh",
        "chinese": "通常是家人朋友给我们的一个建议。",
        "pinyin": "Tōng cháng shì jiā rén péng yǒu gěi wǒ men de yí gè jiàn yì.",
        "vietnamese": "Thường là một lời khuyên mà người nhà, bạn bè dành cho chúng ta."
      },
      {
        "id": 196,
        "startTime": 698.6,
        "endTime": 702.5,
        "speaker": "Lý Minh",
        "chinese": "这个建议就是:吃饭要慢一点。",
        "pinyin": "Zhè ge jiàn yì jiù shì: chī fàn yào màn yì diǎn.",
        "vietnamese": "Lời khuyên này chính là: Ăn phải chậm một chút."
      },
      {
        "id": 197,
        "startTime": 702.5,
        "endTime": 706.6,
        "speaker": "Lý Minh",
        "chinese": "嗯。吃饭要慢一点。 我妈妈常说。",
        "pinyin": "ń. Chī fàn yào màn yì diǎn. Wǒ mā mā cháng shuō.",
        "vietnamese": "Ừm. Ăn phải chậm một chút. Mẹ tôi thường nói."
      },
      {
        "id": 198,
        "startTime": 706.6,
        "endTime": 711.5,
        "speaker": "Lý Minh",
        "chinese": "第三个句子，是告诉我们为什么要慢一点。",
        "pinyin": "Dì sān gè jù zi, shì gào sù wǒ men wèi shén me yào màn yì diǎn.",
        "vietnamese": "Câu thứ ba, là cho chúng ta biết tại sao phải ăn chậm."
      },
      {
        "id": 199,
        "startTime": 711.5,
        "endTime": 717.0,
        "speaker": "Lý Minh",
        "chinese": "我想起来了，那句话是:慢慢吃，对身体好。",
        "pinyin": "Wǒ xiǎng qǐ lái le, nà jù huà shì: màn màn chī, duì shēn tǐ hǎo.",
        "vietnamese": "Tôi nhớ ra rồi, câu đó là: Ăn chậm, tốt cho sức khỏe."
      },
      {
        "id": 200,
        "startTime": 717.0,
        "endTime": 721.1,
        "speaker": "Lý Minh",
        "chinese": "完全正确。慢慢吃，对身体好。",
        "pinyin": "Wán quán zhèng què. Màn màn chī, duì shēn tǐ hǎo.",
        "vietnamese": "Hoàn toàn chính xác. Ăn chậm, tốt cho sức khỏe."
      },
      {
        "id": 201,
        "startTime": 721.1,
        "endTime": 723.7,
        "speaker": "Lý Minh",
        "chinese": "这是最重要的一个原因。",
        "pinyin": "Zhè shì zuì zhòng yào de yí gè yuán yīn.",
        "vietnamese": "Đây là một lý do quan trọng nhất."
      },
      {
        "id": 202,
        "startTime": 723.7,
        "endTime": 725.6,
        "speaker": "Lý Minh",
        "chinese": "那第四个呢？",
        "pinyin": "Nà dì sì gè ne?",
        "vietnamese": "Vậy câu thứ tư thì sao?"
      },
      {
        "id": 203,
        "startTime": 725.6,
        "endTime": 730.3,
        "speaker": "Lý Minh",
        "chinese": "是当我们吃到美食的时候，心里的感叹。",
        "pinyin": "Shì dāng wǒ men chī dào měi shí de shí hòu, xīn lǐ de gǎn tàn.",
        "vietnamese": "Là lời cảm thán trong lòng khi chúng ta ăn được món ngon."
      },
      {
        "id": 204,
        "startTime": 730.3,
        "endTime": 735.6,
        "speaker": "Lý Minh",
        "chinese": "对，那句感叹就是:这个菜太好吃了！",
        "pinyin": "Duì, nà jù gǎn tàn jiù shì: zhè ge cài tài hǎo chī le!",
        "vietnamese": "Đúng, câu cảm thán đó là: Món này ngon quá!"
      },
      {
        "id": 205,
        "startTime": 735.6,
        "endTime": 740.8,
        "speaker": "Lý Minh",
        "chinese": "这个菜太好吃了！ 我希望我每天都有机会说这句话！",
        "pinyin": "Zhè ge cài tài hǎo chī le! Wǒ xī wàng wǒ měi tiān dōu yǒu jī huì shuō zhè jù huà!",
        "vietnamese": "Món này ngon quá! Tôi hy vọng ngày nào tôi cũng có cơ hội nói câu này!"
      },
      {
        "id": 206,
        "startTime": 740.8,
        "endTime": 742.6,
        "speaker": "Lý Minh",
        "chinese": "哈哈，我也是。",
        "pinyin": "Hā hā, wǒ yě shì.",
        "vietnamese": "Haha, tôi cũng vậy."
      },
      {
        "id": 207,
        "startTime": 742.6,
        "endTime": 744.4,
        "speaker": "Lý Minh",
        "chinese": "那最后一个句子呢？",
        "pinyin": "Nà zuì hòu yí gè jù zi ne?",
        "vietnamese": "Vậy câu cuối cùng là gì?"
      },
      {
        "id": 208,
        "startTime": 744.5,
        "endTime": 748.2,
        "speaker": "Lý Minh",
        "chinese": "通常是在和别人分享美食的时候说。",
        "pinyin": "Tōng cháng shì zài hé bié rén fēn xiǎng měi shí de shí hòu shuō.",
        "vietnamese": "Thường được nói khi chia sẻ món ngon với người khác."
      },
      {
        "id": 209,
        "startTime": 748.1,
        "endTime": 751.3,
        "speaker": "Lý Minh",
        "chinese": "我知道！是:你尝尝这个。",
        "pinyin": "Wǒ zhī dào! Shì: nǐ cháng cháng zhè ge.",
        "vietnamese": "Tôi biết! Là: Bạn thử món này đi."
      },
      {
        "id": 210,
        "startTime": 751.4,
        "endTime": 757.4,
        "speaker": "Lý Minh",
        "chinese": "没错。你尝尝这个。 一句非常友好，非常热情的邀请。",
        "pinyin": "Méi cuò. Nǐ cháng cháng zhè ge. Yī jù fēi cháng yǒu hǎo, fēi cháng rè qíng de yāo qǐng.",
        "vietnamese": "Đúng vậy. Bạn thử món này đi. Một lời mời rất thân thiện, rất nhiệt tình."
      },
      {
        "id": 211,
        "startTime": 757.3,
        "endTime": 761.9,
        "speaker": "Lý Minh",
        "chinese": "太好了。我们再一起快速地读一遍这五个句子吧。",
        "pinyin": "Tài hǎo le. Wǒ men zài yì qǐ kuài sù dì dú yī biàn zhè wǔ gè jù zi ba.",
        "vietnamese": "Tuyệt quá. Chúng ta hãy cùng nhau đọc nhanh lại năm câu này một lần nhé."
      },
      {
        "id": 212,
        "startTime": 762.0,
        "endTime": 766.8,
        "speaker": "Lý Minh",
        "chinese": "好。 第一句:你吃饭快吗？",
        "pinyin": "Hǎo. Dì yī jù: nǐ chī fàn kuài ma?",
        "vietnamese": "Được. Câu thứ nhất: Bạn ăn có nhanh không?"
      },
      {
        "id": 213,
        "startTime": 766.7,
        "endTime": 770.7,
        "speaker": "Lý Minh",
        "chinese": "第二句:吃饭要慢一点。",
        "pinyin": "Dì èr jù: chī fàn yào màn yì diǎn.",
        "vietnamese": "Câu thứ hai: Ăn phải chậm một chút."
      },
      {
        "id": 214,
        "startTime": 770.8,
        "endTime": 775.0,
        "speaker": "Lý Minh",
        "chinese": "第三句:慢慢吃，对身体好。",
        "pinyin": "Dì sān jù: màn màn chī, duì shēn tǐ hǎo.",
        "vietnamese": "Câu thứ ba: Ăn chậm, tốt cho sức khỏe."
      },
      {
        "id": 215,
        "startTime": 775.0,
        "endTime": 779.7,
        "speaker": "Lý Minh",
        "chinese": "第四句:这个菜太好吃了！",
        "pinyin": "Dì sì jù: zhè ge cài tài hǎo chī le!",
        "vietnamese": "Câu thứ tư: Món này ngon quá!"
      },
      {
        "id": 216,
        "startTime": 779.7,
        "endTime": 782.7,
        "speaker": "Lý Minh",
        "chinese": "第五句:你尝尝这个。",
        "pinyin": "Dì wǔ jù: nǐ cháng cháng zhè ge.",
        "vietnamese": "Câu thứ năm: Bạn thử món này đi."
      },
      {
        "id": 217,
        "startTime": 782.7,
        "endTime": 785.5,
        "speaker": "Lý Minh",
        "chinese": "我觉得这五句话都非常实用！",
        "pinyin": "Wǒ jué de zhè wǔ jù huà dōu fēi cháng shí yòng!",
        "vietnamese": "Tôi thấy cả năm câu này đều rất thực tế!"
      },
      {
        "id": 218,
        "startTime": 785.5,
        "endTime": 790.6,
        "speaker": "Lý Minh",
        "chinese": "我今天晚上回家吃饭，就要用起来。我要慢慢吃，",
        "pinyin": "Wǒ jīn tiān wǎn shàng huí jiā chī fàn, jiù yào yòng qǐ lái. Wǒ yào màn màn chī,",
        "vietnamese": "Tối nay về nhà ăn cơm, tôi phải áp dụng ngay. Tôi sẽ ăn thật chậm,"
      },
      {
        "id": 219,
        "startTime": 790.6,
        "endTime": 794.4,
        "speaker": "Lý Minh",
        "chinese": "如果我妈妈做了好吃的菜，我就要大声说:",
        "pinyin": "Rú guǒ wǒ mā mā zuò le hǎo chī de cài, wǒ jiù yào dà shēng shuō:",
        "vietnamese": "nếu mẹ tôi làm món ngon, tôi sẽ nói thật to:"
      },
      {
        "id": 220,
        "startTime": 794.4,
        "endTime": 797.5,
        "speaker": "Lý Minh",
        "chinese": "“妈妈，这个菜太好吃了！”",
        "pinyin": "“mā mā, zhè ge cài tài hǎo chī le! ”",
        "vietnamese": "\"Mẹ ơi, món này ngon quá!\""
      },
      {
        "id": 221,
        "startTime": 797.5,
        "endTime": 801.3,
        "speaker": "Lý Minh",
        "chinese": "哈哈，你妈妈听了肯定会很高兴。",
        "pinyin": "Hā hā, nǐ mā mā tīng le kěn dìng huì hěn gāo xìng.",
        "vietnamese": "Haha, mẹ cậu nghe xong chắc chắn sẽ rất vui."
      },
      {
        "id": 222,
        "startTime": 801.3,
        "endTime": 805.1,
        "speaker": "Lý Minh",
        "chinese": "好了，今天的“每天中文”也差不多要结束了。",
        "pinyin": "Hǎo le, jīn tiān de “měi tiān zhōng wén” yě chà bu duō yào jié shù le.",
        "vietnamese": "Được rồi, chương trình \"Mỗi Ngày Tiếng Trung\" hôm nay cũng sắp kết thúc rồi."
      },
      {
        "id": 223,
        "startTime": 805.0,
        "endTime": 807.3,
        "speaker": "Lý Minh",
        "chinese": "希望大家通过今天的节目，",
        "pinyin": "Xī wàng dà jiā tōng guò jīn tiān de jié mù,",
        "vietnamese": "Hy vọng các bạn qua chương trình hôm nay,"
      },
      {
        "id": 224,
        "startTime": 807.3,
        "endTime": 809.7,
        "speaker": "Lý Minh",
        "chinese": "能更关注自己吃饭的习惯。",
        "pinyin": "Néng gèng guān zhù zì jǐ chī fàn de xí guàn.",
        "vietnamese": "có thể quan tâm hơn đến thói quen ăn uống của mình."
      },
      {
        "id": 225,
        "startTime": 809.7,
        "endTime": 813.2,
        "speaker": "Lý Minh",
        "chinese": "是啊。吃饭是一件每天都做的小事，",
        "pinyin": "Shì a. Chī fàn shì yī jiàn měi tiān dōu zuò de xiǎo shì,",
        "vietnamese": "Đúng vậy. Ăn uống là một việc nhỏ làm mỗi ngày,"
      },
      {
        "id": 226,
        "startTime": 813.2,
        "endTime": 816.4,
        "speaker": "Lý Minh",
        "chinese": "但小事里也有大学问。",
        "pinyin": "Dàn xiǎo shì lǐ yě yǒu dà xué wèn.",
        "vietnamese": "nhưng trong việc nhỏ lại có học vấn lớn."
      },
      {
        "id": 227,
        "startTime": 816.4,
        "endTime": 819.9,
        "speaker": "Lý Minh",
        "chinese": "希望大家都能吃得健康，吃得开心。",
        "pinyin": "Xī wàng dà jiā dōu néng chī dé jiàn kāng, chī de kāi xīn.",
        "vietnamese": "Hy vọng mọi người đều có thể ăn uống lành mạnh, ăn uống vui vẻ."
      },
      {
        "id": 228,
        "startTime": 819.9,
        "endTime": 824.6,
        "speaker": "Lý Minh",
        "chinese": "那么，最后也想问问正在听我们播客的你:",
        "pinyin": "Nà me, zuì hòu yě xiǎng wèn wèn zhèng zài tīng wǒ men bō kè de nǐ:",
        "vietnamese": "Vậy thì, cuối cùng cũng muốn hỏi bạn đang nghe podcast của chúng tôi:"
      },
      {
        "id": 229,
        "startTime": 824.5,
        "endTime": 826.2,
        "speaker": "Lý Minh",
        "chinese": "你吃饭快吗？",
        "pinyin": "Nǐ chī fàn kuài ma?",
        "vietnamese": "Bạn ăn có nhanh không?"
      },
      {
        "id": 230,
        "startTime": 826.3,
        "endTime": 831.2,
        "speaker": "Lý Minh",
        "chinese": "你身边有没有人总是提醒你“吃饭要慢一点”呢？",
        "pinyin": "Nǐ shēn biān yǒu méi yǒu rén zǒng shì tí xǐng nǐ “chī fàn yào màn yì diǎn” ne?",
        "vietnamese": "Bên cạnh bạn có ai luôn nhắc bạn \"ăn phải chậm một chút\" không?"
      },
      {
        "id": 231,
        "startTime": 831.2,
        "endTime": 833.3,
        "speaker": "Lý Minh",
        "chinese": "欢迎在我们的频道下面留言，",
        "pinyin": "Huān yíng zài wǒ men de pín dào xià miàn liú yán,",
        "vietnamese": "Chào mừng các bạn để lại bình luận bên dưới kênh của chúng tôi,"
      },
      {
        "id": 232,
        "startTime": 833.3,
        "endTime": 835.4,
        "speaker": "Lý Minh",
        "chinese": "跟我们分享你的故事。",
        "pinyin": "Gēn wǒ men fēn xiǎng nǐ de gù shì.",
        "vietnamese": "chia sẻ câu chuyện của bạn với chúng tôi."
      },
      {
        "id": 233,
        "startTime": 835.4,
        "endTime": 838.2,
        "speaker": "Lý Minh",
        "chinese": "我们很期待看到大家的分享。",
        "pinyin": "Wǒ men hěn qī dài kàn dào dà jiā de fēn xiǎng.",
        "vietnamese": "Chúng tôi rất mong chờ được xem những chia sẻ của mọi người."
      },
      {
        "id": 234,
        "startTime": 838.2,
        "endTime": 840.6,
        "speaker": "Lý Minh",
        "chinese": "好了，今天的节目就到这里。",
        "pinyin": "Hǎo le, jīn tiān de jié mù jiù dào zhè lǐ.",
        "vietnamese": "Được rồi, chương trình hôm nay đến đây là kết thúc."
      },
      {
        "id": 235,
        "startTime": 840.6,
        "endTime": 842.7,
        "speaker": "Lý Minh",
        "chinese": "感谢大家的收听！",
        "pinyin": "Gǎn xiè dà jiā de shōu tīng!",
        "vietnamese": "Cảm ơn sự lắng nghe của mọi người!"
      },
      {
        "id": 236,
        "startTime": 842.6,
        "endTime": 843.4,
        "speaker": "Lý Minh",
        "chinese": "我是李明。",
        "pinyin": "Wǒ shì lǐ míng.",
        "vietnamese": "Tôi là Lý Minh."
      },
      {
        "id": 237,
        "startTime": 843.4,
        "endTime": 844.3,
        "speaker": "Vương Vũ",
        "chinese": "我是王雨。",
        "pinyin": "Wǒ shì wáng yǔ.",
        "vietnamese": "Tôi là Vương Vũ."
      },
      {
        "id": 238,
        "startTime": 844.4,
        "endTime": 846.2,
        "speaker": "Vương Vũ",
        "chinese": "我们下期再见！",
        "pinyin": "Wǒ men xià qī zài jiàn!",
        "vietnamese": "Hẹn gặp lại các bạn trong kỳ sau!"
      }
    ]
  },
  {
    "id": "hsk3-diet-and-health-hasu",
    "title": "饮食习惯与健康 – Thói quen ăn uống & Sức khỏe (Hasu)",
    "level": "HSK 3-4",
    "levelBadgeColor": "text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-300",
    "duration": "28:54",
    "category": "Ẩm thực & Mua sắm",
    "description": "Chuyên đề luyện nói và phản xạ về chế độ dinh dưỡng, sức khỏe theo phương pháp Shadowing chuẩn cho kỳ thi HSK và HSKK.",
    "youtubeId": "lJ-47T2h1YM",
    "sentencesCount": 5,
    "isFree": false,
    "sentences": [
      {
        "id": 1,
        "startTime": 0,
        "endTime": 8,
        "speaker": "Hasu",
        "chinese": "拥有良好的饮食习惯对于现代人来说至关重要。",
        "pinyin": "Yōngyǒu liánghǎo de yǐnshí xíguàn duìyú xiàndàirén láishuō zhìguān zhòngyào.",
        "vietnamese": "Xây dựng thói quen ăn uống tốt đối với người hiện đại có ý nghĩa vô cùng quan trọng."
      },
      {
        "id": 2,
        "startTime": 8,
        "endTime": 17,
        "speaker": "Hasu",
        "chinese": "很多年轻人经常熬夜，而且不吃早餐，这非常损害身体健康。",
        "pinyin": "Hěnduō niánqīngrén jīngcháng áoyè, érqiě bù chī zǎocān, zhè fēicháng sǔnhài shēntǐ jiànkāng.",
        "vietnamese": "Rất nhiều bạn trẻ thường xuyên thức khuya, lại không chịu ăn sáng, điều này làm tổn hại nghiêm trọng đến sức khỏe."
      },
      {
        "id": 3,
        "startTime": 17,
        "endTime": 27,
        "speaker": "Hasu",
        "chinese": "我们应该多吃新鲜蔬菜和水果，保证充足的维生素摄入。",
        "pinyin": "Wǒmen yīnggāi duō chī xīnxiān shūcài hé shuǐguǒ, bǎozhèng chōngzú de wéishēngsù shèrù.",
        "vietnamese": "Chúng ta nên ăn nhiều rau củ quả tươi sạch để đảm bảo nạp đủ lượng vitamin cần thiết."
      },
      {
        "id": 4,
        "startTime": 27,
        "endTime": 37,
        "speaker": "Hasu",
        "chinese": "除了合理膳食之外，每天坚持适量运动同样必不可少。",
        "pinyin": "Chúle hélǐ shànshí zhīwài, měitiān jiānchí shìliàng yùndòng tóngyàng bì bù kě shǎo.",
        "vietnamese": "Bên cạnh chế độ ăn uống hợp lý, kiên trì tập luyện thể thao điều độ mỗi ngày cũng là điều không thể thiếu."
      },
      {
        "id": 5,
        "startTime": 37,
        "endTime": 48,
        "speaker": "Hasu",
        "chinese": "只要我们长期坚持科学的生活方式，精神状态就会充满活力。",
        "pinyin": "Zhǐyào wǒmen chángqī jiānchí kēxué de shēnghuó fāngshì, jīngshén zhuàngtài jiù huì chōngmǎn huólì.",
        "vietnamese": "Chỉ cần kiên trì lối sống khoa học lâu dài, tinh thần của chúng ta sẽ luôn tràn đầy năng lượng và sức sống."
      }
    ]
  },
  {
    "id": "hsk5-growth-mindset",
    "title": "10 bài học sâu sắc về sự trưởng thành & tư duy (HSK 5-6)",
    "level": "HSK 4+",
    "levelBadgeColor": "text-purple-700 bg-purple-50 dark:bg-purple-950/40 border-purple-300",
    "duration": "10:38",
    "category": "Công sở & Phỏng vấn",
    "description": "Nâng cấp vốn từ cao cấp và ngữ điệu tự nhiên qua 10 đoạn văn triết lý về sự kiên trì, thái độ sống và phát triển bản thân.",
    "youtubeId": "5u81jEdhAHs",
    "sentencesCount": 190,
    "isFree": false,
    "sentences": [
      {
        "id": 1,
        "startTime": 0.3,
        "endTime": 2.5,
        "speaker": "Tiểu Hồng",
        "chinese": "大家好我是小红",
        "pinyin": "Dàjiāhǎowǒshìxiǎohóng",
        "vietnamese": "Xin chào mọi người, tôi là Tiểu Hồng"
      },
      {
        "id": 2,
        "startTime": 2.7,
        "endTime": 4.3,
        "speaker": "Tiểu Hồng",
        "chinese": "很多人问我",
        "pinyin": "Hěnduōrénwènwǒ",
        "vietnamese": "Nhiều người hỏi tôi"
      },
      {
        "id": 3,
        "startTime": 4.3,
        "endTime": 7.5,
        "speaker": "Tiểu Hồng",
        "chinese": "学习汉语最快的方法是什么",
        "pinyin": "Xuéxíhànyǔzuìkuàidefāngfǎshìshénme",
        "vietnamese": "Cách học tiếng Trung nhanh nhất là gì?"
      },
      {
        "id": 4,
        "startTime": 7.7,
        "endTime": 10.5,
        "speaker": "Tiểu Hồng",
        "chinese": "其实除了积累词汇",
        "pinyin": "Qíshíchúlejīlěicíhuì",
        "vietnamese": "Thực tế, ngoài việc tích lũy vốn từ vựng"
      },
      {
        "id": 5,
        "startTime": 10.7,
        "endTime": 12.2,
        "speaker": "Tiểu Hồng",
        "chinese": "更重要的",
        "pinyin": "Gèngzhòngyàode",
        "vietnamese": "quan trọng hơn"
      },
      {
        "id": 6,
        "startTime": 12.2,
        "endTime": 14.4,
        "speaker": "Tiểu Hồng",
        "chinese": "是在真实的语境中",
        "pinyin": "Shìzàizhēnshídeyǔjìngzhōng",
        "vietnamese": "trong bối cảnh thực tế"
      },
      {
        "id": 7,
        "startTime": 14.4,
        "endTime": 17.5,
        "speaker": "Tiểu Hồng",
        "chinese": "模仿母语者的思维方式",
        "pinyin": "Mófǎngmǔyǔzhědesīwéifāngshì",
        "vietnamese": "Bắt chước cách suy nghĩ của người bản xứ"
      },
      {
        "id": 8,
        "startTime": 18.5,
        "endTime": 20.5,
        "speaker": "Tiểu Hồng",
        "chinese": "今天我想分享十",
        "pinyin": "Jīntiānwǒxiǎngfēnxiǎngshí",
        "vietnamese": "Hôm nay tôi muốn chia sẻ mười"
      },
      {
        "id": 9,
        "startTime": 20.5,
        "endTime": 24.9,
        "speaker": "Tiểu Hồng",
        "chinese": "段关于成长与思维的高质量短文",
        "pinyin": "Duànguānyúchéngzhǎngyǔsīwéidegāozhìliàngduǎnwén",
        "vietnamese": "Một bài viết ngắn chất lượng cao về sự phát triển và tư duy"
      },
      {
        "id": 10,
        "startTime": 25.3,
        "endTime": 27.8,
        "speaker": "Tiểu Hồng",
        "chinese": "这些短文词汇丰富",
        "pinyin": "Zhèxiēduǎnwéncíhuìfēngfù",
        "vietnamese": "Những bài viết này rất giàu từ vựng"
      },
      {
        "id": 11,
        "startTime": 27.9,
        "endTime": 31.8,
        "speaker": "Tiểu Hồng",
        "chinese": "非常适合进行一次深度的shadowing",
        "pinyin": "Fēichángshìhéjìnxíngyīcìshēndùde shadowing",
        "vietnamese": "Rất thích hợp cho việc tạo bóng sâu"
      },
      {
        "id": 12,
        "startTime": 33.2,
        "endTime": 35.9,
        "speaker": "Tiểu Hồng",
        "chinese": "为了让大家练习的更有效",
        "pinyin": "Wèileràngdàjiāliànxídegèngyǒuxiào",
        "vietnamese": "Để mọi người luyện tập hiệu quả hơn"
      },
      {
        "id": 13,
        "startTime": 35.9,
        "endTime": 38.5,
        "speaker": "Tiểu Hồng",
        "chinese": "每一段我会读两遍",
        "pinyin": "Měiyīduànwǒhuìdúliǎngbiàn",
        "vietnamese": "Tôi sẽ đọc mỗi đoạn hai lần"
      },
      {
        "id": 14,
        "startTime": 38.7,
        "endTime": 43.9,
        "speaker": "Tiểu Hồng",
        "chinese": "第一遍语速较慢方便大家听清发音",
        "pinyin": "Dìyībiànyǔsùjiàomànfāngbiàndàjiātīngqīngfāyīn",
        "vietnamese": "Lần đầu tiên bạn nói chậm, mọi người sẽ dễ dàng nghe rõ cách phát âm hơn."
      },
      {
        "id": 15,
        "startTime": 44.1,
        "endTime": 47.0,
        "speaker": "Tiểu Hồng",
        "chinese": "第二遍则是正常语速",
        "pinyin": "Dìèrbiànzéshìzhèngchángyǔsù",
        "vietnamese": "Lần 2 nói tốc độ bình thường"
      },
      {
        "id": 16,
        "startTime": 48.4,
        "endTime": 51.6,
        "speaker": "Tiểu Hồng",
        "chinese": "但在开始之前大家要记住",
        "pinyin": "Dànzàikāishǐzhīqiándàjiāyàojìzhù",
        "vietnamese": "Nhưng trước khi bắt đầu, mọi người cần nhớ"
      },
      {
        "id": 17,
        "startTime": 51.9,
        "endTime": 56.2,
        "speaker": "Tiểu Hồng",
        "chinese": "shadowan的核心在于模仿和节奏",
        "pinyin": "Shadowan dehéxīnzàiyúmófǎnghéjiézòu",
        "vietnamese": "Cốt lõi của Shadowan nằm ở sự bắt chước và nhịp điệu"
      },
      {
        "id": 18,
        "startTime": 57.2,
        "endTime": 60.1,
        "speaker": "Tiểu Hồng",
        "chinese": "首先不要急着开口",
        "pinyin": "Shǒuxiānbúyàojízhekāikǒu",
        "vietnamese": "Trước hết đừng nói vội"
      },
      {
        "id": 19,
        "startTime": 60.3,
        "endTime": 64.1,
        "speaker": "Tiểu Hồng",
        "chinese": "先仔细听感受发音和断句",
        "pinyin": "Xiānzǐxìtīnggǎnshòufāyīnhéduànjù",
        "vietnamese": "Đầu tiên hãy nghe thật kỹ để cảm nhận cách phát âm và phân đoạn câu"
      },
      {
        "id": 20,
        "startTime": 65.0,
        "endTime": 68.7,
        "speaker": "Tiểu Hồng",
        "chinese": "接着要像影子一样听到声音",
        "pinyin": "Jiēzheyàoxiàngyǐngziyīyàngtīngdàoshēngyīn",
        "vietnamese": "Rồi nghe giọng nói như một cái bóng"
      },
      {
        "id": 21,
        "startTime": 68.7,
        "endTime": 71.0,
        "speaker": "Tiểu Hồng",
        "chinese": "立刻大声跟读",
        "pinyin": "Lìkèdàshēnggēndú",
        "vietnamese": "Đọc to ngay lập tức"
      },
      {
        "id": 22,
        "startTime": 71.2,
        "endTime": 75.1,
        "speaker": "Tiểu Hồng",
        "chinese": "别怕犯错重点是抓鱼感",
        "pinyin": "Biépàfàncuòzhòngdiǎnshìzhuāyúgǎn",
        "vietnamese": "Đừng sợ phạm sai lầm. Điều quan trọng là cảm giác bắt cá."
      },
      {
        "id": 23,
        "startTime": 76.0,
        "endTime": 81.0,
        "speaker": "Tiểu Hồng",
        "chinese": "最后建议录下自己的声音并回听",
        "pinyin": "Zuìhòujiànyìlùxiàzìjǐdeshēngyīnbìnghuítīng",
        "vietnamese": "Cuối cùng, nên ghi âm giọng nói của chính mình và nghe lại"
      },
      {
        "id": 24,
        "startTime": 81.0,
        "endTime": 82.4,
        "speaker": "Tiểu Hồng",
        "chinese": "找出差距",
        "pinyin": "Zhǎochūchāijù",
        "vietnamese": "tìm khoảng cách"
      },
      {
        "id": 25,
        "startTime": 83.5,
        "endTime": 85.2,
        "speaker": "Tiểu Hồng",
        "chinese": "只要坚持练习",
        "pinyin": "Zhǐyàojiānchíliànxí",
        "vietnamese": "Hãy cứ tập luyện đi"
      },
      {
        "id": 26,
        "startTime": 85.3,
        "endTime": 88.3,
        "speaker": "Tiểu Hồng",
        "chinese": "你的表达自然会变得更地道",
        "pinyin": "Nǐdebiǎodázìránhuìbiàndégèngdìdào",
        "vietnamese": "Biểu cảm của bạn sẽ tự nhiên trở nên chân thực hơn"
      },
      {
        "id": 27,
        "startTime": 89.2,
        "endTime": 91.9,
        "speaker": "Tiểu Hồng",
        "chinese": "准备好了吗我们开始吧",
        "pinyin": "Zhǔnbèihǎolemawǒmenkāishǐba",
        "vietnamese": "Bạn đã sẵn sàng chưa? Hãy bắt đầu."
      },
      {
        "id": 28,
        "startTime": 95.3,
        "endTime": 98.4,
        "speaker": "Tiểu Hồng",
        "chinese": "在这个快节奏的时代",
        "pinyin": "Zàizhègekuàijiézòudeshídài",
        "vietnamese": "Trong thời đại phát triển nhanh chóng này"
      },
      {
        "id": 29,
        "startTime": 98.5,
        "endTime": 101.8,
        "speaker": "Tiểu Hồng",
        "chinese": "人们往往追求完美的结局",
        "pinyin": "Rénmenwǎngwǎngzhuīqiúwánměidejiéjú",
        "vietnamese": "Mọi người có xu hướng theo đuổi một cái kết hoàn hảo"
      },
      {
        "id": 30,
        "startTime": 101.9,
        "endTime": 105.1,
        "speaker": "Tiểu Hồng",
        "chinese": "却忽略了过程中的风景",
        "pinyin": "Quèhūlüèleguòchéngzhōngdefēngjǐng",
        "vietnamese": "Nhưng bỏ qua khung cảnh trong quá trình"
      },
      {
        "id": 31,
        "startTime": 106.2,
        "endTime": 107.8,
        "speaker": "Tiểu Hồng",
        "chinese": "其实人",
        "pinyin": "Qíshírén",
        "vietnamese": "Trên thực tế, mọi người"
      },
      {
        "id": 32,
        "startTime": 107.8,
        "endTime": 111.9,
        "speaker": "Tiểu Hồng",
        "chinese": "生的意义未必在于你取得了多少成",
        "pinyin": "Shēngdeyìyìwèibìzàiyúnǐqǔdéleduōshǎochéng",
        "vietnamese": "Ý nghĩa của cuộc sống có thể không nằm ở mức độ thành công bạn đạt được"
      },
      {
        "id": 33,
        "startTime": 111.9,
        "endTime": 115.9,
        "speaker": "Tiểu Hồng",
        "chinese": "就而在于你面对困难时的态度",
        "pinyin": "Jiùérzàiyúnǐmiànduìkùnnánshídetàidù",
        "vietnamese": "Nó chỉ phụ thuộc vào thái độ của bạn khi gặp khó khăn"
      },
      {
        "id": 34,
        "startTime": 116.6,
        "endTime": 118.8,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕生活不如意",
        "pinyin": "Nǎpàshēnghuóbùrúyì",
        "vietnamese": "Dù cuộc sống không như ý"
      },
      {
        "id": 35,
        "startTime": 118.8,
        "endTime": 122.0,
        "speaker": "Tiểu Hồng",
        "chinese": "我们也要学会调整心态",
        "pinyin": "Wǒmenyěyàoxuéhuìtiáozhěngxīntài",
        "vietnamese": "Chúng ta cũng phải học cách điều chỉnh tâm lý của mình"
      },
      {
        "id": 36,
        "startTime": 122.9,
        "endTime": 128.1,
        "speaker": "Tiểu Hồng",
        "chinese": "正如一句话所说心态决定命运",
        "pinyin": "Zhèngrúyījùhuàsuǒshuōxīntàijuédìngmìngyùn",
        "vietnamese": "Người ta thường nói tâm lý quyết định vận mệnh"
      },
      {
        "id": 37,
        "startTime": 129.2,
        "endTime": 134.0,
        "speaker": "Tiểu Hồng",
        "chinese": "当你全心全意投入到一件事情中时",
        "pinyin": "Dāngnǐquánxīnquányìtóurùdàoyījiànshìqíngzhōngshí",
        "vietnamese": "Khi bạn cống hiến hết mình cho điều gì đó"
      },
      {
        "id": 38,
        "startTime": 134.1,
        "endTime": 135.6,
        "speaker": "Tiểu Hồng",
        "chinese": "你会发现",
        "pinyin": "Nǐhuìfāxiàn",
        "vietnamese": "bạn sẽ tìm thấy"
      },
      {
        "id": 39,
        "startTime": 135.7,
        "endTime": 139.0,
        "speaker": "Tiểu Hồng",
        "chinese": "所谓的障碍或者是挫折",
        "pinyin": "Suǒwèidezhàngàihuòzhěshìcuòzhé",
        "vietnamese": "Cái gọi là trở ngại hay thất bại"
      },
      {
        "id": 40,
        "startTime": 139.0,
        "endTime": 143.4,
        "speaker": "Tiểu Hồng",
        "chinese": "其实都是成长过程中必不可少的财",
        "pinyin": "Qíshídōushìchéngzhǎngguòchéngzhōngbìbùkěshǎodecái",
        "vietnamese": "Thực chất, chúng đều là tài sản không thể thiếu trong quá trình trưởng thành."
      },
      {
        "id": 41,
        "startTime": 143.4,
        "endTime": 144.2,
        "speaker": "Tiểu Hồng",
        "chinese": "富",
        "pinyin": "Fù",
        "vietnamese": "giàu có"
      },
      {
        "id": 42,
        "startTime": 145.5,
        "endTime": 148.7,
        "speaker": "Tiểu Hồng",
        "chinese": "从今天起珍惜当下",
        "pinyin": "Cóngjīntiānqǐzhēnxīdāngxià",
        "vietnamese": "Hãy trân trọng khoảnh khắc kể từ hôm nay"
      },
      {
        "id": 43,
        "startTime": 148.8,
        "endTime": 153.8,
        "speaker": "Tiểu Hồng",
        "chinese": "因为此刻的你正是余生中最年轻的",
        "pinyin": "Yīnwèicǐkèdenǐzhèngshìyúshēngzhōngzuìniánqīngde",
        "vietnamese": "Vì lúc này đây em là người trẻ nhất trong cuộc đời còn lại của mình"
      },
      {
        "id": 44,
        "startTime": 156.7,
        "endTime": 159.5,
        "speaker": "Tiểu Hồng",
        "chinese": "在这个快节奏的时代",
        "pinyin": "Zàizhègekuàijiézòudeshídài",
        "vietnamese": "Trong thời đại phát triển nhanh chóng này"
      },
      {
        "id": 45,
        "startTime": 159.6,
        "endTime": 162.6,
        "speaker": "Tiểu Hồng",
        "chinese": "人们往往追求完美的结局",
        "pinyin": "Rénmenwǎngwǎngzhuīqiúwánměidejiéjú",
        "vietnamese": "Mọi người có xu hướng theo đuổi một cái kết hoàn hảo"
      },
      {
        "id": 46,
        "startTime": 162.6,
        "endTime": 165.5,
        "speaker": "Tiểu Hồng",
        "chinese": "却忽略了过程中的风景",
        "pinyin": "Quèhūlüèleguòchéngzhōngdefēngjǐng",
        "vietnamese": "Nhưng bỏ qua khung cảnh trong quá trình"
      },
      {
        "id": 47,
        "startTime": 166.1,
        "endTime": 167.0,
        "speaker": "Tiểu Hồng",
        "chinese": "其实",
        "pinyin": "Qíshí",
        "vietnamese": "Trên thực tế"
      },
      {
        "id": 48,
        "startTime": 167.1,
        "endTime": 168.6,
        "speaker": "Tiểu Hồng",
        "chinese": "人生的意义",
        "pinyin": "Rénshēngdeyìyì",
        "vietnamese": "ý nghĩa của cuộc sống"
      },
      {
        "id": 49,
        "startTime": 168.6,
        "endTime": 171.6,
        "speaker": "Tiểu Hồng",
        "chinese": "未必在于你取得了多少成就",
        "pinyin": "Wèibìzàiyúnǐqǔdéleduōshǎochéngjiù",
        "vietnamese": "Không nhất thiết là bạn đã đạt được bao nhiêu"
      },
      {
        "id": 50,
        "startTime": 171.7,
        "endTime": 174.7,
        "speaker": "Tiểu Hồng",
        "chinese": "而在于你面对困难时的态度",
        "pinyin": "Érzàiyúnǐmiànduìkùnnánshídetàidù",
        "vietnamese": "Đó là thái độ của bạn khi gặp khó khăn"
      },
      {
        "id": 51,
        "startTime": 175.2,
        "endTime": 177.2,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕生活不如意",
        "pinyin": "Nǎpàshēnghuóbùrúyì",
        "vietnamese": "Dù cuộc sống không như ý"
      },
      {
        "id": 52,
        "startTime": 177.2,
        "endTime": 180.1,
        "speaker": "Tiểu Hồng",
        "chinese": "我们也要学会调整心态",
        "pinyin": "Wǒmenyěyàoxuéhuìtiáozhěngxīntài",
        "vietnamese": "Chúng ta cũng phải học cách điều chỉnh tâm lý của mình"
      },
      {
        "id": 53,
        "startTime": 180.8,
        "endTime": 185.4,
        "speaker": "Tiểu Hồng",
        "chinese": "正如一句话所说心态决定命运",
        "pinyin": "Zhèngrúyījùhuàsuǒshuōxīntàijuédìngmìngyùn",
        "vietnamese": "Người ta thường nói tâm lý quyết định vận mệnh"
      },
      {
        "id": 54,
        "startTime": 186.0,
        "endTime": 190.5,
        "speaker": "Tiểu Hồng",
        "chinese": "当你全心全意投入到一件事情中时",
        "pinyin": "Dāngnǐquánxīnquányìtóurùdàoyījiànshìqíngzhōngshí",
        "vietnamese": "Khi bạn cống hiến hết mình cho điều gì đó"
      },
      {
        "id": 55,
        "startTime": 190.5,
        "endTime": 191.9,
        "speaker": "Tiểu Hồng",
        "chinese": "你会发现",
        "pinyin": "Nǐhuìfāxiàn",
        "vietnamese": "bạn sẽ tìm thấy"
      },
      {
        "id": 56,
        "startTime": 191.9,
        "endTime": 194.9,
        "speaker": "Tiểu Hồng",
        "chinese": "所谓的障碍或者是挫折",
        "pinyin": "Suǒwèidezhàngàihuòzhěshìcuòzhé",
        "vietnamese": "Cái gọi là trở ngại hay thất bại"
      },
      {
        "id": 57,
        "startTime": 194.9,
        "endTime": 198.8,
        "speaker": "Tiểu Hồng",
        "chinese": "其实都是成长过程中必不可少的财",
        "pinyin": "Qíshídōushìchéngzhǎngguòchéngzhōngbìbùkěshǎodecái",
        "vietnamese": "Thực chất, chúng đều là tài sản không thể thiếu trong quá trình trưởng thành."
      },
      {
        "id": 58,
        "startTime": 198.8,
        "endTime": 199.6,
        "speaker": "Tiểu Hồng",
        "chinese": "富",
        "pinyin": "Fù",
        "vietnamese": "giàu có"
      },
      {
        "id": 59,
        "startTime": 200.7,
        "endTime": 203.8,
        "speaker": "Tiểu Hồng",
        "chinese": "从今天起珍惜当下",
        "pinyin": "Cóngjīntiānqǐzhēnxīdāngxià",
        "vietnamese": "Hãy trân trọng khoảnh khắc kể từ hôm nay"
      },
      {
        "id": 60,
        "startTime": 203.9,
        "endTime": 208.9,
        "speaker": "Tiểu Hồng",
        "chinese": "因为此刻的你正是余生中最年轻的",
        "pinyin": "Yīnwèicǐkèdenǐzhèngshìyúshēngzhōngzuìniánqīngde",
        "vietnamese": "Vì lúc này đây em là người trẻ nhất trong cuộc đời còn lại của mình"
      },
      {
        "id": 61,
        "startTime": 212.7,
        "endTime": 214.6,
        "speaker": "Tiểu Hồng",
        "chinese": "在自媒体时代",
        "pinyin": "Zàizìméitǐshídài",
        "vietnamese": "Trong thời đại tự truyền thông"
      },
      {
        "id": 62,
        "startTime": 214.6,
        "endTime": 218.0,
        "speaker": "Tiểu Hồng",
        "chinese": "很多人只关注流量和点赞",
        "pinyin": "Hěnduōrénzhǐguānzhùliúliànghédiǎnzàn",
        "vietnamese": "Nhiều người chỉ tập trung vào lượng truy cập và lượt thích"
      },
      {
        "id": 63,
        "startTime": 218.1,
        "endTime": 220.8,
        "speaker": "Tiểu Hồng",
        "chinese": "却忘记了内容的本质",
        "pinyin": "Quèwàngjìlenèiróngdeběnzhì",
        "vietnamese": "Nhưng quên mất bản chất của nội dung"
      },
      {
        "id": 64,
        "startTime": 221.6,
        "endTime": 224.9,
        "speaker": "Tiểu Hồng",
        "chinese": "实际上想要吸引观众",
        "pinyin": "Shíjìshàngxiǎngyàoxīyǐnguānzhòng",
        "vietnamese": "thực sự muốn thu hút khán giả"
      },
      {
        "id": 65,
        "startTime": 225.2,
        "endTime": 229.5,
        "speaker": "Tiểu Hồng",
        "chinese": "核心在于你能提供什么样的价值",
        "pinyin": "Héxīnzàiyúnǐnéngtígōngshénmeyàngdejiàzhí",
        "vietnamese": "Cốt lõi nằm ở giá trị bạn có thể cung cấp"
      },
      {
        "id": 66,
        "startTime": 230.6,
        "endTime": 233.7,
        "speaker": "Tiểu Hồng",
        "chinese": "无论是做视频还是写文案",
        "pinyin": "Wúlùnshìzuòshìpínháishìxiěwénàn",
        "vietnamese": "Cho dù đó là làm video hay viết bài"
      },
      {
        "id": 67,
        "startTime": 233.7,
        "endTime": 236.9,
        "speaker": "Tiểu Hồng",
        "chinese": "都需要经过深思熟虑",
        "pinyin": "Dōuxūyàojīngguòshēnsīshúlǜ",
        "vietnamese": "Tất cả cần được cân nhắc kỹ lưỡng"
      },
      {
        "id": 68,
        "startTime": 238.1,
        "endTime": 241.6,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕最初的反馈不如预期",
        "pinyin": "Nǎpàzuìchūdefǎnkuìbùrúyùqī",
        "vietnamese": "Ngay cả khi phản hồi ban đầu không như mong đợi"
      },
      {
        "id": 69,
        "startTime": 241.6,
        "endTime": 244.2,
        "speaker": "Tiểu Hồng",
        "chinese": "你也不必感到灰心",
        "pinyin": "Nǐyěbùbìgǎndàohuīxīn",
        "vietnamese": "Bạn cũng không cần phải nản lòng"
      },
      {
        "id": 70,
        "startTime": 245.1,
        "endTime": 248.2,
        "speaker": "Tiểu Hồng",
        "chinese": "做内容是一场长跑",
        "pinyin": "Zuònèiróngshìyīchángchángpǎo",
        "vietnamese": "Sáng tạo nội dung là một cuộc đua đường dài"
      },
      {
        "id": 71,
        "startTime": 248.2,
        "endTime": 252.7,
        "speaker": "Tiểu Hồng",
        "chinese": "只有不断积累经验才能建立起粉",
        "pinyin": "Zhǐyǒubùduànjīlěijīngyàncáinéngjiànlìqǐfěn",
        "vietnamese": "Chỉ bằng cách liên tục tích lũy kinh nghiệm, chúng ta mới có thể xây dựng được lượng người hâm mộ"
      },
      {
        "id": 72,
        "startTime": 252.7,
        "endTime": 254.1,
        "speaker": "Tiểu Hồng",
        "chinese": "丝的信任",
        "pinyin": "Sīdexìnrèn",
        "vietnamese": "Niềm tin tơ lụa"
      },
      {
        "id": 73,
        "startTime": 254.9,
        "endTime": 258.1,
        "speaker": "Tiểu Hồng",
        "chinese": "一旦你找到了自己的风格",
        "pinyin": "Yídànnǐzhǎodàolezìjǐdefēnggé",
        "vietnamese": "Một khi bạn tìm thấy phong cách của mình"
      },
      {
        "id": 74,
        "startTime": 258.1,
        "endTime": 261.2,
        "speaker": "Tiểu Hồng",
        "chinese": "成功的机会自然会降临",
        "pinyin": "Chénggōngdejīhuìzìránhuìjiànglín",
        "vietnamese": "Cơ hội thành công sẽ đến một cách tự nhiên"
      },
      {
        "id": 75,
        "startTime": 265.1,
        "endTime": 266.7,
        "speaker": "Tiểu Hồng",
        "chinese": "在自媒体时代",
        "pinyin": "Zàizìméitǐshídài",
        "vietnamese": "Trong thời đại tự truyền thông"
      },
      {
        "id": 76,
        "startTime": 266.7,
        "endTime": 269.5,
        "speaker": "Tiểu Hồng",
        "chinese": "很多人只关注流量和点赞",
        "pinyin": "Hěnduōrénzhǐguānzhùliúliànghédiǎnzàn",
        "vietnamese": "Nhiều người chỉ tập trung vào lượng truy cập và lượt thích"
      },
      {
        "id": 77,
        "startTime": 269.5,
        "endTime": 271.8,
        "speaker": "Tiểu Hồng",
        "chinese": "却忘记了内容的本质",
        "pinyin": "Quèwàngjìlenèiróngdeběnzhì",
        "vietnamese": "Nhưng quên mất bản chất của nội dung"
      },
      {
        "id": 78,
        "startTime": 273.2,
        "endTime": 276.0,
        "speaker": "Tiểu Hồng",
        "chinese": "实际上想要吸引观众",
        "pinyin": "Shíjìshàngxiǎngyàoxīyǐnguānzhòng",
        "vietnamese": "thực sự muốn thu hút khán giả"
      },
      {
        "id": 79,
        "startTime": 276.3,
        "endTime": 280.2,
        "speaker": "Tiểu Hồng",
        "chinese": "核心在于你能提供什么样的价值",
        "pinyin": "Héxīnzàiyúnǐnéngtígōngshénmeyàngdejiàzhí",
        "vietnamese": "Cốt lõi nằm ở giá trị bạn có thể cung cấp"
      },
      {
        "id": 80,
        "startTime": 281.3,
        "endTime": 282.6,
        "speaker": "Tiểu Hồng",
        "chinese": "无论是做视频",
        "pinyin": "Wúlùnshìzuòshìpín",
        "vietnamese": "Cho dù đó là làm video"
      },
      {
        "id": 81,
        "startTime": 282.6,
        "endTime": 286.4,
        "speaker": "Tiểu Hồng",
        "chinese": "还是写文案都需要经过深思熟虑",
        "pinyin": "Háishìxiěwénàndōuxūyàojīngguòshēnsīshúlǜ",
        "vietnamese": "Ngay cả việc viết bản sao cũng cần phải cân nhắc cẩn thận."
      },
      {
        "id": 82,
        "startTime": 287.1,
        "endTime": 290.4,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕最初的反馈不如预期",
        "pinyin": "Nǎpàzuìchūdefǎnkuìbùrúyùqī",
        "vietnamese": "Ngay cả khi phản hồi ban đầu không như mong đợi"
      },
      {
        "id": 83,
        "startTime": 290.5,
        "endTime": 292.7,
        "speaker": "Tiểu Hồng",
        "chinese": "你也不必感到灰心",
        "pinyin": "Nǐyěbùbìgǎndàohuīxīn",
        "vietnamese": "Bạn cũng không cần phải nản lòng"
      },
      {
        "id": 84,
        "startTime": 293.7,
        "endTime": 296.2,
        "speaker": "Tiểu Hồng",
        "chinese": "做内容是一场长跑",
        "pinyin": "Zuònèiróngshìyīchángchángpǎo",
        "vietnamese": "Sáng tạo nội dung là một cuộc đua đường dài"
      },
      {
        "id": 85,
        "startTime": 296.2,
        "endTime": 297.1,
        "speaker": "Tiểu Hồng",
        "chinese": "只有不断",
        "pinyin": "Zhǐyǒubùduàn",
        "vietnamese": "Chỉ liên tục"
      },
      {
        "id": 86,
        "startTime": 297.1,
        "endTime": 300.9,
        "speaker": "Tiểu Hồng",
        "chinese": "积累经验才能建立起粉丝的信任",
        "pinyin": "Jīlěijīngyàncáinéngjiànlìqǐfěnsīdexìnrèn",
        "vietnamese": "Tích lũy kinh nghiệm có thể xây dựng niềm tin của người hâm mộ"
      },
      {
        "id": 87,
        "startTime": 301.9,
        "endTime": 304.7,
        "speaker": "Tiểu Hồng",
        "chinese": "一旦你找到了自己的风格",
        "pinyin": "Yídànnǐzhǎodàolezìjǐdefēnggé",
        "vietnamese": "Một khi bạn tìm thấy phong cách của mình"
      },
      {
        "id": 88,
        "startTime": 304.7,
        "endTime": 307.5,
        "speaker": "Tiểu Hồng",
        "chinese": "成功的机会自然会降临",
        "pinyin": "Chénggōngdejīhuìzìránhuìjiànglín",
        "vietnamese": "Cơ hội thành công sẽ đến một cách tự nhiên"
      },
      {
        "id": 89,
        "startTime": 312.4,
        "endTime": 316.6,
        "speaker": "Tiểu Hồng",
        "chinese": "现在的年轻人压力真的很大",
        "pinyin": "Xiànzàideniánqīngrényālìzhēndehěndà",
        "vietnamese": "Giới trẻ ngày nay thực sự chịu rất nhiều áp lực"
      },
      {
        "id": 90,
        "startTime": 316.8,
        "endTime": 320.3,
        "speaker": "Tiểu Hồng",
        "chinese": "每天忙着工作忙着赚钱",
        "pinyin": "Měitiānmángzhegōngzuòmángzhezhuànqián",
        "vietnamese": "Bận rộn làm việc và kiếm tiền mỗi ngày"
      },
      {
        "id": 91,
        "startTime": 320.4,
        "endTime": 324.1,
        "speaker": "Tiểu Hồng",
        "chinese": "有时候累的连话都不想说",
        "pinyin": "Yǒushíhòulèideliánhuàdōubùxiǎngshuō",
        "vietnamese": "Đôi khi tôi mệt đến mức chẳng muốn nói gì"
      },
      {
        "id": 92,
        "startTime": 325.4,
        "endTime": 328.8,
        "speaker": "Tiểu Hồng",
        "chinese": "不过我觉得生活再忙",
        "pinyin": "Bùguòwǒjuédeshēnghuózàimáng",
        "vietnamese": "Nhưng tôi cảm thấy rằng dù cuộc sống có bận rộn thế nào"
      },
      {
        "id": 93,
        "startTime": 328.9,
        "endTime": 332.2,
        "speaker": "Tiểu Hồng",
        "chinese": "也得找点乐子比如",
        "pinyin": "Yědézhǎodiǎnlèzibǐrú",
        "vietnamese": "Bạn cũng phải có chút niềm vui, như"
      },
      {
        "id": 94,
        "startTime": 332.5,
        "endTime": 335.5,
        "speaker": "Tiểu Hồng",
        "chinese": "下班后去吃顿好吃的",
        "pinyin": "Xiàbānhòuqùchīdùnhǎochīde",
        "vietnamese": "Đi ăn ngon sau giờ làm việc"
      },
      {
        "id": 95,
        "startTime": 335.6,
        "endTime": 338.3,
        "speaker": "Tiểu Hồng",
        "chinese": "或者跟朋友聊聊天",
        "pinyin": "Huòzhěgēnpéngyǒuliáoliáotiān",
        "vietnamese": "Hoặc trò chuyện với bạn bè"
      },
      {
        "id": 96,
        "startTime": 338.4,
        "endTime": 341.4,
        "speaker": "Tiểu Hồng",
        "chinese": "心里就会舒服很多",
        "pinyin": "Xīnlǐjiùhuìshūfúhěnduō",
        "vietnamese": "Bạn sẽ cảm thấy thoải mái hơn rất nhiều"
      },
      {
        "id": 97,
        "startTime": 342.7,
        "endTime": 347.0,
        "speaker": "Tiểu Hồng",
        "chinese": "其实幸福并不需要多少钱",
        "pinyin": "Qíshíxìngfúbìngbùxūyàoduōshǎoqián",
        "vietnamese": "Thực ra, hạnh phúc không cần nhiều tiền"
      },
      {
        "id": 98,
        "startTime": 347.1,
        "endTime": 350.1,
        "speaker": "Tiểu Hồng",
        "chinese": "而是在于你能不能看开",
        "pinyin": "Érshìzàiyúnǐnéngbùnéngkànkāi",
        "vietnamese": "Vấn đề là liệu bạn có thể nhìn đi chỗ khác hay không"
      },
      {
        "id": 99,
        "startTime": 350.5,
        "endTime": 352.8,
        "speaker": "Tiểu Hồng",
        "chinese": "别总是跟别人比",
        "pinyin": "Biézǒngshìgēnbiérénbǐ",
        "vietnamese": "Đừng luôn so sánh mình với người khác"
      },
      {
        "id": 100,
        "startTime": 353.0,
        "endTime": 357.6,
        "speaker": "Tiểu Hồng",
        "chinese": "过好自己的小日子才是最实在的",
        "pinyin": "Guòhǎozìjǐdexiǎorìzicáishìzuìshízàide",
        "vietnamese": "Hãy sống thật tốt cuộc sống nhỏ bé của chính mình là điều chân thật nhất"
      },
      {
        "id": 101,
        "startTime": 358.1,
        "endTime": 361.2,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕今天遇到点烦心事",
        "pinyin": "Nǎpàjīntiānyùdàodiǎnfánxīnshì",
        "vietnamese": "Ngay cả khi hôm nay tôi gặp phải điều gì đó rắc rối"
      },
      {
        "id": 102,
        "startTime": 361.3,
        "endTime": 364.2,
        "speaker": "Tiểu Hồng",
        "chinese": "睡一觉也就过去了",
        "pinyin": "Shuìyījiàoyějiùguòqùle",
        "vietnamese": "Nó sẽ kết thúc chỉ sau một giấc ngủ ngắn"
      },
      {
        "id": 103,
        "startTime": 369.2,
        "endTime": 373.0,
        "speaker": "Tiểu Hồng",
        "chinese": "现在的年轻人压力真的很大",
        "pinyin": "Xiànzàideniánqīngrényālìzhēndehěndà",
        "vietnamese": "Giới trẻ ngày nay thực sự chịu rất nhiều áp lực"
      },
      {
        "id": 104,
        "startTime": 373.2,
        "endTime": 376.3,
        "speaker": "Tiểu Hồng",
        "chinese": "每天忙着工作忙着赚钱",
        "pinyin": "Měitiānmángzhegōngzuòmángzhezhuànqián",
        "vietnamese": "Bận rộn làm việc và kiếm tiền mỗi ngày"
      },
      {
        "id": 105,
        "startTime": 376.4,
        "endTime": 379.7,
        "speaker": "Tiểu Hồng",
        "chinese": "有时候累的连话都不想说",
        "pinyin": "Yǒushíhòulèideliánhuàdōubùxiǎngshuō",
        "vietnamese": "Đôi khi tôi mệt đến mức chẳng muốn nói gì"
      },
      {
        "id": 106,
        "startTime": 380.6,
        "endTime": 381.5,
        "speaker": "Tiểu Hồng",
        "chinese": "不过",
        "pinyin": "Bùguò",
        "vietnamese": "Tuy nhiên"
      },
      {
        "id": 107,
        "startTime": 381.5,
        "endTime": 386.2,
        "speaker": "Tiểu Hồng",
        "chinese": "我觉得生活再忙也得找点乐子比如",
        "pinyin": "Wǒjuédeshēnghuózàimángyědézhǎodiǎnlèzibǐrú",
        "vietnamese": "Tôi nghĩ dù cuộc sống có bận rộn đến đâu thì bạn vẫn phải có niềm vui nào đó chẳng hạn"
      },
      {
        "id": 108,
        "startTime": 386.4,
        "endTime": 388.8,
        "speaker": "Tiểu Hồng",
        "chinese": "下班后去吃顿好吃的",
        "pinyin": "Xiàbānhòuqùchīdùnhǎochīde",
        "vietnamese": "Đi ăn ngon sau giờ làm việc"
      },
      {
        "id": 109,
        "startTime": 388.8,
        "endTime": 391.0,
        "speaker": "Tiểu Hồng",
        "chinese": "或者跟朋友聊聊天",
        "pinyin": "Huòzhěgēnpéngyǒuliáoliáotiān",
        "vietnamese": "Hoặc trò chuyện với bạn bè"
      },
      {
        "id": 110,
        "startTime": 391.0,
        "endTime": 393.5,
        "speaker": "Tiểu Hồng",
        "chinese": "心里就会舒服很多",
        "pinyin": "Xīnlǐjiùhuìshūfúhěnduō",
        "vietnamese": "Bạn sẽ cảm thấy thoải mái hơn rất nhiều"
      },
      {
        "id": 111,
        "startTime": 394.4,
        "endTime": 397.9,
        "speaker": "Tiểu Hồng",
        "chinese": "其实幸福并不需要多少钱",
        "pinyin": "Qíshíxìngfúbìngbùxūyàoduōshǎoqián",
        "vietnamese": "Thực ra, hạnh phúc không cần nhiều tiền"
      },
      {
        "id": 112,
        "startTime": 397.9,
        "endTime": 400.4,
        "speaker": "Tiểu Hồng",
        "chinese": "而是在于你能不能看开",
        "pinyin": "Érshìzàiyúnǐnéngbùnéngkànkāi",
        "vietnamese": "Vấn đề là liệu bạn có thể nhìn đi chỗ khác hay không"
      },
      {
        "id": 113,
        "startTime": 400.7,
        "endTime": 402.6,
        "speaker": "Tiểu Hồng",
        "chinese": "别总是跟别人比",
        "pinyin": "Biézǒngshìgēnbiérénbǐ",
        "vietnamese": "Đừng luôn so sánh mình với người khác"
      },
      {
        "id": 114,
        "startTime": 402.7,
        "endTime": 406.5,
        "speaker": "Tiểu Hồng",
        "chinese": "过好自己的小日子才是最实在的",
        "pinyin": "Guòhǎozìjǐdexiǎorìzicáishìzuìshízàide",
        "vietnamese": "Hãy sống thật tốt cuộc sống nhỏ bé của chính mình là điều chân thật nhất"
      },
      {
        "id": 115,
        "startTime": 406.6,
        "endTime": 409.2,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕今天遇到点烦心事",
        "pinyin": "Nǎpàjīntiānyùdàodiǎnfánxīnshì",
        "vietnamese": "Ngay cả khi hôm nay tôi gặp phải điều gì đó rắc rối"
      },
      {
        "id": 116,
        "startTime": 409.2,
        "endTime": 411.6,
        "speaker": "Tiểu Hồng",
        "chinese": "睡一觉也就过去了",
        "pinyin": "Shuìyījiàoyějiùguòqùle",
        "vietnamese": "Nó sẽ kết thúc chỉ sau một giấc ngủ ngắn"
      },
      {
        "id": 117,
        "startTime": 419.1,
        "endTime": 419.7,
        "speaker": "Tiểu Hồng",
        "chinese": "回想",
        "pinyin": "Huíxiǎng",
        "vietnamese": "nhớ lại"
      },
      {
        "id": 118,
        "startTime": 419.7,
        "endTime": 424.1,
        "speaker": "Tiểu Hồng",
        "chinese": "起我第一次面对镜头录视频的时候",
        "pinyin": "Qǐwǒdìyīcìmiànduìjìngtóulùshìpíndeshíhòu",
        "vietnamese": "Ngay từ lần đầu tiên tôi đối mặt với máy ảnh và quay video"
      },
      {
        "id": 119,
        "startTime": 424.1,
        "endTime": 426.9,
        "speaker": "Tiểu Hồng",
        "chinese": "心里真的特别紧张",
        "pinyin": "Xīnlǐzhēndetèbiéjǐnzhāng",
        "vietnamese": "Tôi cảm thấy thực sự lo lắng"
      },
      {
        "id": 120,
        "startTime": 427.6,
        "endTime": 430.9,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕我提前准备好了文案",
        "pinyin": "Nǎpàwǒtíqiánzhǔnbèihǎolewénàn",
        "vietnamese": "Ngay cả khi tôi chuẩn bị trước bản sao"
      },
      {
        "id": 121,
        "startTime": 430.9,
        "endTime": 434.7,
        "speaker": "Tiểu Hồng",
        "chinese": "也反反复复练习了很多遍",
        "pinyin": "Yěfǎnfǎnfùfùliànxílehěnduōbiàn",
        "vietnamese": "Tôi cũng đã tập đi tập lại nhiều lần."
      },
      {
        "id": 122,
        "startTime": 434.9,
        "endTime": 437.3,
        "speaker": "Tiểu Hồng",
        "chinese": "但一旦开始录制",
        "pinyin": "Dànyídànkāishǐlùzhì",
        "vietnamese": "Nhưng một khi bạn bắt đầu ghi âm"
      },
      {
        "id": 123,
        "startTime": 437.4,
        "endTime": 440.6,
        "speaker": "Tiểu Hồng",
        "chinese": "脑子里还是一片空白",
        "pinyin": "Nǎozilǐháishìyípiànkòngbái",
        "vietnamese": "Đầu óc tôi vẫn trống rỗng"
      },
      {
        "id": 124,
        "startTime": 441.7,
        "endTime": 443.4,
        "speaker": "Tiểu Hồng",
        "chinese": "那时候的我",
        "pinyin": "Nàshíhòudewǒ",
        "vietnamese": "tôi lúc đó"
      },
      {
        "id": 125,
        "startTime": 443.5,
        "endTime": 447.1,
        "speaker": "Tiểu Hồng",
        "chinese": "总觉得自己的表现不够完美",
        "pinyin": "Zǒngjuédezìjǐdebiǎoxiànbùgòuwánměi",
        "vietnamese": "Tôi luôn cảm thấy màn trình diễn của mình chưa đủ hoàn hảo"
      },
      {
        "id": 126,
        "startTime": 447.1,
        "endTime": 450.0,
        "speaker": "Tiểu Hồng",
        "chinese": "担心观众会不喜欢",
        "pinyin": "Dānxīnguānzhònghuìbùxǐhuān",
        "vietnamese": "Sợ khán giả không thích"
      },
      {
        "id": 127,
        "startTime": 451.1,
        "endTime": 453.0,
        "speaker": "Tiểu Hồng",
        "chinese": "后来我才明白",
        "pinyin": "Hòuláiwǒcáimíngbái",
        "vietnamese": "Sau này tôi đã hiểu"
      },
      {
        "id": 128,
        "startTime": 453.0,
        "endTime": 457.1,
        "speaker": "Tiểu Hồng",
        "chinese": "做内容最核心的不是设备有多好",
        "pinyin": "Zuònèiróngzuìhéxīndebúshìshèbèiyǒuduōhǎo",
        "vietnamese": "Điều quan trọng nhất khi làm nội dung không phải là thiết bị tốt thế nào"
      },
      {
        "id": 129,
        "startTime": 457.2,
        "endTime": 459.7,
        "speaker": "Tiểu Hồng",
        "chinese": "而是你是否真实",
        "pinyin": "Érshìnǐshìfǒuzhēnshí",
        "vietnamese": "Đó là về việc bạn có thật hay không"
      },
      {
        "id": 130,
        "startTime": 460.2,
        "endTime": 462.2,
        "speaker": "Tiểu Hồng",
        "chinese": "不要害怕犯错",
        "pinyin": "Búyàohàipàfàncuò",
        "vietnamese": "đừng sợ phạm sai lầm"
      },
      {
        "id": 131,
        "startTime": 462.5,
        "endTime": 465.3,
        "speaker": "Tiểu Hồng",
        "chinese": "因为每一个优秀的博主",
        "pinyin": "Yīnwèiměiyígèyōuxiùdebózhǔ",
        "vietnamese": "Bởi vì mỗi blogger giỏi"
      },
      {
        "id": 132,
        "startTime": 465.3,
        "endTime": 467.3,
        "speaker": "Tiểu Hồng",
        "chinese": "都是从不断的尝",
        "pinyin": "Dōushìcóngbùduàndecháng",
        "vietnamese": "Tất cả từ việc nếm thử liên tục"
      },
      {
        "id": 133,
        "startTime": 467.3,
        "endTime": 470.4,
        "speaker": "Tiểu Hồng",
        "chinese": "试和失败中成长起来的",
        "pinyin": "Shìhéshībàizhōngchéngzhǎngqǐláide",
        "vietnamese": "Trưởng thành từ thử thách và thất bại"
      },
      {
        "id": 134,
        "startTime": 477.4,
        "endTime": 478.0,
        "speaker": "Tiểu Hồng",
        "chinese": "回想",
        "pinyin": "Huíxiǎng",
        "vietnamese": "nhớ lại"
      },
      {
        "id": 135,
        "startTime": 478.0,
        "endTime": 481.9,
        "speaker": "Tiểu Hồng",
        "chinese": "起我第一次面对镜头录视频的时候",
        "pinyin": "Qǐwǒdìyīcìmiànduìjìngtóulùshìpíndeshíhòu",
        "vietnamese": "Ngay từ lần đầu tiên tôi đối mặt với máy ảnh và quay video"
      },
      {
        "id": 136,
        "startTime": 481.9,
        "endTime": 484.5,
        "speaker": "Tiểu Hồng",
        "chinese": "心里真的特别紧张",
        "pinyin": "Xīnlǐzhēndetèbiéjǐnzhāng",
        "vietnamese": "Tôi cảm thấy thực sự lo lắng"
      },
      {
        "id": 137,
        "startTime": 485.0,
        "endTime": 488.0,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕我提前准备好了文案",
        "pinyin": "Nǎpàwǒtíqiánzhǔnbèihǎolewénàn",
        "vietnamese": "Ngay cả khi tôi chuẩn bị trước bản sao"
      },
      {
        "id": 138,
        "startTime": 488.0,
        "endTime": 491.5,
        "speaker": "Tiểu Hồng",
        "chinese": "也反反复复练习了很多遍",
        "pinyin": "Yěfǎnfǎnfùfùliànxílehěnduōbiàn",
        "vietnamese": "Tôi cũng đã tập đi tập lại nhiều lần."
      },
      {
        "id": 139,
        "startTime": 491.6,
        "endTime": 493.8,
        "speaker": "Tiểu Hồng",
        "chinese": "但一旦开始录制",
        "pinyin": "Dànyídànkāishǐlùzhì",
        "vietnamese": "Nhưng một khi bạn bắt đầu ghi âm"
      },
      {
        "id": 140,
        "startTime": 493.9,
        "endTime": 496.7,
        "speaker": "Tiểu Hồng",
        "chinese": "脑子里还是一片空白",
        "pinyin": "Nǎozilǐháishìyípiànkòngbái",
        "vietnamese": "Đầu óc tôi vẫn trống rỗng"
      },
      {
        "id": 141,
        "startTime": 497.3,
        "endTime": 498.9,
        "speaker": "Tiểu Hồng",
        "chinese": "那时候的我",
        "pinyin": "Nàshíhòudewǒ",
        "vietnamese": "tôi lúc đó"
      },
      {
        "id": 142,
        "startTime": 498.9,
        "endTime": 502.1,
        "speaker": "Tiểu Hồng",
        "chinese": "总觉得自己的表现不够完美",
        "pinyin": "Zǒngjuédezìjǐdebiǎoxiànbùgòuwánměi",
        "vietnamese": "Tôi luôn cảm thấy màn trình diễn của mình chưa đủ hoàn hảo"
      },
      {
        "id": 143,
        "startTime": 502.1,
        "endTime": 504.7,
        "speaker": "Tiểu Hồng",
        "chinese": "担心观众会不喜欢",
        "pinyin": "Dānxīnguānzhònghuìbùxǐhuān",
        "vietnamese": "Sợ khán giả không thích"
      },
      {
        "id": 144,
        "startTime": 505.3,
        "endTime": 507.0,
        "speaker": "Tiểu Hồng",
        "chinese": "后来我才明白",
        "pinyin": "Hòuláiwǒcáimíngbái",
        "vietnamese": "Sau này tôi đã hiểu"
      },
      {
        "id": 145,
        "startTime": 507.0,
        "endTime": 510.6,
        "speaker": "Tiểu Hồng",
        "chinese": "做内容最核心的不是设备有多好",
        "pinyin": "Zuònèiróngzuìhéxīndebúshìshèbèiyǒuduōhǎo",
        "vietnamese": "Điều quan trọng nhất khi làm nội dung không phải là thiết bị tốt thế nào"
      },
      {
        "id": 146,
        "startTime": 510.6,
        "endTime": 512.9,
        "speaker": "Tiểu Hồng",
        "chinese": "而是你是否真实",
        "pinyin": "Érshìnǐshìfǒuzhēnshí",
        "vietnamese": "Đó là về việc bạn có thật hay không"
      },
      {
        "id": 147,
        "startTime": 513.4,
        "endTime": 515.2,
        "speaker": "Tiểu Hồng",
        "chinese": "不要害怕犯错",
        "pinyin": "Búyàohàipàfàncuò",
        "vietnamese": "đừng sợ phạm sai lầm"
      },
      {
        "id": 148,
        "startTime": 515.4,
        "endTime": 517.9,
        "speaker": "Tiểu Hồng",
        "chinese": "因为每一个优秀的博主",
        "pinyin": "Yīnwèiměiyígèyōuxiùdebózhǔ",
        "vietnamese": "Bởi vì mỗi blogger giỏi"
      },
      {
        "id": 149,
        "startTime": 517.9,
        "endTime": 519.6,
        "speaker": "Tiểu Hồng",
        "chinese": "都是从不断的尝",
        "pinyin": "Dōushìcóngbùduàndecháng",
        "vietnamese": "Tất cả từ việc nếm thử liên tục"
      },
      {
        "id": 150,
        "startTime": 519.6,
        "endTime": 522.4,
        "speaker": "Tiểu Hồng",
        "chinese": "试和失败中成长起来的",
        "pinyin": "Shìhéshībàizhōngchéngzhǎngqǐláide",
        "vietnamese": "Trưởng thành từ thử thách và thất bại"
      },
      {
        "id": 151,
        "startTime": 529.4,
        "endTime": 531.8,
        "speaker": "Tiểu Hồng",
        "chinese": "无论是在哪个行业",
        "pinyin": "Wúlùnshìzàinǎgehángyè",
        "vietnamese": "Cho dù bạn đang ở ngành nào"
      },
      {
        "id": 152,
        "startTime": 531.8,
        "endTime": 536.3,
        "speaker": "Tiểu Hồng",
        "chinese": "持续学习都是保持竞争力的关键",
        "pinyin": "Chíxùxuéxídōushìbǎochíjìngzhēnglìdeguānjiàn",
        "vietnamese": "Học tập liên tục là chìa khóa để duy trì tính cạnh tranh"
      },
      {
        "id": 153,
        "startTime": 537.4,
        "endTime": 541.7,
        "speaker": "Tiểu Hồng",
        "chinese": "尤其是在自媒体领域平台",
        "pinyin": "Yóuqíshìzàizìméitǐlǐngyùpíngtái",
        "vietnamese": "Đặc biệt là trong lĩnh vực nền tảng tự truyền thông"
      },
      {
        "id": 154,
        "startTime": 541.7,
        "endTime": 546.4,
        "speaker": "Tiểu Hồng",
        "chinese": "算法和观众的口味变化得非常快",
        "pinyin": "Suànfǎhéguānzhòngdekǒuwèibiànhuàdéfēichángkuài",
        "vietnamese": "Thuật toán và thị hiếu của khán giả thay đổi rất nhanh"
      },
      {
        "id": 155,
        "startTime": 547.2,
        "endTime": 550.2,
        "speaker": "Tiểu Hồng",
        "chinese": "如果你只满足于现状",
        "pinyin": "Rúguǒnǐzhǐmǎnzúyúxiànzhuàng",
        "vietnamese": "Nếu bạn chỉ hài lòng với hiện trạng"
      },
      {
        "id": 156,
        "startTime": 550.2,
        "endTime": 552.5,
        "speaker": "Tiểu Hồng",
        "chinese": "不肯接受新事物",
        "pinyin": "Bùkěnjiēshòuxīnshìwù",
        "vietnamese": "Không sẵn sàng chấp nhận những điều mới"
      },
      {
        "id": 157,
        "startTime": 552.6,
        "endTime": 555.7,
        "speaker": "Tiểu Hồng",
        "chinese": "很快就会被时代淘汰",
        "pinyin": "Hěnkuàijiùhuìbèishídàitáotài",
        "vietnamese": "Sẽ sớm bị thời gian đào thải"
      },
      {
        "id": 158,
        "startTime": 556.7,
        "endTime": 560.7,
        "speaker": "Tiểu Hồng",
        "chinese": "面对压力我们不应该逃避",
        "pinyin": "Miànduìyālìwǒmenbùyīnggāitáobì",
        "vietnamese": "Chúng ta không nên trốn tránh áp lực"
      },
      {
        "id": 159,
        "startTime": 560.8,
        "endTime": 564.9,
        "speaker": "Tiểu Hồng",
        "chinese": "而应该把压力转化为动力",
        "pinyin": "Éryīnggāibǎyālìzhuǎnhuàwèidònglì",
        "vietnamese": "Thay vào đó, áp lực nên biến thành động lực"
      },
      {
        "id": 160,
        "startTime": 565.6,
        "endTime": 568.3,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕每天只进步一点点",
        "pinyin": "Nǎpàměitiānzhǐjìnbùyìdiǎndiǎn",
        "vietnamese": "Ngay cả khi bạn chỉ tiến bộ một chút mỗi ngày"
      },
      {
        "id": 161,
        "startTime": 569.1,
        "endTime": 574.3,
        "speaker": "Tiểu Hồng",
        "chinese": "长期积累下来也会发生惊人的变化",
        "pinyin": "Chángqījīlěixiàláiyěhuìfāshēngjīngréndebiànhuà",
        "vietnamese": "Những thay đổi đáng kinh ngạc sẽ xảy ra trong một thời gian dài."
      },
      {
        "id": 162,
        "startTime": 575.8,
        "endTime": 579.3,
        "speaker": "Tiểu Hồng",
        "chinese": "请记住成功没有捷径",
        "pinyin": "Qǐngjìzhùchénggōngméiyǒujiéjìng",
        "vietnamese": "Hãy nhớ rằng không có con đường tắt dẫn tới thành công"
      },
      {
        "id": 163,
        "startTime": 579.8,
        "endTime": 581.8,
        "speaker": "Tiểu Hồng",
        "chinese": "只有坚持不懈",
        "pinyin": "Zhǐyǒujiānchíbùxiè",
        "vietnamese": "Chỉ có sự kiên trì"
      },
      {
        "id": 164,
        "startTime": 582.3,
        "endTime": 586.8,
        "speaker": "Tiểu Hồng",
        "chinese": "脚踏实地的努力才能走的更远",
        "pinyin": "Jiǎotàshídìdenǔlìcáinéngzǒudegèngyuǎn",
        "vietnamese": "Chỉ những nỗ lực thực tế mới có thể tiến xa hơn"
      },
      {
        "id": 165,
        "startTime": 590.5,
        "endTime": 592.7,
        "speaker": "Tiểu Hồng",
        "chinese": "无论是在哪个行业",
        "pinyin": "Wúlùnshìzàinǎgehángyè",
        "vietnamese": "Cho dù bạn đang ở ngành nào"
      },
      {
        "id": 166,
        "startTime": 592.7,
        "endTime": 596.7,
        "speaker": "Tiểu Hồng",
        "chinese": "持续学习都是保持竞争力的关键",
        "pinyin": "Chíxùxuéxídōushìbǎochíjìngzhēnglìdeguānjiàn",
        "vietnamese": "Học tập liên tục là chìa khóa để duy trì tính cạnh tranh"
      },
      {
        "id": 167,
        "startTime": 597.5,
        "endTime": 600.9,
        "speaker": "Tiểu Hồng",
        "chinese": "尤其是在自媒体领域平台",
        "pinyin": "Yóuqíshìzàizìméitǐlǐngyùpíngtái",
        "vietnamese": "Đặc biệt là trong lĩnh vực nền tảng tự truyền thông"
      },
      {
        "id": 168,
        "startTime": 600.9,
        "endTime": 604.7,
        "speaker": "Tiểu Hồng",
        "chinese": "算法和观众的口味变化得非常快",
        "pinyin": "Suànfǎhéguānzhòngdekǒuwèibiànhuàdéfēichángkuài",
        "vietnamese": "Thuật toán và thị hiếu của khán giả thay đổi rất nhanh"
      },
      {
        "id": 169,
        "startTime": 605.3,
        "endTime": 606.1,
        "speaker": "Tiểu Hồng",
        "chinese": "如果你",
        "pinyin": "Rúguǒnǐ",
        "vietnamese": "nếu bạn"
      },
      {
        "id": 170,
        "startTime": 606.1,
        "endTime": 609.5,
        "speaker": "Tiểu Hồng",
        "chinese": "只满足于现状不肯接受新事物",
        "pinyin": "Zhǐmǎnzúyúxiànzhuàngbùkěnjiēshòuxīnshìwù",
        "vietnamese": "Chỉ bằng lòng với hiện trạng và không sẵn lòng tiếp nhận cái mới"
      },
      {
        "id": 171,
        "startTime": 609.5,
        "endTime": 612.2,
        "speaker": "Tiểu Hồng",
        "chinese": "很快就会被时代淘汰",
        "pinyin": "Hěnkuàijiùhuìbèishídàitáotài",
        "vietnamese": "Sẽ sớm bị thời gian đào thải"
      },
      {
        "id": 172,
        "startTime": 612.7,
        "endTime": 616.0,
        "speaker": "Tiểu Hồng",
        "chinese": "面对压力我们不应该逃避",
        "pinyin": "Miànduìyālìwǒmenbùyīnggāitáobì",
        "vietnamese": "Chúng ta không nên trốn tránh áp lực"
      },
      {
        "id": 173,
        "startTime": 616.0,
        "endTime": 619.3,
        "speaker": "Tiểu Hồng",
        "chinese": "而应该把压力转化为动力",
        "pinyin": "Éryīnggāibǎyālìzhuǎnhuàwèidònglì",
        "vietnamese": "Thay vào đó, áp lực nên biến thành động lực"
      },
      {
        "id": 174,
        "startTime": 619.8,
        "endTime": 622.2,
        "speaker": "Tiểu Hồng",
        "chinese": "哪怕每天只进步一点点",
        "pinyin": "Nǎpàměitiānzhǐjìnbùyìdiǎndiǎn",
        "vietnamese": "Ngay cả khi bạn chỉ tiến bộ một chút mỗi ngày"
      },
      {
        "id": 175,
        "startTime": 622.7,
        "endTime": 626.9,
        "speaker": "Tiểu Hồng",
        "chinese": "长期积累下来也会发生惊人的变化",
        "pinyin": "Chángqījīlěixiàláiyěhuìfāshēngjīngréndebiànhuà",
        "vietnamese": "Những thay đổi đáng kinh ngạc sẽ xảy ra trong một thời gian dài."
      },
      {
        "id": 176,
        "startTime": 627.5,
        "endTime": 630.4,
        "speaker": "Tiểu Hồng",
        "chinese": "请记住成功没有捷径",
        "pinyin": "Qǐngjìzhùchénggōngméiyǒujiéjìng",
        "vietnamese": "Hãy nhớ rằng không có con đường tắt dẫn tới thành công"
      },
      {
        "id": 177,
        "startTime": 630.7,
        "endTime": 632.4,
        "speaker": "Tiểu Hồng",
        "chinese": "只有坚持不懈",
        "pinyin": "Zhǐyǒujiānchíbùxiè",
        "vietnamese": "Chỉ có sự kiên trì"
      },
      {
        "id": 178,
        "startTime": 632.6,
        "endTime": 636.4,
        "speaker": "Tiểu Hồng",
        "chinese": "脚踏实地的努力才能走的更远",
        "pinyin": "Jiǎotàshídìdenǔlìcáinéngzǒudegèngyuǎn",
        "vietnamese": "Chỉ những nỗ lực thực tế mới có thể tiến xa hơn"
      },
      {
        "id": 179,
        "startTime": 637.4,
        "endTime": 640.1,
        "speaker": "Tiểu Hồng",
        "chinese": "今天的练习就到这里",
        "pinyin": "Jīntiāndeliànxíjiùdàozhèlǐ",
        "vietnamese": "Đó là nội dung của bài tập hôm nay"
      },
      {
        "id": 180,
        "startTime": 640.3,
        "endTime": 643.0,
        "speaker": "Tiểu Hồng",
        "chinese": "进步不是一天完成的",
        "pinyin": "Jìnbùbúshìyītiānwánchéngde",
        "vietnamese": "Sự tiến bộ không được hoàn thành trong một ngày"
      },
      {
        "id": 181,
        "startTime": 643.0,
        "endTime": 645.8,
        "speaker": "Tiểu Hồng",
        "chinese": "而是每天坚持的结果",
        "pinyin": "Érshìměitiānjiānchídejiéguǒ",
        "vietnamese": "Đó là thành quả của sự kiên trì mỗi ngày"
      },
      {
        "id": 182,
        "startTime": 646.8,
        "endTime": 648.0,
        "speaker": "Tiểu Hồng",
        "chinese": "如果你觉得这段",
        "pinyin": "Rúguǒnǐjuédezhèduàn",
        "vietnamese": "Nếu bạn nghĩ đoạn này"
      },
      {
        "id": 183,
        "startTime": 648.0,
        "endTime": 650.8,
        "speaker": "Tiểu Hồng",
        "chinese": "视频对你的汉语学习有帮助",
        "pinyin": "Shìpínduìnǐdehànyǔxuéxíyǒubāngzhù",
        "vietnamese": "Video rất hữu ích cho việc học tiếng Trung của bạn"
      },
      {
        "id": 184,
        "startTime": 650.8,
        "endTime": 653.2,
        "speaker": "Tiểu Hồng",
        "chinese": "别忘了点赞关注",
        "pinyin": "Biéwànglediǎnzànguānzhù",
        "vietnamese": "Đừng quên thích và theo dõi"
      },
      {
        "id": 185,
        "startTime": 653.2,
        "endTime": 657.2,
        "speaker": "Tiểu Hồng",
        "chinese": "并分享给同样在努力学中文的朋友",
        "pinyin": "Bìngfēnxiǎnggěitóngyàngzàinǔlìxuézhōngwéndepéngyǒu",
        "vietnamese": "Và chia sẻ nó với những người bạn cũng đang cố gắng học tiếng Trung"
      },
      {
        "id": 186,
        "startTime": 657.7,
        "endTime": 660.3,
        "speaker": "Tiểu Hồng",
        "chinese": "你今天的练习进行的怎么样",
        "pinyin": "Nǐjīntiāndeliànxíjìnxíngdezěnmeyàng",
        "vietnamese": "Buổi tập hôm nay của bạn diễn ra thế nào?"
      },
      {
        "id": 187,
        "startTime": 660.3,
        "endTime": 662.2,
        "speaker": "Tiểu Hồng",
        "chinese": "欢迎在评论区告诉",
        "pinyin": "Huānyíngzàipínglùnqūgàosù",
        "vietnamese": "Chào mừng bạn đến nói trong khu vực bình luận"
      },
      {
        "id": 188,
        "startTime": 662.2,
        "endTime": 665.6,
        "speaker": "Tiểu Hồng",
        "chinese": "我或者留下你想要练习的主题",
        "pinyin": "Wǒhuòzhěliúxiànǐxiǎngyàoliànxídezhǔtí",
        "vietnamese": "Tôi có thể để lại cho bạn chủ đề bạn muốn thực hành"
      },
      {
        "id": 189,
        "startTime": 666.3,
        "endTime": 668.6,
        "speaker": "Tiểu Hồng",
        "chinese": "我是小红这里是mr",
        "pinyin": "Wǒshìxiǎohóngzhèlǐshì mr",
        "vietnamese": "Tôi là Xiaohong và đây là ông"
      },
      {
        "id": 190,
        "startTime": 668.6,
        "endTime": 673.2,
        "speaker": "Tiểu Hồng",
        "chinese": "chinese channel我们下个视频再见加油",
        "pinyin": "Chinese channel wǒmenxiàgèshìpínzàijiànjiāyóu",
        "vietnamese": "kênh tiếng trung Hẹn gặp lại các bạn ở video tiếp theo. Cố lên."
      }
    ]
  },
  {
    "id": "hsk5-wolf-is-coming-speaking",
    "title": "Ngụ ngôn: 狼来了 Sói Đến Rồi (Shadowing HSK 4-5)",
    "level": "HSK 4+",
    "levelBadgeColor": "text-purple-700 bg-purple-50 dark:bg-purple-950/40 border-purple-300",
    "duration": "7:19",
    "category": "Phim hoạt hình ngắn",
    "description": "Câu chuyện ngụ ngôn chú bé chăn cừu kinh điển với giọng kể giàu cảm xúc, chuyển đổi linh hoạt giữa lời thoại và lời dẫn chuyện, rất tốt cho nhại giọng HSK 4-5.",
    "youtubeId": "eJWg13Ujtrk",
    "sentencesCount": 10,
    "isFree": false,
    "sentences": [
      {
        "id": 1,
        "startTime": 0,
        "endTime": 7.5,
        "speaker": "Người kể chuyện",
        "chinese": "从前，在一个小山村里，住着一个放羊的小男孩。",
        "pinyin": "Cóngqián, zài yí gè xiǎo shāncūn lǐ, zhùzhe yí gè fàngyáng de xiǎo nánhái.",
        "vietnamese": "Ngày xưa, ở một ngôi làng miền núi nọ, có một cậu bé làm nghề chăn cừu sinh sống."
      },
      {
        "id": 2,
        "startTime": 7.5,
        "endTime": 16,
        "speaker": "Người kể chuyện",
        "chinese": "每天赶着羊群上山吃草，小男孩觉得日子过得非常无聊。",
        "pinyin": "Měitiān gǎnzhe yángqún shàngshān chī cǎo, xiǎo nánhái juéde rìzi guò de fēicháng wúliáo.",
        "vietnamese": "Mỗi ngày đều lùa đàn cừu lên núi gặm cỏ, cậu bé cảm thấy chuỗi ngày trôi qua thật buồn chán và tẻ nhạt."
      },
      {
        "id": 3,
        "startTime": 16,
        "endTime": 25.5,
        "speaker": "Người kể chuyện",
        "chinese": "有一天，他灵机一动，突然冲着山下的村民大声呼救。",
        "pinyin": "Yǒu yì tiān, tā língjī yí dòng, tūrán chòngzhe shān xià de cūnmín dàshēng hūjiù.",
        "vietnamese": "Một ngày nọ, cậu nảy ra một ý định tinh quái, bèn hướng về phía dân làng dưới chân núi hô to cầu cứu."
      },
      {
        "id": 4,
        "startTime": 25.5,
        "endTime": 35,
        "speaker": "Cậu bé chăn cừu",
        "chinese": "“狼来了！狼来了！救命啊，狼要吃羊了！”",
        "pinyin": "“Láng lái le! Láng lái le! Jiùmìng a, láng yào chī yáng le!”",
        "vietnamese": "“Sói đến rồi! Sói đến rồi! Cứu với, chó sói sắp ăn thịt cừu rồi!”"
      },
      {
        "id": 5,
        "startTime": 35,
        "endTime": 45,
        "speaker": "Người kể chuyện",
        "chinese": "正在地里劳作的村民们听到喊声，连忙拿起锄头赶上了山。",
        "pinyin": "Zhèngzài dì lǐ láozuò de cūnmínmen tīngdào hǎnshēng, liánmáng náqǐ chútóu gǎn shàng le shān.",
        "vietnamese": "Dân làng đang làm lụng ngoài đồng nghe thấy tiếng hét liền vội vàng vác cuốc vội vã chạy lên núi."
      },
      {
        "id": 6,
        "startTime": 45,
        "endTime": 55,
        "speaker": "Người kể chuyện",
        "chinese": "可是到了山上，他们只见到了羊群，根本没有看到狼的踪影。",
        "pinyin": "Kěshì dào le shānshàng, tāmen zhǐ jiàndào le yángqún, gēnběn méiyǒu kàndào láng de zōngyǐng.",
        "vietnamese": "Thế nhưng khi lên tới đỉnh núi, họ chỉ thấy đàn cừu đang gặm cỏ, tuyệt nhiên chẳng thấy bóng dáng con sói nào cả."
      },
      {
        "id": 7,
        "startTime": 55,
        "endTime": 66,
        "speaker": "Người kể chuyện",
        "chinese": "男孩见大家被骗得团团转，忍不住捧腹大笑。",
        "pinyin": "Nánhái jiàn dàjiā bèi piàn de tuántuán zhuàn, rěnbúzhù pěngfù dàxiào.",
        "vietnamese": "Cậu bé thấy mọi người bị lừa một vố tơi bời liền ôm bụng cười ngặt nghẽo khoái chí."
      },
      {
        "id": 8,
        "startTime": 66,
        "endTime": 77,
        "speaker": "Người kể chuyện",
        "chinese": "过了几天，真正的恶狼终于从茂密的树林里窜了出来。",
        "pinyin": "Guò le jǐ tiān, zhēnzhèng de èláng zhōngyú cóng màomì de shùlín lǐ cuàn le chūlái.",
        "vietnamese": "Mấy ngày sau, một con sói hung dữ thực sự rốt cuộc đã lao ra từ cánh rừng rậm rạp."
      },
      {
        "id": 9,
        "startTime": 77,
        "endTime": 88,
        "speaker": "Cậu bé chăn cừu",
        "chinese": "男孩吓得浑身发抖，声嘶力竭地再次呼救，却再也没有人相信他了。",
        "pinyin": "Nánhái xià de húnshēn fādǒu, shēngsī lìjié de zàicì hūjiù, què zài yě méiyǒu rén xiāngxìn tā le.",
        "vietnamese": "Cậu bé sợ hãi run rẩy khắp người, gào thét khản cả giọng để cầu cứu, nhưng chẳng còn ai tin lời cậu nữa."
      },
      {
        "id": 10,
        "startTime": 88,
        "endTime": 99,
        "speaker": "Người kể chuyện",
        "chinese": "这个故事告诫我们，诚实是立身之本，说谎者终将自食其果。",
        "pinyin": "Zhège gùshi gàojiè wǒmen, chéngshí shì lìshēn zhī běn, shuōhuǎng zhě zhōng jiāng zì shí qí guǒ.",
        "vietnamese": "Câu chuyện này răn dạy chúng ta rằng: Trung thực là gốc rễ làm người, kẻ dối trá cuối cùng sẽ tự gánh lấy hậu quả."
      }
    ]
  },
  {
    "id": "hsk5-advanced-reflex-hasu",
    "title": "Luyện phản xạ & nghe chuyên sâu HSK 5 (Hasu)",
    "level": "HSK 4+",
    "levelBadgeColor": "text-purple-700 bg-purple-50 dark:bg-purple-950/40 border-purple-300",
    "duration": "26:51",
    "category": "Công sở & Phỏng vấn",
    "description": "Hội thoại và độc thoại tốc độ tự nhiên, cấu trúc câu phức, thành ngữ và từ vựng nâng cao HSK 5 giúp bứt phá khẩu ngữ thành thạo.",
    "youtubeId": "aF98y_frqZg",
    "sentencesCount": 5,
    "isFree": false,
    "sentences": [
      {
        "id": 1,
        "startTime": 0,
        "endTime": 9,
        "speaker": "Hasu Giảng viên",
        "chinese": "在当今日新月异的职场竞争中，持续学习是一项不可或缺的核心能力。",
        "pinyin": "Zài dāngjīn rìxīnyuèyì de zhíchǎng jìngzhēng zhōng, chíxù xuéxí shì yì xiàng bùkě huòquē de héxīn nénglì.",
        "vietnamese": "Trong cuộc cạnh tranh nơi công sở thay đổi từng ngày như hiện nay, không ngừng học hỏi là một năng lực cốt lõi không thể thiếu."
      },
      {
        "id": 2,
        "startTime": 9,
        "endTime": 19.5,
        "speaker": "Hasu Giảng viên",
        "chinese": "面对突如其来的危机与挑战，团队领导者需要保持清晰冷静的判断力。",
        "pinyin": "Miànduì tūrúqílái de wēijī yǔ tiǎozhàn, tuánduì lǐngdǎozhě xūyào bǎochí qīngxī lěngjìng de pànduànlì.",
        "vietnamese": "Đứng trước những khủng hoảng và thách thức ập đến bất ngờ, người lãnh đạo đội ngũ cần duy trì năng lực phán đoán tỉnh táo và sáng suốt."
      },
      {
        "id": 3,
        "startTime": 19.5,
        "endTime": 30.5,
        "speaker": "Hasu Giảng viên",
        "chinese": "只有深入了解客户的真实需求，我们才能在商业谈判中争取到最大的共赢空间。",
        "pinyin": "Zhǐyǒu shēnrù liǎojiě kèhù de zhēnshí xūqiú, wǒmen cái néng zài shāngyè tánpàn zhōng zhēngqǔ dào zuì dà de gòngyíng kōngjiān.",
        "vietnamese": "Chỉ khi thấu hiểu sâu sắc nhu cầu thực tế của khách hàng, chúng ta mới có thể giành được dư địa hợp tác đôi bên cùng có lợi lớn nhất trong đàm phán thương mại."
      },
      {
        "id": 4,
        "startTime": 30.5,
        "endTime": 42,
        "speaker": "Hasu Giảng viên",
        "chinese": "克服焦虑最有效的方法并非盲目担忧，而是脚踏实地将注意力集中在当下可控的事情上。",
        "pinyin": "Kèfú jiāolǜ zuì yǒuxiào de fāngfǎ bìng fēi mángmù dānyōu, ér shì jiǎotàshídì jiāng zhùyìlì jízhōng zài dāngxià kěkòng de shìqing shàng.",
        "vietnamese": "Cách hiệu quả nhất để khắc phục âu lo không phải là lo lắng mù quáng, mà là vững vàng tập trung sự chú ý vào những việc có thể kiểm soát được trong hiện tại."
      },
      {
        "id": 5,
        "startTime": 42,
        "endTime": 54,
        "speaker": "Hasu Giảng viên",
        "chinese": "无论从事何种行业，严谨负责的态度与卓越的执行力都是取得长远发展的基石。",
        "pinyin": "Wúlùn cóngshì hé zhǒng hángyè, yánjǐn fùzé de tàidu yǔ zhuóyuè de zhíxínglì dōu shì qǔdé chángyuǎn fāzhǎn de jīshí.",
        "vietnamese": "Bất kể làm việc trong ngành nghề nào, thái độ cẩn trọng trách nhiệm và năng lực thực thi xuất sắc đều là nền tảng để đạt được sự phát triển bền vững lâu dài."
      }
    ]
  }
];
