/** @format */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/sections/navbar/default';
import Footer from '@/components/sections/footer/default';
import { SessionProvider } from 'next-auth/react';
import ProtectedPage from '@/components/ProtectedPage';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Toaster } from 'sonner';
const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'healthcare',
	description: 'dashboard for healthcare',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	  const locale = await getLocale();

	return (
		<html
			lang={locale}
			dir={locale === 'ar' ? 'rtl' : 'ltr'}>
			<body
				className={`
                    ${geistSans.variable} ${geistMono.variable} antialiased
                    bg-gradient-to-br from-blue-300 via-white to-teal-300 h-full min-h-screen
                `}>
				<SessionProvider>
					<NextIntlClientProvider>
						<Toaster/>
						<Navbar />
						<ProtectedPage>{children}</ProtectedPage>
						<Footer />
					</NextIntlClientProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
