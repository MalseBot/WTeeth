/** @format */

import InfoTable from '@/components/sections/InfoTable';

import { prisma } from '@/lib/prisma';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const page = async () => {
	const appointments = await prisma.appointment.findMany();
	const patientIds = appointments.map(a => a.patientId);
	const patients = await prisma.patient.findMany({
		where: { id: { in: patientIds } },
		select: { id: true, name: true }
	});
	const patientMap = new Map(patients.map(p => [p.id, p.name]));
		const t = await getTranslations('Appointment');


	return (
		<section className='w-full min-h-screen'>
			<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex justify-between items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				{t('title')}
			</h1>
			<InfoTable
				rows={appointments}
				patientMap={patientMap}
				type='appointment'
			/>
		</section>
	);
};

export default page;
