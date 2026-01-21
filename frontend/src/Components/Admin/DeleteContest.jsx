import { useEffect, useState } from "react";
import { Search, Trash2, AlertTriangle, Calendar, Users, Clock, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const DeleteContest = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContests();
  }, [currentPage]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/contest/all?page=${currentPage}`);
      setContests(Array.isArray(data.contests) ? data.contests : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch contests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    if (deleteInput !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    try {
      setDeleting(true);
      await axiosClient.delete(`/contest/delete/${confirmDelete._id}`);
      // Remove from local state
      setContests(prev => prev.filter(c => c._id !== confirmDelete._id));
      setConfirmDelete(null);
      setDeleteInput("");
      alert("Contest deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete contest");
    } finally {
      setDeleting(false);
    }
  };

  const filteredContests = contests.filter(contest => {
    const matchesSearch = 
      contest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest._id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      contest.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { value: "ongoing", label: "Ongoing", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    { value: "completed", label: "Completed", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-t-red-500 border-b-red-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading contests...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-800 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Contest</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete the contest <span className="font-semibold">"{confirmDelete.title}"</span>?
              </p>
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ⚠️ This will delete all contest data including participant submissions and rankings.
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
                  setConfirmDelete(null);
                  setDeleteInput("");
                }}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                  text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== "DELETE" || deleting}
                className={`flex-1 py-2.5 font-medium rounded-lg transition-colors
                  ${deleteInput === "DELETE" && !deleting
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-300 dark:bg-red-800/50 text-white/70 dark:text-gray-500 cursor-not-allowed'
                  }`}
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Contest</h2>
          <p className="text-gray-600 dark:text-gray-300">Permanently remove contests from the platform</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
          Warning: Deletions are irreversible
        </div>
      </div>

      {/* Warning Banner */}
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">
              ⚠️ Critical Action
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              Deleting a contest will permanently remove all associated data including submissions, 
              rankings, and participant records. Consider archiving instead.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search contests to delete..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700 
              rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 
              outline-none transition text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Status
          </label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700 
              rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 
              outline-none transition text-gray-900 dark:text-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchContests}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Filter size={16} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Contests List */}
      <div className="space-y-4 mb-6">
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => {
            const statusColor = statusOptions.find(opt => opt.value === contest.status)?.color;
            
            return (
              <div
                key={contest._id}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-red-300 dark:hover:border-red-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {contest.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                        {contest.status?.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-1">
                      {contest.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        {new Date(contest.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Users size={14} />
                        {contest.participants?.length || 0} participants
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        {contest.duration} minutes
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`/contest/${contest._id}`, '_blank')}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                        text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setConfirmDelete(contest)}
                      className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Contests Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery || filterStatus !== "all" 
                ? "No contests match your criteria. Try adjusting filters."
                : "No contests available for deletion."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages} • Showing {filteredContests.length} contests
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
    </div>
  );
};

export default DeleteContest;