'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 blur-3xl premium-gradient rounded-bl-full shadow-2xl"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 opacity-5 blur-3xl bg-accent rounded-tr-full"></div>

            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col space-y-6"
                >
                    <div className="flex items-center gap-2 text-accent font-semibold tracking-widest uppercase text-xs">
                        <span className="w-8 h-px bg-accent"></span>
                        Premier Catering Services
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl">
                        Where <span className="text-gradient">Dreams</span> <br />
                        Find Their <span className="italic">Flavor</span>
                    </h1>

                    <p className="text-lg text-foreground/80 max-w-lg">
                        At Etheleen & Alma's Dream, we don't just cater events—we craft memories.
                        Experience culinary excellence tailored to your most precious moments.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="btn-primary flex items-center gap-2">
                            Book Your Experience
                            <ChevronRight size={20} />
                        </button>
                        <button className="glass py-4 px-8 rounded-full font-semibold border border-primary/20 hover:border-primary/50 transition-all">
                            View Our Menu
                        </button>
                    </div>

                    <div className="flex items-center gap-4 pt-8 border-t border-primary/10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-secondary">
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-primary">EA</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex text-amber-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                            </div>
                            <p className="font-medium text-foreground/60">Trusted by 500+ happy clients</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl glass">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                        <Image
                            src="/logo.jpg"
                            alt="Culinary Masterpiece"
                            fill
                            className="object-contain p-12 opacity-80"
                            priority
                        />
                    </div>

                    {/* Floating Element 1 */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 glass p-6 rounded-2xl shadow-xl hidden lg:block"
                    >
                        <div className="text-xs font-bold uppercase tracking-tighter text-accent mb-1">Upcoming Event</div>
                        <div className="text-sm font-semibold">Gala Dinner 2026</div>
                    </motion.div>

                    {/* Floating Element 2 */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl shadow-xl hidden lg:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Star size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">100%</div>
                                <div className="text-xs text-foreground/60">Bespoke Menus</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
