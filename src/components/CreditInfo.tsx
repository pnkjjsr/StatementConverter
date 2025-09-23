
'use client';

import { useEffect, useState } from 'react';

export default function CreditInfo() {
  const [creditInfo, setCreditInfo] = useState('Loading credits...');

  useEffect(() => {
    async function fetchCreditInfo() {
      try {
        const response = await fetch('/api/get-user-credit');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setCreditInfo(data.creditInfo);
      } catch (error) {
        console.error('Error fetching credit info:', error);
        setCreditInfo('Error loading credits');
      }
    }

    fetchCreditInfo();
  }, []);

  return <span>{creditInfo}</span>;
}
