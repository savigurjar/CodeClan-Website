import Animate from "../animate";
import { FiDatabase, FiCpu, FiMap, FiType } from "react-icons/fi";

const AlgorithmsPage = () => {
  const cards = [
    {
      title: "Arrays",
      icon: <FiDatabase className="text-xl" />,
      desc: "Learn indexing, prefix sums, and optimizations",
      problems: "18 Problems · Beginner → Advanced",
    },
    {
      title: "Dynamic Programming",
      icon: <FiCpu className="text-xl" />,
      desc: "Break problems into overlapping subproblems",
      problems: "12 Problems · Medium → Hard",
    },
    {
      title: "Trees & Graphs",
      icon: <FiMap className="text-xl" />,
      desc: "DFS, BFS, shortest paths, and traversals",
      problems: "15 Problems · Easy → Hard",
    },
    {
      title: "Strings",
      icon: <FiType className="text-xl" />,
      desc: "Pattern matching and string algorithms",
      problems: "10 Problems · Easy → Medium",
    },
  ];

  const stats = [
    { label: "Total Problems", value: "120+" },
    { label: "Learning Paths", value: "8" },
    { label: "Difficulty Levels", value: "Beginner → Expert" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background (dark mode) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* 📘 CONTENT */}
      <div className="relative z-10 px-6 sm:px-10 pt-20 pb-20">

        {/* TITLE */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-3">
          Explore Core{" "}
          <span className="text-[#021510] dark:text-emerald-400">
            Algorithms
          </span>
        </h1>
        <p className="text-center text-black/70 dark:text-white/70 mb-14 max-w-2xl mx-auto">
          Carefully structured problem sets to help you build strong foundations
          and advance toward competitive programming mastery.
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="
                bg-white/5 dark:bg-white/5
                border border-black/10 dark:border-white/10
                rounded-2xl p-6 backdrop-blur
                hover:scale-[1.03] hover:shadow-lg transition-all
              "
            >
              {/* Icon */}
              <div className="
                w-11 h-11 rounded-lg
                bg-[#021510]/10 dark:bg-emerald-500/20
                text-[#021510] dark:text-emerald-300
                flex items-center justify-center mb-4
              ">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg mb-1 text-green-950 dark:text-white">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-black/60 dark:text-white/60 mb-5">
                {card.desc}
              </p>

              {/* Problems Badge */}
              <span className="
                inline-block text-xs font-semibold
                px-3 py-1 rounded-full
                border border-[#021510]/30 text-[#021510]
                dark:border-emerald-400/40 dark:text-emerald-300
                bg-[#021510]/5 dark:bg-emerald-500/10
              ">
                {card.problems}
              </span>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                bg-black/5 dark:bg-white/5
                border border-black/10 dark:border-white/10
                rounded-xl p-6 text-center backdrop-blur
              "
            >
              <p className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
                {stat.value}
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24">
          <div className="
            relative overflow-hidden
            max-w-3xl mx-auto rounded-2xl
            p-10 text-center
            bg-[#021510] text-white
            dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950
            shadow-xl
          ">
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-extrabold mb-4">
              Start Your Algorithm Journey
            </h2>
            <p className="mb-6 text-white/90">
              Follow structured learning paths and track your progress step by step.
            </p>
            <button className="
              px-8 py-3 rounded-lg
              bg-white text-[#021510]
              font-semibold
              hover:bg-emerald-100 hover:scale-105
              transition-all
            ">
              Start Practicing 
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlgorithmsPage;
