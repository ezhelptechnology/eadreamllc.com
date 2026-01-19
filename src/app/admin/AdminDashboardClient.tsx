'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import AdminBot from '@/components/AdminBot';

interface AdminDashboardClientProps {
    userEmail: string;
}

export default function AdminDashboardClient({ userEmail }: AdminDashboardClientProps) {
    const handleLogout = () => {
        signOut({ callbackUrl: '/admin/login' });
    };

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
            <div className="container max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-accent rounded-2xl">
                                <ChefHat size={32} className="text-black" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Admin Portal</h1>
                                <p className="text-white/60">Manage proposals with the AI Admin Bot</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-white/60 text-sm hidden sm:block">{userEmail}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Admin Bot */}
                <AdminBot />

                <div className="mt-8 text-center">
                    <p className="text-white/40 text-sm">
                        Type <span className="text-accent font-mono">list</span> to view all requests •
                        Type <span className="text-accent font-mono">help</span> for more commands
                    </p>
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
                    background: var(--accent);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
