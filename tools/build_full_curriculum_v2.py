import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read current lessons
current_lessons_file = "frontend/src/data/newHsk1Lessons.ts"
with open(current_lessons_file, "r", encoding="utf-8") as f:
    text = f.read()

# Extract json array from ts file
json_str = text.split("export const NEW_HSK1_ALL_LESSONS: CurriculumLesson[] = ")[1].strip()
if json_str.endswith(";"):
    json_str = json_str[:-1]

lessons = json.loads(json_str)

# Authentic Reading Passages (Đoạn văn đọc hiểu) for all 15 lessons
READING_PASSAGES = {
    1: {
        "title": "开学第一天 (Ngày đầu tiên đi học)",
        "content": "今天是开学第一天。王老师来到教室，微笑着对大家说：“同学们好！”学生们礼貌地回答：“老师，您好！”接着，王老师向大家介绍了AI助教小语。学生们高兴地对小语说：“你好，小语！”小语也说：“你们好！很高兴见到大家。”放学的时候，大家互相说：“老师，再见！同学们，再见！”",
        "pinyin": "Jīntiān shì kāixué dì-yī tiān. Wáng lǎoshī lái dào jiàoshì, wēixiào zhe duì dàjiā shuō: 'Tóngxuémen hǎo!' Xuéshengmen lǐmào de huídá: 'Lǎoshī, nín hǎo!' Jiēzhe, Wáng lǎoshī xiàng dàjiā jièshào le AI zhùjiào Xiǎoyǔ. Xuéshengmen gāoxìng de duì Xiǎoyǔ shuō: 'Nǐ hǎo, Xiǎoyǔ!' Xiǎoyǔ yě shuō: 'Nǐmen hǎo! Hěn gāoxìng jiàndào dàjiā.' Fàngxué de shíhou, dàjiā hùxiāng shuō: 'Lǎoshī, zàijiàn! Tóngxuémen, zàijiàn!'",
        "vietnamese": "Hôm nay là ngày đầu tiên tựu trường. Cô giáo Vương bước vào lớp học, mỉm cười nói với cả lớp: 'Chào các em!' Các bạn học sinh lễ phép đáp lời: 'Chúng em chào cô ạ!' Tiếp theo, cô Vương giới thiệu trợ giảng AI Tiểu Ngữ cho cả lớp. Các bạn học sinh vui vẻ nói với Tiểu Ngữ: 'Chào bạn, Tiểu Ngữ!' Tiểu Ngữ cũng đáp: 'Chào các bạn! Rất vui được gặp mọi người.' Lúc tan học, mọi người cùng nói với nhau: 'Tạm biệt cô ạ! Tạm biệt các bạn!'"
    },
    2: {
        "title": "认识新同学 (Làm quen bạn mới)",
        "content": "课堂上，王一飞老师问大家：“请问，你叫什么名字？”一位男同学站起来回答：“老师好，我叫陈天中。”下课后，在美丽的校园里，陈天中看到一位女同学，他上前打招呼说：“你好，安妮！”女同学笑着回答：“你好，陈天中！我不是安妮，我叫白家月。”陈天中不好意思地说：“对不起，我认错了！”白家月说：“没关系！很高兴认识你！”",
        "pinyin": "Kètáng shang, Wáng Yīfēi lǎoshī wèn dàjiā: 'Qǐngwèn, nǐ jiào shénme míngzi?' Yí wèi nán tóngxué zhàn qǐlai huídá: 'Lǎoshī hǎo, wǒ jiào Chén Tiānzhōng.' Xiàkè hòu, zài měilì de xiàoyuán lǐ, Chén Tiānzhōng kàndào yí wèi nǚ tóngxué, tā shàngqián dǎ zhāohu shuō: 'Nǐ hǎo, Ānnī!' Nǚ tóngxué xiào zhe huídá: 'Nǐ hǎo, Chén Tiānzhōng! Wǒ bú shì Ānnī, wǒ jiào Bái Jiāyuè.' Chén Tiānzhōng bù hǎoyìsi de shuō: 'Duìbuqǐ, wǒ rèn cuò le!' Bái Jiāyuè shuō: 'Méi guānxi! Hěn gāoxìng rènshi nǐ!'",
        "vietnamese": "Trên lớp học, thầy giáo Vương Nhất Phi hỏi cả lớp: 'Xin hỏi, em tên là gì?' Một bạn nam đứng dậy thưa: 'Em chào thầy, em tên là Trần Thiên Trung ạ.' Sau giờ học, trong khuôn viên trường xinh xép, Trần Thiên Trung nhìn thấy một bạn nữ, cậu bước tới chào: 'Chào Annie!' Bạn nữ mỉm cười đáp: 'Chào Trần Thiên Trung! Mình không phải Annie đâu, mình tên là Bạch Gia Nguyệt.' Trần Thiên Trung ngại ngùng xin lỗi: 'Xin lỗi bạn nhé, mình nhận nhầm người!' Bạch Gia Nguyệt bảo: 'Không sao đâu! Rất vui được làm quen với bạn!'"
    },
    3: {
        "title": "我们是同学 (Chúng mình là bạn học)",
        "content": "大家好！我叫白家月，我是法国人。陈天中是我同班同学，他是中国人。王一飞是我们的中文老师，他教我们学汉语。李文也是我们的好朋友，她是泰国人。我们大家虽然来自不同的国家，但都在同一个学校学习中文，大家互相帮助，我们都很喜欢学汉语！",
        "pinyin": "Dàjiā hǎo! Wǒ jiào Bái Jiāyuè, wǒ shì Fǎguó rén. Chén Tiānzhōng shì wǒ tóngbān tóngxué, tā shì Zhōngguó rén. Wáng Yīfēi shì wǒmen de Zhōngwén lǎoshī, tā jiāo wǒmen xué Hànyǔ. Lǐ Wén yě shì wǒmen de hǎo péngyou, tā shì Tàiguó rén. Wǒmen dàjiā suīrán láizì bùtóng de guójiā, dàn dōu zài tóng yí ge xuéxiào xuéxí Zhōngwén, dàjiā hùxiāng bāngzhù, wǒmen dōu hěn xǐhuan xué Hànyǔ!",
        "vietnamese": "Chào mọi người! Mình tên là Bạch Gia Nguyệt, mình là người Pháp. Trần Thiên Trung là bạn cùng lớp với mình, bạn ấy là người Trung Quốc. Thầy Vương Nhất Phi là giáo viên dạy tiếng Trung của chúng mình. Lý Văn cũng là người bạn tốt của chúng mình, bạn ấy là người Thái Lan. Chúng mình tuy đến từ các quốc gia khác nhau, nhưng đều đang cùng học tiếng Trung tại một trường, mọi người luôn giúp đỡ lẫn nhau và đều rất yêu thích học tiếng Trung!"
    },
    4: {
        "title": "幸福的一家人 (Gia đình hạnh phúc)",
        "content": "我家有四口人：爸爸、妈妈、一个哥哥和我。我叫杨同乐，今年十八岁。我哥哥今年二十岁，他也是大学生。我还有两个可爱的表弟。安妮家有三口人，她有一个温柔的姐姐。我们常常在周末一起做客，聊天分享各自家里的趣事，感到非常幸福温馨。",
        "pinyin": "Wǒ jiā yǒu sì kǒu rén: bàba, māma, yí gè gēge hé wǒ. Wǒ jiào Yáng Tónglè, jīnnián shíbā suì. Wǒ gēge jīnnián èrshí suì, tā yě shì dàxuéshēng. Wǒ hái yǒu liǎng gè kě'ài de biǎodì. Ānnī jiā yǒu sān kǒu rén, tā yǒu yí gè wēnróu de jiějie. Wǒmen chángcháng zài zhōumò yìqǐ zuòkè, liáotiān fēnxiǎng gèzì jiā lǐ de qùshì, gǎndào fēicháng xìngfú wēnxīn.",
        "vietnamese": "Gia đình tôi có bốn người: bố, mẹ, một người anh trai và tôi. Tôi tên là Dương Đồng Lạc, năm nay 18 tuổi. Anh trai tôi năm nay 20 tuổi, anh ấy cũng là sinh viên đại học. Tôi còn có hai người em họ đáng yêu. Nhà bạn Annie có ba người, bạn ấy có một người chị gái dịu dàng. Chúng tôi thường tụ tập vào cuối tuần, trò chuyện và sẻ chia những điều thú vị trong gia đình, cảm thấy vô cùng hạnh phúc và ấm áp."
    },
    5: {
        "title": "今天我休息 (Hôm nay tôi được nghỉ)",
        "content": "今天是一九九二年五月十六日，星期六。今天我不去公司上班，我休息。我的好朋友李文今天过二十岁生日。李文会做中国菜，她做的面条儿非常好吃。今天晚上，我和陈天中要去李文家吃晚饭，一起祝她生日快乐！",
        "pinyin": "Jīntiān shì yī jiǔ jiǔ èr nián wǔ yuè shíliù rì, xīngqīliù. Jīntiān wǒ bú qù gōngsī shàngbān, wǒ xiūxi. Wǒ de hǎo péngyou Lǐ Wén jīntiān guò èrshí suì shēngrì. Lǐ Wén huì zuò Zhōngguó cài, tā zuò de miàntiáor fēicháng hǎochī. Jīntiān wǎnshang, wǒ hé Chén Tiānzhōng yào qù Lǐ Wén jiā chī wǎnfàn, yìqǐ zhù tā shēngrì kuàilè!",
        "vietnamese": "Hôm nay là thứ bảy, ngày 16 tháng 5 năm 1992. Hôm nay tôi không phải đến công ty đi làm, tôi được nghỉ ngơi. Bạn tốt của tôi là Lý Văn hôm nay đón sinh nhật tròn 20 tuổi. Lý Văn rất khéo tay biết nấu món Trung Quốc, món mì bạn ấy nấu ăn cực kỳ ngon. Tối nay, tôi và Trần Thiên Trung sẽ đến nhà Lý Văn ăn cơm tối, cùng chúc bạn ấy sinh nhật vui vẻ!"
    },
    6: {
        "title": "去超市买东西 (Đi siêu thị mua sắm)",
        "content": "下午下课以后，白家月想去学校对面的大超市买东西。她拿出手机给陈天中打电话：“喂，陈天中！你的手机号是多少？我想去超市买水果和牛奶，你现在想去吗？”陈天中说：“我想去！我们在图书馆前边见吧。”他们一起走到了大超市，买了很多新鲜的水果。",
        "pinyin": "Xiàwǔ xiàkè yǐhòu, Bái Jiāyuè xiǎng qù xuéxiào duìmiàn de dà chāoshì mǎi dōngxi. Tā ná chū shǒujī gěi Chén Tiānzhōng dǎ diànhuà: 'Wèi, Chén Tiānzhōng! Nǐ de shǒujī hào shì duōshao? Wǒ xiǎng qù chāoshì mǎi shuǐguǒ hé niúnǎi, nǐ xiànzài xiǎng qù ma?' Chén Tiānzhōng shuō: 'Wǒ xiǎng qù! Wǒmen zài túshūguǎn qiánmian jiàn ba.' Tāmen yìqǐ zǒu dào le dà chāoshì, mǎi le hěn duō xīnxiān de shuǐguǒ.",
        "vietnamese": "Buổi chiều sau khi tan học, Bạch Gia Nguyệt muốn đến siêu thị lớn đối diện trường để mua đồ. Cô ấy lấy điện thoại ra gọi cho Trần Thiên Trung: 'Alo, Trần Thiên Trung à! Số điện thoại của bạn là bao nhiêu thế? Mình muốn đi siêu thị mua hoa quả và sữa tươi, bây giờ bạn có muốn đi cùng không?' Trần Thiên Trung đáp: 'Mình muốn đi chứ! Chúng mình hẹn gặp nhau ở phía trước thư viện nhé.' Họ cùng nhau đi đến siêu thị lớn và mua được rất nhiều hoa quả tươi ngon."
    },
    7: {
        "title": "忙碌的一天 (Một ngày bận rộn)",
        "content": "李文在一家外贸公司工作。她每天早上七点起床，八点去公司上班。中午十二点，她和同事们一起在公司餐厅吃午饭。下午的工作很多，她常常晚上六点半才下班。今天下班后，陈天中约她一起去吃烤鸭，李文高兴地说：“太好了！我们七点在饭店见吧！”",
        "pinyin": "Lǐ Wén zài yì jiā wàimào gōngsī gōngzuò. Tā měitiān zǎoshang qī diǎn qǐchuáng, bā diǎn qù gōngsī shàngbān. Zhōngwǔ shí'èr diǎn, tā hé tóngshìmen yìqǐ zài gōngsī cāntīng chī wǔfàn. Xiàwǔ de gōngzuò hěn duō, tā chángcháng wǎnshang liù diǎn bàn cái xiàbān. Jīntiān xiàbān hòu, Chén Tiānzhōng yuē tā yìqǐ qù chī kǎoyā, Lǐ Wén gāoxìng de shuō: 'Tài hǎo le! Wǒmen qī diǎn zài fàndiàn jiàn ba!'",
        "vietnamese": "Lý Văn làm việc tại một công ty ngoại thương. Hàng ngày cô thức dậy lúc 7 giờ sáng và đến công ty đi làm lúc 8 giờ. Buổi trưa lúc 12 giờ, cô cùng các đồng nghiệp ăn trưa tại căng tin công ty. Công việc buổi chiều rất nhiều, cô thường phải đến 6 rưỡi tối mới tan làm. Hôm nay sau giờ làm, Trần Thiên Trung rủ cô đi ăn vịt quay, Lý Văn vui mừng nói: 'Tuyệt quá! Chúng ta hẹn gặp nhau lúc 7 giờ ở nhà hàng nhé!'"
    },
    8: {
        "title": "爸爸的工作 (Công việc của bố)",
        "content": "白家月的爸爸是一名优秀的医生，他在北京一家大医院工作。医院离他们家不远，前边有一家大书店。白家月今天下午没有课，她来到医院看望爸爸。爸爸在诊室里认真地给病人看病。白家月对爸爸说：“爸爸，您辛苦了！下班后我们一起去书店买书吧。”",
        "pinyin": "Bái Jiāyuè de bàba shì yì míng yōuxiù de yīshēng, tā zài Běijīng yì jiā dà yīyuàn gōngzuò. Yīyuàn lí tāmen jiā bù yuǎn, qiánmian yǒu yì jiā dà shūdiàn. Bái Jiāyuè jīntiān xiàwǔ méiyǒu kè, tā lái dào yīyuàn kànwàng bàba. Bàba zài zhěnshì lǐ rènzhēn de gěi bìngrén kàn bìng. Bái Jiāyuè duì bàba shuō: 'Bàba, nín xīnkǔ le! Xiàbān hòu wǒmen yìqǐ qù shūdiàn mǎi shū ba.'",
        "vietnamese": "Bố của Bạch Gia Nguyệt là một bác sĩ giỏi, ông làm việc tại một bệnh viện lớn ở Bắc Kinh. Bệnh viện cách nhà họ không xa, phía trước còn có một hiệu sách lớn. Chiều nay Bạch Gia Nguyệt không có tiết học, cô đến bệnh viện thăm bố. Bố đang ở phòng khám chăm chú khám bệnh cho bệnh nhân. Bạch Gia Nguyệt nói với bố: 'Bố ơi, bố vất vả rồi ạ! Tan làm hai bố con mình cùng qua hiệu sách mua sách nhé.'"
    },
    9: {
        "title": "周日计划 (Kế hoạch ngày chủ nhật)",
        "content": "明天是星期天，陈天中和李文都有空。明天上午九点，陈天中要在学校图书馆学习汉语，复习生词。李文也想去学校看书。学校前边有一家很有名的电影院，下午两点他们打算一起看一部新电影。他们约定上午在图书馆见面，下午一起去看电影。",
        "pinyin": "Míngtiān shì xīngqītiān, Chén Tiānzhōng hé Lǐ Wén dōu yǒu kòng. Míngtiān shàngwǔ jiǔ diǎn, Chén Tiānzhōng yào zài xuéxiào túshūguǎn xuéxí Hànyǔ, fùxí shēngcí. Lǐ Wén yě xiǎng qù xuéxiào kàn shū. Xuéxiào qiánmian yǒu yì jiā hěn yǒumíng de diànyǐngyuàn, xiàwǔ liǎng diǎn tāmen dǎsuàn yìqǐ kàn yí bù xīn diànyǐng. Tāmen yuēdìng shàngwǔ zài túshūguǎn jiànmiàn, xiàwǔ yìqǐ qù kàn diànyǐng.",
        "vietnamese": "Ngày mai là chủ nhật, cả Trần Thiên Trung và Lý Văn đều rảnh rỗi. 9 giờ sáng mai, Trần Thiên Trung sẽ học tiếng Trung và ôn tập từ mới tại thư viện trường. Lý Văn cũng muốn đến trường đọc sách. Phía trước trường học có một rạp chiếu phim rất nổi tiếng, 2 giờ chiều hai bạn dự định cùng nhau xem một bộ phim mới. Họ hẹn gặp nhau buổi sáng ở thư viện và buổi chiều cùng đi xem phim."
    },
    10: {
        "title": "水果店买苹果 (Mua táo ở tiệm hoa quả)",
        "content": "学校后门开了一家新的水果店，那里的水果不仅新鲜而且真便宜！红红的大苹果只要四块钱一斤。白家月和安妮一起走进水果店，安妮买了三斤苹果，还买了一个大西瓜。老板算了一下说：“苹果十二块，西瓜十五块，一共二十七块钱。”安妮用手机扫码付了钱，高兴地拎着水果回宿舍。",
        "pinyin": "Xuéxiào hòumén kāi le yì jiā xīn de shuǐguǒdiàn, nàlǐ de shuǐguǒ bùjǐn xīnxiān érqiě zhēn piányi! Hóng hóng de dà píngguǒ zhǐ yào sì kuài qián yì jīn. Bái Jiāyuè hé Ānnī yìqǐ zǒu jìn shuǐguǒdiàn, Ānnī mǎi le sān jīn píngguǒ, hái mǎi le yí gè dà xīguā. Lǎobǎn suàn le yíxià shuō: 'Píngguǒ shí'èr kuài, xīguā shíwǔ kuài, yígòng èrshíqī kuài qián.' Ānnī yòng shǒujī sǎomǎ fù le qián, gāoxìng de līn zhe shuǐguǒ huí sùshè.",
        "vietnamese": "Cửa sau trường học vừa mở một tiệm hoa quả mới, trái cây ở đây không những tươi ngon mà giá lại rất rẻ! Những quả táo đỏ mọng chỉ 4 tệ một cân. Bạch Gia Nguyệt và Annie cùng nhau bước vào tiệm, Annie mua 3 cân táo và thêm một quả dưa hấu lớn. Ông chủ tính tiền bảo: 'Táo 12 tệ, dưa hấu 15 tệ, tổng cộng 27 tệ nhé.' Annie dùng điện thoại quét mã thanh toán rồi vui vẻ xách hoa quả trở về ký túc xá."
    },
    11: {
        "title": "大学生活 (Cuộc sống đại học)",
        "content": "李文今年读大学二年级，她正在学习国际经济。大学的学习生活虽然很忙碌，但她感到十分充实。今天下午，李文正在图书馆里认真地读书做笔记呢。同桌陈天中走过来轻声问她：“李文，下周六学校有汉语演讲比赛，你要不要参加？”李文笑着说：“我要参加，我正在积极准备呢！”",
        "pinyin": "Lǐ Wén jīnnián dú dàxué èr niánjí, tā zhèngzài xuéxí guójì jīngjì. Dàxué de xuéxí shēnghuó suīrán hěn mánglù, dàn tā gǎndào shífēn chōngshí. Jīntiān xiàwǔ, Lǐ Wén zhèngzài túshūguǎn lǐ rènzhēn de dú shū zuò bǐjì ne. Tóngzhuō Chén Tiānzhōng zǒu guòlai qīngshēng wèn tā: 'Lǐ Wén, xià zhōuliù xuéxiào yǒu Hànyǔ yǎnjiǎng bǐsài, nǐ yào bu yào cānjiā?' Lǐ Wén xiào zhe shuō: 'Wǒ yào cānjiā, wǒ zhèngzài jījí zhǔnbèi ne!'",
        "vietnamese": "Lý Văn năm nay học năm thứ hai đại học, cô đang theo học ngành kinh tế quốc tế. Cuộc sống học tập ở giảng đường đại học tuy bận rộn nhưng cô cảm thấy vô cùng ý nghĩa. Chiều nay, Lý Văn đang chăm chú đọc sách và ghi chép trong thư viện. Bạn cùng bàn Trần Thiên Trung bước tới khẽ hỏi: 'Lý Văn ơi, thứ bảy tuần tới trường mình có cuộc thi hùng biện tiếng Trung đấy, bạn có muốn tham gia không?' Lý Văn mỉm cười đáp: 'Mình muốn tham gia chứ, mình đang tích cực chuẩn bị đây!'"
    },
    12: {
        "title": "北京冬天的第一场雪 (Cơn tuyết đầu mùa ở Bắc Kinh)",
        "content": "昨天下雪了！这是今年北京下的第一场雪。早晨推开窗户，外面整个世界都变成了白茫茫的一片，景色美丽极了！虽然天气太冷了，零下五度，但是同学们都非常兴奋，大家都穿上了厚厚的大衣，来到校园的操场上堆雪人、打雪仗。大家玩得太高兴了，欢声笑语洒满了整个校园！",
        "pinyin": "Zuótiān xià xuě le! Zhè shì jīnnián Běijīng xià de dì-yī chǎng xuě. Zǎochén tuīkāi chuānghu, wàimiàn zhěnggè shìjiè dōu biànchéng le bái mángmáng de yí piàn, jǐngsè měilì jí le! Suīrán tiānqì tài lěng le, língxià wǔ dù, dànshì tóngxuémen dōu fēicháng xīngfèn, dàjiā dōu chuān shàng le hòuhòu de dàyī, lái dào xiàoyuán de cāochǎng shang duī xuěrén, dǎ xuězhàng. Dàjiā wán de tài gāoxìng le, huān shēng xiào yǔ sǎ mǎn le zhěnggè xiàoyuán!",
        "vietnamese": "Hôm qua tuyết rơi rồi! Đây là trận tuyết đầu mùa rơi ở Bắc Kinh năm nay. Sáng sớm đẩy cửa sổ ra, cả thế giới bên ngoài đều ngập trong một màu trắng xóa, cảnh sắc đẹp tuyệt vời! Tuy rằng thời tiết quá lạnh, âm 5 độ, nhưng các bạn học sinh đều vô cùng phấn khích, ai nấy đều mặc áo khoác dày, ùa ra sân thể dục đắp người tuyết và ném tuyết. Mọi người chơi đùa vui vẻ khôn xiết, tiếng cười rộn rã khắp cả sân trường!"
    },
    13: {
        "title": "在茶馆品茶 (Thưởng trà tại quán trà)",
        "content": "周末下午，王一飞老师带着外国留学生们来到学校附近的一家传统中国茶馆。大家找了一个靠窗的大桌子坐下。服务员礼貌地走过来问：“各位想喝点什么？”王老师微笑着说：“请给我们来一壶西湖龙井茶，再来几个茶杯。”热气腾腾的茶水端上来了，清香扑鼻。王老师教大家品茶礼仪，大家喝着中国茶，感觉十分惬意。",
        "pinyin": "Zhōumò xiàwǔ, Wáng Yīfēi lǎoshī dài zhe wàiguó liúxuéshēngmen lái dào xuéxiào fùjìn de yì jiā chuántǒng Zhōngguó cháguǎn. Dàjiā zhǎo le yí gè kào chuāng de dà zhuōzi zuò xià. Fúwùyuán lǐmào de zǒu guòlai wèn: 'Gèwèi xiǎng hē diǎnr shénme?' Wáng lǎoshī wēixiào zhe shuō: 'Qǐng gěi wǒmen lái yì hú Xīhú Lóngjǐng chá, zài lái jǐ gè chábēi.' Rè qì téngténg de cháshuǐ duān shànglai le, qīngxiāng pūbí. Wáng lǎoshī jiāo dàjiā pǐn chá lǐyí, dàjiā hē zhe Zhōngguó chá, gǎnjué shífēn qièyì.",
        "vietnamese": "Chiều cuối tuần, thầy giáo Vương Nhất Phi dẫn các bạn lưu học sinh nước ngoài đến một quán trà truyền thống gần trường. Mọi người tìm một chiếc bàn lớn gần cửa sổ ngồi xuống. Người phục vụ lịch sự bước đến hỏi: 'Quý khách muốn dùng đồ uống gì ạ?' Thầy Vương mỉm cười nói: 'Làm ơn cho chúng tôi một ấm trà Long Tỉnh Tây Hồ và thêm mấy chiếc chén nhé.' Bình trà nóng hổi thơm phức được bưng ra. Thầy Vương hướng dẫn mọi người lễ nghi thưởng trà, ai nấy uống trà Trung Hoa và cảm nhận sự thi vị an lành."
    },
    14: {
        "title": "精彩的电影之夜 (Đêm xem phim đặc sắc)",
        "content": "上个星期五晚上，我和同班同学们一起去电影院看了一个新上映的中国电影。电影讲的是一个关于梦想和友谊的故事，演员们演得非常好，情节生动感人。同学们看完了都说这个电影太好看了！看完电影以后，我们还在附近的小吃店吃了热气腾腾的饺子，大家一边吃一边讨论电影里的精彩情节，度过了一个难忘的夜晚。",
        "pinyin": "Shàng ge xīngqīwǔ wǎnshang, wǒ hé tóngbān tóngxuémen yìqǐ qù diànyǐngyuàn kàn le yí gè xīn shàngyìng de Zhōngguó diànyǐng. Diànyǐng jiǎng de shì yí gè guānyú mèngxiǎng hé yǒuyì de gùshi, yǎnyuánmen yǎn de fēicháng hǎo, qíngjié shēngdòng gǎnrén. Tóngxuémen kàn wán le dōu shuō zhè ge diànyǐng tài hǎokàn le! Kàn wán diànyǐng yǐhòu, wǒmen hái zài fùjìn de xiǎochīdiàn chī le rè qì téngténg de jiǎozi, dàjiā yìbiān chī yìbiān tǎolùn diànyǐng lǐ de jīngcǎi qíngjié, dùguò le yí gè nánwàng de yèwǎn.",
        "vietnamese": "Tối thứ sáu tuần trước, tôi cùng các bạn cùng lớp đến rạp chiếu phim xem một bộ phim Trung Quốc mới công chiếu. Bộ phim kể về một câu chuyện cảm động về ước mơ và tình bạn, các diễn viên diễn xuất tuyệt vời, cốt truyện sống động lay động lòng người. Các bạn học sinh xem xong đều tấm tắc khen phim này quá hay! Sau khi xem phim, chúng tôi còn ghé vào tiệm ăn vặt gần đó thưởng thức sủi cảo nóng hổi, vừa ăn vừa rôm rả bàn luận những tình tiết đắt giá, trải qua một buổi tối khó quên."
    },
    15: {
        "title": "大兴机场依依惜别 (Lưu luyến chia tay tại sân bay Đại Hưng)",
        "content": "美好的学习时光过得飞快，学期结束了，安妮要坐飞机回国探亲了。今天上午，王一飞老师、陈天中、李文和白家月都来到了北京大兴国际机场送她。安妮依依不舍地对大家说：“在北京这几个月，我不仅学会了说汉语、写汉字，还认识了这么多好朋友，我太爱中国了！”王老师送给安妮一本精美的汉语书，大家一起在机场合影留念，约定明年新学期北京再见！",
        "pinyin": "Měihǎo de xuéxí shíguāng guò de fēikuài, xuéqī jiéshù le, Ānnī yào zuò fēijī huíguó tànqīn le. Jīntiān shàngwǔ, Wáng Yīfēi lǎoshī, Chén Tiānzhōng, Lǐ Wén hé Bái Jiāyuè dōu lái dào le Běijīng Dàxīng Guójì Jīchǎng sòng tā. Ānnī yīyībùshě de duì dàjiā shuō: 'Zài Běijīng zhè jǐ ge yuè, wǒ bùjǐn xuéhuì le shuō Hànyǔ, xiě Hànzì, hái rènshi le zhème duō hǎo péngyou, wǒ tài ài Zhōngguó le!' Wáng lǎoshī sòng gěi Ānnī yì běn jīngměi de Hànyǔ shū, dàjiā yìqǐ zài jīchǎng héyǐng liúniàn, yuēdìng míngnián xīn xuéqī Běijīng zàijiàn!",
        "vietnamese": "Thời gian học tập tươi đẹp trôi qua thật nhanh chóng, học kỳ đã kết thúc, bạn Annie chuẩn bị đi máy bay về nước thăm gia đình. Sáng hôm nay, thầy giáo Vương Nhất Phi, bạn Trần Thiên Trung, Lý Văn và Bạch Gia Nguyệt đều đã có mặt tại Sân bay quốc tế Đại Hưng Bắc Kinh để tiễn bạn. Annie lưu luyến không nỡ rời xa, xúc động nói với mọi người: 'Những tháng ngày ở Bắc Kinh, mình không chỉ học được nói tiếng Trung, viết chữ Hán, mà còn làm quen được với bao nhiêu người bạn tuyệt vời như các bạn, mình thực sự yêu đất nước Trung Hoa rất nhiều!' Thầy Vương tặng Annie một cuốn sách tiếng Trung được chuẩn bị chu đáo, mọi người cùng chụp tấm ảnh kỷ niệm tại sân bay và hẹn ước gặp lại nhau ở Bắc Kinh vào học kỳ mới năm sau!"
    }
}

