import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '../components/providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CogniFlow - AI & Cybersecurity Career Academy",
  description: "Transform your career with immersive 3D learning, AI-powered personalization, and voice-first interactions in AI and Cybersecurity domains.",
  keywords: "AI learning, cybersecurity training, 3D virtual learning, career development, immersive education",
  authors: [{ name: "CogniFlow Team" }],
  openGraph: {
    title: "CogniFlow - AI & Cybersecurity Career Academy",
    description: "Transform your career with immersive 3D learning, AI-powered personalization, and voice-first interactions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CogniFlow - AI & Cybersecurity Career Academy",
    description: "Transform your career with immersive 3D learning, AI-powered personalization, and voice-first interactions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey.startsWith('pk_');

  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );

  if (isClerkConfigured) {
    return (
      <ClerkProvider
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: "#0066cc",
            colorBackground: "#ffffff",
            colorInputBackground: "#f8fafc",
            colorInputText: "#1e293b",
            borderRadius: "0.5rem",
          },
          elements: {
            formButtonPrimary: 
              "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200",
            card: "shadow-xl border-0 rounded-xl",
            headerTitle: "text-2xl font-bold text-gray-900",
            headerSubtitle: "text-gray-600",
          },
        }}
      >
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
