export type Resource = {
  id: string;
  title: string;
  url: string;
  note: string;
  category: string;
};

export type Skill = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  tag: string;
  body: string;
};

export const categories = ["效率", "设计", "学习", "商业", "开发"] as const;

export const tools = [
  { id: "focus", name: "山丘钟", blurb: "二十五分钟，只做一件事。" },
  { id: "text", name: "文字", blurb: "字数、空行、重复，一次理清。" },
  { id: "json", name: "JSON", blurb: "排好，或压成一行。" },
  { id: "units", name: "换算", blurb: "长度、斤两、温度、存储。" },
  { id: "dates", name: "日子", blurb: "两个日期相距几天。" },
  { id: "secret", name: "密钥", blurb: "生成一组够用的随机密码。" },
  { id: "color", name: "色彩", blurb: "十六进制、RGB 与 HSL。" },
  { id: "trade", name: "计价", blurb: "折扣、数量、毛利。" },
  { id: "notes", name: "速记", blurb: "只留在这台手机上的便笺。" },
  { id: "encode", name: "编码", blurb: "Base64 与网址编码。" },
] as const;

export type ToolId = (typeof tools)[number]["id"];

export function findTool(id: string) {
  return tools.find((tool) => tool.id === id);
}

export const seedResources: Resource[] = [
  { id: "excalidraw", title: "Excalidraw", url: "https://excalidraw.com", note: "手绘白板。适合在手机上把一个念头画开。", category: "效率" },
  { id: "notion", title: "Notion", url: "https://www.notion.so", note: "长文、数据库、项目都收得住。", category: "效率" },
  { id: "yuque", title: "语雀", url: "https://www.yuque.com", note: "中文文档。团队知识库很顺手。", category: "效率" },
  { id: "deepl", title: "DeepL", url: "https://www.deepl.com", note: "把说明写成另一种语言时，先过一遍这里。", category: "效率" },
  { id: "figma", title: "Figma", url: "https://www.figma.com", note: "界面稿。手机可看，改稿仍建议大一点的屏幕。", category: "设计" },
  { id: "photopea", title: "Photopea", url: "https://www.photopea.com", note: "浏览器里修图，不必安装软件。", category: "设计" },
  { id: "squoosh", title: "Squoosh", url: "https://squoosh.app", note: "把图片压小，再放进网页。", category: "设计" },
  { id: "coolors", title: "Coolors", url: "https://coolors.co", note: "迅速试一组颜色，再收成自己的。", category: "设计" },
  { id: "unsplash", title: "Unsplash", url: "https://unsplash.com", note: "可用的照片。商用前看清每张的许可。", category: "设计" },
  { id: "removebg", title: "remove.bg", url: "https://www.remove.bg", note: "抠掉背景。精细边缘仍要自己看一眼。", category: "设计" },
  { id: "mdn", title: "MDN", url: "https://developer.mozilla.org", note: "网页技术的可靠字典。", category: "学习" },
  { id: "runoob", title: "菜鸟教程", url: "https://www.runoob.com", note: "中文入门。先跑起来，再去对 MDN。", category: "学习" },
  { id: "w3school", title: "W3School", url: "https://www.w3school.com.cn", note: "适合随手查一个标签或属性。", category: "学习" },
  { id: "sspai", title: "少数派", url: "https://sspai.com", note: "效率与数字生活的中文方法。", category: "学习" },
  { id: "afdian", title: "爱发电", url: "https://afdian.net", note: "看创作者在做什么，也可以支持他们。", category: "商业" },
  { id: "cf-pages", title: "Cloudflare", url: "https://www.cloudflare.com", note: "域名、网速和基本防护，很多站都放在这里。", category: "商业" },
  { id: "linear", title: "Linear", url: "https://linear.app", note: "把要做的事排成一张清楚的清单。", category: "商业" },
  { id: "github", title: "GitHub", url: "https://github.com", note: "找别人公开的代码和说明。", category: "开发" },
  { id: "regex101", title: "Regex101", url: "https://regex101.com", note: "正则表达式。写完要拿真实文本试。", category: "开发" },
  { id: "tinypng", title: "TinyPNG", url: "https://tinypng.com", note: "压缩 PNG 和 JPG。", category: "开发" },
  { id: "caniuse", title: "Can I use", url: "https://caniuse.com", note: "这个网页特性，手机浏览器支不支持。", category: "开发" },
];

export const seedSkills: Skill[] = [
  {
    id: "hill",
    title: "一次只做完一件小事",
    summary: "二十五分钟只处理一件说得清的事。",
    minutes: 3,
    tag: "专注",
    body: `先把要做的事写成一句能判断做完的话。例如「把这三段改短」，而不是「处理一下工作」。

打开器具里的山丘钟，选二十五分钟。时间里不切换去别的事。到点就停，即使还想继续。停下来的五分钟站起来、喝水，不要拿去刷信息。

四次之后休息久一点。如果一件事大到说不清做完是什么样，先把它拆成下一句，再开始计时。`,
  },
  {
    id: "line",
    title: "发出去之前，把话写短",
    summary: "一句只留一个动作，一个具体的东西。",
    minutes: 3,
    tag: "文字",
    body: `写完先用器具里的「文字」看字数。一句里如果有两个比喻，删掉一个。读出声，超过一次呼吸就拆开。

拿掉这三类词：赋能、闭环、抓手。再拿掉感叹号。别人要知道你让他做什么，不需要先听你的方法有多完整。

改完再看一遍：这句话里有没有一个能看见的东西。没有的话，它还是空的。`,
  },
  {
    id: "trade",
    title: "价钱先算清楚再开口",
    summary: "折扣、数量和毛利，不要心算。",
    minutes: 3,
    tag: "计价",
    body: `报价前打开器具里的「计价」。先填原价和数量，再填折扣。看完实收，再决定这单做不做。

毛利要单独看。折扣好看，不代表剩下的钱够付时间。算完把数字写进要发出的那句话里，避免口头再改一次。

同一组数字算两次。两次一样，再发给对方。`,
  },
  {
    id: "shelf",
    title: "只留下次还会打开的",
    summary: "收藏会烂掉。资料要写明下次用来做什么。",
    minutes: 4,
    tag: "整理",
    body: `看到一条链接先问：我下一次具体用它做哪一步。答不上来，就不要存。

存的时候只写三个东西：名字、地址、一句笔记。笔记不写「很好用」，写「压图」或「查这个浏览器支不支持」。

每个月删掉三十天没打开的。留下的会比当时随手存的更有用。`,
  },
];
