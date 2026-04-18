import * as XLSX from 'xlsx';

export function exportToExcel<T extends Record<string, unknown>>(
  rows: T[],
  fileName: string,
  sheetName = 'Sheet1'
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns
  const cols = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.min(
      Math.max(
        key.length,
        ...rows.map((r) => String(r[key] ?? '').length)
      ) + 2,
      60
    ),
  }));
  worksheet['!cols'] = cols;

  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${fileName}_${date}.xlsx`);
}
