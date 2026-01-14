'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, DollarSign, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface CateringRequest {
    id: string;
    createdAt: string;
    favoriteDishes: string;
    status: string;
    generatedMenu: {
        id: string;
        content: string;
        estimatedCost: number;
        finalPrice: number | null;
    } | null;
}

export default function AdminDashboard() {
    const [requests, setRequests] = useState<CateringRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<CateringRequest | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [guestCount, setGuestCount] = useState(50);
    const [finalPrice, setFinalPrice] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/requests');
            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status}`);
            }
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setRequests(data.requests || []);
        } catch (error: any) {
            console.error('Error fetching requests:', error);
            setError(error.message || 'Failed to load requests');
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    const generateMenu = async (requestId: string) => {
        setIsGenerating(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/generate-menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, guestCount })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('Menu generated successfully!');
                fetchRequests();
                // Auto-select the updated request
                const updatedRequest = requests.find(r => r.id === requestId);
                if (updatedRequest) {
                    setSelectedRequest({
                        ...updatedRequest, generatedMenu: {
                            id: '',
                            content: data.menu,
                            estimatedCost: data.estimatedCost,
                            finalPrice: null
                        }
                    });
                }
            }
        } catch (error) {
            setMessage('Error generating menu');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const setFinalPricing = async (menuId: string) => {
        if (!finalPrice) return;

        try {
            const res = await fetch('/api/admin/set-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menuId, finalPrice: parseFloat(finalPrice) })
            });
            const data = await res.json();

            if (data.success) {
                setMessage('Final price set! Ready to send to client.');
                fetchRequests();
                setFinalPrice('');
            }
        } catch (error) {
            setMessage('Error setting price');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pt-24 pb-12">
            <div className="container max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-primary rounded-2xl">
                            <ChefHat size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-primary">Admin Portal</h1>
                            <p className="text-foreground/60">Manage catering requests and generate custom menus</p>
                        </div>
                    </div>
                </motion.div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 glass rounded-2xl border border-primary/20 flex items-center gap-3"
                    >
                        <CheckCircle2 size={20} className="text-green-500" />
                        <span className="text-sm font-medium">{message}</span>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-3"
                    >
                        <AlertCircle size={20} className="text-red-500" />
                        <div className="flex-1">
                            <span className="text-sm font-medium text-red-900">{error}</span>
                            <p className="text-xs text-red-600 mt-1">Check that the database is properly configured and Prisma client is generated.</p>
                        </div>
                        <button
                            onClick={fetchRequests}
                            className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 rounded-full text-red-700 font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Requests List */}
                    <div className="lg:col-span-1">
                        <div className="glass p-6 rounded-3xl border border-primary/10">
                            <h2 className="text-2xl font-bold text-primary mb-6">Incoming Requests</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                                        <p className="text-foreground/40 text-sm">Loading requests...</p>
                                    </div>
                                ) : requests.length === 0 ? (
                                    <p className="text-foreground/40 text-center py-8">No requests yet</p>
                                ) : (
                                    requests.map((request) => {
                                        const dishes = JSON.parse(request.favoriteDishes);
                                        return (
                                            <motion.div
                                                key={request.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setSelectedRequest(request)}
                                                className={`p-4 rounded-2xl cursor-pointer transition-all ${selectedRequest?.id === request.id
                                                    ? 'bg-primary/10 border-2 border-primary'
                                                    : 'bg-white/50 border border-primary/10 hover:border-primary/30'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs font-mono text-foreground/40">
                                                        {new Date(request.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${request.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                        request.status === 'GENERATED' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold text-foreground mb-2">
                                                    {dishes.slice(0, 2).join(', ')}
                                                    {dishes.length > 2 && '...'}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu Generation Panel */}
                    <div className="lg:col-span-2">
                        {selectedRequest ? (
                            <div className="glass p-8 rounded-3xl border border-primary/10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold text-primary">Request Details</h2>
                                    <span className="text-xs font-mono text-foreground/40">ID: {selectedRequest.id.slice(0, 8)}</span>
                                </div>

                                {/* Favorite Dishes */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <Sparkles size={20} className="text-accent" />
                                        Client's Favorite Dishes
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {JSON.parse(selectedRequest.favoriteDishes).map((dish: string, i: number) => (
                                            <span key={i} className="px-4 py-2 bg-accent/10 text-accent rounded-full font-medium text-sm">
                                                {dish}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Menu Section */}
                                {!selectedRequest.generatedMenu && (
                                    <div className="mb-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">Generate AI Menu</h3>
                                        <div className="flex items-center gap-4 mb-4">
                                            <label className="text-sm font-medium">Guest Count:</label>
                                            <input
                                                type="number"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                                className="px-4 py-2 rounded-full border border-primary/20 focus:outline-none focus:border-primary w-32"
                                            />
                                        </div>
                                        <button
                                            onClick={() => generateMenu(selectedRequest.id)}
                                            disabled={isGenerating}
                                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <ChefHat size={20} />
                                                    Generate Menu with AI
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Generated Menu */}
                                {selectedRequest.generatedMenu && (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-white rounded-2xl border border-primary/10">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Generated Menu</h3>
                                            <div className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-wrap">
                                                {selectedRequest.generatedMenu.content}
                                            </div>
                                        </div>

                                        {/* Pricing Section */}
                                        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
                                            <div className="flex items-start gap-3 mb-4">
                                                <AlertCircle size={20} className="text-amber-600 mt-1" />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Estimated Cost</h3>
                                                    <p className="text-sm text-amber-700 mb-3">
                                                        <strong>Please be advised this is an estimated cost.</strong> Final pricing will be determined based on specific event requirements, guest count, and service details.
                                                    </p>
                                                    <div className="text-3xl font-bold text-amber-900">
                                                        ${selectedRequest.generatedMenu.estimatedCost.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {!selectedRequest.generatedMenu.finalPrice && (
                                                <div className="mt-6 pt-6 border-t border-amber-200">
                                                    <h4 className="text-sm font-semibold text-amber-900 mb-3">Set Final Price</h4>
                                                    <div className="flex gap-3">
                                                        <div className="relative flex-1">
                                                            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                                                            <input
                                                                type="number"
                                                                value={finalPrice}
                                                                onChange={(e) => setFinalPrice(e.target.value)}
                                                                placeholder="Enter final price"
                                                                className="w-full pl-10 pr-4 py-3 rounded-full border border-amber-300 focus:outline-none focus:border-amber-500"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => setFinalPricing(selectedRequest.generatedMenu!.id)}
                                                            disabled={!finalPrice}
                                                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            <Send size={18} />
                                                            Approve & Set Price
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedRequest.generatedMenu.finalPrice && (
                                                <div className="mt-6 pt-6 border-t border-green-200 bg-green-50 -m-6 p-6 rounded-b-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 size={24} className="text-green-600" />
                                                        <div>
                                                            <div className="text-sm font-semibold text-green-900">Final Price Approved</div>
                                                            <div className="text-2xl font-bold text-green-700">
                                                                ${selectedRequest.generatedMenu.finalPrice.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="glass p-12 rounded-3xl border border-primary/10 flex flex-col items-center justify-center h-full min-h-[500px]">
                                <ChefHat size={64} className="text-primary/20 mb-4" />
                                <p className="text-foreground/40 text-center">
                                    Select a request from the list to view details and generate a menu
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
