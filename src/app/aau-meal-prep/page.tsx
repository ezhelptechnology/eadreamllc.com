'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Send, CheckCircle2, RefreshCcw, Bell } from 'lucide-react';
import Image from 'next/image';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
}

const AAUMealPrepPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to Elite Athletics Prep. I'm your performance nutrition guide. We're launching our $1,200 Weekend Team Package soon! Would you like to be notified when we start taking orders for your next tournament?",
            sender: 'bot',
        }
    ]);
    const [input, setInput] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [step, setStep] = useState<'initial' | 'done'>('initial');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isDone) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');

        setTimeout(() => {
            let botResponse = "Got it! Your team is on the priority list. We'll reach out to your email shortly to discuss your upcoming schedule. Let's fuel the win! 🏆";

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot'
            }]);
            setIsDone(true);
            setStep('done');
        }, 800);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] text-white">
            <div className="container max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Bell size={14} className="animate-pulse" />
                            Launch Feature: AAU Sports Meal Prep
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-7xl font-serif leading-tight mb-8"
                        >
                            Fueling <span className="text-accent italic font-light">Champions</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-white/60 mb-12 leading-relaxed max-w-lg"
                        >
                            Maximize your team&apos;s performance with our $1,200 Weekend Tournament Package.
                            Includes breakfast, high-energy game-day snacks, and recovery meals for both days.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-colors">
                                <h3 className="font-bold text-accent mb-2">Weekend Warrior Package</h3>
                                <ul className="text-sm text-white/60 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                        Breakfast (Day 1 & 2)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                        High-Energy Snacks between games
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                                        Performance Recovery Meals
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-colors flex flex-col justify-center">
                                <h3 className="font-bold text-accent mb-2">$1,200 Flat Rate</h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    Transparent pricing for a full weekend of elite performance nutrition for your entire team.
                                </p>
                            </div>
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => {
                                const bot = document.getElementById('aau-bot');
                                if (bot) bot.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-10 py-5 bg-accent text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-2xl shadow-accent/20"
                        >
                            Reserve Your Weekend
                        </motion.button>
                    </div>

                    {/* Bot */}
                    <div id="aau-bot" className="relative scroll-mt-32">
                        <div className="absolute -inset-4 bg-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative glass-dark rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl h-[500px] flex flex-col bg-zinc-900/50 backdrop-blur-xl"
                        >
                            <div className="p-6 bg-accent text-black flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black/10 rounded-lg">
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Elite Prep Bot</h3>
                                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Performance Nutrition</p>
                                    </div>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                                <AnimatePresence>
                                    {messages.map(m => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.sender === 'user'
                                                ? 'bg-accent text-black font-bold rounded-tr-none'
                                                : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                                }`}>
                                                {m.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {isDone && (
                                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                                        <CheckCircle2 size={48} className="text-accent" />
                                        <p className="font-bold text-white">Priority Access Reserved</p>
                                    </div>
                                )}
                            </div>

                            {!isDone && (
                                <div className="p-4 border-t border-white/10">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                                            placeholder="Enter your team name or email..."
                                            className="w-full py-4 pl-6 pr-14 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-accent transition-all text-sm"
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="absolute right-2 p-3 bg-accent text-black rounded-full hover:scale-105 transition-transform"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AAUMealPrepPage;
