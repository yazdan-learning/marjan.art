import { useListPaintings, useDeletePainting, getListPaintingsQueryKey } from "@workspace/api-client-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "wouter";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminPaintings() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const { data: paintings, isLoading: paintingsLoading } = useListPaintings();
  const deletePainting = useDeletePainting();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this painting?")) {
      deletePainting.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
          toast({
            title: "Painting deleted",
            description: "The painting has been removed from your portfolio.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete the painting.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-stone-900">Paintings</h2>
          <p className="text-stone-500 text-sm mt-1">Manage your artwork collection</p>
        </div>
        <Link href="/admin/paintings/new">
          <Button className="bg-stone-900 text-white hover:bg-stone-800 gap-2">
            <Plus size={18} /> Add Painting
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-stone-50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paintingsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : paintings && paintings.length > 0 ? (
              paintings.map((painting) => (
                <TableRow key={painting.id}>
                  <TableCell>
                    {painting.imageUrl ? (
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                        <img 
                          src={painting.imageUrl} 
                          alt={painting.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-stone-100 flex items-center justify-center text-stone-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-stone-900">{painting.title}</TableCell>
                  <TableCell className="text-stone-600">{painting.medium}</TableCell>
                  <TableCell className="text-stone-600">${painting.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {painting.available ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-normal">Available</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-stone-100 text-stone-600 border-stone-200 font-normal">Sold</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setLocation(`/admin/paintings/${painting.id}/edit`)}
                        className="text-stone-400 hover:text-stone-900"
                        data-testid={`button-edit-${painting.id}`}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(painting.id)}
                        className="text-stone-400 hover:text-red-600"
                        data-testid={`button-delete-${painting.id}`}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-stone-400">
                    <ImageIcon size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-serif">No paintings found</p>
                    <p className="text-sm mt-1">Start by adding your first artwork.</p>
                    <Link href="/admin/paintings/new">
                      <Button variant="outline" className="mt-4 border-stone-200 hover:bg-stone-50">
                        Add Painting
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
