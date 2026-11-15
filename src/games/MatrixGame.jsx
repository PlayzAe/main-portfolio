import React, { useEffect, useRef } from 'react';

export default function MatrixGame({ onExit }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use a slightly larger internal resolution for crispness, then scale via CSS
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}|:"<>?~`=[]\\;\',./';
    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = [];

    // Initialize drops at random heights
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * 100;
    }

    let animationFrameId;
    let lastDraw = 0;

    const draw = (time) => {
      // Throttle to ~30fps
      if (time - lastDraw > 33) {
        lastDraw = time;

        // Fading effect
        ctx.fillStyle = 'rgba(10, 10, 11, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#34d399'; // Emerald 400
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          
          // Draw character
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          // Reset drop to top randomly after it passes the bottom
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      const newCols = Math.ceil(canvas.width / fontSize);
      while(drops.length < newCols) drops.push(Math.random() * 100);
    };

    window.addEventListener('resize', handleResize);

    const onKey = (e) => {
      if ((e.ctrlKey && e.key === 'c') || e.key === 'Escape') {
        e.preventDefault();
        onExit?.();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKey);
    };
  }, [onExit]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0b] flex items-center justify-center">
       <canvas ref={canvasRef} className="block w-full h-full" />
       
       <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-center text-[10px] sm:text-[11px] font-mono select-none pointer-events-none">
          <span className="text-gray-400 bg-black/60 px-2 py-1 rounded border border-white/10">matrix.bin streaming</span>
          <span className="text-gray-500 bg-black/60 px-2 py-1 rounded border border-white/10 hidden xs:inline">esc / ctrl+c to exit</span>
       </div>
    </div>
  );
}
