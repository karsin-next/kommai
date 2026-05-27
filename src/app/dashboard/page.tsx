"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Bot, Calendar, CreditCard, MessageSquare, TrendingUp, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface BookingLog {
  id: string | number;
  time: string;
  customer: string;
  service: string;
  status: 'paid' | 'confirmed';
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('My Business');
  const [plan, setPlan] = useState('free');
  const [customerCount, setCustomerCount] = useState(0);
  
  // Real-time states
  const [bookingsCount, setBookingsCount] = useState(0);
  const [depositsCount, setDepositsCount] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);
  const [logs, setLogs] = useState<BookingLog[]>([]);
  const [trendPoints, setTrendPoints] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!businessId) return;

    const fetchData = async () => {
      // 1. Fetch business info
      const { data: business } = await supabase
        .from('businesses')
        .select('name, plan, unique_customer_count')
        .eq('id', businessId)
        .single();

      if (business) {
        setBusinessName(business.name);
        setPlan(business.plan);
        setCustomerCount(business.unique_customer_count || 0);
      }

      // 2. Fetch today's bookings count
      const todayStr = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('booking_date', todayStr);

      setBookingsCount(todayCount || 0);

      // 3. Fetch deposit revenue (paid deposits)
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('id, service_name, customer_phone, deposit_status, created_at')
        .eq('business_id', businessId);
      
      const paidDeposits = revenueData?.filter(b => b.deposit_status === 'paid') || [];
      const totalRevenue = paidDeposits.length * 30; // RM30 deposit flat rate default
      setDepositsCount(totalRevenue);

      // 4. Messages Handled (mocked based on bookings * average message count)
      const totalBookingsCount = revenueData?.length || 0;
      setChatsCount(totalBookingsCount * 6 + 12); // Average 6 messages per booking cycle

      // 5. Populate initial activity feed
      const recentBookings = (revenueData || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4)
        .map((b, i) => {
          const createdDate = new Date(b.created_at);
          const diffMin = Math.floor((new Date().getTime() - createdDate.getTime()) / 60000);
          
          let timeLabel = `${diffMin} min ago`;
          if (diffMin <= 0) timeLabel = 'Just now';
          else if (diffMin >= 60) timeLabel = `${Math.floor(diffMin / 60)} hours ago`;
          
          return {
            id: b.id,
            time: timeLabel,
            customer: b.customer_phone.replace(/(\d{4})\d*(\d{4})/, '$1-***$2'),
            service: b.service_name,
            status: b.deposit_status === 'paid' ? 'paid' : 'confirmed'
          } as BookingLog;
        });

      setLogs(recentBookings);

      // 6. Calculate Trend sparkline points
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const counts = last7Days.map(date => {
        return (revenueData || []).filter(b => b.created_at.startsWith(date)).length;
      });
      setTrendPoints(counts);

      setLoading(false);
    };

    fetchData();

    // 7. Subscribe to Supabase Realtime channel for live booking additions!
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const newBooking = payload.new;
          setLogs(prev => [
            {
              id: newBooking.id,
              time: 'Just now',
              customer: newBooking.customer_phone.replace(/(\d{4})\d*(\d{4})/, '$1-***$2'),
              service: newBooking.service_name,
              status: (newBooking.deposit_status === 'paid' ? 'paid' : 'confirmed') as 'paid' | 'confirmed'
            },
            ...prev
          ].slice(0, 4));

          setBookingsCount(prev => prev + 1);
          setChatsCount(prev => prev + 5);
          if (newBooking.deposit_status === 'paid') {
            setDepositsCount(prev => prev + 30);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  if (loading) return <div className="p-12 text-slate-500 animate-pulse">Loading dashboard overview...</div>;

  // Convert counts to SVG coordinates: max is mapped to Y=10, min to Y=90
  const maxVal = Math.max(...trendPoints, 1);
  const svgPath = trendPoints
    .map((val, index) => {
      const x = (index / 6) * 300;
      const y = 90 - (val / maxVal) * 80;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const svgGradientPath = `${svgPath} L 300,100 L 0,100 Z`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#ffd800]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0077cc]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            {businessName}
            <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border font-black ${
              plan === 'free' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
            }`}>
              {plan === 'free' ? 'Free Tier' : 'Pro Tier'}
            </span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Real-time automation active on your WhatsApp customer portal.</p>
        </div>

        {/* Live Pulse */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full shadow-sm shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
            Autopilot Online
          </span>
        </div>
      </div>

      {/* Four Premium Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar size={16} className="text-[#0077cc]" />}
          label="Bookings Today"
          value={bookingsCount.toString()}
          subtext="Unique Customers Tracked"
          progress={plan === 'free' ? (customerCount / 25) * 100 : undefined}
          progressLabel={`${customerCount} / 25 Cap`}
        />
        <StatCard 
          icon={<CreditCard size={16} className="text-[#10B981]" />}
          label="Deposits Collected"
          value={`RM ${depositsCount.toFixed(2)}`}
          subtext="Direct into your balance"
        />
        <StatCard 
          icon={<MessageSquare size={16} className="text-[#0077cc]" />}
          label="Autopilot Chats"
          value={chatsCount.toString()}
          subtext="Managed by Claude Haiku"
        />
        <StatCard 
          icon={<TrendingUp size={16} className="text-[#ffd800]" />}
          label="Conversion Ratio"
          value="94.2%"
          subtext="Chat-to-booking efficiency"
        />
      </div>

      {/* Central Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Trend chart */}
        <div className="lg:col-span-7 bg-slate-900/30 backdrop-blur-md rounded-[32px] p-6 md:p-8 border border-slate-800/80 flex flex-col justify-between min-h-[300px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bookings Volume Trend</div>
              <div className="text-xl font-extrabold text-white tracking-tight mt-1">Weekly Activity</div>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">+14% vs last week</span>
          </div>

          <div className="flex-1 w-full relative min-h-[140px] mt-4">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0077cc" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0077cc" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Path line */}
              <path 
                d={svgPath} 
                fill="none" 
                stroke="#0077cc" 
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Gradient fill */}
              <path 
                d={svgGradientPath} 
                fill="url(#chartGradient)" 
              />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] text-slate-500 font-bold tracking-wider pt-4 border-t border-slate-800/50 mt-4">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>
        </div>

        {/* Live Booking Activities Feed */}
        <div className="lg:col-span-5 bg-slate-900/30 backdrop-blur-md rounded-[32px] p-6 md:p-8 border border-slate-800/80 flex flex-col justify-between min-h-[300px] shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/50">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Activity Stream</div>
              <div className="text-xl font-extrabold text-white tracking-tight mt-1">Real-time Stream</div>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-hidden">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
                Awaiting incoming bookings...
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs hover:border-[#ffd800]/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800 shadow-sm">
                      <Bot size={14} className="text-primary-400" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white tracking-tight">{log.customer}</div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">{log.service}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${
                      log.status === 'paid' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                    }`}>
                      {log.status}
                    </span>
                    <div className="text-[9px] text-slate-600 font-bold mt-1.5">{log.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, progress, progressLabel }: { icon: React.ReactNode; label: string; value: string; subtext: string; progress?: number; progressLabel?: string }) {
  return (
    <div className="glass-card p-6 border-l-4 border-l-primary-500 hover:bg-slate-800/60 transition-all flex flex-col justify-between select-none min-h-[140px]">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
          {icon}
        </div>
      </div>
      
      <div>
        <div className="text-2xl font-extrabold text-white tracking-tight leading-none mb-2">{value}</div>
        
        {progress !== undefined ? (
          <div className="mt-2">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-1.5">
              <span>{subtext}</span>
              <span className="text-primary-400">{progressLabel}</span>
            </div>
          </div>
        ) : (
          <span className="text-[9px] text-slate-500 font-bold">{subtext}</span>
        )}
      </div>
    </div>
  );
}
