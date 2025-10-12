/** @format */
'use client';
import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import Link from 'next/link';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import ItemForm from '../forms/ItemForm';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import BudgetForm from '../forms/BudgetForm';
import DeleteBudget from '../DeleteBudget';
import { useTranslations } from 'next-intl';

interface InfoTableRow {
	id: string;
	// Common fields
	name?: string;
	// Appointment fields
	date?: Date;
	patientId?: string;
	status?: string;
	age?: number | string;
	payment?: string | number;
	gender?: string;
	prescription?: string;
	address?: string;
	operation?: string;
	createdAt?: Date;
	// Storage fields
	type?: string;
	quantity?: number;
	currentAmount?: number;
	shortageLimit?: number;
	buyDate?: Date;
	price?: number;
	seller?: string;
	// Budget fields
	info?: string;
	updatedAt?: Date;
}

interface InfoTableProps {
	rows: InfoTableRow[];
	patientMap?: Map<string, string>;
	type: 'patient' | 'appointment' | 'storage' | 'budget';
}

type SortKey = keyof InfoTableRow;

const HEADERS: Record<
	InfoTableProps['type'],
	{ key: SortKey; label: string }[]
> = {
	patient: [
		{ key: 'name', label: 'name' },
		{ key: 'age', label: 'age' },
		{ key: 'gender', label: 'gender' },
		{ key: 'address', label: 'address' },
		{ key: 'createdAt', label: 'createdAt' },
	],
	appointment: [
		{ key: 'date', label: 'date' },
		{ key: 'patientId', label: 'name' },
		{ key: 'status', label: 'status' },
		{ key: 'payment', label: 'payment' },
		{ key: 'prescription', label: 'diagnose' },
		{ key: 'operation', label: 'operation' },
		{ key: 'createdAt', label: 'createdAt' },
	],
	storage: [
		{ key: 'name', label: 'name' },
		{ key: 'type', label: 'type' },
		{ key: 'quantity', label: 'quantity' },
		{ key: 'currentAmount', label: 'currentAmount' },
		{ key: 'buyDate', label: 'buyDate' },
		{ key: 'price', label: 'price' },
		{ key: 'seller', label: 'seller' },
	],
	budget: [
		{ key: 'name', label: 'name' },
		{ key: 'createdAt', label: 'date' },
		{ key: 'price', label: 'price' },
		{ key: 'info', label: 'info' },
	],
};

export default function InfoTable({ rows, patientMap, type }: InfoTableProps) {
	const [sortKey, setSortKey] = useState<SortKey>(HEADERS[type][0].key);
	const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

	const sortedRows = [...rows].sort((a, b) => {
		const aValue = a[sortKey];
		const bValue = b[sortKey];
		if (aValue === undefined || bValue === undefined) return 0;
		if (aValue instanceof Date && bValue instanceof Date) {
			return sortDir === 'asc'
				? aValue.getTime() - bValue.getTime()
				: bValue.getTime() - aValue.getTime();
		}
		if (typeof aValue === 'number' && typeof bValue === 'number') {
			return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
		}
		return sortDir === 'asc'
			? String(aValue).localeCompare(String(bValue))
			: String(bValue).localeCompare(String(aValue));
	});

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
		} else {
			setSortKey(key);
			setSortDir('asc');
		}
	};
	const t = useTranslations('InfoTable');
	return (
		<div className='rounded-tr-3xl rounded-bl-3xl  h-fit overflow-x-auto max-w-screen shadow'>
			<Table className='rounded-bl-3xl max-w-full rounded-tr-3xl '>
				<TableHeader className='!rounded-tr-3xl '>
					<TableRow className='!rounded-tr-3xl from-secondary/60 to-accent/80 bg-linear-to-b'>
						{HEADERS[type].map((header) => (
							<TableHead
								key={header.key}
								className='cursor-pointer w-fit p-2 text-center'
								onClick={() => handleSort(header.key)}>
								{t(header.label)}
								{sortKey === header.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
							</TableHead>
						))}
						<TableHead className='w-[50px] p-2 '>{t('info')}</TableHead>
					</TableRow>
				</TableHeader>
				{sortedRows.length !== 0 ? (
					sortedRows.map((e) => (
						<TableBody
							key={e.id}
							className={
								typeof e.currentAmount === 'number' &&
								typeof e.shortageLimit === 'number' &&
								e.currentAmount <= e.shortageLimit
									? 'bg-red-100'
									: ''
							}>
							<TableRow>
								{HEADERS[type].map((header) => (
									<TableCell key={header.key}>
										<Popover>
											<PopoverTrigger
												className={`font-medium ${
													type === 'budget' && ' max-w-[150px] '
												} overflow-hidden text-ellipsis`}>
												{header.key === 'patientId' && patientMap
													? e.patientId
														? patientMap.get(e.patientId) ?? 'Unknown'
														: ''
													: header.key === 'date' ||
													  header.key === 'createdAt' ||
													  header.key === 'buyDate' ||
													  header.key === 'updatedAt'
													? e[header.key]
														? new Date(e[header.key] as Date).toLocaleString(
																'en-US',
																{
																	weekday: 'short',
																	month: 'short',
																	day: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																	hour12: true,
																}
														  )
														: ''
													: e[header.key]}
											</PopoverTrigger>
											<PopoverContent>
												{header.key === 'patientId' && patientMap
													? e.patientId
														? patientMap.get(e.patientId) ?? 'Unknown'
														: ''
													: header.key === 'date' ||
													  header.key === 'createdAt' ||
													  header.key === 'buyDate' ||
													  header.key === 'updatedAt'
													? e[header.key]
														? new Date(e[header.key] as Date).toLocaleString(
																'en-US',
																{
																	weekday: 'short',
																	month: 'short',
																	day: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																	hour12: true,
																}
														  )
														: ''
													: e[header.key]}{' '}
											</PopoverContent>
										</Popover>
									</TableCell>
								))}
								<TableCell className='flex justify-center items-center'>
									{type === 'storage' ? (
										<ItemForm id={e.id} />
									) : type === 'budget' ? (
										e.name === 'Storage' ? (
											''
										) : (
											<>
												<BudgetForm id={e.id} />
												<DeleteBudget id={e.id} />
											</>
										)
									) : (
										<Link
											href={`/${
												type === 'patient'
													? 'patientProfile'
													: type === 'appointment' && 'appointmentDetails'
											}/${e.id}`}>
											<InfoCircledIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />
										</Link>
									)}
								</TableCell>
							</TableRow>
						</TableBody>
					))
				) : (
					<TableCell className='font-bold text-2xl capitalize text-center'>
						{t('noInfo')}
					</TableCell>
				)}
			</Table>
		</div>
	);
}
