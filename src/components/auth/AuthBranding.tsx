import React from 'react';
import { Cpu } from 'lucide-react';

export function AuthBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 dozn-gradient items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
      <div className="relative z-10 text-white max-w-md">
        <div className="w-16 h-16 dozn-gradient-accent rounded-2xl flex items-center justify-center shadow-2xl mb-8">
          <Cpu size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Dozn Global</h1>
        <p className="text-lg text-white/70 mb-2">Virtual Account Management</p>
        <p className="text-sm text-white/50 leading-relaxed">
          AI-powered D-banking Operation for corporate client onboarding, real-time transaction monitoring, treasury operations, and regulatory compliance.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> SNAP BI Certified</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> OJK Compliant</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> ISO 27001</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> 99.99% Uptime</div>
        </div>
      </div>
    </div>
  );
}
