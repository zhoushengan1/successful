import { createFileRoute, Link } from "@tanstack/react-router";
import { SONG, DEFAULT_ABOUT } from "@/site.config";
import { useProfile } from "@/lib/studio";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const profile = useProfile();

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col px-5 pt-6">
        <header className="flex items-center justify-between gap-3">
          <p className="truncate rounded-full bg-cream/85 px-4 py-2 font-serif text-lg text-ink backdrop-blur-md">
            {profile.name}
          </p>
          <p className="shrink-0 rounded-full bg-cream/85 px-4 py-2 text-xs tracking-widest text-ink/70 backdrop-blur-md">
            {profile.nameEn}
          </p>
        </header>
        <div className="flex-1" />
        <article className="panel mx-auto mb-2 w-full max-w-lg p-6">
          <p className="text-xs tracking-widest text-moss">
            {SONG.artist.toUpperCase()} · {SONG.year}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">{SONG.title}</h1>
          <p className="mt-4 font-serif text-lg leading-snug text-ink">风来的时候，草会先弯下去。</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            {profile.about || DEFAULT_ABOUT}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Link to="/tools" className="btn w-full">
              器具
            </Link>
            <Link to="/library" className="btn-ghost w-full">
              库藏
            </Link>
            <Link to="/skills" className="btn-ghost w-full">
              手艺
            </Link>
          </div>
        </article>
      </section>
      <section className="wrap mt-8 grid gap-3 pb-8">
        <div className="panel p-6">
          <h2 className="font-serif text-3xl">这座山丘做什么</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            现在就能用的，是十件小工具、一份你自己维护的资源库，和几篇可以拿去收费的方法。会员价格和收款链接先空着，空着就不会假装已经能付款。
          </p>
        </div>
        <div className="panel p-6">
          <h2 className="font-serif text-3xl">关于这首歌</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            {SONG.title} 是 {SONG.artist} 收录在 {SONG.album} 里的歌。网站不附带音频。底部的播放器，要等你把合法获得的文件放进站点之后才会出声。把歌公开播放给所有访客，通常还需要授权。
          </p>
          <Link to="/atelier" hash="audio" className="btn mt-5">
            去放入音频
          </Link>
        </div>
      </section>
    </div>
  );
}
