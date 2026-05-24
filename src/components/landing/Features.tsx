"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Bot, CreditCard, Bell, Database, Users, LineChart } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 md:py-32 relative bg-white select-none">
      
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#ffd800]/5 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-[#0077cc]/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 font-sans">
        
        {/* Header Block */}
        <div className="text-center mb-20 select-none">
          <h2 className="text-4xl md:text-5xl font-black text-[#022f42] uppercase tracking-tighter">
            {t('features_section.title')}
          </h2>
          <p className="text-[#1e4a62] text-sm sm:text-base mt-4 max-w-xl mx-auto font-bold leading-relaxed">
            {t('features_section.subtitle')}
          </p>
          <div className="border-b-4 border-[#ffd800] w-24 mx-auto mt-6" />
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Bot size={22} className="text-[#0077cc] transition-colors" />}
            title={t('features_section.ai.title')}
            desc={t('features_section.ai.desc')}
            glowColor="from-[#0077cc]/10 to-[#10B981]/5"
            topAccent="border-t-[#ffd800]"
          />
          <FeatureCard 
            icon={<CreditCard size={22} className="text-[#10B981] transition-colors" />}
            title={t('features_section.payments.title')}
            desc={t('features_section.payments.desc')}
            glowColor="from-[#10B981]/10 to-[#0077cc]/5"
            topAccent="border-t-[#10B981]"
          />
          <FeatureCard 
            icon={<Bell size={22} className="text-[#ff6b6b] transition-colors" />}
            title={t('features_section.reminders.title')}
            desc={t('features_section.reminders.desc')}
            glowColor="from-[#ff6b6b]/10 to-[#ffd800]/5"
            topAccent="border-t-[#ff6b6b]"
          />
          <FeatureCard 
            icon={<Database size={22} className="text-[#0077cc] transition-colors" />}
            title={t('features_section.sync.title')}
            desc={t('features_section.sync.desc')}
            glowColor="from-[#0077cc]/10 to-[#ffd800]/5"
            topAccent="border-t-[#0077cc]"
          />
          <FeatureCard 
            icon={<Users size={22} className="text-[#ffd800] transition-colors" />}
            title={t('features_section.human.title')}
            desc={t('features_section.human.desc')}
            glowColor="from-[#ffd800]/10 to-[#10B981]/5"
            topAccent="border-t-[#ffd800]"
          />
          <FeatureCard 
            icon={<LineChart size={22} className="text-[#10B981] transition-colors" />}
            title={t('features_section.analytics.title')}
            desc={t('features_section.analytics.desc')}
            glowColor="from-[#10B981]/10 to-[#0077cc]/5"
            topAccent="border-t-[#10B981]"
          />
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, glowColor, topAccent }: { icon: React.ReactNode; title: string; desc: string; glowColor: string; topAccent: string }) {
  return (
    <div className={`bg-white border-2 border-[#022f42]/10 hover:border-[#ffd800]/50 ${topAccent} border-t-4 p-8 hover:-translate-y-1 transition-all duration-350 shadow-md rounded-xl group flex flex-col justify-between h-[250px] relative overflow-hidden select-none`}>
      
      {/* Glowing Neon Hover Bubble inside the card */}
      <div className={`absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br ${glowColor} blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10">
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-full bg-[#e6f2fa] border border-[#022f42]/10 flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 group-hover:bg-[#ffd800]/10 transition-all duration-350 shrink-0">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-black uppercase text-[#022f42] mb-2 tracking-tight group-hover:text-[#0077cc] transition-colors duration-300">
          {title}
        </h3>
      </div>
      
      {/* Description */}
      <p className="text-xs text-[#1e4a62] leading-relaxed font-bold relative z-10">
        {desc}
      </p>
    </div>
  );
}
