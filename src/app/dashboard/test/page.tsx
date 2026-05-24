"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TestConsole() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');
  const [message, setMessage] = useState("Nak booking urut esok pukul 2pm");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const simulateMessage = async () => {
    setLoading(true);
    const newLog = { type: 'user', text: message, time: new Date().toLocaleTimeString() };
    setLogs(prev => [...prev, newLog]);

    try {
      // We simulate the WhatsApp Webhook payload
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object: 'whatsapp_business_account',
          entry: [{
            changes: [{
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '60123456789' }, // This should match a business in your DB
                messages: [{
                  from: '60170000000', // Mock customer
                  id: `mock_${Date.now()}`,
                  text: { body: message },
                  type: 'text'
                }]
              },
              field: 'messages'
            }]
          }]
        })
      });

      const result = await response.json();
      setLogs(prev => [...prev, { 
        type: 'system', 
        text: result.success ? "AI Processed Successfully ✅" : "Error: " + result.error,
        data: result,
        time: new Date().toLocaleTimeString() 
      }]);
    } catch (err: any) {
      setLogs(prev => [...prev, { type: 'error', text: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-1">MVP Test Console</h1>
        <p className="text-gray-400">Simulate WhatsApp messages to test your AI booking loop.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Side */}
        <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-[32px]">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Customer Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 bg-[#0a0a0b] border border-white/10 rounded-2xl p-4 text-sm focus:border-purple-500 outline-none transition-all"
              placeholder="e.g. Nak booking urut esok pukul 2pm"
            />
          </div>
          
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
            <b>Note:</b> This simulation sends a payload to <code>/api/whatsapp</code> using the phone number <code>60123456789</code>. Ensure you created a business with this number in the onboarding step!
          </div>

          <button 
            onClick={simulateMessage}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            {loading ? "AI is thinking..." : "Send Mock WhatsApp Message"}
          </button>
        </div>

        {/* Output Side (The Console) */}
        <div className="bg-[#0a0a0b] border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 font-bold text-xs uppercase tracking-widest flex justify-between">
            <span>Execution Logs</span>
            <button onClick={() => setLogs([])} className="text-gray-500 hover:text-white">Clear</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[10px]">
            {logs.length === 0 && <div className="text-gray-600 italic">Waiting for simulation...</div>}
            {logs.map((log, i) => (
              <div key={i} className={`p-3 rounded-lg ${
                log.type === 'user' ? 'bg-white/5 border border-white/5' : 
                log.type === 'system' ? 'bg-green-500/5 border border-green-500/10 text-green-400' : 
                'bg-red-500/5 border border-red-500/10 text-red-400'
              }`}>
                <div className="flex justify-between mb-1 opacity-50 uppercase font-bold">
                  <span>{log.type}</span>
                  <span>{log.time}</span>
                </div>
                <div className="text-sm font-sans mb-2">{log.text}</div>
                {log.data && (
                  <pre className="bg-black/50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
