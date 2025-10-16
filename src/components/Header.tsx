import { Link, useLocation } from 'react-router-dom';
import { Ship, Calendar, HelpCircle, Download } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg">
              <Ship className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-xl font-bold text-white">ShipTix</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'text-white bg-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Ship className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <Link
              to="/bookings"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/bookings')
                  ? 'text-white bg-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Pesanan Saya</span>
            </Link>
            <Link
              to="/help"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/help')
                  ? 'text-white bg-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan</span>
            </Link>
            <Link
              to="/export"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/export')
                  ? 'text-white bg-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
