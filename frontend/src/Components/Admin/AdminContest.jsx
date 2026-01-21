import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Trophy, 
  ArrowLeft, 
  Calendar,
  Users,
  Clock,
  Award,
  BarChart
} from "lucide-react";
import CreateContest from "./CreateContest";
import UpdateContest from "./UpdateContestt";
import DeleteContest from "./DeleteContest";

const ContestManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");

  const tabs = [
    { id: "create", label: "Create Contest", icon: PlusCircle },
    { id: "update", label: "Update Contest", icon: Edit },
    { id: "delete", label: "Delete Contest", icon: Trash2 },
  ];

  const stats = [
    { label: "Active Contests", value: "8", change: "+2", icon: Trophy, color: "bg-blue-500" },
    { label: "Total Participants", value: "1,234", change: "+12%", icon: Users, color: "bg-green-500" },
    { label: "Upcoming", value: "3", change: "New", icon: Calendar, color: "bg-purple-500" },
    { label: "Avg. Duration", value: "3h", change: "-15m", icon: Clock, color: "bg-amber-500" },
  ];

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 
                text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-3">
                <Trophy size={14} />
                Contest Management System
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Contest Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create, update, and manage coding contests on the platform
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              Last updated: Today
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 mb-6">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 
                      rounded-lg font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {activeTab === "create" && (
            <div>
              <CreateContest />
            </div>
          )}
          {activeTab === "update" && (
            <div>
              <UpdateContest />
            </div>
          )}
          {activeTab === "delete" && (
            <div>
              <DeleteContest />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 
            rounded-xl border border-blue-100 dark:border-gray-700 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Schedule Contest</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Plan ahead for best results</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("create")}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Schedule Now
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 
            rounded-xl border border-green-100 dark:border-gray-700 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Manage Participants</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Control access and permissions</p>
              </div>
            </div>
            <button
              className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              View Participants
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 
            rounded-xl border border-purple-100 dark:border-gray-700 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Contest Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View performance metrics</p>
              </div>
            </div>
            <button
              className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contest Management Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Award size={16} className="text-blue-500" />
                Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Schedule contests at least 24 hours in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Include problems of varying difficulty levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Test contest thoroughly before publishing</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Clock size={16} className="text-green-500" />
                Timing Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                  <span>Short contests: 1-2 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                  <span>Standard contests: 2-4 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                  <span>Long contests: 4-8 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ContestManager;