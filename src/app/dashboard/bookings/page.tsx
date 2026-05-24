"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types/booking';

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!businessId) return;

    const fetchBookings = async () => {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (!error && data) setBookings(data);
      setLoading(false);
    };

    fetchBookings();
  }, [businessId, filter]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-white tracking-tight">Bookings</h1>
          <p className="text-slate-400">View and manage all customer appointments.</p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <FilterButton active={filter === 'all'} label="All" onClick={() => setFilter('all')} />
          <FilterButton active={filter === 'confirmed'} label="Confirmed" onClick={() => setFilter('confirmed')} />
          <FilterButton active={filter === 'completed'} label="Completed" onClick={() => setFilter('completed')} />
          <FilterButton active={filter === 'cancelled'} label="Cancelled" onClick={() => setFilter('cancelled')} />
        </div>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Time</th>
                <th className="px-8 py-5">Deposit</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-500">Loading your schedule...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-500">No appointments found matching this filter.</td></tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-white">{booking.customer_name || 'Valued Customer'}</div>
                      <div className="text-xs text-slate-400">{booking.customer_phone}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                        {booking.service_name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-300">{booking.booking_date}</td>
                    <td className="px-8 py-5 text-sm font-bold text-white">{booking.booking_time}</td>
                    <td className="px-8 py-5">
                      <div className={`text-[10px] font-bold uppercase flex items-center gap-2 ${
                        booking.deposit_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${booking.deposit_status === 'paid' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        {booking.deposit_status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-xs font-bold px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${active ? 'bg-primary-500 text-slate-950 shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-white'}`}
    >
      {label}
    </button>
  );
}
