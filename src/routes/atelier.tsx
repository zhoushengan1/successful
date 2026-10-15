import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AUDIO_SRC, SONG, type SiteProfile } from "@/site.config";
import { PageIntro } from "@/components/ui";
import {
  cleanDomain,
  configSnippet,
  copyText,
  priceLabel,
  safeHref,
  useProfile,
  useStudio,
} from "@/lib/studio";

export const Route = createFileRoute("/atelier")({
  component: AtelierPage,
});

const fields: { key: keyof SiteProfile; label: string; hint: string; placeholder: string; optional?: boolean }[] = [
  { key: "name", label: "站点名称", hint: "已有默认「青屿」，可改成你的品牌", placeholder: "青屿" },
  { key: "nameEn", label: "英文短名", hint: "出现在山丘页的小字", placeholder: "QINGYU" },
  { key: "domain", label: "域名", hint: "【待填写】不要带 https://", placeholder: "yourdomain.com" },
  { key: "email", label: "联系邮箱", hint: "【待填写】留空则没有写信按钮", placeholder: "you@email.com" },
  { key: "social", label: "社交账号", hint: "【待填写】微信或其他，写给访客看", placeholder: "微信：待填写", optional: true },
  { key: "monthlyPrice", label: "月费", hint: "【待填写】填 39 会显示 ¥39，也可写面议", placeholder: "39" },
  { key: "yearlyPrice", label: "年费", hint: "【待填写】", placeholder: "299" },
  { key: "payLink", label: "收款链接", hint: "【待填写】爱发电、微信收款或 Stripe", placeholder: "https://" },
  { key: "about", label: "你的一句介绍", hint: "【待填写】留空就用站点默认的那句", placeholder: "写你自己的声音", optional: true },
];

