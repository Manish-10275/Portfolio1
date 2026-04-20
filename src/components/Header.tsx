import { motion, useScroll } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const sections = ['Education', 'Skills', 'Experience', 'Projects', 'Contact'];

export const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-2 left-0 right-0 z-40 px-4"
      >
        <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-gray-950/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-900/20'
            : 'bg-transparent'
        }`}>
          <nav className="px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.a
                href="#hero"
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-white font-semibold text-lg tracking-tight">
                  Manish <span className="text-blue-400">Chouhan</span>
                </span>
              </motion.a>

              <div className="hidden md:flex items-center space-x-1">
                {sections.map((section) => (
                  <NavLink key={section} href={`#${section.toLowerCase()}`}>
                    {section}
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get in Touch
                </motion.button>

                <button
                  className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="md:hidden pt-4 pb-2 border-t border-white/10 mt-4"
              >
                <div className="flex flex-col space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section}
                      href={`#${section.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
                    >
                      {section}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </nav>
        </div>
      </motion.header>
    </>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.05 }}
    className="relative px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 group"
  >
    {children}
    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-4/5 transition-all duration-300" />
  </motion.a>
);
