import { createFileRoute, Link } from "@tanstack/react-router";
import { useProfile } from "@/lib/studio";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const profile = useProfile();

  return (
    <div className="flex flex-1 flex-col px-5 pt-7">
      <p className="font-serif text-xl text-cream" style={{ textShadow: "0 1px 10px rgb(28 40 34 / 0.55)" }}>
        {profile.name}
      </p>
      <div className="flex-1" />
      <div
        className="mb-1 max-w-xs"
        style={{ textShadow: "0 1px 12px rgb(28 40 34 / 0.7)" }}
      >
        <h1 className="font-serif text-4xl leading-tight text-cream">打开就能用。</h1>
        <p className="mt-2 text-sm leading-relaxed text-cream/95">计时、整理、换算和计价。</p>
        <nav className="mt-4 flex gap-5 text-sm text-cream" aria-label="进入">
          <Link to="/tools" className="underline decoration-cream/40 underline-offset-4">
            器具
          </Link>
          <Link to="/library" className="underline decoration-cream/40 underline-offset-4">
            库藏
          </Link>
          <Link to="/skills" className="underline decoration-cream/40 underline-offset-4">
            方法
          </Link>
        </nav>
      </div>
    </div>
  );
}
