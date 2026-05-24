"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Award, DollarSign, Share2, Users } from 'lucide-react';

export default function ReferralSection() {
  const { t } = useTranslation();

  return (
    <section id="partner" className="py-24 md:py-32 relative bg-slate-950/20 border-y border-slate-900 overflow-hidden select-none">
      
      {/* Background neon orbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Program Copy */}
          <div className="lg:col-span-6 flex flex-col text-center lg:text-left items-center lg:items-start">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 mb-6 font-mono text-[9px] font-extrabold tracking-widest uppercase text-primary-400">
              <Award size={12} className="text-primary-400 shrink-0" />
              <span>{t('referral.title')}</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-6">
              {t('referral.subtitle')}
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-medium">
              {t('referral.desc')}
            </p>

            {/* CTA Link */}
            <button className="px-8 py-3.5 rounded-full bg-slate-900 border border-slate-850 hover:bg-slate-800 hover:border-slate-700 text-white font-extrabold text-sm transition-all flex items-center gap-2">
              <Share2 size={14} className="text-primary-400 shrink-0" />
              <span>{t('referral.cta')}</span>
            </button>

          </div>

          {/* Right Column: Interactive Referral Commission Dashboard Mockup */}
          <div className="lg:col-span-6 relative w-full max-w-md mx-auto">
            
            {/* Glow background */}
            <div className="absolute inset-0 bg-primary-500/5 blur-[30px] rounded-3xl -z-10" />

            <div className="glass-card border border-slate-800/80 p-6 md:p-8 relative overflow-hidden select-none">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-900">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Dashboard</span>
                <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none">
                  Active Partner
                </span>
              </div>

              {/* Commission Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                
                {/* Stat 1 */}
                <div className="bg-[#0d1212]/50 border border-slate-850 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Users size={12} className="text-primary-400" />
                    <span>Referrals</span>
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">12 active</div>
                  <span className="text-[9px] text-slate-500 font-semibold mt-1 block">+2 this month</span>
                </div>

                {/* Stat 2 */}
                <div className="bg-[#0d1212]/50 border border-slate-855 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <DollarSign size={12} className="text-primary-400" />
                    <span>Payouts</span>
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">RM 1,422.00</div>
                  <span className="text-[9px] text-slate-500 font-semibold mt-1 block">Paid monthly via bank</span>
                </div>

              </div>

              {/* Recurring Income Banner */}
              <div className="bg-primary-500/5 border border-primary-500/10 p-4.5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-primary-400 uppercase tracking-widest mb-1 font-mono">
                    Estimated Monthly Reward
                  </div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    RM 189.60
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md shadow-primary-500/10">
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
