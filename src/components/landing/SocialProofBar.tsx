"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { ShieldCheck, Zap, Users } from 'lucide-react';

export default function SocialProofBar() {
  const { t } = useTranslation();

  return (
    <section className="py-12 border-y border-slate-900 bg-slate-950/30 backdrop-blur-sm select-none">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Ticker Title */}
        <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.25em] text-center mb-8">
          {t('social_proof.title')}
        </p>
        
        {/* Brand Logos Row */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-16 opacity-40 hover:opacity-75 transition-opacity duration-300 mb-10 select-none">
          <span className="font-extrabold text-lg text-slate-300 select-none tracking-tight">WhatsApp Business</span>
          <span className="font-extrabold text-lg text-slate-300 select-none tracking-tight">Meta Partner</span>
          <span className="font-extrabold text-lg text-slate-300 select-none tracking-tight">Billplz Gateway</span>
          <span className="font-extrabold text-lg text-slate-300 select-none tracking-tight">Google Sheets</span>
          <span className="font-extrabold text-lg text-slate-300 select-none tracking-tight">Supabase</span>
        </div>

        {/* High-Impact Metric Snapshot Badges */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-3xl mx-auto">
          <div className="w-full sm:w-1/2 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
            <Zap size={18} className="text-primary-400 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-white leading-none mb-1">
                {t('social_proof.metric_bookings')}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Processed through our platform</div>
            </div>
          </div>
          
          <div className="w-full sm:w-1/2 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md">
            <Users size={18} className="text-primary-400 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-white leading-none mb-1">
                {t('social_proof.metric_noshow')}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Due to upfront deposits</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
