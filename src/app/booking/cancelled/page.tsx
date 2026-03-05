'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';

export default function BookingCancelled() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg w-full text-center"
            >
                <div className="w-20 h-20 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <XCircle size={40} className="text-orange-500" />
                </div>

                <h1 className="text-4xl font-serif text-primary mb-4">Booking Cancelled</h1>
                <p className="text-foreground/60 text-lg mb-8 leading-relaxed">
                    No worries — your booking was not completed and you have not been charged. If you have any questions or need help, we&apos;re just a call or chat away.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button
                        onClick={() => {
                            const bot = document.querySelector('[data-floating-bot]') as HTMLButtonElement;
                            if (bot) bot.click();
                        }}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        Chat With Us
                    </button>
                    <a href="tel:6023184925" className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-primary/20 text-primary hover:bg-primary/5 transition-colors text-sm font-medium">
                        <Phone size={16} /> Call Us
                    </a>
                </div>

                <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors text-sm">
                    <ArrowLeft size={16} /> Back to Homepage
                </Link>
            </motion.div>
        </div>
    );
}
