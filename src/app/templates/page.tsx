"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useTranslation } from '@/context/LanguageContext';
import { Copy, Sparkles, Check } from 'lucide-react';

const TEMPLATES = [
  { 
    id: 'thai-massage', 
    name_en: 'Traditional Thai Massage', 
    name_ms: 'Urutan Tradisional Thai', 
    name_zh: '泰式传统按摩',
    desc_en: 'Optimized for high-volume Thai massage parlors.',
    desc_ms: 'Sesuai untuk rumah urut Thai bervolum tinggi.',
    desc_zh: '针对高客流量的泰式按摩店进行了优化。',
    content: "Selamat datang ke [Nama Kedai]! Boleh saya bantu temujanji?\n\nKami ada slot:\n1. 2:00 PM\n2. 4:00 PM\n3. 8:00 PM\n\nNak booking yang mana?"
  },
  { 
    id: 'spa-wellness', 
    name_en: 'Luxury Spa & Wellness', 
    name_ms: 'Spa & Wellness Mewah', 
    name_zh: '高端水疗与养生',
    desc_en: 'Focus on relaxation and detailed service categories.',
    desc_ms: 'Fokus kepada ketenangan dan kategori servis terperinci.',
    desc_zh: '专注于放松体验和详细的服务分类。',
    content: "Hi! Welcome to [Spa Name]. Experience true relaxation.\n\nOur signature treatments:\n- 90min Deep Tissue\n- 60min Facial\n\nWould you like to check availability?"
  },
  { 
    id: 'reflexology', 
    name_en: 'Foot Reflexology', 
    name_ms: 'Refleksologi Kaki', 
    name_zh: '足部按摩/反射疗法',
    desc_en: 'Simple slot booking for quick walk-in conversions.',
    desc_ms: 'Booking slot mudah untuk penukaran walk-in pantas.',
    desc_zh: '简单的时段预约，提高步入客户的转化率。',
    content: "Foot Reflexology [Store Name]. Nak slot pukul berapa hari ini?"
  }
];

export default function TemplatesPage() {
  const { t, language } = useTranslation();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0f] text-slate-100 selection:bg-primary-500/30 selection:text-white font-sans scroll-smooth overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-36 pb-24 md:pt-40 md:pb-32">
        {/* Glow Orb decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-primary-900/15 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center mb-16 select-none">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-350 mb-6 font-mono text-[9px] font-extrabold tracking-widest uppercase text-primary-400">
            <Sparkles size={11} className="text-primary-400 fill-current animate-pulse" />
            <span>Ready-made scripts</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-6">
            {t('templates_page.title')}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {t('templates_page.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="glass-card border border-slate-900 hover:border-primary-500/20 p-8 flex flex-col justify-between relative transition-all duration-350 select-none group">
              
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-7xl font-black select-none">📄</span>
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors">
                  {tpl[`name_${language}` as keyof typeof tpl] || tpl.name_en}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-semibold">
                  {tpl[`desc_${language}` as keyof typeof tpl] || tpl.desc_en}
                </p>

                {/* Content Box Mockup */}
                <div className="bg-[#080d0d]/80 rounded-xl p-4 border border-slate-900 text-slate-300 font-mono text-[10px] leading-relaxed whitespace-pre-wrap select-text mb-6">
                  {tpl.content}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between mt-auto">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">
                  Powered by Kommai
                </span>
                
                <button 
                  onClick={() => copyToClipboard(tpl.content, tpl.id)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 ${
                    copiedId === tpl.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 hover:bg-primary-500 hover:text-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  {copiedId === tpl.id ? (
                    <>
                      <Check size={12} className="stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>{t('templates_page.copy_btn').split(' ')[0]}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
