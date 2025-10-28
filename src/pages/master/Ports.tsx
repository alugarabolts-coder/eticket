import { useState, useEffect } from 'react';
import { Anchor, Plus, Edit, Trash2 } from 'lucide-react';

interface Port {
  id: number;
  name: string;
  city: string;
}

const LOCAL_STORAGE_KEY = 'masterPortsData';

export default function Ports() {
  const [ports, setPorts] = useState<Port[]>(() => {
    try {
      const savedPorts = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedPorts ? JSON.parse(savedPorts) : [];
    } catch (error) {
      console.error("Gagal membaca data dari localStorage", error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPort, setCurrentPort] = useState<Port | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ports));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [ports]);

  const handleOpenModal = (port: Port | null) => {
    setCurrentPort(port);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentPort(null);
    setIsModalOpen(false);
  };

  const handleSave = (portData: Omit<Port, 'id'>) => {
    if (currentPort) {
      // Update
      setPorts(ports.map(p => p.id === currentPort.id ? { ...p, ...portData } : p));
    } else {
      // Create
      const newPort = { id: Date.now(), ...portData };
      setPorts([...ports, newPort]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setPorts(ports.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Anchor className="w-6 h-6 text-teal-500" />
          Data Pelabuhan
        </h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pelabuhan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-center w-16">No</th>
              <th className="py-2 px-4 border-b text-left">Nama Pelabuhan</th>
              <th className="py-2 px-4 border-b text-left">Kota</th>
              <th className="py-2 px-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ports.length === 0 ? (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        Belum ada data pelabuhan. Silakan tambahkan data baru.
                    </td>
                </tr>
            ) : (
                ports.map((port, index) => (
                    <tr key={port.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{port.name}</td>
                        <td className="py-2 px-4 border-b">{port.city}</td>
                        <td className="py-2 px-4 border-b text-center">
                        <button onClick={() => handleOpenModal(port)} className="text-blue-500 hover:text-blue-700 mr-4">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(port.id)} className="text-red-500 hover:text-red-700">
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
        <PortForm
          port={currentPort}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function PortForm({ port, onSave, onClose }: { port: Port | null; onSave: (data: Omit<Port, 'id'>) => void; onClose: () => void; }) {
  const [name, setName] = useState(port?.name || '');
  const [city, setCity] = useState(port?.city || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city) {
        alert("Semua field wajib diisi!");
        return;
    }
    onSave({ name, city });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{port ? 'Edit Pelabuhan' : 'Tambah Pelabuhan Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Pelabuhan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Kota</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
              Batal
            </button>
            <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}