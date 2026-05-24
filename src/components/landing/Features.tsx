"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Bot, CreditCard, Bell, Database, Users, LineChart } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 md:py-32 relative select-none">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-primary-500/5 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-teal-500/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-20 select-none">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t('features_section.title')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto font-medium leading-relaxed">
            {t('features_section.subtitle')}
          </p>
          <div className="w-12 h-1 bg-primary-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Bot size={22} className="text-primary-400 group-hover:text-primary-350 transition-colors" />}
            title={t('features_section.ai.title')}
            desc={t('features_section.ai.desc')}
            glowColor="from-primary-500/10 to-teal-500/5"
          />
          <FeatureCard 
            icon={<CreditCard size={22} className="text-primary-400 group-hover:text-primary-350 transition-colors" />}
            title={t('features_section.payments.title')}
            desc={t('features_section.payments.desc')}
            glowColor="from-teal-500/10 to-emerald-500/5"
          />
          <FeatureCard 
            icon={<Bell size={22} className="text-primary-400 group-hover:text-primary-350 transition-colors" />}
            title={t('features_section.reminders.title')}
            desc={t('features_section.reminders.desc')}
            glowColor="from-amber-500/10 to-primary-500/5"
          />
          <FeatureCard 
            icon={<Database size={22} className="text-primary-400 group-hover:text-primary-350 transition-colors" />}
            title={t('features_section.sync.title')}
            desc={t('features_section.sync.desc')}
            glowColor="from-emerald-500/10 to-primary-500/5"
          />
          <FeatureCard 
            icon={<Users size={22} className="text-primary-400 group-hover:text-primary-350 transition-colors" />}
            title={t('features_section.human.title')}
            desc={t('features_section.human.desc')}
            glowColor="from-primary-500/10 to-teal-500/5"
          />
          <FeatureCard 
            icon={<LineChart size={22} className="text-primary-400 group-hover:text-primary-350 transition-colors" />}
            title={t('features_section.analytics.title')}
            desc={t('features_section.analytics.desc')}
            glowColor="from-teal-500/10 to-primary-500/5"
          />
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, glowColor }: { icon: React.ReactNode; title: string; desc: string; glowColor: string }) {
  return (
    <div className="glass-card border border-slate-900/80 hover:border-primary-500/50 p-8 hover:-translate-y-1 transition-all duration-350 group flex flex-col justify-between h-[235px] relative overflow-hidden select-none">
      
      {/* Glowing Neon Hover Bubble inside the card */}
      <div className={`absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br ${glowColor} blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10">
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center mb-5 shadow-inner group-hover:scale-105 group-hover:border-primary-500/30 group-hover:bg-slate-900 transition-all duration-350 shrink-0">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors duration-300">
          {title}
        </h3>
      </div>
      
      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed font-semibold relative z-10">
        {desc}
      </p>
    </div>
  );
}
