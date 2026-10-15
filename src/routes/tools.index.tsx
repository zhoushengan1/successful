import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { tools } from "@/data/content";
import { formatTime, useStudio } from "@/lib/studio";
import { PageIntro } from "@/components/ui";

export const Route = createFileRoute("/tools/")({
  component: ToolsPage,
});

function ToolsPage() {
  const running = useStudio((state) => state.focusRunning);
  const seconds = useStudio((state) => state.focusSeconds);
  const label = useStudio((state) => state.focusLabel);

  return (
    <div>
      <PageIntro kicker="器具" title="手机上的十件小事">
        都在这台设备里完成，不需要账号。山丘钟如果正在走，离开这页也会继续。
      </PageIntro>
      <ul className="wrap mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.id}>
            <Link to="/tools/$toolId" params={{ toolId: tool.id }} className="panel flex min-h-24 items-center gap-3 p-4">
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-2xl">{tool.name}</span>
                <span className="mt-1 block text-sm text-ink/70">{tool.blurb}</span>
                {tool.id === "focus" && running ? (
                  <span className="mt-2 block text-sm tabular-nums text-moss">
                    {label} {formatTime(seconds)}
                  </span>
                ) : null}
              </span>
              <ChevronRight className="size-5 shrink-0 text-moss" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
