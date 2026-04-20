import { useState, useEffect, useRef } from 'react';
import ThreeScene from './components/ThreeScene';
import { CursorTracker } from './components/CursorTracker';
import { Header } from './components/Header';
import { EducationTimeline } from './components/EducationTimeline';
import { motion, useInView } from 'framer-motion';
import {
  Book, Music, Code, Linkedin, Instagram, Microscope, Leaf,
  ChevronDown, Mail, Phone, ArrowRight, Sparkles, Terminal,
  Rocket, Pen, Github
} from 'lucide-react';
import { ProjectCard } from './components/Card';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Admin } from './components/Admin';
import { supabase } from './lib/supabaseClient';

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-px w-8 bg-gradient-to-r from-blue-500 to-transparent" />
    <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">{children}</span>
  </div>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
    {children}
  </h2>
);

const ScrollCue = ({ targetId }: { targetId: string }) => (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: [0, 8, 0] }}
    transition={{ delay: 1.5, repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
    onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors"
  >
    <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
    <ChevronDown className="w-4 h-4" />
  </motion.button>
);

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-center card-glow">
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-medium">{label}</div>
  </div>
);

const GlowDot = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
);

function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentSection, setCurrentSection] = useState('hero');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const age = calculateAge(new Date('2006-04-11'));

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setCurrentSection(e.target.id || 'hero'); }),
      { threshold: 0.4 }
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Login error:', error.message);
    else setIsAuthenticated(true);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    setIsAdminView(window.location.pathname === '/admin');
  }, []);

  if (isAdminView) return <Admin isAuthenticated={isAuthenticated} onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#020817] text-gray-100 overflow-x-hidden">
      {/* Ambient background */}
      <GlowDot className="w-[600px] h-[600px] bg-blue-600/8 top-[-200px] left-[-200px]" />
      <GlowDot className="w-[400px] h-[400px] bg-cyan-500/6 top-[40vh] right-[-100px]" />
      <GlowDot className="w-[500px] h-[500px] bg-blue-700/6 bottom-[20vh] left-[10vw]" />

      <CursorTracker />
      <ThreeScene currentSection={currentSection} />
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="relative z-10">
        {/* ── HERO ────────────────────────────────────────────────── */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center grid-bg">
          <div className="max-w-5xl mx-auto px-6 text-center pt-24">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open to Opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
            >
              Hi, I'm{' '}
              <span className="gradient-text">Manish</span>
              <br />
              <span className="gradient-text">Chouhan</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            >
              Singer · Songwriter · Author · Tech Innovator · Badminton Player
            </motion.p>

            {/* Mono sub-label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-xs font-mono text-gray-600 mb-12"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Age {age} · Building at the intersection of art & technology</span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                <Rocket className="w-4 h-4" />
                <span>View Projects</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Social + Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex items-center gap-3">
                {[
                  { href: 'https://www.linkedin.com/in/manish-chouhan-2301a7230/', icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                  { href: 'https://www.instagram.com/i_m_manish_chouhan/', icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                ].map(({ href, icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-white hover:border-blue-500/40 transition-all duration-200 text-sm"
                  >
                    {icon}
                    <span>{label}</span>
                  </motion.a>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <StatBox value="2+" label="Books Published" />
                <StatBox value="5+" label="Languages" />
                <StatBox value={`${age}`} label="Years Old" />
              </div>
            </motion.div>
          </div>
          <ScrollCue targetId="education" />
        </section>

        {/* ── EDUCATION ───────────────────────────────────────────── */}
        <section id="education" className="relative min-h-screen py-28 section-bg">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <SectionLabel>Academic Journey</SectionLabel>
              <SectionHeading>Education</SectionHeading>
              <p className="text-gray-400 max-w-lg">
                A continuous learning path shaped by curiosity, dedication, and a passion for excellence.
              </p>
            </motion.div>
            <EducationTimeline />
          </div>
          <ScrollCue targetId="skills" />
        </section>

        {/* ── SKILLS ──────────────────────────────────────────────── */}
        <section id="skills" className="relative py-28">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <SectionLabel>Capabilities</SectionLabel>
              <SectionHeading>Skills & Expertise</SectionHeading>
              <p className="text-gray-400 max-w-lg">
                From creative arts to software development — a diverse toolkit built through self-driven exploration.
              </p>
            </motion.div>
            <Skills />
          </div>
          <ScrollCue targetId="experience" />
        </section>

        {/* ── EXPERIENCE ──────────────────────────────────────────── */}
        <section id="experience" className="relative py-28 section-bg">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <SectionLabel>Background</SectionLabel>
              <SectionHeading>Experience</SectionHeading>
              <p className="text-gray-400 max-w-lg">
                Real-world projects and self-initiated ventures that demonstrate drive, creativity, and technical depth.
              </p>
            </motion.div>
            <Experience />
          </div>
          <ScrollCue targetId="projects" />
        </section>

        {/* ── PROJECTS ────────────────────────────────────────────── */}
        <section id="projects" className="relative py-28">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <SectionLabel>Work</SectionLabel>
              <SectionHeading>Featured Projects</SectionHeading>
              <p className="text-gray-400 max-w-lg">
                Selected projects spanning technology, literature, and creative arts.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <div className="flex items-center gap-2">
                      <Leaf className="w-6 h-6" />
                      <Microscope className="w-6 h-6" />
                    </div>
                  ),
                  title: "Plant Disease Recognition",
                  description: "AI-powered application detecting plant diseases through leaf morphology analysis using computer vision and Python.",
                },
                {
                  icon: <Code className="w-6 h-6" />,
                  title: "Devoq Labs",
                  description: "Innovative startup developing cutting-edge solutions across multiple industries, from web platforms to research tools.",
                  link: "https://keen-parfait-701bb5.netlify.app/",
                },
                {
                  icon: <Book className="w-6 h-6" />,
                  title: "Published Books",
                  description: "'The Silence' and 'Chalo Aaj Kuch Dil Ki Baat Ho Jaye' — two poetry collections exploring emotion, overthinking, and heartbreak.",
                },
                {
                  icon: <Music className="w-6 h-6" />,
                  title: "Music Projects",
                  description: "Released original songs on Spotify and Instagram, spanning romantic ballads and trap productions with Hindi and English lyrics.",
                },
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </div>
          </div>
          <ScrollCue targetId="contact" />
        </section>

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <section id="contact" className="relative py-28 section-bg">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>Let's Connect</SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Have an idea? <br />
                <span className="gradient-text">Let's build it.</span>
              </h2>
              <p className="text-gray-400 mb-12 max-w-lg mx-auto">
                Whether you want to collaborate on a project, discuss ideas, or just say hello — my inbox is always open.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <motion.a
                  href="mailto:manishchouchan123@gmail.com"
                  whileHover={{ y: -3 }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-left card-glow transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Email</div>
                    <div className="text-white text-sm group-hover:text-blue-300 transition-colors">manishchouchan123@gmail.com</div>
                  </div>
                </motion.a>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-left card-glow transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-green-500 flex items-center justify-center text-white flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-0.5">WhatsApp</div>
                    <div className="text-white text-sm">8905694021</div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-4">
                {[
                  { href: 'https://www.linkedin.com/in/manish-chouhan-2301a7230/', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
                  { href: 'https://www.instagram.com/i_m_manish_chouhan/', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
                ].map(({ href, label, icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-white hover:border-blue-500/40 transition-all duration-200 text-sm"
                  >
                    {icon}
                    <span>{label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.05] py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="text-gray-500 text-sm">Manish Chouhan</span>
            </div>
            <p className="text-gray-600 text-xs font-mono">
              © {new Date().getFullYear()} · Built with passion & curiosity
            </p>
            <a
              href="/admin"
              className="text-gray-700 hover:text-gray-500 transition-colors text-xs font-mono"
            >
              admin
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
