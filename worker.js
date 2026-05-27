import { APP_VERSION } from "./public/version.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const LEVELS = [
  { id: "P4_CL_SUPPORT", label: "小四华文巩固" },
  { id: "P4_HCL_BASELINE", label: "小四高级华文基准" },
  { id: "P4_HCL_STRETCH", label: "小四高级华文拓展" },
  { id: "P5_HCL_BRIDGE", label: "小五高级华文衔接" }
];

const THEME_LABELS = {
  campus: "校园生活",
  singapore: "新加坡生活",
  nature: "自然与环保",
  science: "小实验",
  culture: "节日文化",
  mystery: "小侦探故事"
};

const VOCAB_LIBRARY = {
  环保: ["huan bao", "保护环境，让空气、水和土地更干净。", "environmental protection", "这次环保行动让同学们学会减少浪费。"],
  社区: ["she qu", "人们一起生活的地方，包括邻居、商店和公共设施。", "community or neighbourhood", "社区里的居民一起照顾小花园。"],
  居民: ["ju min", "住在某个地方的人。", "residents", "附近居民都支持垃圾分类。"],
  分类: ["fen lei", "按照不同种类分开。", "to sort into categories", "我们把纸张、塑料和金属分类回收。"],
  资源: ["zi yuan", "可以被利用的东西，如水、电、材料和时间。", "resources", "节约资源是每个人都能做到的小事。"],
  节约: ["jie yue", "少浪费，合理使用。", "to save; to use carefully", "关灯可以节约用电。"],
  便利: ["bian li", "方便，容易使用。", "convenient", "新的巴士站让居民出行更便利。"],
  负责: ["fu ze", "认真做好自己该做的事。", "responsible; to be in charge", "小组长负责记录大家的发现。"],
  观察: ["guan cha", "仔细看，注意变化。", "to observe", "做实验时要认真观察颜色的变化。"],
  记录: ["ji lu", "把看到、听到或想到的内容写下来。", "to record", "他把每天的温度记录在表格里。"],
  实验: ["shi yan", "为了证明想法而进行的试验。", "experiment", "这个小实验说明植物需要阳光。"],
  结论: ["jie lun", "根据观察和证据得出的结果。", "conclusion", "经过讨论，我们得出了新的结论。"],
  坚持: ["jian chi", "遇到困难也继续做。", "to persist", "只要坚持阅读，认字量会慢慢增加。"],
  合作: ["he zuo", "大家一起完成一件事。", "cooperation", "这次活动需要同学们合作。"],
  勇气: ["yong qi", "敢于面对困难或挑战的力量。", "courage", "她鼓起勇气向全班分享自己的看法。"],
  选择: ["xuan ze", "从几个可能中挑一个。", "to choose; choice", "他选择先完成阅读，再去运动。"],
  改变: ["gai bian", "让情况和以前不一样。", "to change", "一个小习惯也能带来改变。"],
  习惯: ["xi guan", "经常做、慢慢形成的行为。", "habit", "每天复习十分钟是很好的学习习惯。"],
  减少: ["jian shao", "变少。", "to reduce", "自带水瓶可以减少塑料垃圾。"],
  塑料: ["su liao", "一种常见材料，常用来做瓶子和袋子。", "plastic", "塑料袋如果乱丢，会污染环境。"],
  回收: ["hui shou", "把用过的东西收集起来，再处理利用。", "to recycle", "旧报纸可以回收。"],
  建议: ["jian yi", "提出自己的想法，供别人参考。", "suggestion; to suggest", "老师建议大家先读题目再回答。"],
  讨论: ["tao lun", "大家说出想法并交换意见。", "to discuss", "小组讨论后决定修改计划。"],
  原因: ["yuan yin", "事情发生的理由。", "reason", "他解释了迟到的原因。"],
  影响: ["ying xiang", "对别人或事情产生作用。", "influence; impact", "睡眠不足会影响学习。"],
  收获: ["shou huo", "通过学习或活动得到的东西。", "gain; what one has learned", "这次访问让她有很大收获。"],
  提醒: ["ti xing", "让别人注意或记得某件事。", "to remind", "妈妈提醒他带上雨伞。"],
  耐心: ["nai xin", "不急躁，愿意慢慢做。", "patience", "查字典需要一点耐心。"],
  珍惜: ["zhen xi", "觉得宝贵并好好爱护。", "to treasure", "我们要珍惜和家人相处的时间。"],
  传统: ["chuan tong", "长期流传下来的习俗或文化。", "tradition", "春节有许多传统习俗。"],
  灯笼: ["deng long", "节日里常见的装饰灯。", "lantern", "街上挂满了红色灯笼。"],
  访问: ["fang wen", "去看望或采访别人。", "to visit; interview", "同学们访问了社区中心的志愿者。"],
  摊位: ["tan wei", "临时摆放东西、售卖或展示的地方。", "stall; booth", "义卖会有许多有趣的摊位。"],
  线索: ["xian suo", "帮助找出答案的提示。", "clue", "他从脚印里发现了重要线索。"],
  判断: ["pan duan", "根据情况想一想，再决定看法。", "to judge", "我们不能只看表面就判断。"],
  证明: ["zheng ming", "用事实说明是真的。", "to prove", "实验结果证明了我们的想法。"],
  责任: ["ze ren", "应该承担和完成的事情。", "responsibility", "照顾班级图书是大家的责任。"]
};

const articleSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    paragraphs: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" }
    },
    questions: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          prompt: { type: "string" },
          options: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: { type: "string" }
          },
          answer: { type: "string" }
        },
        required: ["prompt", "options", "answer"]
      }
    }
  },
  required: ["title", "paragraphs", "questions"]
};

const vocabSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string" },
    pinyin: { type: "string" },
    explanationZh: { type: "string" },
    explanationEn: { type: "string" },
    exampleSentence: { type: "string" }
  },
  required: ["term", "pinyin", "explanationZh", "explanationEn", "exampleSentence"]
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        app: "chinese-reading-coach",
        version: APP_VERSION,
        env: runtimeEnvName(env, url),
        hasOpenAI: hasOpenAIKey(env)
      });
    }

    if (url.pathname === "/api/version" && request.method === "GET") {
      return json(versionPayload());
    }

    if (url.pathname === "/api/jsonp" && request.method === "GET") {
      return handleJsonp(url, env);
    }

    if (url.pathname === "/api/article/generate" && request.method === "POST") {
      return handleArticleGenerate(request, env);
    }

    if (url.pathname === "/api/vocab/explain" && request.method === "POST") {
      return handleVocabExplain(request, env);
    }

    if (url.pathname === "/api/level/analyze" && request.method === "POST") {
      return handleLevelAnalyze(request);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return json({ error: "Not found" }, 404);
  }
};

async function handleArticleGenerate(request, env) {
  const body = await readJson(request);
  return articleGenerateFromBody(body, env);
}

