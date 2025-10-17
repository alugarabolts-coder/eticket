import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase, Port } from '../lib/supabase';
import { useBooking } from '../context/BookingContext';
import bgImage from '../assets/bg.jpg';

export function Home() {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [ports, setPorts] = useState<Port[]>([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [showPassengerOptions, setShowPassengerOptions] = useState(false);

  const [formData, setFormData] = useState({
    departurePort: '',
    arrivalPort: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
  });

  useEffect(() => {
    loadPorts();
  }, []);

  const loadPorts = async () => {
    const { data } = await supabase
      .from('ports')
      .select('*')
      .order('city');
    if (data) setPorts(data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departurePort || !formData.arrivalPort || !formData.departureDate) {
      alert('Mohon lengkapi data pencarian');
      return;
    }

    if (formData.departurePort === formData.arrivalPort) {
      alert('Pelabuhan keberangkatan dan tujuan tidak boleh sama');
      return;
    }

    setSearchParams({
      ...formData,
      isRoundTrip,
    });

    navigate('/search');
  };

  const swapPorts = () => {
    setFormData({
      ...formData,
      departurePort: formData.arrivalPort,
      arrivalPort: formData.departurePort,
    });
  };

  const totalPassengers = formData.adults + formData.children + formData.infants;

  return (
    <div className="min-h-screen">
      <div
        className="relative min-h-screen md:h-auto bg-cover bg-center md:bg-gradient-to-br md:from-teal-500 md:to-cyan-600"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-teal-600/60 to-cyan-700/80 md:from-transparent md:to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen md:h-full flex flex-col justify-center py-8 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl">
              <img
                src="https://assets.pikiran-rakyat.com/crop/0x0:0x0/720x0/webp/photo/2024/05/16/1385996479.jpg"
                alt="Ship"
                className="w-28 h-28 rounded-full object-cover"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Pesan Tiket Kapal Anda
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-md mx-auto">
              Temukan rute terbaik untuk perjalanan Anda
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden max-w-2xl mx-auto w-full">
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isRoundTrip}
                    onChange={() => setIsRoundTrip(false)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-gray-800 font-medium">Sekali Jalan</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isRoundTrip}
                    onChange={() => setIsRoundTrip(true)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-gray-800 font-medium">Pulang Pergi</span>
                </label>
              </div>

              <form onSubmit={handleSearch}>
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dari
                    </label>
                    <select
                      value={formData.departurePort}
                      onChange={(e) => setFormData({ ...formData, departurePort: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Pilih pelabuhan</option>
                      {ports.map((port) => (
                        <option key={port.id} value={port.id}>
                          {port.city} - {port.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ke
                    </label>
                    <div className="flex">
                      <select
                        value={formData.arrivalPort}
                        onChange={(e) => setFormData({ ...formData, arrivalPort: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      >
                        <option value="">Pilih pelabuhan</option>
                        {ports.map((port) => (
                          <option key={port.id} value={port.id}>
                            {port.city} - {port.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={swapPorts}
                        className="ml-2 bg-teal-600 p-3 rounded-full hover:bg-teal-700 transition-colors self-center"
                        aria-label="Reverse"
                      >
                        <ArrowRightLeft className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Berangkat
                    </label>
                    <input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {isRoundTrip && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Pulang
                      </label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        min={formData.departureDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required={isRoundTrip}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penumpang
                    </label>
                    <div
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between"
                      onClick={() => setShowPassengerOptions((prev) => !prev)}
                      tabIndex={0}
                      onBlur={() => setShowPassengerOptions(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span>{totalPassengers} Penumpang</span>
                      </div>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${showPassengerOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {showPassengerOptions && (
                      <div
                        // className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-50"
                        className="fixed left top-[220px] transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-[9999]"
                        style={{ minWidth: '300px' }}
                        tabIndex={-1}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Dewasa</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(f => ({ ...f, adults: Math.max(1, f.adults - 1) }));
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{formData.adults}</span>
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(f => ({ ...f, adults: f.adults + 1 }));
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Anak (2-11 th)</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(f => ({ ...f, children: Math.max(0, f.children - 1) }));
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{formData.children}</span>
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(f => ({ ...f, children: f.children + 1 }));
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Bayi (0-2 th)</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(f => ({ ...f, infants: Math.max(0, f.infants - 1) }));
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{formData.infants}</span>
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(f => ({ ...f, infants: f.infants + 1 }));
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Cari
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
