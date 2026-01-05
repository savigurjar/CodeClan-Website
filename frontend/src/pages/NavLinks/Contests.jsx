import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Clock } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import AppLayout from "../../Components/AppLayout";
import Animate from "../../animate";
const ContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await axiosClient.get("/contest/getAllContests");
        setContests(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContests();
  }, []);

  const now = new Date();

  const filtered = contests
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => {
      if (statusFilter === "all") return true;
      const start = new Date(c.startTime);
      const end = new Date(c.endTime);
      if (statusFilter === "upcoming") return start > now;
      if (statusFilter === "live") return start <= now && end >= now;
      if (statusFilter === "past") return end < now;
      return true;
    });

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        
        {/* 🌌 Background for dark mode */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* Header */}
        <div className="relative px-6 sm:px-10 pt-20 pb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-green-950 dark:text-white">
            Contests
          </h1>
          <p className="max-w-2xl mx-auto text-black/70 dark:text-white/70 mb-14">
            Participate in live coding contests, improve your skills, and climb the leaderboard.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="px-6 sm:px-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered flex-grow bg-white dark:bg-black dark:text-white"
          />
          <select
            className="select select-bordered bg-white dark:bg-black dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Contest Cards */}
        <div className="px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.length === 0 && (
            <div className="text-center text-black/50 dark:text-white/50 py-20">
              No contests found 🔍
            </div>
          )}

          {filtered.map((c) => {
            const start = new Date(c.startTime);
            const end = new Date(c.endTime);

            let status = "Upcoming";
            let badgeColor = "bg-blue-500 text-white";

            if (start <= now && end >= now) {
              status = "Live";
              badgeColor = "bg-green-600 text-white";
            } else if (end < now) {
              status = "Past";
              badgeColor = "bg-gray-500 text-white";
            }

            return (
              <div
                key={c._id}
                className="bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.03] transition-transform shadow-lg hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-black dark:text-white text-lg">
                    {c.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full ${badgeColor} text-xs font-semibold`}>
                    {status}
                  </span>
                </div>

                <div className="text-sm text-black/70 dark:text-white/70 mb-4 space-y-1">
                  <p>
                    <Clock size={16} className="inline mr-1" />
                    {start.toLocaleString()} - {end.toLocaleString()}
                  </p>
                  {c.tags && (
                    <p>
                      Tag:{" "}
                      {c.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="inline-block mr-2 mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  )}
                </div>

                <NavLink
                  to={`/contest/${c._id}`}
                  className="inline-block w-full text-center px-6 py-2 rounded-lg bg-green-950 hover:bg-green-700 text-white font-semibold transition"
                >
                  View Contest
                </NavLink>
              </div>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
};

export default ContestsPage;
