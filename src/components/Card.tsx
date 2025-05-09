import { motion } from 'framer-motion';
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

  const CardContent = () => (
    <>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300"
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      
      <motion.div
        className="relative z-10"
        animate={{
          y: isHovered ? -2 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
      >
        <div className="text-indigo-600 dark:text-indigo-400 mb-4 transform transition-transform duration-300">
          {icon}
        </div>
        
        <motion.h3 
          className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          animate={{
            opacity: isHovered ? 0.9 : 0.7,
          }}
        >
          {description}
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
        initial={{ width: '0%' }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </>
  );

  const cardProps = {
    className: `
      relative overflow-hidden
      bg-white dark:bg-gray-800 
      p-6 rounded-lg shadow-lg 
      hover:shadow-xl transition-all duration-300
      ${isHovered ? 'shadow-indigo-500/20' : ''}
      ${className}
      ${link ? 'cursor-pointer' : ''}
    `,
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    onClick: link ? () => window.open(link, '_blank') : onClick,
    whileHover: { scale: 1.02, y: -5 },
    whileTap: { scale: 0.98 }
  };

  return (
    <motion.div {...cardProps}>
      <CardContent />
    </motion.div>
  );
};

export const ProjectCard = ({ icon, title, description, link }: CardProps) => (
  <Card
    icon={icon}
    title={title}
    description={description}
    link={link}
    className="hover:bg-gradient-to-br hover:from-white hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
  />
);

export const AchievementCard = ({ icon, title, description }: CardProps) => (
  <Card
    icon={icon}
    title={title}
    description={description}
    className="flex items-start space-x-4 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
  />
);

export const HobbyCard = ({ icon, title, description }: CardProps) => (
  <Card
    icon={icon}
    title={title}
    description={description}
    className="text-center hover:bg-gradient-to-br hover:from-white hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
  />
);