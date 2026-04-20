import { motion } from 'framer-motion';
import { Music, Code, LayoutGrid as Layout, Lightbulb, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Skill {
  category: string;
  name: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: string[];
}

const defaultCategories: SkillCategory[] = [
  {
    title: "Creative Skills",
    icon: <Music className="w-5 h-5" />,
    color: 'from-blue-500 to-blue-600',
    skills: ["Singing & Music Creation", "Songwriting (Hindi & English)", "Poetry & Shayari", "Book Writing & Publishing"],
  },
  {
    title: "Programming",
    icon: <Code className="w-5 h-5" />,
    color: 'from-cyan-500 to-cyan-600',
    skills: ["Python", "Java", "C / C++", "HTML & CSS", "SQL", "App Development"],
  },
  {
    title: "Technical Skills",
    icon: <Layout className="w-5 h-5" />,
    color: 'from-teal-500 to-teal-600',
    skills: ["Ad & Logo Design", "Copywriting", "Social Media Marketing", "Research & Analysis"],
  },
  {
    title: "Leadership",
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'from-sky-500 to-sky-600',
    skills: ["Team Management", "Creative Problem-Solving", "Startup Involvement", "Project Management"],
  },
  {
    title: "Other Skills",
    icon: <Globe className="w-5 h-5" />,
    color: 'from-indigo-500 to-indigo-600',
    skills: ["Public Speaking", "Content Creation", "Event Organization", "Multilingual Writing"],
  },
];

const SkillTag = ({ name, delay }: { name: string; delay: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-300 text-xs font-medium hover:border-blue-500/40 hover:text-blue-300 transition-all duration-200 cursor-default"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0" />
    {name}
  </motion.span>
);

const CategoryCard = ({ category, delay }: { category: SkillCategory; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 card-glow transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>
        {category.icon}
      </div>
      <h3 className="text-white font-semibold">{category.title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {category.skills.map((skill, i) => (
        <SkillTag key={i} name={skill} delay={delay + i * 0.04} />
      ))}
    </div>
  </motion.div>
);

export const Skills = () => {
  const [categories, setCategories] = useState<SkillCategory[]>(defaultCategories);

  useEffect(() => {
    supabase.from('skills').select('*').then(({ data, error }) => {
      if (error || !data?.length) return;
      const built = defaultCategories.map(cat => ({
        ...cat,
        skills: data.filter(s => s.category === cat.title).map(s => s.name),
      })).filter(c => c.skills.length > 0);
      if (built.some(c => c.skills.length > 0)) setCategories(built);
    });
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat, i) => (
        <CategoryCard key={i} category={cat} delay={i * 0.08} />
      ))}
    </div>
  );
};
