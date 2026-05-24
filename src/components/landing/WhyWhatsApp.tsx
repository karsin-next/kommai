"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';

export default function WhyWhatsApp() {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative select-none">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            {t('why_whatsapp.title')}
          </h2>
          <div className="w-12 h-0.5 bg-primary-500 mx-auto mt-4 rounded-full" />
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
    <div className="glass-card border border-slate-900/60 p-8 text-center hover:border-primary-500/10 transition-all select-none">
      <div className="text-4xl md:text-5xl font-black text-primary-400 tracking-tighter mb-2 bg-gradient-to-br from-primary-400 to-teal-400 bg-clip-text text-transparent">
        {stat}
      </div>
      <h3 className="text-sm font-bold text-white mb-2 tracking-tight">
        {desc}
      </h3>
      <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
        {detail}
      </p>
    </div>
  );
}
