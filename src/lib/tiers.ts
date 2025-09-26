
export const tiers = {
  monthly: [
    {
      name: 'Starter',
      // TODO: Replace with your actual Razorpay Plan ID for the Starter Monthly plan
      razorpay_plan_id: 'plan_REPLACE_WITH_YOUR_ID',
      price: '$15',
      priceSuffix: '/ month',
      description: 'For individuals and small projects',
      features: ['400 pages / month', 'Email support'],
      cta: 'Choose Plan',
    },
    {
      name: 'Professional',
      // TODO: Replace with your actual Razorpay Plan ID for the Professional Monthly plan
      razorpay_plan_id: 'plan_REPLACE_WITH_YOUR_ID',
      price: '$30',
      priceSuffix: '/ month',
      description: 'For professionals and growing businesses',
      features: ['1000 pages / month', 'Priority email support', 'Access to new features'],
      cta: 'Choose Plan',
      popular: true,
    },
    {
      name: 'Business',
      // TODO: Replace with your actual Razorpay Plan ID for the Business Monthly plan
      razorpay_plan_id: 'plan_REPLACE_WITH_YOUR_ID',
      price: '$50',
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
      // TODO: Replace with your actual Razorpay Plan ID for the Starter Annual plan
      razorpay_plan_id: 'plan_REPLACE_WITH_YOUR_ID',
      price: '$12',
      priceSuffix: '/ month',
      description: 'For individuals and small projects',
      features: ['4,800 pages / year', 'Email support'],
      cta: 'Choose Plan',
    },
    {
      name: 'Professional',
      // TODO: Replace with your actual Razorpay Plan ID for the Professional Annual plan
      razorpay_plan_id: 'plan_REPLACE_WITH_YOUR_ID',
      price: '$24',
      priceSuffix: '/ month',
      description: 'For professionals and growing businesses',
      features: ['12,000 pages / year', 'Priority email support', 'Access to new features'],
      cta: 'Choose Plan',
      popular: true,
    },
    {
      name: 'Business',
      // TODO: Replace with your actual Razorpay Plan ID for the Business Annual plan
      razorpay_plan_id: 'plan_REPLACE_WITH_YOUR_ID',
      price: '$40',
      priceSuffix: '/ month',
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
