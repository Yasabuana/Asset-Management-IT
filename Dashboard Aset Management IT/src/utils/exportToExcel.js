import * as XLSX from 'xlsx';

/**
 * Export array data ke file Excel (.xlsx) dan trigger download otomatis.
 * @param {Array<Object>} data - Array objek data yang akan di-export.
 * @param {Array<Object>} columns - Definisi kolom: [{ header: string, key: string }].
 * @param {string} fileName - Nama file output (tanpa ekstensi).
 */
export function exportToExcel(data, columns, fileName = 'export') {
  // Buat array of arrays: baris pertama header, sisanya data
  const headers = columns.map(col => col.header);
  const rows = data.map(row =>
    columns.map(col => (row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : ''))
  );

  const sheetData = [headers, ...rows];

  // Buat worksheet dan workbook
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}