# 🚀 Quick Start: Adding Image Upload to Your App

This checklist will guide you through implementing image upload functionality in your application.

---

## ✅ Step-by-Step Implementation Guide

### Phase 1: Setup (15 minutes)

#### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @tanstack/react-query react-easy-crop sonner lucide-react
```

**Optional (if using shadcn/ui components):**
```bash
npx shadcn@latest init
npx shadcn@latest add button input card dialog tabs select slider label
```

#### 2. Set Up Supabase Project
- [ ] Go to https://supabase.com and create a new project
- [ ] Wait for project to initialize (takes ~2 minutes)
- [ ] Copy your project credentials from Settings > API

#### 3. Configure Environment Variables
- [ ] Create `.env` file in your project root
- [ ] Add these variables:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
```

#### 4. Create Supabase Client
- [ ] Create directory: `src/integrations/supabase/`
- [ ] Create `client.ts` file (see `IMAGE_UPLOAD_IMPLEMENTATION_GUIDE.md` section 5)
- [ ] Create `types.ts` file (see guide section 4)

#### 5. Set Up Database
- [ ] Open Supabase SQL Editor
- [ ] Run the SQL from `SUPABASE_SETUP.sql` file
- [ ] Verify `photos` table exists in Table Editor

#### 6. Create Storage Bucket
- [ ] Go to Storage in Supabase dashboard
- [ ] Click "Create Bucket"
- [ ] Name: `portfolio`
- [ ] Public: **Yes** (toggle on)
- [ ] Click "Create"
- [ ] Add storage policies (from `SUPABASE_SETUP.sql`)

---

### Phase 2: Implementation (30 minutes)

#### 7. Copy Components to Your Project
- [ ] Copy `IMAGE_UPLOAD_COMPONENT.tsx` → `src/components/ImageUpload.tsx`
- [ ] Copy `PORTFOLIO_DISPLAY_COMPONENT.tsx` → `src/components/PortfolioDisplay.tsx`
- [ ] Copy `PhotoEditDialog.tsx` (from original project) → `src/components/dialog/PhotoEditDialog.tsx`

#### 8. Update Imports
- [ ] Open `ImageUpload.tsx`
- [ ] Update Supabase client import path to match your project structure
- [ ] Update UI component imports (Button, Input, Card) to match your setup
- [ ] Do the same for `PortfolioDisplay.tsx`

#### 9. Add QueryClient Provider
Wrap your app with QueryClientProvider (usually in `main.tsx` or `App.tsx`):

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

#### 10. Add Toast Provider
Add Toaster component to your app (usually in `App.tsx`):

```tsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* Your app */}
      <Toaster />
    </>
  );
}
```

---

### Phase 3: Integration (15 minutes)

#### 11. Use the Upload Component
Add to your admin/dashboard page:

```tsx
import { ImageUpload } from '@/components/ImageUpload';

function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ImageUpload 
        categories={['Weddings', 'Portraits', 'Events', 'Lifestyle']}
        maxFiles={10}
        onSuccess={() => console.log('Upload complete!')}
      />
    </div>
  );
}
```

#### 12. Use the Portfolio Display Component
Add to your public-facing page:

```tsx
import { PortfolioDisplay } from '@/components/PortfolioDisplay';

function PortfolioPage() {
  return (
    <div>
      <h1>My Portfolio</h1>
      <PortfolioDisplay 
        categories={['All', 'Weddings', 'Portraits', 'Events']}
        maxPhotos={20}
        enableLightbox={true}
      />
    </div>
  );
}
```

#### 13. Test the Upload Flow
- [ ] Navigate to your admin page
- [ ] Select a category from dropdown
- [ ] Click the upload area or drag images
- [ ] Verify previews appear with editable titles
- [ ] Edit a title to test inline editing
- [ ] Click "Upload" button
- [ ] Check for success toast
- [ ] Verify images appear in the gallery
- [ ] Check Supabase dashboard:
  - [ ] Files appear in Storage > portfolio bucket
  - [ ] Records appear in photos table

