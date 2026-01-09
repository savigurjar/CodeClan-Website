import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { NavLink } from "react-router";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [videoMap, setVideoMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const loadData = async (page = 1) => {
    try {
      setLoading(true);

      const [problemRes, videoRes] = await Promise.all([
        axiosClient.get(`/problem/getAllProblem?page=${page}`),
        axiosClient.get("/video/status"),
      ]);

      console.log("Problem API response:", problemRes.data);
      console.log("Video API response:", videoRes.data);

      setProblems(Array.isArray(problemRes.data.problems) ? problemRes.data.problems : []);
      setVideoMap(videoRes.data || {});
      setCurrentPage(problemRes.data.currentPage || 1);
      setTotalPages(problemRes.data.totalPages || 1);

    } catch (err) {
      console.error("Error loading admin data:", err.response || err);
      setError(err.response?.data?.error || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (problemId) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await axiosClient.delete(`/video/delete/${problemId}`);
      setVideoMap(prev => {
        const newMap = { ...prev };
        delete newMap[problemId];
        return newMap;
      });
    } catch (err) {
      console.error("Delete error:", err.response || err);
      alert(err.response?.data?.error || "Failed to delete video");
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg mx-auto mt-20"></div>;
  }

  if (error) {
    return (
      <div className="alert alert-error my-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Video Upload & Management</h1>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Tags</th>
            <th>Video</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Thumbnail</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(problems) && problems.length > 0 ? (
            problems.map((problem, index) => {
              const video = videoMap?.[problem._id];

              return (
                <tr key={problem._id}>
                  <th>{index + 1 + (currentPage - 1) * 10}</th>
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
                    {problem.tags?.map((tag, i) => (
                      <span key={i} className="badge badge-outline mr-1">
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td>
                    {video ? (
                      <span className="badge badge-success">Uploaded</span>
                    ) : (
                      <span className="badge badge-ghost">No Video</span>
                    )}
                  </td>
                  <td>{formatDuration(video?.duration)}</td>
                  <td>
                    {video ? (
                      <span
                        className={`badge ${
                          video.status === "approved"
                            ? "badge-success"
                            : video.status === "pending"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {video.status}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {video?.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-20 h-12 rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <NavLink
                        to={`/admin/upload/${problem._id}`}
                        className="btn btn-sm btn-info"
                      >
                        {video ? "Update" : "Upload"}
                      </NavLink>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        disabled={!video}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No problems found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-sm"
        >
          Prev
        </button>
        <span className="btn btn-sm btn-disabled">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminVideo;
