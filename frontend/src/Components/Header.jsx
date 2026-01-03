import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // ModeToggle logic
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // Simple Button component
  const Button = ({ children, variant, className, ...props }) => {
    const base = "px-4 py-2 rounded-md font-medium transition-colors";
    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700",
      ghost: "bg-transparent text-indigo-600 hover:bg-indigo-100 dark:hover:bg-gray-800",
    };
    const styles = `${base} ${variants[variant] || variants.default} ${className || ""}`;
    return (
      <button className={styles} {...props}>
        {children}
      </button>
    );
  };

  // ModeToggle component
  const ModeToggle = () => (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{
        background:
          "conic-gradient(from 0deg, rgba(2, 22, 15, 0.705), rgba(0, 255, 255, 0.05), transparent, rgba(0, 255, 200, 0.1))",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Link to="/" className="text-shadow-indigo-100 dark:text-white">
            CodeClan
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link to="/problems" className="hover:text-gray-900 dark:hover:text-green-400">
            Problems
          </Link>
          <Link to="/contests" className="hover:text-gray-900 dark:hover:text-green-400">
            Contests
          </Link>
          <Link to="/discuss" className="hover:text-gray-900 dark:hover:text-green-400">
            Discuss
          </Link>
          <Link to="/leaderboard" className="hover:text-gray-900 dark:hover:text-green-400">
            Leaderboard
          </Link>
        </nav>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Menu
              size={22}
              className={`absolute top-0 left-0 transition-all duration-300 ${
                isOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"
              }`}
            />
            <X
              size={22}
              className={`absolute top-0 left-0 transition-all duration-300 ${
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white/80 dark:bg-gray-900/80">
          <nav className="flex flex-col space-y-2 p-4 text-gray-700 dark:text-gray-200">
            <Link
              to="/problems"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Problems
            </Link>
            <Link
              to="/contests"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Contests
            </Link>
            <Link
              to="/discuss"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Discuss
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>

            <div className="flex items-center gap-2 pt-2">
              <ModeToggle />
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button>Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
