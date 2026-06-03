import { useState, useEffect } from "react";
import { useGetAboutSettings, useUpdateAboutSettings } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminAbout() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetAboutSettings();
  const updateSettings = useUpdateAboutSettings();

  const [bioText, setBioText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (settings) {
      setBioText(settings.bioText ?? "");
      setImageUrl(settings.imageUrl ?? "");
    }
  }, [settings]);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response: any) => {
      setImageUrl(response.objectPath);
      toast({ title: "Photo uploaded" });
    },
    onError: () => {
      toast({ title: "Upload failed", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateSettings.mutate(
      { bioText, imageUrl: imageUrl || null },
      { onSuccess: () => toast({ title: "About page updated" }) }
    );
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-serif text-stone-900">About Page</h2>
          <p className="text-stone-500 text-sm mt-1">Edit your bio and photo shown on the About page</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio Text</Label>
                {isLoading ? (
                  <div className="h-48 bg-stone-100 animate-pulse rounded" />
                ) : (
                  <Textarea
                    id="bio"
                    value={bioText}
                    onChange={e => setBioText(e.target.value)}
                    rows={10}
                    placeholder="Write your artist bio here..."
                    className="resize-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-sm space-y-4">
              <Label>Artist Photo</Label>
              <div className="aspect-[3/4] bg-stone-50 border-2 border-dashed border-stone-200 rounded-lg overflow-hidden flex flex-col items-center justify-center relative group">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Artist" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-stone-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-50 flex items-center gap-2">
                        <Upload size={16} /> Replace
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} disabled={isUploading} />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon size={40} className="mx-auto text-stone-300 mb-3" />
                    <label className="cursor-pointer text-primary hover:underline font-medium block text-sm">
                      {isUploading ? "Uploading..." : "Upload Photo"}
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} disabled={isUploading} />
                    </label>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-stone-900 text-white hover:bg-stone-800 gap-2 h-12"
                onClick={handleSave}
                disabled={updateSettings.isPending || isUploading}
              >
                {updateSettings.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
