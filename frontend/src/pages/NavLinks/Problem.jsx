import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import { CheckCircle } from "lucide-react";
import AppLayout from "../../Components/AppLayout";
import Animate from "../../animate"
import StatsSection from "./StateSection";
const ProblemsPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
    company: "all",
  });
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);


  // Problem of the Day
  const [dailyProblem, setDailyProblem] = useState(null);

  const difficulties = ["easy", "medium", "hard"];
  const allTags = [
    "array", "string", "linkedList", "stack", "queue", "hashing",
    "twoPointers", "slidingWindow", "binarySearch", "recursion",
    "backtracking", "greedy", "dynamicProgramming", "tree", "binaryTree",
    "bst", "graph", "heap", "trie", "bitManipulation", "math", "sorting",
  ];
  const allCompanies = ["Google", "Facebook", "Amazon", "Microsoft", "Apple", "Netflix"];

  // Fetch problems
  // Fetch problems
  const fetchProblems = async (page = 1) => {
     setLoading(true);
    try {
      let params = { page, limit: 10 };

      // If filtering by solved, fetch a high limit so all solved problems can be filtered
      if (filters.status === "solved") {
        params.page = 1;
        params.limit = 1000; // fetch up to 1000 problems to filter solved properly
      }

      if (filters.difficulty !== "all") params.difficulty = filters.difficulty;
      if (filters.tag !== "all") params.tags = filters.tag;
      if (filters.company !== "all") params.companies = filters.company;

      const query = new URLSearchParams(params).toString();
      const res = await axiosClient.get(`/problem/getAllProblem?${query}`);

      setProblems(res.data.problems);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setNextPage(res.data.nextPage);
      setPrevPage(res.data.prevPage);

      // Random daily problem
      if (res.data.problems.length > 0) {
        const randomIndex = Math.floor(Math.random() * res.data.problems.length);
        setDailyProblem(res.data.problems[randomIndex]);
      }
    } catch (err) {
      console.error(err);
      setProblems([]);
    }finally {
    setLoading(false); // stop loading
  }
  };


  // Fetch solved problems
  const fetchSolvedProblems = async () => {
    if (!user) return;
    try {
       
      const res = await axiosClient.get("/problem/problemSolvedByUser");
      setSolvedProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems(currentPage);
    fetchSolvedProblems();
  }, [filters, currentPage, user]);

  const solvedIds = solvedProblems.map((p) => p._id);

  const filteredProblems = problems
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (p) =>
        filters.status === "all" ||
        (filters.status === "solved" && solvedIds.includes(p._id))
    );

  const getBadgeTheme = (name) => {
    switch (name.toLowerCase()) {
      // Tags
      case "array":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700";
      case "string":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-700";
      case "linkedlist":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700";
      case "stack":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
      case "queue":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700";
      case "hashing":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700";
      case "twopointers":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700";
      case "slidingwindow":
        return "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200 border-lime-300 dark:border-lime-700";
      case "binarysearch":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700";
      case "recursion":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700";
      case "backtracking":
        return "bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100 border-pink-300 dark:border-pink-600";
      case "greedy":
        return "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100 border-orange-300 dark:border-orange-600";
      case "dynamicprogramming":
        return "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100 border-purple-300 dark:border-purple-600";
      case "tree":
        return "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100 border-green-300 dark:border-green-600";
      case "binarytree":
        return "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100 border-teal-300 dark:border-teal-600";
      case "bst":
        return "bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-100 border-cyan-300 dark:border-cyan-600";
      case "graph":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700";
      case "heap":
        return "bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600";
      case "trie":
        return "bg-pink-300 text-pink-900 dark:bg-pink-700 dark:text-pink-100 border-pink-300 dark:border-pink-600";
      case "bitmanipulation":
        return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600";
      case "math":
        return "bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100 border-indigo-300 dark:border-indigo-600";
      case "sorting":
        return "bg-purple-300 text-purple-900 dark:bg-purple-700 dark:text-purple-100 border-purple-300 dark:border-purple-600";

      // Companies
      case "google":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700";
      case "facebook":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700";
      case "amazon":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
      case "microsoft":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700";
      case "apple":
        return "bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-600";
      case "netflix":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700";

      // Default fallback
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600";
    }
  };


