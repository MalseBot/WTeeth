/** @format */

import InfoTable from '@/components/sections/InfoTable';
import { prisma } from '@/lib/prisma';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const page = async () => {
		const t = await getTranslations('Patients');

	const patients = await prisma.patient.findMany();
	return (
		<section className='m-10 flex-col flex gap-5'>
			<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				{t('title')}
			</h1>
			<InfoTable rows={patients} type='patient' />
		</section>
	);
};

export default page;
