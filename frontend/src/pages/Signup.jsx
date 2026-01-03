import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import AnimatedBackground from "../animation";

/* ---------------- BACKGROUND ---------------- */


/* ---------------- ZOD SCHEMA ---------------- */
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    alert("Account created successfully 🚀");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950 overflow-hidden">
      {/* 🌌 Background auto-start */}
      <AnimatedBackground />

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md text-white border border-white/10"
      >
        {/* Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 text-red-400 flex flex-col gap-1">
            {Object.values(errors).map((err, i) => (
              <div key={i} className="flex items-center gap-2">
                <AlertCircle size={16} /> {err.message}
              </div>
            ))}
          </div>
        )}

        {/* Username */}
        <motion.div variants={item}>
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none"
          />
        </motion.div>

        {/* Email */}
        <motion.div variants={item}>
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none"
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={item} className="relative mb-3">
          <input
            {...register("password")}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-gray-300"
          >
            {showPass ? <EyeOff /> : <Eye />}
          </button>
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={item} className="relative mb-4">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-300"
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </button>
        </motion.div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="w-full py-3 bg-green-900 hover:bg-green-700 rounded-xl font-semibold"
        >
          Create Account
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
