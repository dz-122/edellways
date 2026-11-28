"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import type { TransactionView } from "@/features/transactions/types";
import {
  BLE_CHUNK_DELAY_MS,
  BLE_CHUNK_SIZE,
  DEFAULT_COLS,
  PAPER_STORAGE_KEY,
  PRINTER_SERVICES,
} from "../constants";
import { encodeReceipt } from "../escpos";
import { buildReceiptLines } from "../receipt-lines";

type PrinterStatus = "disconnected" | "connecting" | "connected";

type PrinterContextValue = {
  supported: boolean;
  status: PrinterStatus;
  deviceName: string;
  printing: boolean;
  cols: number;
  setCols: (cols: number) => void;
  connect: () => Promise<BluetoothRemoteGATTCharacteristic | null>;
  disconnect: () => void;
  print: (tx: TransactionView) => Promise<boolean>;
};

const PrinterContext = createContext<PrinterContextValue | null>(null);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function findWritableCharacteristic(device: BluetoothDevice) {
  const server = await device.gatt?.connect();
  if (!server) throw new Error("Printer tidak mendukung koneksi GATT.");
  const known = (uuid: string) => PRINTER_SERVICES.includes(uuid);
  const services = (await server.getPrimaryServices()).sort(
    (a, b) => Number(known(b.uuid)) - Number(known(a.uuid)),
  );
  for (const service of services) {
    const characteristics = await service.getCharacteristics();
    const writable = characteristics.find(
      (c) => c.properties.write || c.properties.writeWithoutResponse,
    );
    if (writable) return writable;
  }
  throw new Error(
    "Printer terhubung, tetapi karakteristik tulis tidak ditemukan.",
  );
}

export function PrinterProvider({ children }: { children: React.ReactNode }) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<PrinterStatus>("disconnected");
  const [deviceName, setDeviceName] = useState("");
  const [printing, setPrinting] = useState(false);
  const [cols, setColsState] = useState(DEFAULT_COLS);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(
    null,
  );

  useEffect(() => {
    setSupported("bluetooth" in navigator);
    try {
      const saved = Number(localStorage.getItem(PAPER_STORAGE_KEY));
      if (saved) setColsState(saved);
    } catch {}
  }, []);

  const setCols = useCallback((value: number) => {
    setColsState(value);
    try {
      localStorage.setItem(PAPER_STORAGE_KEY, String(value));
    } catch {}
  }, []);

  const connect = useCallback(async () => {
    if (!("bluetooth" in navigator)) {
      toast.error(
        window.isSecureContext
          ? "Browser ini tidak mendukung Bluetooth (iPhone/iPad tidak didukung). Pakai Chrome di Android."
          : "Bluetooth butuh HTTPS. Buka lewat alamat yang diawali https://.",
      );
      return null;
    }
    setStatus("connecting");
    try {
      let device = deviceRef.current;
      if (!device) {
        device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: PRINTER_SERVICES,
        });
        device.addEventListener("gattserverdisconnected", () => {
          characteristicRef.current = null;
          setStatus("disconnected");
        });
        deviceRef.current = device;
      }
      const characteristic = await findWritableCharacteristic(device);
      characteristicRef.current = characteristic;
      setDeviceName(device.name || "Printer");
      setStatus("connected");
      return characteristic;
    } catch (error) {
      setStatus("disconnected");
      const cancelled =
        error instanceof DOMException && error.name === "NotFoundError";
      if (!cancelled)
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal menyambungkan printer.",
        );
      return null;
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      deviceRef.current?.gatt?.disconnect();
    } catch {}
    deviceRef.current = null;
    characteristicRef.current = null;
    setDeviceName("");
    setStatus("disconnected");
  }, []);

  const print = useCallback(
    async (tx: TransactionView) => {
      let characteristic = characteristicRef.current;
      if (!characteristic || !deviceRef.current?.gatt?.connected)
        characteristic = await connect();
      if (!characteristic) return false;

      setPrinting(true);
      try {
        const bytes = encodeReceipt(buildReceiptLines(tx, cols));
        for (let i = 0; i < bytes.length; i += BLE_CHUNK_SIZE) {
          const chunk = bytes.slice(i, i + BLE_CHUNK_SIZE);
          if (characteristic.properties.writeWithoutResponse)
            await characteristic.writeValueWithoutResponse(chunk);
          else await characteristic.writeValue(chunk);
          await sleep(BLE_CHUNK_DELAY_MS);
        }
        toast.success("Struk dikirim ke printer.");
        return true;
      } catch (error) {
        characteristicRef.current = null;
        setStatus("disconnected");
        toast.error(
          `Gagal mencetak: ${error instanceof Error ? error.message : "koneksi terputus"}. Coba lagi.`,
        );
        return false;
      } finally {
        setPrinting(false);
      }
    },
    [connect, cols],
  );

  const value = useMemo(
    () => ({
      supported,
      status,
      deviceName,
      printing,
      cols,
      setCols,
      connect,
      disconnect,
      print,
    }),
    [
      supported,
      status,
      deviceName,
      printing,
      cols,
      setCols,
      connect,
      disconnect,
      print,
    ],
  );
  return (
    <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>
  );
}

export function usePrinter(): PrinterContextValue {
  const ctx = useContext(PrinterContext);
  if (!ctx)
    throw new Error("usePrinter harus dipakai di dalam <PrinterProvider>.");
  return ctx;
}
