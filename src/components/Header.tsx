{/* <<<<<<< HEAD */}
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ship, Calendar, HelpCircle, UserCircle, LogOut, User } from 'lucide-react';

// Tipe data untuk user, agar lebih aman
interface UserData {
  id: number;
  name: string;
  email: string;
}
{/* ======= */}
import { Link, useLocation } from 'react-router-dom';
import { Ship, Calendar, HelpCircle, Download } from 'lucide-react';
{/* >>>>>>> baaa1fc9ee959d9886f12b167e1657e08f03c57d */}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk menyimpan data user yang login
  const [user, setUser] = useState<UserData | null>(null);
  // State untuk mengontrol visibilitas dropdown menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cek status login saat komponen pertama kali dimuat
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]); // Dijalankan ulang jika path berubah (misal setelah login/logout)

  // Efek untuk menutup dropdown saat klik di luar area menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // Fungsi untuk handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsMenuOpen(false);
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

{/* <<<<<<< HEAD */}
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
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
                to="/my-bookings" // Pastikan path ini sesuai dengan router Anda
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/my-bookings')
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
            </nav>

            {/* Bagian dinamis untuk Login/User Menu */}
            <div className="relative">
              {user ? (
                // Tampilan jika user sudah login
                <div ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="User Menu"
                  >
                    <UserCircle className="w-6 h-6 text-white" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-500">Masuk sebagai</p>
                        <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
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
{/* ======= */}
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
{/* >>>>>>> baaa1fc9ee959d9886f12b167e1657e08f03c57d */}
        </div>
      </div>
    </header>
  );
}