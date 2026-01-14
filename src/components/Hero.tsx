'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Sparkles, Award } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-gradient-to-br from-background via-secondary/10 to-background">
            {/* Animated Background Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="container grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col space-y-8"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 self-start glass px-6 py-3 rounded-full border border-primary/20"
                    >
                        <Sparkles size={18} className="text-accent" />
                        <span className="text-sm font-semibold text-primary">Premier Catering Excellence</span>
                    </motion.div>

                    {/* Main Heading - BOLD like FlexCatering */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                        Where <span className="text-gradient italic">Dreams</span> <br />
                        Meet <span className="text-primary">Culinary</span><br />
                        <span className="text-accent">Perfection</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-foreground/70 max-w-xl leading-relaxed font-light">
                        Elevate your events with bespoke catering experiences crafted by our award-winning chefs.
                        From intimate gatherings to grand celebrations.
                    </p>

                    {/* CTAs - Larger, more prominent */}
                    <div className="flex flex-wrap gap-6 pt-4">
                        <button className="btn-primary text-lg px-10 py-5 flex items-center gap-3 shadow-2xl hover:shadow-primary/30 transition-all">
                            Start Your Journey
                            <ChevronRight size={24} />
                        </button>
                        <button className="glass py-5 px-10 rounded-full font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all text-lg">
                            View Our Portfolio
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-3 border-background overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                        <Award size={20} className="text-primary" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex text-amber-500 mb-1">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-sm font-semibold text-foreground">500+ Five-Star Events</p>
                            </div>
                        </div>

                        <div className="h-12 w-px bg-primary/20"></div>

                        <div>
                            <div className="text-4xl font-bold text-primary">15+</div>
                            <p className="text-sm text-foreground/60 font-medium">Years of Excellence</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Image Grid - More Dynamic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative h-[600px] lg:h-[700px]"
                >
                    {/* Main Image */}
                    <div className="absolute top-0 right-0 w-[85%] h-[70%] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50">
                        <Image
                            src="/hero-platter.png"
                            alt="Gourmet Catering Platter"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                    </div>

                    {/* Secondary Image - Event Setup */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute bottom-0 left-0 w-[70%] h-[45%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50"
                    >
                        <Image
                            src="/event-setup.png"
                            alt="Elegant Event Setup"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Floating Stats Card */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute top-[45%] left-[10%] glass p-6 rounded-2xl shadow-xl border border-white/30 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Sparkles size={28} className="text-primary" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">100%</div>
                                <div className="text-xs text-foreground/70 font-medium">Bespoke Menus</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Award Badge */}
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                        className="absolute top-[10%] left-[5%] glass p-4 rounded-full shadow-xl border border-accent/30"
                    >
                        <Award size={32} className="text-accent" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
