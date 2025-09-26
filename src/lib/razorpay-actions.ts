
'use server';

import Razorpay from 'razorpay';
import { z } from 'zod';
import { supabaseAdmin } from './supabase';
import { createHmac } from 'crypto';
import { tiers } from './tiers';

const createSubscriptionSchema = z.object({
  planId: z.string(),
});

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_subscription_id: z.string(),
  razorpay_signature: z.string(),
  userId: z.string().uuid(),
  planId: z.string(),
});

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.error('Razorpay keys are not configured in environment variables.');
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId!,
  key_secret: razorpayKeySecret!,
});

export async function createSubscription(input: z.infer<typeof createSubscriptionSchema>) {
  const validatedInput = createSubscriptionSchema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid plan ID.' };
  }

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: validatedInput.data.planId,
      customer_notify: 1,
      total_count: 12, // For a yearly plan, adjust as needed
    });

    return {
      subscriptionId: subscription.id,
      keyId: razorpay.key_id,
    };
  } catch (error: any) {
    console.error('Razorpay subscription creation failed:', error);
    const message = error?.error?.description || error.message || 'An unknown error occurred.';
    return { error: `Could not create subscription: ${message}` };
  }
}

export async function verifyPaymentAndUpdateDB(input: z.infer<typeof verifyPaymentSchema>) {
    const validatedInput = verifyPaymentSchema.safeParse(input);
    if (!validatedInput.success) {
        return { error: 'Invalid payment details provided.' };
    }

    if (!supabaseAdmin) {
        return { error: 'Database client not configured.' };
    }

    const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
        userId,
        planId,
    } = validatedInput.data;

    try {
        // Step 1: Verify the signature
        const body = razorpay_payment_id + '|' + razorpay_subscription_id;
        
        if (!razorpayKeySecret) {
          throw new Error('Razorpay key secret is not configured for signature verification.');
        }

        const generated_signature = createHmac('sha256', razorpayKeySecret)
                                        .update(body.toString())
                                        .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return { error: 'Payment verification failed: Invalid signature.' };
        }

        // Step 2: Signature is valid, update the sc_subscriptions table
        const { data, error } = await supabaseAdmin
            .from('sc_subscriptions')
            .upsert(
                {
                    user_id: userId,
                    provider: 'razorpay',
                    provider_subscription_id: razorpay_subscription_id,
                    provider_plan_id: planId,
                    status: 'active',
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id,provider',
                }
            )
            .select()
            .single();

        if (error) {
            console.error('Supabase subscription update failed:', error);
            throw new Error('Failed to update your subscription status in our database.');
        }

        // Step 3: Update the user's plan and credits in the sc_users table
        let userPlan = 'Free';
        let userCredits = 5; // Default free credits

        const allTiers = [...tiers.monthly, ...tiers.annual];
        const selectedTier = allTiers.find(t => t.razorpay_plan_id === planId);

        if (selectedTier) {
          userPlan = selectedTier.name;
          const pagesFeature = selectedTier.features.find(f => f.includes('pages'));
          if (pagesFeature) {
            const match = pagesFeature.match(/([\d,]+)/);
            if (match) {
              userCredits = parseInt(match[1].replace(/,/g, ''), 10);
            }
          }
        }

        const { error: userUpdateError } = await supabaseAdmin
            .from('sc_users')
            .update({ plan: userPlan, credits: userCredits })
            .eq('id', userId);

        if (userUpdateError) {
            console.error('Supabase user plan update failed:', userUpdateError);
            throw new Error('Failed to update your user profile with the new plan.');
        }

        return { success: true, subscription: data };

    } catch (error) {
        console.error('Payment verification/DB update error:', error);
        const message = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return { error: message };
    }
}
