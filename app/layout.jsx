import { ClerkProvider } from '@clerk/nextjs';
import { Outfit } from 'next/font/google';
import './globals.css';
import Provider from './provider';

export const metadata = {
  title: 'FlickAI - AI Video Generator',
  description: 'Generate videos using AI for YouTube, TikTok, and more.',
};

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
