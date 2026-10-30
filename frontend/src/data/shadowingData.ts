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
  }
];
