import React, { useEffect, useState } from 'react';
import { X, Download, Printer } from 'lucide-react';

const EXPERIENCE = [
  {
    place: 'Emberfig',
    href: 'https://emberfig.com',
    role: 'Co-founder and engineer',
    when: '2026 – now',
    points: [
      'Built Quilore. It reads a Spotify data export in the browser with Web Workers: 160,634 plays indexed in under 4 seconds, nothing uploaded. The parser is open source as Longplay.',
      'Built the Android timer engine behind StudyPomo and Ponderanda. Foreground services and wake locks keep sessions alive on phones that kill background apps.',
      'Built Herewise, offline lecture attendance from a ZKTeco fingerprint terminal, and the Vinix Dental site.',
    ],
  },
  {
    place: 'Independent',
    role: 'Open source and my own products',
    when: '2026 – now',
    points: [
      'arena.ai-desktop: desktop client for arena.ai with tool rows like Claude Code and local MCP servers. MIT.',
      'PlayzAnime: ad-free anime and manga client for Windows, Android and web. Open source.',
      'Zykof: subscription platform with checkout, instant license keys, customer dashboard, reseller portal and admin.',
    ],
  },
  {
    place: 'Bincom ICT',
    role: 'Software engineer',
    when: '2022 – 2023',
    points: [
      'ASP.NET Core services and SQL Server schemas with role-based access.',
      'React and TypeScript screens for data-heavy internal tools; tuned slow EF Core queries.',
    ],
  },
];

const SKILLS = [
  ['Web', 'React 19, TypeScript, Next.js, Vite, Tailwind, Web Workers, Node.js'],
  ['Backend', 'C#, ASP.NET Core, EF Core, PostgreSQL, SQL Server, Docker'],
  ['Desktop', 'Python, Flask, pywebview, Edge WebView2, Electron'],
  ['Mobile', 'Kotlin, Flutter, Dart, Android foreground services'],
  ['Low level', 'C/C++, x64 assembly, x64dbg, IDA (hobby)'],
];

const link = 'text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-400';

export default function CVModal({ isOpen, onClose }) {
  // `shown` drives the enter/exit transition; `mounted` keeps the node around until the exit finishes.
  const [mounted, setMounted] = useState(isOpen);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const download = () => {
    const a = document.createElement('a');
    a.href = 'Moses_Azuoru_George_CV.md';
    a.download = 'George_Moses_Azuoru_CV.md';
    a.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CV"
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl max-h-[92dvh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-zinc-800 bg-[#111113] text-left shadow-2xl transition-[transform,opacity] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${shown ? 'translate-y-0 sm:scale-100 opacity-100' : 'translate-y-6 sm:translate-y-2 sm:scale-[.98] opacity-0'}`}
      >
        <div className="flex items-center justify-between gap-2 px-5 sm:px-8 h-14 border-b border-zinc-800 shrink-0">
          <span className="text-sm text-zinc-400">CV</span>
          <div className="flex items-center gap-1">
            <button onClick={download} className="min-h-[40px] px-3 inline-flex items-center gap-1.5 rounded-full text-sm text-zinc-300 hover:bg-white/5 cursor-pointer">
              <Download size={15} /> <span className="hidden sm:inline">Download</span>
            </button>
            <button onClick={() => window.print()} className="min-h-[40px] px-3 inline-flex items-center gap-1.5 rounded-full text-sm text-zinc-300 hover:bg-white/5 cursor-pointer">
              <Printer size={15} /> <span className="hidden sm:inline">Print</span>
            </button>
            <button onClick={onClose} aria-label="Close" className="size-10 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        <article className="overflow-y-auto overscroll-contain px-5 sm:px-10 py-8 sm:py-10 text-[15px] leading-relaxed text-zinc-400">
          <header>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">George Moses Azuoru</h1>
            <p className="mt-1 text-zinc-300">Full-stack web engineer. Co-founder of Emberfig. Lagos, Nigeria.</p>
            <p className="mt-4 text-sm flex flex-wrap gap-x-4 gap-y-1">
              <a className={link} href="mailto:azuorugeorge@gmail.com">azuorugeorge@gmail.com</a>
              <a className={link} href="mailto:hello@emberfig.com">hello@emberfig.com</a>
              <a className={link} href="https://github.com/PlayzAe" target="_blank" rel="noopener noreferrer">github.com/PlayzAe</a>
              <a className={link} href="https://emberfig.com" target="_blank" rel="noopener noreferrer">emberfig.com</a>
            </p>
          </header>

          <p className="mt-8">
            I build web apps, mostly in React and TypeScript with Node or ASP.NET Core behind them. I co-run Emberfig, a two-person studio, with Adeboye Oluwatimileyin. Outside the studio I maintain a few open-source projects and run a subscription platform of my own.
          </p>

          <h2 className="mt-10 mb-4 text-sm font-medium text-zinc-500">Experience</h2>
          <div className="space-y-8">
            {EXPERIENCE.map((job) => (
              <section key={job.place}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-semibold text-white">
                    {job.href ? <a href={job.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{job.place}</a> : job.place}
                    <span className="font-normal text-zinc-400"> · {job.role}</span>
                  </h3>
                  <span className="text-sm text-zinc-500 tabular-nums">{job.when}</span>
                </div>
                <ul className="mt-2 space-y-1.5 list-disc pl-5 marker:text-zinc-700">
                  {job.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </section>
            ))}
          </div>

          <h2 className="mt-10 mb-4 text-sm font-medium text-zinc-500">Skills</h2>
          <dl className="divide-y divide-zinc-800 border-y border-zinc-800">
            {SKILLS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
                <dt className="text-zinc-500">{k}</dt>
                <dd className="text-zinc-300">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 mb-2 text-sm font-medium text-zinc-500">Education</h2>
          <p><span className="text-white">Elizade University</span>, Ilara-Mokin. B.Sc. Computer Science, 2026.</p>
        </article>
      </div>
    </div>
  );
}
