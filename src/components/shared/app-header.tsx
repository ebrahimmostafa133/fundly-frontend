import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Rocket, 
  User, 
  LogOut, 
  LogIn, 
  Sparkles,
  HeartHandshake
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
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Sparkles },
    { to: '/projects', label: 'Explore', icon: Rocket },
  ];

  if (isLoggedIn) {
    navLinks.push({ to: '/profile', label: 'My Profile', icon: User });
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary-500 p-2 rounded-xl text-white group-hover:-translate-y-1 transition-transform shadow-md shadow-primary-500/20">
              <HeartHandshake size={24} />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Fund<span className="text-primary-500">ly</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 mr-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => cn(
                    "relative flex items-center gap-2 text-[15px] font-semibold transition-colors py-2",
                    isActive 
                      ? "text-primary-600" 
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-[22px] left-0 right-0 h-[3px] bg-primary-600 rounded-t-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <Link
                to={isLoggedIn ? "/projects/create" : "/login"}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-50 text-primary-700 font-bold text-[14px] hover:bg-primary-100 transition-all border border-primary-100"
              >
                Start a Fundraiser
              </Link>
              
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-700 font-semibold text-[14px] hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 shadow-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-600 text-white font-semibold text-[14px] hover:bg-primary-700 shadow-md shadow-primary-600/20 hover:shadow-primary-600/30 transition-all active:scale-95"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to={isLoggedIn ? "/projects/create" : "/login"}
              className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full"
            >
              Start
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {({ isActive }) => (
                  <>
                    <link.icon size={20} className={cn(isActive ? "text-primary-600" : "text-gray-400")} />
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}
            
            <div className="h-px bg-gray-100 my-4" />
            
            <Link
              to={isLoggedIn ? "/projects/create" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-bold mb-3"
            >
              Start a Fundraiser
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 bg-gray-50 border border-gray-200"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 text-white text-base font-semibold shadow-md shadow-primary-600/20"
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

