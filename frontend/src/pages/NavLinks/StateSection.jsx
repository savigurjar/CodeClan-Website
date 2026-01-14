import { FaBook, FaCompass, FaBolt, FaUsers, FaTrophy, FaLaptopCode } from "react-icons/fa";
import { useEffect, useState } from "react";

const StatsSection = () => {
  // Optional: animated counters
  const [totalProblems, setTotalProblems] = useState(0);
  const [learningPaths, setLearningPaths] = useState(0);
  const [difficultyLevels, setDifficultyLevels] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Simple counter animation
    const animateValue = (setter, end, duration = 1000) => {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setter(start);
        if (start >= end) clearInterval(timer);
      }, stepTime);
    };

    animateValue(setTotalProblems, 120);
    animateValue(setLearningPaths, 8);
    animateValue(setDifficultyLevels, 3);
    animateValue(setActiveUsers, 542); // example
  }, []);

  const stats = [
    { label: "Total Problems", value: `${totalProblems}+`, icon: <FaBook size={32} /> },
    { label: "Learning Paths", value: learningPaths, icon: <FaCompass size={32} /> },
    { label: "Difficulty Levels", value: "Beginner → Expert", icon: <FaBolt size={32} /> },
    { label: "Active Users", value: activeUsers, icon: <FaUsers size={32} /> },
    { label: "Top Solvers", value: "15+", icon: <FaTrophy size={32} /> },
    { label: "Code Challenges", value: "300+", icon: <FaLaptopCode size={32} /> },
  ];

  return (
    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            group
            bg-black/5 dark:bg-white/5
            border border-black/10 dark:border-white/10
            rounded-xl p-6 text-center backdrop-blur
            hover:border-emerald-500/50
            hover:shadow-lg hover:-translate-y-1
            transition-all duration-300
          "
        >
          <div className="text-3xl mb-3 text-emerald-500 flex justify-center">
            {stat.icon}
          </div>

          <p className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
            {stat.value}
          </p>

          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
