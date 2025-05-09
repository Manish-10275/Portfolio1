import { motion } from 'framer-motion';
import { BookOpen, Code, Pencil, Layout, Users, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ExperienceItem {
  title: string;
  description: string;
  icon: string;
}

const ExperienceCard = ({ title, description, icon, delay = 0 }) => {
  const getIcon = (iconName: string) => {
    const icons = {
      'code': <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      'layout': <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      'book': <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />,
      'pencil': <Pencil className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      'users': <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      'brain': <Brain className="w-6 h-6 text-pink-600 dark:text-pink-400" />
    };
    return icons[iconName] || <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          {getIcon(icon)}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

export const Experience = () => {
  const [experienceData, setExperienceData] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    const { data, error } = await supabase
      .from('experience')
      .select('*');
    
    if (error) {
      console.error('Error fetching experience:', error);
      // Fallback to default data
      setExperienceData([
        {
          icon: 'code',
          title: "Self-Taught Programming",
          description: "Gained expertise in Python, Java, C++, C, and HTML through self-learning using free online platforms like YouTube and other open resources."
        },
        {
          icon: 'layout',
          title: "App Development",
          description: "Developed a plant disease recognition app using Python, showcasing practical application of technical skills in agriculture technology."
        },
        {
          icon: 'book',
          title: "Published Author",
          description: "Published two books, 'Chalo Aaj Kuch Dil Ki Baat Ho Jaye' and 'The SILENCE,' featuring shayaris and poetry on themes of overthinking and heartbreak."
        },
        {
          icon: 'pencil',
          title: "Creative Design",
          description: "Created impactful advertising and branding materials, including logo designs and ad campaigns, through freelance projects."
        },
        {
          icon: 'users',
          title: "Project Leadership",
          description: "Led and managed teams for innovative school projects and competitions, including the ATAL Marathon, ensuring successful completion of complex tasks."
        },
        {
          icon: 'brain',
          title: "Self-Development",
          description: "Utilized research skills and self-discipline to acquire in-depth knowledge across diverse fields, showcasing adaptability and commitment to growth."
        }
      ]);
      return;
    }
    
    setExperienceData(data);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {experienceData.map((exp, index) => (
        <ExperienceCard
          key={index}
          title={exp.title}
          description={exp.description}
          icon={exp.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};