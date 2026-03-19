import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, PlusCircle, LogOut, Layers, Moon, Sun, Sparkles, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    if (showMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  const isActive = (path) => location.pathname === path;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav-scrolled' : ''} glass-nav`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-emerald-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-500">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Idea<span className="text-gradient">Vault</span>
            </span>
          </Link>

          {/* Center Nav Links (hidden on auth pages) */}
          {!isAuthPage && (
            <div className="hidden sm:flex items-center space-x-1 bg-white/[0.03] rounded-xl px-1.5 py-1 border border-white/[0.04]">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-primary-500/15 text-primary-400 nav-link-active'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Explore</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/submit"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive('/submit')
                        ? 'bg-primary-500/15 text-primary-400 nav-link-active'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </Link>
                  <Link
                    to="/my-ideas"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive('/my-ideas')
                        ? 'bg-primary-500/15 text-primary-400 nav-link-active'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>My Ideas</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all duration-300 ${
                    showMenu ? 'bg-white/10' : 'hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-emerald-600 flex items-center justify-center text-[11px] font-bold text-black shadow-glow-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMenu && (
                  <div className="absolute top-full mt-2 right-0 w-52 glass-card rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60 animate-fade-in">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate mt-0.5">{user.username}</p>
                    </div>

                    {/* Mobile nav links */}
                    <div className="sm:hidden border-b border-white/[0.06]">
                      <Link to="/" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] transition-colors">
                        <Home className="w-3.5 h-3.5" /><span>Explore</span>
                      </Link>
                      <Link to="/submit" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] transition-colors">
                        <PlusCircle className="w-3.5 h-3.5" /><span>Submit Idea</span>
                      </Link>
                      <Link to="/my-ideas" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] transition-colors">
                        <Layers className="w-3.5 h-3.5" /><span>My Ideas</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              !isAuthPage && (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-white/40 hover:text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                  >
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-5">
                    Sign up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
