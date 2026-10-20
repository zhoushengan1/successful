import { createFileRoute, Link } from "@tanstack/react-router";
import { useSkills } from "@/lib/studio";

export const Route = createFileRoute("/skills/$skillId")({
  component: SkillPage,
});

function SkillPage() {
  const { skillId } = Route.useParams();
  const skills = useSkills();
  const skill = skills.find((item) => item.id === skillId);

  if (!skill) {
    return (
      <div className="panel wrap mt-8 p-6">
        <h1 className="font-serif text-3xl">这则不在了</h1>
        <Link to="/skills" className="btn mt-5">
          回到方法
        </Link>
      </div>
    );
  }

  const paragraphs = skill.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <article className="panel wrap mt-4 p-6 md:mt-8">
      <p className="text-xs tracking-widest text-moss">
        {skill.tag} · {skill.minutes} 分钟
      </p>
      <h1 className="mt-2 font-serif text-4xl">{skill.title}</h1>
      <p className="mt-3 text-sm text-ink/75">{skill.summary}</p>
      <div className="mt-6 grid gap-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-ink">
            {paragraph}
          </p>
        ))}
      </div>
      <Link to="/skills" className="btn-ghost mt-8">
        返回
      </Link>
    </article>
  );
}
