import type { ReactNode } from "react";

export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="panel wrap mt-4 p-6 md:mt-8">
      <p className="text-xs tracking-widest text-moss">{kicker}</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">{title}</h1>
      {children ? <div className="mt-3 text-sm leading-relaxed text-ink/75">{children}</div> : null}
    </header>
  );
}
