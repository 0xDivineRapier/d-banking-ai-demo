import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@bankxyz.co.id');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('Admin');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email === 'admin@bankxyz.co.id' && password === 'admin123') {
        localStorage.setItem('bankdozn_dummy_auth', 'true');
        toast({ title: 'Success', description: 'Logged in to development environment.' });
        window.location.href = '/';
      } else {
        toast({ title: 'Error', description: 'Invalid credentials. Use admin@bankxyz.co.id / admin123', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 dozn-gradient rounded-xl flex items-center justify-center">
            <Cpu size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Dozn Global</span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-1">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          {isLogin ? 'Sign in to access the D-banking Operation' : 'Register for Dozn Global D-banking Operation access'}
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
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground/50 text-center mt-8">
          Protected by Dozn Global Security Infrastructure · ISO 27001 Certified
        </p>
      </div>
    </div>
  );
}
