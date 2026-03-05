'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Timer, Users } from 'lucide-react';

const features = [
    { icon: Zap, label: 'High-Protein Meals' },
    { icon: Timer, label: 'On-Time Delivery' },
    { icon: Users, label: 'Bulk Orders (20-100+)' },
    { icon: Dumbbell, label: 'Athlete-Focused' },
];

const AAUMealPrep = () => {
    return (
        <section id="aau-meal-prep" className="py-28 bg-gradient-to-br from-[#1A1A1A] to-[#2a1b3d] relative overflow-hidden">
            {/* Decorative  */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
                            <Dumbbell size={16} className="text-orange-400" />
                            <span className="text-orange-400 uppercase tracking-[0.2em] text-xs font-bold">Athletic Performance</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                            AAU <span className="italic text-orange-400 font-light">Meal Prep</span>
                        </h2>

                        <p className="text-white/70 text-lg leading-relaxed mb-8 font-light max-w-lg">
                            Fueling athletes with high-performance meals for tournaments and training camps. We provide bulk, nutrient-dense meals designed specifically for young athletes who need to perform at their best.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {features.map((f, idx) => (
                                <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                    <f.icon size={20} className="text-orange-400" />
                                    <span className="text-white/80 text-sm font-medium">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                const bot = document.querySelector('[data-floating-bot]') as HTMLButtonElement;
                                if (bot) bot.click();
                            }}
                            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-8 py-4 font-sans uppercase tracking-[0.2em] text-sm transition-all duration-300 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 font-bold"
                        >
                            Get a Meal Prep Quote
                        </button>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative h-[500px] rounded-tr-[80px] rounded-bl-[80px] overflow-hidden border border-white/10 shadow-2xl group">
                            <Image
                                src="/food-chicken.jpg"
                                alt="High-performance athlete meal prep"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl border border-primary/10">
                            <p className="text-primary font-bold text-lg">20–100+</p>
                            <p className="text-foreground/50 text-xs">Athletes Served</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AAUMealPrep;
