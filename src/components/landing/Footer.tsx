"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-16 md:py-20 bg-[#022f42] select-none border-t-2 border-[#ffd800]/20">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center select-none font-sans">
        
        {/* Brand Logo / Wordmark */}
        <div className="flex items-center gap-2 mb-6 select-none">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffd800] to-[#ffd800]/80 flex items-center justify-center font-black text-[#022f42] text-base shadow-md">
            K
          </span>
          <span className="text-xl font-black uppercase text-white tracking-tighter select-none">
            Kommai
          </span>
        </div>

        {/* Brand tagline details */}
        <p className="text-[#b0d0e0] text-xs sm:text-sm mb-10 max-w-md mx-auto leading-relaxed font-semibold select-none">
          Automating appointments, deposits, and reminders on WhatsApp. <br />
          Spend less time scheduling, more time growing. A service by{" "}
          <a 
            href="https://nextblaze.asia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#ffd800] hover:underline font-black uppercase tracking-widest"
          >
            Nextblaze
          </a>.
        </p>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10 text-xs font-black uppercase tracking-wider text-[#b0d0e0] select-none">
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
        <div className="text-[10px] text-[#b0d0e0]/60 font-black tracking-widest uppercase select-none">
          &copy; {new Date().getFullYear()} Nextblaze. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
