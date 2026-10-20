/**
 * 青屿 · 对外配置
 *
 * 【待填写】下面凡是空字符串，网站会显示「待填写」，不会假装已经填好。
 * 你也可以先在「驻留」页用手机改一版草稿。
 * 草稿只存在这台手机上。要让所有访客看到，请把改好的字符串写回这个文件，再重新发布。
 */
export const siteConfig = {
  /** 对外名称。已有默认，可改成你的品牌。 */
  name: "青屿",
  /** 页眉上的英文短名。 */
  nameEn: "QINGYU",
  /** 【待填写】已接到 Cloudflare 的域名，不要带 https:// ，例如 qingyu.com */
  domain: "",
  /** 【待填写】联系邮箱。留空则不显示写信按钮。 */
  email: "",
  /** 【待填写】微信、微博或其他社交账号，写给访客看的一句话。 */
  social: "",
  /** 【待填写】月费。填 39 会显示 ¥39，也可以写「面议」。 */
  monthlyPrice: "",
  /** 【待填写】年费。 */
  yearlyPrice: "",
  /** 【待填写】收款链接：爱发电、微信收款页、Stripe 等，必须以 http:// 或 https:// 开头。 */
  payLink: "",
  /** 【待填写】你自己的一句介绍。留空则使用站点默认的那句。 */
  about: "",
};

export type SiteProfile = typeof siteConfig;

export const AUDIO_SRC = "/audio/fade-into-you.mp3";

export const SONG = {
  title: "Fade Into You",
  artist: "Mazzy Star",
  year: "1993",
  album: "So Tonight That I Might See",
} as const;

export const DEFAULT_ABOUT =
  "计时、整理、换算和计价，打开就能用。旁边是挑过的资料，和几篇能照着做完的方法。";
