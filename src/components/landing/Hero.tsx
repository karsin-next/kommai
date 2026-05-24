"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, ShieldCheck, Sparkles } from 'lucide-react';
import ChatMockup from './ChatMockup';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-[#e6f2fa] to-white select-none">
      
      {/* Background Interactive Vector Mesh & Floating Color Bubbles */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #022f42 1px, transparent 1px), linear-gradient(to bottom, #022f42 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Floating Semi-Transparent Colorful Bubbles */}
      <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-[#ffd800] opacity-[0.12] blur-xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-40 h-40 rounded-full bg-[#0077cc] opacity-[0.10] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-28 h-28 rounded-full bg-[#ff6b6b] opacity-[0.08] blur-xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-[#10B981] opacity-[0.10] blur-xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Column: Premium Headline & Action */}
          <div className="lg:col-span-5 flex flex-col text-center lg:text-left items-center lg:items-start z-10">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffd800] text-[#022f42] mb-6 shadow-sm border border-[#022f42]/10 relative overflow-hidden group"
            >
              <Sparkles size={12} className="text-[#022f42] fill-current animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {t('hero.tagline')}
              </span>
            </motion.div>
 
            {/* Title with Custom Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.05] text-[#022f42] uppercase"
            >
              Your Free <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0077cc] via-[#022f42] to-[#10B981] bg-clip-text text-transparent filter saturate-150">
                WhatsApp Receptionist
              </span>
            </motion.h1>
 
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#1e4a62] text-sm sm:text-base leading-relaxed mb-10 font-medium max-w-xl"
            >
              {t('hero.subheadline')}
            </motion.p>
 
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
            >
              {/* Primary Yellow CTA Button */}
              <Link 
                href="/onboard" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#ffd800] text-[#022f42] font-black uppercase text-sm tracking-wider hover:bg-[#ffe033] hover:scale-105 transition-all shadow-md hover:shadow-lg transform flex items-center justify-center gap-2 group"
              >
                <span>Start Free – 10-Min Setup</span>
                <ArrowRight size={16} className="stroke-[3] group-hover:translate-x-1.5 transition-transform" />
              </Link>
              
              {/* Secondary Button */}
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#022f42] text-white hover:bg-[#033c54] transition-all font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-105 transform"
              >
                <span>{t('how_it_works.title')}</span>
              </Link>
            </motion.div>
 
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 border-t border-[#022f42]/10 pt-6 w-full text-xs text-[#1e4a62] font-bold"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#10B981] shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-[#0077cc] shrink-0" />
                <span>10-minute automated setup</span>
              </div>
            </motion.div>
 
          </div>
 
          {/* Right Column: High-Fidelity 3D Phone Deck */}
          <div className="lg:col-span-7 relative w-full flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 lg:gap-3 xl:gap-8 mt-12 lg:mt-0 select-none scale-90 sm:scale-95 md:scale-100 lg:scale-[0.88] xl:scale-100 transition-transform duration-300">
            
            {/* Left Mockup - Glowing teal ring, tilted left */}
            <motion.div
              initial={{ opacity: 0, x: 25, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02, rotate: -1, zIndex: 10 }}
              className="w-full max-w-[280px] sm:max-w-[290px] shrink-0 shadow-lg border-4 border-white rounded-[36px] ring-4 ring-[#10B981]/25 cursor-pointer overflow-hidden"
            >
              <ChatMockup index={0} />
            </motion.div>
            
            {/* Right Mockup - Glowing blue ring, tilted right */}
            <motion.div
              initial={{ opacity: 0, x: -25, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.02, rotate: 1, zIndex: 10 }}
              className="w-full max-w-[280px] sm:max-w-[290px] shrink-0 md:mt-16 shadow-lg border-4 border-white rounded-[36px] ring-4 ring-[#0077cc]/25 cursor-pointer overflow-hidden"
            >
              <ChatMockup index={1} />
            </motion.div>
 
          </div>
 
        </div>
      </div>
 
    </section>
  );
}
