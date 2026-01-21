import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Clock, 
  Users, 
  Trophy, 
  Calendar, 
  Search, 
  Filter,
  Award,
  Star,
  TrendingUp,
  ChevronRight,
  PlusCircle,
  Eye,
  Zap,
  CalendarDays
} from "lucide-react";
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
      console.error("Failed to load contests:", err);
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

  const statusConfig = {
    upcoming: { 
      label: "UPCOMING", 
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: CalendarDays,
      bg: "from-emerald-500/5 to-emerald-500/10"
    },
    live: { 
      label: "LIVE NOW", 
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: Zap,
      bg: "from-red-500/5 to-red-500/10"
    },
    ended: { 
      label: "ENDED", 
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      icon: Award,
      bg: "from-gray-500/5 to-gray-500/10"
    },
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
          {/* 🌌 Animated Background (dark only) */}
          <div className="hidden dark:block">
            <Animate />
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-400/30 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <Trophy className="absolute inset-0 m-auto w-8 h-8 text-emerald-400" />
              </div>
              <p className="mt-6 text-lg font-medium text-[#021510] dark:text-emerald-400">
                Loading contests...
              </p>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                Preparing your competition dashboard
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

        {/* 🌌 Animated Background (dark only) */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-24 max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-1 bg-emerald-400 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <div className="w-12 h-1 bg-emerald-400 rounded-full"></div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
              Coding <span className="text-[#021510] dark:text-emerald-400">Contests</span>
            </h1>
            
            <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto mb-10">
              Compete, improve your rank, challenge the best minds, and climb the leaderboard.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {[
                { 
                  label: "Total Contests", 
                  value: contests.length,
                  icon: Trophy,
                  color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                },
                { 
                  label: "Upcoming", 
                  value: contests.filter(c => c.dynamicStatus === "upcoming").length,
                  icon: Calendar,
                  color: "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                },
                { 
                  label: "Live Now", 
                  value: contests.filter(c => c.dynamicStatus === "live").length,
                  icon: Zap,
                  color: "bg-red-500/20 text-red-600 dark:text-red-400"
                },
                { 
                  label: "Completed", 
                  value: contests.filter(c => c.dynamicStatus === "ended").length,
                  icon: Award,
                  color: "bg-gray-500/20 text-gray-600 dark:text-gray-400"
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                      rounded-xl p-4 backdrop-blur hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                        <Icon className={stat.color.split(' ')[1]} size={20} />
                      </div>
                      <div className="text-2xl font-bold text-[#021510] dark:text-emerald-300">
                        {stat.value}
                      </div>
                    </div>
                    <p className="text-sm text-black/60 dark:text-white/60 font-medium">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FILTERS SECTION */}
          <div className="mb-10">
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
              rounded-2xl p-6 backdrop-blur">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#021510] dark:text-white mb-1">
                    Find Your Competition
                  </h2>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Filter contests by status or search by name
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                  <TrendingUp size={16} />
                  <span>Sorted by: Start Date</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* SEARCH */}
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="text-black/40 dark:text-white/40" size={20} />
                  </div>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search contests by name, description..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl 
                      bg-white/80 dark:bg-white/5 
                      border border-black/10 dark:border-white/10 
                      backdrop-blur 
                      focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                      transition-all placeholder:text-black/40 dark:placeholder:text-white/40"
                  />
                </div>

                {/* FILTERS */}
                <div className="flex gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Filter className="text-black/40 dark:text-white/40" size={20} />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-3.5 rounded-xl appearance-none
                        bg-white/80 dark:bg-white/5 
                        border border-black/10 dark:border-white/10 
                        backdrop-blur 
                        focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                        transition-all cursor-pointer"
                    >
                      <option value="all">All Contests</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live Now</option>
                      <option value="ended">Past Contests</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="text-black/40 dark:text-white/40 rotate-90" size={20} />
                    </div>
                  </div>

                  <button
                    onClick={() => fetchContests()}
                    className="px-4 py-3.5 rounded-xl 
                      bg-white/80 dark:bg-white/5 
                      border border-black/10 dark:border-white/10 
                      backdrop-blur hover:bg-white dark:hover:bg-white/10 
                      transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {/* FILTER TAGS */}
              <div className="flex flex-wrap gap-2 mt-4">
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 
                    bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 
                    rounded-full text-sm font-medium border border-emerald-500/30">
                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    <button 
                      onClick={() => setStatusFilter("all")}
                      className="p-0.5 hover:bg-emerald-500/30 rounded-full"
                    >
                      ×
                    </button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 
                    bg-blue-500/20 text-blue-600 dark:text-blue-400 
                    rounded-full text-sm font-medium border border-blue-500/30">
                    Search: "{search}"
                    <button 
                      onClick={() => setSearch("")}
                      className="p-0.5 hover:bg-blue-500/30 rounded-full"
                    >
                      ×
                    </button>
                  </span>
                )}
                <span className="inline-flex items-center gap-2 px-3 py-1.5 
                  bg-gray-500/20 text-gray-600 dark:text-gray-400 
                  rounded-full text-sm font-medium border border-gray-500/30">
                  Showing {filtered.length} of {contests.length} contests
                </span>
              </div>
            </div>
          </div>

          {/* CONTEST CARDS GRID */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filtered.map(contest => {
                const status = statusConfig[contest.dynamicStatus];
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={contest._id}
                    onClick={() => navigate(`/contest/${contest._id}`)}
                    className={`
                      group relative overflow-hidden rounded-2xl p-6 
                      backdrop-blur cursor-pointer
                      bg-gradient-to-br ${status.bg}
                      border border-black/10 dark:border-white/10
                      hover:scale-[1.02] hover:shadow-2xl
                      transition-all duration-300
                    `}
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <div className="absolute top-4 right-4 w-24 h-24 border-2 border-emerald-400 rounded-full"></div>
                      <div className="absolute top-8 right-8 w-16 h-16 border border-emerald-400 rounded-full"></div>
                    </div>

                    {/* Contest Header */}
                    <div className="relative mb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <StatusIcon size={16} className={status.color.split(' ')[1]} />
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color} border`}>
                              {status.label}
                            </span>
                          </div>
                          <h3 className="font-bold text-xl text-[#021510] dark:text-white line-clamp-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                            {contest.name}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/contest/${contest._id}`);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} className="text-black/40 dark:text-white/40" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-black/60 dark:text-white/60 mt-3 line-clamp-2">
                        {contest.description || "Test your coding skills in this exciting competition."}
                      </p>
                    </div>

                    {/* Contest Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Calendar size={14} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium text-[#021510] dark:text-white">
                            {new Date(contest.startTime).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-black/60 dark:text-white/60">
                            {new Date(contest.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-[#021510] dark:text-white">
                            {contest.duration ? `${contest.duration} mins` : '2 hours'}
                          </div>
                          <div className="text-xs text-black/60 dark:text-white/60">
                            Contest Duration
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Users size={14} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-[#021510] dark:text-white">
                            {contest.participantsCount || 0} participants
                          </div>
                          <div className="text-xs text-black/60 dark:text-white/60">
                            Registered so far
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="relative">
                      {contest.dynamicStatus === "upcoming" && !contest.isParticipant ? (
                        <button
                          onClick={e => handleRegister(contest._id, e)}
                          disabled={registrationLoading[contest._id]}
                          className="w-full py-3 rounded-xl 
                            bg-gradient-to-r from-emerald-500 to-emerald-600 
                            hover:from-emerald-600 hover:to-emerald-700
                            text-white font-semibold 
                            hover:shadow-lg hover:shadow-emerald-500/25
                            transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
                        >
                          {registrationLoading[contest._id] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Registering...
                            </>
                          ) : (
                            <>
                              <PlusCircle size={18} />
                              Register Now
                            </>
                          )}
                        </button>
                      ) : contest.isParticipant ? (
                        <div className="w-full py-3 rounded-xl 
                          bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 
                          border border-emerald-500/30
                          text-emerald-600 dark:text-emerald-400 text-center font-semibold
                          flex items-center justify-center gap-2">
                          <Star size={16} />
                          Registered ✓
                        </div>
                      ) : contest.dynamicStatus === "live" ? (
                        <button 
                          className="w-full py-3 rounded-xl 
                            bg-gradient-to-r from-red-500 to-red-600 
                            hover:from-red-600 hover:to-red-700
                            text-white font-semibold 
                            hover:shadow-lg hover:shadow-red-500/25
                            transition-all duration-300
                            flex items-center justify-center gap-2"
                        >
                          <Zap size={16} />
                          Join Live Contest
                        </button>
                      ) : (
                        <button 
                          className="w-full py-3 rounded-xl 
                            bg-gradient-to-r from-gray-600 to-gray-700 
                            hover:from-gray-700 hover:to-gray-800
                            text-white font-semibold 
                            hover:shadow-lg hover:shadow-gray-500/25
                            transition-all duration-300
                            flex items-center justify-center gap-2"
                        >
                          <Award size={16} />
                          View Results
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-black/40 dark:text-white/40" />
              </div>
              <h3 className="text-2xl font-bold text-[#021510] dark:text-white mb-3">
                No Contests Found
              </h3>
              <p className="text-black/60 dark:text-white/60 max-w-md mx-auto mb-8">
                {search || statusFilter !== "all" 
                  ? "No contests match your current filters. Try adjusting your search criteria."
                  : "There are no contests available at the moment. Check back soon!"
                }
              </p>
              {(search || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="px-6 py-3 rounded-xl 
                    bg-gradient-to-r from-emerald-500 to-emerald-600 
                    hover:from-emerald-600 hover:to-emerald-700
                    text-white font-semibold 
                    transition-all duration-300"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* FOOTER CTA */}
          <div className="mt-16">
            <div className="relative overflow-hidden rounded-2xl 
              bg-gradient-to-r from-[#021510] to-emerald-900 
              dark:from-emerald-900 dark:to-emerald-950
              p-8 md:p-12">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Compete?
                </h2>
                <p className="text-emerald-100 dark:text-emerald-300 mb-8 max-w-2xl mx-auto">
                  Join our coding contests to test your skills, climb the leaderboard, 
                  and earn recognition in the developer community.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-6 py-3 bg-white text-[#021510] font-semibold rounded-xl 
                      hover:bg-emerald-100 transition-all hover:scale-105"
                  >
                    Browse All Contests
                  </button>
                  <button
                    className="px-6 py-3 bg-transparent border-2 border-white text-white 
                      font-semibold rounded-xl hover:bg-white/10 transition-all"
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContestsPage;