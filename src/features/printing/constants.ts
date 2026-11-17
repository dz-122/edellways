// UUID service umum printer thermal BLE (harus dideklarasikan agar bisa diakses Web Bluetooth).
export const PRINTER_SERVICES: string[] = [
  "000018f0-0000-1000-8000-00805f9b34fb",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
  "49535343-fe7d-4ae5-8fa9-9fafd205e455",
  "0000ffe0-0000-1000-8000-00805f9b34fb",
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "0000fff0-0000-1000-8000-00805f9b34fb",
];

/** cols = jumlah karakter per baris (font A). */
export const PAPER_OPTIONS = [
  { label: "58 mm", cols: 32 },
] as const;

export const DEFAULT_COLS = 32;
export const PAPER_STORAGE_KEY = "edellways:printer-cols";

export const BLE_CHUNK_SIZE = 100;
export const BLE_CHUNK_DELAY_MS = 30;