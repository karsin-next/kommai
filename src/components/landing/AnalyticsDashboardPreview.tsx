"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Bot, Calendar, CreditCard, MessageSquare, TrendingUp, Circle } from 'lucide-react';

interface BookingLog {
  id: number;
  time: string;
  customer: string;
  service: string;
  status: 'paid' | 'confirmed';
}

const initialLogs: BookingLog[] = [
  { id: 1, time: "2 min ago", customer: "+6012-***4981", service: "Massage Session", status: "paid" },
  { id: 2, time: "15 min ago", customer: "+6017-***3329", service: "Table for 4 pax", status: "confirmed" },
  { id: 3, time: "42 min ago", customer: "+6011-***8822", service: "Haircut & Wash", status: "confirmed" },
  { id: 4, time: "1 hour ago", customer: "+6019-***1120", service: "Car Detailing", status: "paid" },
];

const servicePool = [
  { name: "Executive Suite Booking", status: "confirmed" },
  { name: "Full Body Massage", status: "paid" },
  { name: "Teeth Whitening", status: "confirmed" },
  { name: "Dinner Reservation", status: "confirmed" },
  { name: "Premium Car Polish", status: "paid" }
];

export default function AnalyticsDashboardPreview() {
  const { t } = useTranslation();
  
  // Real-time ticking states
  const [bookingsCount, setBookingsCount] = useState(18);
  const [depositsCount, setDepositsCount] = useState(540);
  const [chatsCount, setChatsCount] = useState(247);
  const [logs, setLogs] = useState<BookingLog[]>(initialLogs);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time bookings rolling in
      setBookingsCount(prev => prev + (Math.random() > 0.6 ? 1 : 0));
      setDepositsCount(prev => prev + (Math.random() > 0.7 ? 30 : 0));
      setChatsCount(prev => prev + Math.floor(Math.random() * 3 + 1));

      // Append new random booking logs
      if (Math.random() > 0.6) {
        const randService = servicePool[Math.floor(Math.random() * servicePool.length)];
        const randNum = `+601${Math.floor(Math.random() * 9)}-***${Math.floor(Math.random() * 9000 + 1000)}`;
        const newLog: BookingLog = {
          id: Date.now(),
          time: "Just now",
          customer: randNum,
          service: randService.name,
          status: randService.status as 'paid' | 'confirmed'
        };

        setLogs(prev => [
          newLog,
          ...prev.map(log => {
            if (log.time === "Just now") return { ...log, time: "1 min ago" };
            if (log.time.includes("min")) {
              const minutes = parseInt(log.time) + 1;
              return { ...log, time: `${minutes} min ago` };
            }
            return log;
          }).slice(0, 3) // Keep top 4 logs
        ]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white border-2 border-[#022f42]/10 p-6 md:p-8 relative overflow-hidden rounded-[32px] shadow-md select-none">
      {/* Soft Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ffd800]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0077cc]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#022f42]/10">
        <div>
          <h3 className="text-xl font-black text-[#022f42] uppercase tracking-tighter flex items-center gap-2">
            <span>{t('dashboard_preview.title')}</span>
            <span className="text-[10px] tracking-wider uppercase bg-[#0077cc]/10 text-[#0077cc] px-2 py-0.5 rounded-full border border-[#0077cc]/20 font-black">
              Live Mockup
            </span>
          </h3>
          <p className="text-xs text-[#1e4a62] font-semibold mt-1">{t('dashboard_preview.subtitle')}</p>
        </div>
        
        {/* Pulsing Auto-pilot status */}
        <div className="flex items-center gap-2 bg-[#e6f2fa] border border-[#022f42]/10 px-4 py-2 rounded-full shadow-sm select-none shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">
            {t('dashboard_preview.autopilot')}
          </span>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<Calendar size={16} className="text-[#0077cc]" />}
          label={t('dashboard_preview.bookings_today')}
          value={`${bookingsCount} / 25`}
          subtext="Free Limit Cap"
          progress={(bookingsCount / 25) * 100}
        />
        <StatCard 
          icon={<CreditCard size={16} className="text-[#10B981]" />}
          label={t('dashboard_preview.deposits_collected')}
          value={`RM ${depositsCount}.00`}
          subtext="Direct to your Bank"
        />
        <StatCard 
          icon={<MessageSquare size={16} className="text-[#0077cc]" />}
          label={t('dashboard_preview.messages_handled')}
          value={chatsCount.toString()}
          subtext="100% Autopilot chats"
        />
        <StatCard 
          icon={<TrendingUp size={16} className="text-[#ffd800]" />}
          label={t('dashboard_preview.conversion_rate')}
          value="94.2%"
          subtext="Chat-to-booking rate"
        />
      </div>

      {/* Central Visual Row: Bookings Graph + Live Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Sparkline / Bookings Trend */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border-2 border-[#022f42]/10 flex flex-col justify-between h-[240px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] font-black text-[#022f42] uppercase tracking-wider">Bookings Volume Trend</div>
            <span className="text-[10px] font-black text-[#10B981]">+14% vs last week</span>
          </div>
          
          <div className="flex-1 w-full relative min-h-[110px]">
            {/* SVG Line Graph */}
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0077cc" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0077cc" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Path line */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M 0,90 Q 50,40 100,60 T 200,20 T 300,10" 
                fill="none" 
                stroke="#0077cc" 
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Gradient Fill under path */}
              <path 
                d="M 0,90 Q 50,40 100,60 T 200,20 T 300,10 L 300,100 L 0,100 Z" 
                fill="url(#chartGradient)" 
              />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] text-[#1e4a62] font-black tracking-wider pt-2 border-t border-[#022f42]/10">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>
        </div>

        {/* Live Booking Activities Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border-2 border-[#022f42]/10 flex flex-col justify-between min-h-[240px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] font-black text-[#022f42] uppercase tracking-wider">Live Booking Stream</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span className="text-[9px] font-black text-[#10B981] uppercase tracking-widest">Real-time</span>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-hidden">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#e6f2fa]/40 border border-[#022f42]/5 text-xs hover:border-[#ffd800]/50 transition-all duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#1e4a62] border border-[#022f42]/10 shadow-sm">
                    <Bot size={13} />
                  </div>
                  <div>
                    <div className="font-black text-[#022f42] tracking-tight">{log.customer}</div>
                    <div className="text-[10px] text-[#1e4a62] font-bold">{log.service}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${
                    log.status === 'paid' 
                      ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                      : 'bg-[#0077cc]/10 text-[#0077cc] border-[#0077cc]/20'
                  }`}>
                    {log.status}
                  </span>
                  <div className="text-[9px] text-[#1e4a62]/60 font-bold mt-1">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, progress }: { icon: React.ReactNode; label: string; value: string; subtext: string; progress?: number }) {
  return (
    <div className="bg-[#e6f2fa]/55 border-2 border-[#022f42]/5 p-4 rounded-2xl flex flex-col justify-between hover:border-[#ffd800]/40 transition-all select-none">
      <div className="flex justify-between items-start mb-2 gap-1.5">
        <span className="text-[9px] font-black text-[#1e4a62] uppercase tracking-wider">{label}</span>
        <div className="w-6 h-6 rounded-lg bg-white border border-[#022f42]/10 flex items-center justify-center shrink-0 shadow-sm">
          {icon}
        </div>
      </div>
      
      <div>
        <div className="text-lg md:text-xl font-black text-[#022f42] tracking-tighter leading-none mb-1">{value}</div>
        
        {progress !== undefined ? (
          <div className="mt-2">
            <div className="w-full bg-[#022f42]/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#0077cc] h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[9px] text-[#1e4a62]/60 font-bold mt-1">{subtext}</div>
          </div>
        ) : (
          <span className="text-[9px] text-[#1e4a62]/60 font-bold">{subtext}</span>
        )}
      </div>
    </div>
  );
}
