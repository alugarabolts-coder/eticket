import { useState } from 'react';
import { Download, Database, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { exportAllDataToExcel } from '../utils/excelExport';

export function ExportData() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAllDataToExcel();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Data</h1>
          <p className="text-gray-600">Export semua data dari database ke file Excel</p>
        </div>

        <Card className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <FileSpreadsheet className="w-10 h-10 text-teal-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Export Database ke Excel
            </h2>

            <p className="text-gray-600 mb-6 max-w-md">
              Klik tombol di bawah untuk mengexport semua data dari database. Data akan didownload dalam format Excel (.xlsx) dengan sheet terpisah untuk setiap tabel.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
                <Database className="w-5 h-5 mr-2" />
                Tabel yang akan diexport:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Operators
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Ports
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Ships
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Schedules
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Bookings
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Passengers
                </div>
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {isExporting ? 'Sedang Export...' : 'Export ke Excel'}
            </Button>

            {isExporting && (
              <p className="text-sm text-gray-500 mt-4">
                Mohon tunggu, sedang mengambil data dari database...
              </p>
            )}
          </div>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Informasi:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• File akan didownload dengan format: shiptix-data-YYYY-MM-DD.xlsx</li>
            <li>• Setiap tabel akan menjadi sheet terpisah dalam file Excel</li>
            <li>• Data relasi akan di-flatten untuk kemudahan pembacaan</li>
            <li>• Data JSON akan dikonversi menjadi string</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
