// src/pages/HeroPage.jsx
import { useState, useEffect } from "react";
import Animate from "../animate";

const HeroPage = () => {
  const features = ["Live Battles", "Skill Ratings", "Instant Feedback"];
  const stats = [
    { label: "Active Coders", value: "10K+" },
    { label: "Submissions", value: "1M+" },
    { label: "Problems", value: "500+" },
  ];

  // Images for the right card slideshow
  const images = [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29kaW5nfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29kaW5nfGVufDB8fDB8fHww",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

      {/* 🌌 Background (dark mode only) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* HERO */}
      <div className="relative z-10 px-6 sm:px-12 pt-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Level Up Your <br />
            <span className="text-[#021510] dark:text-emerald-400">
              Coding Skills
            </span>
          </h1>

          <p className="text-black/70 dark:text-white/70 max-w-xl mb-8">
            Practice coding, compete globally, and improve your skills with
            real-world problems and live contests on our platform.
          </p>

          <div className="flex gap-4 mb-10 flex-wrap">
            <button className="
              px-6 py-3 rounded-lg font-semibold transition
              bg-[#021510] text-white hover:bg-[#03261d]
              dark:bg-emerald-900 dark:hover:bg-emerald-950
            ">
              Get Started Free 🚀
            </button>

            <button className="
              px-6 py-3 rounded-lg transition
              border border-black/20 hover:bg-black/5
              dark:border-white/30 dark:hover:bg-white/10
            ">
              View Challenges
            </button>
          </div>

          {/* STATS */}
          <div className="flex gap-8 flex-wrap text-sm text-black/70 dark:text-white/70">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-start sm:items-center">
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="
          bg-white/5 dark:bg-white/5
          border border-black/10 dark:border-white/10
          rounded-2xl overflow-hidden backdrop-blur
          hover:scale-[1.02] transition-shadow hover:shadow-lg
        ">
          <img
            src={images[currentImage]}
            alt="coding"
            className="w-full h-52 sm:h-64 object-cover transition-all duration-1000 ease-in-out"
          />

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-green-950 dark:text-white">
              Compete. Learn. Grow.
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">
              Join live contests and challenge developers across the globe.
            </p>

            <div className="flex flex-wrap gap-2">
              {features.map((item) => (
                <span
                  key={item}
                  className="
                    px-3 py-1 text-xs rounded-full
                    bg-black/5 border border-black/10
                    dark:bg-white/10 dark:border-white/20
                  "
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-6 sm:px-12 mt-24 mb-20">
        <div className="
          rounded-2xl p-10 text-center
          bg-[#021510] text-white
          dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950 relative overflow-hidden shadow-xl
        ">
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-white/90">
            Improve daily, compete weekly, and track your progress.
          </p>
           <button className="
              px-8 py-3 rounded-lg
              bg-white text-[#021510]
              font-semibold
              hover:bg-emerald-100 hover:scale-105
              transition-all
            ">
            Join Now 🚀
          </button>
        </div>
      </div>

    </div>
  );
};

export default HeroPage;
