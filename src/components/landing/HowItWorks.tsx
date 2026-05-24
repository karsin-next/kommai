"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Link2, Settings, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden border-y border-[#022f42]/10 bg-[#e6f2fa] select-none">
      
      {/* Floating Semi-Transparent Color Bubbles */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#ffd800] opacity-[0.08] blur-xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#0077cc] opacity-[0.06] blur-xl pointer-events-none -z-10 animate-bounce" style={{ animationDuration: '8s' }} />

      <div className="max-w-7xl mx-auto px-6 font-sans">
        
        {/* Title Block */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#022f42] uppercase tracking-tighter">
            {t('how_it_works.title')}
          </h2>
          <div className="border-b-4 border-[#ffd800] w-24 mx-auto mt-4" />
        </div>

        {/* 3 Steps Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          
          {/* Desktop Connecting Dotted Line */}
          <div className="absolute top-12 left-0 w-full h-1 border-t-4 border-dashed border-[#022f42]/15 hidden md:block -z-10" />

          {/* Step 1 */}
          <StepCard 
            number="1"
            icon={<Link2 size={24} />}
            iconBg="bg-[#ffd800] text-[#022f42]"
            title={t('how_it_works.step1_title').substring(3)} // remove the "1. " prefix if any
            desc={t('how_it_works.step1_desc')}
          />
          
          {/* Step 2 */}
          <StepCard 
            number="2"
            icon={<Settings size={24} />}
            iconBg="bg-[#0077cc] text-white"
            title={t('how_it_works.step2_title').substring(3)}
            desc={t('how_it_works.step2_desc')}
          />
          
          {/* Step 3 */}
          <StepCard 
            number="3"
            icon={<Sparkles size={24} />}
            iconBg="bg-[#10B981] text-white"
            title={t('how_it_works.step3_title').substring(3)}
            desc={t('how_it_works.step3_desc')}
          />

        </div>

      </div>
    </section>
  );
}

function StepCard({ number, icon, iconBg, title, desc }: { number: string; icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <div className="text-center group flex flex-col items-center">
      {/* Icon Badge / Number */}
      <div className="relative mb-6">
        <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300`}>
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#022f42] text-[#ffd800] text-xs font-black flex items-center justify-center select-none shadow-md border-2 border-white">
          {number}
        </span>
      </div>

      {/* Step Info */}
      <h3 className="text-lg md:text-xl font-black uppercase mb-3 text-[#022f42] tracking-tight group-hover:text-[#0077cc] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#1e4a62] leading-relaxed max-w-xs font-bold">
        {desc}
      </p>
    </div>
  );
}
