import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SiteProfile } from "@/site.config";
import { siteConfig } from "@/site.config";
import { seedResources, seedSkills, type Resource, type Skill } from "@/data/content";

export type Note = {
  id: string;
  text: string;
  updatedAt: number;
};

type StudioState = {
  profile: Partial<SiteProfile>;
  libraryCustom: boolean;
  resources: Resource[];
  skillsCustom: boolean;
  skills: Skill[];
  notes: Note[];
  toast: string;
  focusSeconds: number;
  focusTotal: number;
  focusRunning: boolean;
  focusLabel: string;
  setProfile: (patch: Partial<SiteProfile>) => void;
  clearProfile: () => void;
  addResource: (input: Omit<Resource, "id">) => void;
  updateResource: (id: string, patch: Omit<Resource, "id">) => void;
  removeResource: (id: string) => void;
  resetLibrary: () => void;
  importLibrary: (resources: Resource[]) => void;
  addSkill: (input: Omit<Skill, "id" | "minutes"> & { minutes?: number }) => void;
  removeSkill: (id: string) => void;
  resetSkills: () => void;
  addNote: (text: string) => void;
  removeNote: (id: string) => void;
  flash: (message: string) => void;
  clearToast: () => void;
  chooseFocus: (total: number, label: string) => void;
  startFocus: () => void;
  pauseFocus: () => void;
  resetFocus: () => void;
  tickFocus: () => void;
};

function uid() {
  return crypto.randomUUID();
}

function ensureLibrary(state: StudioState) {
  return state.libraryCustom ? state.resources : seedResources.map((item) => ({ ...item }));
}

function ensureSkills(state: StudioState) {
  return state.skillsCustom ? state.skills : seedSkills.map((item) => ({ ...item }));
}

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      profile: {},
      libraryCustom: false,
      resources: [],
      skillsCustom: false,
      skills: [],
      notes: [],
      toast: "",
      focusSeconds: 25 * 60,
      focusTotal: 25 * 60,
      focusRunning: false,
      focusLabel: "山丘",
      setProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),
      clearProfile: () => set({ profile: {} }),
      addResource: (input) => {
        const resources = ensureLibrary(get());
        if (resources.length >= 200) {
          get().flash("库藏已经很多了");
          return;
        }
        set({
          libraryCustom: true,
          resources: [{ ...input, id: uid() }, ...resources],
        });
      },
      updateResource: (id, patch) => {
        const resources = ensureLibrary(get()).map((item) => (item.id === id ? { ...item, ...patch, id } : item));
        set({ libraryCustom: true, resources });
      },
      removeResource: (id) => {
        set({
          libraryCustom: true,
          resources: ensureLibrary(get()).filter((item) => item.id !== id),
        });
      },
      resetLibrary: () => set({ libraryCustom: false, resources: [] }),
      importLibrary: (resources) => set({ libraryCustom: true, resources: resources.slice(0, 200) }),
      addSkill: (input) => {
        const skills = ensureSkills(get());
        set({
          skillsCustom: true,
          skills: [
            {
              id: uid(),
              title: input.title,
              summary: input.summary,
              body: input.body,
              tag: input.tag,
              minutes: input.minutes ?? 3,
            },
            ...skills,
          ],
        });
      },
      removeSkill: (id) => {
        set({
          skillsCustom: true,
          skills: ensureSkills(get()).filter((item) => item.id !== id),
        });
      },
      resetSkills: () => set({ skillsCustom: false, skills: [] }),
      addNote: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (trimmed.length > 4000) {
          get().flash("太长了，先收一收");
          return;
        }
        set({
          notes: [{ id: uid(), text: trimmed, updatedAt: Date.now() }, ...get().notes].slice(0, 100),
        });
      },
      removeNote: (id) => set({ notes: get().notes.filter((note) => note.id !== id) }),
      flash: (message) => set({ toast: message }),
      clearToast: () => set({ toast: "" }),
      chooseFocus: (total, label) => set({ focusTotal: total, focusSeconds: total, focusRunning: false, focusLabel: label }),
      startFocus: () =>
        set((state) => ({
          focusRunning: true,
          focusSeconds: state.focusSeconds === 0 ? state.focusTotal : state.focusSeconds,
        })),
      pauseFocus: () => set({ focusRunning: false }),
      resetFocus: () => set((state) => ({ focusRunning: false, focusSeconds: state.focusTotal })),
      tickFocus: () => {
        const state = get();
        if (!state.focusRunning) return;
        if (state.focusSeconds <= 1) {
          set({ focusSeconds: 0, focusRunning: false, toast: `${state.focusLabel}走完了` });
          if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
            navigator.vibrate(180);
          }
          return;
        }
        set({ focusSeconds: state.focusSeconds - 1 });
      },
    }),
    {
      name: "qingyu-studio-v1",
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        libraryCustom: state.libraryCustom,
        resources: state.resources,
        skillsCustom: state.skillsCustom,
        skills: state.skills,
        notes: state.notes,
      }),
    },
  ),
);

export function useProfile(): SiteProfile {
  const patch = useStudio((state) => state.profile);
  const merged: SiteProfile = { ...siteConfig };
  (Object.keys(siteConfig) as (keyof SiteProfile)[]).forEach((key) => {
    const value = patch[key];
    if (typeof value === "string" && value.trim()) merged[key] = value.trim();
  });
  return merged;
}

export function useResources() {
  const custom = useStudio((state) => state.libraryCustom);
  const resources = useStudio((state) => state.resources);
  return custom ? resources : seedResources;
}

export function useSkills() {
  const custom = useStudio((state) => state.skillsCustom);
  const skills = useStudio((state) => state.skills);
  return custom ? skills : seedSkills;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

export function safeHref(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href;
  } catch {
    return null;
  }
  return null;
}

export function cleanDomain(value: string) {
  return value.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
}

export function priceLabel(value: string) {
  if (!value.trim()) return "待填写";
  if (/^\d+(\.\d+)?$/.test(value.trim())) return `¥${value.trim()}`;
  return value.trim();
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function configSnippet(profile: SiteProfile) {
  const row = (key: keyof SiteProfile, comment: string) =>
    `  /** ${comment} */\n  ${key}: ${JSON.stringify(profile[key])},`;
  return [
    "export const siteConfig = {",
    row("name", "对外名称"),
    row("nameEn", "英文短名"),
    row("domain", "【待填写】域名，不要带 https://"),
    row("email", "【待填写】联系邮箱"),
    row("social", "【待填写】社交账号"),
    row("monthlyPrice", "【待填写】月费"),
    row("yearlyPrice", "【待填写】年费"),
    row("payLink", "【待填写】收款链接"),
    row("about", "【待填写】你的一句介绍"),
    "};",
  ].join("\n");
}

export function isResource(value: unknown): value is Resource {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.url === "string" &&
    typeof row.note === "string" &&
    typeof row.category === "string"
  );
}
