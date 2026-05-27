import { APP_VERSION } from "/version.js?v=2026.05.27.5";

const PROFILE_LIST_KEY = "crcProfiles";
const SELECTED_PROFILE_KEY = "crcSelectedProfile";
const DATA_PREFIX = "crcLearnerData:";
const UPDATE_CHECK_INTERVAL_MS = 60_000;
const CLIENT_VERSION = new URL(import.meta.url).searchParams.get("v") || APP_VERSION;

const DEFAULT_PROFILES = [
  {
    id: "student-main",
    name: "学生",
    role: "student",
    createdAt: "2026-05-27T00:00:00.000Z"
  },
  {
    id: "tester-sandbox",
    name: "测试员",
    role: "tester",
    createdAt: "2026-05-27T00:00:00.000Z"
  }
];

const LEVELS = [
  {
    id: "P4_CL_SUPPORT",
    label: "小四华文巩固",
    short: "降低篇幅，优先稳住核心词语和句子理解。",
    meter: 38,
    targetUnknown: "8%-14%"
  },
  {
    id: "P4_HCL_BASELINE",
    label: "小四高级华文基准",
    short: "以核心单元为主，加入少量深广词语。",
    meter: 58,
    targetUnknown: "5%-12%"
  },
  {
    id: "P4_HCL_STRETCH",
    label: "小四高级华文拓展",
    short: "文章更完整，推理和说明性词语略多。",
    meter: 74,
    targetUnknown: "4%-10%"
  },
  {
    id: "P5_HCL_BRIDGE",
    label: "小五高级华文衔接",
    short: "开始接触更长段落和抽象表达。",
    meter: 86,
    targetUnknown: "4%-9%"
  }
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

const SMART_WORD_STOPLIST = new Set([
  "一个",
  "一种",
  "一次",
  "一些",
  "一样",
  "这个",
  "那个",
  "这里",
  "那里",
  "只是",
  "如果",
  "因为",
  "所以",
  "但是",
  "可是",
  "没有",
  "不是",
  "已经",
  "正在",
  "可以",
  "自己",
  "什么"
]);

const ARTICLE_TEMPLATES = {
  nature: {
    title: "一张环保海报带来的改变",
    paragraphs: [
      "星期一早上，林老师把一张环保海报贴在教室门口。海报上画着一只小鸟，旁边写着：“少一点浪费，多一点关心。”小宇看了很久，心里想：如果只是看一看，生活不会改变；如果大家愿意行动，社区也许会变得更干净。",
      "午休时，小宇和同学们讨论可以做些什么。有人建议整理课室的回收箱，有人想提醒大家自带水瓶，还有人负责记录每天丢掉的塑料袋数量。林老师没有马上给答案，只请他们先观察一星期，再根据记录作出判断。",
      "一星期后，同学们发现塑料垃圾真的减少了。虽然改变不算巨大，可是每个人都看见了自己的影响。小宇在分享时说：“环保不是一次活动，而是一种习惯。只要我们坚持，小小的选择也能节约资源。”",
      "后来，学校把他们的做法介绍给附近社区。居民们也开始分类回收。小宇明白了，学习不只在课本里，也在生活里的每一次合作和负责之中。"
    ],
    questions: [
      {
        id: "nature-q1",
        prompt: "林老师为什么请同学们先观察一星期？",
        options: ["因为她不知道答案", "因为她希望同学们根据记录判断", "因为她忘记安排活动", "因为海报不够漂亮"],
        answer: "因为她希望同学们根据记录判断"
      },
      {
        id: "nature-q2",
        prompt: "小宇最后明白了什么？",
        options: ["环保只适合学校做", "学习也可以来自生活中的行动", "回收箱越多越好", "海报比行动更重要"],
        answer: "学习也可以来自生活中的行动"
      },
      {
        id: "nature-q3",
        prompt: "这篇文章最主要想表达什么？",
        options: ["坚持小行动也能带来改变", "午休时间应该更长", "社区居民都很忙", "画海报是最重要的功课"],
        answer: "坚持小行动也能带来改变"
      }
    ]
  },
  campus: {
    title: "图书角的新规则",
    paragraphs: [
      "四年级的教室后面有一个小小的图书角。开学不久，大家发现有些书找不到，有些书的书页被折得很深。班长佳宁没有责怪同学，而是请大家一起观察问题出现的原因。",
      "他们讨论后决定制作借书卡，每本书旁边贴上号码，还安排两位同学每天负责整理。刚开始，有人觉得麻烦，可是过了几天，大家发现找书更便利，也更愿意珍惜班上的图书。",
      "林老师说，规则不是为了限制大家，而是帮助大家合作。佳宁听了很有收获。她明白，只要愿意耐心沟通，一个小小的图书角也能让班级变得更有责任感。"
    ],
    questions: [
      {
        id: "campus-q1",
        prompt: "佳宁发现图书角有问题后，先做了什么？",
        options: ["责怪同学", "把书全部收起来", "请大家观察原因", "不再开放图书角"],
        answer: "请大家观察原因"
      },
      {
        id: "campus-q2",
        prompt: "新规则带来了什么好处？",
        options: ["同学更容易找书", "图书角变得更小", "大家不用借书卡", "老师不用上课"],
        answer: "同学更容易找书"
      },
      {
        id: "campus-q3",
        prompt: "林老师认为规则的作用是什么？",
        options: ["限制大家", "帮助大家合作", "让班长更忙", "让书变新"],
        answer: "帮助大家合作"
      }
    ]
  },
  singapore: {
    title: "巴士站旁的小花园",
    paragraphs: [
      "美玲每天放学都会经过同一个巴士站。以前，那里只有几盆快枯萎的植物。后来，社区中心邀请居民一起照顾小花园，美玲和外公也报名参加。",
      "周末早晨，居民们带来工具，有人松土，有人浇水，有人记录植物的变化。外公告诉美玲，新加坡虽然城市很忙，但只要大家愿意合作，也能在生活中留下绿色的角落。",
      "几个星期后，小花园开出了黄色的小花。等车的人常常停下来看一看。美玲发现，便利的城市不只是有地铁和巴士，也需要让人放慢脚步、珍惜自然的地方。"
    ],
    questions: [
      {
        id: "singapore-q1",
        prompt: "社区中心邀请居民做什么？",
        options: ["搬走巴士站", "照顾小花园", "修理地铁", "举办考试"],
        answer: "照顾小花园"
      },
      {
        id: "singapore-q2",
        prompt: "外公想告诉美玲什么？",
        options: ["城市里也能有绿色角落", "植物不需要水", "居民不应该合作", "巴士站不重要"],
        answer: "城市里也能有绿色角落"
      },
      {
        id: "singapore-q3",
        prompt: "美玲对城市生活有了什么新的想法？",
        options: ["只要交通便利就够了", "自然空间也很重要", "等车一定很无聊", "黄色小花没有用"],
        answer: "自然空间也很重要"
      }
    ]
  },
  science: {
    title: "窗边的绿豆实验",
    paragraphs: [
      "科学课上，老师给每组同学几颗绿豆，让他们设计一个小实验。志远的组想知道阳光会不会影响绿豆发芽，于是准备了两个杯子，一个放在窗边，一个放在柜子里。",
      "接下来的五天，他们每天观察并记录变化。窗边的绿豆长得比较快，叶子也更绿；柜子里的绿豆虽然也发芽，却显得细长。志远提醒组员，结论不能只靠一天的结果，要看连续记录。",
      "分享时，志远说：“实验让我们学会用证据说话。”老师点头补充，真正的学习不只是得到答案，还要明白怎样判断答案是否可靠。"
    ],
    questions: [
      {
        id: "science-q1",
        prompt: "志远的小组想研究什么？",
        options: ["水杯的颜色", "阳光会不会影响绿豆发芽", "柜子有多高", "叶子能不能画画"],
        answer: "阳光会不会影响绿豆发芽"
      },
      {
        id: "science-q2",
        prompt: "为什么不能只看一天的结果？",
        options: ["因为记录太多", "因为要看连续变化才可靠", "因为老师不喜欢", "因为绿豆不会发芽"],
        answer: "因为要看连续变化才可靠"
      },
      {
        id: "science-q3",
        prompt: "这篇文章强调实验能帮助我们学会什么？",
        options: ["用证据说话", "把杯子放整齐", "减少写字", "更快放学"],
        answer: "用证据说话"
      }
    ]
  },
  culture: {
    title: "灯笼下的访问",
    paragraphs: [
      "元宵节前，学校举办文化日。礼堂外挂满灯笼，走廊上有剪纸、书法和传统点心的摊位。安琪最感兴趣的是“访问长辈”角落，因为那里坐着几位愿意分享故事的老人。",
      "一位阿姨告诉她，小时候过节并不一定有很多礼物，可是一家人会一起做汤圆、猜灯谜。大家忙了一整天，却觉得心里很温暖。安琪一边听，一边认真记录。",
      "回到班上，她说：“传统不是旧东西，而是把人的感情连接起来的方式。”同学们听了以后，也开始分享自己家里的节日习惯。"
    ],
    questions: [
      {
        id: "culture-q1",
        prompt: "安琪最感兴趣的是哪个角落？",
        options: ["访问长辈", "运动比赛", "电脑游戏", "植物实验"],
        answer: "访问长辈"
      },
      {
        id: "culture-q2",
        prompt: "阿姨小时候过节时会做什么？",
        options: ["一起做汤圆、猜灯谜", "只看电视", "去机场", "整理回收箱"],
        answer: "一起做汤圆、猜灯谜"
      },
      {
        id: "culture-q3",
        prompt: "安琪怎样理解传统？",
        options: ["传统只属于老人", "传统能连接人的感情", "传统没有意义", "传统就是礼物"],
        answer: "传统能连接人的感情"
      }
    ]
  },
  mystery: {
    title: "消失的班旗",
    paragraphs: [
      "运动会前一天，四年级的班旗突然不见了。大家有点着急，只有凯文提醒同学先冷静下来，找一找可能的线索。最后一次看到班旗的人说，它原本放在音乐室门口。",
      "凯文观察走廊，发现地上有几滴蓝色颜料，又想起美术组下午在附近布置海报。他没有马上判断是谁拿走了班旗，而是去询问负责海报的同学。",
      "原来，一阵风把班旗吹到海报架后面，美术组以为是多余的布，就暂时收了起来。大家松了一口气。凯文明白，真正的侦探不是急着责怪别人，而是用证据证明想法。"
    ],
    questions: [
      {
        id: "mystery-q1",
        prompt: "班旗最后一次被看到在哪里？",
        options: ["音乐室门口", "食堂", "图书馆", "操场中央"],
        answer: "音乐室门口"
      },
      {
        id: "mystery-q2",
        prompt: "凯文为什么没有马上责怪别人？",
        options: ["他不关心班旗", "他想先根据线索和证据判断", "他已经知道答案", "他忘记运动会"],
        answer: "他想先根据线索和证据判断"
      },
      {
        id: "mystery-q3",
        prompt: "班旗为什么会消失？",
        options: ["被风吹到海报架后面，又被误收起来", "被老师带回家", "被同学故意丢掉", "从来没有班旗"],
        answer: "被风吹到海报架后面，又被误收起来"
      }
    ]
  }
};

const els = {
  updateBanner: document.querySelector("#updateBanner"),
  updateMessage: document.querySelector("#updateMessage"),
  updateNowBtn: document.querySelector("#updateNowBtn"),
  profileGate: document.querySelector("#profileGate"),
  profileList: document.querySelector("#profileList"),
  profileForm: document.querySelector("#profileForm"),
  profileNameInput: document.querySelector("#profileNameInput"),
  profileRoleInput: document.querySelector("#profileRoleInput"),
  readingView: document.querySelector("#readingView"),
  mistakeBookView: document.querySelector("#mistakeBookView"),
  readingPageBtn: document.querySelector("#readingPageBtn"),
  mistakeBookBtn: document.querySelector("#mistakeBookBtn"),
  switchProfileBtn: document.querySelector("#switchProfileBtn"),
  profileBadge: document.querySelector("#profileBadge"),
  roleBadge: document.querySelector("#roleBadge"),
  versionBadge: document.querySelector("#versionBadge"),
  saveBadge: document.querySelector("#saveBadge"),
  levelCard: document.querySelector("#levelCard"),
  themeInput: document.querySelector("#themeInput"),
  lengthInput: document.querySelector("#lengthInput"),
  generateBtn: document.querySelector("#generateBtn"),
  sessionStats: document.querySelector("#sessionStats"),
  finishBtn: document.querySelector("#finishBtn"),
  articleMeta: document.querySelector("#articleMeta"),
  articleTitle: document.querySelector("#articleTitle"),
  articleText: document.querySelector("#articleText"),
  questionList: document.querySelector("#questionList"),
  selectedVocab: document.querySelector("#selectedVocab"),
  reviewFilter: document.querySelector("#reviewFilter"),
  vocabList: document.querySelector("#vocabList"),
  openMistakeBookBtn: document.querySelector("#openMistakeBookBtn"),
  mistakeBookFilter: document.querySelector("#mistakeBookFilter"),
  mistakeBookGenerateBtn: document.querySelector("#mistakeBookGenerateBtn"),
  backToReadingBtn: document.querySelector("#backToReadingBtn"),
  mistakeBookStats: document.querySelector("#mistakeBookStats"),
  mistakeBookGrid: document.querySelector("#mistakeBookGrid"),
  progressPanel: document.querySelector("#progressPanel"),
  toast: document.querySelector("#toast")
};

const state = {
  profiles: [],
  profile: null,
  data: null,
  selectedTerm: null,
  toastTimer: null
};

let pendingUpdateVersion = null;

init();

function init() {
  state.profiles = loadProfiles();
  const selectedId = localStorage.getItem(SELECTED_PROFILE_KEY);
  const selected = state.profiles.find((profile) => profile.id === selectedId);
  bindEvents();
  setupUpdateChecks();
  renderProfileGate();
  if (selected) {
    selectProfile(selected.id, { keepGateClosed: true });
  } else {
    showProfileGate();
  }
}

function bindEvents() {
  els.profileForm.addEventListener("submit", handleProfileCreate);
  els.updateNowBtn.addEventListener("click", updateToLatestVersion);
  els.profileList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-profile-id]");
    if (!button) return;
    selectProfile(button.dataset.profileId);
  });
  els.readingPageBtn.addEventListener("click", () => navigateTo("reading"));
  els.mistakeBookBtn.addEventListener("click", () => navigateTo("mistakes"));
  els.openMistakeBookBtn.addEventListener("click", () => navigateTo("mistakes"));
  els.backToReadingBtn.addEventListener("click", () => navigateTo("reading"));
  els.switchProfileBtn.addEventListener("click", showProfileGate);
  els.generateBtn.addEventListener("click", generateArticle);
  els.mistakeBookGenerateBtn.addEventListener("click", generateArticleFromMistakeBook);
  els.finishBtn.addEventListener("click", finishReading);
  els.articleText.addEventListener("click", handleArticleClick);
  els.questionList.addEventListener("change", handleQuestionAnswer);
  els.reviewFilter.addEventListener("change", renderVocabList);
  els.mistakeBookFilter.addEventListener("change", () => {
    els.reviewFilter.value = els.mistakeBookFilter.value;
    renderVocabList();
    renderMistakeBook();
  });
  document.addEventListener("click", handleStatusClick);
  window.addEventListener("hashchange", renderRoute);
}

