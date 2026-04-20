import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { GraduationCap, School, BookOpen, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Education {
  year: string;
  title: string;
  description: string;
}

const defaultData: Education[] = [
  { year: "2013–2018", title: "Primary Education", description: "Completed primary education with excellence, building a strong academic foundation." },
  { year: "2018–2022", title: "Secondary Education", description: "Completed 10th grade with outstanding performance across core subjects." },
  { year: "2022–2024", title: "Higher Secondary", description: "Pursued higher studies at Swami Vivekanand Govt. Model School, developing diverse skills." },
];

const icons = [School, BookOpen, GraduationCap];
const accentColors = ['from-blue-500 to-cyan-500', 'from-cyan-500 to-teal-500', 'from-teal-500 to-green-500'];

export const EducationTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [educationData, setEducationData] = useState<Education[]>([]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.8', 'end 0.2'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    supabase.from('education').select('*').order('year', { ascending: true }).then(({ data, error }) => {
      if (error || !data?.length) { setEducationData(defaultData); return; }
      setEducationData(data);
    });
  }, []);

  return (
    <div ref={containerRef} className="relative py-8">
      {/* Vertical line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] md:-translate-x-px">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-cyan-500 to-teal-500"
          style={{ height: lineHeight }}
        />
      </div>

      <div className="space-y-16">
        {educationData.map((item, index) => {
          const Icon = icons[index % icons.length];
          const isRight = index % 2 === 0;
          const accent = accentColors[index % accentColors.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isRight ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${isRight ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Content card */}
              <div className={`flex-1 ml-16 md:ml-0 ${isRight ? 'md:text-right md:pr-16' : 'md:pl-16'}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 card-glow transition-all duration-300"
                >
                  <div className={`absolute top-0 ${isRight ? 'right-0 rounded-tr-2xl' : 'left-0 rounded-tl-2xl'} h-[2px] w-16 bg-gradient-to-r ${accent}`} />

                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">{item.year}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              </div>

              {/* Icon node */}
              <div className="absolute left-8 md:static md:left-auto md:flex-shrink-0 z-10 -translate-x-1/2 md:translate-x-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-lg`}
                  style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