#### 14. Test the Display
- [ ] Navigate to your portfolio page
- [ ] Verify images load in the grid
- [ ] Test category filtering
- [ ] Click an image to open lightbox
- [ ] Test lightbox navigation:
  - [ ] Click left/right arrows
  - [ ] Use keyboard arrows
  - [ ] Press Escape to close
  - [ ] Click outside to close

#### 15. Test Delete
- [ ] Click delete button on a photo
- [ ] Confirm toast appears
- [ ] Verify photo removed from gallery
- [ ] Check Supabase:
  - [ ] File removed from storage
  - [ ] Record removed from database

---

### Phase 4: Customization (Optional)

#### 16. Adjust Categories
- [ ] Modify the `categories` prop in both components
- [ ] Update to match your use case

#### 17. Customize Styling
- [ ] Adjust grid layout (cols, gaps, aspect ratios)
- [ ] Modify hover effects
- [ ] Change lightbox appearance
- [ ] Update colors to match your theme

#### 18. Add Features
Optional enhancements:
- [ ] Add drag-and-drop reordering (use `@dnd-kit`)
- [ ] Add image cropping (use `react-easy-crop`)
- [ ] Add infinite scroll (use `useInfiniteQuery`)
- [ ] Add search functionality
- [ ] Add bulk delete
- [ ] Add image compression before upload
- [ ] Add progress indicators
- [ ] Add file size validation

#### 19. Configure Storage Settings
In Supabase Dashboard > Storage > portfolio bucket:
- [ ] Set file size limit (e.g., 10MB)
- [ ] Set allowed MIME types (image/jpeg, image/png, image/webp, etc.)
- [ ] Configure CDN if needed

---

## 🎯 Minimum Viable Implementation

If you want the **fastest possible implementation**, you only need:

1. ✅ Supabase project with storage bucket
2. ✅ `photos` table in database
3. ✅ Supabase client setup
4. ✅ `ImageUpload` component
5. ✅ `PortfolioDisplay` component
6. ✅ QueryClientProvider wrapper

**Total time: ~30 minutes**

---

## 📁 Files You Need

From this extracted package:

### **Required:**
- ✅ `IMAGE_UPLOAD_IMPLEMENTATION_GUIDE.md` - Complete documentation
- ✅ `IMAGE_UPLOAD_COMPONENT.tsx` - Upload component
- ✅ `PORTFOLIO_DISPLAY_COMPONENT.tsx` - Display component
- ✅ `SUPABASE_SETUP.sql` - Database setup

### **Optional (from original project):**
- `src/components/dialog/PhotoEditDialog.tsx` - If you want crop functionality
- `src/pages/Admin.tsx` - Full admin page example with drag-and-drop

---

## 🔧 Troubleshooting

### Upload fails with "permission denied"
- [ ] Check RLS policies are set correctly
- [ ] Verify you're using the anon key (not service role key)
- [ ] Make sure user is authenticated (if using auth)

### Images not displaying
- [ ] Verify storage bucket is public
- [ ] Check `getPublicUrl` is using correct bucket name
- [ ] Verify file paths match between storage and database

### CORS errors
- [ ] Check Supabase URL is correct in env variables
- [ ] Verify your app is running on localhost or added to allowed origins

### Query not updating after upload
- [ ] Make sure `queryClient.invalidateQueries` is called
- [ ] Check queryKey matches between upload and display components

---

## 📚 Additional Resources

- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- React Query Docs: https://tanstack.com/query/latest
- react-easy-crop: https://github.com/ValentinH/react-easy-crop
- dnd-kit: https://docs.dndkit.com

---

## ✨ You're Done!

Your image upload system should now be fully functional. 

**Next steps:**
1. Customize the styling to match your brand
2. Add any additional features you need
3. Test thoroughly with different image types and sizes
4. Deploy to production!

---

**Questions?** Refer to `IMAGE_UPLOAD_IMPLEMENTATION_GUIDE.md` for detailed explanations of each component.
