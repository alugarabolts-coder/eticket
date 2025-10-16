import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

export interface ExportData {
  tableName: string;
  data: any[];
}

export async function fetchAllData(): Promise<ExportData[]> {
  const tables = ['operators', 'ports', 'ships', 'schedules', 'bookings', 'passengers'];
  const exportData: ExportData[] = [];

  for (const tableName of tables) {
    try {
      let query = supabase.from(tableName).select('*');

      if (tableName === 'schedules') {
        query = supabase.from(tableName).select(`
          *,
          ship:ships(name, capacity),
          departure_port:ports!schedules_departure_port_id_fkey(name, city, code),
          arrival_port:ports!schedules_arrival_port_id_fkey(name, city, code)
        `);
      } else if (tableName === 'ships') {
        query = supabase.from(tableName).select(`
          *,
          operator:operators(name)
        `);
      } else if (tableName === 'bookings') {
        query = supabase.from(tableName).select(`
          *,
          schedule:schedules(
            departure_time,
            arrival_time,
            ship:ships(name),
            departure_port:ports!schedules_departure_port_id_fkey(name, city),
            arrival_port:ports!schedules_arrival_port_id_fkey(name, city)
          )
        `);
      } else if (tableName === 'passengers') {
        query = supabase.from(tableName).select(`
          *,
          booking:bookings(booking_code, contact_name)
        `);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        continue;
      }

      if (data && data.length > 0) {
        exportData.push({
          tableName,
          data: flattenData(data),
        });
      }
    } catch (error) {
      console.error(`Error processing ${tableName}:`, error);
    }
  }

  return exportData;
}

function flattenData(data: any[]): any[] {
  return data.map((item) => {
    const flattened: any = {};

    for (const [key, value] of Object.entries(item)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          flattened[`${key}_${nestedKey}`] = nestedValue;
        }
      } else if (Array.isArray(value)) {
        flattened[key] = JSON.stringify(value);
      } else {
        flattened[key] = value;
      }
    }

    return flattened;
  });
}

export function exportToExcel(exportData: ExportData[], filename: string = 'supabase-export') {
  const workbook = XLSX.utils.book_new();

  exportData.forEach(({ tableName, data }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 15 }));
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
  });

  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filename}-${timestamp}.xlsx`);
}

export async function exportAllDataToExcel() {
  try {
    const data = await fetchAllData();

    if (data.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }

    exportToExcel(data, 'shiptix-data');
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Gagal export data: ' + (error as Error).message);
    return false;
  }
}
