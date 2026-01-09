import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

 const fetchProblems = async () => {
  try {
    setLoading(true);
    const { data } = await axiosClient.get("/problem/getAllProblem");

    console.log("getAllProblem response 👉", data); // 🔴 IMPORTANT

    setProblems(Array.isArray(data) ? data : []);
  } catch (err) {
    setError("Failed to fetch problems");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      // ✅ Delete problem
      await axiosClient.delete(`/problem/delete/${id}`);

      // ✅ OPTIONAL: delete video (safe even if none exists)
      await axiosClient.delete(`/video/delete/${id}`);

      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete problem");
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const query = searchQuery.toLowerCase();

    return (
      problem?.title?.toLowerCase().includes(query) ||
      problem?._id?.toLowerCase().includes(query) ||
      problem?.difficulty?.toLowerCase().includes(query) ||
      (Array.isArray(problem?.tags)
        ? problem.tags.join(", ").toLowerCase().includes(query)
        : problem?.tags?.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Delete Problems</h1>

        <input
          type="text"
          placeholder="Search by title, ID, difficulty, or tags..."
          className="input input-bordered w-full sm:max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProblems.length ? (
              filteredProblems.map((problem, index) => (
                <tr key={problem._id}>
                  <td>{index + 1}</td>
                  <td>{problem.title}</td>
                  <td>
                    <span
                      className={`badge ${
                        problem.difficulty === "Easy"
                          ? "badge-success"
                          : problem.difficulty === "Medium"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {Array.isArray(problem.tags)
                        ? problem.tags.join(", ")
                        : problem.tags}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No matching problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDelete;
