/**
 * IMAGE UPLOAD COMPONENT - STANDALONE VERSION
 * 
 * This is a clean, reusable image upload component with Supabase integration.
 * Copy this file along with the dependencies to your new project.
 * 
 * Required dependencies:
 * - @supabase/supabase-js
 * - @tanstack/react-query
 * - sonner (or replace with your preferred toast library)
 * - shadcn/ui components: Button, Input, Card
 * - lucide-react (for icons)
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

// ========================================
// IMPORTANT: Replace this import with your Supabase client
// ========================================
import { supabase } from "@/integrations/supabase/client";

// ========================================
// TYPES
// ========================================
export interface Photo {
    id: string;
    title: string;
    category: string;
    storage_path: string;
    sort_order: number;
    created_at: string;
}

interface ImageUploadProps {
    /**
     * List of available categories for selection
     */
    categories?: string[];
    /**
     * Supabase storage bucket name (default: "portfolio")
     */
    bucketName?: string;
    /**
     * Query key for invalidation after upload (default: ["photos"])
     */
    queryKey?: string[];
    /**
     * Maximum number of files per upload (default: unlimited)
     */
    maxFiles?: number;
    /**
     * Callback after successful upload
     */
    onSuccess?: () => void;
}

// ========================================
// HELPER FUNCTION: Get Public URL
// ========================================
export const getPhotoUrl = (path: string, bucketName: string = "portfolio") => {
    if (!path) return "";
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data?.publicUrl || "";
};

// ========================================
// MAIN COMPONENT
// ========================================
export const ImageUpload = ({
    categories = ["Weddings", "Portraits", "Events", "Lifestyle"],
    bucketName = "portfolio",
    queryKey = ["photos"],
    maxFiles,
    onSuccess,
}: ImageUploadProps) => {
    const queryClient = useQueryClient();
    const [category, setCategory] = useState<string>("");
    const [uploadFiles, setUploadFiles] = useState<{ file: File; title: string }[]>([]);
    const [uploading, setUploading] = useState(false);

    // Fetch existing photos (for sort_order calculation)
    const { data: photos = [] } = useQuery({
        queryKey,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("photos")
                .select("*")
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return data as Photo[];
        },
    });

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async () => {
            // Validation
            if (uploadFiles.length === 0) throw new Error("Please select files to upload");
            if (!category) throw new Error("Please select a category");
            if (uploadFiles.some(f => !f.title.trim())) {
                throw new Error("Please ensure all photos have titles");
            }

            // Upload each file
            const uploadPromises = uploadFiles.map(async ({ file, title: photoTitle }, index) => {
                // Generate unique filename: timestamp + random string
                const ext = file.name.split(".").pop();
                const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(path, file, { 
                        contentType: file.type,
                        cacheControl: "3600" // 1 hour cache
                    });
                if (uploadError) throw uploadError;

                // Insert record into database
                const { error: dbError } = await supabase.from("photos").insert({
                    title: photoTitle,
                    category,
                    storage_path: path,
                    sort_order: photos.length + index,
                });
                if (dbError) throw dbError;
            });

            await Promise.all(uploadPromises);
        },
        onMutate: () => setUploading(true),
        onSettled: () => setUploading(false),
        onSuccess: () => {
            // Invalidate query caches
            queryClient.invalidateQueries({ queryKey });
            
            // Reset form
            setCategory("");
            setUploadFiles([]);
            
            // Show success message
            toast.success(`${uploadFiles.length} photo(s) uploaded successfully`);
            
            // Call custom success callback
            onSuccess?.();
        },
        onError: (err: Error) => {
            toast.error(err.message);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async ({ id, storage_path }: { id: string; storage_path: string }) => {
            // Remove from storage first
            const { error: storageError } = await supabase.storage
                .from(bucketName)
                .remove([storage_path]);
            if (storageError) throw storageError;

            // Remove from database
            const { error: dbError } = await supabase
                .from("photos")
                .delete()
                .eq("id", id);
            if (dbError) throw dbError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success("Photo deleted");
        },
        onError: (err: Error) => {
            toast.error(err.message);
        },
    });

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        
        // Check max files limit
        if (maxFiles && newFiles.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setUploadFiles(
            newFiles.map(f => ({
                file: f,
                title: f.name.replace(/\.[^/.]+$/, "") // Strip extension for default title
            }))
        );
    };

    // Handle title update
    const handleTitleUpdate = (index: number, newTitle: string) => {
        const newFiles = [...uploadFiles];
        newFiles[index].title = newTitle;
        setUploadFiles(newFiles);
    };

    // Handle file removal
    const handleRemoveFile = (index: number) => {
        setUploadFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle upload
    const handleUpload = () => {
        uploadMutation.mutate();
    };

    // Handle delete
    const handleDelete = (photo: Photo) => {
        deleteMutation.mutate({ id: photo.id, storage_path: photo.storage_path });
    };

    return (
        <div className="space-y-6">
            {/* Upload Form */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Category Selector */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold block">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-10 bg-secondary/20 border px-3 text-xs outline-none rounded"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* File Input */}
                    <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest font-semibold block">
                            Image Files
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileSelect}
                            />
                            <div className="border-2 border-dashed border-muted/30 rounded-lg p-8 flex flex-col items-center justify-center text-center group-hover:border-foreground/20 transition-colors">
                                <Upload className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-foreground transition-colors" />
                                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors px-2">
                                    {uploadFiles.length > 0
                                        ? `${uploadFiles.length} file(s) selected`
                                        : "Click or drag images to upload"}
                                </p>
                            </div>
                        </div>

                        {/* File Previews */}
                        {uploadFiles.length > 0 && (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {uploadFiles.map((fileItem, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <img
                                            src={URL.createObjectURL(fileItem.file)}
                                            alt={fileItem.title}
                                            className="h-10 w-10 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <span className="text-xs text-muted-foreground truncate block">
                                                {fileItem.file.name}
                                            </span>
                                            <Input
                                                placeholder="Photo Title"
                                                className="h-7 text-xs"
                                                value={fileItem.title}
                                                onChange={(e) => handleTitleUpdate(idx, e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                                            onClick={() => handleRemoveFile(idx)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upload Button */}
                    <div className="relative">
                        {uploading && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
                                <span className="text-xs tracking-widest font-medium">Uploading...</span>
                            </div>
                        )}
                        <Button
                            onClick={handleUpload}
                            disabled={
                                uploadFiles.length === 0 || 
                                uploadFiles.some(f => !f.title) || 
                                !category || 
                                uploading
                            }
                            className="w-full"
                        >
                            {uploading ? "Uploading..." : `Upload ${uploadFiles.length} Photo(s)`}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Display Uploaded Photos */}
            {photos.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-widest font-semibold">
                        Gallery ({photos.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group">
                                <img
                                    src={getPhotoUrl(photo.storage_path, bucketName)}
                                    alt={photo.title}
                                    className="w-full aspect-[4/3] object-cover rounded"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all"
                                        onClick={() => handleDelete(photo)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="p-2">
                                    <p className="text-sm font-medium">{photo.title}</p>
                                    <p className="text-xs text-muted-foreground">{photo.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
