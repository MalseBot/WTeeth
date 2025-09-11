/** @format */

'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { getUpdatePatient } from '@/lib/fetching';
import { useRouter } from 'next/navigation';
import { editPatientSchema } from '@/lib/zodSchemas';
import { Edit2 } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { useTranslations } from 'next-intl';

interface PatientProps {
	patient: {
		name: string;
		id: string;
		createdAt: Date;
		age: number;
		address: string;
		bloodType: string;
		phone: string;
		gender: string;
		note: string;
	};
}

export default function PatientForm({ patient }: PatientProps) {
	const router = useRouter();
	const [form, setForm] = useState(patient || {});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const result = editPatientSchema.safeParse(form);
		if (!result.success) {
			setError(result.error.errors[0].message);
			setLoading(false);
			return;
		}
		console.log(form);
		const update = getUpdatePatient(form.id, form);
		if (!update) {
			setError(t('Error'));
			console.log(error);
			setLoading(false);
		}
		router.refresh();
		setLoading(false);
		//toaster
	};
	const t=useTranslations("PatientForm")


	return (
		<Dialog>
			<DialogTrigger>
				<Edit2 className='text-primary cursor-pointer hover:scale-110 transform duration-500 active:text-secondary' />
			</DialogTrigger>
			<DialogContent>
				<Card className=' !border-0 !shadow-none bg-transparent'>
					<DialogHeader>
						<DialogTitle>
							<CardHeader>
								<CardTitle>{t('title')}</CardTitle>
								<CardDescription>
									{t('description')}
								</CardDescription>
							</CardHeader>
						</DialogTitle>
					</DialogHeader>
					<CardContent className='hover:scale-100 w-full'>
						<form
							onSubmit={handleSubmit}
							className='w-full'>
							<div className='grid grid-cols-2 w-full gap-6'>
								<div className='grid gap-2'>
									<Label htmlFor='name'>{t('name')}</Label>
									<Input
										id='name'
										type='text'
										required
										value={form?.name || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, name: e.target.value }))
										}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='age'>{t('age')}</Label>
									<Input
										id='age'
										type='number'
										min={0}
										required
										value={form?.age ?? ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, age: Number(e.target.value) }))
										}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='address'>{t('address')}</Label>
									<Input
										id='address'
										type='text'
										required
										value={form?.address || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, address: e.target.value }))
										}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='bloodType'>{t('blood')}</Label>
									<Input
										id='bloodType'
										type='text'
										required
										value={form?.bloodType || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, bloodType: e.target.value }))
										}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='phone'>{t('phone')}</Label>
									<Input
										id='phone'
										type='tel'
										required
										value={form?.phone || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, phone: e.target.value }))
										}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='gender'>{t('gender')}</Label>
									<select
										id='gender'
										required
										className='border rounded px-2 py-1'
										value={form?.gender || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, gender: e.target.value }))
										}>
										<option value=''>{t('select')}</option>
										<option value='Male'>{t('male')}</option>
										<option value='Female'>{t('female')}</option>
									</select>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='note'>{t('note')}</Label>
									<Textarea
										id='note'
										value={form?.note || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, note: e.target.value }))
										}
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
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
}
