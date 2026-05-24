"use client";

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative bg-white border-y border-[#022f42]/10 overflow-hidden select-none">
      
      {/* Background orbs */}
      <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-[#0077cc]/5 blur-xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#ff6b6b]/5 blur-xl pointer-events-none -z-10 animate-bounce" style={{ animationDuration: '6s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 font-sans">
        
        {/* Header Block */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#022f42] uppercase tracking-tighter">
            {t('testimonials.title')}
          </h2>
          <div className="border-b-4 border-[#ffd800] w-24 mx-auto mt-4" />
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
    <div className="bg-white border-2 border-[#022f42]/10 p-8 md:p-10 hover:border-[#ffd800]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[290px] relative rounded-xl shadow-md overflow-hidden select-none group hover:-translate-y-0.5">
      
      {/* Decorative large opening quotation mark behind text */}
      <div className="absolute -top-4 -left-2 text-[110px] font-black text-[#ffd800] opacity-20 pointer-events-none select-none font-serif leading-none group-hover:scale-105 transition-transform duration-300">
        “
      </div>

      <div className="relative z-10">
        {/* Accent Yellow Stars */}
        <div className="flex gap-0.5 mb-5 text-[#ffd800]">
          <Star size={13} fill="currentColor" className="stroke-none animate-pulse" />
          <Star size={13} fill="currentColor" className="stroke-none animate-pulse" style={{ animationDelay: '0.1s' }} />
          <Star size={13} fill="currentColor" className="stroke-none animate-pulse" style={{ animationDelay: '0.2s' }} />
          <Star size={13} fill="currentColor" className="stroke-none animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Star size={13} fill="currentColor" className="stroke-none animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        
        {/* Quote text */}
        <p className="text-[#1e4a62] text-xs sm:text-[13px] leading-relaxed italic font-bold">
          "{quote}"
        </p>
      </div>

      {/* Author details */}
      <div className="mt-6 pt-4 border-t border-[#022f42]/10 relative z-10">
        <div className="font-black text-[#022f42] text-xs tracking-wider uppercase">
          {author}
        </div>
        <div className="text-[10px] text-[#1e4a62]/75 font-black uppercase tracking-widest mt-0.5">
          {role}
        </div>
      </div>

    </div>
  );
}
