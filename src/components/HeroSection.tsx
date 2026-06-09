import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import  hero4 from "@/assets/Join the 10 days wildlife photograph safari….jpg"
import  hero6 from "@/assets/africa,wildlife,nature,african,sky,golden….jpg"
import  hero7 from "@/assets/Kenya safari guide_ 10 unforgettable wildlife….jpg"
import  hero8 from "@/assets/Leopard in the Golden Savannah 🐆🌾__Pin your….jpg"
import  hero9 from "@/assets/lake.jpg"
import  hero5 from "@/assets/maasai.jpg"

const slides = [
    { image: hero7, subtitle: "Kenya Safaris" },
    { image: hero5, subtitle: "Cultural Heritage " },
    { image: hero8, subtitle: "Leopard in the Golden Savannah" },
    { image: hero1, subtitle: "Weddings" },
    { image: hero4, subtitle: "Safaris" },
    { image: hero2, subtitle: "Portraits" },
    { image: hero6, subtitle: "Savannah Landscapes" },
    { image: hero9, subtitle: "Lake Manyara" },
    { image: hero3, subtitle: "Events" },
];

const HeroSection = () => {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
    const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const scrollTo = (id: string) => {
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-background">
            <AnimatePresence>
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={slides[current].image}
                        alt={slides[current].subtitle}
                        className="w-full h-full object-cover"
                        width={1920}
                        height={1080}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                <motion.p
                    key={`sub-${current}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-white/80 text-sm tracking-[0.3em] uppercase mb-4"
                >
                    {slides[current].subtitle}
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 1 }}
                    className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-light leading-tight"
                >
                    Capturing Timeless
                    <br />
                    <span className="italic">Moments</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-white/70 text-lg md:text-xl mt-6 max-w-lg font-light"
                >
                    Fine art photography for life's most meaningful moments
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 mt-10"
                >
                    <button
                        onClick={() => scrollTo("#contact")}
                        className="px-8 py-3 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-all duration-300"
                    >
                        Book a Session
                    </button>
                    <button
                        onClick={() => scrollTo("#portfolio")}
                        className="px-8 py-3 border border-white text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
                    >
                        View Portfolio
                    </button>
                </motion.div>
            </div>

            {/* Navigation arrows */}
            <button
                onClick={prev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors"
            >
                <ChevronLeft size={36} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors"
            >
                <ChevronRight size={36} />
            </button>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-12 h-0.5 transition-all duration-500 ${
                            i === current ? "bg-white" : "bg-white/30"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
