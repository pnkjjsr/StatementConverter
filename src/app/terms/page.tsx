
export default function TermsPage() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-lg mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p className="mt-6 text-xl text-gray-500">
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Bank Statement Converter website (the "Service") operated by Bank Statement Converter Ltd. ("us", "we", or "our").
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          1. Acceptance of Terms
        </h2>
        <p className="mt-4 text-gray-500">
          By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          2. Description of Service
        </h2>
        <p className="mt-4 text-gray-500">
          Our Service provides users with the ability to upload PDF bank and credit card statements and convert them into CSV format. We use AI and machine learning models to extract and format the data. While we strive for high accuracy, we do not guarantee that the conversion will be error-free. You are responsible for verifying the accuracy of the converted data.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          3. User Accounts
        </h2>
        <p className="mt-4 text-gray-500">
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          4. Data and Privacy
        </h2>
        <p className="mt-4 text-gray-500">
          We do not store the contents of your PDF files after the conversion process is complete. We may retain metadata related to your conversions for purposes of billing and usage tracking. Please see our Privacy Policy for more details on how we handle your data.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          5. Termination
        </h2>
        <p className="mt-4 text-gray-500">
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          6. Changes to Terms
        </h2>
        <p className="mt-4 text-gray-500">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          Contact Us
        </h2>
        <p className="mt-4 text-gray-500">
          If you have any questions about these Terms, please contact us.
        </p>
      </div>
    </div>
  );
}
