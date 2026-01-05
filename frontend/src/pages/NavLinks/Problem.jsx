import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import { CheckCircle } from "lucide-react";
import AppLayout from "../../Components/AppLayout";

const ProblemsPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Problem of the Day
  const [dailyProblem, setDailyProblem] = useState(null);

  const difficulties = ["easy", "medium", "hard"];

  const allTags = [
    "array",
    "string",
    "linkedList",
    "stack",
    "queue",
    "hashing",
    "twoPointers",
    "slidingWindow",
    "binarySearch",
    "recursion",
    "backtracking",
    "greedy",
    "dynamicProgramming",
    "tree",
    "binaryTree",
    "bst",
    "graph",
    "heap",
    "trie",
    "bitManipulation",
    "math",
    "sorting",
  ];

  // Fetch problems
  const fetchProblems = async (page = 1) => {
    try {
      const params = { page, limit: 10 };
      if (filters.difficulty !== "all") params.difficulty = filters.difficulty;
      if (filters.tag !== "all") params.tags = filters.tag;

      const query = new URLSearchParams(params).toString();
      const res = await axiosClient.get(`/problem/getAllProblem?${query}`);

      setProblems(res.data.problems);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);

      // Random daily problem
      if (res.data.problems.length > 0) {
        const randomIndex = Math.floor(Math.random() * res.data.problems.length);
        setDailyProblem(res.data.problems[randomIndex]);
      }
    } catch (err) {
      console.error(err);
      setProblems([]);
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

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white px-6 sm:px-10 pt-20 pb-20">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-6">
          Solve <span className="text-[#021510] dark:text-emerald-400">Problems</span> and Level Up
        </h1>

        <p className="text-center text-black/70 dark:text-white/70 mb-14 max-w-2xl mx-auto">
          Browse, practice, and track your progress. Complete challenges and become a competitive programming master!
        </p>

        {/* PROBLEM OF THE DAY */}
        {dailyProblem && (
          <div className="bg-[#021510] dark:bg-emerald-900 text-white rounded-xl p-6 mb-12 max-w-4xl mx-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-2">🔥 Problem of the Day</h2>
            <NavLink
              to={`/problem/${dailyProblem._id}`}
              className="text-lg hover:underline font-semibold"
            >
              {dailyProblem.title}
            </NavLink>
            <p className="mt-2 text-sm text-white/80">
              Difficulty: <span className="font-medium">{dailyProblem.difficulty}</span> | Tags: {dailyProblem.tags.join(", ")}
            </p>
          </div>
        )}

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <input
            type="text"
            placeholder="Search problem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered md:col-span-2"
          />
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
          </select>
          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">Difficulty</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* PROBLEMS TABLE */}
        <div className="overflow-x-auto rounded-xl border dark:border-gray-800 mb-12">
          <table className="table">
            <thead className="bg-[#021510] text-white">
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    No problems found 🔍
                  </td>
                </tr>
              )}
              {filteredProblems.map((p) => {
                const solved = solvedIds.includes(p._id);
                return (
                  <tr
                    key={p._id}
                    className="hover:bg-green-50 dark:hover:bg-gray-900 transition"
                  >
                    <td>{solved && <CheckCircle className="text-green-600" size={18} />}</td>
                    <td>
                      <NavLink
                        to={`/problem/${p._id}`}
                        className="font-medium hover:text-green-700"
                      >
                        {p.title}
                      </NavLink>
                    </td>
                    <td>
                      <span className={`badge ${getBadgeColor(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td>
                      {p.tags.map((tag) => (
                        <span key={tag} className="badge badge-outline mr-1">
                          {tag}
                        </span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* STATS */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { label: "Total Problems", value: "120+" },
            { label: "Learning Paths", value: "8" },
            { label: "Difficulty Levels", value: "Beginner → Expert" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center backdrop-blur"
            >
              <p className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
                {stat.value}
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <div className="max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Solve Problems?
            </h2>
            <p className="mb-6 text-white/90">
              Pick a problem, track your progress, and improve your skills step by step.
            </p>
            <NavLink to="/problems" className="px-8 py-3 rounded-lg bg-white text-[#021510] font-semibold hover:opacity-90 transition">
              Start Practicing
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
