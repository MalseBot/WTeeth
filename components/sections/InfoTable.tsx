import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Link from 'next/link';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface InfoTableRow {
    id: string | number;
    name?: string;
    date?: Date;
    patientId?:string;
    status?: string;
    age?: number | string;
    payment?: string | number;
    gender?: string;
    prescription?: string;
    address?: string;
    operation?: string;
    createdAt?:  Date;
}

interface InfoTableProps {
	rows: InfoTableRow[];
	patientMap?: Map<string,string>; // Adjust type as needed
}

export default function InfoTable({rows,patientMap}:InfoTableProps) {
    const isAppointment = !!rows[0]?.patientId;

    return (
			<div className='m-10 rounded-tr-3xl rounded-bl-3xl overflow-x-auto shadow'>
				<Table className=' rounded-bl-3xl rounded-tr-3xl'>
					<TableHeader className='!rounded-tr-3xl'>
						<TableRow className='!rounded-tr-3xl'>
							<TableHead className='w-[100px]'>
								{(rows[0]?.name && 'Name') || (rows[0]?.date && 'Date')}
							</TableHead>
							{isAppointment && patientMap && (
								<TableHead>Patient name</TableHead>
							)}
							<TableHead className='w-[100px]'>
								{(rows[0]?.status && 'Status') || (rows[0]?.age && 'Age')}
							</TableHead>
							<TableHead className='w-[100px]'>
								{(rows[0]?.payment && 'Fee Paid') ||
									(rows[0]?.gender && 'Gender')}
							</TableHead>
							<TableHead>
								{(rows[0]?.prescription && 'Diagnose') ||
									(rows[0]?.address && 'Address')}
							</TableHead>
							<TableHead className='w-[100px]'>
								{(rows[0]?.operation && 'Operationed') ||
									(rows[0]?.createdAt && 'Created At')}
							</TableHead>
							<TableHead className='w-[50px] !rounded-tr-3xl'>Info</TableHead>
						</TableRow>
					</TableHeader>
					{rows.length !== 0 ? (
						rows.map((e) => (
							<TableBody key={e.id}>
								<TableRow>
									<TableCell className='font-medium'>
										{e.date?.toDateString() || e.name}
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
										{e.operation || e.createdAt?.toDateString()}
									</TableCell>
									<TableCell>
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
