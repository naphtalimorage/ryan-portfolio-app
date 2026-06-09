/**
 * PORTFOLIO DISPLAY COMPONENT - STANDALONE VERSION
 * 
 * This component displays uploaded images in a responsive grid with:
 * - Category filtering
 * - Lightbox with keyboard navigation
 * - Lazy loading
 * - Hover effects
 * 
 * Copy this file to your project along with:
 * - ImageUpload component
 * - Supabase client setup
 * - Required dependencies
 */

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getPhotoUrl } from "./ImageUpload";

// ========================================
// TYPES
// ========================================
interface Photo {
    id: string;
    src: string;
    category: string;
    title: string;
}

interface PortfolioDisplayProps {
    /**
     * List of categories to display as filters
     */
    categories?: string[];
    /**
     * Maximum number of photos to display (default: 20)
     */
    maxPhotos?: number;
    /**
     * Supabase storage bucket name (default: "portfolio")
     */
    bucketName?: string;
    /**
     * Enable lightbox on click (default: true)
     */
    enableLightbox?: boolean;
    /**
     * Show category filters (default: true)
     */
    showFilters?: boolean;
}

// ========================================
// MAIN COMPONENT
// ========================================
const PortfolioDisplay = ({
    categories = ["All", "Weddings", "Portraits", "Events", "Lifestyle"],
    maxPhotos = 20,
    bucketName = "portfolio",
    enableLightbox = true,
    showFilters = true,
}: PortfolioDisplayProps) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Fetch photos from Supabase
    const { data: photosData, isLoading } = useQuery({
        queryKey: ["portfolio-photos", activeCategory],
        queryFn: async () => {
            let query = supabase
                .from("photos")
                .select("*", { count: "exact" })
                .order("sort_order", { ascending: true })
                .range(0, maxPhotos - 1);

            if (activeCategory !== "All") {
                query = query.eq("category", activeCategory);
            }

            const { data, error, count } = await query;
            if (error) throw error;

            return {
                photos: data.map((p) => ({
                    id: p.id,
                    src: getPhotoUrl(p.storage_path, bucketName),
                    category: p.category,
                    title: p.title,
                })) as Photo[],
                totalCount: count || 0
            };
        },
    });

    const photos = photosData?.photos || [];

    // Lightbox navigation
    const nextImage = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) => (prev! + 1) % photos.length);
        }
    }, [lightboxIndex, photos.length]);

    const prevImage = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) => (prev! - 1 + photos.length) % photos.length);
        }
    }, [lightboxIndex, photos.length]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") setLightboxIndex(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, nextImage, prevImage]);

    return (
        <div className="space-y-8">
            {/* Category Filters */}
            {showFilters && (
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-sm tracking-widest uppercase px-5 py-2 transition-all duration-300 rounded ${
                                activeCategory === cat
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="aspect-[4/3] bg-muted animate-pulse rounded"
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && photos.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground italic">
                        No photos available in this category yet.
                    </p>
                </div>
            )}

            {/* Photo Grid */}
            {!isLoading && photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <div
                            key={photo.id}
                            className={`group cursor-pointer overflow-hidden rounded-lg ${
                                enableLightbox ? "hover:shadow-lg transition-shadow" : ""
                            }`}
                            onClick={() => enableLightbox && setLightboxIndex(index)}
                        >
                            <div className="relative h-full w-full overflow-hidden aspect-[4/3]">
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                                    <div className="p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <p className="text-white text-sm uppercase tracking-widest">
                                            {photo.category}
                                        </p>
                                        <p className="text-white text-xl mt-1 font-light">
                                            {photo.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Total Count */}
            {photosData?.totalCount && photosData.totalCount > maxPhotos && (
                <div className="text-center text-sm text-muted-foreground">
                    Showing {photos.length} of {photosData.totalCount} photos
                </div>
            )}

            {/* Lightbox */}
            {enableLightbox && lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(null);
                        }}
                    >
                        <X size={32} strokeWidth={1.5} />
                    </button>

                    {/* Previous Button */}
                    <button
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                    >
                        <ChevronLeft size={48} strokeWidth={1} />
                    </button>

                    {/* Next Button */}
                    <button
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                    >
                        <ChevronRight size={48} strokeWidth={1} />
                    </button>

                    {/* Image */}
                    <div
                        className="relative max-w-5xl w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={photos[lightboxIndex]?.src}
                            alt={photos[lightboxIndex]?.title}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                        />

                        {/* Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-white/70 text-xs uppercase tracking-widest mb-1">
                                {photos[lightboxIndex]?.category} — {lightboxIndex + 1} / {photos.length}
                            </p>
                            <h3 className="text-white text-2xl font-light">
                                {photos[lightboxIndex]?.title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioDisplay;
