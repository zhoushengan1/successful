import { createFileRoute, Link } from "@tanstack/react-router";
import { DEFAULT_ABOUT } from "@/site.config";
import { useProfile } from "@/lib/studio";

export const Route = createFileRoute("/")({
  component: Home,
});

const doors = [
  {
    to: "/tools",
    title: "器具",
    text: "计时、整理文字、计价、换算。不用注册，点开就用。",
  },
  {
    to: "/library",
    title: "库藏",
    text: "效率、设计、学习里会再打开的资料。每条都写了留下的原因。",
  },
  {
    to: "/skills",
    title: "方法",
    text: "把一件事做完的短文。读完可以照着做，不是使用说明。",
  },
] as const;

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
          <p className="text-xs tracking-widest text-moss">手头的事</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">打开就能用。</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/75">{profile.about || DEFAULT_ABOUT}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Link to="/tools" className="btn w-full">
              器具
            </Link>
            <Link to="/library" className="btn-ghost w-full">
              库藏
            </Link>
            <Link to="/skills" className="btn-ghost w-full">
              方法
            </Link>
          </div>
        </article>
      </section>
      <section className="wrap mt-8 grid gap-3 pb-8">
        {doors.map((door) => (
          <Link key={door.to} to={door.to} className="panel block p-6">
            <h2 className="font-serif text-3xl">{door.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{door.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}