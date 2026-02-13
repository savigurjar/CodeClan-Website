import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, LogOut, User, Shield } from "lucide-react";
import { ModeToggle } from "./modeToggle";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fix for hydration and mount state
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    setIsOpen(false);
  };

  // Prevent rendering user-specific content until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-white dark:bg-[#020f0b]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-emerald-900 dark:text-white">
            CodeClan
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md
      bg-white dark:bg-[#020f0b] 
      dark:bg-[conic-gradient(from_0deg,rgba(2,22,15,0.7),rgba(0,255,255,0.05),transparent,rgba(0,255,200,0.1))] transition-colors">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-emerald-900 dark:text-white">
          CodeClan
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {["problems", "contests", "tutorials", "discuss", "ask"].map((p) => (
            <Link
              key={p}
              to={`/${p}`}
              className="text-gray-700 dark:text-gray-200 hover:bg-emerald-900 hover:text-white px-3 py-2 rounded-md transition-all duration-500 ease-in-out"
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}
        </nav>

        {/* Right Side - Controls */}
        <div className="flex items-center gap-4">
          {/* ModeToggle - Always visible */}
          <div className="flex items-center">
            <ModeToggle />
          </div>

          {/* Desktop Auth/User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium
                           text-emerald-900 hover:bg-emerald-50 dark:text-emerald-50 
                           dark:hover:bg-gray-800 transition-all duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium
                           bg-emerald-900 text-white hover:bg-emerald-800 
                           transition-all duration-300 ease-in-out"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className="group flex items-center gap-2 text-sm text-emerald-900 dark:text-gray-200 px-3 py-2 rounded-md hover:bg-emerald-900 hover:text-white dark:hover:bg-gray-800 transition-all duration-300 ease-in-out">
                  <User size={16} />
                  <span className="font-semibold">{user?.firstName || "User"}</span>
                  {user?.role === "admin" && (
                    <Shield size={14} className="text-emerald-900 group-hover:text-white dark:text-emerald-400 ml-1 transition-colors duration-300 ease-in-out" />
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-44 rounded-md border bg-white dark:bg-[#020f0b] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm dark:text-white text-emerald-900 hover:text-white hover:bg-emerald-900 dark:hover:bg-gray-800 rounded-t-md transition-colors duration-300 ease-in-out"
                  >
                    Dashboard
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm dark:text-white text-emerald-900 hover:text-white hover:bg-emerald-900 dark:hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                    >
                      <Shield size={14} />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-md transition-colors duration-300 ease-in-out"
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
            className="md:hidden p-2 rounded-md bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-all duration-300 ease-in-out"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-[#020f0b] p-4 space-y-3 transition-all duration-300 ease-in-out">
          {["problems", "contests", "tutorials", "discuss", "ask"].map((p) => (
            <Link
              key={p}
              to={`/${p}`}
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-200 hover:text-white hover:bg-emerald-900 px-3 py-2 rounded-md transition-all duration-500 ease-in-out"
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}

          <div className="pt-4 border-t dark:border-gray-800">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-emerald-900 hover:bg-emerald-50 dark:text-emerald-50 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-emerald-900 text-white hover:bg-emerald-800 transition-all duration-300 ease-in-out text-center"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 text-emerald-900 dark:text-gray-200">
                  <User size={16} />
                  <span className="font-semibold">{user?.firstName || "User"}</span>
                  {user?.role === "admin" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-emerald-50 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100 rounded-full ml-2">
                      <Shield size={10} />
                      Admin
                    </span>
                  )}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 dark:text-gray-200 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-300 ease-in-out"
                >
                  Dashboard
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-300 ease-in-out"
                  >
                    <Shield size={14} />
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-full transition-colors duration-300 ease-in-out"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;