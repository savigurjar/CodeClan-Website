// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import AnimatedBackground from "../animation";
import { registerUser, resetRegisterSuccess } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

/* ---------------- ZOD SCHEMA ---------------- */
const signupSchema = z
  .object({
    firstName: z.string().min(3, "Username must be at least 3 characters"),
    emailId: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Password must include uppercase, lowercase, number & symbol"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- ANIMATION ---------------- */
const container = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (registerSuccess) {
      setShowSuccess(true); // Show success message
      reset(); // Clear form
      dispatch(resetRegisterSuccess()); // reset Redux flag
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate("/login"); // Redirect to login
      }, 1500); // 1.5 seconds display
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, dispatch, navigate, reset]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950 overflow-hidden">
      <AnimatedBackground />
      
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md text-white border border-white/10"
      >
        <h1 className="text-2xl font-bold mb-1">Become a Part of <span className="text-emerald-700">CodeClan</span></h1>
        <p className="mb-6 text-gray-300">
          Sign up today and begin your coding journey!
        </p>

        {/* Success */}
        {showSuccess && (
          <div className="mb-4 text-green-400 flex items-center gap-2">
            <AlertCircle size={16} /> Account created successfully 🚀
          </div>
        )}

        {/* API Errors */}
        {error && (
          <div className="mb-4 text-red-400 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Username */}
        <motion.div variants={item}>
          <input
            {...register("firstName")}
            placeholder="Username"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div variants={item}>
          <input
            type="email"
            {...register("emailId")}
            placeholder="Email"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
          />
          {errors.emailId && (
            <p className="text-sm text-red-500">{errors.emailId.message}</p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div variants={item} className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-gray-300"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff /> : <Eye />}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={item} className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-300"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-950 hover:bg-green-900 transition-colors rounded-xl font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading && <span className="loading loading-spinner loading-sm"></span>}
          {loading ? "Creating Account..." : "Create Account"}
        </motion.button>

        <p className="text-center text-sm mt-4 text-gray-300">
          Already have an account?{" "}
          <NavLink to="/login" className="text-green-500">
            Login
          </NavLink>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