function loadProfiles() {
  const parsed = safeJson(localStorage.getItem(PROFILE_LIST_KEY));
  if (Array.isArray(parsed) && parsed.length) {
    return parsed;
  }
  localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(DEFAULT_PROFILES));
  return [...DEFAULT_PROFILES];
}

function saveProfiles() {
  localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(state.profiles));
}

function showProfileGate() {
  renderProfileGate();
  els.profileGate.classList.remove("hidden");
}

function hideProfileGate() {
  els.profileGate.classList.add("hidden");
}

function renderProfileGate() {
  els.profileList.innerHTML = state.profiles
    .map((profile) => {
      const roleText = profile.role === "student" ? "学生 · 真实进度" : "测试员 · 沙盒";
      const data = loadLearnerData(profile, { silent: true });
      const level = levelById(data.currentLevel);
      const vocabCount = Object.keys(data.vocabulary ?? {}).length;
      return `
        <button class="profile-card ${profile.role}" type="button" data-profile-id="${escapeHtml(profile.id)}">
          <strong>${escapeHtml(profile.name)}</strong>
          <span>${escapeHtml(roleText)}</span>
          <span>${escapeHtml(level.label)} · ${vocabCount} 个错字词</span>
        </button>
      `;
    })
    .join("");
}

function handleProfileCreate(event) {
  event.preventDefault();
  const name = els.profileNameInput.value.trim();
  const role = els.profileRoleInput.value === "tester" ? "tester" : "student";
  if (!name) {
    showToast("请输入账号名称。");
    return;
  }
  const profile = {
    id: `${role}-${slugify(name)}-${Date.now().toString(36)}`,
    name,
    role,
    createdAt: new Date().toISOString()
  };
  state.profiles.push(profile);
  saveProfiles();
  els.profileNameInput.value = "";
  renderProfileGate();
  selectProfile(profile.id);
}

