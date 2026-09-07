import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  User, 
  Check, 
  X,
  Send
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { SupportTicket } from '../../types';

export const AdminSupport: React.FC = () => {
  const { supportTickets, resolveSupportTicket, showNotification } = useRide();
  const [filter, setFilter] = useState<'All' | 'open' | 'in_progress' | 'resolved'>('All');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const filteredTickets = supportTickets.filter(t => {
    if (filter !== 'All' && t.status !== filter) return false;
    return true;
  });

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    showNotification('Reply Dispatched', `Admin response sent to ${selectedTicket.userName}.`, 'success');
    resolveSupportTicket(selectedTicket.id);
    setSelectedTicket(null);
    setReplyText('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display">Support Desk & Safety Incident Management</h2>
          <p className="text-xs text-slate-400">Resolve passenger disputes, lost items, and driver partner inquiries</p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl">
          {(['All', 'open', 'in_progress', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === tab ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map(ticket => {
          const isUrgent = ticket.priority === 'urgent' || ticket.priority === 'high';

          return (
            <div
              key={ticket.id}
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">#{ticket.id}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                    ticket.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{ticket.userName}</span>
                    <span className="text-[10px] text-slate-400">({ticket.userRole})</span>
                  </p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isUrgent ? 'bg-rose-900/60 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100">{ticket.subject}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{ticket.message}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{ticket.createdAt}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Review & Reply
                  </button>
                  {ticket.status !== 'resolved' && (
                    <button
                      onClick={() => resolveSupportTicket(ticket.id)}
                      className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                      title="Quick Resolve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-mono">Ticket #{selectedTicket.id} • {selectedTicket.userRole.toUpperCase()}</span>
              <h3 className="text-base font-extrabold text-white">{selectedTicket.subject}</h3>
              <p className="text-xs text-slate-400">Submitted by {selectedTicket.userName} ({selectedTicket.userPhone})</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-200">
              <p className="font-semibold text-slate-400 text-[10px] mb-1">Issue Description:</p>
              {selectedTicket.message}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Super Admin Response / Resolution Note:</label>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type resolution message to passenger/driver..."
                rows={3}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSendReply}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Resolution & Close Ticket</span>
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
