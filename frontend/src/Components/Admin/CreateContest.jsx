import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Clock, Tag, Award, Lock, Globe, Users, Plus, X } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import AppLayout from "../../Components/AppLayout";

const AdminCreateContest = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: "",
    rules: [""],
    prizes: [{ position: 1, prize: "" }],
    tags: [""],
    problems: [],
    maxParticipants: 1000,
    isPublic: true,
    registrationOpen: true
  });

  // Available problems for selection
  const [availableProblems, setAvailableProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch available problems on component mount
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/problem/getAllProblem?limit=10");
      setAvailableProblems(data.problems || []);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setError("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle array field changes
  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Add new item to array field
  const addArrayFieldItem = (field, defaultValue = "") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  // Remove item from array field
  const removeArrayFieldItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle problem selection
  const handleProblemSelection = (problemId) => {
    setFormData(prev => {
      const isSelected = prev.problems.includes(problemId);
      return {
        ...prev,
        problems: isSelected 
          ? prev.problems.filter(id => id !== problemId)
          : [...prev.problems, problemId]
      };
    });
  };

  // Calculate duration automatically when times change
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const diffMinutes = Math.floor((end - start) / (1000 * 60));
      if (diffMinutes > 0) {
        setFormData(prev => ({ ...prev, duration: diffMinutes.toString() }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) return "Contest name is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.startTime) return "Start time is required";
    if (!formData.endTime) return "End time is required";
    if (!formData.duration || parseInt(formData.duration) <= 0) return "Duration must be positive";
    
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const now = new Date();
    
    if (start <= now) return "Start time must be in the future";
    if (end <= start) return "End time must be after start time";
    
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Prepare data for submission
      const submissionData = {
        ...formData,
        rules: formData.rules.filter(rule => rule.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        prizes: formData.prizes.filter(prize => prize.position && prize.prize.trim()),
        duration: parseInt(formData.duration)
      };

      const { data } = await axiosClient.post("/contest/create", submissionData);
      
      if (data.success) {
        alert("✅ Contest created successfully!");
        navigate(`/contest/${data.contest._id}`);
      }
    } catch (err) {
      console.error("Create contest error:", err);
      setError(err.response?.data?.error || "Failed to create contest");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Contest
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Setup a coding competition with custom problems and rules
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contest Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter contest name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe the contest..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    readOnly
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Automatically calculated from start and end times
                  </p>
                </div>
              </div>
            </div>

            {/* Rules Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-blue-600" />
                Contest Rules
              </h2>
              
              <div className="space-y-3">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleArrayFieldChange("rules", index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`Rule ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayFieldItem("rules", index)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayFieldItem("rules")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus size={20} />
                  Add Rule
                </button>
              </div>
            </div>

            {/* Prizes Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-600" />
                Prizes
              </h2>
              
              <div className="space-y-4">
                {formData.prizes.map((prize, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position {prize.position}
                      </label>
                      <input
                        type="text"
                        value={prize.prize}
                        onChange={(e) => {
                          const newPrizes = [...formData.prizes];
                          newPrizes[index].prize = e.target.value;
                          setFormData(prev => ({ ...prev, prizes: newPrizes }));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Prize description"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayFieldItem("prizes", index)}
                      className="mt-6 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayFieldItem("prizes", { 
                    position: formData.prizes.length + 1, 
                    prize: "" 
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus size={20} />
                  Add Prize
                </button>
              </div>
            </div>

            {/* Problems Selection Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5 text-purple-600" />
                Select Problems
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Loading problems...</p>
                </div>
              ) : availableProblems.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                  No problems available. Create some problems first.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                  {availableProblems.map((problem) => (
                    <div
                      key={problem._id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.problems.includes(problem._id)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-300 dark:border-gray-700 hover:border-green-400"
                      }`}
                      onClick={() => handleProblemSelection(problem._id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              problem.difficulty === "easy" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : problem.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {problem.difficulty}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {problem.points} points
                            </span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.problems.includes(problem._id)
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400"
                        }`}>
                          {formData.problems.includes(problem._id) && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {formData.problems.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300">
                    Selected {formData.problems.length} problem(s)
                  </p>
                </div>
              )}
            </div>

            {/* Settings Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-gray-600" />
                Contest Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {formData.isPublic ? (
                      <Globe className="mr-2 h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="mr-2 h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.isPublic ? "Public Contest" : "Private Contest"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.isPublic 
                          ? "Visible to all users" 
                          : "Only visible to invited participants"}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Registration Status
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.registrationOpen 
                          ? "Open for registration" 
                          : "Registration closed"}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="registrationOpen"
                      checked={formData.registrationOpen}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/contests")}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  "Create Contest"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminCreateContest;