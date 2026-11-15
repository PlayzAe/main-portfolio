/**
 * Terminal.jsx
 * A plain shell. Type a command, get text back. Games open in a fullscreen layer.
 */
import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';

const SnakeGame = lazy(() => import('./games/SnakeGame'));
const MatrixGame = lazy(() => import('./games/MatrixGame'));
const TetrisGame = lazy(() => import('./games/TetrisGame'));

const PROMPT = 'george@emberfig';

const LINKS = {
  arena: 'https://github.com/PlayzAe/arena.ai-desktop',
  quilore: 'https://quilore.com',
  longplay: 'https://github.com/PlayzAe/Spotify-tracker',
  studypomo: 'https://play.google.com/store/apps/details?id=com.everythingabuad.studypomo',
  ponderanda: 'https://ponderanda.com',
  herewise: 'https://github.com/PlayzAe/herewise',
  playzanime: 'https://playz.vmny.lol',
  zykof: 'https://zykof.best',
  emberfig: 'https://emberfig.com',
  github: 'https://github.com/playzae',
};

const HELP = [
  ['about', 'who I am'],
  ['projects', 'what I have shipped'],
  ['stack', 'tools I use daily'],
  ['open <name>', 'open a project, e.g. open arena'],
  ['contact', 'how to reach me'],
  ['cv', 'open my CV'],
  ['snake | tetris | matrix', 'games'],
  ['clear', 'clear the screen'],
];

const PROJECTS = [
  ['arena', 'arena.ai-desktop', 'desktop client for arena.ai, 15 stars'],
  ['quilore', 'Quilore', 'Spotify export stats, parsed in the browser'],
  ['longplay', 'Longplay', 'open-source engine behind Quilore'],
  ['studypomo', 'StudyPomo', 'Android focus timer (Emberfig)'],
  ['ponderanda', 'Ponderanda', 'daily arithmetic ladder (Emberfig)'],
  ['herewise', 'Herewise', 'offline fingerprint attendance (Emberfig)'],
  ['playzanime', 'PlayzAnime', 'anime and manga client (personal)'],
  ['zykof', 'Zykof', 'key platform, dashboard, admin (personal)'],
];

/** Pure command parser. Returns lines to print, or an action. Exported for tests. */
export function runCommand(raw) {
  const input = String(raw ?? '').trim();
  if (!input) return { lines: [] };
  const [cmd, ...args] = input.replace(/^\$/, '').toLowerCase().split(/\s+/);

  switch (cmd) {
    case 'help':
      return { lines: HELP.map(([c, d]) => ({ cmd: c.split(' ')[0], label: c, desc: d })) };
    case 'about':
    case 'whoami':
      return {
        lines: [
          'George Moses Azuoru, @playzae. Lagos.',
          'Full-stack web engineer. Co-founded Emberfig with Adeboye Oluwatimileyin.',
          'Mostly React, TypeScript and Node. Some Android, some C++ for fun.',
        ],
      };
    case 'projects':
    case 'ls':
      return { lines: PROJECTS.map(([key, name, d]) => ({ cmd: `open ${key}`, label: name, desc: d })) };
    case 'stack':
      return {
        lines: [
          'web       React 19, TypeScript, Next.js, Vite, Tailwind',
          'server    Node.js, ASP.NET Core, PostgreSQL, SQL Server',
          'desktop   Python, Flask, Edge WebView2, Electron',
          'mobile    Kotlin, Flutter, Android foreground services',
          'low-level C++, x64dbg, IDA',
        ],
      };
    case 'open': {
      const key = args[0];
      if (!key || !LINKS[key]) return { lines: [`open: unknown project "${key ?? ''}". try projects`] };
      return { lines: [`opening ${LINKS[key]}`], open: LINKS[key] };
    }
    case 'contact':
      return { lines: [{ href: 'mailto:hello@emberfig.com', text: 'hello@emberfig.com' }, { href: LINKS.github, text: 'github.com/playzae' }] };
    case 'cv':
      return { lines: ['opening CV...'], action: 'cv' };
    case 'snake':
    case 'tetris':
    case 'matrix':
      return { lines: [`starting ${cmd}. esc to quit.`], game: cmd };
    case 'clear':
      return { clear: true, lines: [] };
    case 'sudo':
      return { lines: ['nice try.'] };
    default:
      return { lines: [`${cmd}: command not found. type help`] };
  }
}

const WELCOME = [
  'Type help to see commands. Click any command below to run it.',
];

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let uid = 0;
const toLines = (lines, startDelay = 0) =>
  lines.map((l, i) => ({ id: ++uid, kind: 'out', delay: startDelay + i * 28, ...(typeof l === 'string' ? { text: l } : l) }));

function Busy() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % FRAMES.length), 70);
    return () => clearInterval(t);
  }, []);
  return <div className="text-zinc-500">{FRAMES[i]}</div>;
}

