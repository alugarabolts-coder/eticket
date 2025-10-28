import { useState, useEffect } from 'react';
import { Ship, Plus, Edit, Trash2 } from 'lucide-react';

interface ShipData {
  id: number;
  name: string;
  capacity: number;
}

const LOCAL_STORAGE_KEY = 'masterShipsData';

export default function Ships() {
  const [ships, setShips] = useState<ShipData[]>(() => {
    try {
      const savedShips = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedShips ? JSON.parse(savedShips) : [];
    } catch (error) {
      console.error("Gagal membaca data kapal dari localStorage", error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShip, setCurrentShip] = useState<ShipData | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ships));
    } catch (error) {
      console.error("Gagal menyimpan data kapal ke localStorage", error);
    }
  }, [ships]);

  const handleOpenModal = (ship: ShipData | null) => {
    setCurrentShip(ship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentShip(null);
    setIsModalOpen(false);
  };

  const handleSave = (shipData: Omit<ShipData, 'id'>) => {
    if (currentShip) {
      // Update
      setShips(ships.map(s => s.id === currentShip.id ? { ...s, ...shipData } : s));
    } else {
      // Create
      setShips([...ships, { id: Date.now(), ...shipData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setShips(ships.filter(s => s.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Ship className="w-6 h-6 text-teal-500" />
          Data Kapal
        </h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Kapal
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-center w-16">No</th>
              <th className="py-2 px-4 border-b text-left">Nama Kapal</th>
              <th className="py-2 px-4 border-b text-left">Kapasitas</th>
              <th className="py-2 px-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ships.length === 0 ? (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        Belum ada data kapal. Silakan tambahkan data baru.
                    </td>
                </tr>
            ) : (
                ships.map((ship, index) => (
                    <tr key={ship.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{ship.name}</td>
                        <td className="py-2 px-4 border-b">{ship.capacity.toLocaleString('id-ID')}</td>
                        <td className="py-2 px-4 border-b text-center">
                        <button onClick={() => handleOpenModal(ship)} className="text-blue-500 hover:text-blue-700 mr-4">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(ship.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-5 h-5" />
                        </button>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ShipForm
          ship={currentShip}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function ShipForm({ ship, onSave, onClose }: { ship: ShipData | null; onSave: (data: Omit<ShipData, 'id'>) => void; onClose: () => void; }) {
  const [name, setName] = useState(ship?.name || '');
  const [capacity, setCapacity] = useState(ship?.capacity || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capacity) {
        alert("Nama dan kapasitas kapal wajib diisi!");
        return;
    }
    onSave({ name, capacity: Number(capacity) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{ship ? 'Edit Kapal' : 'Tambah Kapal'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Kapal</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Kapasitas</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
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