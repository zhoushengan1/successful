import { useEffect, useRef, useState } from "react";

export function Scene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const narrow = window.matchMedia("(max-width: 767px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    const apply = () => {
      if (reduce.matches || saveData) {
        video.pause();
        video.removeAttribute("src");
        setLive(false);
        return;
      }
      const next = narrow.matches ? "/scene/hills-portrait.mp4" : "/scene/hills-wide.mp4";
      if (video.getAttribute("src") !== next) {
        video.src = next;
      }
      void video.play().catch(() => setLive(false));
    };

    apply();
    narrow.addEventListener("change", apply);
    return () => narrow.removeEventListener("change", apply);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden="true">
      <img
        src="/scene/hills-portrait.jpg"
        alt=""
        className="scene-still absolute inset-0 h-full w-full object-cover md:hidden"
      />
      <img
        src="/scene/hills-wide.jpg"
        alt=""
        className="scene-still absolute inset-0 hidden h-full w-full object-cover md:block"
      />
      <video
        ref={videoRef}
        className={live ? "absolute inset-0 h-full w-full object-cover opacity-100" : "absolute inset-0 h-full w-full object-cover opacity-0"}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setLive(true)}
      />
      <div className="petals pointer-events-none absolute inset-0">
        <i className="petal" />
        <i className="petal" />
        <i className="petal" />
        <i className="petal" />
        <i className="petal" />
        <i className="petal" />
        <i className="petal" />
        <i className="petal" />
      </div>
      <div className="scene-vignette pointer-events-none absolute inset-0" />
      <div className="scene-grain pointer-events-none absolute inset-0" />
    </div>
  );
}
