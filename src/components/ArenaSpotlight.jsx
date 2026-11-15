import React, { useEffect, useRef, useState } from 'react';
import { Star, GitFork, Download, ArrowUpRight } from 'lucide-react';

const REPO = 'PlayzAe/arena.ai-desktop';
const CACHE_KEY = 'arena-repo-stats';
const CACHE_MS = 60 * 60 * 1000; // GitHub allows 60 unauthenticated calls/hour per IP; one per visitor per hour is plenty.
const FALLBACK = { stars: 15, forks: 7, version: 'v1.5.1' };

/** Reads stars, forks and latest release from the GitHub API, cached for an hour in localStorage. */
export function useRepoStats() {
  const [stats, setStats] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (c?.data) return { ...c.data, live: true };
    } catch {}
    return { ...FALLBACK, live: false };
  });

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.at < CACHE_MS) return;
    } catch {}
    const ctrl = new AbortController();
    const get = (path) =>
      fetch(`https://api.github.com/repos/${REPO}${path}`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } }).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      );
    Promise.allSettled([get(''), get('/releases/latest')]).then(([repo, rel]) => {
      if (repo.status !== 'fulfilled') return;
      const data = {
        stars: repo.value.stargazers_count ?? FALLBACK.stars,
        forks: repo.value.forks_count ?? FALLBACK.forks,
        version: rel.status === 'fulfilled' && rel.value.tag_name ? rel.value.tag_name : FALLBACK.version,
      };
      setStats({ ...data, live: true });
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
      } catch {}
    });
    return () => ctrl.abort();
  }, []);

  return stats;
}

const SPIN = ['·', '✢', '✳', '✶', '✻', '✽'];

/** The scripted session. `wait` = ms before the line appears, `think` = ms of spinner before it resolves. */
const SCRIPT = [
  { kind: 'prompt', text: 'add a dark mode toggle to the settings page', wait: 300 },
  { kind: 'think', text: 'Reading the workspace', think: 1100 },
  { kind: 'tool', name: 'Read', arg: 'src/settings/Settings.tsx', out: 'Read 142 lines', wait: 200 },
  { kind: 'tool', name: 'Edit', arg: 'src/settings/Settings.tsx', out: 'Added 18 lines, removed 2', wait: 500 },
  { kind: 'think', text: 'Checking the build', think: 900 },
  { kind: 'tool', name: 'Bash', arg: 'npm run build', out: 'built in 1.4s', wait: 200 },
  { kind: 'reply', text: 'Done. The toggle saves to localStorage and follows the system theme by default.', wait: 400 },
];

function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SPIN.length), 110);
    return () => clearInterval(t);
  }, []);
  return <span className="inline-block w-3 text-[#d97757]">{SPIN[i]}</span>;
}

