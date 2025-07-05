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
		<section className='w-full'>
			
			<InfoTable
				rows={appointments}
				patientMap={patientMap}
			/>
		</section>
	);
};

export default page;
