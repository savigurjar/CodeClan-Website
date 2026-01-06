import Animate from "../../animate";
import { useState } from "react";

const stats = [
  { label: "Problems Solved", value: "1", sub: "Total", color: "emerald" },
  { label: "Accuracy", value: "100%", sub: "Success Rate", color: "blue" },
  { label: "Rapid Rating", value: "1200", sub: "Intermediate", color: "purple" },
  { label: "Contest Rating", value: "1200", sub: "Current", color: "orange" },
];

const submissions = [
  { name: "Union of Two Sorted Arrays", lang: "C++", status: "Accepted", level: "Hard", year: 2026 },
  { name: "Binary Search Tree", lang: "Python", status: "Accepted", level: "Medium", year: 2025 },
];

const DashBoardBody = () => {
  const [profile, setProfile] = useState({
    username: "svtg361",
    image: "",
    bio: "Keep improving every day 🚀",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfile({ ...profile, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Group submissions by year
  const submissionsByYear = submissions.reduce((acc, s) => {
    if (!acc[s.year]) acc[s.year] = [];
    acc[s.year].push(s);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* 📦 CONTENT */}
      <div className="relative z-10 px-6 sm:px-10 pt-20 pb-20 max-w-7xl mx-auto">

        {/* 👤 Profile Section */}
        <div className="mb-14 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500">
            {profile.image ? (
              <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/10 dark:bg-white/10">
                <span className="text-black/50 dark:text-white/50">Upload</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">
              Welcome back, <span className="text-[#021510] dark:text-emerald-400">{profile.username}</span>
            </h1>
            <p className="text-black/60 dark:text-white/60 mt-2">{profile.bio}</p>
          </div>
        </div>

        {/* 📊 Stats */}
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
              <p className="text-xs mt-1 text-black/50 dark:text-white/50">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* 📈 Activity + Recent Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">

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
              <p className="text-sm text-black/50 dark:text-white/50">No submissions yet</p>
            ) : (
              submissions.map((s, i) => (
                <div key={i} className="bg-black/10 dark:bg-black/40 rounded-lg p-3 mb-3">
                  <p className="font-medium text-sm">{s.name}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-black/60 dark:text-white/60">
                      {s.lang} · {s.level}
                    </span>
                    <span className="text-emerald-500 font-semibold">{s.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🗓 Submissions by Year */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Submissions by Year</h2>
          {Object.keys(submissionsByYear)
            .sort((a, b) => b - a)
            .map((year) => (
              <div key={year} className="mb-8">
                <h3 className="font-semibold mb-4">{year}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submissionsByYear[year].map((s, i) => (
                    <div
                      key={i}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur"
                    >
                      <p className="font-medium text-sm">{s.name}</p>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-black/60 dark:text-white/60">{s.lang} · {s.level}</span>
                        <span className="text-emerald-500 font-semibold">{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* 🏆 Leaderboard */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Leaderboard Snapshot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["admin", "tenperformer", "rishabh10d58"].map((u, i) => (
              <div
                key={u}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                           rounded-xl p-5 backdrop-blur flex justify-between"
              >
                <span className="font-medium">#{i + 1} {u}</span>
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
