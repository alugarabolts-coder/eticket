import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, Clock, Filter, ArrowRight, Calendar, Armchair } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBooking } from '../context/BookingContext';
import { Badge } from '../components/Badge';

// --- KUNCI & INTERFACES (Sama seperti sebelumnya) ---
const SCHEDULES_KEY = 'masterSchedulesData';
const SHIPS_KEY = 'masterShipsData';
const PORTS_KEY = 'masterPortsData';

interface ClassInfo { id: string; name: string; price: number; available_seats: number; }
interface Schedule {
  id: string; ship_id: string; departure_port_id: string; arrival_port_id: string;
  departure_time: string; arrival_time: string; duration_minutes: number;
  classes: ClassInfo[]; status: 'scheduled' | 'on_time' | 'delayed' | 'cancelled';
}
interface Ship { id: string; name: string; }
interface Port { id: string; name: string; city: string; }
interface EnrichedSchedule extends Schedule { ship?: Ship; departure_port?: Port; arrival_port?: Port; }

export function SearchResults() {
  const navigate = useNavigate();
  const { searchParams, setSelectedSchedule } = useBooking();
  const [schedules, setSchedules] = useState<EnrichedSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'duration'>('price');
  const [filterClass, setFilterClass] = useState<string>('');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  useEffect(() => {
    if (!searchParams) { navigate('/'); return; }
    loadSchedulesFromLocalStorage();
  }, [searchParams]);

  const loadSchedulesFromLocalStorage = () => {
    if (!searchParams) return; setLoading(true);
    const allSchedules: Schedule[] = JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '[]');
    const allShips: Ship[] = JSON.parse(localStorage.getItem(SHIPS_KEY) || '[]');
    const allPorts: Port[] = JSON.parse(localStorage.getItem(PORTS_KEY) || '[]');

    const filtered = allSchedules.filter(s =>
      s.departure_port_id === searchParams.departurePort &&
      s.arrival_port_id === searchParams.arrivalPort &&
      s.departure_time.split('T')[0] === searchParams.departureDate &&
      s.status === 'scheduled'
    );

    const enriched: EnrichedSchedule[] = filtered.map(s => ({
      ...s,
      ship: allShips.find(ship => ship.id === s.ship_id),
      departure_port: allPorts.find(p => p.id === s.departure_port_id),
      arrival_port: allPorts.find(p => p.id === s.arrival_port_id),
    }));
    
    const uniqueClasses = new Set(enriched.flatMap(s => s.classes.map(c => c.name)));
    setAvailableClasses(Array.from(uniqueClasses));

    setSchedules(enriched); setLoading(false);
  };

  const formatTime = (d: string) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const formatDuration = (m: number) => `${Math.floor(m / 60)}j ${m % 60}m`;
  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  const getSortedSchedules = () => {
    let sorted = [...schedules];
    if (sortBy === 'price') sorted.sort((a, b) => Math.min(...a.classes.map(c => c.price)) - Math.min(...b.classes.map(c => c.price)));
    else if (sortBy === 'time') sorted.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
    else if (sortBy === 'duration') sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
    if (filterClass) sorted = sorted.filter((s) => s.classes.some((c) => c.name === filterClass));
    return sorted;
  };

  const handleSelectSchedule = (schedule: EnrichedSchedule) => {
    setSelectedSchedule(schedule); navigate('/ship-detail');
  };

  if (!searchParams) return null;
  const sortedSchedules = getSortedSchedules();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pilih Jadwal Keberangkatan</h1>
          <p className="text-gray-600">
            {schedules[0]?.departure_port?.city} → {schedules[0]?.arrival_port?.city} • {formatDate(searchParams.departureDate)} • {searchParams.adults + searchParams.children + searchParams.infants} Penumpang
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <div className="lg:w-72">
            <Card className="p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center"><Filter className="w-4 h-4 mr-2" />Filter & Urutkan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan Berdasarkan</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="price">Harga Termurah</option><option value="time">Waktu Keberangkatan</option><option value="duration">Durasi Tercepat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter Kelas</label>
                  <div className="space-y-2">
                    <label className="flex items-center"><input type="radio" name="class" value="" checked={filterClass === ''} onChange={e => setFilterClass(e.target.value)} className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500" /><span className="ml-2 text-sm">Semua Kelas</span></label>
                    {availableClasses.map(className => (
                      <label key={className} className="flex items-center"><input type="radio" name="class" value={className} checked={filterClass === className} onChange={e => setFilterClass(e.target.value)} className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500" /><span className="ml-2 text-sm">{className}</span></label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          {/* Results Section */}
          <div className="flex-1">
            {loading ? ( <p>Memuat...</p> ) : sortedSchedules.length === 0 ? (
              <Card className="p-12 text-center">
                <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Jadwal Tersedia</h3>
                <p className="text-gray-600 mb-4">Maaf, tidak ada jadwal untuk rute dan tanggal yang Anda pilih.</p>
                <Button onClick={() => navigate('/home')}>Cari Rute Lain</Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* --- KARTU TIKET BARU --- */}
                {sortedSchedules.map((schedule) => (
                  <Card key={schedule.id} className="p-0 overflow-hidden flex shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {/* Bagian Informasi Utama (Kiri) */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Kapal</p>
                          <h3 className="font-bold text-xl text-gray-800">{schedule.ship?.name}</h3>
                        </div>
                        <Badge variant="info">Tersedia</Badge>
                      </div>
                      
                      <div className="flex items-center text-center mb-6">
                        <div className="w-2/5">
                          <p className="text-sm text-gray-500">Dari</p>
                          <p className="font-bold text-2xl text-teal-700">{schedule.departure_port?.city}</p>
                          <p className="text-xs text-gray-500 truncate">{schedule.departure_port?.name}</p>
                        </div>
                        <div className="w-1/5 flex justify-center">
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="w-2/5">
                          <p className="text-sm text-gray-500">Ke</p>
                          <p className="font-bold text-2xl text-teal-700">{schedule.arrival_port?.city}</p>
                          <p className="text-xs text-gray-500 truncate">{schedule.arrival_port?.name}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 flex justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4"/><span>{formatDate(schedule.departure_time)}</span></div>
                        <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4"/><span>Berangkat {formatTime(schedule.departure_time)}</span></div>
                        <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4"/><span>Durasi {formatDuration(schedule.duration_minutes)}</span></div>
                      </div>
                    </div>

                    {/* Garis Pemisah dengan Efek Lubang */}
                    <div className="relative flex items-center">
                      <div className="h-full border-l-2 border-dashed border-gray-300"></div>
                      <div className="absolute bg-gray-50 w-8 h-8 rounded-full -left-4 top-[-1rem]"></div>
                      <div className="absolute bg-gray-50 w-8 h-8 rounded-full -left-4 bottom-[-1rem]"></div>
                    </div>

                    {/* Bagian Stub / Aksi (Kanan) */}
                    <div className="w-full md:w-72 bg-gray-50/50 p-6 flex flex-col">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Harga Mulai Dari</p>
                        <p className="font-extrabold text-3xl text-teal-600 mb-4">
                          {formatPrice(Math.min(...schedule.classes.map((c) => c.price)))}
                        </p>
                        <div className="space-y-2">
                          {schedule.classes
                            .slice(0, 3) // Tampilkan maks 3 kelas, bisa disesuaikan
                            .map(classInfo => (
                              <div key={classInfo.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <Armchair className="w-4 h-4 text-gray-500"/>
                                  <span className="text-gray-700">{classInfo.name}</span>
                                </div>
                                <span className="font-semibold text-gray-800">{formatPrice(classInfo.price)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <Button onClick={() => handleSelectSchedule(schedule)} className="w-full mt-4">
                        Lihat Detail & Pilih
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}