if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
        <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
          Loading Problems...
        </p>
      </div>
    </div>
  );
}


  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white px-6 sm:px-10 pt-20 pb-20">


        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-6 relative">
          Solve <span className="text-[#021510] dark:text-emerald-400">Problems</span> and Level Up
        </h1>

        <p className="text-center text-black/70 dark:text-white/70 mb-14 max-w-2xl mx-auto relative">
          Browse, practice, and track your progress. Complete challenges and become a competitive programming master!
        </p>

        {/* PROBLEM OF THE DAY */}
        {dailyProblem && (
          <div className="relative bg-[#021510] dark:bg-gray-900 text-white rounded-xl p-6 mb-12 max-w-4xl mx-auto shadow-lg border border-gray-800 dark:border-gray-700 overflow-hidden">

            {/* Animate background (dark only) */}
            <div className="hidden dark:block absolute inset-0 z-0">
              <Animate />
            </div>

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/50 z-[1] dark:bg-black/60" />

            {/* CONTENT */}
            <div className="relative z-10">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🔥 Problem of the Day
                </h2>

                {dailyProblem.points && (
                  <span className="px-3 py-1 rounded-md bg-yellow-500 text-black text-sm font-semibold">
                    +{dailyProblem.points} Coins
                  </span>
                )}
              </div>

              {/* Title */}
              <NavLink
                to={`/problem/${dailyProblem._id}`}
                className="text-xl font-semibold hover:underline hover:text-emerald-400 transition"
              >
                {dailyProblem.title}
              </NavLink>

              {/* Difficulty */}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium border ${getBadgeColor(
                    dailyProblem.difficulty
                  )}`}
                >
                  {dailyProblem.difficulty.toUpperCase()}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {dailyProblem.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-md text-xs font-medium border 
            ${getBadgeTheme(tag)}
            hover:bg-emerald-600 hover:text-white transition`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Companies */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {dailyProblem.companies.map((company) => (
                  <span
                    key={company}
                    className={`px-2 py-1 rounded-md text-xs font-medium border 
            ${getBadgeTheme(company)}
            hover:bg-emerald-700 hover:text-white transition`}
                  >
                    {company}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                <NavLink
                  to={`/problem/${dailyProblem._id}`}
                  className="px-6 py-2 rounded-lg font-semibold 
          bg-emerald-600 hover:bg-emerald-700 
          dark:bg-emerald-700 dark:hover:bg-emerald-800
          transition"
                >
                  Solve Now
                </NavLink>

                <span className="text-sm text-white/70">
                  {dailyProblem.solvedToday || 0} solved today
                </span>
              </div>

            </div>
          </div>
        )}





        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
          <input
            type="text"
            placeholder="Search problem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered 
               bg-white text-green-950 border-gray-300 
               hover:bg-green-950 hover:text-white 
               dark:bg-[#021510] dark:text-emerald-400 dark:border-gray-700 
               md:col-span-2"
          />

          <select
            className="select select-bordered 
               bg-white text-green-950 border-gray-300 
               hover:bg-green-950 hover:text-white 
               dark:bg-[#021510] dark:text-emerald-400 dark:border-gray-700"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all" className="hover:bg-green-950 hover:text-white">All</option>
            <option value="solved" className="hover:bg-green-950 hover:text-white">Solved</option>
          </select>

          <select
            className="select select-bordered 
               bg-white text-green-950 border-gray-300 
               hover:bg-green-950 hover:text-white 
               dark:bg-[#021510] dark:text-emerald-400 dark:border-gray-700"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">Difficulty</option>
            {difficulties.map((d) => (
              <option key={d} value={d} className="hover:bg-green-950 hover:text-white">{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>

          <select
            className="select select-bordered 
               bg-white text-green-950 border-gray-300 
               hover:bg-green-950 hover:text-white 
               dark:bg-[#021510] dark:text-emerald-400 dark:border-gray-700"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag} className="hover:bg-green-950 hover:text-white">{tag}</option>
            ))}
          </select>

          <select
            className="select select-bordered 
               bg-white text-green-950 border-gray-300 
               hover:bg-green-950 hover:text-white 
               dark:bg-[#021510] dark:text-emerald-400 dark:border-gray-700"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          >
            <option value="all">Companies</option>
            {allCompanies.map((company) => (
              <option key={company} value={company} className="hover:bg-green-950 hover:text-white">{company}</option>
            ))}
          </select>
        </div>



        {/* PROBLEMS TABLE */}
        <div className="overflow-x-auto rounded-xl border dark:border-gray-800 mb-6">
          <table className="table">
            <thead className="bg-[#021510] text-white">
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Companies</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No problems found 🔍
                  </td>
                </tr>
              )}
              {filteredProblems.map((p) => {
                const solved = solvedIds.includes(p._id);
                return (
                  <tr
                    key={p._id}
                    className="hover:bg-green-50 dark:hover:bg-emerald-950 transition"
                  >
                    {/* Status */}
                    <td>{solved && <CheckCircle className="text-green-600" size={18} />}</td>

                    {/* Title */}
                    <td>
                      <NavLink
                        to={`/problem/${p._id}`}
                        className="font-medium hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                      >
                        {p.title}
                      </NavLink>
                    </td>

                    {/* Difficulty */}
                    <td>
                      <span className={`badge ${getBadgeColor(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </td>



                    {/* Tags */}
                    <td>
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`badge mr-1 px-2 py-1 text-sm border rounded ${getBadgeTheme(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </td>

                    {/* Companies */}
                    <td>
                      {p.companies.map((c) => (
                        <span
                          key={c}
                          className={`badge mr-1 px-2 py-1 text-sm border rounded ${getBadgeTheme(c)}`}
                        >
                          {c}
                        </span>
                      ))}
                    </td>





                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mb-12 relative">
          {/* Previous Button */}
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-[#021510] bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-emerald-900 dark:text-white dark:border-emerald-700 dark:hover:bg-emerald-800 transition"
            onClick={() => prevPage && setCurrentPage(prevPage)}
            disabled={!prevPage}
          >
            Previous
          </button>

          {/* Page Info */}
          <span className="text-[#021510] dark:text-white font-medium">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next Button */}
          <button
            className="px-4 py-2 relative rounded-lg border border-gray-300 text-[#021510] bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-emerald-900 dark:text-white dark:border-emerald-700 dark:hover:bg-emerald-800 transition"
            onClick={() => nextPage && setCurrentPage(nextPage)}
            disabled={!nextPage}
          >
            Next
          </button>
        </div>


        {/* STATS */}
        {/* STATS
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { label: "Total Problems", value: "120+", icon: "📘" },
            { label: "Learning Paths", value: "8", icon: "🧭" },
            { label: "Difficulty Levels", value: "Beginner → Expert", icon: "⚡" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="
        group
        bg-black/5 dark:bg-white/5
        border border-black/10 dark:border-white/10
        rounded-xl p-6 text-center backdrop-blur
        hover:border-emerald-500/50
        hover:shadow-lg hover:-translate-y-1
        transition-all duration-300
      "
            >
              <div className="text-3xl mb-2">{stat.icon}</div>

              <p className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
                {stat.value}
              </p>

              <p className="text-sm text-black/60 dark:text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div> */}
        <StatsSection/>


        {/* CTA */}
        <div className="mt-12 relative">
          <div
            className="
      max-w-3xl mx-auto rounded-2xl p-10 text-center
      bg-[#021510] text-white
      dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950
      shadow-xl
      relative overflow-hidden
    "
          >
            {/* soft glow */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />

            <h2 className="text-3xl font-extrabold mb-4 flex items-center justify-center gap-2">
              Ready to Solve Problems?
            </h2>

            <p className="mb-6 text-white/90 max-w-xl mx-auto">
              Pick a problem, track your progress, and improve your skills step by step.
            </p>

            <NavLink
              to="/problems"
              className="
        inline-flex items-center gap-2
        px-8 py-3 rounded-lg
        bg-white text-[#021510]
        font-semibold
        hover:bg-emerald-100
        hover:scale-105
        transition-all
      "
            >
              Start Practicing
              <span>👉</span>
            </NavLink>
          </div>
        </div>


      </div>
    </AppLayout>
  );
};

export default ProblemsPage;

// Helper for difficulty badges
const getBadgeColor = (diff) => {
  switch (diff.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};
