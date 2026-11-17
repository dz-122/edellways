"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteCategory, saveCategory } from "../actions";
import { CATEGORY_TYPE_HINTS, CATEGORY_TYPE_LABELS, CATEGORY_TYPES, type CategoryType } from "../constants";
import type { CategoryRow } from "../types";

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [type, setType] = useState<CategoryType>("COLLECTION");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [pending, startTransition] = useTransition();

  const label = CATEGORY_TYPE_LABELS[type];
  const rows = categories.filter((c) => c.type === type);

  const save = (id: string | null, name: string, onDone: () => void) =>
    startTransition(async () => {
      const result = await saveCategory(id, name, type);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(id ? `${label} diperbarui.` : `${label} ditambahkan.`);
      onDone();
    });

  const remove = (category: CategoryRow) => {
    if (!confirm(`Hapus ${label.toLowerCase()} "${category.name}"? ${category.productCount} produk akan kehilangan ${label.toLowerCase()} ini.`)) return;
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(`${label} dihapus.`);
    });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <SegmentedControl
        label="Jenis kategori"
        value={type}
        onChange={(v) => { setType(v); setEditingId(null); }}
        options={CATEGORY_TYPES.map((t) => ({ value: t, label: `${CATEGORY_TYPE_LABELS[t]} (${categories.filter((c) => c.type === t).length})` }))}
      />
      <p className="text-sm text-muted-foreground">{CATEGORY_TYPE_HINTS[type]}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(null, newName, () => setNewName(""));
        }}
        className="flex gap-2"
      >
        <Input placeholder={`Nama ${label.toLowerCase()} baru`} value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Button type="submit" disabled={pending}><Plus /> Tambah</Button>
      </form>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead className="pr-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Belum ada {label.toLowerCase()}.</TableCell>
              </TableRow>
            )}
            {rows.map((category) => {
              const isEditing = editingId === category.id;
              return (
                <TableRow key={category.id}>
                  <TableCell className="pl-4 font-medium">
                    {isEditing ? <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-8" autoFocus /> : category.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell className="pr-4 text-right">
                    {isEditing ? (
                      <>
                        <Button variant="ghost" size="icon" aria-label="Simpan" onClick={() => save(category.id, editingName, () => setEditingId(null))}><Check /></Button>
                        <Button variant="ghost" size="icon" aria-label="Batal" onClick={() => setEditingId(null)}><X /></Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => { setEditingId(category.id); setEditingName(category.name); }}><Pencil /></Button>
                        <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => remove(category)}><Trash2 className="text-destructive" /></Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}