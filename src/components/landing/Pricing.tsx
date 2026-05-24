"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Check, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const { t } = useTranslation();

  // Extract features securely (arrays from localization file)
  const freeFeatures = t('pricing.free_features') || [];
  const proFeatures = t('pricing.pro_features') || [];

  return (
    <section id="pricing" className="py-24 md:py-32 relative bg-slate-950/20 border-y border-slate-900 overflow-hidden select-none">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t('pricing.title')}
          </h2>
          <div className="w-12 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Two Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Starter (Free) Card */}
          <div className="glass-card border border-slate-900 hover:border-slate-800/80 p-8 md:p-10 flex flex-col justify-between transition-all select-none">
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-2 uppercase tracking-wider font-mono">
                {t('pricing.free_name')}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {t('pricing.free_price')}
                </span>
                <span className="text-slate-500 font-semibold text-xs">/ forever</span>
              </div>
              
              {/* Feature Checklist */}
              <ul className="space-y-4 mb-8">
                {Array.isArray(freeFeatures) && freeFeatures.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-300 font-semibold">
                    <Check size={14} className="text-primary-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href="/onboard" 
              className="w-full text-center py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 font-bold transition-all flex items-center justify-center gap-2 group text-sm"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Growth Pro (Paid) Card */}
          <div className="glass-card border-2 border-primary-500/30 hover:border-primary-500/50 p-8 md:p-10 flex flex-col justify-between relative transition-all shadow-2xl shadow-primary-500/5 select-none">
            
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary-500 text-slate-950 text-[9px] font-black rounded-full tracking-widest uppercase shadow-md font-mono select-none">
              {t('pricing.recommended')}
            </div>

            <div>
              <h3 className="text-lg font-bold text-primary-400 mb-2 uppercase tracking-wider font-mono">
                {t('pricing.pro_name')}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  {t('pricing.pro_price')}
                </span>
                <span className="text-slate-400 font-bold text-sm">
                  {t('pricing.pro_period')}
                </span>
              </div>
              
              {/* Feature Checklist */}
              <ul className="space-y-4 mb-8">
                {Array.isArray(proFeatures) && proFeatures.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-200 font-bold">
                    <Check size={14} className="text-primary-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href="/onboard" 
              className="w-full text-center py-4 rounded-2xl bg-primary-500 text-slate-950 hover:bg-primary-600 font-extrabold transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 group text-sm"
            >
              <span>Unlock Growth Pro</span>
              <ArrowRight size={14} className="stroke-[3] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
