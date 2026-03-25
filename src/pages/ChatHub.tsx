import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cpu, Building, User, Mail, Phone, Globe, Hash, FileText, Send, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const INDUSTRIES = [
  'Fintech', 'E-Commerce', 'E-Wallet', 'Insurance', 'Multi-Finance',
  'P2P Lending', 'BNPL', 'Securities', 'Telco', 'Travel',
  'Automotive', 'Pawnshop', 'Healthcare', 'Education', 'Other',
];

const CONNECTION_TYPES = ['REST-API', 'H2H-SOCKET', 'SFTP-BATCH'];

export default function ChatHub() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    company_name: '',
    company_code: '',
    industry: 'Fintech',
    pic_name: '',
    pic_email: '',
    pic_phone: '',
    connection_type: 'REST-API',
    va_prefix: '',
    notes: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('chathub_submissions').insert([form]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-2">
            Your onboarding application for <strong>{form.company_name}</strong> has been sent to our approval team.
          </p>
          <p className="text-sm text-muted-foreground/60 mb-8">
            You will receive an email at <strong>{form.pic_email}</strong> once your application is reviewed. Typical review time is 1-2 business days.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ company_name: '', company_code: '', industry: 'Fintech', pic_name: '', pic_email: '', pic_phone: '', connection_type: 'REST-API', va_prefix: '', notes: '' }); }}>
              Submit Another
            </Button>
            <Link to="/auth">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 zenith-gradient rounded-xl flex items-center justify-center">
              <Cpu size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Bank XYZ ChatHub</p>
              <p className="text-[10px] text-muted-foreground">One-Step Corporate Onboarding</p>
            </div>
          </div>
          <Link to="/auth" className="text-xs text-primary hover:underline flex items-center gap-1">
            <ArrowLeft size={12} /> Admin Login
          </Link>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Corporate Client Registration</h1>
          <p className="text-sm text-muted-foreground">
            Fill out this form to apply for Virtual Account integration with Bank XYZ. Your application will be reviewed by our approver team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Info */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building size={16} className="text-primary" /> Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name *</label>
                <Input value={form.company_name} onChange={e => update('company_name', e.target.value)} placeholder="PT. Example Indonesia" required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Code *</label>
                <Input value={form.company_code} onChange={e => update('company_code', e.target.value.toUpperCase())} placeholder="EXM" maxLength={5} required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Industry *</label>
                <select
                  value={form.industry}
                  onChange={e => update('industry', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">VA Prefix</label>
                <Input value={form.va_prefix} onChange={e => update('va_prefix', e.target.value)} placeholder="88XXX" maxLength={5} />
              </div>
            </div>
          </section>

          {/* PIC Info */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <User size={16} className="text-primary" /> Person in Charge (PIC)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                <Input value={form.pic_name} onChange={e => update('pic_name', e.target.value)} placeholder="John Doe" required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Email *</label>
                <Input type="email" value={form.pic_email} onChange={e => update('pic_email', e.target.value)} placeholder="john@example.com" required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
                <Input value={form.pic_phone} onChange={e => update('pic_phone', e.target.value)} placeholder="+62 812 XXX XXXX" />
              </div>
            </div>
          </section>

          {/* Integration */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe size={16} className="text-primary" /> Integration Preference
            </h2>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Connection Type</label>
              <div className="flex gap-3">
                {CONNECTION_TYPES.map(ct => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => update('connection_type', ct)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      form.connection_type === ct
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Additional Notes
            </h2>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Any additional requirements, expected transaction volume, or special requests..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              maxLength={1000}
            />
          </section>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                <Send size={16} /> Submit Application
              </>
            )}
          </Button>

          <p className="text-[10px] text-muted-foreground/50 text-center">
            By submitting, you agree to Bank XYZ's terms of service and data processing policy. Your application will be reviewed within 1-2 business days.
          </p>
        </form>
      </div>
    </div>
  );
}
