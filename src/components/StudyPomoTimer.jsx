import React, { useEffect, useRef, useState } from 'react';

const FOCUS = 25 * 60;
const R = 52;
const C = 2 * Math.PI * R;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/**
 * A working focus timer in the StudyPomo look. "Lock screen" dims the phone the way Android does;
 * the timer keeps counting, which is the whole point of the app.
 */
export default function StudyPomoTimer() {
  const [left, setLeft] = useState(FOCUS - 13 * 60 - 48);
  const [running, setRunning] = useState(true);
  const [locked, setLocked] = useState(false);
  const ref = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      if (visible.current) setLeft((s) => (s <= 0 ? FOCUS : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const progress = 1 - left / FOCUS;

  return (
    <div ref={ref} className="my-4 rounded-2xl border border-white/[0.06] bg-[#0b1d33] p-4 text-white">
      <div className="flex items-center gap-4">
        <div className="relative size-[124px] shrink-0">
          <svg viewBox="0 0 124 124" className="size-full -rotate-90">
            <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="6" />
            <circle
              cx="62"
              cy="62"
              r={R}
              fill="none"
              stroke="#e8eef7"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${locked ? 'opacity-40' : ''}`}>
            <div className="text-center">
              <div className="text-[26px] font-semibold tabular-nums tracking-tight leading-none">{fmt(left)}</div>
              <div className="mt-1 text-[11px] text-white/60">Focus · 2 of 4</div>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="w-full min-h-[40px] rounded-full bg-white text-[#0b1d33] text-sm font-semibold active:scale-[.98] transition cursor-pointer"
          >
            {running ? 'Pause' : 'Resume'}
          </button>
          <button
            type="button"
            onClick={() => setLocked((l) => !l)}
            className="w-full min-h-[40px] rounded-full border border-white/20 text-sm text-white/85 hover:bg-white/5 active:scale-[.98] transition cursor-pointer"
          >
            {locked ? 'Unlock screen' : 'Lock screen'}
          </button>
        </div>
      </div>

      {/* Lock-screen notification: what the user sees with the screen off */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ gridTemplateRows: locked ? '1fr' : '0fr', opacity: locked ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2.5">
            <img src="logos/studypomo.png" alt="" width="28" height="28" className="size-7 rounded-lg" />
            <div className="min-w-0 text-[12px] leading-tight">
              <div className="text-white">StudyPomo · {fmt(left)} left</div>
              <div className="text-white/50">Still counting with the screen off</div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed text-white/70">
        A foreground service and a wake lock keep the timer counting. On HiOS phones like the TECNO KM7, which kill the service anyway, the app sends you to the phone's own battery settings.
      </p>
      <p className="mt-1.5 text-[11px] text-white/45">Tested on TECNO KI7 and KM7. Built after reading 2,000 reviews of other timers.</p>
    </div>
  );
}
