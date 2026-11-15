"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface WorksWheelItem {
  title: string;
  category: string;
  summary: string;
  /** Brand color sampled from the project's logo. Used for the card panel. */
  color: string;
  icon: string;
  /** Optional real screenshot. Shown behind the text when present. */
  image?: string;
  href?: string;
  meta?: string;
  /** Who owns it: Emberfig studio work or a personal project. */
  owner: "Emberfig" | "Open source" | "Personal";
}

export interface WorksWheelProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items?: WorksWheelItem[];
  label?: string;
}

export const GEORGE_PROJECTS: WorksWheelItem[] = [
  {
    title: "arena.ai-desktop",
    category: "Desktop client",
    summary: "arena.ai in its own window: 100+ models, Claude Code-style tool rows, local MCP servers, workspace folder sync.",
    color: "#1a1f1e",
    icon: "logos/arena.svg",
    image: "images/arena-preview.webp",
    href: "https://github.com/PlayzAe/arena.ai-desktop",
    meta: "MIT · Python · 15 stars, 7 forks",
    owner: "Open source",
  },
  {
    title: "Quilore",
    category: "Web app",
    summary: "Reads your Spotify data export in the browser with Web Workers. 160k plays in under 4 seconds, nothing uploaded.",
    color: "#2f5fae",
    icon: "logos/quilore.png",
    href: "https://quilore.com",
    meta: "Longplay is the open-source engine",
    owner: "Emberfig",
  },
  {
    title: "StudyPomo",
    category: "Android app",
    summary: "A focus timer that keeps running on phones that kill background apps: TECNO HiOS, MIUI, One UI.",
    color: "#0b1d33",
    icon: "logos/studypomo.png",
    href: "https://play.google.com/store/apps/details?id=com.everythingabuad.studypomo",
    meta: "Google Play",
    owner: "Emberfig",
  },
  {
    title: "Ponderanda",
    category: "Web + Android",
    summary: "One arithmetic ladder a day. Five problems, one attempt, same for everyone. No ads.",
    color: "#e4e2d3",
    icon: "logos/ponderanda.png",
    href: "https://ponderanda.com",
    meta: "ponderanda.com · Google Play",
    owner: "Emberfig",
  },
  {
    title: "Herewise",
    category: "Windows app",
    summary: "Lecture attendance from a ZKTeco fingerprint terminal. Stays on the lecturer's PC, works offline.",
    color: "#1f3a6e",
    icon: "icons/herewise.png",
    href: "https://emberfig.com/apps/#herewise-writing",
    meta: "GPL · Win64",
    owner: "Emberfig",
  },
  {
    title: "PlayzAnime",
    category: "Win · Android · Web",
    summary: "Ad-free anime and manga client. HLS pre-buffering, intro/outro skip, offline CBZ reader.",
    color: "#f0532c",
    icon: "logos/playzanime.svg",
    image: "images/playzanime-preview.webp",
    href: "https://playz.vmny.lol",
    meta: "Three public repos: desktop, app, landing page",
    owner: "Open source",
  },
  {
    title: "Zykof",
    category: "Subscription platform",
    summary: "Buy and sell subscriptions: instant license keys, customer dashboard, reseller portal, admin.",
    color: "#0a0a0a",
    icon: "icons/zykof.svg",
    href: "https://zykof.best",
    meta: "zykof.best",
    owner: "Personal",
  },
];

// Stack geometry: the facing card is flat (crisp text); neighbours tilt away and dim.
const CARD_RATIO = 1.5;
const TILT = 14; // degrees a neighbour leans back
const EASE = 0.16;
/** Page scroll per card, in viewport heights. */
const SCROLL_PER_STEP = 0.5;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
}

/**
 * m = 0: cards sit on a ring around the "Works '26" label.
 * m = 1: vertical stack, one card per slot so cards never overlap mid-scroll.
 * Every value is lerped numerically, so the morph between the two is smooth.
 */
