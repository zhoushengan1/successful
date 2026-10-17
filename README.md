# 青屿

一座给手机用的私人工作室。首页是青草山丘和风，底栏播放 Mazzy Star 的 *Fade Into You*。歌不在仓库里。

## 你要自己填的

这些地方标了「待填写」。空着的时候，网站不会假装已经填好。

| 要填的 | 放在哪 |
| --- | --- |
| 合法获得的 `fade-into-you.mp3` | `public/audio/fade-into-you.mp3`，文件名必须一字不差 |
| 站点名称、英文短名 | `src/site.config.ts` |
| 域名 | 同上，`domain`，不要带 `https://` |
| 邮箱、社交账号 | 同上 |
| 月费、年费 | 同上。填 `39` 会显示 ¥39，也可以写「面议」 |
| 收款链接 | 同上，`payLink`，爱发电 / 微信收款页 / Stripe，必须以 http 或 https 开头 |
| 你的一句介绍 | 同上，`about`。留空则用默认句子 |

也可以先在网站的「驻留」页改一版。那只保存在你这台手机上。要让所有访客看到，点「保存并复制配置」，写回 `src/site.config.ts`，再重新发布。

公开把这首歌放给所有访客听，通常还需要录音和词曲的传播授权。没有权利的文件不要上传。

## 域名已经在 Cloudflare

用 Workers，不用 Pages。在 Cloudflare 里连 GitHub 仓库 `zhoushengan1/successful`，生产分支 `main`。表单保持这些值，然后部署：

| 项 | 值 |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` |
| Protect with Cloudflare Access | 关闭 |

构建会生成 Worker 配置，名字是 `successful`。部署成功后先打开 `successful.<你的子域>.workers.dev`。能打开再去该项目的设置里加自定义域。域名的名称服务器已经在 Cloudflare，确认后它会自己写 DNS。
