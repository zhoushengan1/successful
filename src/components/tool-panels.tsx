import { useMemo, useState } from "react";
import { copyText, formatTime, useStudio } from "@/lib/studio";
import type { ToolId } from "@/data/content";

function num(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function trimNum(value: number) {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return String(Number(value.toFixed(digits)));
}

export function ToolPanel({ id }: { id: ToolId }) {
  if (id === "focus") return <FocusTool />;
  if (id === "text") return <TextTool />;
  if (id === "json") return <JsonTool />;
  if (id === "units") return <UnitsTool />;
  if (id === "dates") return <DatesTool />;
  if (id === "secret") return <SecretTool />;
  if (id === "color") return <ColorTool />;
  if (id === "trade") return <TradeTool />;
  if (id === "notes") return <NotesTool />;
  return <EncodeTool />;
}

function FocusTool() {
  const seconds = useStudio((state) => state.focusSeconds);
  const total = useStudio((state) => state.focusTotal);
  const running = useStudio((state) => state.focusRunning);
  const label = useStudio((state) => state.focusLabel);
  const choose = useStudio((state) => state.chooseFocus);
  const start = useStudio((state) => state.startFocus);
  const pause = useStudio((state) => state.pauseFocus);
  const reset = useStudio((state) => state.resetFocus);
  const ratio = total > 0 ? seconds / total : 0;

  const presets = [
    { label: "山丘", minutes: 25 },
    { label: "临水", minutes: 15 },
    { label: "微风", minutes: 5 },
  ];

  return (
    <div className="panel wrap mt-4 p-6">
      <p className="text-xs tracking-widest text-moss">{label}</p>
      <p className="mt-3 text-center font-serif text-6xl tabular-nums text-ink">{formatTime(seconds)}</p>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-mist">
        <div className="h-full bg-moss" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={label === preset.label ? "chip bg-moss text-cream" : "chip bg-mist text-ink"}
            onClick={() => choose(preset.minutes * 60, preset.label)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="btn" onClick={running ? pause : start}>
          {running ? "暂停" : "开始"}
        </button>
        <button type="button" className="btn-ghost" onClick={reset}>
          重置
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">
        开始前只写下一件事。到点就停。微风那五分钟，不要拿来刷消息。
      </p>
    </div>
  );
}

function TextTool() {
  const [text, setText] = useState("");
  const flash = useStudio((state) => state.flash);
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text.length === 0 ? 0 : text.split(/\r?\n/).length;
  const blocks = text.split(/\n\s*\n/).filter((part) => part.trim()).length;

  function apply(next: string, message: string) {
    setText(next);
    flash(message);
  }

  return (
    <div className="wrap mt-4 grid gap-3">
      <div className="panel grid grid-cols-4 gap-2 p-4 text-center">
        <Stat label="字符" value={chars} />
        <Stat label="不计空格" value={charsNoSpace} />
        <Stat label="行" value={lines} />
        <Stat label="段" value={blocks} />
      </div>
      <textarea
        className="field min-h-48"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="把要整理的文字贴在这里"
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => apply(text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim(), "已收干净")}
        >
          去多余空行
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            const seen = new Set<string>();
            const next = text
              .split(/\r?\n/)
              .filter((line) => {
                if (seen.has(line)) return false;
                seen.add(line);
                return true;
              })
              .join("\n");
            apply(next, "重复行已去掉");
          }}
        >
          去重复行
        </button>
        <button type="button" className="btn" onClick={() => void copyText(text).then((ok) => flash(ok ? "已复制" : "请长按文字复制"))}>
          复制
        </button>
        <button type="button" className="btn-ghost" onClick={() => setText("")}>
          清空
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-serif text-2xl tabular-nums">{value}</p>
      <p className="text-xs text-ink/70">{label}</p>
    </div>
  );
}

