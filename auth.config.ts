/** @format */

import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import NextAuth, { type DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend the built-in session types
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: string;
		} & DefaultSession['user'];
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const { email, password } = credentials as {
					email: string;
					password: string;
				};

				// Find user in your database
				const user = await prisma.user.findUnique({
					where: { email },
				});
				if (!user || !user.password) return null;

				// Use bcrypt to compare passwords if hashed
				const bcrypt = require('bcryptjs');
				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) return null;

				return {
					id: user.id,
					email: user.email,
					role: user.role,
					name: user.name,
				};
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/sign-in',
	},
	callbacks: {
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
	},
});
