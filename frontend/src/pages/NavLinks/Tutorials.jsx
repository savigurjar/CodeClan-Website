import Animate from "../../animate";
import { FiPlayCircle } from "react-icons/fi";
import { BsFillPlayCircleFill } from "react-icons/bs";
import dsa from "/assets/dsa.jpg";
import javascript from "/assets/javascript.jpg";
import systemDesign from "/assets/systemdesign.jpg";
import fullstack from "/assets/fullstack.jpg";
import AppLayout from "../../Components/AppLayout";
import { FiPlay } from "react-icons/fi";

const Tutorials = () => {
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
  ];


  const stats = [
    { label: "Video Tutorials", value: "200+" },
    { label: "Playlists", value: "4" },
    { label: "Skill Level", value: "Beginner → Pro" },
  ];

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">

        {/* 🌌 Background Animation */}
        <div className="hidden dark:block">
          <Animate />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 px-6 sm:px-10 pt-20 pb-24">

          {/* TITLE */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-3">
            Elevate Your Skills and <span className="text-[#021510] dark:text-emerald-400">Grow Confident</span>
          </h1>
          <p className="text-center text-black/70 dark:text-white/70 mb-16 max-w-2xl mx-auto">
            Unlock your potential with expertly crafted learning paths and hands-on video tutorials.
          </p>


          {/* IMAGE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tutorials.map((item) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                group relative rounded-2xl overflow-hidden
                bg-black/5 dark:bg-white/5
                border border-black/10 dark:border-white/10
                backdrop-blur
                hover:scale-[1.04] transition-all duration-300
                shadow-lg hover:shadow-emerald-500/20
              "
              >
                {/* IMAGE */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                    w-full h-full object-cover
                    group-hover:scale-110 transition-transform duration-500
                  "
                  />
                  <div className="absolute inset-0 bg-black/40" />



                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BsFillPlayCircleFill className="text-white text-6xl opacity-90 hover:scale-110 transition-transform duration-300" />
                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-green-950 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-black/60 dark:text-white/60">
                    {item.desc}
                  </p>

                  <span
                    className="
                    inline-block text-xs font-semibold
                    px-3 py-1 rounded-full
                    border border-[#021510]/30 text-[#021510]
                    dark:border-emerald-400/40 dark:text-emerald-300
                    bg-[#021510]/5 dark:bg-emerald-500/10
                  "
                  >
                    {item.meta}
                  </span>

                  {/* CTA */}


                  <div className="pt-4">
                    <span
                      className="
      inline-flex items-center gap-2
      text-sm font-semibold
      text-[#021510] dark:text-emerald-400
      group-hover:gap-3 transition-all
    "
                    >
                      <FiPlay className="text-lg" /> Start Learning
                    </span>
                  </div>

                </div>
              </a>
            ))}
          </div>

          {/* STATS */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                bg-black/5 dark:bg-white/5
                border border-black/10 dark:border-white/10
                rounded-xl p-6 text-center backdrop-blur
              "
              >
                <p className="text-2xl font-bold text-[#021510] dark:text-emerald-400">
                  {stat.value}
                </p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA SECTION */}
          <div className="mt-28">
            <div
              className="
              relative overflow-hidden
              max-w-3xl mx-auto rounded-2xl
              p-10 text-center
              bg-[#021510] text-white
              dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950
              shadow-xl
            "
            >
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none" />
              <h2 className="text-3xl font-extrabold mb-4">
                Start Learning Today
              </h2>
              <p className="mb-6 text-white/90">
                Watch structured playlists and grow step by step.
              </p>
              <a
                href={tutorials[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                inline-block px-8 py-3 rounded-lg
                bg-white text-[#021510]
                font-semibold
                hover:bg-emerald-100 hover:scale-105
                transition-all
              "
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
