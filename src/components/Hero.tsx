'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-36 pb-20 bg-background">
            {/* Background Texture/Pattern - Subtle Noise for premium feel */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
            }}></div>

            {/* Subtle Gradient Spots */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col space-y-10 text-center lg:text-left items-center lg:items-start"
                >
                    {/* Main Heading */}
                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 1 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-serif text-primary leading-[0.95]"
                        >
                            Taste the <br />
                            <span className="italic text-accent font-light">Extraordinary</span>
                        </motion.h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                            className="h-[1px] w-24 bg-accent/50 mt-8 mx-auto lg:mx-0"
                        ></motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-lg md:text-xl text-foreground/60 mt-8 max-w-lg leading-relaxed font-sans font-light tracking-wide"
                        >
                            Serving the Greater Charlotte area, with a willingness to travel to create the right experience for you. Elevating your most precious moments with exquisite, bespoke menus and flawless service.
                        </motion.p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto pt-4">
                        <button className="btn-primary flex items-center justify-center gap-3 shadow-2xl hover:shadow-primary/20 tracking-[0.2em] text-sm py-5 px-10">
                            Start Your Journey
                        </button>
                        <button className="text-sm px-10 py-5 border border-primary/20 font-sans font-medium uppercase tracking-[0.2em] hover:bg-primary/5 hover:border-primary text-primary transition-all duration-500">
                            View Our Menus
                        </button>
                    </div>

                    {/* Lead Generation Quote Section */}
                    <div id="quote" className="pt-8 w-full max-w-lg border-t border-primary/10">
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4 text-center lg:text-left">
                            Get Your Free Custom Quote
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-4 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-sm text-sm placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                            <button
                                type="submit"
                                className="btn-primary px-8 py-4 text-xs tracking-[0.15em] whitespace-nowrap hover:shadow-lg hover:shadow-primary/20 transition-all"
                            >
                                Get Quote
                            </button>
                        </form>
                        <p className="text-[10px] text-foreground/40 mt-3 text-center lg:text-left">
                            ✨ Free consultation • No commitment required
                        </p>
                    </div>
                </motion.div>

                {/* Right Image Grid - User Images */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="relative h-[600px] lg:h-[750px] w-full"
                >
                    {/* Main Image Layer (Salmon Steak) */}
                    <div className="absolute top-0 right-0 lg:right-5 w-[85%] h-[75%] bg-zinc-100 rounded-tr-[120px] rounded-bl-[120px] overflow-hidden shadow-2xl z-10 hover-scale-img group border border-white/50">
                        <div className="absolute inset-0 bg-primary/5 z-10 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0"></div>
                        <Image
                            src="/food-salmon-main.jpg"
                            alt="Gourmet Salmon Dish"
                            fill
                            className="object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                            priority
                        />
                    </div>

                    {/* Secondary Image Layer (Appetizers) */}
                    <div className="absolute bottom-10 left-0 lg:left-0 w-[60%] h-[45%] bg-zinc-50 rounded-tl-[80px] rounded-br-[80px] overflow-hidden shadow-2xl z-20 border-8 border-background hover-scale-img group">
                        <Image
                            src="/food-appetizers.jpg"
                            alt="Elegant Appetizers"
                            fill
                            className="object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
