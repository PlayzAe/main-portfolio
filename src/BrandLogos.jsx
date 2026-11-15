import React from 'react';

// Official Spotify Logo (Green circular badge with 3 curved sound bars)
export const SpotifyLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="12" fill="#1ED760" />
    <path
      d="M17.5 16.3c-.2.3-.5.4-.8.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.7-.8 6.9-.5 9.6 1.1.2.2.3.5.2.8zm1.2-2.7c-.3.4-.8.5-1.2.3-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.5-1.1 7.9-.5 10.9 1.3.4.1.5.7.4 1.1zm.1-2.8C15.7 9 9.3 8.8 5.6 9.9c-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 4.3-1.3 11.3-1 14.8 1.1.5.3.7 1 .4 1.5-.3.5-1 .7-1.4.4z"
      fill="#000000"
    />
  </svg>
);

// Official GitHub Logo (Octocat silhouette)
export const GitHubLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

// Official Android Bugdroid / Robot Head Logo
export const AndroidLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="#3DDC84" className={className}>
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 6.01 6 8h12c0-1.99-.97-3.75-2.47-4.84zM10 5.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm4 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" />
  </svg>
);

// Official React Atom Logo
export const ReactLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" className={className}>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

// Official TypeScript Logo (Blue badge with TS)
export const TypeScriptLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="4" fill="#3178C6" />
    <path
      d="M11.5 14.8c-.3.4-.7.6-1.2.8-.5.1-1.1.2-1.7.2-.9 0-1.7-.2-2.3-.5-.6-.4-1.1-.9-1.4-1.6-.3-.7-.5-1.5-.5-2.5 0-1 .2-1.8.5-2.5.3-.7.8-1.2 1.4-1.6.6-.4 1.4-.5 2.3-.5.6 0 1.2.1 1.7.2.5.2.9.4 1.2.8l-1 1.5c-.3-.3-.6-.5-.9-.6-.3-.1-.7-.2-1.1-.2-.6 0-1.1.2-1.5.5-.4.3-.6.8-.8 1.4-.1.6-.2 1.2-.2 2 0 .8.1 1.4.2 2 .2.6.5 1.1.8 1.4.4.3.9.5 1.5.5.4 0 .8-.1 1.1-.2.3-.1.6-.3.9-.6l1 1.4zm3.8-6.6h2.2v9h-2.2v-9zm-2.2 0h6.6v1.8h-6.6V8.2z"
      fill="#FFFFFF"
    />
  </svg>
);

// Official Next.js Monogram Logo
export const NextjsLogo = ({ className = 'w-5 h-5' }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const paint0 = `next_paint0_${uid}`;
  const paint1 = `next_paint1_${uid}`;
  return (
    <svg viewBox="0 0 180 180" fill="none" className={className}>
      <circle cx="90" cy="90" r="90" fill="#000000" />
      <path
        d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l72.671 93.923a90.548 90.548 0 0010.723-5.787z"
        fill={`url(#${paint0})`}
      />
      <path d="M115.251 54H126v72h-10.749V54z" fill={`url(#${paint1})`} />
      <defs>
        <linearGradient id={paint0} x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={paint1} x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Real PlayzAnime Logo (from playz_anime_app/build/logo.svg)
// Vermillion rounded-rect with broken-border animation frame and play-button lettermark
export const PlayzAnimeLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <rect x="2" y="2" width="60" height="60" rx="9" fill="#f0532c"/>
    <path d="M40 8.5H51A4.5 4.5 0 0 1 55.5 13V44" fill="none" stroke="#f6efe4" strokeWidth="2.4"/>
    <path d="M55.5 49V51A4.5 4.5 0 0 1 51 55.5H22" fill="none" stroke="#f6efe4" strokeWidth="2.4"/>
    <path d="M16 55.5H13A4.5 4.5 0 0 1 8.5 51V13A4.5 4.5 0 0 1 13 8.5H35" fill="none" stroke="#f6efe4" strokeWidth="2.4"/>
    <path d="M17 14H35A12.5 12.5 0 0 1 35 39H27V48L17 51ZM27 20.5V32.5L38.5 26.5Z" fill="#f6efe4" fillRule="evenodd"/>
  </svg>
);

// Real Emberfig Logo (from emberfig.com/favicon.svg)
// Two interlocking L-shaped blocks in burnt sienna
export const EmberfigLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Emberfig">
    <path d="M9,0 H34 V40.5 H43 V95.5 H9 A9,9 0 0 1 0,86.5 V9 A9,9 0 0 1 9,0 Z" fill="#84432D"/>
    <path d="M43,4.5 H91 A9,9 0 0 1 100,13.5 V91 A9,9 0 0 1 91,100 H52 V49.5 H43 Z" fill="#84432D"/>
  </svg>
);

// Real Arena.ai Logo (from arena.ai-cli/assets/logo.svg)
// 5 vertical signal bars in a colosseum pattern with green accent
export const ArenaLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 512 512" className={className}>
    <rect width="512" height="512" rx="96" fill="#1a1f1e"/>
    <g transform="translate(256, 180)">
      <rect x="-100" y="-60" width="24" height="110" rx="5" fill="#F4F0EB"/>
      <rect x="-52"  y="-100" width="24" height="150" rx="5" fill="#F4F0EB"/>
      <rect x="-12"  y="-130" width="24" height="180" rx="5" fill="#F4F0EB"/>
      <rect x="28"   y="-100" width="24" height="150" rx="5" fill="#F4F0EB"/>
      <rect x="76"   y="-60" width="24" height="110" rx="5" fill="#F4F0EB"/>
      <line x1="-110" y1="55" x2="110" y2="55" stroke="#F4F0EB" strokeWidth="6" strokeLinecap="round"/>
    </g>
    <rect x="244" y="310" width="14" height="14" rx="2" fill="#34d399"/>
  </svg>
);

// Flutter Logo (kept for general use, not for PlayzAnime)
export const FlutterLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M14.314 0L2.3 12 6 15.7 21.686 0h-7.372z" fill="#02569B" />
    <path d="M14.286 11.429L8.571 17.143 14.286 22.857h7.428l-5.714-5.714 5.714-5.714h-7.428z" fill="#0175C2" />
    <path d="M11.429 14.286l2.857 2.857-2.857 2.857-2.858-2.857 2.858-2.857z" fill="#29B6F6" />
  </svg>
);

export const NetCoreLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="10" fill="#512BD4" />
    <path d="M7 16V8l5 8V8m2 0v8h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CppLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="10" fill="#00599C" />
    <path d="M14 9a4 4 0 100 6m3-3h2m-1-1v2m3-1h2m-1-1v2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const UnrealLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="#0E1112" />
    <path d="M8 8v5a4 4 0 008 0V8h-2v5a2 2 0 01-4 0V8H8z" fill="#fff" />
  </svg>
);

export const UnityLogo = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="#222C37" />
    <path d="M12 7l4 2.3v4.7L12 17l-4-3V9.3L12 7z" fill="#fff" />
  </svg>
);

