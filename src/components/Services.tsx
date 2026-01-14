'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Leaf, UtensilsCrossed, Star } from 'lucide-react';

const services = [
    {
        icon: ChefHat,
        title: 'Culinary Mastery',
        description: 'Our world-class chefs bring passion and precision to every dish, creating culinary masterpieces that delight the senses.',
        delay: 0.1
    },
    {
        icon: Leaf,
        title: 'Fresh & Local',
        description: 'We prioritize locally sourced, seasonal ingredients to ensure the freshest flavors and sustainable catering practices.',
        delay: 0.2
    },
    {
        icon: UtensilsCrossed,
        title: 'Bespoke Menus',
        description: 'Every event is unique. We collaborate with you to design a custom menu that perfectly reflects your vision and taste.',
        delay: 0.3
    },
    {
        icon: Star,
        title: 'Flawless Service',
        description: 'From setup to cleanup, our professional staff ensures a seamless experience so you can relax and enjoy your event.',
        delay: 0.4
    }
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-background relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#613C70 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <div className="container relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-accent uppercase tracking-[0.2em] text-sm font-bold"
                    >
                        Why Choose Us
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-serif text-primary mt-3"
                    >
                        Experience <span className="italic font-medium">Excellence</span>
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-1 w-24 bg-accent mx-auto mt-6"
                    ></motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: service.delay, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 border border-primary/5 shadow-lg shadow-primary/5 group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Hover Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>

                            <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <service.icon size={28} className="text-primary group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-foreground/70 leading-relaxed font-light">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
