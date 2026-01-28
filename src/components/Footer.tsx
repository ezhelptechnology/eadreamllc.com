'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, Instagram, Facebook, ChefHat } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
            <div className="container">
                {/* Quote Section */}
                <div id="quote" className="max-w-4xl mx-auto text-center mb-24 relative">
                    {/* Decorative Background for Quote Section */}
                    <div className="absolute inset-0 -top-20 -bottom-20 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">Ready to Create <br /><span className="italic text-accent">Something Extraordinary?</span></h2>
                        <p className="text-white/60 mb-10 max-w-xl mx-auto">
                            Get your free custom quote today. Our team will review your request and reach out within 24 hours.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-accent transition-all text-white"
                            />
                            <button
                                type="submit"
                                className="px-10 py-4 bg-accent text-zinc-950 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-accent/10 focus:ring-2 focus:ring-accent/20"
                            >
                                Get Quote
                            </button>
                        </form>
                        <p className="text-xs text-white/40 mt-6 flex items-center justify-center gap-2">
                            ✨ Free consultation • No commitment required
                        </p>
                    </motion.div>
                </div>

                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-t border-white/10 pt-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <ChefHat className="text-accent" size={32} />
                            <div>
                                <h3 className="text-xl font-bold font-serif leading-none text-white">
                                    Etheleen &amp; Alma&apos;s
                                </h3>
                                <span className="text-[10px] font-medium tracking-[0.2em] text-accent uppercase">
                                    Dream, LLC
                                </span>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            A family legacy sharing the love of third-generation recipes with the Charlotte community and beyond.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-accent hover:text-zinc-950 transition-all duration-300 border border-white/10">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-accent hover:text-zinc-950 transition-all duration-300 border border-white/10">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-accent">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'Services', 'Menu', 'AAU Prep', 'About'].map((item) => (
                                <li key={item}>
                                    <Link href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-white/50 hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-accent">Contact</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="tel:6023184925" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                                    <Phone size={16} className="text-accent" />
                                    (602) 318-4925
                                </a>
                            </li>
                            <li>
                                <a href="mailto:yourmeal@eadreamllc.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                                    <Mail size={16} className="text-accent" />
                                    yourmeal@eadreamllc.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/50">
                                <div className="p-1 rounded bg-accent/10 mt-0.5">
                                    <span className="block w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                </div>
                                Serving Greater Charlotte & Beyond
                            </li>
                        </ul>
                    </div>

                    {/* Certifications */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-accent">Credibility</h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group hover:border-accent/30 transition-colors">
                                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                                    <ChefHat size={20} />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors">Licensed & Insured</span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group hover:border-accent/30 transition-colors">
                                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                                    <ChefHat size={20} />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors">ServSafe Certified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-white/30 font-medium">
                        © {new Date().getFullYear()} Etheleen &amp; Alma&apos;s Dream, LLC. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest text-white/30">
                        <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                        <Link href="/admin/login" className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:border-accent/30 transition-all">Admin Access</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
