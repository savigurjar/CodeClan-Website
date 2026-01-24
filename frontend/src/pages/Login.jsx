// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Shield, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import AnimatedBackground from "../animation";
import { loginUser, clearError } from "../features/authSlice";

/* ---------------- ZOD SCHEMA ---------------- */
const loginSchema = z.object({
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]),
});

/* ---------------- ANIMATION VARIANTS ---------------- */
const container = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, staggerChildren: 0.12 } },
};

const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const errorAnim = { hidden: { x: 0 }, visible: { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } } };

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "user" },
  });

  const role = watch("role");

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    dispatch(loginUser(data));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-md text-white"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Sign in to <span className="text-emerald-700">CodeClan</span></h1>
          <p className="text-gray-300">Enter your details to access your account</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
        >
          {/* Display errors */}
          {(errors.emailId || errors.password || error) && (
            <motion.div variants={errorAnim} initial="hidden" animate="visible" className="mb-4 text-red-400 flex flex-col gap-1">
              {errors.emailId && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.emailId.message}
                </div>
              )}
              {errors.password && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.password.message}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </motion.div>
          )}

          {/* Email */}
          <motion.div variants={item}>
            <input
              type="email"
              placeholder="Email"
              {...register("emailId")}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
          </motion.div>

          {/* Role selection */}
          <motion.div variants={item} className="mb-4">
            <label className="text-sm mb-2 block">Login as</label>
            <div className="flex gap-3">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setValue("role", r)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition ${role === r ? "bg-green-950 border-green-700" : "bg-black/30 border-white/20"
                    }`}
                >
                  {r === "user" ? <User size={16} /> : <Shield size={16} />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={item} className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          {/* Sign in button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-950 hover:bg-green-900 rounded-xl font-semibold transition flex justify-center items-center gap-2"
          >
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>

          {/* Signup link */}
          <motion.p variants={item} className="text-center text-sm mt-4 text-gray-300">
            New to CodeClan?{" "}
            <NavLink to="/signup" className="text-green-500">
              Create your account
            </NavLink>
          </motion.p>

          {/* Forgot password link */}
          <motion.div variants={item} className="text-right mb-4">
            <NavLink to="/forgot-password" className="text-sm text-green-500 hover:underline">
              Forgot Password?
            </NavLink>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;

// logo remain
