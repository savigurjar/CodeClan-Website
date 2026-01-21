import { useState } from "react";
import { Calendar, Clock, Users, Tag, Hash, BookOpen, Upload, X } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const CreateContest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    duration: 120, // minutes
    maxParticipants: 100,
    difficulty: "medium",
    tags: [],
    problems: [],
    isPublic: true,
    registrationOpen: true,
  });

  const [newTag, setNewTag] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { value: "hard", label: "Hard", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    { value: "expert", label: "Expert", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start >= end) {
        throw new Error("End date must be after start date");
      }

      // Prepare data for API
      const contestData = {
        ...formData,
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
      };

      // API call
      await axiosClient.post("/contest/create", contestData);
      
      setSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          duration: 120,
          maxParticipants: 100,
          difficulty: "medium",
          tags: [],
          problems: [],
          isPublic: true,
          registrationOpen: true,
        });
      }, 3000);
    } catch (err) {
      console.error("Create contest error:", err);
      setError(err.response?.data?.error || err.message || "Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addProblem = () => {
    if (newProblem.trim() && !formData.problems.includes(newProblem.trim())) {
      setFormData({
        ...formData,
        problems: [...formData.problems, newProblem.trim()]
      });
      setNewProblem("");
    }
  };

  const removeProblem = (problemToRemove) => {
    setFormData({
      ...formData,
      problems: formData.problems.filter(problem => problem !== problemToRemove)
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Contest</h2>
          <p className="text-gray-600 dark:text-gray-300">Design and schedule a coding contest</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          All fields marked with * are required
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-300">Contest created successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-400">Redirecting to contest list...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">Error: {error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contest Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              placeholder="Enter contest title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level *
            </label>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: option.value })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors
                    ${formData.difficulty === option.value
                      ? option.color
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700 
              rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              outline-none transition text-gray-900 dark:text-white resize-none"
            placeholder="Describe the contest, rules, and prizes..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              required
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
              <Calendar size={16} className="inline mr-2" />
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock size={16} className="inline mr-2" />
              Duration (minutes) *
            </label>
            <input
              type="number"
              required
              min="30"
              max="480"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              placeholder="120"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
        </div>

        {/* Participants & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users size={16} className="inline mr-2" />
              Max Participants
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              placeholder="100"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            />
          </div>

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
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Tag size={16} className="inline mr-2" />
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              placeholder="Add a tag (e.g., dynamic-programming)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 
                  text-blue-800 dark:text-blue-300 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Problems */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <BookOpen size={16} className="inline mr-2" />
            Problems (Add Problem IDs)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 
                border border-gray-200 dark:border-gray-700 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                outline-none transition text-gray-900 dark:text-white"
              placeholder="Enter problem ID"
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProblem())}
            />
            <button
              type="button"
              onClick={addProblem}
              className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.problems.map((problem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Hash size={16} className="text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{problem}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeProblem(problem)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                duration: 120,
                maxParticipants: 100,
                difficulty: "medium",
                tags: [],
                problems: [],
                isPublic: true,
                registrationOpen: true,
              });
              setError("");
            }}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 
              text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
              flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Upload size={18} />
                Create Contest
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContest;