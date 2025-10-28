import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit, Trash2, X } from 'lucide-react';

const generateId = () => crypto.randomUUID();

const SHIPS_KEY = 'masterShipsData';
const PORTS_KEY = 'masterPortsData';
const SCHEDULES_KEY = 'masterSchedulesData';

interface ClassInfo { id: string; name: string; price: number; available_seats: number; }
interface Schedule {
  id: string; ship_id: string; departure_port_id: string; arrival_port_id: string;
  departure_time: string; arrival_time: string; duration_minutes: number;
  classes: ClassInfo[]; status: 'scheduled' | 'on_time' | 'delayed' | 'cancelled';
}
interface Ship { id: string; name: string; }
interface Port { id: string; name: string; city: string; }

export default function MasterSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    try { const saved = localStorage.getItem(SCHEDULES_KEY); return saved ? JSON.parse(saved) : []; }
    catch { return []; }
  });
  const [ships, setShips] = useState<Ship[]>(() => {
    try { const saved = localStorage.getItem(SHIPS_KEY); return saved ? JSON.parse(saved) : []; }
    catch { return []; }
  });
  const [ports, setPorts] = useState<Port[]>(() => {
    try { const saved = localStorage.getItem(PORTS_KEY); return saved ? JSON.parse(saved) : []; }
    catch { return []; }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

  useEffect(() => { localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules)); }, [schedules]);

  const handleOpenModal = (schedule: Schedule | null) => { setCurrentSchedule(schedule); setIsModalOpen(true); };
  const handleCloseModal = () => { setCurrentSchedule(null); setIsModalOpen(false); };

  const handleSave = (scheduleData: Omit<Schedule, 'id'>) => {
    if (currentSchedule) {
      setSchedules(schedules.map(s => s.id === currentSchedule.id ? { id: s.id, ...scheduleData } : s));
      alert('Jadwal berhasil diperbarui!');
    } else {
      setSchedules([...schedules, { id: generateId(), ...scheduleData }]);
      alert('Jadwal baru berhasil ditambahkan!');
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setSchedules(schedules.filter(s => s.id !== id));
      alert('Jadwal berhasil dihapus!');
    }
  };

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getShipNameById = (id: string, allShips: Ship[]): string => {
    const item = allShips.find(s => s.id === id);
    return item ? item.name : 'Data tidak ditemukan';
  };

  const getPortInfoById = (id: string, allPorts: Port[]): string => {
    const item = allPorts.find(p => p.id === id);
    return item ? `${item.city} - ${item.name}` : 'Data tidak ditemukan';
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-teal-500" /> Data Jadwal
        </h1>
        <button onClick={() => handleOpenModal(null)} className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Jadwal
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-center w-16">No</th>
              <th className="py-2 px-4 border-b text-left">Nama Kapal</th>
              <th className="py-2 px-4 border-b text-left">Rute</th>
              <th className="py-2 px-4 border-b text-left">Keberangkatan</th>
              <th className="py-2 px-4 border-b text-left">Kelas & Harga</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Belum ada data jadwal.</td></tr>
            ) : (
              schedules.map((schedule, index) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{getShipNameById(schedule.ship_id, ships)}</td>
                  <td className="py-2 px-4 border-b">{getPortInfoById(schedule.departure_port_id, ports)} → {getPortInfoById(schedule.arrival_port_id, ports)}</td>
                  <td className="py-2 px-4 border-b">{formatDateTime(schedule.departure_time)}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <ul className="list-disc list-inside">
                      {schedule.classes.map(c => (
                        <li key={c.id}>{c.name}: <strong>Rp {c.price.toLocaleString('id-ID')}</strong> ({c.available_seats} kursi)</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b capitalize">{schedule.status}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleOpenModal(schedule)} className="text-blue-500 hover:text-blue-700 mr-4"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(schedule.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (<ScheduleForm schedule={currentSchedule} onSave={handleSave} onClose={handleCloseModal} ships={ships} ports={ports} />)}
    </div>
  );
}

interface ScheduleFormProps { schedule: Schedule | null; onSave: (data: Omit<Schedule, 'id'>) => void; onClose: () => void; ships: Ship[]; ports: Port[]; }
function ScheduleForm({ schedule, onSave, onClose, ships, ports }: ScheduleFormProps) {
  const toInputDateTime = (isoString?: string) => isoString ? new Date(new Date(isoString).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
  const [shipId, setShipId] = useState(schedule?.ship_id || '');
  const [departurePortId, setDeparturePortId] = useState(schedule?.departure_port_id || '');
  const [arrivalPortId, setArrivalPortId] = useState(schedule?.arrival_port_id || '');
  const [departureTime, setDepartureTime] = useState(toInputDateTime(schedule?.departure_time));
  const [arrivalTime, setArrivalTime] = useState(toInputDateTime(schedule?.arrival_time));
  const [durationMinutes, setDurationMinutes] = useState(schedule?.duration_minutes || '');
  const [status, setStatus] = useState<Schedule['status']>(schedule?.status || 'scheduled');
  const [classes, setClasses] = useState<ClassInfo[]>(schedule?.classes || [{ id: generateId(), name: 'Ekonomi', price: 0, available_seats: 0 }]);
  const handleClassChange = (id: string, field: keyof Omit<ClassInfo, 'id'>, value: string | number) => { setClasses(classes.map(c => c.id === id ? { ...c, [field]: value } : c)); };
  const addClass = () => { setClasses([...classes, { id: generateId(), name: '', price: 0, available_seats: 0 }]); };
  const removeClass = (id: string) => { if (classes.length > 1) { setClasses(classes.filter(c => c.id !== id)); } else { alert("Minimal harus ada satu kelas."); } };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classes.some(c => !c.name || c.price <= 0 || c.available_seats <= 0)) { alert("Harap isi semua detail kelas dengan benar (nama tidak boleh kosong, harga dan kursi harus lebih dari 0)."); return; }
    onSave({ ship_id: shipId, departure_port_id: departurePortId, arrival_port_id: arrivalPortId, departure_time: new Date(departureTime).toISOString(), arrival_time: new Date(arrivalTime).toISOString(), duration_minutes: Number(durationMinutes), classes: classes, status: status });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">{schedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div><label className="block text-gray-700 mb-1">Kapal</label><select value={shipId} onChange={e => setShipId(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" required><option value="" disabled>Pilih Kapal...</option>{ships.map(ship => (<option key={ship.id} value={ship.id}>{ship.name}</option>))}</select></div>
          <div><label className="block text-gray-700 mb-1">Pelabuhan Keberangkatan</label><select value={departurePortId} onChange={e => setDeparturePortId(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" required><option value="" disabled>Pilih Pelabuhan...</option>{ports.map(port => (<option key={port.id} value={port.id}>{port.city} - {port.name}</option>))}</select></div>
          <div><label className="block text-gray-700 mb-1">Pelabuhan Kedatangan</label><select value={arrivalPortId} onChange={e => setArrivalPortId(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white" required><option value="" disabled>Pilih Pelabuhan...</option>{ports.map(port => (<option key={port.id} value={port.id}>{port.city} - {port.name}</option>))}</select></div>
          <div><label className="block text-gray-700 mb-1">Waktu Keberangkatan</label><input type="datetime-local" value={departureTime} onChange={e => setDepartureTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required /></div>
          <div><label className="block text-gray-700 mb-1">Waktu Kedatangan</label><input type="datetime-local" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required /></div>
          <div><label className="block text-gray-700 mb-1">Durasi (menit)</label><input type="number" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required /></div>
          <div><label className="block text-gray-700 mb-1">Status</label><select value={status} onChange={e => setStatus(e.target.value as Schedule['status'])} className="w-full px-3 py-2 border rounded-lg bg-white"><option value="scheduled">Scheduled</option><option value="on_time">On Time</option><option value="delayed">Delayed</option><option value="cancelled">Cancelled</option></select></div>
          <div className="md:col-span-2 mt-4 p-4 border border-gray-200 rounded-lg">
            <label className="block text-gray-800 font-semibold mb-3">Kelas Kapal & Harga</label>
            <div className="space-y-3">
              {classes.map((c) => (<div key={c.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                <input type="text" placeholder="Nama Kelas (e.g. Ekonomi)" value={c.name} onChange={e => handleClassChange(c.id, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg md:col-span-3" required />
                <input type="number" placeholder="Harga" value={c.price} onChange={e => handleClassChange(c.id, 'price', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg md:col-span-2" required />
                <input type="number" placeholder="Kursi" value={c.available_seats} onChange={e => handleClassChange(c.id, 'available_seats', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg md:col-span-2" required />
                <button type="button" onClick={() => removeClass(c.id)} className="text-red-500 hover:text-red-700 p-2 justify-self-center"><X className="w-5 h-5" /></button>
              </div>))}
            </div>
            <button type="button" onClick={addClass} className="mt-4 text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 flex items-center gap-1"><Plus className="w-3 h-3"/> Tambah Kelas</button>
          </div>
          <div className="md:col-span-2 flex justify-end gap-4 mt-6"><button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">Batal</button><button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">Simpan</button></div>
        </form>
      </div>
    </div>
  );
}