'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, XCircle, Clock, DollarSign, Calendar,
    Users, TrendingUp, AlertCircle, FileText, Send,
    Edit, Eye, Download, RefreshCw, ChevronDown
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Proposal {
    id: string;
    rawId: string;
    client: string;
    clientEmail: string;
    eventDate: string;
    eventType: string;
    guests: number;
    total: number;
    status: string;
    agent2Score?: number;
    riskLevel?: string;
}

interface Suggestion {
    type: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    proposal_id?: string;
    client_name?: string;
    description: string;
    potential_revenue?: number;
    count?: number;
}

interface Metrics {
    pending_count: number;
    follow_ups_needed: number;
    proposals_this_month: number;
    approved_this_month: number;
    close_rate: number;
    revenue_this_month: number;
}

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

export default function AdminDashboard() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [proposalsRes, agent2Res] = await Promise.all([
                fetch('/api/admin/proposals'),
                fetch('/api/agent2/initialize')
            ]);

            if (proposalsRes.ok) {
                const data = await proposalsRes.json();
                setProposals(data.proposals || []);
            }

            if (agent2Res.ok) {
                const data = await agent2Res.json();
                setSuggestions(data.suggestions || []);
                setMetrics(data.metrics || null);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleApprove = async (proposalId: string) => {
        try {
            const res = await fetch(`/api/admin/proposals/${proposalId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: 'admin' })
            });
            if (res.ok) {
                loadData();
                setSelectedProposal(null);
            }
        } catch (error) {
            console.error('Error approving:', error);
        }
    };

    const handleDeny = async (proposalId: string) => {
        try {
            const res = await fetch(`/api/admin/proposals/${proposalId}/deny`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_id: 'admin' })
            });
            if (res.ok) {
                loadData();
                setSelectedProposal(null);
            }
        } catch (error) {
            console.error('Error denying:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
            {/* Header */}
            <DashboardHeader onRefresh={loadData} loading={loading} />

            {/* Metrics Overview */}
            <MetricsGrid metrics={metrics} />

            {/* Agent 2 Intelligence Panel */}
            <Agent2Panel suggestions={suggestions} />

            {/* Proposals Table */}
            <ProposalsTable
                proposals={proposals}
                filter={filter}
                onSelectProposal={setSelectedProposal}
                onFilterChange={setFilter}
                loading={loading}
            />

            {/* Proposal Detail Modal */}
            <AnimatePresence>
                {selectedProposal && (
                    <ProposalDetailModal
                        proposal={selectedProposal}
                        onClose={() => setSelectedProposal(null)}
                        onApprove={() => handleApprove(selectedProposal.rawId)}
                        onDeny={() => handleDeny(selectedProposal.rawId)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================================================
// DASHBOARD HEADER
// =============================================================================

function DashboardHeader({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
    return (
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Control Center</h1>
                        <p className="text-sm text-white/60 mt-1">
                            Powered by Agent 2 AI • Real-time insights
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>

                        <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-white transition-all">
                            New Proposal
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right">
                                <div className="text-sm font-semibold">Admin</div>
                                <div className="text-xs text-white/60">Full Access</div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-white rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// METRICS GRID
// =============================================================================

function MetricsGrid({ metrics }: { metrics: Metrics | null }) {
    const metricCards = [
        {
            label: 'Pending Review',
            value: metrics?.pending_count || 0,
            change: `${metrics?.follow_ups_needed || 0} need follow-up`,
            icon: Clock,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10'
        },
        {
            label: 'This Month Revenue',
            value: `$${(metrics?.revenue_this_month || 0).toLocaleString()}`,
            change: `${metrics?.approved_this_month || 0} approved`,
            icon: DollarSign,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10'
        },
        {
            label: 'Proposals',
            value: metrics?.proposals_this_month || 0,
            change: 'Last 30 days',
            icon: FileText,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10'
        },
        {
            label: 'Close Rate',
            value: `${metrics?.close_rate || 0}%`,
            change: 'This month',
            icon: TrendingUp,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricCards.map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 ${metric.bgColor} rounded-xl`}>
                                <metric.icon className={metric.color} size={24} />
                            </div>
                        </div>

                        <div className="text-3xl font-bold mb-1">{metric.value}</div>
                        <div className="text-sm text-white/60">{metric.label}</div>
                        <div className="text-xs text-white/40 mt-2">{metric.change}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// =============================================================================
// AGENT 2 INTELLIGENCE PANEL
// =============================================================================

function Agent2Panel({ suggestions }: { suggestions: Suggestion[] }) {
    const [expanded, setExpanded] = useState(true);

    const priorityConfig = {
        HIGH: { bg: 'bg-red-400/5', border: 'border-red-400/20', text: 'text-red-400', icon: AlertCircle },
        MEDIUM: { bg: 'bg-yellow-400/5', border: 'border-yellow-400/20', text: 'text-yellow-400', icon: Clock },
        LOW: { bg: 'bg-blue-400/5', border: 'border-blue-400/20', text: 'text-blue-400', icon: FileText }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-4">
            <motion.div
                className="bg-white/5 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Header */}
                <div
                    className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-b border-[#D4AF37]/20 cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-sm">A2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Agent 2 Intelligence</h3>
                                <p className="text-xs text-white/60">AI-powered recommendations</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[#D4AF37]">
                                {suggestions.length} insights
                            </span>
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown size={20} />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 space-y-4">
                                {suggestions.length === 0 ? (
                                    <div className="text-center text-white/60 py-8">
                                        <CheckCircle size={32} className="mx-auto mb-3 text-green-400" />
                                        <p>All caught up! No urgent actions needed.</p>
                                    </div>
                                ) : (
                                    suggestions.slice(0, 5).map((suggestion, idx) => {
                                        const config = priorityConfig[suggestion.priority];
                                        const Icon = config.icon;

                                        return (
                                            <div
                                                key={idx}
                                                className={`flex items-start gap-4 p-4 ${config.bg} border ${config.border} rounded-xl`}
                                            >
                                                <div className={`p-2 ${config.bg} rounded-lg`}>
                                                    <Icon className={config.text} size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-semibold ${config.text} mb-1`}>
                                                        {suggestion.type.replace(/_/g, ' ')}
                                                    </h4>
                                                    <p className="text-sm text-white/80 mb-3">
                                                        {suggestion.description}
                                                    </p>
                                                    {suggestion.potential_revenue && (
                                                        <span className="text-xs text-green-400">
                                                            💰 +${suggestion.potential_revenue.toLocaleString()} potential
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

// =============================================================================
// PROPOSALS TABLE
// =============================================================================

function ProposalsTable({
    proposals,
    filter,
    onSelectProposal,
    onFilterChange,
    loading
}: {
    proposals: Proposal[];
    filter: string;
    onSelectProposal: (p: Proposal) => void;
    onFilterChange: (f: string) => void;
    loading: boolean;
}) {
    const filters = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SENT', 'DENIED'];

    const filteredProposals = filter === 'ALL'
        ? proposals
        : proposals.filter(p => p.status === filter);

    const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ size?: number }> }> = {
        DRAFT: { label: 'Draft', color: 'gray', icon: FileText },
        PENDING_REVIEW: { label: 'Pending', color: 'yellow', icon: Clock },
        APPROVED: { label: 'Approved', color: 'green', icon: CheckCircle },
        SENT: { label: 'Sent', color: 'purple', icon: Send },
        MODIFIED_PENDING_SEND: { label: 'Modified', color: 'blue', icon: Edit },
        DENIED: { label: 'Denied', color: 'red', icon: XCircle }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* Table Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Proposals</h2>

                        {/* Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {filters.map(f => (
                                <button
                                    key={f}
                                    onClick={() => onFilterChange(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    {f.replace(/_/g, ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-white/60">
                            <RefreshCw size={32} className="mx-auto mb-3 animate-spin" />
                            <p>Loading proposals...</p>
                        </div>
                    ) : filteredProposals.length === 0 ? (
                        <div className="p-12 text-center text-white/60">
                            <FileText size={32} className="mx-auto mb-3" />
                            <p>No proposals found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Event</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Guests</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProposals.map((proposal, index) => {
                                    const status = statusConfig[proposal.status] || statusConfig.DRAFT;
                                    const Icon = status.icon;

                                    return (
                                        <motion.tr
                                            key={proposal.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                                            onClick={() => onSelectProposal(proposal)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-[#D4AF37]">{proposal.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold">{proposal.client}</div>
                                                <div className="text-xs text-white/60">{proposal.clientEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">{proposal.eventDate || 'TBD'}</div>
                                                <div className="text-xs text-white/60">{proposal.eventType || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Users size={14} className="inline mr-1" />
                                                {proposal.guests}
                                            </td>
                                            <td className="px-6 py-4 font-semibold">
                                                ${proposal.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={proposal.status} config={statusConfig} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                        onClick={(e) => { e.stopPropagation(); onSelectProposal(proposal); }}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                    <div className="text-sm text-white/60">
                        Showing {filteredProposals.length} of {proposals.length} proposals
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

function StatusBadge({
    status,
    config
}: {
    status: string;
    config: Record<string, { label: string; color: string; icon: React.ComponentType<{ size?: number }> }>;
}) {
    const { label, color, icon: Icon } = config[status] || config.DRAFT;

    const colorClasses: Record<string, string> = {
        yellow: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
        green: 'bg-green-400/10 text-green-400 border-green-400/20',
        blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
        red: 'bg-red-400/10 text-red-400 border-red-400/20',
        purple: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
        gray: 'bg-gray-400/10 text-gray-400 border-gray-400/20'
    };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${colorClasses[color]}`}>
            <Icon size={14} />
            {label}
        </div>
    );
}

// =============================================================================
// PROPOSAL DETAIL MODAL
// =============================================================================

function ProposalDetailModal({
    proposal,
    onClose,
    onApprove,
    onDeny
}: {
    proposal: Proposal;
    onClose: () => void;
    onApprove: () => void;
    onDeny: () => void;
}) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'pricing', label: 'Pricing', icon: DollarSign },
        { id: 'calendar', label: 'Schedule', icon: Calendar }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-zinc-900 border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{proposal.id}</h2>
                            <p className="text-white/60">Client: {proposal.client}</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mt-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === tab.id
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Client Name</label>
                                <div className="text-lg font-semibold">{proposal.client}</div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Event Date</label>
                                <div className="text-lg font-semibold">{proposal.eventDate || 'TBD'}</div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Event Type</label>
                                <div className="text-lg font-semibold">{proposal.eventType || 'Special Event'}</div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Guest Count</label>
                                <div className="text-lg font-semibold">{proposal.guests}</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-sm text-white/60 mb-1">Headcount</div>
                                    <div className="text-2xl font-bold">{proposal.guests}</div>
                                </div>
                                <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl">
                                    <div className="text-sm text-[#D4AF37] mb-1">Total</div>
                                    <div className="text-2xl font-bold text-[#D4AF37]">
                                        ${proposal.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calendar' && (
                        <div className="text-center text-white/60 py-8">
                            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Calendar integration coming soon</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-white/60">
                            Status: <span className="font-semibold">{proposal.status.replace(/_/g, ' ')}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onDeny}
                                className="px-6 py-3 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl font-semibold hover:bg-red-400/20 transition-all"
                            >
                                Deny
                            </button>

                            <button
                                onClick={onApprove}
                                className="px-6 py-3 bg-[#D4AF37] text-black rounded-xl font-semibold hover:bg-white transition-all shadow-xl"
                            >
                                Approve & Send
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
