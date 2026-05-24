"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0f0f]/80 backdrop-blur-md border-b border-slate-800/80 py-4 shadow-xl' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
            K
          </span>
          <span className="text-2xl font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors">
            Kommai
          </span>
        </Link>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link href="#how-it-works" className="hover:text-white transition-colors">
            {t('how_it_works.title')}
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            {t('features_section.title')}
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            {t('pricing.title')}
          </Link>
          <Link href="#partner" className="hover:text-white transition-colors">
            Partner
          </Link>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1 rounded-full border border-slate-800/80">
            <Globe size={13} className="text-slate-400 ml-1" />
            <LangButton current={language} lang="en" label="EN" onClick={() => setLanguage('en')} />
            <LangButton current={language} lang="ms" label="MS" onClick={() => setLanguage('ms')} />
            <LangButton current={language} lang="zh" label="ZH" onClick={() => setLanguage('zh')} />
          </div>

          <Link href="/login" className="px-6 py-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700 transition-all font-bold">
            {t('common.login')}
          </Link>

          <Link href="/onboard" className="px-6 py-2.5 rounded-full bg-primary-500 text-slate-950 hover:bg-primary-600 transition-all font-bold shadow-lg shadow-primary-500/10 flex items-center gap-1.5 hover:gap-2.5">
            <span>{t('common.try_free').split('–')[0]}</span>
            <ArrowRight size={14} className="stroke-[3]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800">
            <LangButton current={language} lang="en" label="EN" onClick={() => setLanguage('en')} />
            <LangButton current={language} lang="ms" label="MS" onClick={() => setLanguage('ms')} />
            <LangButton current={language} lang="zh" label="ZH" onClick={() => setLanguage('zh')} />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-900 bg-[#0a0f0f] w-full px-6 py-8 flex flex-col gap-6"
          >
            <Link 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-300 hover:text-white"
            >
              {t('how_it_works.title')}
            </Link>
            <Link 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-300 hover:text-white"
            >
              {t('features_section.title')}
            </Link>
            <Link 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-300 hover:text-white"
            >
              {t('pricing.title')}
            </Link>
            <Link 
              href="#partner" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-slate-300 hover:text-white"
            >
              Partner Program
            </Link>
            <div className="h-px bg-slate-800 my-2" />
            <div className="flex flex-col gap-4">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-slate-900 border border-slate-800 text-white font-bold"
              >
                {t('common.login')}
              </Link>
              <Link 
                href="/onboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-primary-500 text-slate-950 font-bold shadow-lg"
              >
                {t('common.try_free')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LangButton({ current, lang, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider transition-all ${
        current === lang 
          ? 'bg-primary-500 text-slate-950 shadow-sm' 
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
