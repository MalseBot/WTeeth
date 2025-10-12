/** @format */

'use client';
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import { appointmentSchema } from '@/lib/zodSchemas';
import { getUpdateAppointment } from '@/lib/fetching';
import { Edit2 } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import UpdateMaterial from '../UpdateMaterial';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
// import UpdateMaterial from './UpdateMaterial';

interface ParamsProps {
	appointment: {
		patientId: string;
		date: Date;
		payment: number;
		prescription: string;
		status: string;
		medicine: string;
		operation: string;
		updatedAt: string;
		id: string;
	};
}

export default function UpdateAppointmentForm({ appointment }: ParamsProps) {
	const t = useTranslations('UpdateAppointmentForm');
	const router = useRouter();
	const [form, setForm] = useState(appointment);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const result = appointmentSchema.safeParse(form);
		if (!result.success) {
			setError(result.error.errors[0].message);
			setLoading(false);
			console.log(error, result, 'here');
			toast.error(t('Error'), {
				classNames: { error: 'bg-red-500 text-white' },
			});
		}

		const update = getUpdateAppointment(form);
		if (!update) {
			setError(t('Error'));
			console.log(error, result);
			setLoading(false);
			toast.error(t('Error'), {
				style: {
					'--normal-bg':
						'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
					'--normal-text': 'var(--color-white)',
					'--normal-border': 'transparent',
				} as React.CSSProperties,
			});
		}
		router.push(`/appointmentDetails/${form.id}`);
		toast.success(t('updated'), {
			style: {
				'--normal-bg':
					'light-dark(var(--color-green-600), var(--color-green-400))',
				'--normal-text': 'var(--color-white)',
				'--normal-border':
					'light-dark(var(--color-green-600), var(--color-green-400))',
			} as React.CSSProperties,
		});
		router.refresh();
		setLoading(false);
	};
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((f) => ({
			...f,
			[name]: name === 'payment' ? Number(value) : value,
		}));
	};
	return (
		<Dialog>
			<DialogTrigger>
				<Edit2 className='text-primary cursor-pointer hover:scale-110 transform duration-500 active:text-secondary' />
			</DialogTrigger>
			<DialogContent className='sm:!max-w-5xl'>
				<Card className=' !border-0 !shadow-none bg-transparent'>
					<DialogHeader>
						<CardHeader>
							<DialogTitle>
								<CardTitle>{t('title')}</CardTitle>
							</DialogTitle>
							<CardDescription>{t('description')}</CardDescription>
						</CardHeader>
					</DialogHeader>
					<CardContent className='gap-5'>
						<form
							onSubmit={handleSubmit}
							className='w-3/5'>
							<div className='grid grid-cols-2 gap-6'>
								<div className='grid gap-2'>
									<Label htmlFor='status'>{t('status')}</Label>
									<select
										id='status'
										name='status'
										value={form.status}
										onChange={handleChange}
										className='border rounded px-2 py-1 w-full'>
										<option value='Scheduled'>{t('scheduled')}</option>
										<option value='Completed'>{t('compeleted')}</option>
										<option value='Cancelled'>{t('cancelled')}</option>
									</select>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='payment'>{t('payment')}</Label>
									<Input
										id='payment'
										name='payment'
										type='number'
										min={0}
										required
										value={form.payment}
										onChange={handleChange}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='operation'>{t('operation')}</Label>
									<Input
										type='text'
										id='operation'
										name='operation'
										value={form.operation}
										onChange={handleChange}
									/>
								</div>
								<div className='grid gap-2 col-span-2'>
									<Label htmlFor='prescription'>{t('diagnose')}</Label>
									<Textarea
										id='prescription'
										name='prescription'
										value={form.prescription}
										onChange={handleChange}
									/>
								</div>
								<div className='grid gap-2 col-span-2'>
									<Label htmlFor='medicine'>{t('medicine')}</Label>
									<Textarea
										id='medicine'
										name='medicine'
										value={form.medicine}
										onChange={handleChange}
									/>
								</div>
								{error && <div className='text-red-500 text-sm'>{error}</div>}
							</div>
							<Button
								type='submit'
								className='w-full mt-5'
								disabled={loading}>
								{loading ? t('saving') : t('save')}
							</Button>
						</form>
						<UpdateMaterial id={appointment.id} />
					</CardContent>
					<CardFooter />
				</Card>
			</DialogContent>
		</Dialog>
	);
}
