import React from 'react';
import { AuthBranding } from '@/components/auth/AuthBranding';
import { AuthForm } from '@/components/auth/AuthForm';

export default function Auth() {
  return (
    <div className="min-h-screen bg-background flex">
      <AuthBranding />
      <AuthForm />
    </div>
  );
}
