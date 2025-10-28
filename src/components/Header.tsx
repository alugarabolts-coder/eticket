import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Ship, Calendar, HelpCircle, UserCircle, LogOut, User, Database, ChevronDown, 
  Anchor, Users, Ticket, CalendarDays 
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const masterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]);

  const useClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: () => void) => {
    useEffect(() => {
      const listener = (event: MouseEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        handler();
      };
      document.addEventListener('mousedown', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
      };
    }, [ref, handler]);
  };

  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));
  useClickOutside(masterMenuRef, () => setIsMasterMenuOpen(false));

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

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

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/home') || isActive('/')
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

              {/* === MENU MASTER DATA BARU (DROPDOWN) === */}
              <div className="relative" ref={masterMenuRef}>
                <button
                  onClick={() => setIsMasterMenuOpen(!isMasterMenuOpen)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/master')
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Master Data</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMasterMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMasterMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <Link 
                      to="/master/ports" 
                      onClick={() => setIsMasterMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Anchor className="w-4 h-4 text-gray-500" />
                      <span>Pelabuhan</span>
                    </Link>
                    <Link 
                      to="/master/operators" 
                      onClick={() => setIsMasterMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Operator</span>
                    </Link>
                    <Link 
                      to="/master/bookings" 
                      onClick={() => setIsMasterMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Ticket className="w-4 h-4 text-gray-500" />
                      <span>Pemesanan</span>
                    </Link>
                    <Link 
                      to="/master/ships" 
                      onClick={() => setIsMasterMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Ship className="w-4 h-4 text-gray-500" />
                      <span>Kapal</span>
                    </Link>
                    <Link 
                      to="/master/schedules" 
                      onClick={() => setIsMasterMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span>Jadwal</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Bagian dinamis untuk Login/User Menu */}
            <div className="relative">
              {user ? (
                // Tampilan jika user sudah login
                <div ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="User Menu"
                  >
                    <UserCircle className="w-6 h-6 text-white" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-500">Masuk sebagai</p>
                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        <span>Profil Saya</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Tombol login jika user belum login
                <Link
                  to="/login"
                  className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}