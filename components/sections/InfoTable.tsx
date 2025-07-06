'use client'
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

interface InfoTableRow {
	id: string | number;
	name?: string;
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
}

interface InfoTableProps {
	rows: InfoTableRow[];
	patientMap?: Map<string, string>;
}

type SortKey = keyof InfoTableRow;

export default function InfoTable({ rows, patientMap }: InfoTableProps) {
	const [sortKey, setSortKey] = useState<SortKey>('date');
	const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
	const isAppointment = !!rows[0]?.patientId;

	// Sorting function
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

	// Click handler for sorting
	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
		} else {
			setSortKey(key);
			setSortDir('asc');
		}
	};

	return (
		<div className='m-10 rounded-tr-3xl rounded-bl-3xl overflow-x-auto shadow'>
			<Table className=' rounded-bl-3xl rounded-tr-3xl'>
				<TableHeader className='!rounded-tr-3xl'>
					<TableRow className='!rounded-tr-3xl'>
						<TableHead
							className='w-[100px] cursor-pointer'
							onClick={() => handleSort(rows[0]?.date ? 'date' : 'name')}>
							{(rows[0]?.name && 'Name') || (rows[0]?.date && 'Date')}
							{sortKey === (rows[0]?.date ? 'date' : 'name') &&
								(sortDir === 'asc' ? ' ▲' : ' ▼')}
						</TableHead>
						{isAppointment && patientMap && (
							<TableHead
								className='cursor-pointer'
								onClick={() => handleSort('patientId')}>
								Patient name
								{sortKey === 'patientId' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
							</TableHead>
						)}
						<TableHead
							className='w-[100px] cursor-pointer'
							onClick={() => handleSort(rows[0]?.status ? 'status' : 'age')}>
							{(rows[0]?.status && 'Status') || (rows[0]?.age && 'Age')}
							{sortKey === (rows[0]?.status ? 'status' : 'age') &&
								(sortDir === 'asc' ? ' ▲' : ' ▼')}
						</TableHead>
						<TableHead
							className='w-[100px] cursor-pointer'
							onClick={() =>
								handleSort(rows[0]?.payment ? 'payment' : 'gender')
							}>
							{(rows[0]?.payment && 'Fee Paid') ||
								(rows[0]?.gender && 'Gender')}
							{sortKey === (rows[0]?.payment ? 'payment' : 'gender') &&
								(sortDir === 'asc' ? ' ▲' : ' ▼')}
						</TableHead>
						<TableHead
							className='cursor-pointer'
							onClick={() =>
								handleSort(rows[0]?.prescription ? 'prescription' : 'address')
							}>
							{(rows[0]?.prescription && 'Diagnose') ||
								(rows[0]?.address && 'Address')}
							{sortKey ===
								(rows[0]?.prescription ? 'prescription' : 'address') &&
								(sortDir === 'asc' ? ' ▲' : ' ▼')}
						</TableHead>
						<TableHead
							className='w-[100px] cursor-pointer'
							onClick={() =>
								handleSort(rows[0]?.operation ? 'operation' : 'createdAt')
							}>
							{(rows[0]?.operation && 'Operationed') ||
								(rows[0]?.createdAt && 'Created At')}
							{sortKey === (rows[0]?.operation ? 'operation' : 'createdAt') &&
								(sortDir === 'asc' ? ' ▲' : ' ▼')}
						</TableHead>
						<TableHead className='w-[50px] !rounded-tr-3xl'>Info</TableHead>
					</TableRow>
				</TableHeader>
				{sortedRows.length !== 0 ? (
					sortedRows.map((e) => (
						<TableBody key={e.id}>
							<TableRow>
								<TableCell className='font-medium'>
									{e.date
										? new Date(e.date).toLocaleString('en-US', {
												weekday: 'short',
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
												hour12: true,
										  })
										: e.name}
								</TableCell>
								{isAppointment && patientMap && (
									<TableCell>
										{e.patientId ? patientMap.get(e.patientId) : ''}
									</TableCell>
								)}
								<TableCell>{e.status || e.age}</TableCell>
								<TableCell>{e.payment || e.gender}</TableCell>
								<TableCell>{e.prescription || e.address}</TableCell>
								<TableCell className='text-right'>
									{e.operation ||
										(e.createdAt
											? new Date(e.createdAt).toLocaleString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													hour12: true,
											  })
											: '')}
								</TableCell>
								<TableCell className='flex justify-center items-center'>
									<Link
										href={`/${
											e.name ? 'patientProfile' : 'appointmentDetails'
										}/${e.id}`}>
										<InfoCircledIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />
									</Link>
								</TableCell>
							</TableRow>
						</TableBody>
					))
				) : (
					<TableCell className=' font-bold text-2xl capitalize text-center'>
						No Information made Yet ...
					</TableCell>
				)}
			</Table>
		</div>
	);
}
