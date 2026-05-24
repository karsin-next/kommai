"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Check, CheckCheck } from 'lucide-react';

export default function DemoPage() {
  const [messages, setMessages] = useState<any[]>([]);

  const chatSequence = [
    { type: 'user', text: 'Hi, I would like to book a massage for tomorrow at 2 PM.', delay: 1000 },
    { type: 'bot', text: 'Hello! 👋 I can help you with that. Our Traditional Massage is RM 120 for 60 minutes. Shall I confirm your booking for tomorrow at 2:00 PM?', delay: 2500 },
    { type: 'user', text: 'Yes please!', delay: 4500 },
    { type: 'bot', text: 'Great! To secure your slot, we require a deposit of RM 30.', delay: 6000 },
    { type: 'bot', text: 'Please pay securely here: https://whatsupcrm.nextblaze.asia/pay/1234', delay: 7000 },
    { type: 'user', text: 'Paid!', delay: 10000 },
    { type: 'bot', text: 'Payment received ✅ Your booking for Traditional Massage tomorrow at 2:00 PM is confirmed. See you then!', delay: 11500 },
  ];

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    // Play the sequence
    chatSequence.forEach((msg) => {
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
      }, msg.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#022f42] flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-[#03384f] px-6 py-4 border-b border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ffd800] flex items-center justify-center text-[#022f42] shadow-sm">
            <Bot size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Wellness Center (AI)</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">online</span>
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[url('https://cdn.discordapp.com/attachments/111/111/whatsapp-bg-dark.png')] bg-cover bg-center">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[85%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed relative
                  ${msg.type === 'user' 
                    ? 'bg-[#1e5162] text-white rounded-tr-none border border-slate-600' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }
                `}>
                  {msg.text}
                  {msg.type === 'user' && (
                    <span className="absolute bottom-1.5 right-2 text-[#ffd800]">
                      <CheckCheck size={14} />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
