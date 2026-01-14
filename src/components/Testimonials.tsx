'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah Mitchell",
        role: "Wedding Coordinator",
        company: "Elegant Events Co.",
        text: "Etheleen & Alma's Dream transformed our wedding reception into an unforgettable culinary experience. Every dish was a masterpiece!",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "CEO",
        company: "TechVision Inc.",
        text: "For our annual gala, they delivered beyond expectations. The presentation was stunning and the flavors were extraordinary.",
        rating: 5
    },
    {
        name: "Jennifer Rodriguez",
        role: "Event Planner",
        company: "Premier Celebrations",
        text: "Working with this team is always a pleasure. They bring creativity, professionalism, and exceptional taste to every event.",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-secondary/20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-accent font-bold uppercase tracking-widest text-sm">Testimonials</span>
                    <h2 className="text-5xl md:text-6xl font-bold text-primary mt-4 mb-6">
                        Loved by <span className="text-gradient">Clients</span>
                    </h2>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our clients say about their experiences.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="glass p-8 rounded-3xl hover:shadow-2xl transition-all group border border-primary/10 hover:border-primary/30"
                        >
                            <div className="flex items-center gap-1 mb-6 text-amber-500">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>

                            <div className="relative mb-6">
                                <Quote size={40} className="text-accent/20 absolute -top-2 -left-2" />
                                <p className="text-foreground/80 leading-relaxed pl-8 italic">
                                    "{testimonial.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-primary/10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary text-xl">
                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-foreground/60">{testimonial.role}</div>
                                    <div className="text-xs text-accent font-medium">{testimonial.company}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