function selectProfile(profileId, options = {}) {
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) return;
  state.profile = profile;
  state.data = loadLearnerData(profile);
  state.selectedTerm = null;
  localStorage.setItem(SELECTED_PROFILE_KEY, profile.id);
  if (!options.keepGateClosed) {
    hideProfileGate();
  } else {
    hideProfileGate();
  }
  renderAll();
}

function dataKey(profileId) {
  return `${DATA_PREFIX}${profileId}`;
}

function loadLearnerData(profile, options = {}) {
  const parsed = safeJson(localStorage.getItem(dataKey(profile.id)));
  if (parsed?.version && parsed?.currentArticleId) {
    return parsed;
  }
  const firstArticle = createLocalArticle("nature", "P4_HCL_BASELINE", "medium");
  const data = {
    version: APP_VERSION,
    profileId: profile.id,
    startLevel: "P4_HCL_BASELINE",
    currentLevel: "P4_HCL_BASELINE",
    currentArticleId: firstArticle.id,
    articles: [firstArticle],
    vocabulary: {},
    snapshots: [],
    sessions: []
  };
  if (!options.silent) {
    localStorage.setItem(dataKey(profile.id), JSON.stringify(data));
  }
  return data;
}

function saveData() {
  if (!state.profile || !state.data) return;
  localStorage.setItem(dataKey(state.profile.id), JSON.stringify(state.data));
  pulseSaved();
}

function pulseSaved() {
  els.saveBadge.textContent = "已保存";
  els.saveBadge.classList.add("soft");
  window.clearTimeout(pulseSaved.timer);
  pulseSaved.timer = window.setTimeout(() => {
    els.saveBadge.textContent = "本地记录";
  }, 1300);
}

function normalizeVersion(version) {
  return String(version ?? "").trim();
}

function renderUpdateBanner(version) {
  pendingUpdateVersion = version;
  els.updateMessage.textContent = `发现新版本 ${version}。`;
  els.updateBanner.classList.remove("hidden");
}

function hideUpdateBanner() {
  pendingUpdateVersion = null;
  els.updateBanner.classList.add("hidden");
  els.updateNowBtn.disabled = false;
  els.updateNowBtn.textContent = "更新";
}