function place(i: number, d: number, m: number, count: number, cardH: number, ringR: number, ringScale: number) {
  const th = (i / count) * Math.PI * 2;
  const ad = Math.abs(d);
  const sx = 0, sy = d * cardH * 1.04, srot = 0, stilt = -clamp(d, -1.6, 1.6) * TILT, ss = 1 - Math.min(ad, 1.6) * 0.1;
  const rx = Math.sin(th) * ringR, ry = -Math.cos(th) * ringR, rrot = (th * 180) / Math.PI;
  const x = lerp(rx, sx, m), y = lerp(ry, sy, m), rot = lerp(rrot, srot, m), tilt = stilt * m, sc = lerp(ringScale, ss, m);
  return `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) perspective(900px) rotateX(${tilt.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Scroll-pinned project wheel.
 * The section is tall; its stage sticks to the viewport while you scroll through it,
 * and page scroll position drives the wheel. Outside the section the page scrolls normally.
 * Same behaviour on touch and mouse, because it is plain native scrolling.
 */
export function WorksWheel({ items = GEORGE_PROJECTS, label = "Works '26", className, ...props }: WorksWheelProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLDivElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const frame = React.useRef(0);
  const running = React.useRef(false);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState({ w: 0, h: 0 });
  const [reduced, setReduced] = React.useState(false);

  const count = items.length;
  const last = Math.max(count - 1, 0);
  const steps = last + 1; // ring -> stack is the first step, then one per card

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(Boolean(q?.matches));
    read();
    q.addEventListener?.("change", read);
    return () => q.removeEventListener?.("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth || 360, h: el.clientHeight || 520 });
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const g = React.useMemo(() => {
    const { w, h } = stage;
    const small = w < 1024;
    const cardW = small ? Math.min(w - 40, 340) : Math.min(h * 0.46 * CARD_RATIO, w * 0.4, 420);
    const cardH = cardW / CARD_RATIO;
    const ringR = Math.min(w, h) * (small ? 0.3 : 0.32);
    const ringScale = clamp(((2 * Math.PI * ringR) / Math.max(count, 1)) * 0.78 / cardW, 0.18, 0.5);
    return { small, cardW, cardH, ringR, ringScale, depth: 1200 };
  }, [stage, count]);

  const loop = React.useCallback(() => {
    if (running.current || !stage.h) return;
    running.current = true;
    const draw = () => {
      const gap = target.current - turn.current;
      const settled = Math.abs(gap) < 0.0005;
      turn.current = settled ? target.current : turn.current + gap * (reduced ? 1 : EASE);
      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);
      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const d = i - pos;
        const ad = Math.abs(d);
        const hidden = m > 0.6 && ad > 1.9;
        card.style.visibility = hidden ? "hidden" : "visible";
        if (hidden) continue;
        card.style.transform = place(i, d, m, count, g.cardH, g.ringR, g.ringScale);
        card.style.zIndex = String(Math.round(100 - ad * 10));
        card.style.opacity = String(lerp(1, clamp(1 - Math.max(0, ad - 0.15) * 0.5, 0, 1), m));
        const dim = m * Math.min(ad, 1) * 0.5;
        card.style.filter = dim > 0.01 ? `brightness(${(1 - dim).toFixed(3)})` : "none";
        card.style.pointerEvents = m < 0.5 || ad < 1.2 ? "auto" : "none";
      }
      if (labelRef.current) labelRef.current.style.opacity = String(clamp(1 - m * 2.2, 0, 1));
      if (titleRef.current) titleRef.current.style.opacity = String(clamp(m * 1.6 - 0.4, 0, 1));
      const near = clamp(Math.round(pos), 0, last);
      setActive((p) => (p === near ? p : near));
      if (settled) running.current = false;
      else frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
  }, [g, stage.h, count, last, reduced]);

  React.useEffect(() => {
    loop();
    return () => {
      cancelAnimationFrame(frame.current);
      running.current = false;
    };
  }, [loop]);

  // Page scroll -> wheel position. Passive listener, no scroll hijacking.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rest: number | undefined;
    const onScroll = () => {
      const r = track.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      if (range <= 0) return;
      const p = clamp(-r.top / range, 0, 1);
      // Snap softly toward whole cards so a card always comes to rest facing you.
      const raw = p * steps;
      const whole = Math.round(raw);
      target.current = Math.abs(raw - whole) < 0.18 ? whole : raw;
      loop();
      // When scrolling stops, settle on the nearest whole card so one card always faces you.
      window.clearTimeout(rest);
      rest = window.setTimeout(() => {
        if (target.current !== whole) {
          target.current = whole;
          loop();
        }
      }, 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(rest);
    };
  }, [steps, loop]);

  /** Scroll the page so card n faces you. */
  const go = React.useCallback(
    (n: number) => {
      const track = trackRef.current;
      const step = clamp(n, 0, steps);
      if (!track) return;
      const range = track.offsetHeight - window.innerHeight;
      if (range <= 0) {
        target.current = step;
        loop();
        return;
      }
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (step / steps) * range + 1, behavior: reduced ? "auto" : "smooth" });
    },
    [steps, loop, reduced],
  );

  const current = () => Math.round(target.current);

  return (
    <section aria-label={label} className={cn("relative", className)} {...props}>
      <div ref={trackRef} style={{ height: `calc(100svh + ${Math.max(steps, 1) * SCROLL_PER_STEP * 100}svh)` }}>
        <div className="sticky top-0 h-[100svh] flex items-center">
          <div
            ref={stageRef}
            tabIndex={0}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`works-wheel-${active}`}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                go(current() + 1);
              } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                go(current() - 1);
              }
            }}
            className="relative w-full h-[min(560px,84svh)] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c0e] text-white outline-none touch-pan-y select-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ perspective: `${g.depth}px` }}
          >
            <div ref={wheelRef} className="absolute left-1/2 top-1/2" style={{ marginTop: g.small ? 8 : 0 }}>
              {items.map((item, i) => {
                const light = isLight(item.color);
                return (
                  <a
                    key={item.title}
                    id={`works-wheel-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(node) => {
                      cardRefs.current[i] = node;
                    }}
                    onClick={(e) => {
                      // A card that is not facing you rotates in first; the facing card opens its link.
                      if (turn.current < 0.9 || active !== i) {
                        e.preventDefault();
                        go(i + 1);
                      }
                    }}
                    className="group absolute cursor-pointer will-change-transform"
                    style={{ width: g.cardW, height: g.cardH, marginLeft: -g.cardW / 2, marginTop: -g.cardH / 2 }}
                  >
                    <span
                      className={cn(
                        "relative flex size-full flex-col overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]",
                        light ? "border-black/10 text-zinc-900" : "border-white/10 text-white",
                      )}
                      style={{ backgroundColor: item.color }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="absolute inset-0 size-full object-cover object-top opacity-45 transition-opacity duration-500 group-hover:opacity-60"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `${GRAIN}, linear-gradient(to top, ${item.color} 18%, ${item.color}00 80%)`,
                          backgroundBlendMode: "overlay, normal",
                          opacity: light ? 0.9 : 1,
                        }}
                      />
                      <span className="relative flex items-start justify-between gap-3">
                        <img src={item.icon} alt="" width={44} height={44} draggable={false} className="size-10 sm:size-11 rounded-xl object-cover ring-1 ring-black/20 shadow-md" />
                        <span className={cn("text-[11px] font-medium rounded-full px-2 py-0.5", light ? "bg-black/[0.07] text-zinc-700" : "bg-white/10 text-white/75")}>
                          {item.owner}
                        </span>
                      </span>
                      <span className="relative mt-auto">
                        <span className={cn("block text-[12px]", light ? "text-zinc-600" : "text-white/60")}>{item.category}</span>
                        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-lg sm:text-xl font-semibold tracking-tight leading-tight">
                          <span className="truncate">{item.title}</span>
                          <ArrowUpRight size={16} className={cn("shrink-0 transition-opacity", active === i ? "opacity-70" : "opacity-0")} />
                        </span>
                        <span className={cn("mt-1 block text-[12.5px] sm:text-[13px] leading-snug line-clamp-2", light ? "text-zinc-700" : "text-white/75")}>
                          {item.summary}
                        </span>
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Header: always visible. Desktop puts details at the left, phones keep it to one line on top. */}
            <div ref={labelRef} className="pointer-events-none absolute inset-0 z-[150] grid place-items-center">
              <span className="font-serif italic text-white/90 text-3xl sm:text-5xl">{label}</span>
            </div>
            <div ref={titleRef} style={{ opacity: 0 }} className="pointer-events-none absolute z-[200] left-5 right-5 top-4 flex items-baseline justify-between lg:right-auto lg:left-[5%] lg:top-1/2 lg:-translate-y-1/2 lg:block lg:w-[15rem]">
              <span className="font-serif italic text-white/90 text-lg lg:text-2xl">{label}</span>
              <span className="text-xs text-zinc-500 tabular-nums lg:mt-6 lg:block">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <span className="hidden lg:block mt-1 text-2xl font-semibold tracking-tight text-white truncate">{items[active]?.title}</span>
              {items[active]?.meta && <span className="hidden lg:block mt-1 text-sm text-zinc-400 leading-snug">{items[active]?.meta}</span>}
            </div>

            <ol className="hidden lg:flex flex-col items-end absolute right-[4%] top-1/2 -translate-y-1/2 gap-1.5 text-sm z-[200]">
              {items.map((item, i) => (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => go(i + 1)}
                    className={cn("cursor-pointer transition-colors hover:text-white", i === active ? "text-white" : "text-zinc-600")}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ol>

            <div className="lg:hidden absolute bottom-3 inset-x-3 z-[200] flex items-center justify-between">
              <button
                type="button"
                onClick={() => go(current() - 1)}
                className="size-11 rounded-full bg-black/70 border border-white/15 text-white grid place-items-center active:scale-95 cursor-pointer"
                aria-label="Previous project"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i + 1)}
                    className="h-11 w-6 grid place-items-center cursor-pointer"
                    aria-label={`Jump to project ${i + 1}`}
                  >
                    <span className={cn("h-1.5 rounded-full transition-all", i === active ? "w-4 bg-white" : "w-1.5 bg-white/30")} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(current() + 1)}
                className="size-11 rounded-full bg-black/70 border border-white/15 text-white grid place-items-center active:scale-95 cursor-pointer"
                aria-label="Next project"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorksWheel;
