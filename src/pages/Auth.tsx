import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Cpu, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@doznglobal.com');
  const [password, setPassword] = useState('password1');
  const [fullName, setFullName] = useState('Admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast({ title: 'Account created', description: 'You can now sign in.' });
        navigate('/');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 zenith-gradient items-center justify-center p-12 relative overflow-hidden">
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
          <div className="w-16 h-16 zenith-gradient-accent rounded-2xl flex items-center justify-center shadow-2xl mb-8">
            <Cpu size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Bank XYZ</h1>
          <p className="text-lg text-white/70 mb-2">Virtual Account Management</p>
          <p className="text-sm text-white/50 leading-relaxed">
            AI-powered control plane for corporate client onboarding, real-time transaction monitoring, treasury operations, and regulatory compliance.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-xs text-white/40">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> SNAP BI Certified</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> OJK Compliant</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> ISO 27001</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> 99.99% Uptime</div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 zenith-gradient rounded-xl flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Bank XYZ</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {isLogin ? 'Sign in to access the control plane' : 'Register for Bank XYZ Control Plane access'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground/50 text-center mt-8">
            Protected by Bank XYZ Security Infrastructure · ISO 27001 Certified
          </p>
        </div>
      </div>
    </div>
  );
}
