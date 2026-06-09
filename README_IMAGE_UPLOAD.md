# 📸 Image Upload System - Extracted Implementation

This directory contains the **complete image upload implementation** extracted from a React + Supabase portfolio application. You can use these files to add the same image upload functionality to another application.

---

## 📦 What's Included

### 📄 Documentation Files

| File | Purpose |
|------|---------|
| **`IMAGE_UPLOAD_IMPLEMENTATION_GUIDE.md`** | Complete technical documentation with all code, architecture details, and implementation specifics |
| **`QUICK_START_GUIDE.md`** | Step-by-step checklist to get you up and running in under an hour |
| **`SUPABASE_SETUP.sql`** | SQL scripts to set up the database and storage policies |

### 💻 Component Files

| File | Purpose |
|------|---------|
| **`IMAGE_UPLOAD_COMPONENT.tsx`** | Standalone, reusable image upload component with file preview, category selection, and upload functionality |
| **`PORTFOLIO_DISPLAY_COMPONENT.tsx`** | Portfolio gallery component with category filtering, lightbox, and responsive grid layout |

---

## 🚀 Quick Start

### Minimum Setup (30 minutes)

1. **Install dependencies:**
   ```bash
   npm install @supabase/supabase-js @tanstack/react-query sonner lucide-react
   ```

2. **Set up Supabase:**
   - Create a project at https://supabase.com
   - Run the SQL from `SUPABASE_SETUP.sql`
   - Create a public storage bucket named `portfolio`

3. **Copy components:**
   - Copy `IMAGE_UPLOAD_COMPONENT.tsx` → your project
   - Copy `PORTFOLIO_DISPLAY_COMPONENT.tsx` → your project
   - Update import paths

4. **Use the components:**
   ```tsx
   import { ImageUpload } from '@/components/ImageUpload';
   import { PortfolioDisplay } from '@/components/PortfolioDisplay';
   ```

👉 **Follow the complete checklist in `QUICK_START_GUIDE.md`**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│                                                          │
│  ┌──────────────────┐       ┌──────────────────────┐    │
│  │  ImageUpload     │       │  PortfolioDisplay    │    │
│  │  Component       │       │  Component           │    │
│  │                  │       │                      │    │
│  │  - File picker   │       │  - Category filter   │    │
│  │  - Preview       │       │  - Photo grid        │    │
│  │  - Upload        │       │  - Lightbox          │    │
│  │  - Delete        │       │  - Lazy loading      │    │
│  └────────┬─────────┘       └──────────┬───────────┘    │
│           │                             │                 │
└───────────┼─────────────────────────────┼─────────────────┘
            │                             │
            │  Supabase JS SDK            │
            │                             │
            ▼                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase (BaaS)                        │
│                                                          │
│  ┌──────────────────┐       ┌──────────────────────┐    │
│  │  Storage Bucket  │       │  Database Table      │    │
│  │  (portfolio)     │       │  (photos)            │    │
│  │                  │       │                      │    │
│  │  - Image files   │◄─────►│  - title             │    │
│  │  - Public URLs   │       │  - category          │    │
│  │                  │       │  - storage_path      │    │
│  │                  │       │  - sort_order        │    │
│  └──────────────────┘       └──────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### Upload Component
- ✅ Multi-file selection with drag & drop
- ✅ Real-time image previews
- ✅ Inline title editing
- ✅ Category selection
- ✅ Parallel uploads (Promise.all)
- ✅ Progress indicators
- ✅ Toast notifications
- ✅ Delete functionality
- ✅ Automatic sort order management

### Portfolio Display
- ✅ Responsive grid layout
- ✅ Category filtering
- ✅ Lightbox with keyboard navigation
- ✅ Lazy loading for performance
- ✅ Hover effects with metadata
- ✅ Loading and empty states
- ✅ Total count display

