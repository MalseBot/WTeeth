/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { appointmentSchema, editPatientSchema } from '@/lib/zodSchemas';
import {
	createAppointment,
	getAllPatients,
	getCreatePatient,
} from '@/lib/fetching';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from './ui/card';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const initialForm = {
	patientId: '',
	date: '',
	payment: 0,
	prescription: '',
	status: 'Scheduled',
	medicine: '',
	operation: '',
	materials: '',
};

const initialPatient = {
	name: '',
	age: 0,
	address: '',
	bloodType: '',
	phone: '',
	gender: 'Male',
	note: '',
};

export const AppointmentForm = () => {
	const [form, setForm] = useState(initialForm);
	const [patients, setPatients] = useState<any[]>([]);
	const [isNewPatient, setIsNewPatient] = useState(false);
	const [patientForm, setPatientForm] = useState(initialPatient);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
    const router = useRouter();

	useEffect(() => {
		getAllPatients().then(setPatients);
	}, []);

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

	const handlePatientChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setPatientForm((f) => ({
			...f,
			[name]: name === 'age' ? Number(value) : value,
		}));
	};

	const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === 'new') {
			setIsNewPatient(true);
			setForm((f) => ({ ...f, patientId: '' }));
		} else {
			setIsNewPatient(false);
			setForm((f) => ({ ...f, patientId: e.target.value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		let patientId = form.patientId;

		if (isNewPatient) {
			const patientResult = editPatientSchema.safeParse(patientForm);
			if (!patientResult.success) {
				setError(patientResult.error.errors[0].message);
				setLoading(false);
				return;
			}
			const newPatient = await getCreatePatient(patientForm);
			patientId = newPatient.id;
		}

		const result = appointmentSchema.safeParse({ ...form, patientId });
		if (!result.success) {
			setError(result.error.errors[0].message);
			setLoading(false);
			return;
		}

		try {
			const created = await createAppointment({ ...form, patientId });
			setForm(initialForm);
			setPatientForm(initialPatient);
			setIsNewPatient(false);
			// Redirect to appointment detail page
			if (created && created.id) {
				router.push(`/appointmentDetails/${created.id}`);
			}
		} catch (err) {
			setError('Failed to create appointment.');
		}
		setLoading(false);
	};

	return (
		<Card className='w-1/2 m-10 '>
			<CardHeader>
				<CardTitle>Book Appointment</CardTitle>
				<CardDescription>
					Fill in the details below to create a new appointment.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<div className='grid grid-cols-2 gap-6'>
						<div className='grid gap-2'>
							<Label htmlFor='patientId'>Patient</Label>
							<select
								id='patientId'
								name='patientId'
								value={isNewPatient ? 'new' : form.patientId}
								onChange={handlePatientSelect}
								className='border rounded px-2 py-1 w-full'
								required>
								<option  value=''>Select patient</option >
								{patients.map((p) => (
									<option 
										key={p.id}
										value={p.id}>
										{p.name} ({p.phone})
									</option >
								))}
								<option  value='new'>+ New Patient</option >
							</select>
						</div>
						{isNewPatient && (
							<>
								<div>
									<Label>Name</Label>
									<Input
										name='name'
										value={patientForm.name}
										onChange={handlePatientChange}
										required
									/>
								</div>
								<div>
									<Label>Age</Label>
									<Input
										name='age'
										type='number'
										value={patientForm.age}
										onChange={handlePatientChange}
										required
									/>
								</div>
								<div>
									<Label>Address</Label>
									<Input
										name='address'
										value={patientForm.address}
										onChange={handlePatientChange}
										required
									/>
								</div>
								<div>
									<Label>Blood Type</Label>
									<Input
										name='bloodType'
										value={patientForm.bloodType}
										onChange={handlePatientChange}
										required
									/>
								</div>
								<div>
									<Label>Phone</Label>
									<Input
										name='phone'
										value={patientForm.phone}
										onChange={handlePatientChange}
										required
									/>
								</div>
								<div>
									<Label>Gender</Label>
									<select
										name='gender'
										value={patientForm.gender}
										onChange={handlePatientChange}
										required
										className='border rounded px-2 py-1 w-full'>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
									</select>
								</div>
								<div>
									<Label>Note</Label>
									<Textarea
										name='note'
										value={patientForm.note}
										onChange={handlePatientChange}
									/>
								</div>
							</>
						)}
						<div className='grid gap-2'>
							<Label htmlFor='date'>Date</Label>
							<Input
								id='date'
								name='date'
								type='datetime-local'
								required
								value={form.date}
								onChange={handleChange}
							/>
						</div>
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
							<Label htmlFor='prescription'>Prescription</Label>
							<Textarea
								id='prescription'
								name='prescription'
								value={form.prescription}
								onChange={handleChange}
							/>
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
							<Label htmlFor='medicine'>Medicine</Label>
							<Textarea
								id='medicine'
								name='medicine'
								value={form.medicine}
								onChange={handleChange}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='operation'>Operation</Label>
							<Textarea
								id='operation'
								name='operation'
								value={form.operation}
								onChange={handleChange}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='materials'>Materials</Label>
							<Textarea
								id='materials'
								name='materials'
								value={form.materials}
								onChange={handleChange}
							/>
						</div>
						{error && <div className='text-red-500 text-sm'>{error}</div>}
					</div>
					<Button
						type='submit'
						className='w-full mt-5'
						disabled={loading}>
						{loading ? 'Saving...' : 'Create Appointment'}
					</Button>
				</form>
			</CardContent>
			<CardFooter />
		</Card>
	);
};
