import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";

const AdminUpdate = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/problem/getAllProblem?page=${page}`
      );

      setProblems(Array.isArray(data.problems) ? data.problems : []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold">Update Problems</h1>
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProblems.length ? (
              filteredProblems.map((problem, index) => (
                <tr key={problem._id}>
                  <td>{index + 1 + (currentPage - 1) * 10}</td>
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
                      className="btn btn-sm btn-warning"
                      onClick={() =>
                        navigate(`/admin/update/${problem._id}`)
                      }
                    >
                      Update
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

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-sm"
        >
          Prev
        </button>

        <span className="btn btn-sm btn-disabled">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUpdate;
