
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, LocateIcon, PhoneIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table'; // Adjust the import path as needed
import { InfoCircledIcon } from '@radix-ui/react-icons';import { getAppointmentsByPatientId, getPatient } from '@/lib/fetching';

interface PageProps {
  params: { id: string };
}

const  page = async ({ params }: PageProps) => {

  const patient = await getPatient(params?.id)
  const appointments =await getAppointmentsByPatientId(params?.id);

const tabs = [
	{
		name: 'Details',
		value: 'details',
		content:
			'Welcome to the Home tab! Here, you can explore the latest updates, news, and highlights. Stay informed about what&apos;s happening and never miss out on important announcements.',
	},
	{
		name: 'Diagnose',
		value: 'diagnose',
		content:
			'This is your Profile tab. Manage your personal information, update your account details, and customize your settings to make your experience unique.',
	},
	{
		name: 'Photage',
		value: 'photage',
		content:
			'Messages: Check your recent messages, start new conversations, and stay connected with your friends and contacts. Manage your chat history and keep the communication flowing.',
	},
];



  return (
		<div className='flex flex-col m-5 gap-5 justify-start h-screen bg-accent-100 '>
			<Card className=' p-5  md:flex-row sm:gap-0 capitalize'>
				<CardHeader className='lg:w-1/3 '>
					<CardTitle className='text-2xl'>
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
				<div className=' w-full flex'>
					<div className='w-1/2'>
						<CardContent className='text-lg'>
							Gender: {patient?.gender || 'Unknown'}
						</CardContent>
						<CardContent className='text-lg'>
							Age: {patient?.age || 'Unknown'}
						</CardContent>
					</div>
					<div className='w-1/2'>
						<CardContent className='border border-accent p-1 rounded-tr-xl rounded-bl-xl'>
							<PlusCircleIcon className='text-secondary text-xs' />{' '}
							{patient?.createdAt.toDateString() || 'Unknown'}
						</CardContent>
					</div>
				</div>
				<CardFooter className='flex justify-end items-baseline'>
					<Link href={`/patientProfile/${patient?.id}/edit`}>
						<Edit2 className='text-primary hover:scale-110 transform duration-500 active:text-secondary' />
					</Link>
				</CardFooter>
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
}

export default page