/** @format */

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropletIcon,
	LocateIcon,
	PhoneIcon,
	Timer,
	VenusAndMars,
} from 'lucide-react';
import React from 'react';

import { PlusIcon, StarFilledIcon, UpdateIcon } from '@radix-ui/react-icons';
import { getAppointmentsByPatientId, getPatient } from '@/lib/fetching';
import InfoTable from '@/components/sections/InfoTable';
import PatientForm from '@/components/forms/PatientForm';
import { getTranslations } from 'next-intl/server';

interface PageProps {
	params: Promise<{ id: string }>;
}

const page = async (props: PageProps) => {
		const t = await getTranslations('PatientProfile');

	const params = await props.params;
	const patient = await getPatient(params?.id);
	const appointments = await getAppointmentsByPatientId(params?.id);
	const patientMap = new Map(patient ? [[patient.id, patient.name]] : []);

	if (!patient) {
		return (
			<div className='w-full my-20 flex justify-center h-screen items-center'>
				{t('notFound')}
			</div>
		);
	}
	return (
		<div className='flex flex-col m-5 gap-5 justify-start h-screen bg-accent-100 '>
			<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				{t('title')}
			</h1>
			<Card className=' p-5 grid lg:grid-cols-[1fr_2fr_20px] justify-around items-start lg:grid-rows-2 h-min sm:gap-0 capitalize'>
				<CardHeader className=' '>
					<CardTitle className='text-2xl text-primary uppercase'>
						{patient?.name || t('unknown')}
					</CardTitle>
					<CardContent className='text-sm'>
						<PhoneIcon className='text-secondary text-xs' />{t('phone')}:{' '}
						{patient?.phone || t('unknown')}
					</CardContent>
					<CardContent className='text-sm'>
						<LocateIcon className='text-secondary text-xs' /> {t('address')}:{' '}
						{patient?.address || t('unknown')}
					</CardContent>
				</CardHeader>
				<div className='w-full flex'>
					<div className='w-1/2'>
						<CardContent className='text-lg'>
							<VenusAndMars />
							Gender: {patient?.gender || t('unknown')}
						</CardContent>
						<CardContent className='text-lg'>
							<Timer />
							Age: {patient?.age || t('unknown')}
						</CardContent>
						<CardContent className='text-lg text-destructive'>
							<DropletIcon />
							{patient?.bloodType || t('unknown')}
						</CardContent>
					</div>
					<div className='w-1/2 flex gap-2 flex-col'>
						<CardContent className='border border-accent p-1 rounded-tr-xl rounded-bl-xl'>
							<PlusIcon
								width={20}
								height={20}
								className='text-secondary hover:rotate-180 transform duration-500'
							/>{' '}
							{patient?.createdAt.toDateString() || t('unknown')}
						</CardContent>
						<CardContent className='border border-accent p-1 rounded-tr-xl rounded-bl-xl'>
							<UpdateIcon
								width={20}
								height={20}
								className='text-secondary hover:rotate-180 transform duration-500'
							/>{' '}
							{patient?.updatedAt.toDateString() || t('unknown')}
						</CardContent>
					</div>
				</div>
				<CardFooter className=' items-start'>
					<PatientForm patient={patient} />
				</CardFooter>
				<div className='w-full min-h-40 col-span-full m-2 rounded-tr-2xl rounded-bl-2xl shadow p-3'>
					<h2 className=' font-semibold border-b'>{t('Notes')}</h2>
					<p>{patient?.note || t('noNote')}</p>
				</div>
			</Card>
			<section>
				<InfoTable
					type='appointment'
					rows={appointments}
					patientMap={patientMap}
				/>
			</section>
		</div>
	);
};

export default page;