# Authentic Listening Comprehension Exercises (听力 - Bài nghe) from book
LISTENING_EXERCISES = {
    1: [
        {
            "id": "nh1_1_lis_1",
            "audioText": "女：老师，您好！男：你好，请坐。",
            "question": "男的是谁？(Người nam là ai?)",
            "questionPinyin": "Nán de shì shéi?",
            "options": ["老师", "学生", "小语"],
            "answerIndex": 0,
            "explanation": "Người nam trả lời '你好，请坐' (Chào em, mời ngồi), chính là Thầy giáo (老师)."
        },
        {
            "id": "nh1_1_lis_2",
            "audioText": "女：谢谢你！男：不客气！再见！",
            "question": "男的说了什么？(Người nam đáp lại thế nào?)",
            "questionPinyin": "Nán de shuō le shénme?",
            "options": ["你好", "不客气", "对不起"],
            "answerIndex": 1,
            "explanation": "Khi đáp lại lời cảm ơn '谢谢你', người nam lịch sự nói '不客气' (Không có chi/Đừng khách sáo)."
        }
    ],
    2: [
        {
            "id": "nh1_2_lis_1",
            "audioText": "男：请问，你叫什么名字？女：我叫白家月，不是安妮。",
            "question": "女的叫什么名字？(Bạn nữ tên là gì?)",
            "questionPinyin": "Nǚ de jiào shénme míngzi?",
            "options": ["安妮", "白家月", "王一飞"],
            "answerIndex": 1,
            "explanation": "Trong đoạn thoại, bạn nữ nói rõ: '我叫白家月，不是安妮' (Mình tên là Bạch Gia Nguyệt, không phải Annie)."
        },
        {
            "id": "nh1_2_lis_2",
            "audioText": "男：对不起！女：没关系！很高兴认识你。",
            "question": "女的回答什么？(Bạn nữ đã trả lời thế nào?)",
            "questionPinyin": "Nǚ de huídá shénme?",
            "options": ["对不起", "没关系", "再见"],
            "answerIndex": 1,
            "explanation": "Khi nghe xin lỗi '对不起', câu đáp lịch sự chuẩn là '没关系' (Không sao đâu)."
        }
    ],
    3: [
        {
            "id": "nh1_3_lis_1",
            "audioText": "男：白家月，你是中国人吗？女：我不是中国人，我是法国人。",
            "question": "白家月是哪国人？(Bạch Gia Nguyệt là người nước nào?)",
            "questionPinyin": "Bái Jiāyuè shì nǎ guó rén?",
            "options": ["中国人", "法国人", "泰国人"],
            "answerIndex": 1,
            "explanation": "Bạch Gia Nguyệt trả lời: '我不是中国人，我是法国人' (Mình là người Pháp)."
        },
        {
            "id": "nh1_3_lis_2",
            "audioText": "女：陈天中是你的中文老师吗？男：他不是老师，他是我同学。",
            "question": "陈天中是谁？(Trần Thiên Trung là ai?)",
            "questionPinyin": "Chén Tiānzhōng shì shéi?",
            "options": ["中文老师", "同班同学", "医生"],
            "answerIndex": 1,
            "explanation": "Trong câu thoại người nam khẳng định: '他是我同学' (Cậu ấy là bạn học của mình)."
        }
    ],
    4: [
        {
            "id": "nh1_4_lis_1",
            "audioText": "女：杨同乐，你有哥哥还是姐姐？男：我没有姐姐，我有一个哥哥。",
            "question": "杨同乐家有什么？(Gia đình Dương Đồng Lạc có ai?)",
            "questionPinyin": "Yáng Tónglè jiā yǒu shénme?",
            "options": ["一个哥哥", "一个姐姐", "两个妹妹"],
            "answerIndex": 0,
            "explanation": "杨同乐 nói rõ: '我没有姐姐，我有一个哥哥' (Tôi có một người anh trai)."
        },
        {
            "id": "nh1_4_lis_2",
            "audioText": "女：你家有几口人？男：我家有四口人，爸爸、妈妈、哥哥和我。",
            "question": "他家有几口人？(Nhà cậu ấy có mấy người?)",
            "questionPinyin": "Tā jiā yǒu jǐ kǒu rén?",
            "options": ["三口人", "四口人", "五口人"],
            "answerIndex": 1,
            "explanation": "Câu trả lời là: '我家有四口人' (Nhà tôi có 4 người)."
        }
    ],
    5: [
        {
            "id": "nh1_5_lis_1",
            "audioText": "女：杨同乐，你会做中国菜吗？男：我不会做菜，但我会做面条儿。",
            "question": "杨同乐会做什么？(Dương Đồng Lạc biết làm gì?)",
            "questionPinyin": "Yáng Tónglè huì zuò shénme?",
            "options": ["会做菜", "会做面条儿", "不会做饭"],
            "answerIndex": 1,
            "explanation": "Dương Đồng Lạc nói: '我会做面条儿' (Tôi biết nấu mì)."
        },
        {
            "id": "nh1_5_lis_2",
            "audioText": "女：今天星期六，你上班吗？男：今天我不上班，我休息。",
            "question": "男的今天做什么？(Người nam hôm nay làm gì?)",
            "questionPinyin": "Nán de jīntiān zuò shénme?",
            "options": ["去上班", "休息", "去学校"],
            "answerIndex": 1,
            "explanation": "Người nam trả lời: '今天我不上班，我休息' (Hôm nay tôi không đi làm, tôi nghỉ ngơi)."
        }
    ],
    6: [
        {
            "id": "nh1_6_lis_1",
            "audioText": "女：喂，陈天中，你在哪儿？男：我在图书馆前边等你呢。",
            "question": "陈天中现在在哪儿？(Trần Thiên Trung hiện ở đâu?)",
            "questionPinyin": "Chén Tiānzhōng xiànzài zài nǎr?",
            "options": ["在超市", "在图书馆前边", "在学校后面"],
            "answerIndex": 1,
            "explanation": "Trần Thiên Trung nói: '我在图书馆前边等你呢' (Tôi đang ở phía trước thư viện đợi bạn)."
        },
        {
            "id": "nh1_6_lis_2",
            "audioText": "女：你的手机号是多少？男：是一三八，幺二三四，五六七八。",
            "question": "男的在说什么？(Người nam đang nói điều gì?)",
            "questionPinyin": "Nán de zài shuō shénme?",
            "options": ["手机号码", "生日日期", "商品价格"],
            "answerIndex": 0,
            "explanation": "Người nam đang đọc dãy số điện thoại di động (手机号码)."
        }
    ],
    7: [
        {
            "id": "nh1_7_lis_1",
            "audioText": "男：李文，你今天几点下班？女：今天工作很多，我晚上六点半下班。",
            "question": "李文今天几点下班？(Lý Văn hôm nay mấy giờ tan làm?)",
            "questionPinyin": "Lǐ Wén jīntiān jǐ diǎn xiàbān?",
            "options": ["六点", "六点半", "七点"],
            "answerIndex": 1,
            "explanation": "Lý Văn nói: '我晚上六点半下班' (Tôi tan làm lúc 6 giờ 30 phút tối)."
        },
        {
            "id": "nh1_7_lis_2",
            "audioText": "女：我们几点在饭店见？男：七点吧，七点见。",
            "question": "他们几点见面？(Họ gặp nhau lúc mấy giờ?)",
            "questionPinyin": "Tāmen jǐ diǎn jiànmiàn?",
            "options": ["六点半", "七点", "八点"],
            "answerIndex": 1,
            "explanation": "Người nam đề nghị: '七点吧，七点见' (7 giờ nhé, 7 giờ gặp)."
        }
    ],
    8: [
        {
            "id": "nh1_8_lis_1",
            "audioText": "女：你爸爸在哪儿工作？男：我爸爸也是医生，他在北京大医院工作。",
            "question": "他爸爸在什么地方工作？(Bố bạn ấy làm việc ở đâu?)",
            "questionPinyin": "Tā bàba zài shénme dìfang gōngzuò?",
            "options": ["在学校", "在医院", "在书店"],
            "answerIndex": 1,
            "explanation": "Người nam trả lời: '他在北京大医院工作' (Bố làm việc ở bệnh viện lớn tại Bắc Kinh)."
        },
        {
            "id": "nh1_8_lis_2",
            "audioText": "女：下班后我们去哪儿？男：医院前边有一家书店，我们去那儿买书吧。",
            "question": "他们下班后要去哪儿？(Sau khi tan làm họ đi đâu?)",
            "questionPinyin": "Tāmen xiàbān hòu yào qù nǎr?",
            "options": ["去医院", "去书店", "去超市"],
            "answerIndex": 1,
            "explanation": "Họ rủ nhau: '我们去那儿买书吧' -> Đến hiệu sách (书店)."
        }
    ],
    9: [
        {
            "id": "nh1_9_lis_1",
            "audioText": "女：陈天中，你明天上午在学校做什么？男：我在学校图书馆学习，下午去看电影。",
            "question": "陈天中明天上午在做什么？(Sáng mai Trần Thiên Trung làm gì?)",
            "questionPinyin": "Chén Tiānzhōng míngtiān shàngwǔ zài zuò shénme?",
            "options": ["看电影", "在学校学习", "去医院"],
            "answerIndex": 1,
            "explanation": "Trần Thiên Trung nói: '我在学校图书馆学习' (Tôi học ở thư viện trường)."
        },
        {
            "id": "nh1_9_lis_2",
            "audioText": "女：电影院在学校前边还是后边？男：就在学校前边，很近。",
            "question": "电影院在哪儿？(Rạp chiếu phim ở đâu?)",
            "questionPinyin": "Diànyǐngyuàn zài nǎr?",
            "options": ["学校前边", "学校后边", "学校里面"],
            "answerIndex": 0,
            "explanation": "Đoạn thoại khẳng định: '就在学校前边' (Ngay phía trước trường học)."
        }
    ],
    10: [
        {
            "id": "nh1_10_lis_1",
            "audioText": "男：请问，这儿的苹果多少钱一斤？女：四块钱一斤，很甜很便宜！",
            "question": "苹果多少钱一斤？(Táo bao nhiêu tiền một cân?)",
            "questionPinyin": "Píngguǒ duōshao qián yì jīn?",
            "options": ["两块", "四块", "十块"],
            "answerIndex": 1,
            "explanation": "Người bán hàng trả lời: '四块钱一斤' (4 tệ một cân)."
        },
        {
            "id": "nh1_10_lis_2",
            "audioText": "女：老板，苹果和西瓜一共多少钱？男：一共二十七块钱。",
            "question": "一共多少钱？(Tổng cộng bao nhiêu tiền?)",
            "questionPinyin": "Yígòng duōshao qián?",
            "options": ["十七块", "二十块", "二十七块"],
            "answerIndex": 2,
            "explanation": "Người bán hàng tính: '一共二十七块钱' (Tổng cộng 27 tệ)."
        }
    ],
    11: [
        {
            "id": "nh1_11_lis_1",
            "audioText": "男：李文，你现在在做什么呢？女：我正在图书馆看书做笔记呢。",
            "question": "李文正在做什么？(Lý Văn đang làm gì?)",
            "questionPinyin": "Lǐ Wén zhèngzài zuò shénme?",
            "options": ["在睡觉", "在图书馆看书", "在吃午饭"],
            "answerIndex": 1,
            "explanation": "Lý Văn trả lời: '我正在图书馆看书做笔记呢' (Mình đang đọc sách ghi chép trong thư viện)."
        },
        {
            "id": "nh1_11_lis_2",
            "audioText": "男：李文，你要不要参加下周的汉语演讲比赛？女：要，我正在准备呢。",
            "question": "李文要不要参加比赛？(Lý Văn có tham gia cuộc thi không?)",
            "questionPinyin": "Lǐ Wén yào bu yào cānjiā bǐsài?",
            "options": ["要参加", "不参加", "不知道"],
            "answerIndex": 0,
            "explanation": "Lý Văn khẳng định: '要，我正在准备呢' (Có chứ, mình đang chuẩn bị đây)."
        }
    ],
    12: [
        {
            "id": "nh1_12_lis_1",
            "audioText": "女：昨天的天气怎么样？男：昨天下雪了，太冷了！",
            "question": "昨天的天气怎么样？(Thời tiết hôm qua thế nào?)",
            "questionPinyin": "Zuótiān de tiānqì zěnmeyàng?",
            "options": ["下雨了", "下雪了", "很热"],
            "answerIndex": 1,
            "explanation": "Người nam trả lời: '昨天下雪了，太冷了' (Hôm qua tuyết rơi rồi, lạnh quá)."
        },
        {
            "id": "nh1_12_lis_2",
            "audioText": "女：外面冷不冷？男：太冷了，零下五度，多穿点儿衣服吧。",
            "question": "男的觉得外面怎么样？(Người nam thấy bên ngoài thế nào?)",
            "questionPinyin": "Nán de juéde wàimiàn zěnmeyàng?",
            "options": ["不太冷", "太冷了", "很暖和"],
            "answerIndex": 1,
            "explanation": "Người nam nói: '太冷了，零下五度' (Quá lạnh, âm 5 độ)."
        }
    ],
    13: [
        {
            "id": "nh1_13_lis_1",
            "audioText": "男：服务员，请问您喝点什么？女：请给我一杯中国茶，谢谢！",
            "question": "女的想喝什么？(Người nữ muốn uống gì?)",
            "questionPinyin": "Nǚ de xiǎng hē shénme?",
            "options": ["一杯牛奶", "一杯中国茶", "一杯水"],
            "answerIndex": 1,
            "explanation": "Người nữ gọi đồ uống: '请给我一杯中国茶' (Làm ơn cho tôi một cốc trà Trung Quốc)."
        },
        {
            "id": "nh1_13_lis_2",
            "audioText": "男：白家月，我可以看一下你的新电脑吗？女：可以，你等一下。",
            "question": "男的想看什么？(Người nam muốn xem cái gì?)",
            "questionPinyin": "Nán de xiǎng kàn shénme?",
            "options": ["新手机", "新电脑", "新书"],
            "answerIndex": 1,
            "explanation": "Người nam hỏi: '我可以看一下你的新电脑吗' (Tôi có thể xem qua máy tính mới của bạn không)."
        }
    ],
    14: [
        {
            "id": "nh1_14_lis_1",
            "audioText": "男：你昨天晚上做什么了？女：我和同班同学看了一个新电影，太好看了！",
            "question": "女的昨天晚上做了什么？(Người nữ tối qua đã làm gì?)",
            "questionPinyin": "Nǚ de zuótiān wǎnshang zuò le shénme?",
            "options": ["看了一个电影", "去商店买衣服", "在家里睡觉"],
            "answerIndex": 0,
            "explanation": "Người nữ trả lời: '看了一个新电影' (Đã xem một bộ phim mới)."
        },
        {
            "id": "nh1_14_lis_2",
            "audioText": "女：电影好看不好看？男：同学们都说太好看了！",
            "question": "他们觉得电影怎么样？(Họ thấy bộ phim thế nào?)",
            "questionPinyin": "Tāmen juéde diànyǐng zěnmeyàng?",
            "options": ["不好看", "太好看了", "没看完"],
            "answerIndex": 1,
            "explanation": "Cả lớp đều nhận xét: '太好看了' (Quá hay rồi)."
        }
    ],
    15: [
        {
            "id": "nh1_15_lis_1",
            "audioText": "男：安妮，你是坐飞机回国吗？女：是的，我们今天在大兴机场见！",
            "question": "安妮怎么回国？(Annie về nước bằng phương tiện gì?)",
            "questionPinyin": "Ānnī zěnme huí guó?",
            "options": ["坐出租车", "坐飞机", "坐火车"],
            "answerIndex": 1,
            "explanation": "Đoạn thoại khẳng định: '坐飞机回国' (Đi máy bay về nước)."
        },
        {
            "id": "nh1_15_lis_2",
            "audioText": "男：大家几点在大兴机场见面？女：上午十点，我们都去送安妮。",
            "question": "大家去大兴机场做什么？(Mọi người ra sân bay Đại Hưng làm gì?)",
            "questionPinyin": "Dàjiā qù Dàxīng jīchǎng zuò shénme?",
            "options": ["坐飞机旅游", "去送安妮", "买东西"],
            "answerIndex": 1,
            "explanation": "Mục đích là: '我们都去送安妮' (Tất cả chúng tôi ra tiễn Annie)."
        }
    ]
}

# Attach readingPassage and listeningExercises to each lesson
for lesson in lessons:
    l_num = lesson["lessonNumber"]
    if l_num in READING_PASSAGES:
        lesson["readingPassage"] = READING_PASSAGES[l_num]
    if l_num in LISTENING_EXERCISES:
        lesson["listeningExercises"] = LISTENING_EXERCISES[l_num]

ts_content = f"""import {{ CurriculumLesson }} from "@/types/curriculum"

export const NEW_HSK1_ALL_LESSONS: CurriculumLesson[] = {json.dumps(lessons, ensure_ascii=False, indent=2)}
"""

with open(current_lessons_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully injected authentic reading passages and listening exercises for all {len(lessons)} lessons!")
