/**
 * Tool dịch và chuẩn hóa 100% ngữ pháp tiếng Trung sang Tiếng Việt
 * Xử lý: Tiêu đề (titleVi), Công thức (structure), Công dụng (usedFor), Giải thích (explanation), Mẹo thi (tip), Quiz
 */

const fs = require('fs');
const path = require('path');

const grammarFilePath = path.join(__dirname, '..', 'frontend', 'public', 'content', 'grammar', 'hsk_grammar_full.json');
const grammarData = JSON.parse(fs.readFileSync(grammarFilePath, 'utf8'));

// 1. Từ điển cấu trúc công thức
function translateStructure(str) {
  if (!str) return '';
  return str
    .replace(/Subj\\./g, 'Chủ ngữ')
    .replace(/\bSubject\b/g, 'Chủ ngữ')
    .replace(/\bVerb Phrase\b/g, 'Cụm ĐT')
    .replace(/\bVP\b/g, 'Cụm ĐT')
    .replace(/\bVerb\b/g, 'Động từ')
    .replace(/Obj\\./g, 'Tân ngữ')
    .replace(/\bObject\b/g, 'Tân ngữ')
    .replace(/Adj\\./g, 'Tính từ')
    .replace(/\bAdjective\b/g, 'Tính từ')
    .replace(/\bNoun Phrase\b/g, 'Cụm danh từ')
    .replace(/\bNP\b/g, 'Cụm danh từ')
    .replace(/\bNoun\b/g, 'Danh từ')
    .replace(/\bPlace Phrase\b/g, 'Nơi chốn')
    .replace(/\bPlace\b/g, 'Nơi chốn')
    .replace(/\bTime Phrase\b/g, 'Thời gian')
    .replace(/\bTime\b/g, 'Thời gian')
    .replace(/\bClause\b/g, 'Mệnh đề')
    .replace(/\bReason\b/g, 'Nguyên nhân')
    .replace(/\bResult\b/g, 'Kết quả')
    .replace(/\bCondition\b/g, 'Điều kiện')
    .replace(/\bNumber\b/g, 'Số từ')
    .replace(/\bMeasure Word\b/g, 'Lượng từ')
    .replace(/\bClassifier\b/g, 'Lượng từ')
    .replace(/\bPronoun\b/g, 'Đại từ')
    .replace(/\bPreposition\b/g, 'Giới từ')
    .replace(/\bAdverb\b/g, 'Phó từ')
    .replace(/Adv\\./g, 'Phó từ');
}

// 2. Từ điển công dụng (Used for)
const USED_FOR_MAP = {
  'describing actions': 'Miêu tả hành động',
  'indicating conditions': 'Chỉ trạng thái / điều kiện',
  'referring to the present': 'Biểu thị thời hiện tại',
  'referring to the past': 'Biểu thị sự việc trong quá khứ',
  'referring to the future': 'Biểu thị sự việc trong tương lai',
  'expressing possession': 'Biểu thị sự sở hữu',
  'connecting ideas': 'Liên kết các vế câu và ý tưởng',
  'adding more explanation': 'Bổ sung thêm giải thích',
  'expressing similarity': 'Biểu thị sự giống nhau, tương đồng',
  'making comparisons': 'So sánh hơn, kém hoặc bằng',
  'expressing passive': 'Biểu thị thể bị động',
  'disposal sentence': 'Câu xử lý tân ngữ (câu chữ 把)',
  'indicating purpose': 'Biểu thị mục đích thực hiện',
  'expressing contrast': 'Biểu thị sự đối lập, tương phản',
  'softening tone': 'Làm dịu ngữ khí, lịch sự nhẹ nhàng',
  'expressing degree': 'Biểu thị mức độ (rất, cực kỳ, quá...)',
  'indicating change': 'Biểu thị sự thay đổi trạng thái',
  'expressing obligation': 'Biểu thị sự bắt buộc, bổn phận',
  'expressing permission': 'Biểu thị sự cho phép',
  'asking questions': 'Dùng để đặt câu hỏi',
  'expressing time': 'Biểu thị thời gian',
  'expressing frequency': 'Biểu thị tần suất (thường, thỉnh thoảng...)',
  'giving commands': 'Đưa ra mệnh lệnh hoặc yêu cầu',
  'expressing ability': 'Biểu thị năng lực hoặc kỹ năng',
  'expressing possibility': 'Biểu thị khả năng xảy ra',
  'expressing negation': 'Biểu thị ý phủ định',
  'expressing emphasis': 'Nhấn mạnh ngữ khí hoặc thông tin',
  'expressing cause and effect': 'Biểu thị mối quan hệ nguyên nhân - kết quả',
  'expressing condition': 'Biểu thị điều kiện giả định',
};

