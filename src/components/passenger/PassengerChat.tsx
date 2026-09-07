import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MoreVertical, 
  Send, 
  MapPin, 
  Paperclip, 
  Smile, 
  Mic, 
  CheckCheck, 
  Car,
  ChevronRight
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { ChatMessage } from '../../types';

interface PassengerChatProps {
  rideId?: string;
  onBack?: () => void;
}

export const PassengerChat: React.FC<PassengerChatProps> = ({ rideId, onBack }) => {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    sendChatMessage(currentRideId, 'passenger', inputMessage);
    setInputMessage('');

    // If driver is simulated online, auto-respond if needed
    setTimeout(() => {
      if (Math.random() > 0.4) {
        const automatedDriverReplies = [
          "Noted po! Traffic is light on Commonwealth, almost there.",
          "Sige po boss, waiting outside.",
          "Roger that, turning into the gate now.",
          "Copy po, thank you for the update!"
        ];
        const randomReply = automatedDriverReplies[Math.floor(Math.random() * automatedDriverReplies.length)];
        sendChatMessage(currentRideId, 'driver', randomReply);
      }
    }, 2000);
  };

  const handleQuickReply = (text: string) => {
    sendChatMessage(currentRideId, 'passenger', text);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Driver Header (Slide 5) */}
      <div className="p-3 bg-white border-b border-slate-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={activeRide?.driverAvatar || driver.avatar}
              alt={activeRide?.driverName || driver.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-900">{activeRide?.driverName || driver.name}</h3>
              <span className="text-[10px] text-amber-600 font-extrabold">★ {driver.rating}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">542 trips • <span className="text-emerald-600 font-bold">Online</span></p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={`tel:${activeRide?.driverPhone || driver.phone}`}
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
            title="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => showNotification('Chat Options', 'Mute notifications, report driver, or share live route.', 'info')}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ride Summary Banner (Slide 5) */}
      <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-[70%]">
          <div className="text-[11px] truncate">
            <span className="text-emerald-600 font-bold">● {activeRide?.pickup.name || 'Bagong Silang'}</span>
            <span className="text-slate-400 mx-1">→</span>
            <span className="text-rose-600 font-bold">● {activeRide?.dropoff.name || 'SM North EDSA'}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-amber-600">₱{activeRide?.fare || 180}.00</span>
        </div>
      </div>

      {/* ETA & Vehicle Badge (Slide 5) */}
      <div className="bg-amber-50/60 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-700 border-b border-amber-100">
        <div className="flex items-center gap-1.5 font-semibold text-amber-900">
          <Car className="w-3.5 h-3.5 text-amber-600" />
          <span>ETA: {activeRide?.etaMins || 5} min</span>
          <span className="text-slate-400">•</span>
          <span>{driver.vehicle.model} ({driver.vehicle.plateNumber})</span>
        </div>
        <button 
          onClick={() => showNotification('Vehicle Info', `${driver.vehicle.model} - Metallic Black - Plate: ${driver.vehicle.plateNumber}`, 'info')}
          className="text-amber-700 font-bold hover:underline text-[10px]"
        >
          Details
        </button>
      </div>

      {/* Messages Scroll Area (Slide 5) */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-3 bg-slate-50/50">
        <div className="text-center my-1">
          <span className="text-[10px] bg-slate-200/60 text-slate-500 px-2.5 py-0.5 rounded-full font-medium">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderRole === 'passenger';
          
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="text-[10px] bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-medium inline-block max-w-[85%]">
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
              <span className="text-[10px] text-slate-400 font-semibold mb-0.5 px-1">
                {isMe ? 'You (Passenger)' : `${activeRide?.driverName || driver.name} (Driver)`}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                  isMe
                    ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-slate-800/80' : 'text-slate-400'}`}>
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-slate-900" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips (Slide 5) */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleQuickReply("📍 I am currently standing by the entrance gate.")}
          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors"
        >
          <MapPin className="w-3 h-3 text-amber-600" />
          <span>Send Location</span>
        </button>
        <button
          onClick={() => handleQuickReply("Hi Kuya, I'm here waiting outside!")}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[11px] font-semibold shrink-0 transition-colors"
        >
          I'm outside
        </button>
        <button
          onClick={() => handleQuickReply("Okay po, take your time.")}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[11px] font-semibold shrink-0 transition-colors"
        >
          No rush
        </button>
      </div>

      {/* Message Input Box (Slide 5) */}
      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200/70 flex items-center gap-2">
        <button
          type="button"
          onClick={() => showNotification('Photo Attachment', 'Select a picture from camera/gallery to send.', 'info')}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-2 px-3 bg-slate-100 rounded-full text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
        />

        <button
          type="button"
          onClick={() => setInputMessage(prev => prev + ' 😊')}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:bg-slate-200 text-slate-950 flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
