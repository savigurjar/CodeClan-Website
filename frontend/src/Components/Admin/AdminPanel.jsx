import React from "react";
import { Plus, Edit, Trash2, Video,ArrowLeft,Trophy } from "lucide-react";
import { NavLink,useNavigate } from "react-router";
import Animate from "../../animate";

const adminOptions = [
  {
    id: "create",
    title: "Create Problem",
    description: "Add new coding problems to the platform",
    icon: Plus,
    route: "/admin/create",
  },
  {
    id: "update",
    title: "Update Problem",
    description: "Edit existing problems and metadata",
    icon: Edit,
    route: "/admin/update",
  },
  {
    id: "delete",
    title: "Delete Problem",
    description: "Remove problems permanently",
    icon: Trash2,
    route: "/admin/delete",
  },
  {
    id: "video",
    title: "Video Manager",
    description: "Upload or delete problem videos",
    icon: Video,
    route: "/admin/video",
  },
  {
   id: "contests",
  title: "Contest Manager",
  description: "Create and manage coding contests",
  icon: Trophy,
  route: "/admin/create-contest",
  },
];

const AdminPanel = () => {
    const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Animated Background (dark only) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

   
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2
        px-4 py-2 rounded-lg border border-black/10 dark:border-white/10
        bg-black/5 dark:bg-white/5 backdrop-blur
        hover:scale-105 transition"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium cursor-pointer">Back to Home</span>
      </button>

      {/* CONTENT */}
      <div className="relative z-10 px-6 sm:px-10 pt-20 pb-24">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold text-center mb-3">
          Admin <span className="text-[#021510] dark:text-emerald-400">Dashboard</span>
        </h1>

        <p className="text-center text-black/70 dark:text-white/70 mb-14 max-w-2xl mx-auto">
          Manage problems, videos, and platform content efficiently.
        </p>

        {/* ADMIN CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const Icon = option.icon;

            return (
              <NavLink
                key={option.id}
                to={option.route}
                className="group bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10
                rounded-xl p-6 backdrop-blur transition-all hover:scale-[1.03]
                hover:border-[#021510]/50 dark:hover:border-emerald-400"
              >
                {/* ICON */}
                <div className="w-12 h-12 rounded-lg bg-[#021510]/10 dark:bg-emerald-500/20 
                  flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Icon className="text-[#021510] dark:text-emerald-400" size={22} />
                </div>

                {/* TEXT */}
                <h3 className="font-semibold text-lg mb-1">
                  {option.title}
                </h3>

                <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                  {option.description}
                </p>

                {/* CTA */}
                <span className="inline-block text-xs px-3 py-1 rounded-full
                  bg-[#021510]/10 border border-[#021510]/40
                  dark:bg-emerald-500/20 dark:border-emerald-500">
                  Open Module →
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* FOOTER CTA */}
        <div className="mt-24">
          <div className="max-w-3xl mx-auto rounded-2xl p-10 text-center 
            bg-[#021510] text-white
            dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950">
            <h2 className="text-3xl font-extrabold mb-4">
              Maintain Platform Quality
            </h2>
            <p className="mb-6 text-white/90">
              Keep problems organized, updated, and beginner-friendly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
