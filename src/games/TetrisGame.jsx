import React, { useEffect, useRef, useState, useCallback } from 'react';

// ── Tetris constants ──────────────────────────────────────────────
const COLS = 10;
const ROWS = 20;
const CELL = 28;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK_START = 600;
const TICK_MIN = 80;
const COLORS = [null,'#06b6d4','#f59e0b','#a855f7','#22c55e','#ef4444','#3b82f6','#f97316'];

const PIECES = [
  null,
  [[1,1,1,1]],                         // I
  [[2,2],[2,2]],                        // O
  [[0,3,0],[3,3,3]],                    // T
  [[4,0],[4,0],[4,4]],                  // L
  [[0,5],[0,5],[5,5]],                  // J
  [[0,6,6],[6,6,0]],                    // S
  [[7,7,0],[0,7,7]],                    // Z
];

function randomPiece() { return Math.floor(Math.random() * 7) + 1; }

function rotate(matrix) {
  return matrix[0].map((_, c) => matrix.map(row => row[c]).reverse());
}

function mkBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill(0)); }

function collides(board, piece, px, py) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (!piece[r][c]) continue;
      const nx = px + c, ny = py + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function place(board, piece, px, py, type) {
  const b = board.map(r => [...r]);
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (!piece[r][c]) continue;
      const ny = py + r, nx = px + c;
      if (ny >= 0) b[ny][nx] = type;
    }
  }
  return b;
}

function clearLines(board) {
  const kept = board.filter(row => row.some(c => c === 0));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(0));
  return { board: [...empty, ...kept], lines: cleared };
}

function mkState() {
  const type = randomPiece();
  const piece = PIECES[type];
  return {
    board: mkBoard(),
    piece,
    type,
    px: Math.floor((COLS - piece[0].length) / 2),
    py: -1,
    next: randomPiece(),
    score: 0,
    lines: 0,
    level: 1,
    over: false,
  };
}

