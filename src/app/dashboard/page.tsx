"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    const fetchData = async () => {
      // Fetch bookings count
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString()); // This month

      // Fetch revenue (paid deposits)
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('deposit_amount_cents')
        .eq('business_id', businessId)
        .eq('deposit_status', 'paid');
      
      const revenue = revenueData ? revenueData.reduce((acc, curr) => acc + (curr.deposit_amount_cents || 0), 0) / 100 : 0;

      setStats({
        bookings: bookingsCount || 0,
        revenue: revenue,
        customers: bookingsCount || 0 // simplification
      });
      setLoading(false);
    };

    fetchData();
  }, [businessId]);

  if (loading) return <div className="p-12 text-slate-500 animate-pulse">Loading your dashboard...</div>;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Overview</h1>
        <p className="text-slate-400 font-medium">Here's what's happening with your business this month.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="New Bookings" value={stats.bookings} trend="+12%" />
        <StatCard title="Deposit Revenue" value={`RM ${stats.revenue.toFixed(2)}`} trend="+5%" />
        <StatCard title="Active Customers" value={stats.customers} trend="+18%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Appointments */}
        <section className="glass-card p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white tracking-tight">Upcoming Appointments</h2>
            <Link href={`/dashboard/bookings?id=${businessId}`} className="text-sm font-bold text-primary-400 hover:text-primary-300">View All</Link>
          </div>
          <div className="space-y-4">
            <p className="text-slate-500 text-sm">No upcoming appointments in the next 24 hours.</p>
          </div>
        </section>

        {/* System Status & Quick Actions */}
        <div className="space-y-8">
          <section className="glass-card p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50 tracking-tight">AI Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">🤖</div>
                  <div>
                    <div className="font-bold text-white text-sm">WhatsApp AI</div>
                    <div className="text-xs text-slate-400">Responding to customers</div>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">💳</div>
                  <div>
                    <div className="font-bold text-white text-sm">Billplz Gateway</div>
                    <div className="text-xs text-slate-400">Collecting deposits</div>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </section>

          {/* Referral Callout */}
          <section className="relative overflow-hidden rounded-[32px] p-8 shadow-lg group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-700 z-0 opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full z-0" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Refer & Earn 🎁</h2>
                <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                  Share WhatsUpCRM with other business owners and get 1 month of Pro free for every successful signup!
                </p>
              </div>
              <Link href={`/dashboard/referral?id=${businessId}`} className="shrink-0 w-full md:w-auto text-center px-6 py-3 rounded-xl bg-white text-primary-900 font-bold text-sm shadow-xl hover:scale-105 transition-all">
                Invite Friends
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: any) {
  return (
    <div className="glass-card p-6 border-l-4 border-l-primary-500 hover:bg-slate-800/60 transition-all">
      <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
        <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
          {trend}
        </div>
      </div>
    </div>
  );
}
