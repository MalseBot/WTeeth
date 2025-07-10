/** @format */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/sections/navbar/default';
import Footer from '@/components/sections/footer/default';
import { SessionProvider } from 'next-auth/react';
import ProtectedPage from '@/components/ProtectedPage';
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`
                    ${geistSans.variable} ${geistMono.variable} antialiased
                    bg-gradient-to-br from-blue-300 via-white to-teal-300
                `}
			>
				<SessionProvider>
					<Navbar />
					<ProtectedPage>{children}</ProtectedPage>
					<Footer />
				</SessionProvider>
			</body>
		</html>
	);
}