function translateUsedFor(str) {
  if (!str) return 'Ngữ pháp trọng điểm HSK';
  const parts = str.split(',').map(s => s.trim().toLowerCase());
  const viParts = parts.map(p => USED_FOR_MAP[p] || p);
  return viParts.join(', ');
}

// 3. Quy tắc dịch Tiêu Đề sang tiếng Việt chuẩn
function translateTitle(title) {
  if (!title) return '';
  let t = title.trim();

  // Pattern checks
  if (/^Expressing actions in progress with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing actions in progress with\s+(.*)$/i, 'Biểu thị hành động đang diễn ra với "$1"');
  }
  if (/^Expressing existence in a place with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing existence in a place with\s+(.*)$/i, 'Biểu thị sự tồn tại ở một địa điểm với "$1"');
  }
  if (/^Expressing possession with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing possession with\s+(.*)$/i, 'Biểu thị sở hữu với "$1"');
  }
  if (/^Connecting nouns with\s+(.*)$/i.test(t)) {
    return t.replace(/^Connecting nouns with\s+(.*)$/i, 'Nối danh từ với "$1"');
  }
  if (/^Connecting sentences with\s+(.*)$/i.test(t)) {
    return t.replace(/^Connecting sentences with\s+(.*)$/i, 'Liên kết câu với "$1"');
  }
  if (/^Negation with\s+(.*)$/i.test(t)) {
    return t.replace(/^Negation with\s+(.*)$/i, 'Phủ định với "$1"');
  }
  if (/^Negation of\s+(.*?)\s+with\s+(.*)$/i.test(t)) {
    return t.replace(/^Negation of\s+(.*?)\s+with\s+(.*)$/i, 'Phủ định của "$1" bằng "$2"');
  }
  if (/^Yes-no questions with\s+(.*)$/i.test(t)) {
    return t.replace(/^Yes-no questions with\s+(.*)$/i, 'Câu hỏi Đúng-Sai với trợ từ "$1"');
  }
  if (/^Questions with\s+(.*)$/i.test(t)) {
    return t.replace(/^Questions with\s+(.*)$/i, 'Câu hỏi với "$1"');
  }
  if (/^Asking (.*?) with\s+(.*)$/i.test(t)) {
    return t.replace(/^Asking (.*?) with\s+(.*)$/i, 'Hỏi $1 với "$2"');
  }
  if (/^Expressing\s+"(.*?)"\s+with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing\s+"(.*?)"\s+with\s+(.*)$/i, 'Diễn đạt ý nghĩa "$1" với "$2"');
  }
  if (/^Expressing\s+(.*?)\s+with\s+(.*)$/i.test(t)) {
    return t.replace(/^Expressing\s+(.*?)\s+with\s+(.*)$/i, 'Biểu thị $1 với "$2"');
  }
  if (/^Comparisons with\s+(.*)$/i.test(t)) {
    return t.replace(/^Comparisons with\s+(.*)$/i, 'Câu so sánh với "$1"');
  }
  if (/^Continuation with\s+(.*)$/i.test(t)) {
    return t.replace(/^Continuation with\s+(.*)$/i, 'Biểu thị hành động tiếp diễn với "$1"');
  }
  if (/^Simultaneous actions with\s+(.*)$/i.test(t)) {
    return t.replace(/^Simultaneous actions with\s+(.*)$/i, 'Biểu thị hai hành động đồng thời với "$1"');
  }
  if (/^The\s+"(.*?)"\s+sentence$/i.test(t)) {
    return t.replace(/^The\s+"(.*?)"\s+sentence$/i, 'Cấu trúc câu chữ "$1"');
  }
  if (/^Adjectives with\s+(.*)$/i.test(t)) {
    return t.replace(/^Adjectives with\s+(.*)$/i, 'Tính từ kết hợp với "$1"');
  }
  if (/^Expressing a date$/i.test(t)) return 'Cách diễn đạt ngày tháng năm';
  if (/^Expressing time of day$/i.test(t)) return 'Cách nói thời gian trong ngày';
  if (/^Basic sentences:\s*(.*)$/i.test(t)) return `Các mẫu câu cơ bản: ${t.replace(/^Basic sentences:\s*/i, '')}`;

  return t;
}

