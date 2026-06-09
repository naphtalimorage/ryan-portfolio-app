// import { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import beforeImg from "@/assets/hero-2.jpg"; // Using existing images as examples
// import afterImg from "@/assets/hero-1.jpg";
//
// const ComparisonSlider = () => {
//     const [sliderPosition, setSliderPosition] = useState(50);
//     const [isDragging, setIsDragging] = useState(false);
//     const containerRef = useRef<HTMLDivElement>(null);
//
//     const handleMove = (clientX: number) => {
//         if (!containerRef.current) return;
//         const rect = containerRef.current.getBoundingClientRect();
//         const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
//         const percentage = (x / rect.width) * 100;
//         setSliderPosition(percentage);
//     };
//
//     const onMouseMove = (e: React.MouseEvent) => {
//         if (!isDragging) return;
//         handleMove(e.clientX);
//     };
//
//     const onTouchMove = (e: React.TouchEvent) => {
//         if (!isDragging) return;
//         handleMove(e.touches[0].clientX);
//     };
//
//     useEffect(() => {
//         const handleUp = () => setIsDragging(false);
//         window.addEventListener("mouseup", handleUp);
//         window.addEventListener("touchend", handleUp);
//         return () => {
//             window.removeEventListener("mouseup", handleUp);
//             window.removeEventListener("touchend", handleUp);
//         };
//     }, []);
//
//     return (
//         <section className="section-padding bg-secondary/30">
//             <div className="max-w-5xl mx-auto px-6">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.8 }}
//                     className="text-center mb-12"
//                 >
//                     <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Editing Process</p>
//                     <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
//                         Before & <span className="italic">After</span>
//                     </h2>
//                     <p className="mt-4 text-muted-foreground font-light max-w-2xl mx-auto">
//                         A glimpse into the meticulous editing process that brings out the soul and story in every frame.
//                         Drag the slider to see the transformation.
//                     </p>
//                 </motion.div>
//
//                 <div
//                     ref={containerRef}
//                     className="relative aspect-[16/9] w-full overflow-hidden rounded-none cursor-ew-resize select-none shadow-2xl"
//                     onMouseDown={() => setIsDragging(true)}
//                     onTouchStart={() => setIsDragging(true)}
//                     onMouseMove={onMouseMove}
//                     onTouchMove={onTouchMove}
//                 >
//                     {/* After Image (Background) */}
//                     <img
//                         src={afterImg}
//                         alt="After edit"
//                         className="absolute inset-0 w-full h-full object-cover"
//                     />
//
//                     {/* Before Image (Foreground with Clip) */}
//                     <div
//                         className="absolute inset-0 w-full h-full overflow-hidden"
//                         style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
//                     >
//                         <img
//                             src={beforeImg}
//                             alt="Before edit"
//                             className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]"
//                         />
//                     </div>
//
//                     {/* Slider Line & Handle */}
//                     <div
//                         className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
//                         style={{ left: `${sliderPosition}%` }}
//                     >
//                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white/20">
//                             <div className="flex gap-1">
//                                 <div className="w-0.5 h-4 bg-foreground/20 rounded-full" />
//                                 <div className="w-0.5 h-4 bg-foreground/20 rounded-full" />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Labels */}
//                     <div className="absolute bottom-6 left-6 z-20 px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] uppercase tracking-widest pointer-events-none">
//                         Original
//                     </div>
//                     <div className="absolute bottom-6 right-6 z-20 px-3 py-1 bg-white/40 backdrop-blur-md text-foreground text-[10px] uppercase tracking-widest pointer-events-none">
//                         Edited
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };
//
// export default ComparisonSlider;


import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import beforeImg from "@/assets/before-edit.jpg";
import afterImg from "@/assets/after-edit.jpg";

const BeforeAfterSection = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const updatePosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    }, []);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        isDragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updatePosition(e.clientX);
    }, [updatePosition]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current) return;
        updatePosition(e.clientX);
    }, [updatePosition]);

    const handlePointerUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    return (
        <section className="section-padding bg-secondary">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
                        The Process
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                        Before & <span className="italic">After</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-light">
                        Every image is carefully edited to bring out its full potential while maintaining a natural, timeless look.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <div
                        ref={containerRef}
                        className="relative aspect-[4/5] overflow-hidden cursor-col-resize select-none touch-none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        {/* After (bottom layer) */}
                        <img
                            src={afterImg}
                            alt="After editing"
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable={false}
                        />

                        {/* Before (clipped layer) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${sliderPos}%` }}
                        >
                            <img
                                src={beforeImg}
                                alt="Before editing"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
                                draggable={false}
                            />
                        </div>

                        {/* Slider line */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
                            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-900">
                                    <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Labels */}
                        <span className="absolute top-4 left-4 text-xs tracking-widest uppercase bg-black/40 text-white px-3 py-1 backdrop-blur-sm z-20">
              Before
            </span>
                        <span className="absolute top-4 right-4 text-xs tracking-widest uppercase bg-black/40 text-white px-3 py-1 backdrop-blur-sm z-20">
              After
            </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BeforeAfterSection;

