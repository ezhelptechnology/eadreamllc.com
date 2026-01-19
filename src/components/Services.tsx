'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Leaf, UtensilsCrossed, Star, Sparkles, Clock, Heart, Shield } from 'lucide-react';

const services = [
    {
        icon: ChefHat,
        title: 'Culinary Mastery',
        description: 'World-class chefs bring passion and precision to every dish, creating culinary masterpieces that delight all senses.',
        gradient: 'from-amber-500/20 to-orange-500/20',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        delay: 0.1
    },
    {
        icon: Leaf,
        title: 'Fresh & Local',
        description: 'Locally sourced, seasonal ingredients ensure the freshest flavors and sustainable catering practices.',
        gradient: 'from-emerald-500/20 to-green-500/20',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
        delay: 0.2
    },
    {
        icon: UtensilsCrossed,
        title: 'Bespoke Menus',
        description: 'Every event is unique. We collaborate with you to design a custom menu that perfectly reflects your vision.',
        gradient: 'from-violet-500/20 to-purple-500/20',
        iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
        delay: 0.3
    },
    {
        icon: Star,
        title: 'Flawless Service',
        description: 'From setup to cleanup, our professional staff ensures a seamless experience so you can relax and enjoy.',
        gradient: 'from-rose-500/20 to-pink-500/20',
        iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
        delay: 0.4
    }
];

const highlights = [
    { icon: Heart, label: '3rd Generation', value: 'Family Recipes' },
    { icon: Shield, label: 'Licensed', value: '& Insured' },
    { icon: Clock, label: 'Same Day', value: 'Response' },
];

const Services = () => {
    return (
        <section id="services" className="py-32 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(#613C70 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
                <div className="absolute top-20 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 mb-6"
                    >
                        <Sparkles size={16} className="text-accent" />
                        <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold">Why Choose Us</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-serif text-primary"
                    >
                        Experience <span className="italic text-accent font-light">Excellence</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-foreground/60 mt-6 leading-relaxed"
                    >
                        From intimate gatherings to grand celebrations, we bring your vision to life with exceptional cuisine and impeccable service.
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-1 w-24 bg-gradient-to-r from-primary via-accent to-primary mx-auto mt-8"
                    ></motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-8 mb-20"
                >
                    {highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 shadow-lg border border-primary/5">
                            <item.icon size={20} className="text-accent" />
                            <div>
                                <span className="font-bold text-primary">{item.label}</span>
                                <span className="text-foreground/60 ml-1">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Service Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: service.delay, duration: 0.5 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group"
                        >
                            {/* Gradient Background Glow */}
                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>

                            <div className="relative bg-white p-8 rounded-3xl border border-primary/5 shadow-xl shadow-primary/5 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 overflow-hidden h-full">
                                {/* Hover Accent Line */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>

                                {/* Corner Decoration */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon size={28} className="text-white" />
                                </div>

                                <h3 className="text-xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-foreground/70 leading-relaxed font-light">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works Section */}
                <div className="mt-32 pt-20 border-t border-primary/10">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-serif text-primary mb-4">How to Get Started</h3>
                        <p className="text-foreground/60 max-w-xl mx-auto">
                            Getting your custom catering quote has never been easier. Follow our simple AI-guided process to build your dream menu in minutes.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto relative group"
                    >
                        {/* Decorative Background Glow for Image */}
                        <div className="absolute inset-0 bg-accent/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative rounded-[3rem] overflow-hidden border border-primary/10 bg-white/50 backdrop-blur-md shadow-2xl">
                            <img
                                src="/how-it-works.png"
                                alt="How to build your menu using our chatbot"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Overlay steps text (optional but good for accessibility/clarity) */}
                        <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                            <div>
                                <h4 className="font-bold text-primary uppercase tracking-widest text-sm mb-2">1. Start a Chat</h4>
                                <p className="text-xs text-foreground/50 px-4">Click the &quot;Build My Menu&quot; button in the corner to begin your journey.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-primary uppercase tracking-widest text-sm mb-2">2. Customize Menu</h4>
                                <p className="text-xs text-foreground/50 px-4">Pick your favorite proteins, sides, and share your event details.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-primary uppercase tracking-widest text-sm mb-2">3. Receive Quote</h4>
                                <p className="text-xs text-foreground/50 px-4">Our AI instantly creates your proposal and sends it to our team for review.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-24"
                >
                    <p className="text-foreground/60 mb-6 font-medium">Ready to create something extraordinary?</p>
                    <button
                        onClick={() => {
                            const bot = document.querySelector('[data-floating-bot]');
                            if (bot) (bot as HTMLButtonElement).click();
                        }}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-accent text-white rounded-full text-sm font-bold uppercase tracking-widest hover:shadow-2xl hover:shadow-accent/30 hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/10"
                    >
                        <ChefHat size={18} />
                        Get Your Custom Quote Now
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;