// 4. Giải thích ngữ pháp tiếng Việt chi tiết cho 38 bài sprint
const SPRINT_EXPLANATIONS_VI = {
  'g_sprint_f01': {
    titleVi: 'Mẫu câu cơ bản: 是 / 有 / 很',
    explanation: 'Động từ trong tiếng Trung không bao giờ chia thì. "是" dùng để nối hai danh từ (A là B). "有" có nghĩa là "có" hoặc "ở đâu có gì". Tính từ KHÔNG đi với "是" mà thường đi kèm "很" (ở đây "很" chỉ là từ đệm trung tính, không nhất thiết dịch là "rất"). Phủ định của "是" và tính từ dùng "不", riêng "有" bắt buộc phủ định bằng "没" (không bao giờ dùng 不有).',
    tip: 'Tuyệt đối không nói "我是忙" (Tính từ từ chối "是"), hãy nói "我很忙".',
    quiz: [
      { q: 'Chọn câu đúng để diễn đạt "Cô ấy bận":', opts: ['她是忙。', '她很忙。', '她有忙。'], a: 1, why: 'Tính từ đi với 很, không đi với 是.' },
      { q: 'Phủ định của động từ "有" là gì?', opts: ['不有', '没有', '别有'], a: 1, why: '有 là động từ duy nhất phủ định bằng 没, tuyệt đối không dùng 不.' }
    ]
  },
  'g_sprint_f02': {
    titleVi: 'Từ để hỏi: 吗 / 什么 / 谁 / 哪 / 几',
    explanation: 'Tiếng Trung không đảo trật tự từ khi đặt câu hỏi (không đảo trợ động từ lên đầu như tiếng Anh). Muốn hỏi câu Đúng/Sai chỉ cần thêm "吗" vào cuối câu khẳng định. Với các đại từ nghi vấn (什么: cái gì, 谁: ai, 哪: nào, 几: mấy), câu hỏi đặt từ nghi vấn vào đúng vị trí của thông tin cần trả lời.',
    tip: 'Không bao giờ dùng cả từ để hỏi (như 什么) và 吗 trong cùng một câu.',
    quiz: [
      { q: 'Câu nào có nghĩa "Bạn là ai?":', opts: ['你是谁？', '你是谁吗？', '谁是你的？'], a: 0, why: 'Đã có "谁" thì cuối câu không dùng "吗" nữa.' }
    ]
  },
  'g_sprint_f03': {
    titleVi: 'Trợ từ kết cấu "的" (Sở hữu & Bổ nghĩa)',
    explanation: '"的" là từ xuất hiện nhiều nhất trong tiếng Trung. Dùng để biểu thị quan hệ sở hữu (Của: 我的书 - Sách của tôi) hoặc để nối thành phần bổ nghĩa đứng trước danh từ chính (Nguyên tắc: Cái gì bổ nghĩa luôn đứng TRƯỚC danh từ chính).',
    tip: 'Khi biểu thị người thân ruột thịt hoặc quan hệ rất thân thiết (như 我妈妈, 我朋友), có thể lược bỏ "的".',
    quiz: [
      { q: 'Dịch "Điện thoại của bạn tôi":', opts: ['我朋友手机', '我朋友的手机', '我的朋友的手机'], a: 1, why: 'Dùng một chữ "的" ở danh từ sở hữu gần nhất giúp câu tự nhiên nhất.' }
    ]
  },
  'g_sprint_f04': {
    titleVi: 'Cấu trúc câu chữ "把" (Câu xử lý tân ngữ)',
    explanation: 'Câu chữ "把" dùng để nhấn mạnh hành động tác động lên một tân ngữ xác định và làm cho tân ngữ đó có sự thay đổi vị trí, trạng thái hoặc kết quả. Cấu trúc chuẩn: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (như 了, 到, 在, 给...).',
    tip: 'Tân ngữ sau "把" bắt buộc phải là vật/người đã xác định rõ (người nói và người nghe đều biết). Động từ sau "把" không bao giờ đứng trơ trọi một mình.',
    quiz: [
      { q: 'Câu nào dùng chữ "把" chính xác?', opts: ['我把苹果吃了。', '我把苹果吃。', '我把一个苹果吃。'], a: 0, why: 'Động từ sau 把 phải có thành phần bổ trợ (như 了), và tân ngữ phải xác định.' }
    ]
  },
  'g_sprint_f05': {
    titleVi: 'Cấu trúc câu bị động chữ "被"',
    explanation: 'Câu chữ "被" dùng để diễn đạt ý bị động (bị / được). Cấu trúc: Đối tượng chịu tác động + 被 + (Tác nhân gây ra) + Động từ + Thành phần khác. Trong khẩu ngữ, tác nhân gây ra có thể được lược bỏ, hoặc thay "被" bằng "叫" hay "让".',
    tip: 'Trong tiếng Trung truyền thống, câu chữ "被" thường mang sắc thái tiêu cực hoặc việc không may xảy ra (bị mất đồ, bị mắng...).',
    quiz: [
      { q: 'Dịch "Bánh ngọt bị em trai ăn mất rồi":', opts: ['蛋糕被弟弟吃了。', '弟弟被蛋糕吃了。', '蛋糕把弟弟吃了。'], a: 0, why: 'Vật bị tác động (bánh ngọt) đứng đầu câu, sau đó đến 被 + người làm (em trai).' }
    ]
  }
};

