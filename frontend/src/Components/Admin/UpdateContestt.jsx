import { useEffect, useState } from "react";
import { Search, Edit2, RefreshCw, Eye, Calendar, Users, Trophy, AlertCircle } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const UpdateContest = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContest, setSelectedContest] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/contest/all");
      setContests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch contests error:", err);
      setError("Failed to load contests");
    } finally {
      setLoading(false);
    }
  };

  const filteredContests = contests.filter(contest =>
    contest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contest._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contest.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdate = async (updatedData) => {
    try {
      setUpdating(true);
      await axiosClient.put(`/contest/update/${selectedContest._id}`, updatedData);
      await fetchContests(); // Refresh list
      setSelectedContest(null);
      alert("Contest updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update contest");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading contests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Update Contest</h2>
          <p className="text-gray-600 dark:text-gray-300">Select a contest to update its details</p>
        </div>
        <button
          onClick={fetchContests}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 
            font-medium rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {selectedContest ? (
        <UpdateForm
          contest={selectedContest}
          onUpdate={handleUpdate}
          onCancel={() => setSelectedContest(null)}
          updating={updating}
        />
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contests by title, ID, or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Contests List */}
          <div className="space-y-4">
            {filteredContests.length > 0 ? (
              filteredContests.map((contest) => (
                <div
                  key={contest._id}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contest.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full
                          ${contest.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : contest.status === 'ongoing'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {contest.status?.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {contest.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(contest.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {contest.participants?.length || 0} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy size={14} />
                          {contest.difficulty}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/contest/${contest._id}`, '_blank')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View Contest"
                      >
                        <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => setSelectedContest(contest)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Contests Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery 
                    ? "No contests match your search. Try a different query."
                    : "No contests available. Create your first contest!"
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Update Form Component
const UpdateForm = ({ contest, onUpdate, onCancel, updating }) => {
  const [formData, setFormData] = useState({
    title: contest.title || "",
    description: contest.description || "",
    startDate: contest.startDate?.split('T')[0] || "",
    endDate: contest.endDate?.split('T')[0] || "",
    duration: contest.duration || 120,
    maxParticipants: contest.maxParticipants || 100,
    isPublic: contest.isPublic || true,
    registrationOpen: contest.registrationOpen || true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Update Contest: <span className="text-blue-600 dark:text-blue-400">{contest.title}</span>
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contest Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700 
              rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              outline-none transition text-gray-900 dark:text-white resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                Make contest public
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="registrationOpen"
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                checked={formData.registrationOpen}
                onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
              />
              <label htmlFor="registrationOpen" className="text-sm text-gray-700 dark:text-gray-300">
                Open for registration
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Update Contest
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateContest;