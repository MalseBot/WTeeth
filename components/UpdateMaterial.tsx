/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

// You need to implement these functions in your fetching file
import {
	getMaterialsByAppointment,
	getStorageNamesAndTypes,
	updateMaterial,
	addMaterial,
} from '@/lib/fetching';
import { useTranslations } from 'next-intl';

export default function UpdateMaterial({ id }: { id: string }) {
	const [materials, setMaterials] = useState<any[]>([]);
	const [storageOptions, setStorageOptions] = useState<
		{ name: string; type: string }[]
	>([]);
	const t = useTranslations('UpdateMaterial');
	const [newMaterial, setNewMaterial] = useState({
		name: '',
		type: '',
		quantity: 0,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getMaterialsByAppointment(id).then(setMaterials);
		getStorageNamesAndTypes().then(setStorageOptions);
	}, [id]);

	// Mirror type when selecting name
	const handleNewMaterialName = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selected = storageOptions.find((opt) => opt.name === e.target.value);
		setNewMaterial((nm) => ({
			...nm,
			name: e.target.value,
			type: selected ? selected.type : '',
		}));
	};



	const handleNewMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewMaterial((nm) => ({
			...nm,
			[name]: name === 'quantity' ? Number(value) : value,
		}));
	};

	const handleAddMaterial = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await addMaterial({ ...newMaterial, appointmentId: id });
			setNewMaterial({ name: '', type: '', quantity: 0 });
			getMaterialsByAppointment(id).then(setMaterials);
		} catch (err) {
			console.error('Failed to add material:', err);
		}
		setLoading(false);
	};

	const handleMaterialChange = (idx: number, field: string, value: any) => {
		setMaterials((mats) =>
			mats.map((mat, i) =>
				i === idx
					? { ...mat, [field]: field === 'quantity' ? Number(value) : value }
					: mat
			)
		);
	};

	const handleUpdateMaterial = async (idx: number) => {
		setLoading(true);
		await updateMaterial(materials[idx]);
		setLoading(false);
	};

	return (
		<div className='col-span-2 border w-2/5 rounded p-3 bg-gray-50 mt-4'>
			<h4 className='font-bold mb-2'>Materials</h4>
			{materials.map((mat, idx) => (
				<div
					key={mat.id}
					className='grid grid-cols-3 gap-2 mb-2 items-center'>
					<div>
						<Label>Name</Label>
						<Input
							value={t(mat.name)}
							disabled
						/>
					</div>
					<div>
						<Label>Type</Label>
						<Input
							value={mat.type}
							disabled
						/>
					</div>
					<div>
						<Label>Quantity</Label>
						<Input
							type='number'
							value={mat.quantity}
							onChange={(e) =>
								handleMaterialChange(idx, 'quantity', e.target.value)
							}
						/>
					</div>
					<Button
						type='button'
						size='sm'
						className='col-span-3 mt-1'
						onClick={() => handleUpdateMaterial(idx)}
						disabled={loading}>
						{t('update')}
					</Button>
				</div>
			))}

			<form
				onSubmit={handleAddMaterial}
				className='grid grid-cols-3 gap-2 mt-4 items-center'>
				<div>
					<Label htmlFor='new-name'>{t('name')}</Label>
					<select
						id='new-name'
						name='name'
						value={newMaterial.name}
						onChange={handleNewMaterialName}
						className='border rounded px-2 py-1 w-full'
						required>
						<option value=''>{t('selectName')}</option>
						{storageOptions.map((opt) => (
							<option
								key={opt.name}
								value={opt.name}>
								{t(opt.name)}
							</option>
						))}
					</select>
				</div>
				<div>
					<Label htmlFor='new-type'>{t('type')}</Label>
					<Input
						id='new-type'
						name='type'
						value={newMaterial.type}
						disabled
					/>
				</div>
				<div>
					<Label htmlFor='new-quantity'>{}t('quantity')</Label>
					<Input
						id='new-quantity'
						name='quantity'
						type='number'
						value={newMaterial.quantity}
						onChange={handleNewMaterialChange}
						required
					/>
				</div>
				<Button
					type='submit'
					size='sm'
					className='col-span-3 mt-1'
					disabled={loading || !newMaterial.name}>
					{t('addMaterial')}
				</Button>
			</form>
		</div>
	);
}
