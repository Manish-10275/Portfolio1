import { motion } from 'framer-motion';
import { Music, Pencil, Code, Layout, Lightbulb, Users, MessageSquare, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Skill {
  category: string;
  name: string;
}

interface SkillCategory {
  title: string;
  icon: JSX.Element;
  skills: string[];
}

const SkillCategory = ({ title, skills, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-lg backdrop-blur-sm"
  >
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-3">{title}</h3>
    </div>
    <ul className="space-y-2">
      {skills.map((skill, index) => (
        <li key={index} className="flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2" />
          <span className="text-gray-700 dark:text-gray-300">{skill}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export const Skills = () => {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*');
    
    if (error) {
      console.error('Error fetching skills:', error);
      return;
    }

    setSkillsData(data);
  };

  const organizeSkills = (): SkillCategory[] => {
    const defaultCategories: SkillCategory[] = [
      {
        title: "Creative Skills",
        icon: <Music className="w-6 h-6 text-indigo-500" />,
        skills: []
      },
      {
        title: "Programming Skills",
        icon: <Code className="w-6 h-6 text-blue-500" />,
        skills: []
      },
      {
        title: "Technical Skills",
        icon: <Layout className="w-6 h-6 text-green-500" />,
        skills: []
      },
      {
        title: "Leadership and Innovation",
        icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
        skills: []
      },
      {
        title: "Other Skills",
        icon: <Globe className="w-6 h-6 text-purple-500" />,
        skills: []
      }
    ];

    // If no data from Supabase, return default skills
    if (!skillsData.length) {
      return [
        {
          title: "Creative Skills",
          icon: <Music className="w-6 h-6 text-indigo-500" />,
          skills: [
            "Singing and Music Creation",
            "Songwriting in Hindi and English",
            "Sher and Poetry Writing",
            "Book Writing and Publishing"
          ]
        },
        {
          title: "Programming Skills",
          icon: <Code className="w-6 h-6 text-blue-500" />,
          skills: [
            "Python",
            "Java",
            "C++",
            "C",
            "HTML",
            "SQL",
            "App Development"
          ]
        },
        {
          title: "Technical Skills",
          icon: <Layout className="w-6 h-6 text-green-500" />,
          skills: [
            "Ad Design",
            "Logo Design",
            "Copywriting",
            "Social Media Marketing",
            "Research Skills"
          ]
        },
        {
          title: "Leadership and Innovation",
          icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
          skills: [
            "Team Management",
            "Creative Problem-Solving",
            "Startup Involvement",
            "Project Management"
          ]
        },
        {
          title: "Other Skills",
          icon: <Globe className="w-6 h-6 text-purple-500" />,
          skills: [
            "Public Speaking and Presentation",
            "Content Creation",
            "Event Organization",
            "Multilingual Writing"
          ]
        }
      ];
    }

    // Organize skills from Supabase data
    const categories = defaultCategories.map(cat => ({
      ...cat,
      skills: skillsData
        .filter(skill => skill.category === cat.title)
        .map(skill => skill.name)
    }));

    return categories;
  };

  const skillCategories = organizeSkills();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {skillCategories.map((category, index) => (
        <SkillCategory
          key={index}
          title={category.title}
          skills={category.skills}
          icon={category.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};