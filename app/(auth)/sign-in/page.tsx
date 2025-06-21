/** @format */

'use client';

import { signIn } from 'next-auth/react';
// import { authenticate } from '@/app/actions/auth';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { prisma } from '@/lib/prisma';

export default function SignInPage() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const res = await signIn('credentials', {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: true,
			redirectTo: '/',
		});
		//@ts-ignore
		if (res?.error) setError('Invalid credentials');
	};

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<form
				onSubmit={handleSubmit}
				className='space-y-4 w-full max-w-md p-6'>
				<h1 className='text-2xl font-bold mb-6'>Sign In</h1>
				<div>
					<label
						htmlFor='email'
						className='block text-sm font-medium mb-1'>
						Email
					</label>
					<input
						type='email'
						name='email'
						id='email'
						required
						className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
					/>
				</div>
				<div>
					<label
						htmlFor='password'
						className='block text-sm font-medium mb-1'>
						Password
					</label>
					<input
						type='password'
						name='password'
						id='password'
						required
						className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
					/>
				</div>
				{error && <p className='text-red-500 text-sm'>{error}</p>}
				<button
					type='submit'
					disabled={loading}
					className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
				<a
					href='/sign-up'
					className='text-center'>{`I don't have an account`}</a>
			</form>
		</div>
	);
}