function JsonTool() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const flash = useStudio((state) => state.flash);

  function run(space: number | undefined) {
    try {
      const value = JSON.parse(text);
      setText(JSON.stringify(value, null, space));
      setError("");
      flash(space ? "已排好" : "已压成一行");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "无法解析");
    }
  }

  return (
    <div className="wrap mt-4 grid gap-3">
      <textarea className="field min-h-56 font-sans" value={text} onChange={(event) => setText(event.target.value)} placeholder='{"name":"青屿"}' />
      {error ? <p className="panel border-l-4 border-dune px-4 py-3 text-sm">{error}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn" onClick={() => run(2)}>
          排好
        </button>
        <button type="button" className="btn-ghost" onClick={() => run(undefined)}>
          压成一行
        </button>
      </div>
    </div>
  );
}

const unitGroups = {
  length: {
    label: "长度",
    units: [
      { id: "mm", label: "毫米", k: 0.001 },
      { id: "cm", label: "厘米", k: 0.01 },
      { id: "m", label: "米", k: 1 },
      { id: "km", label: "千米", k: 1000 },
      { id: "in", label: "英寸", k: 0.0254 },
      { id: "ft", label: "英尺", k: 0.3048 },
    ],
  },
  weight: {
    label: "重量",
    units: [
      { id: "g", label: "克", k: 1 },
      { id: "jin", label: "斤", k: 500 },
      { id: "kg", label: "千克", k: 1000 },
      { id: "lb", label: "磅", k: 453.59237 },
    ],
  },
  data: {
    label: "存储",
    units: [
      { id: "b", label: "B", k: 1 },
      { id: "kb", label: "KB", k: 1000 },
      { id: "mb", label: "MB", k: 1_000_000 },
      { id: "gb", label: "GB", k: 1_000_000_000 },
    ],
  },
} as const;

type UnitGroup = keyof typeof unitGroups;

function UnitsTool() {
  const [group, setGroup] = useState<UnitGroup | "temp">("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [value, setValue] = useState("1");

  function switchGroup(next: UnitGroup | "temp") {
    setGroup(next);
    if (next === "temp") return;
    const units = unitGroups[next].units;
    setFrom(units[0].id);
    setTo(units[1]?.id ?? units[0].id);
  }

  const result = useMemo(() => {
    if (group === "temp") return "";
    const units = unitGroups[group].units;
    const source = units.find((unit) => unit.id === from);
    const target = units.find((unit) => unit.id === to);
    if (!source || !target) return "—";
    const base = num(value) * source.k;
    return trimNum(base / target.k);
  }, [group, from, to, value]);

  return (
    <div className="wrap mt-4 grid gap-3">
      <div className="grid grid-cols-4 gap-2">
        {(["length", "weight", "temp", "data"] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={group === key ? "chip justify-center bg-moss text-cream" : "chip justify-center bg-cream/90 text-ink"}
            onClick={() => switchGroup(key)}
          >
            {key === "temp" ? "温度" : unitGroups[key].label}
          </button>
        ))}
      </div>
      {group === "temp" ? (
        <TempTool />
      ) : (
        <div className="panel grid gap-3 p-4">
          <label className="grid gap-2 text-sm">
            数值
            <input className="field" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <UnitSelect label="从" value={from} units={unitGroups[group].units} onChange={setFrom} />
            <UnitSelect label="到" value={to} units={unitGroups[group].units} onChange={setTo} />
          </div>
          <p className="font-serif text-4xl tabular-nums">{result}</p>
          <p className="text-xs text-ink/70">存储按十进制，1 KB = 1000 B。斤按 500 克。</p>
        </div>
      )}
    </div>
  );
}

