import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Clock, Users, Trophy, Calendar, Search, Filter } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import AppLayout from "../../Components/AppLayout";
import Animate from "../../animate";

const ContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/contest/getAllContests");
      setContests(data.contests || []);
    } catch (err) {
      alert("Failed to load contests");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id, e) => {
    e.stopPropagation();
    try {
      setRegistrationLoading(p => ({ ...p, [id]: true }));
      await axiosClient.post(`/contest/register/${id}`);
      setContests(prev =>
        prev.map(c => (c._id === id ? { ...c, isParticipant: true } : c))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setRegistrationLoading(p => ({ ...p, [id]: false }));
    }
  };

  const filtered = contests.filter(c => {
    if (statusFilter !== "all" && c.dynamicStatus !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const statusColor = {
    upcoming: "bg-emerald-500/20 text-emerald-400",
    live: "bg-red-500/20 text-red-400",
    ended: "bg-gray-500/20 text-gray-300",
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-b-2 border-emerald-400 rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

        {/* 🌌 Background */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 px-6 sm:px-10 pt-20 pb-24 max-w-7xl mx-auto">

          {/* TITLE */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-3">
            Coding{" "}
            <span className="text-[#021510] dark:text-emerald-400">
              Contests
            </span>
          </h1>
          <p className="text-center text-black/70 dark:text-white/70 mb-14 max-w-2xl mx-auto">
            Compete, improve your rank, and challenge the best minds.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Upcoming", value: contests.filter(c => c.dynamicStatus === "upcoming").length },
              { label: "Live Now", value: contests.filter(c => c.dynamicStatus === "live").length },
              { label: "Completed", value: contests.filter(c => c.dynamicStatus === "ended").length },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center backdrop-blur"
              >
                <p className="text-3xl font-bold text-[#021510] dark:text-emerald-400">
                  {stat.value}
                </p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search contests..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-black/40 dark:text-white/40" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur focus:outline-none"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="ended">Past</option>
              </select>
            </div>
          </div>

          {/* CONTEST CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(contest => (
              <div
                key={contest._id}
                onClick={() => navigate(`/contest/${contest._id}`)}
                className="
                  bg-white/70 dark:bg-white/5
                  border border-black/10 dark:border-white/10
                  rounded-2xl p-6 backdrop-blur
                  hover:scale-[1.03] hover:shadow-xl
                  transition-all cursor-pointer
                "
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-[#021510] dark:text-white">
                    {contest.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[contest.dynamicStatus]}`}
                  >
                    {contest.dynamicStatus.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-black/60 dark:text-white/60 mb-4 line-clamp-2">
                  {contest.description}
                </p>

                <div className="space-y-2 text-sm text-black/60 dark:text-white/60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(contest.startTime).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {contest.participantsCount || 0} participants
                  </div>
                </div>

                <div className="mt-6">
                  {contest.dynamicStatus === "upcoming" && !contest.isParticipant ? (
                    <button
                      onClick={e => handleRegister(contest._id, e)}
                      disabled={registrationLoading[contest._id]}
                      className="w-full py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
                    >
                      {registrationLoading[contest._id] ? "Registering..." : "Register"}
                    </button>
                  ) : contest.isParticipant ? (
                    <div className="w-full py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-center font-semibold">
                      Registered ✓
                    </div>
                  ) : contest.dynamicStatus === "live" ? (
                    <button className="w-full py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">
                      Join Now
                    </button>
                  ) : (
                    <button className="w-full py-2 rounded-lg bg-gray-600 text-white font-semibold">
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ContestsPage;
