import { motion, useMotionValue, useTransform, animate, useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import aboutImg from "@/assets/about-photographer.jpg";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useMotionValueEvent(rounded, "change", (latest) => {
        setDisplayValue(latest);
    });

    useEffect(() => {
        if (inView) {
            animate(count, value, { duration: 2, ease: "easeOut" });
        }
    }, [inView, value, count]);

    return (
        <motion.p ref={ref} className="font-display text-3xl text-foreground">
            {displayValue}
            {suffix}
        </motion.p>
    );
};

const AboutSection = () => {
    return (
        <section id="about" className="section-padding bg-secondary">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <img
                        src={aboutImg}
                        alt="Senet Ryan - Photographer"
                        loading="lazy"
                        width={800}
                        height={1000}
                        className="w-full max-w-md mx-auto md:max-w-none object-cover"
                    />
                    <div className="absolute -bottom-4 -right-4 w-full h-full border border-foreground/10 -z-10" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
                        About Me
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
                        Hello, I'm <span className="italic">San</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                        <p>
                            With over a decade of experience capturing life's most precious
                            moments, I bring a fine art sensibility to every shoot. My work is
                            defined by natural light, authentic emotion, and timeless
                            composition.
                        </p>
                        <p>
                            Based in New York, I travel worldwide for destination weddings and
                            editorial assignments. My approach is unobtrusive and
                            documentary—I believe the best photographs happen when people
                            forget the camera is there.
                        </p>
                        <p>
                            Every session is a collaboration. I take the time to understand
                            your story, your style, and the feeling you want to remember
                            forever.
                        </p>
                    </div>
                    <div className="flex gap-12 mt-8">
                        <div>
                            <Counter value={12} suffix="+" />
                            <p className="text-sm text-muted-foreground tracking-wide uppercase mt-1">
                                Years Experience
                            </p>
                        </div>
                        <div>
                            <Counter value={500} suffix="+" />
                            <p className="text-sm text-muted-foreground tracking-wide uppercase mt-1">
                                Sessions
                            </p>
                        </div>
                        <div>
                            <Counter value={15} />
                            <p className="text-sm text-muted-foreground tracking-wide uppercase mt-1">
                                Awards
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
