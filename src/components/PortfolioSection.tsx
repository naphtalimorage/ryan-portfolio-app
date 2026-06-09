import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/intergration/supabase/client.ts";

// Fallback static images
import weddingImg from "@/assets/#maasai #kenya #wedding.jpg";
import portraitImg from "@/assets/Tanzania.jpg";
import eventImg from "@/assets/maasai.jpg";
import lifestyleImg from "@/assets/jungle.jpg";
import hero1 from "@/assets/lake.jpg";
import hero2 from "@/assets/tribe.jpg";
import hero3 from "@/assets/safari.jpg";

const categories = ["All", "Weddings", "Portraits", "Events", "Lifestyle"];

const fallbackPhotos = [
    { id: 1, src: weddingImg, category: "Weddings", title: "Garden Ceremony" },
    { id: 2, src: portraitImg, category: "Portraits", title: "Studio Light" },
    { id: 3, src: eventImg, category: "Events", title: "Gala Night" },
    { id: 4, src: lifestyleImg, category: "Lifestyle", title: "Café Morning" },
    { id: 5, src: hero1, category: "Weddings", title: "Lavender Fields" },
    { id: 6, src: hero2, category: "Portraits", title: "Golden Hour" },
    { id: 7, src: hero3, category: "Events", title: "Sunset Dinner" },
];

const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
};

const PortfolioSection = () => {
    const [active, setActive] = useState("All");
    const [lightbox, setLightbox] = useState<number | null>(null);

    const { data: photosData } = useQuery({
        queryKey: ["portfolio-photos-home", active],
        queryFn: async () => {
            let query = supabase
                .from("photos")
                .select("*", { count: "exact" })
                .order("sort_order", { ascending: true })
                .range(0, 19);

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
    const totalCount = photosData?.totalCount || 0;
    const photos = dbPhotos.length > 0 ? dbPhotos : fallbackPhotos.filter(p => active === "All" || p.category === active);

    const nextImage = useCallback(() => {
        if (lightbox !== null) {
            setLightbox((prev) => (prev! + 1) % photos.length);
        }
    }, [lightbox, photos.length]);

    const prevImage = useCallback(() => {
        if (lightbox !== null) {
            setLightbox((prev) => (prev! - 1 + photos.length) % photos.length);
        }
    }, [lightbox, photos.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightbox === null) return;
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") setLightbox(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightbox, nextImage, prevImage]);

    return (
        <section id="portfolio" className="section-padding bg-background">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Portfolio</p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                        A Glimpse Of My <span className="italic">Lens</span>
                    </h2>
                </motion.div>

                {/* Category filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`text-sm tracking-widest uppercase px-5 py-2 transition-all duration-300 ${
                                active === cat
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="w-full">
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] grid-flow-dense gap-4 mb-12">
                        <AnimatePresence mode="popLayout">
                            {photos.map((photo, i) => {
                                const isLeft = i % 2 === 0;
                                return (
                                    <motion.div
                                        key={photo.id || photo.title + i}
                                        layout
                                        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`group cursor-pointer overflow-hidden rounded-lg ${
                                            i % 6 === 0 ? "md:col-span-2 md:row-span-2" :
                                            i % 6 === 3 ? "md:col-span-1 md:row-span-2" :
                                            ""
                                        } aspect-[4/5] md:aspect-auto`}
                                        onClick={() => setLightbox(i)}
                                    >
                                        <div className="relative h-full w-full overflow-hidden">
                                            <img
                                                src={photo.src}
                                                alt={photo.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 transition-all duration-500 flex items-end">
                                                <div className="p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                    <p className="text-primary-foreground text-sm tracking-widest uppercase">
                                                        {photo.category}
                                                    </p>
                                                    <p className="text-primary-foreground font-display text-xl mt-1">
                                                        {photo.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                    
                    {/* View All Link */}
                    {totalCount > 20 && (
                        <div className="flex justify-center mt-12">
                            <Link 
                                to="/portfolio"
                                className="group inline-flex items-center gap-2 px-8 py-4 border border-foreground text-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300"
                            >
                                View Full Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
                        onClick={() => setLightbox(null)}
                    >
                        {/* Close button */}
                        <button 
                            className="absolute top-6 right-6 text-foreground hover:opacity-70 transition-opacity z-50"
                            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
                        >
                            <X size={32} strokeWidth={1.5} />
                        </button>

                        {/* Navigation Arrows */}
                        <button 
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors z-50 hidden md:block"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        >
                            <ChevronLeft size={48} strokeWidth={1} />
                        </button>
                        <button 
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors z-50 hidden md:block"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        >
                            <ChevronRight size={48} strokeWidth={1} />
                        </button>

                        <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <div className="relative w-full h-full flex items-center justify-center">
                                <motion.img
                                    key={lightbox}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    src={photos[lightbox]?.src}
                                    alt={photos[lightbox]?.title}
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                />
                            </div>

                            {/* Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    key={`info-${lightbox}`}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                                        {photos[lightbox]?.category} — {lightbox + 1} / {photos.length}
                                    </p>
                                    <h3 className="font-display text-2xl font-light text-foreground">
                                        {photos[lightbox]?.title}
                                    </h3>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioSection;
