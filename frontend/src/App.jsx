import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { checkAuth } from "./features/authSlice";
import ProblemsPage from "./pages/NavLinks/Problem";
import Dashboard from "./Components/DashBoard/DashBoard";
import ContestsPage from "./pages/NavLinks/Contests";
import Admin from "./pages/Admin";
import CreateProblem from "./Components/Admin/CreateProblem";
import UpdateProblem from "./Components/Admin/UpdateProblem";
import ChatAi from "./pages/NavLinks/ChatAi";
import Ask from "./pages/NavLinks/Ask";
import ProblemPage from "./Components/ProblemIdPage/ProblemPage";
import AdminDelete from "./Components/Admin/AdminDelete";
import AdminVideo from "./Components/Admin/AdminVideo";
import AdminUpload from "./Components/Admin/AdminUpload";
import AdminUpdate from "./Components/Admin/AdminUpdate";
import Tutorials from "./pages/NavLinks/Tutorials";
import AdminCreateContest from "./Components/Admin/CreateContest";

// // 🔥 DISCUSS IMPORTS
import DiscussList from "./pages/DiscussionList";
import DiscussDetails from "./pages/DiscussionPage";
import DiscussCreate from "./pages/DiscussionCreate";

function App() {
  const dispatch = useDispatch();

  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            Loading ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <Admin />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/create/:id"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <CreateProblem />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/update"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminUpdate />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/update/:id"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <UpdateProblem />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/delete"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminDelete />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/video"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminVideo />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/create-contest"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminCreateContest />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/upload/:problemId"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminUpload />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* DISCUSS (BLOGS) */}
      <Route path="/discuss" element={<DiscussList />} />
      <Route path="/discuss/:id" element={<DiscussDetails />} />
      <Route
        path="/admin/discuss/create"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <DiscussCreate />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* OTHER ROUTES */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/contests" element={<ContestsPage />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/chat" element={<ChatAi />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/problem/:problemId" element={<ProblemPage />} />
    </Routes>
  );
}

export default App;
