'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccess() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg w-full text-center"
            >
                <div className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-600" />
                </div>

                <h1 className="text-4xl font-serif text-primary mb-4">Booking Confirmed!</h1>
                <p className="text-foreground/60 text-lg mb-8 leading-relaxed">
                    Thank you for your deposit. Your event reservation has been secured! A confirmation email is on its way, and our team will reach out within 24 hours to finalize the details.
                </p>

                <div className="bg-white rounded-2xl border border-primary/10 p-6 mb-8 text-left space-y-3">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider">What Happens Next?</h3>
                    <ul className="space-y-2 text-sm text-foreground/70">
                        <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> You&apos;ll receive a confirmation email with your receipt</li>
                        <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> Our team will contact you to finalize menu & logistics</li>
                        <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> Remaining balance is due 48 hours before the event</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <a href="tel:6023184925" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/20 text-primary hover:bg-primary/5 transition-colors text-sm font-medium">
                        <Phone size={16} /> Call Us
                    </a>
                    <a href="mailto:yourmeal@eadreamllc.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/20 text-primary hover:bg-primary/5 transition-colors text-sm font-medium">
                        <Mail size={16} /> Email Us
                    </a>
                </div>

                <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors text-sm">
                    <ArrowLeft size={16} /> Back to Homepage
                </Link>
            </motion.div>
        </div>
    );
}
