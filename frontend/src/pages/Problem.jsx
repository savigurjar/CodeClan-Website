// ProblemsPage.js (fixed)
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../features/authSlice";

export default function ProblemsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({ difficulty: "all", tag: "all", status: "all" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (err) { console.error(err); }
    };

    const fetchSolved = async () => {
      if (!user) return;
      try {
        const { data } = await axiosClient.get("/problem/problemAllSolvedByUser");
        setSolvedProblems(data);
      } catch (err) { console.error(err); }
    };

    fetchProblems();
    fetchSolved();
  }, [user]);

  const filtered = problems
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filters.difficulty === "all" || p.difficulty === filters.difficulty)
    .filter(p => filters.tag === "all" || p.tags === filters.tag)
    .filter(p => filters.status === "all" || (filters.status === "solved" && solvedProblems.some(sp => sp._id === p._id)));

  const tags = [...new Set(problems.map(p => p.tags))];

  return (
    <div className="flex-grow container mx-auto p-4">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          className="input input-bordered flex-grow" />
        <select className="select select-bordered" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="all">All Problems</option>
          <option value="solved">Solved</option>
        </select>
        <select className="select select-bordered" value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select className="select select-bordered" value={filters.tag} onChange={e => setFilters({ ...filters, tag: e.target.value })}>
          <option value="all">All Tags</option>
          {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      {/* Problems List */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center text-white/60 py-20">No problems found 🔍</div>
        ) : filtered.map(p => (
          <div key={p._id} className="card bg-base-100 shadow hover:shadow-xl transition-transform transform hover:-translate-y-1">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <NavLink to={`/problem/${p._id}`} className="card-title hover:text-green-400 transition">{p.title}</NavLink>
                {solvedProblems.some(sp => sp._id === p._id) && <span className="badge badge-success">Solved</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <span className={`badge ${getBadgeColor(p.difficulty)}`}>{p.difficulty}</span>
                <span className="badge badge-info">{p.tags}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const getBadgeColor = diff => {
  switch (diff.toLowerCase()) {
    case "easy": return "badge-success";
    case "medium": return "badge-warning";
    case "hard": return "badge-error";
    default: return "badge-neutral";
  }
};