export default function Terminal({ onOpenCV }) {
  // Boots when it scrolls into view: short spinner, then the welcome and help lines cascade in.
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(true);
  const booted = useRef(false);
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setHistory([...toLines(WELCOME), ...toLines(runCommand('help').lines, 60)]);
      setBusy(false);
      return;
    }
    let t;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || booted.current) return;
      booted.current = true;
      t = setTimeout(() => {
        setBusy(false);
        setHistory([...toLines(WELCOME), ...toLines(runCommand('help').lines, 60)]);
      }, 450);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  const [value, setValue] = useState('');
  const [game, setGame] = useState(null);
  const past = useRef([]);
  const pastIndex = useRef(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body?.scrollTo) body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
  }, [history, busy]);

  const exec = useCallback(
    (raw) => {
      const res = runCommand(raw);
      past.current = [raw, ...past.current].slice(0, 50);
      pastIndex.current = -1;
      if (res.clear) {
        setHistory([]);
        return;
      }
      // Popup blockers need window.open inside the click/keypress, so open before the fake delay.
      if (res.open) window.open(res.open, '_blank', 'noopener,noreferrer');
      setHistory((h) => [...h, { id: ++uid, kind: 'in', text: raw }]);
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setHistory((h) => [...h, ...toLines(res.lines)]);
        if (res.action === 'cv') onOpenCV?.();
        if (res.game) setGame(res.game);
      }, 160 + Math.min(res.lines.length, 8) * 20);
    },
    [onOpenCV]
  );

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) exec(value);
      setValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(pastIndex.current + 1, past.current.length - 1);
      if (i >= 0) {
        pastIndex.current = i;
        setValue(past.current[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = pastIndex.current - 1;
      pastIndex.current = Math.max(i, -1);
      setValue(i >= 0 ? past.current[i] : '');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const exitGame = useCallback(() => setGame(null), []);

  return (
    <div
      ref={rootRef}
      className="font-mono text-[12.5px] sm:text-[13px] leading-[1.6] text-zinc-300 bg-[#0a0a0a]"
      onMouseUp={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.06] bg-white/[0.02] text-[11px] text-zinc-500 select-none">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
        </span>
        <span className="font-sans text-zinc-400">{PROMPT} — ~</span>
        <span className="w-[42px] text-right">zsh</span>
      </div>

      <div
        ref={bodyRef}
        className="h-[340px] sm:h-[380px] overflow-y-auto overscroll-contain px-4 py-3"
        aria-live="polite"
      >
        {history.map((line, i) =>
          line.kind === 'in' ? (
            <div key={line.id ?? i} style={{ animationDelay: `${line.delay ?? 0}ms` }} className="animate-[lineIn_.32s_cubic-bezier(.2,.8,.2,1)_both] whitespace-pre-wrap break-words">
              <span className="text-emerald-400">{PROMPT}</span>
              <span className="text-zinc-600">:~$ </span>
              <span className="text-white">{line.text}</span>
            </div>
          ) : line.href ? (
            <div key={i}>
              <a href={line.href} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline decoration-sky-300/30 underline-offset-2 hover:decoration-sky-300">
                {line.text}
              </a>
            </div>
          ) : line.cmd ? (
            <div key={line.id ?? i} style={{ animationDelay: `${line.delay ?? 0}ms` }} className="animate-[lineIn_.32s_cubic-bezier(.2,.8,.2,1)_both] whitespace-pre-wrap break-words">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  exec(line.cmd);
                }}
                className="block w-full text-left hover:bg-white/[0.03] cursor-pointer"
              >
                <span className="grid grid-cols-[8.5rem_minmax(0,1fr)] sm:grid-cols-[13rem_minmax(0,1fr)] gap-x-3">
                  <span className="text-white underline decoration-zinc-600 underline-offset-2">{line.label}</span>
                  <span className="text-zinc-400">{line.desc}</span>
                </span>
              </button>
            </div>
          ) : (
            <div key={line.id ?? i} style={{ animationDelay: `${line.delay ?? 0}ms` }} className="animate-[lineIn_.32s_cubic-bezier(.2,.8,.2,1)_both] whitespace-pre-wrap break-words">{line.text}</div>
          )
        )}

        {busy && <Busy />}
        <label className={`flex items-baseline transition-opacity duration-200 ${busy ? 'opacity-0' : 'opacity-100'}`}>
          <span className="text-emerald-400 shrink-0">{PROMPT}</span>
          <span className="text-zinc-600 shrink-0">:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="help"
            aria-label="Terminal command"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            className="flex-1 min-w-0 bg-transparent text-white outline-none placeholder:text-zinc-700 caret-emerald-400 text-[16px] sm:text-[13px]"
          />
        </label>
      </div>

      {game &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" role="dialog" aria-label={`${game} game`}>
            <div className="flex items-center justify-between px-4 h-12 border-b border-zinc-800 font-mono text-xs text-zinc-400">
              <span>{game}</span>
              <button onClick={exitGame} className="min-h-[44px] px-3 text-zinc-300 hover:text-white cursor-pointer">
                esc / close
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <Suspense fallback={<div className="text-xs text-zinc-500 font-mono">loading...</div>}>
                {game === 'snake' && <SnakeGame onExit={exitGame} />}
                {game === 'matrix' && <MatrixGame onExit={exitGame} />}
                {game === 'tetris' && <TetrisGame onExit={exitGame} />}
              </Suspense>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
