'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
    const [hoveredPath, setHoveredPath] = useState<'private' | 'catering' | null>(null);

    return (
        <section className="relative min-h-screen flex flex-col pt-24 pb-0 bg-background overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
            }}></div>

            {/* Header Question */}
            <div className="relative z-20 text-center pt-8 md:pt-16 pb-8 px-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-serif text-primary mb-4"
                >
                    What brings you here today?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-foreground/70 font-sans tracking-widest uppercase text-sm font-medium"
                >
                    Choose Your Experience
                </motion.p>
            </div>

            {/* Split Screen Container */}
            <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto overflow-hidden">

                {/* Private Dinner Path */}
                <motion.div
                    onMouseEnter={() => setHoveredPath('private')}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`relative flex-1 flex flex-col justify-end p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-primary/20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden group min-h-[50vh] lg:min-h-0 ${hoveredPath === 'private' ? 'lg:flex-[1.2]' : hoveredPath === 'catering' ? 'lg:flex-[0.8] opacity-80' : 'flex-1'}`}
                >
                    {/* Dark/Moody Background for Private */}
                    <div className="absolute inset-0 bg-[#1A1A1A] z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

                    {/* Background Image - Private */}
                    <Image
                        src="/food-salmon-main.jpg"
                        alt="Intimate Private Dinner Setting"
                        fill
                        className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-[2s] ease-out z-0"
                    />

                    <div className="relative z-20 text-white flex flex-col h-full justify-end">
                        <div className="mb-auto">
                            <span className="inline-block px-3 py-1 mb-6 border border-white/30 rounded-full text-xs tracking-widest uppercase font-bold text-white/90 backdrop-blur-sm">
                                🕯️ Intimate & Exclusive
                            </span>
                        </div>

                        <div className="space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wide drop-shadow-lg">
                                Private Dinner Events
                            </h2>
                            <div className="h-px w-16 bg-white/50 group-hover:w-32 transition-all duration-700"></div>
                            <p className="font-sans font-light text-white/80 text-lg md:text-xl max-w-md leading-relaxed">
                                Chef-hosted, bespoke tasting menus for small gatherings (10-40 guests). A luxurious culinary journey tailored perfectly to you.
                            </p>

                            <ul className="space-y-2 font-sans text-sm text-white/70">
                                <li className="flex items-center gap-2"><span className="text-accent">✧</span> $1,000 per group of 8 guests</li>
                                <li className="flex items-center gap-2"><span className="text-accent">✧</span> Custom menu consultation required</li>
                                <li className="flex items-center gap-2"><span className="text-accent">✧</span> Limited dates available</li>
                            </ul>

                            <div className="pt-4">
                                <a
                                    href="https://calendly.com/eadreamllc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 py-4 font-sans uppercase tracking-[0.2em] text-sm transition-colors duration-300 w-full sm:w-auto text-center font-bold"
                                >
                                    Reserve Your Evening
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Catering Path */}
                <motion.div
                    onMouseEnter={() => setHoveredPath('catering')}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`relative flex-1 flex flex-col justify-end p-8 md:p-16 lg:p-24 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden group min-h-[50vh] lg:min-h-0 ${hoveredPath === 'catering' ? 'lg:flex-[1.2]' : hoveredPath === 'private' ? 'lg:flex-[0.8] opacity-80' : 'flex-1'}`}
                >
                    {/* Warm/Light Background for Catering */}
                    <div className="absolute inset-0 bg-[#Fdfbf7] z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"></div>

                    {/* Background Image - Catering */}
                    <Image
                        src="/food-appetizers.jpg"
                        alt="Professional Catering Spread"
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[2s] ease-out z-0"
                    />

                    <div className="relative z-20 text-white flex flex-col h-full justify-end">
                        <div className="mb-auto">
                            <span className="inline-block px-3 py-1 mb-6 border border-white/40 rounded-full text-xs tracking-widest uppercase font-bold text-white shadow-sm backdrop-blur-sm bg-black/20">
                                🍱 Professional & Scalable
                            </span>
                        </div>

                        <div className="space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wide drop-shadow-lg">
                                Event Catering
                            </h2>
                            <div className="h-px w-16 bg-white/50 group-hover:w-32 transition-all duration-700"></div>
                            <p className="font-sans font-light text-white/90 text-lg md:text-xl max-w-md leading-relaxed drop-shadow-md">
                                Reliable, warm, and professional catering for corporate setups, weddings, and large events with beautiful food stations.
                            </p>

                            <ul className="space-y-2 font-sans text-sm text-white/90 drop-shadow-sm font-medium">
                                <li className="flex items-center gap-2"><span className="text-secondary opacity-90 text-[10px]">⬤</span> Classic ($25) & Premium ($30) per plate</li>
                                <li className="flex items-center gap-2"><span className="text-secondary opacity-90 text-[10px]">⬤</span> Licensed & insured</li>
                                <li className="flex items-center gap-2"><span className="text-secondary opacity-90 text-[10px]">⬤</span> Same-day response and quote</li>
                            </ul>

                            <div className="pt-4">
                                <button
                                    onClick={() => {
                                        const bot = document.querySelector('[data-floating-bot]') as HTMLButtonElement;
                                        if (bot) bot.click();
                                    }}
                                    className="inline-flex items-center justify-center bg-primary text-white hover:bg-primary/90 px-8 py-4 font-sans uppercase tracking-[0.2em] text-sm transition-colors duration-300 w-full sm:w-auto shadow-xl"
                                >
                                    Get a Free Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