function renderAppVersion() {
  els.versionBadge.textContent = `Version ${CLIENT_VERSION}`;
  els.versionBadge.title = `当前版本 ${CLIENT_VERSION}`;
}

async function checkForAppUpdate() {
  try {
    const payload = await getJson(`/api/version?client=${encodeURIComponent(CLIENT_VERSION)}&t=${Date.now()}`);
    const serverVersion = normalizeVersion(payload.version);
    if (serverVersion && serverVersion !== CLIENT_VERSION) {
      renderUpdateBanner(serverVersion);
      return;
    }
    hideUpdateBanner();
  } catch {
    els.versionBadge.title = `当前版本 ${CLIENT_VERSION}`;
  }
}

async function clearBrowserAppCaches() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
}

async function updateToLatestVersion() {
  if (!pendingUpdateVersion) return;

  const version = pendingUpdateVersion;
  els.updateNowBtn.disabled = true;
  els.updateNowBtn.textContent = "更新中";

  try {
    await clearBrowserAppCaches();
  } catch {
    // Reloading with a versioned URL still helps when cache APIs are unavailable.
  } finally {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("v", version);
    nextUrl.searchParams.set("updatedAt", String(Date.now()));
    window.location.replace(nextUrl.toString());
  }
}

function setupUpdateChecks() {
  renderAppVersion();
  checkForAppUpdate();
  window.setInterval(checkForAppUpdate, UPDATE_CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      checkForAppUpdate();
    }
  });
}

function renderAll() {
  if (!state.profile || !state.data) return;
  renderTopbar();
  renderLevelCard();
  renderReader();
  renderQuestions();
  renderStats();
  renderSelectedVocab();
  renderVocabList();
  renderMistakeBook();
  renderProgress();
  renderRoute();
}

function renderTopbar() {
  els.profileBadge.textContent = state.profile.name;
  els.roleBadge.textContent = state.profile.role === "student" ? "学生" : "测试员";
  els.roleBadge.style.background = state.profile.role === "student" ? "var(--teal-soft)" : "var(--blue-soft)";
  els.roleBadge.style.color = state.profile.role === "student" ? "var(--teal)" : "var(--blue)";
}

function navigateTo(view) {
  window.location.hash = view === "mistakes" ? "#mistakes" : "#reading";
  renderRoute();
}

function renderRoute() {
  const isMistakes = window.location.hash === "#mistakes";
  els.readingView.classList.toggle("hidden", isMistakes);
  els.mistakeBookView.classList.toggle("hidden", !isMistakes);
  els.readingPageBtn.classList.toggle("active", !isMistakes);
  els.mistakeBookBtn.classList.toggle("active", isMistakes);
  if (isMistakes) {
    renderMistakeBook();
  }
}

function renderLevelCard() {
  const level = levelById(state.data.currentLevel);
  els.levelCard.innerHTML = `
    <div>
      <strong>${escapeHtml(level.label)}</strong>
      <p>${escapeHtml(level.short)}</p>
    </div>
    <div class="level-meter" aria-label="水平进度">
      <div class="meter-track"><div class="meter-fill" style="width: ${level.meter}%"></div></div>
      <p>目标生字率：${escapeHtml(level.targetUnknown)}</p>
    </div>
  `;
}

function renderReader() {
  const article = currentArticle();
  if (!article) return;
  const level = levelById(article.levelId);
  els.articleMeta.textContent = `${level.label} · ${THEME_LABELS[article.theme] ?? article.theme} · ${article.source === "openai" ? "AI" : "Demo"}`;
  els.articleTitle.textContent = article.title;

  let html = "";
  let index = 0;
  for (const paragraph of article.paragraphs) {
    html += `<p class="article-paragraph">`;
    for (const char of Array.from(paragraph)) {
      if (isChineseChar(char)) {
        const marked = markAtIndex(article, index);
        const classes = ["char-token", marked ? "marked" : ""].filter(Boolean).join(" ");
        const title = marked ? `已标记：${marked.term}` : "标记";
        html += `<button class="${classes}" type="button" data-index="${index}" title="${escapeHtml(title)}" aria-label="标记 ${escapeHtml(char)}">${escapeHtml(char)}</button>`;
        index += 1;
      } else {
        html += `<span class="punct-token">${escapeHtml(char)}</span>`;
      }
    }
    html += `</p>`;
  }
  els.articleText.innerHTML = html;
}

function renderQuestions() {
  const article = currentArticle();
  if (!article) return;
  const answers = article.answers ?? {};
  const showResult = Boolean(article.analysis);
  els.questionList.innerHTML = article.questions
    .map((question, questionIndex) => {
      const selected = answers[question.id] ?? "";
      const options = question.options
        .map((option) => {
          const checked = selected === option ? "checked" : "";
          const resultClass = showResult && option === question.answer ? "correct" : showResult && selected === option ? "wrong" : "";
          return `
            <label class="option-label ${resultClass}">
              <input type="radio" name="${escapeHtml(question.id)}" value="${escapeHtml(option)}" ${checked} />
              <span>${escapeHtml(option)}</span>
            </label>
          `;
        })
        .join("");
      return `
        <section class="question-card">
          <h3>${questionIndex + 1}. ${escapeHtml(question.prompt)}</h3>
          <div class="option-grid">${options}</div>
        </section>
      `;
    })
    .join("");
}

function renderStats() {
  const article = currentArticle();
  if (!article) return;
  const stats = articleStats(article);
  els.sessionStats.innerHTML = `
    <div class="stat"><span>字数</span><strong>${stats.charCount}</strong></div>
    <div class="stat"><span>标记</span><strong>${stats.markedTerms}</strong></div>
    <div class="stat"><span>生字率</span><strong>${formatPercent(stats.unknownRate)}</strong></div>
    <div class="stat"><span>理解题</span><strong>${stats.answered}/${article.questions.length}</strong></div>
  `;
}

function renderSelectedVocab() {
  const term = state.selectedTerm;
  const item = term ? state.data.vocabulary[term] : null;
  if (!item) {
    els.selectedVocab.className = "selected-vocab empty-state";
    els.selectedVocab.textContent = "暂无选中字词。";
    return;
  }
  els.selectedVocab.className = "selected-vocab";
  els.selectedVocab.innerHTML = vocabCardContent(item, { compact: false });
}

