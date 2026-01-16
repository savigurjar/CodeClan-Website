import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, ThumbsUp, ThumbsDown, Eye, Clock, 
  User, Tag, Edit, Trash2, Pin, Share, 
  ArrowUp, ArrowDown, Copy, CheckCircle, XCircle,
  AlertTriangle, MoreVertical
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import AppLayout from "../../Components/AppLayout";
import Animate from "../../animate";
import { useSelector } from "react-redux";

const DiscussDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDiscussion();
    }
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/discuss/${id}`);
      setDiscussion(data.discussion);
    } catch (error) {
      console.error("Error fetching discussion:", error);
      navigate("/discuss");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user is the author
    if (discussion.author._id === user._id) {
      alert("You cannot vote on your own discussion");
      return;
    }

    setVoting(true);
    try {
      const { data } = await axiosClient.post(`/discuss/${id}/vote`, { type });
      
      setDiscussion({
        ...discussion,
        upvoteCount: data.upvoteCount,
        downvoteCount: data.downvoteCount,
        score: data.score,
        userVote: data.userVote
      });
    } catch (error) {
      console.error("Error voting:", error);
      alert(error.response?.data?.error || "Failed to vote");
    } finally {
      setVoting(false);
    }
  };

  const handlePin = async () => {
    if (!isAuthenticated || user.role !== "admin") {
      return;
    }

    setPinning(true);
    try {
      await axiosClient.post(`/discuss/${id}/pin`);
      
      setDiscussion({
        ...discussion,
        isPinned: !discussion.isPinned
      });
      
      alert(`Discussion ${discussion.isPinned ? "unpinned" : "pinned"}`);
    } catch (error) {
      console.error("Error pinning:", error);
      alert(error.response?.data?.error || "Failed to update pin status");
    } finally {
      setPinning(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/discuss/${id}`);
      navigate("/discuss");
    } catch (error) {
      console.error("Error deleting discussion:", error);
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isAuthor = discussion?.author?._id === user?._id;
  const isAdmin = user?.role === "admin";

  const getScoreColor = (score) => {
    if (score > 0) return "text-green-600 dark:text-green-400";
    if (score < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            Loading discussion...
          </p>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Discussion Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The discussion you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/discuss"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Discussions
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        
        {/* Background Animation */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={() => navigate("/discuss")}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Discussions
          </button>

          {/* Main Content */}
          <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur shadow-lg">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {discussion.isPinned && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Pin size={12} />
                      Pinned
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold">{discussion.title}</h1>
                </div>

                {/* Author and Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <User size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {discussion.author?.firstName} {discussion.author?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {discussion.author?.emailId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span className="text-sm">{formatDate(discussion.createdAt)}</span>
                    </div>
                    {discussion.updatedAt !== discussion.createdAt && (
                      <span className="text-sm">(Edited)</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Share"
                >
                  {copied ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Share size={20} />
                  )}
                </button>
                
                {(isAuthor || isAdmin) && (
                  <div className="relative">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {discussion.tags && discussion.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {discussion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {discussion.content}
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Vote Section */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVote("upvote")}
                      disabled={voting || !isAuthenticated || discussion.author._id === user?._id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        discussion.userVote === "upvote"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      } ${!isAuthenticated || discussion.author._id === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ThumbsUp size={20} />
                      <span>{discussion.upvoteCount || 0}</span>
                    </button>
                    
                    <div className={`text-2xl font-bold ${getScoreColor(discussion.score)}`}>
                      {discussion.score > 0 ? "+" : ""}{discussion.score}
                    </div>
                    
                    <button
                      onClick={() => handleVote("downvote")}
                      disabled={voting || !isAuthenticated || discussion.author._id === user?._id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        discussion.userVote === "downvote"
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      } ${!isAuthenticated || discussion.author._id === user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ThumbsDown size={20} />
                      <span>{discussion.downvoteCount || 0}</span>
                    </button>
                  </div>
                  
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{discussion.views || 0} views</span>
                    </div>
                  </div>
                </div>

                {/* Admin/Action Buttons */}
                <div className="flex gap-2">
                  {isAdmin && (
                    <button
                      onClick={handlePin}
                      disabled={pinning}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        discussion.isPinned
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Pin size={16} />
                      {pinning ? "..." : discussion.isPinned ? "Unpin" : "Pin"}
                    </button>
                  )}
                  
                  {isAuthor && (
                    <>
                      <Link
                        to={`/admin/discuss/edit/${discussion._id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="text-green-500" size={20} />
                <h3 className="font-semibold">Upvoters</h3>
              </div>
              {discussion.upvotes && discussion.upvotes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {discussion.upvotes.slice(0, 5).map((upvoter, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {upvoter.firstName}
                    </span>
                  ))}
                  {discussion.upvotes.length > 5 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      +{discussion.upvotes.length - 5} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No upvotes yet</p>
              )}
            </div>

            <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="text-red-500" size={20} />
                <h3 className="font-semibold">Downvoters</h3>
              </div>
              {discussion.downvotes && discussion.downvotes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {discussion.downvotes.slice(0, 5).map((downvoter, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      {downvoter.firstName}
                    </span>
                  ))}
                  {discussion.downvotes.length > 5 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      +{discussion.downvotes.length - 5} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No downvotes</p>
              )}
            </div>

            <div className="bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-emerald-500" size={20} />
                <h3 className="font-semibold">Author Info</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {discussion.author?.firstName} {discussion.author?.lastName}</p>
                <p><strong>Email:</strong> {discussion.author?.emailId}</p>
                {discussion.author?.socialProfiles && (
                  <div className="mt-2">
                    <p className="font-medium mb-1">Social Profiles:</p>
                    <div className="flex gap-2">
                      {discussion.author.socialProfiles.github && (
                        <a href={discussion.author.socialProfiles.github} target="_blank" rel="noopener noreferrer" 
                          className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                          GitHub
                        </a>
                      )}
                      {discussion.author.socialProfiles.linkedin && (
                        <a href={discussion.author.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-bold">Delete Discussion</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{discussion.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default DiscussDetails;