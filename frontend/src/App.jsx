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
import Admin from "./pages/admin";
import  CreateProblem from "./Components/Admin/CreateProblem"

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
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
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

      {/* ADMIN (PROTECTED) */}
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
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <CreateProblem /> : <Navigate to="/" />} />

      {/* OTHER ROUTES */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/contests" element={<ContestsPage />} />
    </Routes>
  );
}

export default App;
