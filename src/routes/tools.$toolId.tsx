import { createFileRoute, Link } from "@tanstack/react-router";
import { findTool, type ToolId } from "@/data/content";
import { ToolPanel } from "@/components/tool-panels";
import { PageIntro } from "@/components/ui";

export const Route = createFileRoute("/tools/$toolId")({
  component: ToolPage,
});

function ToolPage() {
  const { toolId } = Route.useParams();
  const tool = findTool(toolId);

  if (!tool) {
    return (
      <div className="panel wrap mt-8 p-6">
        <h1 className="font-serif text-3xl">没有这件器具</h1>
        <Link to="/tools" className="btn mt-5">
          回到器具
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <PageIntro kicker="器具" title={tool.name}>
        {tool.blurb}
      </PageIntro>
      <ToolPanel id={tool.id as ToolId} />
    </div>
  );
}
