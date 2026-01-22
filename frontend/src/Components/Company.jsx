// import Animate from "../animate";

// const CompanyPracticePage = () => {
//   const companies = [
//     {
//       name: "Netflix",
//       avg: "50%",
//       desc: "Prepare with Netflix interview questions and real-world experiences.",
//       total: 2,
//       easy: 1,
//       medium: 0,
//       hard: 1,
//       submissions: 1,
//     },
//     {
//       name: "Google",
//       avg: "50%",
//       desc: "Master Google interview questions with curated problem sets.",
//       total: 31,
//       easy: 8,
//       medium: 19,
//       hard: 4,
//       submissions: 51,
//     },
//     {
//       name: "Amazon",
//       avg: "52.88%",
//       desc: "Practice Amazon interview questions from easy to challenging levels.",
//       total: 33,
//       easy: 9,
//       medium: 21,
//       hard: 3,
//       submissions: 55,
//     },
//     {
//       name: "Microsoft",
//       avg: "50%",
//       desc: "Prepare Microsoft interview problems and track your success rate.",
//       total: 30,
//       easy: 7,
//       medium: 20,
//       hard: 3,
//       submissions: 42,
//     },
//     {
//       name: "Apple",
//       avg: "33.33%",
//       desc: "Tackle Apple interview questions with curated problem sets.",
//       total: 3,
//       easy: 0,
//       medium: 2,
//       hard: 1,
//       submissions: 3,
//     },
//   ];

//   return (
//     <div className="relative  min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

//       {/* 🌌 Background */}
//       <div className="hidden dark:block">
//         <Animate />
//       </div>

//       {/* HERO */}
//       <div className="relative z-10 px-6 sm:px-12 pt-20 pb-12 text-center">
//         <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
//           Practice by Company
//         </h1>
//         <p className="text-black/70 dark:text-white/70 max-w-2xl mx-auto">
//           Prepare for interviews at top tech companies with curated problem sets and real interview experiences.
//         </p>
//       </div>

//       {/* COMPANY CARDS */}
//       {/* <div className="relative z-10 px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
//         {companies.map((company) => (
//           <div
//             key={company.name}
//             className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur hover:scale-[1.03] transition hover:shadow-lg"
//           >
//             <h3 className="text-2xl font-bold mb-1 text-[#021510] dark:text-emerald-400">{company.name}</h3>
//             <p className="text-sm text-black/60 dark:text-white/60 mb-3">{company.desc}</p>
//             <div className="grid grid-cols-2 gap-2 text-sm mb-3">
//               <div className="flex justify-between"><span>Total Problems:</span> <span>{company.total}</span></div>
//               <div className="flex justify-between"><span>Easy:</span> <span>{company.easy}</span></div>
//               <div className="flex justify-between"><span>Medium:</span> <span>{company.medium}</span></div>
//               <div className="flex justify-between"><span>Hard:</span> <span>{company.hard}</span></div>
//               <div className="flex justify-between"><span>Success Rate:</span> <span>{company.avg}</span></div>
//               <div className="flex justify-between"><span>Total Submissions:</span> <span>{company.submissions}</span></div>
//             </div>
//             <button className="px-4 py-2 rounded-lg bg-[#021510] dark:bg-emerald-600 text-white font-semibold hover:opacity-90 transition">
//               Start Practicing
//             </button>
//           </div>
//         ))}
//       </div> */}

//    <div className="relative px-6 sm:px-12 mt-12 mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//   {companies.map((company) => (
//     <div
//       key={company.name}
//       className="
//         bg-white
//         dark:bg-white/5
//         border border-black/10 dark:border-white/10
//         rounded-3xl p-6
//         backdrop-blur
//         shadow-md hover:shadow-xl
//         hover:-translate-y-1
//         transition-all
//       "
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
//           {company.name}
//         </h3>

//         <span
//           className="
//             px-3 py-1 text-xs font-semibold rounded-full
//             bg-[#021510]/10 text-[#021510]
//             dark:bg-emerald-500/20 dark:text-emerald-300
//           "
//         >
//           {company.avg} Success
//         </span>
//       </div>

//       {/* Description */}
//       <p className="text-sm text-black/70 dark:text-white/70 mb-4">
//         {company.desc}
//       </p>

// {/* Stats */}
// <div className="grid grid-cols-2 gap-3 text-sm mb-6">
//   <div className="flex items-center justify-between">
//     <span className="text-black/70 dark:text-white/60">Total</span>
//     <span className="font-semibold text-[#021510] dark:text-white">
//       {company.total}
//     </span>
//   </div>

//   <div className="flex items-center justify-between">
//     <span className="px-2 py-0.5 rounded-md text-xs border
//       border-green-500/40 text-green-700
//       dark:border-green-400/40 dark:text-green-300">
//       Easy
//     </span>
//     <span className="font-semibold text-green-700 dark:text-green-300">
//       {company.easy}
//     </span>
//   </div>

//   <div className="flex items-center justify-between">
//     <span className="px-2 py-0.5 rounded-md text-xs border
//       border-yellow-500/40 text-yellow-700
//       dark:border-yellow-400/40 dark:text-yellow-300">
//       Medium
//     </span>
//     <span className="font-semibold text-yellow-700 dark:text-yellow-300">
//       {company.medium}
//     </span>
//   </div>

//   <div className="flex items-center justify-between">
//     <span className="px-2 py-0.5 rounded-md text-xs border
//       border-red-500/40 text-red-700
//       dark:border-red-400/40 dark:text-red-300">
//       Hard
//     </span>
//     <span className="font-semibold text-red-700 dark:text-red-300">
//       {company.hard}
//     </span>
//   </div>

//   <div className="flex items-center justify-between col-span-2">
//     <span className="text-black/70 dark:text-white/60">Submissions</span>
//     <span className="font-semibold text-[#021510] dark:text-white">
//       {company.submissions}
//     </span>
//   </div>
// </div>


//       {/* Button */}
//       <button
//         className="
//           w-full py-3 rounded-lg font-semibold
//           bg-[#021510] text-white
//           dark:bg-emerald-600
//           hover:bg-[#03261d] dark:hover:bg-emerald-700
//           transition
//         "
//       >
//         Start Practicing
//       </button>
//     </div>
//   ))}
// </div>



//       {/* CTA */}
//       <div className="mt-24 px-6 sm:px-12 mb-20 relative">
//         <div className="relative overflow-hidden max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
//          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
//           <h2 className="text-3xl font-extrabold mb-4">
//             Ready to Ace Your Interviews?
//           </h2>
//           <p className="mb-6 text-white/90">
//             Practice company-specific problems, improve your success rate, and land your dream job.
//           </p>
//            <button className="
//               px-8 py-3 rounded-lg
//               bg-white text-[#021510]
//               font-semibold
//               hover:bg-emerald-100 hover:scale-105
//               transition-all
//             ">
//             Start Practicing
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default CompanyPracticePage;

import { useState, useEffect } from "react";
import Animate from "../animate";
import { Search, Filter, TrendingUp, Users, Target, ChevronRight, Star, TrendingDown, BarChart3, Clock, CheckCircle } from "lucide-react";

const CompanyPracticePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Netflix",
      avg: "50%",
      desc: "Prepare with Netflix interview questions and real-world experiences.",
      total: 2,
      easy: 1,
      medium: 0,
      hard: 1,
      submissions: 1,
      popularity: 4.2,
      recentActivity: "2 days ago",
      featured: true,
      tags: ["Streaming", "Entertainment"],
      avgTime: "45 mins",
    },
    {
      id: 2,
      name: "Google",
      avg: "50%",
      desc: "Master Google interview questions with curated problem sets.",
      total: 31,
      easy: 8,
      medium: 19,
      hard: 4,
      submissions: 51,
      popularity: 4.8,
      recentActivity: "Today",
      featured: true,
      tags: ["Search", "AI", "Cloud"],
      avgTime: "60 mins",
    },
    {
      id: 3,
      name: "Amazon",
      avg: "52.88%",
      desc: "Practice Amazon interview questions from easy to challenging levels.",
      total: 33,
      easy: 9,
      medium: 21,
      hard: 3,
      submissions: 55,
      popularity: 4.5,
      recentActivity: "1 day ago",
      featured: false,
      tags: ["E-commerce", "AWS", "Logistics"],
      avgTime: "55 mins",
    },
    {
      id: 4,
      name: "Microsoft",
      avg: "50%",
      desc: "Prepare Microsoft interview problems and track your success rate.",
      total: 30,
      easy: 7,
      medium: 20,
      hard: 3,
      submissions: 42,
      popularity: 4.3,
      recentActivity: "3 days ago",
      featured: true,
      tags: ["Software", "Cloud", "Enterprise"],
      avgTime: "50 mins",
    },
    {
      id: 5,
      name: "Apple",
      avg: "33.33%",
      desc: "Tackle Apple interview questions with curated problem sets.",
      total: 3,
      easy: 0,
      medium: 2,
      hard: 1,
      submissions: 3,
      popularity: 4.0,
      recentActivity: "1 week ago",
      featured: false,
      tags: ["Hardware", "iOS", "Design"],
      avgTime: "40 mins",
    },
    {
      id: 6,
      name: "Meta",
      avg: "48.5%",
      desc: "Master Facebook/Meta interview patterns and system design.",
      total: 28,
      easy: 6,
      medium: 18,
      hard: 4,
      submissions: 38,
      popularity: 4.4,
      recentActivity: "Today",
      featured: true,
      tags: ["Social Media", "VR", "Ads"],
      avgTime: "65 mins",
    },
    {
      id: 7,
      name: "Tesla",
      avg: "42.1%",
      desc: "Prepare for Tesla's unique engineering and coding interviews.",
      total: 15,
      easy: 3,
      medium: 10,
      hard: 2,
      submissions: 19,
      popularity: 4.1,
      recentActivity: "4 days ago",
      featured: false,
      tags: ["Automotive", "Energy", "AI"],
      avgTime: "70 mins",
    },
    {
      id: 8,
      name: "Uber",
      avg: "46.7%",
      desc: "Practice Uber's real-world system design and algorithm problems.",
      total: 22,
      easy: 5,
      medium: 14,
      hard: 3,
      submissions: 31,
      popularity: 4.0,
      recentActivity: "2 days ago",
      featured: false,
      tags: ["Ride-sharing", "Maps", "Logistics"],
      avgTime: "55 mins",
    },
    {
      id: 9,
      name: "Airbnb",
      avg: "44.3%",
      desc: "Master Airbnb's product-focused interview questions.",
      total: 18,
      easy: 4,
      medium: 12,
      hard: 2,
      submissions: 24,
      popularity: 3.9,
      recentActivity: "5 days ago",
      featured: false,
      tags: ["Travel", "Marketplace", "Design"],
      avgTime: "50 mins",
    },
  ]);

  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    avgSuccessRate: "0%",
  });

  // Filter and sort companies
  useEffect(() => {
    let result = [...companies];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Difficulty filter
    if (selectedDifficulty !== "all") {
      result = result.filter(company => company[selectedDifficulty] > 0);
    }
    
    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "total":
          return b.total - a.total;
        case "success":
          return parseFloat(b.avg) - parseFloat(a.avg);
        case "popularity":
          return b.popularity - a.popularity;
        case "submissions":
          return b.submissions - a.submissions;
        default:
          return 0;
      }
    });
    
    setFilteredCompanies(result);
    
    // Calculate stats
    const totalProblems = result.reduce((sum, company) => sum + company.total, 0);
    const totalSubmissions = result.reduce((sum, company) => sum + company.submissions, 0);
    const avgSuccessRate = result.length > 0
      ? (result.reduce((sum, company) => sum + parseFloat(company.avg), 0) / result.length).toFixed(1) + "%"
      : "0%";
    
    setStats({
      totalCompanies: result.length,
      totalProblems,
      totalSubmissions,
      avgSuccessRate,
    });
  }, [searchQuery, selectedDifficulty, sortBy, companies]);

  const DifficultyBadge = ({ level, count }) => {
    const config = {
      easy: { color: "border-green-500/40 text-green-700 dark:text-green-300", bg: "bg-green-500/10" },
      medium: { color: "border-yellow-500/40 text-yellow-700 dark:text-yellow-300", bg: "bg-yellow-500/10" },
      hard: { color: "border-red-500/40 text-red-700 dark:text-red-300", bg: "bg-red-500/10" },
    };
    
    const { color, bg } = config[level.toLowerCase()] || config.medium;
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${color} ${bg}`}>
        {level}: {count}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      {/* 🌌 Background */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 px-6 sm:px-12 pt-20 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            <Target size={16} />
            <span>Company-Specific Interview Prep</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#021510] to-emerald-600 dark:from-white dark:to-emerald-400">
            Practice by Company
          </h1>
          <p className="text-lg text-black/70 dark:text-white/70 max-w-3xl mx-auto mb-8">
            Prepare for interviews at top tech companies with curated problem sets, real interview experiences, and detailed analytics.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { icon: <Users size={20} />, label: "Companies", value: stats.totalCompanies },
              { icon: <BarChart3 size={20} />, label: "Problems", value: stats.totalProblems },
              { icon: <TrendingUp size={20} />, label: "Avg. Success", value: stats.avgSuccessRate },
              { icon: <CheckCircle size={20} />, label: "Submissions", value: stats.totalSubmissions },
            ].map((stat, idx) => (
              <div key={idx} className="bg-black/5 dark:bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-black/60 dark:text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="relative z-10 px-6 sm:px-12 max-w-6xl mx-auto mb-8">
        <div className="bg-white dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search companies or tags..."
                  className="w-full pl-12 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-black/60 dark:text-white/60" />
              <div className="flex gap-2 flex-wrap">
                {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty === "All" ? "all" : difficulty.toLowerCase())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedDifficulty === (difficulty === "All" ? "all" : difficulty.toLowerCase())
                        ? "bg-emerald-500 text-white"
                        : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-auto">
              <select
                className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by: Name</option>
                <option value="total">Total Problems</option>
                <option value="success">Success Rate</option>
                <option value="popularity">Popularity</option>
                <option value="submissions">Submissions</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || selectedDifficulty !== "all") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-black/60 dark:text-white/60">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedDifficulty !== "all" && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
                  {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} difficulty
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDifficulty("all");
                }}
                className="ml-2 text-sm text-red-500 hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COMPANY CARDS GRID */}
      <div className="relative px-6 sm:px-12 mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="group bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Featured Badge */}
            {company.featured && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Star size={12} />
                <span>FEATURED</span>
              </div>
            )}
            
            {/* Company Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#021510] dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                  {company.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(company.popularity) ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}
                      />
                    ))}
                    <span className="text-sm text-black/60 dark:text-white/60 ml-1">
                      {company.popularity}
                    </span>
                  </div>
                  <span className="text-xs text-black/50 dark:text-white/50">•</span>
                  <span className="text-sm text-black/60 dark:text-white/60 flex items-center gap-1">
                    <Clock size={12} />
                    {company.avgTime}
                  </span>
                </div>
              </div>
              
              {/* Success Rate with Trend */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xl font-bold text-[#021510] dark:text-emerald-400">
                    {company.avg}
                  </span>
                  {parseFloat(company.avg) >= 50 ? (
                    <TrendingUp size={20} className="text-green-500" />
                  ) : (
                    <TrendingDown size={20} className="text-red-500" />
                  )}
                </div>
                <div className="text-xs text-black/60 dark:text-white/60">Success Rate</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-black/70 dark:text-white/70 mb-4 line-clamp-2">
              {company.desc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {company.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs bg-black/5 dark:bg-white/10 rounded-full text-black/70 dark:text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70 dark:text-white/60">Total Problems</span>
                <span className="font-bold text-[#021510] dark:text-white">{company.total}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/70 dark:text-white/60">Submissions</span>
                <span className="font-bold text-[#021510] dark:text-white">{company.submissions}</span>
              </div>
              
              {/* Difficulty Distribution */}
              <div className="col-span-2 mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Difficulty Distribution</span>
                </div>
                <div className="flex gap-2">
                  <DifficultyBadge level="Easy" count={company.easy} />
                  <DifficultyBadge level="Medium" count={company.medium} />
                  <DifficultyBadge level="Hard" count={company.hard} />
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="flex h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                    <div
                      className="bg-green-500"
                      style={{ width: `${(company.easy / company.total) * 100}%` }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${(company.medium / company.total) * 100}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${(company.hard / company.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity & Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-black/50 dark:text-white/50">
                Updated {company.recentActivity}
              </span>
              <button className="group/btn flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#021510] to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 text-white font-semibold hover:opacity-90 transition-all hover:scale-[1.02]">
                Start Practice
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredCompanies.length === 0 && (
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Search size={48} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No companies found</h3>
          <p className="text-black/70 dark:text-white/70 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("all");
            }}
            className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* CTA SECTION */}
      <div className="relative px-6 sm:px-12 mb-20">
        <div className="relative overflow-hidden max-w-4xl mx-auto rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/10 blur-3xl" />
          <div className="relative bg-gradient-to-r from-[#021510] to-emerald-900 dark:from-emerald-900/80 dark:to-emerald-950/80 p-10 rounded-3xl text-center border border-emerald-500/20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold mb-4 text-white">
                Ready to Ace Your Interviews?
              </h2>
              <p className="mb-8 text-white/90 text-lg">
                Practice company-specific problems, track your progress with detailed analytics, 
                and join thousands who've landed their dream jobs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 rounded-xl bg-white text-[#021510] font-bold hover:bg-emerald-50 hover:scale-105 transition-all flex items-center justify-center gap-3">
                  <TrendingUp size={20} />
                  Start Free Trial
                </button>
                <button className="px-8 py-4 rounded-xl bg-emerald-600/20 text-white border border-emerald-500/30 font-bold hover:bg-emerald-600/30 transition-all">
                  View All Companies
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-emerald-500/20">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "500+", label: "Problems" },
                  { value: "95%", label: "Satisfaction" },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-emerald-300/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="relative z-10 px-6 sm:px-12 pb-10 text-center">
        <p className="text-sm text-black/50 dark:text-white/50">
          Data is updated daily based on user submissions and interview experiences.
          <br />
          Success rates are calculated from actual user performance metrics.
        </p>
      </div>
    </div>
  );
};

export default CompanyPracticePage;
