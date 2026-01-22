import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";
import { 
  Search, 
  ArrowLeft, 
  Trash2, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  AlertCircle,
  Shield,
  Eye,
  FileWarning
} from "lucide-react";

const AdminDelete = () => {
  const navigate = useNavigate();
  
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/problem/getAllProblem?page=${page}`);
      
      setProblems(Array.isArray(data.problems) ? data.problems : []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problems. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    setDeletingId(id);
    setConfirmDelete(true);
    setDeleteInput("");
  };

  const confirmDeleteAction = async () => {
    if (deleteInput !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    try {
      // Delete problem
      await axiosClient.delete(`/problem/delete/${deletingId}`);
      
      // Delete video (if exists)
      try {
        await axiosClient.delete(`/video/delete/${deletingId}`);
      } catch (videoErr) {
        console.log("No video found or error deleting video:", videoErr);
      }

      // Remove from local state
      setProblems((prev) => prev.filter((p) => p._id !== deletingId));
      setConfirmDelete(false);
      setDeletingId(null);
      setDeleteInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete problem");
      setConfirmDelete(false);
      setDeletingId(null);
    }
  };

  const filteredProblems = problems
    .filter((problem) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        problem?.title?.toLowerCase().includes(query) ||
        problem?._id?.toLowerCase().includes(query) ||
        problem?.difficulty?.toLowerCase().includes(query) ||
        (Array.isArray(problem?.tags)
          ? problem.tags.some(tag => tag.toLowerCase().includes(query))
          : problem?.tags?.toLowerCase().includes(query));
      
      const matchesDifficulty = 
        selectedDifficulty === "All" || 
        problem?.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      
      return matchesSearch && matchesDifficulty;
    });

  const difficultyOptions = ["All", "Easy", "Medium", "Hard"];

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
          <div className="w-16 h-16 border-4 border-t-red-500 border-b-red-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading problems...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Preparing delete interface</p>
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
              Error Loading Problems
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              {error}
            </p>
            <button
              onClick={() => fetchProblems(1)}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Are you sure you want to delete this problem? This will also delete any associated video.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  ⚠️ Warning: This action is permanent and will affect all users.
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 
                  rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition
                  text-gray-900 dark:text-white"
                placeholder="Type DELETE here"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setDeletingId(null);
                  setDeleteInput("");
                }}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                  text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                disabled={deleteInput !== "DELETE"}
                className={`flex-1 py-2.5 font-medium rounded-lg transition-colors
                  ${deleteInput === "DELETE" 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-300 dark:bg-red-800/50 text-white/70 dark:text-gray-500 cursor-not-allowed'
                  }`}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

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
                Delete Problems
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Permanently remove problems and associated content
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 
              border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg">
              <Shield size={14} className="inline mr-2" />
              Administrator Mode • Deletions are permanent
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
            rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">
                  ⚠️ Delete with Caution
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Deleting a problem will permanently remove it along with its test cases, solutions, and any associated video. 
                  This action affects all users and cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">

    {/* Search Input */}
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search problems to delete..."
        className="w-full h-[44px] pl-10 pr-4 bg-gray-50 dark:bg-gray-900 
          border border-gray-200 dark:border-gray-700 
          rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 
          outline-none transition text-gray-900 dark:text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {/* Difficulty Filter */}
    <div>
      {/* Optional: label hata diya for alignment */}
      <div className="flex flex-wrap gap-2">
        {difficultyOptions.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedDifficulty(option)}
            className={`h-[44px] px-4 rounded-lg text-sm font-medium transition-colors
              ${selectedDifficulty === option
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>

  </div>
</div>

        </div>

        {/* Problems Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Problem Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <tr 
                      key={problem._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors
                        ${deletingId === problem._id ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {index + 1 + (currentPage - 1) * 10}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                            {problem.title}
                            <button
                              onClick={() => window.open(`/problem/${problem._id}`, '_blank')}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                              title="View Problem"
                            >
                              <Eye size={14} className="text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {problem._id?.substring(0, 8)}...
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(problem.tags) && problem.tags.slice(0, 2).map((tag, i) => (
                                <span 
                                  key={i}
                                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 
                                    text-gray-600 dark:text-gray-300 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {Array.isArray(problem.tags) && problem.tags.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 
                                  text-gray-500 dark:text-gray-400 text-xs rounded">
                                  +{problem.tags.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {problem.createdAt 
                            ? new Date(problem.createdAt).toLocaleDateString()
                            : 'Unknown'
                          }
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/update/${problem._id}`)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 
                              text-white text-sm font-medium rounded-lg transition-colors"
                            title="Edit instead of delete"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(problem._id, problem.title)}
                            disabled={deletingId === problem._id}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all
                              ${deletingId === problem._id
                                ? 'bg-red-400 dark:bg-red-600 text-white cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-md active:scale-95'
                              }`}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <FileWarning className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Problems Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md">
                          {searchQuery || selectedDifficulty !== "All" 
                            ? "No problems match your search criteria. Try adjusting your filters."
                            : "No problems available to delete."
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
              Page {currentPage} of {totalPages} • {problems.length} problems total
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
                          ? 'bg-red-500 text-white'
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

        {/* Safety Guidelines */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 
          rounded-2xl border border-red-100 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Shield className="text-red-500 dark:text-red-400" size={28} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Safety Guidelines for Deletion
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                  <span>Always check if a problem is being used in active contests before deleting</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                  <span>Consider archiving instead of deleting if users might need access</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                  <span>Review problem usage statistics in analytics before deletion</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                  <span>Consider updating outdated problems instead of deleting them</span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/create")}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Create New Problem
              </button>
              <button
                onClick={() => navigate("/admin/update")}
                className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                  font-medium rounded-lg transition-colors"
              >
                Go to Update
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>⚠️ Deleting problems is an irreversible action. Please proceed with caution.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;