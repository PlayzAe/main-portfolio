import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Play,
  Pause,
  ExternalLink,
  Copy,
  Check,
  Star,
  GitFork,
  Smartphone,
  Globe,
  Monitor,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Download
} from 'lucide-react';
import TerminalComponent from './Terminal';
import FluidCanvas from './FluidCanvas';
import TeamLanyardRail from './components/ui/team-lanyard-rail';
import GlassFolder from './components/ui/glass-folder-cards';
import WorksWheel from './components/ui/works-wheel';
import DoodleCrewFooter from './components/ui/doodle-crew-footer';
import CVModal from './CVModal';
import ArenaSpotlight from './components/ArenaSpotlight';
import StudyPomoTimer from './components/StudyPomoTimer';
import {
  SpotifyLogo,
  GitHubLogo,
  AndroidLogo,
  ReactLogo,
  TypeScriptLogo,
  NextjsLogo,
  PlayzAnimeLogo,
  EmberfigLogo,
  ArenaLogo
} from './BrandLogos';

// FadeInUp scroll observer for clean entrance animations
const FadeInUp = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Folder + a phone-only file list. The fanned sheets are too small to tap on a phone,
// so below 640px each file is also a full-width row.
const FolderWithList = (props) => (
  <div className="w-full flex flex-col items-center">
    <GlassFolder {...props} />
    <ul className="sm:hidden mt-3 w-full max-w-[320px] divide-y divide-zinc-800 rounded-xl border border-zinc-800 overflow-hidden">
      {(props.files || []).map((file) => (
        <li key={file.name}>
          <a href={file.href} target="_blank" rel="noopener noreferrer" className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2.5 active:bg-white/5">
            <span className="min-w-0">
              <span className="block truncate text-sm text-white">{file.name}</span>
              {file.meta && <span className="block truncate text-xs text-zinc-500">{file.meta}</span>}
            </span>
            <ExternalLink size={14} className="shrink-0 text-zinc-500" />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Marquee Brand Logos (Authentic vector SVGs)
const logoImg = (src, alt) => (
  <img src={src} alt={alt} width="20" height="20" loading="lazy" decoding="async" className="w-5 h-5 rounded-[5px] object-cover" />
);

const MARQUEE_ITEMS = [
  { name: 'arena.ai-desktop', label: 'Desktop client for 100+ models', icon: logoImg('logos/arena.svg', 'arena.ai-desktop') },
  { name: 'Quilore', label: 'Spotify history, parsed in-browser', icon: logoImg('logos/quilore.png', 'Quilore') },
  { name: 'Emberfig', label: 'Studio, with Adeboye', icon: logoImg('logos/emberfig.png', 'Emberfig') },
  { name: 'StudyPomo', label: 'Focus timer on Google Play', icon: logoImg('logos/studypomo.png', 'StudyPomo') },
  { name: 'Ponderanda', label: 'Daily arithmetic ladder', icon: logoImg('logos/ponderanda.png', 'Ponderanda') },
  { name: 'PlayzAnime', label: 'Anime and manga client', icon: logoImg('logos/playzanime.svg', 'PlayzAnime') },
  { name: 'Zykof', label: 'Key platform and dashboard', icon: logoImg('icons/zykof.svg', 'Zykof') },
  { name: 'React 19 + TypeScript', label: 'Daily stack', icon: <ReactLogo className="w-5 h-5" /> },
  { name: 'Next.js', label: 'Full-stack web', icon: <NextjsLogo className="w-5 h-5" /> }
];

// 21st.dev Team Lanyard Rail items (George's ecosystem & production systems)
const LANYARD_MEMBERS = [
  {
    id: 'george',
    name: 'George Moses Azuoru',
    role: 'Web Engineer & Co-Owner',
    team: 'Emberfig · Lagos',
    image: 'https://github.com/playzae.png',
    bio: 'Full-stack web engineer. I build high-performance web apps, client-side streaming architectures, and consumer software that refuses to break.',
    tags: ['React 19', 'TypeScript', 'Lagos'],
    links: [
      { label: 'GitHub @playzae', href: 'https://github.com/playzae' },
      { label: 'azuorugeorge@gmail.com', href: 'mailto:azuorugeorge@gmail.com' }
    ],
    color: '#a1a1aa'
  },
  {
    id: 'arena-desktop',
    name: 'arena.ai-desktop',
    role: 'Desktop AI Client',
    team: '15 ★ · 7 forks',
    image: 'logos/arena.svg',
    bio: 'Unofficial desktop client with Edge WebView2, Flask SSE streaming, Claude Code-style terminal tool rows, and local MCP server connectors.',
    tags: ['Edge WebView2', 'Flask SSE', 'MCP'],
    links: [
      { label: 'GitHub (★ 15)', href: 'https://github.com/PlayzAe/arena.ai-desktop' },
      { label: 'Download .exe', href: 'https://github.com/PlayzAe/arena.ai-desktop/releases/latest' }
    ],
    color: '#e8e2d9'
  },
  {
    id: 'quilore',
    name: 'Quilore',
    role: 'Browser Data Engine',
    team: '160k Plays · 0 Server',
    image: 'logos/quilore.png',
    bio: 'Analyzes 160,000+ Spotify GDPR export records in <4s directly in-browser using Web Workers. Zero server compute, 100/100 Lighthouse.',
    tags: ['Web Workers', 'Privacy', 'Streaming'],
    links: [
      { label: 'Launch Quilore', href: 'https://quilore.com' },
      { label: 'Longplay (open source)', href: 'https://github.com/PlayzAe/Spotify-tracker' }
    ],
    color: '#3b6fd1'
  },
  {
    id: 'studypomo',
    name: 'StudyPomo',
    role: 'Android Systems App',
    team: 'Google Play · Emberfig',
    image: 'logos/studypomo.png',
    bio: 'Unbreakable focus timer with persistent foreground services and partial wake locks that bypass aggressive OEM task killers (TECNO HiOS, Xiaomi MIUI).',
    tags: ['Android', 'WakeLocks', 'Foreground'],
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.everythingabuad.studypomo' },
      { label: 'Emberfig Note', href: 'https://emberfig.com/apps/#studypomo-writing' }
    ],
    color: '#2b4a72'
  },
  {
    id: 'ponderanda',
    name: 'Ponderanda',
    role: 'Arithmetic Ladder',
    team: 'Play & Web · Emberfig',
    image: 'logos/ponderanda.png',
    bio: 'One arithmetic ladder a day. Five problems, one attempt, the same for everyone. No ads, every past day stays playable, free.',
    tags: ['Mental Math', 'Web', 'Android'],
    links: [
      { label: 'Play on Web', href: 'https://ponderanda.com' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.emberfig.ponderanda' }
    ],
    color: '#d9d6c4'
  },
  {
    id: 'herewise',
    name: 'Herewise',
    role: 'Offline Fingerprint Desk',
    team: 'Windows 11 · GPL',
    image: 'icons/herewise.webp',
    bio: 'Lecture attendance from a ZKTeco fingerprint terminal, kept on lecturer computer and working with no internet. Free under GNU GPL.',
    tags: ['ZKTeco', 'Win64', 'GPL'],
    links: [
      
      { label: 'Emberfig Note', href: 'https://emberfig.com/apps/#herewise-writing' }
    ],
    color: '#2f4f8f'
  },
  {
    id: 'playzanime',
    name: 'PlayzAnime',
    role: 'Media Streaming Client',
    team: 'Open source · 3 repos',
    image: 'logos/playzanime.svg',
    bio: 'Ad-free anime & manga platform with custom HLS adaptive video pre-buffering, auto skip intro/outro, and offline CBZ manga reader.',
    tags: ['HLS Player', 'Electron', 'Flutter'],
    links: [
      { label: 'Web Client', href: 'https://playz.vmny.lol' },
      { label: 'GitHub Repo', href: 'https://github.com/PlayzAe/playz_anime_app' }
    ],
    color: '#f0532c'
  },
  {
    id: 'zykof',
    name: 'Zykof',
    role: 'Subscription Platform',
    team: 'zykof.best · Private',
    image: 'icons/zykof.svg',
    bio: 'A platform to buy and sell subscriptions: instant license keys, customer dashboard, reseller portal and admin.',
    tags: ['Subscriptions', 'Keys', 'Admin'],
    links: [
      { label: 'zykof.best', href: 'https://zykof.best' }
    ],
    color: '#d4d4d8'
  },
  {
    id: 'adeboye',
    name: 'Adeboye Oluwatimileyin',
    role: 'Studio Co-Founder',
    team: 'Emberfig · Lagos',
    image: 'images/adeboye.webp',
    bio: 'Co-founding partner at Emberfig. We build privacy-first consumer software out of pure spite whenever mainstream software locks basic features behind a paywall.',
    tags: ['Co-Owner', 'Product', 'Lagos'],
    links: [
      { label: 'Emberfig Apps', href: 'https://emberfig.com/apps' },
      { label: 'hello@emberfig.com', href: 'mailto:hello@emberfig.com' }
    ],
    color: '#8a8a9a'
  }
];

// Skills, in the order I actually spend time on them.
const SKILLS_LIST = [
  {
    id: 'web',
    name: 'Full-stack web',
    note: 'Main work',
    summary: 'React and TypeScript on the front, Node or ASP.NET Core behind it. I care about load time and about keeping user data on the user\'s device when it can stay there.',
    tags: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Tailwind', 'Node.js', 'ASP.NET Core', 'PostgreSQL', 'SQL Server'],
    proof: { text: 'Quilore parses 160k Spotify plays in the browser in under 4s', href: 'https://quilore.com' }
  },
  {
    id: 'platforms',
    name: 'Storefronts, dashboards, admin panels',
    summary: 'Payments, license keys delivered on checkout, customer accounts, role-based admin. The boring parts that have to be right.',
    tags: ['Auth', 'Payments', 'REST', 'Admin tooling'],
    proof: { text: 'zykof.best: shop, key system, customer dashboard, admin', href: 'https://zykof.best' }
  },
  {
    id: 'desktop',
    name: 'Desktop apps',
    summary: 'Python or Electron backends behind a WebView2 window. Streaming responses, local MCP servers, files on disk instead of in a tab.',
    tags: ['Python', 'Flask', 'pywebview', 'Edge WebView2', 'Electron'],
    proof: { text: 'arena.ai-desktop, 15 stars and 7 forks', href: 'https://github.com/PlayzAe/arena.ai-desktop' }
  },
  {
    id: 'android',
    name: 'Android',
    summary: 'Foreground services and wake locks that survive the battery killers on TECNO, Xiaomi and Samsung phones.',
    tags: ['Kotlin', 'Flutter', 'Dart', 'Foreground services'],
    proof: { text: 'StudyPomo on Google Play', href: 'https://play.google.com/store/apps/details?id=com.everythingabuad.studypomo' }
  },
  {
    id: 'reversing',
    name: 'Reverse engineering',
    note: 'Hobby',
    summary: 'Reading compiled x64 binaries in x64dbg and IDA to see how game engines lay out memory. It made me much better at reading code I did not write.',
    tags: ['C++', 'x64 assembly', 'x64dbg', 'IDA'],
    proof: null
  }
];

// FAQ Items (Honest, direct, zero corporate fluff)
const FAQ_LIST = [
  {
    q: 'What is your main skill and what are you best at?',
    a: "Full-stack web development is my main craft. I build clean, high-performance web applications using React, TypeScript, Next.js, and Node.js. When you give me a design or a product requirement, I ship software that looks great, runs fast, and doesn't break."
  },
  {
    q: 'What is arena.ai-desktop and why did you build it?',
    a: "arena.ai-desktop is an unofficial desktop app for arena.ai with 15 stars and 7 forks on GitHub. I built it so developers can use 100+ AI models locally in a desktop window with Claude Code-style terminal tool rows, local workspace file syncing, and MCP connectors without being trapped in a web browser tab."
  },
  {
    q: 'What is Emberfig and who is involved?',
    a: "Emberfig (emberfig.com) is an independent two-man app studio co-founded with my friend Adeboye Oluwatimileyin. We build zero-subscription, privacy-first software whenever existing apps on the market break or lock basic features behind expensive paywalls. All our consumer apps (StudyPomo, Ponderanda, Quilore) are 100% free."
  },
  {
    q: 'How does Quilore process 160,000+ Spotify records without a server?',
    a: "Spotify's official REST API caps you at 50 recent tracks and omits song durations. Quilore reads your raw GDPR JSON export directly inside browser Web Workers. It reverse-engineered playback timestamps across 160,000+ plays to calculate lifetime stats in under 4 seconds with zero server uploads. The core engine is open-sourced as Longplay on GitHub."
  },
  {
    q: 'What is your background in reverse engineering and game hacking?',
    a: 'Game hacking and reverse engineering are personal technical hobbies. I enjoy opening up compiled x64 executables in x64dbg and IDA Pro, inspecting runtime memory structures, tracing pointer chains under ASLR, and writing C++ tools to see how game engines (like NetEase Messiah) work under the hood. It teaches me low-level fundamentals that make my web and systems code significantly better.'
  },
  {
    q: 'Are you available for work or consulting?',
    a: "Yes. I am open to full-time frontend/full-stack engineering roles, technical contracting, and custom web development projects. Reach out via email at hello@emberfig.com or find me on GitHub (@playzae)."
  }
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="bg-[#09090b] text-white min-h-screen selection:bg-white selection:text-black font-sans relative w-full overflow-x-clip antialiased">
      {/* 1. Sticky Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo & Studio Identity */}
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:border-zinc-700 transition-colors shadow-sm">
              <EmberfigLogo className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-semibold tracking-tight text-white block leading-none">
                George Moses Azuoru
              </span>
              <span className="text-[11px] font-mono text-zinc-400 block mt-1">
                Co-Founder @{' '}
                <a
                  href="https://emberfig.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-300 hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  Emberfig
                </a>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('skills');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Skills
            </a>
            <a
              href="#terminal"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('terminal');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Terminal
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('faq');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right Header Controls (GitHub + CV View) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setCvOpen(true)}
              className="bg-white/[0.04] hover:bg-white/10 text-zinc-200 text-xs font-mono px-3.5 py-2 rounded-full border border-zinc-700 transition-all shadow-sm active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View CV (.md)</span>
            </button>
            <a
              href="https://github.com/playzae"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#18181b] hover:bg-[#27272a] text-zinc-200 hover:text-white text-xs font-mono px-3.5 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm active:scale-95 inline-flex items-center gap-2"
            >
              <GitHubLogo className="w-3.5 h-3.5 text-white" />
              <span>@playzae</span>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCvOpen(true)}
              className="min-w-[44px] min-h-[44px] px-3 inline-flex items-center justify-center bg-white/[0.04] text-zinc-200 text-xs font-mono rounded-full border border-zinc-700 active:scale-95 cursor-pointer"
            >
              CV
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] p-2 text-zinc-300 hover:text-white focus:outline-none flex items-center justify-center rounded-lg active:bg-white/10 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen
              ? 'max-h-96 opacity-100 border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur-xl'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-5 py-4 flex flex-col gap-2">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
              className="min-h-[44px] flex items-center text-sm font-medium text-zinc-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
              className="min-h-[44px] flex items-center text-sm font-medium text-zinc-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('skills');
              }}
              className="min-h-[44px] flex items-center text-sm font-medium text-zinc-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Skills
            </a>
            <a
              href="#terminal"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('terminal');
              }}
              className="min-h-[44px] flex items-center text-sm font-medium text-zinc-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Terminal
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('faq');
              }}
              className="min-h-[44px] flex items-center text-sm font-medium text-zinc-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="min-h-[44px] flex items-center text-sm font-medium text-zinc-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Contact
            </a>
            <button
              onClick={() => {
                setCvOpen(true);
                setMobileMenuOpen(false);
              }}
              className="min-h-[44px] bg-white/[0.04] hover:bg-white/10 text-zinc-200 text-xs font-mono px-4 py-2.5 rounded-xl border border-zinc-700 text-center inline-flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>View Curriculum Vitae (.md)</span>
            </button>
            <a
              href="https://github.com/playzae"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] bg-[#18181b] hover:bg-[#27272a] text-zinc-200 hover:text-white text-xs font-mono px-4 py-2.5 rounded-xl border border-zinc-800 text-center inline-flex items-center justify-center gap-2 mt-1"
            >
              <GitHubLogo className="w-3.5 h-3.5 text-white" />
              <span>GitHub @playzae</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (id="about") */}
      <section
        id="about"
        className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative z-0 overflow-hidden"
      >
        {/* Procedural Fluid Ribbon Background (WebGL2 — infinite seamless loop, no CDN dependency) */}
        <FluidCanvas
          preset="hero"
          speed={0.85}
          duration={14.0}
          intensity={0.75}
          interactive={true}
          className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
        />
        {/* Clean Vignette & Gradient Overlays so text pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/50 via-transparent to-[#09090b] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          {/* Top Badge: Handcrafted Emberfig & Role Pill */}
          <FadeInUp delay={0}>
            <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b]/90 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-md hover:border-zinc-700 transition-all cursor-default shadow-sm text-center">

              <span>Co-founder at Emberfig · Full-stack engineer</span>
            </div>
          </FadeInUp>

          {/* Headline: Grounded, Handcrafted, Zero Fluff */}
          <FadeInUp delay={150}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 text-center text-white leading-[1.08]">
              Engineering web applications <br className="hidden sm:inline" />
              and client systems that <span className="font-serif italic font-normal text-zinc-200">refuse to break.</span>
            </h1>
          </FadeInUp>

          {/* Concise, Humanized Intro */}
          <FadeInUp delay={300}>
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl text-center mb-10 leading-relaxed font-normal">
              I am George Moses Azuoru (@playzae), a full-stack engineer and co-founder of Emberfig with Adeboye. My primary craft is building high-speed web apps with React 19, TypeScript, and client-side Web Workers, paired with resilient desktop and mobile tools.
            </p>
          </FadeInUp>

          {/* Primary & Secondary Actions */}
          <FadeInUp delay={450}>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-white hover:bg-zinc-100 text-black text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Explore Shipped Work</span>
              </button>
              <a
                href="https://emberfig.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#18181b] hover:bg-[#27272a] text-zinc-200 hover:text-white text-sm font-medium px-5 py-3 rounded-full border border-zinc-800 hover:border-zinc-700 transition-all duration-200 active:scale-95 inline-flex items-center gap-2"
              >
                <EmberfigLogo className="w-4 h-4 text-zinc-300" />
                <span>emberfig.com</span>
                <ExternalLink size={13} className="text-zinc-500" />
              </a>
              <a
                href="https://github.com/PlayzAe/arena.ai-desktop"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.04] hover:bg-white/10 text-zinc-200 text-sm font-medium px-5 py-3 rounded-full border border-zinc-700 transition-all duration-200 active:scale-95 inline-flex items-center gap-2"
              >
                <Star size={14} className="fill-zinc-200 text-zinc-300" />
                <span className="font-mono">arena.ai-desktop (15★)</span>
              </a>
            </div>
          </FadeInUp>
        </div>

        {/* Marquee with Authentic Vector Logos */}
        <div className="w-full mt-20 sm:mt-24 overflow-hidden">
          <FadeInUp delay={600}>
            <p className="text-sm text-zinc-500 mb-6 text-center">
              Things I have shipped
            </p>
          </FadeInUp>

          <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-max animate-marquee">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center gap-2.5 flex-shrink-0 px-7 sm:px-9 text-zinc-400 hover:text-white transition-colors select-none"
                >
                  <span>{item.icon}</span>
                  <div className="text-left">
                    <span className="text-xs sm:text-sm font-semibold tracking-tight text-white block leading-none whitespace-nowrap">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-1 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cohesive Obsidian & Zinc Telemetry Bar */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
          <FadeInUp delay={700}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#121215]/90 border border-zinc-800 backdrop-blur-md shadow-xl">
              <div className="text-center p-3 bg-white/[0.02] sm:bg-transparent rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-zinc-200 tracking-tight flex items-center justify-center gap-1.5">
                  <Star size={20} className="fill-zinc-200 text-zinc-300" />
                  <span>15 Stars</span>
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-mono">arena.ai-desktop (7 Forks)</div>
              </div>
              <div className="text-center p-3 bg-white/[0.02] sm:bg-transparent rounded-xl md:border-l md:border-zinc-800">
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">160k+</div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-mono">Spotify Plays In-Browser</div>
              </div>
              <div className="text-center p-3 bg-white/[0.02] sm:bg-transparent rounded-xl md:border-l md:border-zinc-800">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">100 / 100</div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-mono">Lighthouse Performance</div>
              </div>
              <div className="text-center p-3 bg-white/[0.02] sm:bg-transparent rounded-xl md:border-l md:border-zinc-800">
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Zero Paywalls</div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-mono">Client-First Privacy</div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 3. Featured Projects */}
      <section id="projects" className="relative z-10 py-16 sm:py-24 border-t border-zinc-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInUp delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
              <p className="text-sm text-zinc-500 mb-4">Projects</p>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
                Work I have shipped.
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Studio apps from Emberfig, plus the things I build on my own time.
              </p>
            </div>
          </FadeInUp>

          {/* Interactive Lanyard Rail (21st.dev Component) — 100% Mobile & Touch Compatible */}
          <FadeInUp delay={50} className="mb-14 sm:mb-18">
            <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-[#121215]/90 backdrop-blur-md overflow-hidden p-2 sm:p-6 shadow-2xl">
              <TeamLanyardRail
                items={LANYARD_MEMBERS}
                eyebrow="Things I have shipped"
                heading="Pick a badge."
                caption="Drag along the rail, pull a badge down, or tap it to flip."
                autoplay={true}
                interval={3500}
              />
            </div>
          </FadeInUp>

          {/* arena.ai-desktop: live GitHub stats + agent replay */}
          <FadeInUp delay={100} className="mb-14 sm:mb-20">
            <ArenaSpotlight />
          </FadeInUp>

          {/* Grid of Other Shipped Projects & Emberfig Apps */}
          <div className="space-y-8">
            {/* Section Subhead: Emberfig Shipped Apps */}
            <div className="pt-6 border-t border-zinc-800/80">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-300 text-sm font-medium">
                      Emberfig Studio
                    </span>
                    <span className="text-zinc-600 font-mono">/</span>
                    <span className="text-zinc-400 text-xs">Co-founded with Adeboye Oluwatimileyin</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
                    Independent Consumer Apps
                  </h3>
                </div>
                <a
                  href="https://emberfig.com/apps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-zinc-300 hover:text-white inline-flex items-center gap-1.5 transition-colors border border-zinc-700 bg-white/[0.04] px-3 py-1.5 rounded-full hover:bg-white/[0.04]"
                >
                  <span>emberfig.com/apps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Emberfig Shipped Apps Grid */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* 1. StudyPomo */}
              <FadeInUp delay={100}>
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121215]/90 p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="icons/studypomo.webp"
                          alt="StudyPomo"
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-xl bg-[#09090b] p-1 border border-white/10 shadow-sm"
                        />
                        <div>
                          <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            StudyPomo
                          </h4>
                          <span className="text-[11px] font-mono text-emerald-400 font-medium">
                            Live on Google Play
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">v1.0.0</span>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-normal">
                      A Pomodoro timer that keeps counting when the screen goes off.
                    </p>

                    {/* Built against callout */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] mb-4">
                      <span className="text-xs text-zinc-500 block mb-1">
                        Built against
                      </span>
                      <p className="text-zinc-300 text-xs leading-relaxed font-normal">
                        Timers that stop counting when Android reclaims the process, losing the session.
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="flex flex-wrap gap-1.5 mb-4 text-[10px] font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">since 9 Aug 2026</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">~26 MB phone</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Android 7.0+</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">No account</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Offline stats</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">6 ambient sounds</span>
                    </div>

                    <StudyPomoTimer />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.everythingabuad.studypomo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <span>Get it on Play</span>
                      <ExternalLink size={12} />
                    </a>
                    <a
                      href="https://emberfig.com/apps/#studypomo-writing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px]"
                    >
                      <span>What we wrote about it</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </FadeInUp>

              {/* 2. Ponderanda */}
              <FadeInUp delay={150}>
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121215]/90 p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="icons/ponderanda.webp"
                          alt="Ponderanda"
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-xl bg-[#09090b] p-1 border border-white/10 shadow-sm"
                        />
                        <div>
                          <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            Ponderanda
                          </h4>
                          <span className="text-[11px] font-mono text-emerald-400 font-medium">
                            Live on Google Play & Web
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">Android & Web</span>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-normal">
                      One arithmetic ladder a day. Five problems, one attempt, the same for everyone.
                    </p>

                    {/* Built against callout */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] mb-4">
                      <span className="text-xs text-zinc-500 block mb-1">
                        Built against
                      </span>
                      <p className="text-zinc-300 text-xs leading-relaxed font-normal">
                        Brain-training apps cap free play at about three games a day, on top of cognitive claims the evidence does not support.
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="flex flex-wrap gap-1.5 mb-6 text-[10px] font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">since 17 Aug 2026</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Android 7.0+</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">No account</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Past days free</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Zero ads</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Play in browser</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.emberfig.ponderanda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <span>Get it on Play</span>
                      <ExternalLink size={12} />
                    </a>
                    <a
                      href="https://ponderanda.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <span>Play in Browser</span>
                      <ExternalLink size={12} />
                    </a>
                    <a
                      href="https://emberfig.com/apps/#ponderanda-writing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px]"
                    >
                      <span>What we wrote</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </FadeInUp>

              {/* 3. Quilore & Longplay */}
              <FadeInUp delay={200}>
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121215]/90 p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="icons/quilore.webp"
                          alt="Quilore"
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-xl bg-[#09090b] p-1 border border-white/10 shadow-sm"
                        />
                        <div>
                          <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            Quilore & Longplay
                          </h4>
                          <span className="text-[11px] font-mono text-emerald-400 font-medium">
                            Live on the Web
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">160k+ plays</span>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-normal">
                      Your whole Spotify listening history, read from your own data export, in the browser.
                    </p>

                    {/* Built against callout */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] mb-4">
                      <span className="text-xs text-zinc-500 block mb-1">
                        Built against
                      </span>
                      <p className="text-zinc-300 text-xs leading-relaxed font-normal">
                        Listening stats built on Spotify's API, which reports that a track played but never for how long, and holds only the last fifty plays.
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="flex flex-wrap gap-1.5 mb-6 text-[10px] font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">since 6 Sep 2026</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">No account/login</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">100% In-Browser</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Zero tiers/paywalls</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Web Workers</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <a
                      href="https://quilore.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <span>Open in Browser</span>
                      <ExternalLink size={12} />
                    </a>
                    <a
                      href="https://github.com/PlayzAe/Spotify-tracker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px]"
                    >
                      <GitHubLogo className="w-3.5 h-3.5" />
                      <span>Longplay Repo</span>
                    </a>
                    <a
                      href="https://emberfig.com/apps/#quilore-writing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px]"
                    >
                      <span>What we wrote</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </FadeInUp>

              {/* 4. Herewise */}
              <FadeInUp delay={250}>
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121215]/90 p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="icons/herewise.webp"
                          alt="Herewise"
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-xl bg-[#09090b] p-1 border border-white/10 shadow-sm"
                        />
                        <div>
                          <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            Herewise
                          </h4>
                          <span className="text-[11px] font-mono text-sky-400 font-medium">
                            Released for Windows
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">v0.1.19</span>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-normal">
                      Lecture attendance from a ZKTeco fingerprint terminal, kept on the lecturer's own computer and working with no internet.
                    </p>

                    {/* Built against callout */}
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] mb-4">
                      <span className="text-xs text-zinc-500 block mb-1">
                        Built against
                      </span>
                      <p className="text-zinc-300 text-xs leading-relaxed font-normal">
                        Attendance apps that lose the register. Lost or wiped records were the commonest complaint in 178 negative reviews of five attendance apps.
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="flex flex-wrap gap-1.5 mb-6 text-[10px] font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">since 21 Oct 2026</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">50 MB installer</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Windows 10/11 64-bit</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">No internet required</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">GNU GPL v3</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <a
                      href="https://github.com/PlayzAe/herewise"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <Download size={12} />
                      <span>Download for Windows</span>
                    </a>
                    <a
                      href="https://emberfig.com/apps/#herewise-writing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px]"
                    >
                      <span>What we wrote about it</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </FadeInUp>

            </div>

            {/* Personal projects (not Emberfig) */}
            <div className="pt-10 border-t border-zinc-800/80">
              <p className="text-sm text-zinc-500">Outside Emberfig</p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-1">Personal projects</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* 5. PlayzAnime */}
              <FadeInUp delay={300}>
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121215]/90 p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <img src="logos/playzanime.svg" alt="" width="24" height="24" className="w-6 h-6 rounded-md" />
                        <span className="text-xs text-zinc-400">Windows · Android · Web</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-200">★ 7 Stars</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                      PlayzAnime
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
                      Ad-free anime and manga streaming platform. Custom HLS video player with adaptive pre-buffering, auto skip intro/outro, touch controls, and offline CBZ chapter downloads. Windows app built with Electron/React; Android app built with Flutter/Dart.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <a
                      href="https://playz.vmny.lol/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <span>Web Client</span>
                      <ExternalLink size={12} />
                    </a>
                    <a
                      href="https://github.com/PlayzAe/playz_anime_app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px]"
                    >
                      <GitHubLogo className="w-3.5 h-3.5" />
                      <span>GitHub Repo</span>
                    </a>
                  </div>
                </div>
              </FadeInUp>

              {/* 6. Zykof (Game Hacking / Reversing Hobby) */}
              <FadeInUp delay={350}>
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#121215]/90 p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <img src="icons/zykof.svg" alt="" width="24" height="24" className="w-6 h-6 rounded-md ring-1 ring-white/15" />
                        <span className="text-xs text-zinc-400">Full-stack platform</span>
                      </div>
                      <span className="text-[11px] text-zinc-500">Next.js · C++</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                      Zykof
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
                      A full-stack platform I run on my own. Storefront with card, GCash, Maya and crypto checkout, license keys delivered the moment payment confirms, a customer dashboard for HWID resets, a status page, and an admin side for keys, resellers and support. The C++ client it sells came out of my reverse-engineering hobby.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <a
                      href="https://zykof.best/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
                    >
                      <span>Visit zykof.best</span>
                      <ExternalLink size={12} />
                    </a>
                    <span className="text-xs text-zinc-500">Shop, keys, dashboard, admin</span>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>

          {/* Interactive Glass Folder Cards (21st.dev Component) */}
          <FadeInUp delay={350} className="mt-14 sm:mt-18">
            <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-[#121215]/90 backdrop-blur-md p-4 sm:p-8 shadow-2xl overflow-x-clip">
              <div className="text-center max-w-xl mx-auto mb-6">
                <p className="text-sm text-zinc-500 mb-3">Folders</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Code and builds
                </h3>
                <p className="text-xs text-zinc-400">
                  Click a folder to fan out its files. Esc closes it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center py-4">
                <FolderWithList
                  label="Desktop AI & Tools"
                  art="aurora"
                  seed={3}
                  width={280}
                  action="more"
                  menu={[{ label: 'GitHub @playzae', onSelect: () => window.open('https://github.com/playzae', '_blank') }]}
                  files={[
                    { name: 'arena.ai-desktop.exe', meta: 'Win64 · 24 MB · 15 ★', href: 'https://github.com/PlayzAe/arena.ai-desktop/releases/latest', art: 'aurora' },
                    { name: 'arena-desktop repo', meta: 'GitHub · 7 Forks', href: 'https://github.com/PlayzAe/arena.ai-desktop' },
                    { name: 'Claude_Tool_Stream.tsx', meta: 'SSE Tool Rows', href: 'https://github.com/PlayzAe/arena.ai-desktop' },
                    { name: 'PlayzAnime-Client.app', meta: 'Electron/HLS · 68 MB', href: 'https://playz.vmny.lol', art: 'dusk' }
                  ]}
                />
                <FolderWithList
                  label="In-Browser Engines"
                  art="glacier"
                  seed={17}
                  width={280}
                  action="more"
                  menu={[{ label: 'Launch Quilore.com', onSelect: () => window.open('https://quilore.com', '_blank') }]}
                  files={[
                    { name: 'Quilore_WebEngine.ts', meta: 'Web Workers · 160k', href: 'https://quilore.com', art: 'glacier' },
                    { name: 'Longplay_Spotify.ts', meta: 'Zero-Server Engine', href: 'https://github.com/PlayzAe/Spotify-tracker' },
                    { name: 'GDPR_Stream_Parser.js', meta: '<4s Client-Side', href: 'https://quilore.com' },
                    { name: 'Quilore_Audit.pdf', meta: '100/100 Lighthouse', href: 'https://emberfig.com/apps/#quilore-writing' }
                  ]}
                />
                <FolderWithList
                  label="Emberfig Studio"
                  tone="dark"
                  art="verdant"
                  seed={7}
                  width={280}
                  action="more"
                  labelPlacement="top-right"
                  menu={[{ label: 'Visit emberfig.com', onSelect: () => window.open('https://emberfig.com', '_blank') }]}
                  files={[
                    { name: 'StudyPomo_WakeLock.kt', meta: 'Android · Google Play', href: 'https://play.google.com/store/apps/details?id=com.everythingabuad.studypomo', art: 'verdant' },
                    { name: 'Ponderanda_Ladder.ts', meta: 'Daily Math Game', href: 'https://ponderanda.com' },
                    { name: 'Herewise_ZKTeco.rs', meta: 'Offline Attendance', href: 'https://github.com/PlayzAe/herewise' },
                    { name: 'Emberfig_Manifesto.pdf', meta: 'Zero-Subscription', href: 'https://emberfig.com/apps' }
                  ]}
                />
                <FolderWithList
                  label="Reversing Lab"
                  tone="dark"
                  art="ember"
                  seed={11}
                  width={280}
                  action="more"
                  labelPlacement="top-left"
                  menu={[{ label: 'Inspect on zykof.best', onSelect: () => window.open('https://zykof.best', '_blank') }]}
                  files={[
                    { name: 'Messiah_Bone_Matrix.cpp', meta: '14-Point · C++', href: 'https://zykof.best', art: 'ember' },
                    { name: 'NetEase_ASLR_Chain.h', meta: 'Multi-Level Pointers', href: 'https://zykof.best' },
                    { name: 'Bezier_Aim_Smooth.cpp', meta: 'Cubic Interpolation', href: 'https://zykof.best' },
                    { name: 'PE64_Header_Map.txt', meta: 'Memory Layout & RVA', href: 'https://zykof.best' }
                  ]}
                />
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Works Wheel 3D Drum Showcase */}
      <section id="works-wheel" className="py-12 sm:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <WorksWheel />
        </div>
      </section>

      {/* 4. Skills */}
      <section id="skills" className="relative z-10 py-20 sm:py-28 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
          <FadeInUp delay={0}>
            <div className="lg:sticky lg:top-28">
              <p className="text-sm text-zinc-500 mb-3">Skills</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-[1.15]">
                Mostly the web.
                <span className="block font-serif italic font-normal text-zinc-400">Some of everything else.</span>
              </h2>
              <p className="mt-5 text-zinc-400 text-[15px] leading-relaxed max-w-md">
                I get paid to build web apps. The Android, desktop and C++ work started because something I used was broken, and I wanted to know why.
              </p>
            </div>
          </FadeInUp>

          <ol className="border-t border-zinc-800">
            {SKILLS_LIST.map((skill, index) => (
              <FadeInUp key={skill.id} delay={index * 60}>
                <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)] gap-x-2 py-6 sm:py-7 border-b border-zinc-800">
                  <span className="text-sm text-zinc-600 tabular-nums pt-0.5">{String(index + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">{skill.name}</h3>
                      {skill.note && <span className="text-xs text-zinc-500">{skill.note}</span>}
                    </div>
                    <p className="mt-2 text-zinc-400 text-[15px] leading-relaxed">{skill.summary}</p>
                    <p className="mt-3 text-sm text-zinc-500">
                      <span className="text-zinc-300">{skill.tags.join(', ')}</span>
                    </p>
                    {skill.proof && (
                      <p className="mt-3 text-sm text-zinc-500">
                        {skill.proof.href ? (
                          <a href={skill.proof.href} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-white hover:decoration-zinc-400 transition-colors">
                            {skill.proof.text}
                          </a>
                        ) : (
                          skill.proof.text
                        )}
                      </p>
                    )}
                  </div>
                </li>
              </FadeInUp>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Terminal */}
      <section id="terminal" className="relative z-10 py-20 sm:py-24 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeInUp delay={0}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Or poke around in a shell.</h2>
              <p className="text-sm text-zinc-500">Try <span className="font-mono text-zinc-300">projects</span>, <span className="font-mono text-zinc-300">open arena</span> or <span className="font-mono text-zinc-300">snake</span>.</p>
            </div>
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <TerminalComponent onOpenCV={() => setCvOpen(true)} />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="relative z-10 py-16 sm:py-24 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeInUp delay={0}>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-sm text-zinc-500 mb-4">FAQ</p>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-3">
                Things people ask me.
              </h2>
            </div>
          </FadeInUp>

          {/* Instant Toggle FAQ Accordion (No Laggy Sliding Animations) */}
          <div className="space-y-3">
            {FAQ_LIST.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={idx} className={`rounded-xl border bg-[#121215]/90 transition-colors duration-300 ${open ? 'border-zinc-700' : 'border-zinc-800'}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${idx}`}
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="w-full min-h-[48px] p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-white cursor-pointer select-none"
                  >
                    <span>{item.q}</span>
                    <span aria-hidden="true" className={`relative size-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? 'rotate-45' : ''}`}>
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-zinc-300" />
                      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-zinc-300" />
                    </span>
                  </button>
                  <div
                    id={`faq-${idx}`}
                    role="region"
                    className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className={`px-4 pb-5 sm:px-5 text-sm text-zinc-400 leading-relaxed transition-[opacity,transform] duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Doodle Crew Footer (21st.dev Interactive Component) */}
      <DoodleCrewFooter id="contact" wordmark="EMBERFIG" className="max-w-full overflow-hidden" />

      {/* 8. CV Modal (.md Styled Viewer with Download Button) */}
      <CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
