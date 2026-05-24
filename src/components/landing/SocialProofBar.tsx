"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { ShieldCheck, Zap, Users } from 'lucide-react';

export default function SocialProofBar() {
  const { t } = useTranslation();

  return (
    <section className="py-12 border-y border-[#022f42]/10 bg-white select-none">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Ticker Title */}
        <p className="text-[10px] font-black text-[#1e4a62] uppercase tracking-[0.25em] text-center mb-8">
          {t('social_proof.title')}
        </p>
        
        {/* Brand Logos Row */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-16 opacity-50 hover:opacity-80 transition-opacity duration-300 mb-10 select-none font-black text-sm text-[#022f42]">
          <span className="select-none tracking-tight">WhatsApp Business</span>
          <span className="select-none tracking-tight">Meta Partner</span>
          <span className="select-none tracking-tight">Billplz Gateway</span>
          <span className="select-none tracking-tight">Google Sheets</span>
          <span className="select-none tracking-tight">Supabase</span>
        </div>

        {/* High-Impact Metric Snapshot Badges */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-3xl mx-auto">
          
          {/* Badge 1: Bookings */}
          <div className="w-full sm:w-1/2 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#e6f2fa] border-2 border-[#022f42]/10 shadow-sm hover:shadow-md hover:border-[#ffd800]/50 transition-all duration-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd800] shrink-0 animate-ping" />
            <div className="text-left">
              <div className="text-base font-black text-[#022f42] uppercase tracking-tight mb-1">
                {t('social_proof.metric_bookings')}
              </div>
              <div className="text-[10px] text-[#1e4a62] font-black uppercase tracking-wider">Processed through our platform</div>
            </div>
          </div>
          
          {/* Badge 2: No-show */}
          <div className="w-full sm:w-1/2 flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#e6f2fa] border-2 border-[#022f42]/10 shadow-sm hover:shadow-md hover:border-[#ffd800]/50 transition-all duration-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077cc] shrink-0 animate-pulse" />
            <div className="text-left">
              <div className="text-base font-black text-[#022f42] uppercase tracking-tight mb-1">
                {t('social_proof.metric_noshow')}
              </div>
              <div className="text-[10px] text-[#1e4a62] font-black uppercase tracking-wider">Due to upfront deposits</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