function renderVocabList() {
  if (!state.data) return;
  const filter = els.reviewFilter.value;
  els.mistakeBookFilter.value = filter;
  const items = sortedVocabItems().filter((item) => filter === "all" || item.status === filter);

  if (!items.length) {
    els.vocabList.innerHTML = `<div class="empty-state">暂无错字词。</div>`;
    return;
  }
  els.vocabList.innerHTML = items
    .map((item) => `<section class="vocab-card">${vocabCardContent(item, { compact: true })}</section>`)
    .join("");
}

function sortedVocabItems() {
  const statusWeight = { new: 0, learning: 1, mastered: 2 };
  return Object.values(state.data?.vocabulary ?? {}).sort(
    (a, b) => statusWeight[a.status] - statusWeight[b.status] || b.hitCount - a.hitCount || b.updatedAt.localeCompare(a.updatedAt)
  );
}

function renderMistakeBook() {
  if (!state.data) return;
  const filter = els.mistakeBookFilter.value || "all";
  const items = sortedVocabItems().filter((item) => filter === "all" || item.status === filter);
  const allItems = Object.values(state.data.vocabulary ?? {});
  const newItems = allItems.filter((item) => item.status === "new").length;
  const learning = allItems.filter((item) => item.status === "learning").length;
  const mastered = allItems.filter((item) => item.status === "mastered").length;

  els.mistakeBookStats.innerHTML = `
    <div class="stat"><span>全部</span><strong>${allItems.length}</strong></div>
    <div class="stat"><span>不会</span><strong>${newItems}</strong></div>
    <div class="stat"><span>练习中</span><strong>${learning}</strong></div>
    <div class="stat"><span>已掌握</span><strong>${mastered}</strong></div>
  `;

  els.mistakeBookGenerateBtn.disabled = !allItems.some((item) => item.status !== "mastered");

  if (!items.length) {
    const message = allItems.length ? "这个筛选下暂无字词。" : "还没有错字词。读文章时点一下不认识的字，系统会自动判断字或词并加入这里。";
    els.mistakeBookGrid.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
    return;
  }

  els.mistakeBookGrid.innerHTML = items.map((item) => `<section class="vocab-card">${vocabCardContent(item)}</section>`).join("");
}

function vocabCardContent(item, options = {}) {
  const hits = item.hitCount > 1 ? ` · ${item.hitCount}次` : "";
  return `
    <div class="vocab-head">
      <div>
        <div class="vocab-term">${escapeHtml(item.term)}</div>
        <div class="vocab-pinyin">${escapeHtml(item.pinyin || "AI 待补充")}${escapeHtml(hits)}</div>
      </div>
    </div>
    <p class="vocab-text">${escapeHtml(item.explanationZh)}</p>
    <p class="vocab-text en">${escapeHtml(item.explanationEn)}</p>
    ${options.compact ? "" : `<p class="vocab-example">${escapeHtml(item.exampleSentence)}</p>`}
    <div class="status-row" role="group" aria-label="掌握状态">
      ${statusButton(item, "new", "不会")}
      ${statusButton(item, "learning", "练习中")}
      ${statusButton(item, "mastered", "已掌握")}
    </div>
  `;
}

function statusButton(item, status, label) {
  const active = item.status === status ? "active" : "";
  return `<button class="status-btn ${active}" type="button" data-term="${escapeHtml(item.term)}" data-status="${status}">${label}</button>`;
}

function renderProgress() {
  const snapshots = state.data.snapshots ?? [];
  const latest = snapshots[0];
  const vocabItems = Object.values(state.data.vocabulary ?? {});
  const mastered = vocabItems.filter((item) => item.status === "mastered").length;
  const learning = vocabItems.filter((item) => item.status === "learning").length;
  const newItems = vocabItems.filter((item) => item.status === "new").length;
  const summary = latest
    ? `${latest.recommendation} 生字率 ${formatPercent(latest.unknownRate)}，理解题 ${formatPercent(latest.comprehensionScore)}。`
    : "读完一篇文章后会生成水平判断。";
  const historyHtml = snapshots
    .slice(0, 4)
    .map(
      (snapshot) => `
        <div class="history-item">
          <span>${formatDate(snapshot.createdAt)}</span>
          <strong>${escapeHtml(levelById(snapshot.nextLevel).label)}</strong>
        </div>
      `
    )
    .join("");

  els.progressPanel.innerHTML = `
    <div class="progress-card">
      <strong>${escapeHtml(levelById(state.data.currentLevel).label)}</strong>
      <p>${escapeHtml(summary)}</p>
    </div>
    <div class="stat-grid">
      <div class="stat"><span>不会</span><strong>${newItems}</strong></div>
      <div class="stat"><span>练习中</span><strong>${learning}</strong></div>
      <div class="stat"><span>已掌握</span><strong>${mastered}</strong></div>
      <div class="stat"><span>文章</span><strong>${state.data.articles.length}</strong></div>
    </div>
    <div class="history-list">${historyHtml || `<div class="empty-state">暂无历史判断。</div>`}</div>
  `;
}

function handleArticleClick(event) {
  const button = event.target.closest("[data-index]");
  if (!button || !state.data) return;
  const index = Number(button.dataset.index);
  if (!Number.isInteger(index)) return;
  const article = currentArticle();
  if (!article) return;

  const existing = markAtIndex(article, index);
  if (existing) {
    article.marks = (article.marks ?? []).filter((mark) => mark.id !== existing.id);
    state.selectedTerm = existing.term;
    showToast(`已取消本篇标记：${existing.term}`);
  } else {
    const range = smartRangeForIndex(article, index);
    addMark(article, range.start, range.end);
  }
  saveData();
  renderAll();
}

function addMark(article, start, end) {
  const term = getTermForRange(article, start, end);
  if (!term) return;
  article.marks = (article.marks ?? []).filter((mark) => mark.end < start || mark.start > end);
  const mark = {
    id: `${start}-${end}-${Date.now().toString(36)}`,
    term,
    start,
    end,
    context: contextForRange(article, start, end),
    createdAt: new Date().toISOString()
  };
  article.marks.push(mark);
  upsertVocab(term, mark.context, article.id);
  state.selectedTerm = term;
  showToast(`已加入错字本：${term}`);
  void enrichTermFromApi(term, mark.context);
}

function upsertVocab(term, context, articleId) {
  const now = new Date().toISOString();
  const existing = state.data.vocabulary[term];
  if (existing) {
    existing.hitCount += 1;
    existing.context = context || existing.context;
    existing.articleIds = Array.from(new Set([...(existing.articleIds ?? []), articleId]));
    existing.updatedAt = now;
    return existing;
  }
  const explanation = localExplain(term, context);
  const item = {
    term,
    pinyin: explanation.pinyin,
    explanationZh: explanation.explanationZh,
    explanationEn: explanation.explanationEn,
    exampleSentence: explanation.exampleSentence,
    context,
    articleIds: [articleId],
    status: "new",
    hitCount: 1,
    firstSeenAt: now,
    updatedAt: now,
    source: explanation.source
  };
  state.data.vocabulary[term] = item;
  return item;
}