function UnitSelect({
  label,
  value,
  units,
  onChange,
}: {
  label: string;
  value: string;
  units: readonly { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TempTool() {
  const [celsius, setCelsius] = useState("20");
  const c = num(celsius);
  const f = c * (9 / 5) + 32;
  const k = c + 273.15;
  return (
    <div className="panel grid gap-3 p-4">
      <label className="grid gap-2 text-sm">
        摄氏度
        <input className="field" inputMode="decimal" value={celsius} onChange={(event) => setCelsius(event.target.value)} />
      </label>
      <p className="text-sm">华氏 {trimNum(f)}</p>
      <p className="text-sm">开尔文 {trimNum(k)}</p>
    </div>
  );
}

function DatesTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [target, setTarget] = useState(today);

  const between = useMemo(() => daySpan(start, end), [start, end]);
  const until = useMemo(() => daySpan(today, target), [today, target]);

  return (
    <div className="wrap mt-4 grid gap-3">
      <div className="panel grid gap-3 p-4">
        <p className="font-serif text-2xl">两日之间</p>
        <label className="grid gap-2 text-sm">
          开始
          <input className="field" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm">
          结束
          <input className="field" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
        </label>
        <p className="font-serif text-4xl tabular-nums">{between === null ? "—" : `${between} 天`}</p>
      </div>
      <div className="panel grid gap-3 p-4">
        <p className="font-serif text-2xl">距离某一天</p>
        <label className="grid gap-2 text-sm">
          日期
          <input className="field" type="date" value={target} onChange={(event) => setTarget(event.target.value)} />
        </label>
        <p className="text-sm">
          {until === null ? "—" : until >= 0 ? `还有 ${until} 天` : `已过去 ${Math.abs(until)} 天`}
        </p>
      </div>
    </div>
  );
}

function daySpan(start: string, end: string) {
  if (!start || !end) return null;
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function SecretTool() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [value, setValue] = useState("");
  const flash = useStudio((state) => state.flash);

  function generate() {
    let pool = "";
    if (lower) pool += "abcdefghijkmnopqrstuvwxyz";
    if (upper) pool += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (digits) pool += "23456789";
    if (symbols) pool += "!@#$%^&*-_";
    if (!pool) {
      flash("至少留一种字符");
      return;
    }
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    setValue(Array.from(bytes, (item) => pool[item % pool.length]).join(""));
  }

  return (
    <div className="panel wrap mt-4 grid gap-3 p-4">
      <label className="grid gap-2 text-sm">
        长度 {length}
        <input
          className="w-full accent-moss"
          type="range"
          min={8}
          max={32}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <Toggle label="小写" on={lower} setOn={setLower} />
        <Toggle label="大写" on={upper} setOn={setUpper} />
        <Toggle label="数字" on={digits} setOn={setDigits} />
        <Toggle label="符号" on={symbols} setOn={setSymbols} />
      </div>
      <p className="min-h-11 break-all rounded-2xl bg-mist px-4 py-3 font-serif text-lg">{value || "还没有生成"}</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn" onClick={generate}>
          生成
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => void copyText(value).then((ok) => flash(ok && value ? "已复制" : "先生成，或长按复制"))}
        >
          复制
        </button>
      </div>
      <p className="text-xs text-ink/70">去掉了容易看混的字符。它只生成本地密码，不会上传。</p>
    </div>
  );
}

function Toggle({ label, on, setOn }: { label: string; on: boolean; setOn: (value: boolean) => void }) {
  return (
    <button type="button" className={on ? "chip justify-center bg-moss text-cream" : "chip justify-center bg-mist text-ink"} onClick={() => setOn(!on)} aria-pressed={on}>
      {label}
    </button>
  );
}

function ColorTool() {
  const [input, setInput] = useState("3f6b4e");
  const parsed = parseHex(input);
  const channels = parsed ? rgbOf(parsed) : null;
  const hsl = channels ? hslOf(channels.r, channels.g, channels.b) : null;
  const flash = useStudio((state) => state.flash);

  return (
    <div className="panel wrap mt-4 grid gap-3 p-4">
      <label className="grid gap-2 text-sm">
        十六进制
        <input className="field" value={input} onChange={(event) => setInput(event.target.value)} placeholder="3f6b4e" />
      </label>
      <div className="h-24 rounded-card ring-1 ring-ink/10" style={{ background: parsed ?? "transparent" }} />
      {parsed && channels && hsl ? (
        <div className="grid gap-1 text-sm">
          <p>{parsed}</p>
          <p className="tabular-nums">RGB {channels.r} {channels.g} {channels.b}</p>
          <p className="tabular-nums">HSL {hsl.h} {hsl.s}% {hsl.l}%</p>
          <button type="button" className="btn mt-2" onClick={() => void copyText(parsed).then((ok) => flash(ok ? "已复制" : "请长按复制"))}>
            复制色值
          </button>
        </div>
      ) : (
        <p className="text-sm">需要 6 位颜色，例如 3f6b4e。</p>
      )}
    </div>
  );
}

function parseHex(input: string) {
  const raw = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return null;
  return `#${raw.toLowerCase()}`;
}

function rgbOf(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function hslOf(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: Math.round(h * 60), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function TradeTool() {
  const [price, setPrice] = useState("100");
  const [off, setOff] = useState("20");
  const [qty, setQty] = useState("1");
  const [cost, setCost] = useState("");
  const unit = num(price) * (1 - num(off) / 100);
  const total = unit * num(qty);
  const hasCost = cost.trim() !== "";
  const profit = hasCost ? (unit - num(cost)) * num(qty) : 0;
  const margin = hasCost && unit !== 0 ? ((unit - num(cost)) / unit) * 100 : null;

  return (
    <div className="panel wrap mt-4 grid gap-3 p-4">
      <Field label="原价" value={price} onChange={setPrice} />
      <Field label="减价百分比，20 表示便宜两成" value={off} onChange={setOff} />
      <Field label="数量" value={qty} onChange={setQty} />
      <Field label="单件成本，可空" value={cost} onChange={setCost} />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="成交单价" value={Number(trimNum(unit)) || 0} />
        <Stat label="合计" value={Number(trimNum(total)) || 0} />
      </div>
      {hasCost ? (
        <p className="text-sm">
          毛利 {trimNum(profit)}
          {margin !== null ? ` · 毛利率 ${trimNum(margin)}%` : ""}
        </p>
      ) : (
        <p className="text-sm text-ink/70">填了成本，才会算毛利。</p>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input className="field" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NotesTool() {
  const notes = useStudio((state) => state.notes);
  const addNote = useStudio((state) => state.addNote);
  const removeNote = useStudio((state) => state.removeNote);
  const [text, setText] = useState("");

  return (
    <div className="wrap mt-4 grid gap-3">
      <form
        className="panel grid gap-3 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          addNote(text);
          setText("");
        }}
      >
        <textarea className="field min-h-28" value={text} onChange={(event) => setText(event.target.value)} placeholder="写给自己的一句" />
        <button type="submit" className="btn">
          记下
        </button>
      </form>
      {notes.length === 0 ? <p className="panel p-4 text-sm text-ink/75">还没有速记。它们只留在这台手机。</p> : null}
      {notes.map((note) => (
        <article key={note.id} className="panel p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.text}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-ink/60">
              {new Date(note.updatedAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
            <button type="button" className="btn-ghost" onClick={() => removeNote(note.id)}>
              删除
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function EncodeTool() {
  const [mode, setMode] = useState<"b64" | "url">("b64");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const flash = useStudio((state) => state.flash);

  function run(direction: "encode" | "decode") {
    try {
      const next = mode === "b64"
        ? direction === "encode"
          ? encodeB64(input)
          : decodeB64(input)
        : direction === "encode"
          ? encodeURIComponent(input)
          : decodeURIComponent(input);
      setOutput(next);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "无法转换");
    }
  }

  return (
    <div className="wrap mt-4 grid gap-3">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={mode === "b64" ? "chip justify-center bg-moss text-cream" : "chip justify-center bg-cream/90 text-ink"} onClick={() => setMode("b64")}>
          Base64
        </button>
        <button type="button" className={mode === "url" ? "chip justify-center bg-moss text-cream" : "chip justify-center bg-cream/90 text-ink"} onClick={() => setMode("url")}>
          网址
        </button>
      </div>
      <textarea className="field min-h-32" value={input} onChange={(event) => setInput(event.target.value)} placeholder="要转换的文字" />
      {error ? <p className="panel border-l-4 border-dune px-4 py-3 text-sm">{error}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn" onClick={() => run("encode")}>
          编码
        </button>
        <button type="button" className="btn-ghost" onClick={() => run("decode")}>
          解码
        </button>
      </div>
      <textarea className="field min-h-32" readOnly value={output} placeholder="结果会出现在这里" />
      <button type="button" className="btn-ink" onClick={() => void copyText(output).then((ok) => flash(ok && output ? "已复制" : "还没有结果"))}>
        复制结果
      </button>
    </div>
  );
}

function encodeB64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeB64(value: string) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