export default function TetrisGame({ onExit }) {
  const canvasRef = useRef(null);
  const nextRef = useRef(null);
  const stateRef = useRef(mkState());
  const lastRef = useRef(0);
  const rafRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [over, setOver] = useState(false);

  const restart = useCallback(() => {
    stateRef.current = mkState();
    lastRef.current = 0;
    setScore(0); setLines(0); setLevel(1); setOver(false);
  }, []);

  const spawnNext = useCallback((board) => {
    const st = stateRef.current;
    const type = st.next;
    const piece = PIECES[type];
    const px = Math.floor((COLS - piece[0].length) / 2);
    const py = -1;
    if (collides(board, piece, px, py)) {
      st.over = true; setOver(true); return;
    }
    st.board = board;
    st.piece = piece; st.type = type;
    st.px = px; st.py = py;
    st.next = randomPiece();
  }, []);

  const moveLeft = useCallback(() => {
    const st = stateRef.current;
    if (!collides(st.board, st.piece, st.px - 1, st.py)) st.px--;
  }, []);

  const moveRight = useCallback(() => {
    const st = stateRef.current;
    if (!collides(st.board, st.piece, st.px + 1, st.py)) st.px++;
  }, []);

  const rotatePiece = useCallback(() => {
    const st = stateRef.current;
    const rotated = rotate(st.piece);
    if (!collides(st.board, rotated, st.px, st.py)) st.piece = rotated;
  }, []);

  const moveDown = useCallback(() => {
    const st = stateRef.current;
    if (!collides(st.board, st.piece, st.px, st.py + 1)) { st.py++; lastRef.current = performance.now(); }
  }, []);

  const hardDrop = useCallback(() => {
    const st = stateRef.current;
    let drop = st.py;
    while (!collides(st.board, st.piece, st.px, drop + 1)) drop++;
    const { board: nb, lines: cl } = clearLines(place(st.board, st.piece, st.px, drop, st.type));
    const pts = [0,100,300,500,800][cl] * st.level;
    st.score += pts; st.lines += cl; st.level = Math.floor(st.lines / 10) + 1;
    setScore(st.score); setLines(st.lines); setLevel(st.level);
    spawnNext(nb);
    lastRef.current = performance.now();
  }, [spawnNext]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') { e.preventDefault(); onExit(); return; }
      if (e.key === 'r' || e.key === 'R') { restart(); return; }

      const st = stateRef.current;
      if (st.over) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moveDown();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        rotatePiece();
      } else if (e.key === ' ') {
        e.preventDefault();
        hardDrop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit, restart, moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const nextCanvas = nextRef.current;
    if (!canvas || !nextCanvas) return;
    const ctx = canvas.getContext('2d');
    const nc = nextCanvas.getContext('2d');

    const draw = (ts) => {
      const st = stateRef.current;
      const tickMs = Math.max(TICK_MIN, TICK_START - (st.level - 1) * 55);

      if (!st.over && ts - lastRef.current > tickMs) {
        lastRef.current = ts;
        if (!collides(st.board, st.piece, st.px, st.py + 1)) {
          st.py++;
        } else {
          const { board: nb, lines: cl } = clearLines(place(st.board, st.piece, st.px, st.py, st.type));
          const pts = [0,100,300,500,800][cl] * st.level;
          st.score += pts; st.lines += cl; st.level = Math.floor(st.lines / 10) + 1;
          setScore(st.score); setLines(st.lines); setLevel(st.level);
          spawnNext(nb);
        }
      }

      // Draw board
      ctx.fillStyle = '#0a0a0b';
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
      for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }

      // Ghost piece
      let ghostY = st.py;
      while (!collides(st.board, st.piece, st.px, ghostY + 1)) ghostY++;
      if (ghostY !== st.py) {
        for (let r = 0; r < st.piece.length; r++) {
          for (let c = 0; c < st.piece[r].length; c++) {
            if (!st.piece[r][c]) continue;
            ctx.fillStyle = `${COLORS[st.type]}22`;
            ctx.strokeStyle = `${COLORS[st.type]}55`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect((st.px+c)*CELL+1,(ghostY+r)*CELL+1,CELL-2,CELL-2,3);
            else ctx.rect((st.px+c)*CELL+1,(ghostY+r)*CELL+1,CELL-2,CELL-2);
            ctx.fill(); ctx.stroke();
          }
        }
      }

      // Placed blocks
      st.board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell) return;
          ctx.fillStyle = COLORS[cell];
          ctx.shadowColor = COLORS[cell];
          ctx.shadowBlur = 4;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(c*CELL+1, r*CELL+1, CELL-2, CELL-2, 3);
          else ctx.rect(c*CELL+1, r*CELL+1, CELL-2, CELL-2);
          ctx.fill();
          ctx.shadowBlur = 0;
          // Highlight top-left edge
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(c*CELL+2, r*CELL+2, CELL-4, 3);
        });
      });

      // Active piece
      st.piece.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell) return;
          const nx = (st.px + c) * CELL, ny = (st.py + r) * CELL;
          if (ny < 0) return;
          ctx.fillStyle = COLORS[st.type];
          ctx.shadowColor = COLORS[st.type];
          ctx.shadowBlur = 8;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(nx+1, ny+1, CELL-2, CELL-2, 3);
          else ctx.rect(nx+1, ny+1, CELL-2, CELL-2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(nx+2, ny+2, CELL-4, 3);
        });
      });

      // Next piece preview
      const np = PIECES[st.next];
      nc.fillStyle = '#0a0a0b';
      nc.fillRect(0, 0, 4*CELL, 4*CELL);
      const offX = Math.floor((4 - np[0].length) / 2);
      const offY = Math.floor((4 - np.length) / 2);
      np.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell) return;
          nc.fillStyle = COLORS[st.next];
          nc.shadowColor = COLORS[st.next];
          nc.shadowBlur = 6;
          nc.beginPath();
          if (nc.roundRect) nc.roundRect((offX+c)*CELL+1,(offY+r)*CELL+1,CELL-2,CELL-2,3);
          else nc.rect((offX+c)*CELL+1,(offY+r)*CELL+1,CELL-2,CELL-2);
          nc.fill();
          nc.shadowBlur = 0;
        });
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [over, spawnNext]);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-full select-none">
      <div className="flex gap-2 sm:gap-4 items-start justify-center w-full">
        {/* Board */}
        <div className="relative flex-shrink-0" style={{ width: 'min(240px, 58vw)' }}>
          <canvas ref={canvasRef} width={W} height={H}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            className="rounded-lg border border-white/10" />
          {over && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-lg p-3">
              <p className="font-mono text-white text-xl sm:text-2xl font-bold">game over</p>
              <p className="font-mono text-gray-400 text-xs sm:text-sm mt-1">score: {score}</p>
              <div className="flex gap-2 sm:gap-3 mt-4">
                <button onClick={restart} className="px-4 py-2 rounded-full bg-white text-black text-xs font-mono font-semibold hover:bg-neutral-200 transition-colors active:scale-95">restart</button>
                <button onClick={onExit} className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-mono hover:bg-white/20 transition-colors active:scale-95">exit</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-2 sm:gap-4 pt-1" style={{ width: 'min(90px, 28vw)' }}>
          <div>
            <p className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">next</p>
            <canvas ref={nextRef} width={4*CELL} height={4*CELL}
              style={{ width: '100%', maxWidth: 4*CELL, height: 'auto' }}
              className="rounded border border-white/10" />
          </div>
          <div className="space-y-1.5 sm:space-y-3">
            {[['score', score], ['lines', lines], ['level', level]].map(([k, v]) => (
              <div key={k}>
                <p className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest">{k}</p>
                <p className="font-mono text-white text-sm sm:text-lg font-bold">{v}</p>
              </div>
            ))}
          </div>
          <button onClick={restart} className="text-[10px] font-mono text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 active:bg-white/10 text-center">
            Restart [R]
          </button>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 mt-1 w-full max-w-xs">
        <button onClick={moveLeft} className="flex-1 h-10 bg-white/10 active:bg-white/20 rounded-lg text-white font-mono text-base border border-white/10 flex items-center justify-center" aria-label="Left">◀</button>
        <button onClick={rotatePiece} className="flex-1 h-10 bg-white/10 active:bg-white/20 rounded-lg text-white font-mono text-base border border-white/10 flex items-center justify-center" aria-label="Rotate">↻</button>
        <button onClick={moveRight} className="flex-1 h-10 bg-white/10 active:bg-white/20 rounded-lg text-white font-mono text-base border border-white/10 flex items-center justify-center" aria-label="Right">▶</button>
        <button onClick={moveDown} className="flex-1 h-10 bg-white/10 active:bg-white/20 rounded-lg text-white font-mono text-base border border-white/10 flex items-center justify-center" aria-label="Down">▼</button>
        <button onClick={hardDrop} className="flex-1 h-10 bg-emerald-500/20 active:bg-emerald-500/40 text-emerald-300 font-mono text-xs rounded-lg border border-emerald-500/30 flex items-center justify-center" aria-label="Drop">Drop</button>
      </div>
    </div>
  );
}
