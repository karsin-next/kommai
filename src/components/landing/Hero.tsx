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
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden select-none">
      
      {/* Background Interactive Vector Mesh & Glows */}
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #111818 1px, transparent 1px), linear-gradient(to bottom, #111818 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-primary-500/10 to-transparent blur-[160px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-teal-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary-400/8 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Column: Premium Headline & Action (Takes 5 cols) */}
          <div className="lg:col-span-5 flex flex-col text-center lg:text-left items-center lg:items-start z-10">
            
            {/* Tagline Badge with Neon Glow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/80 text-slate-300 mb-6 shadow-[0_0_20px_rgba(13,148,136,0.1)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles size={12} className="text-primary-400 fill-current animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-400 font-mono">
                {t('hero.tagline')}
              </span>
            </motion.div>

            {/* Title with Custom Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1] text-white"
            >
              Your Free <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-teal-400 bg-clip-text text-transparent drop-shadow-lg filter saturate-150">
                WhatsApp Receptionist
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-350 text-sm sm:text-base leading-relaxed mb-10 font-medium max-w-xl"
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
              {/* Premium Glowing CTA Button */}
              <Link 
                href="/onboard" 
                className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 hover:from-primary-600 hover:to-teal-600 text-slate-950 font-extrabold text-base transition-all shadow-[0_4px_25px_rgba(13,148,136,0.3)] hover:shadow-[0_4px_35px_rgba(13,148,136,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>{t('common.try_free')}</span>
                <ArrowRight size={16} className="stroke-[3] group-hover:translate-x-1.5 transition-transform" />
              </Link>
              
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-slate-900/90 border border-slate-800 text-white hover:bg-slate-850 hover:border-slate-700 transition-all font-bold text-base flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{t('how_it_works.title')}</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 border-t border-slate-900/80 pt-6 w-full text-xs text-slate-400 font-semibold"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-primary-400 shrink-0" />
                <span>10-minute automated setup</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: High-Fidelity Responsive 3D Phone Deck (Takes 7 cols) */}
          <div className="lg:col-span-7 relative w-full flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 lg:gap-3 xl:gap-8 mt-12 lg:mt-0 select-none scale-90 sm:scale-95 md:scale-100 lg:scale-[0.88] xl:scale-100 transition-transform duration-300">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary-500/5 blur-[50px] rounded-full pointer-events-none -z-10" />

            {/* Left Mockup (Restaurant booking) - Tilted Left */}
            <motion.div
              initial={{ opacity: 0, x: 25, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02, rotate: -1, zIndex: 10 }}
              className="w-full max-w-[280px] sm:max-w-[290px] shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <ChatMockup index={0} />
            </motion.div>
            
            {/* Right Mockup (Spa booking & payment) - Tilted Right */}
            <motion.div
              initial={{ opacity: 0, x: -25, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.02, rotate: 1, zIndex: 10 }}
              className="w-full max-w-[280px] sm:max-w-[290px] shrink-0 md:mt-16 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <ChatMockup index={1} />
            </motion.div>

          </div>

        </div>
      </div>

    </section>
  );
}
