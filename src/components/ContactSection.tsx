import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Thank you! I'll get back to you within 24 hours.");
        setForm({ name: "", email: "", phone: "", message: "" });
        setLoading(false);
    };

    return (
        <section id="contact" className="section-padding bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-foreground/[0.02] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Header/Info Column */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Inquiry</p>
                            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-8 leading-tight">
                                Let's <span className="italic">Begin</span> <br />
                                Your Story
                            </h2>
                            <p className="text-muted-foreground font-light leading-relaxed max-w-md text-lg">
                                Ready to create something timeless? I'd love to hear about your
                                vision. Reach out and let's start planning your perfect session.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-10"
                        >
                            <div className="group flex items-start gap-6">
                                <div className="p-3 bg-foreground/[0.03] group-hover:bg-foreground/[0.06] transition-colors">
                                    <Mail size={18} className="text-foreground" strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">Email</p>
                                    <p className="text-foreground font-light text-lg">Sanarerarin@gmail.com</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-6">
                                <div className="p-3 bg-foreground/[0.03] group-hover:bg-foreground/[0.06] transition-colors">
                                    <Phone size={18} className="text-foreground" strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">Phone</p>
                                    <p className="text-foreground font-light text-lg">+254 944 133-96 </p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-6">
                                <div className="p-3 bg-foreground/[0.03] group-hover:bg-foreground/[0.06] transition-colors">
                                    <MapPin size={18} className="text-foreground" strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">Based in</p>
                                    <p className="text-foreground font-light text-lg">New York City · Worldwide</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-secondary p-8 md:p-12"
                        >
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium group-focus-within:text-foreground transition-colors">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Jane Doe"
                                            required
                                            maxLength={100}
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-all duration-300"
                                        />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium group-focus-within:text-foreground transition-colors">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="jane@example.com"
                                            required
                                            maxLength={255}
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium group-focus-within:text-foreground transition-colors">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        maxLength={20}
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-all duration-300"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium group-focus-within:text-foreground transition-colors">Message</label>
                                    <Textarea
                                        placeholder="Tell me about your session, date, or any questions you might have..."
                                        required
                                        maxLength={1000}
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-all duration-300 resize-none rounded-none border-t-0 border-l-0 border-r-0 px-0"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-none tracking-widest uppercase text-xs group transition-all"
                                    >
                                        {loading ? "Sending..." : (
                                            <span className="flex items-center gap-3">
                                                Send Inquiry
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground italic mt-4 text-center tracking-wider">
                                        I typically respond within 24 hours of receiving your message.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
