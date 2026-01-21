import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Video, ArrowLeft, Trophy } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import Animate from "../../animate";

const adminOptions = [
  {
    id: "create",
    title: "Create Problem",
    description: "Add new coding problems to the platform",
    icon: Plus,
    route: "/admin/create",
  },
  {
    id: "update",
    title: "Update Problem",
    description: "Edit existing problems and metadata",
    icon: Edit,
    route: "/admin/update",
  },
  {
    id: "delete",
    title: "Delete Problem",
    description: "Remove problems permanently",
    icon: Trash2,
    route: "/admin/delete",
  },
  {
    id: "video",
    title: "Video Manager",
    description: "Upload or delete problem videos",
    icon: Video,
    route: "/admin/video",
  },
  {
    id: "contests",
    title: "Contest Manager",
    description: "Create and manage coding contests",
    icon: Trophy,
    route: "/admin/contest",
  },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* 🌌 Animated Background (dark only) */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 z-50 flex items-center gap-2
          px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          hover:bg-gray-50 dark:hover:bg-gray-700/80
          shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Back to Home
          </span>
        </button>

        {/* Loading Spinner */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col items-center bg-white/90 dark:bg-gray-800/90 
            border border-gray-200 dark:border-gray-700 
            rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 
              border-blue-500 dark:border-blue-400 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
              Loading Admin Panel...
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Preparing your dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* 🌌 Animated Background (dark only) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2
        px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        hover:bg-gray-50 dark:hover:bg-gray-700/80
        shadow-sm hover:shadow-md transition-all duration-200"
      >
        <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Back to Home
        </span>
      </button>

      {/* CONTENT */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-16 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 mb-4">
            <div className="w-16 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full mx-4"></div>
            <div className="w-16 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Admin <span className="text-blue-600 dark:text-blue-400">Dashboard</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Manage platform content, problems, and contests with ease
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
            <span>•</span>
            <span>Administrator Access</span>
            <span>•</span>
            <span>Last login: Today</span>
          </div>
        </div>

        {/* ADMIN CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {adminOptions.map((option, index) => {
            const Icon = option.icon;
            const colors = [
              { bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600", border: "border-blue-200", hover: "hover:border-blue-400" },
              { bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200", hover: "hover:border-emerald-400" },
              { bg: "bg-rose-50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200", hover: "hover:border-rose-400" },
              { bg: "bg-amber-50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-200", hover: "hover:border-amber-400" },
              { bg: "bg-indigo-50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200", hover: "hover:border-indigo-400" },
            ];
            
            const color = colors[index % colors.length];

            return (
              <NavLink
                key={option.id}
                to={option.route}
                className={`group relative ${color.bg} dark:bg-gray-800 
                  ${color.border} dark:border-gray-700 
                  rounded-2xl p-6 backdrop-blur-sm 
                  transition-all duration-300 
                  hover:scale-[1.02] hover:shadow-xl 
                  ${color.hover} dark:hover:border-blue-400
                  overflow-hidden`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon Container */}
                <div className={`relative mb-5 ${color.iconBg} dark:bg-gray-700 
                  w-14 h-14 rounded-2xl flex items-center justify-center 
                  group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`${color.iconColor} dark:text-white`} size={24} />
                  {/* Notification dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {option.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {option.description}
                </p>

                {/* Action Button */}
                <div className="flex items-center justify-between mt-6">
                  <span className={`text-sm font-medium px-3 py-1.5 rounded-full 
                    ${color.iconColor} ${color.iconBg} dark:bg-gray-700 dark:text-gray-300
                    border ${color.border} dark:border-gray-600`}>
                    Access →
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Click to open
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* STATS OVERVIEW */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Platform Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Quick statistics and platform health
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                All Systems Operational
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated just now
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Problems", value: "1,234", change: "+12%" },
              { label: "Active Videos", value: "567", change: "+5%" },
              { label: "Upcoming Contests", value: "8", change: "+2" },
              { label: "Admin Actions", value: "3,456", change: "Today" },
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Actions */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recent Admin Actions
            </h3>
            <div className="space-y-4">
              {[
                { action: "Created new problem", user: "You", time: "2 minutes ago", icon: "📝" },
                { action: "Updated contest rules", user: "Admin", time: "15 minutes ago", icon: "⚙️" },
                { action: "Deleted outdated video", user: "You", time: "1 hour ago", icon: "🗑️" },
                { action: "Added new tutorial", user: "Team", time: "3 hours ago", icon: "🎥" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{item.action}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      by {item.user} • {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 
            rounded-2xl border border-blue-100 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 
                rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">View Activity Log</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Complete audit trail</div>
              </button>
              <button className="w-full text-left p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 
                rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">User Management</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Manage permissions</div>
              </button>
              <button className="w-full text-left p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 
                rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Analytics Dashboard</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">View platform stats</div>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 
            rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Maintain Platform Excellence
              </h2>
              <p className="text-blue-100 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Keep content fresh, organized, and user-friendly. Your actions ensure a high-quality learning experience for all users.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg 
                  hover:bg-blue-50 transition-colors shadow-md">
                  View Documentation
                </button>
                <button className="px-6 py-3 bg-transparent border-2 border-white text-white 
                  font-semibold rounded-lg hover:bg-white/10 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Admin Panel v2.1 • Last updated: Today</p>
            <p className="mt-1">You have administrator privileges. Use them responsibly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;