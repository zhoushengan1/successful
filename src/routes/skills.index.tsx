import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageIntro } from "@/components/ui";
import { useSkills, useStudio } from "@/lib/studio";

export const Route = createFileRoute("/skills/")({
  component: SkillsPage,
});

function SkillsPage() {
  const skills = useSkills();
  const addSkill = useStudio((state) => state.addSkill);
  const removeSkill = useStudio((state) => state.removeSkill);
  const resetSkills = useStudio((state) => state.resetSkills);
  const flash = useStudio((state) => state.flash);
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", tag: "笔记", body: "" });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      flash("标题和正文都要有");
      return;
    }
    addSkill({
      title: form.title.trim(),
      summary: form.summary.trim() || "自己写下的一则。",
      tag: form.tag.trim() || "笔记",
      body: form.body.trim(),
    });
    setForm({ title: "", summary: "", tag: "笔记", body: "" });
    setOpen(false);
    flash("已保存");
  }

  return (
    <div className="pb-8">
      <PageIntro kicker="方法" title="读完可以照着做">
        短文，不是课程。讲的是怎么把一件事做完。
      </PageIntro>
      <div className="wrap mt-4 grid gap-3">
        <button type="button" className="btn" onClick={() => setOpen((value) => !value)}>
          {open ? "收起" : "写一则"}
        </button>
        {open ? (
          <form className="panel grid gap-3 p-4" onSubmit={submit}>
            <input className="field" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="标题" />
            <input className="field" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} placeholder="一句话摘要" />
            <input className="field" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} placeholder="标签" />
            <textarea className="field min-h-40" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="正文。空一行会分成段。" />
            <button type="submit" className="btn-ink">
              保存到这台手机
            </button>
          </form>
        ) : null}
        <ul className="grid gap-3">
          {skills.map((skill) => (
            <li key={skill.id} className="panel p-5">
              <p className="text-xs tracking-widest text-moss">
                {skill.tag} · {skill.minutes} 分钟
              </p>
              <h2 className="mt-2 font-serif text-2xl">
                <Link to="/skills/$skillId" params={{ skillId: skill.id }}>
                  {skill.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{skill.summary}</p>
              <div className="mt-4 flex gap-2">
                <Link to="/skills/$skillId" params={{ skillId: skill.id }} className="btn">
                  阅读
                </Link>
                <button type="button" className="btn-ghost" onClick={() => removeSkill(skill.id)}>
                  移除
                </button>
              </div>
            </li>
          ))}
        </ul>
        {confirmReset ? (
          <div className="panel grid gap-3 p-4">
            <p className="text-sm">恢复最初的方法？你后来写的会从这台手机消失。</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn-ink"
                onClick={() => {
                  resetSkills();
                  setConfirmReset(false);
                  flash("已恢复");
                }}
              >
                确认恢复
              </button>
              <button type="button" className="btn-ghost" onClick={() => setConfirmReset(false)}>
                取消
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn-ghost" onClick={() => setConfirmReset(true)}>
            恢复最初的方法
          </button>
        )}
      </div>
    </div>
  );
}
