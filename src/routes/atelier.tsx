import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AUDIO_SRC, DEFAULT_ABOUT, SONG, type SiteProfile } from "@/site.config";
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
      <PageIntro kicker="关于" title={saved.name || "青屿"}>
        {saved.about || DEFAULT_ABOUT}
      </PageIntro>

      {saved.monthlyPrice || saved.yearlyPrice ? (
        <section className="wrap mt-4 grid gap-3 md:grid-cols-3">
          <Tier name="免费" price="现在" note="器具、库藏和方法都可以直接用。" />
          {saved.monthlyPrice ? (
            <Tier name="月度" price={priceLabel(saved.monthlyPrice)} note="按月。" period="每月" />
          ) : null}
          {saved.yearlyPrice ? (
            <Tier name="年度" price={priceLabel(saved.yearlyPrice)} note="按年。" period="每年" />
          ) : null}
        </section>
      ) : null}

      {pay || mail || saved.social ? (
        <section className="panel wrap mt-4 grid gap-3 p-5">
          {pay ? (
            <a className="btn" href={pay} target="_blank" rel="noreferrer">
              支持
            </a>
          ) : null}
          {mail ? (
            <a className="btn-ghost" href={`mailto:${mail}?subject=${encodeURIComponent(saved.name)}`}>
              写信
            </a>
          ) : null}
          {saved.social ? <p className="text-sm">{saved.social}</p> : null}
        </section>
      ) : null}

      <details className="wrap mt-6">
        <summary className="cursor-pointer text-sm text-ink/60">站点设置</summary>
        <section id="audio" className="panel mt-3 scroll-mt-6 p-5">
          <h2 className="font-serif text-3xl">背景音乐</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            底部播放的是 {SONG.title}，{SONG.artist}，{SONG.year}。文件放在 public/audio/fade-into-you.mp3。
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
      </details>
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
