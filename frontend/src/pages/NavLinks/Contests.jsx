import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
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
      console.error("Failed to fetch contests:", err);
      alert("Failed to load contests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (contestId, e) => {
    e?.stopPropagation();
    try {
      setRegistrationLoading(prev => ({ ...prev, [contestId]: true }));
      await axiosClient.post(`/contest/register/${contestId}`);
      
      setContests(prev => prev.map(contest => 
        contest._id === contestId 
          ? { ...contest, isParticipant: true } 
          : contest
      ));
      
      alert("Successfully registered for the contest!");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setRegistrationLoading(prev => ({ ...prev, [contestId]: false }));
    }
  };

  const handleCardClick = (contestId) => {
    navigate(`/contest/${contestId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-blue-500";
      case "live": return "bg-green-600";
      case "ended": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const filteredContests = contests.filter(contest => {
    if (statusFilter !== "all" && contest.dynamicStatus !== statusFilter) {
      return false;
    }
    if (search && !contest.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Coding Contests
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Test your skills, compete with others, and climb the leaderboard
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: "Upcoming", 
                count: contests.filter(c => c.dynamicStatus === "upcoming").length,
                icon: Calendar,
                color: "text-blue-500"
              },
              { 
                label: "Live Now", 
                count: contests.filter(c => c.dynamicStatus === "live").length,
                icon: Clock,
                color: "text-green-500"
              },
              { 
                label: "Completed", 
                count: contests.filter(c => c.dynamicStatus === "ended").length,
                icon: Trophy,
                color: "text-purple-500"
              }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex items-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search contests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Contests</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="ended">Past</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
          {filteredContests.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No contests found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {search ? "Try a different search term" : "Check back later for new contests"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest) => {
                const startTime = new Date(contest.startTime);
                const endTime = new Date(contest.endTime);
                const now = new Date();
                const isLive = contest.dynamicStatus === "live";
                const isUpcoming = contest.dynamicStatus === "upcoming";
                const isEnded = contest.dynamicStatus === "ended";

                return (
                  <div
                    key={contest._id}
                    onClick={() => handleCardClick(contest._id)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start p-6 pb-4">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-1">
                        {contest.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(contest.dynamicStatus)}`}>
                        {contest.dynamicStatus?.toUpperCase()}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="px-6">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {contest.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="p-6 pt-4 space-y-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {startTime.toLocaleDateString()} • {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {contest.participantsCount || 0} participants
                        </span>
                      </div>

                      {/* Tags */}
                      {contest.tags && contest.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {contest.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {contest.tags.length > 2 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              +{contest.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-4">
                        {isUpcoming && !contest.isParticipant ? (
                          <button
                            onClick={(e) => handleRegister(contest._id, e)}
                            disabled={registrationLoading[contest._id] || !contest.registrationOpen}
                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {registrationLoading[contest._id] ? "Registering..." : "Register Now"}
                          </button>
                        ) : contest.isParticipant ? (
                          <div className="w-full px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold rounded-lg text-center">
                            Registered ✓
                          </div>
                        ) : isLive ? (
                          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                            Join Now
                          </button>
                        ) : (
                          <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition">
                            View Results
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ContestsPage;