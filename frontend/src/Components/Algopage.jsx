import Animate from "../animate";
import { FiDatabase, FiCpu, FiMap, FiType } from "react-icons/fi";


const AlgorithmsPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background (dark mode only) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* 📘 CONTENT */}
      <div className="relative z-10 px-6 sm:px-10 pt-20 pb-20">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-3">
          Explore Core <span className="text-[#021510] dark:text-emerald-400">Algorithms</span>
        </h1>

        <p className="text-center text-black/70 dark:text-white/70 mb-14 max-w-2xl mx-auto">
          Carefully structured problem sets to help you build strong foundations
          and advance toward competitive programming mastery.
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


          {/* Arrays */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur hover:scale-[1.02] transition">
            <div className="w-10 h-10 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
              <FiDatabase className="text-xl" />
            </div>
            <h3 className="font-semibold mb-1">Arrays</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Learn indexing, prefix sums, and optimizations
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-[#021510]/10 border border-[#021510]/40 dark:bg-emerald-500/20 dark:border-emerald-500">
              18 Problems · Beginner → Advanced
            </span>
          </div>

          {/* Dynamic Programming */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur hover:scale-[1.02] transition">
            <div className="w-10 h-10 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
              <FiCpu className="text-xl" />
            </div>
            <h3 className="font-semibold mb-1">Dynamic Programming</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Break problems into overlapping subproblems
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-[#021510]/10 border border-[#021510]/40 dark:bg-emerald-500/20 dark:border-emerald-500">
              12 Problems · Medium → Hard
            </span>
          </div>

          {/* Trees & Graphs */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur hover:scale-[1.02] transition">
            <div className="w-10 h-10 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
              <FiMap className="text-xl" />
            </div>
            <h3 className="font-semibold mb-1">Trees & Graphs</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              DFS, BFS, shortest paths, and traversals
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-[#021510]/10 border border-[#021510]/40 dark:bg-emerald-500/20 dark:border-emerald-500">
              15 Problems · Easy → Hard
            </span>
          </div>

          {/* Strings */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur hover:scale-[1.02] transition">
            <div className="w-10 h-10 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
              <FiType className="text-xl" />
            </div>
            <h3 className="font-semibold mb-1">Strings</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Pattern matching and string algorithms
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-[#021510]/10 border border-[#021510]/40 dark:bg-emerald-500/20 dark:border-emerald-500">
              10 Problems · Easy → Medium
            </span>
          </div>


        </div>

        {/* STATS */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Total Problems", value: "120+" },
            { label: "Learning Paths", value: "8" },
            { label: "Difficulty Levels", value: "Beginner → Expert" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center backdrop-blur"
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
          <div className="max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
            <h2 className="text-3xl font-extrabold mb-4">
              Start Your Algorithm Journey
            </h2>
            <p className="mb-6 text-white/90">
              Follow structured learning paths and track your progress step by step.
            </p>
            <button className="px-8 py-3 rounded-lg bg-white text-[#021510] font-semibold hover:opacity-90 transition">
              Start Practicing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlgorithmsPage;
