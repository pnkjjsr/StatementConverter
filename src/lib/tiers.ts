
export const tiers = {
  monthly: [
    {
      name: 'Starter',
      razorpay_plan_id: 'plan_starter_monthly', // REPLACE with your Razorpay Plan ID
      price: '₹499',
      priceSuffix: '/ month',
      description: 'For individuals and small projects',
      features: ['400 pages / month', 'Email support'],
      cta: 'Choose Plan',
    },
    {
      name: 'Professional',
      razorpay_plan_id: 'plan_professional_monthly', // REPLACE with your Razorpay Plan ID
      price: '₹999',
      priceSuffix: '/ month',
      description: 'For professionals and growing businesses',
      features: ['1000 pages / month', 'Priority email support', 'Access to new features'],
      cta: 'Choose Plan',
      popular: true,
    },
    {
      name: 'Business',
      razorpay_plan_id: 'plan_business_monthly', // REPLACE with your Razorpay Plan ID
      price: '₹2499',
      priceSuffix: '/ month',
      description: 'For teams and larger needs',
      features: ['4000 pages / month', 'Dedicated support', 'API access (soon)'],
      cta: 'Choose Plan',
    },
    {
      name: 'Enterprise',
      razorpay_plan_id: null,
      price: 'Custom',
      priceSuffix: '',
      description: 'For large-scale, custom deployments',
      features: ['Unlimited pages', 'Custom integrations', 'On-premise option', '24/7 dedicated support'],
      cta: 'Contact Us',
    },
  ],
  annual: [
    {
      name: 'Starter',
      razorpay_plan_id: 'plan_starter_annual', // REPLACE with your Razorpay Plan ID
      price: '₹4999',
      priceSuffix: '/ year',
      description: 'For individuals and small projects',
      features: ['4,800 pages / year', 'Email support'],
      cta: 'Choose Plan',
    },
    {
      name: 'Professional',
      razorpay_plan_id: 'plan_professional_annual', // REPLACE with your Razorpay Plan ID
      price: '₹9999',
      priceSuffix: '/ year',
      description: 'For professionals and growing businesses',
      features: ['12,000 pages / year', 'Priority email support', 'Access to new features'],
      cta: 'Choose Plan',
      popular: true,
    },
    {
      name: 'Business',
      razorpay_plan_id: 'plan_business_annual', // REPLACE with your Razorpay Plan ID
      price: '₹24999',
      priceSuffix: '/ year',
      description: 'For teams and larger needs',
      features: ['48,000 pages / year', 'Dedicated support', 'API access (soon)'],
      cta: 'Choose Plan',
    },
    {
      name: 'Enterprise',
      razorpay_plan_id: null,
      price: 'Custom',
      priceSuffix: '',
      description: 'For large-scale, custom deployments',
      features: ['Unlimited pages', 'Custom integrations', 'On-premise option', '24/7 dedicated support'],
      cta: 'Contact Us',
    },
  ],
};
