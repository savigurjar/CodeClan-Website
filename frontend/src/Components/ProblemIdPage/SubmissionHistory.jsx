import { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { 
  CheckCircle, XCircle, Clock, Cpu, Database, 
  Code2, Eye, Copy, RefreshCw, AlertCircle, 
  Filter, Download, ExternalLink, ChevronRight,
  BarChart3, Calendar, FileCode, Terminal
} from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusConfig = (status) => {
  const statusLower = status?.toLowerCase();
  switch (statusLower) {
    case 'accepted':
      return {
        color: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-emerald-500/10'
      };
    case 'wrong':
      return {
        color: 'bg-red-500/20 text-red-900 dark:text-red-300 border-red-300 dark:border-red-700',
        icon: <XCircle className="w-4 h-4" />,
        bgColor: 'bg-red-500/10'
      };
    case 'error':
      return {
        color: 'bg-yellow-500/20 text-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-yellow-500/10'
      };
    case 'pending':
      return {
        color: 'bg-blue-500/20 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        icon: <Clock className="w-4 h-4" />,
        bgColor: 'bg-blue-500/10'
      };
    // Remove the 'failed' case since we're not using it anymore
    default:
      return {
        color: 'bg-gray-500/20 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700',
        icon: <Clock className="w-4 h-4" />,
        bgColor: 'bg-gray-500/10'
      };
  }
};

  const getLanguageColor = (language) => {
    const colors = {
      'javascript': 'bg-yellow-500/20 text-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      'python': 'bg-blue-500/20 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'java': 'bg-red-500/20 text-red-900 dark:text-red-300 border-red-300 dark:border-red-700',
      'cpp': 'bg-purple-500/20 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      'c': 'bg-gray-500/20 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700',
     
    };
    return colors[language?.toLowerCase()] || 'bg-gray-500/20 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700';
  };

  const formatMemory = (memory) => {
    if (!memory) return 'N/A';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    return sub.status?.toLowerCase() === filter;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'runtime') {
      return (a.runtime || 0) - (b.runtime || 0);
    }
    return 0;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    total: submissions.length,
    accepted: submissions.filter(s => s.status?.toLowerCase() === 'accepted').length,
    wrong: submissions.filter(s => s.status?.toLowerCase() === 'wrong' || s.status?.toLowerCase() === 'error').length,
    pending: submissions.filter(s => s.status?.toLowerCase() === 'pending').length,
    successRate: submissions.length > 0 
      ? Math.round((submissions.filter(s => s.status?.toLowerCase() === 'accepted').length / submissions.length) * 100)
      : 0
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-emerald-900/30 dark:border-emerald-600/30 rounded-full animate-spin border-t-emerald-900 dark:border-t-emerald-600"></div>
        <p className="mt-4 text-emerald-900 dark:text-emerald-600 font-medium">Loading submission history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-bold text-red-900 dark:text-red-500 mb-2">Failed to Load</h3>
        <p className="text-red-700 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-500 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            Submission History
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your progress and previous attempts</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{stats.accepted}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{stats.successRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'accepted'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Accepted ({stats.accepted})
          </button>
          <button
            onClick={() => setFilter('wrong')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'wrong'
              ? 'bg-gradient-to-r from-red-600 to-red-800 dark:from-red-600 dark:to-red-700 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Wrong ({stats.failed})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="runtime">Fastest Runtime</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-emerald-200 dark:border-emerald-800/30 rounded-2xl">
          <FileCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Submissions Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'all' 
              ? "You haven't submitted any solutions yet." 
              : `No ${filter} submissions found.`}
          </p>
          <button 
            onClick={() => setFilter('all')}
            className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
          >
            View All Submissions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((sub, index) => (
            <div 
              key={sub._id || index}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/20 border border-gray-200 dark:border-gray-800/30 rounded-2xl p-4 hover:shadow-lg transition-all hover:border-emerald-300 dark:hover:border-emerald-700/50 cursor-pointer"
              onClick={() => setSelectedSubmission(sub)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusConfig(sub.status).color} flex items-center gap-1`}>
                        {getStatusConfig(sub.status).icon}
                        {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1) || 'Unknown'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getLanguageColor(sub.language)}`}>
                        {sub.language?.toUpperCase() || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Cpu className="w-4 h-4" />
                        <span>{sub.runtime || 0}s</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Database className="w-4 h-4" />
                        <span>{formatMemory(sub.memory)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{sub.testCasesPassed || 0}/{sub.testCasesTotal || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(sub.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {formatTime(sub.createdAt)}
                  </div>
                  <button className="mt-2 px-3 py-1.5 text-sm rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View Code
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedSubmission(null)}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-700/50 rounded-2xl shadow-2xl w-full max-w-4xl">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-600">
                        Submission Details
                      </h3>
                      <p className="text-sm text-emerald-700 dark:text-emerald-500">
                        {selectedSubmission.language} • {formatDate(selectedSubmission.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(selectedSubmission.code)}
                      className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                      title="Copy code"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl border ${getStatusConfig(selectedSubmission.status).color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusConfig(selectedSubmission.status).icon}
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <p className="text-lg font-bold">
                      {selectedSubmission.status?.charAt(0).toUpperCase() + selectedSubmission.status?.slice(1) || 'Unknown'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/5 dark:to-gray-900">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-sm font-medium">Runtime</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-600">
                      {selectedSubmission.runtime || 0}s
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/5 dark:to-gray-900">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-sm font-medium">Memory</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-600">
                      {formatMemory(selectedSubmission.memory)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/5 dark:to-gray-900">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-sm font-medium">Test Cases</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-600">
                      {selectedSubmission.testCasesPassed || 0}/{selectedSubmission.testCasesTotal || 0}
                    </p>
                  </div>
                </div>

                {/* Error Message (if any) */}
                {selectedSubmission.errorMessage && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-red-900 dark:text-red-500 mb-1">Error Message</h4>
                        <pre className="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap">
                          {selectedSubmission.errorMessage}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Block */}
                <div className="border border-emerald-200 dark:border-emerald-800/30 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/5 dark:to-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-900 dark:text-emerald-600">
                        {selectedSubmission.language} Code
                      </span>
                    </div>
                    <span className="text-xs text-emerald-700 dark:text-emerald-500">
                      {selectedSubmission.code?.length || 0} characters
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="p-4 text-sm bg-gray-900 text-gray-100 font-mono">
                      <code>{selectedSubmission.code}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/5 dark:to-gray-900">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-emerald-700 dark:text-emerald-500">
                    Submitted at {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(selectedSubmission.code)}
                      className="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-600 dark:to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-900 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {filteredSubmissions.length > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-emerald-200 dark:border-emerald-800/30">
          Showing {filteredSubmissions.length} of {submissions.length} submissions • 
          Success rate: {stats.successRate}% • 
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;