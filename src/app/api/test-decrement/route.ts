
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // First, get the current number of credits
  const { data: before, error: beforeError } = await supabase
    .from('sc_users')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (beforeError) {
    return NextResponse.json({ error: beforeError.message }, { status: 500 });
  }

  // Decrement the credits
  const { error: decrementError } = await supabase.rpc('decrement_credits', {
    p_user_id: user.id,
  });
  console.log(decrementError)

  if (decrementError) {
    return NextResponse.json({ error: decrementError.message }, { status: 500 });
  }

  // Then, get the new number of credits
  const { data: after, error: afterError } = await supabase
    .from('sc_users')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (afterError) {
    return NextResponse.json({ error: afterError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: 'Credits decremented successfully!',
    credits_before: before.credits,
    credits_after: after.credits,
  });
}