async function articleGenerateFromBody(body, env) {
  const theme = cleanChoice(body.theme, THEME_LABELS, "nature");
  const levelId = cleanLevel(body.levelId);
  const length = ["short", "medium", "long"].includes(body.length) ? body.length : "medium";
  const recentTerms = Array.isArray(body.recentTerms) ? body.recentTerms.slice(0, 18).map((item) => String(item).slice(0, 12)) : [];
  const targetTerms = Array.isArray(body.targetTerms)
    ? body.targetTerms.slice(0, 18).map((item) => ({
        term: cleanText(item?.term ?? item, 12),
        status: cleanText(item?.status ?? "", 20),
        hitCount: Number(item?.hitCount) || 1,
        context: cleanText(item?.context ?? "", 120)
      }))
    : recentTerms.map((term) => ({ term, status: "", hitCount: 1, context: "" }));
  const targetTermLabels = targetTerms.map((item) => item.term).filter(Boolean);
  const avoidArticles = Array.isArray(body.avoidArticles)
    ? body.avoidArticles.slice(0, 8).map((item) => ({
        title: cleanText(item?.title, 80),
        theme: cleanText(item?.theme, 40),
        excerpt: cleanText(item?.excerpt, 160)
      }))
    : [];

  if (!hasOpenAIKey(env)) {
    return json({
      article: demoArticle(uniqueDemoTheme(theme, avoidArticles), levelId, length),
      source: "demo"
    });
  }

  const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[1];
  const targetLength = length === "short" ? "260-360" : length === "long" ? "520-700" : "380-560";
  const prompt = [
    "你是一位熟悉新加坡小学华文学习环境的中文阅读老师。",
    "请为一名10岁学生生成一篇中文阅读文章，起点约为新加坡小四高级华文。",
    "文章必须适合儿童，语言自然，不要太幼稚；主题贴近生活，并包含少量可挑战的词语。",
    "不要使用 markdown。不要在文章中给拼音。",
    "请附上3道单选阅读理解题，每题4个选项，答案必须完全等于其中一个选项。",
    "",
    `主题：${THEME_LABELS[theme]}`,
    `难度：${level.label}`,
    `篇幅：${targetLength} 个中文字左右`,
    `必须自然复现的错字本字词：${targetTermLabels.join("、") || "无"}`,
    targetTermLabels.length
      ? `请尽量自然包含这些字词中的大部分，至少包含 ${Math.min(6, targetTermLabels.length)} 个；不要集中堆砌，也不要用拼音代替。`
      : "没有指定错字词时，请保持小四高级华文的适度挑战。",
    `错字词上下文线索：${JSON.stringify(targetTerms.filter((item) => item.context).slice(0, 8))}`,
    `最近文章，必须避免相似标题、情节、场景和开头：${JSON.stringify(avoidArticles)}`,
    "如果主题相同，也要换一个新的具体情境、人物目标和问题发展。",
    "",
    "返回 JSON，字段为 title, paragraphs, questions。"
  ].join("\n");

  try {
    const generated = await callOpenAIJson(
      env,
      "chinese_reading_article",
      articleSchema,
      [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
      2400,
      env.OPENAI_GENERATION_MODEL || env.OPENAI_MODEL || "gpt-4.1-nano"
    );
    return json({
      article: {
        id: `article-${crypto.randomUUID()}`,
        title: cleanText(generated.title, 80),
        theme,
        levelId,
        source: "openai",
        createdAt: new Date().toISOString(),
        paragraphs: generated.paragraphs.map((item) => cleanText(item, 500)).filter(Boolean),
        questions: generated.questions.map((question, index) => ({
          id: `ai-q${index + 1}-${crypto.randomUUID()}`,
          prompt: cleanText(question.prompt, 160),
          options: question.options.map((option) => cleanText(option, 90)),
          answer: cleanText(question.answer, 90)
        }))
      }
    });
  } catch (error) {
    return json({
      article: demoArticle(uniqueDemoTheme(theme, avoidArticles), levelId, length),
      warning: error.message,
      source: "demo"
    });
  }
}

async function handleVocabExplain(request, env) {
  const body = await readJson(request);
  return vocabExplainFromBody(body, env);
}

async function vocabExplainFromBody(body, env) {
  const term = cleanText(body.term, 12);
  const context = cleanText(body.context, 320);
  const local = localExplain(term, context);

  if (!term) {
    return json({ error: "Missing term." }, 400);
  }

  if (!hasOpenAIKey(env)) {
    return json({ ...local, source: local.source || "demo" });
  }

  const prompt = [
    "你是一位温和、准确的小学华文老师。",
    "请解释学生在阅读中标记的不认识字词。",
    "要求：拼音用数字或普通拼音均可；中文解释要适合10岁学生；英文解释简短准确；例句用简体中文。",
    "不要编造不常见读音；多音字要根据上下文判断。",
    "",
    `字词：${term}`,
    `上下文：${context || "无"}`,
    "",
    "返回 JSON，字段为 term, pinyin, explanationZh, explanationEn, exampleSentence。"
  ].join("\n");

  try {
    const result = await callOpenAIJson(
      env,
      "chinese_vocab_explanation",
      vocabSchema,
      [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
      900,
      env.OPENAI_EXPLAIN_MODEL || env.OPENAI_MODEL || "gpt-4.1-nano"
    );
    return json({
      term,
      pinyin: cleanText(result.pinyin, 80),
      explanationZh: cleanText(result.explanationZh, 220),
      explanationEn: cleanText(result.explanationEn, 220),
      exampleSentence: cleanText(result.exampleSentence, 180),
      source: "openai"
    });
  } catch (error) {
    return json({ ...local, warning: error.message, source: local.source || "demo" });
  }
}

async function handleLevelAnalyze(request) {
  const body = await readJson(request);
  return json(levelAnalyzeFromBody(body));
}

function levelAnalyzeFromBody(body) {
  const levelId = cleanLevel(body.levelId);
  const stats = body.stats && typeof body.stats === "object" ? body.stats : {};
  return analyzeLocally(levelId, stats);
}

async function handleJsonp(url, env) {
  const callback = cleanCallback(url.searchParams.get("callback") || "");
  const action = url.searchParams.get("action") || "";
  if (!callback) {
    return javascript("console.error('Invalid JSONP callback');", 400);
  }

  let body = {};
  try {
    body = JSON.parse(url.searchParams.get("payload") || "{}");
  } catch {
    return jsonp(callback, { error: "Invalid JSONP payload." }, 400);
  }

  try {
    if (action === "version") {
      return jsonp(callback, versionPayload());
    }
    if (action === "article.generate") {
      return responseToJsonp(callback, await articleGenerateFromBody(body, env));
    }
    if (action === "vocab.explain") {
      return responseToJsonp(callback, await vocabExplainFromBody(body, env));
    }
    if (action === "level.analyze") {
      return jsonp(callback, levelAnalyzeFromBody(body));
    }
    return jsonp(callback, { error: "Unknown JSONP action." }, 400);
  } catch (error) {
    return jsonp(callback, { error: error instanceof Error ? error.message : "JSONP request failed." }, 500);
  }
}

function versionPayload() {
  return {
    version: APP_VERSION,
    checkedAt: new Date().toISOString()
  };
}

function runtimeEnvName(env, url) {
  const configured = String(env.APP_ENV || "").trim();
  if (configured && configured !== "local") return configured;
  if (url.hostname.includes("chinese-reading-coach-staging")) return "staging";
  if (url.hostname.includes("chinese-reading-coach.")) return "production";
  return configured || "local";
}

function analyzeLocally(levelId, stats) {
  const currentIndex = Math.max(0, LEVELS.findIndex((level) => level.id === levelId));
  const unknownRate = Number(stats.unknownRate) || 0;
  const comprehensionScore = Number(stats.comprehensionScore) || 0;
  const answered = Number(stats.answered) || 0;
  let nextIndex = currentIndex >= 0 ? currentIndex : 1;
  let recommendation = "保持当前难度，继续积累复习词。";

  if (unknownRate > 0.16 || comprehensionScore < 0.6) {
    nextIndex = Math.max(0, nextIndex - 1);
    recommendation = "下一篇会稍微降难度，先稳住核心词和文章主旨。";
  } else if (unknownRate < 0.055 && comprehensionScore >= 0.8 && answered >= 3) {
    nextIndex = Math.min(LEVELS.length - 1, nextIndex + 1);
    recommendation = "表现稳定，下一篇可以增加一点挑战词和推理内容。";
  } else if (unknownRate >= 0.05 && unknownRate <= 0.12 && comprehensionScore >= 0.67) {
    recommendation = "难度合适，保持这个水平继续读。";
  }

  return {
    nextLevel: LEVELS[nextIndex].id,
    recommendation,
    source: "worker"
  };
}

function uniqueDemoTheme(preferredTheme, avoidArticles = []) {
  const usedThemes = new Set(avoidArticles.map((item) => item.theme).filter(Boolean));
  const usedTitles = new Set(avoidArticles.map((item) => item.title).filter(Boolean));
  const preferredTitle = `${THEME_LABELS[preferredTheme]}阅读`;
  if (!usedThemes.has(THEME_LABELS[preferredTheme]) && !usedTitles.has(preferredTitle)) {
    return preferredTheme;
  }
  return Object.keys(THEME_LABELS).find((theme) => !usedThemes.has(THEME_LABELS[theme]) && !usedTitles.has(`${THEME_LABELS[theme]}阅读`)) ?? preferredTheme;
}

function demoArticle(theme, levelId, length) {
  const base = {
    campus: [
      "四年级的教室后面有一个小小的图书角。开学不久，大家发现有些书找不到，有些书的书页被折得很深。班长佳宁没有责怪同学，而是请大家一起观察问题出现的原因。",
      "他们讨论后决定制作借书卡，每本书旁边贴上号码，还安排两位同学每天负责整理。刚开始，有人觉得麻烦，可是过了几天，大家发现找书更便利，也更愿意珍惜班上的图书。",
      "林老师说，规则不是为了限制大家，而是帮助大家合作。佳宁听了很有收获。她明白，只要愿意耐心沟通，一个小小的图书角也能让班级变得更有责任感。"
    ],
    singapore: [
      "美玲每天放学都会经过同一个巴士站。以前，那里只有几盆快枯萎的植物。后来，社区中心邀请居民一起照顾小花园，美玲和外公也报名参加。",
      "周末早晨，居民们带来工具，有人松土，有人浇水，有人记录植物的变化。外公告诉美玲，新加坡虽然城市很忙，但只要大家愿意合作，也能在生活中留下绿色的角落。",
      "几个星期后，小花园开出了黄色的小花。等车的人常常停下来看一看。美玲发现，便利的城市不只是有地铁和巴士，也需要让人放慢脚步、珍惜自然的地方。"
    ],
    nature: [
      "星期一早上，林老师把一张环保海报贴在教室门口。海报上画着一只小鸟，旁边写着：“少一点浪费，多一点关心。”小宇看了很久，心里想：如果只是看一看，生活不会改变；如果大家愿意行动，社区也许会变得更干净。",
      "午休时，小宇和同学们讨论可以做些什么。有人建议整理课室的回收箱，有人想提醒大家自带水瓶，还有人负责记录每天丢掉的塑料袋数量。林老师没有马上给答案，只请他们先观察一星期，再根据记录作出判断。",
      "一星期后，同学们发现塑料垃圾真的减少了。虽然改变不算巨大，可是每个人都看见了自己的影响。小宇在分享时说：“环保不是一次活动，而是一种习惯。只要我们坚持，小小的选择也能节约资源。”"
    ],
    science: [
      "科学课上，老师给每组同学几颗绿豆，让他们设计一个小实验。志远的组想知道阳光会不会影响绿豆发芽，于是准备了两个杯子，一个放在窗边，一个放在柜子里。",
      "接下来的五天，他们每天观察并记录变化。窗边的绿豆长得比较快，叶子也更绿；柜子里的绿豆虽然也发芽，却显得细长。志远提醒组员，结论不能只靠一天的结果，要看连续记录。",
      "分享时，志远说：“实验让我们学会用证据说话。”老师点头补充，真正的学习不只是得到答案，还要明白怎样判断答案是否可靠。"
    ],
    culture: [
      "元宵节前，学校举办文化日。礼堂外挂满灯笼，走廊上有剪纸、书法和传统点心的摊位。安琪最感兴趣的是“访问长辈”角落，因为那里坐着几位愿意分享故事的老人。",
      "一位阿姨告诉她，小时候过节并不一定有很多礼物，可是一家人会一起做汤圆、猜灯谜。大家忙了一整天，却觉得心里很温暖。安琪一边听，一边认真记录。",
      "回到班上，她说：“传统不是旧东西，而是把人的感情连接起来的方式。”同学们听了以后，也开始分享自己家里的节日习惯。"
    ],
    mystery: [
      "运动会前一天，四年级的班旗突然不见了。大家有点着急，只有凯文提醒同学先冷静下来，找一找可能的线索。最后一次看到班旗的人说，它原本放在音乐室门口。",
      "凯文观察走廊，发现地上有几滴蓝色颜料，又想起美术组下午在附近布置海报。他没有马上判断是谁拿走了班旗，而是去询问负责海报的同学。",
      "原来，一阵风把班旗吹到海报架后面，美术组以为是多余的布，就暂时收了起来。大家松了一口气。凯文明白，真正的侦探不是急着责怪别人，而是用证据证明想法。"
    ]
  };
  const paragraphs = [...(base[theme] || base.nature)];
  if (length === "short") {
    paragraphs.splice(2);
  }
  if (length === "long" || levelId === "P4_HCL_STRETCH" || levelId === "P5_HCL_BRIDGE") {
    paragraphs.push("这次经历虽然简单，却让同学们开始思考：学习不是背下答案，而是把观察、讨论和行动连接起来，再用自己的话说明理由。");
  }
  return {
    id: `article-${crypto.randomUUID()}`,
    title: `${THEME_LABELS[theme]}阅读`,
    theme,
    levelId,
    source: "demo-api",
    createdAt: new Date().toISOString(),
    paragraphs,
    questions: [
      {
        id: `demo-q1-${crypto.randomUUID()}`,
        prompt: "文章中的人物先做了什么来了解问题？",
        options: ["先观察和记录", "马上责怪别人", "放弃活动", "只看标题"],
        answer: "先观察和记录"
      },
      {
        id: `demo-q2-${crypto.randomUUID()}`,
        prompt: "这篇文章比较强调哪一种学习方法？",
        options: ["用证据判断", "只靠猜测", "避免合作", "记住每个句子"],
        answer: "用证据判断"
      },
      {
        id: `demo-q3-${crypto.randomUUID()}`,
        prompt: "文章最可能想告诉读者什么？",
        options: ["小行动和认真思考可以带来改变", "所有问题都很容易", "规则没有作用", "阅读不需要复习"],
        answer: "小行动和认真思考可以带来改变"
      }
    ]
  };
}

function localExplain(term, context = "") {
  const exact = VOCAB_LIBRARY[term];
  if (exact) {
    return {
      term,
      pinyin: exact[0],
      explanationZh: exact[1],
      explanationEn: exact[2],
      exampleSentence: exact[3],
      source: "local"
    };
  }
  for (const [word, values] of Object.entries(VOCAB_LIBRARY)) {
    if (word.includes(term) || term.includes(word)) {
      return {
        term,
        pinyin: term.length === word.length ? values[0] : "AI 待补充",
        explanationZh: term.length === word.length ? values[1] : `可以结合“${word}”来理解：${values[1]}`,
        explanationEn: term.length === word.length ? values[2] : `Related to "${values[2]}".`,
        exampleSentence: values[3],
        source: "local-related"
      };
    }
  }
  return {
    term,
    pinyin: "AI 待补充",
    explanationZh: term.length > 1 ? "这个词需要结合上下文理解。AI 会补充准确拼音和解释。" : "这个字已加入复习本。AI 会补充准确拼音和解释。",
    explanationEn: term.length > 1 ? "This word needs context. AI will provide the exact meaning." : "This character has been saved for review.",
    exampleSentence: context ? `原文：${context.slice(0, 42)}${context.length > 42 ? "..." : ""}` : `我正在学习“${term}”。`,
    source: "fallback"
  };
}

function hasOpenAIKey(env) {
  return typeof env.OPENAI_API_KEY === "string" && env.OPENAI_API_KEY.startsWith("sk-");
}

async function callOpenAIJson(env, name, schema, input, maxOutputTokens, model) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input,
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema
        }
      },
      max_output_tokens: maxOutputTokens
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || `OpenAI request failed with ${response.status}`);
  }
  const text = extractOutputText(payload);
  if (!text) {
    throw new Error("OpenAI returned no text output.");
  }
  return JSON.parse(text);
}

function extractOutputText(payload) {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }
  const chunks = [];
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string") chunks.push(content.text);
      if (typeof content.output_text === "string") chunks.push(content.output_text);
    }
  }
  return chunks.join("\n").trim();
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function responseToJsonp(callback, response) {
  const payload = await response.json().catch(() => ({ error: "Invalid API response." }));
  return jsonp(callback, payload, response.status);
}

function jsonp(callback, payload, status = 200) {
  return javascript(`${callback}(${JSON.stringify(payload)});`, status);
}

function javascript(source, status = 200) {
  return new Response(source, {
    status,
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function cleanCallback(value) {
  const callback = String(value || "").slice(0, 120);
  return /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(callback) ? callback : "";
}

function cleanChoice(value, choices, fallback) {
  return Object.prototype.hasOwnProperty.call(choices, value) ? value : fallback;
}

function cleanLevel(value) {
  return LEVELS.some((level) => level.id === value) ? value : "P4_HCL_BASELINE";
}

function cleanText(value, maxLength) {
  return String(value ?? "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}
