'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChefHat } from 'lucide-react';
import Image from 'next/image';

const MenuShowcase = () => {
    const classicTier = {
        title: "Classic Collection",
        price: 25,
        description: "Timeless flavors, expertly prepared",
        proteins: [
            { name: "Herb-Roasted Chicken", image: "/food-chicken.jpg" },
            { name: "Braised Pork Tenderloin", image: "/food-ribs.jpg" },
            { name: "Grilled Beef Medallions", image: "/food-ribs2.jpg" }
        ]
    };

    const premiumTier = {
        title: "Premium Collection",
        price: 30,
        description: "Elevated cuisine for discerning palates",
        proteins: [
            { name: "Pan-Seared Filet Mignon", image: "/food-steak.jpg" },
            { name: "Chilean Sea Bass", image: "/food-chicken.jpg" },
            { name: "Lobster Tail", image: "/food-ribs.jpg" }
        ]
    };

    return (
        <section id="menu" className="relative py-32 bg-gradient-to-b from-white via-secondary/5 to-white overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 mb-6">
                        <Sparkles size={18} className="text-accent" />
                        <span className="text-accent font-bold uppercase tracking-widest text-sm">Curated Experiences</span>
                    </div>
                    <h2 className="text-6xl md:text-7xl font-serif text-primary mb-6 leading-tight">
                        Build Your <span className="italic text-accent font-light">Perfect Menu</span>
                    </h2>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        Choose from our Classic or Premium collections. Each 3-course experience includes a refined salad, exquisite main course, and decadent dessert.
                    </p>
                </motion.div>

                {/* Tier Cards */}
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
                    {/* Classic Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[3rem] transform group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="relative glass rounded-[3rem] p-10 border border-primary/10 hover:border-primary/30 transition-all duration-500">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-primary mb-2">{classicTier.title}</h3>
                                    <p className="text-foreground/60 italic">{classicTier.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-5xl font-bold text-primary">${classicTier.price}</div>
                                    <div className="text-sm text-foreground/50 uppercase tracking-wider">per guest</div>
                                </div>
                            </div>

                            {/* Protein Grid */}
                            <div className="space-y-4 mb-8">
                                {classicTier.proteins.map((protein, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white/80 transition-all duration-300 border border-primary/5">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={protein.image}
                                                alt={protein.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-foreground">{protein.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-primary/10">
                                <p className="text-sm text-foreground/50 text-center">
                                    Includes: Garden Salad • Main Course • Artisan Dessert
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Premium Tier */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-br from-accent via-primary to-accent rounded-[3rem] opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-700"></div>
                        <div className="relative glass rounded-[3rem] p-10 border-2 border-accent/30 hover:border-accent/50 transition-all duration-500 bg-gradient-to-br from-accent/5 to-transparent">
                            <div className="absolute top-6 right-6">
                                <div className="px-4 py-2 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-widest">
                                    Premium
                                </div>
                            </div>

                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-primary mb-2">{premiumTier.title}</h3>
                                    <p className="text-foreground/60 italic">{premiumTier.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-5xl font-bold text-accent">${premiumTier.price}</div>
                                    <div className="text-sm text-foreground/50 uppercase tracking-wider">per guest</div>
                                </div>
                            </div>

                            {/* Protein Grid */}
                            <div className="space-y-4 mb-8">
                                {premiumTier.proteins.map((protein, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all duration-300 border border-accent/10">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-accent/20">
                                            <Image
                                                src={protein.image}
                                                alt={protein.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-foreground">{protein.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-accent/20">
                                <p className="text-sm text-foreground/50 text-center">
                                    Includes: Gourmet Salad • Premium Main • Signature Dessert
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <button
                        onClick={() => {
                            const bot = document.querySelector('[data-floating-bot]');
                            if (bot) (bot as HTMLButtonElement).click();
                        }}
                        className="group relative inline-flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-full text-lg font-bold uppercase tracking-widest hover:bg-accent transition-all duration-500 shadow-2xl hover:shadow-accent/30 hover:scale-105"
                    >
                        <ChefHat size={24} />
                        <span>Build My Menu</span>
                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                    <p className="mt-6 text-sm text-foreground/50 italic">
                        Our AI guide will help you create the perfect 3-course experience
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default MenuShowcase;
