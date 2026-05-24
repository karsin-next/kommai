"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQAccordion() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 select-none">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {t('faq.title')}
          </h2>
          <div className="w-12 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
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
    <div className="glass-card border border-slate-900 overflow-hidden select-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none select-none transition-colors hover:bg-slate-900/10"
      >
        <span className="font-bold text-white text-sm sm:text-base tracking-wide select-none">
          {question}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-400' : ''}`} 
        />
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-6 pt-0 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900 font-semibold select-none">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
