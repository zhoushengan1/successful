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
  { id: "afdian", title: "爱发电", url: "https://afdian.net", note: "国内创作者收款。可当作驻留的收款链接。", category: "商业" },
  { id: "cf-pages", title: "Cloudflare Pages", url: "https://developers.cloudflare.com/pages/", note: "用 GitHub 仓库发布网站的官方说明。", category: "商业" },
  { id: "cf-dns", title: "Cloudflare DNS", url: "https://developers.cloudflare.com/dns/", note: "域名已经在这里时，加记录就是指路上线。", category: "商业" },
  { id: "github", title: "GitHub", url: "https://github.com", note: "放代码，也用手机网页上传那首 mp3。", category: "开发" },
  { id: "regex101", title: "Regex101", url: "https://regex101.com", note: "正则表达式。写完要拿真实文本试。", category: "开发" },
  { id: "tinypng", title: "TinyPNG", url: "https://tinypng.com", note: "压缩 PNG 和 JPG。", category: "开发" },
  { id: "caniuse", title: "Can I use", url: "https://caniuse.com", note: "这个网页特性，手机浏览器支不支持。", category: "开发" },
];

export const seedSkills: Skill[] = [
  {
    id: "weather",
    title: "让声音和风景是同一种天气",
    summary: "Fade Into You 不是风景歌词。山丘要学的是它的速度。",
    minutes: 4,
    tag: "气质",
    body: `Fade Into You 唱的不是草原，是一种想慢慢消失进另一个人里的渴望。人声很近，几乎是气声，速度慢，光线昏。青草、花和远处的水，不是在复述歌词，而是同一种天气：有风，但不暴烈；漂亮，但并不招呼你。

做这种页面，守三条就够。

声音、风、远水，只保持一种速度。不要弹窗，不要闪，不要催。字要少。一句够用的时候，不要写成广告。收费可以存在，但放在人站完一会儿之后。

这首歌不会随网站一起送出。天气是原创的，歌要你自己合法放进来。公开给所有访客播放，通常还需要录音和词曲的传播授权。个人试听和公开放送，不是同一件事。`,
  },
  {
    id: "phone",
    title: "只有一部手机时，怎么把山丘送上线",
    summary: "域名已经在 Cloudflare。剩下的是文件、配置，和一条解析。",
    minutes: 6,
    tag: "上线",
    body: `没有电脑，也可以把这座站点变成你的域名。顺序固定，就不要跳。

第一，歌曲不要从网上抓。把你合法获得的 mp3，用 GitHub 手机版上传到 public/audio/，文件名必须是 fade-into-you.mp3。

第二，站名、域名、邮箱、价格、收款链接，先在「驻留」里填好并保存，再点复制。到 GitHub 打开 src/site.config.ts，把对应字符串换掉。只保存在手机里的草稿，别的访客看不到。

第三，名称服务器已经在 Cloudflare。网站发布之后，到该域名的 DNS 里加一条 CNAME，把主机名指到发布地址。访客走你的域名，解析仍在 Cloudflare。

若你更想用 Cloudflare Pages 直接构建这个 GitHub 仓库：构建命令用 npm run build。这是一个完整网站，不是一个静态文件夹。Pages 若报错，就改走发布加 DNS，不要卡在那里。

上传之前看一眼 public/audio 里的说明。没有权利的文件，不要放上去。`,
  },
  {
    id: "price",
    title: "免费工具如何通向收费",
    summary: "先让人每天打开，再谈驻留。空着的价格不要假装能付款。",
    minutes: 5,
    tag: "商业",
    body: `综合站后来赚钱，通常不是因为首页漂亮，而是因为有人每周都回来做一件小事。山丘钟、计价、文字整理，就是这些小事。它们免费，而且在手机上离线也能用。

收费要收在「省下来的时间」和「你整理过的判断」上，不要收在别人随处能搜到的链接上。库藏适合公开，用来建立信任。手艺适合留下方法。真正的会员，以后可以是：每月一次的整理、一套模板、或者你帮忙看一次对方的站点。

价格没有填的时候，按钮不会假装能扣款。你接上爱发电、微信收款或 Stripe 的链接之后，它才变成一扇真的门。在那之前，把免费的部分做顺，比写一个假的购买按钮重要。

一个干净的起步：免费使用全部器具；月费换你每月更新的一份手艺；年费换一次你亲自看过的清单。数字你自己定，写进驻留即可。`,
  },
  {
    id: "hill",
    title: "山丘工作法",
    summary: "二十五分钟只爬一座小山，五分钟让风过去。",
    minutes: 3,
    tag: "方法",
    body: `山丘钟不是新发明。它只是把番茄钟放进这种天气里，免得你一边计时一边焦虑。

一次只选一件小到能做完的事。二十五分钟叫一座山丘。时间到了就停，即使还想继续。五分钟的微风用来站起来、喝水、看一眼远处，不要拿来刷信息流。四座山丘之后，给自己十五分钟临水。

手机上最大的干扰就是这个计时器所在的同一块屏幕。开始之前，把不要的通知关掉。如果一件事大到说不清「做完」是什么样，先把它写成速记里的下一句，再回来按开始。

这种方法本身不收费。你以后如果教别人用它布置自己的一天，那才是手艺。`,
  },
  {
    id: "line",
    title: "写一句让人停住的话",
    summary: "商业网站也可以小声说话。小声不是含糊。",
    minutes: 4,
    tag: "文案",
    body: `首页第一句不要介绍你的商业模式。人先感受到天气，才会留下来听你做什么。

一句好的话，通常只有一个动作，一个具体的东西。风来的时候，草会先弯下去。这比「打造沉浸式资源整合平台」更像真的。后者什么都说了，所以什么都没说。

写的时候拿掉三类词：赋能、闭环、抓手。再拿掉感叹号。如果一句话里有两个比喻，删掉一个。读出声，超过一次呼吸就拆开。

你的关于，留在驻留配置里的那一句，就用这个标准。它会替代首页上的默认句子。默认句子可以先用着，但那是青屿的声音，不是你的。`,
  },
  {
    id: "shelf",
    title: "资源库不是收藏夹",
    summary: "每条链接都要回答：我下次会因为什么打开它。",
    minutes: 4,
    tag: "整理",
    body: `收藏夹会腐烂，是因为当时觉得「以后也许用得上」。资源库要反过来：这条链接，下一次具体帮我做哪一步。

所以每条只留三个字段。名字、地址、一句笔记。笔记不写「很好用」，写「压图再上传」或「国内收款可放这里」。分类只留五个，够你的拇指点到。

每个月删掉三十天没打开的。导出一份 JSON 存在网盘或 GitHub，换手机时不会丢。导入会覆盖你现在的库，动手前先导出一份。

公开这些链接是信任，不是产品本身。产品是你的筛选，和筛选背后那句笔记。以后收费的会员库，也应该是更少、更狠的筛选，而不是更长的清单。`,
  },
];
