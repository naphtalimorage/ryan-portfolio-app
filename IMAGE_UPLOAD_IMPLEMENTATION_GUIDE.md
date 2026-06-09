# Image Upload Implementation - Complete Guide

This document contains the **complete image upload implementation** extracted from a React + Supabase portfolio application. You can use this as a reference to implement the same feature in another application.

---

## Architecture Overview

This is a **frontend-only application** using **Supabase** as Backend-as-a-Service (BaaS):
- **Storage**: Supabase Storage bucket named `portfolio`
- **Database**: Supabase Postgres table named `photos`
- **Authentication**: Supabase Auth (for admin access)
- **No custom backend**: All operations go through Supabase JS SDK

### Tech Stack
- React + TypeScript
- Supabase (`@supabase/supabase-js`)
- React Query (`@tanstack/react-query`) for data fetching/mutations
- react-easy-crop for image cropping
- @dnd-kit for drag-and-drop reordering
- Tailwind CSS + shadcn/ui components

---

## 1. Environment Setup

### `.env` file
```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

---

## 2. Required Dependencies

```json
{
  "@supabase/supabase-js": "^2.100.1",
  "@tanstack/react-query": "^5.95.2",
  "react-easy-crop": "^5.5.7",
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "sonner": "^2.0.7"
}
```

Install command:
```bash
npm install @supabase/supabase-js @tanstack/react-query react-easy-crop @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities sonner
```

---

## 3. Supabase Setup

### 3.1 Create Storage Bucket

In your Supabase dashboard:
1. Go to **Storage**
2. Create a new bucket named `portfolio`
3. Set it as **Public** (so images can be accessed via public URLs)
4. Configure file size limits and allowed MIME types as needed

### 3.2 Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_photos_sort_order ON photos(sort_order);
CREATE INDEX idx_photos_category ON photos(category);
```

---

## 4. TypeScript Types

### `src/integrations/supabase/types.ts`

```typescript
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            photos: {
                Row: {
                    category: string
                    created_at: string
                    id: string
                    sort_order: number
                    storage_path: string
                    title: string
                }
                Insert: {
                    category: string
                    created_at?: string
                    id?: string
                    sort_order?: number
                    storage_path: string
                    title: string
                }
                Update: {
                    category?: string
                    created_at?: string
                    id?: string
                    sort_order?: number
                    storage_path?: string
                    title?: string
                }
                Relationships: []
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
        CompositeTypes: {}
    }
}
```

---

## 5. Supabase Client Setup

### `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});
```

---

## 6. Image Upload Component (Admin Panel)

### `src/pages/Admin.tsx` (Upload Section)

```tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Helper to get public URL from storage path
const getPublicUrl = (path?: string) => {
    if (!path) return "";
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data?.publicUrl || "";
};

