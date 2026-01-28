'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ClipboardList, RefreshCcw, XCircle, Loader2 } from 'lucide-react';

interface CateringRequest {
    id: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    eventDate: string | null;
    eventLocation: string | null;
    headcount: number;
    proteins: string;
    preparation: string | null;
    sides: string | null;
    bread: string | null;
    allergies: string | null;
    status: string;
    proposals: Proposal[];
}

interface Proposal {
    id: string;
    createdAt: string;
    content: string;
    estimatedCost: number;
    version: number;
    status: string;
    sentAt: string | null;
}

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    type?: 'text' | 'request-list' | 'proposal-view';
    data?: unknown;
}

const AdminBot = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to the Admin Proposal Manager. I can help you:\n\n• View all customer requests\n• Edit proposals\n• Resend updated proposals\n\nType 'list' to see all requests, or enter a request ID to view details.",
            sender: 'bot',
        }
    ]);
    const [input, setInput] = useState('');
    const [requests, setRequests] = useState<CateringRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editCost, setEditCost] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/catering/requests');
            const data = await response.json();
            setRequests(data.requests || []);
            return data.requests || [];
        } catch (error) {
            console.error('Error fetching requests:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const addBotMessage = (text: string, type: 'text' | 'request-list' | 'proposal-view' = 'text', data?: unknown) => {
        const botMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'bot',
            type,
            data,
        };
        setMessages(prev => [...prev, botMessage]);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        const command = input.trim().toLowerCase();
        setInput('');
        setIsLoading(true);

        // Process commands
        if (command === 'list' || command === 'requests' || command === 'all') {
            const reqs = await fetchRequests();
            if (reqs.length === 0) {
                addBotMessage("No catering requests found yet. When customers submit through the Experience Creator, they'll appear here.");
            } else {
                addBotMessage(`Found ${reqs.length} catering request(s):`, 'request-list', reqs);
            }
        } else if (command === 'help') {
            addBotMessage("Available commands:\n\n• 'list' - View all requests\n• 'view [ID]' - View details of a request\n• 'edit [PROPOSAL_ID]' - Edit a proposal\n• 'resend [PROPOSAL_ID]' - Resend proposal to customer");
        } else if (command.startsWith('view ')) {
            const requestId = command.replace('view ', '').trim();
            const req = requests.find(r => r.id === requestId || r.id.startsWith(requestId));
            if (req) {
                const proteins = JSON.parse(req.proteins);
                const latestProposal = req.proposals[0];
                addBotMessage(
                    `=== REQUEST DETAILS ===\n` +
                    `ID: ${req.id}\n` +
                    `Status: ${req.status}\n\n` +
                    `--- CUSTOMER ---\n` +
                    `1. Name: ${req.customerName}\n` +
                    `2. Email: ${req.customerEmail}\n` +
                    `3. Phone: ${req.customerPhone || 'N/A'}\n` +
                    `4. Event Date: ${req.eventDate || 'TBD'}\n` +
                    `5. Headcount: ${req.headcount}\n\n` +
                    `--- ORDER ---\n` +
                    `6. Proteins: ${proteins.join(', ')}\n` +
                    `7. Preparation: ${req.preparation || 'N/A'}\n` +
                    `8. Sides: ${req.sides || 'N/A'}\n` +
                    `9. Bread: ${req.bread || 'N/A'}\n` +
                    `10. Allergies: ${req.allergies || 'None'}\n\n` +
                    `--- PROPOSAL ---\n` +
                    (latestProposal
                        ? `Version: ${latestProposal.version}\nEstimated: $${latestProposal.estimatedCost.toFixed(2)}\nStatus: ${latestProposal.status}\n\nType 'edit ${latestProposal.id.slice(0, 8)}' to modify or 'resend ${latestProposal.id.slice(0, 8)}' to send to customer.`
                        : 'No proposal generated yet.')
                );
            } else {
                addBotMessage(`Request not found. Type 'list' to see all available requests.`);
            }
        } else if (command.startsWith('edit ')) {
            const proposalId = command.replace('edit ', '').trim();
            let foundProposal: Proposal | null = null;
            let foundRequest: CateringRequest | null = null;

            for (const req of requests) {
                const prop = req.proposals.find(p => p.id === proposalId || p.id.startsWith(proposalId));
                if (prop) {
                    foundProposal = prop;
                    foundRequest = req;
                    break;
                }
            }

            if (foundProposal && foundRequest) {
                setEditingProposal(foundProposal);
                setEditContent(foundProposal.content);
                setEditCost(foundProposal.estimatedCost.toString());
                addBotMessage(`Editing proposal for ${foundRequest.customerName}. Use the editor below to make changes, then click 'Save & Create New Version'.`);
            } else {
                addBotMessage(`Proposal not found. Type 'list' then 'view [REQUEST_ID]' to find proposal IDs.`);
            }
        } else if (command.startsWith('resend ')) {
            const proposalId = command.replace('resend ', '').trim();
            let foundProposal: Proposal | null = null;

            for (const req of requests) {
                const prop = req.proposals.find(p => p.id === proposalId || p.id.startsWith(proposalId));
                if (prop) {
                    foundProposal = prop;
                    break;
                }
            }

            if (foundProposal) {
                try {
                    const response = await fetch(`/api/catering/proposals/${foundProposal.id}`, {
                        method: 'POST',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        addBotMessage(`✅ ${data.message}`);
                    } else {
                        addBotMessage(`❌ Error: ${data.error}`);
                    }
                } catch {
                    addBotMessage(`❌ Failed to resend proposal. Please try again.`);
                }
            } else {
                addBotMessage(`Proposal not found. Type 'list' then 'view [REQUEST_ID]' to find proposal IDs.`);
            }
        } else {
            addBotMessage(`I didn't understand that command. Type 'help' for available commands.`);
        }

        setIsLoading(false);
    };

    const handleSaveEdit = async () => {
        if (!editingProposal) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/catering/proposals/${editingProposal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: editContent,
                    estimatedCost: parseFloat(editCost),
                }),
            });
            const data = await response.json();

            if (response.ok) {
                addBotMessage(`✅ ${data.message}\n\nNew proposal ID: ${data.proposal.id.slice(0, 8)}...\nType 'resend ${data.proposal.id.slice(0, 8)}' to send to customer.`);
                setEditingProposal(null);
                await fetchRequests(); // Refresh data
            } else {
                addBotMessage(`❌ Error: ${data.error}`);
            }
        } catch {
            addBotMessage(`❌ Failed to save proposal. Please try again.`);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-[700px] w-full glass rounded-3xl overflow-hidden shadow-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10">
            {/* Header */}
            <div className="p-5 bg-accent text-black flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-black/10 rounded-xl">
                        <ClipboardList size={22} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-base tracking-wide">Admin Proposal Manager</h3>
                        <p className="text-[11px] font-bold opacity-70 uppercase tracking-widest">Internal Bot</p>
                    </div>
                </div>
                <button
                    onClick={fetchRequests}
                    className="p-2.5 hover:bg-black/10 rounded-xl transition-all"
                    disabled={isLoading}
                >
                    <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.type === 'request-list' && msg.data ? (
                                <div className="w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="p-4 border-b border-white/10 bg-white/5">
                                        <p className="text-white font-bold text-sm">{msg.text}</p>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {(msg.data as CateringRequest[]).map((req, idx) => (
                                            <div
                                                key={req.id}
                                                className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                onClick={() => setInput(`view ${req.id}`)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-bold">{idx + 1}. {req.customerName}</p>
                                                        <p className="text-white/60 text-sm">{req.customerEmail}</p>
                                                        <p className="text-white/40 text-xs mt-1">
                                                            {JSON.parse(req.proteins).join(', ')} • {req.headcount} guests
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'PROPOSAL_SENT' ? 'bg-blue-500/20 text-blue-400' :
                                                            req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                                'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {req.status}
                                                        </span>
                                                        <p className="text-white/40 text-xs mt-2">
                                                            {new Date(req.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`max-w-[85%] p-5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                                        ? 'bg-accent text-black font-medium rounded-tr-none'
                                        : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <div className="flex justify-center">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                )}
            </div>

            {/* Edit Panel */}
            {editingProposal && (
                <div className="p-4 bg-zinc-800 border-t border-white/10">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-white font-bold text-sm">Editing Proposal v{editingProposal.version}</p>
                        <button onClick={() => setEditingProposal(null)} className="text-white/50 hover:text-white">
                            <XCircle size={18} />
                        </button>
                    </div>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-32 p-3 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-accent"
                    />
                    <div className="flex gap-3 mt-3">
                        <input
                            type="number"
                            value={editCost}
                            onChange={(e) => setEditCost(e.target.value)}
                            placeholder="Estimated Cost"
                            className="flex-1 p-3 bg-zinc-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                        />
                        <button
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                            className="px-6 py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
                        >
                            Save & Create New Version
                        </button>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-zinc-800/50 border-t border-white/10">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type 'list', 'view [ID]', 'edit [ID]', or 'help'..."
                        className="w-full py-4 pl-6 pr-14 rounded-full bg-zinc-900 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-all text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-3 bg-accent text-black rounded-full hover:bg-accent/80 disabled:opacity-50 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBot;
