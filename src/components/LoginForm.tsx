
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
import { Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, supabaseError } from '@/lib/supabase';
import type { Provider } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

interface LoginFormProps {
  onSwitchView: () => void;
}

const socialProviders = [
  { name: 'Google', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.999,35.938,44,30.41,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>, hoverClass: 'hover:bg-gray-100 hover:text-gray-800' },
  // { name: 'Facebook', icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-[#1877F2] group-hover:fill-white"><title>Facebook</title><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>, hoverClass: 'hover:bg-[#1877F2]' },
  // { name: 'Twitter', icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-black group-hover:fill-white"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153Zm-1.65 19.57h2.61L7.129 2.65H4.43l12.822 18.074Z"/></svg>, hoverClass: 'hover:bg-black' },
] as const;


export function LoginForm({ onSwitchView }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (supabaseError) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: supabaseError,
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
      <div className="grid grid-cols-1 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            className={cn("w-full group", provider.hoverClass)}
            onClick={() => handleOAuthLogin(provider.name.toLowerCase() as Provider)}
            disabled={!!supabaseError}
            aria-label={`Continue with ${provider.name}`}
          >
            {provider.icon} Continue with Google
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
