import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../../utils/axiosClient"
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiUser,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiCalendar,
  FiTrendingUp,
  FiStar,
  FiChevronDown,
  FiCode,
  FiTarget,
  FiAward,
  FiActivity,
  FiCheckCircle,
  FiLock,
  FiTrash2,
  FiKey,
  FiMail,
  FiEye,
  FiEyeOff,
  FiBarChart2,
  FiClock,
  FiTrendingDown,
  FiCheckSquare
} from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import Animate from "../../animate";

// Zod Schemas for Validation
const socialProfilesSchema = z.object({
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
  x: z.string().url("Must be a valid URL").or(z.literal("")),
  leetcode: z.string().url("Must be a valid URL").or(z.literal("")),
  github: z.string().url("Must be a valid URL").or(z.literal(""))
}).partial();

const profileSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  age: z.coerce.number()
    .min(5, "Age must be at least 5")
    .max(100, "Age must be less than 100")
    .optional()
    .or(z.literal("")),
  socialProfiles: socialProfilesSchema.optional()
});

const passwordSchema = z.object({
  oldPassword: z.string()
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z.string()
    .min(6, "New password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const forgotPasswordSchema = z.object({
  emailId: z.string()
    .email("Invalid email address")
    .min(1, "Email is required")
});

// Helper function to get IST date string
const getISTDate = (date = new Date()) => {
  // Indian Standard Time is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istTime = date.getTime() + istOffset;
  return new Date(istTime);
};

// Helper function to format date as YYYY-MM-DD in IST
const formatISTDate = (date = new Date()) => {
  const istDate = getISTDate(date);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to parse date string and convert to IST
const parseDateToIST = (dateString) => {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return getISTDate(date);
};

const Dashboard = () => {
  // React Hook Form for profile
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      socialProfiles: {
        linkedin: "",
        x: "",
        leetcode: "",
        github: "",
      },
    }
  });

  // React Hook Form for password
  const {
    handleSubmit: handlePasswordSubmit,
    control: passwordControl,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    setError: setPasswordError
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  // React Hook Form for forgot password
  const {
    handleSubmit: handleForgotPasswordSubmit,
    control: forgotPasswordControl,
    formState: { errors: forgotPasswordErrors, isSubmitting: isForgotPasswordSubmitting },
    reset: resetForgotPasswordForm
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailId: ""
    }
  });

  const [stats, setStats] = useState({
    totalProblems: 0,
    totalPoints: 0,
    currentStreak: 0,
    maxStreak: 0,
    accuracy: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    totalActiveDays: 0,
    submissionsPastYear: 0,
    rank: 0,
    totalUsers: 0,
    percentile: 0,
    solvedProblems: [],
    streakHistory: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("Current");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");

  // Ensure solvedProblems is always an array
  const ensureSolvedProblemsArray = (problems) => {
    if (!problems) return [];
    if (Array.isArray(problems)) return problems;
    return [];
  };

  // Generate empty calendar for last year using IST
  const generateEmptyCalendar = () => {
    const calendar = [];
    const todayIST = getISTDate();
    const startDate = new Date(todayIST);
    startDate.setDate(todayIST.getDate() - 364); // Last year in IST
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendar.push({
        date: formatISTDate(date),
        problemCount: 0,
        activityLevel: 0
      });
    }
    return calendar;
  };

  // Get activity color based on original heatmap colors
  const getActivityColor = (activityLevel) => {
    switch(activityLevel) {
      case 1: return 'var(--green-20)';
      case 2: return 'var(--green-40)';
      case 3: return 'var(--green-60)';
      case 4: return 'var(--green-80)';
      default: return 'var(--fill-tertiary)';
    }
  };

  // Generate heatmap data for the past year using IST
  const generateHeatmapData = () => {
    const todayIST = getISTDate();
    const heatmapData = [];
    
    // Create array for last 365 days in IST
    for (let i = 364; i >= 0; i--) {
      const date = new Date(todayIST);
      date.setDate(todayIST.getDate() - i);
      const dateString = formatISTDate(date);
      
      // Find matching day in streakHistory using IST dates
      const matchingDay = stats.streakHistory.find(day => {
        if (!day || !day.date) return false;
        // Compare formatted IST dates
        const dayIST = parseDateToIST(day.date);
        const dayDateString = formatISTDate(dayIST);
        return dayDateString === dateString;
      });
      
      heatmapData.push({
        date: dateString,
        problemCount: matchingDay ? matchingDay.problemCount : 0,
        activityLevel: matchingDay ? Math.min(matchingDay.problemCount, 4) : 0
      });
    }
    
    return heatmapData;
  };

  // Calculate month positions dynamically based on actual dates
  const getMonthPositions = () => {
    const todayIST = getISTDate();
    const monthPositions = [];
    
    // We'll track which months we've already positioned
    const monthsPlaced = new Set();
    
    // Create array for last 365 days
    for (let i = 364; i >= 0; i--) {
      const date = new Date(todayIST);
      date.setDate(todayIST.getDate() - i);
      const month = date.getMonth(); // 0 for Jan, 1 for Feb, etc.
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      // Calculate week number (0-based)
      const weekNumber = Math.floor((364 - i) / 7);
      
      // First day of the month or if we haven't placed this month yet
      if (date.getDate() === 1 && !monthsPlaced.has(month)) {
        // Calculate x position (each week is 11.52 units wide)
        const xPosition = weekNumber * 11.52;
        
        monthPositions.push({
          month: monthName,
          x: xPosition,
          weekNumber: weekNumber
        });
        
        monthsPlaced.add(month);
      }
    }
    
    return monthPositions;
  };

  // Render SVG heatmap with dynamic month positioning
  const renderSVGHeatmap = () => {
    const heatmapData = generateHeatmapData();
    const monthPositions = getMonthPositions();
    
    return (
      <>
        <svg 
          viewBox="0 0 787.78 104.64" 
          width="787.78" 
          height="104.64"
          className="w-full h-auto hidden md:block"
        >
          {/* Render cells - grouped by months */}
          {heatmapData.map((day, index) => {
            const week = Math.floor(index / 7);
            const dayInWeek = index % 7;
            const x = week * 11.52;
            const y = dayInWeek * 11.52;
            
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="8.86"
                height="8.86"
                fill={getActivityColor(day.activityLevel)}
                rx="2"
                ry="2"
                className="cursor-pointer"
              >
                <title>{`${day.date}: ${day.problemCount} problem${day.problemCount !== 1 ? 's' : ''} solved`}</title>
              </rect>
            );
          })}
          
          {/* Month labels - dynamically positioned */}
          {monthPositions.map((month, index) => (
            <text 
              key={index} 
              x={month.x} 
              y="97.9" 
              fontSize="9px" 
              fill="#AFB4BD"
            >
              {month.month}
            </text>
          ))}
        </svg>
        
        {/* CSS Variables for colors */}
        <style>
          {`
            :root {
              --fill-tertiary: #ebedf0;
              --green-20: #9be9a8;
              --green-40: #40c463;
              --green-60: #30a14e;
              --green-80: #216e39;
            }
            .dark {
              --fill-tertiary: #2d333b;
              --green-20: #0e4429;
              --green-40: #006d32;
              --green-60: #26a641;
              --green-80: #39d353;
            }
          `}
        </style>
      </>
    );
  };

  // Mobile SVG heatmap with dynamic month positioning
  const renderMobileSVGHeatmap = () => {
    const heatmapData = generateHeatmapData();
    const monthPositions = getMonthPositions();
    
    return (
      <div className="w-full overflow-x-auto pb-4">
        <svg 
          viewBox="0 0 787.78 104.64" 
          width="800"
          className="w-auto h-auto"
        >
          {/* Render cells */}
          {heatmapData.map((day, index) => {
            const week = Math.floor(index / 7);
            const dayInWeek = index % 7;
            const x = week * 11.52;
            const y = dayInWeek * 11.52;
            
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="8.86"
                height="8.86"
                fill={getActivityColor(day.activityLevel)}
                rx="2"
                ry="2"
                className="cursor-pointer"
              >
                <title>{`${day.date}: ${day.problemCount} problem${day.problemCount !== 1 ? 's' : ''} solved`}</title>
              </rect>
            );
          })}
          
          {/* Month labels - dynamically positioned */}
          {monthPositions.map((month, index) => (
            <text 
              key={index} 
              x={month.x} 
              y="97.9" 
              fontSize="9px" 
              fill="#AFB4BD"
            >
              {month.month}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile data
      const profileRes = await axiosClient.get(`/user/getProfile`, { 
        withCredentials: true 
      });
      
      // Extract user info - check if response has 'user' property or is the user object itself
      let userInfo;
      if (profileRes.data.user) {
        userInfo = profileRes.data.user;
      } else if (profileRes.data.firstName) {
        userInfo = profileRes.data;
      } else {
        userInfo = {};
      }
      
      console.log("Profile data:", userInfo);
      
      setUserFirstName(userInfo.firstName || "");

      // Reset profile form with fetched data
      resetProfileForm({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        age: userInfo.age || "",
        socialProfiles: {
          linkedin: userInfo.socialProfiles?.linkedin || "",
          x: userInfo.socialProfiles?.x || "",
          leetcode: userInfo.socialProfiles?.leetcode || "",
          github: userInfo.socialProfiles?.github || "",
        },
      });

      // Fetch stats data
      const statsRes = await axiosClient.get(`/user/stats`, { 
        withCredentials: true 
      });
      console.log("Stats data:", statsRes.data);
      
      // Fetch solved problems
      const solvedRes = await axiosClient.get(`/user/solved-problems`, { 
        withCredentials: true 
      });
      console.log("Solved problems:", solvedRes.data);
      
      // Fetch rank data
      const rankRes = await axiosClient.get(`/user/rank`, { 
        withCredentials: true 
      });
      console.log("Rank data:", rankRes.data);

      // Process and combine all data
      const statsData = statsRes.data.stats || {};
      const solvedProblems = solvedRes.data.solvedProblems || [];
      const rankData = rankRes.data || {};

      // Create calendar data with IST dates
      let streakHistory = [];
      if (statsData.streakHistory && Array.isArray(statsData.streakHistory) && statsData.streakHistory.length > 0) {
        // Convert all dates to IST
        streakHistory = statsData.streakHistory.map(day => {
          if (!day || !day.date) {
            return {
              date: formatISTDate(),
              problemCount: day?.problemCount || 0,
              activityLevel: Math.min(day?.problemCount || 0, 4)
            };
          }
          
          // Convert date to IST
          const dayIST = parseDateToIST(day.date);
          return {
            date: formatISTDate(dayIST),
            problemCount: day.problemCount || 0,
            activityLevel: Math.min(day.problemCount || 0, 4)
          };
        });
      } else {
        streakHistory = generateEmptyCalendar();
      }

      // Update stats state with all combined data
      setStats({
        totalProblems: statsData.totalProblems || solvedProblems.length || 0,
        totalPoints: statsData.totalPoints || 0,
        currentStreak: statsData.currentStreak || 0,
        maxStreak: statsData.maxStreak || 0,
        accuracy: statsData.accuracy || 0,
        totalSubmissions: statsData.totalSubmissions || 0,
        acceptedSubmissions: statsData.acceptedSubmissions || 0,
        totalActiveDays: statsData.totalActiveDays || 0,
        submissionsPastYear: statsData.submissionsPastYear || 0,
        rank: rankData.rank || 0,
        totalUsers: rankData.totalUsers || 0,
        percentile: rankData.percentile || 0,
        solvedProblems: solvedProblems,
        streakHistory: streakHistory
      });

    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      
      // Set fallback stats with IST dates
      setStats(prev => ({
        ...prev,
        solvedProblems: ensureSolvedProblemsArray(prev.solvedProblems),
        streakHistory: generateEmptyCalendar()
      }));
    } finally {
      setLoading(false);
    }
  }, [resetProfileForm]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateCurrentMonthActiveDays = () => {
    const todayIST = getISTDate();
    const currentMonth = todayIST.getUTCMonth();
    const currentYear = todayIST.getUTCFullYear();

    return stats.streakHistory.filter(day => {
      if (!day || !day.date) return false;
      
      // Parse the date string (already in IST format)
      const [year, month, dayOfMonth] = day.date.split('-').map(Number);
      
      return month - 1 === currentMonth && // month is 1-indexed in date string
             year === currentYear &&
             day.problemCount > 0;
    }).length;
  };

  // Profile Submit Handler
  const onProfileSubmit = async (data) => {
    setTabLoading(true);

    try {
      const res = await axiosClient.put(`/user/updateProfile`, data, {
        withCredentials: true
      });

      if (res.data.success) {
        alert("Profile updated successfully!");
        await fetchDashboardData();
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setTabLoading(false);
    }
  };

  // Password Submit Handler
  const onPasswordSubmit = async (data) => {
    try {
      const res = await axiosClient.post(`/user/changePassword`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }, {
        withCredentials: true
      });

      setPasswordMessage("Password changed successfully!");
      resetPasswordForm();
    } catch (err) {
      setPasswordError("oldPassword", {
        type: "manual",
        message: err.response?.data?.message || "Failed to change password"
      });
    }
  };

  // Forgot Password Submit Handler
  const onForgotPasswordSubmit = async (data) => {
    try {
      const res = await axiosClient.post(`/user/forgot-password`, data);
      alert(res.data.message || "Password reset link sent to your email");
      resetForgotPasswordForm();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    if (!window.confirm("Are you absolutely sure? This will delete ALL your data permanently!")) {
      setDeleteConfirm(false);
      return;
    }

    try {
      const res = await axiosClient.delete(`/user/deleteProfile`, {
        withCredentials: true
      });

      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
      setDeleteConfirm(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Get difficulty counts safely
  const getDifficultyCounts = () => {
    const solvedProblems = stats.solvedProblems || [];
    return {
      easy: solvedProblems.filter(p => p && p.difficulty === 'easy').length,
      medium: solvedProblems.filter(p => p && p.difficulty === 'medium').length,
      hard: solvedProblems.filter(p => p && p.difficulty === 'hard').length
    };
  };

 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-2xl p-8 shadow-lg">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.49 1.49L8.586 10l-1.293 1.293a1 1 0 101.49 1.49L10 11.49l1.293 1.293a1 1 0 001.49-1.49L11.49 10l1.293-1.293a1 1 0 00-1.49-1.49L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-900 dark:text-red-300 font-semibold text-lg mb-4">
            Error Loading Dashboard
          </p>
          <p className="text-red-700 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const solvedProblems = stats.solvedProblems || [];
  const difficultyCounts = getDifficultyCounts();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      {/* Background Animation */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-10 pb-20">
       
        {/* TITLE */}
        <div className="max-w-7xl mx-auto mb-5">
          <h1 className="text-4xl font-extrabold text-center mb-3">
            Welcome,{" "}
            <span className="text-[#021510] dark:text-emerald-600">{userFirstName || "User"}!</span>
          </h1>
          <p className="text-center text-black/70 dark:text-white/70">
            Track your coding journey and manage your account
          </p>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {["overview", "profile", "security", "problems"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === tab
                    ? "bg-emerald-900 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
                disabled={tabLoading}
              >
                {tab === "overview" && <FiActivity className="mr-2" />}
                {tab === "profile" && <FiUser className="mr-2" />}
                {tab === "security" && <FiLock className="mr-2" />}
                {tab === "problems" && <FiCode className="mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tabLoading && activeTab === tab && (
                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* STATS CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Problems Solved Card */}
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FiCode className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Problems Solved</p>
                      <h3 className="text-3xl font-bold">{stats.totalProblems}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {stats.totalProblems === 0
                      ? "Start solving problems to begin your journey!"
                      : "Keep solving to improve your skills!"}
                  </p>
                </div>

                {/* Total Points Card */}
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                      <FiStar className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Points</p>
                      <h3 className="text-3xl font-bold">{stats.totalPoints}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Earned from solving problems
                  </p>
                </div>

                {/* Submissions Card */}
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <FiCheckSquare className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Submissions</p>
                      <h3 className="text-3xl font-bold">{stats.totalSubmissions}</h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stats.acceptedSubmissions} accepted
                  </div>
                </div>

                {/* Accuracy Card */}
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <FiTarget className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                      <h3 className="text-3xl font-bold">{stats.accuracy}%</h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Based on your submissions
                  </div>
                </div>

                {/* Rank Card */}
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <FiBarChart2 className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Global Rank</p>
                      <h3 className="text-3xl font-bold">
                        {stats.rank ? `#${stats.rank}` : "#N/A"}
                      </h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stats.percentile > 0 ? `Top ${stats.percentile}%` : "Calculating..."}
                    {stats.totalUsers > 0 && ` of ${stats.totalUsers} users`}
                  </div>
                </div>

                {/* Year Activity Card */}
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <FiCalendar className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Year Activity</p>
                      <h3 className="text-3xl font-bold">{stats.submissionsPastYear}</h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Submissions in the past year
                  </div>
                </div>
              </div>

              {/* QUICK STATS BAR */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-900">
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
                </div>
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.maxStreak}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Max Streak</div>
                </div>
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.totalActiveDays}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Active Days</div>
                </div>
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {difficultyCounts.hard}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Hard Solved</div>
                </div>
              </div>

              {/* ACTIVITY CALENDAR - ORIGINAL STYLE */}
               <div className="mt-8">
                <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:space-y-0 space-y-2">
                      <div className="flex flex-1 items-center">
                        <span className="md:text-xl mr-2 text-base font-medium">
                          {stats.submissionsPastYear}
                        </span>
                        <span className="md:text-base whitespace-nowrap text-gray-600 dark:text-gray-300">
                          submissions in the past year
                        </span>
                        
                        <div className="ml-1 mr-2 text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path fillRule="evenodd" d="M12 11a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm0-3a1 1 0 110 2 1 1 0 010-2zm0 9C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs">
                        <div className="mr-4.5 space-x-1">
                          <span className="text-gray-500 dark:text-gray-400">Total active days:</span>
                          <span className="font-medium">{stats.totalActiveDays}</span>
                        </div>
                        <div className="space-x-1">
                          <span className="text-gray-500 dark:text-gray-400">Max streak:</span>
                          <span className="font-medium">{stats.maxStreak}</span>
                        </div>
                        
                        <div className="ml-[21px]">
                          <div className="relative">
                            <button
                              className="flex cursor-pointer items-center rounded px-3 py-1.5 text-left focus:outline-none whitespace-nowrap bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setSelectedTimeRange(prev => prev === "Current" ? "Last Year" : "Current")}
                            >
                              {selectedTimeRange}
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" className="pointer-events-none ml-3">
                                <path fillRule="evenodd" d="M4.929 7.913l7.078 7.057 7.064-7.057a1 1 0 111.49 1.49l-7.77 7.764a1 1 0 01-1.415 0L3.515 9.328a1 1 0 011.49-1.49z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Heatmap */}
                     <div className="hidden md:flex h-auto w-full flex-1 items-center justify-center">
                      {renderSVGHeatmap()}
                    </div>
                     
                    {/* Mobile Heatmap */}
                     <div className="md:hidden flex h-auto w-full flex-1 items-center overflow-x-auto overflow-y-visible">
                      <div className="pb-4">
                        {renderMobileSVGHeatmap()}
                      </div>
                    </div> 

                    {/* Legend */}
                     <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-4">
                      <span className="text-gray-500 dark:text-gray-400">Less</span>
                      {[0, 1, 2, 3, 4].map(level => {
                        const labels = ["0", "1", "2", "3", "4+"];
                        return (
                          <div key={level} className="flex items-center gap-1">
                            <div 
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: getActivityColor(level) }}
                            />
                            <span className="text-gray-500 dark:text-gray-400">
                              {labels[level]}
                            </span>
                          </div>
                        );
                      })}
                      <span className="text-gray-500 dark:text-gray-400">More</span>
                    </div> 
                  </div>
                </div>
              </div> 
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FiUser className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Update Profile</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Keep your information current</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">First Name</label>
                      <Controller
                        name="firstName"
                        control={profileControl}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="First Name"
                            className="w-full pl-4 pr-3 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                          />
                        )}
                      />
                      {profileErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Last Name</label>
                      <Controller
                        name="lastName"
                        control={profileControl}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="Last Name"
                            className="w-full pl-4 pr-3 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                          />
                        )}
                      />
                      {profileErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Age</label>
                    <Controller
                      name="age"
                      control={profileControl}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="5"
                          max="100"
                          placeholder="Age"
                          className="w-full pl-4 pr-3 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                        />
                      )}
                    />
                    {profileErrors.age && (
                      <p className="text-red-500 text-xs mt-1">{profileErrors.age.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Social Profiles</h3>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
                        <FiLinkedin />
                      </span>
                      <Controller
                        name="socialProfiles.linkedin"
                        control={profileControl}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="LinkedIn Profile URL"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                          />
                        )}
                      />
                      {profileErrors.socialProfiles?.linkedin && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.socialProfiles.linkedin.message}</p>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
                        <FiTwitter />
                      </span>
                      <Controller
                        name="socialProfiles.x"
                        control={profileControl}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="X (Twitter) Profile URL"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                          />
                        )}
                      />
                      {profileErrors.socialProfiles?.x && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.socialProfiles.x.message}</p>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
                        <SiLeetcode />
                      </span>
                      <Controller
                        name="socialProfiles.leetcode"
                        control={profileControl}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="LeetCode Profile URL"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                          />
                        )}
                      />
                      {profileErrors.socialProfiles?.leetcode && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.socialProfiles.leetcode.message}</p>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
                        <FiGithub />
                      </span>
                      <Controller
                        name="socialProfiles.github"
                        control={profileControl}
                        render={({ field }) => (
                          <input
                            {...field}
                            placeholder="GitHub Profile URL"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-900 text-sm"
                          />
                        )}
                      />
                      {profileErrors.socialProfiles?.github && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.socialProfiles.github.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProfileSubmitting}
                    className="w-full mt-4 px-4 py-2.5 rounded-lg bg-emerald-900 text-white font-semibold hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProfileSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* CHANGE PASSWORD */}
              <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FiKey className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Change Password</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
                    <div className="relative">
                      <Controller
                        name="oldPassword"
                        control={passwordControl}
                        render={({ field }) => (
                          <input
                            type={showPassword.old ? "text" : "password"}
                            {...field}
                            className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            placeholder="Enter current password"
                          />
                        )}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => togglePasswordVisibility("old")}
                      >
                        {showPassword.old ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.oldPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.oldPassword.message}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                    <div className="relative">
                      <Controller
                        name="newPassword"
                        control={passwordControl}
                        render={({ field }) => (
                          <input
                            type={showPassword.new ? "text" : "password"}
                            {...field}
                            className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            placeholder="Enter new password"
                          />
                        )}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPassword.new ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Controller
                        name="confirmPassword"
                        control={passwordControl}
                        render={({ field }) => (
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            {...field}
                            className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            placeholder="Confirm new password"
                          />
                        )}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  {passwordMessage && (
                    <div className={`p-3 rounded-lg text-sm ${passwordMessage.includes("successfully") ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                      {passwordMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="w-full mt-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isPasswordSubmitting ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                    <FiMail className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Forgot Password</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get a password reset link</p>
                  </div>
                </div>

                <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</label>
                      <Controller
                        name="emailId"
                        control={forgotPasswordControl}
                        render={({ field }) => (
                          <input
                            type="email"
                            {...field}
                            className="w-full pl-4 pr-3 py-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                            placeholder="Enter your registered email"
                          />
                        )}
                      />
                      {forgotPasswordErrors.emailId && (
                        <p className="text-red-500 text-xs mt-1">{forgotPasswordErrors.emailId.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isForgotPasswordSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      {isForgotPasswordSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              </div>

              {/* DELETE ACCOUNT */}
              <div className="bg-white/5 dark:bg-white/5 border border-red-200 dark:border-red-800 rounded-2xl p-6 backdrop-blur shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <FiTrash2 className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    This action cannot be undone. All your data including solved problems, submissions, and profile information will be permanently deleted.
                  </p>

                  {deleteConfirm && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                        ⚠️ Are you absolutely sure? This action is irreversible!
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex-1"
                        >
                          Yes, Delete My Account
                        </button>
                      </div>
                    </div>
                  )}

                  {!deleteConfirm && (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="w-full px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "problems" && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <FiCheckCircle className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Solved Problems</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total: {solvedProblems.length} problems
                      </p>
                    </div>
                  </div>

                  {solvedProblems.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                        {difficultyCounts.easy} Easy
                      </span>
                      <span className="px-3 py-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full">
                        {difficultyCounts.medium} Medium
                      </span>
                      <span className="px-3 py-1 text-xs bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
                        {difficultyCounts.hard} Hard
                      </span>
                    </div>
                  )}
                </div>

                {solvedProblems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                      <FiCode className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      No problems solved yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Start solving problems to see them here!
                    </p>
                    <button
                      onClick={() => window.location.href = '/problems'}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Browse Problems
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {solvedProblems.map((problem, index) => {
                      if (!problem) return null;

                      const difficulty = problem.difficulty || 'unknown';
                      const title = problem.title || `Problem ${index + 1}`;
                      const tags = problem.tags || [];

                      return (
                        <div
                          key={problem._id || index}
                          className="flex items-center justify-between py-4 px-5 bg-black/5 dark:bg-white/5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                              <FiCheckCircle />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${difficulty === 'easy'
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                    : difficulty === 'medium'
                                      ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                  }`}>
                                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                </span>
                                {tags.slice(0, 2).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {problem._id && (
                            <button
                              onClick={() => window.location.href = `/problem/${problem._id}`}
                              className="px-4 py-2 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              View
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;