async function enrichTermFromApi(term, context) {
  try {
    const payload = await api("/api/vocab/explain", {
      term,
      context,
      levelId: state.data.currentLevel
    });
    if (!payload?.term || !state.data?.vocabulary?.[term]) return;
    Object.assign(state.data.vocabulary[term], {
      pinyin: payload.pinyin || state.data.vocabulary[term].pinyin,
      explanationZh: payload.explanationZh || state.data.vocabulary[term].explanationZh,
      explanationEn: payload.explanationEn || state.data.vocabulary[term].explanationEn,
      exampleSentence: payload.exampleSentence || state.data.vocabulary[term].exampleSentence,
      source: payload.source || "api",
      updatedAt: new Date().toISOString()
    });
    saveData();
    renderSelectedVocab();
    renderVocabList();
    renderMistakeBook();
  } catch {
    // Static demo mode has no API. Local explanations stay in place.
  }
}

function handleQuestionAnswer(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
  const article = currentArticle();
  if (!article) return;
  article.answers = article.answers ?? {};
  article.answers[input.name] = input.value;
  delete article.analysis;
  saveData();
  renderStats();
}

function handleStatusClick(event) {
  const button = event.target.closest(".status-btn");
  if (!button || !state.data) return;
  const term = button.dataset.term;
  const status = button.dataset.status;
  const item = state.data.vocabulary[term];
  if (!item || !["new", "learning", "mastered"].includes(status)) return;
  item.status = status;
  item.updatedAt = new Date().toISOString();
  state.selectedTerm = term;
  saveData();
  renderSelectedVocab();
  renderVocabList();
  renderMistakeBook();
  renderProgress();
}

function generateArticleFromMistakeBook() {
  const terms = targetReviewTerms(18);
  if (!terms.length) {
    showToast("错字本里还没有需要练习的字词。");
    return;
  }
  navigateTo("reading");
  return generateArticle({ focusTerms: terms, source: "mistakeBook" });
}

async function generateArticle(options = {}) {
  if (!state.data) return;
  const theme = els.themeInput.value;
  const length = els.lengthInput.value;
  const levelId = state.data.currentLevel;
  const focusTerms = options.focusTerms ?? targetReviewTerms(18);
  const avoidArticles = recentArticleBriefs(8);
  els.generateBtn.disabled = true;
  els.mistakeBookGenerateBtn.disabled = true;
  els.generateBtn.textContent = "生成中";
  try {
    const payload = await api("/api/article/generate", {
      theme,
      length,
      levelId,
      profileRole: state.profile.role,
      recentTerms: focusTerms.map((item) => item.term),
      targetTerms: focusTerms,
      avoidArticles
    });
    addGeneratedArticle(normalizeArticle(payload.article, theme, levelId, length));
    const targetText = focusTerms.length ? `，已带入 ${Math.min(focusTerms.length, 6)} 个错字词` : "";
    showToast(payload.article?.source === "openai" ? `AI 文章已生成${targetText}。` : `示例文章已生成${targetText}。`);
  } catch {
    addGeneratedArticle(createLocalArticle(uniqueLocalTheme(theme), levelId, length));
    showToast("已使用本地示例生成文章。");
  } finally {
    els.generateBtn.disabled = false;
    els.mistakeBookGenerateBtn.disabled = !targetReviewTerms(1).length;
    els.generateBtn.textContent = "生成下一篇";
  }
}

function addGeneratedArticle(article) {
  state.data.articles.unshift(article);
  state.data.articles = state.data.articles.slice(0, 20);
  state.data.currentArticleId = article.id;
  state.selectedTerm = null;
  saveData();
  renderAll();
}

function targetReviewTerms(limit = 18) {
  return sortedVocabItems()
    .filter((item) => item.status !== "mastered")
    .slice(0, limit)
    .map((item) => ({
      term: item.term,
      status: item.status,
      hitCount: item.hitCount,
      context: item.context || ""
    }));
}

function recentArticleBriefs(limit = 8) {
  return (state.data?.articles ?? []).slice(0, limit).map((article) => ({
    title: article.title,
    theme: THEME_LABELS[article.theme] ?? article.theme,
    levelId: article.levelId,
    excerpt: article.paragraphs.join("").slice(0, 140)
  }));
}

function uniqueLocalTheme(preferredTheme) {
  const usedTitles = new Set((state.data?.articles ?? []).map((article) => article.title));
  if (!usedTitles.has(ARTICLE_TEMPLATES[preferredTheme]?.title)) {
    return preferredTheme;
  }
  return Object.keys(ARTICLE_TEMPLATES).find((theme) => !usedTitles.has(ARTICLE_TEMPLATES[theme].title)) ?? preferredTheme;
}

async function finishReading() {
  const article = currentArticle();
  if (!article) return;
  const stats = articleStats(article);
  const local = analyzeLocally(article, stats, state.data.currentLevel);
  let analysis = local;
  try {
    const payload = await api("/api/level/analyze", {
      levelId: state.data.currentLevel,
      stats,
      role: state.profile.role
    });
    if (payload?.nextLevel) {
      analysis = payload;
    }
  } catch {
    analysis = local;
  }
  article.analysis = analysis;
  const session = {
    id: uid("session"),
    articleId: article.id,
    profileId: state.profile.id,
    startedAt: article.createdAt,
    finishedAt: new Date().toISOString(),
    unknownRate: stats.unknownRate,
    comprehensionScore: stats.comprehensionScore,
    markedTerms: stats.markedTerms,
    previousLevel: state.data.currentLevel,
    nextLevel: analysis.nextLevel
  };
  state.data.sessions.unshift(session);
  state.data.snapshots.unshift({
    id: uid("snapshot"),
    sessionId: session.id,
    articleTitle: article.title,
    previousLevel: state.data.currentLevel,
    nextLevel: analysis.nextLevel,
    unknownRate: stats.unknownRate,
    comprehensionScore: stats.comprehensionScore,
    markedTerms: stats.markedTerms,
    recommendation: analysis.recommendation,
    createdAt: new Date().toISOString()
  });
  state.data.snapshots = state.data.snapshots.slice(0, 20);
  state.data.currentLevel = analysis.nextLevel;
  saveData();
  renderAll();
  showToast(`分析完成：${levelById(analysis.nextLevel).label}`);
}