function AtelierPage() {
  const saved = useProfile();
  const setProfile = useStudio((state) => state.setProfile);
  const clearProfile = useStudio((state) => state.clearProfile);
  const flash = useStudio((state) => state.flash);
  const [form, setForm] = useState<SiteProfile>(saved);
  const [audioPhase, setAudioPhase] = useState<"unknown" | "ready" | "missing">("unknown");
  const pay = safeHref(saved.payLink);
  const mail = saved.email.includes("@") ? saved.email : "";

  function save(profile = form): SiteProfile | null {
    const next: SiteProfile = {
      ...profile,
      name: profile.name.trim(),
      nameEn: profile.nameEn.trim(),
      domain: cleanDomain(profile.domain),
      email: profile.email.trim(),
      social: profile.social.trim(),
      monthlyPrice: profile.monthlyPrice.trim(),
      yearlyPrice: profile.yearlyPrice.trim(),
      payLink: profile.payLink.trim(),
      about: profile.about.trim(),
    };
    if (next.payLink && !safeHref(next.payLink)) {
      flash("收款链接需要以 http:// 或 https:// 开头");
      return null;
    }
    setProfile(next);
    setForm(next);
    return next;
  }

  function detectAudio() {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = AUDIO_SRC;
    audio.onloadedmetadata = () => setAudioPhase("ready");
    audio.onerror = () => setAudioPhase("missing");
  }

  const snippet = configSnippet(form);

  return (
    <div className="pb-10">
      <PageIntro kicker="驻留" title="先免费使用，再慢慢收费">
        价格和收款链接空着时，这里不会假装能付款。填好的草稿只在这台手机。要让所有访客看到，复制配置，写回 src/site.config.ts，再发布。
      </PageIntro>

      <section className="wrap mt-4 grid gap-3 md:grid-cols-3">
        <Tier name="过路" price="免费" note="全部器具、公开库藏、手艺正文。" />
        <Tier name="驻山" price={priceLabel(saved.monthlyPrice)} note="月。适合以后放你每月更新的一份方法。" period={saved.monthlyPrice ? "每月" : ""} />
        <Tier name="私藏" price={priceLabel(saved.yearlyPrice)} note="年。适合以后留一次你亲自看过的清单。" period={saved.yearlyPrice ? "每年" : ""} />
      </section>

      <section className="panel wrap mt-4 grid gap-3 p-5">
        {pay ? (
          <a className="btn" href={pay} target="_blank" rel="noreferrer">
            去收款页
          </a>
        ) : (
          <p className="text-sm leading-relaxed">收款链接还空着。填好并发布之后，这里会变成一扇真的门。</p>
        )}
        {mail ? (
          <a className="btn-ghost" href={`mailto:${mail}?subject=${encodeURIComponent(`${saved.name} 驻留`)}`}>
            写信
          </a>
        ) : null}
        {saved.social ? <p className="text-sm">{saved.social}</p> : null}
        <p className="text-xs text-ink/70">{saved.domain ? saved.domain : "域名待填写"}</p>
      </section>

      <section id="audio" className="panel wrap mt-4 scroll-mt-6 p-5">
        <h2 className="font-serif text-3xl">音频 · 待放入</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          {SONG.title} · {SONG.artist} · {SONG.album} · {SONG.year}。请把你合法获得的 mp3 放到 public/audio/，文件名必须是 fade-into-you.mp3。不要使用盗链。公开放送给访客前，请确认你有传播授权。
        </p>
        <p className="mt-3 text-sm">
          {audioPhase === "unknown" ? "尚未检测" : audioPhase === "ready" ? "已找到音频" : "还没有找到这个文件"}
        </p>
        <button type="button" className="btn mt-4" onClick={detectAudio}>
          检测音频
        </button>
      </section>

      <section id="config" className="panel wrap mt-4 scroll-mt-6 p-5">
        <h2 className="font-serif text-3xl">你要填写的配置</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          带「待填写」的项，现在还是空的。保存之后只影响你这台手机上的预览。
        </p>
        <div className="mt-4 grid gap-4">
          {fields.map((field) => {
            const value = form[field.key];
            const filled = value.trim().length > 0;
            return (
              <label key={field.key} className="grid gap-2 text-sm">
                <span className="flex items-center justify-between gap-3">
                  <span>{field.label}</span>
                  <span className={filled ? "text-moss" : "text-ink"}>{filled ? "已填写" : field.optional ? "可选" : "待填写"}</span>
                </span>
                {field.key === "about" ? (
                  <textarea className="field min-h-24" value={value} placeholder={field.placeholder} onChange={(event) => setForm({ ...form, about: event.target.value })} />
                ) : (
                  <input className="field" value={value} placeholder={field.placeholder} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
                )}
                <span className="text-xs text-ink/60">{field.hint}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 grid gap-2">
          <button type="button" className="btn" onClick={() => {
            if (save()) flash("已保存在这台手机");
          }}>
            保存在这台手机
          </button>
          <button
            type="button"
            className="btn-ink"
            onClick={() => {
              const next = save();
              if (!next) return;
              void copyText(configSnippet(next)).then((ok) => {
                flash(ok ? "配置已复制" : "复制失败，请长按下面的文字");
              });
            }}
          >
            保存并复制配置
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              clearProfile();
              flash("已清掉这台手机上的草稿");
            }}
          >
            清除手机草稿
          </button>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-mist p-4 text-xs leading-relaxed whitespace-pre-wrap">{snippet}</pre>
      </section>

      <section className="panel wrap mt-4 p-5">
        <h2 className="font-serif text-3xl">用手机接到你的域名</h2>
        <ol className="mt-3 grid list-decimal gap-3 pl-5 text-sm leading-relaxed">
          <li>用 GitHub 手机版，把 mp3 上传到仓库的 public/audio/fade-into-you.mp3。</li>
          <li>把上面复制的配置，替换进 src/site.config.ts 里的 siteConfig。</li>
          <li>发布网站。你的名称服务器已经在 Cloudflare，到该域名的 DNS 添加 CNAME，把记录指到发布后的地址。</li>
          <li>如果改用 Cloudflare Pages 构建这个仓库，构建命令填 npm run build。这不是纯静态文件夹，Pages 若失败，就用第 3 步，域名依然走 Cloudflare。</li>
        </ol>
      </section>
    </div>
  );
}

function Tier({ name, price, note, period }: { name: string; price: string; note: string; period?: string }) {
  return (
    <article className="panel p-5">
      <p className="text-xs tracking-widest text-moss">{name}</p>
      <p className="mt-2 font-serif text-3xl">{price}</p>
      {period ? <p className="text-xs text-ink/60">{period}</p> : null}
      <p className="mt-3 text-sm leading-relaxed text-ink/75">{note}</p>
    </article>
  );
}
