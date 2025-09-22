
export default function PrivacyPage() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-lg mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p className="mt-6 text-xl text-gray-500">
          Bank Statement Converter Ltd. ("us", "we", or "our") operates the Bank Statement Converter website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          1. Information Collection and Use
        </h2>
        <p className="mt-4 text-gray-500">
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>
        <h3 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
          Personal Data
        </h3>
        <p className="mt-4 text-gray-500">
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name.
        </p>
        <h3 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
          Document Data
        </h3>
        <p className="mt-4 text-gray-500">
          We process the PDF documents you upload solely for the purpose of conversion. The documents are sent to our secure processing environment, converted, and the resulting data is returned to you. We do not permanently store your original PDF files or the extracted data on our servers. All uploaded files and converted data are automatically deleted from our system after a short period necessary for you to download the results.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          2. Data Security
        </h2>
        <p className="mt-4 text-gray-500">
          The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data and documents, we cannot guarantee their absolute security.
        </p>
        
        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          3. Service Providers
        </h2>
        <p className="mt-4 text-gray-500">
          We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. This includes our AI model providers.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          4. Changes to This Privacy Policy
        </h2>
        <p className="mt-4 text-gray-500">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          Contact Us
        </h2>
        <p className="mt-4 text-gray-500">
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  );
}
