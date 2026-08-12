import React, { useState } from 'react';
import { X, GitFork, AlertTriangle, Link2 } from 'lucide-react';
import { TaskMapNode, RelationshipType } from '../types';

interface AddConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: TaskMapNode[];
    initialFromNodeId?: string;
    onAddConnection: (
        fromNodeId: string,
        toNodeId: string,
        relationship: RelationshipType,
        isCritical: boolean
    ) => void;
}

const RELATIONSHIPS: RelationshipType[] = [
    'Depends On',
    'Blocks',
    'Supports',
    'Related To',
    'Leads To',
    'Enables',
];

export const AddConnectionModal: React.FC<AddConnectionModalProps> = ({
    isOpen,
    onClose,
    nodes,
    initialFromNodeId,
    onAddConnection,
}) => {
    const [fromNodeId, setFromNodeId] = useState(initialFromNodeId || nodes[0]?.id || '');
    const [toNodeId, setToNodeId] = useState(
        nodes.find((n) => n.id !== (initialFromNodeId || nodes[0]?.id))?.id || ''
    );
    const [relationship, setRelationship] = useState<RelationshipType>('Depends On');
    const [isCritical, setIsCritical] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromNodeId || !toNodeId || fromNodeId === toNodeId) return;
        onAddConnection(fromNodeId, toNodeId, relationship, isCritical);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md neu-card p-6 rounded-3xl bg-[#E0E5EC] border border-white shadow-2xl space-y-5 relative">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-emerald-600 text-white">
                            <Link2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1a1c35]">Create Connection</h3>
                            <p className="text-xs text-[#717699] font-medium">Link two tasks on canvas</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl neu-button text-[#717699] hover:text-rose-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#717699]">From Task (Source)</label>
                        <select
                            value={fromNodeId}
                            onChange={(e) => setFromNodeId(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl neu-input text-xs font-bold text-[#1a1c35]"
                        >
                            {nodes.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.customTitle || n.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#717699]">To Task (Target)</label>
                        <select
                            value={toNodeId}
                            onChange={(e) => setToNodeId(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl neu-input text-xs font-bold text-[#1a1c35]"
                        >
                            {nodes
                                .filter((n) => n.id !== fromNodeId)
                                .map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.customTitle || n.id}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#717699]">Relationship Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {RELATIONSHIPS.map((rel) => (
                                <button
                                    key={rel}
                                    type="button"
                                    onClick={() => setRelationship(rel)}
                                    className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${relationship === rel
                                            ? 'neu-button text-[#549acb] bg-[#E0E5EC]'
                                            : 'neu-inset text-[#717699]'
                                        }`}
                                >
                                    {rel}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="neu-inset p-3.5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-[#1a1c35]">Critical Path Dependency</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={isCritical}
                            onChange={(e) => setIsCritical(e.target.checked)}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                    </div>

                    <div className="pt-3 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-2xl neu-button text-xs font-bold text-[#717699]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-2xl neu-button-primary font-extrabold text-xs text-white shadow-lg flex items-center space-x-2"
                        >
                            <GitFork className="w-4 h-4" />
                            <span>Connect Tasks</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
