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
            text: "Welcome to Etheleen & Alma's Dream. I'm your host for 'Create My Experience'. We specialize in premium slider packages ($25-$30 per person). To begin, could you share 3 proteins or slider ideas you'd love to feature?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [dishes, setDishes] = useState<string[]>([]);
    const [step, setStep] = useState<'sliders' | 'preparation' | 'sides' | 'bread' | 'allergies'>('sliders');
    const [selections, setSelections] = useState<{
        proteins: string[];
        preparation: string;
        sides: string;
        bread: string;
        allergies: string;
    }>({
        proteins: [],
        preparation: '',
        sides: '',
        bread: '',
        allergies: ''
    });
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
        const currentInput = input.trim();
        setInput('');
        setIsSubmitting(true);

        // AI logic simulation
        setTimeout(() => {
            let botResponse = '';

            if (step === 'sliders') {
                const newProteins = [...selections.proteins, currentInput];
                setSelections(prev => ({ ...prev, proteins: newProteins }));
                setDishes(newProteins);

                if (newProteins.length < 3) {
                    botResponse = `Excellent! I've noted "${currentInput}". What's your ${newProteins.length === 1 ? 'second' : 'third'} protein selection?`;
                } else {
                    setStep('preparation');
                    botResponse = `Wonderful choices: ${newProteins.join(', ')}. How would you like these items prepared? (e.g., Grilled with Lemon Cream, Braised, Slathered in BBQ?)`;
                }
            } else if (step === 'preparation') {
                setSelections(prev => ({ ...prev, preparation: currentInput }));
                setStep('sides');
                botResponse = `That sounds mouth-watering! Now, which two sides would you like to pair with those? (Choose 2: Green Beans, Brussels Sprouts, Rice, or Lentils)`;
            } else if (step === 'sides') {
                setSelections(prev => ({ ...prev, sides: currentInput }));
                setStep('bread');
                botResponse = `Great pairings. And for your bread service, would you prefer Rolls, Biscuits, or Toast?`;
            } else if (step === 'bread') {
                setSelections(prev => ({ ...prev, bread: currentInput }));
                setStep('allergies');
                botResponse = `Almost done! To ensure everyone's safety, does anyone in your party have food allergies or specific dietary preferences we should know about?`;
            } else if (step === 'allergies') {
                setSelections(prev => ({ ...prev, allergies: currentInput }));
                botResponse = `Your custom experience is now curated! I'm sending your selections to our executive chefs. Once your invoice is submitted, we'll reach out to schedule your personalized tasting experience with our team.`;
                setIsDone(true);
                sendChoiceToAdmin({ ...selections, allergies: currentInput });
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
            setIsSubmitting(false);
        }, 800);
    };

    const sendChoiceToAdmin = async (finalSelections: any) => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalSelections),
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending experience choices to admin:', error);
        }
    };

    const resetChat = () => {
        setMessages([{
            id: '1',
            text: "Let's create a new experience. What are your top 3 proteins for sliders?",
            sender: 'bot',
            timestamp: new Date(),
        }]);
        setSelections({
            proteins: [],
            preparation: '',
            sides: '',
            bread: '',
            allergies: ''
        });
        setDishes([]);
        setStep('sliders');
        setIsDone(false);
    };

    return (
        <div className="flex flex-col h-[550px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl bg-white/60 backdrop-blur-xl border border-white/20">
            {/* Header */}
            <div className="p-5 bg-primary text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                        <Utensils size={22} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-base tracking-wide">Experience Creator</h3>
                        <p className="text-[11px] font-medium opacity-80 uppercase tracking-widest text-accent">Personal Host</p>
                    </div>
                </div>
                {!isDone && selections.proteins.length > 0 && step === 'sliders' && (
                    <div className="text-xs font-bold bg-white/15 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        {selections.proteins.length}/3 Proteins
                    </div>
                )}
                {isDone && (
                    <button onClick={resetChat} className="p-2.5 hover:bg-white/15 rounded-xl transition-all border border-white/0 hover:border-white/10">
                        <RefreshCcw size={18} />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/20 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-5 rounded-3xl text-[15px] leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-none font-medium'
                                    : 'bg-white/90 text-foreground rounded-tl-none border border-primary/5 backdrop-blur-sm'
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
                        <div className="bg-white/80 p-4 rounded-3xl rounded-tl-none border border-primary/5 backdrop-blur-sm shadow-sm font-bold">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-5 py-8 text-center"
                    >
                        <div className="p-4 bg-emerald-500/10 rounded-full">
                            <CheckCircle2 size={56} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="font-serif font-bold text-2xl text-primary">Experience Curated!</p>
                            <p className="text-sm text-foreground/60 mt-2 max-w-[250px] mx-auto">Our culinary team is ready to bring your vision to life.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            {!isDone && (
                <div className="p-6 bg-white/80 backdrop-blur-md border-t border-primary/5">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={
                                step === 'sliders' ? "Type a protein (e.g. Steak, Chicken)..." :
                                    step === 'preparation' ? "How should we prepare it?" :
                                        step === 'sides' ? "Choose two sides (e.g. Rice & Beans)..." :
                                            step === 'bread' ? "Rolls, Biscuits or Toast?" :
                                                "Any allergies or preferences?"
                            }
                            className="w-full py-5 pl-7 pr-16 rounded-full bg-background border border-primary/10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all text-[15px] font-medium placeholder:text-foreground/30 shadow-inner"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isSubmitting}
                            className="absolute right-2.5 p-3.5 bg-primary text-white rounded-full hover:bg-accent disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-xl hover:shadow-accent/30 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DishSelector;