/** A small Claude Code-style replay: skeleton while "loading", then lines stream in once it scrolls into view. */
function AgentReplay({ model }) {
  const ref = useRef(null);
  const [step, setStep] = useState(-1); // -1 = skeleton
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStep(SCRIPT.length);
      return;
    }
    let timers = [];
    let started = false;
    const run = () => {
      let t = 700; // skeleton time
      SCRIPT.forEach((line, i) => {
        t += line.wait || 0;
        timers.push(setTimeout(() => { setStep(i); setThinking(line.kind === 'think'); }, t));
        if (line.kind === 'think') t += line.think;
        if (line.kind === 'tool') t += 650;
      });
      timers.push(setTimeout(() => { setStep(SCRIPT.length); setThinking(false); }, t + 300));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        run();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const visible = SCRIPT.slice(0, Math.max(0, Math.min(step + 1, SCRIPT.length)));

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.08] bg-[#0b0b0d] font-mono text-[12px] leading-[1.65] text-zinc-300 overflow-hidden">
      <div className="flex items-center justify-between px-4 h-9 border-b border-white/[0.06] text-[11px] text-zinc-500">
        <span>arena.ai-desktop</span>
        <span>{model} · agent mode</span>
      </div>
      <div className="p-4 min-h-[232px]">
        {step < 0 ? (
          <div className="space-y-2.5" aria-hidden="true">
            {[78, 52, 64, 40, 70].map((w, i) => (
              <div key={i} className="h-3 rounded bg-white/[0.06] relative overflow-hidden" style={{ width: `${w}%` }}>
                <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {visible.map((line, i) => {
              const live = i === step && step < SCRIPT.length;
              if (line.kind === 'prompt')
                return (
                  <div key={i} className="animate-[lineIn_.35s_ease-out_both] rounded-md bg-white/[0.04] px-2.5 py-1.5 text-zinc-200">
                    <span className="text-zinc-500">&gt; </span>{line.text}
                  </div>
                );
              if (line.kind === 'think')
                return live && thinking ? (
                  <div key={i} className="animate-[lineIn_.35s_ease-out_both] text-zinc-400">
                    <Spinner /> {line.text}…
                  </div>
                ) : null;
              if (line.kind === 'tool')
                return (
                  <div key={i} className="animate-[lineIn_.35s_ease-out_both]">
                    <div>
                      <span className={live ? 'text-zinc-500 animate-pulse' : 'text-emerald-400'}>●</span>{' '}
                      <span className="text-white">{line.name}</span>
                      <span className="text-zinc-500">(</span>{line.arg}<span className="text-zinc-500">)</span>
                    </div>
                    {!live && <div className="pl-4 text-zinc-500">⎿ {line.out}</div>}
                  </div>
                );
              return (
                <div key={i} className="animate-[lineIn_.35s_ease-out_both] pt-1 text-zinc-200">
                  <span className="text-white">●</span> {line.text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArenaSpotlight() {
  const { stars, forks, version, live } = useRepoStats();
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-[#111113] p-5 sm:p-10">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-6 min-w-0">
          <div className="flex items-center gap-3">
            <img src="logos/arena.svg" alt="" width="44" height="44" className="size-11 rounded-xl" />
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">arena.ai-desktop</h3>
              <p className="text-sm text-zinc-500">Open source desktop client for arena.ai · MIT</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 border-y border-zinc-800 divide-x divide-zinc-800 text-center">
            <div className="py-3">
              <dt className="text-xs text-zinc-500">Stars</dt>
              <dd className="mt-0.5 text-xl font-semibold text-white tabular-nums inline-flex items-center gap-1.5"><Star size={15} className="text-zinc-400" />{stars}</dd>
            </div>
            <div className="py-3">
              <dt className="text-xs text-zinc-500">Forks</dt>
              <dd className="mt-0.5 text-xl font-semibold text-white tabular-nums inline-flex items-center gap-1.5"><GitFork size={15} className="text-zinc-400" />{forks}</dd>
            </div>
            <div className="py-3">
              <dt className="text-xs text-zinc-500">Latest</dt>
              <dd className="mt-0.5 text-xl font-semibold text-white">{version}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] text-zinc-600">{live ? 'Live from GitHub, refreshed hourly.' : 'Last known numbers. Live count loads from GitHub.'}</p>

          <p className="mt-5 text-[15px] text-zinc-300 leading-relaxed">
            arena.ai in its own window instead of a browser tab. Pick from 100+ models, and the app can work on a local folder: it reads and edits files, runs commands, and shows each step as a tool row, like Claude Code does.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-zinc-400">
            <li>Edge WebView2 window with a local Python/Flask backend streaming over SSE</li>
            <li>Local MCP servers and workspace folder sync</li>
            <li>Switch between accounts without logging out</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer" className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 active:scale-[.98] transition">
              View on GitHub <ArrowUpRight size={15} />
            </a>
            <a href={`https://github.com/${REPO}/releases/latest`} target="_blank" rel="noopener noreferrer" className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 text-sm font-medium text-zinc-200 hover:bg-white/5 active:scale-[.98] transition">
              <Download size={15} /> Download for Windows
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 min-w-0">
          <AgentReplay model={version} />
        </div>
      </div>
    </div>
  );
}
