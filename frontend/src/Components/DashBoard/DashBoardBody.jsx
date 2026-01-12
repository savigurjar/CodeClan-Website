import React, { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("socialProfiles.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialProfiles: { ...prev.socialProfiles, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update Profile Payload:", formData);
    // 👉 call updateProfile API here
  };

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
          <span className="text-[#021510] dark:text-emerald-400">
            Dashboard
          </span>
        </h1>
        <p className="text-center text-black/70 dark:text-white/70 mb-14">
          Manage your profile and track your coding journey
        </p>

        {/* UPDATE PROFILE CARD */}
        <div className="max-w-3xl mx-auto">
          <div
            className="
              bg-white/5 dark:bg-white/5
              border border-black/10 dark:border-white/10
              rounded-2xl p-8 backdrop-blur
              shadow-lg
            "
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="
                w-11 h-11 rounded-lg
                bg-[#021510]/10 dark:bg-emerald-500/20
                text-[#021510] dark:text-emerald-300
                flex items-center justify-center
              ">
                <FiUser className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold">Update Profile</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* BASIC INFO */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="input"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="input"
                />
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  onChange={handleChange}
                  className="input sm:col-span-2"
                />
              </div>

              {/* SOCIAL PROFILES */}
              <div className="space-y-4">
                <SocialInput
                  icon={<FiLinkedin />}
                  name="socialProfiles.linkedin"
                  placeholder="LinkedIn Profile"
                  onChange={handleChange}
                />
                <SocialInput
                  icon={<FiTwitter />}
                  name="socialProfiles.x"
                  placeholder="X (Twitter) Profile"
                  onChange={handleChange}
                />
                <SocialInput
                  icon={<SiLeetcode />}
                  name="socialProfiles.leetcode"
                  placeholder="LeetCode Profile"
                  onChange={handleChange}
                />
                <SocialInput
                  icon={<FiGithub />}
                  name="socialProfiles.github"
                  placeholder="GitHub Profile"
                  onChange={handleChange}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="
                  w-full mt-6
                  px-6 py-3 rounded-lg
                  bg-[#021510] text-white
                  dark:bg-emerald-500 dark:text-black
                  font-semibold
                  hover:scale-[1.03]
                  transition-all
                "
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

/* 🔹 Reusable Social Input */
const SocialInput = ({ icon, ...props }) => (
  <div className="relative">
    <span className="
      absolute left-3 top-1/2 -translate-y-1/2
      text-black/50 dark:text-white/50
    ">
      {icon}
    </span>
    <input
      {...props}
      className="
        w-full pl-10 pr-4 py-3 rounded-lg
        bg-black/5 dark:bg-white/5
        border border-black/10 dark:border-white/10
        focus:outline-none focus:ring-2
        focus:ring-emerald-400
      "
    />
  </div>
);

export default DashBoardBody;
