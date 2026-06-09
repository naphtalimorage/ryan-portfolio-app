import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "How far in advance should I book?",
        a: "For weddings, I recommend booking 8–12 months ahead, especially for peak season (May–October). Portrait and event sessions can often be booked 2–4 weeks in advance, depending on availability.",
    },
    {
        q: "How long until I receive my photos?",
        a: "Wedding galleries are delivered within 4–6 weeks. Portrait sessions take 2–3 weeks, and events are delivered within 1–2 weeks. A sneak peek of 10–15 images is shared within 48 hours.",
    },
    {
        q: "Do you travel for destination shoots?",
        a: "Absolutely! I'm based in New York but travel worldwide for destination weddings and editorial shoots. Travel fees are quoted on a case-by-case basis and include flights, accommodation, and a travel day fee.",
    },
    {
        q: "What happens if there's bad weather?",
        a: "Some of my favourite images have been captured in overcast or rainy conditions — soft light creates stunning portraits. For outdoor sessions, we can reschedule once at no extra cost if the weather is severe.",
    },
    {
        q: "Can I get the raw, unedited files?",
        a: "I don't provide RAW files as they're unfinished work. Every image is professionally edited to ensure a cohesive, polished gallery that represents my artistic vision and your story.",
    },
    {
        q: "Do you offer prints and albums?",
        a: "Yes! I partner with premium print labs to offer fine art prints, canvas wraps, and handcrafted albums. A la carte pricing is available, and wedding packages include a 30-page album.",
    },
];

const FAQSection = () => {
    return (
        <section id="faq" className="section-padding bg-background">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">FAQ</p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                        Common <span className="italic">Questions</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="space-y-2">
                        {faqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`faq-${i}`}
                                className="border border-border px-6 data-[state=open]:bg-secondary/50 transition-colors"
                            >
                                <AccordionTrigger className="text-left font-display text-lg text-foreground hover:no-underline py-5">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground font-light leading-relaxed pb-5">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
