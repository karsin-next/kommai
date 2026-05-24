"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import Navbar from '@/components/landing/Navbar';
import { supabase } from '@/lib/supabase';

export default function OnboardPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refValidating, setRefValidating] = useState(false);
  const [refError, setRefError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    owner_phone: '',
    whatsapp_phone: '',
    referralCode: searchParams.get('ref') || '',
    deposit_amount_rm: '30',
    services: [{ name: 'Traditional Massage', duration_minutes: 60, price_rm: 120 }],
    operating_hours: { open: '10:00', close: '22:00' }
  });

  // Validate referral code on change, phone change, or mount
  useEffect(() => {
    if (formData.referralCode) {
      const timer = setTimeout(() => validateCode(formData.referralCode), 500);
      return () => clearTimeout(timer);
    } else {
      setRefError('');
    }
  }, [formData.referralCode, formData.owner_phone]);

  const validateCode = async (code: string) => {
    setRefValidating(true);
    setRefError('');
    try {
      const res = await fetch(`/api/referral/validate?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(formData.owner_phone)}`);
      const data = await res.json();
      if (!data.success) {
        setRefError(data.error);
      }
    } catch (e) {
      setRefError('Error validating code');
    } finally {
      setRefValidating(false);
    }
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          owner_name: formData.owner_name,
          owner_phone: formData.owner_phone,
          whatsapp_phone: formData.whatsapp_phone,
          owner_id: (await supabase.auth.getSession()).data.session?.user.id || null,
          referralCode: formData.referralCode,
          config: {
            services: formData.services,
            operating_hours: formData.operating_hours,
            deposit_required: true,
            deposit_amount_rm: parseInt(formData.deposit_amount_rm),
            auto_confirm: true,
            reminder_hours_before: 24,
            language: language === 'en' ? 'en' : 'bm'
          }
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text || 'Unknown error'}`);
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      router.push(`/dashboard?id=${result.data.id}`);
    } catch (err: any) {
      alert(`Onboarding failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 text-primary-950">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <div className="bg-white border border-sand-200 rounded-[40px] p-8 md:p-12 shadow-xl shadow-primary-900/5 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-sand-100">
            <div 
              className="h-full bg-primary-600 transition-all duration-700 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }} 
            />
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t('hero.headline')}</h1>
                <p className="text-primary-800/60 font-medium">{t('hero.subheadline')}</p>
              </header>
              
              <div className="space-y-5">
                <Input label="Business Name *" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} placeholder="e.g. Lavender Wellness" />
                <Input label="Your Name *" value={formData.owner_name} onChange={(v: string) => setFormData({...formData, owner_name: v})} placeholder="Full name" />
                <Input label="Your WhatsApp Number *" value={formData.owner_phone} onChange={(v: string) => setFormData({...formData, owner_phone: v})} placeholder="e.g. 60123456789" />
                <Input label="WhatsApp API Number *" value={formData.whatsapp_phone} onChange={(v: string) => setFormData({...formData, whatsapp_phone: v})} placeholder="The number connected to Meta API" />
                
                <div className="pt-4 border-t border-sand-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold text-primary-800/40 uppercase tracking-widest">{t('referral.code_field')}</label>
                    {refValidating && <span className="text-[10px] text-primary-500 animate-pulse">Validating...</span>}
                  </div>
                  <input 
                    type="text"
                    value={formData.referralCode}
                    onChange={e => setFormData({...formData, referralCode: e.target.value.toUpperCase()})}
                    placeholder="KOMREF-XXXXXX"
                    className={`w-full bg-sand-50 border rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none transition-all ${
                      refError ? 'border-red-300 text-red-600' : formData.referralCode && !refValidating ? 'border-green-300 text-green-700' : 'border-sand-200'
                    }`}
                  />
                  {refError && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tight">{refError}</p>}
                  {!refError && formData.referralCode && !refValidating && (
                    <p className="text-[10px] text-green-600 mt-2 font-bold uppercase tracking-tight">{t('referral.code_valid')}</p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleNext} 
                disabled={
                  !formData.name || 
                  !formData.owner_name || 
                  !formData.owner_phone || 
                  !formData.whatsapp_phone || 
                  refValidating || 
                  !!refError
                }
                className="w-full py-4 rounded-2xl bg-primary-500 text-slate-950 font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
              >
                {refValidating ? 'Validating Code...' : 
                 (!formData.name || !formData.owner_name || !formData.owner_phone || !formData.whatsapp_phone) ? 'Please fill all fields' :
                 'Next: Services & Pricing'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Services & Deposits</h1>
                <p className="text-primary-800/60 font-medium">What do you offer and what's the deposit?</p>
              </header>
              
              <div className="space-y-6">
                <Input label="Default Deposit (RM)" type="number" value={formData.deposit_amount_rm} onChange={(v: string) => setFormData({...formData, deposit_amount_rm: v})} />
                
                <div className="p-8 rounded-[32px] bg-sand-50 border border-sand-200 relative">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-primary-500 text-slate-950 text-[10px] font-bold rounded-full uppercase tracking-widest">Primary Service</div>
                  <Input label="Service Name" value={formData.services[0].name} onChange={(v: string) => {
                    const s = [...formData.services];
                    s[0].name = v;
                    setFormData({...formData, services: s});
                  }} />
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Input label="Price (RM)" type="number" value={formData.services[0].price_rm.toString()} onChange={(v: string) => {
                      const s = [...formData.services];
                      s[0].price_rm = parseInt(v);
                      setFormData({...formData, services: s});
                    }} />
                    <Input label="Duration (Min)" type="number" value={formData.services[0].duration_minutes.toString()} onChange={(v: string) => {
                      const s = [...formData.services];
                      s[0].duration_minutes = parseInt(v);
                      setFormData({...formData, services: s});
                    }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 rounded-2xl bg-white border border-sand-200 font-bold hover:bg-sand-50 transition-all">Back</button>
                <button onClick={handleNext} className="flex-[2] py-4 rounded-2xl bg-primary-500 text-slate-950 font-bold hover:bg-primary-700 transition-all">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Operating Hours</h1>
                <p className="text-primary-800/60 font-medium">When should the AI accept bookings?</p>
              </header>
              
              <div className="grid grid-cols-2 gap-6">
                <Input label="Open Time" type="time" value={formData.operating_hours.open} onChange={(v: string) => setFormData({...formData, operating_hours: {...formData.operating_hours, open: v}})} />
                <Input label="Close Time" type="time" value={formData.operating_hours.close} onChange={(v: string) => setFormData({...formData, operating_hours: {...formData.operating_hours, close: v}})} />
              </div>
              
              <div className="p-8 rounded-[32px] bg-primary-50 border border-primary-100 flex gap-4 items-start">
                <span className="text-2xl">💡</span>
                <p className="text-xs text-primary-800/70 leading-relaxed font-medium">
                  <b>Pro Tip:</b> Our AI will automatically suggest available slots within these hours and check your existing bookings in Supabase to prevent double-booking.
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 rounded-2xl bg-white border border-sand-200 font-bold hover:bg-sand-50 transition-all">Back</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-white font-bold hover:scale-[1.02] transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Complete Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, disabled }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-primary-800/40 uppercase tracking-widest px-1">{label}</label>
      <input 
        type={type} 
        value={value} 
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-sand-50 border border-sand-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary-500 transition-all text-sm font-medium"
      />
    </div>
  );
}
