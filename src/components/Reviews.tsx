'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Jasmine T.',
        event: 'Corporate Luncheon',
        quote: 'EA Dream completely transformed our office event. The food was incredible — every single person asked who catered. We\'ll be booking them for every company event going forward.',
        rating: 5,
    },
    {
        name: 'Marcus & Deja W.',
        event: 'Wedding Reception',
        quote: 'From the tasting to the big day, they made us feel like family. The salmon was out of this world and our guests are STILL talking about the ribs. Absolute perfection.',
        rating: 5,
    },
    {
        name: 'Coach Ray P.',
        event: 'AAU Tournament Meals',
        quote: 'Feeding 60+ athletes is no joke. EA Dream delivered high-quality, high-protein meals on time every single day of the tournament. The kids loved it and so did the parents.',
        rating: 5,
    },
    {
        name: 'Alicia D.',
        event: 'Private Dinner Party',
        quote: 'We hosted a private dinner for 20 guests and the experience was unforgettable. The chef-curated tasting menu was exquisite — it felt like dining at a five-star restaurant in our own home.',
        rating: 5,
    },
];

const Reviews = () => {
    return (
        <section id="reviews" className="py-28 bg-gradient-to-b from-background via-primary/[0.03] to-background relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-10 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 mb-6"
                    >
                        <Star size={16} className="text-accent fill-accent" />
                        <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold">Client Love</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-serif text-primary"
                    >
                        What Our Clients <span className="italic text-accent font-light">Say</span>
                    </motion.h2>
                </div>

                {/* Testimonial Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="relative bg-white rounded-3xl p-8 border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
                        >
                            {/* Quote Icon */}
                            <Quote size={32} className="text-accent/20 absolute top-6 right-6 group-hover:text-accent/40 transition-colors duration-300" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            <p className="text-foreground/70 leading-relaxed font-light italic mb-6">
                                &ldquo;{t.quote}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
                                {/* Avatar Placeholder */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-primary text-sm">{t.name}</p>
                                    <p className="text-xs text-foreground/50">{t.event}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Google Review CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className="text-foreground/50 text-sm">
                        ⭐ Founding client? <a href="https://g.page/r/eadreamllc/review" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4 hover:text-primary transition-colors">Leave us a Google Review</a> — it means the world to us.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Reviews;
