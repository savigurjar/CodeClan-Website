import Animate from "../animate";

const CompanyPracticePage = () => {
  const companies = [
    {
      name: "Netflix",
      avg: "50%",
      desc: "Prepare with Netflix interview questions and real-world experiences.",
      total: 2,
      easy: 1,
      medium: 0,
      hard: 1,
      submissions: 1,
    },
    {
      name: "Google",
      avg: "50%",
      desc: "Master Google interview questions with curated problem sets.",
      total: 31,
      easy: 8,
      medium: 19,
      hard: 4,
      submissions: 51,
    },
    {
      name: "Amazon",
      avg: "52.88%",
      desc: "Practice Amazon interview questions from easy to challenging levels.",
      total: 33,
      easy: 9,
      medium: 21,
      hard: 3,
      submissions: 55,
    },
    {
      name: "Microsoft",
      avg: "50%",
      desc: "Prepare Microsoft interview problems and track your success rate.",
      total: 30,
      easy: 7,
      medium: 20,
      hard: 3,
      submissions: 42,
    },
    {
      name: "Apple",
      avg: "33.33%",
      desc: "Tackle Apple interview questions with curated problem sets.",
      total: 3,
      easy: 0,
      medium: 2,
      hard: 1,
      submissions: 3,
    },
  ];

  return (
    <div className="relative  min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* HERO */}
      <div className="relative z-10 px-6 sm:px-12 pt-20 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Practice by Company
        </h1>
        <p className="text-black/70 dark:text-white/70 max-w-2xl mx-auto">
          Prepare for interviews at top tech companies with curated problem sets and real interview experiences.
        </p>
      </div>

      {/* COMPANY CARDS */}
      {/* <div className="relative z-10 px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
        {companies.map((company) => (
          <div
            key={company.name}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur hover:scale-[1.03] transition hover:shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-1 text-[#021510] dark:text-emerald-400">{company.name}</h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-3">{company.desc}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex justify-between"><span>Total Problems:</span> <span>{company.total}</span></div>
              <div className="flex justify-between"><span>Easy:</span> <span>{company.easy}</span></div>
              <div className="flex justify-between"><span>Medium:</span> <span>{company.medium}</span></div>
              <div className="flex justify-between"><span>Hard:</span> <span>{company.hard}</span></div>
              <div className="flex justify-between"><span>Success Rate:</span> <span>{company.avg}</span></div>
              <div className="flex justify-between"><span>Total Submissions:</span> <span>{company.submissions}</span></div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[#021510] dark:bg-emerald-600 text-white font-semibold hover:opacity-90 transition">
              Start Practicing
            </button>
          </div>
        ))}
      </div> */}

   <div className="relative px-6 sm:px-12 mt-12 mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {companies.map((company) => (
    <div
      key={company.name}
      className="
        bg-white
        dark:bg-white/5
        border border-black/10 dark:border-white/10
        rounded-3xl p-6
        backdrop-blur
        shadow-md hover:shadow-xl
        hover:-translate-y-1
        transition-all
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
          {company.name}
        </h3>

        <span
          className="
            px-3 py-1 text-xs font-semibold rounded-full
            bg-[#021510]/10 text-[#021510]
            dark:bg-emerald-500/20 dark:text-emerald-300
          "
        >
          {company.avg} Success
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-black/70 dark:text-white/70 mb-4">
        {company.desc}
      </p>

{/* Stats */}
<div className="grid grid-cols-2 gap-3 text-sm mb-6">
  <div className="flex items-center justify-between">
    <span className="text-black/70 dark:text-white/60">Total</span>
    <span className="font-semibold text-[#021510] dark:text-white">
      {company.total}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="px-2 py-0.5 rounded-md text-xs border
      border-green-500/40 text-green-700
      dark:border-green-400/40 dark:text-green-300">
      Easy
    </span>
    <span className="font-semibold text-green-700 dark:text-green-300">
      {company.easy}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="px-2 py-0.5 rounded-md text-xs border
      border-yellow-500/40 text-yellow-700
      dark:border-yellow-400/40 dark:text-yellow-300">
      Medium
    </span>
    <span className="font-semibold text-yellow-700 dark:text-yellow-300">
      {company.medium}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="px-2 py-0.5 rounded-md text-xs border
      border-red-500/40 text-red-700
      dark:border-red-400/40 dark:text-red-300">
      Hard
    </span>
    <span className="font-semibold text-red-700 dark:text-red-300">
      {company.hard}
    </span>
  </div>

  <div className="flex items-center justify-between col-span-2">
    <span className="text-black/70 dark:text-white/60">Submissions</span>
    <span className="font-semibold text-[#021510] dark:text-white">
      {company.submissions}
    </span>
  </div>
</div>


      {/* Button */}
      <button
        className="
          w-full py-3 rounded-lg font-semibold
          bg-[#021510] text-white
          dark:bg-emerald-600
          hover:bg-[#03261d] dark:hover:bg-emerald-700
          transition
        "
      >
        Start Practicing
      </button>
    </div>
  ))}
</div>



      {/* CTA */}
      <div className="mt-24 px-6 sm:px-12 mb-20 relative">
        <div className="relative overflow-hidden max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
         <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-4">
            Ready to Ace Your Interviews?
          </h2>
          <p className="mb-6 text-white/90">
            Practice company-specific problems, improve your success rate, and land your dream job.
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
  );
};

export default CompanyPracticePage;
