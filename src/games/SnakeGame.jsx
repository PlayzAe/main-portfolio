import React, { useEffect, useRef, useState, useCallback } from 'react';

const CELL = 20;
const COLS = 28;
const ROWS = 18;
const W = CELL * COLS;
const H = CELL * ROWS;

const DIRS = {
  ArrowUp:    { x: 0, y: -1 }, ArrowDown:  { x: 0, y:  1 },
  ArrowLeft:  { x: -1, y: 0 }, ArrowRight: { x: 1,  y: 0 },
  w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
  s: { x: 0, y:  1 }, S: { x: 0, y:  1 },
  a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
  d: { x: 1,  y: 0 }, D: { x: 1,  y: 0 },
};

function randFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function mkState() {
  const snake = [{ x: 14, y: 9 }, { x: 13, y: 9 }, { x: 12, y: 9 }];
  return { snake, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: randFood(snake), score: 0, dead: false, speed: 140 };
}

export default function SnakeGame({ onExit }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(mkState());
  const lastTickRef = useRef(0);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);

  const restart = useCallback(() => {
    stateRef.current = mkState();
    lastTickRef.current = 0;
    setScore(0);
    setDead(false);
  }, []);

  const setDirection = useCallback((d) => {
    if (!d) return;
    const st = stateRef.current;
    if (d.x === -st.dir.x && d.y === -st.dir.y) return;
    st.nextDir = d;
  }, []);

  const touchStartRef = useRef(null);
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? DIRS.ArrowRight : DIRS.ArrowLeft);
    } else {
      setDirection(dy > 0 ? DIRS.ArrowDown : DIRS.ArrowUp);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); onExit(); return; }
      if (e.key === 'r' || e.key === 'R') { restart(); return; }
      const d = DIRS[e.key];
      if (!d) return;
      e.preventDefault();
      setDirection(d);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit, restart, setDirection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = (ts) => {
      const st = stateRef.current;
      if (!st.dead && ts - lastTickRef.current > st.speed) {
        lastTickRef.current = ts;
        st.dir = st.nextDir;
        const head = { x: st.snake[0].x + st.dir.x, y: st.snake[0].y + st.dir.y };
        const died = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
                     st.snake.some(s => s.x === head.x && s.y === head.y);
        if (died) { st.dead = true; setDead(true); }
        else {
          st.snake.unshift(head);
          if (head.x === st.food.x && head.y === st.food.y) {
            st.score++; st.speed = Math.max(55, st.speed - 4); st.food = randFood(st.snake); setScore(st.score);
          } else st.snake.pop();
        }
      }

      // Background
      ctx.fillStyle = '#0a0a0b';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
      for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }

      // Food
      const fx = stateRef.current.food.x * CELL + CELL / 2;
      const fy = stateRef.current.food.y * CELL + CELL / 2;
      const r = 4 + Math.sin(ts / 280) * 1.5;
      ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2);
      ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 14;
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      stateRef.current.snake.forEach((seg, i) => {
        const alpha = Math.max(0.3, 1 - (i / Math.max(stateRef.current.snake.length, 1)) * 0.7);
        const pad = i === 0 ? 1 : 2;
        ctx.fillStyle = `rgba(52,211,153,${alpha})`;
        if (i === 0) { ctx.shadowColor = '#34d399'; ctx.shadowBlur = 10; }
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(seg.x*CELL+pad, seg.y*CELL+pad, CELL-pad*2, CELL-pad*2, 5);
        else ctx.rect(seg.x*CELL+pad, seg.y*CELL+pad, CELL-pad*2, CELL-pad*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dead]);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-full select-none">
      <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono px-1">
        <span className="text-gray-400 hidden xs:inline">Swipe or D-Pad to move</span>
        <span className="text-emerald-400 font-semibold">score: {score}</span>
        <button onClick={restart} className="text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/5 active:bg-white/10">Restart [R]</button>
      </div>
      <div 
        className="relative w-full overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} width={W} height={H}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          className="rounded-lg border border-white/10" />
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-lg p-4">
            <p className="font-mono text-white text-xl sm:text-2xl font-bold tracking-tight">game over</p>
            <p className="font-mono text-gray-400 text-xs sm:text-sm mt-1">score: {score}</p>
            <div className="flex gap-2 sm:gap-3 mt-4">
              <button onClick={restart} className="px-4 sm:px-5 py-2 rounded-full bg-white text-black text-xs font-mono font-semibold hover:bg-neutral-200 transition-colors active:scale-95">restart</button>
              <button onClick={onExit} className="px-4 sm:px-5 py-2 rounded-full bg-white/10 text-white text-xs font-mono hover:bg-white/20 transition-colors active:scale-95">exit</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad */}
      <div className="flex flex-col items-center gap-1 sm:hidden mt-1">
        <button
          onClick={() => setDirection(DIRS.ArrowUp)}
          className="w-12 h-9 rounded-lg bg-white/10 active:bg-emerald-500/40 text-white flex items-center justify-center font-mono text-sm border border-white/10 shadow-sm"
          aria-label="Move Up"
        >
          ▲
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setDirection(DIRS.ArrowLeft)}
            className="w-12 h-9 rounded-lg bg-white/10 active:bg-emerald-500/40 text-white flex items-center justify-center font-mono text-sm border border-white/10 shadow-sm"
            aria-label="Move Left"
          >
            ◀
          </button>
          <button
            onClick={() => setDirection(DIRS.ArrowDown)}
            className="w-12 h-9 rounded-lg bg-white/10 active:bg-emerald-500/40 text-white flex items-center justify-center font-mono text-sm border border-white/10 shadow-sm"
            aria-label="Move Down"
          >
            ▼
          </button>
          <button
            onClick={() => setDirection(DIRS.ArrowRight)}
            className="w-12 h-9 rounded-lg bg-white/10 active:bg-emerald-500/40 text-white flex items-center justify-center font-mono text-sm border border-white/10 shadow-sm"
            aria-label="Move Right"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
