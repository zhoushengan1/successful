import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Feather, Library, Mountain, Wrench } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Scene } from "@/components/scene";
import { Player } from "@/components/player";
import { cn } from "@/lib/cn";
import { useStudio } from "@/lib/studio";

const links = [
  { to: "/", label: "山丘", icon: Mountain, exact: true },
  { to: "/tools", label: "器具", icon: Wrench, exact: false },
  { to: "/library", label: "库藏", icon: Library, exact: false },
  { to: "/skills", label: "手艺", icon: Feather, exact: false },
  { to: "/atelier", label: "驻留", icon: Compass, exact: false },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const toast = useStudio((state) => state.toast);
  const clearToast = useStudio((state) => state.clearToast);
  const tickFocus = useStudio((state) => state.tickFocus);

  useEffect(() => {
    void useStudio.persist.rehydrate();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => tickFocus(), 1000);
    return () => window.clearInterval(id);
  }, [tickFocus]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => clearToast(), 2400);
    return () => window.clearTimeout(id);
  }, [toast, clearToast]);

  return (
    <>
      <Scene />
      <div className="dock-pad relative z-10 flex min-h-dvh flex-col">{children}</div>
      {toast ? (
        <div
          role="status"
          className="fixed top-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-3 text-sm text-cream"
        >
          {toast}
        </div>
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-30">
        <Player />
        <nav className="safe-bottom border-t border-ink/10 bg-cream/95 backdrop-blur-md" aria-label="主要">
          <ul className="grid grid-cols-5">
            {links.map((link) => {
              const active = link.exact ? pathname === link.to : pathname.startsWith(link.to);
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      "flex min-h-16 flex-col items-center justify-center gap-1 text-xs",
                      active ? "text-moss" : "text-ink/70",
                    )}
                  >
                    <Icon className="size-5" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
