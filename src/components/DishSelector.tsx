'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Utensils, CheckCircle2, RefreshCcw, User, Mail, Phone, CalendarDays, Users } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

type Step = 'name' | 'email' | 'phone' | 'eventDate' | 'headcount' | 'eventType' | 'sliders' | 'preparation' | 'sides' | 'bread' | 'allergies' | 'submitting' | 'scheduling' | 'done';

const DishSelector = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to Etheleen & Alma's Dream! I'm your personal Experience Creator. Let's design a custom catering proposal for your event. First, what's your name?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState<Step>('name');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        headcount: 50,
        eventType: '',
    });
    const [selections, setSelections] = useState({
        proteins: [] as string[],
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

    const addBotMessage = useCallback((text: string) => {
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text,
            sender: 'bot',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
    }, []);

    const handleSend = useCallback(async () => {
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

        // Reduced timeout to 250ms for faster interaction
        setTimeout(async () => {
            let botResponse = '';

            switch (step) {
                case 'name':
                    setCustomerInfo(prev => ({ ...prev, name: currentInput }));
                    setStep('email');
                    botResponse = `Nice to meet you, ${currentInput}! What's the best email address to send your custom proposal to?`;
                    break;

                case 'email':
                    setCustomerInfo(prev => ({ ...prev, email: currentInput }));
                    setStep('phone');
                    botResponse = `Got it! And a phone number? (Type "skip" to skip)`;
                    break;

                case 'phone':
                    const phone = currentInput.toLowerCase() === 'skip' ? '' : currentInput;
                    setCustomerInfo(prev => ({ ...prev, phone }));
                    setStep('eventDate');
                    botResponse = `When is your event? (e.g., "March 15, 2026" or "TBD")`;
                    break;

                case 'eventDate':
                    setCustomerInfo(prev => ({ ...prev, eventDate: currentInput }));
                    setStep('headcount');
                    botResponse = `Excellent! How many guests?`;
                    break;

                case 'headcount':
                    const headcount = parseInt(currentInput) || 50;
                    setCustomerInfo(prev => ({ ...prev, headcount }));
                    setStep('eventType');
                    botResponse = `Perfect! Planning for ${headcount} guests. 🎉\n\nWhat type of event is this?\n(e.g., Wedding, Corporate Event, Birthday Party, Family Reunion, Church Event, Other)`;
                    break;

                case 'eventType':
                    setCustomerInfo(prev => ({ ...prev, eventType: currentInput }));
                    setStep('sliders');
                    botResponse = `Wonderful! A ${currentInput} sounds exciting! 🍽️\n\nNow let's design your menu.\n\nOur packages: $25/person (Beef, Chicken, Pork) or $30/person (Steak, Seafood).\n\nWhat's your FIRST protein? (Choose ONE only)`;
                    break;

                case 'sliders':
                    const newProteins = [...selections.proteins, currentInput];
                    setSelections(prev => ({ ...prev, proteins: newProteins }));
                    if (newProteins.length < 3) {
                        const ordinal = newProteins.length === 1 ? 'SECOND' : 'THIRD';
                        botResponse = `Great! What's your ${ordinal} protein? (ONE choice only)`;
                    } else {
                        setStep('preparation');
                        botResponse = `Excellent: ${newProteins.join(', ')}!\n\nHow should we prepare these? (e.g., Grilled, BBQ, Herb-Crusted)`;
                    }
                    break;

                case 'preparation':
                    setSelections(prev => ({ ...prev, preparation: currentInput }));
                    setStep('sides');
                    botResponse = `Delicious! Choose 2 sides:\nGreen Beans, Brussels Sprouts, Rice, Lentils, Mac & Cheese, Cole Slaw`;
                    break;

                case 'sides':
                    setSelections(prev => ({ ...prev, sides: currentInput }));
                    setStep('bread');
                    botResponse = `Perfect! Bread service: Rolls, Biscuits, or Toast?`;
                    break;

                case 'bread':
                    setSelections(prev => ({ ...prev, bread: currentInput }));
                    setStep('allergies');
                    botResponse = `Almost done! Any allergies or dietary restrictions? (Type "none" if not)`;
                    break;

                case 'allergies':
                    const allergies = currentInput.toLowerCase() === 'none' ? '' : currentInput;
                    setSelections(prev => ({ ...prev, allergies }));
                    setStep('submitting');

                    try {
                        const response = await fetch('/api/catering/submit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                customerName: customerInfo.name,
                                customerEmail: customerInfo.email,
                                customerPhone: customerInfo.phone,
                                eventDate: customerInfo.eventDate,
                                eventType: customerInfo.eventType,
                                headcount: customerInfo.headcount,
                                proteins: [...selections.proteins],
                                preparation: selections.preparation,
                                sides: selections.sides,
                                bread: selections.bread,
                                allergies,
                            }),
                        });

                        if (response.ok) {
                            botResponse = `🎉 Proposal Sent, ${customerInfo.name}!\n\nYour preliminary proposal is in your inbox at ${customerInfo.email}.\n\nNext Step: We'd love to host you for a tasting experience! What is your preferred date and time for a tasting? (e.g., Next Friday at 2pm)`;
                            setStep('scheduling');
                        } else {
                            botResponse = `Issue submitting. Please contact: yourmeal@eadreamllc.com`;
                            setStep('done');
                        }
                    } catch {
                        botResponse = `Issue submitting. Please contact: yourmeal@eadreamllc.com`;
                        setStep('done');
                    }
                    break;

                case 'scheduling':
                    const scheduleInput = currentInput.toLowerCase();

                    // Check if user wants a callback
                    if (scheduleInput.includes('call') || scheduleInput.includes('phone') || scheduleInput === 'yes') {
                        // Trigger AI voice callback
                        if (customerInfo.phone) {
                            try {
                                await fetch('/api/schedule-callback', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        requestId: 'pending', // Will be updated
                                        customerPhone: customerInfo.phone,
                                        customerName: customerInfo.name,
                                        eventDetails: {
                                            eventDate: customerInfo.eventDate,
                                            guestCount: customerInfo.headcount,
                                            eventType: 'Catering'
                                        }
                                    }),
                                });
                                botResponse = `📞 Perfect! Alma from our team will call you at ${customerInfo.phone} within the next few minutes to discuss your event and schedule your tasting.\n\nIf you miss the call, don't worry - we'll try again or you can reach us at (602) 318-4925.\n\nIs there anything else I can help you with? (Type "no" to finish)`;
                            } catch {
                                botResponse = `We'll have someone call you at ${customerInfo.phone} shortly to schedule your tasting!\n\nAlternatively, feel free to call us directly at (602) 318-4925.\n\nIs there anything else? (Type "no" to finish)`;
                            }
                        } else {
                            botResponse = `Please call us at (602) 318-4925 to schedule your tasting - we'd love to hear from you!\n\nIs there anything else I can help you with? (Type "no" to finish)`;
                        }
                    } else {
                        // Standard scheduling response
                        botResponse = `Thank you for requesting ${currentInput}! 📅\n\nOur team will review your preferred time and reach out to confirm. We typically respond within 24 hours.\n\nWould you like us to call you to finalize details? (Type "yes" for a callback, or "no" to finish)`;
                    }
                    setStep('done');
                    break;

                case 'done':
                    const doneInput = currentInput.toLowerCase();
                    if (doneInput === 'no' || doneInput === 'nope' || doneInput === 'that\'s all' || doneInput === 'nothing' || doneInput === 'all good' || doneInput === 'i\'m good') {
                        botResponse = `It was a pleasure assisting you today! 🌟\n\nYour tasting has been requested and your proposal has been sent. Our team will reach out shortly to confirm everything.\n\nThank you for choosing Etheleen & Alma's Dream. We can't wait to create something extraordinary for you!`;
                        setIsDone(true);
                    } else {
                        botResponse = `I appreciate you reaching out! For any additional questions or special requests, please email us at yourmeal@eadreamllc.com or call us directly. Our team will be happy to assist you.\n\nIs there anything else? (Type "no" to finish)`;
                    }
                    break;
            }

            addBotMessage(botResponse);
            setIsSubmitting(false);
        }, 250); // Optimized from 600ms to 250ms
    }, [input, isSubmitting, isDone, step, customerInfo, selections, addBotMessage]);

    const resetChat = useCallback(() => {
        setMessages([{
            id: '1',
            text: "Let's create a new experience. What's your name?",
            sender: 'bot',
            timestamp: new Date(),
        }]);
        setCustomerInfo({ name: '', email: '', phone: '', eventDate: '', headcount: 50, eventType: '' });
        setSelections({ proteins: [], preparation: '', sides: '', bread: '', allergies: '' });
        setStep('name');
        setIsDone(false);
    }, []);

    const getPlaceholder = () => {
        switch (step) {
            case 'name': return "Your name...";
            case 'email': return "your@email.com";
            case 'phone': return "555-123-4567 or skip";
            case 'eventDate': return "March 15, 2026";
            case 'headcount': return "50";
            case 'eventType': return "Wedding, Corporate, Birthday...";
            case 'sliders': return "ONE protein only (e.g. Beef)";
            case 'preparation': return "e.g. Grilled";
            case 'sides': return "e.g. Rice, Green Beans";
            case 'bread': return "Rolls, Biscuits, or Toast";
            case 'allergies': return "none or list allergies";
            case 'scheduling': return "Preferred date & time...";
            case 'done': return "Type 'no' to finish or ask a question...";
            default: return "Type here...";
        }
    };

    const getStepIcon = () => {
        switch (step) {
            case 'name': return <User size={16} />;
            case 'email': return <Mail size={16} />;
            case 'phone': return <Phone size={16} />;
            case 'eventDate': return <CalendarDays size={16} />;
            case 'headcount': return <Users size={16} />;
            default: return <Utensils size={16} />;
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl bg-white/60 backdrop-blur-xl border border-white/20">
            {/* Header */}
            <div className="p-5 bg-primary text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                        {getStepIcon()}
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-base tracking-wide">Experience Creator</h3>
                        <p className="text-[11px] font-medium opacity-80 uppercase tracking-widest text-accent">
                            {step === 'name' || step === 'email' || step === 'phone' || step === 'eventDate' || step === 'headcount'
                                ? 'Collecting Info'
                                : step === 'scheduling' ? 'Scheduling Tasting'
                                    : step === 'done' ? 'Complete' : 'Menu Design'}
                        </p>
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
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-5 rounded-3xl text-[15px] leading-relaxed shadow-sm whitespace-pre-line ${msg.sender === 'user'
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
                        <div className="bg-white/80 p-4 rounded-3xl rounded-tl-none border border-primary/5 backdrop-blur-sm shadow-sm">
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
                            <p className="font-serif font-bold text-2xl text-primary">Proposal Sent!</p>
                            <p className="text-sm text-foreground/60 mt-2 max-w-[280px] mx-auto">Check {customerInfo.email}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            {!isDone && step !== 'submitting' && (
                <div className="p-6 bg-white/80 backdrop-blur-md border-t border-primary/5">
                    <div className="relative flex items-center">
                        <input
                            type={step === 'email' ? 'email' : step === 'headcount' ? 'number' : 'text'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={getPlaceholder()}
                            disabled={isSubmitting}
                            className="w-full py-5 pl-7 pr-16 rounded-full bg-background border border-primary/10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all text-[15px] font-medium placeholder:text-foreground/30 shadow-inner disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isSubmitting}
                            className="absolute right-2.5 p-3.5 bg-primary text-white rounded-full hover:bg-accent disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-xl hover:shadow-accent/30 active:scale-95 disabled:cursor-not-allowed"
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
