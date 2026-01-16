import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Search, Plus, ThumbsUp, ThumbsDown, Eye, Clock, 
  User, Tag, Filter, TrendingUp, Flame, Pin, 
  ArrowUp, ArrowDown, TrendingUp as TrendingIcon,
  Zap, ChevronRight
} from "lucide-react";
import axiosClient from "../../src/utils/axiosClient";
import AppLayout from "../../src/Components/AppLayout";
import Animate from "../animate"
import { useSelector } from "react-redux";

const DiscussList = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [discussions, setDiscussions] = useState([]);
  const [pinnedDiscussions, setPinnedDiscussions] = useState([]);
  const [trendingDiscussions, setTrendingDiscussions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingPinned, setLoadingPinned] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "newest",
    tag: "",
    showPinned: true
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [voting, setVoting] = useState({});

  const sortOptions = [
    { value: "newest", label: "Newest", icon: Clock },
    { value: "top", label: "Top", icon: TrendingUp },
    { value: "most_upvoted", label: "Most Upvoted", icon: ArrowUp },
    { value: "controversial", label: "Controversial", icon: Zap }
  ];

  const popularTags = [
    "DSA", "JavaScript", "React", "Node.js", "Python", 
    "System Design", "Interview", "Career", "Algorithms",
    "Web Development", "Database", "API", "Security", "C++",
    "Java", "HTML/CSS", "DevOps", "Machine Learning", "AI"
  ];

  useEffect(() => {
    fetchDiscussions();
    fetchPinnedDiscussions();
    fetchTrendingDiscussions();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 12,
        search: search,
        sortBy: filters.sortBy,
        pinned: filters.showPinned,
        ...(filters.tag && { tag: filters.tag })
      });

      const { data } = await axiosClient.get(`/discuss?${params}`);
      
      // Add user vote status
      const discussionsWithVoteStatus = data.discussions.map(disc => {
        const userVote = isAuthenticated ? getUserVoteStatus(disc) : "none";
        return { ...disc, userVote };
      });
      
      setDiscussions(discussionsWithVoteStatus);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPinnedDiscussions = async () => {
    try {
      setLoadingPinned(true);
      const { data } = await axiosClient.get("/discuss/pinned");
      setPinnedDiscussions(data.discussions || []);
    } catch (error) {
      console.error("Error fetching pinned:", error);
    } finally {
      setLoadingPinned(false);
    }
  };

  const fetchTrendingDiscussions = async () => {
    try {
      setLoadingTrending(true);
      const { data } = await axiosClient.get("/discuss/trending");
      setTrendingDiscussions(data.discussions || []);
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axiosClient.get("/discuss/stats");
      setStats(data.stats || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getUserVoteStatus = (discussion) => {
    if (!user || !discussion.upvotes || !discussion.downvotes) return "none";
    
    const userId = user._id || user.id;
    if (discussion.upvotes.some(uv => uv._id === userId || uv === userId)) {
      return "upvote";
    }
    if (discussion.downvotes.some(dv => dv._id === userId || dv === userId)) {
      return "downvote";
    }
    return "none";
  };

  const handleVote = async (discussionId, type, e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setVoting({ ...voting, [discussionId]: true });

    try {
      const { data } = await axiosClient.post(`/discuss/${discussionId}/vote`, { type });
      
      // Update local state
      setDiscussions(discussions.map(disc => {
        if (disc._id === discussionId) {
          return {
            ...disc,
            upvoteCount: data.upvoteCount,
            downvoteCount: data.downvoteCount,
            score: data.score,
            userVote: data.userVote
          };
        }
        return disc;
      }));

      // Also update in pinned and trending if present
      setPinnedDiscussions(pinnedDiscussions.map(disc => {
        if (disc._id === discussionId) {
          return {
            ...disc,
            upvoteCount: data.upvoteCount,
            downvoteCount: data.downvoteCount,
            score: data.score,
            userVote: data.userVote
          };
        }
        return disc;
      }));

      setTrendingDiscussions(trendingDiscussions.map(disc => {
        if (disc._id === discussionId) {
          return {
            ...disc,
            upvoteCount: data.upvoteCount,
            downvoteCount: data.downvoteCount,
            score: data.score,
            userVote: data.userVote
          };
        }
        return disc;
      }));

    } catch (error) {
      console.error("Error voting:", error);
      alert(error.response?.data?.error || "Failed to vote");
    } finally {
      setVoting({ ...voting, [discussionId]: false });
    }
  };

  const handlePin = async (discussionId, e) => {
    e.stopPropagation();
    
    if (!isAuthenticated || user.role !== "admin") {
      return;
    }

    try {
      await axiosClient.post(`/discuss/${discussionId}/pin`);
      
      // Refresh discussions
      fetchDiscussions();
      fetchPinnedDiscussions();
      
      alert("Pin status updated");
    } catch (error) {
      console.error("Error pinning:", error);
      alert(error.response?.data?.error || "Failed to update pin status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({...pagination, page: 1});
    fetchDiscussions();
  };

  const handleTagClick = (tag) => {
    setFilters({...filters, tag});
    setPagination({...pagination, page: 1});
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "newest",
      tag: "",
      showPinned: true
    });
    setSearch("");
    setPagination({...pagination, page: 1});
  };

  const getScoreColor = (score) => {
    if (score > 0) return "text-green-600 dark:text-green-400";
    if (score < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-500";
  };

  if (loading && discussions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            Loading discussions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        
        {/* Background Animation */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-center mb-3">
              Community <span className="text-[#021510] dark:text-emerald-400">Discussions</span>
            </h1>
            <p className="text-center text-black/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Vote, share, and discuss programming topics
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { 
                  label: "Total Discussions", 
                  value: stats.totalDiscussions || "0",
                  icon: TrendingIcon,
                  color: "text-blue-600 dark:text-blue-400"
                },
                { 
                  label: "Pinned", 
                  value: stats.pinnedCount || "0",
                  icon: Pin,
                  color: "text-yellow-600 dark:text-yellow-400"
                },
                { 
                  label: "Active Authors", 
                  value: stats.uniqueAuthors || "0",
                  icon: User,
                  color: "text-emerald-600 dark:text-emerald-400"
                },
                { 
                  label: "Trending Now", 
                  value: trendingDiscussions.length || "0",
                  icon: Flame,
                  color: "text-orange-600 dark:text-orange-400"
                }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-center backdrop-blur hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Search */}
              <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </form>
              </div>

              {/* Create Button */}
              {isAuthenticated && (
                <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
                  <Link
                    to="/admin/discuss/create"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <Plus size={20} />
                    New Discussion
                  </Link>
                </div>
              )}

              {/* Sort Options */}
              <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Filter size={18} />
                  Sort By
                </h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setFilters({...filters, sortBy: option.value})}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          filters.sortBy === option.value
                            ? "bg-emerald-600 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Icon size={16} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pinned Toggle */}
              <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showPinned}
                    onChange={(e) => setFilters({...filters, showPinned: e.target.checked})}
                    className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1">
                    <Pin size={16} />
                    Show Pinned First
                  </span>
                </label>
              </div>

              {/* Popular Tags */}
              <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.tag === tag
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Discussions */}
              {!loadingTrending && trendingDiscussions.length > 0 && (
                <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Flame size={18} className="text-orange-500" />
                    Trending Now
                  </h3>
                  <div className="space-y-3">
                    {trendingDiscussions.map((discussion) => (
                      <Link
                        key={discussion._id}
                        to={`/discuss/${discussion._id}`}
                        className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {discussion.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{discussion.author?.firstName}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${getScoreColor(discussion.score)}`}>
                              {discussion.score > 0 ? "+" : ""}{discussion.score}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Active Filters */}
              {(filters.tag || filters.sortBy !== "newest") && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filters.tag && (
                    <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                      <Tag size={12} />
                      {filters.tag}
                      <button
                        onClick={() => setFilters({...filters, tag: ""})}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.sortBy !== "newest" && (
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {sortOptions.find(s => s.value === filters.sortBy)?.label}
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Pinned Discussions */}
              {!loadingPinned && pinnedDiscussions.length > 0 && filters.showPinned && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Pin size={20} />
                    Pinned Discussions
                  </h2>
                  <div className="space-y-4">
                    {pinnedDiscussions.map((discussion) => (
                      <DiscussionCard 
                        key={discussion._id}
                        discussion={discussion}
                        onVote={handleVote}
                        onPin={handlePin}
                        voting={voting}
                        isAuthenticated={isAuthenticated}
                        user={user}
                        formatDate={formatDate}
                        getScoreColor={getScoreColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Discussions */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {filters.sortBy === "top" ? "Top Discussions" : 
                   filters.sortBy === "most_upvoted" ? "Most Upvoted" :
                   filters.sortBy === "controversial" ? "Controversial Discussions" : 
                   "Recent Discussions"}
                </h2>
                
                {discussions.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No discussions found. Start the conversation!</p>
                    {isAuthenticated && (
                      <Link
                        to="/admin/discuss/create"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <Plus size={20} />
                        Create First Discussion
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <DiscussionCard 
                        key={discussion._id}
                        discussion={discussion}
                        onVote={handleVote}
                        onPin={handlePin}
                        voting={voting}
                        isAuthenticated={isAuthenticated}
                        user={user}
                        formatDate={formatDate}
                        getScoreColor={getScoreColor}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronRight className="rotate-180" size={16} />
                      Previous
                    </button>
                    
                    <span className="text-gray-600 dark:text-gray-300">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Discussion Card Component
const DiscussionCard = ({ discussion, onVote, onPin, voting, isAuthenticated, user, formatDate, getScoreColor }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/discuss/${discussion._id}`)}
      className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-5 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="flex">
        {/* Vote Column */}
        <div className="flex flex-col items-center mr-4">
          <button
            onClick={(e) => onVote(discussion._id, "upvote", e)}
            disabled={voting[discussion._id] || !isAuthenticated}
            className={`p-2 rounded-full transition-colors ${
              discussion.userVote === "upvote"
                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ThumbsUp size={18} />
          </button>
          
          <div className={`my-2 text-lg font-bold ${getScoreColor(discussion.score)}`}>
            {discussion.score > 0 ? "+" : ""}{discussion.score}
          </div>
          
          <button
            onClick={(e) => onVote(discussion._id, "downvote", e)}
            disabled={voting[discussion._id] || !isAuthenticated}
            className={`p-2 rounded-full transition-colors ${
              discussion.userVote === "downvote"
                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ThumbsDown size={18} />
          </button>
          
          {/* Pin Button (Admin only) */}
          {isAuthenticated && user?.role === "admin" && (
            <button
              onClick={(e) => onPin(discussion._id, e)}
              className={`mt-3 p-1 rounded-full transition-colors ${
                discussion.isPinned
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
            >
              <Pin size={16} />
            </button>
          )}
        </div>

        {/* Content Column */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {discussion.isPinned && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Pin size={12} />
                    Pinned
                  </span>
                )}
                <h3 className="font-bold text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {discussion.title}
                </h3>
              </div>
              
              {/* Tags */}
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {discussion.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {discussion.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      +{discussion.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Vote Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 sm:mt-0">
              <span className="flex items-center gap-1">
                <ThumbsUp size={14} />
                {discussion.upvoteCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDown size={14} />
                {discussion.downvoteCount || 0}
              </span>
            </div>
          </div>

          {/* Content Preview */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {discussion.content.substring(0, 200)}...
          </p>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <User size={12} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {discussion.author?.firstName || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock size={14} />
                <span className="text-sm">{formatDate(discussion.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/discuss/${discussion._id}`)}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussList;