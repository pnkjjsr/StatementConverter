// src/components/InviteFriendForm.tsx
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { CardDescription } from './ui/card';
import { useTransition } from 'react';
import { sendInvites } from '@/lib/actions';

interface InviteFriendFormProps {
    referralLink: string;
}

const formSchema = z.object({
  invites: z.array(z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'A valid email is required' }),
  })).min(1).max(5),
});

export function InviteFriendForm({ referralLink }: InviteFriendFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invites: [{ name: '', email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invites',
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const result = await sendInvites({ invites: values.invites, referralLink });
        if(result.success) {
          toast({
            title: 'Invites Sent!',
            description: "Your friends will receive their invitations shortly.",
          });
          form.reset({ invites: [{ name: '', email: '' }]});
        } else {
          throw new Error(result.message || "An unknown error occurred.");
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error instanceof Error ? error.message : 'There was a problem sending your invites.',
        });
      }
    });
  };

  return (
    <div className="mt-8 pt-8 border-t">
        <CardDescription className="text-center mb-4 font-semibold">Or invite by email</CardDescription>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <FormField
                control={form.control}
                name={`invites.${index}.email`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                        <Input placeholder="friend@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <div className="flex gap-2">
                    <FormField
                    control={form.control}
                    name={`invites.${index}.name`}
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                        <FormLabel className="sr-only">Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Friend's Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        className="mt-0"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            ))}

            <div className="flex justify-between items-center">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', email: '' })}
                    disabled={fields.length >= 5}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Friend
                </Button>
                <Button type="submit" disabled={isPending || fields.length === 0} className="w-full sm:w-auto">
                    {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                    ) : (
                    'Send Invites'
                    )}
                </Button>
            </div>
             {fields.length >= 5 && <p className="text-sm text-center text-muted-foreground">You can invite up to 5 friends at a time.</p>}
        </form>
        </Form>
    </div>
  );
}
