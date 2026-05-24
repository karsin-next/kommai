"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, Link2, Settings, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden border-y border-slate-900 bg-slate-950/20 select-none">
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Block */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t('how_it_works.title')}
          </h2>
          <div className="w-12 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3 Steps Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          
          {/* Desktop Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-0.5 bg-slate-900 hidden md:block -z-10" />

          {/* Step 1 */}
          <StepCard 
            number="1"
            icon={<Link2 size={24} className="text-primary-400" />}
            title={t('how_it_works.step1_title').substring(3)} // remove the "1. " prefix if any
            desc={t('how_it_works.step1_desc')}
          />
          
          {/* Step 2 */}
          <StepCard 
            number="2"
            icon={<Settings size={24} className="text-primary-400" />}
            title={t('how_it_works.step2_title').substring(3)}
            desc={t('how_it_works.step2_desc')}
          />
          
          {/* Step 3 */}
          <StepCard 
            number="3"
            icon={<Sparkles size={24} className="text-primary-400" />}
            title={t('how_it_works.step3_title').substring(3)}
            desc={t('how_it_works.step3_desc')}
          />

        </div>

      </div>
    </section>
  );
}

function StepCard({ number, icon, title, desc }: { number: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center group flex flex-col items-center">
      {/* Icon Badge / Number */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg group-hover:border-primary-500/50 group-hover:scale-105 transition-all duration-300">
          {icon}
        </div>
        <span className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-primary-500 border-4 border-[#0a0f0f] text-slate-950 text-xs font-black flex items-center justify-center select-none shadow-md">
          {number}
        </span>
      </div>

      {/* Step Info */}
      <h3 className="text-lg md:text-xl font-bold mb-3 text-white tracking-tight group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium">
        {desc}
      </p>
    </div>
  );
}
