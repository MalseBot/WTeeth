/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInSchema } from '@/lib/zodSchemas';
import { signIn } from 'next-auth/react';
// import { authenticate } from '@/app/actions/auth';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { prisma } from '@/lib/prisma';

export default function SignInPage() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ email: '', password: '' });

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Validate with Zod
		const result = signInSchema.safeParse(form);
		if (!result.success) {
			setError(result.error.errors[0].message);
			setLoading(false);
			return;
		}

		await signIn('credentials', {
			email: form.email,
			password: form.password,
			redirect: true,
			redirectTo: '/',
		});
		if (error) {
			setError('Invalid credentials');
			console.log(Error);
			
			setLoading(false);
			return;
		}
	};

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent className='hover:!scale-100 !w-full'>
				<form onSubmit={handleSubmit} className='w-full'>
					<div className='flex flex-col gap-6'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								required
								value={form.email}
								onChange={e => setForm({ ...form, email: e.target.value })}
							/>
						</div>
						<div className='grid gap-2'>
							<div className='flex items-center'>
								<Label htmlFor='password'>Password</Label>
							</div>
							<Input
								id='password'
								type='password'
								required
								value={form.password}
								onChange={e => setForm({ ...form, password: e.target.value })}
							/>
						</div>
					</div>
				<Button
					type='submit'
					
					className='w-full mt-5'>
					{loading ? 'Loading ...': 'Login'}
				</Button>
				</form>
			</CardContent>
			<CardFooter className='flex-col gap-2'>
				<div className='mt-4 text-center text-sm font-semibold'>
					Don&apos;t have an account?{' '}
					<a
						href='/sign-up'
						className='underline hover:text-secondary underline-offset-4'>
						Sign up
					</a>
				</div>
			</CardFooter>
		</Card>
	);
}
