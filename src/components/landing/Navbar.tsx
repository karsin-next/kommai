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
        ? 'bg-[#022f42]/95 backdrop-blur-md border-b-2 border-[#ffd800]/20 py-3 shadow-md' 
        : 'bg-[#022f42] py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffd800] to-[#ffd800]/80 flex items-center justify-center font-black text-[#022f42] text-xl shadow-md group-hover:scale-105 transition-transform">
              K
            </span>
            <span className="text-2xl font-black uppercase text-white tracking-tighter group-hover:text-[#ffd800] transition-colors">
              Kommai
            </span>
          </Link>
          <a 
            href="https://nextblaze.asia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b0d0e0] hover:text-white transition-colors self-end pb-1.5 ml-1 md:block hidden"
          >
            by Nextblaze
          </a>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-300">
          <Link href="#how-it-works" className="hover:text-[#ffd800] transition-colors">
            {t('how_it_works.title')}
          </Link>
          <Link href="#features" className="hover:text-[#ffd800] transition-colors">
            {t('features_section.title')}
          </Link>
          <Link href="#pricing" className="hover:text-[#ffd800] transition-colors">
            {t('pricing.title')}
          </Link>
          <Link href="#partner" className="hover:text-[#ffd800] transition-colors">
            Partner
          </Link>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#011c28] px-2 py-1 rounded-full border border-white/10">
            <Globe size={13} className="text-white/60 ml-1" />
            <LangButton current={language} lang="en" label="EN" onClick={() => setLanguage('en')} />
            <LangButton current={language} lang="ms" label="MS" onClick={() => setLanguage('ms')} />
            <LangButton current={language} lang="zh" label="ZH" onClick={() => setLanguage('zh')} />
          </div>

          <Link href="/login" className="px-5 py-2.5 rounded-full bg-[#022f42] text-white border-2 border-white/20 hover:border-[#ffd800] hover:bg-[#ffd800]/5 transition-all font-black uppercase text-xs tracking-wider">
            {t('common.login')}
          </Link>

          <Link 
            href="/onboard" 
            className="px-6 py-2.5 rounded-full bg-[#ffd800] text-[#022f42] hover:bg-[#ffe033] hover:scale-105 transition-all font-black uppercase text-xs tracking-wider shadow-lg shadow-[#ffd800]/10 flex items-center gap-1.5 hover:gap-2 transform"
          >
            <span>{t('common.try_free').split('–')[0]}</span>
            <ArrowRight size={14} className="stroke-[3]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1 bg-[#011c28] p-0.5 rounded-lg border border-white/10">
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
            className="md:hidden border-t-2 border-[#ffd800]/20 bg-[#022f42] w-full px-6 py-8 flex flex-col gap-6"
          >
            <Link 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-wider text-slate-300 hover:text-[#ffd800]"
            >
              {t('how_it_works.title')}
            </Link>
            <Link 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-wider text-slate-300 hover:text-[#ffd800]"
            >
              {t('features_section.title')}
            </Link>
            <Link 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-wider text-slate-300 hover:text-[#ffd800]"
            >
              {t('pricing.title')}
            </Link>
            <Link 
              href="#partner" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-wider text-slate-300 hover:text-[#ffd800]"
            >
              Partner Program
            </Link>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex flex-col gap-4">
              <a 
                href="https://nextblaze.asia" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-center text-xs font-black uppercase tracking-[0.2em] text-[#b0d0e0] hover:text-white transition-colors"
              >
                by Nextblaze
              </a>
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#022f42] border-2 border-white/20 text-white font-black uppercase text-xs tracking-wider"
              >
                {t('common.login')}
              </Link>
              <Link 
                href="/onboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#ffd800] text-[#022f42] font-black uppercase text-xs tracking-wider shadow-lg"
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
      className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider transition-all ${
        current === lang 
          ? 'bg-[#ffd800] text-[#022f42] shadow-sm' 
          : 'text-white/60 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
