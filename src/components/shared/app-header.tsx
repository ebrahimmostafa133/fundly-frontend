import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Rocket, 
  User, 
  LogOut, 
  LogIn, 
  Sparkles 
} from 'lucide-react';
import { cn } from '../../api/utils';

export default function AppHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Sparkles },
    { to: '/projects', label: 'Explore', icon: Rocket },
  ];

  if (isLoggedIn) {
    navLinks.push({ to: '/profile', label: 'Profile', icon: User });
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-xl shadow-primary-500/5 border-b border-primary-200/50' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-500 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-xl shadow-primary-500/30">
              <Rocket size={24} />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Fundly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "relative flex items-center gap-1.5 text-sm font-medium transition-colors py-2",
                  isActive 
                    ? "text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:rounded-full" 
                    : "text-gray-600 hover:text-primary-500"
                )}
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm hover:bg-primary-100 transition-all border border-primary-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all active:scale-95"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-primary-100 shadow-xl">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                  isActive 
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-500"
                )}
              >
                <link.icon size={20} />
                {link.label}
              </NavLink>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 mt-4 rounded-xl bg-primary-600 text-white text-base font-medium shadow-lg shadow-primary-600/20"
              >
                <LogIn size={20} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

