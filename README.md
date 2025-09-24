# Bank Statement Converter

This is a Next.js web application that allows users to upload their bank statements in PDF format and convert them into a structured, standardized CSV format. The application uses AI to extract and transform the data, and it supports both anonymous and registered users.

## Key Features

*   **PDF to CSV Conversion:** Upload a bank statement in PDF format and receive a downloadable CSV file with the extracted data.
*   **AI-Powered Data Extraction:** The application uses the Gemini family of models via Genkit to intelligently extract transaction data from the PDF.
*   **User Accounts:** Users can sign up for an account to get more free conversions and access to higher tiers.
*   **Anonymous Usage:** Users can try the service without creating an account, with a limited number of free conversions.
*   **Referral System:** Users can earn additional credits by referring new users.

## Tools and Libraries

This project is built with the following technologies:

*   **[Next.js](https://nextjs.org/):** A React framework for building full-stack web applications.
*   **[Genkit](https://firebase.google.com/docs/genkit):** An open-source framework for building AI-powered applications.
*   **[Supabase](https://supabase.com/):** An open-source Firebase alternative for the database, authentication, and user management.
*   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
*   **[Shadcn/ui](https://ui.shadcn.com/):** A collection of re-usable UI components.
*   **[Vercel](https://vercel.com/):** The platform for deploying the Next.js application.

## Getting Started

To get the application up and running locally, follow these steps:

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

3.  **Run the Genkit Server:**

    In a separate terminal, run the following command to start the Genkit server:

    ```bash
    npm run genkit:dev
    ```

    This will start the Genkit server on [http://localhost:3100](http://localhost:3100).

4.  **Set Up Environment Variables:**

    You will need to create a `.env.local` file in the root of the project and add the necessary environment variables for Supabase and any other services you are using.

## Available Scripts

The following scripts are available in the `package.json` file:

*   `dev`: Starts the Next.js development server with Turbopack.
*   `genkit:dev`: Starts the Genkit development server.
*   `genkit:watch`: Starts the Genkit development server with file watching.
*   `build`: Creates a production build of the Next.js application.
*   `start`: Starts the Next.js production server.
*   `lint`: Lints the code using Next.js's built-in ESLint configuration.
*   `typecheck`: Runs the TypeScript compiler to check for type errors.
