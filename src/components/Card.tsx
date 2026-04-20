import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  link?: string;
}

export const Card = ({ icon, title, description, className = '', onClick, link }: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={link ? () => window.open(link, '_blank') : onClick}
      className={`relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm cursor-pointer card-glow transition-all duration-300 p-6 ${className}`}
    >
      {/* animated top line */}
      <motion.div
        className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent"
        initial={{ width: '0%' }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.4 }}
      />

      {/* corner glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-all duration-500 blur-xl" />

      <div className="relative z-10">
        <div className="text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
        {link && (
          <div className="mt-4 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span>View Project</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ProjectCard = ({ icon, title, description, link }: CardProps) => (
  <Card icon={icon} title={title} description={description} link={link} />
);

export const AchievementCard = ({ icon, title, description }: CardProps) => (
  <Card icon={icon} title={title} description={description} />
);

export const HobbyCard = ({ icon, title, description }: CardProps) => (
  <Card icon={icon} title={title} description={description} />
);
