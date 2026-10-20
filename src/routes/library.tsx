import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { categories, type Resource } from "@/data/content";
import { PageIntro } from "@/components/ui";
import { isResource, safeHref, useResources, useStudio } from "@/lib/studio";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

const emptyForm = { title: "", url: "https://", note: "", category: "效率" };

function LibraryPage() {
  const resources = useResources();
  const addResource = useStudio((state) => state.addResource);
  const updateResource = useStudio((state) => state.updateResource);
  const removeResource = useStudio((state) => state.removeResource);
  const resetLibrary = useStudio((state) => state.resetLibrary);
  const importLibrary = useStudio((state) => state.importLibrary);
  const flash = useStudio((state) => state.flash);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((item) => {
      if (category !== "全部" && item.category !== category) return false;
      if (!needle) return true;
      return `${item.title} ${item.note} ${item.url}`.toLowerCase().includes(needle);
    });
  }, [resources, query, category]);

  function submitForm(event: FormEvent) {
    event.preventDefault();
    const title = form.title.trim();
    const url = form.url.trim();
    if (!title || !safeHref(url)) {
      flash("需要名字，和 http 或 https 链接");
      return;
    }
    const next = { title, url, note: form.note.trim(), category: form.category };
    if (editing) updateResource(editing, next);
    else addResource(next);
    setForm(emptyForm);
    setEditing(null);
    flash(editing ? "已改好" : "已放进库藏");
  }

  return (
    <div className="pb-8">
      <PageIntro kicker="库藏" title="挑过的资料">
        每条只留会再打开的理由。按效率、设计、学习、商业、开发来找。
      </PageIntro>
      <div className="wrap mt-4 grid gap-3">
        <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名字或笔记" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["全部", ...categories].map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "chip shrink-0 bg-moss text-cream" : "chip shrink-0 bg-cream/90 text-ink"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <form className="panel grid gap-3 p-4" onSubmit={submitForm}>
          <p className="font-serif text-2xl">{editing ? "修改这条" : "添一条"}</p>
          <input className="field" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="名字" />
          <input className="field" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://" inputMode="url" />
          <input className="field" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="一句笔记" />
          <select className="field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <button type="submit" className="btn">
              {editing ? "保存" : "放入"}
            </button>
            {editing ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                }}
              >
                取消
              </button>
            ) : null}
          </div>
        </form>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              const blob = new Blob([JSON.stringify({ resources }, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "qingyu-library.json";
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            导出
          </button>
          <label className="btn-ghost">
            导入
            <input
              className="sr-only"
              type="file"
              accept="application/json"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                try {
                  const parsed: unknown = JSON.parse(await file.text());
                  const rows = Array.isArray(parsed)
                    ? parsed
                    : parsed && typeof parsed === "object" && Array.isArray((parsed as { resources?: unknown }).resources)
                      ? (parsed as { resources: unknown[] }).resources
                      : null;
                  if (!rows || !rows.every(isResource)) {
                    flash("这个文件不是库藏备份");
                    return;
                  }
                  importLibrary(rows);
                  flash("已导入，旧的自定库藏被替换");
                } catch {
                  flash("读不了这个文件");
                }
              }}
            />
          </label>
        </div>
        {visible.length === 0 ? <p className="panel p-4 text-sm">没有符合的条目。</p> : null}
        <ul className="grid gap-3">
          {visible.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
              onEdit={() => {
                setEditing(item.id);
                setForm({ title: item.title, url: item.url, note: item.note, category: item.category });
              }}
              onRemove={() => removeResource(item.id)}
            />
          ))}
        </ul>
        {confirmReset ? (
          <div className="panel grid gap-3 p-4">
            <p className="text-sm">恢复成最初的清单？你加过的条目会从这台手机消失。先导出比较稳。</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn-ink"
                onClick={() => {
                  resetLibrary();
                  setConfirmReset(false);
                  flash("已恢复最初的清单");
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
            恢复最初的清单
          </button>
        )}
      </div>
    </div>
  );
}

function ResourceCard({ item, onEdit, onRemove }: { item: Resource; onEdit: () => void; onRemove: () => void }) {
  const href = safeHref(item.url);
  return (
    <li className="panel p-4">
      <p className="text-xs tracking-widest text-moss">{item.category}</p>
      <h2 className="mt-1 font-serif text-2xl">{item.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.note}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {href ? (
          <a className="btn" href={href} target="_blank" rel="noreferrer">
            打开
          </a>
        ) : (
          <span className="text-sm">链接需要以 http 开头</span>
        )}
        <button type="button" className="btn-ghost" onClick={onEdit}>
          修改
        </button>
        <button type="button" className="btn-ghost" onClick={onRemove}>
          移除
        </button>
      </div>
    </li>
  );
}