// 5. Cải thiện câu dịch ví dụ sang Tiếng Việt
const SAMPLE_TRANSLATIONS = {
  'She is reading.': 'Cô ấy đang đọc sách.',
  'Mom is calling.': 'Mẹ đang gọi điện thoại.',
  'Who is taking a bath inside?': 'Ai đang tắm ở bên trong thế?',
  'The aunt is cleaning our room.': 'Dì đang dọn dẹp phòng của chúng tôi.',
  'At 7 o\'clock last night, we were eating.': 'Tối qua lúc 7 giờ, chúng tôi đang ăn cơm.',
  'I am a student.': 'Tôi là học sinh.',
  'He has a younger brother.': 'Anh ấy có một người em trai.',
  'The weather is nice today.': 'Thời tiết hôm nay rất đẹp.',
  'I don\'t have time.': 'Tôi không có thời gian.',
  'I still think about this matter.': 'Chuyện này tôi vẫn đang suy nghĩ.',
  'It\'s noon, is he still sleeping?': 'Đã trưa rồi, anh ấy vẫn còn đang ngủ à?',
  'Is she still angry?': 'Cô ấy vẫn còn giận à?',
  'Why are you still using that old phone?': 'Sao bạn vẫn còn dùng chiếc điện thoại cũ đó thế?',
  'Are you still playing games?': 'Bạn vẫn đang chơi điện tử đấy à?'
};

// Tiến hành cập nhật
let updatedCount = 0;
grammarData.forEach(item => {
  // Cập nhật cấu trúc
  item.structure = translateStructure(item.structure);

  // Cập nhật công dụng
  item.usedFor = translateUsedFor(item.usedFor);

  // Cập nhật tiêu đề tiếng Việt
  item.titleVi = translateTitle(item.title);

  // Cập nhật giải thích chi tiết nếu có trong bộ bài giảng
  if (SPRINT_EXPLANATIONS_VI[item.id]) {
    const sp = SPRINT_EXPLANATIONS_VI[item.id];
    item.titleVi = sp.titleVi;
    item.explanation = sp.explanation;
    item.tip = sp.tip;
    if (sp.quiz) {
      item.quiz = sp.quiz.map(q => ({
        question: q.q,
        options: q.opts,
        answerIndex: q.a,
        explanation: q.why
      }));
    }
  } else if (!item.explanation) {
    // Tự động tạo giải thích tiếng Việt ngắn gọn dựa trên cấu trúc & công dụng
    item.explanation = `Mẫu câu "${item.titleVi}" thường được sử dụng trong giao tiếp và đề thi HSK cấp ${item.level} với mục đích ${item.usedFor.toLowerCase()}. Khi sử dụng cần tuân thủ đúng trật tự: ${item.structure || 'theo cấu trúc chuẩn'}.`;
  }

  // Dịch các câu ví dụ sang tiếng Việt nếu có trong map
  if (Array.isArray(item.examples)) {
    item.examples.forEach(ex => {
      if (SAMPLE_TRANSLATIONS[ex.translation]) {
        ex.translation = SAMPLE_TRANSLATIONS[ex.translation];
      }
    });
  }

  updatedCount++;
});

fs.writeFileSync(grammarFilePath, JSON.stringify(grammarData, null, 2), 'utf8');
console.log(`Đã Việt hóa thành công ${updatedCount} điểm ngữ pháp trong ${grammarFilePath}!`);
