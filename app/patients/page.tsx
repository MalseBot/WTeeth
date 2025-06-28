import InfoTable from '@/components/sections/InfoTable';
import { prisma } from '@/lib/prisma';
import React from 'react'

const page =async () => {
    const patients = await prisma.patient.findMany()
  return (
		<section >
			<InfoTable rows={patients}/>
		</section>
	);
}

export default page