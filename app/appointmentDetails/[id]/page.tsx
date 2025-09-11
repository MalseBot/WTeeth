/** @format */

'use server';
import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '@/components/ui/card';
import {
	Box,
	CheckCheckIcon,
	DollarSign,
	DoorClosedLocked,
	DropletIcon,
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
import { getTranslations } from 'next-intl/server';

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

	const t = await getTranslations('AppointmentDetails');

	if (!appointment || !patient) {
		return (
			<div className='w-full my-20 flex justify-center h-screen items-center'>
				{t('err404')}
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
				{t('title')}
			</h1>
			<Card className='p-5 grid grid-cols-1  sm:gap-0 capitalize'>
				<CardHeader className='flex justify-between gap-0 p-0'>
					<CardTitle className='text-2xl text-primary uppercase'>
						<Link
							className='cursor-pointer'
							href={`/patientProfile/${patient?.id}`}>
							{patient?.name || t('unknown')}
						</Link>
					</CardTitle>
					<UpdateAppointmentForm appointment={appointment} />
				</CardHeader>
				<div className='grid grid-cols-2 col-span-2 lg:col-span-1 gap-3 h-fit grid-rows-2 '>
					<CardContent className='text-lg text-accent'>
						<VenusAndMars />
						{patient?.gender || t('unknown')}
					</CardContent>
					<CardContent className='text-lg text-accent'>
						<Timer />
						{patient?.age || t('unknown')}
					</CardContent>
					<CardContent className='text-lg text-destructive'>
						<DropletIcon />
						{patient?.bloodType || t('unknown')}
					</CardContent>
					<CardContent className='text-lg text-accent'>
						<DollarSign />
						{appointment?.payment || t('unknown')}
					</CardContent>
				</div>
				<div className='grid grid-cols-2 col-span-2 lg:col-span-1 gap-3 h-fit grid-rows-2 '>
					<CardContent className='text-lg text-accent'>
						<CheckCheckIcon />
						{appointment?.status || t('unknown')}
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
							t('unknown')}
					</CardContent>
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
							t('unknown')}
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
							t('unknown')}
					</CardContent>
				</div>
			</Card>
			<div className='p-5 rounded-tr-3xl rounded-bl-3xl shadow'>
				<h2 className='text-lg mb-1 font-semibold'>{t('Diagnose')}</h2>
				<h3 className='text-md font-semibold border-b flex my-2 w-fit'>
					<DoorClosedLocked
						width={20}
						height={20}
					/>
					{appointment?.operation}
				</h3>
				<p className='text-accent'>
					{appointment?.prescription || t('Waiting')}
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
					)) || t('Waiting')}
				</div>
			</div>
			<div className='p-5 rounded-tr-3xl rounded-bl-3xl shadow'>
				<h2 className='text-lg border-b mb-1 font-semibold'>{t('Medicine')}</h2>
				<p className='text-accent'>
					{appointment?.medicine || t('Waiting')}
				</p>
			</div>
			<div className='p-5 rounded-tr-3xl rounded-bl-3xl shadow grid lg:grid-cols-3 grid-cols-2'>
				<h2 className='text-lg border-b mb-1 font-semibold'>{t('Media')}</h2>
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
