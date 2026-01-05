import Animate from "../animate";

const HeroPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden top-0
      bg-white text-black 
      dark:bg-black dark:text-white">

      {/* 🌌 Background (only visible in dark mode) */}
      <div className="hidden dark:block">
        <Animate />
      </div>

      {/* HERO */}
      <div className="relative z-10 px-6 sm:px-12 pt-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Level Up Your <br />
            <span className="text-[#021510] dark:text-emerald-400">
              Coding Skills
            </span>
          </h1>

          <p className="text-black/70 dark:text-white/70 max-w-xl mb-8">
            Practice coding, compete globally, and improve your skills with
            real-world problems and live contests on our platform.
          </p>

          <div className="flex gap-4 mb-10">
            <button className="
              px-6 py-3 rounded-lg font-semibold transition
              bg-[#021510] text-white hover:opacity-90
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
          <div className="flex gap-8 text-sm text-black/70 dark:text-white/70">
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p>Active Coders</p>
            </div>
            <div>
              <p className="text-2xl font-bold">1M+</p>
              <p>Submissions</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p>Problems</p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="
          bg-black/5 dark:bg-white/5
          border border-black/10 dark:border-white/10
          rounded-2xl overflow-hidden backdrop-blur
        ">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="coding"
            className="w-full h-52 object-cover"
          />

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">
              Compete. Learn. Grow.
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">
              Join live contests and challenge developers across the globe.
            </p>

            <div className="flex flex-wrap gap-2">
              {["Live Battles", "Skill Ratings", "Instant Feedback"].map(
                (item) => (
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
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-6 sm:px-12 mt-24 mb-20">
        <div className="
          rounded-2xl p-10 text-center
          bg-[#021510] text-white
          dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-950
        ">
          <h2 className="text-3xl font-extrabold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-white/90">
            Improve daily, compete weekly, and track your progress.
          </p>
          <button className="
            px-8 py-3 rounded-lg font-semibold transition
            bg-white text-[#021510] hover:opacity-90
            dark:bg-black dark:text-white
          ">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
