"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQAccordion() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative bg-[#e6f2fa] border-y border-[#022f42]/10 select-none">
      
      {/* Floating background orb */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-[#0077cc]/5 blur-xl pointer-events-none -z-10 animate-pulse" />

      <div className="max-w-3xl mx-auto px-6 font-sans">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#022f42] uppercase tracking-tighter">
            {t('faq.title')}
          </h2>
          <div className="border-b-4 border-[#ffd800] w-24 mx-auto mt-4" />
        </div>

        {/* FAQ Grid */}
        <div className="space-y-4">
          <FaqItem question={t('faq.q1')} answer={t('faq.a1')} />
          <FaqItem question={t('faq.q2')} answer={t('faq.a2')} />
          <FaqItem question={t('faq.q3')} answer={t('faq.a3')} />
        </div>

      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border-2 transition-all duration-300 overflow-hidden select-none rounded-2xl shadow-sm ${
      isOpen ? 'border-[#ffd800]' : 'border-[#022f42]/10 hover:border-[#ffd800]/50'
    }`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 text-left focus:outline-none select-none transition-colors duration-300 ${
          isOpen ? 'bg-[#e6f2fa]' : 'hover:bg-[#e6f2fa]/30'
        }`}
      >
        <span className="font-black text-[#022f42] text-sm sm:text-base tracking-tight select-none">
          {question}
        </span>
        
        {/* Custom Circular +/- colorful indicators */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-sm shrink-0 select-none transition-all duration-300 ${
          isOpen ? 'bg-[#ffd800] text-[#022f42] rotate-180' : 'bg-[#0077cc] text-white'
        }`}>
          {isOpen ? '−' : '+'}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-6 pt-4 text-xs sm:text-sm text-[#1e4a62] leading-relaxed border-t border-[#022f42]/10 font-bold select-none bg-white">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