const Admin = () => {
    const queryClient = useQueryClient();
    const [category, setCategory] = useState<string>("");
    const [uploadFiles, setUploadFiles] = useState<{ file: File; title: string }[]>([]);
    const [uploading, setUploading] = useState(false);

    // Fetch existing photos
    const { data: photos = [] } = useQuery({
        queryKey: ["admin-photos"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("photos")
                .select("*")
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return data;
        },
    });

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (uploadFiles.length === 0 || !category) 
                throw new Error("Select files and category");
            if (uploadFiles.some(f => !f.title.trim())) 
                throw new Error("Please ensure all photos have titles");

            const uploadPromises = uploadFiles.map(async ({ file, title: photoTitle }, index) => {
                // Generate unique filename
                const ext = file.name.split(".").pop();
                const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from("portfolio")
                    .upload(path, file, { contentType: file.type });
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
            queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio-photos"] });
            setCategory("");
            setUploadFiles([]);
            toast.success(`${uploadFiles.length} photo(s) uploaded successfully`);
        },
        onError: (err: Error) => {
            toast.error(err.message);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async ({ id, storage_path }: { id: string; storage_path: string }) => {
            // Remove from storage
            await supabase.storage.from("portfolio").remove([storage_path]);
            // Remove from database
            const { error } = await supabase.from("photos").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio-photos"] });
            toast.success("Photo deleted");
        },
        onError: (err: Error) => toast.error(err.message),
    });

    return (
        <div className="space-y-6">
            <h2>Add to Collection</h2>
            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Category Selector */}
                    <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest font-semibold">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-10 bg-secondary/20 border px-3 text-xs outline-none"
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Weddings">Weddings</option>
                            <option value="Portraits">Portraits</option>
                            <option value="Events">Events</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Safaris">Safaris</option>
                        </select>
                    </div>

                    {/* File Input */}
                    <div className="space-y-4">
                        <label className="text-xs uppercase tracking-widest font-semibold">
                            Image Files
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                    const newFiles = Array.from(e.target.files || []);
                                    setUploadFiles(
                                        newFiles.map(f => ({
                                            file: f,
                                            title: f.name.replace(/\.[^/.]+$/, "") // Strip extension
                                        }))
                                    );
                                }}
                            />
                            <div className="border-2 border-dashed p-8 flex flex-col items-center justify-center text-center">
                                <Upload className="h-6 w-6 mb-2" />
                                <p className="text-xs">
                                    {uploadFiles.length > 0
                                        ? `${uploadFiles.length} file(s) selected`
                                        : "Click or drag images to upload"}
                                </p>
                            </div>
                        </div>

                        {/* File Previews */}
                        {uploadFiles.length > 0 && (
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {uploadFiles.map((fileItem, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <img
                                            src={URL.createObjectURL(fileItem.file)}
                                            alt={fileItem.title}
                                            className="h-10 w-10 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <span className="text-xs truncate block">
                                                {fileItem.file.name}
                                            </span>
                                            <Input
                                                placeholder="Photo Title"
                                                className="h-7 text-xs"
                                                value={fileItem.title}
                                                onChange={(e) => {
                                                    const newFiles = [...uploadFiles];
                                                    newFiles[idx].title = e.target.value;
                                                    setUploadFiles(newFiles);
                                                }}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => 
                                                setUploadFiles(prev => prev.filter((_, i) => i !== idx))
                                            }
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={() => uploadMutation.mutate()}
                        disabled={
                            uploadFiles.length === 0 || 
                            uploadFiles.some(f => !f.title) || 
                            !category || 
                            uploading
                        }
                        className="w-full"
                    >
                        {uploading ? "Uploading..." : "Publish to Portfolio"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Admin;
```

---

## 7. Photo Edit Dialog with Crop Functionality

### `src/components/dialog/PhotoEditDialog.tsx`

```tsx
import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Crop, Save } from "lucide-react";

const CATEGORIES = ["Weddings", "Portraits", "Events", "Lifestyle"] as const;

export type Photo = {
    id: string;
    title: string;
    category: string;
    storage_path: string;
    sort_order: number;
    created_at: string;
};

interface PhotoEditDialogProps {
    photo: Photo | null;
    imageUrl: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaveDetails: (id: string, title: string, category: string) => void;
    onSaveCrop: (id: string, croppedBlob: Blob) => void;
    saving: boolean;
}

// Canvas-based image cropping
const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area
): Promise<Blob> => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = reject;
        image.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
            "image/jpeg",
            0.92 // JPEG quality 92%
        );
    });
};

