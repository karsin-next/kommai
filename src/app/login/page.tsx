"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) alert(`Login failed: ${error.message}`);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    // Note: WhatsApp OTP requires specific Supabase setup and a Twilio/MessageBird provider
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
      options: { channel: 'whatsapp' }
    });
    setLoading(false);
    if (error) {
      alert(`OTP failed: ${error.message}`);
    } else {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms' // actually 'sms' is used for both sms and whatsapp verification types
    });
    setLoading(false);
    if (error) {
      alert(`Invalid OTP: ${error.message}`);
    } else if (data.session) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-primary-500/30 selection:text-white">
      <Link href="/" className="text-2xl font-bold text-white mb-12 tracking-tight">
        WhatsUpCRM
      </Link>
      
      <div className="glass-card w-full max-w-md p-8 md:p-10 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to manage your wellness center.</p>
        </div>

        {/* Google OAuth */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
          <div className="relative bg-slate-900/90 px-4 text-xs text-slate-500 font-bold uppercase tracking-widest">Or</div>
        </div>

        {/* WhatsApp OTP */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">WhatsApp Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <MessageCircle size={18} />
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+60123456789"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary-500 transition-all text-sm font-medium text-white placeholder-slate-600"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-2xl bg-primary-500 text-slate-950 font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP via WhatsApp'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary-500 transition-all text-center text-2xl tracking-widest font-bold text-white placeholder-slate-600"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-2xl bg-primary-500 text-slate-950 font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button 
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm font-bold text-slate-500 hover:text-white transition-all pt-2"
            >
              Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
