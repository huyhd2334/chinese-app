/**
 * Tool tổng hợp dữ liệu ngữ pháp HSK 1 - HSK 6
 * Nguồn: AllSet Learning Chinese Grammar Wiki Dataset (krmanik/Chinese-Grammar)
 * Kèm giải thích & cấu trúc chuẩn
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'frontend', 'public', 'content', 'grammar');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

async function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const VI_TRANSLATIONS = {
  'Expressing actions in progress with "zai"': 'Biểu thị hành động đang diễn ra với "在"',
  'Expressing existence in a place with "zai"': 'Biểu thị sự tồn tại ở một địa điểm với "在"',
  'Expressing possession with "you"': 'Biểu thị sự sở hữu với "有"',
  'Connecting nouns with "he"': 'Nối các danh từ với "和" (và)',
  'Expressing "and" with "he"': 'Biểu thị "và" với "和"',
  'Negation with "bu"': 'Phủ định với "不" (không)',
  'Negation of "you" with "mei"': 'Phủ định của "有" bằng "没/没有"',
  'Yes-no questions with "ma"': 'Câu hỏi Đúng-Sai với trợ từ nghi vấn "吗"',
  'Expressing "all" with "dou"': 'Biểu thị "tất cả / đều" với "都"',
  'Expressing "also" with "ye"': 'Biểu thị "cũng" với "也"',
  'Expressing ability or possibility with "hui"': 'Biểu thị năng lực hoặc khả năng với "会"',
  'Expressing permission with "keyi"': 'Biểu thị sự cho phép với "可以"',
  'Expressing a willingness to do something with "xiang"': 'Biểu thị mong muốn làm gì với "想"',
  'Expressing a date': 'Cách diễn đạt ngày tháng năm trong tiếng Trung',
  'Expressing time of day': 'Cách nói thời gian trong ngày',
  'Asking "what" with "shenme"': 'Hỏi "cái gì" với "什么"',
  'Asking "who" with "shei"': 'Hỏi "ai" với "谁"',
  'Asking "where" with "nali"': 'Hỏi "ở đâu" với "哪里/哪儿"',
  'Expressing possession with "de"': 'Biểu thị sở hữu với trợ từ kết cấu "的"',
  'Adjectives with "hen"': 'Tính từ kết hợp với "很"',
  'Sentence-final "le"': 'Trợ từ ngữ khí "了" ở cuối câu',
  'Change of state with "le"': 'Biểu thị sự thay đổi trạng thái với "了"',
  'Comparisons with "bi"': 'Câu so sánh hơn với "比"',
  'The "ba" sentence': 'Câu chữ "把" (Câu xử lý tân ngữ)',
  'The "bei" sentence': 'Câu chữ "被" (Câu bị động)',
  'Expressing "excessively" with "tai"': 'Biểu thị mức độ quá mức với "太...了"',
  'Expressing "already" with "yijing"': 'Biểu thị "đã... rồi" với "已经...了"',
  'Expressing "almost" with "chabuduo"': 'Biểu thị "gần như / xấp xỉ" với "差不多"',
  'Expressing "even" with "lian"': 'Biểu thị "ngay cả / thậm chí" với cấu trúc "连...都/也"',
  'Simultaneous actions with "yibian"': 'Biểu thị hai hành động đồng thời với "一边...一边..."',
};

function cleanField(s) {
  if (!s) return '';
  s = s.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.substring(1, s.length - 1);
  }
  return s.replace(/""/g, '"').trim();
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        cols.push(cleanField(cur));
        cur = '';
      } else {
        cur += c;
      }
    }
    cols.push(cleanField(cur));
    rows.push(cols);
  }
  return rows;
}

async function run() {
  const allGrammarPoints = [];

  for (let lvl = 1; lvl <= 6; lvl++) {
    const url = 'https://raw.githubusercontent.com/krmanik/Chinese-Grammar/master/' + encodeURIComponent('CSV Files HSK1 - HSK6') + '/hsk' + lvl + '.csv';
    console.log(`Downloading HSK ${lvl} grammar...`);
    try {
      const raw = await download(url);
      const rows = parseCsv(raw);
      console.log(`HSK ${lvl} rows:`, rows.length);

      const grouped = {};
      for (const row of rows) {
        if (row.length < 8) continue;
        const chinese = row[1] || row[0];
        const pinyin = row[2];
        const translation = row[3];
        const rawStructure = row[5] || '';
        const usedFor = row[6] || '';
        const title = row[7] || '';

        if (!title) continue;

        const key = title.toLowerCase().trim();
        if (!grouped[key]) {
          grouped[key] = {
            id: `g_hsk${lvl}_${Object.keys(grouped).length + 1}`,
            level: lvl,
            title: title,
            titleVi: VI_TRANSLATIONS[title] || title,
            structure: rawStructure.replace(/^::\s*/, '').replace(/\s*::$/, '').trim(),
            usedFor: usedFor,
            examples: [],
          };
        }

        if (grouped[key].examples.length < 5 && chinese && pinyin) {
          grouped[key].examples.push({
            chinese: chinese.replace(/\s+/g, ''),
            pinyin: pinyin.trim(),
            translation: translation.trim(),
          });
        }
      }

      const points = Object.values(grouped);
      console.log(`HSK ${lvl} grammar points created:`, points.length);
      allGrammarPoints.push(...points);
    } catch (e) {
      console.error(`Error on HSK ${lvl}:`, e.message);
    }
  }

  // Tải thêm 38 bài giảng ngữ pháp HSK 1 - 3 có quiz trắc nghiệm từ hsk3-sprint
  try {
    console.log('Downloading HSK 1-3 interactive grammar quizzes...');
    const sprintUrl = 'https://raw.githubusercontent.com/zahid195p/hsk3-sprint/main/parts/04_data_grammar.js';
    const sprintRaw = await download(sprintUrl);
    
    // Trích xuất biến GRAMMAR = [...]
    const match = sprintRaw.match(/const\s+GRAMMAR\s*=\s*(\[[\s\S]*?\]);\s*\n/);
    if (match) {
      // Dùng eval trong sandbox để parse object JS
      const sprintGrammar = eval(match[1]);
      console.log('Downloaded sprint grammar lessons:', sprintGrammar.length);
      
      sprintGrammar.forEach((sg, idx) => {
        const lvl = sg.stage || 1;
        allGrammarPoints.push({
          id: `g_sprint_${sg.id || idx}`,
          level: lvl,
          title: sg.title,
          titleVi: sg.title,
          structure: sg.pattern || '',
          usedFor: 'Ngữ pháp trọng điểm & bài tập trắc nghiệm',
          explanation: sg.explain || '',
          tip: sg.tip || '',
          examples: (sg.ex || []).map(e => ({
            chinese: (e.c || '').replace(/\|/g, ''),
            pinyin: e.p || '',
            translation: e.e || '',
          })),
          quiz: (sg.quiz || []).map(q => ({
            question: q.q,
            options: q.opts,
            answerIndex: q.a,
            explanation: q.why,
          }))
        });
      });
    }
  } catch (err) {
    console.warn('Sprint grammar download error:', err.message);
  }

  const outPath = path.join(targetDir, 'hsk_grammar_full.json');
  fs.writeFileSync(outPath, JSON.stringify(allGrammarPoints, null, 2), 'utf8');
  console.log('SUCCESS! Total Grammar Points saved:', allGrammarPoints.length, 'to', outPath);
}

run();
