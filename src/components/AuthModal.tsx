
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>('login');

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
          <LoginForm onSwitchView={() => setView('signup')} />
        ) : (
          <SignupForm onSwitchView={() => setView('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
}
