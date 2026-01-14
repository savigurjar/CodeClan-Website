// src/pages/Tutorials/Tutorials.jsx
import { useRef, useState, useEffect } from "react";
import { FiPlay } from "react-icons/fi";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Animate from "../../animate";
import dsa from "/assets/dsa.jpg";
import javascript from "/assets/javascript.jpg";
import systemDesign from "/assets/systemdesign.jpg";
import fullstack from "/assets/fullstack.jpg";
import abdulbari from "/assets/abdulbari.jpg";
import operating from "/assets/operating.jpg";
import AppLayout from "../../Components/AppLayout";

const Tutorials = () => {
  const [loading, setLoading] = useState(true);

const tutorials = [
  {
    title: "Data Structures & Algorithms",
    image: dsa,
    desc: "Master DSA fundamentals with structured practice",
    meta: "Beginner → Advanced",
    link: "https://www.youtube.com/playlist?list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01",
  },
  {
    title: "System Design",
    image: systemDesign,
    desc: "Scalable systems & real-world architecture",
    meta: "Intermediate → Advanced",
    link: "https://www.youtube.com/playlist?list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT",
  },
  {
    title: "Full Stack Development",
    image: fullstack,
    desc: "Frontend to backend with modern stack",
    meta: "Project Based",
    link: "https://www.youtube.com/playlist?list=PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X",
  },
  {
    title: "JavaScript Mastery",
    image: javascript,
    desc: "Deep dive into JS internals & async patterns",
    meta: "Core Concepts",
    link: "https://www.youtube.com/playlist?list=PLQEaRBV9gAFuf-27K64l7-hV7o0fr9zx7",
  },
  {
    title: "Algorithm Mastery",
    image: abdulbari,
    desc: "Master algorithms and problem-solving",
    meta: "Advanced Concepts",
    link: "https://www.youtube.com/playlist?list=PLfqBHhcvlW7-SOGCl7TJxZ4426qBCmCpc",
  },
  {
    title: "Operating System",
    image: operating,
    desc: "Understand OS internals and processes",
    meta: "Core Concepts",
    link: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTr3nwuTegHLa2qlI81QweYG",
  },
];

  const stats = [
    { label: "Video Tutorials", value: "200+" },
    { label: "Playlists", value: "4" },
    { label: "Skill Level", value: "Beginner → Pro" },
  ];

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Simulate loading (remove or replace with API call)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center bg-green-50 dark:bg-emerald-900 border border-green-200 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-900 dark:border-emerald-400 mb-4"></div>
          <p className="text-green-900 dark:text-emerald-400 font-semibold text-lg">
            Loading tutorials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
        {/* Background Animation */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        <div className="relative z-10 px-6 sm:px-10 pt-20 pb-24">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-3">
            Elevate Your Skills and{" "}
            <span className="text-[#021510] dark:text-emerald-400">Grow Confident</span>
          </h1>
          <p className="text-center text-black/70 dark:text-white/70 mb-16 max-w-2xl mx-auto">
            Unlock your potential with expertly crafted learning paths and hands-on video tutorials.
          </p>

          {/* Horizontal Scrollable Tutorials */}
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-10 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-black rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FaChevronLeft className="text-2xl" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
            >
              {tutorials.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[300px] group relative rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur hover:scale-[1.04] transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BsFillPlayCircleFill className="text-white text-6xl opacity-90 hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-green-950 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">{item.desc}</p>
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border border-[#021510]/30 text-[#021510] dark:border-emerald-400/40 dark:text-emerald-300 bg-[#021510]/5 dark:bg-emerald-500/10">
                      {item.meta}
                    </span>
                    <div className="pt-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#021510] dark:text-emerald-400 group-hover:gap-3 transition-all">
                        <FiPlay className="text-lg" /> Start Learning
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-10 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-black rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FaChevronRight className="text-2xl" />
            </button>
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 text-center backdrop-blur"
              >
                <p className="text-2xl font-bold text-[#021510] dark:text-emerald-400">{stat.value}</p>
                <p className="text-sm text-black/60 dark:text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-28">
            <div className="relative overflow-hidden max-w-3xl mx-auto rounded-2xl p-10 text-center bg-[#021510] text-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950 shadow-xl">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
              <h2 className="text-3xl font-extrabold mb-4">Start Learning Today</h2>
              <p className="mb-6 text-white/90">Watch structured playlists and grow step by step.</p>
              <a
                href={tutorials[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-lg bg-white text-[#021510] font-semibold hover:bg-emerald-100 hover:scale-105 transition-all"
              >
                Start Watching
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Tutorials;
