import { useState } from 'react';
import { Ticket, Plus, Edit, Trash2 } from 'lucide-react';

interface Booking {
  id: number;
  booking_code: string;
  customer_name: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const handleOpenModal = (booking: Booking | null) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentBooking(null);
    setIsModalOpen(false);
  };

  const handleSave = (bookingData: Omit<Booking, 'id' | 'booking_code'>) => {
    if (currentBooking) {
      // Update
      setBookings(bookings.map(b => b.id === currentBooking.id ? { ...b, ...bookingData } : b));
    } else {
      // Create
      const newBooking = { 
        id: Date.now(), 
        booking_code: `SHPTX-${String(Date.now()).slice(-4)}`,
        ...bookingData 
      };
      setBookings([...bookings, newBooking]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Ticket className="w-6 h-6 text-teal-500" />
          Data Pemesanan
        </h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pemesanan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Kode Booking</th>
              <th className="py-2 px-4 border-b text-left">Nama Pelanggan</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{booking.booking_code}</td>
                <td className="py-2 px-4 border-b">{booking.customer_name}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button onClick={() => handleOpenModal(booking)} className="text-blue-500 hover:text-blue-700 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(booking.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BookingForm
          booking={currentBooking}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function BookingForm({ booking, onSave, onClose }: { booking: Booking | null; onSave: (data: Omit<Booking, 'id' | 'booking_code'>) => void; onClose: () => void; }) {
  const [customerName, setCustomerName] = useState(booking?.customer_name || '');
  const [status, setStatus] = useState<Booking['status']>(booking?.status || 'Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
        alert("Nama pelanggan wajib diisi!");
        return;
    }
    onSave({ customer_name: customerName, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{booking ? 'Edit Pemesanan' : 'Tambah Pemesanan'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Pelanggan</label>
            <input
              type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Booking['status'])}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">Batal</button>
            <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}