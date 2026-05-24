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
    <section id="pricing" className="py-24 md:py-32 relative bg-[#e6f2fa] border-y border-[#022f42]/10 overflow-hidden select-none">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#ffd800]/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />

      <div className="max-w-5xl mx-auto px-6 font-sans">
        
        {/* Header Block */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#022f42] uppercase tracking-tighter">
            {t('pricing.title')}
          </h2>
          <div className="border-b-4 border-[#ffd800] w-24 mx-auto mt-4" />
        </div>

        {/* Two Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Starter (Free) Card */}
          <div className="bg-white border-2 border-[#022f42]/10 p-8 md:p-10 flex flex-col justify-between rounded-[24px] shadow-md transition-all select-none hover:border-[#022f42]/20 hover:-translate-y-0.5 duration-300">
            <div>
              <h3 className="text-base font-black text-[#1e4a62]/80 mb-2 uppercase tracking-widest">
                {t('pricing.free_name')}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-black text-[#022f42] tracking-tighter">
                  {t('pricing.free_price')}
                </span>
                <span className="text-[#1e4a62] font-bold text-xs uppercase tracking-wider">/ forever</span>
              </div>
              
              {/* Feature Checklist - Green Checkmarks */}
              <ul className="space-y-4 mb-8">
                {Array.isArray(freeFeatures) && freeFeatures.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-[#1e4a62] font-bold">
                    <Check size={14} className="text-[#10B981] stroke-[3] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href="/onboard" 
              className="w-full text-center py-4 rounded-2xl bg-white border-2 border-[#022f42]/10 text-[#022f42] hover:bg-[#022f42] hover:text-white hover:border-[#022f42] transition-all duration-300 flex items-center justify-center gap-2 group text-xs font-black uppercase tracking-wider"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Growth Pro (Paid) Card - Accent Yellow Highlight */}
          <div className="bg-white border-4 border-[#ffd800] p-8 md:p-10 flex flex-col justify-between relative rounded-[24px] shadow-xl transition-all select-none hover:-translate-y-0.5 duration-300">
            
            {/* Recommended Badge */}
            <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#ffd800] text-[#022f42] text-[10px] font-black rounded-full tracking-[0.2em] uppercase shadow-md select-none">
              {t('pricing.recommended')}
            </div>

            <div>
              <h3 className="text-base font-black text-[#0077cc] mb-2 uppercase tracking-widest">
                {t('pricing.pro_name')}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl md:text-5xl font-black text-[#022f42] tracking-tighter">
                  {t('pricing.pro_price')}
                </span>
                <span className="text-[#1e4a62] font-bold text-xs uppercase tracking-wider">
                  {t('pricing.pro_period')}
                </span>
              </div>
              
              {/* Feature Checklist - Green Checkmarks */}
              <ul className="space-y-4 mb-8">
                {Array.isArray(proFeatures) && proFeatures.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-[#022f42] font-black">
                    <Check size={14} className="text-[#10B981] stroke-[3] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href="/onboard" 
              className="w-full text-center py-4 rounded-2xl bg-[#ffd800] text-[#022f42] hover:bg-[#ffe033] font-black uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2 group transform duration-300"
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
