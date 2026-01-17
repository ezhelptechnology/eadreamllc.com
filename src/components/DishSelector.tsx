'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Utensils, CheckCircle2, RefreshCcw } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const DishSelector = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to Etheleen & Alma's Dream. I'm your culinary guide. To help us craft your perfect menu, could you share your top 3 favorite dishes or flavor profiles?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [dishes, setDishes] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isSubmitting || isDone) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsSubmitting(true);

        // AI logic simulation
        setTimeout(() => {
            const newDishes = [...dishes, input.trim()];
            setDishes(newDishes);

            let botResponse = '';
            if (newDishes.length < 3) {
                botResponse = `That sounds delicious! I've noted down "${input.trim()}". What's your ${newDishes.length === 1 ? 'second' : 'third'} favorite dish?`;
            } else {
                botResponse = `Wonderful choices! I have your favorites: ${newDishes.join(', ')}. I'm sending these to our executive chefs now. They will generate a complete bespoke menu for you.`;
                setIsDone(true);
                sendChoiceToAdmin(newDishes);
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
            setIsSubmitting(false);
        }, 1000);
    };

    const sendChoiceToAdmin = async (finalDishes: string[]) => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dishes: finalDishes }),
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            console.log('Email request sent successfully');
        } catch (error) {
            console.error('Error sending dish choices to admin:', error);
        }
    };

    const resetChat = () => {
        setMessages([{
            id: '1',
            text: "Let's start over. What are your top 3 favorite dishes?",
            sender: 'bot',
            timestamp: new Date(),
        }]);
        setDishes([]);
        setIsDone(false);
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl bg-white/40">
            {/* Header */}
            <div className="p-4 bg-primary text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                        <Utensils size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Culinary Guide</h3>
                        <p className="text-[10px] opacity-70">AI Assistant</p>
                    </div>
                </div>
                {!isDone && dishes.length > 0 && (
                    <div className="text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
                        {dishes.length}/3 Dishes
                    </div>
                )}
                {isDone && (
                    <button onClick={resetChat} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <RefreshCcw size={16} />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white text-foreground rounded-tl-none border border-primary/5'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isSubmitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/80 p-3 rounded-2xl rounded-tl-none border border-primary/5">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 py-6 text-center"
                    >
                        <CheckCircle2 size={48} className="text-emerald-500" />
                        <div>
                            <p className="font-bold text-primary">Preferences Received!</p>
                            <p className="text-xs text-foreground/60 mt-1">Our chefs are now curating your dream menu.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            {!isDone && (
                <div className="p-4 bg-white border-t border-primary/10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Tell me a dish you love..."
                            className="w-full py-4 pl-6 pr-14 rounded-full bg-background border border-primary/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isSubmitting}
                            className="absolute right-2 p-3 bg-primary text-white rounded-full hover:bg-primary-light disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-lg"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-foreground/40 mt-3 text-center px-4 italic">
                        &quot;Bespoke catering for your most precious moments.&quot;
                    </p>
                </div>
            )}
        </div>
    );
};

export default DishSelector;
