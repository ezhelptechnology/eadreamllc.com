'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';

const galleryImages = [
    { src: '/food-salmon-main.jpg', alt: 'Gourmet Salmon Plating', span: 'md:col-span-2 md:row-span-2' },
    { src: '/food-appetizers.jpg', alt: 'Elegant Appetizer Spread', span: '' },
    { src: '/food-steak.jpg', alt: 'Premium Steak Course', span: '' },
    { src: '/chef-plating.png', alt: 'Chef Plating in Action', span: 'md:col-span-2' },
    { src: '/food-ribs.jpg', alt: 'Southern BBQ Ribs', span: '' },
    { src: '/food-pork-tenderloin.jpg', alt: 'Pork Tenderloin', span: '' },
    { src: '/event-setup.png', alt: 'Event Table Setup', span: 'md:col-span-2' },
    { src: '/food-seabass.jpg', alt: 'Pan-Seared Seabass', span: '' },
];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

    return (
        <section id="gallery" className="py-28 bg-background relative overflow-hidden">
            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 mb-6"
                    >
                        <Camera size={16} className="text-accent" />
                        <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold">Our Work</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-serif text-primary"
                    >
                        Event <span className="italic text-accent font-light">Gallery</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-foreground/60 mt-4"
                    >
                        A taste of the exceptional experiences we create for our clients.
                    </motion.p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
                    {galleryImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05, duration: 0.4 }}
                            className={`relative rounded-2xl overflow-hidden cursor-pointer group ${img.span}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm font-medium">{img.alt}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full max-w-4xl h-[70vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                            />
                            <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
                                {selectedImage.alt}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
