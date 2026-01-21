import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";
import { 
  Search, 
  ArrowLeft, 
  Video, 
  Upload, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileVideo,
  Image as ImageIcon
} from "lucide-react";

const AdminVideo = () => {
  const navigate = useNavigate();
  
  const [problems, setProblems] = useState([]);
  const [videoMap, setVideoMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const loadData = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const [problemRes, videoRes] = await Promise.all([
        axiosClient.get(`/problem/getAllProblem?page=${page}`),
        axiosClient.get("/video/status"),
      ]);

      console.log("Problem API response:", problemRes.data);
      console.log("Video API response:", videoRes.data);

      setProblems(Array.isArray(problemRes.data.problems) ? problemRes.data.problems : []);
      setVideoMap(videoRes.data || {});
      setCurrentPage(problemRes.data.currentPage || 1);
      setTotalPages(problemRes.data.totalPages || 1);

    } catch (err) {
      console.error("Error loading admin data:", err.response || err);
      setError(err.response?.data?.error || "Failed to load video data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(currentPage);
  };

  const handleDelete = async (problemId, title) => {
    if (!window.confirm(`Are you sure you want to delete the video for "${title}"?`)) return;

    try {
      await axiosClient.delete(`/video/delete/${problemId}`);
      setVideoMap(prev => {
        const newMap = { ...prev };
        delete newMap[problemId];
        return newMap;
      });
    } catch (err) {
      console.error("Delete error:", err.response || err);
      alert(err.response?.data?.error || "Failed to delete video");
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Merge problem and video data
  const mergedData = problems.map(problem => ({
    ...problem,
    video: videoMap?.[problem._id] || null
  }));

  // Filter data based on search and status
  const filteredData = mergedData.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(item.tags) && 
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "hasVideo" && item.video) ||
      (statusFilter === "noVideo" && !item.video) ||
      (statusFilter === "approved" && item.video?.status === "approved") ||
      (statusFilter === "pending" && item.video?.status === "pending");
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Videos" },
    { value: "hasVideo", label: "Has Video" },
    { value: "noVideo", label: "No Video" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" }
  ];

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="fixed top-6 left-6 z-50 flex items-center gap-2
          px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          hover:bg-gray-50 dark:hover:bg-gray-700/80
          shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Back to Dashboard
          </span>
        </button>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading video manager...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Fetching video data and problem list</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="fixed top-6 left-6 z-50 flex items-center gap-2
          px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          hover:bg-gray-50 dark:hover:bg-gray-700/80
          shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Back to Dashboard
          </span>
        </button>

        {/* Error Message */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 shadow-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500 dark:text-red-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Error Loading Video Data
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              {error}
            </p>
            <button
              onClick={() => loadData(1)}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: mergedData.length,
    hasVideo: mergedData.filter(item => item.video).length,
    noVideo: mergedData.filter(item => !item.video).length,
    approved: mergedData.filter(item => item.video?.status === "approved").length,
    pending: mergedData.filter(item => item.video?.status === "pending").length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin")}
        className="fixed top-6 left-6 z-40 flex items-center gap-2
        px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        hover:bg-gray-50 dark:hover:bg-gray-700/80
        shadow-sm hover:shadow-md transition-all duration-200"
      >
        <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Back to Dashboard
        </span>
      </button>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 pt-20 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Video Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload, manage, and organize tutorial videos for problems
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${refreshing 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white hover:shadow-md'
                }`}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total Problems", value: stats.total, color: "bg-blue-500" },
              { label: "With Videos", value: stats.hasVideo, color: "bg-green-500" },
              { label: "No Videos", value: stats.noVideo, color: "bg-yellow-500" },
              { label: "Approved", value: stats.approved, color: "bg-emerald-500" },
              { label: "Pending", value: stats.pending, color: "bg-orange-500" },
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search problems by title, ID, or tags..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700 
                    rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                    outline-none transition text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Status
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700 
                    rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                    outline-none transition text-gray-900 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Button */}
              <div className="flex items-end">
                <button
                  onClick={() => navigate("/admin/upload/new")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5
                    bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600
                    text-white font-medium rounded-lg transition-all hover:shadow-lg"
                >
                  <Upload size={18} />
                  Upload New Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Management Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Video Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr 
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      {/* Problem Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                              ${item.video 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                              <Video size={20} className={
                                item.video 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-gray-400 dark:text-gray-500'
                              } />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              ID: {item._id?.substring(0, 12)}...
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.isArray(item.tags) && item.tags.slice(0, 2).map((tag, i) => (
                                <span 
                                  key={i}
                                  className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 
                                    text-blue-800 dark:text-blue-300 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {Array.isArray(item.tags) && item.tags.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 
                                  text-gray-500 dark:text-gray-400 text-xs rounded">
                                  +{item.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Difficulty */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${item.difficulty === "Easy"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : item.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}>
                          {item.difficulty}
                        </span>
                      </td>
                      
                      {/* Video Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                            ${item.video
                              ? item.video.status === "approved"
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}>
                            {item.video ? (
                              <>
                                {item.video.status === "approved" ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <AlertCircle size={14} />
                                )}
                                {item.video.status === "approved" ? "Approved" : "Pending"}
                              </>
                            ) : (
                              <>
                                <FileVideo size={14} />
                                No Video
                              </>
                            )}
                          </div>
                          
                          {item.video && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatDuration(item.video.duration)}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Video Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {item.video ? (
                            <>
                              <div className="flex items-center gap-2">
                                {item.video.thumbnailUrl && (
                                  <div className="relative group">
                                    <img
                                      src={item.video.thumbnailUrl}
                                      alt="Thumbnail"
                                      className="w-16 h-10 rounded object-cover border border-gray-200 dark:border-gray-700"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                      rounded transition-opacity flex items-center justify-center">
                                      <Eye size={14} className="text-white" />
                                    </div>
                                  </div>
                                )}
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {item.video.thumbnailUrl ? "Thumbnail" : "No thumbnail"}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                              Video not uploaded
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => navigate(`/admin/upload/${item._id}`)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 
                              bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium 
                              rounded-lg transition-colors hover:shadow-md"
                          >
                            {item.video ? (
                              <>
                                <RefreshCw size={14} />
                                Update
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                Upload
                              </>
                            )}
                          </button>
                          
                          {item.video && (
                            <button
                              onClick={() => handleDelete(item._id, item.title)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 
                                bg-red-500 hover:bg-red-600 text-white text-sm font-medium 
                                rounded-lg transition-colors hover:shadow-md"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <FileVideo className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Videos Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md">
                          {searchQuery || statusFilter !== "all" 
                            ? "No videos match your search criteria. Try adjusting your filters."
                            : "No problems with videos found. Upload your first video!"
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} • Showing {filteredData.length} of {mergedData.length} problems
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${currentPage === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return pageNum <= totalPages ? (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors
                        ${currentPage === pageNum
                          ? 'bg-purple-500 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${currentPage === totalPages
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 
          rounded-2xl border border-purple-100 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Video className="text-purple-500 dark:text-purple-400" size={28} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Video Management Guidelines
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>Upload HD videos (720p or 1080p) for best quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>Keep videos concise (10-15 minutes recommended)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>Add clear thumbnails for better engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>Review video quality before marking as approved</span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/upload/new")}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
              >
                Bulk Upload
              </button>
              <button
                onClick={() => window.open("/docs/video-guide", "_blank")}
                className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                  font-medium rounded-lg transition-colors"
              >
                Video Guide
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Video Manager v1.2 • Supports MP4, WebM, MOV formats up to 500MB</p>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;