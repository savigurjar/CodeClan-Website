import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, LogOut, User } from "lucide-react";
import { ModeToggle } from "./modeToggle";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md
      bg-white dark:bg-[#020f0b] 
      dark:bg-[conic-gradient(from_0deg,rgba(2,22,15,0.7),rgba(0,255,255,0.05),transparent,rgba(0,255,200,0.1))] transition-colors">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-950 dark:text-white">
          CodeClan
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {["problems", "contests", "discuss", "leaderboard","chat"].map((p) => (
            <Link
              key={p}
              to={`/${p}`}
              className="text-gray-700 dark:text-gray-200 hover:text-green-800 transition"
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}
        </nav>

        {/* Right Side - Auth & Mode */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium
                           text-green-950 hover:bg-green-100
                           dark:text-green-50 dark:hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-md text-sm font-medium
                           bg-green-950 text-white hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <User size={16} />
                {user?.firstName || "User"}
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-44 rounded-md border
                              bg-white dark:bg-[#020f0b] shadow-lg
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm dark:text-white text-green-950 hover:text-white hover:bg-green-950 dark:hover:bg-gray-800"
                >
                  Dashboard
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm dark:text-white text-green-950 hover:text-white hover:bg-green-950 dark:hover:bg-gray-800"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-[#020f0b] p-4 space-y-3 transition-all">
          {["problems", "contests", "discuss", "leaderboard"].map((p) => (
            <Link
              key={p}
              to={`/${p}`}
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-200 hover:text-green-800 transition"
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-200">
                Dashboard
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-200">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 pt-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
