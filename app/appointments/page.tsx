/** @format */

import InfoTable from '@/components/sections/InfoTable';

import { prisma } from '@/lib/prisma';
import { StarFilledIcon } from '@radix-ui/react-icons';
import React from 'react';

const page = async () => {
	const appointments = await prisma.appointment.findMany();
	const patientIds = appointments.map(a => a.patientId);
	const patients = await prisma.patient.findMany({
		where: { id: { in: patientIds } },
		select: { id: true, name: true }
	});
	const patientMap = new Map(patients.map(p => [p.id, p.name]));
	

	return (
		<section className='m-10 flex-col flex gap-5'>
			<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				Appointments
			</h1>
			<InfoTable
				rows={appointments}
				patientMap={patientMap}
			/>
		</section>
	);
};

export default page;
