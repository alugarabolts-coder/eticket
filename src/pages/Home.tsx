import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft, Users, Ship, CalendarDays, Car } from 'lucide-react';
import { Button } from '../components/Button';
import { useBooking } from '../context/BookingContext';
import { supabase } from '../lib/supabase';
import bgImage from '../assets/bg.jpg';

interface Port {
  id: string;
  name: string;
  city: string;
  code?: string;
}

type PassengerCounterProps = { value: number; onIncrement: () => void; onDecrement: () => void; onChange: (newValue: number) => void; };
function PassengerCounter({ value, onIncrement, onDecrement, onChange }: PassengerCounterProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const numValue = parseInt(e.target.value, 10); onChange(isNaN(numValue) ? 0 : numValue); };
  return (
    <div className="flex items-center border border-gray-300 rounded-md">
      <button type="button" onClick={onDecrement} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md" aria-label="Kurangi penumpang">-</button>
      <input type="number" value={value} onChange={handleInputChange} min="0" className="w-10 text-center font-medium bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
      <button type="button" onClick={onIncrement} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md" aria-label="Tambah penumpang">+</button>
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [ports, setPorts] = useState<Port[]>([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [showPassengerOptions, setShowPassengerOptions] = useState(false);
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);

  const departureDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    departurePort: '', arrivalPort: '', departureDate: '', returnDate: '',
    adults: 1, lansia: 0, children: 0, infants: 0, vehicleType: '',
  });

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const { data, error } = await supabase
          .from('ports')
          .select('id, name, city, code')
          .order('city');

        if (error) {
          console.error('Error fetching ports:', error);
        } else if (data) {
          setPorts(data);
        }
      } catch (err) {
        console.error('Error loading ports:', err);
      }
    };

    fetchPorts();

    const today = new Date().toISOString().split('T')[0];
    setFormData(f => ({ ...f, departureDate: today }));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departurePort || !formData.arrivalPort || !formData.departureDate) {
      alert('Mohon lengkapi data pencarian'); return;
    }
    if (isRoundTrip && !formData.returnDate) {
      alert('Mohon lengkapi tanggal pulang untuk perjalanan pulang-pergi'); return;
    }
    if (formData.departurePort === formData.arrivalPort) {
      alert('Pelabuhan keberangkatan dan tujuan tidak boleh sama'); return;
    }
    if (formData.adults + formData.lansia < 1) {
      alert('Perjalanan harus menyertakan setidaknya 1 penumpang Dewasa atau Lansia.'); return;
    }
    setSearchParams({ ...formData, isRoundTrip });
    navigate('/search');
  };

  const swapPorts = () => {
    setFormData({ ...formData, departurePort: formData.arrivalPort, arrivalPort: formData.departurePort });
  };

  const totalPassengers = formData.adults + formData.lansia + formData.children + formData.infants;
  const formatDate = (dateString: string) => {
    if (!dateString) return "Pilih tanggal";
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return adjustedDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };
  const passengerTypes = [
    { id: 'adults', label: 'Dewasa', age: 'Usia 5 th keatas', min: 0 },
    { id: 'lansia', label: 'Lansia', age: 'Usia 60 th keatas', min: 0 },
    { id: 'children', label: 'Anak', age: 'Usia 2-5 th', min: 0 },
    { id: 'infants', label: 'Bayi', age: 'Dibawah 2 th', min: 0 },
  ];
  const vehicleTypes = [
    { id: '', label: 'Tidak Bawa Kendaraan', description: '' }, { id: 'GOLI', label: 'Golongan I', description: 'Sepeda kayuh' }, { id: 'GOLII', label: 'Golongan II', description: 'Sepeda motor (<500 cc) & gerobak dorong' },
    { id: 'GOLIII', label: 'Golongan III', description: 'Sepeda motor (>=500 cc) & roda 3' }, { id: 'GOLIVA', label: 'Golongan IVA', description: 'Kendaraan penumpang (<5 meter)' }, { id: 'GOLIVB', label: 'Golongan IVB', description: 'Kendaraan barang/pick up (<5 meter)' },
    { id: 'GOLVB', label: 'Golongan VB', description: 'Kendaraan barang(mobil/truk barang/tangki) <7 meter' }, { id: 'GOLVIA', label: 'Golongan VIA', description: 'Kendaraan penumpang (mobil, bus besar) <10 meter' }, { id: 'GOLVIB', label: 'Golongan VIB', description: 'Kendaraan barang (mobil/truk barang/tangki, kereta penarik tanpa gandengan) <10 meter' },
    { id: 'GOLVII', label: 'Golongan VII', description: 'Kendaraan (mobil barang, truk, tronton, tangki, kereta penarik dengan gandengan, kendaraan alat berat) <12 meter' }, { id: 'GOLVIII', label: 'Golongan VIII', description: 'Kendaraan (mobil barang, truk, tronton, tangki, kereta penarik dengan gandengan, kendaraan alat berat) <16 meter' }, { id: 'GOLIX', label: 'Golongan IX', description: 'Kendaraan (mobil barang, truk, tronton, tangki, kereta penarik dengan gandengan, kendaraan alat berat) >16 meter' },
  ];
  const selectedVehicle = vehicleTypes.find(v => v.id === formData.vehicleType) || vehicleTypes[0];

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-teal-600/60 to-cyan-700/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen md:h-full flex flex-col justify-center py-8 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl">
              <img src="https://assets.pikiran-rakyat.com/crop/0x0:0x0/720x0/webp/photo/2024/05/16/1385996479.jpg" alt="Ship" className="w-28 h-28 rounded-full object-cover" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Cari Tiket Kapal Anda</h1>
            <p className="text-base md:text-lg text-white/90 max-w-md mx-auto">Temukan rute terbaik untuk perjalanan Anda</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 relative max-w-2xl mx-auto w-full">
            <div className="relative z-10">
              <form onSubmit={handleSearch}>
                <div className="space-y-4 mb-6">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 relative">
                    <div className="flex items-center gap-4 p-4">
                      <Ship className="w-6 h-6 text-gray-400" />
                      <div className="w-full">
                        <label htmlFor="departure-port" className="text-xs text-gray-500">Pelabuhan Asal</label>
                        <select id="departure-port" value={formData.departurePort} onChange={(e) => setFormData({ ...formData, departurePort: e.target.value })} className="w-full bg-transparent text-base font-semibold text-gray-800 focus:outline-none appearance-none" required>
                          <option value="" disabled>Pilih Asal</option>
                          {ports.map((port) => (<option key={port.id} value={port.id}>{port.city} - {port.name}</option>))}
                        </select>
                      </div>
                    </div>
                    <hr className="border-gray-200 mx-4" />
                    <div className="flex items-center gap-4 p-4">
                      <Ship className="w-6 h-6 text-gray-400" />
                      <div className="w-full">
                        <label htmlFor="arrival-port" className="text-xs text-gray-500">Pelabuhan Tujuan</label>
                        <select id="arrival-port" value={formData.arrivalPort} onChange={(e) => setFormData({ ...formData, arrivalPort: e.target.value })} className="w-full bg-transparent text-base font-semibold text-gray-800 focus:outline-none appearance-none" required>
                          <option value="" disabled>Pilih Tujuan</option>
                          {ports.map((port) => (<option key={port.id} value={port.id}>{port.city} - {port.name}</option>))}
                        </select>
                      </div>
                    </div>
                    <button type="button" onClick={swapPorts} className="absolute top-1/2 -translate-y-1/2 right-4 bg-white border border-gray-300 text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors transform rotate-90" aria-label="Tukar Tujuan"><ArrowRightLeft className="w-5 h-5" /></button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Berangkat
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <CalendarIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {isRoundTrip && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Pulang
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.returnDate}
                          onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                          min={formData.departureDate || new Date().toISOString().split('T')[0]}
                          className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={isRoundTrip}
                        />
                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-xl p-4 shadow-md">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Penumpang</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between" onClick={() => setShowPassengerOptions((prev) => !prev)}>
                        <div className="flex items-center space-x-2"><Users className="w-5 h-5 text-gray-400" /><span>{totalPassengers} Penumpang</span></div>
                        <svg className={`w-4 h-4 ml-2 transition-transform ${showPassengerOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      {showPassengerOptions && (<div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-50"><div className="space-y-4">{passengerTypes.map((type) => (<div key={type.id} className="flex items-center justify-between"><div><p className="font-semibold text-gray-800">{type.label}</p><p className="text-xs text-gray-500">{type.age}</p></div><PassengerCounter value={formData[type.id as keyof typeof formData] as number} onIncrement={() => setFormData(f => ({ ...f, [type.id]: (f[type.id as keyof typeof f] as number) + 1 }))} onDecrement={() => setFormData(f => ({ ...f, [type.id]: Math.max(type.min, (f[type.id as keyof typeof f] as number) - 1) }))} onChange={(newValue) => { const updatedValue = Math.max(type.min, newValue); setFormData(f => ({ ...f, [type.id]: updatedValue })); }} /></div>))}</div><button type="button" onClick={() => setShowPassengerOptions(false)} className="w-full mt-4 bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">Selesai</button></div>)}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 shadow-md">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kendaraan</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between" onClick={() => setShowVehicleOptions((prev) => !prev)}>
                        <div className="flex items-center space-x-2"><Car className="w-5 h-5 text-gray-400" /><div><p className="text-sm font-semibold text-gray-800">{selectedVehicle.label}</p><p className="text-xs text-gray-500">{selectedVehicle.description}</p></div></div>
                        <svg className={`w-4 h-4 ml-2 transition-transform ${showVehicleOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      {showVehicleOptions && (<div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-50"><div className="max-h-56 overflow-y-auto pr-2"><div className="space-y-3">{vehicleTypes.map((vehicle) => { const isSelected = formData.vehicleType === vehicle.id; return (<div key={vehicle.id} onClick={() => { setFormData({ ...formData, vehicleType: vehicle.id }); setShowVehicleOptions(false); }} className={`p-3 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${isSelected ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}><div><p className={`font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-800'}`}>{vehicle.label}</p><p className="text-xs text-gray-500">{vehicle.description}</p></div><div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-teal-600 bg-teal-600' : 'border-gray-400 bg-white'}`}>{isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}</div></div>); })}</div></div></div>)}
                    </div>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Cari Tiket
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}