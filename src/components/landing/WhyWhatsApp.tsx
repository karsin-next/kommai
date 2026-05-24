"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';

export default function WhyWhatsApp() {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative bg-[#e6f2fa] border-y border-[#022f42]/10 select-none">
      
      {/* Floating Semi-Transparent Bubbles */}
      <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-[#ff6b6b] opacity-[0.05] blur-xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#ffd800] opacity-[0.06] blur-xl pointer-events-none -z-10 animate-pulse" />

      <div className="max-w-5xl mx-auto px-6 font-sans">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#022f42] uppercase tracking-tighter">
            {t('why_whatsapp.title')}
          </h2>
          <div className="border-b-4 border-[#ffd800] w-24 mx-auto mt-4" />
        </div>

        {/* 3 Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <StatBox 
            stat={t('why_whatsapp.stat_rate')}
            desc={t('why_whatsapp.stat_rate_desc')}
            detail="Compared to just 15-20% for marketing emails."
          />
          
          <StatBox 
            stat={t('why_whatsapp.stat_conv')}
            desc={t('why_whatsapp.stat_conv_desc')}
            detail="Customers prefer chatting over filling forms."
          />
          
          <StatBox 
            stat={t('why_whatsapp.stat_speed')}
            desc={t('why_whatsapp.stat_speed_desc')}
            detail="Instant responses keep customers from leaving."
          />

        </div>

      </div>
    </section>
  );
}

function StatBox({ stat, desc, detail }: { stat: string; desc: string; detail: string }) {
  return (
    <div className="bg-white border-2 border-[#022f42]/10 p-8 text-center hover:border-[#ffd800]/50 shadow-md rounded-xl transition-all select-none group hover:-translate-y-0.5 duration-300">
      <div className="text-4xl md:text-5xl font-black text-[#0077cc] tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-300">
        {stat}
      </div>
      <h3 className="text-sm font-black uppercase text-[#022f42] mb-2 tracking-tight group-hover:text-[#0077cc] transition-colors">
        {desc}
      </h3>
      <p className="text-xs text-[#1e4a62] font-bold leading-relaxed">
        {detail}
      </p>
    </div>
  );
}
