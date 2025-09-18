
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, supabaseError } from '@/lib/supabase';
import type { Provider } from '@supabase/supabase-js';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

interface LoginFormProps {
  onSwitchView: () => void;
}

const socialProviders = [
    { name: 'Google', icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.02 1.67-3.27 0-5.92-2.68-5.92-5.99s2.65-5.99 5.92-5.99c1.7 0 3.02.62 4.08 1.62l2.6-2.6C16.8 3.3 14.7.98 12.48.98c-4.97 0-9 4.03-9 9s4.03 9 9 9c2.39 0 4.34-.79 5.82-2.26 1.5-1.5 2.22-3.75 2.22-6.14 0-.5-.06-.92-.15-1.33H12.48z"/></svg> },
    { name: 'Facebook', icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Facebook</title><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg> },
    { name: 'Twitter', icon: <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153Zm-1.65 19.57h2.61L7.129 2.65H4.43l12.822 18.074Z"/></svg> },
] as const;


export function LoginForm({ onSwitchView }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (supabaseError) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Supabase credentials are not configured. Authentication is disabled.',
      });
    }
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Login Successful',
        description: "Welcome back!",
      });
      // onOpenChange(false); // Close modal on success
    }
    setLoading(false);
  }

  const handleOAuthLogin = async (provider: Provider) => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      toast({
        variant: 'destructive',
        title: `Could not authenticate with ${provider}`,
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="sarah.wilson@company.com" {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading || !!supabaseError}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthLogin(provider.name.toLowerCase() as Provider)}
            disabled={!!supabaseError}
          >
            {provider.icon}
            Continue with {provider.name}
          </Button>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{' '}
        <Button variant="link" type="button" onClick={onSwitchView} className="p-0 h-auto">
          Sign up
        </Button>
      </p>
    </div>
  );
}
