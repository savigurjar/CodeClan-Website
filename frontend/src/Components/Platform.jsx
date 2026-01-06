import { FaLaptopCode, FaGlobe, FaBolt, FaUsers } from "react-icons/fa";
import Animate from "../animate";

const PlatformFeaturesPage = () => {
  const features = [
    {
      title: "Practice Problems",
      icon: <FaLaptopCode size={24} />,
      desc: "Solve 2000+ coding problems, from beginner to expert, with step-by-step solutions.",
    },
    {
      title: "Global Contests",
      icon: <FaGlobe size={24} />,
      desc: "Join weekly competitions and see how you rank against coders worldwide.",
    },
    {
      title: "Real-time Battles",
      icon: <FaBolt size={24} />,
      desc: "Compete in live coding battles with anti-cheat protection and instant feedback.",
    },
    {
      title: "Community",
      icon: <FaUsers size={24} />,
      desc: "Connect with fellow developers, share solutions, and grow together.",
    },
  ];

  const stats = [
    { label: "Problems Solved", value: "1.2M+" },
    { label: "Active Users", value: "50K+" },
    { label: "Weekly Contests", value: "52" },
    { label: "Learning Paths", value: "15" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background animation */}
      <div className="hidden dark:block ">
        <Animate />
      </div>

      {/* HERO */}
      <div className="relative px-6 sm:px-12 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-black dark:text-white">
          Everything You Need to Excel
        </h1>
        <p className="text-black/70 dark:text-white/70 max-w-2xl mx-auto mb-10">
          Our comprehensive platform provides all the tools, challenges, and community support to help you become an exceptional programmer.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="
        bg-white dark:bg-white/5
        border border-black/10 dark:border-white/10
        rounded-xl p-6 text-center
        backdrop-blur
        hover:shadow-md transition
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

      </div>

      {/* FEATURE CARDS */}
     <div className="relative px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
  {features.map((feature) => (
    <div
      key={feature.title}
      className="
        bg-white dark:bg-white/5
        border border-black/10 dark:border-white/10
        rounded-2xl p-6
        backdrop-blur
        hover:scale-[1.03]
        hover:shadow-lg
        transition-all
      "
    >
      {/* Icon */}
      <div
        className="
          w-12 h-12 flex items-center justify-center mb-4
          rounded-lg
          bg-[#021510]/10 text-[#021510]
          dark:bg-emerald-500/20 dark:text-emerald-300
        "
      >
        {feature.icon}
      </div>

      <h3 className="font-semibold text-xl mb-2 text-green-950 dark:text-white">
        {feature.title}
      </h3>

      <p className="text-sm text-black/60 dark:text-white/60 mb-5">
        {feature.desc}
      </p>

      <button
        className="
          px-4 py-2 rounded-lg
          bg-[#021510] text-white
          dark:bg-emerald-600
          font-semibold
         hover:bg-[#03261d]
          dark:hover:bg-emerald-700
          transition
        "
      >
        Explore
      </button>
    </div>
  ))}
</div>


      {/* CTA */}
      <div className="mt-28 px-6 sm:px-12 mb-20 relative z-10">
        <div className="relative overflow-hidden max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-4 text-white">
            Ready to Boost Your Programming Career?
          </h2>
          <p className="mb-6 text-white/90">
            Join thousands of developers practicing, competing, and learning every day.
          </p>
          <button className="
              px-8 py-3 rounded-lg
              bg-white text-[#021510]
              font-semibold
              hover:bg-emerald-100 hover:scale-105
              transition-all
            ">
            Start Practicing Now
          </button>
        </div>
      </div>

    </div>
  );
};

export default PlatformFeaturesPage;
