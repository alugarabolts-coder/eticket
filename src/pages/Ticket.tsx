import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Download, Share2, Ship, MapPin, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { supabase, Booking } from '../lib/supabase';

import '../print-ticket.css';

export function Ticket() {
  const { bookingCode } = useParams<{ bookingCode: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingCode) {
      loadBooking();
    }
  }, [bookingCode]);

  const loadBooking = async () => {
    if (!bookingCode) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          schedule:schedules(
            *,
            ship:ships(*, operator:operators(*)),
            departure_port:ports!schedules_departure_port_id_fkey(*),
            arrival_port:ports!schedules_arrival_port_id_fkey(*)
          ),
          passengers(*)
        `)
        .eq('booking_code', bookingCode)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBooking(data as any);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (datetime?: string) => {
    if (!datetime) return 'N/A';
    return new Date(datetime).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (datetime?: string) => {
    if (!datetime) return 'N/A';
    return new Date(datetime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `E-Ticket ${booking?.booking_code}`,
          text: `Tiket kapal ${booking?.schedule?.ship?.name}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link disalin ke clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tiket Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">
            Kode booking yang Anda masukkan tidak ditemukan atau tidak valid.
          </p>
          <Link to="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-Ticket</h1>
          <p className="text-gray-600">Kode Booking: {booking.booking_code}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>

      <div id="printable-ticket" className="bg-white p-6 md:p-8 max-w-4xl mx-auto shadow-lg rounded-lg">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-3 md:col-span-2 space-y-6">
            <header className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">ShipTix</h2>
                <p className="text-lg font-semibold">{booking.schedule?.ship?.name}</p>
              </div>
              {getStatusBadge(booking.status)}
            </header>

            <div className="grid grid-cols-2 gap-6 border-y py-4">
              <div>
                <p className="text-sm text-gray-500">Keberangkatan</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(booking.schedule?.departure_time)}</p>
                <p className="font-semibold">{booking.schedule?.departure_port?.name}</p>
                <p className="text-sm text-gray-600">{booking.schedule?.departure_port?.city}</p>
                <p className="text-sm text-gray-600 mt-1">{formatDate(booking.schedule?.departure_time)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tiba</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(booking.schedule?.arrival_time)}</p>
                <p className="font-semibold">{booking.schedule?.arrival_port?.name}</p>
                <p className="text-sm text-gray-600">{booking.schedule?.arrival_port?.city}</p>
                <p className="text-sm text-gray-600 mt-1">{formatDate(booking.schedule?.arrival_time)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Detail Penumpang</h3>
              <div className="space-y-2">
                {booking.passengers?.map((p) => (
                  <div key={p.id} className="grid grid-cols-4 gap-2 text-sm border-b pb-2 last:border-b-0">
                    <div className="col-span-2"><span className="font-semibold">Nama:</span> {p.full_name} ({p.category})</div>
                    <div><span className="font-semibold">Kursi:</span> {p.seat_number}</div>
                    <div><span className="font-semibold">Kelas:</span> {booking.selected_class}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
                <h3 className="font-bold text-lg mb-2">Kontak Pemesan</h3>
                <p className="text-sm">Nama: <span className="font-medium">{booking.contact_name}</span></p>
                <p className="text-sm">Email: <span className="font-medium">{booking.contact_email}</span></p>
                <p className="text-sm">Telepon: <span className="font-medium">{booking.contact_phone}</span></p>
            </div>
          </div>
          
          <div className="col-span-3 md:col-span-1 flex flex-col justify-between space-y-6 pt-6 md:pt-0 md:border-l md:pl-8">
            <div className="text-center">
              <div className="bg-white p-2 rounded-lg inline-block border mb-2">
                <QRCode value={booking.booking_code} size={180} />
              </div>
              <p className="text-sm text-gray-600">Tunjukkan QR Code ini saat check-in</p>
              <p className="text-xl font-bold tracking-wider text-gray-800 mt-1">{booking.booking_code}</p>
            </div>
            
            <div>
                <h3 className="font-bold text-lg mb-2">Rincian Pembayaran</h3>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Tiket</span> <span>{formatPrice(booking.payment_breakdown.ticket_price)}</span></div>
                    <div className="flex justify-between"><span>Biaya Admin</span> <span>{formatPrice(booking.payment_breakdown.admin_fee)}</span></div>
                    <div className="flex justify-between"><span>Biaya Layanan</span> <span>{formatPrice(booking.payment_breakdown.service_fee)}</span></div>
                    <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span> <span>{formatPrice(booking.payment_amount)}</span></div>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Informasi Penting</h3>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                <li>Check-in dibuka 2 jam sebelum keberangkatan</li>
                <li>Harap tiba di pelabuhan minimal 1 jam sebelum keberangkatan</li>
                <li>Bawa identitas asli sesuai yang terdaftar saat pemesanan</li>
                <li>Bagasi maksimal 20kg per penumpang</li>
                <li>Tunjukkan e-ticket atau QR code saat check-in</li>
            </ul>
        </div>
        <footer className="text-center text-xs text-gray-400 mt-6 print:hidden">
            ©{new Date().getFullYear()} ShipTix. All rights reserved.
        </footer>
        <footer className="hidden print:block text-center text-xs text-gray-400 mt-6">
            ©{new Date().getFullYear()} ShipTix. All rights reserved.
        </footer>
      </div>
    </div>
  );
}