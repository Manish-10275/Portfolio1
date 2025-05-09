import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { GraduationCap, School, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Education {
  year: string;
  title: string;
  description: string;
}

export const EducationTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [educationData, setEducationData] = useState<Education[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('year', { ascending: true });
    
    if (error) {
      console.error('Error fetching education:', error);
      // Fallback to default data if fetch fails
      setEducationData([
        {
          year: "2013-2018",
          title: "Primary Education",
          description: "Completed primary education with excellence"
        },
        {
          year: "2018-2022",
          title: "Secondary Education",
          description: "Completed 10th grade with outstanding performance"
        },
        {
          year: "2022-2024",
          title: "Higher Secondary",
          description: "Currently awaiting results from Swami Vivekanand Govt. Model School"
        }
      ]);
      return;
    }
    
    setEducationData(data);
  };

  const graduationCapProgress = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const getIcon = (index: number) => {
    const icons = [<School className="w-6 h-6" />, <BookOpen className="w-6 h-6" />, <GraduationCap className="w-6 h-6" />];
    return icons[index] || icons[0];
  };

  return (
    <div ref={containerRef} className="relative min-h-[50vh] md:min-h-screen py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/30 dark:to-purple-950/30" />
      
      {/* Road */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2">
        <motion.div 
          className="absolute top-0 bottom-0 w-full bg-indigo-500"
          style={{ scaleY: graduationCapProgress, transformOrigin: 'top' }}
        />
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ opacity }}
      >
        {educationData.map((education, index) => (
          <div key={index} className="mb-12 flex items-center">
            <div className="flex-1 text-right mr-8 pr-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{education.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{education.year}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{education.description}</p>
            </div>
            <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 shadow">
              {getIcon(index)}
            </div>
            <div className="flex-1 ml-8" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}