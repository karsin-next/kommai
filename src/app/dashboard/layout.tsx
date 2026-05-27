"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [referralEnabled, setReferralEnabled] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Find the business owned by this user
      const { data: business } = await supabase
        .from('businesses')
        .select('id, config')
        .eq('owner_id', session.user.id)
        .single();

      if (business) {
        setBusinessId(business.id);
        if (business.config && business.config.referral_enabled === false) {
          setReferralEnabled(false);
        } else {
          setReferralEnabled(true);
        }
      } else {
        // Not onboarded yet
        router.push('/onboard');
      }
      setLoadingAuth(false);
    };
    checkAuth();
  }, [router]);

  if (loadingAuth) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Checking auth...</div>;
  }

  const navLinks = [
    { name: 'Overview', href: `/dashboard?id=${businessId}`, icon: '📊' },
    { name: 'Bookings', href: `/dashboard/bookings?id=${businessId}`, icon: '📅' },
    { name: 'Customers', href: `/dashboard/customers?id=${businessId}`, icon: '👥' },
    ...(referralEnabled ? [{ name: 'Refer & Earn', href: `/dashboard/referral?id=${businessId}`, icon: '🎁' }] : []),
    { name: 'Settings', href: `/dashboard/settings?id=${businessId}`, icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-primary-500/30 selection:text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 border-r border-slate-800/50 flex-col p-8 fixed h-full bg-slate-900/30 backdrop-blur-md z-20">
        <div className="text-2xl font-bold mb-12 text-white tracking-tight">
          Kommai
        </div>
        
        <nav className="space-y-2 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href.split('?')[0];
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-slate-800/50">
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors text-left">
            <span>🚪</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-30">
        <div className="text-xl font-bold text-white">Kommai</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl text-slate-300">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[80px] bg-slate-950 z-20 p-6 animate-in slide-in-from-top-2">
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 rounded-2xl transition-all font-bold ${
                  pathname === link.href.split('?')[0] 
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {link.icon} <span className="ml-2">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto w-full">
          <Suspense fallback={
            <div className="p-12 text-slate-500 animate-pulse">
              Loading dashboard section...
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
