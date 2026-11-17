"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "../hooks/use-url-params";

type HistoryPaginationProps = { page: number; pageCount: number };

export function HistoryPagination({ page, pageCount }: HistoryPaginationProps) {
  const { update, pending } = useUrlParams();
  if (pageCount <= 1) return null;

  const go = (target: number) => update({ page: target > 1 ? String(target) : null });
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-muted-foreground">Halaman {page} dari {pageCount}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1 || pending} onClick={() => go(page - 1)}>
          <ChevronLeft /> Sebelumnya
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pageCount || pending} onClick={() => go(page + 1)}>
          Berikutnya <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
