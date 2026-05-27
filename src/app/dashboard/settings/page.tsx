"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types/business';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (!businessId) return;
    const fetchBusiness = async () => {
      const { data, error } = await supabase.from('businesses').select('*').eq('id', businessId).single();
      if (!error && data) setBusiness(data);
      setLoading(false);
    };
    fetchBusiness();
  }, [businessId]);

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    const { error } = await supabase.from('businesses').update({
      name: business.name,
      owner_name: business.owner_name,
      owner_phone: business.owner_phone,
      config: business.config
    }).eq('id', business.id);
    if (error) alert(`Save failed: ${error.message}`);
    else alert('Changes saved ✅');
    setSaving(false);
  };

  if (loading) return <div className="p-12 text-slate-500 animate-pulse">Loading settings...</div>;
  if (!business) return <div className="p-12 text-red-400">Business not found.</div>;

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Settings</h1>
          <p className="text-slate-400 font-medium">
            Configure your business profile and AI automation rules.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3.5 rounded-2xl bg-primary-500 text-slate-950 font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      <div className="space-y-8">
        {/* Profile */}
        <section className="glass-card p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-8 border-b border-slate-700/50 pb-4">
            Business Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Business Name" value={business.name} onChange={(v: string) => setBusiness({...business, name: v})} />
            <InputField label="Owner Name" value={business.owner_name} onChange={(v: string) => setBusiness({...business, owner_name: v})} />
            <InputField label="WhatsApp Contact" value={business.owner_phone} onChange={(v: string) => setBusiness({...business, owner_phone: v})} placeholder="60123456789" />
            <InputField label="API Number" value={business.whatsapp_phone} disabled sub="Connected via Meta API" />
          </div>
        </section>

        {/* AI & Automation */}
        <section className="glass-card p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-8 border-b border-slate-700/50 pb-4">
            Automation & AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Deposit Collection</label>
              <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-2xl">
                <input 
                  type="checkbox" 
                  checked={business.config.deposit_required} 
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setBusiness({
                      ...business, 
                      config: {
                        ...business.config, 
                        deposit_required: checked,
                        deposit_amount_rm: checked ? (business.config.deposit_amount_rm || 30) : 0
                      }
                    });
                  }}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm font-bold text-white">Require Booking Deposit</span>
              </div>
            </div>

            {business.config.deposit_required ? (
              <InputField 
                label="Deposit Amount (RM)" 
                type="number"
                value={business.config.deposit_amount_rm.toString()} 
                onChange={(v: string) => {
                  const val = parseInt(v) || 0;
                  setBusiness({
                    ...business, 
                    config: {
                      ...business.config, 
                      deposit_amount_rm: val,
                      deposit_required: val > 0
                    }
                  });
                }} 
              />
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Deposit Amount</label>
                <div className="w-full bg-slate-900/30 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500">
                  RM 0.00 (Instant Confirmations)
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">AI Logic Language</label>
              <select 
                value={business.config.language}
                onChange={(e) => setBusiness({...business, config: {...business.config, language: e.target.value as any}})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary-500 transition-all text-sm appearance-none font-medium text-white"
              >
                <option value="bm">Bahasa Malaysia / Manglish</option>
                <option value="en">English (Professional)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Open Time" type="time" value={business.config.operating_hours.open} onChange={(v: string) => setBusiness({...business, config: {...business.config, operating_hours: {...business.config.operating_hours, open: v}}})} />
              <InputField label="Close Time" type="time" value={business.config.operating_hours.close} onChange={(v: string) => setBusiness({...business, config: {...business.config, operating_hours: {...business.config.operating_hours, close: v}}})} />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white text-lg">Services Menu</h3>
              <button 
                onClick={() => setBusiness({...business, config: {...business.config, services: [...business.config.services, {name: 'New Service', duration_minutes: 60, price_rm: 100}]}})}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 border border-slate-700"
              >
                + Add Service
              </button>
            </div>
            
            <div className="space-y-4">
              {business.config.services.map((service, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 relative group">
                  <div className="flex-1">
                    <InputField 
                      label="Service Name" 
                      value={service.name} 
                      onChange={(v: string) => {
                        const s = [...business.config.services];
                        s[index].name = v;
                        setBusiness({...business, config: {...business.config, services: s}});
                      }} 
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <InputField 
                      label="Price (RM)" 
                      type="number"
                      value={service.price_rm.toString()} 
                      onChange={(v: string) => {
                        const s = [...business.config.services];
                        s[index].price_rm = parseInt(v);
                        setBusiness({...business, config: {...business.config, services: s}});
                      }} 
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <InputField 
                      label="Duration (Min)" 
                      type="number"
                      value={service.duration_minutes.toString()} 
                      onChange={(v: string) => {
                        const s = [...business.config.services];
                        s[index].duration_minutes = parseInt(v);
                        setBusiness({...business, config: {...business.config, services: s}});
                      }} 
                    />
                  </div>
                  
                  {business.config.services.length > 1 && (
                    <button 
                      onClick={() => {
                        const s = business.config.services.filter((_, i) => i !== index);
                        setBusiness({...business, config: {...business.config, services: s}});
                      }}
                      className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Referral Program Toggle */}
        <section className="glass-card p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            Referral Program
          </h2>
          <p className="text-slate-400 text-sm mb-6 border-b border-slate-700/50 pb-4">
            Reward other merchants for signing up to Kommai.
          </p>
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-700 rounded-2xl">
            <input 
              type="checkbox" 
              checked={business.config.referral_enabled !== false} 
              onChange={(e) => {
                setBusiness({
                  ...business, 
                  config: {
                    ...business.config, 
                    referral_enabled: e.target.checked
                  }
                });
              }}
              className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-slate-900"
            />
            <div>
              <span className="text-sm font-bold text-white block">Enable Referral Program Tab</span>
              <span className="text-xs text-slate-500 block mt-0.5">Let owners share codes to earn free Pro months (RM79 value).</span>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="glass-card p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            Integrations
          </h2>
          <p className="text-slate-400 text-sm mb-8 border-b border-slate-700/50 pb-4">
            Connect external tools to power up your CRM.
          </p>

          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-lg">Google Sheets Sync</h3>
                  <p className="text-sm text-slate-400 mt-1">Automatically save every new booking to a Google Sheet.</p>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 space-y-3">
                  <p className="font-bold text-slate-200">How to setup:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Create a new Google Sheet.</li>
                    <li>Click <b>Share</b> in the top right.</li>
                    <li>Share it with: <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-400">automation@kommai.iam.gserviceaccount.com</code> as <b>Editor</b>.</li>
                    <li>Copy the Sheet ID from the URL (the long string between <code className="bg-slate-800 px-1 py-0.5 rounded">/d/</code> and <code className="bg-slate-800 px-1 py-0.5 rounded">/edit</code>) and paste it below.</li>
                  </ol>
                </div>

                <InputField 
                  label="Google Sheet ID" 
                  value={business.google_sheet_id || ''} 
                  onChange={(v: string) => setBusiness({...business, google_sheet_id: v})} 
                  placeholder="e.g. 1BxiMVs0XRYFgwnLExsLNWlI9..." 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder, disabled, sub }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>
      <input 
        type={type} 
        value={value} 
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary-500 transition-all text-sm font-medium text-white ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      />
      {sub && <p className="text-[10px] text-slate-500 italic px-1">{sub}</p>}
    </div>
  );
}
