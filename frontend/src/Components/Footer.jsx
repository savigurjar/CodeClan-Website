import Animate from "../animate";
import { FaGithub, FaLinkedin, FaTwitter, FaFax } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="relative w-full border-t bg-[#021510] text-white dark:bg-black/90 backdrop-blur-lg px-6 sm:px-12 pt-8 pb-4 overflow-hidden">

      {/* Animate background (dark only) */}
      <div className="hidden dark:block absolute inset-0 z-0">
        <Animate />
      </div>

      {/* Subtle animated gradient blur background */}
      <div className="absolute inset-0 z-0 bg-[conic-gradient(from_0deg,rgba(2,22,15,0.7),rgba(0,255,255,0.05),transparent,rgba(0,255,200,0.05))] blur-3xl opacity-30 pointer-events-none" />

      {/* MAIN GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LEFT - ABOUT + SOCIALS */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">CodeClan</h3>
          <p className="text-white/70 leading-relaxed max-w-sm">
           Learn faster with handpicked coding problems, contests, and real-time challenges. Grow your skills alongside developers from around the world.
          </p>

          {/* SOCIALS */}
         <div className="flex gap-4 mt-6 items-center">
  {/* GitHub */}
  <a href="https://github.com/savigurjar" target="_blank" rel="noopener noreferrer">
    <FaGithub className="text-2xl text-white/70 hover:text-emerald-700 cursor-pointer transition" />
  </a>

  {/* LinkedIn */}
  <a href="https://www.linkedin.com/in/savi-g-2b669721a/" target="_blank" rel="noopener noreferrer">
    <FaLinkedin className="text-2xl text-white/70 hover:text-emerald-700 cursor-pointer transition" />
  </a>

  {/* X (Twitter rebranded) */}
  <a href="https://x.com/savita_gurjar30" target="_blank" rel="noopener noreferrer">
    <span className="text-2xl font-bold text-white/70 hover:text-emerald-700 cursor-pointer transition">
      X
    </span>
  </a>
</div>

        </div>

        {/* CENTER - QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-white/70">
            {["problems", "contests", "discuss", "tutorials", "ask"].map((link) => (
              <li
                key={link}
                className="hover:text-emerald-700 transition cursor-pointer"
              >
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT - CONTACT */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-center gap-2">
              <MdEmail className="text-white w-5 h-5" />
              <a href="mailto:savigurjar1201@gmail.com" className="hover:text-emerald-700 transition">
                savigurjar1201@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-white w-5 h-5" />
              <a href="tel:+917697722419" className="hover:text-emerald-700 transition">
                +91 7697722419
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MdLocationOn className="text-white w-5 h-5" />
              <a
                  href="https://www.google.com/maps/place/MadhyaPradesh,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 transition"
              >
                MP, India
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="relative z-10 max-w-7xl mx-auto mt-12 border-t border-white/10" />

      {/* BOTTOM BAR */}
      <div className="relative z-10 max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between text-sm text-white/60 gap-4">
        <p>© 2025 CodeClan. Built with 💙</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
            <span
              key={item}
              className="hover:text-emerald-400 cursor-pointer transition"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
