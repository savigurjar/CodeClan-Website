import Animate from "../../animate";

const stats = [
  { label: "Problems Solved", value: "1", sub: "Total", color: "emerald" },
  { label: "Accuracy", value: "100%", sub: "Success Rate", color: "blue" },
  { label: "Rapid Rating", value: "1200", sub: "Intermediate", color: "purple" },
  { label: "Contest Rating", value: "1200", sub: "Current", color: "orange" },
];

const submissions = [
  { name: "Union of Two Sorted Arrays", lang: "C++", status: "Accepted", level: "Hard" },
];

const DashBoardBody = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* 📦 CONTENT */}
      <div className="relative z-10 px-6 sm:px-10 pt-20 pb-20 max-w-7xl mx-auto">

        {/* 👋 Header */}
        <div className="mb-14">
          <h1 className="text-4xl font-extrabold">
            Welcome back, <span className="text-[#021510] dark:text-emerald-400">svtg361</span>
          </h1>
          <p className="text-black/60 dark:text-white/60 mt-2">
            Track your progress and keep improving every day 🚀
          </p>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                         rounded-xl p-6 backdrop-blur hover:scale-[1.03] transition"
            >
              <p className="text-sm text-black/60 dark:text-white/60">{s.label}</p>
              <p className={`text-4xl font-extrabold mt-2 text-${s.color}-500`}>
                {s.value}
              </p>
              <p className="text-xs mt-1 text-black/50 dark:text-white/50">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* 📈 ACTIVITY + SUBMISSIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Weekly Activity */}
          <div className="lg:col-span-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                          rounded-xl p-6 backdrop-blur">
            <h3 className="font-semibold mb-4">Weekly Activity</h3>
            <div className="flex items-end gap-3 h-28">
              {[20, 40, 10, 60, 30, 80, 25].map((h, i) => (
                <div
                  key={i}
                  className="w-6 rounded bg-emerald-500/80 hover:bg-emerald-400 transition"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                          rounded-xl p-6 backdrop-blur">
            <h3 className="font-semibold mb-4">Recent Submissions</h3>

            {submissions.length === 0 ? (
              <p className="text-sm text-black/50 dark:text-white/50">
                No submissions yet
              </p>
            ) : (
              submissions.map((s, i) => (
                <div
                  key={i}
                  className="bg-black/10 dark:bg-black/40 rounded-lg p-3 mb-3"
                >
                  <p className="font-medium text-sm">{s.name}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-black/60 dark:text-white/60">
                      {s.lang} · {s.level}
                    </span>
                    <span className="text-emerald-500 font-semibold">
                      {s.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🏆 LEADERBOARD PREVIEW */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Leaderboard Snapshot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["admin", "tenperformer", "rishabh10d58"].map((u, i) => (
              <div
                key={u}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                           rounded-xl p-5 backdrop-blur flex justify-between"
              >
                <span className="font-medium">
                  #{i + 1} {u}
                </span>
                <span className="text-emerald-400 font-semibold">1200</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashBoardBody;
