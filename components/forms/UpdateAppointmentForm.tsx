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
		updatedAt: Date;
		id: string;
	};
}

export default function UpdateAppointmentForm({ appointment }: ParamsProps) {
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
			console.log(error);

			return;
		}
		console.log(form);
		const update = getUpdateAppointment(form);
		if (!update) {
			setError('Something went wrong !!');
			console.log(error);
			setLoading(false);
		}
		router.push(`/appointmentDetails/${form.id}`);
		//toaster
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
								<CardTitle>Book Appointment</CardTitle>
							</DialogTitle>
							<CardDescription>
								Fill in the details below to create a new appointment.
							</CardDescription>
						</CardHeader>
					</DialogHeader>
					<CardContent className='gap-5'>
						<form
							onSubmit={handleSubmit}
							className='w-3/5'>
							<div className='grid grid-cols-2 gap-6'>
								<div className='grid gap-2'>
									<Label htmlFor='status'>Status</Label>
									<select
										id='status'
										name='status'
										value={form.status}
										onChange={handleChange}
										className='border rounded px-2 py-1 w-full'>
										<option value='Scheduled'>Scheduled</option>
										<option value='Completed'>Completed</option>
										<option value='Cancelled'>Cancelled</option>
									</select>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='payment'>Payment</Label>
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
									<Label htmlFor='operation'>Operation</Label>
									<Input
										type='text'
										id='operation'
										name='operation'
										value={form.operation}
										onChange={handleChange}
									/>
								</div>
								<div className='grid gap-2 col-span-2'>
									<Label htmlFor='prescription'>Diagnose</Label>
									<Textarea
										id='prescription'
										name='prescription'
										value={form.prescription}
										onChange={handleChange}
									/>
								</div>
								<div className='grid gap-2 col-span-2'>
									<Label htmlFor='medicine'>Medicine</Label>
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
								{loading ? 'Saving...' : 'Update Appointment'}
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
