import { Link } from 'react-router-dom';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-primary-200 bg-primary-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-primary-700">
          © {currentYear} Fundly. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-primary-700 hover:text-primary-500 transition-colors">
            Home
          </Link>
          <Link to="/projects" className="text-primary-700 hover:text-primary-500 transition-colors">
            Projects
          </Link>
          <Link to="/profile" className="text-primary-700 hover:text-primary-500 transition-colors">
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}