function analyzeLocally(article, stats, levelId) {
  const currentIndex = LEVELS.findIndex((level) => level.id === levelId);
  let nextIndex = currentIndex >= 0 ? currentIndex : 1;
  let recommendation = "保持当前难度，继续积累复习词。";

  if (stats.unknownRate > 0.16 || stats.comprehensionScore < 0.6) {
    nextIndex = Math.max(0, nextIndex - 1);
    recommendation = "下一篇会稍微降难度，先稳住核心词和文章主旨。";
  } else if (stats.unknownRate < 0.055 && stats.comprehensionScore >= 0.8 && stats.answered === article.questions.length) {
    nextIndex = Math.min(LEVELS.length - 1, nextIndex + 1);
    recommendation = "表现稳定，下一篇可以增加一点挑战词和推理内容。";
  } else if (stats.unknownRate >= 0.05 && stats.unknownRate <= 0.12 && stats.comprehensionScore >= 0.67) {
    recommendation = "难度合适，保持这个水平继续读。";
  }

  return {
    nextLevel: LEVELS[nextIndex].id,
    recommendation,
    source: "local"
  };
}

function createLocalArticle(theme, levelId, length = "medium") {
  const template = ARTICLE_TEMPLATES[theme] ?? ARTICLE_TEMPLATES.nature;
  const paragraphs = [...template.paragraphs];
  if (length === "short") {
    paragraphs.splice(2);
  }
  if (length === "long" || levelId === "P4_HCL_STRETCH" || levelId === "P5_HCL_BRIDGE") {
    paragraphs.push(stretchParagraph(theme, levelId));
  }
  if (levelId === "P4_CL_SUPPORT") {
    paragraphs[0] = simplifyParagraph(paragraphs[0]);
  }
  return {
    id: uid("article"),
    title: template.title,
    theme,
    levelId,
    source: "demo",
    createdAt: new Date().toISOString(),
    paragraphs,
    questions: template.questions.map((question) => ({ ...question, id: `${question.id}-${Date.now().toString(36)}` })),
    answers: {},
    marks: []
  };
}

function normalizeArticle(article, fallbackTheme, fallbackLevel, fallbackLength) {
  if (!article || !Array.isArray(article.paragraphs) || !Array.isArray(article.questions)) {
    return createLocalArticle(fallbackTheme, fallbackLevel, fallbackLength);
  }
  return {
    id: article.id || uid("article"),
    title: String(article.title || ARTICLE_TEMPLATES[fallbackTheme]?.title || "新的阅读文章").slice(0, 80),
    theme: article.theme || fallbackTheme,
    levelId: article.levelId || fallbackLevel,
    source: article.source || "api",
    createdAt: article.createdAt || new Date().toISOString(),
    paragraphs: article.paragraphs.map((item) => String(item).trim()).filter(Boolean).slice(0, 6),
    questions: article.questions
      .filter((question) => question?.prompt && Array.isArray(question.options) && question.answer)
      .slice(0, 4)
      .map((question, index) => ({
        id: question.id || `generated-q${index + 1}-${Date.now().toString(36)}`,
        prompt: String(question.prompt).slice(0, 160),
        options: question.options.map((option) => String(option).slice(0, 90)).slice(0, 4),
        answer: String(question.answer).slice(0, 90)
      })),
    answers: {},
    marks: []
  };
}

function stretchParagraph(theme, levelId) {
  const endings = {
    campus: "后来，佳宁把这次经验写进班级日志。她没有只写“规则很重要”，而是说明规则背后的原因：让每个人都更容易使用共同资源，也让负责的人有清楚的依据。",
    singapore: "美玲还发现，小花园让陌生的邻居有了聊天的话题。有人分享种花经验，有人提醒孩子不要踩到幼苗，平凡的巴士站慢慢有了社区的温度。",
    nature: "这次行动也让小宇思考，真正有效的改变需要记录、讨论和修正。只有知道问题在哪里，大家的热心才不会只停留在口号上。",
    science: "如果要让结论更可靠，他们还可以增加更多绿豆，并控制水量相同。志远因此明白，公平测试也是科学判断的重要部分。",
    culture: "安琪后来把访问内容整理成短文，贴在班上的展示板上。她希望同学们看到，文化不只在节日当天出现，也藏在家人一代一代传下来的故事里。",
    mystery: "班主任表扬凯文的冷静，也提醒大家，遇到问题时先寻找证据，常常比立刻下结论更公平。"
  };
  const bridge = levelId === "P5_HCL_BRIDGE" ? "这段经历虽然简单，却让他们开始思考个人选择和集体生活之间的关系。" : "";
  return `${endings[theme] ?? endings.nature}${bridge}`;
}

function simplifyParagraph(paragraph) {
  return paragraph
    .replace("也许会变得", "会变得")
    .replace("根据记录作出判断", "看记录，再判断")
    .replace("影响", "作用");
}

function currentArticle() {
  return state.data?.articles?.find((article) => article.id === state.data.currentArticleId) ?? state.data?.articles?.[0] ?? null;
}

function articleStats(article) {
  const charCount = countChinese(article.paragraphs.join(""));
  const markedIndexes = new Set();
  for (const mark of article.marks ?? []) {
    for (let index = mark.start; index <= mark.end; index += 1) {
      markedIndexes.add(index);
    }
  }
  const answers = article.answers ?? {};
  const answered = article.questions.filter((question) => answers[question.id]).length;
  const correct = article.questions.filter((question) => answers[question.id] === question.answer).length;
  return {
    charCount,
    markedChars: markedIndexes.size,
    markedTerms: (article.marks ?? []).length,
    unknownRate: charCount ? markedIndexes.size / charCount : 0,
    answered,
    correct,
    comprehensionScore: article.questions.length ? correct / article.questions.length : 0
  };
}

function markAtIndex(article, index) {
  return (article.marks ?? []).find((mark) => mark.start <= index && mark.end >= index) ?? null;
}

function getChineseChars(article) {
  return Array.from(article.paragraphs.join("\n")).filter(isChineseChar);
}

function smartRangeForIndex(article, index) {
  const candidates = [dictionaryRangeForIndex(article, index), segmenterRangeForIndex(article, index)].filter(Boolean);
  candidates.sort((a, b) => scoreSmartRange(b) - scoreSmartRange(a));
  return candidates[0] ?? { start: index, end: index, source: "character" };
}

