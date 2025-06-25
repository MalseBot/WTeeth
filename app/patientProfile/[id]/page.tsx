/** @format */

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Edit2,
	LocateIcon,
	PhoneIcon,
	Timer,
	VenusAndMars,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'; // Adjust the import path as needed
import { InfoCircledIcon, PlusIcon, UpdateIcon } from '@radix-ui/react-icons';
import { getAppointmentsByPatientId, getPatient } from '@/lib/fetching';

interface PageProps {
	params: { id: string };
}

const page = async ({ params }: PageProps) => {
	const patient = await getPatient(params?.id);
	const appointments = await getAppointmentsByPatientId(params?.id);

	return (
		<div className='flex flex-col m-5 gap-5 justify-start h-screen bg-accent-100 '>
			<Card className=' p-5 grid lg:grid-cols-[1fr_2fr_20px]  lg:grid-rows-2 h-min sm:gap-0 capitalize'>
				<CardHeader className=' '>
					<CardTitle className='text-2xl text-primary uppercase'>
						{patient?.name || 'Unknown Patient'}
					</CardTitle>
					<CardContent className='text-sm'>
						<PhoneIcon className='text-secondary text-xs' /> Phone number:{' '}
						{patient?.phone || 'Unknown'}
					</CardContent>
					<CardContent className='text-sm'>
						<LocateIcon className='text-secondary text-xs' /> Address:{' '}
						{patient?.address || 'Unknown'}
					</CardContent>
				</CardHeader>
				<div className='w-full flex'>
					<div className='w-1/2'>
						<CardContent className='text-lg'>
							<VenusAndMars />
							Gender: {patient?.gender || 'Unknown'}
						</CardContent>
						<CardContent className='text-lg'>
							<Timer />
							Age: {patient?.age || 'Unknown'}
						</CardContent>
					</div>
					<div className='w-1/2 flex gap-2 flex-col'>
						<CardContent className='border border-accent p-1 rounded-tr-xl rounded-bl-xl'>
							<PlusIcon
								width={20}
								height={20}
								className='text-secondary hover:rotate-180 transform duration-500'
							/>{' '}
							{patient?.createdAt.toDateString() || 'Unknown'}
						</CardContent>
						<CardContent className='border border-accent p-1 rounded-tr-xl rounded-bl-xl'>
							<UpdateIcon
								width={20}
								height={20}
								className='text-secondary hover:rotate-180 transform duration-500'
							/>{' '}
							{patient?.updatedAt.toDateString() || 'Unknown'}
						</CardContent>
					</div>
				</div>
				<CardFooter className=' items-start'>
					<Link href={`/patientProfile/${patient?.id}/edit`}>
						<Edit2 className='text-primary hover:scale-110 transform duration-500 active:text-secondary' />
					</Link>
				</CardFooter>
				<div className='w-full col-span-full mx-2'>
					<h2>Notes</h2>
					<p>{patient?.note || 'Nothing to note yet'}</p>
				</div>
			</Card>
			<section className='md:mx-10 overflow-x-scroll mx-1 '>
				<Table className=' rounded-bl-3xl rounded-tr-3xl p-1 md:p-5 overflow-x-scroll'>
					<TableHeader>
						<TableRow className='rounded-tr-3xl'>
							<TableHead className='w-[100px]'>Date</TableHead>
							<TableHead className='w-[100px]'>Status</TableHead>
							<TableHead className='w-[100px]'>Fee Paid</TableHead>
							<TableHead>Diagnose</TableHead>
							<TableHead className='w-[100px]'>Operationed</TableHead>
							<TableHead className='w-[50px] rounded-tr-3xl'>Info</TableHead>
						</TableRow>
					</TableHeader>
					{appointments.length !== 0 ? (
						appointments.map((e) => (
							<TableBody key={e.id}>
								<TableRow>
									<TableCell className='font-medium'>
										{e.date.toDateString()}
									</TableCell>
									<TableCell>{e.status}</TableCell>
									<TableCell>{e.payment}</TableCell>
									<TableCell>{e.prescription}</TableCell>
									<TableCell className='text-right'>{e.operation}</TableCell>
									<TableCell>
										<Link href={`/appointmentDetails/${e.id}`}>
											<InfoCircledIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />
										</Link>
									</TableCell>
								</TableRow>
							</TableBody>
						))
					) : (
						<TableCell className=' font-bold text-2xl capitalize text-center'>
							No appointments made Yet ...
						</TableCell>
					)}
				</Table>{' '}
			</section>
		</div>
	);
};

export default page;
