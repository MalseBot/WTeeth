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
	Edit2,
	LocateIcon,
	PhoneIcon,
	Timer,
	VenusAndMars,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import {  PlusIcon, StarFilledIcon, UpdateIcon } from '@radix-ui/react-icons';
import { getAppointmentsByPatientId, getPatient } from '@/lib/fetching';
import InfoTable from '@/components/sections/InfoTable';
import PatientForm from '@/components/PatientForm';

interface PageProps {
	params: Promise<{ id: string }>;
}

const page = async (props: PageProps) => {
    const params = await props.params;
    const patient = await getPatient(params?.id);
    const appointments = await getAppointmentsByPatientId(params?.id);
	if (!patient) {
		return <div className='w-full my-20 flex justify-center h-screen items-center'>Patient not found</div>;
	}
    return (
		<div className='flex flex-col m-5 gap-5 justify-start h-screen bg-accent-100 '>
				  <h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex items-center'><StarFilledIcon width={25} height={25} className='mx-1 text-yellow-300 '/>Patient Profile</h1>
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
						<CardContent className='text-lg text-destructive'>
													<DropletIcon />
													{patient?.bloodType || 'Unknown'}
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
								<PatientForm patient={patient} />
				</CardFooter>
				<div className='w-full col-span-full mx-2'>
					<h2>Notes</h2>
					<p>{patient?.note || 'Nothing to note yet'}</p>
				</div>
			</Card>
			<section >
				<InfoTable rows={appointments}/>
			</section>
		</div>
	);
};

export default page;
