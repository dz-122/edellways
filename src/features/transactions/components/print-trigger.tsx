"use client";
import { useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintTrigger() {
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="no-print mb-4 flex justify-center">
      <Button onClick={() => window.print()}>
        <Printer /> Cetak struk
      </Button>
    </div>
  );
}
