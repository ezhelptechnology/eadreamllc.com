'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, RefreshCcw, Clock, ExternalLink } from 'lucide-react';

interface ErrorLog {
    id: string;
    message: string;
    stack: string | null;
    source: string | null;
    path: string | null;
    timestamp: string;
}

export default function ErrorLogsPage() {
    const [logs, setLogs] = useState<ErrorLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/error-logs');
            const data = await response.json();
            if (data.logs) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearLogs = async () => {
        if (!confirm('Are you sure you want to clear all error logs?')) return;

        try {
            const response = await fetch('/api/admin/error-logs', { method: 'DELETE' });
            if (response.ok) {
                setLogs([]);
            }
        } catch (error) {
            console.error('Failed to clear logs:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.message.toLowerCase().includes(filter.toLowerCase()) ||
        log.source?.toLowerCase().includes(filter.toLowerCase()) ||
        log.path?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] text-white">
            <div className="container max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-serif mb-2">Error <span className="text-accent italic font-light">Monitoring</span></h1>
                        <p className="text-white/40">Real-time issue detection and diagnostics</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchLogs}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={clearLogs}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 size={20} />
                            <span>Clear Logs</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Filter by message, source, or path..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-accent transition-all"
                    />
                </div>

                {/* Logs List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <RefreshCcw size={40} className="animate-spin text-accent mx-auto mb-4" />
                            <p className="text-white/40">Loading diagnostics...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-20 glass rounded-[2.5rem] border border-white/10">
                            <AlertTriangle size={40} className="text-accent mx-auto mb-4 opacity-50" />
                            <p className="text-white/40">No errors detected. Everything looks stable!</p>
                        </div>
                    ) : (
                        filteredLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 rounded-2xl border border-white/10 hover:border-accent/30 transition-all group overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <h3 className="font-bold text-white/90 group-hover:text-white transition-colors">
                                            {log.message}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-white/40">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                        <span className="px-2 py-1 rounded bg-white/5 uppercase tracking-widest font-bold text-[10px]">
                                            {log.source || 'APP'}
                                        </span>
                                    </div>
                                </div>

                                {log.path && (
                                    <div className="flex items-center gap-2 text-xs text-accent/60 mb-4 bg-accent/5 px-3 py-1.5 rounded-lg w-fit">
                                        <ExternalLink size={12} />
                                        {log.path}
                                    </div>
                                )}

                                {log.stack && (
                                    <details className="mt-4">
                                        <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors uppercase tracking-widest font-bold">
                                            Stack Trace
                                        </summary>
                                        <pre className="mt-3 p-4 bg-black/50 rounded-xl text-[10px] font-mono text-white/60 overflow-x-auto border border-white/5 leading-relaxed">
                                            {log.stack}
                                        </pre>
                                    </details>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
