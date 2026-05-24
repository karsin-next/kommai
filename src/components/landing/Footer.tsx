"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-16 md:py-20 border-t border-slate-900 bg-slate-950/40 select-none">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center select-none">
        
        {/* Brand Logo / Wordmark */}
        <div className="flex items-center gap-2 mb-6 select-none">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-extrabold text-slate-950 text-base shadow-lg shadow-primary-500/10">
            K
          </span>
          <span className="text-xl font-bold text-white tracking-tight select-none">
            Kommai
          </span>
        </div>

        {/* Brand tagline details */}
        <p className="text-slate-400 text-xs sm:text-sm mb-10 max-w-md mx-auto leading-relaxed font-semibold select-none">
          Automating appointments, deposits, and reminders on WhatsApp. <br />
          Spend less time scheduling, more time growing. A product of Nextblaze.
        </p>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10 text-xs font-bold text-slate-400 select-none">
          <Link href="/templates" className="hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>

        {/* Copyright notice */}
        <div className="text-[10px] text-slate-600 font-extrabold tracking-wide uppercase select-none">
          &copy; {new Date().getFullYear()} Nextblaze. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