### Optional (in original project)
- 🖼️ Image cropping with `react-easy-crop`
- 🔄 Drag-and-drop reordering with `@dnd-kit`
- ♾️ Infinite scroll with React Query
- 🔐 Authentication for admin access

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Backend:** Supabase (Storage + Database)
- **State Management:** React Query (TanStack Query)
- **UI Components:** shadcn/ui + Tailwind CSS
- **Icons:** lucide-react
- **Notifications:** sonner
- **Image Cropping:** react-easy-crop (optional)
- **Drag & Drop:** @dnd-kit (optional)

---

## 📋 Database Schema

```sql
CREATE TABLE photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔑 Key Implementation Details

### Upload Flow
1. User selects category
2. User selects image files
3. Previews render with auto-generated titles
4. User can edit titles inline
5. Click "Upload" → parallel uploads via Promise.all
6. Each file: upload to storage → insert to database
7. Success → invalidate cache, reset form, show toast

### Image Storage
- **Bucket name:** `portfolio` (public)
- **File naming:** `{timestamp}-{random}.{ext}`
- **Content-Type:** Preserved from original file
- **URL generation:** `getPublicUrl()` (no auth required)

### Image Display
- Query database ordered by `sort_order`
- Generate public URLs for each image
- Display with lazy loading
- Optional lightbox with keyboard navigation

---

## 📚 File Dependencies

### To use `IMAGE_UPLOAD_COMPONENT.tsx`, you need:
- Supabase client setup
- React Query provider
- Toast provider (sonner)
- UI components: Button, Input, Card
- Icons: lucide-react

### To use `PORTFOLIO_DISPLAY_COMPONENT.tsx`, you need:
- Everything above, plus:
- Icons: X, ChevronLeft, ChevronRight

---

## 🎨 Customization Guide

### Change Categories
```tsx
<ImageUpload 
  categories={['Nature', 'Architecture', 'Street', 'Food']}
/>
```

### Change Bucket Name
```tsx
<ImageUpload 
  bucketName="my-custom-bucket"
/>
```

### Adjust Grid Layout
In `PortfolioDisplay.tsx`, modify:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Change to your preferred grid */}
</div>
```

### Change Aspect Ratio
```tsx
<img className="aspect-[4/3]" />  // Change to aspect-[16/9], aspect-square, etc.
```

---

## 🔒 Security Considerations

### RLS Policies (Row Level Security)
- **Select:** Anyone can view photos
- **Insert/Update/Delete:** Authenticated users only

### Storage Policies
- **Read:** Public (no auth required)
- **Write/Delete:** Authenticated users only

### Recommendations for Production
- [ ] Set file size limits in Supabase bucket settings
- [ ] Restrict allowed MIME types
- [ ] Add authentication for admin routes
- [ ] Implement image compression before upload
- [ ] Add rate limiting for uploads
- [ ] Use Supabase Edge Functions for server-side validation

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Upload fails with "permission denied" | Check RLS policies are set correctly |
| Images not displaying | Verify bucket is public |
| CORS errors | Check Supabase URL in env variables |
| Query not updating | Ensure `invalidateQueries` is called |
| File upload timeout | Check file size limits in bucket settings |

---

## 📖 Additional Resources

- **Complete Guide:** `IMAGE_UPLOAD_IMPLEMENTATION_GUIDE.md`
- **Quick Setup:** `QUICK_START_GUIDE.md`
- **SQL Setup:** `SUPABASE_SETUP.sql`
- **Supabase Docs:** https://supabase.com/docs
- **React Query:** https://tanstack.com/query/latest

---

## ✨ What's Next?

1. Follow the `QUICK_START_GUIDE.md` to set up in your project
2. Customize the components to match your design
3. Add optional features (cropping, drag-and-drop, etc.)
4. Test thoroughly
5. Deploy!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section in `QUICK_START_GUIDE.md`
2. Refer to the complete implementation guide for detailed code
3. Check Supabase logs for backend errors
4. Verify your environment variables are correct

---

**Happy coding! 🚀**
