"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRupiah } from "@/lib/format";
import type { SalesPoint } from "../queries";

const compact = (v: number) => (v >= 1_000_000 ? `${v / 1_000_000}jt` : v >= 1000 ? `${v / 1000}rb` : String(v));

export function SalesChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8913f" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#b8913f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e3d8" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#6f6a5f" />
          <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#6f6a5f" width={48} tickFormatter={compact} />
          <Tooltip
            formatter={(value) => [formatRupiah(Number(value)), "Penjualan"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e8e3d8" }}
          />
          <Area type="monotone" dataKey="total" stroke="#b8913f" strokeWidth={2} fill="url(#sales)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
