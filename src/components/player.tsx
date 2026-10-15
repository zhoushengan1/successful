import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { AUDIO_SRC, SONG } from "@/site.config";
import { formatTime } from "@/lib/studio";

type Phase = "idle" | "ready" | "missing";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function arm() {
    const audio = audioRef.current;
    if (!audio || phase === "missing") return null;
    if (!audio.getAttribute("src")) audio.src = AUDIO_SRC;
    return audio;
  }

  function toggle() {
    const audio = arm();
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setPhase("missing"));
    } else {
      audio.pause();
    }
  }

  function seek(ratio: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0 || phase !== "ready") return;
    audio.currentTime = Math.min(duration, Math.max(0, ratio * duration));
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <div className="bg-ink text-cream">
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          setPhase("ready");
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => setTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onError={() => {
          setPhase("missing");
          setPlaying(false);
        }}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex items-center gap-3 px-4 pt-3">
        {phase === "missing" ? (
          <Link
            to="/atelier"
            hash="audio"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-moss text-xs text-cream"
            aria-label="去放入音频"
          >
            放入
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-moss text-cream"
            onClick={toggle}
            aria-label={playing ? "暂停" : "播放 Fade Into You"}
          >
            {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight">{SONG.title}</p>
          <p className="truncate text-xs text-cream/80">
            {SONG.artist}
            <span className="px-1">·</span>
            {phase === "missing" ? "音频还没有放入" : SONG.year}
          </p>
        </div>
        <p className="shrink-0 text-xs tabular-nums text-cream/80">
          {phase === "ready" ? `${formatTime(time)} / ${formatTime(duration)}` : "—:—"}
        </p>
      </div>
      <button
        type="button"
        className="flex h-11 w-full items-center px-4"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          seek((event.clientX - rect.left) / rect.width);
        }}
        aria-label="拖动进度"
      >
        <span className="relative h-0.5 w-full bg-cream/25">
          <span className="absolute inset-y-0 left-0 bg-dune" style={{ width: `${progress}%` }} />
        </span>
      </button>
    </div>
  );
}
