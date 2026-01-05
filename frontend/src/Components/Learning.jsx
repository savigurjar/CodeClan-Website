import { FaDatabase, FaProjectDiagram, FaLaptopCode, FaSeedling, FaRobot } from "react-icons/fa";
import Animate from "../animate";

const LearningPathsPage = () => {
  const paths = [
    {
      title: "Data Structures & Algorithms",
      icon: <FaDatabase size={24} />,
      desc: "Master the fundamentals of DSA with comprehensive tutorials and practice problems",
    },
    {
      title: "System Design",
      icon: <FaProjectDiagram size={24} />,
      desc: "Learn how to design scalable systems and architect robust applications",
    },
    {
      title: "Full Stack Development",
      icon: <FaLaptopCode size={24} />,
      desc: "Build complete web applications from frontend to backend with modern technologies",
    },
    {
      title: "Spring Boot",
      icon: <FaSeedling size={24} />,
      desc: "Master Java Spring Boot framework for enterprise application development",
    },
    {
      title: "Generative AI",
      icon: <FaRobot size={24} />,
      desc: "Learn how to build AI-powered applications and generate content with modern AI tools",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* Background animation (dark mode only) */}
      <div className="hidden dark:block ">
        <Animate />
      </div>

      {/* Header */}
      <div className="relative px-6 sm:px-10 pt-20 pb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-3 text-black dark:text-white">
          Learn and Upskill
        </h1>
        <p className="max-w-2xl mx-auto text-black/70 dark:text-white/70 mb-14">
          Master essential skills with our curated learning paths and comprehensive tutorials.
        </p>
      </div>

      {/* Cards */}
      <div className="px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {paths.map((path) => (
          <div
            key={path.title}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur hover:scale-[1.02] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
              {path.icon}
            </div>
            <h3 className="font-semibold mb-1 text-black dark:text-white">{path.title}</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">{path.desc}</p>
            <span className="text-xs px-3 py-1 rounded-full bg-[#021510]/10 border border-[#021510]/40 dark:bg-emerald-500/20 dark:border-emerald-500">
              Start Learning
            </span>
          </div>
        ))}
      </div>



{/* CTA */}
<div className="mt-10 mb-20 relative z-10">
  <div className="max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
    <h2 className="text-3xl font-extrabold mb-4 text-white">
      Ready to Level Up Your Skills?
    </h2>
    <p className="mb-6 text-white/90">
      Explore our learning paths, practice with curated problems, and become industry-ready.
    </p>
    <button className="px-8 py-3 rounded-lg bg-white text-[#021510] font-semibold hover:opacity-90 transition">
      Start Learning
    </button>
  </div>
</div>


    </div>
  );
};

export default LearningPathsPage;
