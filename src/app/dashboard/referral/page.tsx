"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import { ReferralDashboard } from '@/types/referral';

export default function ReferralPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const [stats, setStats] = useState<ReferralDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/referral/dashboard?id=${businessId}`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [businessId]);

  const copyLink = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!stats) return;
    const msg = encodeURIComponent(t('referral.whatsapp_msg', { link: stats.link }));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (loading) return <div className="p-12 text-gray-400">Loading rewards...</div>;
  if (!stats) return <div className="p-12 text-red-500">Error loading referral data.</div>;

  const progressPercent = (stats.annual_referral_count / stats.annual_cap) * 100;

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-extrabold text-primary-950 mb-2">{t('referral.title')}</h1>
        <p className="text-primary-800/60 font-medium">{t('referral.subtitle')}</p>
      </header>

      {/* Bonus Banner */}
      {process.env.NEXT_PUBLIC_REFERRAL_BONUS_MONTHS && parseInt(process.env.NEXT_PUBLIC_REFERRAL_BONUS_MONTHS) > 1 && (
        <div className="p-6 rounded-[32px] bg-primary-500 text-slate-950 flex items-center gap-6 shadow-lg shadow-primary-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">🚀</div>
          <span className="text-4xl">🎁</span>
          <p className="font-bold text-lg relative z-10">{t('referral.bonus_banner')}</p>
        </div>
      )}

      {/* Referral Link Card */}
      <section className="bg-white border border-sand-200 rounded-[40px] p-8 md:p-12 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('referral.link_label')}</h2>
        <p className="text-primary-800/60 text-sm mb-8 leading-relaxed max-w-lg">
          {t('referral.invite_text')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-sand-50 border border-sand-200 rounded-2xl px-6 py-4 font-mono text-sm text-slate-900 flex items-center overflow-hidden">
            <span className="truncate">{stats.link}</span>
          </div>
          <button 
            onClick={copyLink}
            className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-md ${copied ? 'bg-green-600 text-white' : 'bg-primary-500 text-slate-950 hover:bg-primary-700'}`}
          >
            {copied ? 'Copied!' : t('referral.copy_link')}
          </button>
          <button 
            onClick={shareWhatsApp}
            className="px-8 py-4 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>📱</span> {t('referral.share_whatsapp')}
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('referral.stats.completed')} value={stats.completed_count.toString()} icon="✅" color="text-green-600" />
        <StatCard title={t('referral.stats.pending')} value={stats.pending_count.toString()} icon="⏳" color="text-orange-500" />
        <StatCard title={t('referral.stats.earned')} value={`RM ${stats.total_earned_rm}`} icon="🏆" color="text-primary-500" />
        <StatCard title={t('referral.stats.balance')} value={`RM ${stats.available_balance_rm}`} icon="💰" color="text-primary-800" />
      </div>

      {/* Annual Cap Progress */}
      <section className="bg-white border border-sand-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            {t('referral.stats.annual_limit', { count: stats.annual_referral_count.toString(), total: stats.annual_cap.toString() })}
          </h3>
          <span className="text-xs font-bold text-primary-800/40">Rolling 12 Months</span>
        </div>
        <div className="w-full h-3 bg-sand-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${progressPercent >= 100 ? 'bg-orange-500' : 'bg-primary-500'}`} 
            style={{ width: `${Math.min(progressPercent, 100)}%` }} 
          />
        </div>
        <p className="text-[10px] text-primary-800/40 mt-4 italic">
          * Referrals are tracked even after the cap is reached, but no additional credits are awarded until the limit resets.
        </p>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="p-8 rounded-[32px] bg-white border border-sand-200 shadow-sm hover:shadow-md transition-all group">
      <div className={`text-3xl mb-6 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="text-[10px] font-bold text-primary-800/40 uppercase tracking-widest mb-1">{title}</div>
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
