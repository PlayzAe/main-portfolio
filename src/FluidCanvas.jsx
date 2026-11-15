import React, { useEffect, useRef } from 'react';

/**
 * Ultra-stable, high-performance WebGL2 fluid ribbon shader.
 * Uses trigonometric domain warping with circular harmonics for guaranteed seamless looping.
 * Robust on all GPUs (no float overflow / NaN artifacts).
 * Deep obsidian black (#09090b) base with blue, violet and coral ribbons.
 */

const VERTEX_SHADER_SOURCE = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_duration;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_speed;
uniform int u_preset;

#define TAU 6.28318530718

// 2D Rotation
mat2 rot2D(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

// Stable harmonic domain warp that loops perfectly over u_duration
float ribbonField(vec2 p, float angle, vec2 mouse) {
  p += (mouse - 0.5) * 0.15;
  
  // Diagonal orientation for cinematic flow
  p = rot2D(0.42) * p;
  
  float t1 = angle;
  float t2 = angle * 2.0;
  
  // Layer 1: broad primary swell
  vec2 w1 = vec2(
    sin(p.y * 1.8 + cos(t1) * 1.2),
    cos(p.x * 1.5 + sin(t1) * 1.2)
  );
  
  // Layer 2: secondary viscous fold
  vec2 p2 = p + w1 * 0.55;
  vec2 w2 = vec2(
    sin(p2.x * 2.4 - sin(t2) * 0.8),
    cos(p2.y * 2.2 + cos(t2) * 0.8)
  );
  
  // Layer 3: fine fluid crests
  vec2 p3 = p2 + w2 * 0.4;
  float ribbon1 = sin(p3.x * 3.2 + p3.y * 2.0 + sin(t1));
  float ribbon2 = cos(p3.y * 4.0 - p3.x * 1.5 + cos(t1));
  
  float v = (ribbon1 * 0.6 + ribbon2 * 0.4);
  return clamp(v * 0.5 + 0.5, 0.0, 1.0);
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;

  // Seamless circular phase
  float progress = fract(u_time * u_speed / u_duration);
  float angle = progress * TAU;

  // Multi-sample for smooth normals
  float eps = 0.005;
  float h = ribbonField(p, angle, u_mouse);
  float hX = ribbonField(p + vec2(eps, 0.0), angle, u_mouse);
  float hY = ribbonField(p + vec2(0.0, eps), angle, u_mouse);

  vec2 grad = vec2(hX - h, hY - h) / eps;
  vec3 normal = normalize(vec3(-grad * 1.8, 1.0));

  // Light setup
  vec3 lightDir = normalize(vec3(0.6, 0.7, 0.75));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);

  float diff = max(dot(normal, lightDir), 0.0);
  float spec = pow(max(dot(normal, halfDir), 0.0), 28.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  // Palette:
  // Deep obsidian base (matches website #09090b)
  vec3 colBase   = vec3(0.035, 0.035, 0.043);
  // Rich burnt copper
  vec3 colCopper = vec3(0.16, 0.27, 0.58);
  // Violet crest, coral speculars: colors pulled from the app logos, not a single brand tint
  vec3 colGold   = vec3(0.50, 0.30, 0.72);
  // Bright highlight
  vec3 colHighlight = vec3(0.98, 0.55, 0.42);

  // Crest mask — only show ribbons along dramatic contours
  float crest = smoothstep(0.40, 0.85, h);
  float core = smoothstep(0.65, 0.95, h);

  // Ribbon color mixing
  vec3 ribbon = mix(colCopper, colGold, crest);
  ribbon = mix(ribbon, colHighlight, core * 0.6);

  // Lighting on ribbons
  vec3 litRibbon = ribbon * (diff * 0.8 + 0.35) + colHighlight * (spec * 0.95) + colGold * (fresnel * 0.4);

  // Final blend with deep obsidian base
  float blendMask = smoothstep(0.32, 0.75, h) * u_intensity;
  
  // Keep right-hand focal warmth like George's original SceneAI video
  float spatialBias = smoothstep(-0.6, 0.8, p.x + p.y * 0.5);
  blendMask *= (0.35 + 0.65 * spatialBias);

  vec3 finalColor = mix(colBase, litRibbon, blendMask);

  // Dark vignette around edges so text stays ultra-readable
  float vig = 1.0 - length((uv - 0.5) * 1.3);
  vig = smoothstep(0.0, 1.0, vig);
  finalColor = mix(colBase, finalColor, vig);

  // Preset tuning
  if (u_preset == 1) {
    finalColor = mix(colBase, finalColor, 0.5);
  } else if (u_preset == 2) {
    finalColor = mix(colBase, finalColor, 0.25);
  }

  fragColor = vec4(finalColor, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vert, frag) {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export default function FluidCanvas({
  className = 'absolute inset-0 w-full h-full pointer-events-none',
  style,
  preset = 'hero',
  speed = 0.6,
  duration = 16.0,
  intensity = 0.9,
  interactive = true,
  maxDpr = 2.0,
  ariaHidden = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    gl.useProgram(program);

    // Full screen triangle
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uDurLoc = gl.getUniformLocation(program, 'u_duration');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity');
    const uSpeedLoc = gl.getUniformLocation(program, 'u_speed');
    const uPresetLoc = gl.getUniformLocation(program, 'u_preset');

    let presetInt = preset === 'card' ? 1 : preset === 'subtle' ? 2 : 0;

    gl.uniform1f(uDurLoc, duration);
    gl.uniform1f(uIntensityLoc, intensity);
    gl.uniform1f(uSpeedLoc, speed);
    gl.uniform1i(uPresetLoc, presetInt);

    let targetMouse = { x: 0.5, y: 0.5 };
    let curMouse = { x: 0.5, y: 0.5 };

    const handlePointerMove = (e) => {
      if (!interactive || !isVisible) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouse.x = Math.max(0.0, Math.min(1.0, (e.clientX - rect.left) / rect.width));
        targetMouse.y = Math.max(0.0, Math.min(1.0, 1.0 - (e.clientY - rect.top) / rect.height));
      }
    };

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const nw = Math.max(1, Math.floor(rect.width * dpr));
      const nh = Math.max(1, Math.floor(rect.height * dpr));

      if (w !== nw || h !== nh) {
        w = nw;
        h = nh;
        canvas.width = nw;
        canvas.height = nh;
        gl.viewport(0, 0, nw, nh);
        gl.useProgram(program);
        gl.uniform2f(uResLoc, nw, nh);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let rafId = null;
    let startTime = performance.now();
    let isVisible = true;

    const render = () => {
      if (!isVisible || document.hidden) {
        rafId = null;
        return;
      }

      curMouse.x += (targetMouse.x - curMouse.x) * 0.05;
      curMouse.y += (targetMouse.y - curMouse.y) * 0.05;

      const elapsed = (performance.now() - startTime) / 1000.0;

      gl.useProgram(program);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, curMouse.x, curMouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible && !rafId) {
          rafId = requestAnimationFrame(render);
        }
      }, { threshold: 0 });
      observer.observe(canvas);
    }

    const handleVis = () => {
      if (!document.hidden && isVisible && !rafId) {
        rafId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVis);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', resize);
      if (interactive) window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVis);
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [preset, speed, duration, intensity, interactive, maxDpr]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', ...style }}
      aria-hidden={ariaHidden}
    />
  );
}
