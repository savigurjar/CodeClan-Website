import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient"; // use centralized axios client
import Animate from "../../animate";
import { FiUser, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";

const DashBoardBody = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    socialProfiles: {
      linkedin: "",
      x: "",
      leetcode: "",
      github: "",
    },
  });

  const [loading, setLoading] = useState(true);

  /* =========================
     GET PROFILE ON LOAD
     ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile...");
        const res = await axiosClient.get("/user/getProfile");
        console.log("Profile response:", res.data);

        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          age: res.data.age || "",
          socialProfiles: {
            linkedin: res.data.socialProfiles?.linkedin || "",
            x: res.data.socialProfiles?.x || "",
            leetcode: res.data.socialProfiles?.leetcode || "",
            github: res.data.socialProfiles?.github || "",
          },
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =========================
     HANDLE INPUT CHANGE
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialProfiles.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialProfiles: {
          ...prev.socialProfiles,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* =========================
     UPDATE PROFILE
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);

    try {
      const res = await axiosClient.put("/user/updateProfile", formData);
      console.log("Update response:", res.data);
      alert(res.data.message || "Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

 if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center bg-green-50 border border-green-200 rounded-2xl p-8 shadow-lg">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 mb-4"></div>
        {/* Message */}
        <p className="text-green-900 font-semibold text-lg">
          Loading your profile...
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      {/* 🌌 Background */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-6 sm:px-10 pt-20 pb-20">
        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-3">
          Your{" "}
          <span className="text-[#021510] dark:text-emerald-400">Dashboard</span>
        </h1>
        <p className="text-center text-black/70 dark:text-white/70 mb-14">
          Manage your profile and track your coding journey
        </p>

        {/* UPDATE PROFILE CARD */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 backdrop-blur shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 text-[#021510] dark:text-emerald-300 flex items-center justify-center">
                <FiUser className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold">Update Profile</h2>
            </div>

         <form onSubmit={handleSubmit} className="space-y-6">
  {/* BASIC INFO */}
  <div className="grid sm:grid-cols-2 gap-4">
    <input
      name="firstName"
      value={formData.firstName}
      placeholder="First Name"
      onChange={handleChange}
      className="w-full pl-5 pr-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    />
    <input
      name="lastName"
      value={formData.lastName}
      placeholder="Last Name"
      onChange={handleChange}
      className="w-full pl-5 pr-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    />
    <input
      name="age"
      type="number"
      value={formData.age}
      placeholder="Age"
      onChange={handleChange}
      className="w-full pl-5 pr-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:col-span-2"
    />
  </div>

  {/* SOCIAL PROFILES */}
  <div className="space-y-4">
    <SocialInput
      icon={<FiLinkedin />}
      name="socialProfiles.linkedin"
      value={formData.socialProfiles.linkedin}
      placeholder="LinkedIn Profile"
      onChange={handleChange}
     
    />
    <SocialInput
      icon={<FiTwitter />}
      name="socialProfiles.x"
      value={formData.socialProfiles.x}
      placeholder="X (Twitter) Profile"
      onChange={handleChange}
     
    />
    <SocialInput
      icon={<SiLeetcode />}
      name="socialProfiles.leetcode"
      value={formData.socialProfiles.leetcode}
      placeholder="LeetCode Profile"
      onChange={handleChange}
     
    />
    <SocialInput
      icon={<FiGithub />}
      name="socialProfiles.github"
      value={formData.socialProfiles.github}
      placeholder="GitHub Profile"
      onChange={handleChange}
     
    />
  </div>

  {/* SUBMIT */}
  <button
    type="submit"
    className="w-full mt-6 px-6 py-3 rounded-lg bg-green-900 text-white font-semibold hover:bg-green-950 hover:scale-[1.03] transition-all"
  >
    Save Changes
  </button>
</form>


          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   REUSABLE SOCIAL INPUT
   ========================= */
const SocialInput = ({ icon, value, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
      {icon}
    </span>
    <input
      {...props}
      value={value}
      className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    />
  </div>
);

export default DashBoardBody;
