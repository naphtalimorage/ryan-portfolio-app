import { motion } from "framer-motion";
import { Play } from "lucide-react";

const reels = [
    {
        title: "Behind the Scenes: Serengeti Expedition",
        thumbnail: "https://images.unsplash.com/photo-1516422317963-3977f10b2a4c?q=80&w=2070&auto=format&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        duration: "02:45",
    },
    {
        title: "Highlight Reel: Kenya Coast Weddings",
        thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        duration: "03:15",
    },
    {
        title: "Wildlife Photography Masterclass BTS",
        thumbnail: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=2074&auto=format&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        duration: "01:50",
    }
];

const VideoReelSection = () => {
    return (
        <section id="video-reel" className="section-padding bg-secondary/20">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Behind the Lens</p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                        Video <span className="italic">Showreel</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reels.map((reel, i) => (
                        <motion.div
                            key={reel.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="group relative aspect-video overflow-hidden bg-background cursor-pointer shadow-lg"
                        >
                            <img
                                src={reel.thumbnail}
                                alt={reel.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                </div>
                                <div className="absolute bottom-6 left-6 right-6 text-left transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">{reel.duration}</p>
                                    <h3 className="text-white font-display text-lg leading-tight">{reel.title}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VideoReelSection;
