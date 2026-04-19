import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Mail, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { FaTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Browse Projects', to: '/projects' },
      { label: 'How it Works', to: '#' },
      { label: 'Categories', to: '#' },
      { label: 'Success Stories', to: '#' },
    ],
    support: [
      { label: 'Help Center', to: '#' },
      { label: 'Safety & Trust', to: '#' },
      { label: 'Guidelines', to: '#' },
      { label: 'Contact Us', to: '#' },
    ],
    company: [
      { label: 'About Us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
      { label: 'Privacy Policy', to: '#' },
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, href: '#' },
    { icon: FaGithub, href: '#' },
    { icon: FaLinkedinIn, href: '#' },
  ];

  return (
    <footer className="mt-20 border-t border-gray-100 bg-white shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.03)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-500 p-2 rounded-xl text-white shadow-xl shadow-primary-500/30">
                <Rocket size={20} />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Fundly
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering innovators and creators to bring their dreams to life through community-driven crowdfunding.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Platform</h3>
              <ul className="space-y-4">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 group transition-colors">
                      <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Support</h3>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 group transition-colors">
                      <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Newsletter</h3>
              <p className="text-sm text-gray-500 mb-4">Stay updated with the latest projects.</p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="min-w-0 flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40">
                  <Mail size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Fundly. Built with <Heart size={14} className="inline text-red-500 fill-red-500" /> for creators.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</Link>
            <Link to="#" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</Link>
            <Link to="#" className="text-xs text-gray-400 hover:text-gray-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

