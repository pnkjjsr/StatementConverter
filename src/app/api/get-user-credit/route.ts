
import { getUserCreditInfo } from '@/lib/actions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const creditInfo = await getUserCreditInfo();
    return NextResponse.json({ creditInfo });
  } catch (error) {
    console.error('API Error getting user credit info:', error);
    return new NextResponse(
      'Error fetching credit information.',
      { status: 500 }
    );
  }
}
