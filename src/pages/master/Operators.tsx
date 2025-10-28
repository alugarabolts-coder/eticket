import { useState } from 'react';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

interface Operator {
  id: number;
  name: string;
  contact_person: string;
}

export default function Operators() {
  const [operators, setOperators] = useState<Operator[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);

  const handleOpenModal = (operator: Operator | null) => {
    setCurrentOperator(operator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentOperator(null);
    setIsModalOpen(false);
  };

  const handleSave = (operatorData: Omit<Operator, 'id'>) => {
    if (currentOperator) {
      setOperators(operators.map(op => op.id === currentOperator.id ? { ...op, ...operatorData } : op));
    } else {
      setOperators([...operators, { id: Date.now(), ...operatorData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setOperators(operators.filter(op => op.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="w-6 h-6 text-teal-500" />
          Data Operator
        </h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Operator
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              {/* <th className="py-2 px-4 border-b text-left">ID</th> */}
              <th className="py-2 px-4 border-b text-center w-16">No</th>
              <th className="py-2 px-4 border-b text-left">Nama Operator</th>
              <th className="py-2 px-4 border-b text-left">Contact Person</th>
              <th className="py-2 px-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op, index) => (
              <tr key={op.id} className="hover:bg-gray-50">
                {/* <td className="py-2 px-4 border-b">{op.id}</td> */}
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b">{op.name}</td>
                <td className="py-2 px-4 border-b">{op.contact_person}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button onClick={() => handleOpenModal(op)} className="text-blue-500 hover:text-blue-700 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(op.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <OperatorForm
          operator={currentOperator}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function OperatorForm({ operator, onSave, onClose }: { operator: Operator | null; onSave: (data: Omit<Operator, 'id'>) => void; onClose: () => void; }) {
  const [name, setName] = useState(operator?.name || '');
  const [contact_person, setContactPerson] = useState(operator?.contact_person || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, contact_person });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{operator ? 'Edit Operator' : 'Tambah Operator'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Operator</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg" required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contact Person</label>
            <input
              type="text" value={contact_person} onChange={(e) => setContactPerson(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg" required
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Batal</button>
            <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-lg">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}