// src/pages/MyBooking.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Ship } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
// import { supabase, Booking } from '../lib/supabase'; // Kita nonaktifkan sementara untuk demo

// Definisikan tipe Booking secara manual jika tidak mengimpor dari supabase
// Ini harus cocok dengan struktur data yang Anda harapkan
type Booking = any; 

// Data dummy pesanan untuk menggantikan panggilan ke Supabase
const dummyBookings: Booking[] = [
  {
    id: '0d01bbbb-cc07-4a49-9a30-0bcdfb6ac198',
    booking_code: 'SHIP-ABC123',
    contact_name: 'Budi Santoso',
    contact_email: 'budi.santoso@email.com',
    status: 'confirmed',
    created_at: '2025-10-13T05:46:42.528347+00:00',
    selected_class: 'Economy',
    total_passengers: 2,
    payment_amount: 750000,
    schedule: {
      ship: { name: 'KM Cepat Express', operator: { name: 'Pelayaran Nasional' } },
      departure_port: { city: 'Surabaya' },
      arrival_port: { city: 'Makassar' },
      departure_time: '2025-10-15T13:46:31.763209+00:00',
      arrival_time: '2025-10-16T07:46:31.763209+00:00',
    }
  },
  {
    id: '846c74a4-8294-4aa5-a9eb-7b15f458e3a4',
    booking_code: 'SHIP-DEF456',
    contact_name: 'Siti Nurhaliza',
    contact_email: 'siti.nur@email.com',
    status: 'pending_payment',
    created_at: '2025-10-13T05:46:42.528347+00:00',
    selected_class: 'Business',
    total_passengers: 1,
    payment_amount: 630000,
    schedule: {
      ship: { name: 'KM Bahari Indah', operator: { name: 'Jalur Laut Sejahtera' } },
      departure_port: { city: 'Jakarta' },
      arrival_port: { city: 'Batam' },
      departure_time: '2025-10-14T15:46:31.763209+00:00',
      arrival_time: '2025-10-15T11:46:31.763209+00:00',
    }
  },
  {
    id: '018ea019-4d14-41a0-af77-4f6e625744ad',
    booking_code: 'SHIP-GHI789',
    contact_name: 'Ahmad Hidayat',
    contact_email: 'ahmad.hidayat@email.com',
    status: 'confirmed',
    created_at: '2025-10-13T05:46:42.528347+00:00',
    selected_class: 'Economy',
    total_passengers: 4,
    payment_amount: 330000,
    schedule: {
      ship: { name: 'KM Nusantara Satu', operator: { name: 'Pelayaran Nasional' } },
      departure_port: { city: 'Semarang' },
      arrival_port: { city: 'Pontianak' },
      departure_time: '2025-10-13T11:46:31.763209+00:00',
      arrival_time: '2025-10-13T13:46:31.763209+00:00',
    }
  }
];


export function MyBookings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Efek ini berjalan saat komponen pertama kali dimuat
  useEffect(() => {
    // Cek data user dari session atau local storage
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser(userData);
      setEmail(userData.email); // Langsung isi field email
      
      // Lakukan pencarian otomatis
      fetchBookings(userData.email, ''); 
    }
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  const fetchBookings = (userEmail: string, query: string) => {
    setLoading(true);
    setSearched(true);
    
    // Simulasi pemanggilan API
    setTimeout(() => {
      try {
        const results = dummyBookings.filter(booking => {
          const emailMatch = booking.contact_email.toLowerCase() === userEmail.toLowerCase();
          const queryMatch = query === '' || 
                             booking.booking_code.toLowerCase().includes(query.toLowerCase()) || 
                             booking.contact_name.toLowerCase().includes(query.toLowerCase());
          return emailMatch && queryMatch;
        });

        setBookings(results);
      } catch (error) {
        console.error('Error searching bookings:', error);
        alert('Terjadi kesalahan saat mencari pesanan');
      } finally {
        setLoading(false);
      }
    }, 1000); // delay 1 detik untuk simulasi loading
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Email wajib diisi.');
      return;
    }
    fetchBookings(email, searchQuery);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: 'success' | 'warning' | 'error' | 'info'; label: string } } = {
      pending_payment: { variant: 'warning', label: 'Menunggu Pembayaran' },
      paid: { variant: 'success', label: 'Lunas' },
      confirmed: { variant: 'success', label: 'Terkonfirmasi' },
      boarding: { variant: 'info', label: 'Boarding' },
      completed: { variant: 'success', label: 'Selesai' },
      cancelled: { variant: 'error', label: 'Dibatalkan' },
    };

    const statusInfo = statusMap[status] || { variant: 'default' as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentUser ? `Pesanan ${currentUser.name}` : 'Pesanan Saya'}
          </h1>
          <p className="text-gray-600">
            {currentUser 
              ? 'Berikut adalah daftar semua pesanan Anda.' 
              : 'Cari pesanan Anda dengan kode booking dan email'}
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kode Booking atau Nama Pemesan"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SHIP-XXXXXX atau Nama Pemesan"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                disabled={!!currentUser} // Nonaktifkan jika sudah login
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Mencari...' : 'Cari Pesanan'}
            </Button>
          </form>
        </Card>
        
        {/* Sisanya sama persis */}

        {searched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Mencari pesanan...</p>
              </div>
            ) : bookings.length === 0 ? (
              <Card className="p-12 text-center">
                <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Pesanan
                </h3>
                <p className="text-gray-600 mb-4">
                  Tidak ada pesanan ditemukan.
                </p>
                <Button onClick={() => navigate('/home')}>Pesan Tiket Baru</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Ditemukan {bookings.length} pesanan
                </h2>

                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-6" hover>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-bold text-lg text-gray-900">
                              {booking.booking_code}
                            </div>
                            <div className="text-sm text-gray-600">
                              Dibuat: {formatDate(booking.created_at)}
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="mb-4">
                          <div className="font-semibold text-gray-900 mb-1">
                            {booking.schedule?.ship?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.schedule?.ship?.operator?.name}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Keberangkatan</div>
                            <div className="font-medium text-gray-900">
                              {booking.schedule?.departure_port?.city}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.schedule?.departure_time || '')} •{' '}
                              {formatTime(booking.schedule?.departure_time || '')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Tujuan</div>
                            <div className="font-medium text-gray-900">
                              {booking.schedule?.arrival_port?.city}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(booking.schedule?.arrival_time || '')} •{' '}
                              {formatTime(booking.schedule?.arrival_time || '')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Kelas: {booking.selected_class}</span>
                          <span>•</span>
                          <span>{booking.total_passengers} Penumpang</span>
                        </div>
                      </div>

                      <div className="md:w-48 flex flex-col justify-between items-end">
                        <div className="text-right mb-4">
                          <div className="text-sm text-gray-600 mb-1">Total</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(booking.payment_amount)}
                          </div>
                        </div>

                        <div className="space-y-2 w-full">
                          <Button
                            onClick={() => navigate(`/ticket/${booking.booking_code}`)}
                            className="w-full"
                          >
                            Lihat Detail
                          </Button>

                          {booking.status === 'pending_payment' && (
                            <Button variant="secondary" className="w-full">
                              Bayar Sekarang
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {!searched && !loading && (
          <Card className="p-12 text-center">
            <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cari Pesanan Anda
            </h3>
            <p className="text-gray-600">
              Masukkan kode booking dan email untuk melihat detail pesanan
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}