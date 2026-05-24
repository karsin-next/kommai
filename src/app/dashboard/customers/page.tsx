"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface CustomerSummary {
  phone: string;
  name: string;
  total_bookings: number;
  first_seen: string;
}

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    const fetchCustomers = async () => {
      // For MVP, we aggregate unique customers from the bookings table
      const { data, error } = await supabase
        .from('bookings')
        .select('customer_phone, customer_name, created_at')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Group by phone number
        const customerMap = new Map<string, CustomerSummary>();
        
        data.forEach(row => {
          const existing = customerMap.get(row.customer_phone);
          if (existing) {
            existing.total_bookings += 1;
            // Update first_seen if this row is older
            if (new Date(row.created_at) < new Date(existing.first_seen)) {
              existing.first_seen = row.created_at;
            }
          } else {
            customerMap.set(row.customer_phone, {
              phone: row.customer_phone,
              name: row.customer_name || 'Valued Customer',
              total_bookings: 1,
              first_seen: row.created_at
            });
          }
        });

        setCustomers(Array.from(customerMap.values()));
      }
      setLoading(false);
    };

    fetchCustomers();
  }, [businessId]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-1">Customers</h1>
        <p className="text-gray-400">Manage your unique client base and loyalty.</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center text-sm font-bold text-gray-400">
          <div>TOTAL UNIQUE CUSTOMERS: {customers.length}</div>
          <div className="text-purple-400">Free Tier Limit: {customers.length}/25</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Client</th>
                <th className="px-8 py-4">WhatsApp</th>
                <th className="px-8 py-4">First Visit</th>
                <th className="px-8 py-4">Total Bookings</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-500">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-500">No customers yet. Keep marketing your WhatsApp number!</td></tr>
              ) : (
                customers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-semibold">{c.name}</td>
                    <td className="px-8 py-5 text-sm text-gray-400">{c.phone}</td>
                    <td className="px-8 py-5 text-sm">{new Date(c.first_seen).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
                        {c.total_bookings} Bookings
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
                        View History
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
