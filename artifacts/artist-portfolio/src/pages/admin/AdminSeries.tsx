import { useState } from "react";
import { 
  useListSeries, 
  useCreateSeries, 
  useUpdateSeries, 
  useDeleteSeries,
  getListSeriesQueryKey
} from "@workspace/api-client-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Plus, Save, X, Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminSeries() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const { data: series, isLoading: seriesLoading } = useListSeries();
  const createSeries = useCreateSeries();
  const updateSeries = useUpdateSeries();
  const deleteSeries = useDeleteSeries();
  const { toast } = useToast();

  const [newSeries, setNewSeries] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  if (authLoading || !isAuthenticated) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeries.name.trim()) return;

    createSeries.mutate({ data: newSeries }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSeriesQueryKey() });
        setNewSeries({ name: "", description: "" });
        toast({ title: "Series created" });
      }
    });
  };

  const handleStartEdit = (s: any) => {
    setEditingId(s.id);
    setEditForm({ name: s.name, description: s.description ?? "" });
  };

  const handleUpdate = (id: number) => {
    updateSeries.mutate({ id, data: editForm }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSeriesQueryKey() });
        setEditingId(null);
        toast({ title: "Series updated" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure? This will not delete the paintings, but they will no longer belong to this series.")) {
      deleteSeries.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSeriesQueryKey() });
          toast({ title: "Series deleted" });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Series</h2>
          <p className="text-stone-500 text-sm mt-1">Organize your work into collections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-sm">
            <h3 className="font-serif text-xl mb-4 text-stone-900">Create New Series</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Series Name" 
                  value={newSeries.name}
                  onChange={e => setNewSeries(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="Optional Description" 
                  value={newSeries.description}
                  onChange={e => setNewSeries(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-stone-900 text-white hover:bg-stone-800 gap-2"
                disabled={createSeries.isPending}
              >
                {createSeries.isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Add Series
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seriesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : series && series.length > 0 ? (
                  series.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-stone-900">
                        {editingId === s.id ? (
                          <Input 
                            value={editForm.name} 
                            onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                            className="h-8"
                          />
                        ) : s.name}
                      </TableCell>
                      <TableCell className="text-stone-600">
                        {editingId === s.id ? (
                          <Input 
                            value={editForm.description} 
                            onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                            className="h-8"
                          />
                        ) : s.description || <span className="text-stone-400 italic">No description</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === s.id ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleUpdate(s.id)}
                                className="text-emerald-600"
                                disabled={updateSeries.isPending}
                              >
                                {updateSeries.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setEditingId(null)}
                                className="text-stone-400"
                              >
                                <X size={18} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleStartEdit(s)}
                                className="text-stone-400 hover:text-stone-900"
                                data-testid={`button-edit-series-${s.id}`}
                              >
                                <Edit size={18} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDelete(s.id)}
                                className="text-stone-400 hover:text-red-600"
                                data-testid={`button-delete-series-${s.id}`}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-stone-400">
                      No series created yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
