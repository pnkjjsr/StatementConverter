
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialView?: 'login' | 'signup';
}

export function AuthModal({ open, onOpenChange, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  useEffect(() => {
    if (open) {
      setView(initialView);
    }
  }, [open, initialView]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {view === 'login' ? 'Welcome back' : 'Create an account'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === 'login' ? 'Sign in to access your account' : 'to start converting your statements'}
          </DialogDescription>
        </DialogHeader>
        {view === 'login' ? (
          <LoginForm onSwitchView={() => setView('signup')} onOpenChange={onOpenChange} />
        ) : (
          <SignupForm onSwitchView={() => setView('login')} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}
