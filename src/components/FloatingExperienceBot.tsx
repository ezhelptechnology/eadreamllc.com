'use client';

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DishSelector from './DishSelector';

const FloatingExperienceBot = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[400px] max-w-[90vw] shadow-2xl relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full z-50 hover:bg-accent transition-colors shadow-lg"
                        >
                            <X size={16} />
                        </button>
                        <div className="overflow-hidden rounded-3xl border border-primary/10">
                            <DishSelector />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                data-floating-bot
                className="bg-primary hover:bg-accent text-white p-4 rounded-full shadow-2xl flex items-center gap-3 transition-colors group"
            >
                <div className="relative">
                    <MessageSquare size={24} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-primary animate-pulse"></span>
                </div>
                {!isOpen && (
                    <span className="font-bold text-sm tracking-widest uppercase pr-2">
                        Build My Menu
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default FloatingExperienceBot;
