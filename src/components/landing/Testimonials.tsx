"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden select-none">
      
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t('testimonials.title')}
          </h2>
          <div className="w-12 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>
        
        {/* 3-Column Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard 
            quote={t('testimonials.1.quote')}
            author={t('testimonials.1.author')}
            role={t('testimonials.1.role')}
          />
          <TestimonialCard 
            quote={t('testimonials.2.quote')}
            author={t('testimonials.2.author')}
            role={t('testimonials.2.role')}
          />
          <TestimonialCard 
            quote={t('testimonials.3.quote')}
            author={t('testimonials.3.author')}
            role={t('testimonials.3.role')}
          />
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="glass-card border border-slate-900/60 p-8 md:p-10 hover:border-slate-800 hover:bg-slate-900/40 transition-all duration-300 flex flex-col justify-between h-[280px]">
      
      <div>
        {/* Gold Stars */}
        <div className="flex gap-0.5 mb-5 text-amber-500">
          <Star size={13} fill="currentColor" className="stroke-none" />
          <Star size={13} fill="currentColor" className="stroke-none" />
          <Star size={13} fill="currentColor" className="stroke-none" />
          <Star size={13} fill="currentColor" className="stroke-none" />
          <Star size={13} fill="currentColor" className="stroke-none" />
        </div>
        
        {/* Quote text */}
        <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed italic font-medium">
          "{quote}"
        </p>
      </div>

      {/* Author details */}
      <div className="mt-6 pt-4 border-t border-slate-900/60">
        <div className="font-bold text-white text-xs tracking-wide">
          {author}
        </div>
        <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
          {role}
        </div>
      </div>

    </div>
  );
}
