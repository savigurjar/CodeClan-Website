import Animate from "../animate";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#021510] text-white dark:bg-black/90 backdrop-blur-lg px-6 sm:px-12 pt-16 pb-8 overflow-hidden">

      {/* Animate background (dark only) */}
      <div className="hidden dark:block absolute inset-0 z-0">
        <Animate />
      </div>

      {/* subtle animated gradient blur background */}
      <div className="absolute inset-0 z-0 bg-[conic-gradient(from_0deg,rgba(2,22,15,0.7),rgba(0,255,255,0.05),transparent,rgba(0,255,200,0.05))] blur-3xl opacity-30 pointer-events-none" />

      {/* MAIN GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LEFT - ABOUT */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">CodeClan</h3>
          <p className="text-white/70 leading-relaxed max-w-sm">
            Level up your coding skills with curated problems, contests, and
            real-time challenges. Join a vibrant community of developers
            growing together every day.
          </p>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-6">
            <FaGithub className="text-xl text-white/70 hover:text-emerald-400 cursor-pointer transition" />
            <FaLinkedin className="text-xl text-white/70 hover:text-emerald-400 cursor-pointer transition" />
            <FaTwitter className="text-xl text-white/70 hover:text-emerald-400 cursor-pointer transition" />
          </div>
        </div>

        {/* CENTER - QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-white/70">
            {["Practice Problems", "Contests", "Game Mode", "Discussion Forums", "Interview Prep"].map((link) => (
              <li key={link} className="hover:text-emerald-400 transition cursor-pointer">
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT - CONTACT */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
          <ul className="space-y-2 text-white/70">
            <li>📧 savigurjar1201@gmail.com</li>
            <li>📞 +91 7697722419</li>
            <li>📍 Mumbai, India</li>
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="relative z-10 max-w-7xl mx-auto mt-12 border-t border-white/10" />

      {/* BOTTOM BAR */}
      <div className="relative z-10 max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between text-sm text-white/60 gap-4">
        <p>© 2025 CodeClan. Built with ❤️ by Savi Gurjar.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
            <span key={item} className="hover:text-emerald-400 cursor-pointer transition">
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
