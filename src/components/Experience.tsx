import { motion } from 'framer-motion';
import { BookOpen, Code, Pencil, LayoutGrid as Layout, Users, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ExperienceItem {
  title: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="w-5 h-5" />,
  layout: <Layout className="w-5 h-5" />,
  book: <BookOpen className="w-5 h-5" />,
  pencil: <Pencil className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
};

const iconColors = ['from-blue-500 to-cyan-500', 'from-cyan-500 to-teal-500', 'from-teal-500 to-green-500', 'from-sky-500 to-blue-500', 'from-indigo-500 to-blue-500', 'from-blue-600 to-cyan-400'];

const defaultData: ExperienceItem[] = [
  { icon: 'code', title: "Self-Taught Programming", description: "Gained expertise in Python, Java, C++, C, and HTML through self-learning using free online platforms and open resources." },
  { icon: 'layout', title: "App Development", description: "Developed a plant disease recognition app using Python, showcasing practical application of technical skills in agriculture technology." },
  { icon: 'book', title: "Published Author", description: "Published two books—'Chalo Aaj Kuch Dil Ki Baat Ho Jaye' and 'The SILENCE'—featuring poetry on themes of overthinking and heartbreak." },
  { icon: 'pencil', title: "Creative Design", description: "Created impactful advertising and branding materials, including logo designs and ad campaigns, through freelance projects." },
  { icon: 'users', title: "Project Leadership", description: "Led and managed teams for innovative school projects and competitions, including the ATAL Marathon, ensuring successful task completion." },
  { icon: 'brain', title: "Self-Development", description: "Utilized research skills and self-discipline to acquire in-depth knowledge across diverse fields, showcasing adaptability and growth." },
];

const ExperienceCard = ({ item, index }: { item: ExperienceItem; index: number }) => {
  const color = iconColors[index % iconColors.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 card-glow transition-all duration-300 hover:-translate-y-1"
    >
      {/* Number badge */}
      <div className="absolute top-4 right-4 text-xs font-mono text-gray-700 select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Top accent */}
      <motion.div
        className={`absolute top-0 left-6 h-[2px] w-0 group-hover:w-16 bg-gradient-to-r ${color} transition-all duration-500 rounded-b`}
      />

      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg`}>
        {iconMap[item.icon] ?? iconMap.code}
      </div>
      <h3 className="text-white font-semibold text-base mb-2 group-hover:text-blue-300 transition-colors duration-200">
        {item.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
    </motion.div>
  );
};

export const Experience = () => {
  const [data, setData] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    supabase.from('experience').select('*').then(({ data: rows, error }) => {
      setData(error || !rows?.length ? defaultData : rows);
    });
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, i) => (
        <ExperienceCard key={i} item={item} index={i} />
      ))}
    </div>
  );
};
