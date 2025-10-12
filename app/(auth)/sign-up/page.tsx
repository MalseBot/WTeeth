/** @format */

'use client';

import { register } from '@/app/actions/auth';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUpSchema } from '@/lib/zodSchemas';
import { toast } from 'sonner';
export default function SignUpPage() {
	const router = useRouter();
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ name: '', email: '', password: '' }); // <-- move here
	const t = useTranslations('SignUp');
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');
		setLoading(true);

		const result = signUpSchema.safeParse(form);
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
		try {
			const formData = new FormData();
			formData.append('name', form.name);
			formData.append('email', form.email);
			formData.append('password', form.password);

			const res = await register(formData);

			if (res.success === true) {
				return (
					router.push('/sign-in'),
					toast.success('Signed up successfuly', {
						description: 'Sending you to sign in page',
						style: {
							'--normal-bg':
								'light-dark(var(--color-green-600), var(--color-green-400))',
							'--normal-text': 'var(--color-white)',
							'--normal-border':
								'light-dark(var(--color-green-600), var(--color-green-400))',
						} as React.CSSProperties,
					})
				);
			}
		} catch (error) {
			console.error(error);
			setError('Something went wrong, please try again later.');
			toast.error('Something went wrong, please try again later.', {
				style: {
					'--normal-bg':
						'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
					'--normal-text': 'var(--color-white)',
					'--normal-border': 'transparent',
				} as React.CSSProperties,
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					className='w-full'>
					<div className='flex flex-col gap-6'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>{t('Name')}</Label>
							<Input
								id='name'
								type='text'
								placeholder='mohamed'
								required
								value={form.name}
								onChange={(e) =>
									setForm((f) => ({ ...f, name: e.target.value }))
								}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>{t('Email')}</Label>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								required
								value={form.email}
								onChange={(e) =>
									setForm((f) => ({ ...f, email: e.target.value }))
								}
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
								onChange={(e) =>
									setForm((f) => ({ ...f, password: e.target.value }))
								}
							/>
						</div>
						{error && <div className='text-red-500 text-sm'>{error}</div>}
					</div>
					<Button
						type='submit'
						className='w-full mt-5'>
						{loading ? t('Loading') : t('signUp')}
					</Button>
				</form>
			</CardContent>
			<CardFooter className='flex-col gap-2'>
				<div className='mt-4 text-center text-sm font-semibold'>
					{t('Account')}
					<a
						href='/sign-in'
						className='underline hover:text-secondary underline-offset-4'>
						{t('signUp')}
					</a>
				</div>
			</CardFooter>
		</Card>
	);
}
