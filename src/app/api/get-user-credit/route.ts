
import { getUserCreditInfo } from '@/lib/actions';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    
    const creditInfo = await getUserCreditInfo(user);
    return NextResponse.json({ creditInfo });
  } catch (error) {
    console.error('API Error getting user credit info:', error);
    return new NextResponse(
      'Error fetching credit information.',
      { status: 500 }
    );
  }
}