function dictionaryRangeForIndex(article, index) {
  const text = getChineseChars(article).join("");
  const savedTerms = Object.keys(state.data?.vocabulary ?? {});
  const terms = [...Object.keys(VOCAB_LIBRARY), ...savedTerms]
    .filter((term) => isSmartTerm(term))
    .sort((a, b) => b.length - a.length);

  for (const term of terms) {
    let position = text.indexOf(term);
    while (position !== -1) {
      const start = position;
      const end = position + term.length - 1;
      if (index >= start && index <= end) {
        return { start, end, source: savedTerms.includes(term) ? "saved" : "dictionary" };
      }
      position = text.indexOf(term, position + 1);
    }
  }
  return null;
}

function segmenterRangeForIndex(article, index) {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") {
    return null;
  }

  const segmenter = new Intl.Segmenter("zh-Hans", { granularity: "word" });
  let cursor = 0;
  for (const paragraph of article.paragraphs) {
    for (const segment of segmenter.segment(paragraph)) {
      const term = chineseOnly(segment.segment);
      if (!term) continue;
      const start = cursor;
      const end = cursor + term.length - 1;
      cursor += term.length;
      if (index >= start && index <= end && isSmartTerm(term)) {
        return { start, end, source: "segmenter" };
      }
    }
  }
  return null;
}

function scoreSmartRange(range) {
  const length = range.end - range.start + 1;
  const sourceScore = {
    dictionary: 8,
    saved: 7,
    segmenter: 4,
    character: 0
  }[range.source] ?? 0;
  return sourceScore + Math.min(length, 4) - Math.max(0, length - 4);
}

function isSmartTerm(term) {
  const text = chineseOnly(term);
  return text.length >= 2 && text.length <= 6 && !SMART_WORD_STOPLIST.has(text);
}

function chineseOnly(value) {
  return Array.from(String(value ?? "")).filter(isChineseChar).join("");
}

function getTermForRange(article, start, end) {
  const chars = getChineseChars(article);
  return chars.slice(start, end + 1).join("");
}

function contextForRange(article, start, end) {
  let index = 0;
  for (const paragraph of article.paragraphs) {
    const length = countChinese(paragraph);
    const paragraphStart = index;
    const paragraphEnd = index + length - 1;
    if (start <= paragraphEnd && end >= paragraphStart) {
      return paragraph;
    }
    index += length;
  }
  return article.paragraphs[0] ?? "";
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

  const isWord = term.length > 1;
  return {
    term,
    pinyin: "AI 待补充",
    explanationZh: isWord ? "这个词需要结合上下文理解。上线 AI 后会自动补充准确拼音和解释。" : "这个字已加入错字本。上线 AI 后会自动补充准确拼音和解释。",
    explanationEn: isWord ? "This word needs context. AI explanation will fill in the exact meaning." : "This character has been saved for review.",
    exampleSentence: context ? `原文：${context.slice(0, 42)}${context.length > 42 ? "..." : ""}` : `我正在学习“${term}”。`,
    source: "fallback"
  };
}

async function api(path, body) {
  if (typeof window.fetch !== "function") {
    if (typeof window.XMLHttpRequest !== "function") {
      return postJsonWithJsonp(path, body);
    }
    return postJsonWithXhr(path, body);
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `Request failed: ${response.status}`);
    }
    return payload;
  } finally {
    window.clearTimeout(timer);
  }
}

function postJsonWithXhr(path, body) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.timeout = 18000;
    xhr.onload = () => {
      const payload = safeJson(xhr.responseText) ?? {};
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload);
      } else {
        reject(new Error(payload.error || `Request failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network request failed."));
    xhr.ontimeout = () => reject(new Error("Network request timed out."));
    xhr.send(JSON.stringify(body ?? {}));
  });
}

function getJsonWithXhr(path) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path);
    xhr.timeout = 9000;
    xhr.onload = () => {
      const payload = safeJson(xhr.responseText) ?? {};
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload);
      } else {
        reject(new Error(payload.error || `Request failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network request failed."));
    xhr.ontimeout = () => reject(new Error("Network request timed out."));
    xhr.send();
  });
}

function getJsonWithJsonp(path) {
  return new Promise((resolve, reject) => {
    const callbackName = `__crcJsonp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[callbackName];
      script.remove();
      window.clearTimeout(timer);
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Network request timed out."));
    }, 12000);
    window[callbackName] = (payload) => {
      cleanup();
      if (payload?.error) {
        reject(new Error(payload.error));
      } else {
        resolve(payload);
      }
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Network request failed."));
    };
    const url = new URL(path, window.location.origin);
    url.pathname = "/api/jsonp";
    url.searchParams.set("action", "version");
    url.searchParams.set("callback", callbackName);
    document.head.append(script);
    script.src = url.toString();
  });
}

async function getJson(path) {
  if (typeof window.fetch !== "function") {
    if (typeof window.XMLHttpRequest !== "function") {
      return getJsonWithJsonp(path);
    }
    return getJsonWithXhr(path);
  }
  const response = await fetch(path, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload;
}

function postJsonWithJsonp(path, body) {
  return new Promise((resolve, reject) => {
    const action = actionForPath(path);
    if (!action) {
      reject(new Error(`No JSONP action for ${path}`));
      return;
    }
    const callbackName = `__crcJsonp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[callbackName];
      script.remove();
      window.clearTimeout(timer);
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Network request timed out."));
    }, 22000);
    window[callbackName] = (payload) => {
      cleanup();
      if (payload?.error) {
        reject(new Error(payload.error));
      } else {
        resolve(payload);
      }
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Network request failed."));
    };
    const encoded = encodeURIComponent(JSON.stringify(body ?? {}));
    script.src = `/api/jsonp?action=${encodeURIComponent(action)}&payload=${encoded}&callback=${encodeURIComponent(callbackName)}`;
    document.head.append(script);
  });
}

function actionForPath(path) {
  if (path.startsWith("/api/version")) return "version";
  if (path === "/api/article/generate") return "article.generate";
  if (path === "/api/vocab/explain") return "vocab.explain";
  if (path === "/api/level/analyze") return "level.analyze";
  return "";
}

function levelById(levelId) {
  return LEVELS.find((level) => level.id === levelId) ?? LEVELS[1];
}

function isChineseChar(char) {
  return /[\u3400-\u9fff]/u.test(char);
}

function countChinese(text) {
  return Array.from(text).filter(isChineseChar).length;
}

function uid(prefix) {
  if (crypto?.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value) {
  const ascii = value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return ascii || "profile";
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPercent(value) {
  return `${Math.round((Number(value) || 0) * 100)}%`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-SG", { month: "short", day: "numeric" });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2200);
}
