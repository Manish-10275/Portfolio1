import { motion } from 'framer-motion';
import { Sun, Moon, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header = ({ isDark, toggleTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-black/80"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            Manish Chouhan
          </motion.h1>

          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4"
          >
            <NavLinks />
            <div className="mt-4">
              <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

const NavLinks = () => (
  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
    <NavLink href="#profile">Profile</NavLink>
    <NavLink href="#education">Education</NavLink>
    <NavLink href="#skills">Skills</NavLink>
    <NavLink href="#experience">Experience</NavLink>
    <NavLink href="#about">About</NavLink>
    <NavLink href="#sports">Sports</NavLink>
    <NavLink href="#projects">Projects</NavLink>
    <NavLink href="#achievements">Achievements</NavLink>
    <NavLink href="#hobbies">Hobbies</NavLink>
    <NavLink href="#contact">Contact</NavLink>
  </div>
);

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.1 }}
    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
  >
    {children}
  </motion.a>
);

const ThemeToggle = ({ isDark, toggleTheme }: HeaderProps) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={toggleTheme}
    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
  >
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </motion.button>
);