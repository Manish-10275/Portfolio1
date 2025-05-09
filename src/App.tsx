import { useState, useEffect } from 'react';
import { ThreeScene } from './components/ThreeScene';
import { CursorTracker } from './components/CursorTracker';
import { Header } from './components/Header';
import { EducationTimeline } from './components/EducationTimeline';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Book, Music, Award, Pencil, Code, Linkedin, Instagram, Microscope, Leaf, ChevronDown, Globe, Laptop, Trophy, Medal, Target, Mail, Phone } from 'lucide-react';
import { ProjectCard, AchievementCard, HobbyCard } from './components/Card';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Admin } from './components/Admin';
import { supabase } from './lib/supabaseClient';

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const birthDate = new Date('2006-04-11');
  const age = calculateAge(birthDate);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id || 'hero');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error logging in:', error.message);
      return;
    }

    setIsAuthenticated(true);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Check for admin route
  useEffect(() => {
    const isAdmin = window.location.pathname === '/admin';
    setIsAdminView(isAdmin);
  }, []);

  if (isAdminView) {
    return <Admin isAuthenticated={isAuthenticated} onLogin={handleLogin} />;
  }

  const containerVariants = {
    hidden: (direction: string) => ({
      opacity: 0,
      y: direction === 'down' ? 20 : -20
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: (direction: string) => ({
      opacity: 0,
      y: direction === 'down' ? 20 : -20
    }),
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const ScrollIndicator = ({ targetId }: { targetId: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
    >
      <ChevronDown className="w-8 h-8 text-indigo-500" />
    </motion.div>
  );

  const InteractiveBg = ({ className }: { className: string }) => (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/5 dark:to-indigo-500/10 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]" />
    </motion.div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 transform origin-left z-50"
        style={{ scaleX }}
      />
      <CursorTracker />
      <ThreeScene currentSection={currentSection} />
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="relative">
        {/* Hero Section */}
        <motion.section
          id="hero"
          initial={{ opacity: 0, y: scrollDirection === 'down' ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-screen flex items-center justify-center"
        >
          <InteractiveBg className="opacity-50" />
          <div className="text-center z-10">
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-4xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Manish Chouhan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              Singer • Songwriter • Author • Tech Innovator • Badminton Player
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: scrollDirection === 'down' ? 20 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center space-x-4"
            >
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.linkedin.com/in/manish-chouhan-2301a7230/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/i_m_manish_chouhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </div>
          <ScrollIndicator targetId="education" />
        </motion.section>

        {/* Education Section */}
        <motion.section
          id="education"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          custom={scrollDirection}
          className="relative min-h-screen"
        >
          <InteractiveBg className="opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h2 
              variants={itemVariants}
              custom={scrollDirection}
              className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-center"
            >
              Education Journey
            </motion.h2>
            <EducationTimeline />
          </div>
          <ScrollIndicator targetId="skills" />
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          custom={scrollDirection}
          className="relative min-h-screen py-20"
        >
          <InteractiveBg className="opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h2 
              variants={itemVariants}
              custom={scrollDirection}
              className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-center"
            >
              Skills & Expertise
            </motion.h2>
            <Skills />
          </div>
          <ScrollIndicator targetId="experience" />
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="experience"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          custom={scrollDirection}
          className="relative min-h-screen py-20"
        >
          <InteractiveBg className="opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h2 
              variants={itemVariants}
              custom={scrollDirection}
              className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 text-center"
            >
              Experience
            </motion.h2>
            <Experience />
          </div>
          <ScrollIndicator targetId="projects" />
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={scrollDirection}
          className="relative py-20 px-4 sm:px-6 lg:px-8"
        >
          <InteractiveBg className="opacity-30" />
          <div className="max-w-7xl mx-auto">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-center mb-12"
            >
              Featured Projects
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProjectCard
                icon={
                  <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8" />
                    <Microscope className="w-8 h-8" />
                  </div>
                }
                title="Plant Disease Recognition App"
                description="AI-based application for detecting plant diseases through leaf morphology analysis."
              />
              <ProjectCard
                icon={<Code className="w-12 h-12" />}
                title="Devoq Labs"
                description="Innovative startup focused on developing cutting-edge solutions for various industries."
                link="https://keen-parfait-701bb5.netlify.app/"
              />
              <ProjectCard
                icon={<Book className="w-12 h-12" />}
                title="Published Books"
                description="Author of 'The Silence' and 'Chalo Aaj Kuch Dil Ki Baat Ho Jaye'"
              />
              <ProjectCard
                icon={<Music className="w-12 h-12" />}
                title="Music Projects"
                description="Released songs on Spotify and Instagram reels, including romantic and trap tracks."
              />
            </div>
          </div>
          <ScrollIndicator targetId="contact" />
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          custom={scrollDirection}
          className="relative min-h-screen py-20"
        >
          <InteractiveBg className="opacity-15" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h2 
              variants={itemVariants}
              custom={scrollDirection}
              className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Contact Me
            </motion.h2>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-8 backdrop-blur-sm shadow-xl">
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4"
                >
                  <Mail className="w-6 h-6 text-indigo-500" />
                  <a href="mailto:manishchouchan123@gmail.com" className="text-lg hover:text-indigo-500 transition-colors">
                    manishchouchan123@gmail.com
                  </a>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4"
                >
                  <Phone className="w-6 h-6 text-indigo-500" />
                  <span className="text-lg">8905694021 (WhatsApp only)</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default App;