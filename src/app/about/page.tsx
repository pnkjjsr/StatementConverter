
export default function AboutPage() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="prose prose-lg mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          About Bank Statement Converter
        </h1>

        <p className="mt-6 text-xl text-gray-500">
          Welcome to Bank Statement Converter, your go-to solution for effortlessly transforming PDF bank and credit card statements into clean, usable Excel (CSV) files. We understand that manual data entry is tedious, time-consuming, and prone to errors. Our mission is to eliminate that friction, providing a tool that is fast, secure, and incredibly accurate.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          Our Story
        </h2>
        <p className="mt-4 text-gray-500">
          Founded by a team of financial professionals and software engineers, Bank Statement Converter was born out of a real-world need. We spent countless hours transcribing data from PDF statements for financial analysis, accounting, and expense tracking. We knew there had to be a better way. Leveraging cutting-edge AI and machine learning, we built the tool we always wished we had.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          Our Technology
        </h2>
        <p className="mt-4 text-gray-500">
          Our platform is built on a foundation of security and precision. We use advanced optical character recognition (OCR) and sophisticated AI models to intelligently identify and extract tabular data from various PDF layouts. The data is then cleaned, standardized, and formatted into a perfect CSV file, ready for import into Excel, Google Sheets, or any other data analysis software. We don't store your files, and your data is processed securely.
        </p>

        <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
          Our Commitment
        </h2>
        <p className="mt-4 text-gray-500">
          We are committed to continuous improvement. The world of financial documents is ever-changing, and we are constantly updating our algorithms to support new statement formats and improve extraction accuracy. If our tool ever fails to convert your document to your satisfaction, our team is here to help. Your success is our success.
        </p>
      </div>
    </div>
  );
}
