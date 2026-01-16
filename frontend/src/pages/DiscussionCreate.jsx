import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Tag as TagIcon, AlertCircle, ArrowLeft } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import AppLayout from "../../Components/AppLayout";
import Animate from "../../animate";

const DiscussCreate = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: []
  });
  
  const [newTag, setNewTag] = useState("");
  
  const popularTags = [
    "DSA", "JavaScript", "React", "Node.js", "Python", 
    "System Design", "Interview", "Career", "Algorithms",
    "Web Development", "Database", "API", "Security", "C++",
    "Java", "HTML/CSS", "DevOps", "Machine Learning", "AI",
    "Frontend", "Backend", "Full Stack", "Mobile", "Cloud"
  ];

  useEffect(() => {
    if (id) {
      fetchDiscussion();
    }
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/discuss/${id}`);
      setFormData({
        title: data.discussion.title,
        content: data.discussion.content,
        tags: data.discussion.tags || []
      });
    } catch (error) {
      console.error("Error fetching discussion:", error);
      navigate("/discuss");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      if (formData.tags.length >= 10) {
        alert("Maximum 10 tags allowed");
        return;
      }
      if (trimmedTag.length > 20) {
        alert("Tag cannot exceed 20 characters");
        return;
      }
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Validation
    if (!formData.title.trim() || formData.title.length < 5) {
      setError("Title must be at least 5 characters");
      setSubmitting(false);
      return;
    }

    if (!formData.content.trim() || formData.content.length < 20) {
      setError("Content must be at least 20 characters");
      setSubmitting(false);
      return;
    }

    try {
      if (id) {
        // Update existing discussion
        await axiosClient.put(`/discuss/${id}`, formData);
      } else {
        // Create new discussion
        await axiosClient.post("/discuss", formData);
      }
      
      navigate("/discuss");
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.id === "tagInput") {
      e.preventDefault();
      handleAddTag();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            {id ? "Loading discussion..." : "Loading editor..."}
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

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/discuss")}
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Discussions
            </button>
            
            <h1 className="text-3xl font-bold mb-2">
              {id ? "Edit Discussion" : "Create New Discussion"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {id ? "Update your discussion" : "Share your knowledge with the community"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                maxLength="200"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter a clear and descriptive title"
                className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <p>{formData.title.length}/200 characters</p>
                <p>Minimum 5 characters</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (Optional)
              </label>
              
              {/* Tag Input */}
              <div className="flex gap-2 mb-3">
                <input
                  id="tagInput"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags (press Enter)"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                  >
                    <TagIcon size={12} />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Popular Tags Suggestions */}
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Popular tags (click to add):
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!formData.tags.includes(tag) && formData.tags.length < 10) {
                        setFormData({...formData, tags: [...formData.tags, tag]});
                      }
                    }}
                    disabled={formData.tags.includes(tag) || formData.tags.length >= 10}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum 10 tags, each up to 20 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Content *
              </label>
              <textarea
                required
                rows="12"
                maxLength="5000"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write your discussion here... You can use markdown formatting"
                className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <p>{formData.content.length}/5000 characters</p>
                <p>Minimum 20 characters • Press Ctrl+Enter to submit</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={18} />
                {submitting 
                  ? (id ? "Saving..." : "Creating...") 
                  : (id ? "Save Changes" : "Create Discussion")
                }
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/discuss")}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
              💡 Tips for a great discussion:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Be clear and specific in your title</li>
              <li>• Provide context and details in your content</li>
              <li>• Use appropriate tags to help others find your discussion</li>
              <li>• Format your content using markdown (headings, lists, code blocks)</li>
              <li>• Check for existing discussions before posting</li>
              <li>• Be respectful and follow community guidelines</li>
            </ul>
            <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
              <p><strong>Markdown tips:</strong> Use # for headings, **bold**, *italic*, `code`, ``` for code blocks</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DiscussCreate;