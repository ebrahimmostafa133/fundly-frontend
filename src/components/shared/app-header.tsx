import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function AppHeader() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="border-b border-primary-200 bg-primary-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-extrabold text-primary-500">
          Fundly
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary-600 font-semibold' : 'text-primary-700 hover:text-primary-500'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? 'text-primary-600 font-semibold' : 'text-primary-700 hover:text-primary-500'
            }
          >
            Projects
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary-600 font-semibold'
                    : 'text-primary-700 hover:text-primary-500'
                }
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-primary-500 px-3 py-1.5 font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary-600 font-semibold'
                  : 'text-primary-700 hover:text-primary-500'
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