const PhotoEditDialog = ({
    photo,
    imageUrl,
    open,
    onOpenChange,
    onSaveDetails,
    onSaveCrop,
    saving,
}: PhotoEditDialogProps) => {
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [activeTab, setActiveTab] = useState("details");

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen && photo) {
            setEditTitle(photo.title);
            setEditCategory(photo.category);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setActiveTab("details");
        }
        onOpenChange(isOpen);
    };

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSaveCrop = async () => {
        if (!photo || !croppedAreaPixels) return;
        try {
            const blob = await createCroppedImage(imageUrl, croppedAreaPixels);
            onSaveCrop(photo.id, blob);
        } catch {
            // Error handled by parent
        }
    };

    if (!photo) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
                <div className="p-8 pb-0">
                    <DialogHeader className="mb-6 text-left">
                        <DialogTitle>Edit Photo</DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="crop">
                                <Crop className="h-3.5 w-3.5 mr-2" />
                                Crop
                            </TabsTrigger>
                        </TabsList>

                        {/* Details Tab */}
                        <TabsContent value="details" className="space-y-6 mt-8">
                            <div className="aspect-[4/3] overflow-hidden bg-muted">
                                <img 
                                    src={imageUrl} 
                                    alt={photo.title} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-title">Photo Title</Label>
                                    <Input
                                        id="edit-title"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select value={editCategory} onValueChange={setEditCategory}>
                                        <SelectTrigger id="edit-category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                onClick={() => onSaveDetails(photo.id, editTitle, editCategory)}
                                disabled={saving || !editTitle || !editCategory}
                                className="w-full"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : "Update Details"}
                            </Button>
                        </TabsContent>

                        {/* Crop Tab */}
                        <TabsContent value="crop" className="space-y-6 mt-8">
                            <div className="relative w-full aspect-square bg-muted/30">
                                <Cropper
                                    image={imageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Zoom Level</Label>
                                    <span>{zoom.toFixed(1)}x</span>
                                </div>
                                <Slider
                                    value={[zoom]}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onValueChange={([v]) => setZoom(v)}
                                />
                            </div>
                            <Button
                                onClick={handleSaveCrop}
                                disabled={saving}
                                className="w-full"
                            >
                                <Crop className="h-4 w-4 mr-2" />
                                {saving ? "Processing..." : "Apply Crop"}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PhotoEditDialog;
export { CATEGORIES };
```

---

## 8. Displaying Uploaded Images (Portfolio Page)

### `src/components/PortfolioSection.tsx`

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
};

const PortfolioSection = () => {
    const [active, setActive] = useState("All");

    const { data: photosData } = useQuery({
        queryKey: ["portfolio-photos-home", active],
        queryFn: async () => {
            let query = supabase
                .from("photos")
                .select("*", { count: "exact" })
                .order("sort_order", { ascending: true })
                .range(0, 19); // Limit to 20 photos

            if (active !== "All") {
                query = query.eq("category", active);
            }

            const { data, error, count } = await query;
            if (error) throw error;

            return {
                photos: data.map((p) => ({
                    id: p.id,
                    src: getPublicUrl(p.storage_path),
                    category: p.category,
                    title: p.title,
                })),
                totalCount: count || 0
            };
        },
    });

    const dbPhotos = photosData?.photos || [];

    return (
        <section>
            <h2>Portfolio</h2>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-12">
                {["All", "Weddings", "Portraits", "Events", "Lifestyle"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`px-5 py-2 ${
                            active === cat
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dbPhotos.map((photo) => (
                    <div key={photo.id} className="group cursor-pointer">
                        <div className="relative h-full w-full overflow-hidden">
                            <img
                                src={photo.src}
                                alt={photo.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                                <div className="p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm uppercase">{photo.category}</p>
                                    <p className="text-white text-xl mt-1">{photo.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PortfolioSection;
```

---

## 9. Complete Upload Flow (Step-by-Step)

### User Flow:
1. User navigates to Admin page (requires authentication)
2. User selects a **category** from dropdown
3. User selects **image files** via file picker (accepts `image/*`, multiple allowed)
4. **Previews render** with auto-generated titles (filename minus extension)
5. User can **edit titles** inline for each preview
6. User clicks **"Publish to Portfolio"** button

### Technical Flow:
1. **Validation**: Check files exist, category selected, all titles non-empty
2. **For each file** (in parallel via `Promise.all`):
   - Generate unique path: `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
   - Upload to Supabase Storage bucket `portfolio` at that path with `contentType: file.type`
   - Insert row into `photos` table with `title`, `category`, `storage_path`, `sort_order`
3. **On success**: 
   - Invalidate query caches
   - Reset form
   - Show success toast
4. **On error**: Show error toast, files remain in queue

---

## 10. Image Cropping Flow

1. User clicks "Edit" on a photo
2. Dialog opens with two tabs: **Details** and **Crop**
3. In **Crop tab**:
   - Interactive cropper with `react-easy-crop`
   - Zoom slider (1x-3x)
   - 4:3 aspect ratio enforced
4. User adjusts crop area and clicks "Apply Crop"
5. **Canvas-based processing**:
   - Load image with `crossOrigin = "anonymous"`
   - Draw cropped region to HTML Canvas
   - Export as JPEG Blob (92% quality)
6. **Upload new file**:
   - Upload cropped blob as new file to Supabase Storage
   - Update database `storage_path` to point to new file
   - Delete old file from storage

---

## 11. Image Display Flow

1. Query Supabase `photos` table ordered by `sort_order`
2. For each photo record:
   - Call `getPublicUrl(storage_path)` to get public URL
   - URL format: `https://your-project.supabase.co/storage/v1/object/public/portfolio/{path}`
3. Display using `<img>` tag with `object-cover` for sizing
4. Use `loading="lazy"` for performance

---

## 12. Delete Flow

```tsx
const deleteMutation = useMutation({
    mutationFn: async ({ id, storage_path }: { id: string; storage_path: string }) => {
        // 1. Remove from storage
        await supabase.storage.from("portfolio").remove([storage_path]);
        // 2. Remove from database
        const { error } = await supabase.from("photos").delete().eq("id", id);
        if (error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
        queryClient.invalidateQueries({ queryKey: ["portfolio-photos"] });
        toast.success("Photo deleted");
    },
});
```

---

## 13. Drag-and-Drop Reordering

```tsx
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);

const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(photos, oldIndex, newIndex);

    // Optimistic update
    queryClient.setQueryData(["admin-photos"], reordered);
    
    // Persist to database
    reorderMutation.mutate(reordered);
}, [photos, queryClient]);

// In JSX:
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    <SortableContext items={photos.map(p => p.id)}>
        {photos.map(photo => <SortablePhoto key={photo.id} photo={photo} />)}
    </SortableContext>
</DndContext>
```

---

## 14. Required UI Components (shadcn/ui)

This implementation uses the following shadcn/ui components:
- Button
- Input
- Card, CardContent
- Dialog, DialogContent, DialogHeader, DialogTitle
- Tabs, TabsContent, TabsList, TabsTrigger
- Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- Slider
- Label

Install shadcn/ui:
```bash
npx shadcn@latest init
npx shadcn@latest add button input card dialog tabs select slider label
```

---

## 15. Supabase Row Level Security (RLS) Policies

In your Supabase dashboard, set up these policies for the `photos` table:

### Select Policy (anyone can read)
```sql
CREATE POLICY "Photos are viewable by everyone"
ON photos FOR SELECT
USING (true);
```

### Insert Policy (authenticated users only)
```sql
CREATE POLICY "Photos can be inserted by authenticated users"
ON photos FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Update Policy (authenticated users only)
```sql
CREATE POLICY "Photos can be updated by authenticated users"
ON photos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```

### Delete Policy (authenticated users only)
```sql
CREATE POLICY "Photos can be deleted by authenticated users"
ON photos FOR DELETE
TO authenticated
USING (true);
```

For the Storage bucket, set similar policies in the Storage > Policies section.

---

## 16. Summary Checklist for Implementation

- [ ] Install required dependencies
- [ ] Set up Supabase project
- [ ] Create `portfolio` storage bucket (public)
- [ ] Create `photos` database table
- [ ] Configure RLS policies
- [ ] Set up environment variables
- [ ] Create Supabase client
- [ ] Implement upload component with file preview
- [ ] Implement upload mutation
- [ ] Implement delete mutation
- [ ] Implement photo edit dialog with crop
- [ ] Implement portfolio display component
- [ ] Add drag-and-drop reordering (optional)
- [ ] Add authentication for admin access

---

## 17. Key Points to Remember

1. **No server-side code needed** - Everything runs client-side through Supabase SDK
2. **File naming** - Use timestamp + random string to avoid collisions
3. **Parallel uploads** - Use `Promise.all` for multiple files
4. **Content-Type** - Always set `contentType: file.type` during upload
5. **Public URLs** - Use `getPublicUrl()` for display, no authentication required
6. **Crop output** - Canvas-based, exports as JPEG at 92% quality
7. **Optimistic updates** - Update UI immediately, then persist to DB
8. **Query invalidation** - Refresh caches after mutations
9. **Error handling** - Show toast notifications for user feedback

---

## 18. Adapting to Another Application

To use this in another app:

1. **Copy these files**:
   - Supabase client setup
   - TypeScript types
   - Upload component
   - Photo edit dialog
   - Portfolio display component

2. **Configure your Supabase**:
   - Create storage bucket
   - Create database table
   - Set up RLS policies

3. **Update environment variables** with your Supabase credentials

4. **Customize**:
   - Categories to match your use case
   - UI styling to match your design
   - Aspect ratios and crop settings
   - File size limits (in Supabase bucket settings)

---

**End of Implementation Guide**
