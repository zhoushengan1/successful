import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: MissingPage,
});

function MissingPage() {
  return (
    <div className="panel wrap mt-8 p-6">
      <h1 className="font-serif text-3xl">这页还没有</h1>
      <p className="mt-3 text-sm text-ink/75">风把路吹歪了。</p>
      <Link to="/" className="btn mt-6">
        回山丘
      </Link>
    </div>
  );
}
