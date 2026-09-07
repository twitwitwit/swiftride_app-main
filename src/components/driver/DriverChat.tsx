import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MoreVertical, 
  Send, 
  MapPin, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  User, 
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { ChatMessage } from '../../types';

interface DriverChatProps {
  rideId?: string;
  onBack?: () => void;
}

export const DriverChat: React.FC<DriverChatProps> = ({ rideId, onBack }) => {
  const { 
    passenger, 
    driver, 
    activeRide, 
    chatMessages, 
    sendChatMessage, 
    showNotification 
  } = useRide();

  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Target ride id
  const currentRideId = rideId || activeRide?.id || 'TRIP-1024';
  const messages: ChatMessage[] = chatMessages[currentRideId] || [];

  const passengerName = activeRide?.passengerName || passenger.name || 'Passenger';
  const passengerAvatar = activeRide?.passengerAvatar || passenger.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const passengerPhone = activeRide?.passengerPhone || passenger.phone || '+63 917 555 0192';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    // Send as driver
    sendChatMessage(currentRideId, 'driver', inputMessage);
    setInputMessage('');
  };

  const handleQuickReply = (text: string) => {
    sendChatMessage(currentRideId, 'driver', text);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
      {/* Top Passenger Header (Driver Perspective) */}
      <div className="p-3 bg-slate-900 text-white border-b border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={passengerAvatar}
              alt={passengerName}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 absolute bottom-0 right-0"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-100">{passengerName}</h3>
              <span className="text-[10px] text-amber-400 font-extrabold">★ 4.95</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400 inline" /> Verified Passenger • <span className="text-emerald-400 font-bold">Active</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={`tel:${passengerPhone}`}
            className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center transition-colors border border-emerald-500/30"
            title="Call Passenger"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => showNotification('Driver Options', 'Contact dispatch, safety emergency line, or share ride telemetry.', 'info')}
            className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ride Summary Banner */}
      <div className="bg-slate-800/90 text-slate-200 px-3.5 py-2 border-b border-slate-700/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-[70%]">
          <div className="text-[11px] truncate">
            <span className="text-emerald-400 font-bold">● {activeRide?.pickup.name || 'Bagong Silang'}</span>
            <span className="text-slate-400 mx-1">→</span>
            <span className="text-rose-400 font-bold">● {activeRide?.dropoff.name || 'SM North EDSA'}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-amber-400">₱{activeRide?.fare || 180}.00</span>
        </div>
      </div>

      {/* Status Alert */}
      <div className="bg-slate-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-700 border-b border-slate-200">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Trip: {currentRideId}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">Your Vehicle: {driver.vehicle.model} ({driver.vehicle.plateNumber})</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-3 bg-slate-50">
        <div className="text-center my-1">
          <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
            Active Trip Conversation
          </span>
        </div>

        {messages.map((msg) => {
          // For the DRIVER view:
          // Driver is the current user (isMe = true -> RIGHT SIDE)
          // Passenger is the counterparty (isMe = false -> LEFT SIDE)
          const isMe = msg.senderRole === 'driver';

          if (msg.isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-medium inline-block max-w-[85%]">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Sender label for clarity */}
              <span className="text-[10px] text-slate-400 font-semibold mb-0.5 px-1">
                {isMe ? 'You (Driver)' : `${passengerName} (Passenger)`}
              </span>

              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                  isMe
                    ? 'bg-blue-600 text-white font-medium rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Driver Quick Action Chips */}
      <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleQuickReply("🚗 I'm on my way, ETA 3 mins.")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-full text-[11px] font-semibold shrink-0 transition-colors"
        >
          On my way
        </button>
        <button
          onClick={() => handleQuickReply("📍 I have arrived at the pickup point!")}
          className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-full text-[11px] font-semibold shrink-0 transition-colors"
        >
          I have arrived
        </button>
        <button
          onClick={() => handleQuickReply("👍 Sige po, hazard lights are turned on.")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[11px] font-semibold shrink-0 transition-colors"
        >
          Hazards on
        </button>
        <button
          onClick={() => handleQuickReply("Traffic is slightly heavy, arriving shortly!")}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[11px] font-semibold shrink-0 transition-colors"
        >
          Heavy traffic
        </button>
      </div>

      {/* Driver Message Input Box */}
      <form onSubmit={handleSend} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => showNotification('Driver Quick Cam', 'Upload pickup location photo or landmark snapshot.', 'info')}
          className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Message passenger..."
          className="flex-1 py-2 px-3 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-slate-800"
        />

        <button
          type="button"
          onClick={() => setInputMessage(prev => prev + ' 👍')}
          className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:bg-slate-700 text-slate-950 flex items-center justify-center shadow transition-all cursor-pointer font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
