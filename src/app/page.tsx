"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import SocialProofBar from '@/components/landing/SocialProofBar';
import AnalyticsDashboardPreview from '@/components/landing/AnalyticsDashboardPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import WhyWhatsApp from '@/components/landing/WhyWhatsApp';
import ReferralSection from '@/components/landing/ReferralSection';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQAccordion from '@/components/landing/FAQAccordion';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0f] text-slate-100 selection:bg-primary-500/30 selection:text-white font-sans scroll-smooth overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero Section (containing title + CTAs + side-by-side chat simulators) */}
      <Hero />

      {/* 3. Social Proof Bar (trust logos + live metric indicators) */}
      <SocialProofBar />

      {/* 4. Live Analytics Dashboard Preview */}
      <section className="py-12 md:py-20 max-w-6xl mx-auto px-6 relative z-10 select-none">
        <AnalyticsDashboardPreview />
      </section>

      {/* 5. How It Works (3 simple setup steps) */}
      <HowItWorks />

      {/* 6. Features Grid (6 core automations) */}
      <Features />

      {/* 7. Why WhatsApp ROI Metrics */}
      <WhyWhatsApp />

      {/* 8. Referral Program (20% Lifetime commission) */}
      <ReferralSection />

      {/* 9. Pricing Plans (Starter vs Growth Pro) */}
      <Pricing />

      {/* 10. Testimonials (3 glowing user cards) */}
      <Testimonials />

      {/* 11. Animated Accordion FAQs */}
      <FAQAccordion />

      {/* 12. Footers */}
      <Footer />

    </div>
  );
}
