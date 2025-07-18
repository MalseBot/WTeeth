/** @format */

'use server';
import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import {
	Box,
	CheckCheckIcon,
	DollarSign,
	DoorClosedLocked,
	DropletIcon,
	Edit2,
	Hourglass,
	PlusIcon,
	Timer,
	VenusAndMars,
} from 'lucide-react';
import { StarFilledIcon, UpdateIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { getAppointment, getPatient } from '@/lib/fetching';
import Image from 'next/image';
import { ImageDocument } from '@/components/ImageDocument';
import UpdateAppointmentForm from '@/components/forms/UpdateAppointmentForm';

interface PageProps {
	params: Promise<{ id: string }>;
}

const page = async (props: PageProps) => {
	const params = await props.params;
	const appointId = params.id;
	const appointment = await getAppointment(appointId);
	const patient = appointment?.patientId
		? await getPatient(appointment.patientId)
		: null;

	if (!appointment || !patient) {
		return (
			<div className='w-full my-20 flex justify-center h-screen items-center'>
				Appointment or Patient not found
			</div>
		);
	}
	return (
		<div className='m-10 flex-col flex gap-5'>
			<h1 className='text-3xl uppercase text-primary font-bold border-b border-s w-fit flex items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				Appointment Details
			</h1>
			<Card className=' p-5 grid lg:grid-cols-[1fr_2fr_20px]  lg:grid-rows-1 h-min sm:gap-0 capitalize'>
				<CardHeader className=''>
					<CardTitle className='text-2xl text-primary uppercase'>
						<Link
							className='cursor-pointer'
							href={`/patientProfile/${patient?.id}`}>
							{patient?.name || 'Unknown Patient'}
						</Link>
					</CardTitle>
					<div className='grid grid-cols-2 grid-rows-2 '>
						<CardContent className='text-lg text-accent'>
							<VenusAndMars />
							{patient?.gender || 'no'}
						</CardContent>
						<CardContent className='text-lg text-accent'>
							<Timer />
							{patient?.age || 'Unknown'}
						</CardContent>
						<CardContent className='text-lg text-destructive'>
							<DropletIcon />
							{patient?.bloodType || 'Unknown'}
						</CardContent>
					</div>
				</CardHeader>
				<div className='w-full flex justify-around '>
					<div className='flex flex-col gap-2'>
						<CardContent className='text-lg text-accent'>
							<CheckCheckIcon />
							{appointment?.status || 'Unknown'}
						</CardContent>
						<CardContent className='text-lg text-accent'>
							<DollarSign />
							{appointment?.payment || 'Unknown'}
						</CardContent>
					</div>
					<div className=' flex gap-2 flex-col'>
						<CardContent className='border border-accent p-1 rounded-tr-xl text-secondary-foreground rounded-bl-xl'>
							<PlusIcon
								width={20}
								height={20}
								className=' hover:rotate-180 transform duration-500'
							/>
							{(appointment?.createdAt &&
								new Date(appointment.createdAt).toLocaleString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
								})) ||
								'Unknown'}
						</CardContent>
						<CardContent className='border border-accent p-1 rounded-tr-xl text-secondary-foreground rounded-bl-xl'>
							<Hourglass
								width={20}
								height={20}
								className=' hover:rotate-180 transform duration-500'
							/>
							{(appointment?.date &&
								new Date(appointment.date).toLocaleString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
								})) ||
								'Unknown'}
						</CardContent>
						<CardContent className='border border-accent p-1 rounded-tr-xl text-secondary-foreground rounded-bl-xl'>
							<UpdateIcon
								width={20}
								height={20}
								className=' hover:rotate-180 transform duration-500'
							/>
							{(appointment?.updatedAt &&
								new Date(appointment.updatedAt).toLocaleString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
								})) ||
								'Unknown'}{' '}
						</CardContent>
					</div>
				</div>
				<CardFooter className=' items-start '>
					<UpdateAppointmentForm appointment={appointment} />
				</CardFooter>
			</Card>
			<div className='p-5 rounded-tr-3xl rounded-bl-3xl shadow'>
				<h2 className='text-lg mb-1 font-semibold'>Diagnose</h2>
				<h3 className='text-md font-semibold border-b flex my-2 w-fit'>
					<DoorClosedLocked
						width={20}
						height={20}
					/>
					{appointment?.operation}
				</h3>
				<p className='text-accent'>
					{appointment?.prescription || 'Waiting to be diagnosed'}
				</p>
				<h3 className='text-md font-semibold border-b flex my-2 w-fit'>
					<Box
						width={20}
						height={20}
					/>
					Materials used
				</h3>
				<div className='text-accent'>
					{appointment?.materials.map((e) => (
						<p key={e?.id || e.length}>
							{e?.name}: {e?.quantity} {e?.type}
						</p>
					)) || 'Waiting to be diagnosed'}
				</div>
			</div>
			<div className='p-5 rounded-tr-3xl rounded-bl-3xl shadow'>
				<h2 className='text-lg border-b mb-1 font-semibold'>Medicine</h2>
				<p className='text-accent'>
					{appointment?.medicine || 'Waiting to be diagnosed'}
				</p>
			</div>
			<div className='p-5 rounded-tr-3xl rounded-bl-3xl shadow grid lg:grid-cols-3 grid-cols-2'>
				<h2 className='text-lg border-b mb-1 font-semibold'>Media</h2>
				{appointment?.images.map((e) => (
					<Image
						key={e?.id}
						src={e?.url}
						alt='diagnose image'
					/>
				))}
				<ImageDocument />
			</div>
		</div>
	);
};

export default page;
