"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {  CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { EditIcon, PlusIcon } from 'lucide-react';
import { createBudget, getBudgetById, updateBudget } from '@/lib/fetching';
import { useRouter } from 'next/navigation';

const initialForm = {
	name: '',
	price: 0,
	info: '',
};

export default function BudgetForm({ id }: { id?: string }) {
	const [item, setItem] = useState<any>(null);
	const [form, setForm] = useState<any>(initialForm);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const isEdit = !!id;
	const route = useRouter();

	useEffect(() => {
		if (id) {
			getBudgetById(id).then((data) => {
				setItem(data);
				setForm({
					...data,
					createdAt: data?.createdAt
						? new Date(data.createdAt).toISOString().slice(0, 10)
						: '',
				});
			});
		} else {
			setForm(initialForm);
		}
	}, [id]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setForm((f: any) => ({
			...f,
			[name]: name === 'price' ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			if (isEdit) {
				await updateBudget(id!, form);
			} else {
				await createBudget(form);
				setForm(initialForm);
			}
			route.refresh();
			setLoading(false);
		} catch (err) {
			setError('Failed to save item');
			console.log('Error saving item:', err);

			setLoading(false);
		}
	};
	return (
		<Dialog>
			<DialogTrigger>
				{isEdit ? (
					<EditIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />
				) : (
					<p className='inline-flex py-1.5 px-2 font-semibold cursor-pointer items-center justify-center whitespace-nowrap rounded-bl-md rounded-tr-md transform duration-300 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow-sm dark:hover:from-secondary/80 hover:from-secondary/70 dark:hover:to-secondary/70 hover:to-secondary/90 bg-linear-to-b from-secondary/60 to-primary/100 dark:from-primary/100 dark:to-primary/70 border-t-primary'>
						<PlusIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />{' '}
						Add Expense
					</p>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<CardTitle>{isEdit ? 'Update Item' : 'Create Item'}</CardTitle>
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className='grid grid-cols-2 gap-4 mt-2'>
					<div>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							name='name'
							value={form.name || ''}
							onChange={handleChange}
							placeholder='Name'
							required
						/>
					</div>
					<div>
						<Label htmlFor='price'>Price</Label>
						<Input
							id='price'
							name='price'
							type='number'
							value={form.price ?? ''}
							onChange={handleChange}
							placeholder='Quantity'
							required
						/>
					</div>
					<div className='col-span-2'>
						<Label htmlFor='info'>Info</Label>
						<Textarea
							id='info'
							name='info'
							value={form.info || ''}
							onChange={handleChange}
							placeholder='Seller'
						/>
					</div>
					{error && <div className='text-red-500 col-span-2'>{error}</div>}
					<Button
						type='submit'
						disabled={loading}
						className='col-span-2'>
						{loading
							? isEdit
								? 'Updating...'
								: 'Creating...'
							: isEdit
							? 'Update'
							: 'Create'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
