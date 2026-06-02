import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetPainting, 
  useCreatePainting, 
  useUpdatePainting, 
  useListSeries,
  getListPaintingsQueryKey,
  getGetPaintingQueryKey
} from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Loader2, Save, X, Upload } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminPaintingForm() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!params.id;
  const paintingId = isEditing ? parseInt(params.id!) : null;

  const { data: painting, isLoading: paintingLoading } = useGetPainting(paintingId!, {
    query: { enabled: isEditing, queryKey: ["getPainting", paintingId] }
  });
  
  const { data: series } = useListSeries();
  const createPainting = useCreatePainting();
  const updatePainting = useUpdatePainting();

  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    medium: "Oil",
    size: "",
    price: 0,
    available: true,
    description: "",
    seriesId: "none",
    imageUrl: ""
  });

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response: any) => {
      setFormData(prev => ({ ...prev, imageUrl: response.objectPath }));
      toast({ title: "Image uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  });

  useEffect(() => {
    if (painting) {
      setFormData({
        title: painting.title,
        year: painting.year,
        medium: painting.medium,
        size: painting.size,
        price: painting.price,
        available: painting.available,
        description: painting.description,
        seriesId: painting.seriesId?.toString() ?? "none",
        imageUrl: painting.imageUrl ?? ""
      });
    }
  }, [painting]);

  if (authLoading || !isAuthenticated) return null;
  if (isEditing && paintingLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-stone-400" size={32} />
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      seriesId: formData.seriesId === "none" ? null : parseInt(formData.seriesId),
      displayOrder: painting?.displayOrder ?? 0
    };

    if (isEditing) {
      updatePainting.mutate({ id: paintingId!, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPaintingQueryKey(paintingId!) });
          toast({ title: "Painting updated" });
          setLocation("/admin/paintings");
        }
      });
    } else {
      createPainting.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
          toast({ title: "Painting created" });
          setLocation("/admin/paintings");
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif text-stone-900">
              {isEditing ? "Edit Painting" : "Add New Painting"}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {isEditing ? `Editing "${painting?.title}"` : "Create a new artwork entry"}
            </p>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/admin/paintings")} className="text-stone-500 hover:text-stone-900">
            <X size={18} className="mr-2" /> Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Silent Horizon"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    type="number"
                    value={formData.year} 
                    onChange={e => setFormData(p => ({ ...p, year: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Select 
                    value={formData.medium} 
                    onValueChange={v => setFormData(p => ({ ...p, medium: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Watercolor">Watercolor</SelectItem>
                      <SelectItem value="Acrylic">Acrylic</SelectItem>
                      <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input 
                    id="size" 
                    value={formData.size} 
                    onChange={e => setFormData(p => ({ ...p, size: e.target.value }))}
                    placeholder="e.g. 24 × 36 in"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={formData.price} 
                    onChange={e => setFormData(p => ({ ...p, price: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Series</Label>
                <Select 
                  value={formData.seriesId} 
                  onValueChange={v => setFormData(p => ({ ...p, seriesId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Series</SelectItem>
                    {series?.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Tell the story of this piece..."
                  rows={5}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-sm space-y-6">
              <div className="space-y-4">
                <Label>Artwork Image</Label>
                <div className="aspect-[4/5] bg-stone-50 border-2 border-dashed border-stone-200 rounded-lg overflow-hidden flex flex-col items-center justify-center relative group">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-stone-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-2">
                          <Upload size={16} /> Replace
                          <input type="file" className="hidden" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} disabled={isUploading} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon size={48} className="mx-auto text-stone-300 mb-4" />
                      <label className="cursor-pointer text-primary hover:underline font-medium block">
                        {isUploading ? "Uploading..." : "Upload Image"}
                        <input type="file" className="hidden" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} disabled={isUploading} />
                      </label>
                      <p className="text-xs text-stone-400 mt-2">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-stone-100">
                <div className="space-y-0.5">
                  <Label htmlFor="available">Available for Sale</Label>
                  <p className="text-xs text-stone-500">Show price and inquiry button</p>
                </div>
                <Switch 
                  id="available" 
                  checked={formData.available} 
                  onCheckedChange={v => setFormData(p => ({ ...p, available: v }))}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-stone-900 text-white hover:bg-stone-800 gap-2 h-12"
                disabled={createPainting.isPending || updatePainting.isPending || isUploading}
              >
                {createPainting.isPending || updatePainting.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {isEditing ? "Save Changes" : "Publish Painting"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
