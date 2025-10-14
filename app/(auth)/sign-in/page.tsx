
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
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ email: '', password: '' });
	const Router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// Validate with Zod
		const result = signInSchema.safeParse(form);
		if (!result.success) {
			setError(result.error.errors[0].message);
			setLoading(false);
			toast.error(result.error.errors[0].message, {
				style: {
					'--normal-bg':
						'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
					'--normal-text': 'var(--color-white)',
					'--normal-border': 'transparent',
				} as React.CSSProperties,
			});
			return;
		}

		const res = await signIn('credentials', {
			email: form.email,
			password: form.password,
			redirect: false,
		});

		// next-auth signIn returns { error, ok, status, url } or null
		if (res?.error) {
			setError('Invalid credentials');
			setLoading(false);
			toast.error('Invalid credentials', {
				style: {
					'--normal-bg':
						'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
					'--normal-text': 'var(--color-white)',
					'--normal-border': 'transparent',
				} as React.CSSProperties,
			});
			return;
		} else if (res?.ok ) {
			toast.success('Welcome back', {
				description: 'Sending you to home page',
				style: {
					'--normal-bg':
						'light-dark(var(--color-green-600), var(--color-green-400))',
					'--normal-text': 'var(--color-white)',
					'--normal-border':
						'light-dark(var(--color-green-600), var(--color-green-400))',
				} as React.CSSProperties,
			});
			Router.push('/')
		}};

	const t = useTranslations('Login'); // Use the hook

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent className='hover:!scale-100 !w-full'>
				<form
					onSubmit={handleSubmit}
					className='w-full'>
					<div className='flex flex-col gap-6'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>{t('Email')}</Label>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								required
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
							/>
						</div>
						<div className='grid gap-2'>
							<div className='flex items-center'>
								<Label htmlFor='password'>{t('Password')}</Label>
							</div>
							<Input
								id='password'
								type='password'
								required
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
							/>
						</div>
					</div>
					<Button
						type='submit'
						className='w-full mt-5' >
						{loading ? t('Loading') : t('Login')}
					</Button>
				</form>
			</CardContent>
			<CardFooter className='flex-col gap-2'>
				<div className='mt-4 text-center text-sm font-semibold'>
					{t('noAccount')}
					<a
						href='/sign-up'
						className='underline hover:text-secondary underline-offset-4'>
						{t('signUp')}
					</a>
				</div>
			</CardFooter>
		</Card>
	);
}
