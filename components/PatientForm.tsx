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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

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
	const router = useRouter()
	const [form, setForm] = useState(patient || {});
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const handleSubmit = (e:React.FormEvent)=>{
		e.preventDefault()
		setLoading(true)
		const result = editPatientSchema.safeParse(form);
		if (!result.success) {
			setError(result.error.errors[0].message);
			setLoading(false);
			return;
		}
		console.log(form);
		const update = getUpdatePatient(form.id,form)
		if(!update){
			setError('Something went wrong !!')
			console.log(error);
			setLoading(false)
		}
		 router.refresh()
		setLoading(false)
		//toaster
	}

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
								<CardTitle>Edit Patient Profile</CardTitle>
								<CardDescription>
									Update the patient information below.
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
									<Label htmlFor='name'>Name</Label>
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
									<Label htmlFor='age'>Age</Label>
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
									<Label htmlFor='address'>Address</Label>
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
									<Label htmlFor='bloodType'>Blood Type</Label>
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
									<Label htmlFor='phone'>Phone</Label>
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
									<Label htmlFor='gender'>Gender</Label>
									<select
										id='gender'
										required
										className='border rounded px-2 py-1'
										value={form?.gender || ''}
										onChange={(e) =>
											setForm((f) => ({ ...f, gender: e.target.value }))
										}>
										<option value=''>Select gender</option>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
									</select>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='note'>Note</Label>
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
								{loading ? 'Loading ...' : 'Save Changes'}
							</Button>
						</form>
					</CardContent>
					<CardFooter className='flex-col gap-2'></CardFooter>
				</Card>
			</DialogContent>
		</Dialog>
	);
}
