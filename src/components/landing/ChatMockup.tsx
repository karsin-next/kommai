"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Check, CheckCheck, Send, ShieldCheck, User } from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  text: string;
  delay: number;
  time: string;
}

interface Sequence {
  title: string;
  businessName: string;
  avatarLetter: string;
  avatarColor: string;
  messages: Message[];
}

const sequences: Sequence[] = [
  {
    title: "Restaurant Booking",
    businessName: "The Grillhouse & Co.",
    avatarLetter: "G",
    avatarColor: "bg-teal-600",
    messages: [
      { type: 'user', text: "Hi! Do you have a table for dinner tomorrow?", delay: 1000, time: "7:02 PM" },
      { type: 'ai', text: "Hello! We'd love to host you. What time are you planning for?", delay: 3000, time: "7:02 PM" },
      { type: 'user', text: "Around 8:00 PM.", delay: 5000, time: "7:03 PM" },
      { type: 'ai', text: "Perfect, we have open tables at 8:00 PM! How many guests will be joining us?", delay: 7500, time: "7:03 PM" },
      { type: 'user', text: "Table for 4 pax, please.", delay: 9500, time: "7:03 PM" },
      { type: 'ai', text: "Got it! May I have your name and phone number to secure this table?", delay: 12000, time: "7:04 PM" },
      { type: 'user', text: "Marcus Tan, 012-3456789", delay: 14500, time: "7:04 PM" },
      { type: 'ai', text: "Thank you, Marcus! Your table for 4 tomorrow (May 25th) at 8:00 PM is locked in. We'll send a WhatsApp reminder 24 hours before. See you! 🍽️✨", delay: 17000, time: "7:04 PM" },
    ]
  },
  {
    title: "Spa Massage Center",
    businessName: "Sari Wellness & Spa",
    avatarLetter: "S",
    avatarColor: "bg-emerald-600",
    messages: [
      { type: 'user', text: "Hello, do you have any slots for a 2-hour massage tomorrow afternoon?", delay: 1000, time: "2:15 PM" },
      { type: 'ai', text: "Hi there! Yes, we have slot available for our signature 2-hour Deep Tissue Massage at 3:00 PM. The price is RM120.", delay: 3500, time: "2:15 PM" },
      { type: 'user', text: "Sounds good! Can you book that slot for me?", delay: 5500, time: "2:16 PM" },
      { type: 'ai', text: "Excellent choice! To finalize this appointment, we require a small RM30 deposit. You can pay securely here: https://kommai.nextblaze.asia/pay/sari-105", delay: 8000, time: "2:16 PM" },
      { type: 'user', text: "Okay, deposit paid! Check it.", delay: 11000, time: "2:17 PM" },
      { type: 'ai', text: "Deposit verified! RM30 received successfully. ✅ Your appointment for tomorrow at 3:00 PM is fully confirmed. See you soon! 🌿🧘‍♀️", delay: 13500, time: "2:17 PM" },
    ]
  }
];

export default function ChatMockup({ index = 0 }: { index?: number }) {
  const [tick, setTick] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const seq = sequences[index];

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    setVisibleMessages([]); // Reset messages on sequence change or loop trigger

    let maxDelay = 0;
    seq.messages.forEach((msg) => {
      if (msg.delay > maxDelay) maxDelay = msg.delay;
      const t = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
      }, msg.delay);
      timeouts.push(t);
    });

    // Auto-loop after sequence completes (add 6 seconds of static display time)
    const loopTimeout = setTimeout(() => {
      setTick((prev) => prev + 1);
    }, maxDelay + 6000);
    timeouts.push(loopTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [index, tick, seq]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      {/* Glow Effect behind the phone */}
      <div className="absolute inset-0 bg-primary-500/5 blur-[40px] rounded-[50px] -z-10" />

      {/* iPhone Device Container */}
      <div className="relative bg-[#080d0d] border-[8px] border-slate-900 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05),0_0_40px_-5px_rgba(13,148,136,0.15)] overflow-hidden w-full h-[580px] flex flex-col">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <div className="w-10 h-1 bg-slate-900 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-10 pt-2 px-6 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none bg-slate-950/80 z-20 shrink-0">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal Icon */}
            <div className="flex gap-0.5 items-end">
              <div className="w-0.5 h-1.5 bg-slate-400 rounded-2xs" />
              <div className="w-0.5 h-2 bg-slate-400 rounded-2xs" />
              <div className="w-0.5 h-2.5 bg-slate-400 rounded-2xs" />
              <div className="w-0.5 h-3 bg-slate-400 rounded-2xs" />
            </div>
            {/* WiFi Icon */}
            <span className="text-[10px]">5G</span>
            {/* Battery Icon */}
            <div className="w-5 h-2.5 border border-slate-500 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-400 rounded-3xs" />
            </div>
          </div>
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#111c1c] px-4 py-3 border-b border-slate-900 flex items-center justify-between z-20 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar with dynamic brand letter */}
            <div className={`w-10 h-10 rounded-full ${seq.avatarColor} flex items-center justify-center font-extrabold text-white text-base shadow-inner relative shrink-0`}>
              {seq.avatarLetter}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#111c1c] rounded-full" />
            </div>

            <div className="flex flex-col">
              <div className="text-[13px] font-bold text-white tracking-wide truncate max-w-[160px] flex items-center gap-1">
                <span>{seq.businessName}</span>
                <span className="bg-primary-500 text-slate-950 p-0.5 rounded-full flex items-center justify-center" title="Verified Business">
                  <Check size={8} className="stroke-[4]" />
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest animate-pulse">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-primary-400 tracking-wider">
              {seq.title}
            </span>
          </div>
        </div>

        {/* WhatsApp Conversation Canvas */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#0a0f0f] relative scroll-smooth scrollbar-hide pb-8"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1a2424 1px, transparent 0)`,
            backgroundSize: '16px 16px',
          }}
        >
          <div className="text-center my-2">
            <span className="bg-slate-900/80 text-slate-500 border border-slate-800/40 text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full select-none shadow-sm">
              Today
            </span>
          </div>

          <AnimatePresence>
            {visibleMessages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[85%] p-3.5 rounded-2xl text-[12.5px] leading-relaxed shadow-lg relative tracking-wide
                  ${msg.type === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none border border-slate-700/60' 
                    : 'bg-primary-500 text-slate-950 rounded-tl-none font-semibold'
                  }
                `}>
                  {/* Message Text */}
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  
                  {/* Timestamp & Status Icon */}
                  <div className={`text-[8.5px] text-right mt-1.5 flex items-center justify-end gap-1 select-none ${
                    msg.type === 'user' ? 'text-slate-400' : 'text-slate-900/60'
                  }`}>
                    <span>{msg.time}</span>
                    {msg.type === 'user' && (
                      <CheckCheck size={11} className="text-primary-400 ml-0.5 shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Bar Mockup */}
        <div className="p-3 bg-[#0a0f0f] border-t border-slate-900 flex items-center gap-2 shrink-0 z-20">
          <div className="flex-1 bg-slate-900/80 border border-slate-800/80 rounded-full py-2.5 px-4 text-slate-500 text-xs flex items-center justify-between">
            <span>Type a message...</span>
            <div className="flex gap-2 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-primary-500 text-slate-950 flex items-center justify-center shadow-md shadow-primary-500/10 hover:scale-105 active:scale-95 transition-transform shrink-0">
            <Send size={14} className="fill-current stroke-[3] ml-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
