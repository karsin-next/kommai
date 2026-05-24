"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Award, DollarSign, Share2, Users } from 'lucide-react';

export default function ReferralSection() {
  const { t } = useTranslation();

  return (
    <section id="partner" className="py-24 md:py-32 relative bg-white border-y border-[#022f42]/10 overflow-hidden select-none">
      
      {/* Background soft color bubbles */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#ffd800]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#0077cc]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Program Copy */}
          <div className="lg:col-span-6 flex flex-col text-center lg:text-left items-center lg:items-start">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6f2fa] border border-[#022f42]/10 text-[#022f42] mb-6 font-black text-[10px] tracking-[0.2em] uppercase">
              <Award size={12} className="text-[#0077cc] shrink-0" />
              <span>{t('referral.title')}</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-black text-[#022f42] uppercase tracking-tighter leading-none mb-6">
              {t('referral.subtitle')}
            </h2>

            {/* Description */}
            <p className="text-[#1e4a62] text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-bold">
              {t('referral.desc')}
            </p>

            {/* Secondary CTA Button Style */}
            <button className="px-8 py-3.5 rounded-full bg-[#022f42] border-2 border-transparent hover:border-[#ffd800] text-white hover:bg-[#033c54] font-black uppercase text-sm tracking-wider transition-all flex items-center gap-2 shadow-md hover:scale-105 transform">
              <Share2 size={14} className="text-[#ffd800] shrink-0" />
              <span>{t('referral.cta')}</span>
            </button>

          </div>

          {/* Right Column: Interactive Referral Commission Dashboard Mockup */}
          <div className="lg:col-span-6 relative w-full max-w-md mx-auto">
            
            {/* Glow background */}
            <div className="absolute inset-0 bg-[#ffd800]/5 blur-[30px] rounded-3xl -z-10" />

            <div className="bg-white border-2 border-[#022f42]/10 p-6 md:p-8 relative overflow-hidden shadow-md rounded-[32px] select-none">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#022f42]/10">
                <span className="text-xs font-black text-[#1e4a62] uppercase tracking-wider">Partner Dashboard</span>
                <span className="text-[9px] font-black text-[#10B981] uppercase tracking-widest bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded-full select-none">
                  Active Partner
                </span>
              </div>

              {/* Commission Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 font-sans">
                
                {/* Stat 1 */}
                <div className="bg-[#e6f2fa]/55 border-2 border-[#022f42]/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-[#1e4a62] text-[10px] font-black uppercase tracking-wider mb-2">
                    <Users size={12} className="text-[#0077cc]" />
                    <span>Referrals</span>
                  </div>
                  <div className="text-xl font-black text-[#022f42] tracking-tight">12 active</div>
                  <span className="text-[9px] text-[#1e4a62]/60 font-bold mt-1 block">+2 this month</span>
                </div>

                {/* Stat 2 */}
                <div className="bg-[#e6f2fa]/55 border-2 border-[#022f42]/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-[#1e4a62] text-[10px] font-black uppercase tracking-wider mb-2">
                    <DollarSign size={12} className="text-[#10B981]" />
                    <span>Payouts</span>
                  </div>
                  <div className="text-xl font-black text-[#022f42] tracking-tight">RM 1,422.00</div>
                  <span className="text-[9px] text-[#1e4a62]/60 font-bold mt-1 block">Paid monthly via bank</span>
                </div>

              </div>

              {/* Recurring Income Banner */}
              <div className="bg-[#ffd800]/10 border border-[#ffd800]/30 p-4.5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-[#022f42] uppercase tracking-widest mb-1">
                    Estimated Monthly Reward
                  </div>
                  <div className="text-2xl font-black text-[#022f42] tracking-tight">
                    RM 189.60
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#ffd800] text-[#022f42] flex items-center justify-center font-black text-lg shadow-sm shadow-[#ffd800]/10">
                  %
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
